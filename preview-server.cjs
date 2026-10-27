const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const root = path.resolve(__dirname, 'extension');
require('./extension/data.js');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json'};
http.createServer((req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Cache-Control','no-store');
  if(!['127.0.0.1:4177','localhost:4177'].includes(req.headers.host)){res.writeHead(403);return res.end('Unsupported host');}
  if(req.url==='/api/data'&&req.method==='POST'){
    if(req.headers.origin&&req.headers.origin!=='http://127.0.0.1:4177'){res.writeHead(403);return res.end();}
    let body='';req.on('data',chunk=>{body+=chunk;if(body.length>10000)req.destroy();});
    req.on('end',async()=>{try{const message=JSON.parse(body);let data;if(message.type==='hardware'){const cpus=os.cpus();data={cpu:{cores:cpus.length,model:cpus[0]?.model||'CPU',total:cpus.reduce((s,c)=>s+Object.values(c.times).reduce((a,b)=>a+b,0),0),idle:cpus.reduce((s,c)=>s+c.times.idle,0)},memory:{total:os.totalmem(),available:os.freemem()}};}else data=await GoogleRefreshedData(message);res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,data,at:Date.now()}));}catch(error){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,error:error.message}));}});return;
  }
  let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Invalid URL');}
  const file = path.resolve(root, '.'+(name === '/' ? '/preview.html' : name));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
}).listen(4177,'127.0.0.1',()=>console.log('GoogleRefreshed preview: http://127.0.0.1:4177/preview.html'));
