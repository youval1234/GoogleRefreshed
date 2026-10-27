(() => {
  'use strict';
  const status=document.getElementById('status');
  // A declined prompt turns the setting back off so the Customize toggle stays truthful.
  async function finish(granted){
    if(!granted){const {stillSettings}=await chrome.storage.local.get('stillSettings');if(stillSettings)await chrome.storage.local.set({stillSettings:{...stillSettings,newTabHome:false}});}
    window.close();
  }
  document.getElementById('allow').onclick=async e=>{
    e.preventDefault();
    try{await finish(await chrome.permissions.request({permissions:['tabs']}));}
    catch(error){status.textContent=error.message||'Brave did not allow this permission.';}
  };
  document.getElementById('cancel').onclick=e=>{e.preventDefault();finish(false);};
})();
