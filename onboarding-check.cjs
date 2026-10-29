// First-run identity, upgrade compatibility and fashion-scene checks in an isolated Brave profile.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const meta={location:{hostname:'localhost'},URL};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'extension/shared.js'),'utf8'),meta);
const artworkThemes=['lerouge','fashion'];
let context,checks=0;
const check=async(label,fn)=>{await fn();console.log('PASS '+label);checks++;};
const nativeHTML='<!doctype html><html lang="he" dir="rtl"><head><title>Google fixture</title></head><body><main>Google</main></body></html>';
(async()=>{
 const ext=path.resolve(__dirname,'extension');
 context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(__dirname,'.test-profile-welcome-')),{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,viewport:{width:1440,height:1000},timezoneId:'UTC',colorScheme:'dark',args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 await worker.evaluate(()=>{const original=respondTo;let n=0;globalThis.respondTo=async(m,s)=>{if(m.type==='hardware')return {ok:true,data:{cpu:{model:'Example CPU 8-Core',cores:8,total:++n*1000,idle:n*750},memory:{total:32*1024**3,available:16*1024**3}}};if(['browserSyncStatus','browserSyncEnable','newTabHomeStatus','newTabHome'].includes(m.type))return original(m,s);throw new Error('Offline test fixture.');};});
 await context.route('https://www.google.com/**',r=>r.fulfill({contentType:'text/html',body:nativeHTML}));
 const errors=[];
 // Playwright's page clock affects the main world, not extension content scripts.
 // Set the isolated-world Date and invoke the real name-input listener to redraw.
 const setNight=async p=>{const session=await context.newCDPSession(p),worlds=[];session.on('Runtime.executionContextCreated',e=>worlds.push(e.context));await session.send('Runtime.enable');const world=worlds.find(x=>x.name==='GoogleRefreshed'&&x.origin.startsWith('chrome-extension://'));assert.ok(world,'extension isolated world');const result=await session.send('Runtime.evaluate',{contextId:world.id,expression:`{const NativeDate=globalThis.__welcomeTestDate||Date;globalThis.__welcomeTestDate=NativeDate;globalThis.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:['2026-10-29T01:00:00Z']));}static now(){return new NativeDate('2026-10-29T01:00:00Z').getTime();}};document.querySelector('#still-home').shadowRoot.querySelector('#name').dispatchEvent(new Event('input',{bubbles:true}));}`});assert.equal(result.exceptionDetails,undefined);await session.detach();};
 const open=async()=>{const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('https://www.google.com/');await p.locator('#greeting').waitFor();await setNight(p);await p.waitForTimeout(250);return p;};
 const reload=async p=>{await p.reload();await p.locator('#greeting').waitFor();await setNight(p);};
 const stored=()=>worker.evaluate(async()=>(await chrome.storage.local.get('stillSettings')).stillSettings);
 const resetStorage=async(seed)=>{for(const p of context.pages())await p.close();await worker.evaluate(async seed=>{await chrome.storage.local.remove('stillSettings');if(seed)await chrome.storage.local.set({stillSettings:seed});},seed);};
 let page;
 await check('Fresh install asks for a local display name and uses a late-night greeting',async()=>{
  await resetStorage();page=await open();await page.locator('#welcome-dialog').waitFor({state:'visible'});
  assert.equal(await page.locator('#welcome-name').getAttribute('maxlength'),'32');
  assert.equal(await page.locator('#welcome-name').evaluate(e=>e.getRootNode().activeElement===e),true);
  assert.equal(await page.locator('#greeting').innerText(),'Still up');
  assert.equal(await page.locator('#greeting').getAttribute('dir'),'ltr');
  assert.equal(await page.locator('#welcome-title').evaluate(e=>getComputedStyle(e).direction),'ltr');
  assert.equal(await page.locator('.app').getAttribute('lang'),'en');
  assert.doesNotMatch(await page.locator('#greeting').innerText(),/^\.|\.$|morning/i);
  if(process.env.GR_CAPTURE_PREVIEWS==='1'){fs.mkdirSync(path.join(__dirname,'docs/v161'),{recursive:true});await page.waitForTimeout(250);await page.screenshot({path:path.join(__dirname,'docs/v161/welcome.png'),animations:'disabled'});}
 });
 await check('Welcome form fits a narrow screen with reduced motion',async()=>{
  await page.setViewportSize({width:320,height:844});await page.emulateMedia({reducedMotion:'reduce'});
  assert.ok(await page.locator('#welcome-dialog').evaluate(e=>{const r=e.getBoundingClientRect();return e.scrollWidth<=e.clientWidth+1&&r.left>=0&&r.right<=innerWidth+1;}));
  assert.equal(await page.locator('#welcome-save').isVisible(),true);assert.equal(await page.locator('#welcome-skip').isVisible(),true);
  await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});
 });
 await check('Enter saves a trimmed name once and completes welcome across open tabs',async()=>{
  const other=await open();await other.locator('#welcome-dialog').waitFor({state:'visible'});
  await page.locator('#welcome-name').fill('  Alex  ');await page.locator('#welcome-name').press('Enter');
  await page.locator('#welcome-dialog').waitFor({state:'hidden'});await other.locator('#welcome-dialog').waitFor({state:'hidden'});
  const s=await stored();assert.equal(s.name,'Alex');assert.equal(s.welcomeComplete,true);
  assert.equal(await page.locator('#greeting').innerText(),'Still up, Alex');assert.equal(await other.locator('#greeting').innerText(),'Still up, Alex');
  await reload(page);assert.equal(await page.locator('#welcome-dialog').isVisible(),false);assert.equal(await page.locator('#greeting').innerText(),'Still up, Alex');await other.close();
 });
 await check('Skipped and Escape-dismissed welcomes stay dismissed without storing typed names',async()=>{
  for(const method of ['skip','escape']){
   await resetStorage();page=await open();await page.locator('#welcome-dialog').waitFor({state:'visible'});await page.locator('#welcome-name').fill('Do not keep this');
   if(method==='skip')await page.locator('#welcome-skip').click();else await page.keyboard.press('Escape');
   await page.locator('#welcome-dialog').waitFor({state:'hidden'});assert.equal((await stored()).name,'');assert.equal((await stored()).welcomeComplete,true);
   await reload(page);assert.equal(await page.locator('#welcome-dialog').isVisible(),false);assert.equal(await page.locator('#greeting').innerText(),'Still up');
  }
 });
 await check('A failed name save keeps welcome available and can be retried',async()=>{
  await resetStorage();page=await open();await page.locator('#welcome-dialog').waitFor({state:'visible'});
  const session=await context.newCDPSession(page),worlds=[];session.on('Runtime.executionContextCreated',e=>worlds.push(e.context));await session.send('Runtime.enable');const world=worlds.find(x=>x.name==='GoogleRefreshed'&&x.origin.startsWith('chrome-extension://'));assert.ok(world);
  const result=await session.send('Runtime.evaluate',{contextId:world.id,expression:`{const original=chrome.storage.local.set;let fail=true;chrome.storage.local.set=async function(value){if(fail&&value.stillSettings){fail=false;throw new Error('Synthetic storage failure');}return original.call(this,value);};}`});assert.equal(result.exceptionDetails,undefined);await session.detach();
  await page.locator('#welcome-name').fill('Retry name');await page.locator('#welcome-save').click();await page.locator('#welcome-error').filter({hasText:'could not be saved'}).waitFor();
  assert.equal(await page.locator('#welcome-dialog').isVisible(),true);assert.equal(await page.locator('#welcome-save').isEnabled(),true);assert.equal((await stored()).welcomeComplete,false);assert.equal((await stored()).name,'');
  await page.locator('#welcome-save').click();await page.locator('#welcome-dialog').waitFor({state:'hidden'});assert.equal((await stored()).name,'Retry name');assert.equal((await stored()).welcomeComplete,true);
 });
 await check('An update preserves existing preferences without prompting established users',async()=>{
  await resetStorage({name:'Established',theme:'ocean',appearance:'dark',autoLocation:false,localNews:false,photoNewsMigrated:true});page=await open();
  assert.equal(await page.locator('#welcome-dialog').isVisible(),false);assert.equal(await page.locator('.app').getAttribute('data-theme'),'ocean');assert.equal(await page.locator('#greeting').innerText(),'Still up, Established');
  await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByLabel('What should we call you?',{exact:true}).fill('אלכס');await page.getByRole('button',{name:'Close customization'}).click();
  assert.equal(await page.locator('#greeting bdi').innerText(),'אלכס');assert.equal(await page.locator('#greeting bdi').getAttribute('dir'),'auto');assert.equal(await page.locator('#greeting').getAttribute('dir'),'ltr');
 });
 await check('Display names remain text and neither name nor welcome state enters browser sync',async()=>{
  await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByLabel('What should we call you?',{exact:true}).fill('<img onerror=alert(1)>');await page.getByRole('button',{name:'Close customization'}).click();
  assert.equal(await page.locator('#greeting bdi').innerText(),'<img onerror=alert(1)>');assert.equal(await page.locator('#greeting img, #greeting script').count(),0);
  const synced=await worker.evaluate(()=>GoogleRefreshedSync.preferences({name:'Private name',welcomeComplete:true,theme:'lerouge',animations:true}));
  assert.deepEqual(synced,{animations:true,theme:'lerouge'});
 });
 await check('Settings reset restores defaults while keeping welcome complete',async()=>{
  await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByRole('button',{name:'Reset settings to default',exact:true}).click();await page.getByRole('button',{name:'Click again to reset everything',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('#greeting').textContent==='Still up');await page.getByRole('button',{name:'Close customization'}).click();await reload(page);
  assert.equal(await page.locator('#welcome-dialog').isVisible(),false);assert.equal((await stored()).welcomeComplete,true);
 });
 const prefs=async patch=>{if(patch.theme){const theme=meta.GoogleRefreshed.themes.find(t=>t.id===patch.theme);assert.ok(theme,'registered '+patch.theme+' palette');patch.accent=theme.accent;}await worker.evaluate(async patch=>{const previous=(await chrome.storage.local.get('stillSettings')).stillSettings;await chrome.storage.local.set({stillSettings:{...previous,...patch}});},patch);await page.waitForFunction(p=>{const app=document.querySelector('#still-home').shadowRoot.querySelector('.app');return (!p.theme||app.dataset.theme===p.theme)&&(!p.appearance||app.dataset.appearance===p.appearance);},patch);};
 await check('Le Rouge and Fashion have detailed local artwork in both appearances with bounded visible motion',async()=>{
  for(const theme of artworkThemes)for(const appearance of ['dark','light']){
   await prefs({theme,appearance,animations:true});await page.locator(`.theme-art svg[data-scene=${theme}]`).waitFor();await page.waitForTimeout(process.env.GR_CAPTURE_PREVIEWS==='1'?1200:100);
   const art=await page.locator('.theme-art').evaluate(e=>{const a=e.getAnimations({subtree:true});const read=x=>{const s=getComputedStyle(x.effect.target);return [s.transform,s.opacity,s.strokeDashoffset,s.d].join('|');};const before=a.map(read);for(const x of a)x.currentTime=(x.currentTime||0)+3600;return {nodes:e.querySelectorAll('*').length,count:a.length,changed:a.some((x,i)=>read(x)!==before[i]&&x.effect.target.getBoundingClientRect().width>0)};});
   assert.ok(art.nodes>100&&art.nodes<550,theme+' detailed but bounded scene');assert.ok(art.count>0&&art.count<100,theme+' bounded animations');assert.ok(art.changed,theme+' perceptible motion');console.log(`  ${theme} ${appearance}: ${art.nodes} nodes / ${art.count} animations`);
   if(process.env.GR_CAPTURE_PREVIEWS==='1'){fs.mkdirSync(path.join(__dirname,'docs/v161'),{recursive:true});await page.frameLocator('#hardware-frame').locator('#cpu-value').filter({hasText:'25%'}).waitFor({timeout:10000});await page.locator('.app').evaluate(e=>e.dataset.paused='true');await page.screenshot({path:path.join(__dirname,`docs/v161/${theme}-${appearance}.png`),animations:'allow'});await page.locator('.app').evaluate(e=>e.dataset.paused='false');}
  }
 });
 await check('Le Rouge and Fashion respect reduced motion, animation off, pause and narrow layouts',async()=>{
  for(const theme of artworkThemes){
  await prefs({theme,animations:true});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='off');assert.equal(await page.locator('.theme-art').evaluate(e=>e.getAnimations({subtree:true}).length),0);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='on');await page.locator('.app').evaluate(e=>e.dataset.paused='true');assert.equal(await page.locator('.theme-art').evaluate(e=>e.getAnimations({subtree:true}).every(a=>a.playState==='paused')),true);await page.locator('.app').evaluate(e=>e.dataset.paused='false');
  await prefs({animations:false});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='off');assert.equal(await page.locator('.theme-art').evaluate(e=>e.getAnimations({subtree:true}).length),0);
  for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.locator('.app').evaluate(e=>e.scrollWidth<=e.clientWidth+1),theme+' narrow layout '+width);}await page.setViewportSize({width:1440,height:1000});
  }
 });
 assert.deepEqual(errors,[]);console.log(`${checks} onboarding and fashion-scene checks passed.`);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(context)await context.close();});
