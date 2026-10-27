// Opt-in preference sync through the browser's storage service. No custom server.
(() => {
  'use strict';
  const key='grPreferencesV1',stateKey='grSyncState';
  const booleans=['animations','clock','focus','shortcutsVisible','weatherEnabled','newsEnabled','autoLocation','localNews','newsLanguageAuto','colorfulWeather','newsImages','suggestionImages','resultsTheme','hour24','newTab','compact','suggestions'];
  const choices={font:['manrope','inter','outfit','system','serif'],appearance:['light','dark','system'],homeCard:['hardware','note'],newsSource:['google','bing','bbc','guardian'],units:['celsius','fahrenheit'],newsLanguage:['en','he','de','fr','ja'],newsTopic:['local','top','world','technology','business','science','sports','health','entertainment','custom'],activeGroup:['personal','work','study','all']};
  function preferences(value={}){
    const out={};if(!value||typeof value!=='object'||Array.isArray(value))return out;
    for(const name of booleans)if(typeof value[name]==='boolean')out[name]=value[name];
    for(const [name,options]of Object.entries(choices))if(options.includes(value[name]))out[name]=value[name];
    if(typeof value.theme==='string'&&/^[a-z-]{1,30}$/.test(value.theme))out.theme=value.theme;
    if(/^#[a-f\d]{6}$/i.test(value.accent))out.accent=value.accent;
    if(/^[A-Z]{2}$/.test(value.newsRegion))out.newsRegion=value.newsRegion;
    if(typeof value.newsQuery==='string')out.newsQuery=value.newsQuery.slice(0,150);
    if([3,6,9].includes(value.newsCount))out.newsCount=value.newsCount;
    if(Array.isArray(value.shortcuts))out.shortcuts=value.shortcuts.slice(0,36).flatMap(item=>{
      try{const url=new URL(item.url);if(!['https:','http:'].includes(url.protocol)||url.username||url.password)return [];
        return [{name:String(item.name||'Website').slice(0,28),url:url.href,color:/^#[a-f\d]{6}$/i.test(item.color)?item.color:'#787a6d',glyph:String(item.glyph||'W').slice(0,2),group:['personal','work','study'].includes(item.group)?item.group:'personal',iconMode:item.iconMode==='text'?'text':'auto'}];
      }catch{return [];}
    });
    // Exclude name, notes, photo bytes, city/coordinates, samples and metadata.
    return out;
  }
  let queue=Promise.resolve(),timer;
  const serial=fn=>{const next=queue.catch(()=>{}).then(fn);queue=next;return next;};
  const readState=async()=>({enabled:false,...(await chrome.storage.local.get(stateKey))[stateKey]});
  const saveState=state=>chrome.storage.local.set({[stateKey]:state});
  async function receive(bundle){
    const state=await readState();if(!state.enabled||bundle?.schema!==1||!Number.isFinite(bundle.at)||!bundle.preferences)return;
    const prefs=preferences(bundle.preferences),fingerprint=JSON.stringify(prefs);
    if(!Object.keys(prefs).length||bundle.at<=(state.lastStamp||0)||fingerprint===state.fingerprint)return;
    const local=(await chrome.storage.local.get('stillSettings')).stillSettings||{};
    await saveState({...state,fingerprint,lastStamp:bundle.at,lastReceived:Date.now(),error:''});
    await chrome.storage.local.set({stillSettings:{...local,...prefs}});
  }
  async function publish(){
    const state=await readState();if(!state.enabled)return;
    try{
      if(!chrome.storage.sync)throw new Error('This browser does not expose settings sync. Use Export / Import instead.');
      const prefs=preferences((await chrome.storage.local.get('stillSettings')).stillSettings),fingerprint=JSON.stringify(prefs);
      if(fingerprint===state.fingerprint)return;
      const bundle={schema:1,at:Math.max(Date.now(),(state.lastStamp||0)+1),preferences:prefs};
      if(new TextEncoder().encode(key+JSON.stringify(bundle)).length>7800)throw new Error('These preferences exceed the browser’s 8 KB sync-item limit. Shorten your shortcuts or use Export / Import.');
      await chrome.storage.sync.set({[key]:bundle});
      await saveState({...state,fingerprint,lastStamp:bundle.at,lastSaved:Date.now(),error:''});
    }catch(error){await saveState({...state,error:error.message||'Browser sync could not save. Try again later.'});}
  }
  async function status(){const state=await readState();return {ok:true,data:{enabled:state.enabled,available:!!chrome.storage.sync,id:chrome.runtime.id,lastSaved:state.lastSaved||null,lastReceived:state.lastReceived||null,error:state.error||''}};}
  async function request(message){
    return serial(async()=>{
      if(message.type==='browserSyncEnable'){
        if(typeof message.enabled!=='boolean')throw new Error('Choose whether to enable browser sync.');
        const state=await readState();await saveState({...state,enabled:message.enabled,error:''});
      }
      if(message.type!=='browserSyncStatus'){
        const state=await readState();if(state.enabled){
          try{const bundle=(await chrome.storage.sync.get(key))[key];if(bundle)await receive(bundle);await publish();}
          catch(error){await saveState({...await readState(),error:error.message||'Browser sync is unavailable.'});}
        }
      }
      return status();
    });
  }
  chrome.storage.onChanged.addListener((changes,area)=>{
    if(area==='sync'&&changes[key]?.newValue)serial(()=>receive(changes[key].newValue));
    if(area==='local'&&changes.stillSettings){clearTimeout(timer);timer=setTimeout(()=>serial(publish),650);}
  });
  serial(async()=>{const state=await readState();if(!state.enabled)return;try{const bundle=(await chrome.storage.sync.get(key))[key];if(bundle)await receive(bundle);await publish();}catch(error){await saveState({...await readState(),error:error.message||'Browser sync is unavailable.'});}});
  globalThis.GoogleRefreshedSync={request,preferences};
})();
