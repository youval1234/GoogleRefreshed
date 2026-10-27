(() => {
  'use strict';
  // Shared by the extension's event-driven worker and the local design preview.
  // Every destination is selected here, never supplied as an arbitrary URL by a page.
  const topics = new Set(['local','top','world','technology','business','science','sports','health','entertainment','custom']);
  const regions = new Set(['US','GB','IL','CA','AU','DE','FR','IN','JP']);
  const languages = new Set(['en','he','de','fr','ja']);
  async function get(url,signal) {
    const response = await fetch(url,{signal:signal?AbortSignal.any([signal,AbortSignal.timeout(10000)]):AbortSignal.timeout(10000),credentials:'omit',referrerPolicy:'no-referrer'});
    if (!response.ok) throw new Error(`This source is unavailable (${response.status}). Try again shortly.`);
    if(Number(response.headers.get('content-length'))>1000000){await response.body?.cancel();throw new Error('This source returned too much data.');}
    const reader=response.body.getReader(),parts=[];let size=0;
    try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>1000000){await reader.cancel();throw new Error('This source returned too much data.');}parts.push(value);}}finally{reader.releaseLock();}
    const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.byteLength;}
    const text=new TextDecoder().decode(bytes);
    if(text.length>500000)throw new Error('This source returned too much data.');
    return text;
  }
  globalThis.GoogleRefreshedData = async (message,signal) => {
    if(message.type==='suggestions'){
      const query=String(message.query||'').trim().slice(0,200);if(!query)return [];
      const url=new URL('https://www.google.com/complete/search');url.search=new URLSearchParams({client:'gws-wiz',q:query,hl:languages.has(message.language)?message.language:'en'});
      const raw=(await get(url,signal)).trim(),wrapped=raw.match(/^window\.google\.ac\.h\(([\s\S]*)\);?$/);
      // Parse the callback's JSON payload as data. Never run remote JavaScript.
      const data=JSON.parse(wrapped?wrapped[1]:raw.replace(/^\)\]\}'\s*/,''));
      const plain=x=>String(x||'').replace(/\\u003c/gi,'<').replace(/\\u003e/gi,'>').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").slice(0,200);
      if(typeof data[0]==='string')return (data[1]||[]).filter(x=>typeof x==='string').slice(0,8).map(text=>({text,title:text,description:'',image:''}));
      return (data[0]||[]).filter(x=>Array.isArray(x)&&typeof x[0]==='string').slice(0,8).map(x=>{const detail=x[3]||{};let image='';try{const u=new URL(detail.zs);if(u.protocol==='https:'&&/^encrypted-tbn\d\.gstatic\.com$/.test(u.hostname))image=u.href;}catch{}return {text:plain(x[0]),title:plain(detail.zh||x[0]),description:plain(detail.zi),image};});
    }
    if(message.type==='location'){
      const data=JSON.parse(await get('https://ipwho.is/?fields=success,message,city,region,country,country_code,latitude,longitude',signal));
      if(!data.success||!Number.isFinite(data.latitude)||!Number.isFinite(data.longitude))throw new Error('Automatic location is unavailable. Choose your city manually.');
      return {name:String(data.city||data.region||data.country).slice(0,100),region:String(data.region||'').slice(0,100),country:String(data.country||'').slice(0,100),countryCode:/^[A-Z]{2}$/.test(data.country_code)?data.country_code:'US',latitude:Math.round(data.latitude*100)/100,longitude:Math.round(data.longitude*100)/100};
    }
    if(message.type==='cities'){
      const query=String(message.query||'').trim().slice(0,100);if(query.length<2)throw new Error('Type at least two letters of a city name.');
      const url=new URL('https://geocoding-api.open-meteo.com/v1/search');url.search=new URLSearchParams({name:query,count:'5',language:'en',format:'json'});
      const data=JSON.parse(await get(url,signal));return (data.results||[]).map(x=>({name:x.name,region:x.admin1||'',country:x.country||'',latitude:x.latitude,longitude:x.longitude}));
    }
    if(message.type==='weather'){
      const lat=Number(message.latitude),lon=Number(message.longitude);
      if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat < -90||lat>90||lon < -180||lon>180)throw new Error('Choose a valid city first.');
      const url=new URL('https://api.open-meteo.com/v1/forecast');url.search=new URLSearchParams({latitude:lat,longitude:lon,current:'temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m',daily:'weather_code,temperature_2m_max,temperature_2m_min',temperature_unit:message.units==='fahrenheit'?'fahrenheit':'celsius',wind_speed_unit:'kmh',timezone:'auto',forecast_days:'5'});
      return JSON.parse(await get(url,signal));
    }
    if(message.type==='news'){
      const topic=topics.has(message.topic)?message.topic:'top',region=/^[A-Z]{2}$/.test(message.region)?message.region:'US',language=languages.has(message.language)?message.language:'en';
      if(message.source==='bing'){
        const terms={top:'top news',world:'world news',technology:'technology',business:'business news',science:'science',sports:'sports',health:'health',entertainment:'entertainment'};
        const query=['local','custom'].includes(topic)?String(message.query||'local news').slice(0,150):terms[topic]||'news';
        const url=new URL('https://www.bing.com/news/search');url.search=new URLSearchParams({q:query,format:'rss',mkt:`${language}-${region}`,count:'30'});return get(url,signal);
      }
      if(message.source==='bbc'){
        const sections={world:'world',technology:'technology',business:'business',science:'science_and_environment',sports:'sport',health:'health',entertainment:'entertainment_and_arts'};
        const section=topic==='local'?(region==='GB'?'uk':region==='IL'?'world/middle_east':'world'):sections[topic]||'';
        return get('https://feeds.bbci.co.uk/'+(topic==='sports'?'sport/rss.xml':'news/'+(section?section+'/':'')+'rss.xml'),signal);
      }
      if(message.source==='guardian'){
        const sections={world:'world',technology:'technology',business:'business',science:'science',sports:'sport',health:'society',entertainment:'culture'};
        const section=topic==='local'?({GB:'uk-news',US:'us-news',AU:'australia-news'})[region]||'world':sections[topic]||'world';
        return get('https://www.theguardian.com/'+section+'/rss',signal);
      }
      const url=new URL('https://news.google.com/rss'+(['custom','local'].includes(topic)?'/search':topic==='top'?'':'/headlines/section/topic/'+topic.toUpperCase()));
      url.search=new URLSearchParams({hl:language,gl:region,ceid:`${region}:${language}`});
      if(['custom','local'].includes(topic))url.searchParams.set('q',String(message.query||'').trim().slice(0,150)||(topic==='local'?'local news':'technology'));
      return await get(url,signal);
    }
    throw new Error('Unsupported data request.');
  };
})();
