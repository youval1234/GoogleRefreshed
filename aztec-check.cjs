// Focused Aztec art regression checks. Providers are offline and hardware is synthetic.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const meta={location:{hostname:'localhost'},URL};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'extension/shared.js'),'utf8'),meta);
const theme=meta.GoogleRefreshed.themes.find(t=>t.id==='aztec');
const capture=process.env.GR_CAPTURE_PREVIEWS==='1';
const luminance=hex=>{const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
let context,checks=0;
const check=async(label,fn)=>{await fn();checks++;console.log('PASS '+label);};
(async()=>{
 const ext=path.join(__dirname,'extension');
 context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(__dirname,'.test-profile-aztec-')),{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,viewport:{width:1440,height:1000},timezoneId:'UTC',colorScheme:'dark',args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 await worker.evaluate(async accent=>{
  await chrome.storage.local.set({stillSettings:{theme:'aztec',appearance:'dark',accent,font:'manrope',animations:true,motionIntensity:'vivid',welcomeComplete:true,name:'',autoLocation:false,localNews:false,photoNewsMigrated:true,worldZone:'UTC'}});
  const original=respondTo;let samples=0;
  globalThis.respondTo=async(m,s)=>{
   if(m.type==='hardware')return {ok:true,data:{cpu:{model:'Example CPU 8-Core',cores:8,total:++samples*1000,idle:samples*750},memory:{total:32*1024**3,available:16*1024**3}}};
   if(['browserSyncStatus','browserSyncEnable','newTabHomeStatus','newTabHome'].includes(m.type))return original(m,s);
   throw new Error('Offline Aztec test fixture.');
  };
 },'#8c9a70');
 await context.route('https://www.google.com/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><title>Google fixture</title></head><body><main>Google</main></body></html>'}));
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error'&&/attribute.*d:|Expected.*number|Failed to load resource/.test(m.text()))errors.push(m.text());});
 await page.goto('https://www.google.com/');
 await page.locator('.theme-art svg[data-scene=aztec]').waitFor();
 await page.frameLocator('#hardware-frame').locator('#cpu-value').filter({hasText:'25%'}).waitFor();
 const prefs=async patch=>{
  await worker.evaluate(async patch=>{const s=(await chrome.storage.local.get('stillSettings')).stillSettings;await chrome.storage.local.set({stillSettings:{...s,...patch}});},patch);
  await page.waitForFunction(p=>{const root=document.querySelector('#still-home').shadowRoot,app=root.querySelector('.app');return (!p.appearance||app.dataset.appearance===p.appearance)&&(!p.motionIntensity||app.dataset.motionIntensity===p.motionIntensity)&&(!p.accent||root.querySelector('#accent').value===p.accent)&&(!Object.hasOwn(p,'animations')||app.dataset.motion===(p.animations?'on':'off'));},patch);
 };
 await check('Existing Aztec selections remain compatible and survive reload',async()=>{
  assert.ok(theme);assert.equal(theme.world,'aztec');
  assert.equal(await page.locator('.app').getAttribute('data-theme'),'aztec');
  assert.equal(await page.locator('[data-theme-choice=aztec]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#accent').inputValue(),theme.accent,'old theme accent follows the redesigned default');
  assert.equal(await page.locator('#welcome-dialog').isVisible(),false);
  await page.reload();await page.locator('.theme-art svg[data-scene=aztec]').waitFor();
  assert.equal(await worker.evaluate(async()=>(await chrome.storage.local.get('stillSettings')).stillSettings.theme),'aztec');
  assert.equal(await page.locator('#accent').inputValue(),theme.accent);
 });
 await check('A user-defined Aztec accent remains unchanged after reload',async()=>{
  await prefs({accent:'#7755aa'});await page.reload();await page.locator('.theme-art svg[data-scene=aztec]').waitFor();
  assert.equal(await page.locator('#accent').inputValue(),'#7755aa');
  assert.equal(await worker.evaluate(async()=>(await chrome.storage.local.get('stillSettings')).stillSettings.accent),'#7755aa');
  await prefs({accent:theme.accent});
 });
 await check('Detailed Aztec architecture renders in both appearances with readable palettes and visible motion',async()=>{
  for(const appearance of ['dark','light']){
   await prefs({appearance,animations:true});
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(capture?1200:100);
   const art=await page.locator('.theme-art').evaluate(e=>{
    const animations=e.getAnimations({subtree:true});
    const read=a=>{const s=getComputedStyle(a.effect.target);return [s.transform,s.opacity,s.strokeDashoffset,s.strokeDasharray,s.d].join('|');};
    const before=animations.map(read);for(const a of animations)a.currentTime=(a.currentTime||0)+4100;
    const inView=el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight;};
    return {nodes:e.querySelectorAll('*').length,count:animations.length,changed:animations.some((a,i)=>before[i]!==read(a)&&inView(a.effect.target)),filters:e.querySelectorAll('filter,image,script,foreignObject').length};
   });
   assert.ok(art.nodes>300&&art.nodes<550,appearance+' substantially detailed, bounded architecture');
   assert.ok(art.count>0&&art.count<100,appearance+' bounded animation count');assert.ok(art.changed,appearance+' perceptible motion');
   assert.equal(art.filters,0,'No filter, external image, script or foreign object');
   const colors=theme[appearance],contrast=(Math.max(luminance(colors[0]),luminance(colors[1]))+.05)/(Math.min(luminance(colors[0]),luminance(colors[1]))+.05);
   assert.ok(contrast>=7,appearance+' foreground remains legible');
   assert.equal(await page.locator('.app').evaluate(e=>getComputedStyle(e).getPropertyValue('--bg').trim()),colors[0]);
   console.log(`  Aztec ${appearance}: ${art.nodes} nodes / ${art.count} animations / ${contrast.toFixed(1)}:1 text contrast`);
   if(capture){
    fs.mkdirSync(path.join(__dirname,'docs/v162'),{recursive:true});
    await page.frameLocator('#hardware-frame').locator('#cpu-value').filter({hasText:'25%'}).waitFor();
    await page.locator('.app').evaluate(e=>{e.scrollTop=0;e.dataset.paused='true';});
    await page.screenshot({path:path.join(__dirname,`docs/v162/aztec-${appearance}.png`),animations:'allow'});
    await page.locator('.app').evaluate(e=>e.dataset.paused='false');
   }
  }
 });
 await check('Aztec respects Subtle intensity, paused animation, reduced motion and animation off',async()=>{
  await prefs({animations:true,motionIntensity:'vivid'});
  const vivid=await page.locator('.scene').evaluate(e=>Number(getComputedStyle(e).opacity));
  await prefs({motionIntensity:'subtle'});assert.ok(await page.locator('.scene').evaluate(e=>Number(getComputedStyle(e).opacity))<vivid);
  await prefs({motionIntensity:'vivid'});await page.locator('.app').evaluate(e=>e.dataset.paused='true');
  assert.equal(await page.locator('.theme-art').evaluate(e=>e.getAnimations({subtree:true}).every(a=>a.playState==='paused')),true);
  await page.locator('.app').evaluate(e=>e.dataset.paused='false');
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='off');
  assert.equal(await page.locator('.theme-art').evaluate(e=>e.getAnimations({subtree:true}).length),0);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='on');
  await prefs({animations:false});assert.equal(await page.locator('.theme-art').evaluate(e=>e.getAnimations({subtree:true}).length),0);
 });
 await check('Aztec keeps search and customization usable on narrow screens',async()=>{
  for(const width of [390,320]){
   await page.setViewportSize({width,height:844});await page.locator('.app').evaluate(e=>e.scrollTop=0);
   assert.ok(await page.locator('.app').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'homepage '+width);
   await page.getByRole('searchbox',{name:'Search Google',exact:true}).fill('architecture');assert.equal(await page.locator('.query').inputValue(),'architecture');await page.locator('.query').fill('');
   await page.getByRole('button',{name:'Customize',exact:true}).click();
   assert.ok(await page.locator('#settings').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'customization '+width);
   await page.locator('#theme-search').fill('Aztec');assert.equal(await page.locator('[data-theme-choice]:visible').count(),1);
   await page.getByRole('button',{name:'Aztec',exact:true}).click();await page.getByRole('button',{name:'Close customization',exact:true}).click();
   if(capture&&width===390){await page.locator('.app').evaluate(e=>e.scrollTop=0);await page.screenshot({path:path.join(__dirname,'docs/v162/aztec-mobile.png'),animations:'disabled'});}
  }
 });
 assert.deepEqual(errors,[]);console.log(`${checks} Aztec checks passed.`);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(context)await context.close();});
