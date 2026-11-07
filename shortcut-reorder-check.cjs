const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const profile=fs.mkdtempSync(path.join(__dirname,'.test-profile-reorder-'));let context;
(async()=>{
 const ext=path.join(__dirname,'extension');context=await chromium.launchPersistentContext(profile,{executablePath:process.env.BRAVE_PATH||'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true,viewport:{width:1280,height:1000},hasTouch:true,args:[`--disable-extensions-except=${ext}`,`--load-extension=${ext}`]});
 const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
 await context.route('https://**/*',r=>r.fulfill({contentType:'text/html',body:'<html><title>Google fixture</title><body>Google</body></html>'}));
 const page=await context.newPage(),names=['Alpha','Hidden','Bravo','Charlie','Delta','Echo','Foxtrot','Golf'];
 const seed=async(animations=true)=>{await worker.evaluate(async({names,animations})=>chrome.storage.local.set({stillSettings:{welcomeComplete:true,animations,activeGroup:'personal',autoLocation:false,weatherEnabled:false,newsEnabled:false,photoNewsMigrated:true,shortcuts:names.map(name=>({name,url:'https://example.test/'+name,group:name==='Hidden'?'work':'personal',iconMode:'text',glyph:name[0]}))}}),{names,animations});};
 const order=()=>page.locator('.shortcut-cell a').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
 const saved=()=>worker.evaluate(async()=>(await chrome.storage.local.get('stillSettings')).stillSettings.shortcuts.map(x=>x.name));
 const cell=name=>page.getByRole('link',{name,exact:true});
 const grip=name=>page.getByRole('button',{name:'Move '+name+' shortcut',exact:true});
 async function drag(from,to,{escape=false,outside=false}={}){
  await cell(from).scrollIntoViewIfNeeded();const a=await cell(from).boundingBox(),b=await cell(to).boundingBox();
  await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:8});
  await page.locator('.shortcut-drag-ghost').waitFor();
  if(escape)await page.keyboard.press('Escape');
  if(outside)await page.mouse.move(5,5);
  await page.mouse.up();await page.waitForTimeout(400);
 }
 await seed();await page.goto('https://www.google.com/');await cell('Alpha').waitFor();
 await drag('Alpha','Charlie');assert.deepEqual(await order(),['Bravo','Charlie','Alpha','Delta','Echo','Foxtrot','Golf']);
 assert.deepEqual(await saved(),['Bravo','Hidden','Charlie','Alpha','Delta','Echo','Foxtrot','Golf']);assert.equal(new URL(page.url()).hostname,'www.google.com');
 await page.reload();await cell('Alpha').waitFor();assert.equal((await order())[2],'Alpha');console.log('PASS Mouse drag reorders, preserves hidden group slots, prevents navigation and persists reload');
 const before=await order();await drag('Bravo','Golf',{escape:true});assert.deepEqual(await order(),before);assert.equal(await page.locator('.shortcut-drag-ghost').count(),0);
 await drag('Bravo','Golf',{outside:true});assert.deepEqual(await order(),before);assert.equal(await page.locator('.shortcut-drag-ghost').count(),0);console.log('PASS Escape and dropping outside the grid restore the original order and clean up the drag');
 await grip('Bravo').focus();await page.keyboard.press('End');await page.waitForTimeout(300);assert.equal((await order()).at(-1),'Bravo');assert.ok(await grip('Bravo').evaluate(e=>e===e.getRootNode().activeElement));await page.keyboard.press('Home');await page.waitForTimeout(300);assert.equal((await order())[0],'Bravo');console.log('PASS Keyboard moves preserve focus and save ordering');
 await page.setViewportSize({width:390,height:800});await grip('Bravo').scrollIntoViewIfNeeded();const a=await grip('Bravo').boundingBox(),b=await cell('Alpha').boundingBox();
 const cdp=await context.newCDPSession(page);const touch=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
 await touch('touchStart',a.x+a.width/2,a.y+a.height/2);await touch('touchMove',b.x+b.width/2,b.y+b.height/2);await page.locator('.shortcut-drag-ghost').waitFor();await touch('touchEnd');await page.waitForTimeout(350);assert.ok((await order()).indexOf('Bravo')>(await order()).indexOf('Alpha'));console.log('PASS Real touch input reorders through the grip on a narrow viewport');
 await seed(false);await page.reload();await grip('Alpha').waitFor();await grip('Alpha').focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(300);assert.equal((await order())[1],'Alpha');assert.equal(await page.locator('.shortcut-cell').evaluateAll(es=>es.flatMap(e=>e.getAnimations()).length),0);console.log('PASS Reordering remains usable with animations disabled');
 await page.getByRole('combobox',{name:'Shortcut group',exact:true}).selectOption('all');await grip('Hidden').focus();await page.keyboard.press('End');await page.waitForTimeout(300);assert.equal((await saved()).at(-1),'Hidden');console.log('PASS All-groups ordering includes every shortcut');
 await page.emulateMedia({reducedMotion:'reduce'});await seed(true);await page.reload();await grip('Alpha').waitFor();await grip('Alpha').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.shortcut-cell').evaluateAll(es=>es.flatMap(e=>e.getAnimations()).length),0);console.log('PASS System reduced motion suppresses reorder animations');
 await worker.evaluate(async()=>{const s=(await chrome.storage.local.get('stillSettings')).stillSettings;s.shortcuts=Array.from({length:45},(_,i)=>({name:'Long '+i,url:'https://example.test/'+i,iconMode:'text'}));await chrome.storage.local.set({stillSettings:s});});
 await grip('Long 0').waitFor();await grip('Long 0').scrollIntoViewIfNeeded();const start=await grip('Long 0').boundingBox();
 await page.mouse.move(start.x+start.width/2,start.y+start.height/2);await page.mouse.down();await page.mouse.move(start.x+start.width/2,785,{steps:6});await page.locator('.shortcut-drag-ghost').waitFor();
 const scroll=()=>page.evaluate(()=>document.querySelector('#still-home').shadowRoot.querySelector('.app').scrollTop);const initialScroll=await scroll();await page.waitForTimeout(250);assert.ok(await scroll()>initialScroll);await page.keyboard.press('Escape');await page.mouse.up();assert.equal(await page.locator('.shortcut-drag-ghost').count(),0);console.log('PASS Long shortcut lists scroll at the viewport edge and cancel cleanly');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(context)await context.close();fs.rmSync(profile,{recursive:true});});
