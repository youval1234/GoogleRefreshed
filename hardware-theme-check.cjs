// Visual regression: a transparent frame can still paint white when color schemes disagree.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{execFileSync}=require('child_process');
let context;
(async()=>{
 const root=__dirname,ext=path.join(root,'extension'),profile=fs.mkdtempSync(path.join(root,'.test-profile-hardware-theme-'));
 context=await chromium.launchPersistentContext(profile,{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,viewport:{width:1200,height:1150},colorScheme:'light',args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 await context.addInitScript(()=>{const get=WebGLRenderingContext.prototype.getParameter;WebGLRenderingContext.prototype.getParameter=function(p){return p===37446||p===7937?'Example GPU renderer':get.call(this,p);};});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 await worker.evaluate(()=>{const original=respondTo;let samples=0;globalThis.respondTo=async(m,s)=>m.type==='hardware'?{ok:true,data:{cpu:{model:'Example CPU',cores:8,total:++samples*1000,idle:samples*750},memory:{total:32*1024**3,available:16*1024**3}}}:original(m,s);});
 await worker.evaluate(async()=>chrome.storage.local.set({stillSettings:{theme:'magical',appearance:'system',animations:false,photoNewsMigrated:true}}));
 await context.route('https://www.google.com/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html style="color-scheme:light"><title>Google fixture</title><body>Native Google</body></html>'}));
 const page=await context.newPage();await page.goto('https://www.google.com/');await page.locator('#still-home').waitFor();
 const frame=page.frameLocator('#hardware-frame');await frame.locator('#cpu-model').filter({hasText:'Example CPU'}).waitFor();
 async function verify(label,appearance){
   await page.waitForFunction(mode=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.appearance===mode,appearance);
   const expected=await page.locator('.app').evaluate(e=>getComputedStyle(e).color);
   await frame.locator('body').evaluate((e,expected)=>new Promise((resolve,reject)=>{const start=performance.now();function check(){if(getComputedStyle(e).color===expected)resolve();else if(performance.now()-start>2000)reject(new Error('Hardware text palette does not match homepage'));else requestAnimationFrame(check);}check();}),expected);
   await page.locator('#hardware-frame').scrollIntoViewIfNeeded();
   const screenshot=path.join(profile,'current.png');await page.screenshot({path:screenshot,animations:'disabled'});
   const box=await page.locator('#hardware-frame').boundingBox(),y=Math.floor(box.y+box.height-1);
   const coords=[[Math.floor(box.x+1),y],[Math.floor(box.x-2),y]];
   const pixels=JSON.parse(execFileSync('python',['-c','from PIL import Image; import sys,json; im=Image.open(sys.argv[1]).convert("RGB"); print(json.dumps([im.getpixel(tuple(p)) for p in json.loads(sys.argv[2])]))',screenshot,JSON.stringify(coords)],{encoding:'utf8'}));
   assert.ok(pixels[0].every((v,i)=>Math.abs(v-pixels[1][i])<12),label+': frame canvas must blend with widget, not white/black');
   console.log('PASS '+label);
 }
 await verify('System mode starts light','light');
 await page.emulateMedia({colorScheme:'dark'});await verify('System mode follows a live OS switch to dark','dark');
 await page.emulateMedia({colorScheme:'light'});await verify('System mode follows a live OS switch back to light','light');
 const themes=await page.locator('[data-theme-choice]').evaluateAll(nodes=>nodes.map(x=>x.dataset.themeChoice));assert.equal(themes.length,38);
 for(const theme of themes)for(const appearance of ['dark','light']){
   await worker.evaluate(async value=>{const saved=(await chrome.storage.local.get('stillSettings')).stillSettings;await chrome.storage.local.set({stillSettings:{...saved,...value}});},{theme,appearance});await verify(theme+' '+appearance,appearance);
 }
 await worker.evaluate(async()=>{const saved=(await chrome.storage.local.get('stillSettings')).stillSettings;await chrome.storage.local.set({stillSettings:{...saved,theme:'magical',appearance:'dark',homeCard:'note',note:'Private note fixture'}});});await frame.locator('#note').waitFor();await verify('Focus note retains the same dark canvas','dark');
 const isolated=await page.evaluate(()=>{try{return !!document.querySelector('#still-home').shadowRoot.querySelector('#hardware-frame').contentWindow.document;}catch(e){return e.name!=='SecurityError';}});assert.equal(isolated,false);console.log('PASS Hardware frame remains isolated from Google');
 console.log((themes.length*2+5)+' hardware theme checks passed.');await context.close();
})().catch(async e=>{console.error(e);if(context)await context.close();process.exitCode=1;});
