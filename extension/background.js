importScripts('data.js','sync.js');
// Event-driven requests only. No background polling or permanent connection.
const newTabPermission={permissions:['tabs']},newTabPage=/^(?:chrome|brave):\/\/(?:newtab|new-tab-page)\/?$/;
// Opt-in private-tab navigation; ordinary tabs use the manifest's new-tab page.
// Only browser-owned new-tab URLs qualify. Never inspect or retain search text.
const redirectingPrivateTabs=new Set();
async function openPrivateHomepage(tab){
  if(!tab.incognito||!newTabPage.test(tab.pendingUrl||tab.url||'')||redirectingPrivateTabs.has(tab.id))return;
  redirectingPrivateTabs.add(tab.id);
  try{
    if(!await chrome.permissions.contains(newTabPermission))return;
    if((await chrome.storage.local.get('stillSettings')).stillSettings?.newTabHome!==true)return;
    // Recheck after async work so a link opened in the meantime is never replaced.
    const current=await chrome.tabs.get(tab.id);
    if(current.incognito&&newTabPage.test(current.pendingUrl||current.url||'')){
      await chrome.tabs.update(tab.id,{url:chrome.runtime.getURL('home.html?standalone=1')});
    }
  }catch{/* A closed tab, revoked permission or unavailable private context is left alone. */}
  finally{redirectingPrivateTabs.delete(tab.id);}
}
chrome.tabs.onCreated.addListener(openPrivateHomepage);
chrome.tabs.onUpdated.addListener((id,change,tab)=>{if(change.url)openPrivateHomepage(tab);});
async function respondTo(message,signal){
  if(message?.type==='openExtensions'){await chrome.tabs.create({url:'chrome://extensions/'});return {ok:true};}
  if(['browserSyncStatus','browserSyncEnable','browserSyncNow'].includes(message?.type))return SearchscapeSync.request(message);
  if(message?.type==='newTabHomeStatus')return {ok:true,granted:await chrome.permissions.contains(newTabPermission)};
  if(message?.type==='newTabHome'){
    if(!message.enabled){await chrome.permissions.remove(newTabPermission);return {ok:true,granted:false};}
    if(await chrome.permissions.contains(newTabPermission))return {ok:true,granted:true};
    // A permission prompt needs a click on an extension page, so a small window asks for it.
    await chrome.windows.create({url:chrome.runtime.getURL('newtab-permission.html'),type:'popup',width:380,height:480});
    return {ok:true,granted:false};
  }
  if(message?.type==='hardware'){
    const [cpu,memory]=await Promise.all([chrome.system.cpu.getInfo(),chrome.system.memory.getInfo()]);
    return {ok:true,data:{cpu:{cores:cpu.numOfProcessors,model:cpu.modelName,temperature:cpu.temperatures?.filter(Number.isFinite).at(0)??null,total:cpu.processors.reduce((sum,p)=>sum+p.usage.total,0),idle:cpu.processors.reduce((sum,p)=>sum+p.usage.idle,0)},memory:{total:memory.capacity,available:memory.availableCapacity}},at:Date.now()};
  }
  if(!['suggestions','location','cities','weather','news'].includes(message?.type))throw new Error('Unsupported data request.');
  // Search prefixes never enter extension storage or the persistent data cache.
  if(message.type==='suggestions')return {ok:true,data:await SearchscapeData(message,signal),at:Date.now()};
  const {force,...request}=message;
  const key=message.type==='location'?'location:current':'data:'+JSON.stringify(request);
  if(message.type!=='cities'&&!force){
    const saved=(await chrome.storage.session.get(key))[key];
    if(saved&&Date.now()-saved.at<(message.type==='location'?24*60:20)*60000)return {ok:true,data:saved.data,cached:true,at:saved.at};
  }
  const data=await SearchscapeData(message,signal),at=Date.now();
  if(message.type!=='cities'){
    const all=await chrome.storage.session.get(null),keys=Object.keys(all).filter(x=>x.startsWith('data:'));
    if(keys.length>=4)await chrome.storage.session.remove(keys.sort((a,b)=>all[a].at-all[b].at).slice(0,keys.length-3));
    await chrome.storage.session.set({[key]:{at,data}});
  }
  return {ok:true,data,at};
}
chrome.runtime.onConnect.addListener(port=>{
  if(port.name!=='searchscape-data'||port.sender?.id!==chrome.runtime.id){port.disconnect();return;}
  let connected=true;const controller=new AbortController();port.onDisconnect.addListener(()=>{connected=false;controller.abort();});
  port.onMessage.addListener(message=>{
    respondTo(message,controller.signal).catch(error=>({ok:false,error:error.message||'This source is currently unavailable.'})).then(result=>{if(connected)try{port.postMessage(result);}catch{/* The requesting tab may have closed. */}});
  });
});
