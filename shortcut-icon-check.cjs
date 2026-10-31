// Real browser favicon-cache integration; synthetic websites and no external providers.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
let context;const profile=fs.mkdtempSync(path.join(__dirname,'.test-profile-shortcut-icons-'));
(async()=>{
 const ext=path.join(__dirname,'extension');context=await chromium.launchPersistentContext(profile,{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');

 await context.route('https://**/*',r=>r.fulfill({contentType:'text/html',body:'<html><title>Google fixture</title><body>Google</body></html>'}));
 const page=await context.newPage();
 const item=(name,url,iconMode='auto')=>({name,url,iconMode,glyph:'X',color:'#777777'});
 await worker.evaluate(async shortcuts=>chrome.storage.local.set({stillSettings:{welcomeComplete:true,animations:false,photoNewsMigrated:true,shortcuts}}),[item('One','https://one.test/'),item('Subdomain','https://sub.one.test/'),item('Bundled','https://mail.google.com/'),item('Custom','https://one.test/','text'),item('Finance','https://www.google.com/finance/?hl=en'),item('Finance quote','https://www.google.com/finance/quote/GOOG:NASDAQ'),item('Google','https://www.google.com/'),item('Unrelated','https://www.google.com/finance-other')]);
 await page.goto('https://www.google.com/');
 const a=page.getByRole('link',{name:'One',exact:true}).locator('img'),b=page.getByRole('link',{name:'Subdomain',exact:true}).locator('img');
 for(const image of [a,b]){await image.waitFor();await image.evaluate(async e=>{for(let i=0;i<100&&!(e.complete&&e.naturalWidth);i++)await new Promise(r=>setTimeout(r,10));if(!e.complete||!e.naturalWidth)throw new Error('Favicon failed to load');});}
 assert.notEqual(await a.getAttribute('src'),await b.getAttribute('src'));assert.ok((await a.getAttribute('src')).includes(encodeURIComponent('https://one.test/')));assert.ok((await b.getAttribute('src')).includes(encodeURIComponent('https://sub.one.test/')));console.log('PASS Native favicon lookup loads and distinguishes shortcut destinations');
 assert.equal(await page.getByRole('link',{name:'Bundled',exact:true}).locator('img').getAttribute('data-service'),'gmail');assert.equal(await page.getByRole('link',{name:'Custom',exact:true}).locator('img').count(),0);console.log('PASS Bundled brand icons and explicitly chosen custom initials remain supported');
 const finance=page.getByRole('link',{name:'Finance',exact:true}).locator('img');
 assert.equal(await finance.getAttribute('data-service'),'finance');assert.equal(await page.getByRole('link',{name:'Finance quote',exact:true}).locator('img').getAttribute('data-service'),'finance');
 await finance.evaluate(async e=>{await e.decode();if(e.naturalWidth!==120)throw new Error('Official Finance icon missing');});
 assert.equal(await page.getByRole('link',{name:'Google',exact:true}).locator('img').getAttribute('data-service'),'google');assert.equal(await page.getByRole('link',{name:'Unrelated',exact:true}).locator('img').getAttribute('data-service'),null);
 console.log('PASS Google Finance routes load the official logo without changing other Google shortcuts');
 const cases=[['https://docs.google.com/document/d/example','docs'],['https://docs.google.com/spreadsheets/d/example','sheets'],['https://docs.google.com/presentation/d/example','slides'],['https://docs.google.com/forms/d/example','forms'],['https://www.google.com/maps/place/example','maps'],['https://google.com/travel/flights','travel'],['https://www.google.co.il/finance/','finance'],['https://www.google.com/shopping','shopping'],['https://www.google.com/books','books'],...['news','keep','meet','gemini','scholar','earth','classroom','sites','sheets','slides','forms','finance','photos','translate'].map(x=>['https://'+x+'.google.com/',x]),['https://www.google.com.evil.test/finance',null],['https://news.google.com.evil.test/',null],['https://www.google.com/unknown-service',null]];
 await worker.evaluate(async cases=>{const s=(await chrome.storage.local.get('stillSettings')).stillSettings;s.shortcuts.push(...cases.map(([url],i)=>({name:'Service '+i,url,glyph:'S'})));await chrome.storage.local.set({stillSettings:s});},cases);
 for(const [i,[url,service]] of cases.entries()){
  const img=page.getByRole('link',{name:'Service '+i,exact:true}).locator('img');await img.waitFor();assert.equal(await img.getAttribute('data-service'),service,url);await img.evaluate(e=>e.decode());
 }
 console.log('PASS Google service hosts and paths resolve correct bundled images; unknown routes and lookalikes retain native fallback');
 for(const viewport of [{width:1440,height:700},{width:390,height:650}]){
  await page.setViewportSize(viewport);
  const button=page.getByRole('button',{name:'Customize',exact:true});
  let baseline;
  for(const fraction of [0,0.5,1]){
   const actual=await page.evaluate(f=>{const app=document.querySelector('#still-home').shadowRoot.querySelector('.app');app.scrollTop=(app.scrollHeight-app.clientHeight)*f;return app.scrollTop;},fraction);
   if(fraction===1)assert.ok(actual>0,'Fixture must scroll');
   await page.mouse.move(0,0);await page.waitForTimeout(220);
   const box=await button.boundingBox();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=viewport.width&&box.y+box.height<=viewport.height);
   if(baseline)assert.ok(Math.abs(box.y-baseline.y)<1,'Customize moved with content');baseline=box;
   await button.click();await page.locator('#settings').waitFor({state:'visible'});await page.keyboard.press('Escape');
  }
 }
 console.log('PASS Customize stays visible and opens settings at top, middle and bottom on desktop and mobile');
 await a.evaluate(e=>e.src='data:image/png;base64,bm90LWFuLWltYWdl');assert.equal(await page.getByRole('link',{name:'One',exact:true}).locator('.tile').textContent(),'X');console.log('PASS Unavailable favicon falls back to initials without a broken image');
 await worker.evaluate(async()=>{const s=(await chrome.storage.local.get('stillSettings')).stillSettings;s.shortcuts[0].url='https://sub.one.test/';await chrome.storage.local.set({stillSettings:s});});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.shortcut[href="https://sub.one.test/"] img')?.src.includes('sub.one.test'));
 await page.reload();await page.getByRole('link',{name:'One',exact:true}).locator('img').waitFor();assert.ok((await page.getByRole('link',{name:'One',exact:true}).locator('img').getAttribute('src')).includes('sub.one.test'));console.log('PASS Changing a shortcut destination updates its icon and survives reload');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(context)await context.close();fs.rmSync(profile,{recursive:true});});
