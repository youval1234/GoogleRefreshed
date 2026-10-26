// Package only runtime files. Browser profiles, exports, and test data are excluded.
const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
const root=__dirname,dist=path.join(root,'dist');fs.mkdirSync(dist,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'extension/manifest.json'),'utf8'));
const files=['manifest.json','content.js','background.js','data.js','popup.html','popup.css','icons/16.png','icons/48.png','icons/128.png',...fs.readdirSync(path.join(root,'extension/icons/services')).filter(x=>x.endsWith('.png')).map(x=>'icons/services/'+x)];
const archive=path.join(dist,`GoogleRefreshed-v${manifest.version}.zip`);
// Python's standard library keeps the archive portable and needs no npm runtime dependency.
execFileSync(process.env.PYTHON||'python',['-c','import json,sys,zipfile,pathlib; root=pathlib.Path(sys.argv[1]); z=zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED); [z.write(root / p,p) for p in json.loads(sys.argv[3])]; z.close()',path.join(root,'extension'),archive,JSON.stringify(files)],{stdio:'inherit'});
console.log(archive);
