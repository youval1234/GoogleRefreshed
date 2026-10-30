// Real browser favicon-cache integration; synthetic websites and no external providers.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
let context;const profile=fs.mkdtempSync(path.join(__dirname,'.test-profile-shortcut-icons-'));
(async()=>{
 const ext=path.join(__dirname,'extension');context=await chromium.launchPersistentContext(profile,{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');

 await context.route('https://**/*',r=>r.fulfill({contentType:'text/html',body:'<html><title>Google fixture</title><body>Google</body></html>'}));
 const page=await context.newPage();
 const item=(name,url,iconMode='auto')=>({name,url,iconMode,glyph:'X',color:'#777777'});
 await worker.evaluate(async shortcuts=>chrome.storage.local.set({stillSettings:{welcomeComplete:true,animations:false,photoNewsMigrated:true,shortcuts}}),[item('One','https://one.test/'),item('Subdomain','https://sub.one.test/'),item('Bundled','https://mail.google.com/'),item('Custom','https://one.test/','text')]);
 await page.goto('https://www.google.com/');
 const a=page.getByRole('link',{name:'One',exact:true}).locator('img'),b=page.getByRole('link',{name:'Subdomain',exact:true}).locator('img');
 for(const image of [a,b]){await image.waitFor();await image.evaluate(async e=>{for(let i=0;i<100&&!(e.complete&&e.naturalWidth);i++)await new Promise(r=>setTimeout(r,10));if(!e.complete||!e.naturalWidth)throw new Error('Favicon failed to load');});}
 assert.notEqual(await a.getAttribute('src'),await b.getAttribute('src'));assert.ok((await a.getAttribute('src')).includes(encodeURIComponent('https://one.test/')));assert.ok((await b.getAttribute('src')).includes(encodeURIComponent('https://sub.one.test/')));console.log('PASS Native favicon lookup loads and distinguishes shortcut destinations');
 assert.equal(await page.getByRole('link',{name:'Bundled',exact:true}).locator('img').getAttribute('data-service'),'gmail');assert.equal(await page.getByRole('link',{name:'Custom',exact:true}).locator('img').count(),0);console.log('PASS Bundled brand icons and explicitly chosen custom initials remain supported');
 await a.evaluate(e=>e.src='data:image/png;base64,bm90LWFuLWltYWdl');assert.equal(await page.getByRole('link',{name:'One',exact:true}).locator('.tile').textContent(),'X');console.log('PASS Unavailable favicon falls back to initials without a broken image');
 await worker.evaluate(async()=>{const s=(await chrome.storage.local.get('stillSettings')).stillSettings;s.shortcuts[0].url='https://sub.one.test/';await chrome.storage.local.set({stillSettings:s});});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.shortcut[href="https://sub.one.test/"] img')?.src.includes('sub.one.test'));
 await page.reload();await page.getByRole('link',{name:'One',exact:true}).locator('img').waitFor();assert.ok((await page.getByRole('link',{name:'One',exact:true}).locator('img').getAttribute('src')).includes('sub.one.test'));console.log('PASS Changing a shortcut destination updates its icon and survives reload');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(context)await context.close();fs.rmSync(profile,{recursive:true});});
