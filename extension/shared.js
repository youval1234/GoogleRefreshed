(() => {
  'use strict';
  const themes = [
    {id:'paper',name:'Paper',group:'Everyday',world:'paper',accent:'#c65332',light:['#f5f4ed','#282c26','#6d7164','#dddfd2','#e9eade','#d5dbbe'],dark:['#1c211e','#efefe5','#a9b3a5','#3b443c','#2d382e','#667b53']},
    {"id":"sage","name":"Sage","group":"Everyday","world":"sage","accent":"#608272","light":["#edf1e9","#2d443a","#687f70","#c8d6c8","#e0e8da","#a1bba2"],"dark":["#14251f","#edf4e6","#a8bfaa","#365245","#253c30","#7fa88c"]},
    {id:'ocean',name:'Ocean',group:'Everyday',world:'water',accent:'#347a9a',light:['#eaf2f3','#203a45','#5f7982','#c7dce0','#d9e9ec','#9acbda'],dark:['#10232d','#e5f1f4','#a2bdc7','#2a4b59','#1d3947','#24809e']},
    {id:'rose',name:'Rose',group:'Everyday',world:'rose',accent:'#ae5679',light:['#f7eef1','#49303d','#846676','#e4d0da','#efdee6','#e6b8cb'],dark:['#2c1d28','#f6eaf2','#c4a6b9','#55384d','#432d3c','#ad5e89']},
    {id:'futuristic',name:'Futuristic',group:'Other worlds',world:'future',accent:'#008c9e',light:['#eaf7f8','#143c49','#4b7783','#b5dce5','#d6eff3','#50c2d4'],dark:['#07151f','#dcfaff','#92c3ce','#164557','#0d2d3b','#00c9e2']},
    {"id":"mystic","name":"Mystic","group":"Other worlds","world":"mystic","accent":"#9671b9","light":["#f2edf7","#453353","#867091","#ddcee8","#eae0f1","#c6acdb"],"dark":["#1c172b","#f4eaff","#bca8cf","#4d3a64","#30243f","#a17ac3"]},
    {"id":"magical","name":"Magical","group":"Other worlds","world":"magic","accent":"#aa8243","light":["#faf3e6","#4b3b34","#917d62","#e4d4b8","#f0e3cc","#d5b77e"],"dark":["#241d30","#fff0d8","#cfb99a","#57435c","#3a2b40","#d0a363"]},
    {id:'rustic',name:'Rustic',group:'Other worlds',world:'rustic',accent:'#a45f38',light:['#efe7d6','#493b2e','#7d6d58','#d5c8b2','#e5d9c4','#c1a776'],dark:['#27231b','#f3e8d1','#bfb096','#514737','#3b3427','#a1804a']},
    {"id":"solar","name":"Solar","group":"Other worlds","world":"solar","accent":"#b78234","light":["#fbf3df","#4c3925","#8c7450","#e5d2a7","#f0e3c2","#e1bf78"],"dark":["#241c14","#fff1d5","#d0b58f","#59462e","#392d1e","#d9a95d"]},
    {id:'spring',name:'Spring',group:'The seasons',world:'spring',accent:'#9b5879',light:['#f0f3e7','#354334','#707d62','#d2ddc4','#e5ecd9','#c8d8a0'],dark:['#1d2922','#edf4df','#afc2a0','#3c5140','#2c402e','#6a9c73']},
    {"id":"summer","name":"Summer","group":"The seasons","world":"summer","accent":"#468a8c","light":["#f5f3e5","#304c4b","#72877b","#cdd9c9","#e4e9d7","#a5c9bb"],"dark":["#172d31","#f1f1da","#b0c5b4","#3e5a58","#29433f","#73b0a3"]},
    {"id":"autumn","name":"Autumn","group":"The seasons","world":"autumn","accent":"#b77143","light":["#f6ede1","#4b382b","#8c735a","#e0cdb5","#eddfc9","#d6ae78"],"dark":["#291f1c","#f7e7ce","#c5aa88","#594337","#3e2f25","#ba8853"]},
    {id:'winter',name:'Winter',group:'The seasons',world:'winter',accent:'#4b819a',light:['#edf3f7','#2d424f','#697e8b','#cedde6','#dfebf1','#c1d9ee'],dark:['#152230','#e8f5ff','#abc3d4','#314e65','#23384c','#679fc8']},
    {"id":"midnight","name":"Midnight","group":"After hours","world":"night","accent":"#788eb9","light":["#edf1f8","#303c56","#74829e","#cbd5e7","#dde5f0","#abbcda"],"dark":["#101827","#e9efff","#a5b5d0","#31405d","#202e45","#6d8dbd"]},
    {id:'aurora',name:'Aurora',group:'After hours',world:'aurora',accent:'#288a77',light:['#eaf5ef','#244639','#5c7f70','#c2dfd1','#d6ebe0','#8fcbb9'],dark:['#0d2126','#e5fff2','#9bc5ba','#25504e','#193b3a','#38bda4']},
    {id:'cosmic',name:'Cosmic',group:'After hours',world:'cosmic',accent:'#9369c8',light:['#f0eef9','#3b3256','#7c6f98','#d9d0eb','#e7e0f5','#c8afe9'],dark:['#121326','#eeeaff','#aba7cf','#363659','#23243f','#7665cc']},
    {"id":"noir","name":"Noir","group":"After hours","world":"noir","accent":"#8e8678","light":["#f1eee6","#353530","#817e72","#d7d1c3","#e4dfd2","#bbb4a2"],"dark":["#191a1b","#f1eee4","#b6b4a9","#42433f","#2c2e2d","#96978d"]},
    {"id":"amber","name":"Amber","group":"More worlds","world":"amber","accent":"#c67d16","light":["#fff3d8","#4b3215","#8d6a32","#e7c78c","#f2dfb9","#f2bd4a"],"dark":["#21190d","#fff0cc","#cfb17a","#5b4222","#352713","#e5a526"]},
    {"id":"ice","name":"Ice","group":"More worlds","world":"ice","accent":"#327eac","light":["#effaff","#163d54","#557d94","#b9dce9","#d9eff9","#8fd8f5"],"dark":["#0b2030","#e4f9ff","#93c9df","#29546b","#12384d","#70cdf5"]},
    {"id":"flowers","name":"Flowers","group":"More worlds","world":"flowers","accent":"#b45285","light":["#fcf0f6","#563148","#94708a","#eac9dd","#f6dfea","#ef99c8"],"dark":["#291a2a","#fff0f9","#cba6c0","#68425f","#43283e","#dc7fb3"]},
    {"id":"fantasy","name":"Fantasy","group":"More worlds","world":"fantasy","accent":"#7b6aaf","light":["#f0eff7","#3a3557","#7c7598","#d2cbe5","#e3def0","#b7c9ce"],"dark":["#131b2b","#f1ecff","#b2afcf","#424964","#252d46","#88acb4"]},
    {"id":"code","name":"Code","group":"More worlds","world":"code","accent":"#397dba","light":["#edf3fa","#21364e","#5e7895","#bdd0e3","#dce7f3","#72bacb"],"dark":["#0b1220","#e6f0ff","#92acc9","#2e4662","#18283e","#58bfcd"]},
    {"id":"cloudy","name":"Cloudy","group":"More worlds","world":"cloudy","accent":"#718ab1","light":["#edf1f9","#35455e","#7b8da6","#cbd5e6","#dfe6f3","#c0cde5"],"dark":["#1b243b","#eff3ff","#a9b7d3","#3f5070","#293855","#91a7d5"]},
    {"id":"scary","name":"Scary","group":"More worlds","world":"scary","accent":"#b87976","light":["#eee9ed","#49383f","#8d7780","#d5c6ce","#e2d5dc","#b99aa4"],"dark":["#181b23","#eee2e4","#b9a1ab","#4d3e4d","#2c2632","#956d83"]},
    {"id":"colorful","name":"Colorful","group":"More worlds","world":"colorful","accent":"#9561cb","light":["#faf0fc","#492b60","#92759e","#e1c9ea","#f0dcf6","#dd9be7"],"dark":["#1f1438","#f9ecff","#bca0d8","#533875","#352350","#c28af0"]},
    {"id":"storm","name":"Storm","group":"More worlds","world":"storm","accent":"#5c84b0","light":["#e5ecf4","#293c54","#647f9a","#bdcddb","#d3deeb","#97b5d5"],"dark":["#111a2d","#e5efff","#92abc9","#334966","#1f3049","#6d94ca"]},
    {"id":"sunset","name":"Sunset","group":"More worlds","world":"sunset","accent":"#ce8b89","light":["#fff0e8","#613e4e","#aa7c86","#ebc9c1","#f6ded3","#e7ad96"],"dark":["#2b2135","#ffe9df","#c9a5af","#614657","#422e49","#d99588"]},
    {"id":"math","name":"Math","group":"More worlds","world":"math","accent":"#397b95","light":["#eef5f5","#243f4a","#5d7f8a","#bfd6da","#dcebed","#76b3be"],"dark":["#0d1c27","#e5f5f8","#92b3c0","#2c4c5c","#19313f","#6fb7c5"]},
    {"id":"library","name":"Library","group":"More worlds","world":"library","accent":"#a3693d","light":["#f3ead8","#44342b","#8d7560","#d8c4a7","#e8dac1","#c99e6d"],"dark":["#251c18","#f6ead5","#c5aa87","#57412e","#392b22","#b68a53"]},
    {"id":"office","name":"Office","group":"More worlds","world":"office","accent":"#536f9e","light":["#f3f5f7","#2e3b4e","#7a8797","#d4dbe4","#e4e9ef","#b3c2d8"],"dark":["#1b2330","#edf2fa","#a8b6ca","#3b4b61","#29364a","#7f99bd"]},
    {"id":"science","name":"Science","group":"More worlds","world":"science","accent":"#3d8f96","light":["#edf6f4","#2a4850","#6c898e","#c3dcd9","#dcece6","#94c9c3"],"dark":["#112832","#e3f9f5","#9abec5","#32515f","#203d49","#6ebbb8"]},
    {id:'nature',name:'Nature',group:'More worlds',world:'nature',accent:'#4a8747',light:['#edf4e4','#304b2b','#728969','#c8dbbb','#deebd2','#a0c27a'],dark:['#11241a','#eaffdc','#9eb993','#34543a','#203b28','#72a85a']},
    {"id":"city","name":"City Skyline","group":"More worlds","world":"city","accent":"#8098bf","light":["#eef2f7","#35455e","#7b8ca3","#cbd6e4","#dfe7ef","#afc3d9"],"dark":["#142131","#edf2ff","#b0bdd3","#3c506c","#293c55","#87a8cb"]},
    {"id":"rainbow","name":"Rainbow","group":"More worlds","world":"rainbow","accent":"#8b79b4","light":["#f2f1f9","#393951","#7a7897","#d4d1e6","#e5e2f1","#bbb0d5"],"dark":["#171a2d","#f3eeff","#b5afcf","#454361","#292a46","#a89acb"]},
    {"id":"lunar","name":"Lunar","group":"More worlds","world":"lunar","accent":"#8195b9","light":["#eff2f7","#303e55","#70819a","#c7d1df","#dce3ee","#a7bad6"],"dark":["#0c1424","#edf2ff","#a3b3ce","#30435f","#1c2c45","#93b4d8"]},
    {id:'sakura',name:'Sakura',group:'More worlds',world:'sakura',accent:'#c5689a',light:['#fff0f5','#643b54','#a37791','#efc9dc','#f8dfe9','#efa3c8'],dark:['#29182b','#ffeef6','#d2a3bc','#643b59','#432640','#df86b0']},
    {id:'fire',name:'Fire',group:'Elements',world:'fire',accent:'#d95d25',light:['#fff0df','#592d20','#986d51','#edc5a2','#f8ddc3','#ff9c38'],dark:['#20100d','#fff0d9','#d1a180','#643522','#391c13','#ff7b25']},
    {"id":"magma","name":"Magma","group":"Elements","world":"magma","accent":"#d64c2d","light":["#f6ece7","#472d2b","#8b6860","#dfc3b9","#eddbd2","#d89172"],"dark":["#171316","#ffede2","#cba697","#563c36","#2e2221","#d9764f"]},
  ];
  const preview = ['localhost','127.0.0.1'].includes(location.hostname) || location.protocol === 'file:';
  const resource = path => preview ? new URL(path, location.href).href : chrome.runtime.getURL(path);
  const palette = settings => {
    const theme = themes.find(t=>t.id===settings.theme)||themes[0];
    const dark = settings.appearance==='dark'||settings.appearance==='system'&&matchMedia('(prefers-color-scheme: dark)').matches;
    return {theme,dark,colors:dark?theme.dark:theme.light,accent:/^#[0-9a-f]{6}$/i.test(settings.accent)?settings.accent:theme.accent};
  };
  const logo = `<svg class="refreshed-logo" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="1" y="1" width="46" height="46" rx="15" fill="currentColor" opacity=".15"/><path d="M34 18a12 12 0 0 0-20 1m0 0v-7m0 7h7M14 30a12 12 0 0 0 20-1m0 0v7m0-7h-7" stroke="currentColor" stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round"/><path d="m36 5 1.5 3.5L41 10l-3.5 1.5L36 15l-1.5-3.5L31 10l3.5-1.5Z" fill="currentColor"/></svg>`;
  const fonts=[{"id":"manrope","name":"Manrope","family":"GR Manrope","file":"manrope-latin.woff2","group":"Modern"},{"id":"inter","name":"Inter","family":"GR Inter","file":"inter-latin.woff2","group":"Modern"},{"id":"outfit","name":"Outfit","family":"GR Outfit","file":"outfit-latin.woff2","group":"Modern"},{"id":"roboto","name":"Roboto","family":"GR Roboto","file":"roboto-latin.woff2","group":"Modern"},{"id":"dmsans","name":"DM Sans","family":"GR DM Sans","file":"dmsans-latin.woff2","group":"Modern"},{"id":"spacegrotesk","name":"Space Grotesk","family":"GR Space Grotesk","file":"spacegrotesk-latin.woff2","group":"Modern"},{"id":"lora","name":"Lora","family":"GR Lora","file":"lora-latin.woff2","group":"Reading"},{"id":"arial","name":"Original Google (Arial)","family":"Arial, sans-serif","group":"Classics"},{"id":"serif","name":"Original homepage (Georgia)","family":"Georgia, serif","group":"Classics"},{"id":"system","name":"System UI","family":"\"Segoe UI Variable\", \"Segoe UI\", sans-serif","group":"System fonts"},{"id":"verdana","name":"Verdana","family":"Verdana, sans-serif","group":"System fonts"},{"id":"trebuchet","name":"Trebuchet MS","family":"\"Trebuchet MS\", sans-serif","group":"System fonts"}];
  const loadedFonts=new Set();
  function loadFont(id){const font=fonts.find(x=>x.id===id)||fonts[0];if(font.file&&!loadedFonts.has(font.id)){loadedFonts.add(font.id);const face=new FontFace(font.family,`url("${resource('fonts/'+font.file)}")`,{weight:['spacegrotesk','lora'].includes(font.id)?'400 700':'400 800',display:'swap'});document.fonts.add(face);face.load().catch(()=>loadedFonts.delete(font.id));}return font.family;}
  const engines=[{id:'google',name:'Google',letter:'G',color:'#4285f4'},{id:'duckduckgo',name:'DuckDuckGo',letter:'D',color:'#de5833'},{id:'brave',name:'Brave Search',letter:'B',color:'#ef692e'},{id:'bing',name:'Bing',letter:'b',color:'#218a9c'},{id:'ecosia',name:'Ecosia',letter:'E',color:'#479c61'}];
  function searchURL(engine,mode,query){
    if(mode==='maps'){const u=new URL('https://www.google.com/maps/search/');u.search=new URLSearchParams({api:'1',query});return u.href;}
    let u;
    if(engine==='duckduckgo'){u=new URL('https://duckduckgo.com/');u.searchParams.set('q',query);if(mode==='images'||mode==='videos'){u.searchParams.set('ia',mode);u.searchParams.set('iax',mode);}}
    else if(engine==='brave'){u=new URL('https://search.brave.com/'+(mode==='images'?'images':mode==='videos'?'videos':'search'));u.searchParams.set('q',query);}
    else if(engine==='bing'){u=new URL('https://www.bing.com/'+(mode==='images'?'images/search':mode==='videos'?'videos/search':'search'));u.searchParams.set('q',query);}
    else if(engine==='ecosia'){u=new URL('https://www.ecosia.org/'+(mode==='images'?'images':mode==='videos'?'videos':'search'));u.searchParams.set('q',query);}
    else{u=new URL('https://www.google.com/search');u.searchParams.set('q',query);if(mode==='images')u.searchParams.set('udm','2');if(mode==='videos')u.searchParams.set('tbm','vid');}
    return u.href;
  }
  globalThis.GoogleRefreshed = {themes,palette,logo,resource,fonts,loadFont,engines,searchURL};
})();
