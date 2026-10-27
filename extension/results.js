(() => {
  'use strict';
  const params=new URLSearchParams(location.search);
  if(!(location.pathname==='/search'||['/','/webhp'].includes(location.pathname)&&params.has('q')))return;
  const style=document.createElement('style');style.id='google-refreshed-results';
  const bridge=document.createElement('style');bridge.id='google-refreshed-result-surfaces';
  style.textContent=`
    html[data-gr-theme]{color-scheme:var(--gr-scheme);background:var(--gr-bg)!important}
    html[data-gr-theme] body{background:var(--gr-bg)!important;color:var(--gr-fg)!important;font-family:var(--gr-font,'GR Manrope'),Arial,sans-serif}
    html[data-gr-theme] :is(#search,#rso,#main,#cnt,#rcnt,#center_col,#rhs,#appbar,#top_nav,#hdtb,#sfooter,#fbar,.sfbg,.yg51vc,.c93Gbe){background-color:var(--gr-bg)!important;color:var(--gr-fg)!important}
    html[data-gr-theme] :is(.RNNXgb,.aajZCb,.GKS7s,.aKoFF,.k8XOCe,.s8GCU,.Q2MMlc){background-color:var(--gr-panel)!important;border-color:var(--gr-line)!important}
    html[data-gr-theme] :is(input[name=q],textarea[name=q],.sbct,.wM6W7d,.lnnVSe){color:var(--gr-fg)!important;background-color:transparent!important}
    html[data-gr-theme] :is(.VwiC3b,.yXK7lf,.MUxGbd,.LEwnzc,.YrbPuc,.Uroaid,.q8U8x){color:var(--gr-muted)!important}
    html[data-gr-theme] :is(a h3,h3 a,.LC20lb){color:var(--gr-link)!important}
    html[data-gr-theme] :is(.MjjYud,.mnr-c,.kp-wholepage,.related-question-pair,.WZ8Tjf){border-color:var(--gr-line)!important}
    html[data-gr-theme] :is(.erkvQe,.sbct:hover,.sbhl){background-color:var(--gr-soft)!important}
    #gr-results-home{position:fixed;right:18px;bottom:17px;z-index:2147482000;display:flex;gap:8px;align-items:center;padding:9px 13px;border-radius:12px;background:var(--gr-panel);color:var(--gr-fg);border:1px solid var(--gr-line);font:11px var(--gr-font,'GR Manrope'),sans-serif;text-decoration:none;box-shadow:0 4px 20px #0002}
    #gr-results-home svg{width:22px;height:22px;color:var(--gr-accent)}
  `;
  const button=document.createElement('a');button.id='gr-results-home';button.href=location.origin+'/?still=customize';button.innerHTML=GoogleRefreshed.logo+'<span>GoogleRefreshed</span>';button.title='Customize your GoogleRefreshed theme';
  let current={},enabled=true,scanScheduled=false;
  const originals=new Map(),inlineOriginals=new Map();
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(', ');
  function mount(){if(!document.documentElement)return;const head=document.head||document.documentElement;if(enabled){if(!style.isConnected)head.append(style);if(!bridge.isConnected)head.append(bridge);if(document.body&&!button.isConnected)document.body.append(button);}}
  function apply(settings={}){
    if(!document.documentElement)return;
    enabled=settings.resultsTheme!==false;
    const html=document.documentElement;
    if(!enabled){delete html.dataset.grTheme;style.remove();bridge.remove();button.remove();for(const [key,saved]of originals){if(saved.value)html.style.setProperty(key,saved.value,saved.priority);else html.style.removeProperty(key);}originals.clear();for(const [node,values]of inlineOriginals)for(const [key,saved]of values){if(saved.value)node.style.setProperty(key,saved.value,saved.priority);else node.style.removeProperty(key);}inlineOriginals.clear();return;}
    const {theme,dark,colors,accent}=GoogleRefreshed.palette(settings);
    html.style.setProperty('--gr-font',GoogleRefreshed.loadFont(settings.font));html.dataset.grTheme=theme.id;html.style.setProperty('--gr-scheme',dark?'dark':'light');
    const variables={'--gr-bg':colors[0],'--gr-fg':colors[1],'--gr-muted':dark?colors[2]:'#4b5563','--gr-line':colors[3],'--gr-soft':colors[4],'--gr-panel':dark?colors[4]:'#ffffff','--gr-link':dark?'#b6caff':'#2447a6','--gr-accent':accent,'--gr-bg-rgb':rgb(colors[0]),'--gr-panel-rgb':rgb(dark?colors[4]:'#ffffff')};
    for(const [key,value]of Object.entries(variables))html.style.setProperty(key,value);
    for(const [name,value]of [['line',colors[3]],['fg',colors[1]],['muted',dark?colors[2]:'#4b5563']])html.style.setProperty('--gr-'+name+'-rgb',rgb(value));
    for(const [key,value]of Object.entries(nativeVariables)){if(!originals.has(key))originals.set(key,{value:html.style.getPropertyValue(key),priority:html.style.getPropertyPriority(key)});html.style.setProperty(key,`var(${value})`,'important');}
    mount();scheduleScan();
  }
  const nativeVariables={}; // Google's private variable names can serve multiple roles. Keep their definitions intact.
  function neutralToken(token,target){
    if(token.includes('var('))return token;
    let channels,alpha=1;
    if(token[0]==='#'){let hex=token.slice(1);if(hex.length===3||hex.length===4)hex=[...hex].map(c=>c+c).join('');if(![6,8].includes(hex.length))return token;channels=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));if(hex.length===8)alpha=parseInt(hex.slice(6),16)/255;}
    else{const values=token.match(/[\d.]+%?/g)||[];if(values.length<3)return token;channels=values.slice(0,3).map(x=>x.endsWith('%')?parseFloat(x)*2.55:Number(x));if(values[3])alpha=values[3].endsWith('%')?parseFloat(values[3])/100:Number(values[3]);}
    const spread=Math.max(...channels)-Math.min(...channels),brightness=channels.reduce((a,b)=>a+b)/3;
    // Preserve saturated artwork and brand colors; change neutral native surfaces only.
    if(spread>18||target!=='--gr-fg'&&!(brightness<75||brightness>225))return token;
    if(target==='--gr-panel'&&(brightness<38||brightness>250))target='--gr-bg';
    if(target==='--gr-fg'&&brightness>85&&brightness<200)target='--gr-muted';
    return alpha===1?`var(${target})`:`rgba(var(${target}-rgb), ${alpha})`;
  }
  const colors=/#(?:[a-f\d]{8}|[a-f\d]{6}|[a-f\d]{4}|[a-f\d]{3})\b|rgba?\([^)]*\)/gi;
  function scanSurfaces(){
    scanScheduled=false;if(!enabled)return;
    const rules=[],sources=[],definitions=new Map();let visited=0,inspected=0;
    const properties=['background-color','background-image','background','border-color','color'];
    const targetFor=property=>property==='color'?'--gr-fg':property==='border-color'?'--gr-line':property==='background-image'?'--gr-bg':'--gr-panel';
    function define(style){for(const key of style){if(!key.startsWith('--')||key.startsWith('--gr-'))continue;const value=style.getPropertyValue(key).trim();if(!definitions.has(key))definitions.set(key,new Set());definitions.get(key).add(value);}}
    function collect(list){for(const rule of list){if(++inspected>16000)return;if(rule.style)define(rule.style);if(rule.cssRules)collect(rule.cssRules);}}
    for(const sheet of document.styleSheets){if(sheet.ownerNode===style||sheet.ownerNode===bridge)continue;try{sources.push(sheet.cssRules);collect(sheet.cssRules);}catch{}}
    const inlineNodes=[document.documentElement,...document.querySelectorAll('[style]')].slice(0,600);for(const node of inlineNodes)define(node.style);
    function rawValues(key,depth=0){if(depth>5||key.startsWith('--gr-'))return [];const values=[...(definitions.get(key)||[])];return values.flatMap(value=>{const match=value.match(/^var\(\s*(--[\w-]+)\s*\)$/);return match?rawValues(match[1],depth+1):[value];});}
    function mapValue(value,property){
      if(!value||value.includes('url(')||value.includes('var(--gr-'))return value;
      const target=targetFor(property);
      // Rewrite each use, never a shared variable definition: text and surfaces must remain distinct.
      let mapped=value.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/g,(token,key,fallback)=>{
        const values=rawValues(key);if(!values.length&&fallback)values.push(fallback.trim());
        if(values.length&&values.every(v=>/^(?:#[a-f\d]{3,8}|rgba?\([^()]+\))$/i.test(v)&&neutralToken(v,target)!==v))return neutralToken(values[0],target);
        return token;
      });
      return mapped.replace(colors,token=>neutralToken(token,target));
    }
    function scope(selector){return selector.split(/,(?![^()]*\))/).map(s=>/^(:root|html)(?=[\s.#:[>+~]|$)/.test(s.trim())?s.trim().replace(/^(:root|html)/,'html[data-gr-theme]'):'html[data-gr-theme] '+s.trim()).join(',');}
    function walk(list){const output=[];for(const rule of list){if(++visited>16000)break;if(!rule.selectorText&&rule.cssRules){const nested=walk(rule.cssRules);if(nested.length){if(rule.type===CSSRule.MEDIA_RULE)output.push(`@media ${rule.conditionText}{${nested.join('\n')}}`);else if(rule.type===CSSRule.SUPPORTS_RULE)output.push(`@supports ${rule.conditionText}{${nested.join('\n')}}`);}continue;}if(!rule.selectorText||!rule.style)continue;
      const overrides=[];for(const property of properties){const value=rule.style.getPropertyValue(property),mapped=mapValue(value,property);if(mapped!==value)overrides.push(`${property}:${mapped}!important`);}
      if(overrides.length)output.push(`${scope(rule.selectorText)}{${overrides.join(';')}}`);
    }return output;}
    for(const source of sources)rules.push(...walk(source));bridge.textContent=rules.join('\n');
    for(const [node]of inlineOriginals)if(!node.isConnected)inlineOriginals.delete(node);
    function write(node,property,value){
      const saved=inlineOriginals.get(node)?.get(property),current=node.style.getPropertyValue(property);
      if(!inlineOriginals.has(node))inlineOriginals.set(node,new Map());
      if(!saved||saved.mapped!==current)inlineOriginals.get(node).set(property,{value:current,priority:node.style.getPropertyPriority(property),mapped:value});
      if(current!==value)node.style.setProperty(property,value,'important');
    }
    for(const node of inlineNodes)for(const property of properties){const saved=inlineOriginals.get(node)?.get(property),current=node.style.getPropertyValue(property),value=saved?.mapped===current?saved.value:current,mapped=mapValue(value,property);if(mapped!==value)write(node,property,mapped);}
    // Last safeguard for AI text whose colors are produced by scoped variables or streamed styles.
    // Read first, then write, avoiding per-element layout/write cycles.
    const cache=new Map(),patches=[];
    const computed=node=>{if(!cache.has(node))cache.set(node,getComputedStyle(node));return cache.get(node);};
    const rgba=value=>{const m=value.match(/^rgba?\(([^)]+)\)/);if(!m)return null;const n=m[1].split(/[,\s/]+/).filter(Boolean).map(Number);return n.length>=3?[...n.slice(0,3),n[3]??1]:null;};
    const background=node=>{for(let n=node;n;n=n.parentElement){const c=rgba(computed(n).backgroundColor);if(c&&c[3]>.9)return c;}const hex=document.documentElement.style.getPropertyValue('--gr-bg');return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));};
    const luminance=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    for(const node of [...document.querySelectorAll('p,li,span,div,h1,h2,h3,input,textarea')].filter(n=>/^(INPUT|TEXTAREA)$/.test(n.tagName)||[...n.childNodes].some(c=>c.nodeType===3&&c.textContent.trim())).slice(0,1200)){
      const css=computed(node),fg=rgba(css.color);if(!fg||fg[3]<.9||css.visibility==='hidden'||css.display==='none'||Math.max(...fg.slice(0,3))-Math.min(...fg.slice(0,3))>22)continue;
      const x=luminance(fg),y=luminance(background(node)),contrast=(Math.max(x,y)+.05)/(Math.min(x,y)+.05);if(contrast<3.5)patches.push(node);
    }
    for(const node of patches)write(node,'color','var(--gr-fg)');
  }
  function scheduleScan(){if(scanScheduled||!enabled)return;scanScheduled=true;requestAnimationFrame(scanSurfaces);}
  const ready=globalThis.GoogleRefreshedBoot?.ready||chrome.storage.local.get('stillSettings').then(x=>x.stillSettings||{});
  ready.then(settings=>{current=settings;apply(current);});
  document.addEventListener('DOMContentLoaded',()=>{apply(current);scheduleScan();},{once:true});
  new MutationObserver(records=>{
    for(const record of records){
      if(record.target===style||record.target===bridge)continue;
      if(record.type==='attributes'){const value=record.target.getAttribute('style')||'';if(/background|color|--/.test(value)){scheduleScan();return;}continue;}
      if(record.target.tagName==='STYLE'){scheduleScan();return;}
      for(const node of record.addedNodes)if(node!==style&&node!==bridge&&node.nodeType===1&&(node.tagName==='STYLE'||node.tagName==='LINK'||node.hasAttribute('style')||node.querySelector?.('style,[style]'))){scheduleScan();return;}
    }
  }).observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
  chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.stillSettings){current=changes.stillSettings.newValue||{};apply(current);}});
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(GoogleRefreshed.appearance(current)==='system')apply(current);});
})();
