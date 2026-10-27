(() => {
  'use strict';
  const themes = [
    {id:'paper',name:'Paper',group:'Everyday',world:'calm',accent:'#c65332',light:['#f5f4ed','#282c26','#6d7164','#dddfd2','#e9eade','#d5dbbe'],dark:['#1c211e','#efefe5','#a9b3a5','#3b443c','#2d382e','#667b53']},
    {id:'sage',name:'Sage',group:'Everyday',world:'calm',accent:'#638451',light:['#e8ece2','#2e3a2f','#65765f','#cbd5c4','#dbe3d3','#9cb58c'],dark:['#19251f','#ecf0e5','#adbc9f','#354b3b','#2b3e2e','#64885a']},
    {id:'ocean',name:'Ocean',group:'Everyday',world:'water',accent:'#347a9a',light:['#eaf2f3','#203a45','#5f7982','#c7dce0','#d9e9ec','#9acbda'],dark:['#10232d','#e5f1f4','#a2bdc7','#2a4b59','#1d3947','#24809e']},
    {id:'rose',name:'Rose',group:'Everyday',world:'calm',accent:'#ae5679',light:['#f7eef1','#49303d','#846676','#e4d0da','#efdee6','#e6b8cb'],dark:['#2c1d28','#f6eaf2','#c4a6b9','#55384d','#432d3c','#ad5e89']},
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
    {id:'noir',name:'Noir',group:'After hours',world:'noir',accent:'#877053',light:['#efefec','#292a28','#70736c','#d4d5ce','#e2e3dc','#b8baad'],dark:['#151616','#efefeb','#afb2ab','#383b37','#252825','#777d6e']}
  ];
  const preview = ['localhost','127.0.0.1'].includes(location.hostname) || location.protocol === 'file:';
  const resource = path => preview ? new URL(path, location.href).href : chrome.runtime.getURL(path);
  const palette = settings => {
    const theme = themes.find(t=>t.id===settings.theme)||themes[0];
    const dark = settings.appearance==='dark'||settings.appearance==='system'&&matchMedia('(prefers-color-scheme: dark)').matches;
    return {theme,dark,colors:dark?theme.dark:theme.light,accent:/^#[0-9a-f]{6}$/i.test(settings.accent)?settings.accent:theme.accent};
  };
  const logo = `<svg class="refreshed-logo" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="1" y="1" width="46" height="46" rx="15" fill="currentColor" opacity=".15"/><path d="M34 18a12 12 0 0 0-20 1m0 0v-7m0 7h7M14 30a12 12 0 0 0 20-1m0 0v7m0-7h-7" stroke="currentColor" stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round"/><path d="m36 5 1.5 3.5L41 10l-3.5 1.5L36 15l-1.5-3.5L31 10l3.5-1.5Z" fill="currentColor"/></svg>`;
  const fonts=[{id:'manrope',name:'Manrope',family:'GR Manrope',file:'manrope-latin.woff2',group:'Modern'},{id:'inter',name:'Inter',family:'GR Inter',file:'inter-latin.woff2',group:'Modern'},{id:'outfit',name:'Outfit',family:'GR Outfit',file:'outfit-latin.woff2',group:'Modern'},{id:'system',name:'System UI',family:'"Segoe UI Variable", "Segoe UI", sans-serif',group:'System fonts'},{id:'serif',name:'Georgia',family:'Georgia, serif',group:'System fonts'}];
  const loadedFonts=new Set();
  function loadFont(id){const font=fonts.find(x=>x.id===id)||fonts[0];if(font.file&&!loadedFonts.has(font.id)){loadedFonts.add(font.id);const face=new FontFace(font.family,`url("${resource('fonts/'+font.file)}")`,{weight:'400 800',display:'swap'});document.fonts.add(face);face.load().catch(()=>loadedFonts.delete(font.id));}return font.family;}
  globalThis.GoogleRefreshed = {themes,palette,logo,resource,fonts,loadFont};
})();
