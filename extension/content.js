(() => {
  'use strict';
  const preview = location.hostname === '127.0.0.1' || location.hostname === 'localhost' || location.protocol === 'file:';
  const params = new URLSearchParams(location.search);
  if (!preview && (!['/', '/webhp'].includes(location.pathname) || ['q', 'tbm', 'udm'].some(k => params.has(k)))) return;
  if (document.getElementById('still-home')) return;
  // Leave native consent surfaces available instead of covering their controls.
  if (!preview && (document.querySelector('form[action*="consent"]') || document.querySelector('a[href^="https://consent.google.com/"]'))) {GoogleRefreshedBoot?.release();return;}
  // Each world has separate light and dark palettes, plus its own visual atmosphere.
  // Palette order: background, foreground, muted text, border, soft surface, glow.
  const themes = GoogleRefreshed.themes;
  const themeById = id => themes.find(t=>t.id===id) || themes[0];
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const assetURL = name => preview ? new URL(`icons/services/${name}.png`,location.href).href : chrome.runtime.getURL(`icons/services/${name}.png`);
  const officialIcon = url => {
    const host = new URL(url).hostname;
    return ({'mail.google.com':'gmail','www.youtube.com':'youtube','youtube.com':'youtube','drive.google.com':'drive','calendar.google.com':'calendar','chatgpt.com':'chatgpt','maps.google.com':'maps','photos.google.com':'photos','translate.google.com':'translate','myaccount.google.com':'google','www.google.com':'google'})[host];
  };
  const defaults = {
    welcomeComplete:false,engine:'google',motionIntensity:'vivid',worldClock:true,focusTimer:true,worldZone:'UTC',focusMinutes:25,font:'manrope',theme: 'paper', appearance: 'system', animations: true, accent: '#c65332', name: '', clock: true, focus: true, shortcutsVisible: true,
    weatherEnabled: true, newsEnabled: true, autoLocation:true, localNews:true, newsLanguageAuto:true, colorfulWeather:true, newsImages:true, newsSource:'bing', city: null, units: 'celsius', newsRegion: 'US', newsLanguage: 'en', newsTopic: 'local', newsQuery: '', newsCount: 6,
    homeCard:'hardware',suggestionImages:true,resultsTheme:true, hour24: true, newTab: false, newTabHome: false, compact: false, suggestions:true, note: '', photo: '', activeGroup:'personal',
    shortcuts: [
      {name: 'Gmail', url: 'https://mail.google.com/', color: '#b95a42', glyph: 'M'},
      {name: 'YouTube', url: 'https://www.youtube.com/', color: '#bd4646', glyph: '▶'},
      {name: 'Drive', url: 'https://drive.google.com/', color: '#59835f', glyph: '△'},
      {name: 'Calendar', url: 'https://calendar.google.com/', color: '#547ca3', glyph: '31'},
      {name: 'ChatGPT', url: 'https://chatgpt.com/', color: '#737164', glyph: '✳'}
    ]
  };
  const icons = {
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    sliders: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    external: '<path d="M14 4h6v6m0-6L10 14M10 4H4v16h16v-6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    grid: '<circle cx="5" cy="5" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="19" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="19" cy="19" r="1"/>',
    moon: '<path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/>'
  };
  icons.image='<rect x="3" y="4" width="18" height="16" rx="4"/><circle cx="8" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 4 5"/>';
  const icon = name => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.external}</svg>`;
  const safeURL = value => {
    let raw = String(value).trim();
    if (!/^[a-z][a-z\d+.-]*:/i.test(raw)) raw = 'https://' + raw;
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Use a regular http:// or https:// website address.');
    return url.href;
  };
  function clean(input) {
    const s = {...defaults, shortcuts: defaults.shortcuts.map(x => ({...x}))};
    if (!input || typeof input !== 'object') return s;
    // Existing installations keep their homepage; only a new install needs the welcome step.
    s.welcomeComplete = typeof input.welcomeComplete === 'boolean' ? input.welcomeComplete : Object.keys(input).length > 0;
    if(GoogleRefreshed.engines.some(e=>e.id===input.engine))s.engine=input.engine;
    if(['vivid','subtle'].includes(input.motionIntensity))s.motionIntensity=input.motionIntensity;
    for(const key of ['worldClock','focusTimer'])if(typeof input[key]==='boolean')s[key]=input[key];
    if(['UTC','Europe/London','America/New_York','America/Los_Angeles','Asia/Tokyo','Asia/Jerusalem','Europe/Paris','Australia/Sydney'].includes(input.worldZone))s.worldZone=input.worldZone;
    if([15,25,45,60].includes(input.focusMinutes))s.focusMinutes=input.focusMinutes;
    if(GoogleRefreshed.fonts.some(f=>f.id===input.font))s.font=input.font;
    if (themes.some(t=>t.id===input.theme)){s.theme=input.theme;s.accent=themeById(input.theme).accent;}
    if (['light','dark','system'].includes(input.appearance)) s.appearance=input.appearance;
    else if(input.theme==='midnight')s.appearance='dark';
    if (/^#[0-9a-f]{6}$/i.test(input.accent)&&!(s.theme==='aztec'&&input.accent.toLowerCase()==='#8c9a70')) s.accent = input.accent;
    for (const key of ['clock', 'focus', 'shortcutsVisible', 'hour24', 'newTab', 'newTabHome', 'compact','animations','weatherEnabled','newsEnabled','autoLocation','localNews','newsLanguageAuto','suggestions','colorfulWeather','newsImages','suggestionImages','resultsTheme']) if (typeof input[key] === 'boolean') s[key] = input[key];
    if(['hardware','note'].includes(input.homeCard))s.homeCard=input.homeCard;
    if(['google','bing','bbc','guardian'].includes(input.newsSource))s.newsSource=input.newsSource;
    if(['celsius','fahrenheit'].includes(input.units))s.units=input.units;
    if(input.city&&typeof input.city.name==='string'&&Number.isFinite(input.city.latitude)&&Number.isFinite(input.city.longitude)&&Math.abs(input.city.latitude)<=90&&Math.abs(input.city.longitude)<=180)s.city={name:input.city.name.slice(0,100),region:String(input.city.region||'').slice(0,100),country:String(input.city.country||'').slice(0,100),latitude:input.city.latitude,longitude:input.city.longitude};
    if(/^[A-Z]{2}$/.test(input.newsRegion))s.newsRegion=input.newsRegion;
    if(['en','he','de','fr','ja'].includes(input.newsLanguage))s.newsLanguage=input.newsLanguage;
    if(['local','top','world','technology','business','science','sports','health','entertainment','custom'].includes(input.newsTopic))s.newsTopic=input.newsTopic;
    if(typeof input.newsQuery==='string')s.newsQuery=input.newsQuery.slice(0,150);
    if([3,6,9].includes(input.newsCount))s.newsCount=input.newsCount;
    if (typeof input.name === 'string') s.name = input.name.slice(0, 32);
    if (typeof input.note === 'string') s.note = input.note.slice(0, 1000);
    if(['personal','work','study','all'].includes(input.activeGroup))s.activeGroup=input.activeGroup;
    if (typeof input.photo === 'string' && /^data:image\/(jpeg|png|webp);base64,[a-z\d+/=]+$/i.test(input.photo) && input.photo.length < 3000000) s.photo = input.photo;
    if (Array.isArray(input.shortcuts)) s.shortcuts = input.shortcuts.slice(0, 60).flatMap(x => {
      try { return [{name: String(x.name || 'Website').slice(0, 28), url: safeURL(x.url), color: /^#[0-9a-f]{6}$/i.test(x.color) ? x.color : '#787a6d', glyph: String(x.glyph || x.name || 'W').slice(0, 2),group:['personal','work','study'].includes(x.group)?x.group:'personal',iconMode:x.iconMode==='text'?'text':'auto'}]; } catch { return []; }
    });
    s.photoNewsMigrated=input.photoNewsMigrated===true;return s;
  }
  const ownSaves=new Set();
  const storage = {
    async get() {
      if (!preview) return GoogleRefreshedBoot?.ready?await GoogleRefreshedBoot.ready:(await chrome.storage.local.get('stillSettings')).stillSettings;
      try { return JSON.parse(localStorage.getItem('stillSettings')); } catch { return null; }
    },
    async set(value) {
      if(!preview){const signature=JSON.stringify(value);ownSaves.add(signature);if(ownSaves.size>8)ownSaves.delete(ownSaves.values().next().value);try{return await chrome.storage.local.set({stillSettings:value});}catch(error){ownSaves.delete(signature);throw error;}}
      localStorage.setItem('stillSettings', JSON.stringify(value));
    }
  };
  const host = document.createElement('div'); host.id = 'still-home';
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:block;color-scheme:light;';
  const root = host.attachShadow({mode: 'open'});
  let settings, mode = 'all', activeTab='home', classic = false, saveQueue = Promise.resolve(), noteTimer, clockTimer, saveTimer;
  let saveWaiters = [];
  const repoURL = 'https://github.com/youval1234/GoogleRefreshed';
  const version = preview ? '1.6.2' : chrome.runtime.getManifest().version;
  const dateFormatter = new Intl.DateTimeFormat('en', {weekday:'long',month:'long',day:'numeric'});
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll('_',' ').replaceAll('/',' / ');
  const hiddenSiblings = new Map();
  function particleMarkup(){
    const noise=(i,salt)=>{let x=Math.imul(i+1,2654435761)^salt;x=Math.imul(x^(x>>>16),2246822507);return ((x^(x>>>13))>>>0)/4294967296;};
    return Array.from({length:48},(_,i)=>{const duration=10+noise(i,271)*18,rain=.8+noise(i,131)*.95;return `<i style="--x:${(noise(i,17)*108-4).toFixed(2)}%;--duration:${duration.toFixed(2)}s;--delay:${(-duration*noise(i,991)).toFixed(2)}s;--rain-duration:${rain.toFixed(2)}s;--rain-delay:${(-rain*noise(i,731)).toFixed(2)}s;--sway-a:${(noise(i,411)*100-50).toFixed(1)}px;--sway-b:${(noise(i,877)*100-50).toFixed(1)}px;--turn:${(noise(i,601)*240-120).toFixed(1)}deg;--size:${(8+noise(i,777)*10).toFixed(1)}px;--alpha:${(.2+noise(i,307)*.45).toFixed(2)};--rain-length:${(18+noise(i,91)*26).toFixed(0)}px"></i>`;}).join('');
  }
  const css = `
    :host{all:initial;font-family:Inter,'Segoe UI',Arial,sans-serif;font-size:14px;color:#282c26;line-height:1.5;--bg:#f5f4ed;--fg:#282c26;--muted:#7b7e71;--line:#dddfd2;--panel:#ffffff79;--field:#ffffffc9;--soft:#e9eade;--accent:#c65332;--on-accent:#fff;--ring:0 0 0 3px color-mix(in srgb,var(--accent) 35%,transparent)}
    *{box-sizing:border-box}button,input,textarea,select{font:inherit}button,a,input,textarea,select{-webkit-tap-highlight-color:transparent}button,a{touch-action:manipulation}button{cursor:pointer;color:inherit}a{color:inherit;text-decoration:none}button{border:0;background:none}svg{flex-shrink:0;vertical-align:middle}button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:2px solid var(--accent);outline-offset:4px}button:hover,a:hover{filter:brightness(.94)}[hidden]{display:none!important}input,textarea,select{color:var(--fg);min-width:0}input::placeholder,textarea::placeholder{color:var(--muted);opacity:1}
    .app{height:100dvh;overflow:auto;position:relative;isolation:isolate;background:var(--bg);color:var(--fg)}.app[data-theme=midnight]{color-scheme:dark;--bg:#171e20;--fg:#efefe5;--muted:#acb5a8;--line:#394443;--panel:#24302fb5;--field:#25302f;--soft:#313b36}.app[data-theme=sage]{--bg:#e8ece2;--fg:#2e3a2f;--muted:#6c7b68;--line:#cdd6c5;--panel:#f7faf27a;--field:#fafbf5db;--soft:#dbe2d3}
    .wash{position:fixed;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(ellipse at 87% 48%,#d5dbbe59,transparent 43%),radial-gradient(ellipse at 8% 80%,#e9ccaa35,transparent 45%)}.photo{position:fixed;inset:0;z-index:-2;background-position:center;background-size:cover}.app.has-photo{--panel:color-mix(in srgb,var(--bg) 87%,transparent);--field:color-mix(in srgb,var(--bg) 94%,transparent)}.has-photo .wash{background:color-mix(in srgb,var(--bg) 78%,transparent)}
    .top{height:103px;display:flex;align-items:center;justify-content:space-between;padding:0 5.1vw;gap:16px}.brand{display:flex;align-items:center;gap:12px;font-size:19px;font-weight:600;letter-spacing:-.7px}.brand .mark{width:31px;height:31px;border-radius:50%;background:var(--fg);color:var(--bg);display:grid;place-items:center;font:italic 24px Georgia}.brand small{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-weight:500;border-left:1px solid var(--line);padding-left:15px;margin-left:4px}.topnav{display:flex;align-items:center;gap:26px;font-size:12px}.topnav .classic{font-size:11px;border:1px solid var(--line);border-radius:100px;padding:8px 14px}.round{height:35px;width:35px;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%}.topnav a:hover,.text-button:hover{color:var(--accent)}
    main{width:min(860px,calc(100% - 48px));margin:50px auto 100px}.intro{text-align:center;position:relative}.eyebrow{font-size:10px;font-weight:600;letter-spacing:2.1px;text-transform:uppercase;color:var(--muted)}.date{display:flex;align-items:center;justify-content:center;gap:9px}.date i{width:5px;height:5px;background:var(--accent);border-radius:50%}h1{font:normal clamp(40px,5.5vw,68px)/1.15 Georgia,'Times New Roman',serif;letter-spacing:-2px;margin:22px 0 14px}h1 em{color:var(--accent);font-weight:normal}.subtitle{font-size:13px;color:var(--muted);margin:0 0 36px;letter-spacing:.1px}
    .search-wrap{max-width:730px;margin:auto}.search-box{display:flex;align-items:center;gap:18px;background:var(--field);border:1px solid var(--line);border-radius:18px;padding:11px 12px 11px 23px;box-shadow:0 7px 26px #26342105;transition:border-color .2s,box-shadow .2s}.search-box:focus-within{border-color:var(--accent);box-shadow:var(--ring)}.google-g{font-size:23px;font-weight:700;background:conic-gradient(#4285f4 0deg 95deg,#34a853 95deg 180deg,#fbbc05 180deg 240deg,#ea4335 240deg 300deg,#4285f4 300deg);background-clip:text;-webkit-text-fill-color:transparent}.query{width:100%;background:transparent;border:0;outline:none!important;font-size:15px;height:42px}.key{color:var(--muted);border:1px solid var(--line);padding:0 6px;border-radius:5px;font-size:12px}.submit{background:var(--fg);color:var(--bg);width:43px;height:43px;display:grid;place-items:center;border-radius:12px}.modes{display:flex;justify-content:center;gap:6px;margin:16px 0 0}.mode{padding:5px 15px;border-radius:99px;color:var(--muted);font-size:11px}.mode[aria-pressed=true]{background:var(--soft);color:var(--fg)}
    .shortcuts{margin-top:52px}.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}.text-button{color:var(--muted);font-size:11px;padding:3px 0}.shortcut-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.shortcut{position:relative;min-height:110px;border:1px solid var(--line);border-radius:15px;background:var(--panel);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:11px;font-size:11px;transition:transform .2s,background .2s}.shortcut:hover{transform:translateY(-3px);background:var(--field)}.shortcut .tile{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:color-mix(in srgb,var(--tile) 11%,transparent);color:var(--tile);font-size:18px;font-weight:600}.shortcut.add{border-style:dashed;background:transparent;color:var(--muted)}.shortcut.add .tile{background:none;color:var(--muted)}.shortcut .go{position:absolute;right:10px;top:7px;font-size:12px;color:var(--muted);opacity:0}.shortcut:hover .go{opacity:1}
    .widgets{display:grid;grid-template-columns:1.1fr 1fr;gap:16px;margin-top:30px}.widget{border:1px solid var(--line);border-radius:17px;background:var(--panel);min-height:150px;padding:24px 25px;position:relative;overflow:hidden}.focus-top{display:flex;align-items:center;justify-content:space-between}.focus-top span{font-size:10px;letter-spacing:.4px;color:var(--muted)}.focus-note{display:block;resize:none;width:100%;height:55px;border:0;background:transparent;margin-top:17px;font-size:17px;line-height:1.5;outline:none}.focus-note::placeholder{font-family:Georgia,serif;font-size:21px;font-style:italic}.clock-row{display:flex;align-items:center;gap:20px;margin-top:10px}.time{font-size:39px;letter-spacing:-1.7px;line-height:1.3;font-variant-numeric:tabular-nums;font-weight:350;white-space:nowrap}.timezone{font-size:10px;color:var(--muted);margin-top:2px}.orbit{width:83px;height:83px;position:absolute;right:22px;top:35px;color:var(--accent)}.orbit .sun-ball{fill:currentColor;opacity:.8}.clock-content{position:relative;z-index:1;width:calc(100% - 78px)}
    footer{position:absolute;bottom:23px;left:5.1vw;right:5.1vw;display:flex;align-items:center;justify-content:space-between;gap:20px;color:var(--muted);font-size:10px;letter-spacing:.25px}.footer-left{display:flex;align-items:center;gap:9px}.small-sun{font-size:17px}.customize{display:flex;gap:9px;align-items:center;font-size:11px;border:1px solid var(--line);background:var(--panel);padding:10px 15px;border-radius:11px;color:var(--fg)}.customize svg{width:15px;height:15px}.scroll-content{min-height:100%;position:relative;padding-bottom:1px}.compact main{margin-top:10px}.compact h1{font-size:46px}.compact .shortcuts{margin-top:28px}.compact .widgets{margin-top:20px}.compact .shortcut{min-height:90px}
    dialog{color:var(--fg);background:var(--bg);border:1px solid var(--line);padding:0;max-height:90dvh;box-shadow:0 18px 80px #10171335;overflow:auto}dialog::backdrop{background:#0d151557;backdrop-filter:blur(5px)}.drawer{position:fixed;inset:16px 16px 16px auto;margin:0;width:min(415px,calc(100vw - 32px));height:calc(100dvh - 32px);max-height:none;border-radius:22px}.dialog-head{display:flex;align-items:center;justify-content:space-between;padding:25px 25px 12px}.dialog-head h2{font:27px Georgia;margin:0;letter-spacing:-.5px}.close{width:32px;height:32px;border-radius:50%;background:var(--soft);display:grid;place-items:center}.panel-content{padding:0 25px 25px}.hint{font-size:11px;color:var(--muted);line-height:1.7}.group{margin-top:24px;padding-top:22px;border-top:1px solid var(--line)}.group h3{font-size:10px;letter-spacing:1.7px;text-transform:uppercase;color:var(--muted);margin:0 0 15px}.themes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.theme{border:1px solid var(--line);border-radius:12px;padding:7px 7px 9px;font-size:11px;text-align:left}.theme[aria-pressed=true]{border:2px solid var(--accent);padding:6px 6px 8px}.theme-sample{display:block;height:48px;border-radius:6px;background:var(--sample);margin-bottom:8px;padding:10px}.theme-sample::before{content:'';display:block;width:60%;height:4px;background:var(--sample-fg);opacity:.5;border-radius:4px;margin:4px auto}.theme-sample::after{content:'';display:block;width:80%;height:10px;background:var(--sample-fg);opacity:.15;border-radius:4px;margin:7px auto}.swatches{display:flex;gap:11px;align-items:center}.swatch{width:26px;height:26px;border-radius:50%;background:var(--swatch);border:3px solid var(--bg);outline:1px solid var(--line)}.swatch[aria-pressed=true]{outline:2px solid var(--fg)}input[type=color]{width:29px;height:29px;padding:0;border:0;border-radius:50%;background:none;cursor:pointer}.field{display:block;margin:14px 0;font-size:12px}.field input,.field select,.field textarea{display:block;margin-top:7px;width:100%;border:1px solid var(--line);background:var(--field);border-radius:10px;padding:11px}.toggle{display:flex;align-items:center;justify-content:space-between;font-size:12px;gap:20px;margin:15px 0;cursor:pointer}.toggle input{accent-color:var(--accent);width:17px;height:17px}.buttons{display:flex;gap:8px;flex-wrap:wrap}.button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--line);background:var(--soft);padding:9px 13px;border-radius:9px;font-size:11px;cursor:pointer}.primary{background:var(--fg);color:var(--bg);border-color:var(--fg)}.danger{color:#b54835}.modal{width:min(440px,calc(100vw - 32px));border-radius:20px}.modal .panel-content{padding-top:5px}.error{color:#b54835;font-size:12px;min-height:18px}.edit-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 0;border-bottom:1px solid var(--line)}.edit-row strong{font-size:12px}.edit-row small{color:var(--muted);font-size:10px;display:block;max-width:155px;overflow:hidden;text-overflow:ellipsis}.edit-row .buttons{flex-wrap:nowrap;gap:4px}.edit-row button{padding:7px 9px}.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--fg);color:var(--bg);padding:12px 20px;border-radius:12px;font-size:12px;z-index:5;max-width:80vw}.reopen{position:fixed;right:24px;bottom:24px;border:1px solid #d8ddce;border-radius:30px;background:#f5f4ed;color:#2b3228;font:13px 'Segoe UI',sans-serif;padding:12px 18px;box-shadow:0 3px 20px #0002;cursor:pointer}
    @media(min-height:900px){main{margin-top:9vh}}@media(max-height:760px){main{margin-top:18px;margin-bottom:95px}.top{height:80px}.shortcuts{margin-top:30px}.widgets{margin-top:20px}.widget{min-height:132px;padding:20px}.orbit{top:25px}.subtitle{margin-bottom:26px}}@media(max-width:650px){.top{height:85px;padding:0 24px}.brand small{display:none}.topnav{gap:15px}.topnav .classic{display:none}main{width:calc(100% - 40px);margin-top:20px}h1{letter-spacing:-1.5px}.shortcut-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.shortcut{min-height:95px}.shortcuts{margin-top:32px}.widgets{grid-template-columns:1fr}.widget{min-height:132px}.key{display:none}.search-box{gap:12px;padding-left:16px}.subtitle{font-size:12px}.footer-left{max-width:52%;font-size:9px}footer{left:20px;right:20px}.query{font-size:14px}.time{font-size:37px}.orbit{top:25px}.topnav>a{font-size:11px}.date{letter-spacing:1.4px}}
    .search-wrap{position:relative;z-index:4}.suggestion-popup{position:absolute;top:75px;left:0;right:0;z-index:10;border:1px solid var(--line);border-radius:16px;background:var(--bg);box-shadow:0 18px 38px #0002;overflow:hidden}.suggestion-option{display:flex;align-items:center;gap:15px;width:100%;padding:12px 23px;text-align:start;font-size:14px}.suggestion-option span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.suggestion-option svg{width:16px;height:16px;color:var(--muted)}.suggestion-option[aria-selected=true],.suggestion-option:hover{background:var(--soft)}.suggestion-credit{padding:8px 22px 11px;color:var(--muted);font-size:9px;text-align:end;border-top:1px solid var(--line)}.appearance{display:flex;padding:4px;border:1px solid var(--line);border-radius:12px;background:var(--soft);gap:3px}.appearance button{flex:1;padding:8px 10px;font-size:11px;border-radius:8px;color:var(--muted)}.appearance button[aria-pressed=true]{background:var(--field);color:var(--fg);box-shadow:0 2px 6px #0001}.theme-category{grid-column:1/-1;color:var(--muted);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin:8px 0 1px}.themes{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.theme{font-size:10px}.theme-sample{height:44px;overflow:hidden;position:relative}.theme-sample::before,.theme-sample::after{position:relative;z-index:1}.theme-sample[data-world=future]{background:repeating-linear-gradient(90deg,transparent 0 12px,#32bcce28 12px 13px),linear-gradient(140deg,#07151f,#18485d)}.theme-sample[data-world=mystic],.theme-sample[data-world=cosmic]{background:radial-gradient(circle at 80% 30%,#c9b9f1 0 6px,transparent 7px),linear-gradient(145deg,#171024,#684a91)}.theme-sample[data-world=magic]{background:radial-gradient(circle at 75% 30%,#ffe4a3 0 2px,transparent 3px),linear-gradient(125deg,#332146,#a87e4e)}.theme-sample[data-world=rustic]{background:repeating-linear-gradient(0deg,#a4835520 0 1px,transparent 1px 4px),#cbb793}.theme-sample[data-world=aurora]{background:linear-gradient(135deg,#13303b,#4d8d76,#7665ac)}.theme-sample[data-world=autumn]{background:linear-gradient(135deg,#5b3427,#d3985b)}.theme-sample[data-world=winter]{background:radial-gradient(circle at 15% 30%,#fff 0 1px,transparent 2px),linear-gradient(145deg,#4e778d,#c5dfec)}.theme-sample[data-world=spring]{background:radial-gradient(circle at 70% 30%,#eebed2 0 6px,transparent 7px),linear-gradient(135deg,#92b38b,#e1ebbe)}.theme-sample[data-world=summer]{background:radial-gradient(circle at 75% 30%,#ffdc78 0 9px,transparent 10px),linear-gradient(145deg,#e3ae69,#f6e2b1)}
    .weather-svg{width:64px;height:64px;display:block}.forecast-day .weather-svg{width:38px;height:38px;margin:auto}.wx-sun{fill:#edbd4d;stroke:#c78c27}.wx-moon{fill:#e5cf88;stroke:#b9a363}.wx-cloud{fill:#bdcdd6;stroke:#849eaf}.wx-rain{stroke:#448fba}.wx-fog{stroke:#91a7b4}.wx-snow{stroke:#6fa9c7}.wx-storm{fill:#e8b642;stroke:#c49126}.app[data-weather-color=false] .weather-svg *{fill:none;stroke:var(--fg)}.news-item{overflow:hidden}.news-thumb,.news-art{width:calc(100% + 42px);height:145px;margin:-21px -21px 2px;align-self:center;object-fit:cover;flex-shrink:0}.news-art{background:radial-gradient(circle at 80% 20%,color-mix(in srgb,var(--accent) 35%,transparent),transparent 55%),linear-gradient(140deg,var(--soft),var(--bg));display:flex;align-items:center;justify-content:center;gap:12px;color:var(--accent)}.news-art svg{width:30px;height:30px;opacity:.5}.news-art span{font-size:10px;letter-spacing:3px}.suggestion-popup{max-height:55dvh;overflow:auto}.service-icon{display:block;width:25px;height:25px;object-fit:contain}.google-icon{width:23px;height:23px;flex-shrink:0}.shortcut .tile:has(img){background:transparent}.app[data-appearance=dark] .tile img[data-service=chatgpt]{background:#fff;border-radius:50%;padding:3px}.appearance-note{font-size:10px;color:var(--muted);margin-top:9px}h1{overflow-wrap:anywhere}
    .scene{position:fixed;inset:0;pointer-events:none;z-index:-1;overflow:hidden;contain:strict}.scene-grid,.scene-stars,.scene-ribbon,.scene-moon,.scene-particles{display:none;position:absolute;pointer-events:none}.scene-grid{inset:42% -40% -70%;background-image:linear-gradient(var(--accent) 1px,transparent 1px),linear-gradient(90deg,var(--accent) 1px,transparent 1px);background-size:70px 70px;opacity:.12;transform:perspective(400px) rotateX(58deg);mask-image:linear-gradient(transparent,#000);transform-origin:center top}.scene-stars{inset:0;opacity:.4;background-image:radial-gradient(circle at 13% 18%,var(--accent) 0 1px,transparent 2px),radial-gradient(circle at 82% 23%,var(--fg) 0 1px,transparent 2px),radial-gradient(circle at 68% 70%,var(--accent) 0 1px,transparent 2px),radial-gradient(circle at 30% 80%,var(--fg) 0 1px,transparent 2px);background-size:290px 240px,370px 320px,230px 370px,460px 360px}.scene-moon{width:110px;height:110px;right:9%;top:17%;border-radius:50%;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--accent) 15%,var(--bg)),var(--accent));box-shadow:0 0 90px color-mix(in srgb,var(--accent) 18%,transparent);opacity:.22}.scene-ribbon{width:75vw;height:40vh;right:-10vw;top:30vh;background:linear-gradient(130deg,transparent,var(--glow),var(--accent),transparent);filter:blur(65px);opacity:.2;border-radius:50%;transform:rotate(-30deg)}.scene-particles{inset:0}.scene-particles i{position:absolute;left:var(--x);top:-8%;width:5px;height:5px;border-radius:50%;background:var(--accent);opacity:0;animation:drift var(--duration) linear infinite;animation-delay:var(--delay)}
    .wash{background:radial-gradient(ellipse at 87% 48%,color-mix(in srgb,var(--glow) 30%,transparent),transparent 43%),radial-gradient(ellipse at 8% 80%,color-mix(in srgb,var(--accent) 8%,transparent),transparent 45%)}
    .app[data-world=future] .scene-grid{display:block}.app[data-world=future] h1{font-family:'Segoe UI',Arial,sans-serif;font-weight:300;letter-spacing:-3px}.app[data-world=future] .search-box{border-color:color-mix(in srgb,var(--accent) 50%,var(--line));box-shadow:0 0 32px color-mix(in srgb,var(--accent) 8%,transparent)}.app[data-world=future] .shortcut,.app[data-world=future] .widget{border-radius:8px}.app[data-world=future] .eyebrow{font-family:Consolas,monospace}
    .app:is([data-world=mystic],[data-world=magic],[data-world=cosmic],[data-world=night]) .scene-stars{display:block}.app:is([data-world=mystic],[data-world=cosmic]) .scene-moon{display:block}.app:is([data-world=aurora],[data-world=cosmic]) .scene-ribbon{display:block}.app[data-world=magic] h1 em{font-style:italic;text-shadow:0 0 32px color-mix(in srgb,var(--accent) 25%,transparent)}.app[data-world=magic] .widget{border-style:double;border-width:3px}.app[data-world=rustic] .wash{background:repeating-linear-gradient(0deg,#89755208 0 1px,transparent 1px 4px),repeating-linear-gradient(90deg,#89755206 0 1px,transparent 1px 5px)}.app[data-world=rustic] :is(.widget,.shortcut,.search-box){border-radius:7px}.app[data-world=rustic] .eyebrow{font-family:Georgia,serif;letter-spacing:1.5px}.app:is([data-world=autumn],[data-world=spring],[data-world=winter],[data-world=magic]) .scene-particles{display:block}.app[data-world=autumn] .scene-particles i{width:11px;height:6px;border-radius:90% 0 90% 0;background:var(--accent)}.app[data-world=spring] .scene-particles i{width:8px;height:11px;border-radius:80% 0 80% 80%;background:#ca86a5}.app[data-world=winter] .scene-particles i{background:var(--fg);width:3px;height:3px}.app[data-world=magic] .scene-particles i{width:3px;height:3px;box-shadow:0 0 9px var(--accent)}.app[data-world=summer] .scene-moon{display:block;top:9%;right:10%;width:170px;height:170px;background:var(--glow);opacity:.28;box-shadow:0 0 110px var(--glow)}.app[data-world=noir] h1{font-style:italic}.app[data-world=water] .wash{background:radial-gradient(ellipse at 20% 80%,color-mix(in srgb,var(--glow) 25%,transparent),transparent 40%),radial-gradient(ellipse at 80% 10%,color-mix(in srgb,var(--accent) 10%,transparent),transparent 60%)}
    .app[data-motion=on] .intro{animation:enter .6s both}.app[data-motion=on] .search-wrap{animation:enter .6s .08s both}.app[data-motion=on] .shortcuts{animation:enter .6s .16s both}.app[data-motion=on] .widgets{animation:enter .6s .24s both}.app[data-motion=on] .scene-stars{animation:twinkle 9s ease-in-out infinite alternate}.app[data-motion=on] .scene-ribbon{animation:aurora 26s ease-in-out infinite alternate}.app[data-motion=on] .scene-moon{animation:float 17s ease-in-out infinite alternate}.app[data-motion=on] .orbit{animation:orbit 90s linear infinite}.app[data-motion=on] dialog[open]{animation:dialog-in .22s both}.app[data-motion=off] *,.app[data-motion=off] *::before,.app[data-motion=off] *::after{animation:none!important;transition:none!important}.app[data-paused=true] *{animation-play-state:paused!important}.app[data-motion=off] .scene-particles i{opacity:.1;top:var(--rest)}.mode,.round,.customize,.button,.theme{transition:background .18s,transform .18s,border-color .18s}.round:hover,.customize:hover{transform:translateY(-2px)}.button:active,.submit:active,.shortcut:active{transform:scale(.97)}
    @keyframes enter{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes dialog-in{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}@keyframes twinkle{from{opacity:.18}to{opacity:.5}}@keyframes aurora{from{transform:translate(-5%,0) rotate(-30deg)}to{transform:translate(8%,-8%) rotate(-17deg)}}@keyframes float{from{transform:translateY(0)}to{transform:translateY(16px)}}@keyframes orbit{to{transform:rotate(360deg)}}@keyframes drift{0%{opacity:0;transform:translate3d(0,0,0) rotate(0deg)}12%{opacity:.22}90%{opacity:.15}100%{opacity:0;transform:translate3d(70px,115vh,0) rotate(180deg)}}
    .group-control{display:flex;align-items:center;gap:15px}.group-select{font-size:11px;color:var(--muted);background:transparent;border:0;padding:4px;max-width:100px}.command-modal{width:min(560px,calc(100vw - 30px));border-radius:18px;margin-top:14vh}.command-input{width:100%;border:0;border-bottom:1px solid var(--line);padding:22px 24px;background:transparent;font-size:17px;outline:none!important}.commands{padding:8px;max-height:400px;overflow:auto}.command-option{width:100%;display:flex;justify-content:space-between;gap:14px;padding:13px 16px;border-radius:10px;text-align:left;font-size:12px}.command-option[aria-selected=true]{background:var(--soft)}.command-option small{color:var(--muted);font-size:10px;flex-shrink:0}.command-footer{padding:12px 23px;border-top:1px solid var(--line);color:var(--muted);font-size:10px;display:flex;justify-content:space-between}.command-empty{padding:18px;color:var(--muted);font-size:12px}.page-tabs{display:flex;justify-content:center;gap:5px;width:fit-content;margin:30px auto 0;padding:4px;border:1px solid var(--line);border-radius:100px;background:var(--panel)}.page-tabs button{padding:7px 22px;border-radius:100px;font-size:11px;color:var(--muted)}.page-tabs button[aria-selected=true]{background:var(--fg);color:var(--bg)}.data-panel{margin-top:28px}.data-card{border:1px solid var(--line);border-radius:17px;padding:24px;background:var(--panel)}.data-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.data-heading h2{font:28px Georgia;margin:0 0 5px}.data-heading p{margin:0}.data-status{font-size:12px;color:var(--muted);padding:22px 0}.city-search{display:flex;gap:8px;margin-top:18px}.city-search input{flex:1;min-width:0;border:1px solid var(--line);border-radius:10px;background:var(--field);padding:12px}.city-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.weather-now{display:flex;gap:23px;align-items:center;margin:25px 0}.weather-symbol{font-size:52px;line-height:1}.temperature{font-size:54px;letter-spacing:-3px;line-height:1.2}.weather-detail{font-size:12px;color:var(--muted)}.forecast{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.forecast-day{background:var(--field);border-radius:12px;padding:14px 8px;text-align:center;font-size:11px}.forecast-day>span{font-size:23px;display:block;margin:9px 0}.forecast-day small{color:var(--muted)}.source-note{font-size:10px;color:var(--muted);margin-top:18px}.source-note a{text-decoration:underline}.news-controls{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.news-controls select{border:1px solid var(--line);padding:9px 12px;border-radius:10px;background:var(--field);font-size:12px}.news-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.news-item{display:flex;flex-direction:column;align-items:flex-start;gap:12px;padding:21px;border:1px solid var(--line);border-radius:14px;background:var(--field);transition:transform .2s;min-width:0}.news-item:hover{transform:translateY(-3px)}.news-item h3{font-size:14px;line-height:1.6;font-weight:500;margin:0;overflow-wrap:anywhere}.news-item small{font-size:10px;color:var(--muted)}.news-item .article-source{font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--accent)}.data-panel .button:disabled{opacity:.5;cursor:wait}.data-status:empty{display:none}.page-tabs+.shortcuts{margin-top:27px}.news-empty{font-size:12px;color:var(--muted);line-height:1.8}.setting-select{margin-top:8px}.privacy-hint{font-size:10px;line-height:1.8;color:var(--muted)}
    @media(min-height:900px){main{margin-top:5vh}}#panel-home .shortcuts{margin-top:28px}@media(max-width:650px){.topnav>a{display:none}.topnav{gap:9px}.brand{font-size:16px;gap:9px}.brand>img{width:21px;height:21px}.brand small{display:none}.news-grid{grid-template-columns:1fr}.data-card{padding:18px}.forecast{gap:5px}.forecast-day{padding:10px 3px;font-size:10px}.page-tabs button{padding:7px 17px}.city-search{flex-wrap:wrap}.city-search input{width:100%}.temperature{font-size:44px}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
  `;
  root.innerHTML = `<style>${css}</style><div class="app" data-theme="paper" lang="en" dir="ltr"><div class="photo"></div><div class="wash"></div><div class="scene" aria-hidden="true"><div class="theme-art"></div><div class="scene-grid"></div><div class="scene-stars"></div><div class="scene-ribbon"></div><div class="scene-moon"></div><div class="scene-particles">${particleMarkup()}</div></div><div class="scroll-content">
    <header class="top"><a class="brand" href="https://www.google.com/" aria-label="Google home">${GoogleRefreshed.logo}<span class="brand-name">Google <strong>Refreshed</strong></span><small>v${version}</small></a><nav class="topnav" aria-label="Google services"><a href="https://mail.google.com/">Gmail</a><a href="https://www.google.com/imghp">Images</a><button class="round" id="quick-mode" title="Switch to dark mode" aria-label="Switch to dark mode">${icon('moon')}</button><button class="round" id="apps" title="Google apps" aria-label="Google apps">${icon('grid')}</button><button class="classic" id="classic">Classic Google ↗</button></nav></header>
    <main><section class="intro"><div class="eyebrow date"><span id="date"></span></div><h1 id="greeting" dir="ltr"></h1><p class="subtitle">Search Google. Make the day yours.</p></section>
    <section class="search-wrap" aria-label="Google search"><form class="search-box" id="search" action="https://www.google.com/search" method="get" role="search"><label class="engine-picker" title="Choose search engine"><img id="engine-google-icon" class="google-icon" src="${assetURL('google')}" alt=""><span id="engine-letter" hidden></span><span class="engine-chevron" aria-hidden="true"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m4 6 4 4 4-4"/></svg></span><select id="engine-quick" aria-label="Search engine">${GoogleRefreshed.engines.map(e=>`<option value="${e.id}"><img class="engine-option-icon" src="${assetURL(e.id)}" alt="">${e.name}</option>`).join('')}</select></label><input type="search" class="query" name="q" placeholder="Search Google or explore an idea" aria-label="Search Google" autocomplete="off" aria-autocomplete="list" aria-controls="suggestion-list" aria-expanded="false" dir="auto" required maxlength="2048"><button type="button" id="search-images" class="search-image-button" aria-label="Reverse image search" title="Search by image with Google Lens">${icon('image')}</button><button type="submit" class="submit" aria-label="Search Google">${icon('arrow')}</button></form><div class="suggestion-popup" id="suggestion-popup" hidden><div id="suggestion-list" role="listbox" aria-label="Google search suggestions"></div><div class="suggestion-credit">Suggestions from Google</div></div><div class="modes" aria-label="Search type">${['all','images','videos','maps'].map(x => `<button class="mode" data-mode="${x}" aria-pressed="${x === 'all'}">${x[0].toUpperCase()+x.slice(1)}</button>`).join('')}</div></section>
    <nav class="page-tabs" role="tablist" aria-label="Homepage tabs">${['home','weather','news'].map(x=>`<button role="tab" id="tab-${x}" data-tab="${x}" aria-selected="${x==='home'}" aria-controls="panel-${x}" tabindex="${x==='home'?0:-1}">${x[0].toUpperCase()+x.slice(1)}</button>`).join('')}</nav><div id="panel-home" role="tabpanel" aria-labelledby="tab-home">
    <section class="shortcuts"><div class="section-head"><span class="eyebrow">Your everyday <span id="shortcut-count"></span></span><div class="group-control"><select id="shortcut-group" class="group-select" aria-label="Shortcut group"><option value="personal">Personal</option><option value="work">Work</option><option value="study">Study</option><option value="all">All groups</option></select><button class="text-button" id="quick-add-shortcut">+ Add shortcut</button><button class="text-button" id="edit-shortcuts">Edit shortcuts ↗</button></div></div><div class="shortcut-grid"></div></section>
    <section class="widgets" aria-label="Your widgets"><article class="widget focus-widget"><div class="focus-top"><span class="eyebrow" id="daily-title">Today’s tasks</span><span id="hardware-status">Live</span></div><iframe id="hardware-frame" title="Private hardware monitor and focus note" src="${GoogleRefreshed.resource('hardware.html')}" style="width:100%;height:215px;border:0;display:block;margin-top:14px;background:transparent" referrerpolicy="no-referrer"></iframe></article><article class="widget clock-widget"><div class="clock-content"><div class="eyebrow">Here & now</div><div class="clock-row"><time class="time" id="time"></time></div><div class="timezone" id="timezone"></div></div><svg class="orbit" viewBox="0 0 100 100" fill="none" aria-hidden="true"><circle cx="50" cy="50" r="39" stroke="currentColor" opacity=".23"/><ellipse cx="50" cy="50" rx="47" ry="15" stroke="currentColor" opacity=".4" transform="rotate(-32 50 50)"/><circle class="sun-ball" cx="50" cy="50" r="23"/><circle cx="87" cy="27" r="4" fill="var(--bg)" stroke="currentColor"/></svg><div class="world-clock" id="world-clock"><div><span class="eyebrow">Elsewhere</span><span id="world-city" class="timezone"></span></div><time id="world-time"></time></div><section class="focus-timer" id="focus-timer" aria-label="Focus timer"><div class="timer-top"><span class="eyebrow">A little focus</span><select id="timer-duration" aria-label="Focus duration">${[15,25,45,60].map(n=>`<option value="${n}">${n} minutes</option>`).join('')}</select></div><div class="timer-row"><strong id="timer-time">25:00</strong><div class="buttons"><button class="button" id="timer-start">Start focus</button><button class="button" id="timer-reset" aria-label="Reset focus timer">↺</button></div></div><div class="timer-track"><span id="timer-progress"></span></div><span id="timer-status" class="hint" role="status">Make a little room for one thing.</span></section></article></section></div>
    <section class="data-panel" id="panel-weather" role="tabpanel" aria-labelledby="tab-weather" hidden><div class="data-card"><div class="data-heading"><div><h2 id="weather-city">A little look outside.</h2><p class="hint" id="weather-location">Choose a city to see the current weather and five-day forecast.</p></div><div class="buttons"><button class="button" id="change-city">Change city</button><button class="button" id="refresh-weather">Refresh</button><button class="button" id="weather-units" aria-label="Toggle weather temperature units">°C / °F</button></div></div><form class="city-search" id="city-form"><input id="city-query" placeholder="Search a city…" aria-label="Weather city" maxlength="100" required minlength="2"><button class="button primary" type="submit">Find city</button></form><div class="city-list" id="city-results"></div><div class="data-status" id="weather-status" role="status"></div><div id="weather-content"></div><p class="source-note"><a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Weather data by Open-Meteo</a> · <span id="weather-updated">Forecasts are estimates.</span></p></div></section>
    <section class="data-panel" id="panel-news" role="tabpanel" aria-labelledby="tab-news" hidden><div class="data-card"><div class="data-heading"><div><h2>A wider perspective.</h2><p class="hint">The latest headlines, on your terms.</p></div><button class="button" id="refresh-news">Refresh headlines</button></div><div class="news-controls"><select id="news-topic" aria-label="News topic">${['local','top','world','technology','business','science','sports','health','entertainment','custom'].map(x=>`<option value="${x}">${x==='local'?'Near you':x==='top'?'Top stories':x==='custom'?'My topic':x[0].toUpperCase()+x.slice(1)}</option>`).join('')}</select><button class="button" id="news-customize">News preferences</button></div><div class="data-status" id="news-status" role="status"></div><div class="news-grid" id="news-content"></div><div class="news-pagination"><button class="button" id="more-news" hidden>Show more articles ${icon('plus')}</button><span id="news-count-label" class="hint"></span></div><p class="source-note"><a href="https://news.google.com/" target="_blank" rel="noopener noreferrer">Headlines via Google News</a> · <span id="news-updated">Articles open at their source.</span></p></div></section></main>
    <footer><div class="footer-left"><span class="small-sun">✳</span><a class="version-link" href="${repoURL}/releases/tag/v${version}" target="_blank" rel="noopener noreferrer" aria-label="GoogleRefreshed version ${version}">v${version}</a><button class="text-button" id="open-commands" title="Open command palette (Ctrl+K)">A quieter corner. &nbsp; Ctrl K</button></div><button class="customize" id="customize">${icon('sliders')} Customize</button></footer></div>
    <dialog class="drawer" id="settings" aria-labelledby="settings-title"><div class="dialog-head"><h2 id="settings-title">Make yourself at home.</h2><button class="close" data-close aria-label="Close customization">${icon('close')}</button></div><div class="panel-content"><p class="hint">A few small changes. A space that feels like you.<br>Everything saves automatically in this browser.</p><div class="settings-reset"><button class="button" id="reset">Reset settings to default</button><p class="hint" id="reset-hint" role="status">Restore the original theme, layout, shortcuts and preferences.</p></div>
      <div class="group"><h3>Light, dark, or in sync</h3><div class="appearance" aria-label="Appearance mode">${['light','dark','system'].map(x=>`<button data-appearance-choice="${x}" aria-pressed="false">${x[0].toUpperCase()+x.slice(1)}</button>`).join('')}</div><p class="appearance-note">Every theme works in light and dark mode.</p></div>
      <div class="group"><h3>Find your atmosphere</h3><div class="theme-tools"><label class="theme-search-label">Search themes<input id="theme-search" type="search" placeholder="Try ocean, space, snow…" autocomplete="off" maxlength="80"></label><label>Browse a collection<select id="theme-collection"><option value="">All themes</option>${[...new Set(themes.map(t=>t.group))].map(group=>`<option value="${group}">${group}</option>`).join('')}</select></label></div><p id="theme-results" class="hint" role="status" aria-live="polite">${themes.length} themes · ${new Set(themes.map(t=>t.group)).size} collections</p><div class="themes">${themes.map((t,i)=>((!i||themes[i-1].group!==t.group)?`<div class="theme-category" data-theme-heading="${t.group}">${t.group}</div>`:'')+`<button class="theme" data-theme-choice="${t.id}" aria-pressed="false"><span class="theme-sample" data-world="${t.world}" style="--sample:${t.light[0]};--sample-fg:${t.light[1]}"></span>${t.name}</button>`).join('')}</div><p id="theme-empty" class="hint" hidden>No themes match. Try a different name or collection.</p></div>
      <div class="group"><h3>A touch of color</h3><div class="swatches">${['#c65332','#67815b','#587ea0','#8b6b9b','#b38a34'].map(c=>`<button class="swatch" style="--swatch:${c}" data-accent="${c}" aria-label="Accent ${c}" aria-pressed="false"></button>`).join('')}<input id="accent" type="color" aria-label="Custom accent color"></div></div>
      <div class="group"><h3>The personal touches</h3><label class="field">Homepage font<select id="font-choice" aria-label="Homepage font">${[...new Set(GoogleRefreshed.fonts.map(f=>f.group))].map(group=>`<optgroup label="${group}">${GoogleRefreshed.fonts.filter(f=>f.group===group).map(f=>`<option value="${f.id}">${f.name}</option>`).join('')}</optgroup>`).join('')}</select></label><label class="field">Default search engine<select id="engine-setting">${GoogleRefreshed.engines.map(e=>`<option value="${e.id}"><img class="engine-option-icon" src="${assetURL(e.id)}" alt="">${e.name}</option>`).join('')}</select></label><p class="hint">Changes searches on this page. The address-bar default is controlled in Brave settings. Maps and reverse-image search use Google. Autocomplete prefixes are sent to Google only when Google is selected.</p><label class="field">Daily card<select id="home-card" aria-label="Daily card"><option value="hardware">Hardware monitor</option><option value="note">Focus note</option></select></label><label class="toggle">Images in search suggestions<input type="checkbox" data-setting="suggestionImages"></label><label class="toggle">Keep theme on Google results<input type="checkbox" data-setting="resultsTheme"></label><div class="browser-theme-preview" aria-label="Matching browser theme preview"><div class="preview-tabs"><span>GoogleRefreshed ×</span><span>New tab +</span></div><div class="preview-address">⌂　 google.com　 ☆</div></div><p class="hint" id="matching-theme-name"></p><div class="buttons"><button class="button" id="matching-theme">Download matching browser theme</button><button class="button" id="theme-extensions">Open Brave extensions</button></div><ol class="hint theme-steps"><li>Download the matching theme’s manifest.json.</li><li>Save it in a separate folder named after the theme.</li><li>In Brave extensions, enable Developer mode, choose Load unpacked, and select that theme folder.</li></ol><p class="hint">This colors Brave’s tabs, address bar, toolbar, and bookmarks. Brave requires a separate native theme; changing this page’s palette cannot automatically replace it. Repeat these steps for a different toolbar palette.</p><label class="toggle">Google search suggestions<input type="checkbox" data-setting="suggestions"></label><p class="hint">Sends typed text to Google for autocomplete. Search text is never saved by GoogleRefreshed.</p><label class="field">What should we call you?<input id="name" maxlength="32" placeholder="Your name (optional)" autocomplete="off" dir="auto"></label><label class="toggle">Animations & ambient effects<input type="checkbox" data-setting="animations"></label><label class="field">Animation intensity<select id="motion-intensity"><option value="vivid">Vivid · more movement</option><option value="subtle">Subtle · a quieter backdrop</option></select></label><p class="hint">Motion pauses in hidden tabs and follows your system’s reduced-motion preference.</p><label class="toggle">Show clock<input type="checkbox" data-setting="clock"></label><label class="toggle">Show world clock<input type="checkbox" data-setting="worldClock"></label><label class="field">Second time zone<select id="world-zone">${[['UTC','UTC'],['Europe/London','London'],['America/New_York','New York'],['America/Los_Angeles','Los Angeles'],['Asia/Tokyo','Tokyo'],['Asia/Jerusalem','Jerusalem'],['Europe/Paris','Paris'],['Australia/Sydney','Sydney']].map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label class="toggle">Show focus timer<input type="checkbox" data-setting="focusTimer"></label><label class="toggle">Use a 24-hour clock<input type="checkbox" data-setting="hour24"></label><label class="toggle">Show daily card<input type="checkbox" data-setting="focus"></label><label class="toggle">Show shortcuts<input type="checkbox" data-setting="shortcutsVisible"></label><label class="toggle">Open shortcuts in a new tab<input type="checkbox" data-setting="newTab"></label><label class="toggle">Open GoogleRefreshed in every new tab<input type="checkbox" data-setting="newTabHome"></label><p class="hint" id="new-tab-hint">Brave asks once to let GoogleRefreshed recognize its new-tab page. Tab addresses are only compared with the new-tab page, never stored or sent.</p><label class="toggle">Compact layout<input type="checkbox" data-setting="compact"></label></div>
      <div class="group" id="feed-settings"><h3>Weather & news</h3><label class="toggle">Colorful weather icons<input type="checkbox" data-setting="colorfulWeather"></label><label class="toggle">Show news images<input type="checkbox" data-setting="newsImages"></label><label class="field">News source<select id="news-source" aria-label="News source"><option value="google">Google News</option><option value="bing">Local news with photos · Bing</option><option value="bbc">BBC News · with photos</option><option value="guardian">The Guardian · with photos</option></select></label><p class="hint">Local photo coverage is available from Bing News, BBC, and The Guardian. Google News also stays available; its feed does not include photos. Their regional coverage and language options differ.</p><label class="toggle">Detect my weather city automatically<input type="checkbox" data-setting="autoLocation"></label><label class="toggle">Use my location for news<input type="checkbox" data-setting="localNews"></label><label class="toggle">Show Weather tab<input type="checkbox" data-setting="weatherEnabled"></label><label class="toggle">Show News tab<input type="checkbox" data-setting="newsEnabled"></label><label class="field">Temperature units<select id="units"><option value="celsius">Celsius (°C)</option><option value="fahrenheit">Fahrenheit (°F)</option></select></label><label class="field">News edition<select id="news-region">${[['US','United States'],['GB','United Kingdom'],['IL','Israel'],['CA','Canada'],['AU','Australia'],['DE','Germany'],['FR','France'],['IN','India'],['JP','Japan']].map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label class="field">News language<select id="news-language">${[['en','English'],['he','Hebrew'],['de','German'],['fr','French'],['ja','Japanese']].map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label class="field">Your custom topic<input id="news-query" maxlength="150" placeholder="e.g. space exploration, design, gaming" dir="auto"></label><label class="field">Number of headlines<select id="news-count"><option value="3">3 headlines</option><option value="6">6 headlines</option><option value="9">9 headlines</option></select></label><p class="privacy-hint">Automatic location uses ipwho.is to estimate your city from your IP address when you open Weather or News. No GPS permission is used. Opening Weather sends approximate city coordinates to Open-Meteo. Finding a city sends that city name to its search service. News sends your chosen edition and topic to Google News. Requests also share your IP address. Data is fetched only when needed and cached for 20 minutes.</p></div>
      <div class="group"><h3>Background</h3><p class="hint">Bring your own photo. It stays in this browser.</p><div class="buttons"><label class="button">Choose photo<input type="file" id="photo-file" accept="image/png,image/jpeg,image/webp" hidden></label><button class="button" id="remove-photo">Remove photo</button></div></div>
      <div class="group"><h3>Your shortcuts</h3><button class="button" id="manage-shortcuts">Manage shortcuts ${icon('arrow')}</button></div>
      <div class="group"><h3>Across your devices</h3><label class="toggle">Use browser settings sync<input id="browser-sync" type="checkbox"></label><p class="hint">Opt in on each device. Shares appearance, shortcuts, and widget preferences through your browser’s sync service. Notes, photos, your name, location coordinates, and hardware data stay local.</p><button class="button" id="sync-now">Check browser sync</button><p class="hint" id="sync-status" role="status">Checking availability…</p><p class="hint">Brave may expose this storage API without syncing extension settings across devices. A saved copy does not confirm delivery. Enable browser sync and use the same extension ID on both devices; unpacked installs can have different IDs. Export / Import works as a manual alternative.</p><p class="hint" id="sync-id" style="overflow-wrap:anywhere"></p></div><div class="group"><h3>Keep it yours</h3><div class="buttons"><button class="button" id="export">Export settings</button><label class="button">Import settings<input id="import" type="file" accept="application/json,.json" hidden></label></div><p class="hint">Exports include your note and photo. No analytics, remote fonts, or tracking.</p><button class="text-button" id="native">Open classic Google, including voice & Lens ↗</button></div>
      <div class="group"><h3>GoogleRefreshed · v${version}</h3><a class="button" id="check-updates" href="${repoURL}/releases/latest" target="_blank" rel="noopener noreferrer">Check GitHub for updates ${icon('external')}</a><p class="hint">Opens the latest GitHub release. Compare its version with v${version}, download the new files, then reload the extension in Brave.</p><a class="text-button" href="${repoURL}" target="_blank" rel="noopener noreferrer">View repository ↗</a></div></div></dialog>
    <dialog class="modal welcome-modal" id="welcome-dialog" aria-labelledby="welcome-title" aria-describedby="welcome-description"><div class="welcome-mark">${GoogleRefreshed.logo}</div><div class="dialog-head"><h2 id="welcome-title">A little more you.</h2></div><form class="panel-content" id="welcome-form"><p id="welcome-description">What should we call you? A name or nickname makes your homepage feel like home.</p><label class="field" for="welcome-name">Your name or nickname <span class="hint">(optional)</span><input id="welcome-name" maxlength="32" placeholder="How you like to be addressed" autocomplete="off" dir="auto" autofocus></label><p class="hint">Saved on this device. Your name is not sent to a server or included in browser settings sync. You can change it in Customize.</p><div class="buttons"><button class="button primary" id="welcome-save" type="submit">Make it mine ${icon('arrow')}</button><button class="button" id="welcome-skip" type="button">Skip for now</button></div><p class="error" id="welcome-error" role="alert"></p></form></dialog>
    <dialog class="modal" id="shortcut-dialog" aria-labelledby="shortcut-title"><div class="dialog-head"><h2 id="shortcut-title">Your everyday.</h2><button class="close" data-close aria-label="Close shortcuts">${icon('close')}</button></div><div class="panel-content"><p class="hint">Keep your favorite places a little closer.</p><div id="shortcut-list"></div><button class="button" id="add-shortcut" style="margin-top:18px">${icon('plus')} Add shortcut</button></div></dialog>
    <dialog class="modal" id="link-dialog" aria-labelledby="link-title"><div class="dialog-head"><h2 id="link-title">Add a little shortcut.</h2><button class="close" data-close aria-label="Close shortcut editor">${icon('close')}</button></div><form class="panel-content" id="link-form"><label class="field">Name<input id="link-name" maxlength="28" required placeholder="A favorite place" autocomplete="off" dir="auto"></label><label class="field">Website<input id="link-url" maxlength="2048" required placeholder="example.com" autocomplete="off"></label><label class="field">Group<select id="link-group"><option value="personal">Personal</option><option value="work">Work</option><option value="study">Study</option></select></label><label class="toggle">Use the original service icon<input type="checkbox" id="link-original" checked></label><label class="field">Custom icon or initials<input id="link-glyph" maxlength="4" placeholder="e.g. ✦ or AB"></label><label class="field">Shortcut color<input id="link-color" type="color"></label><p class="error" id="link-error" role="alert"></p><div class="buttons"><button class="button primary" type="submit">Save shortcut ${icon('arrow')}</button></div></form></dialog>
    <dialog class="modal" id="lens-dialog" aria-labelledby="lens-title"><div class="dialog-head"><h2 id="lens-title">Search by image.</h2><button class="close" data-close aria-label="Close reverse image search">${icon('close')}</button></div><div class="panel-content"><p class="hint">Find similar images, identify objects, or discover where a picture appears with Google Lens.</p><form id="lens-upload" action="https://lens.google.com/v3/upload" method="post" enctype="multipart/form-data"><label class="field">Upload an image<input id="lens-file" name="encoded_image" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" required></label><button class="button primary" type="submit">Search this image</button></form><div class="group"><form id="lens-link"><label class="field">Or paste an image link<input id="lens-url" type="url" placeholder="https://example.com/photo.jpg" maxlength="8192" required autocomplete="off"></label><button class="button" type="submit">Search image link</button></form></div><p class="error" id="lens-error" role="alert"></p><p class="hint">Choose a JPG, PNG, WebP, GIF, or AVIF up to 20 MB. Your image or link goes directly to Google Lens when you search. GoogleRefreshed does not save it.</p></div></dialog>
    <dialog class="modal" id="apps-dialog" aria-labelledby="apps-title"><div class="dialog-head"><h2 id="apps-title">A world of Google.</h2><button class="close" data-close aria-label="Close Google apps">${icon('close')}</button></div><div class="panel-content"><div class="shortcut-grid" style="grid-template-columns:repeat(3,1fr)" id="google-apps"></div><p class="hint">Need your Google account menu? <button class="text-button" id="account-native">Open classic Google ↗</button></p></div></dialog>
    <dialog class="command-modal" id="command-dialog" aria-label="Command palette"><input class="command-input" id="command-query" placeholder="Go somewhere. Change something." aria-label="Find a command or shortcut" role="combobox" aria-expanded="true" aria-controls="command-list" autocomplete="off"><div class="commands" id="command-list" role="listbox" aria-label="Commands"></div><div class="command-footer"><span>↑ ↓ navigate · Enter select</span><button class="text-button" data-close>Esc to close</button></div></dialog>
    <div class="toast" role="status" hidden></div></div><button class="reopen" hidden>✳ &nbsp; Back to GoogleRefreshed</button>`;
  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];
  const app = $('.app');
  addEventListener('message',event=>{
    const frame=$('#hardware-frame'),origin=preview?location.origin:'chrome-extension://'+chrome.runtime.id;
    if(event.source!==frame.contentWindow||event.origin!==origin)return;
    if(event.data?.type==='google-refreshed-monitor-status'&&['Sampling','Live','Retrying'].includes(event.data.state)){$('#hardware-status').textContent=event.data.state;return;}
    if(event.data?.type!=='google-refreshed-frame-size'||!Number.isFinite(event.data.height))return;
    frame.style.height=Math.max(90,Math.min(400,event.data.height))+'px';
  });
  // Keep uploaded photo bytes out of the Google page's inspectable style attributes.
  const photoPrivate=$('.photo').attachShadow({mode:'closed'}),photoLayer=document.createElement('div');
  photoLayer.style.cssText='width:100%;height:100%;background-position:center;background-size:cover;';photoPrivate.append(photoLayer);
  function toast(message) { const t = $('.toast'); t.textContent = message; t.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => t.hidden = true, 3600); }
  function flushSave() {
    clearTimeout(saveTimer);
    if(!saveWaiters.length)return saveQueue;
    const waiters=saveWaiters;saveWaiters=[];
    const snapshot = JSON.parse(JSON.stringify(settings));
    saveQueue = saveQueue.catch(() => {}).then(() => storage.set(snapshot)).then(()=>waiters.forEach(resolve=>resolve(true))).catch(() => {toast('Could not save. Try removing the background photo or exporting your settings.');waiters.forEach(resolve=>resolve(false));});
    return saveQueue;
  }
  function save(){clearTimeout(saveTimer);saveTimer=setTimeout(flushSave,180);return new Promise(resolve=>saveWaiters.push(resolve));}
  addEventListener('pagehide',flushSave);
  function updateClock() {
    const now = new Date();
    $('#date').textContent = dateFormatter.format(now);
    const greeting = GoogleRefreshed.greeting(now, settings.name);
    const em = document.createElement('em'); em.textContent = greeting.phrase;
    if (greeting.name) {
      const name = document.createElement('bdi'); name.dir = 'auto'; name.textContent = greeting.name;
      em.append(document.createTextNode(', '), name);
    }
    $('#greeting').replaceChildren(document.createTextNode(greeting.lead), em);
    $('#time').textContent = new Intl.DateTimeFormat(undefined, {hour:'2-digit',minute:'2-digit',hour12:!settings.hour24}).format(now);
    $('#time').dateTime = now.toISOString();
    $('#timezone').textContent = localZone;
    $('#world-city').textContent=settings.worldZone==='UTC'?'UTC':settings.worldZone.split('/').at(-1).replaceAll('_',' ');
    $('#world-time').textContent=new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',hour12:!settings.hour24,timeZone:settings.worldZone}).format(now);
  }
  function scheduleClock(){clearTimeout(clockTimer);if(document.hidden||classic)return;updateClock();clockTimer=setTimeout(scheduleClock,60000-Date.now()%60000+30);}
  function updateMotion(){app.dataset.motion=settings.animations&&!reducedMotion.matches?'on':'off';app.dataset.paused=String(document.hidden||classic);}
  document.addEventListener('visibilitychange',()=>{if(!settings)return;updateMotion();scheduleClock();});
  reducedMotion.addEventListener('change',()=>{if(settings)updateMotion();});
  systemDark.addEventListener('change',()=>{if(settings?.appearance==='system')apply();});
  function makeShortcut(item, index, services = false) {
    const a = document.createElement('a'); a.className = 'shortcut'; a.href = item.url; a.title = item.url;
    if (!services && settings.newTab) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    const glyph = document.createElement('span'); glyph.className = 'tile'; glyph.style.setProperty('--tile', item.color);
    const service=officialIcon(item.url);
    if(service&&item.iconMode!=='text'){const image=document.createElement('img');image.className='service-icon';image.alt='';image.width=25;image.height=25;image.dataset.service=service;image.src=assetURL(service);image.onerror=()=>{image.remove();glyph.textContent=item.glyph;};glyph.append(image);}else glyph.textContent=item.glyph;
    const label = document.createElement('span'); label.textContent = item.name;
    const arrow = document.createElement('span'); arrow.className = 'go'; arrow.textContent = '↗'; arrow.ariaHidden = 'true';
    a.append(glyph,label,arrow);if(services)return a;
    const cell=document.createElement('div');cell.className='shortcut-cell';const edit=document.createElement('button');edit.className='shortcut-pencil';edit.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m15 5 4 4M4 20l5-1L20 8a3 3 0 0 0-4-4L5 15Z"/></svg>';edit.setAttribute('aria-label','Edit '+item.name+' shortcut');edit.onclick=()=>editLink(index);cell.append(a,edit);return cell;
  }
  function changeEngine(value){settings.engine=value;hideSuggestions();suggestionCache.clear();apply();save();}
  $('#engine-quick').onchange=e=>changeEngine(e.target.value);$('#engine-setting').onchange=e=>changeEngine(e.target.value);
  $('#motion-intensity').onchange=e=>{settings.motionIntensity=e.target.value;apply();save();};
  $('#world-zone').onchange=e=>{settings.worldZone=e.target.value;updateClock();save();};
  let focusEnd=0,focusRemaining=0,focusTotal=0,focusTick;
  function renderFocus(){
    clearTimeout(focusTick);if(!settings)return;
    if(focusEnd){focusRemaining=Math.max(0,focusEnd-Date.now());if(!focusRemaining){focusEnd=0;$('#timer-status').textContent='Session complete. Take a breath.';}}
    const remaining=focusRemaining||(!focusTotal?settings.focusMinutes*60000:0),seconds=Math.ceil(remaining/1000);
    $('#timer-time').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
    $('#timer-start').textContent=focusEnd?'Pause':focusTotal&&focusRemaining?'Resume':'Start focus';$('#timer-progress').style.width=(focusTotal?Math.min(100,(1-focusRemaining/focusTotal)*100):0)+'%';
    if(focusEnd&&!document.hidden&&!classic&&settings.clock&&settings.focusTimer)focusTick=setTimeout(renderFocus,1000);
  }
  async function restoreFocus(){try{const value=preview?JSON.parse(localStorage.getItem('grFocusTimer')):(await chrome.storage.local.get('grFocusTimer')).grFocusTimer;if(value&&[value.end,value.remaining,value.total].every(Number.isFinite)&&value.total>=0&&value.total<=3600000&&value.end>=0&&value.end<=Date.now()+3600000){focusEnd=value.end;focusRemaining=Math.max(0,Math.min(value.remaining,value.total));focusTotal=value.total;}}catch{}}
  function persistFocus(){const value={end:focusEnd,remaining:focusRemaining,total:focusTotal};if(preview)localStorage.setItem('grFocusTimer',JSON.stringify(value));else chrome.storage.local.set({grFocusTimer:value}).catch(()=>{});}
  function resetFocus(){focusEnd=focusTotal=focusRemaining=0;$('#timer-status').textContent='Make a little room for one thing.';renderFocus();persistFocus();}
  $('#timer-start').onclick=()=>{if(focusEnd){focusRemaining=Math.max(0,focusEnd-Date.now());focusEnd=0;$('#timer-status').textContent='Paused. Continue when ready.';}else{if(!focusRemaining){focusRemaining=settings.focusMinutes*60000;focusTotal=focusRemaining;}focusEnd=Date.now()+focusRemaining;$('#timer-status').textContent='One thing at a time.';}renderFocus();persistFocus();};
  $('#timer-reset').onclick=resetFocus;
  $('#timer-duration').onchange=e=>{settings.focusMinutes=Number(e.target.value);resetFocus();save();};
  document.addEventListener('visibilitychange',renderFocus);
  $('#font-choice').onchange=e=>{settings.font=e.target.value;apply();save();};
  $('#home-card').onchange=e=>{settings.homeCard=e.target.value;apply();save();};
  $('#theme-extensions').onclick=async()=>{if(preview){toast('Open brave://extensions in Brave to load your downloaded theme folder.');return;}try{await requestData({type:'openExtensions'});}catch{toast('Open brave://extensions to load the theme folder.');}};
  $('#matching-theme').onclick=()=>{
    const {theme,dark,colors}=GoogleRefreshed.palette(settings),rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
    const manifest={manifest_version:3,name:'GoogleRefreshed · '+theme.name+' · '+(dark?'Dark':'Light'),version,theme:{colors:{frame:rgb(colors[0]),toolbar:rgb(colors[4]),tab_text:rgb(colors[1]),tab_background_text:rgb(colors[2]),bookmark_text:rgb(colors[1]),ntp_background:rgb(colors[0]),ntp_text:rgb(colors[1]),omnibox_background:rgb(colors[0]),omnibox_text:rgb(colors[1])}}};
    const href=URL.createObjectURL(new Blob([JSON.stringify(manifest,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=href;link.download='manifest.json';link.click();setTimeout(()=>URL.revokeObjectURL(href),1000);toast('Save this manifest in a separate theme folder. Load that folder in Brave to match the toolbar.');
  };
  function renderShortcuts() {
    const visible=settings.shortcuts.filter(x=>settings.activeGroup==='all'||(x.group||'personal')===settings.activeGroup);
    const grid = $('.shortcut-grid'); grid.replaceChildren(...visible.map(x => makeShortcut(x,settings.shortcuts.indexOf(x))));$('#shortcut-group').value=settings.activeGroup;$('#shortcut-count').textContent=visible.length?' · '+visible.length:'';$('#quick-add-shortcut').disabled=settings.shortcuts.length>=60;
    if (settings.shortcuts.length < 60) {
      const add = document.createElement('button'); add.className = 'shortcut add'; add.innerHTML = `<span class="tile">${icon('plus')}</span><span>Add shortcut</span>`; add.onclick = () => editLink(); grid.append(add);
    }
  }
  $('#shortcut-group').onchange=e=>{settings.activeGroup=e.target.value;renderShortcuts();save();};
  function apply() {
    if(settings.welcomeComplete && $('#welcome-dialog').open) $('#welcome-dialog').close();
    if($('.theme-art').dataset.theme!==settings.theme){$('.theme-art').innerHTML=globalThis.GoogleRefreshedScenes?.render(settings.theme)||'';$('.theme-art').dataset.theme=settings.theme;}
    app.dataset.motionIntensity=settings.motionIntensity;$('#motion-intensity').value=settings.motionIntensity;
    const engine=GoogleRefreshed.engines.find(e=>e.id===settings.engine)||GoogleRefreshed.engines[0];$('#engine-quick').value=$('#engine-setting').value=engine.id;$('#engine-google-icon').hidden=false;$('#engine-google-icon').src=assetURL(engine.id);$('#engine-letter').hidden=true;$('#engine-google-icon').onerror=()=>{$('#engine-google-icon').hidden=true;$('#engine-letter').hidden=false;};$('#engine-letter').textContent=engine.letter;$('#engine-letter').style.color=engine.color;$('.query').setAttribute('aria-label','Search '+engine.name);$('.query').placeholder='Search '+engine.name+' or explore an idea';$('#search .submit').setAttribute('aria-label','Search '+engine.name);$('#search').action=GoogleRefreshed.searchURL(engine.id,'all','').split('?')[0];
    $('#world-clock').hidden=!settings.worldClock;$('#focus-timer').hidden=!settings.focusTimer;$('#world-zone').value=settings.worldZone;$('#timer-duration').value=String(settings.focusMinutes);renderFocus();
    app.style.setProperty('--gr-font',GoogleRefreshed.loadFont(settings.font));$('#font-choice').value=settings.font;
    const theme=themeById(settings.theme),dark=settings.appearance==='dark'||settings.appearance==='system'&&systemDark.matches;
    const palette=dark?theme.dark:theme.light;
    ['--bg','--fg','--muted','--line','--soft','--glow'].forEach((key,i)=>app.style.setProperty(key,palette[i]));
    app.style.setProperty('--panel',`color-mix(in srgb,${palette[0]} 65%,${dark?'#ffffff0d':'white'})`);
    app.style.setProperty('--field',dark?`color-mix(in srgb,${palette[0]} 75%,${palette[4]})`:`color-mix(in srgb,${palette[0]} 25%,white)`);
    app.dataset.theme = settings.theme;app.dataset.world=theme.world;app.dataset.appearance=dark?'dark':'light';app.style.colorScheme=dark?'dark':'light';
    // Match the frame's embedding scheme to its document so Chromium keeps its canvas transparent.
    $('#hardware-frame').style.colorScheme=dark?'dark':'light';
    app.style.setProperty('--accent',dark?`color-mix(in srgb,${settings.accent} 70%,white)`:settings.accent); app.classList.toggle('compact',settings.compact); app.classList.toggle('has-photo',!!settings.photo);
    $('#matching-theme-name').textContent='Ready for Brave: '+theme.name+' · '+(dark?'Dark':'Light');
    $('#matching-theme').title='Matching '+themeById(settings.theme).name+' theme for Brave toolbar, tabs, and bookmarks';
    updateMotion();
    app.dataset.weatherColor=String(settings.colorfulWeather);
    if(!settings.suggestions||settings.engine!=='google')hideSuggestions();
    const quick=$('#quick-mode');quick.innerHTML=icon(dark?'sun':'moon');quick.title=quick.ariaLabel=dark?'Switch to light mode':'Switch to dark mode';
    photoLayer.style.backgroundImage = settings.photo ? `url("${settings.photo}")` : 'none';
    $('.clock-widget').hidden = !settings.clock; $('.focus-widget').hidden = !settings.focus;
    $('.widgets').hidden = !settings.clock && !settings.focus; $('.widgets').style.gridTemplateColumns = settings.clock && settings.focus ? '' : '1fr';
    $('.shortcuts').hidden = !settings.shortcutsVisible;
    $('#home-card').value=settings.homeCard;$('#daily-title').textContent=settings.homeCard==='hardware'?'System activity':'Daily focus';$('#hardware-status').hidden=settings.homeCard!=='hardware';
 $('#name').value = settings.name; $('#accent').value = settings.accent;
    $$('[data-setting]').forEach(el => el.checked = settings[el.dataset.setting]);
    const themeEmblems={paper:'▱',sage:'❧',ocean:'≈',rose:'❀',futuristic:'⌘',mystic:'☽',magical:'✧',rustic:'▥',solar:'☀',spring:'✿',summer:'☼',autumn:'♧',winter:'❄',midnight:'⋆',aurora:'〰',cosmic:'◉',noir:'◧',amber:'♦',ice:'◇',flowers:'❁',fantasy:'♜',code:'{ }',cloudy:'☁',scary:'☾',colorful:'●',storm:'ϟ',sunset:'◒',math:'∑',library:'▤',office:'▣',science:'⚛',nature:'♧',city:'▥',rainbow:'⌒',lunar:'◐',sakura:'✿',fire:'♨',magma:'▲',snow:'❄',blackhole:'◉',coralreef:'❋',hawaii:'✺',aztec:'▰',desert:'◭',cave:'⌁',emerald:'◇',retro:'▣',radioactive:'☢',shadow:'◐',fjord:'∿',lerouge:'♜',fashion:'✂'};
    $$('[data-theme-choice]').forEach(el=>{const t=themeById(el.dataset.themeChoice),p=dark?t.dark:t.light;el.setAttribute('aria-pressed',String(t.id===settings.theme));el.style.background=p[0];el.style.color=p[1];el.style.borderColor=t.id===settings.theme?settings.accent:p[3];const sample=el.querySelector('.theme-sample');sample.style.setProperty('--sample',p[0]);sample.style.setProperty('--sample-soft',p[4]);sample.style.setProperty('--sample-fg',p[1]);if(!sample.firstElementChild){const emblem=document.createElement('span');emblem.className='theme-emblem';emblem.setAttribute('aria-hidden','true');emblem.textContent=themeEmblems[t.id]||'✧';sample.append(emblem);}});
    $$('[data-appearance-choice]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.appearanceChoice===settings.appearance)));
    $$('[data-accent]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.accent === settings.accent)));
    if(![...$('#news-region').options].some(x=>x.value===settings.newsRegion)){const option=document.createElement('option');option.value=settings.newsRegion;option.textContent=new Intl.DisplayNames(['en'],{type:'region'}).of(settings.newsRegion);$('#news-region').append(option);}
    $('#units').value=settings.units;$('#news-region').value=settings.newsRegion;$('#news-language').value=settings.newsLanguage;$('#news-query').value=settings.newsQuery;$('#news-count').value=String(settings.newsCount);$('#news-topic').value=settings.newsTopic;$('#news-source').value=settings.newsSource;
    $('#tab-weather').hidden=!settings.weatherEnabled;$('#tab-news').hidden=!settings.newsEnabled;
    if(activeTab==='weather'&&!settings.weatherEnabled||activeTab==='news'&&!settings.newsEnabled)activeTab='home';
    updateTabs();
    $('#remove-photo').hidden = !settings.photo; renderShortcuts(); updateClock();
  }
  function updateTabs(){
    $$('[data-tab]').forEach(el=>{el.setAttribute('aria-selected',String(el.dataset.tab===activeTab));el.tabIndex=el.dataset.tab===activeTab?0:-1;});
    for(const tab of ['home','weather','news'])$('#panel-'+tab).hidden=activeTab!==tab;
  }
  function switchTab(tab){activeTab=tab;updateTabs();if(tab==='weather')loadWeather();if(tab==='news')loadNews();}
  $$('[data-tab]').forEach(el=>{el.onclick=()=>switchTab(el.dataset.tab);el.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=$$('[data-tab]').filter(x=>!x.hidden),index=tabs.indexOf(el);const next=e.key==='Home'?tabs[0]:e.key==='End'?tabs.at(-1):tabs[(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];next.focus();switchTab(next.dataset.tab);};});
  const previewCache=new Map();
  async function requestData(message,signal){
    if(!preview){
      const result=await new Promise((resolve,reject)=>{
        let settled=false;
        const port=chrome.runtime.connect({name:'google-refreshed-data'});
        const abort=()=>{port.disconnect();reject(new DOMException('Request cancelled','AbortError'));};
        const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);};
        const timer=setTimeout(()=>{port.disconnect();reject(new Error('This source took too long. Please try again.'));},12000);
        port.onMessage.addListener(response=>{settled=true;cleanup();resolve(response);port.disconnect();});
        port.onDisconnect.addListener(()=>{cleanup();const error=chrome.runtime.lastError;if(!settled)reject(new Error(error?.message||'The data connection closed. Please try again.'));});
        if(signal?.aborted){abort();return;}signal?.addEventListener('abort',abort,{once:true});port.postMessage(message);
      });
      if(!result?.ok)throw new Error(result?.error||'Unable to reach this source.');return result;
    }
    const {force,...request}=message,key=JSON.stringify(request),saved=previewCache.get(key);
    if(message.type!=='hardware'&&!force&&saved&&Date.now()-saved.at<1200000)return saved;
    const response=await fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(request),signal:signal?AbortSignal.any([signal,AbortSignal.timeout(12000)]):AbortSignal.timeout(12000)});
    const result=await response.json();if(!result.ok)throw new Error(result.error||'This source is unavailable.');
    if(!['cities','hardware','suggestions'].includes(message.type)){if(previewCache.size>=4)previewCache.delete(previewCache.keys().next().value);previewCache.set(key,result);}return result;
  }
  function weatherLabel(code){
    if(code===0)return ['☀','Clear sky'];if(code<=3)return ['⛅','Partly cloudy'];if(code<=48)return ['☁','Foggy'];if(code<=57)return ['☂','Drizzle'];if(code<=67)return ['☂','Rain'];if(code<=77)return ['❄','Snow'];if(code<=82)return ['☂','Rain showers'];if(code<=86)return ['❄','Snow showers'];return ['ϟ','Thunderstorm'];
  }
  function weatherIcon(code,isDay=true){
    const sun='<g class="wx-sun"><circle cx="24" cy="24" r="10"/><path d="M24 7v-4m0 42v-4M7 24H3m42 0h-4M12 12l-3-3m30 30-3-3M12 36l-3 3m30-30-3 3"/></g>';
    const moon='<path class="wx-moon" d="M32 9a17 17 0 1 0 13 26A18 18 0 0 1 32 9Z"/>';
    const cloud='<path class="wx-cloud" d="M15 43a10 10 0 1 1 2-20 14 14 0 0 1 27-1 11 11 0 1 1 2 21Z"/>';
    let art=code===0?(isDay?sun:moon):code<=2?`<g transform="translate(4 0) scale(.8)">${isDay?sun:moon}</g>${cloud}`:cloud;
    if(code>=45&&code<=48)art=cloud+'<path class="wx-fog" d="M8 49h43M14 55h31"/>';
    else if(code>=51&&code<=67||code>=80&&code<=82)art=cloud+'<path class="wx-rain" d="m20 49-3 7m14-7-3 7m14-7-3 7"/>';
    else if(code>=71&&code<=77||code>=85&&code<=86)art=cloud+'<path class="wx-snow" d="M20 48v9m-4-7 8 5m-8 0 8-5m15-2v9m-4-7 8 5m-8 0 8-5"/>';
    else if(code>=95)art=cloud+'<path class="wx-storm" d="m33 43-9 10h8l-4 8 13-13h-9l4-5Z"/>';
    return `<svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${art}</svg>`;
  }
  let weatherRequest=0,newsRequest=0;
  let locationPromise,detectedLocation;
  async function ensureLocal(kind){
    if(kind==='weather'&&!settings.autoLocation||kind==='news'&&!settings.localNews)return;
    if(!detectedLocation){if(!locationPromise)locationPromise=requestData({type:'location'}).then(x=>detectedLocation=x.data).catch(error=>{locationPromise=null;throw error;});await locationPromise;}
    if(kind==='weather'&&settings.autoLocation)settings.city={name:detectedLocation.name,region:detectedLocation.region,country:detectedLocation.country,latitude:detectedLocation.latitude,longitude:detectedLocation.longitude};
    if(kind==='news'&&settings.localNews){
      settings.newsRegion=detectedLocation.countryCode;
      if(settings.newsLanguageAuto)settings.newsLanguage=({IL:'he',DE:'de',FR:'fr',JP:'ja'})[detectedLocation.countryCode]||'en';
      if(![...$('#news-region').options].some(x=>x.value===settings.newsRegion)){const option=document.createElement('option');option.value=settings.newsRegion;option.textContent=detectedLocation.country;$('#news-region').append(option);}
      $('#news-region').value=settings.newsRegion;$('#news-language').value=settings.newsLanguage;
    }
    save();
  }
  async function loadWeather(force=false){
    const request=++weatherRequest;
    if(settings.autoLocation){$('#weather-status').textContent='Finding your approximate city…';try{await ensureLocal('weather');}catch(error){if(!settings.city)$('#weather-status').textContent=error.message;}if(request!==weatherRequest)return;}
    $('#city-form').hidden=!!settings.city;$('#refresh-weather').hidden=!settings.city;$('#change-city').hidden=!settings.city;
    $('#weather-units').textContent=settings.units==='celsius'?'°C · switch to °F':'°F · switch to °C';
    if(!settings.city){$('#weather-city').textContent='A little look outside.';$('#weather-location').textContent='Choose a city to see the current weather and five-day forecast.';$('#weather-content').replaceChildren();return;}
    $('#weather-city').textContent=settings.city.name;$('#weather-location').textContent=[settings.city.region,settings.city.country].filter(Boolean).join(', ');
    $('#weather-status').textContent='Looking outside…';$('#refresh-weather').disabled=true;
    try{
      const result=await requestData({type:'weather',latitude:settings.city.latitude,longitude:settings.city.longitude,units:settings.units,...(force?{force:true}:{})});if(request!==weatherRequest)return;
      const data=result.data,current=data.current,daily=data.daily;if(!current||!daily||!Number.isFinite(current.temperature_2m))throw new Error('Weather data is temporarily unavailable.');
      const [symbol,label]=weatherLabel(current.weather_code);const wrap=document.createElement('div');wrap.className='weather-now';
      const s=document.createElement('span');s.className='weather-symbol';s.innerHTML=weatherIcon(current.weather_code,!!current.is_day);s.ariaHidden='true';
      const info=document.createElement('div'),temp=document.createElement('div'),detail=document.createElement('div');temp.className='temperature';temp.textContent=Math.round(current.temperature_2m)+(settings.units==='celsius'?'°C':'°F');detail.className='weather-detail';detail.textContent=`${label} · Feels like ${Math.round(current.apparent_temperature)}° · Wind ${Math.round(current.wind_speed_10m)} km/h`;info.append(temp,detail);wrap.append(s,info);
      const forecast=document.createElement('div');forecast.className='forecast';
      daily.time.slice(0,5).forEach((day,i)=>{const d=document.createElement('div');d.className='forecast-day';const title=document.createElement('div');title.textContent=i===0?'Today':new Intl.DateTimeFormat('en',{weekday:'short',timeZone:'UTC'}).format(new Date(day+'T12:00:00Z'));const weather=document.createElement('span');weather.innerHTML=weatherIcon(daily.weather_code[i]);weather.title=weatherLabel(daily.weather_code[i])[1];weather.setAttribute('role','img');weather.setAttribute('aria-label',weather.title);const high=document.createElement('strong');high.textContent=Math.round(daily.temperature_2m_max[i])+'° ';const low=document.createElement('small');low.textContent=Math.round(daily.temperature_2m_min[i])+'°';d.append(title,weather,high,low);forecast.append(d);});
      $('#weather-content').replaceChildren(wrap,forecast);$('#weather-status').textContent='';$('#weather-updated').textContent='Updated '+new Date(result.at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+' · Forecasts are estimates.';
    }catch(error){if(request===weatherRequest)$('#weather-status').textContent=error.message||'Weather is unavailable. Try again when you’re online.';}finally{if(request===weatherRequest)$('#refresh-weather').disabled=false;}
  }
  $('#city-form').onsubmit=async e=>{
    e.preventDefault();const submit=$('#city-form button');submit.disabled=true;$('#weather-status').textContent='Finding your city…';$('#city-results').replaceChildren();
    try{const result=await requestData({type:'cities',query:$('#city-query').value});$('#weather-status').textContent=result.data.length?'Choose your city below.':'No cities found. Try a nearby town.';for(const city of result.data){const button=document.createElement('button');button.className='button';button.textContent=[city.name,city.region,city.country].filter(Boolean).join(', ');button.onclick=()=>{settings.city=city;settings.autoLocation=false;$('[data-setting=autoLocation]').checked=false;$('#city-results').replaceChildren();save();loadWeather();};$('#city-results').append(button);}}catch(error){$('#weather-status').textContent=error.message;}finally{submit.disabled=false;}
  };
  $('#change-city').onclick=()=>{$('#city-form').hidden=false;$('#city-query').focus();};$('#refresh-weather').onclick=()=>loadWeather(true);
  $('#weather-units').onclick=()=>{settings.units=settings.units==='celsius'?'fahrenheit':'celsius';$('#units').value=settings.units;save();loadWeather();};
  $('#units').onchange=e=>{settings.units=e.target.value;save();if(activeTab==='weather')loadWeather();};
  function newsSettingsChanged(){newsRequest++;$('#news-content').replaceChildren();$('#news-status').textContent='';save();if(activeTab==='news')loadNews();}
  $('#news-topic').onchange=e=>{settings.newsTopic=e.target.value;newsSettingsChanged();};
  $('#news-source').onchange=e=>{settings.newsSource=e.target.value;if(!['google','bing'].includes(settings.newsSource)&&settings.newsTopic==='custom')settings.newsTopic='top';apply();newsSettingsChanged();};
  $('#news-region').onchange=e=>{settings.newsRegion=e.target.value;settings.localNews=false;$('[data-setting=localNews]').checked=false;newsSettingsChanged();};$('#news-language').onchange=e=>{settings.newsLanguage=e.target.value;settings.newsLanguageAuto=false;newsSettingsChanged();};
  $('#news-query').onchange=e=>{settings.newsQuery=e.target.value.trim().slice(0,150);if(settings.newsTopic==='custom')newsSettingsChanged();else save();};
  $('#news-count').onchange=e=>{settings.newsCount=Number(e.target.value);newsSettingsChanged();};
  $('#news-customize').onclick=()=>{openDialog('#settings');$('#feed-settings').scrollIntoView({block:'start'});};
  $('#refresh-news').onclick=()=>loadNews(true);
  let newsEntries=[],newsVisibleCount=0,activeNewsSource='bing';
  function parseNewsFeed(text){
    if(typeof text!=='string'||!/<(?:rss|feed)\b/i.test(text))throw new Error('The source returned a web page instead of a news feed.');
    const parser=new DOMParser();let xml=parser.parseFromString(text,'application/xml');
    if(xml.querySelector('parsererror')){
      // Some feeds contain HTML entities or bare ampersands that are invalid in XML.
      const entities={nbsp:'\u00a0',ndash:'\u2013',mdash:'\u2014',lsquo:'\u2018',rsquo:'\u2019',ldquo:'\u201c',rdquo:'\u201d'};
      const repaired=text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').split(/(<!\[CDATA\[[\s\S]*?\]\]>)/).map((chunk,i)=>i%2?chunk:chunk.replace(/&(nbsp|ndash|mdash|lsquo|rsquo|ldquo|rdquo);/g,(_,key)=>entities[key]).replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[a-f\d]+);)/gi,'&amp;')).join('');
      xml=parser.parseFromString(repaired,'application/xml');
    }
    if(xml.querySelector('parsererror'))throw new Error('This news feed could not be read.');return xml;
  }
  function labelNewsSource(source,fallback=false){
    activeNewsSource=source;const link=$('#panel-news .source-note a');link.textContent=({google:'Google News',bing:'Local headlines and photos · Bing News',bbc:'Headlines and photos · BBC News',guardian:'Headlines and photos · The Guardian'})[source]+(fallback?' · fallback':'');link.href=({google:'https://news.google.com/',bing:'https://www.bing.com/news',bbc:'https://www.bbc.com/news',guardian:'https://www.theguardian.com/'})[source];
  }
  function articleLink(raw){
    try{const url=new URL(raw);if(url.hostname==='www.bing.com'&&url.pathname==='/news/apiclick.aspx'){const target=new URL(url.searchParams.get('url'));if(target.protocol==='https:'&&!target.username&&!target.password)return target.href;return null;}
      if(url.protocol==='https:'&&['news.google.com','www.bbc.com','www.bbc.co.uk','bbc.com','bbc.co.uk','www.theguardian.com'].includes(url.hostname))return url.href;
    }catch{}return null;
  }
  function renderNews(){
    const cards=[];
    for(const item of newsEntries.slice(0,newsVisibleCount)){
      const title=item.querySelector('title')?.textContent,link=articleLink(item.querySelector('link')?.textContent);if(!title||!link)continue;
      const a=document.createElement('a');a.className='news-item';a.href=link;a.target='_blank';a.rel='noopener noreferrer';a.dir='auto';
      const elements=[...item.getElementsByTagName('*')],source=document.createElement('span');source.className='article-source';source.textContent=elements.find(x=>x.localName.toLowerCase()==='source')?.textContent||({google:'Google News',bing:'Bing News',bbc:'BBC News',guardian:'The Guardian'})[activeNewsSource];
      const heading=document.createElement('h3');heading.textContent=title;
      const when=document.createElement('small'),date=new Date(item.querySelector('pubDate')?.textContent);when.textContent=Number.isFinite(date.getTime())?date.toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})+' · Read article ↗':'Read article ↗';
      const media=elements.flatMap(x=>{
        const kind=x.localName.toLowerCase();if(!['thumbnail','content','image'].includes(kind))return [];
        let raw=x.getAttribute('url')||(kind==='image'?x.textContent.trim():'');if(!raw)return [];
        try{const u=new URL(raw);if(u.protocol==='http:'&&u.hostname==='www.bing.com')u.protocol='https:';if(u.protocol!=='https:'||!(['ichef.bbci.co.uk','i.guim.co.uk','media.guim.co.uk','lh3.googleusercontent.com','www.bing.com','th.bing.com'].includes(u.hostname)||/^tse[1-4]\.mm\.bing\.net$/.test(u.hostname)))return [];return [{url:u.href,width:Number(x.getAttribute('width'))||460}];}catch{return [];}
      }).sort((a,b)=>a.width-b.width);
      const image=media.find(x=>x.width>=300)||media.at(-1);
      if(settings.newsImages&&image){const img=document.createElement('img');img.className='news-thumb';img.src=image.url;img.alt='';img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';img.onerror=()=>{img.remove();a.classList.add('no-photo');};a.append(img);}else a.classList.add('no-photo');
      a.append(source,heading,when);cards.push(a);
    }
    $('#news-content').replaceChildren(...cards);$('#more-news').hidden=newsVisibleCount>=newsEntries.length;$('#news-count-label').textContent=cards.length?'Showing '+cards.length+' of '+newsEntries.length+' articles':'';
  }
  $('#more-news').onclick=()=>{newsVisibleCount=Math.min(newsVisibleCount+settings.newsCount,newsEntries.length);renderNews();};
  async function loadNews(force=false){
    const request=++newsRequest;$('#news-status').textContent='Finding the latest stories…';$('#refresh-news').disabled=true;$('#more-news').hidden=true;
    labelNewsSource(settings.newsSource);
    try{
      try{await ensureLocal('news');}catch{toast('Could not detect your region. Using your saved news edition.');}if(request!==newsRequest)return;
      const query=settings.newsTopic==='local'?(detectedLocation?[detectedLocation.name,detectedLocation.country].join(' '):settings.city?[settings.city.name,settings.city.country].join(' '):'local news'):settings.newsQuery;
      const message={type:'news',source:settings.newsSource,topic:settings.newsTopic,region:settings.newsRegion,language:settings.newsLanguage,query,...(force?{force:true}:{})};let result,xml,fallback=false;
      try{result=await requestData(message);if(request!==newsRequest)return;xml=parseNewsFeed(result.data);}catch(error){if(settings.newsSource!=='bing'||request!==newsRequest)throw error;result=await requestData({...message,source:'bbc',language:'en'});if(request!==newsRequest)return;xml=parseNewsFeed(result.data);fallback=true;labelNewsSource('bbc',true);}
      newsEntries=[...xml.querySelectorAll('item')].filter(x=>articleLink(x.querySelector('link')?.textContent)).slice(0,40);newsVisibleCount=settings.newsCount;renderNews();
      $('#news-status').textContent=newsEntries.length?(fallback?'Bing’s feed is unavailable. Showing BBC News coverage.':''):'No headlines for this topic yet. Try a different region or topic.';$('#news-updated').textContent='Updated '+new Date(result.at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    }catch(error){if(request===newsRequest)$('#news-status').textContent=(error.message||'Headlines are unavailable.')+' You can still open the news source below.';}finally{if(request===newsRequest)$('#refresh-news').disabled=false;}
  }
  function openDialog(id) { if (!$(id).open) $(id).showModal(); }
  $$('[data-close]').forEach(button => button.onclick = () => button.closest('dialog').close());
  $$('dialog').forEach(dialog => dialog.addEventListener('click', e => { if (e.target !== dialog || dialog.id === 'welcome-dialog') return; const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); }));
  let finishingWelcome = false;
  async function finishWelcome(skip = false) {
    if(finishingWelcome)return;
    finishingWelcome=true;$('#welcome-save').disabled=$('#welcome-skip').disabled=true;$('#welcome-error').textContent='';
    const previousName=settings.name;
    settings.name=skip?'':$('#welcome-name').value.trim().slice(0,32);settings.welcomeComplete=true;
    if(await save()){
      $('#welcome-dialog').close();apply();$('.query').focus();
      if(params.get('still')==='customize')openDialog('#settings');
    }else{
      settings.name=previousName;settings.welcomeComplete=false;
      $('#welcome-error').textContent='Your name could not be saved. Please try again.';
    }
    finishingWelcome=false;$('#welcome-save').disabled=$('#welcome-skip').disabled=false;
  }
  $('#welcome-form').onsubmit=e=>{e.preventDefault();finishWelcome();};
  $('#welcome-skip').onclick=()=>finishWelcome(true);
  $('#welcome-dialog').addEventListener('cancel',e=>{e.preventDefault();finishWelcome(true);});
  async function refreshSync(message={type:'browserSyncStatus'}){
    const checkbox=$('#browser-sync'),button=$('#sync-now'),status=$('#sync-status');
    if(preview){checkbox.disabled=button.disabled=true;status.textContent='Available in the installed extension. The preview keeps settings on this device.';return;}
    checkbox.disabled=button.disabled=true;
    try{const result=await requestData(message),data=result.data;checkbox.checked=data.enabled;checkbox.disabled=!data.available;button.disabled=!data.available||!data.enabled;$('#sync-id').textContent='Extension ID: '+data.id;
      status.textContent=data.error||(!data.available?'Browser sync is unavailable. Use Export / Import.':!data.enabled?'Off. Preferences are saved on this device.':(data.lastSaved?'Saved to browser sync storage '+new Date(data.lastSaved).toLocaleString()+'. ':'Enabled. ')+(data.lastReceived?'Received a preference update '+new Date(data.lastReceived).toLocaleString()+'. ':'')+'Cross-device delivery depends on your browser’s sync support.');
    }catch(error){status.textContent=error.message||'Browser sync is unavailable.';checkbox.disabled=false;button.disabled=false;}
  }
  $('#browser-sync').onchange=async e=>{const enabled=e.target.checked;await flushSave();refreshSync({type:'browserSyncEnable',enabled});};
  $('#sync-now').onclick=async()=>{await flushSave();refreshSync({type:'browserSyncNow'});};
  $('#settings').addEventListener('toggle',()=>{if($('#settings').open){refreshSync();refreshNewTabHome();}});
  if(!preview)chrome.storage.onChanged.addListener((changes,area)=>{
    if(area!=='local')return;
    if(changes.stillSettings&&settings&&!ownSaves.delete(JSON.stringify(changes.stillSettings.newValue))){const next=clean(changes.stillSettings.newValue);if(JSON.stringify(next)!==JSON.stringify(settings)){settings=next;apply();if(activeTab==='news')loadNews();if(activeTab==='weather')loadWeather();}}
    if(changes.grSyncState&&$('#settings').open)refreshSync();
    if(changes.grFocusTimer)restoreFocus().then(renderFocus);
  });
  $('#customize').onclick = () => openDialog('#settings');
  $$('[data-theme-choice]').forEach(el => el.onclick = () => { settings.theme = el.dataset.themeChoice;settings.accent=themeById(settings.theme).accent; apply(); save(); });
  function filterThemes(){
    const query=$('#theme-search').value.trim().toLocaleLowerCase(),collection=$('#theme-collection').value,visibleGroups=new Set();let count=0;
    $$('[data-theme-choice]').forEach(el=>{const theme=themeById(el.dataset.themeChoice),match=(!collection||theme.group===collection)&&`${theme.name} ${theme.group} ${theme.id}`.toLocaleLowerCase().includes(query);el.hidden=!match;if(match){count++;visibleGroups.add(theme.group);}});
    $$('[data-theme-heading]').forEach(el=>el.hidden=!visibleGroups.has(el.dataset.themeHeading));
    $('#theme-results').textContent=query||collection?`${count} of ${themes.length} themes`:`${themes.length} themes · ${new Set(themes.map(t=>t.group)).size} collections`;
    $('#theme-empty').hidden=count!==0;
  }
  $('#theme-search').addEventListener('input',filterThemes);$('#theme-collection').addEventListener('change',filterThemes);
  $$('[data-appearance-choice]').forEach(el=>el.onclick=()=>{settings.appearance=el.dataset.appearanceChoice;apply();save();});
  $('#quick-mode').onclick=()=>{settings.appearance=app.dataset.appearance==='dark'?'light':'dark';apply();save();};
  $$('[data-accent]').forEach(el => el.onclick = () => { settings.accent = el.dataset.accent; apply(); save(); });
  $('#accent').oninput = e => { settings.accent = e.target.value; apply(); save(); };
  $$('[data-setting]').forEach(el => el.onchange = () => { const key=el.dataset.setting;settings[key] = el.checked; apply(); save();if(key==='autoLocation'&&activeTab==='weather')loadWeather();if(['localNews','newsImages'].includes(key)&&activeTab==='news')loadNews(); });
  // The tabs permission is optional: it is requested when this is turned on and released when it is turned off.
  async function setNewTabHome(enabled){
    settings.newTabHome=enabled;apply();if(await save()===false||preview)return;
    try{const result=await requestData({type:'newTabHome',enabled});if(enabled&&!result.granted)toast('Allow access in the window that just opened to finish.');}
    catch(error){settings.newTabHome=false;apply();save();toast(error.message||'Could not change the new-tab setting.');}
  }
  async function refreshNewTabHome(){
    if(preview||!settings.newTabHome)return;
    try{const result=await requestData({type:'newTabHomeStatus'});if(!result.granted){settings.newTabHome=false;apply();save();}}catch{}
  }
  $('[data-setting=newTabHome]').onchange=e=>setNewTabHome(e.target.checked);
  $('#name').oninput = e => { settings.name = e.target.value; updateClock(); save(); };
  $$('[data-mode]').forEach(el => el.onclick = () => { mode = el.dataset.mode; $$('[data-mode]').forEach(x => x.setAttribute('aria-pressed',String(x===el))); $('.query').placeholder = mode === 'all' ? `Search ${GoogleRefreshed.engines.find(e=>e.id===settings.engine).name} or explore an idea` : `Search ${GoogleRefreshed.engines.find(e=>e.id===settings.engine).name} ${mode}`; });
  $('#search-images').onclick=()=>{hideSuggestions();openDialog('#lens-dialog');};
  $('#lens-dialog').addEventListener('close',()=>{$('#lens-upload').reset();$('#lens-link').reset();$('#lens-error').textContent='';});
  $('#lens-upload').onsubmit=e=>{
    const file=$('#lens-file').files[0];
    if(!file||!['image/jpeg','image/png','image/webp','image/gif','image/avif'].includes(file.type)||!file.size||file.size>20*1024*1024){e.preventDefault();$('#lens-error').textContent='Choose a supported image smaller than 20 MB.';return;}
    // Native multipart navigation sends the file directly to Lens; no extension cache or photo reader.
    hideSuggestions();
  };
  $('#lens-link').onsubmit=e=>{
    e.preventDefault();
    try{const image=safeURL($('#lens-url').value),target=new URL('https://lens.google.com/v3/upload');target.searchParams.set('url',image);location.assign(target.href);}catch(error){$('#lens-error').textContent=error.message;}
  };
  $('#search').onsubmit = e => {
    e.preventDefault();hideSuggestions(); const q = $('.query').value.trim(); if (!q) return;
    location.assign(GoogleRefreshed.searchURL(settings.engine,mode,q));
  };
  let suggestionTimer,suggestionController,suggestionSequence=0,suggestionIndex=-1,suggestionItems=[];
  const suggestionCache=new Map();
  function hideSuggestions(){
    clearTimeout(suggestionTimer);suggestionController?.abort();suggestionController=null;suggestionSequence++;
    $('#suggestion-popup').hidden=true;$('.query').setAttribute('aria-expanded','false');$('.query').removeAttribute('aria-activedescendant');suggestionIndex=-1;
  }
  function highlightSuggestion(){
    $$('#suggestion-list [role=option]').forEach((el,i)=>el.setAttribute('aria-selected',String(i===suggestionIndex)));
    if(suggestionIndex>=0){$('.query').setAttribute('aria-activedescendant','suggestion-'+suggestionIndex);$('#suggestion-'+suggestionIndex).scrollIntoView({block:'nearest'});}else $('.query').removeAttribute('aria-activedescendant');
  }
  function chooseSuggestion(index){$('.query').value=typeof suggestionItems[index]==='string'?suggestionItems[index]:suggestionItems[index].text;hideSuggestions();$('#search').requestSubmit();}
  function renderSuggestions(items){
    suggestionItems=items;suggestionIndex=-1;const list=$('#suggestion-list');list.replaceChildren();
    items.forEach((item,i)=>{
      const value=typeof item==='string'?{text:item,title:item}:item;
      const button=document.createElement('button');button.type='button';button.className='suggestion-option';button.id='suggestion-'+i;button.setAttribute('role','option');button.setAttribute('aria-selected','false');button.tabIndex=-1;
      if(settings.suggestionImages&&value.image){const image=document.createElement('img');image.className='suggestion-photo';image.src=value.image;image.alt='';image.referrerPolicy='no-referrer';image.decoding='async';image.onerror=()=>image.replaceWith(document.createRange().createContextualFragment(icon('search')));button.append(image);}else button.innerHTML=icon('search');
      const copy=document.createElement('div');copy.className='suggestion-copy';const label=document.createElement('strong');label.textContent=value.title||value.text;label.dir='auto';copy.append(label);if(value.description){const description=document.createElement('small');description.textContent=value.description;description.dir='auto';copy.append(description);}button.append(copy);button.onmousedown=e=>e.preventDefault();button.onclick=()=>chooseSuggestion(i);list.append(button);
    });
    $('#suggestion-popup').hidden=!items.length;$('.query').setAttribute('aria-expanded',String(!!items.length));
  }
  function queueSuggestions(event){
    hideSuggestions();if(event?.isComposing||!settings.suggestions||settings.engine!=='google')return;
    const q=$('.query').value.trim().slice(0,200);if(!q)return;
    const cached=suggestionCache.get(q);if(cached&&Date.now()-cached.at<120000){renderSuggestions(cached.items);return;}
    const sequence=suggestionSequence;
    suggestionTimer=setTimeout(async()=>{
      suggestionController=new AbortController();
      try{
        const result=await requestData({type:'suggestions',query:q,language:navigator.language.split('-')[0]},suggestionController.signal);
        if(sequence!==suggestionSequence||root.activeElement!==$('.query'))return;
        if(suggestionCache.size>=20)suggestionCache.delete(suggestionCache.keys().next().value);
        suggestionCache.set(q,{items:result.data,at:Date.now()});renderSuggestions(result.data);
      }catch{/* Autocomplete is optional; normal search remains available offline. */}
    },250);
  }
  $('.query').oninput=queueSuggestions;$('.query').addEventListener('compositionend',queueSuggestions);
  $('.query').onfocus=()=>{if($('.query').value.trim())queueSuggestions();};
  $('.query').onblur=()=>setTimeout(()=>{if(root.activeElement!==$('.query'))hideSuggestions();},100);
  $('.query').onkeydown=e=>{
    if(e.key==='Escape'&&!$('#suggestion-popup').hidden){e.preventDefault();e.stopPropagation();hideSuggestions();return;}
    if(!$('#suggestion-popup').hidden&&suggestionItems.length&&['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();suggestionIndex=e.key==='ArrowDown'?(suggestionIndex+1)%suggestionItems.length:suggestionIndex<=0?suggestionItems.length-1:suggestionIndex-1;highlightSuggestion();}
    else if(e.key==='Enter'&&suggestionIndex>=0&&!$('#suggestion-popup').hidden){e.preventDefault();chooseSuggestion(suggestionIndex);}
  };
  root.addEventListener('pointerdown',e=>{if(!e.composedPath()[0].closest('.search-wrap'))hideSuggestions();});
  function suppressOriginal() {
    for (const el of document.body.children) {
      if (el === host || ['SCRIPT','STYLE','LINK'].includes(el.tagName) || hiddenSiblings.has(el)) continue;
      hiddenSiblings.set(el,{inert:el.inert,aria:el.getAttribute('aria-hidden')}); el.inert = true; el.setAttribute('aria-hidden','true');
    }
  }
  function setClassic(value) {
    classic = value;
    updateMotion();scheduleClock();
    $$('dialog[open]').reverse().forEach(d=>d.close());
    app.hidden = value; $('.reopen').hidden = !value;
    host.style.pointerEvents = value ? 'none' : 'auto'; $('.reopen').style.pointerEvents = 'auto';
    if (value) { for (const [el,old] of hiddenSiblings) { el.inert = old.inert; if (old.aria === null) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden',old.aria); } hiddenSiblings.clear(); $('.reopen').focus(); }
    else { suppressOriginal(); $('.query').focus(); }
  }
  $('#classic').onclick = $('#native').onclick = $('#account-native').onclick = () => setClassic(true);
  $('.reopen').onclick = () => setClassic(false);
  $('#apps').onclick = () => openDialog('#apps-dialog');
  function renderEditor() {
    const list = $('#shortcut-list'); list.replaceChildren();
    settings.shortcuts.forEach((item,i) => {
      const row = document.createElement('div'); row.className = 'edit-row';
      const label = document.createElement('div'), strong = document.createElement('strong'), small = document.createElement('small'); strong.textContent = item.name; small.textContent = (item.group||'personal')+' · '+new URL(item.url).hostname; label.append(strong,small);
      const buttons = document.createElement('div'); buttons.className = 'buttons';
      for (const [text,title,fn,disabled] of [
        ['↑','Move '+item.name+' up',()=> { [settings.shortcuts[i-1],settings.shortcuts[i]]=[settings.shortcuts[i],settings.shortcuts[i-1]]; },i===0],
        ['↓','Move '+item.name+' down',()=> { [settings.shortcuts[i+1],settings.shortcuts[i]]=[settings.shortcuts[i],settings.shortcuts[i+1]]; },i===settings.shortcuts.length-1],
        ['Edit','Edit '+item.name,()=>editLink(i),false],
        ['×','Remove '+item.name,()=>settings.shortcuts.splice(i,1),false]
      ]) {
        const b = document.createElement('button'); b.className='button'; b.textContent=text; b.title=title; b.setAttribute('aria-label',title); b.disabled=disabled;
        b.onclick=()=>{fn();renderShortcuts();renderEditor();save();};buttons.append(b);
      }
      row.append(label,buttons); list.append(row);
    });
    $('#add-shortcut').hidden=settings.shortcuts.length>=60;
  }
  function manage() { renderEditor(); openDialog('#shortcut-dialog'); }
  $('#edit-shortcuts').onclick = $('#manage-shortcuts').onclick = manage;
  $('#quick-add-shortcut').onclick=()=>editLink();
  let editingIndex = -1;
  function editLink(index = -1) {
    editingIndex = index;
    $('#link-title').textContent = index < 0 ? 'Add a little shortcut.' : 'Make it yours.';
    $('#link-name').value = index < 0 ? '' : settings.shortcuts[index].name;
    $('#link-url').value = index < 0 ? '' : settings.shortcuts[index].url;
    $('#link-group').value=index<0?(settings.activeGroup==='all'?'personal':settings.activeGroup):(settings.shortcuts[index].group||'personal');
    $('#link-original').checked=index<0||settings.shortcuts[index].iconMode!=='text';$('#link-glyph').value=index<0?'':settings.shortcuts[index].glyph;$('#link-color').value=index<0?settings.accent:settings.shortcuts[index].color;
    $('#link-error').textContent='';openDialog('#link-dialog');$('#link-name').focus();
  }
  $('#add-shortcut').onclick=()=>editLink();
  $('#link-form').onsubmit=e=>{
    e.preventDefault();
    try {
      const name=$('#link-name').value.trim(),url=safeURL($('#link-url').value);
      if(!name)throw new Error('Give your shortcut a name.');
      const item={name,url,color:$('#link-color').value,glyph:$('#link-glyph').value||name.slice(0,1).toUpperCase(),group:$('#link-group').value,iconMode:$('#link-original').checked?'auto':'text'};
      if(editingIndex<0){if(settings.shortcuts.length>=60)throw new Error('You can have up to 60 shortcuts.');settings.shortcuts.push(item);}else settings.shortcuts[editingIndex]=item;
      renderShortcuts();renderEditor();save();$('#link-dialog').close();
    }catch(error){$('#link-error').textContent=error.message;}
  };
  $('#remove-photo').onclick=()=>{settings.photo='';apply();save();};
  $('#photo-file').onchange=async e=>{
    const file=e.target.files[0];e.target.value='';if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12*1024*1024){toast('Choose a JPG, PNG, or WebP photo smaller than 12 MB.');return;}
    try{
      const bitmap=await createImageBitmap(file);
      const scale=Math.min(1,1920/Math.max(bitmap.width,bitmap.height));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
      const data=canvas.toDataURL('image/jpeg',.8);if(data.length>=3000000)throw new Error('Photo is too large. Try a smaller image.');settings.photo=data;apply();await save();toast('Your background is ready.');
    }catch(error){toast(error.message||'This photo could not be opened.');}
  };
  $('#export').onclick=()=>{
    const blob=new Blob([JSON.stringify({format:'google-refreshed',version:1,settings},null,2)],{type:'application/json'});
    const href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download='GoogleRefreshed-settings.json';a.click();setTimeout(()=>URL.revokeObjectURL(href),10000);
  };
  $('#import').onchange=async e=>{
    const file=e.target.files[0];e.target.value='';if(!file)return;
    try{if(file.size>4*1024*1024)throw new Error('Choose a GoogleRefreshed settings file smaller than 4 MB.');const data=JSON.parse(await file.text());if(!['still-home','google-refreshed'].includes(data.format)||data.version!==1||!data.settings||typeof data.settings!=='object')throw new Error('This is not a GoogleRefreshed settings export.');settings=clean(data.settings);apply();save();toast('Welcome back. Your settings are imported.');}catch(error){toast(error.message||'Could not import this file.');}
  };
  let resetConfirmTimer;
  function clearResetConfirmation(){clearTimeout(resetConfirmTimer);$('#reset').dataset.confirm='';$('#reset').textContent='Reset settings to default';$('#reset-hint').textContent='Restore the original theme, layout, shortcuts and preferences.';}
  $('#settings').addEventListener('close',clearResetConfirmation);
  $('#reset').onclick=async()=>{
    if($('#reset').dataset.confirm!=='yes'){$('#reset').dataset.confirm='yes';$('#reset').textContent='Click again to reset everything';$('#reset-hint').textContent='This also clears your saved name, focus note, location and background photo, and turns off browser settings sync.';resetConfirmTimer=setTimeout(clearResetConfirmation,7000);return;}
    $('#reset').disabled=true;clearTimeout(resetConfirmTimer);
    try{
      if(await flushSave()===false)return;
      if(!preview){await requestData({type:'browserSyncEnable',enabled:false});await requestData({type:'newTabHome',enabled:false});}
      settings=clean({...defaults,welcomeComplete:true});settings.photoNewsMigrated=true;resetFocus();apply();
      if(await save()){toast('Default homepage settings restored.');refreshSync();if(activeTab==='news')loadNews();if(activeTab==='weather')loadWeather();}
    }catch(error){toast(error.message||'Could not reset settings. Try again.');}
    finally{$('#reset').disabled=false;clearResetConfirmation();}
  };
  let commandMatches=[],commandIndex=0;
  function commandItems(){
    const changeAppearance=appearance=>()=>{settings.appearance=appearance;apply();save();};
    return [
      {name:'Customize homepage',kind:'Settings',run:()=>openDialog('#settings')},
      {name:'Switch to '+(app.dataset.appearance==='dark'?'light':'dark')+' mode',kind:'Appearance',run:changeAppearance(app.dataset.appearance==='dark'?'light':'dark')},
      ...settings.shortcuts.map(x=>({name:'Open '+x.name,kind:(x.group||'personal')+' shortcut',run:()=>{if(settings.newTab)window.open(x.url,'_blank','noopener,noreferrer');else location.assign(x.url);}})),
      ...['home',...(settings.weatherEnabled?['weather']:[]),...(settings.newsEnabled?['news']:[])].map(x=>({name:'Go to '+x,kind:'Page',run:()=>switchTab(x)})),
      ...themes.map(t=>({name:'Theme: '+t.name,kind:t.group,run:()=>{settings.theme=t.id;settings.accent=t.accent;apply();save();}})),
      ...['light','dark','system'].map(x=>({name:'Appearance: '+x,kind:'Appearance',run:changeAppearance(x)})),
      {name:settings.animations?'Turn animations off':'Turn animations on',kind:'Motion',run:()=>{settings.animations=!settings.animations;apply();save();}},
      {name:'Classic Google',kind:'Native tools',run:()=>setClassic(true)}
    ];
  }
  function updateCommandSelection(){
    $$('#command-list [role=option]').forEach((el,i)=>el.setAttribute('aria-selected',String(i===commandIndex)));
    if(commandMatches.length){$('#command-query').setAttribute('aria-activedescendant','command-'+commandIndex);$('#command-'+commandIndex).scrollIntoView({block:'nearest'});}else $('#command-query').removeAttribute('aria-activedescendant');
  }
  function renderCommands(){
    const q=$('#command-query').value.trim().toLowerCase().slice(0,100);commandMatches=commandItems().filter(x=>(x.name+' '+x.kind).toLowerCase().includes(q)).slice(0,10);commandIndex=0;
    const list=$('#command-list');list.replaceChildren();
    commandMatches.forEach((command,i)=>{const button=document.createElement('button');button.className='command-option';button.id='command-'+i;button.setAttribute('role','option');button.tabIndex=-1;const name=document.createElement('span'),kind=document.createElement('small');name.textContent=command.name;kind.textContent=command.kind;button.append(name,kind);button.onclick=()=>{$('#command-dialog').close();command.run();};list.append(button);});
    if(!commandMatches.length){const empty=document.createElement('p');empty.className='command-empty';empty.textContent='No matches. Try a shortcut, theme, or setting.';list.append(empty);}updateCommandSelection();
  }
  function openCommands(){openDialog('#command-dialog');$('#command-query').value='';renderCommands();$('#command-query').focus();}
  $('#open-commands').onclick=openCommands;$('#command-query').oninput=renderCommands;
  $('#command-query').onkeydown=e=>{if(['ArrowDown','ArrowUp'].includes(e.key)&&commandMatches.length){e.preventDefault();commandIndex=(commandIndex+(e.key==='ArrowDown'?1:-1)+commandMatches.length)%commandMatches.length;updateCommandSelection();}else if(e.key==='Enter'&&commandMatches.length){e.preventDefault();$('#command-dialog').close();commandMatches[commandIndex].run();}};
  document.addEventListener('keydown',e=>{const target=e.composedPath()[0];if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&!classic&&host.isConnected){e.preventDefault();openCommands();return;}if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!['INPUT','TEXTAREA','SELECT'].includes(target.tagName)&&!target.isContentEditable&&!$('dialog[open]')&&!classic&&host.isConnected){e.preventDefault();$('.query').focus();}});
  function syncStored(value){if(!settings||!value)return;const cleanValue=clean(value);if(JSON.stringify(cleanValue)!==JSON.stringify(clean(settings))){settings=cleanValue;apply();}}
  if(preview)addEventListener('storage',e=>{if(e.key==='stillSettings')try{syncStored(JSON.parse(e.newValue));}catch{}});
  async function start(){
    try{const saved=await storage.get();settings=clean(saved);if(!saved?.photoNewsMigrated){if(settings.newsSource==='google'&&settings.newsImages)settings.newsSource='bing';settings.photoNewsMigrated=true;save();}}catch{settings=clean(defaults);}
    await restoreFocus();apply();
    const services=[...defaults.shortcuts,{name:'Maps',url:'https://maps.google.com/',color:'#59835f',glyph:'↗'},{name:'Photos',url:'https://photos.google.com/',color:'#b38a34',glyph:'✳'},{name:'Translate',url:'https://translate.google.com/',color:'#547ca3',glyph:'文'},{name:'Account',url:'https://myaccount.google.com/',color:'#8b6b9b',glyph:'◉'}];
    $('#google-apps').replaceChildren(...services.map((x,i)=>makeShortcut(x,i,true)));
    document.body.append(host);suppressOriginal();
    const designStyle=document.createElement('link');designStyle.rel='stylesheet';designStyle.href=GoogleRefreshed.resource('refresh.css');
    const reveal=()=>{if(!preview)GoogleRefreshedBoot?.release();};designStyle.onload=reveal;designStyle.onerror=reveal;root.append(designStyle);setTimeout(reveal,700);
    new MutationObserver(()=>{if(!classic)suppressOriginal();}).observe(document.body,{childList:true});
    scheduleClock();
    if(!settings.welcomeComplete)openDialog('#welcome-dialog');
    else if(params.get('still')==='customize')openDialog('#settings');
  }
  start();
})();
