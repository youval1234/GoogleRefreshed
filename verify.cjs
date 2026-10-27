const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('assert/strict');
const path = require('path');
const fs = require('fs');
const ext = path.resolve(__dirname,'extension');
const nativeHTML = '<!doctype html><html><head><title>Google</title></head><body><main id="fixture-native"><input aria-label="Native Google search"><button>Native tools</button></main></body></html>';
let context;
const checks=[];
async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
(async()=>{
 context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(__dirname,'.test-profile-core-')),{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,viewport:{width:1440,height:1000},timezoneId:'UTC',args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const page=await context.newPage();
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await context.route('https://www.google.com/**',route=>route.fulfill({contentType:'text/html',body:nativeHTML}));
 await context.route('https://www.google.co.il/**',route=>route.fulfill({contentType:'text/html',body:nativeHTML}));
 const home=async()=>{await page.goto('https://www.google.com/');await page.locator('#still-home').waitFor();};
 const shadow=fn=>page.evaluate(fn);
 await check('Real extension injects on Google homepage',home);
 await check('Original homepage is inert while redesigned homepage is active',async()=>assert.equal(await page.locator('#fixture-native').evaluate(e=>e.inert),true));
 await check('Keyboard shortcut focuses search',async()=>{await page.keyboard.press('/');assert.equal(await shadow(()=>document.querySelector('#still-home').shadowRoot.activeElement.name),'q');});
 await check('Live theme, name, and widgets customize correctly',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();
   await page.getByRole('button',{name:'Midnight',exact:true}).click();
   await page.getByLabel('What should we call you?').fill('Alex');
   await page.getByLabel('Show clock',{exact:true}).uncheck();
   assert.equal(await shadow(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.theme),'midnight');
   assert.equal(await page.locator('.clock-widget').isVisible(),false);
   await page.getByRole('button',{name:'Close customization'}).click();
   assert.match(await page.locator('h1').innerText(),/Alex/);
 });
 await check('Extension storage survives reload',async()=>{
   await page.waitForTimeout(300);await home();
   assert.match(await page.locator('h1').innerText(),/Alex/);
   assert.equal(await shadow(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.theme),'midnight');
   assert.equal(await page.locator('.clock-widget').isVisible(),false);
 });
 await check('Focus notes save and persist',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByRole('combobox',{name:'Daily card',exact:true}).selectOption('note');await page.getByRole('button',{name:'Close customization'}).click();await page.frameLocator('#hardware-frame').getByLabel('Your focus note').fill('Finish one good thing.');await page.frameLocator('#hardware-frame').getByLabel('Your focus note').blur();await page.waitForTimeout(300);await home();
   assert.equal(await page.frameLocator('#hardware-frame').getByLabel('Your focus note').inputValue(),'Finish one good thing.');
 });
 await check('Shortcut add, safe URL normalization, edit and order',async()=>{
   await page.getByRole('button',{name:'Add shortcut',exact:true}).click();
   await page.getByLabel('Name',{exact:true}).fill('Example');await page.getByLabel('Website',{exact:true}).fill('example.com');
   await page.getByRole('button',{name:'Save shortcut'}).click();
   assert.equal(await page.getByRole('link',{name:/Example/}).getAttribute('href'),'https://example.com/');
   await page.getByRole('button',{name:'Edit shortcuts',exact:false}).click();
   await page.getByRole('button',{name:'Edit Example',exact:true}).click();
   await page.getByLabel('Name',{exact:true}).fill('Example edited');await page.getByRole('button',{name:'Save shortcut'}).click();
   await page.getByRole('button',{name:'Move Example edited up',exact:true}).click();
   const names=await page.locator('#shortcut-list strong').allTextContents();assert.equal(names.at(-2),'Example edited');
   await page.getByRole('button',{name:'Remove Example edited',exact:true}).click();
   await page.getByRole('button',{name:'Close shortcuts',exact:true}).click();
 });
 await check('Executable shortcut URLs are rejected',async()=>{
   await page.getByRole('button',{name:'Add shortcut',exact:true}).click();
   await page.getByLabel('Name',{exact:true}).fill('Unsafe');await page.getByLabel('Website',{exact:true}).fill('javascript:alert(1)');await page.getByRole('button',{name:'Save shortcut'}).click();
   assert.match(await page.getByRole('alert').innerText(),/http/);assert.equal(await page.getByRole('link',{name:'Unsafe',exact:true}).count(),0);
   await page.getByRole('button',{name:'Close shortcut editor'}).click();
 });
 await check('Classic Google restores native controls and can reopen GoogleRefreshed',async()=>{
   await page.getByRole('button',{name:'Classic Google',exact:false}).click();
   assert.equal(await page.locator('#fixture-native').evaluate(e=>e.inert),false);await page.getByLabel('Native Google search').fill('Native works');
   await page.getByRole('button',{name:/Back to GoogleRefreshed/}).click();assert.equal(await page.locator('#fixture-native').evaluate(e=>e.inert),true);
 });
 await check('Apps menu and Escape work',async()=>{
   await page.getByRole('button',{name:'Google apps',exact:true}).click();
   assert.equal(await page.locator('#google-apps a').count(),9);await page.keyboard.press('Escape');assert.equal(await page.locator('#apps-dialog').isVisible(),false);
 });
 await check('Settings export, import, and photo upload work',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();
   await page.locator('#photo-file').setInputFiles(path.resolve(ext,'icons/128.png'));
   await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').classList.contains('has-photo'));
   const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export settings'}).click();
   const exported=JSON.parse(fs.readFileSync(await (await download).path(),'utf8'));assert.equal(exported.format,'google-refreshed');assert.match(exported.settings.photo,/^data:image\/jpeg/);
   exported.settings.name='Imported';
   await page.locator('#import').setInputFiles({name:'settings.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
   await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('h1').textContent.includes('Imported'));
   await page.getByRole('button',{name:'Remove photo',exact:true}).click();
 });
 await check('Reset requires a second click and restores defaults',async()=>{
   await page.getByRole('button',{name:'Reset to defaults',exact:true}).click();assert.match(await page.locator('h1').innerText(),/Imported/);
   await page.getByRole('button',{name:'Click again to reset everything'}).click();assert.doesNotMatch(await page.locator('h1').innerText(),/Imported/);
   await page.getByRole('button',{name:'Close customization'}).click();
 });
 await check('Search modes preserve encoded text and Google destinations',async()=>{
   for(const [mode,expected] of [['All','https://www.google.com/search?q=hello+%D7%A9%D7%9C%D7%95%D7%9D+%26+tea'],['Images','https://www.google.com/search?q=hello+%D7%A9%D7%9C%D7%95%D7%9D+%26+tea&udm=2'],['Videos','https://www.google.com/search?q=hello+%D7%A9%D7%9C%D7%95%D7%9D+%26+tea&tbm=vid'],['Maps','https://www.google.com/maps/search/?api=1&query=hello+%D7%A9%D7%9C%D7%95%D7%9D+%26+tea']]){
     await home();await page.getByRole('button',{name:mode,exact:true}).click();await page.getByRole('searchbox',{name:'Search Google'}).fill('hello שלום & tea');
     await Promise.all([page.waitForURL(expected),page.getByRole('button',{name:'Search Google',exact:true}).click()]);assert.equal(page.url(),expected);
     await page.waitForTimeout(100);assert.equal(await page.locator('#still-home').count(),0);
   }
 });
 await check('Result URLs and other Google paths are untouched',async()=>{
   for(const url of ['https://www.google.com/?q=already+searching','https://www.google.com/search?q=test','https://www.google.com/imghp','https://www.google.com/sorry/index']){
     await page.goto(url);await page.waitForTimeout(100);assert.equal(await page.locator('#still-home').count(),0,url);
   }
 });
 await check('Native consent surface is left accessible',async()=>{
   await context.route('https://www.google.com/',route=>route.fulfill({contentType:'text/html',body:'<form action="https://consent.google.com/save"><button>Consent</button></form>'}));
   await page.goto('https://www.google.com/');await page.waitForTimeout(100);assert.equal(await page.locator('#still-home').count(),0);await context.unroute('https://www.google.com/');
 });
 await check('Responsive layouts have no horizontal overflow',async()=>{
   await home();
   for(const [width,height] of [[1440,1000],[1366,768],[390,844],[320,640]]){
     await page.setViewportSize({width,height});
     assert.equal(await shadow(()=>{const a=document.querySelector('#still-home').shadowRoot.querySelector('.app');return a.scrollWidth<=a.clientWidth+1;}),true,`${width}x${height}`);
     await page.getByRole('button',{name:'Customize',exact:true}).click();
     assert.equal(await shadow(()=>{const a=document.querySelector('#still-home').shadowRoot.querySelector('#settings');return a.scrollWidth<=a.clientWidth+1;}),true,`settings ${width}`);
     await page.getByRole('button',{name:'Close customization'}).click();
     if(width===390)await page.screenshot({path:path.resolve(__dirname,'mobile-preview.png')});
   }
 });
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.resolve(__dirname,'preview.png')});
 await page.getByRole('button',{name:'Customize',exact:true}).click();await page.screenshot({path:path.resolve(__dirname,'customize-preview.png')});
 await page.getByRole('button',{name:'Midnight',exact:true}).click();await page.getByRole('button',{name:'Close customization'}).click();await page.screenshot({path:path.resolve(__dirname,'midnight-preview.png')});
 assert.deepEqual(errors,[]);checks.push('No JavaScript errors');
 fs.writeFileSync(path.resolve(__dirname,'verification.json'),JSON.stringify({testedIn:'Brave, isolated headless profile with the actual extension loaded',googleResponses:'Controlled fixtures; search destination URLs verified',checks},null,2));
 console.log(`${checks.length} checks passed.`);await context.close();
})().catch(async error=>{console.error(error);if(context)await context.close();process.exitCode=1;});
