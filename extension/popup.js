(() => {
  'use strict';
  const root=document.documentElement,system=matchMedia('(prefers-color-scheme: dark)');let settings={};
  const luminance=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
  function render(value={}){
    settings=value;const {theme,dark,colors,accent}=Searchscape.palette(settings);
    root.style.colorScheme=dark?'dark':'light';
    const muted=contrast(colors[2],colors[0])>=4.5&&contrast(colors[2],colors[4])>=4.5?colors[2]:colors[1];
    const visibleAccent=contrast(accent,colors[4])>=3?accent:colors[1];
    for(const [key,value]of Object.entries({bg:colors[0],fg:colors[1],muted,line:colors[3],soft:colors[4],accent:visibleAccent}))root.style.setProperty('--popup-'+key,value);
    root.style.setProperty('--popup-font',Searchscape.loadFont('manrope'));
    document.body.dataset.motion=settings.animations===false?'off':'on';
    document.getElementById('popup-mark').innerHTML=Searchscape.logo;
    const engine=Searchscape.engines.find(e=>e.id===settings.engine)||Searchscape.engines[0],ecosystem=Searchscape.ecosystems.find(e=>e.id===settings.ecosystem)||Searchscape.ecosystems[0];
    document.getElementById('engine-label').textContent='Search with '+engine.name;
    document.getElementById('theme-label').textContent=theme.name+' · '+(dark?'Dark':'Light');
    document.getElementById('ecosystem-label').textContent=ecosystem.name+' services';
    document.getElementById('private-window').hidden=!chrome.extension.inIncognitoContext;
    document.getElementById('popup-version').textContent='v'+chrome.runtime.getManifest().version;
    Promise.all([chrome.extension.isAllowedIncognitoAccess(),chrome.permissions.contains({permissions:['tabs']})]).then(([allowed,tabs])=>{if(settings!==value)return;document.getElementById('private-status').textContent=!allowed?'Enable private access':settings.newTabHome&&tabs?'Automatic opening on':'Set up automatic opening';}).catch(()=>{});
  }
  document.getElementById('open-private-home').onclick=async e=>{
    const status=document.getElementById('private-launch-status');e.currentTarget.disabled=true;
    try{
      if(!await chrome.extension.isAllowedIncognitoAccess()){status.hidden=false;status.textContent='Enable Allow in Private in Searchscape’s extension details first, then restart Brave if needed.';return;}
      const url=chrome.runtime.getURL('home.html?standalone=1');
      if(chrome.extension.inIncognitoContext){const current=await chrome.windows.getCurrent();await chrome.tabs.create({windowId:current.id,url});}
      else await chrome.windows.create({incognito:true,url});
      window.close();
    }catch(error){status.hidden=false;status.textContent=error.message||'Could not open the private homepage.';}
    finally{document.getElementById('open-private-home').disabled=false;}
  };
  chrome.storage.local.get('stillSettings').then(data=>render(data.stillSettings||{})).catch(()=>render());
  chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.stillSettings)render(changes.stillSettings.newValue||{});});
  system.addEventListener('change',()=>{if(!settings.appearance||settings.appearance==='system')render(settings);});
})();
