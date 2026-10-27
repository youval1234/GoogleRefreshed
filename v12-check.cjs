const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=__dirname,ext=path.join(root,'extension'),checks=[];let context;
async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
(async()=>{
 context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(root,'.test-profile-v12-')),{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,viewport:{width:1440,height:1000},timezoneId:'UTC',args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 await context.addInitScript(()=>{const original=WebGLRenderingContext.prototype.getParameter;WebGLRenderingContext.prototype.getParameter=function(parameter){if(parameter===37446||parameter===7937)return 'Example GPU renderer';return original.call(this,parameter);};});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 await check('Brave exposes real CPU and memory metadata',async()=>{const real=await worker.evaluate(async()=>{const [c,m]=await Promise.all([chrome.system.cpu.getInfo(),chrome.system.memory.getInfo()]);return{cpu:typeof c.modelName==='string'&&c.numOfProcessors>0,memory:m.capacity>0&&m.availableCapacity>=0};});assert.deepEqual(real,{cpu:true,memory:true});});
 await worker.evaluate(()=>{const original=respondTo;globalThis.hardwareCalls=0;globalThis.respondTo=async(message,signal)=>{if(message.type!=='hardware')return original(message,signal);hardwareCalls++;return{ok:true,at:Date.now(),data:{cpu:{cores:8,model:'Example CPU 8-Core',total:hardwareCalls*100000,idle:hardwareCalls*75000},memory:{total:32*1024**3,available:16*1024**3}}};};});
 await worker.evaluate(()=>{
   globalThis.networkCalls=[];
   globalThis.fetch=async input=>{
     const u=new URL(String(input));networkCalls.push(u.href);
     if(u.hostname==='www.google.com'&&u.pathname==='/complete/search'){const q=u.searchParams.get('q');return new Response('window.google.ac.h('+JSON.stringify([[[q+' entity',46,[512],{zh:q+' entity',zi:'Example entity',zs:'https://encrypted-tbn0.gstatic.com/images?q=fixture'}],[q+' tips',0,[512]],[q+' search',0,[512]]],{}])+')');}
     if(u.hostname==='ipwho.is')return Response.json({success:true,city:'London',region:'England',country:'United Kingdom',country_code:'GB',latitude:51.5,longitude:-.12});
     if(u.hostname==='api.open-meteo.com')return Response.json({current:{temperature_2m:18,apparent_temperature:17,weather_code:2,is_day:1,wind_speed_10m:10},daily:{time:['2026-10-27','2026-10-28','2026-10-29','2026-10-30','2026-10-31'],weather_code:[2,3,0,61,73],temperature_2m_max:[19,20,18,16,17],temperature_2m_min:[12,13,10,11,12]}});
     if(u.hostname==='www.bing.com'){
       if(globalThis.newsFailure)return new Response('Unavailable',{status:503});
       const items=Array.from({length:14},(_,i)=>`<item><title>Example news story ${i+1}</title><link>http://www.bing.com/news/apiclick.aspx?url=https%3A%2F%2Fexample.com%2Fstory-${i+1}</link><News:Source>Example Publisher</News:Source><News:Image>http://www.bing.com/th?id=fixture-${i+1}</News:Image><pubDate>Tue, 27 Oct 2026 08:00:00 GMT</pubDate></item>`).join('');
       return new Response(`<rss xmlns:News="https://www.bing.com/news"><channel>${items}<item><title>Unsafe</title><link>javascript:alert(1)</link></item></channel></rss>`,{headers:{'Content-Type':'application/xml'}});
     }
     throw new Error('Unexpected source: '+u.hostname);
   };
 });
 await context.route('https://www.google.com/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>Google</title><body><main id="fixture-native"><form action="/search"><input name="q" aria-label="Original Google search"></form><div id="rso"><a href="https://example.com"><h3>Native Google result</h3></a><p class="VwiC3b">Original result text remains available.</p></div></main></body>'}));
 await context.route('https://encrypted-tbn0.gstatic.com/**',r=>r.fulfill({contentType:'image/png',body:fs.readFileSync(path.join(ext,'icons/services/google.png'))}));
 await context.route('https://www.bing.com/th?**',r=>r.fulfill({contentType:'image/png',body:fs.readFileSync(path.join(ext,'icons/services/photos.png'))}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await check('Remote payloads are parsed as data and responses are bounded',async()=>{
   const safe=await worker.evaluate(async()=>{
     const saved=fetch;let scriptRejected=false,largeRejected=false,unsafeImageRejected=false;
     try{
       globalThis.fetch=async()=>new Response('globalThis.remoteScriptRan=true;');try{await GoogleRefreshedData({type:'suggestions',query:'test'});}catch{scriptRejected=true;}
       globalThis.fetch=async()=>new Response('window.google.ac.h('+JSON.stringify([[["test",46,[],{zs:'javascript:alert(1)'}]],{}])+')');unsafeImageRejected=(await GoogleRefreshedData({type:'suggestions',query:'test'}))[0].image==='';
       globalThis.fetch=async()=>new Response('x'.repeat(1000001));try{await GoogleRefreshedData({type:'suggestions',query:'test'});}catch{largeRejected=true;}
     }finally{globalThis.fetch=saved;}
     return scriptRejected&&largeRejected&&unsafeImageRejected&&!globalThis.remoteScriptRan;
   });assert.equal(safe,true);
 });
 const home=async()=>{await page.goto('https://www.google.com/');await page.locator('#still-home').waitFor();};await home();
 await check('Modern logo, local font, visible version, and larger date',async()=>{
   assert.equal(await page.locator('.brand .refreshed-logo').count(),1);assert.equal(await page.getByRole('link',{name:'GoogleRefreshed version '+require('./extension/manifest.json').version}).count(),1);assert.equal(await page.locator('.date i').count(),0);assert.equal(await page.locator('.search-box .key').count(),0);
   await page.waitForFunction(()=>{const r=document.querySelector('#still-home').shadowRoot;return getComputedStyle(r.querySelector('.date')).fontSize==='15px'&&getComputedStyle(r.querySelector('h1')).fontFamily.includes('GR Manrope');});
 });
 await check('Hardware card shows model, RAM capacity, real sample deltas and graphs',async()=>{
   await page.frameLocator('#hardware-frame').locator('#cpu-value').filter({hasText:'25%'}).waitFor();
   assert.equal(await page.frameLocator('#hardware-frame').locator('#cpu-model').innerText(),'Example CPU 8-Core');assert.equal(await page.frameLocator('#hardware-frame').locator('#ram-model').innerText(),'32.0 GB physical memory');assert.equal(await page.frameLocator('#hardware-frame').locator('#ram-value').innerText(),'50%');assert.match(await page.frameLocator('#hardware-frame').locator('#hardware-details').innerText(),/8 logical cores/);assert.notEqual(await page.frameLocator('#hardware-frame').locator('#cpu-graph').getAttribute('points'),'0,31 140,31');
 });
 await check('Hardware sampling pauses outside Home',async()=>{
   await page.getByRole('tab',{name:'Weather',exact:true}).click();await page.locator('.temperature').waitFor();const before=await worker.evaluate(()=>hardwareCalls);await page.waitForTimeout(2800);assert.equal(await worker.evaluate(()=>hardwareCalls),before);assert.equal(await page.locator('.weather-svg').count(),6);await page.getByRole('tab',{name:'Home',exact:true}).click();
 });
 await check('Hardware metadata is not stored in extension caches',async()=>{const saved=await worker.evaluate(async()=>JSON.stringify([await chrome.storage.local.get(null),await chrome.storage.session.get(null)]));assert.equal(saved.includes('Example CPU 8-Core'),false);});
 await check('Google page scripts cannot inspect hardware or note frame contents',async()=>{
   const isolated=await page.evaluate(()=>{const host=document.querySelector('#still-home'),frame=host.shadowRoot.querySelector('#hardware-frame');try{void frame.contentWindow.document.body;return false;}catch(error){return error.name==='SecurityError'&&!host.shadowRoot.textContent.includes('Example CPU 8-Core')&&!host.shadowRoot.querySelector('.photo').shadowRoot;}});assert.equal(isolated,true);
 });
 await check('Shortcut cards have direct editing and save custom icon/color/destination',async()=>{
   await page.getByRole('button',{name:'Edit Gmail shortcut',exact:true}).click();await page.getByLabel('Name',{exact:true}).fill('My inbox');await page.getByLabel('Website',{exact:true}).fill('https://example.com/inbox');await page.locator('#link-original').uncheck();await page.locator('#link-glyph').fill('AB');await page.locator('#link-color').fill('#457799');await page.getByRole('button',{name:'Save shortcut'}).click();assert.equal(await page.getByRole('link',{name:/My inbox/}).getAttribute('href'),'https://example.com/inbox');assert.equal(await page.getByRole('link',{name:/My inbox/}).locator('.tile').innerText(),'AB');
 });
 await check('Rich Google autocomplete displays entity photos and descriptions',async()=>{
   await page.getByRole('searchbox',{name:'Search Google',exact:true}).fill('albert');await page.locator('.suggestion-photo').waitFor();assert.equal(await page.locator('.suggestion-photo').count(),1);assert.match(await page.locator('.suggestion-option').first().innerText(),/Example entity/);await page.getByRole('searchbox',{name:'Search Google',exact:true}).press('ArrowDown');assert.equal(await page.getByRole('searchbox',{name:'Search Google',exact:true}).getAttribute('aria-activedescendant'),'suggestion-0');await page.keyboard.press('Escape');await page.getByRole('searchbox',{name:'Search Google',exact:true}).fill('');
 });
 await check('Fonts preview immediately and persist after reload',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByRole('combobox',{name:'Homepage font',exact:true}).selectOption('outfit');
   assert.match(await page.locator('.app').evaluate(x=>getComputedStyle(x).fontFamily),/GR Outfit/);await page.getByRole('button',{name:'Close customization'}).click();await page.waitForTimeout(250);await home();assert.match(await page.locator('.app').evaluate(x=>getComputedStyle(x).fontFamily),/GR Outfit/);
 });
 await check('All 17 themes and both appearance modes remain selectable',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();assert.equal(await page.locator('[data-theme-choice]').count(),17);
   for(const theme of await page.locator('[data-theme-choice]').all()){await theme.click();for(const appearance of ['light','dark']){await page.locator(`[data-appearance-choice=${appearance}]`).click();assert.equal(await page.locator('.app').getAttribute('data-appearance'),appearance);}}
   await page.getByRole('button',{name:'Aurora',exact:true}).click();await page.getByRole('button',{name:'Dark',exact:true}).click();await page.getByRole('combobox',{name:'Homepage font',exact:true}).selectOption('manrope');await page.getByRole('button',{name:'Close customization'}).click();
 });
 await check('Mystic and Solar use distinct palettes and animated atmospheres',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByRole('button',{name:'Mystic',exact:true}).click();const mystic=await page.locator('.app').evaluate(x=>({world:x.dataset.world,bg:getComputedStyle(x).backgroundColor}));await page.getByRole('button',{name:'Solar',exact:true}).click();const solar=await page.locator('.app').evaluate(x=>({world:x.dataset.world,bg:getComputedStyle(x).backgroundColor}));assert.notEqual(mystic.bg,solar.bg);assert.equal(mystic.world,'mystic');assert.equal(solar.world,'solar');assert.match(await page.locator('.wash').evaluate(x=>getComputedStyle(x).animationName),/ambient-travel/);await page.getByRole('button',{name:'Close customization'}).click();
 });
 await check('Animation toggle and reduced-motion preference work',async()=>{
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='off');assert.equal(await page.locator('.wash').evaluate(x=>getComputedStyle(x).animationName),'none');await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='on');
 });
 await check('Local photo news displays actual feed thumbnails and safe links',async()=>{
   await page.getByRole('tab',{name:'News',exact:true}).click();await page.locator('.news-thumb').first().waitFor();assert.equal(await page.locator('.news-thumb').count(),6);assert.equal(await page.locator('.news-item').count(),6);assert.equal(await page.locator('.news-item').first().getAttribute('href'),'https://example.com/story-1');assert.equal(await page.locator('.news-thumb').first().getAttribute('referrerpolicy'),'no-referrer');
 });
 await check('Show more appends cached articles without another request',async()=>{
   const before=await worker.evaluate(()=>networkCalls.length);await page.getByRole('button',{name:'Show more articles',exact:false}).click();assert.equal(await page.locator('.news-item').count(),12);assert.equal(await worker.evaluate(()=>networkCalls.length),before);await page.getByRole('button',{name:'Show more articles',exact:false}).click();assert.equal(await page.locator('.news-item').count(),14);assert.equal(await page.locator('#more-news').isVisible(),false);
 });
 await check('Photos can be switched off without huge placeholders',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByRole('checkbox',{name:'Show news images',exact:true}).uncheck();await page.getByRole('button',{name:'Close customization'}).click();await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelectorAll('.news-thumb,.news-art').length===0);
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByRole('checkbox',{name:'Show news images',exact:true}).check();await page.getByRole('button',{name:'Close customization'}).click();
 });
 await check('News failure keeps a clear recovery path',async()=>{
   await worker.evaluate(()=>globalThis.newsFailure=true);await page.getByRole('button',{name:'Refresh headlines',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('#news-status').textContent.includes('news source below'));await worker.evaluate(()=>globalThis.newsFailure=false);
 });
 await check('Matching native browser theme downloads a valid static manifest',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Download matching browser theme',exact:true}).click();const file=await (await pending).path();const theme=JSON.parse(fs.readFileSync(file));assert.equal(theme.manifest_version,3);assert.equal(theme.theme.colors.frame.length,3);assert.equal(theme.content_scripts,undefined);await page.getByRole('button',{name:'Aurora',exact:true}).click();await page.getByRole('button',{name:'Dark',exact:true}).click();await page.getByRole('button',{name:'Close customization'}).click();
 });
 await page.getByRole('tab',{name:'Home',exact:true}).click();await page.waitForTimeout(250);
 await check('Google result pages retain the selected theme and native functionality',async()=>{
   await page.goto('https://www.google.com/search?q=example');await page.waitForFunction(()=>document.documentElement.dataset.grTheme==='aurora');assert.equal(await page.locator('#still-home').count(),0);assert.equal(await page.getByRole('heading',{name:'Native Google result'}).count(),1);assert.equal(await page.locator('#fixture-native').evaluate(x=>x.inert),false);assert.equal(await page.locator('#gr-results-home').count(),1);await page.getByRole('textbox',{name:'Original Google search'}).fill('still functional');
 });
 await check('Result theming can be disabled without covering Google',async()=>{
   await worker.evaluate(async()=>{const saved=(await chrome.storage.local.get('stillSettings')).stillSettings;await chrome.storage.local.set({stillSettings:{...saved,resultsTheme:false}});});await page.waitForFunction(()=>!document.documentElement.dataset.grTheme);assert.equal(await page.locator('#gr-results-home').count(),0);await home();
 });
 await check('Image-search button keeps a proper Google Images destination',async()=>{
   await page.getByRole('searchbox',{name:'Search Google',exact:true}).fill('mountains');await Promise.all([page.waitForURL('https://www.google.com/search?q=mountains&udm=2'),page.getByRole('button',{name:'Search images',exact:true}).click()]);await home();
 });
 await check('Responsive homepage and settings fit smaller screens',async()=>{
   for(const width of [1440,650,390,320]){await page.setViewportSize({width,height:width>650?1000:844});assert.equal(await page.locator('.app').evaluate(x=>x.scrollWidth<=x.clientWidth+1),true,'home '+width);await page.getByRole('button',{name:'Customize',exact:true}).click();assert.equal(await page.locator('#settings').evaluate(x=>x.scrollWidth<=x.clientWidth+1),true,'settings '+width);await page.getByRole('button',{name:'Close customization'}).click();}
 });
 await page.setViewportSize({width:1440,height:1160});fs.mkdirSync(path.join(root,'docs'),{recursive:true});
 for(const theme of ['aurora','mystic','solar','paper','futuristic','autumn']){await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByRole('button',{name:theme[0].toUpperCase()+theme.slice(1),exact:true}).click();await page.locator('[data-appearance-choice='+(theme==='paper'?'light':'dark')+']').click();await page.getByRole('button',{name:'Close customization'}).click();await page.locator('.app').evaluate(x=>x.scrollTop=0);await page.screenshot({path:path.join(root,'docs/v12-'+theme+'.png'),animations:'disabled'});}
 for(const name of ['paper','mystic','autumn','futuristic'])fs.copyFileSync(path.join(root,'docs/v12-'+name+'.png'),path.join(root,'docs/'+name+'.png'));await page.getByRole('button',{name:'Customize',exact:true}).click();await page.locator('#settings').evaluate(x=>x.scrollTop=0);await page.screenshot({path:path.join(root,'docs/customize.png'),animations:'disabled'});await page.getByRole('button',{name:'Close customization'}).click();await page.setViewportSize({width:390,height:844});await page.locator('.app').evaluate(x=>x.scrollTop=0);await page.screenshot({path:path.join(root,'docs/mobile.png'),animations:'disabled'});
 assert.deepEqual(errors,[]);console.log(`${checks.length} v1.2 checks passed.`);await context.close();
})().catch(async error=>{console.error(error);if(context)await context.close();process.exitCode=1;});
