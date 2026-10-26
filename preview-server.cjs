const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, 'extension');
require('./extension/data.js');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json'};
http.createServer((req,res)=>{
  if(req.url==='/api/data'&&req.method==='POST'){
    if(req.headers.origin&&req.headers.origin!=='http://127.0.0.1:4177'){res.writeHead(403);return res.end();}
    let body='';req.on('data',chunk=>{body+=chunk;if(body.length>10000)req.destroy();});
    req.on('end',async()=>{try{const data=await GoogleRefreshedData(JSON.parse(body));res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,data,at:Date.now()}));}catch(error){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,error:error.message}));}});return;
  }
  const name = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file = path.resolve(root, '.'+(name === '/' ? '/preview.html' : name));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
}).listen(4177,'127.0.0.1',()=>console.log('GoogleRefreshed preview: http://127.0.0.1:4177/preview.html'));
