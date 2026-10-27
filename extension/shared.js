(() => {
  'use strict';
  const themes = [
    {id:'paper',name:'Paper',group:'Everyday',world:'paper',accent:'#c65332',light:['#f5f4ed','#282c26','#6d7164','#dddfd2','#e9eade','#d5dbbe'],dark:['#1c211e','#efefe5','#a9b3a5','#3b443c','#2d382e','#667b53']},
    {id:'sage',name:'Sage',group:'Everyday',world:'sage',accent:'#638451',light:['#e8ece2','#2e3a2f','#65765f','#cbd5c4','#dbe3d3','#9cb58c'],dark:['#19251f','#ecf0e5','#adbc9f','#354b3b','#2b3e2e','#64885a']},
    {id:'ocean',name:'Ocean',group:'Everyday',world:'water',accent:'#347a9a',light:['#eaf2f3','#203a45','#5f7982','#c7dce0','#d9e9ec','#9acbda'],dark:['#10232d','#e5f1f4','#a2bdc7','#2a4b59','#1d3947','#24809e']},
    {id:'rose',name:'Rose',group:'Everyday',world:'rose',accent:'#ae5679',light:['#f7eef1','#49303d','#846676','#e4d0da','#efdee6','#e6b8cb'],dark:['#2c1d28','#f6eaf2','#c4a6b9','#55384d','#432d3c','#ad5e89']},
    {id:'futuristic',name:'Futuristic',group:'Other worlds',world:'future',accent:'#008c9e',light:['#eaf7f8','#143c49','#4b7783','#b5dce5','#d6eff3','#50c2d4'],dark:['#07151f','#dcfaff','#92c3ce','#164557','#0d2d3b','#00c9e2']},
    {id:'mystic',name:'Mystic',group:'Other worlds',world:'mystic',accent:'#9465bb',light:['#f0ecf8','#392b50','#78688d','#d8cce9','#e6dcf2','#c2a3e0'],dark:['#171024','#f2e8ff','#b7a4cc','#44305e','#2d1d42','#9c5bd6']},
    {id:'magical',name:'Magical',group:'Other worlds',world:'magic',accent:'#ab7b2b',light:['#faf3e4','#4c3a2c','#887355','#e6d7b5','#f2e6ca','#e4ca85'],dark:['#1d1930','#fff2d1','#c9b9a1','#51445c','#33293f','#c29451']},
    {id:'rustic',name:'Rustic',group:'Other worlds',world:'rustic',accent:'#a45f38',light:['#efe7d6','#493b2e','#7d6d58','#d5c8b2','#e5d9c4','#c1a776'],dark:['#27231b','#f3e8d1','#bfb096','#514737','#3b3427','#a1804a']},
    {id:'solar',name:'Solar',group:'Other worlds',world:'solar',accent:'#c98222',light:['#fcf1d8','#4d3420','#826948','#e8d1a7','#f2e1bd','#efc56a'],dark:['#251b12','#fff1d2','#d3b68a','#63492b','#3e2d1c','#e9a540']},
    {id:'spring',name:'Spring',group:'The seasons',world:'spring',accent:'#9b5879',light:['#f0f3e7','#354334','#707d62','#d2ddc4','#e5ecd9','#c8d8a0'],dark:['#1d2922','#edf4df','#afc2a0','#3c5140','#2c402e','#6a9c73']},
    {id:'summer',name:'Summer',group:'The seasons',world:'summer',accent:'#bd6a26',light:['#fbf2db','#4e422b','#8a7855','#e9d9ad','#f4e5bf','#efce77'],dark:['#30251b','#fff1d0','#ceb794','#614a31','#483622','#bf8b42']},
    {id:'autumn',name:'Autumn',group:'The seasons',world:'autumn',accent:'#b9582b',light:['#f5eade','#4f3629','#866c57','#e2cbb6','#eddbc8','#d5a176'],dark:['#2b1d19','#fbe7d2','#c6a58b','#5c3a2c','#442c22','#b16638']},
    {id:'winter',name:'Winter',group:'The seasons',world:'winter',accent:'#4b819a',light:['#edf3f7','#2d424f','#697e8b','#cedde6','#dfebf1','#c1d9ee'],dark:['#152230','#e8f5ff','#abc3d4','#314e65','#23384c','#679fc8']},
    {id:'midnight',name:'Midnight',group:'After hours',world:'night',accent:'#6c86ba',light:['#edf0f6','#2e3750','#717b92','#d1d8e6','#dfe5f0','#acbbdd'],dark:['#141b2a','#e9eefb','#a7b6d0','#303f59','#233048','#4d699e']},
    {id:'aurora',name:'Aurora',group:'After hours',world:'aurora',accent:'#288a77',light:['#eaf5ef','#244639','#5c7f70','#c2dfd1','#d6ebe0','#8fcbb9'],dark:['#0d2126','#e5fff2','#9bc5ba','#25504e','#193b3a','#38bda4']},
    {id:'cosmic',name:'Cosmic',group:'After hours',world:'cosmic',accent:'#9369c8',light:['#f0eef9','#3b3256','#7c6f98','#d9d0eb','#e7e0f5','#c8afe9'],dark:['#121326','#eeeaff','#aba7cf','#363659','#23243f','#7665cc']},
    {id:'noir',name:'Noir',group:'After hours',world:'noir',accent:'#877053',light:['#efefec','#292a28','#70736c','#d4d5ce','#e2e3dc','#b8baad'],dark:['#151616','#efefeb','#afb2ab','#383b37','#252825','#777d6e']},
    {"id":"amber","name":"Amber","group":"More worlds","world":"amber","accent":"#c67d16","light":["#fff3d8","#4b3215","#8d6a32","#e7c78c","#f2dfb9","#f2bd4a"],"dark":["#21190d","#fff0cc","#cfb17a","#5b4222","#352713","#e5a526"]},
    {"id":"ice","name":"Ice","group":"More worlds","world":"ice","accent":"#327eac","light":["#effaff","#163d54","#557d94","#b9dce9","#d9eff9","#8fd8f5"],"dark":["#0b2030","#e4f9ff","#93c9df","#29546b","#12384d","#70cdf5"]},
    {"id":"flowers","name":"Flowers","group":"More worlds","world":"flowers","accent":"#b45285","light":["#fcf0f6","#563148","#94708a","#eac9dd","#f6dfea","#ef99c8"],"dark":["#291a2a","#fff0f9","#cba6c0","#68425f","#43283e","#dc7fb3"]},
    {"id":"fantasy","name":"Fantasy","group":"More worlds","world":"fantasy","accent":"#4c9160","light":["#edf5e7","#2a4632","#6d886a","#c4d9b8","#dcedce","#96c874"],"dark":["#112b24","#e5ffe9","#9bc2aa","#2d5b47","#1b4031","#6dba85"]},
    {"id":"code","name":"Code","group":"More worlds","world":"code","accent":"#238d50","light":["#e9f4ec","#183d26","#587c62","#b9d6c2","#d3ead9","#8aca9c"],"dark":["#07140f","#c8ffdc","#80b595","#234b34","#10271b","#35d879"]},
    {"id":"cloudy","name":"Cloudy","group":"More worlds","world":"cloudy","accent":"#718ab1","light":["#edf1f9","#35455e","#7b8da6","#cbd5e6","#dfe6f3","#c0cde5"],"dark":["#1b243b","#eff3ff","#a9b7d3","#3f5070","#293855","#91a7d5"]},
    {"id":"scary","name":"Scary","group":"More worlds","world":"scary","accent":"#c43f4b","light":["#f5e6e8","#51232e","#9e6875","#dcb4bd","#eccdd3","#d97887"],"dark":["#150d18","#fce4ee","#c38d9f","#51293b","#2d1627","#a72748"]},
    {"id":"colorful","name":"Colorful","group":"More worlds","world":"colorful","accent":"#9561cb","light":["#faf0fc","#492b60","#92759e","#e1c9ea","#f0dcf6","#dd9be7"],"dark":["#1f1438","#f9ecff","#bca0d8","#533875","#352350","#c28af0"]},
    {"id":"storm","name":"Storm","group":"More worlds","world":"storm","accent":"#5c84b0","light":["#e5ecf4","#293c54","#647f9a","#bdcddb","#d3deeb","#97b5d5"],"dark":["#111a2d","#e5efff","#92abc9","#334966","#1f3049","#6d94ca"]},
    {"id":"sunset","name":"Sunset","group":"More worlds","world":"sunset","accent":"#d16b75","light":["#fff0e7","#623747","#b17b87","#edc4bb","#f8dbcf","#eda48b"],"dark":["#2b183d","#ffe5db","#cf9da9","#68465d","#4b294e","#e18486"]},
    {"id":"math","name":"Math","group":"More worlds","world":"math","accent":"#4f79bd","light":["#eff3fe","#203d64","#7388ab","#c7d5ef","#dde6f8","#99b6e9"],"dark":["#0f1b34","#e8f0ff","#99afd5","#334e77","#1c2f50","#6a9bdc"]},
    {"id":"library","name":"Library","group":"More worlds","world":"library","accent":"#a3693d","light":["#f3ead8","#44342b","#8d7560","#d8c4a7","#e8dac1","#c99e6d"],"dark":["#251c18","#f6ead5","#c5aa87","#57412e","#392b22","#b68a53"]},
    {"id":"office","name":"Office","group":"More worlds","world":"office","accent":"#536f9e","light":["#f3f5f7","#2e3b4e","#7a8797","#d4dbe4","#e4e9ef","#b3c2d8"],"dark":["#1b2330","#edf2fa","#a8b6ca","#3b4b61","#29364a","#7f99bd"]},
    {"id":"science","name":"Science","group":"More worlds","world":"science","accent":"#258d91","light":["#e9f7f4","#214d51","#608a8b","#b9dcda","#d3ece7","#79c9bf"],"dark":["#08252d","#defeff","#8ec9cc","#24565f","#123d46","#35bbb2"]},
    {id:'nature',name:'Nature',group:'More worlds',world:'nature',accent:'#4a8747',light:['#edf4e4','#304b2b','#728969','#c8dbbb','#deebd2','#a0c27a'],dark:['#11241a','#eaffdc','#9eb993','#34543a','#203b28','#72a85a']},
    {id:'city',name:'City Skyline',group:'More worlds',world:'city',accent:'#728ed5',light:['#e9effa','#283e65','#7489a9','#c7d5ed','#dce5f7','#adc2ee'],dark:['#0f182b','#e5edff','#9cafd3','#354b73','#1d2e4b','#789be0']},
    {id:'rainbow',name:'Rainbow',group:'More worlds',world:'rainbow',accent:'#9a69c4',light:['#f5f0ff','#49365c','#8a779e','#ddcfee','#ebdef7','#d5adeb'],dark:['#1c1736','#f4edff','#b6a3d1','#4c3b69','#302549','#b67cdd']},
    {id:'lunar',name:'Lunar',group:'More worlds',world:'lunar',accent:'#8e9bb9',light:['#f0f2f8','#35405a','#7c879d','#d0d7e5','#e1e6ef','#bec8df'],dark:['#111726','#edf1fc','#a6b3cf','#35415b','#212d44','#91a3ca']},
    {id:'sakura',name:'Sakura',group:'More worlds',world:'sakura',accent:'#c5689a',light:['#fff0f5','#643b54','#a37791','#efc9dc','#f8dfe9','#efa3c8'],dark:['#29182b','#ffeef6','#d2a3bc','#643b59','#432640','#df86b0']}
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
