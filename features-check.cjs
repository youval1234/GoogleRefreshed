const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('assert/strict'),path=require('path'),fs=require('fs');
const ext=path.resolve(__dirname,'extension'),checks=[];let context;
async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
(async()=>{
 context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(__dirname,'.test-profile-features-')),{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,viewport:{width:1440,height:1000},timezoneId:'Asia/Jerusalem',args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');await worker.evaluate(()=>Promise.all([chrome.storage.local.clear(),chrome.storage.session.clear()]));
 await context.route('https://www.google.com/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>Google</title><body><input aria-label="Original search"></body>'}));
 let cityCalls=0,weatherCalls=0,newsCalls=0,locationCalls=0;
 await context.route('https://ipwho.is/**',r=>{locationCalls++;return r.fulfill({json:{success:true,city:'London',region:'England',country:'United Kingdom',country_code:'GB',latitude:51.5,longitude:-.12}});});
 await context.route('https://geocoding-api.open-meteo.com/**',r=>{cityCalls++;return r.fulfill({json:{results:[{name:'London',admin1:'England',country:'United Kingdom',latitude:51.5,longitude:-.12}]}});});
 const weather={current:{temperature_2m:18,apparent_temperature:17,weather_code:2,is_day:1,wind_speed_10m:10},daily:{time:['2026-10-27','2026-10-28','2026-10-29','2026-10-30','2026-10-31'],weather_code:[2,3,0,61,2],temperature_2m_max:[19,20,18,16,17],temperature_2m_min:[12,13,10,11,12]}};
 await context.route('https://api.open-meteo.com/**',r=>{weatherCalls++;const data=JSON.parse(JSON.stringify(weather));if(new URL(r.request().url()).searchParams.get('temperature_unit')==='fahrenheit')data.current.temperature_2m=64;return r.fulfill({json:data});});
 const rss='<?xml version="1.0"?><rss><channel><item><title>A synthetic technology headline</title><link>https://news.google.com/rss/articles/test-one</link><source>Example Publisher</source><pubDate>Tue, 27 Oct 2026 09:00:00 GMT</pubDate></item><item><title>&lt;img src=x onerror=alert(1)&gt; stays text</title><link>https://news.google.com/rss/articles/test-two</link><source>Second Publisher</source></item><item><title>Rejected link</title><link>javascript:alert(1)</link></item></channel></rss>';
 await context.route('https://news.google.com/**',r=>{newsCalls++;return r.fulfill({contentType:'application/xml',body:rss});});
 // Fixture the network boundary inside the actual worker. This also works in
 // Brave versions where Playwright does not route extension-worker requests.
 await context.route('https://ichef.bbci.co.uk/**',r=>r.fulfill({contentType:'image/png',body:fs.readFileSync(path.join(ext,'icons/services/google.png'))}));
 await worker.evaluate(({weather,rss})=>{
   globalThis.fixtureCalls={cityCalls:0,weatherCalls:0,newsCalls:0,locationCalls:0,suggestionCalls:0};
   globalThis.fetch=async input=>{
     const url=new URL(String(input));let data;
     if(url.hostname==='suggestqueries.google.com'){fixtureCalls.suggestionCalls++;const q=url.searchParams.get('q');data=[q,[q+' github',q+' search',q+' tips']];}
     else if(url.hostname==='ipwho.is'){fixtureCalls.locationCalls++;data={success:true,city:'London',region:'England',country:'United Kingdom',country_code:'GB',latitude:51.5,longitude:-.12};}
     else if(url.hostname==='geocoding-api.open-meteo.com'){fixtureCalls.cityCalls++;data={results:[{name:'London',admin1:'England',country:'United Kingdom',latitude:51.5,longitude:-.12}]};}
     else if(url.hostname==='api.open-meteo.com'){fixtureCalls.weatherCalls++;data=JSON.parse(JSON.stringify(weather));if(url.searchParams.get('temperature_unit')==='fahrenheit')data.current.temperature_2m=64;}
     else if(url.hostname==='news.google.com'){fixtureCalls.newsCalls++;return new Response(globalThis.fixtureNewsFails?'Unavailable':rss,{status:globalThis.fixtureNewsFails?503:200,headers:{'Content-Type':'application/xml'}});}
     else if(url.hostname==='feeds.bbci.co.uk'){return new Response(rss.replace('<rss>','<rss xmlns:media="http://search.yahoo.com/mrss/">').replaceAll('https://news.google.com/rss/articles/','https://www.bbc.com/news/articles/').replaceAll('</source>','</source><media:thumbnail url="https://ichef.bbci.co.uk/news/fixture.jpg" width="460" height="250"/>'),{headers:{'Content-Type':'application/xml'}});}
     else throw new Error('Unexpected fixture request');
     return new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});
   };
 },{weather,rss});
 const counts=()=>worker.evaluate(()=>globalThis.fixtureCalls);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('https://www.google.com/');await page.locator('#still-home').waitFor();
 const root=()=>document.querySelector('#still-home').shadowRoot;
 await check('Home makes no location, weather or news requests',async()=>{assert.equal(Object.values(await counts()).reduce((a,b)=>a+b,0),0);});
 await check('Official service icons load from the extension',async()=>{await page.waitForFunction(()=>[...document.querySelector('#still-home').shadowRoot.querySelectorAll('.service-icon')].every(x=>x.complete&&x.naturalWidth>0));assert.equal(await page.locator('.service-icon').count(),14);});
 await check('All 16 themes support light and dark mode',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();
   assert.equal(await page.locator('[data-theme-choice]').count(),16);
   for(const theme of await page.locator('[data-theme-choice]').all()){
     const id=await theme.getAttribute('data-theme-choice');await theme.click();
     for(const appearance of ['light','dark']){
       await page.locator(`[data-appearance-choice=${appearance}]`).click();
       const state=await page.evaluate(()=>{const a=document.querySelector('#still-home').shadowRoot.querySelector('.app');return{theme:a.dataset.theme,appearance:a.dataset.appearance,overflow:a.scrollWidth>a.clientWidth+1};});
       assert.equal(state.theme,id);assert.equal(state.appearance,appearance);assert.equal(state.overflow,false);
     }
   }
   await page.getByRole('button',{name:'Paper',exact:true}).click();await page.locator('[data-appearance-choice=light]').click();await page.getByRole('button',{name:'Close customization'}).click();
 });
 await check('Quick appearance switch and system preference work',async()=>{
   await page.getByRole('button',{name:'Switch to dark mode',exact:true}).click();assert.equal(await page.locator('.app').getAttribute('data-appearance'),'dark');
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.locator('[data-appearance-choice=system]').click();await page.emulateMedia({colorScheme:'light'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.appearance==='light');await page.emulateMedia({colorScheme:'dark'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.appearance==='dark');
   await page.locator('[data-appearance-choice=light]').click();await page.getByRole('button',{name:'Close customization'}).click();
 });
 await check('Reduced-motion preference and animation switch are respected',async()=>{
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='off');await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').dataset.motion==='on');
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByLabel('Animations & ambient effects').uncheck();assert.equal(await page.locator('.app').getAttribute('data-motion'),'off');await page.getByLabel('Animations & ambient effects').check();await page.getByRole('button',{name:'Close customization'}).click();
 });
 await check('Shortcut groups keep Work, Study, and Personal links separate',async()=>{
   await page.getByLabel('Shortcut group',{exact:true}).selectOption('work');assert.equal(await page.locator('#panel-home .shortcut-grid a').count(),0);
   await page.getByRole('button',{name:'Add shortcut',exact:true}).click();await page.getByLabel('Name',{exact:true}).fill('Work example');await page.getByLabel('Website',{exact:true}).fill('example.com');assert.equal(await page.locator('#link-group').inputValue(),'work');await page.getByRole('button',{name:'Save shortcut'}).click();assert.equal(await page.locator('#panel-home .shortcut-grid a').count(),1);
   await page.getByLabel('Shortcut group',{exact:true}).selectOption('personal');assert.equal(await page.locator('#panel-home .shortcut-grid a').count(),5);
 });
 await check('Ctrl+K palette searches and executes commands with the keyboard',async()=>{
   await page.keyboard.press('Control+k');await page.getByRole('combobox',{name:'Find a command or shortcut'}).fill('Theme: Futuristic');await page.keyboard.press('Enter');assert.equal(await page.locator('.app').getAttribute('data-theme'),'futuristic');
   await page.keyboard.press('Control+k');await page.getByRole('combobox',{name:'Find a command or shortcut'}).fill('Appearance: dark');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');assert.equal(await page.locator('.app').getAttribute('data-appearance'),'dark');
 });
 await check('Weather automatically finds an approximate city and shows its forecast',async()=>{
   await page.getByRole('tab',{name:'Weather',exact:true}).click();await page.locator('.temperature').waitFor();assert.equal(await page.locator('.temperature').innerText(),'18°C');assert.equal(await page.locator('.forecast-day').count(),5);assert.equal((await counts()).weatherCalls,1);assert.equal((await counts()).locationCalls,1);
   await page.getByRole('button',{name:'Change city',exact:true}).click();await page.getByLabel('Weather city',{exact:true}).fill('London');await page.getByRole('button',{name:'Find city',exact:true}).click();await page.getByRole('button',{name:'London, England, United Kingdom',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('#weather-status').textContent==='');assert.equal((await counts()).cityCalls,1);
 });
 await check('Weather uses clear SVG condition icons with a monochrome option',async()=>{
   assert.equal(await page.locator('.weather-svg').count(),6);assert.equal(await page.getByRole('img',{name:'Rain',exact:true}).count(),1);
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByLabel('Colorful weather icons').uncheck();assert.equal(await page.locator('.app').getAttribute('data-weather-color'),'false');await page.getByLabel('Colorful weather icons').check();await page.getByRole('button',{name:'Close customization'}).click();
 });
 await check('Weather cache avoids duplicate calls and units can change',async()=>{
   await page.getByRole('tab',{name:'Home',exact:true}).click();await page.getByRole('tab',{name:'Weather',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('#weather-status').textContent==='');assert.equal((await counts()).weatherCalls,1);
   await page.getByRole('button',{name:'Toggle weather temperature units',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('.temperature').textContent==='64°F');assert.equal((await counts()).weatherCalls,2);
 });
 await check('News loads on demand and renders RSS text safely',async()=>{
   assert.equal((await counts()).newsCalls,0);await page.getByRole('tab',{name:'News',exact:true}).click();await page.locator('.news-item').first().waitFor();assert.equal(await page.locator('.news-item').count(),2);assert.equal(await page.locator('.news-item img').count(),0);assert.match(await page.locator('.news-item').nth(1).innerText(),/<img/);assert.equal((await counts()).newsCalls,1);assert.equal((await counts()).locationCalls,1);assert.equal(await page.locator('#news-region').inputValue(),'GB');
 });
 await check('News topics and caching work',async()=>{
   await page.getByRole('tab',{name:'Home',exact:true}).click();await page.getByRole('tab',{name:'News',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('#news-status').textContent==='');assert.equal((await counts()).newsCalls,1);
   await page.getByLabel('News topic',{exact:true}).selectOption('technology');await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('#news-status').textContent==='');assert.equal((await counts()).newsCalls,2);
 });
 await check('News failures show a useful fallback',async()=>{
   await worker.evaluate(()=>globalThis.fixtureNewsFails=true);await page.getByRole('button',{name:'Refresh headlines',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelector('#news-status').textContent.includes('unavailable'));assert.match(await page.locator('#news-status').innerText(),/news source below/);await worker.evaluate(()=>globalThis.fixtureNewsFails=false);
 });
 await check('Photo news sources show thumbnails and images can be switched off',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByLabel('News source',{exact:true}).selectOption('bbc');await page.getByRole('button',{name:'Close customization'}).click();await page.locator('.news-thumb').first().waitFor();assert.equal(await page.locator('.news-thumb').count(),2);assert.equal(await page.locator('.news-thumb').first().getAttribute('referrerpolicy'),'no-referrer');
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByLabel('Show news images',{exact:true}).uncheck();await page.getByRole('button',{name:'Close customization'}).click();await page.waitForFunction(()=>document.querySelector('#still-home').shadowRoot.querySelectorAll('.news-thumb,.news-art').length===0);
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByLabel('Show news images',{exact:true}).check();await page.getByLabel('News source',{exact:true}).selectOption('google');await page.getByRole('button',{name:'Close customization'}).click();
 });
 await check('Weather and news tabs can be hidden',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByLabel('Show Weather tab').uncheck();await page.getByLabel('Show News tab').uncheck();await page.getByRole('button',{name:'Close customization'}).click();assert.equal(await page.getByRole('tab',{name:'Weather',exact:true}).isVisible(),false);assert.equal(await page.getByRole('tab',{name:'News',exact:true}).isVisible(),false);assert.equal(await page.getByRole('tab',{name:'Home',exact:true}).getAttribute('aria-selected'),'true');
 });
 await check('Update buttons point at the private GitHub release',async()=>{
   await page.getByRole('button',{name:'Customize',exact:true}).click();assert.equal(await page.locator('#check-updates').getAttribute('href'),'https://github.com/youval1234/GoogleRefreshed/releases/latest');
   await page.getByLabel('Show Weather tab').check();await page.getByLabel('Show News tab').check();await page.getByRole('button',{name:'Paper',exact:true}).click();await page.locator('[data-appearance-choice=light]').click();await page.getByRole('button',{name:'Close customization'}).click();
 });
 await check('Google suggestions are debounced, keyboard accessible, and not stored',async()=>{
   const query=page.getByRole('searchbox',{name:'Search Google',exact:true});
   await query.fill('g');await query.fill('go');await query.fill('google');await page.locator('.suggestion-option').first().waitFor();
   assert.equal((await counts()).suggestionCalls,1);assert.equal(await page.locator('.suggestion-option').count(),3);
   await query.press('ArrowDown');assert.equal(await query.getAttribute('aria-activedescendant'),'suggestion-0');await query.press('Escape');assert.equal(await page.locator('#suggestion-popup').isVisible(),false);
   await query.fill('google');await page.locator('.suggestion-option').first().waitFor();assert.equal((await counts()).suggestionCalls,1);
   await query.press('ArrowUp');assert.equal(await query.getAttribute('aria-activedescendant'),'suggestion-2');
   await Promise.all([page.waitForURL('https://www.google.com/search?q=google+tips'),query.press('Enter')]);
   const stored=await worker.evaluate(async()=>Object.keys(await chrome.storage.session.get(null)));assert.equal(stored.some(x=>x.includes('suggestions')),false);
   await page.goto('https://www.google.com/');await page.locator('#still-home').waitFor();
 });
 await check('Suggestions support click selection and can be disabled',async()=>{
   const query=page.getByRole('searchbox',{name:'Search Google',exact:true});await query.fill('browser');await page.locator('.suggestion-option').first().waitFor();
   await Promise.all([page.waitForURL('https://www.google.com/search?q=browser+github'),page.getByRole('option',{name:'browser github',exact:true}).click()]);
   await page.goto('https://www.google.com/');await page.locator('#still-home').waitFor();
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByRole('checkbox',{name:'Google search suggestions',exact:true}).uncheck();await page.getByRole('button',{name:'Close customization'}).click();
   const before=(await counts()).suggestionCalls;await query.fill('disabled');await page.waitForTimeout(350);assert.equal((await counts()).suggestionCalls,before);assert.equal(await page.locator('#suggestion-popup').isVisible(),false);
   await query.fill('');await page.getByRole('button',{name:'Customize',exact:true}).click();await page.getByRole('checkbox',{name:'Google search suggestions',exact:true}).check();await page.getByRole('button',{name:'Close customization'}).click();
 });
 fs.mkdirSync(path.join(__dirname,'docs'),{recursive:true});
 for(const [theme,appearance] of [['paper','light'],['futuristic','dark'],['mystic','dark'],['autumn','light']]){
   await page.getByRole('button',{name:'Customize',exact:true}).click();await page.locator(`[data-theme-choice=${theme}]`).click();await page.locator(`[data-appearance-choice=${appearance}]`).click();await page.getByRole('button',{name:'Close customization'}).click();await page.locator('.app').evaluate(e=>e.scrollTop=0);await page.screenshot({path:path.join(__dirname,`docs/${theme}.png`),animations:'disabled'});
 }
 await page.getByRole('button',{name:'Customize',exact:true}).click();await page.locator('#settings').evaluate(e=>e.scrollTop=0);await page.screenshot({path:path.join(__dirname,'docs/customize.png'),animations:'disabled'});await page.getByRole('button',{name:'Close customization'}).click();
 await page.setViewportSize({width:390,height:844});await page.locator('.app').evaluate(e=>e.scrollTop=0);await page.screenshot({path:path.join(__dirname,'docs/mobile.png'),animations:'disabled'});
 assert.deepEqual(errors,[]);
 const cdp=await context.newCDPSession(page);const heap=await cdp.send('Runtime.getHeapUsage');
 const report={testedIn:'Actual extension loaded in isolated Brave, with controlled data fixtures',checks,jsHeapUsedBytes:heap.usedSize,networkOnHome:'No weather/news requests',limitations:'Live external services are smoke-tested separately; heap measurement uses a controlled fixture and is not total browser memory.'};
 fs.writeFileSync(path.join(__dirname,'feature-verification.json'),JSON.stringify(report,null,2));console.log(`${checks.length} feature checks passed; measured JS heap ${(heap.usedSize/1048576).toFixed(2)} MB.`);await context.close();
})().catch(async e=>{console.error(e);if(context)await context.close();process.exitCode=1;});
