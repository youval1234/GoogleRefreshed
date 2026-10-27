const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=__dirname,ext=path.join(root,'extension');
const nativeHTML='<!doctype html><html><head><title>Google fixture</title></head><body><main>Google</main></body></html>';
let checks=0;async function check(label,fn){await fn();console.log('PASS '+label);checks++;}
// Each scenario starts from a fresh profile so the first visit has no saved settings.
async function launch(colorScheme){
 const context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(root,'.test-profile-v154-')),{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,colorScheme,viewport:{width:1440,height:1000},timezoneId:'UTC',args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 // Synthetic hardware and no provider requests: location, weather and news stay offline.
 await worker.evaluate(()=>{globalThis.respondTo=async m=>{if(m.type==='hardware')return {ok:true,data:{cpu:{model:'Example CPU',cores:8,total:1000,idle:750},memory:{total:16*1024**3,available:8*1024**3}}};throw new Error('Offline fixture.');};});
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
  assert.deepEqual(errors,[]);
 }finally{await context.close();}
 console.log(`${checks} v1.5.4 checks passed`);
})().catch(error=>{console.error(error);process.exit(1);});
