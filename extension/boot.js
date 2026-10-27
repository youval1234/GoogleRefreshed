(() => {
  'use strict';
  const params=new URLSearchParams(location.search);
  const home=['/','/webhp'].includes(location.pathname)&&!['q','tbm','udm'].some(key=>params.has(key));
  let released=false,observer;
  const style=document.createElement('style');style.id='gr-startup-style';
  style.textContent=`html[data-gr-boot=home],html[data-gr-boot=home] body{background:var(--gr-boot-bg,#f5f4ed)!important}html[data-gr-boot=home] body>*{visibility:hidden!important}@media(prefers-color-scheme:dark){html[data-gr-boot=home]{--gr-boot-bg:#171e20}}`;
  function release(){released=true;clearTimeout(failOpen);observer?.disconnect();delete document.documentElement?.dataset.grBoot;style.remove();}
  function install(){if(!document.documentElement||released)return;if(home){document.documentElement.dataset.grBoot='home';document.documentElement.append(style);}observer?.disconnect();}
  const failOpen=setTimeout(release,2500);
  if(document.documentElement)install();else{observer=new MutationObserver(install);observer.observe(document,{childList:true});}
  const ready=chrome.storage.local.get('stillSettings').then(result=>{
    const settings=result.stillSettings||{};
    const set=()=>{if(document.documentElement){const {colors}=GoogleRefreshed.palette(settings);document.documentElement.style.setProperty('--gr-boot-bg',colors[0]);}};
    if(document.documentElement)set();else document.addEventListener('DOMContentLoaded',set,{once:true});
    return settings;
  }).catch(()=>({}));
  globalThis.GoogleRefreshedBoot={ready,release};
})();
