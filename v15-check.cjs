const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),vm=require('vm');
const root=__dirname,ext=path.join(root,'extension'),meta={location:{hostname:'localhost'},URL};vm.runInNewContext(fs.readFileSync(path.join(ext,'shared.js'),'utf8'),meta);
let context,checks=0;async function check(label,fn){await fn();console.log('PASS '+label);checks++;}
(async()=>{
 context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(root,'.test-profile-v15-')),{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,viewport:{width:1440,height:1000},timezoneId:'UTC',args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 await worker.evaluate(async()=>{await chrome.storage.local.set({stillSettings:{theme:'sakura',appearance:'dark',animations:true,autoLocation:false,localNews:false,photoNewsMigrated:true}});const original=respondTo;let n=0;globalThis.respondTo=async(m,s)=>m.type==='hardware'?{ok:true,data:{cpu:{model:'Example CPU 8-Core',cores:8,total:++n*1000,idle:n*750},memory:{total:32*1024**3,available:16*1024**3}}}:original(m,s);});
 await context.route('https://www.google.com/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><title>Google fixture</title></head><body><main>Google</main></body></html>'}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/attribute.*(?:path|d:)|Expected.*number/.test(m.text()))errors.push(m.text());});
 const home=async()=>{await page.goto('https://www.google.com/');await page.locator('#still-home').waitFor();};
 const prefs=async patch=>{if(patch.theme)patch.accent=meta.GoogleRefreshed.themes.find(t=>t.id===patch.theme).accent;await worker.evaluate(async patch=>{const s=(await chrome.storage.local.get('stillSettings')).stillSettings;await chrome.storage.local.set({stillSettings:{...s,...patch}});},patch);if(patch.theme)await page.waitForFunction(id=>document.querySelector('#still-home').shadowRoot.querySelector('.theme-art svg')?.dataset.scene===id,patch.theme);};
 await home();
 await check('More than six shortcuts can be added through the homepage and persist',async()=>{
   await page.locator('#quick-add-shortcut').click();await page.locator('#link-name').fill('Sixth site');await page.locator('#link-url').fill('https://example.com/six');await page.locator('#link-dialog button[type=submit]').click();
   await page.locator('#quick-add-shortcut').click();await page.locator('#link-name').fill('Seventh site');await page.locator('#link-url').fill('https://example.com/seven');await page.locator('#link-dialog button[type=submit]').click();
   assert.equal(await page.locator('.shortcuts a.shortcut').count(),7);assert.equal(await page.locator('.shortcut.add').isVisible(),true);await page.waitForTimeout(250);await home();assert.equal(await page.locator('.shortcuts a.shortcut').count(),7);
   const positions=await page.locator('.shortcuts a.shortcut').evaluateAll(e=>e.map(n=>n.getBoundingClientRect().top));assert.ok(positions[6]>positions[0]);
 });
 await check('Sixty saved links wrap, remain editable, and respect the limit',async()=>{
   await prefs({shortcuts:Array.from({length:60},(_,i)=>({name:'Site '+(i+1),url:'https://example.com/'+i,group:'personal'}))});await page.locator('#shortcut-count').filter({hasText:'60'}).waitFor();assert.equal(await page.locator('.shortcuts a.shortcut').count(),60);assert.equal(await page.locator('#quick-add-shortcut').isDisabled(),true);assert.equal(await page.locator('.shortcut.add').count(),0);
   await page.locator('#edit-shortcuts').click();assert.equal(await page.locator('#add-shortcut').isVisible(),false);await page.keyboard.press('Escape');await home();assert.equal(await page.locator('.shortcuts a.shortcut').count(),60);
   await prefs({shortcuts:[['Gmail','https://mail.google.com/'],['YouTube','https://www.youtube.com/'],['Drive','https://drive.google.com/'],['Calendar','https://calendar.google.com/'],['ChatGPT','https://chatgpt.com/']].map(([name,url])=>({name,url,group:'personal'}))});await page.locator('#shortcut-count').filter({hasText:'5'}).waitFor();
 });
 await check('All catalog scenes have visible motion, with bounded artwork and no malformed SVG',async()=>{
   fs.mkdirSync(path.join(root,'docs/v15'),{recursive:true});
   for(const theme of meta.GoogleRefreshed.themes){await prefs({theme:theme.id});await page.waitForTimeout(220);const result=await page.locator('.theme-art').evaluate(e=>{
     const animations=e.getAnimations({subtree:true});const read=a=>{const s=getComputedStyle(a.effect.target);return[s.transform,s.opacity,s.strokeDashoffset,s.strokeDasharray,s.d].join('|');};const before=animations.map(read);for(const a of animations)a.currentTime=(a.currentTime||0)+2400;const changed=animations.some((a,i)=>read(a)!==before[i]&&a.effect.target.getBoundingClientRect().width>0);return {count:e.querySelectorAll('*').length,changed,active:animations.length};
   });assert.ok(result.changed,theme.id+' has perceptible changes in position/opacity/path');assert.ok(result.count<550,theme.id+' bounded scene nodes');assert.ok(result.active<100,theme.id+' bounded animations');
     await page.locator('.app').evaluate(e=>{e.scrollTop=0;e.dataset.paused='true';});await page.screenshot({path:path.join(root,'docs/v15',theme.id+'.png'),animations:'allow'});await page.locator('.app').evaluate(e=>e.dataset.paused='false');
   }
 });
 await check('Animation off, reduced motion and hidden-page pause apply to every scene',async()=>{
   for(const theme of meta.GoogleRefreshed.themes){await prefs({theme:theme.id,animations:false});assert.equal(await page.locator('.theme-art').evaluate(e=>e.getAnimations({subtree:true}).length),0);}
   await prefs({theme:'aurora',animations:true});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='off');assert.equal(await page.locator('.theme-art').evaluate(e=>e.getAnimations({subtree:true}).length),0);await page.emulateMedia({reducedMotion:'no-preference'});
   await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='on');
   await page.locator('.app').evaluate(e=>e.dataset.paused='true');assert.equal(await page.locator('.theme-art').evaluate(e=>e.getAnimations({subtree:true}).every(a=>a.playState==='paused')),true);await page.locator('.app').evaluate(e=>e.dataset.paused='false');
 });
 await check('New Fire and Magma palettes work in light and dark mode',async()=>{
   for(const theme of ['fire','magma'])for(const appearance of ['light','dark']){await prefs({theme,appearance});await page.waitForTimeout(230);assert.equal(await page.locator('.app').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb('+[1,3,5].map(i=>parseInt(meta.GoogleRefreshed.themes.find(t=>t.id===theme)[appearance][0].slice(i,i+2),16)).join(', ')+')');}
 });
 await check('Visible reset button confirms, clears personalization, stops sync and persists defaults',async()=>{
   await prefs({theme:'magma',engine:'brave',font:'outfit',compact:true,worldClock:false,name:'Reset example',note:'Synthetic note',city:{name:'Example city',latitude:0,longitude:0},shortcuts:[{name:'Custom',url:'https://example.com/'}]});
   await worker.evaluate(()=>GoogleRefreshedSync.request({type:'browserSyncEnable',enabled:true}));await page.locator('#timer-start').click();await page.getByRole('button',{name:'Customize',exact:true}).click();await page.locator('#settings').evaluate(e=>e.scrollTop=0);const resetBox=await page.locator('#reset').boundingBox();assert.ok(resetBox.y>=0&&resetBox.y+resetBox.height<1000);
   await page.locator('#reset').click();assert.equal(await page.locator('.app').getAttribute('data-theme'),'magma');await page.getByRole('button',{name:'Close customization'}).click();await page.getByRole('button',{name:'Customize',exact:true}).click();assert.equal(await page.locator('#reset').innerText(),'Reset settings to default');
   await page.locator('#reset').click();await page.locator('#reset').click();await page.locator('.toast').filter({hasText:'Default homepage settings restored.'}).waitFor();await page.getByRole('button',{name:'Close customization'}).click();
   const saved=await worker.evaluate(async()=>await chrome.storage.local.get(['stillSettings','grFocusTimer','grSyncState']));assert.equal(saved.stillSettings.theme,'paper');assert.equal(saved.stillSettings.engine,'google');assert.equal(saved.stillSettings.font,'manrope');assert.equal(saved.stillSettings.shortcuts.length,5);assert.equal(saved.stillSettings.name,'');assert.equal(saved.stillSettings.note,'');assert.equal(saved.stillSettings.city,null);assert.equal(saved.stillSettings.photo,'');assert.equal(saved.grFocusTimer.end,0);assert.equal(await worker.evaluate(async()=>(await GoogleRefreshedSync.request({type:'browserSyncStatus'})).data.enabled),false);
   await home();assert.equal(await page.locator('.app').getAttribute('data-theme'),'paper');assert.equal(await page.locator('#timer-time').innerText(),'25:00');assert.equal(await page.locator('#world-clock').isVisible(),true);
 });
 await check('Shortcut controls fit narrow screens with multirow links',async()=>{
   for(const width of [320,390,768]){await page.setViewportSize({width,height:900});await page.locator('.app').evaluate(e=>e.scrollTop=0);assert.equal(await page.locator('.app').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);}
 });
 assert.deepEqual(errors,[]);console.log(`${checks} v1.5 checks passed.`);await context.close();
})().catch(async e=>{console.error(e);if(context)await context.close();process.exitCode=1;});
