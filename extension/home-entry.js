// Leave the browser-managed New Tab wrapper for this extension's full-page UI.
// getCurrent/update need no tab-reading permission and target only our own tab.
(() => {
  const params=new URLSearchParams(location.search);
  const marker='searchscape-standalone';
  if(params.get('standalone')==='1'){try{sessionStorage.setItem(marker,'1');}catch{}return;}
  try{if(sessionStorage.getItem(marker)==='1'&&window.top===window)return;}catch{}
  chrome.tabs.getCurrent().then(tab=>{
    if(!tab?.id)return;
    const target=new URL(chrome.runtime.getURL('home.html'));
    target.searchParams.set('standalone','1');
    if(params.get('still')==='customize')target.searchParams.set('still','customize');
    if(params.get('section')==='private')target.searchParams.set('section','private');
    return chrome.tabs.update(tab.id,{url:target.href});
  }).catch(()=>{});
})();
