(() => {
  'use strict';
  const themes = [
    {"id":"paper","name":"Paper","group":"Simple & Focus","world":"paper","accent":"#c65332","light":["#f5f4ed","#282c26","#6d7164","#dddfd2","#e9eade","#d5dbbe"],"dark":["#1c211e","#efefe5","#a9b3a5","#3b443c","#2d382e","#667b53"]},
    {"id":"noir","name":"Noir","group":"Simple & Focus","world":"noir","accent":"#8e8678","light":["#f1eee6","#353530","#817e72","#d7d1c3","#e4dfd2","#bbb4a2"],"dark":["#191a1b","#f1eee4","#b6b4a9","#42433f","#2c2e2d","#96978d"]},
    {"id":"rustic","name":"Rustic","group":"Simple & Focus","world":"rustic","accent":"#a45f38","light":["#efe7d6","#493b2e","#7d6d58","#d5c8b2","#e5d9c4","#c1a776"],"dark":["#27231b","#f3e8d1","#bfb096","#514737","#3b3427","#a1804a"]},
    {"id":"library","name":"Library","group":"Simple & Focus","world":"library","accent":"#a77b4e","light":["#f3ebdc","#47382d","#8a755e","#d9c7ab","#e9dcc5","#c7aa79"],"dark":["#241d19","#f5e8d2","#c3aa86","#594532","#3b2d22","#b99565"]},
    {"id":"office","name":"Office","group":"Simple & Focus","world":"office","accent":"#72879d","light":["#eff2f3","#34434d","#778692","#ced8de","#e0e7eb","#afc3cb"],"dark":["#1d2932","#edf4f7","#afc0cb","#405462","#2c404c","#8eafbd"]},
    {"id":"code","name":"Code","group":"Simple & Focus","world":"code","accent":"#397dba","light":["#edf3fa","#21364e","#5e7895","#bdd0e3","#dce7f3","#72bacb"],"dark":["#0b1220","#e6f0ff","#92acc9","#2e4662","#18283e","#58bfcd"]},
    {"id":"math","name":"Math","group":"Simple & Focus","world":"math","accent":"#397b95","light":["#eef5f5","#243f4a","#5d7f8a","#bfd6da","#dcebed","#76b3be"],"dark":["#0d1c27","#e5f5f8","#92b3c0","#2c4c5c","#19313f","#6fb7c5"]},
    {"id":"science","name":"Science","group":"Simple & Focus","world":"science","accent":"#4a9297","light":["#eef6f3","#29494e","#6a8a8c","#c6ddd7","#dcebe4","#9acbc1"],"dark":["#122b31","#e5faf3","#9cc2c1","#33585c","#204247","#75b8b1"]},
    {"id":"sage","name":"Sage","group":"Gardens & Nature","world":"sage","accent":"#608272","light":["#edf1e9","#2d443a","#687f70","#c8d6c8","#e0e8da","#a1bba2"],"dark":["#14251f","#edf4e6","#a8bfaa","#365245","#253c30","#7fa88c"]},
    {"id":"rose","name":"Rose","group":"Gardens & Nature","world":"rose","accent":"#ae5679","light":["#f7eef1","#49303d","#846676","#e4d0da","#efdee6","#e6b8cb"],"dark":["#2c1d28","#f6eaf2","#c4a6b9","#55384d","#432d3c","#ad5e89"]},
    {"id":"flowers","name":"Flowers","group":"Gardens & Nature","world":"flowers","accent":"#b45285","light":["#fcf0f6","#563148","#94708a","#eac9dd","#f6dfea","#ef99c8"],"dark":["#291a2a","#fff0f9","#cba6c0","#68425f","#43283e","#dc7fb3"]},
    {"id":"nature","name":"Nature","group":"Gardens & Nature","world":"nature","accent":"#4a8747","light":["#edf4e4","#304b2b","#728969","#c8dbbb","#deebd2","#a0c27a"],"dark":["#11241a","#eaffdc","#9eb993","#34543a","#203b28","#72a85a"]},
    {"id":"sakura","name":"Sakura","group":"Gardens & Nature","world":"sakura","accent":"#c5689a","light":["#fff0f5","#643b54","#a37791","#efc9dc","#f8dfe9","#efa3c8"],"dark":["#29182b","#ffeef6","#d2a3bc","#643b59","#432640","#df86b0"]},
    {"id":"spring","name":"Spring","group":"Gardens & Nature","world":"spring","accent":"#a46c85","light":["#f2f4e9","#3a4838","#7c8b6d","#d6dfc6","#e6ecd9","#b7c99d"],"dark":["#202f27","#f1f3df","#b3c7a2","#425c43","#30432f","#83b18a"]},
    {"id":"ocean","name":"Ocean","group":"Coastal Escapes","world":"water","accent":"#427f9a","light":["#edf4f5","#294651","#6a8792","#c7dce0","#e0ebee","#8dbcc9"],"dark":["#112735","#e4f3f6","#9bbcc9","#2f5160","#1d3b4b","#4e9eb6"]},
    {"id":"coralreef","name":"Coral Reef","world":"coralreef","accent":"#438e97","light":["#e7f4f1","#284e54","#6d9291","#beded8","#d7ece5","#8cc8bc"],"dark":["#0e2b38","#e6faf3","#9fcbc8","#2f5e68","#1b4651","#66b9b7"],"group":"Coastal Escapes"},
    {"id":"hawaii","name":"Hawaii","world":"hawaii","accent":"#52968d","light":["#f4f4e5","#3d5149","#819079","#d8dfc6","#e7ecd8","#b8cba0"],"dark":["#19352f","#f2f5df","#b6cda5","#426652","#2b4c3b","#8db58c"],"group":"Coastal Escapes"},
    {"id":"fjord","name":"Fjord","world":"fjord","accent":"#6b8f9b","light":["#edf2f4","#344b59","#7c919e","#ccdbe1","#dfe9eb","#a6c0c9"],"dark":["#162c35","#e4eef3","#a5bac6","#3a5563","#243f4b","#7e9fae"],"group":"Coastal Escapes"},
    {"id":"summer","name":"Summer","group":"Coastal Escapes","world":"summer","accent":"#468a8c","light":["#f5f3e5","#304c4b","#72877b","#cdd9c9","#e4e9d7","#a5c9bb"],"dark":["#172d31","#f1f1da","#b0c5b4","#3e5a58","#29433f","#73b0a3"]},
    {"id":"autumn","name":"Autumn","group":"Weather & Seasons","world":"autumn","accent":"#b77143","light":["#f6ede1","#4b382b","#8c735a","#e0cdb5","#eddfc9","#d6ae78"],"dark":["#291f1c","#f7e7ce","#c5aa88","#594337","#3e2f25","#ba8853"]},
    {"id":"winter","name":"Winter","group":"Weather & Seasons","world":"winter","accent":"#4b819a","light":["#edf3f7","#2d424f","#697e8b","#cedde6","#dfebf1","#c1d9ee"],"dark":["#152230","#e8f5ff","#abc3d4","#314e65","#23384c","#679fc8"]},
    {"id":"snow","name":"Snow","world":"snow","accent":"#7b92b4","light":["#f1f5f8","#37485c","#7d91a6","#d2dfe9","#e4ecf3","#b5c9dc"],"dark":["#1a2b3b","#eef5ff","#b0c6d8","#3c5770","#2b4257","#8eafcf"],"group":"Weather & Seasons"},
    {"id":"storm","name":"Storm","group":"Weather & Seasons","world":"storm","accent":"#5c84b0","light":["#e5ecf4","#293c54","#647f9a","#bdcddb","#d3deeb","#97b5d5"],"dark":["#111a2d","#e5efff","#92abc9","#334966","#1f3049","#6d94ca"]},
    {"id":"cloudy","name":"Cloudy","group":"Weather & Seasons","world":"cloudy","accent":"#718ab1","light":["#edf1f9","#35455e","#7b8da6","#cbd5e6","#dfe6f3","#c0cde5"],"dark":["#1b243b","#eff3ff","#a9b7d3","#3f5070","#293855","#91a7d5"]},
    {"id":"solar","name":"Solar","group":"Space & Sky","world":"solar","accent":"#b78234","light":["#fbf3df","#4c3925","#8c7450","#e5d2a7","#f0e3c2","#e1bf78"],"dark":["#241c14","#fff1d5","#d0b58f","#59462e","#392d1e","#d9a95d"]},
    {"id":"midnight","name":"Midnight","group":"Space & Sky","world":"night","accent":"#8195b8","light":["#edf1f7","#33425b","#78869e","#cbd5e4","#dfe6f0","#afbed6"],"dark":["#101a2b","#ecf2ff","#a9bad2","#334862","#21364a","#7e9fbd"]},
    {"id":"cosmic","name":"Cosmic","group":"Space & Sky","world":"cosmic","accent":"#9d81ba","light":["#f1edf8","#423651","#857594","#dacde9","#e8def2","#b9a7cf"],"dark":["#16172b","#f3eafa","#b4a7c8","#46415e","#2c2843","#9b80bc"]},
    {"id":"lunar","name":"Lunar","group":"Space & Sky","world":"lunar","accent":"#8195b9","light":["#eff2f7","#303e55","#70819a","#c7d1df","#dce3ee","#a7bad6"],"dark":["#0c1424","#edf2ff","#a3b3ce","#30435f","#1c2c45","#93b4d8"]},
    {"id":"blackhole","name":"Black Hole","world":"blackhole","accent":"#b6907b","light":["#f1edf0","#423444","#887382","#d9c9d4","#e6dce3","#c0a7c5"],"dark":["#11131f","#f5eaf0","#baacbf","#493d52","#292336","#b093a9"],"group":"Space & Sky"},
    {"id":"aurora","name":"Aurora","group":"Space & Sky","world":"aurora","accent":"#288a77","light":["#eaf5ef","#244639","#5c7f70","#c2dfd1","#d6ebe0","#8fcbb9"],"dark":["#0d2126","#e5fff2","#9bc5ba","#25504e","#193b3a","#38bda4"]},
    {"id":"sunset","name":"Sunset","group":"Space & Sky","world":"sunset","accent":"#c4857d","light":["#fff0e4","#613e45","#a57a7d","#ebc7b9","#f5ddce","#e0ad91"],"dark":["#2d2336","#ffecdc","#d2acac","#664a59","#463148","#d99d8c"]},
    {"id":"amber","name":"Amber","group":"Earth & Elements","world":"amber","accent":"#b88b3e","light":["#f8efdc","#4d3926","#90774f","#dfcba7","#eee0c4","#d1af72"],"dark":["#281f16","#faefd9","#cbb393","#5b472f","#3c2f20","#c79a4c"]},
    {"id":"ice","name":"Ice","group":"Earth & Elements","world":"ice","accent":"#548eac","light":["#eff8fc","#2c485d","#7190a5","#c8e1ec","#e0eff5","#a5d3e6"],"dark":["#122b3c","#e4f7ff","#9fc9dd","#355a70","#224357","#7dbedc"]},
    {"id":"emerald","name":"Emerald","world":"emerald","accent":"#478f74","light":["#edf5ee","#2c4d3c","#6e8a75","#c8ddcb","#deebdc","#9bc4a4"],"dark":["#102c25","#e3f7e9","#9fc5ad","#325a48","#1f4132","#6eb18d"],"group":"Earth & Elements"},
    {"id":"fire","name":"Fire","group":"Earth & Elements","world":"fire","accent":"#d95d25","light":["#fff0df","#592d20","#986d51","#edc5a2","#f8ddc3","#ff9c38"],"dark":["#20100d","#fff0d9","#d1a180","#643522","#391c13","#ff7b25"]},
    {"id":"magma","name":"Magma","group":"Earth & Elements","world":"magma","accent":"#d64c2d","light":["#f6ece7","#472d2b","#8b6860","#dfc3b9","#eddbd2","#d89172"],"dark":["#171316","#ffede2","#cba697","#563c36","#2e2221","#d9764f"]},
    {"id":"desert","name":"Desert","world":"desert","accent":"#bd9459","light":["#f7edda","#4c3b2d","#927e61","#deceb3","#eddfc5","#d4b57e"],"dark":["#2a211b","#f6ead4","#c3ae8f","#5d4b37","#403224","#b28a54"],"group":"Earth & Elements"},
    {"id":"cave","name":"Cave","world":"cave","accent":"#7c899d","light":["#eef0f4","#374451","#7c8898","#cbd3dc","#dfe5eb","#a4bcc9"],"dark":["#141e2a","#e7f2f8","#a4b8c4","#344a5b","#243b4b","#7ca9bb"],"group":"Earth & Elements"},
    {"id":"mystic","name":"Mystic","group":"Fantasy & Mystery","world":"mystic","accent":"#9671b9","light":["#f2edf7","#453353","#867091","#ddcee8","#eae0f1","#c6acdb"],"dark":["#1c172b","#f4eaff","#bca8cf","#4d3a64","#30243f","#a17ac3"]},
    {"id":"magical","name":"Magical","group":"Fantasy & Mystery","world":"magic","accent":"#aa8243","light":["#faf3e6","#4b3b34","#917d62","#e4d4b8","#f0e3cc","#d5b77e"],"dark":["#241d30","#fff0d8","#cfb99a","#57435c","#3a2b40","#d0a363"]},
    {"id":"fantasy","name":"Fantasy","group":"Fantasy & Mystery","world":"fantasy","accent":"#7b6aaf","light":["#f0eff7","#3a3557","#7c7598","#d2cbe5","#e3def0","#b7c9ce"],"dark":["#131b2b","#f1ecff","#b2afcf","#424964","#252d46","#88acb4"]},
    {"id":"scary","name":"Scary","group":"Fantasy & Mystery","world":"scary","accent":"#a97876","light":["#eee8e6","#4c393e","#8d7779","#d8c7ca","#e6d6d7","#b99b9f"],"dark":["#191c24","#f0e5e2","#baa4a7","#4e414e","#2f2935","#947481"]},
    {"id":"lerouge","name":"Le Rouge","group":"Fantasy & Mystery","world":"lerouge","accent":"#bd4549","light":["#edddd3","#4c282a","#94716b","#d8b3aa","#e2c7bb","#bc6970"],"dark":["#160b0d","#f6e4d1","#c09b96","#5c2c31","#2a121a","#a52d37"]},
    {"id":"shadow","name":"Shadow","world":"shadow","accent":"#7d879b","light":["#efeff2","#3a3f4c","#7c8292","#d0d2dc","#e1e2e9","#b2b9c9"],"dark":["#191e2b","#ecedf5","#adb4c6","#3e465d","#2b3347","#8e9bb8"],"group":"Fantasy & Mystery"},
    {"id":"colorful","name":"Colorful","group":"Color & Style","world":"colorful","accent":"#a77491","light":["#f6f0f4","#493746","#887487","#dfcdd9","#ebdce7","#c3a4bc"],"dark":["#212136","#f8eef7","#c3afc8","#51445e","#343049","#ad8cae"]},
    {"id":"rainbow","name":"Rainbow","group":"Color & Style","world":"rainbow","accent":"#8b79b4","light":["#f2f1f9","#393951","#7a7897","#d4d1e6","#e5e2f1","#bbb0d5"],"dark":["#171a2d","#f3eeff","#b5afcf","#454361","#292a46","#a89acb"]},
    {"id":"retro","name":"Retro","world":"retro","accent":"#b77c57","light":["#f4e9d5","#513e37","#927c63","#ddc9ab","#ead9bc","#c1aa7b"],"dark":["#2b2225","#f5e6c8","#c5ab8e","#60473f","#432e2c","#b58e62"],"group":"Color & Style"},
    {"id":"fashion","name":"Fashion","group":"Color & Style","world":"fashion","accent":"#a17e86","light":["#f6f0e9","#44363e","#89757e","#ddcfd2","#ebe0df","#c6b2b2"],"dark":["#211c25","#f5eae7","#bea8b4","#51404e","#352a38","#a2879b"]},
    {"id":"aztec","name":"Aztec","world":"aztec","accent":"#8c9a70","light":["#f1f0e3","#3c4a38","#7f886a","#d1d8bf","#e2e6d2","#b7c58d"],"dark":["#1a2926","#f1f0dc","#b4c1a3","#42564b","#2b3f33","#93ab79"],"group":"Architecture & Futures"},
    {"id":"futuristic","name":"Futuristic","group":"Architecture & Futures","world":"future","accent":"#008c9e","light":["#eaf7f8","#143c49","#4b7783","#b5dce5","#d6eff3","#50c2d4"],"dark":["#07151f","#dcfaff","#92c3ce","#164557","#0d2d3b","#00c9e2"]},
    {"id":"city","name":"City Skyline","group":"Architecture & Futures","world":"city","accent":"#8098bf","light":["#eef2f7","#35455e","#7b8ca3","#cbd6e4","#dfe7ef","#afc3d9"],"dark":["#142131","#edf2ff","#b0bdd3","#3c506c","#293c55","#87a8cb"]},
    {"id":"radioactive","name":"Radioactive","world":"radioactive","accent":"#779b45","light":["#f0f3df","#3a4c2d","#7d8b62","#d1dbb7","#e2e8c9","#b7cc7c"],"dark":["#18251e","#eef8d0","#b5c593","#435d39","#2d402c","#9fbc59"],"group":"Architecture & Futures"},
  ];
  const preview = ['localhost','127.0.0.1'].includes(location.hostname) || location.protocol === 'file:';
  const resource = path => preview ? new URL(path, location.href).href : chrome.runtime.getURL(path);
  // Use the viewer's local clock; midnight is still their night, not their morning.
  const greeting = (now = new Date(), rawName = '') => {
    const hour = now.getHours();
    const [lead, phrase] = hour < 5 ? ['Still ', 'up']
      : hour < 12 ? ['Good ', 'morning']
      : hour < 17 ? ['Good ', 'afternoon']
      : hour < 21 ? ['Good ', 'evening'] : ['Enjoy your ', 'night'];
    // Keep a saved name as plain text and discard invisible direction controls.
    const name = typeof rawName === 'string' ? rawName.replace(/[\u0000-\u001f\u007f\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '').trim().slice(0, 32) : '';
    return {lead, phrase, name};
  };
  // A first visit has no saved choice yet, so it follows the operating system.
  const appearance = settings => ['light','dark'].includes(settings?.appearance)?settings.appearance:'system';
  const palette = settings => {
    const theme = themes.find(t=>t.id===settings.theme)||themes[0];
    const mode = appearance(settings), dark = mode==='dark'||mode==='system'&&matchMedia('(prefers-color-scheme: dark)').matches;
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
  globalThis.GoogleRefreshed = {themes,appearance,palette,logo,resource,fonts,loadFont,engines,searchURL,greeting};
})();
