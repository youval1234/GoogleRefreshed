importScripts('data.js');
// Event-driven requests only. No background polling or permanent connection.
async function respondTo(message,signal){
  if(!['suggestions','location','cities','weather','news'].includes(message?.type))throw new Error('Unsupported data request.');
  // Search prefixes never enter extension storage or the persistent data cache.
  if(message.type==='suggestions')return {ok:true,data:await GoogleRefreshedData(message,signal),at:Date.now()};
  const {force,...request}=message;
  const key=message.type==='location'?'location:current':'data:'+JSON.stringify(request);
  if(message.type!=='cities'&&!force){
    const saved=(await chrome.storage.session.get(key))[key];
    if(saved&&Date.now()-saved.at<(message.type==='location'?24*60:20)*60000)return {ok:true,data:saved.data,cached:true,at:saved.at};
  }
  const data=await GoogleRefreshedData(message,signal),at=Date.now();
  if(message.type!=='cities'){
    const all=await chrome.storage.session.get(null),keys=Object.keys(all).filter(x=>x.startsWith('data:'));
    if(keys.length>=4)await chrome.storage.session.remove(keys.sort((a,b)=>all[a].at-all[b].at).slice(0,keys.length-3));
    await chrome.storage.session.set({[key]:{at,data}});
  }
  return {ok:true,data,at};
}
chrome.runtime.onConnect.addListener(port=>{
  if(port.name!=='google-refreshed-data'||port.sender?.id!==chrome.runtime.id){port.disconnect();return;}
  let connected=true;const controller=new AbortController();port.onDisconnect.addListener(()=>{connected=false;controller.abort();});
  port.onMessage.addListener(message=>{
    respondTo(message,controller.signal).catch(error=>({ok:false,error:error.message||'This source is currently unavailable.'})).then(result=>{if(connected)port.postMessage(result);});
  });
});
