// Isolated event tests: no browser profile or permission changes.
const vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
let created,updated,granted=true,enabled=true,current,changes=[],reads=0;
const chrome={
  permissions:{contains:async()=>granted},
  storage:{local:{get:async()=>{reads++;return {stillSettings:{newTabHome:enabled}};}}},
  runtime:{getURL:p=>'chrome-extension://fixture/'+p,onConnect:{addListener(){}}},
  tabs:{onCreated:{addListener:f=>created=f},onUpdated:{addListener:f=>updated=f},get:async()=>current,update:async(id,value)=>changes.push({id,...value})}
};
const scope={chrome,importScripts(){},Set,AbortController};vm.createContext(scope);
vm.runInContext(fs.readFileSync('extension/background.js','utf8'),scope);
const tab=(url,incognito=true)=>({id:1,url,incognito});
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 current=tab('chrome://newtab/');await created(current);assert.equal(changes.length,1);assert.equal(changes[0].url,'chrome-extension://fixture/home.html?standalone=1');console.log('PASS Private new-tab events target the local standalone homepage');
 changes=[];for(const url of ['about:blank','https://example.test/','https://example.test/search?q=private','chrome://settings/','chrome://newtab/other'])await created(tab(url));await created(tab('chrome://newtab/',false));assert.equal(changes.length,0);console.log('PASS Normal tabs, blank pages, searches, links and other internal pages remain untouched');
 current=tab('chrome://newtab/');granted=false;await created(current);assert.equal(changes.length,0);granted=true;enabled=false;await created(current);assert.equal(changes.length,0);enabled=true;console.log('PASS Both the opt-in setting and optional permission are required');
 current=tab('https://example.test/changed-before-read');await created(tab('chrome://newtab/'));assert.equal(changes.length,0);console.log('PASS Navigation races cannot replace a newly opened link');
 current=tab('brave://newtab/');updated(1,{url:current.url},current);await tick();assert.equal(changes.length,1);console.log('PASS URL-update events handle private tabs whose address arrives late');
 changes=[];const before=reads;await Promise.all([created(current),created(current)]);assert.equal(changes.length,1);assert.equal(reads-before,1);console.log('PASS Duplicate events produce one redirect without polling or stored URLs');
})().catch(e=>{console.error(e);process.exitCode=1;});
