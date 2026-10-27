(() => {
  'use strict';
  const isResults=location.pathname==='/search'||(['/', '/webhp'].includes(location.pathname)&&new URLSearchParams(location.search).has('q'));
  if(!isResults)return;
  const style=document.createElement('style');style.id='google-refreshed-results';
  style.textContent=`
    html[data-gr-theme]{color-scheme:var(--gr-scheme);background:var(--gr-bg)!important}
    html[data-gr-theme] body{background:var(--gr-bg)!important;color:var(--gr-fg)!important;font-family:var(--gr-font,'GR Manrope'),Arial,sans-serif}
    html[data-gr-theme] :is(#search,#rso,#main,#cnt,#rcnt,#center_col,#rhs,#appbar,#top_nav,#hdtb,#sfooter,#fbar,.sfbg,.yg51vc,.c93Gbe){background-color:var(--gr-bg)!important;color:var(--gr-fg)!important}
    html[data-gr-theme] :is(.RNNXgb,.aajZCb,.minidiv .sfbg,.GKS7s,.aKoFF,.k8XOCe,.s8GCU,.Q2MMlc){background-color:var(--gr-panel)!important;border-color:var(--gr-line)!important}
    html[data-gr-theme] :is(input[name=q],textarea[name=q],.sbct,.wM6W7d,.lnnVSe){color:var(--gr-fg)!important;background-color:transparent!important}
    html[data-gr-theme] :is(.VwiC3b,.yXK7lf,.MUxGbd,.LEwnzc,.YrbPuc,.Uroaid,.q8U8x){color:var(--gr-muted)!important}
    html[data-gr-theme] :is(a h3,h3 a,.LC20lb){color:var(--gr-link)!important}
    html[data-gr-theme] :is(.MjjYud,.mnr-c,.kp-wholepage,.related-question-pair,.WZ8Tjf){border-color:var(--gr-line)!important}
    html[data-gr-theme] :is(.erkvQe,.sbct:hover,.sbhl){background-color:var(--gr-soft)!important}
    #gr-results-home{position:fixed;right:18px;bottom:17px;z-index:2147482000;display:flex;gap:8px;align-items:center;padding:9px 13px;border-radius:12px;background:var(--gr-panel);color:var(--gr-fg);border:1px solid var(--gr-line);font:11px 'GR Manrope',sans-serif;text-decoration:none;box-shadow:0 4px 20px #0002}
    #gr-results-home svg{width:22px;height:22px;color:var(--gr-accent)}
  `;
  const button=document.createElement('a');button.id='gr-results-home';button.href=location.origin+'/?still=customize';button.innerHTML=GoogleRefreshed.logo+'<span>GoogleRefreshed</span>';button.title='Customize your GoogleRefreshed theme';
  function apply(settings={}){
    if(settings.resultsTheme===false){delete document.documentElement.dataset.grTheme;style.remove();button.remove();return;}
    const {theme,dark,colors,accent}=GoogleRefreshed.palette(settings),html=document.documentElement;
    html.style.setProperty('--gr-font',GoogleRefreshed.loadFont(settings.font));html.dataset.grTheme=theme.id;html.style.setProperty('--gr-scheme',dark?'dark':'light');
    const variables={'--gr-bg':colors[0],'--gr-fg':colors[1],'--gr-muted':dark?colors[2]:'#4b5563','--gr-line':colors[3],'--gr-soft':colors[4],'--gr-panel':dark?colors[4]:'#ffffff','--gr-link':dark?'#b6caff':'#2447a6','--gr-accent':accent};
    for(const [key,value]of Object.entries(variables))html.style.setProperty(key,value);
    if(!style.isConnected)document.head.append(style);if(!button.isConnected)document.body.append(button);
  }
  let current={};chrome.storage.local.get('stillSettings').then(x=>{current=x.stillSettings||{};apply(current);});
  chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.stillSettings){current=changes.stillSettings.newValue||{};apply(current);}});
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(current.appearance==='system')apply(current);});
})();
