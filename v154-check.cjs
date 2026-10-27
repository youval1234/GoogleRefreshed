const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=__dirname,ext=path.join(root,'extension');
const nativeHTML='<!doctype html><html><head><title>Google fixture</title></head><body><main>Google</main></body></html>';
let checks=0;async function check(label,fn){await fn();console.log('PASS '+label);checks++;}
// Each scenario starts from a fresh profile so the first visit has no saved settings.
async function launch(colorScheme,extension=ext){
 const context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(root,'.test-profile-v154-')),{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,colorScheme,viewport:{width:1440,height:1000},timezoneId:'UTC',args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 // Synthetic hardware and no provider requests: location, weather and news stay offline.
 await worker.evaluate(()=>{const original=respondTo;globalThis.respondTo=async(m,s)=>{if(m.type==='hardware')return {ok:true,data:{cpu:{model:'Example CPU',cores:8,total:1000,idle:750},memory:{total:16*1024**3,available:8*1024**3}}};if(['newTabHome','newTabHomeStatus','browserSyncStatus','browserSyncEnable'].includes(m.type))return original(m,s);throw new Error('Offline fixture.');};});
 await context.route('https://www.google.com/**',r=>r.fulfill({contentType:'text/html',body:nativeHTML}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 return {context,worker,page,errors};
}
const mode=page=>page.evaluate(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.appearance);
const saved=worker=>worker.evaluate(async()=>(await chrome.storage.local.get('stillSettings')).stillSettings);
(async()=>{
 for(const scheme of ['dark','light']){
  const {context,worker,page,errors}=await launch(scheme);
  try{
   await check(`First visit follows a ${scheme} operating system`,async()=>{
    await page.goto('https://www.google.com/');await page.locator('#still-home').waitFor();
    await page.waitForFunction(expected=>document.querySelector('#still-home')?.shadowRoot.querySelector('.app')?.dataset.appearance===expected,scheme);
    assert.equal(await page.evaluate(()=>document.querySelector('#still-home').shadowRoot.querySelector('[data-appearance-choice=system]').getAttribute('aria-pressed')),'true');
    let stored;for(let i=0;i<30&&!stored;i++){stored=await saved(worker);if(!stored)await page.waitForTimeout(100);}
    assert.equal(stored?.appearance,'system');
   });
   await check(`First visit tracks a live switch away from ${scheme}`,async()=>{
    const other=scheme==='dark'?'light':'dark';await page.emulateMedia({colorScheme:other});
    await page.waitForFunction(expected=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.appearance===expected,other);
    await page.emulateMedia({colorScheme:scheme});
   });
   await check(`Results page follows a ${scheme} operating system`,async()=>{
    await page.goto('https://www.google.com/search?q=example');
    await page.waitForFunction(expected=>getComputedStyle(document.documentElement).colorScheme===expected,scheme);
   });
   assert.deepEqual(errors,[]);
  }finally{await context.close();}
 }
 const {context,worker,page,errors}=await launch('dark');
 try{
  await check('A saved light choice stays light on a dark operating system',async()=>{
   await worker.evaluate(async()=>chrome.storage.local.set({stillSettings:{appearance:'light',photoNewsMigrated:true}}));
   await page.goto('https://www.google.com/');await page.locator('#still-home').waitFor();
   await page.waitForFunction(()=>document.querySelector('#still-home')?.shadowRoot.querySelector('.app')?.dataset.appearance==='light');
   assert.equal(await mode(page),'light');assert.equal((await saved(worker)).appearance,'light');
  });
  await check('New-tab toggle asks for the optional permission and turns off when declined',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();
   const toggle=page.locator('[data-setting=newTabHome]');assert.equal(await toggle.isChecked(),false);
   await page.getByText('Open GoogleRefreshed in every new tab').click();
   // Playwright does not attach to extension popup windows, so the window is found and replaced with a regular tab.
   const findPrompt=()=>worker.evaluate(async()=>(await chrome.windows.getAll({populate:true})).find(w=>w.type==='popup'&&w.tabs.some(t=>/newtab-permission\.html$/.test(t.url||t.pendingUrl||'')))?.id);
   let windowId;for(let i=0;i<50&&!windowId;i++){windowId=await findPrompt();if(!windowId)await page.waitForTimeout(100);}
   assert.ok(windowId,'permission window opens');await worker.evaluate(id=>chrome.windows.remove(id),windowId);
   const prompt=await context.newPage();await prompt.goto(`chrome-extension://${new URL(worker.url()).host}/newtab-permission.html`);
   assert.equal((await saved(worker)).newTabHome,true);
   await prompt.getByText('Not now').click();
   await page.waitForFunction(()=>!document.querySelector('#still-home').shadowRoot.querySelector('[data-setting=newTabHome]').checked);
   assert.equal((await saved(worker)).newTabHome,false);
   assert.equal(await worker.evaluate(()=>chrome.permissions.contains({permissions:['tabs']})),false);
  });
  await check('New tabs are left alone without the permission',async()=>{
   await worker.evaluate(async()=>{const s=(await chrome.storage.local.get('stillSettings')).stillSettings;await chrome.storage.local.set({stillSettings:{...s,newTabHome:true}});});
   const id=await worker.evaluate(async()=>(await chrome.tabs.create({url:'chrome://newtab/'})).id);
   await new Promise(r=>setTimeout(r,1500));
   assert.doesNotMatch(await worker.evaluate(async id=>(await chrome.tabs.get(id)).url||'',id),/google\.com/);
  });
  assert.deepEqual(errors,[]);
 }finally{await context.close();}
 // The prompt cannot be clicked in automation, so a copy with the permission already granted checks the redirect.
 const granted=fs.mkdtempSync(path.join(root,'.test-profile-v154-ext-'));fs.cpSync(ext,granted,{recursive:true});
 const manifest=JSON.parse(fs.readFileSync(path.join(granted,'manifest.json'),'utf8'));manifest.permissions.push(...manifest.optional_permissions);delete manifest.optional_permissions;fs.writeFileSync(path.join(granted,'manifest.json'),JSON.stringify(manifest));
 const second=await launch('light',granted);
 try{
  const tabURL=(id)=>second.worker.evaluate(async id=>{const t=await chrome.tabs.get(id);return t.pendingUrl||t.url;},id);
  await check('With the setting off, new tabs keep the browser page',async()=>{
   await second.worker.evaluate(async()=>chrome.storage.local.set({stillSettings:{newTabHome:false,photoNewsMigrated:true}}));
   const id=await second.worker.evaluate(async()=>(await chrome.tabs.create({url:'chrome://newtab/'})).id);
   await new Promise(r=>setTimeout(r,1500));assert.doesNotMatch(await tabURL(id),/google\.com/);
  });
  await check('With the setting on, new tabs open GoogleRefreshed',async()=>{
   await second.worker.evaluate(async()=>chrome.storage.local.set({stillSettings:{newTabHome:true,photoNewsMigrated:true}}));
   const id=await second.worker.evaluate(async()=>(await chrome.tabs.create({url:'chrome://newtab/'})).id);
   for(let i=0;i<30&&!/google\.com/.test(await tabURL(id));i++)await new Promise(r=>setTimeout(r,100));
   assert.match(await tabURL(id),/^https:\/\/www\.google\.com\//);
  });
  await check('Links opened in new tabs are not redirected',async()=>{
   const id=await second.worker.evaluate(async()=>(await chrome.tabs.create({url:'https://example.com/'})).id);
   await new Promise(r=>setTimeout(r,800));assert.match(await tabURL(id),/example\.com/);
  });
 }finally{await second.context.close();fs.rmSync(granted,{recursive:true,force:true});}
 console.log(`${checks} v1.5.4 checks passed`);
})().catch(error=>{console.error(error);process.exit(1);});
