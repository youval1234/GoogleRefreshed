const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const meta = {location:{hostname:'localhost', protocol:'http:', href:'http://localhost/'}, URL};
vm.createContext(meta);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'extension/shared.js'), 'utf8'), meta);
const greeting = meta.GoogleRefreshed.greeting;
const checks = [];
async function check(name, fn) {await fn(); checks.push(name); console.log('PASS ' + name);}
let context;
(async () => {
  await check('Local greeting covers all 24 hours, including both sides of every boundary', () => {
    for (let hour = 0; hour < 24; hour++) {
      const result = greeting({getHours:() => hour});
      const expected = hour < 5 ? 'Still up' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Enjoy your night';
      assert.equal(result.lead + result.phrase, expected, 'local hour ' + hour);
      assert.equal(result.name, '');
    }
    assert.equal(greeting({getHours:() => 1}).phrase, 'up');
    assert.equal(greeting({getHours:() => 13}).phrase, 'afternoon');
  });
  await check('Names keep Unicode as plain text without surrounding whitespace or invisible direction controls', () => {
    const noon = {getHours:() => 12};
    assert.equal(greeting(noon, '  Alex  ').name, 'Alex');
    assert.equal(greeting(noon, '\u202eאלכס\u202c').name, 'אלכס');
    assert.equal(greeting(noon, '<img onerror=alert(1)>').name, '<img onerror=alert(1)>');
    assert.equal(greeting(noon, '   ').name, '');
    assert.equal(greeting(noon, null).name, '');
    assert.equal(greeting(noon, 'A'.repeat(40)).name.length, 32);
  });
  const ext = path.join(__dirname, 'extension');
  context = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(__dirname, '.test-profile-greeting-')), {
    executablePath: process.env.BRAVE_PATH || 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
    headless:true, viewport:{width:1440, height:1000}, timezoneId:'Asia/Jerusalem',
    args:[`--disable-extensions-except=${ext}`, `--load-extension=${ext}`]
  });
  const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  const setName = async name => worker.evaluate(async name => {
    const previous = (await chrome.storage.local.get('stillSettings')).stillSettings || {};
    await chrome.storage.local.set({stillSettings:{...previous, name, animations:false, autoLocation:false, localNews:false, photoNewsMigrated:true}});
  }, name);
  await setName('Alex');
  await context.route('https://www.google.com/**', route => route.fulfill({contentType:'text/html', body:'<!doctype html><html lang="he" dir="rtl"><head><title>RTL Google fixture</title></head><body>Google</body></html>'}));
  const page = await context.newPage();
  const open = async () => {await page.goto('https://www.google.com/'); await page.waitForFunction(() => document.querySelector('#still-home')?.shadowRoot.querySelector('#greeting')?.textContent);};
  let localLabel;
  await check('Installed extension renders the same local-time greeting as the browser clock', async () => {
    await open();
    const hour = await page.evaluate(() => new Date().getHours());
    const result = greeting({getHours:() => hour});
    localLabel = result.lead + result.phrase;
    assert.equal(await page.locator('#greeting').innerText(), localLabel + ', Alex');
  });
  await check('RTL Google pages keep English order, isolate RTL names, and show no stray punctuation', async () => {
    await setName('אלכס'); await open();
    const title = page.locator('#greeting');
    assert.equal(await title.innerText(), localLabel + ', אלכס');
    assert.equal(await title.getAttribute('dir'), 'ltr');
    assert.equal(await title.evaluate(e => getComputedStyle(e).direction), 'ltr');
    assert.equal(await title.locator('bdi').getAttribute('dir'), 'auto');
    await setName(''); await open();
    assert.equal(await title.innerText(), localLabel);
    assert.equal(await title.locator('bdi').count(), 0);
  });
  await check('Saved names cannot create HTML in the greeting', async () => {
    await setName('<img onerror=alert(1)>'); await open();
    assert.equal(await page.locator('#greeting bdi').innerText(), '<img onerror=alert(1)>');
    assert.equal(await page.locator('#greeting img, #greeting script').count(), 0);
  });
  console.log(`${checks.length} greeting checks passed.`);
})().catch(error => {console.error(error); process.exitCode = 1;}).finally(async () => {if (context) await context.close();});
