(() => {
  'use strict';
  const preview=['localhost','127.0.0.1'].includes(location.hostname),$=id=>document.getElementById(id);
  let settings={},visible=false,timer,busy=false,previous=null,saveTimer;
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(settings.appearance==='system')apply(settings);});
  const history=[];
  const reportStatus=state=>parent.postMessage({type:'google-refreshed-monitor-status',state},'*');
  // Only a layout height crosses into the page; hardware values and notes stay private.
  new ResizeObserver(()=>parent.postMessage({type:'google-refreshed-frame-size',height:Math.ceil(document.body.getBoundingClientRect().height)+2},'*')).observe(document.body);
  async function read(){if(preview){try{return JSON.parse(localStorage.getItem('stillSettings'))||{};}catch{return {};}}return (await chrome.storage.local.get('stillSettings')).stillSettings||{};}
  function apply(value){const wasPolling=canPoll();settings=value;const {colors,accent,dark}=GoogleRefreshed.palette(settings);const el=document.documentElement;el.style.setProperty('--fg',colors[1]);el.style.setProperty('--muted',colors[2]);el.style.setProperty('--accent',dark?`color-mix(in srgb,${accent} 70%,white)`:accent);el.style.setProperty('--font',GoogleRefreshed.loadFont(settings.font));el.style.colorScheme=dark?'dark':'light';$('monitor').hidden=settings.homeCard==='note';$('note').hidden=settings.homeCard!=='note';if($('note').value!==(settings.note||''))$('note').value=settings.note||'';if(wasPolling!==canPoll()||!timer&&!busy)poll();}
  async function sample(){
    if(preview){const r=await fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'hardware'}),signal:AbortSignal.timeout(6000)});const result=await r.json();if(!result.ok)throw new Error(result.error);return result.data;}
    return new Promise((resolve,reject)=>{const port=chrome.runtime.connect({name:'google-refreshed-data'});let settled=false;const timeout=setTimeout(()=>{port.disconnect();reject(new Error('Hardware request timed out'));},6000);port.onMessage.addListener(result=>{settled=true;clearTimeout(timeout);port.disconnect();if(result.ok)resolve(result.data);else reject(new Error(result.error));});port.onDisconnect.addListener(()=>{clearTimeout(timeout);const error=chrome.runtime.lastError;if(!settled)reject(new Error(error?.message||'Hardware connection closed'));});port.postMessage({type:'hardware'});});
  }
  function canPoll(){return visible&&!document.hidden&&settings.focus!==false&&settings.homeCard!=='note';}
  async function poll(){
    clearTimeout(timer);if(!canPoll()){previous=null;return;}if(busy)return;busy=true;
    try{const data=await sample();if(!canPoll())return;const total=data.cpu.total-(previous?.total||0),idle=data.cpu.idle-(previous?.idle||0);const cpu=previous&&total>0?Math.max(0,Math.min(100,(1-idle/total)*100)):null;previous=data.cpu;const ram=Math.max(0,Math.min(100,(1-data.memory.available/data.memory.total)*100));
      if(cpu!==null)$('cpu-value').textContent=Math.round(cpu)+'%';$('sample-status').hidden=true;reportStatus(cpu===null&&$('cpu-value').textContent==='—'?'Sampling':'Live');$('ram-value').textContent=Math.round(ram)+'%';$('cpu-model').textContent=data.cpu.model.replace(/\(R\)|\(TM\)/g,'').replace(/\s+/g,' ').trim()||'System processor';$('cpu-model').title=data.cpu.model;const gib=1024**3;$('ram-model').textContent=(data.memory.total/gib).toFixed(1)+' GB physical memory';$('hardware-details').textContent=data.cpu.cores+' logical cores · '+((data.memory.total-data.memory.available)/gib).toFixed(1)+' / '+(data.memory.total/gib).toFixed(1)+' GB RAM';
      history.push({cpu,ram});if(history.length>24)history.shift();for(const kind of ['cpu','ram']){const graph=$(kind+'-graph');graph.setAttribute('points',history.flatMap((sample,i)=>sample[kind]===null?[]:[(i*140/23).toFixed(1)+','+(31-sample[kind]*.29).toFixed(1)]).join(' '));if(settings.animations!==false&&!matchMedia('(prefers-reduced-motion: reduce)').matches)graph.animate([{opacity:.45},{opacity:1}],{duration:350});}document.body.classList.toggle('pulse',settings.animations!==false);
    }catch(error){const status=$('sample-status');status.hidden=false;status.textContent=/invalidated|Extension context/i.test(error.message)?'Extension updated. Refresh this Google tab to reconnect.':'Sample interrupted. Retrying shortly…';status.title=error.message||'Hardware sampling temporarily unavailable';reportStatus('Retrying');}finally{busy=false;if(canPoll())timer=setTimeout(poll,2500);}
  }
  $('note').oninput=()=>{clearTimeout(saveTimer);const note=$('note').value;saveTimer=setTimeout(async()=>{const current=await read();const value={...current,note};if(preview)localStorage.setItem('stillSettings',JSON.stringify(value));else await chrome.storage.local.set({stillSettings:value});settings=value;},180);};
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;poll();},{threshold:.01}).observe(document.body);
  document.addEventListener('visibilitychange',poll);
  if(preview)addEventListener('storage',()=>read().then(apply));else chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.stillSettings)apply(changes.stillSettings.newValue||{});});
  read().then(apply);
})();
