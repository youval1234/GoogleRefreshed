// Package only runtime files. Browser profiles, exports, and test data are excluded.
const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
const root=__dirname,dist=path.join(root,'dist');fs.mkdirSync(dist,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'extension/manifest.json'),'utf8'));
const files=['manifest.json','shared.js','boot.js','results.js','content.js','background.js','data.js','sync.js','refresh.css','hardware.html','hardware.css','hardware.js','popup.html','popup.css',...fs.readdirSync(path.join(root,'extension/fonts')).map(x=>'fonts/'+x),'icons/16.png','icons/48.png','icons/128.png',...fs.readdirSync(path.join(root,'extension/icons/services')).filter(x=>x.endsWith('.png')).map(x=>'icons/services/'+x)];
const archive=path.join(dist,`GoogleRefreshed-v${manifest.version}.zip`);
// Python's standard library keeps the archive portable and needs no npm runtime dependency.
execFileSync(process.env.PYTHON||'python',['-c','import json,sys,zipfile,pathlib; root=pathlib.Path(sys.argv[1]); z=zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED); [z.write(root / p,p) for p in json.loads(sys.argv[3])]; z.close()',path.join(root,'extension'),archive,JSON.stringify(files)],{stdio:'inherit'});
console.log(archive);
const vm=require('vm'),scope={location:{hostname:'localhost',href:'http://localhost/'},URL};
vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(root,'extension/shared.js'),'utf8'),scope);
const themeRoot=path.join(dist,'browser-themes'),themeFiles=[];
for(const theme of scope.GoogleRefreshed.themes)for(const mode of ['light','dark']){
 const colors=theme[mode],rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
 const directory=path.join(themeRoot,theme.id+'-'+mode);fs.mkdirSync(directory,{recursive:true});
 fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify({manifest_version:3,version:manifest.version,name:'GoogleRefreshed · '+theme.name+' · '+mode,theme:{colors:{frame:rgb(colors[0]),toolbar:rgb(colors[4]),tab_text:rgb(colors[1]),tab_background_text:rgb(colors[2]),bookmark_text:rgb(colors[1]),ntp_background:rgb(colors[0]),ntp_text:rgb(colors[1]),omnibox_background:rgb(colors[0]),omnibox_text:rgb(colors[1])}}},null,2));themeFiles.push(theme.id+'-'+mode+'/manifest.json');
}
const themesArchive=path.join(dist,`GoogleRefreshed-browser-themes-v${manifest.version}.zip`);
execFileSync(process.env.PYTHON||'python',['-c','import json,sys,zipfile,pathlib; root=pathlib.Path(sys.argv[1]); z=zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED); [z.write(root / p,p) for p in json.loads(sys.argv[3])]; z.close()',themeRoot,themesArchive,JSON.stringify(themeFiles)],{stdio:'inherit'});console.log(themesArchive);
