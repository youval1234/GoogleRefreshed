// Original vector scenery. Only the selected scene is mounted; nothing is fetched remotely.
(() => {
  'use strict';
  const a='var(--accent)',g='var(--glow)',f='var(--fg)',b='var(--bg)';
  const path=(d,fill=a,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
  const circle=(x,y,r,fill=a,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
  const rect=(x,y,w,h,fill=a,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const group=(cls,body,extra='')=>`<g class="${cls}" ${extra}>${body}</g>`;
  const stars=()=>group('art-stars',[[110,100],[280,245],[465,72],[720,170],[950,65],[1220,110],[1460,270],[1020,420],[85,510],[1510,620],[410,460]].map(([x,y],i)=>circle(x,y,i%3?2:3,f)).join(''),'opacity=".48"');
  const cloud=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${path('M0 95C-45 75-25 25 25 35C20-15 100-25 125 20C160-5 210 20 207 55C265 45 280 105 225 115C200 145 155 130 140 140C100 160 50 145 25 125C-10 135-25 110 0 95Z',g)}</g>`;
  const flower=(x,y,size,color=g)=>`<g transform="translate(${x} ${y}) scale(${size})" style="color:${color}"><use href="#scene-blossom"/></g>`;
  const pine=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">${path('M0 0-28 50H-15L-40 90H-22L-52 135H52L22 90H40L15 50H28Z')}${rect(-5,130,10,35)}</g>`;
  const hills=()=>path('M0 900Q220 650 470 830Q740 610 980 820Q1290 650 1600 870V1000H0Z',a,'opacity=".25"')+path('M0 950Q300 780 620 930Q980 740 1600 930V1000H0Z',g,'opacity=".25"');
  const scenes={};
  // Each scene has its own composition and movement; the central reading area stays quiet.
  const line=(d,color=a,width=2,opacity=.5,extra='')=>path(d,'none',`stroke="${color}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round" ${extra}`);
  const orbit=(x,y,body,cls='v-orbit',speed=24)=>`<g transform="translate(${x} ${y})"><g class="${cls}" style="--period:${speed}s">${body}</g></g>`;
  const dust=(cls,count,color=g)=>group(cls,Array.from({length:count},(_,i)=>circle((i*379+73)%1600,(i*211+47)%1000,1.5+(i%3),color,`class="v-spark" style="--phase:-${i*1.37}s"`)).join(''));
  const moon=(x,y,r)=>circle(x,y,r,'url(#moon-colors)','opacity=".8"')+circle(x+r*.35,y-r*.2,r*.91,b);
  const flowerBed=(side)=>Array.from({length:7},(_,i)=>{const x=side==='left'?35+i*26:1420+i*27,y=870-(i*61%210);return group('v-flower',line(`M${x-16} 1040Q${x+45} ${y+80} ${x} ${y}`,a,3,.45)+flower(x,y,.7+i%3*.32),'style="--phase:-'+i*.8+'s"');}).join('');
  const peak=path('M0 1000V920L170 790 310 925 470 855 620 1000M1000 1000 1220 835 1360 935 1490 800 1600 915V1000Z',a,'opacity=".32"');
  const caption=(x,y,text,size=12,color=a,extra='')=>`<text x="${x}" y="${y}" fill="${color}" font-family="monospace" font-size="${size}" ${extra}>${text}</text>`;
  // Static placement is on outer groups so animated transforms never detach the artwork.
  const codeScene=()=>`<defs>
    <radialGradient id="code-aura"><stop stop-color="${g}" stop-opacity=".22"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
    <linearGradient id="code-glass" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".16"/><stop offset="1" stop-color="${b}" stop-opacity=".82"/></linearGradient>
    <pattern id="code-dots" width="30" height="30" patternUnits="userSpaceOnUse">${circle(1,1,.8,a,'opacity=".15"')}</pattern></defs>`+
    rect(0,100,1600,900,'url(#code-dots)')+circle(50,440,440,'url(#code-aura)')+circle(1570,720,460,'url(#code-aura)')+
    `<g transform="translate(-32 215) rotate(-4 160 210)">`+group('v-code-editor',
      rect(0,0,310,438,b,'rx="16" opacity=".9"')+rect(0,0,310,438,'url(#code-glass)',`rx="16" stroke="${a}" stroke-opacity=".4"`)+
      line('M0 43H310M36 43V408',a,1,.22)+[18,32,46].map((x,i)=>circle(x,22,3.2,['#e88f9b','#e5c27c','#70c6b1'][i],'opacity=".8"')).join('')+
      caption(90,27,'motion.ts',11,f,'opacity=".7"')+caption(247,27,'TS',10,'#8da9e3')+
      rect(36,170,274,29,g,'opacity=".09" class="v-code-focus"')+
      [1,2,3,4,5,6,7,8,9,10].map((n,i)=>caption(14,80+i*29,String(n),10,a,'opacity=".45"')).join('')+
      `<text x="53" y="80" font-family="monospace" font-size="12.5" fill="${f}" opacity=".88">
        <tspan fill="var(--syntax-violet)">const </tspan><tspan fill="var(--syntax-cyan)">ease</tspan><tspan> = (t) =&gt; {</tspan>
        <tspan x="68" dy="29" fill="var(--syntax-violet)">return </tspan><tspan fill="var(--syntax-amber)">1 </tspan><tspan> - Math.</tspan><tspan fill="var(--syntax-cyan)">pow</tspan><tspan>(</tspan>
        <tspan x="83" dy="29" fill="var(--syntax-amber)">1 </tspan><tspan>- t, </tspan><tspan fill="var(--syntax-amber)">3</tspan>
        <tspan x="68" dy="29">);</tspan><tspan x="53" dy="29">};</tspan>
        <tspan x="53" dy="58" fill="${a}" opacity=".7">// make it feel effortless</tspan>
        <tspan x="53" dy="29" fill="var(--syntax-violet)">export </tspan><tspan fill="var(--syntax-violet)">default </tspan><tspan>ease;</tspan>
      </text>`+line('M58 94V166',a,1,.25)+
      rect(0,405,310,33,g,'rx="10" opacity=".09"')+caption(16,426,'⑂ main',10,a)+caption(209,426,'UTF-8  TS',9,a)+
      rect(148,272,2,16,g,'class="v-code-caret"')
    )+'</g>'+
    `<g transform="translate(1322 185) rotate(5 140 155)">`+group('v-code-branches',
      rect(0,0,310,332,b,'rx="16" opacity=".9"')+rect(0,0,310,332,'url(#code-glass)',`rx="16" stroke="${a}" stroke-opacity=".35"`)+
      caption(23,31,'SOURCE CONTROL',10,a,'letter-spacing="2"')+line('M0 48H310',a,1,.2)+
      line('M47 81V285M47 112C47 145 100 132 100 167V216C100 251 47 241 47 272',a,2,.45)+
      line('M47 112C47 145 100 132 100 167V216C100 251 47 241 47 272',g,3,.85,'stroke-dasharray="8 190" class="v-code-commit"')+
      [[47,83],[47,112],[100,169],[100,216],[47,272]].map(([x,y],i)=>circle(x,y,5,b,`stroke="${i>1&&i<4?'var(--syntax-violet)':g}" stroke-width="2"`)).join('')+
      caption(125,89,'a thoughtful detail',11,f)+caption(125,120,'refine the motion',10,a)+caption(125,175,'explore / create',11,'var(--syntax-violet)')+
      caption(125,222,'bring it together',10,a)+caption(125,278,'one smooth flow',11,f)
    )+'</g>'+
    `<g transform="translate(1315 734) rotate(-3 150 80)">`+group('v-code-terminal',
      rect(0,0,340,176,b,'rx="14" opacity=".9"')+rect(0,0,340,176,'url(#code-glass)',`rx="14" stroke="${a}" stroke-opacity=".35"`)+
      caption(22,29,'TERMINAL',10,a,'letter-spacing="2"')+line('M0 44H340',a,1,.22)+
      caption(22,77,'~/studio',12,'var(--syntax-violet)')+caption(22,108,'❯ npm run create',12,f)+
      caption(22,143,'ready for your next idea',11,'var(--syntax-cyan)')+rect(218,132,7,13,g,'class="v-code-caret"')
    )+'</g>'+
    group('v-code-wiring',line('M0 740H100Q160 740 160 800V930H320M1600 580H1470Q1430 580 1430 620V675H1550',a,1,.25)+
      line('M0 740H100Q160 740 160 800V930H320M1600 580H1470Q1430 580 1430 620V675H1550',g,2,.7,'stroke-dasharray="10 270" class="v-code-commit"')+
      [[100,740],[320,930],[1550,675]].map(([x,y])=>circle(x,y,4,g,'opacity=".7"')).join(''));

  const lunarScene=()=>`<defs>
    <radialGradient id="lunar-halo"><stop stop-color="${g}" stop-opacity=".28"/><stop offset=".65" stop-color="${g}" stop-opacity=".07"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
    <radialGradient id="lunar-surface" cx=".29" cy=".24" r=".87"><stop stop-color="#f4f1dd"/><stop offset=".42" stop-color="#c2cbd6"/><stop offset=".79" stop-color="#6f8098"/><stop offset="1" stop-color="#35435c"/></radialGradient>
    <radialGradient id="lunar-crater"><stop stop-color="#42516b" stop-opacity=".34"/><stop offset=".65" stop-color="#52617a" stop-opacity=".17"/><stop offset="1" stop-color="#edf3f5" stop-opacity=".2"/></radialGradient>
    <clipPath id="lunar-disc">${circle(0,0,151)}</clipPath></defs>`+
    stars()+dust('v-lunar-starlight',20,f)+circle(1405,275,310,'url(#lunar-halo)')+
    `<g transform="translate(1405 275)">`+group('v-lunar-world',
      circle(0,0,151,'url(#lunar-surface)')+
      `<g clip-path="url(#lunar-disc)">`+
      path('M-130-70Q-100-100-65-72T-20-85Q35-94 44-50T-20 18Q-45 46-90 16T-140 35Z','#6b7d95','opacity=".22"')+
      path('M-25 60Q20 25 65 54T130 80L110 135Q25 170-25 120Z','#53677e','opacity=".25"')+
      [[-85,-55,25],[-32,-106,12],[27,-70,20],[85,-29,32],[-60,53,37],[14,24,15],[28,103,25],[106,77,19],[-109,18,12],[57,40,9],[-10,-33,8]].map(([x,y,r])=>
        circle(x,y,r,'url(#lunar-crater)')+line(`M${x-r*.7} ${y+r*.4}Q${x} ${y+r*1.3} ${x+r*.8} ${y+r*.1}`,'#eff5f7',1.5,.3)+circle(x-2,y-2,r*.7,'none','stroke="#46536c" stroke-opacity=".17"')).join('')+
      Array.from({length:47},(_,i)=>{const x=(i*59%268)-134,y=(i*83%268)-134,r=1.2+i%5;return circle(x,y,r,'url(#lunar-crater)','opacity=".65"')+line(`M${x-r*.5} ${y+r*.65}l${r} .1`,'#f0f6ff',.7,.24);}).join('')+
      line('M-61 59-95 101M-61 59-108 43M-61 59-44 115M-61 59-17 74M85-29 122-65M85-29 130-13M85-29 87-82','#e4edf4',1,.13)+
      path('M69-151C-26-45 9 91 100 151H180V-170Z','#101d35','opacity=".26"')+'</g>'+
      circle(0,0,151,'none','stroke="#e3f1ff" stroke-opacity=".3"')+
      `<g transform="rotate(-22)"><ellipse rx="202" ry="64" fill="none" stroke="${a}" stroke-width="1" opacity=".38"/></g>`+
      group('v-lunar-probe',rect(190,-5,15,10,'#c6d9ed','rx="2"')+rect(180,-9,8,18,a)+rect(207,-9,8,18,a))
    )+'</g>'+
    group('v-lunar-cartography',line('M30 225H180M75 185V265M30 680H235M80 640V720',a,1,.25)+
      [120,154,188].map(r=>circle(30,450,r,'none',`stroke="${a}" stroke-width="1" opacity=".18" stroke-dasharray="3 9"`)).join('')+
      caption(44,300,'MARE TRANQUILLITATIS',9,a,'letter-spacing="2" opacity=".6"')+caption(44,321,'00° 41′ N / 23° 26′ E',10,a,'opacity=".4"')+
      line('M5 453H255M130 328V578',a,1,.16))+
    group('v-lunar-horizon',path('M0 1000V936Q180 853 370 926T750 959Q1100 865 1600 861V1000Z',a,'opacity=".15"')+
      path('M0 1000V979Q180 900 420 973Q1020 1030 1600 938V1000Z',g,'opacity=".22"')+
      [0,1,2,3,4].map(i=>`<ellipse cx="${110+i*323}" cy="${964+i%2*20}" rx="${35+i*7}" ry="${5+i}" fill="none" stroke="${f}" opacity=".14"/>`).join(''))+
    group('v-lunar-drifter',line('M65 135 185 100','url(#star-tail)',2,.65));

  const fantasyScene=()=>`<defs>
    <linearGradient id="fantasy-island" x2=".6" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <linearGradient id="fantasy-falls" x2="0" y2="1"><stop stop-color="#9ddfe1" stop-opacity=".7"/><stop offset="1" stop-color="#9ddfe1" stop-opacity="0"/></linearGradient>
    <radialGradient id="fantasy-mist"><stop stop-color="${g}" stop-opacity=".26"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
    <linearGradient id="fantasy-tower" x2="1" y2="1"><stop stop-color="${g}"/><stop offset="1" stop-color="${a}"/></linearGradient></defs>`+
    circle(1500,440,420,'url(#fantasy-mist)')+circle(90,780,310,'url(#fantasy-mist)')+
    group('v-fantasy-mountains',path('M0 1000V768L110 610 210 745 310 630 460 915 560 1000M1070 1000 1210 790 1320 920 1430 665 1600 790V1000Z',a,'opacity=".15"'))+
    `<g transform="translate(1308 280)">`+group('v-fantasy-citadel',
      path('M-37 260Q78 221 211 257L254 295 189 327 155 413 105 356 67 438 24 348-27 315Z','url(#fantasy-island)','opacity=".8"')+
      path('M-37 260Q78 221 211 257L254 295Q118 278-27 315Z',g,'opacity=".32"')+
      path('M-8 264V145H22V97L51 48 80 97V157H111V73L146 10 181 73V161H208V124L233 83 258 124V280Z','url(#fantasy-tower)','opacity=".75"')+
      path('M51 98H80V157H95V264H65V160H51ZM146 74H181V161H195V280H166V163H146ZM233 125H258V280H246V165H233Z',b,'opacity=".27"')+
      path('M17 98 51 38 86 98ZM106 73 146-2 187 73ZM202 125 233 75 265 125Z',a,'opacity=".9"')+
      line('M51 39V12M146 0V-29M233 76V52',a,2,.7)+
      path('M146-28q28-10 42 7l-42 6M51 13q22-8 34 6l-34 5',g,'class="v-fantasy-banner" opacity=".85"')+
      path('M98 280V235Q122 202 146 235V280Z',b,'opacity=".65"')+
      [[43,131],[138,110],[138,151],[225,159],[25,203],[185,213]].map(([x,y],i)=>rect(x,y,8,19,'#f1d59a',`rx="4" class="v-fantasy-lantern" style="--phase:-${i*1.1}s" opacity=".65"`)).join('')+
      line('M51 110V252M146 87V195M233 138V258M-18 285Q110 259 231 281',f,1,.24)+
      line('M27 106H76M116 83H177M211 133H255M-8 171H25M82 179H111M181 182H209M37 118H64M126 94H166M222 144H246',f,1,.27)+
      [176,201,226,251].map(y=>line(`M-7 ${y}H22M81 ${y+5}H109M181 ${y+8}H209`,a,.8,.22)).join('')+
      path('M-10 265Q12 237 33 260Q49 240 73 258M168 275Q187 252 210 267L243 279',g,'opacity=".6"')+
      line('M19 270Q38 280 29 303M187 278Q175 302 193 315',g,2,.65)+
      path('M31 292q-17-17-23-5 8 14 23 5M185 298q15-20 23-7-7 15-23 7',g,'opacity=".65"')+
      line('M1 314 48 348 67 438M120 325 105 356M168 315 155 413M193 292 189 327',g,1,.25)+
      path('M35 303Q43 350 28 462T31 650H53Q47 520 62 440T57 300Z','url(#fantasy-falls)','class="v-fantasy-falls"')+
      line('M45 312Q54 400 40 480T42 610','#d4ffff',2,.5,'stroke-dasharray="12 20" class="v-fantasy-water"')
    )+'</g>'+
    `<g transform="translate(40 690)">`+group('v-fantasy-islet',
      path('M-20 0Q90-65 198 3L232 34 140 75 92 162 53 81-25 43Z','url(#fantasy-island)','opacity=".8"')+
      path('M-20 0Q90-65 198 3L232 34Q100 15-25 43Z',g,'opacity=".3"')+
      path('M74 15Q91-35 79-72Q65-100 41-113Q77-104 88-86Q85-128 108-171Q93-121 103-94Q121-132 151-151Q125-120 111-70Q103-25 119 12Z',a,'opacity=".7"')+
      [[30,-120,43],[105,-170,51],[150,-151,38],[77,-119,48]].map(([x,y,r],i)=>
        path(`M${x-r} ${y}Q${x-r*1.1} ${y-r*.55} ${x-r*.5} ${y-r*.65}Q${x-r*.15} ${y-r*1.2} ${x+r*.3} ${y-r*.7}Q${x+r*.9} ${y-r*.75} ${x+r} ${y}Q${x+r*1.15} ${y+r*.5} ${x+r*.4} ${y+r*.5}Q${x} ${y+r*.95} ${x-r*.45} ${y+r*.5}Q${x-r*1.15} ${y+r*.5} ${x-r} ${y}Z`,g,`opacity="${.28+i*.045}"`)).join('')+
      line('M-10 30Q72-6 200 18',f,1,.25)+path('M-25 43 53 81 92 162 65 51Z',b,'opacity=".25"')+
      path('M-5 35Q18 90 0 166T-10 280H20Q14 175 35 102L25 29Z','url(#fantasy-falls)','class="v-fantasy-falls"')
    )+'</g>'+
    group('v-fantasy-ribbon',line('M-50 345C70 255 213 375 238 242S100 164 65 205',g,2,.45,'stroke-dasharray="2 8"')+
      [[64,205],[179,314],[226,269]].map(([x,y],i)=>circle(x,y,3,'#f2db9a',`class="v-fantasy-lantern" style="--phase:-${i*1.7}s"`)).join(''))+
    group('v-fantasy-haze',path('M-100 936Q140 810 390 934T950 963T1700 899',g,'opacity=".12"'));

  const mathPolyhedron=()=>{
    const phi=(1+Math.sqrt(5))/2,vertices=[];
    for(const x of [-1,1])for(const y of [-phi,phi])vertices.push([0,x,y],[x,y,0],[y,0,x]);
    const edges=[];for(let i=0;i<vertices.length;i++)for(let j=i+1;j<vertices.length;j++){
      if(Math.abs(vertices[i].reduce((s,n,k)=>s+(n-vertices[j][k])**2,0)-4)<.001)edges.push([i,j]);
    }
    // Precompute nine perspective projections once per mount; CSS interpolates them.
    const frames=Array.from({length:9},(_,i)=>{
      const t=i*Math.PI/4,points=vertices.map(([x,y,z])=>{const rx=x*Math.cos(t)+z*Math.sin(t),rz=z*Math.cos(t)-x*Math.sin(t),ry=y*Math.cos(.4)-rz*Math.sin(.4),depth=y*Math.sin(.4)+rz*Math.cos(.4),scale=74/(1+depth*.1);return [rx*scale,ry*scale].map(n=>n.toFixed(2));});
      return edges.map(([j,k])=>`M${points[j].join(' ')}L${points[k].join(' ')}`).join('');
    });
    return path(frames[0],'none',`stroke="${g}" stroke-width="1.3" stroke-linecap="round" opacity=".7" class="v-math-solid" style="${frames.map((d,i)=>`--mesh-${i}:path('${d}')`).join(';')}"`)+
      circle(0,0,162,'none',`stroke="${a}" opacity=".22" stroke-dasharray="100 8 3 8"`);
  };
  const mathScene=()=>{
    const spiral=Array.from({length:190},(_,i)=>{const t=i*.105,r=2+i*.69;return `${i?'L':'M'}${(145+Math.cos(t)*r).toFixed(2)} ${(340+Math.sin(t)*r).toFixed(2)}`;}).join('');
    const surface=Array.from({length:11},(_,i)=>{
      const u=(i-5)/5;const curve=Array.from({length:30},(_,j)=>{const v=(j-14.5)/14.5;return `${j?'L':'M'}${(1405+(u-v)*78).toFixed(2)} ${(780+(u+v)*34+(u*u-v*v)*58).toFixed(2)}`;}).join('');
      const cross=Array.from({length:30},(_,j)=>{const v=(j-14.5)/14.5;return `${j?'L':'M'}${(1405+(v-u)*78).toFixed(2)} ${(780+(v+u)*34+(v*v-u*u)*58).toFixed(2)}`;}).join('');
      return line(curve,a,1,.35)+line(cross,g,1,.5);
    }).join('');
    return `<defs><radialGradient id="math-aura"><stop stop-color="${g}" stop-opacity=".2"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
      <pattern id="math-paper" width="34" height="34" patternUnits="userSpaceOnUse">${line('M34 0H0V34',a,.7,.1)}</pattern></defs>`+
      rect(0,120,1600,880,'url(#math-paper)')+circle(1430,760,330,'url(#math-aura)')+
      group('v-math-spiral',line(spiral,g,1.8,.7,'pathLength="1"')+circle(145,340,137,'none',`stroke="${a}" stroke-width="1" stroke-dasharray="2 9" opacity=".35"`)+
        line('M-10 340H300M145 185V495',a,1,.2))+
      caption(40,545,'r = a + bθ',25,a,'font-style="italic" opacity=".65"')+
      `<g transform="translate(1405 260)">`+group('v-math-polyhedron',mathPolyhedron())+'</g>'+
      caption(1310,464,'V − E + F = 2',18,a,'opacity=".6"')+
      group('v-math-manifold',surface+line('M1235 840 1405 912 1580 840M1405 912V655',a,1,.27)+
        caption(1280,928,'z = x² − y²',20,a,'opacity=".65"'))+
      group('v-math-wave',line('M-25 805H270M15 700V913',a,1,.3)+
        line('M-20 802C18 802 18 734 57 734S96 870 135 870 174 734 213 734 252 870 291 870',g,2,.7,'class="v-math-sine" pathLength="1"')+
        caption(25,950,'f(x) = sin x',19,a,'opacity=".65"'));
  };

  const magmaScene=()=>`<defs>
    <linearGradient id="magma-core" x2=".7" y2="1"><stop stop-color="#e44728"/><stop offset=".3" stop-color="#ffb04a"/><stop offset=".6" stop-color="#fa5e26"/><stop offset="1" stop-color="#b62a27"/></linearGradient>
    <radialGradient id="magma-heat"><stop stop-color="#ff682b" stop-opacity=".28"/><stop offset=".6" stop-color="#e24225" stop-opacity=".08"/><stop offset="1" stop-color="#e24225" stop-opacity="0"/></radialGradient>
    <linearGradient id="magma-basalt" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".25"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${a}" stop-opacity=".23"/></linearGradient></defs>`+
    circle(1490,630,430,'url(#magma-heat)')+circle(0,900,380,'url(#magma-heat)')+
    group('v-magma-massif',path('M1250 1000 1300 770 1270 655 1347 540 1390 570 1465 358 1535 375 1600 470V1000Z','url(#magma-basalt)')+
      path('M1465 358C1469 410 1443 456 1450 485C1456 515 1390 540 1390 570C1389 589 1443 594 1432 624C1426 650 1382 672 1389 703C1396 733 1446 753 1435 786C1421 827 1391 842 1406 888L1455 1000H1500L1453 876C1443 849 1493 804 1483 770C1474 734 1420 721 1430 692C1438 668 1487 631 1477 604C1468 580 1426 578 1433 558C1442 533 1500 515 1490 482C1482 449 1517 397 1504 367Z','url(#magma-core)','opacity=".9"')+
      line('M1483 374C1492 414 1459 462 1474 486S1391 551 1410 577 1473 592 1453 624 1390 678 1410 705 1474 746 1455 786 1418 847 1431 878L1475 1000','#ffd58b',3,.8,'stroke-dasharray="30 100" class="v-magma-current"')+
      line('M1473 394C1479 435 1453 474 1463 491S1403 551 1400 569M1446 630Q1400 686 1403 701M1424 902 1458 988','#ffca73',1.2,.6)+
      path('M1347 540 1390 570 1432 608 1389 694 1435 770 1300 770 1270 655Z',a,'opacity=".1"')+
      line('M1347 540 1340 649 1300 770M1535 375 1518 535 1600 615M1483 770 1550 706 1600 737M1500 1000 1545 896 1600 880',a,2,.3))+
    group('v-magma-foreground',path('M-20 580 46 630 79 793 143 853 199 906 333 970 500 1000H-20Z','url(#magma-basalt)')+
      path('M-10 746C-1 780 53 786 43 819S19 853 35 870C53 889 103 885 113 918S147 952 186 960L296 1000H385C322 977 315 959 269 946S177 938 164 912 151 873 123 860 65 847 75 821 100 794 75 769L2 702Z','url(#magma-core)','opacity=".9"')+
      line('M0 729C19 771 77 783 65 813S37 847 61 862 124 879 132 911 173 944 212 950L340 1006','#ffdb8d',3,.8,'stroke-dasharray="15 75" class="v-magma-current"')+
      path('M0 785 43 807 27 855 95 895 132 946 237 970 296 1000H0Z',b,'opacity=".5"')+
      line('M46 630 25 711M79 793 143 778 188 840M95 895 68 949 20 965M237 970 225 935 270 911',a,2,.4))+
    group('v-magma-fissures',line('M1570 100 1540 190 1578 238 1517 319M1540 190 1485 207 1467 254M0 180 56 211 37 285 95 331 70 389','#f77846',1.5,.5)+
      line('M1570 100 1540 190 1578 238 1517 319M0 180 56 211 37 285 95 331 70 389','#ffd08b',3,.5,'stroke-dasharray="4 90" class="v-magma-current"'))+
    group('v-magma-crust',[[1444,451,9],[1452,614,8],[1404,700,6],[1456,815,10],[39,789,7],[76,861,10],[193,948,8]].map(([x,y,r])=>
      path(`M${x-r} ${y-r*.3}l${r*.8}-${r*.5} ${r} ${r*.4} ${r*.5} ${r*.8}-${r} ${r*.7}-${r*.9}-${r*.3}Z`,b,'opacity=".85"')+line(`M${x-r} ${y-r*.3}l${r*.8}-${r*.5} ${r} ${r*.4}`,'#ffbd77',1,.7)).join(''))+
    group('v-magma-cinders',[[25,746],[115,860],[220,943],[1450,510],[1515,665],[1558,836],[1385,745],[85,624]].map(([x,y],i)=>
      `<g transform="translate(${x} ${y})">${circle(0,0,1.5+i%3,'#ffb267',`class="v-magma-cinder" style="--phase:-${i*1.29}s;--drift:${i%2?18:-13}px"`)}</g>`).join(''));
  const sageLeaf=(x,y,scale,angle,color=g)=>`<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">`+
    path('M0 0C-43-23-44-80-4-108C37-76 44-26 0 0Z',color,'opacity=".6"')+
    line('M0 0Q-8-52-4-100M-5-28-28-48M-6-47 20-67M-6-64-23-81',f,1,.25)+'</g>';
  const sageScene=()=>`<defs><radialGradient id="sage-light"><stop stop-color="${g}" stop-opacity=".24"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
    <linearGradient id="sage-vellum" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".15"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></linearGradient></defs>`+
    circle(0,460,450,'url(#sage-light)')+circle(1600,850,430,'url(#sage-light)')+
    group('v-sage-main',line('M-65 1040C184 789 235 437 114 130',a,4,.6)+
      [[122,213,.9,-36],[148,291,1.1,59],[166,382,1.2,-54],[164,475,1.15,51],[153,577,1.4,-58],[123,680,1.3,54],[81,778,1.4,-59],[26,874,1.1,56]].map(([x,y,s,r],i)=>sageLeaf(x,y,s,r,i%3?g:a)).join('')+
      line('M110 226 122 213M154 301 148 291M155 394 166 382M171 485 164 475M139 592 153 577M136 694 123 680',a,2,.45))+
    group('v-sage-secondary',line('M1680 1110C1430 903 1390 715 1508 446Q1559 338 1551 203',a,3,.55)+
      [[1550,260,.75,57],[1543,342,.85,-60],[1511,447,1,47],[1476,529,1.15,-57],[1446,626,1.3,52],[1451,732,1.15,-65],[1480,837,1.35,61],[1520,926,1.1,-61]].map(([x,y,s,r],i)=>sageLeaf(x,y,s,r,i%3?a:g)).join(''))+
    group('v-sage-sprig',line('M-10 950Q80 890 176 929M1342 1000Q1440 873 1580 875',a,2,.4)+
      [[40,925],[82,917],[123,922],[1420,923],[1466,895],[1510,880]].map(([x,y],i)=>`<g transform="translate(${x} ${y}) rotate(${i*37})">`+
        [0,72,144,216,288].map(n=>`<ellipse rx="5" ry="11" cy="-8" fill="${f}" opacity=".46" transform="rotate(${n})"/>`).join('')+circle(0,0,3,g)+'</g>').join(''))+
    group('v-sage-sunwash',path('M1250 1000Q1460 610 1600 550V1000Z','url(#sage-vellum)'))+
    group('v-sage-motes',[[43,234],[235,593],[1310,809],[1500,349],[125,877],[1480,970]].map(([x,y],i)=>circle(x,y,1.5,g,`class="v-sage-mote" style="--phase:-${i*1.9}s"`)).join(''));

  const rainbowScene=()=>{
    const colors=['#ec8194','#edab71','#e4ce80','#86c5ad','#7ebfd5','#959fdc','#c49cdb'];
    return `<defs><linearGradient id="rainbow-glass" x2="1" y2="1"><stop stop-color="#bee6ed" stop-opacity=".55"/><stop offset=".5" stop-color="${b}" stop-opacity=".1"/><stop offset="1" stop-color="#c4a6e4" stop-opacity=".6"/></linearGradient>
      <radialGradient id="rainbow-halo"><stop stop-color="${g}" stop-opacity=".25"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient></defs>`+
      circle(1450,340,330,'url(#rainbow-halo)')+circle(15,840,330,'url(#rainbow-halo)')+
      `<g transform="translate(1400 280) rotate(-12)">`+group('v-rainbow-glass',
        path('M0-140 134 103-134 103Z','url(#rainbow-glass)',`stroke="${f}" stroke-opacity=".5" stroke-width="1.5"`)+
        path('M0-140 30 50-134 103Z','#c1e7e7','opacity=".12"')+path('M0-140 134 103 30 50Z','#c7b0e7','opacity=".18"')+
        line('M0-140 30 50 134 103M30 50-134 103',f,1,.4)+
        line('M-270-48-53-2',f,3,.65)+
        colors.map((color,i)=>line(`M30 ${15+i*4}Q155 ${-35+i*13} 312 ${-122+i*47}`,color,5,.7,`class="v-rainbow-refract" style="--phase:-${i*.45}s"`)).join('')+
        circle(30,25,5,f,'opacity=".8"')
      )+'</g>'+
      `<g transform="translate(55 805) rotate(18)">`+group('v-rainbow-sculpture',
        colors.map((color,i)=>{
          const r=156-i*17;return line(`M${-r} 230V0C${-r} ${-r*1.32} ${r} ${-r*1.32} ${r} 0V230`,color,12,.58)+
            line(`M${-r-3} 230V0C${-r-3} ${-r*1.32} ${r-3} ${-r*1.32} ${r-3} 0V230`,f,1,.23);
        }).join('')
      )+'</g>'+
      group('v-rainbow-caustic',colors.map((color,i)=>line(`M${1260+i*24} 1000C${1170+i*34} 922 ${1480+i*12} 770 ${1610+i*20} 790`,color,3,.35)).join(''))+
      group('v-rainbow-glints',[[48,274],[230,733],[1315,547],[1512,695]].map(([x,y],i)=>`<g transform="translate(${x} ${y})">${path('M0-9 2-2 9 0 2 2 0 9-2 2-9 0-2-2Z',f,`opacity=".5" class="v-rainbow-glint" style="--phase:-${i*1.8}s"`)}</g>`).join(''));
  };

  const solarScene=()=>`<defs><radialGradient id="solar-atmosphere"><stop stop-color="#ecac4f" stop-opacity=".25"/><stop offset=".5" stop-color="#c57f36" stop-opacity=".09"/><stop offset="1" stop-color="#c57f36" stop-opacity="0"/></radialGradient>
    <radialGradient id="solar-photosphere" cx=".39" cy=".35" r=".67"><stop stop-color="#ffe9a6"/><stop offset=".55" stop-color="#f9c46b"/><stop offset=".88" stop-color="#ed963e"/><stop offset="1" stop-color="#c45d2e"/></radialGradient>
    <clipPath id="solar-disc">${circle(0,0,118)}</clipPath></defs>`+
    circle(1400,280,365,'url(#solar-atmosphere)')+
    `<g transform="translate(1400 280)">`+group('v-solar-celestial',
      group('v-solar-corona',Array.from({length:24},(_,i)=>{const t=i*Math.PI/12,x=Math.cos(t),y=Math.sin(t),r=148+i%4*10;return line(`M${x*118} ${y*118}Q${x*r-y*16} ${y*r+x*16} ${x*(r+32)} ${y*(r+32)}`,'#f2b65c',i%3?1.5:3,.25+i%3*.07);}).join(''))+
      circle(0,0,134,'none','stroke="#f6b85a" stroke-width="14" opacity=".07"')+
      circle(0,0,118,'url(#solar-photosphere)')+
      `<g clip-path="url(#solar-disc)">`+Array.from({length:70},(_,i)=>{const x=i*43%240-120,y=i*79%240-120;return line(`M${x} ${y}q5-4 9 1`,'#fff0b0',1+i%3,.1+i%4*.04);}).join('')+
      path('M-72-3Q-35-45 12-2T84 15M-59 58Q-12 24 52 63','none','stroke="#b36831" stroke-width="9" opacity=".08"')+
      [[38,22,4],[43,16,2],[-37,-45,3],[-43,-41,2]].map(([x,y,r])=>circle(x,y,r,'#a16d38','opacity=".3"')).join('')+'</g>'+
      group('v-solar-prominence',line('M-97-69C-156-166-197-64-118-24M84 83C159 145 164 31 110 43','#f4a44c',3,.75)+
        line('M-97-69C-142-140-174-66-118-24M84 83C144 121 148 45 110 43','#ffe2a0',1.5,.75))
    )+'</g>'+
    group('v-solar-contours',Array.from({length:7},(_,i)=>line(`M-80 ${250+i*32}C80 ${116+i*29} 228 ${302+i*30} 257 ${515+i*38}`,a,1,.14+i*.02)).join(''))+
    group('v-solar-sand',path('M-100 1000V879Q120 762 360 885T940 920Q1250 826 1700 916V1000Z',a,'opacity=".13"')+
      path('M-80 1000V963Q180 812 458 953T1050 990T1690 918V1000Z',g,'opacity=".23"')+
      line('M-70 951Q170 829 400 937M1330 946Q1470 911 1640 956',f,1,.18))+
    group('v-solar-dust',[[65,620],[200,699],[1270,667],[1495,852],[78,891]].map(([x,y],i)=>circle(x,y,1.5,'#eac387',`class="v-solar-speck" style="--phase:-${i*1.47}s"`)).join(''));

  const autumnLeaf=(x,y,s,angle,color)=>`<g transform="translate(${x} ${y}) rotate(${angle}) scale(${s})">`+
    path('M0 24-6 8-24 8-16-3-29-14-12-12-13-29-2-18 5-39 12-19 25-25 22-8 35-5 20 6 25 17 10 17 6 29Z',color,'opacity=".7"')+
    line('M0 38 5-23M3 3-15-9M3 9 22-3',f,1,.28)+'</g>';
  const autumnScene=()=>`<defs><radialGradient id="autumn-canopy"><stop stop-color="${g}" stop-opacity=".22"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient></defs>`+
    circle(40,330,400,'url(#autumn-canopy)')+circle(1580,240,400,'url(#autumn-canopy)')+
    group('v-autumn-woodland',Array.from({length:12},(_,i)=>{const x=i*153-25,h=210+i*29%160;return line(`M${x} 1000V${1000-h}m0 110-32-62m32 18 36-65`,a,3,.12+i%3*.035);}).join(''))+
    group('v-autumn-maple-left',path('M-40 1000Q120 801 78 579Q39 391 148 204L195 95Q181 220 137 321Q94 439 117 574Q144 801 20 1000Z',a,'opacity=".5"')+
      line('M103 534Q5 375-60 328M111 449Q202 367 248 229M85 642Q167 598 201 519M140 312Q73 236 39 128',a,9,.48)+
      Array.from({length:32},(_,i)=>autumnLeaf((i*71%295)-50,110+i*83%410,.65+i%4*.18,i*47,['#c68146','#bd623e','#c69a53',g][i%4])).join(''))+
    group('v-autumn-maple-right',line('M1660 685Q1490 531 1480 338Q1460 189 1325 93M1480 340Q1580 240 1660 191M1465 272Q1360 267 1280 211',a,12,.44)+
      Array.from({length:27},(_,i)=>autumnLeaf(1270+i*67%390,70+i*89%370,.6+i%4*.17,i*59,['#c68146','#bd623e','#c69a53',g][i%4])).join(''))+
    group('v-autumn-ground',path('M0 1000V953Q230 888 480 980T1100 990T1600 936V1000Z',g,'opacity=".2"')+
      Array.from({length:14},(_,i)=>autumnLeaf(i<7?i*43:1340+i%7*43,970+i%3*12,.3+i%3*.1,i*43,i%2?g:a)).join(''))+
    group('v-autumn-mist',path('M-150 960Q180 840 500 958T1150 970T1770 908',g,'opacity=".12"'));

  const midnightScene=()=>`<defs><radialGradient id="midnight-glow"><stop stop-color="${g}" stop-opacity=".2"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
    <linearGradient id="midnight-dome" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".65"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`+
    stars()+circle(1480,230,360,'url(#midnight-glow)')+
    group('v-midnight-trails',[100,133,171,209,245].map((r,i)=>`<path d="M${1470-r} 200A${r} ${r} 0 0 1 ${1470+r*.5} ${200-r*.866}" fill="none" stroke="${f}" stroke-width="${i%2?1:1.5}" opacity="${.1+i*.025}"/>`).join(''))+
    group('v-midnight-constellation',line('M65 307 146 225 232 302 186 404 98 439 65 307',a,1,.35)+
      [[65,307],[146,225],[232,302],[186,404],[98,439]].map(([x,y],i)=>circle(x,y,2+i%2,f,`class="v-midnight-beacon" style="--phase:-${i*1.3}s"`)).join(''))+
    `<g transform="translate(1430 315)">`+group('v-midnight-crescent',path('M15-46A49 49 0 1 0 46 17A45 45 0 0 1 15-46Z','#d2dce9','opacity=".8"'))+'</g>'+
    group('v-midnight-ridge',path('M0 1000V890L130 789 208 849 317 779 484 938 690 1000M1040 1000 1250 870 1370 894 1507 800 1600 883V1000Z',a,'opacity=".18"')+
      path('M0 1000V953Q190 890 470 978T1060 989T1600 925V1000Z',g,'opacity=".13"'))+
    `<g transform="translate(1390 795)">`+group('v-midnight-observatory',
      path('M-96 103V-3A96 96 0 0 1 96-3V103Z','url(#midnight-dome)',`stroke="${a}" stroke-opacity=".3"`)+
      path('M-3-98Q27-35 12 0H32Q41-45 18-96Z',b,'opacity=".85"')+
      path('M-112 2H111V19H-112ZM-109 103H111V117H-109Z',a,'opacity=".5"')+
      line('M-96 51H96M-74 26V95M72 26V95',a,1,.35)+
      rect(-12,60,24,43,b,'rx="12" opacity=".7"')+rect(-61,38,12,23,'#d8c59c','rx="5" opacity=".5"')+
      path('M-10-89 72-157 85-141 7-72Z',g,'opacity=".65"')+line('M70-158 86-140',f,3,.5)
    )+'</g>'+
    group('v-midnight-reflections',Array.from({length:10},(_,i)=>line(`M${1320+i%3*18} ${940+i*7}h${120-i*9}`,g,1,.2+i%3*.08)).join(''))+
    group('v-midnight-comet',line('M48 150 192 215','url(#star-tail)',2,.8));

  const crystal=(x,y,s,angle)=>`<g transform="translate(${x} ${y}) rotate(${angle}) scale(${s})">`+
    path('M0-124 33-78 28 31 0 58-29 29-33-78Z','url(#mystic-crystal)',`stroke="${g}" stroke-opacity=".45"`)+
    path('M0-124 2-63 28 31 0 58Z',g,'opacity=".2"')+path('M0-124-9-64-29 29 0 58Z',b,'opacity=".3"')+
    line('M0-124-9-64 2-63 33-78M-9-64 0 58M2-63 0 58M-33-78-9-64',f,1,.25)+'</g>';
  const mysticScene=()=>`<defs><linearGradient id="mystic-crystal" x2="1" y2="1"><stop stop-color="#bda3db"/><stop offset=".4" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <radialGradient id="mystic-vapor"><stop stop-color="${g}" stop-opacity=".28"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient></defs>`+
    circle(1470,790,350,'url(#mystic-vapor)')+circle(30,820,350,'url(#mystic-vapor)')+
    group('v-mystic-chart',line('M54 210 174 277 95 413 235 480M174 277 253 186',g,1,.4)+
      [[54,210],[174,277],[95,413],[235,480],[253,186]].map(([x,y],i)=>`<g transform="translate(${x} ${y})">${path('M0-7 2-2 7 0 2 2 0 7-2 2-7 0-2-2Z',f,`class="v-mystic-star" style="--phase:-${i*1.8}s"`)}</g>`).join(''))+
    `<g transform="translate(1410 280)">`+group('v-mystic-astrolabe',
      circle(0,0,132,'none',`stroke="${a}" opacity=".45"`)+circle(0,0,119,'none',`stroke="${g}" opacity=".3" stroke-dasharray="1 7"`)+
      Array.from({length:12},(_,i)=>line('M0-133V-148',g,i%3?1:2,.5,`transform="rotate(${i*30})"`)).join('')+
      path('M0-102 20-20 102 0 20 20 0 102-20 20-102 0-20-20Z',g,'opacity=".32"')+
      line('M0-102V102M-102 0H102M-62-62 62 62M-62 62 62-62',f,1,.35)+
      path('M0-35 22 0 0 35-22 0Z','url(#mystic-crystal)',`stroke="${g}" stroke-opacity=".7"`)+circle(0,0,5,f,'opacity=".65"')
    )+'</g>'+
    group('v-mystic-geode-left',crystal(60,833,1.25,-23)+crystal(155,918,1.6,7)+crystal(234,940,.9,32)+crystal(-10,950,.8,-38))+
    group('v-mystic-geode-right',crystal(1472,904,1.45,-15)+crystal(1570,837,1.4,15)+crystal(1399,979,.75,-35))+
    group('v-mystic-veil',line('M-100 930C48 704 277 856 215 681S19 671 85 553M1350 1060C1260 867 1512 811 1446 665S1582 544 1690 628',g,14,.1)+
      line('M-100 930C48 704 277 856 215 681S19 671 85 553M1350 1060C1260 867 1512 811 1446 665S1582 544 1690 628',g,1.5,.35))+
    caption(1305,475,'✧  AS ABOVE, SO BELOW  ✧',10,a,'opacity=".5" letter-spacing="1"');

  const magicalScene=()=>`<defs><linearGradient id="magic-pages" x2=".8" y2="1"><stop stop-color="#efdba2"/><stop offset="1" stop-color="${a}"/></linearGradient>
    <linearGradient id="magic-door" x2="0" y2="1"><stop stop-color="${g}" stop-opacity=".7"/><stop offset="1" stop-color="${b}" stop-opacity=".2"/></linearGradient>
    <radialGradient id="magic-radiance"><stop stop-color="#e5ca8b" stop-opacity=".25"/><stop offset="1" stop-color="#e5ca8b" stop-opacity="0"/></radialGradient></defs>`+
    circle(1430,510,350,'url(#magic-radiance)')+circle(85,760,330,'url(#magic-radiance)')+
    `<g transform="translate(1420 600)">`+group('v-magical-doorway',
      path('M-106 185V-150Q-107-260 0-315Q107-260 106-150V185Z','url(#magic-door)','opacity=".5"')+
      line('M-120 185V-150Q-121-269 0-335Q121-269 120-150V185M-105 185V-150Q-106-260 0-315Q106-260 105-150V185','#d9b679',3,.65)+
      line('M-88 140V-145Q-89-236 0-289Q89-236 88-145V140',f,1,.3)+
      [-120,120].map(x=>line(`M${x-8} -100h16M${x-8} 10h16M${x-10} 120h20`,'#d9b679',2,.55)).join('')+
      Array.from({length:6},(_,i)=>path(`M${-110-i*10} ${185+i*22}h${220+i*20}l12 12H${-122-i*10}Z`,g,`opacity="${.32-i*.03}"`)).join('')+
      group('v-magical-curtain',line('M-35-210Q-62-78-32 38M7-245Q35-120 4 80M43-203Q19-65 39 7',g,2,.6,'stroke-dasharray="11 25"'))+
      path('M0-232 7-210 30-203 7-195 0-173-7-195-30-203-7-210Z',f,'opacity=".7" class="v-magical-seal"')
    )+'</g>'+
    `<g transform="translate(100 822) rotate(-9)">`+group('v-magical-book',
      path('M-142-21Q-68-57 15-20Q86-69 174-40L160 91Q79 66 12 108Q-65 76-135 103Z',a,'opacity=".7"')+
      path('M-135-36Q-65-70 12-32Q92-80 169-55L154 75Q79 54 12 95Q-60 62-130 89Z','url(#magic-pages)','opacity=".75"')+
      path('M12-32Q22 22 12 95L154 75 169-55Q92-80 12-32Z',f,'opacity=".08"')+
      line('M12-32Q22 22 12 95M-132 96Q-60 66 12 103Q79 62 158 82',f,1,.4)+
      [0,1,2,3,4].map(i=>line(`M-112 ${-18+i*18}q46-18 103 7M39 ${-20+i*18}q46-23 105-17`,a,1.5,.5)).join('')+
      path('M45 84 40 123 54 113 67 124 69 76Z','#be7f73','opacity=".8"')
    )+'</g>'+
    group('v-magical-script',line('M118 762C297 704 160 560 81 590S12 502 194 397','#ddbf7d',1.5,.5,'stroke-dasharray="2 9"')+
      [[100,643],[214,692],[76,550],[194,397]].map(([x,y],i)=>`<g transform="translate(${x} ${y})">${path('M0-6 2-2 6 0 2 2 0 6-2 2-6 0-2-2Z','#f1d6a1',`class="v-magical-spark" style="--phase:-${i*1.7}s"`)}</g>`).join(''));

  const noirScene=()=>`<defs><linearGradient id="noir-beam" x2=".3" y2="1"><stop stop-color="${f}" stop-opacity=".19"/><stop offset="1" stop-color="${f}" stop-opacity="0"/></linearGradient>
    <radialGradient id="noir-lamp-glow"><stop stop-color="${f}" stop-opacity=".24"/><stop offset="1" stop-color="${f}" stop-opacity="0"/></radialGradient></defs>`+
    group('v-noir-shutters',Array.from({length:8},(_,i)=>path(`M-100 ${100+i*85} 500 ${370+i*85}v21L-100 ${121+i*85}Z`,f,'opacity=".045"')).join(''))+
    group('v-noir-window-frame',line('M-20 165H216V610H-20M108 165V610M-20 390H216',a,5,.4)+
      Array.from({length:11},(_,i)=>line(`M0 ${195+i*35}H214`,a,3,.28)).join(''))+
    group('v-noir-rainlight',Array.from({length:11},(_,i)=>line(`M${8+i*19} ${210+i*61%230}l-4 22`,f,1,.25)).join(''))+
    group('v-noir-street',path('M1230 1000 1320 676H1370V490H1420V676H1460V415H1510V710H1600V1000Z',a,'opacity=".16"')+
      line('M1260 1000 1470 870 1600 865M1290 1000 1490 905 1600 900M1330 1000 1510 940 1600 937M1390 1000 1540 969 1600 968',a,1,.3))+
    `<g transform="translate(1450 390)">`+group('v-noir-streetlamp',
      line('M0 0V557M-23 557H23',a,6,.7)+path('M-36-73H36L23-10H-23Z',f,'opacity=".45"')+
      path('M-41-73 0-102 41-73ZM-27-10H27V1H-27Z',a,'opacity=".85"')+
      line('M-36-73 23-10M36-73-23-10M-19-73-13-10M19-73 13-10',a,2,.75)+
      group('v-noir-lamplight',circle(0,-40,100,'url(#noir-lamp-glow)')+path('M-22-10H22L180 569H-180Z','url(#noir-beam)'))
    )+'</g>'+
    group('v-noir-reflection',line('M1340 971H1530M1365 985H1505M1400 997H1480',f,2,.18))+
    group('v-noir-night-fog',path('M1200 1040C1240 840 1570 933 1520 742S1370 624 1494 520',f,'opacity=".05"'));

  const sunsetScene=()=>`<defs><linearGradient id="sunset-disc" x2="0" y2="1"><stop stop-color="#ffdc9c"/><stop offset=".5" stop-color="#f6ac82"/><stop offset="1" stop-color="#d27d83"/></linearGradient>
    <radialGradient id="sunset-afterglow"><stop stop-color="#eaa386" stop-opacity=".3"/><stop offset="1" stop-color="#d487a3" stop-opacity="0"/></radialGradient>
    <linearGradient id="sunset-sea" x2="0" y2="1"><stop stop-color="${g}" stop-opacity=".25"/><stop offset="1" stop-color="${a}" stop-opacity=".14"/></linearGradient></defs>`+
    circle(1410,618,400,'url(#sunset-afterglow)')+
    group('v-sunset-horizon-sun',circle(1410,618,134,'url(#sunset-disc)','opacity=".85"')+
      line('M1275 658H1545M1285 677H1534M1305 696H1515',b,4,.3))+
    group('v-sunset-cloud-ribbons',path('M-70 250Q29 226 91 257Q159 235 257 274Q170 259 112 279Q28 258-70 277Z',g,'opacity=".15"')+
      path('M1250 191Q1315 166 1380 192Q1444 166 1550 214Q1480 201 1430 225Q1340 207 1250 220Z',g,'opacity=".16"'))+
    group('v-sunset-seascape',path('M0 767Q260 748 480 781T1000 778T1600 749V1000H0Z','url(#sunset-sea)')+
      line('M0 771Q260 752 480 785M1110 779Q1320 749 1600 752',g,1.5,.45)+
      path('M0 1000V744L77 729 110 793 190 813 208 881 320 908 385 1000Z',a,'opacity=".3"')+
      path('M0 1000V823L89 847 98 905 195 933 227 1000Z',b,'opacity=".3"')+
      line('M79 750 89 817 180 846 189 903 280 939',g,1,.25))+
    group('v-sunset-gilded-water',Array.from({length:15},(_,i)=>{const x=1320-(i*37%75),y=782+i*13,w=150+i%4*27;return line(`M${x} ${y}h${w}`,'#edc39c',i%3?1:2,.16+i%4*.07);}).join(''))+
    group('v-sunset-cypress',line('M41 745Q80 657 68 597M126 799Q141 739 122 696',a,4,.6)+
      path('M67 591C46 614 45 637 40 650C58 649 79 640 95 642C81 627 86 610 67 591ZM121 691C109 709 100 726 101 740Q123 731 143 741C135 721 137 709 121 691Z',a,'opacity=".65"'))+
    group('v-sunset-seabirds',line('M1322 335q12-10 24 0 12-10 24 0M1410 360q9-7 18 0 9-7 18 0',a,2,.5));

  const scaryScene=()=>`<defs><radialGradient id="scary-moon"><stop stop-color="#d8b3a7"/><stop offset=".8" stop-color="#9e6b6a"/><stop offset="1" stop-color="#643e4b"/></radialGradient>
    <radialGradient id="scary-candle"><stop stop-color="#e49d78" stop-opacity=".45"/><stop offset="1" stop-color="#c25f53" stop-opacity="0"/></radialGradient></defs>`+
    group('v-scary-bloodmoon',circle(1450,235,93,'url(#scary-moon)','opacity=".55"')+
      path('M1394 176q58-29 95 18M1433 267q32-18 67-4','none','stroke="#49333f" stroke-width="12" opacity=".1"'))+
    group('v-scary-boughs',path('M-20 1030Q65 838 47 627Q7 444 88 247L74 130 101 231 145 137 124 264 216 213 143 288 104 413 189 361 219 282 218 382 140 443 94 533 102 686 159 622 164 528 189 618 257 563 207 644 131 709 103 871 30 1030Z',a,'opacity=".5"')+
      path('M1650 770 1548 573 1534 428 1458 370 1400 273 1469 325 1430 210 1498 343 1551 389 1548 289 1600 180 1575 347 1602 450 1590 542 1650 610Z',a,'opacity=".44"'))+
    `<g transform="translate(1440 782)">`+group('v-scary-house',
      path('M-108 145-89-42-23-80 84-47 108 145Z',a,'opacity=".45"')+
      path('M-130-24-29-161 112-25-21-87Z',a,'opacity=".6"')+
      path('M-67-112-61-179-40-176-41-138Z',a,'opacity=".6"')+
      path('M-21-87-29-161 112-25Z',b,'opacity=".3"')+
      path('M-70 24-67-7-44-14-43 22ZM29 18 26-17 53-11 57 20ZM-22 145-23 82Q-1 49 20 78L24 145Z',b,'opacity=".8"')+
      group('v-scary-window-light',rect(-62,-4,13,18,'#d89f72','opacity=".55"')+circle(-55,4,53,'url(#scary-candle)'))+
      line('M-73 7-39 14M25 2 61 12M-98 53 93 44M-104 98 101 91',a,3,.4)
    )+'</g>'+
    group('v-scary-lantern',line('M186 370V509',a,1,.6)+circle(186,538,65,'url(#scary-candle)')+
      path('M170 520 202 515 199 554 176 559Z',g,'opacity=".35"')+path('M164 520 184 501 207 515ZM173 559 202 554 204 563 174 568Z',a,'opacity=".7"')+
      line('M184 519 187 556',a,2,.7))+
    group('v-scary-lowfog',path('M-120 961Q140 806 420 944T1000 978T1730 901V1060H-120Z',g,'opacity=".13"'))+
    group('v-scary-highfog',path('M-130 689Q83 582 291 700M1270 430Q1440 343 1690 431',g,'opacity=".1"'));

  const summerScene=()=>`<defs><linearGradient id="summer-lagoon" x2="0" y2="1"><stop stop-color="#5faeac" stop-opacity=".12"/><stop offset="1" stop-color="#3d9b9f" stop-opacity=".4"/></linearGradient>
    <radialGradient id="summer-sunlight"><stop stop-color="#f1d390" stop-opacity=".28"/><stop offset="1" stop-color="#f1d390" stop-opacity="0"/></radialGradient></defs>`+
    circle(1435,225,310,'url(#summer-sunlight)')+circle(1435,225,53,'#f0d28b','opacity=".75"')+
    group('v-summer-water-far',path('M-50 800Q170 746 420 796T950 807T1660 778V1050H-50Z','url(#summer-lagoon)')+
      line('M-50 803Q170 749 420 799T950 810T1660 781',g,1,.4))+
    group('v-summer-water-near',path('M-120 938Q90 813 360 915T950 969T1730 854V1070H-120Z',g,'opacity=".13"')+
      line('M-120 938Q90 813 360 915T950 969T1730 854',f,2,.25)+
      line('M1240 849q120-34 210-19M0 853q90-24 175-7M90 965q120-20 210 5',f,1.5,.3))+
    path('M-50 1000V924Q160 879 380 977T1020 1020T1660 957V1040Z','#c9af7e','opacity=".23"')+
    group('v-summer-palm',path('M50 1000Q150 798 123 529L141 523Q179 816 87 1000Z',a,'opacity=".5"')+
      line('M80 971h22M91 935l23 3M104 893l20 4M117 849l19 5M129 801l16 4M138 756l15 3M142 706l15 3M141 654l15 2M138 603l13 2',g,2,.4)+
      path('M130 535C74 415-33 422-68 493C11 453 74 476 130 535C110 402 207 367 277 422C190 412 156 460 130 535C194 425 285 477 298 539C218 490 176 503 130 535C54 479-11 532-13 602C42 543 83 548 130 535C187 511 232 566 214 638C191 577 169 563 130 535Z',g,'opacity=".53"')+
      line('M130 535Q63 462-34 479M130 535Q155 425 244 418M130 535Q223 470 282 524M130 535Q44 520 0 576',a,1,.4))+
    `<g transform="translate(1440 715)">`+group('v-summer-parasol',
      line('M0-20V250',a,3,.65)+path('M-140 0Q-104-108 0-119Q109-108 140 0Q99-18 70 2Q34-15 0 4Q-34-15-70 2Q-107-18-140 0Z','#ecd2aa','opacity=".8"')+
      path('M0-119Q-45-67-70 2Q-34-15 0 4Q3-65 0-119ZM0-119Q66-81 105-7Q122-10 140 0Q109-108 0-119Z','#d18e7e','opacity=".65"')+
      line('M0-119Q-45-67-70 2M0-119Q41-66 70 2M0-119V4',f,1,.3)+circle(0,-119,4,a,'opacity=".7"')
    )+'</g>'+
    group('v-summer-chair',line('M1354 982 1415 869 1434 877 1377 982M1370 982 1495 927M1401 895 1495 927 1470 980',a,3,.6)+
      path('M1415 869 1434 877 1400 940 1379 931Z',g,'opacity=".55"')+path('M1379 931 1400 940 1495 927 1476 919Z',g,'opacity=".45"'))+
    group('v-summer-sailboat',path('M1345 650V734H1402Z',f,'opacity=".45"')+path('M1340 670V734H1305Z',g,'opacity=".5"')+line('M1297 742H1410L1392 754H1318Z',a,3,.55));

  const scienceScene=()=>`<defs><linearGradient id="science-glass" x2="1" y2="1"><stop stop-color="${f}" stop-opacity=".16"/><stop offset=".45" stop-color="${g}" stop-opacity=".03"/><stop offset="1" stop-color="${g}" stop-opacity=".25"/></linearGradient>
    <linearGradient id="science-liquid" x2="1" y2="1"><stop stop-color="#7fcbc4" stop-opacity=".65"/><stop offset="1" stop-color="${a}" stop-opacity=".5"/></linearGradient>
    <radialGradient id="science-glow"><stop stop-color="${g}" stop-opacity=".22"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient></defs>`+
    circle(40,820,330,'url(#science-glow)')+circle(1480,440,330,'url(#science-glow)')+
    group('v-science-molecule',line('M91 239 155 202 219 239V313L155 350 91 313ZM100 248 155 216M207 247V305M155 337 102 307M91 239 48 212M219 313 260 338',a,2,.6)+
      caption(16,212,'HO',15,g)+caption(259,352,'OH',15,g)+circle(155,276,24,'none',`stroke="${g}" opacity=".24"`))+
    `<g transform="translate(90 844) rotate(-7)">`+group('v-science-vessel',
      path('M-28-194H28V-111L106 48Q115 71 90 79H-90Q-115 71-106 48L-28-111Z','url(#science-glass)',`stroke="${a}" stroke-width="1.5" stroke-opacity=".65"`)+
      path('M-68-18Q0-7 68-18L99 48Q108 65 88 69H-88Q-108 65-99 48Z','url(#science-liquid)')+
      `<ellipse cx="0" cy="-18" rx="68" ry="8" fill="${g}" opacity=".45"/>`+
      line('M-18-184V-108L-83 45M-34-194H34M-28-184H28',f,2,.4)+
      [-50,-25,0,25].map(y=>line(`M55 ${y}h${y%2?11:17}`,a,1,.5)).join('')+
      [[-39,28],[22,40],[4,1],[-18,49]].map(([x,y],i)=>`<g transform="translate(${x} ${y})">${circle(0,0,3+i,g,`class="v-science-bubble" style="--phase:-${i*1.3}s"`)}</g>`).join('')
    )+'</g>'+
    group('v-science-helix',Array.from({length:21},(_,i)=>{const y=160+i*23,t=i*.48,x=1440+Math.sin(t)*78,xx=2880-x;return line(`M${x} ${y}H${xx}`,i%2?g:a,2,.28)+circle(x,y,4.5,g,`opacity="${.45+Math.cos(t)*.25}"`)+circle(xx,y,4.5,a,`opacity="${.45-Math.cos(t)*.25}"`);}).join('')+
      line(Array.from({length:81},(_,i)=>`${i?'L':'M'}${1440+Math.sin(i*.12)*78} ${160+i*5.75}`).join(''),g,2,.55)+
      line(Array.from({length:81},(_,i)=>`${i?'L':'M'}${1440-Math.sin(i*.12)*78} ${160+i*5.75}`).join(''),a,2,.5))+
    `<g transform="translate(1440 883)">`+group('v-science-petri',
      `<ellipse rx="127" ry="53" fill="url(#science-glass)" stroke="${a}" stroke-opacity=".5"/><ellipse cy="-14" rx="127" ry="53" fill="url(#science-glass)" stroke="${f}" stroke-opacity=".3"/><ellipse cy="-10" rx="112" ry="42" fill="url(#science-liquid)" opacity=".3"/>`+
      [[-65,-14,12],[-25,4,9],[21,-29,13],[62,3,10],[10,13,7]].map(([x,y,r])=>circle(x,y,r,g,'opacity=".35"')+circle(x-3,y-4,2,f,'opacity=".4"')).join('')+
      line('M-103-40Q-42-80 51-52',f,2,.35)
    )+'</g>';

  const cityScene=()=>`<defs><linearGradient id="city-facade" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".5"/><stop offset="1" stop-color="${a}" stop-opacity=".2"/></linearGradient>
    <linearGradient id="city-river" x2="0" y2="1"><stop stop-color="${g}" stop-opacity=".05"/><stop offset="1" stop-color="${g}" stop-opacity=".22"/></linearGradient></defs>`+
    group('v-city-distant-new',Array.from({length:17},(_,i)=>{const x=i*102-30,h=50+i*37%130;return rect(x,935-h,74,h,a,'opacity=".12"')+line(`M${x+8} ${935-h+15}v${h-20}`,g,1,.15);}).join(''))+
    group('v-city-architecture',
      path('M-25 960V439L91 404 159 447V960ZM1240 960V560L1325 523 1390 554V960ZM1416 960V385L1480 308 1543 385V960Z','url(#city-facade)',`stroke="${a}" stroke-opacity=".25"`)+
      path('M91 404 159 447V960H91ZM1325 523 1390 554V960H1325ZM1480 308 1543 385V960H1480Z',b,'opacity=".2"')+
      line('M91 404V960M1325 523V960M1480 308V960M1480 308V265',g,1,.4)+
      Array.from({length:16},(_,i)=>line(`M-20 ${465+i*30}H155M1420 ${425+i*32}H1540`,a,1,.3)).join('')+
      rect(188,634,79,326,'url(#city-facade)',`stroke="${a}" stroke-opacity=".25"`)+path('M181 634H273L261 616H193Z',a,'opacity=".4"')+
      rect(16,377,35,36,a,'opacity=".3"')+line('M34 377V343M17 357H52',g,1,.4)+
      [0,1,2,3,4,5].map(i=>group('v-city-office-lights',Array.from({length:8},(_,j)=>rect(i<3?4+i*24:1430+(i-3)*27,i<3?482+j*48:444+j*51,7,13,j%3===i%3?'#daca9f':g,`opacity="${j%3===i%3?.55:.15}"`)).join(''),`style="--phase:-${i*1.91}s"`)).join('')+
      Array.from({length:8},(_,i)=>line(`M199 ${661+i*34}h54M1253 ${603+i*36}h57`,g,2,.25)).join(''))+
    path('M0 966Q390 921 730 970T1600 956V1000H0Z','url(#city-river)')+
    group('v-city-bridge',line('M1040 981H1620M1280 981V851M1540 981V851M1040 971Q1280 949 1280 860Q1410 996 1540 860Q1570 944 1630 956',a,2,.6)+
      Array.from({length:13},(_,i)=>{const x=1090+i*39,y=x<1280?963-(x-1090)*.31:x<1540?885+Math.sin((x-1280)/260*Math.PI)*58:930;return line(`M${x} ${y}V980`,a,1,.35);}).join(''))+
    group('v-city-metro-new',rect(-155,953,130,15,g,'rx="6" opacity=".7"')+Array.from({length:7},(_,i)=>rect(-143+i*15,957,9,5,f,'rx="1" opacity=".55"')).join(''))+
    group('v-city-flight-new',line('M-30 193H4M-14 181V206',a,2,.5)+circle(4,193,2,g,'opacity=".7"'));

  Object.assign(scenes,{
    paper:()=>group('v-paper-sheet',rect(35,125,220,320,g,'rx="6" opacity=".32"')+line('M60 180H210M60 215H190M60 250H215M60 285H165',a,2,.38))+group('v-paper-fold',path('M1330 690 1550 760 1380 910 1400 800Z',g,'opacity=".42"')+line('M1330 690 1400 800 1550 760',a,2,.5))+group('v-pencil',line('M85 820 200 630',a,6,.5)+path('M82 825 84 807 94 814Z',a,'opacity=".6"')),
    sage:sageScene,
    ocean:()=>group('v-tide-far',path('M-300 780Q0 690 300 790T900 790T1500 790T2100 790V1100H-300Z',a,'opacity=".26"'))+group('v-tide-near',path('M-300 875Q0 760 300 875T900 875T1500 875T2100 875V1100H-300Z',g,'opacity=".4"')+line('M-300 880Q0 765 300 880T900 880T1500 880T2100 880',f,2,.28))+group('v-sail',path('M1380 610V750H1470Z',g,'opacity=".5"')+line('M1380 610V760M1350 760H1490L1470 777H1370Z',a,3,.5)),
    rose:()=>group('v-rose-plant',
      line('M1490 1030C1370 860 1305 635 1380 365',a,4,.6)+
      path('M1348 645C1290 626 1220 565 1240 520C1304 525 1355 572 1348 645ZM1375 786C1410 720 1486 688 1535 716C1501 770 1435 804 1375 786Z',g,'opacity=".55"')+
      line('M1348 645 1257 540M1375 786 1513 727M1309 584l-32-4m23-13-6-25M1417 760l7-29m15 19 28 6',a,1.5,.5)+
      path('M1353 560 1372 542 1358 580M1374 775 1357 760 1368 793',a,'opacity=".5"')+
      path('M1380 387Q1336 358 1323 325Q1363 330 1380 351Q1405 324 1444 328Q1429 364 1380 387Z',a,'opacity=".55"')+
      `<g transform="translate(1380 270)">`+group('v-rose-bloom',
        path('M-10-104C-55-128-101-91-105-56C-143-44-139 13-107 39C-119 78-70 107-35 99C-8 130 49 111 66 84C113 90 141 50 122 15C146-28 114-69 80-74C64-114 24-124-10-104Z','url(#rose-petals)',`stroke="${a}" stroke-width="2" opacity=".82"`)+
        path('M-10-104C-64-63-96-38-73 15C-110-5-125-28-105-56C-101-91-55-128-10-104Z',g,'opacity=".55"')+
        path('M80-74C109-27 84 24 40 42C94 50 121 25 122 15C146-28 114-69 80-74Z',g,'opacity=".4"')+
        path('M-107 39C-55 28-24 49-20 91C4 71 29 58 66 84C49 111-8 130-35 99C-70 107-119 78-107 39Z',a,'opacity=".25"')+
        line('M-10-104C-57-67-86-38-73 15C-54 52-12 54 7 28M80-74C34-89-10-72-26-42M122 15C88 37 65 41 40 42C61 4 59-33 28-51M-107 39C-64 22-21 41-20 91M66 84C29 57 0 65-20 91',a,2.5,.65)+
        path('M-26-42C-3-65 39-52 48-26C62 5 32 38 7 28C-15 48-52 28-54 5C-58-17-44-34-26-42Z',g,'opacity=".56"')+
        line('M-26-42C-4-34 10-25 9-4C35-19 41-35 28-51M-54 5C-28-11-4-2 7 28M48-26C51 0 32 19 9 16C-12 18-20 3-14-10C-8-21 10-23 19-12C25-4 20 6 11 7',a,2.5,.85)
      )+'</g>', 'opacity=".82"'),
    futuristic:()=>group('v-circuit',line('M0 210H100L165 275V480H60M1600 500H1490L1430 560V800H1570M0 910H150L230 990',a,2,.5)+[ [100,210],[60,480],[1490,500],[1570,800] ].map(([x,y])=>circle(x,y,5,g,'class="v-spark"')).join(''))+orbit(1400,210,circle(0,0,115,'none',`stroke="${a}" stroke-width="3" stroke-dasharray="100 40 6 30" opacity=".6"`),'v-orbit',22)+group('v-scanline',rect(0,0,1600,2,g,'opacity=".22"')),
    mystic:mysticScene,
    magical:magicalScene,
    rustic:()=>rect(0,0,1600,1000,'url(#wood-grain)','opacity=".35"')+group('v-rustic-light',path('M1250 0H1430L1600 760V1000L1350 750Z',g,'opacity=".26"')+line('M1330 0 1600 770',f,8,.1))+group('v-hanging-herbs',line('M90 0V170M135 0V220M180 0V145',a,3,.5)+[90,135,180].map((x,i)=>path(`M${x} ${140+i*18}q-60 30-10 90q60-50 10-90`,g,'opacity=".35"')).join('')),
    solar:solarScene,
    spring:()=>flowerBed('left')+flowerBed('right')+group('v-butterfly-flight',`<g transform="translate(1350 330)"><g class="v-butterfly-wings">${path('M0 0C-60-70-90 20 0 10C70-80 100 30 0 0',g,'opacity=".65"')}</g></g>`)+hills(),
    summer:summerScene,
    autumn:autumnScene,
    winter:()=>path('M0 1000 180 660 340 870 500 730 710 1000M950 1000 1180 730 1370 850 1510 630 1600 780V1000Z',g,'opacity=".42"')+path('M110 790 180 660 260 785 195 750 170 715 150 780M1455 730 1510 630 1575 735 1530 700 1500 670Z',f,'opacity=".5"')+group('v-winter-mist',path('M-150 925Q200 790 550 925T1250 925T1900 925V1100H-150Z',a,'opacity=".12"')),
    midnight:midnightScene,
    aurora:()=>stars()+group('v-aurora-band v-aurora-one',path('M-200 160C150-120 350 500 750 190S1350-70 1800 210L1800 0H-200Z','url(#boreal-green)','opacity=".65"'))+group('v-aurora-band v-aurora-two',path('M-180 50C200 450 430-180 850 170S1440 480 1770 80L1800-80H-180Z','url(#boreal-purple)','opacity=".48"'))+group('v-aurora-rays',Array.from({length:38},(_,i)=>line(`M${i*47-50} ${100+(i*43%160)}v${130+i%5*32}`,'#82efb2',1,.16)).join(''))+peak,
    cosmic:()=>stars()+dust('v-cosmic-dust',18)+group('v-nebula',path('M1130 0Q1320 280 1600 90V380Q1340 150 1190 450Z','url(#boreal-purple)','opacity=".28"'))+orbit(1370,300,circle(0,0,110,'url(#planet-colors)','opacity=".7"')+`<ellipse rx="185" ry="43" fill="none" stroke="${g}" stroke-width="16" opacity=".5" transform="rotate(-25)"/>`,'v-planet-roll',32),
    noir:noirScene,
    amber:()=>group('v-resin',path('M1260 80Q1540 0 1560 260T1390 540Q1200 530 1280 310T1260 80Z','url(#amber-resin)','opacity=".6"')+line('M1340 110Q1490 70 1500 230',f,4,.32))+group('v-amber-lines',Array.from({length:6},(_,i)=>line(`M0 ${700+i*45}Q180 ${530+i*30} 330 ${800+i*30}`,g,2,.28)).join('')),
    ice:()=>group('v-icebergs',path('M0 1000 100 670 170 800 230 535 315 790 370 1000M1260 1000 1320 810 1390 590 1460 780 1540 460 1600 710V1000Z','url(#ice-facet)','opacity=".65"')+line('M100 670 130 1000M230 535 250 1000M1390 590 1390 1000M1540 460 1510 1000',f,2,.5))+group('v-ice-shine',line('M50 900 290 650M1320 960 1570 590',f,12,.2))+[ [140,235,1],[1440,250,.8],[1200,95,.4] ].map(([x,y,s])=>`<g transform="translate(${x} ${y}) scale(${s})"><g class="v-snow-crystal">${[0,60,120].map(n=>line('M0-55V55M0-35-15-45M0-35 15-45M0 35-15 45M0 35 15 45',g,2,.6,`transform="rotate(${n})"`)).join('')}</g></g>`).join(''),
    flowers:()=>flowerBed('left')+flowerBed('right')+group('v-floral-arch',line('M-80 150Q150-15 370 80M1240 60Q1470-20 1670 240',a,3,.42)+[[20,120,1.2],[120,75,.9],[240,60,1.4],[1380,70,1.1],[1480,110,1.5],[1570,190,.9]].map(([x,y,s])=>group('v-bloom-head',flower(x,y,s),'style="--phase:-'+x/400+'s"')).join(''))+dust('v-pollen',16),
    fantasy:fantasyScene,
    code:codeScene,
    cloudy:()=>group('v-cloud-bank-one',cloud(-100,100,1.8)+cloud(1170,630,2.2),'opacity=".38"')+group('v-cloud-bank-two',cloud(1240,80,1.7)+cloud(-90,720,1.8),'opacity=".25"')+group('v-cloud-sun',circle(1390,170,80,g,'opacity=".3"')),
    scary:scaryScene,
    colorful:()=>group('v-memphis-drift',path('M0 100Q160-50 290 130L150 300Z','#e591ad','opacity=".42"')+path('M1310 700Q1530 610 1640 850L1470 1040 1300 880Z','#61bcb1','opacity=".38"'))+orbit(1410,240,circle(0,0,110,'none','stroke="#efb75e" stroke-width="35" stroke-dasharray="200 45" opacity=".5"'),'v-color-wheel',36)+group('v-memphis-zig',line('M40 700 90 650 140 700 190 650 240 700','#8b9fe8',11,.55)+line('M1390 480 1440 430 1490 480 1540 430 1590 480','#d58cc1',9,.55))+group('v-confetti',Array.from({length:14},(_,i)=>rect((i*397+33)%1600,(i*223+65)%1000,6+i%3*3,16,['#e591ad','#efb75e','#61bcb1','#8b9fe8'][i%4],`rx="2" opacity=".55" class="v-confetti-piece" style="--phase:-${i*.73}s"`)).join('')),
    math:mathScene,
    library:()=>group('v-library-shelves',line('M0 350H260M1340 430H1600M0 820H235M1330 900H1600',a,10,.45)+Array.from({length:22},(_,i)=>{const side=i<11,x=side?8+(i%11)*23:1345+(i%11)*23,y=side?350:430,h=80+i*29%100;return rect(x,y-h,17,h,i%2?a:g,`rx="2" opacity=".42"`)+line(`M${x+4} ${y-20}h9M${x+4} ${y-h+12}h9`,f,1,.3);}).join(''))+group('v-library-lamp',path('M40 610H170L210 690H0Z',g,'opacity=".7"')+line('M105 690V815',a,5,.5))+group('v-library-light',path('M0 690H210L320 1000H-80Z',g,'opacity=".13"'))+group('v-book-page',path('M1340 805q65-80 150-30l60 100q-85-50-150 30Z',g,'opacity=".45"')+line('M1400 905 1340 805M1360 810q60-40 110-15',a,2,.6))+dust('v-library-dust',14),
    office:()=>group('v-office-window',rect(1320,115,250,350,g,'rx="6" opacity=".2"')+line('M1320 290H1570M1445 115V465',a,5,.35))+group('v-office-cloud',cloud(1350,200,.6),'opacity=".3"')+group('v-office-desk',line('M0 870H285M25 870V1000M250 870V1000M1300 900H1600',a,7,.45)+rect(35,690,205,135,g,'rx="9" opacity=".28"')+line('M138 825V865',a,6,.6))+group('v-office-chart',line('M60 790 100 750 135 765 185 715 220 740',a,3,.7,'pathLength="1"'))+group('v-coffee',path('M1385 800H1460L1450 885H1400Z',g,'opacity=".5"')+line('M1460 815q50 0 15 40',a,4,.6))+group('v-coffee-steam',line('M1410 780q-25-25 0-50t0-50M1440 775q-20-20 0-45',g,3,.55)),
    science:scienceScene,
    nature:()=>hills()+group('v-nature-back',[0,1,2,3,4,5,6,7,8,9,10].map(i=>pine(i*170-50,810+(i%3)*25,.9+(i%4)*.2)).join(''),'opacity=".3"')+group('v-nature-front',pine(70,610,1.6)+pine(1500,650,1.6),'opacity=".43"')+group('v-bird-flight',line('M50 280q20-20 40 0 20-20 40 0M110 310q15-15 30 0 15-15 30 0',a,3,.55))+dust('v-fireflies',16,'#b6c875'),
    city:cityScene,
    rainbow:rainbowScene,
    lunar:lunarScene,
    sakura:()=>hills()+group('v-sakura-tree-left',path('M0 1000Q160 750 130 460Q150 220 350 60M130 465Q-10 280-100 250M170 300Q280 230 420 230M100 720Q240 600 320 550','none',`stroke="${a}" stroke-width="19" opacity=".48"`)+Array.from({length:52},(_,i)=>{const x=(i*67%460)-65,y=55+(i*89%400);return flower(x,y,.6+(i%4)*.22,i%3?'#e69dbd':g);}).join(''),'opacity=".65"')+group('v-sakura-tree-right',path('M1600 1000Q1420 790 1490 500Q1480 340 1320 210M1490 510Q1610 390 1650 300M1450 390Q1360 430 1280 400','none',`stroke="${a}" stroke-width="16" opacity=".45"`)+Array.from({length:39},(_,i)=>flower(1270+(i*71%400),210+(i*59%320),.6+(i%4)*.2,i%3?'#e69dbd':g)).join(''),'opacity=".6"')+group('v-sakura-petal-bed',path('M0 970Q220 910 420 990M1220 990Q1430 920 1600 975','none','stroke="#e69dbd" stroke-width="13" opacity=".3"')),
    fire:()=>group('v-fire-hearth',path('M0 1000V920Q180 840 340 960T750 985T1200 950T1600 920V1000Z',a,'opacity=".25"'))+Array.from({length:13},(_,i)=>{const x=30+i*128,h=80+(i*47%150);return `<g transform="translate(${x} 1000)"><g class="v-flame" style="--phase:-${i*.37}s">${path(`M-50 0Q-70-${h*.5}-15-${h}Q25-${h*.6} 15-${h*1.25}Q105-${h*.55} 50 0Z`,'url(#flame-color)','opacity=".65"')}${path(`M-15 0Q-35-${h*.35} 5-${h*.7}Q45-${h*.3} 25 0Z`,'#ffce70','opacity=".7"')}</g></g>`;}).join('')+dust('v-fire-embers',22,'#ffb15c'),
    magma:magmaScene,
    storm:()=>{
      const strikes=[
        {id:'near',x:1400,y:175,duration:22,phase:0,
          trunk:'M1414 104 1401 142 1410 156 1380 185 1387 217 1360 241 1366 260 1339 292 1347 311 1322 348 1329 361 1305 400 1310 415 1288 460 1293 475 1272 523 1278 540 1263 574',
          branches:'M1380 185 1355 198 1358 222 1329 232 1317 259M1339 292 1370 312 1362 338 1381 352 1374 386M1305 400 1280 406 1267 429 1248 438'},
        {id:'far',x:165,y:170,duration:31,phase:-18,
          trunk:'M173 120 164 161 179 177 149 209 156 232 133 259 141 277 120 306 130 323 105 358 112 380 95 399 103 420 89 457',
          branches:'M149 209 119 215 108 245M120 306 149 322 141 349 153 369'}
      ];
      return `<defs><radialGradient id="storm-cloud-light"><stop stop-color="#c0ddff" stop-opacity=".6"/><stop offset=".4" stop-color="#b3cfff" stop-opacity=".2"/><stop offset="1" stop-color="#a9c7f5" stop-opacity="0"/></radialGradient></defs>`+
        group('art-storm-back',cloud(100,50,2.4)+cloud(1000,60,2.9),'opacity=".16"')+
        strikes.map(s=>group('storm-strike',
          circle(s.x,s.y,290,'url(#storm-cloud-light)','class="storm-cloud-flash"')+
          group('storm-return',
            line(s.trunk,'#badbff',10,.08)+line(s.trunk,'#c3e4ff',4,.24)+
            line(s.branches,'#bddfff',3,.14)+line(s.branches,'#d4eaff',.8,.7)+
            line(s.trunk,'#edf7ff',1.5,.95))+
          line(s.trunk,'#c6e4ff',.9,.75,'pathLength="1" class="storm-leader"'),
          `data-strike="${s.id}" style="--storm-duration:${s.duration}s;--storm-phase:${s.phase}s"`
        )).join('')+
        group('art-storm-front',cloud(-120,-40,3)+cloud(400,-70,3.3)+cloud(1000,-20,3),'opacity=".28"')+
        group('v-storm-puddles',[ [100,940,60],[1450,920,85],[1210,990,50] ].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="7" fill="none" stroke="${a}" opacity=".4" class="v-rain-ripple"/>`).join(''));
    },
    sunset:sunsetScene,
  });
  const extraDefs=`<linearGradient id="rose-petals" x1="0" y1="0" x2=".6" y2="1"><stop stop-color="${g}"/><stop offset=".55" stop-color="${a}"/><stop offset="1" stop-color="${g}"/></linearGradient><g id="scene-blossom">${[0,72,144,216,288].map(n=>`<ellipse cx="0" cy="-14" rx="10" ry="15" fill="currentColor" transform="rotate(${n})"/>`).join('')}${circle(0,0,5,a)}</g><linearGradient id="boreal-green" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#5eebad" stop-opacity=".9"/><stop offset=".45" stop-color="#3cbaa7" stop-opacity=".4"/><stop offset="1" stop-color="#478eb6" stop-opacity="0"/></linearGradient><linearGradient id="boreal-purple" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#ad8fe8" stop-opacity=".8"/><stop offset=".5" stop-color="#6a92d3" stop-opacity=".3"/><stop offset="1" stop-color="#6a92d3" stop-opacity="0"/></linearGradient><radialGradient id="magic-orb"><stop stop-color="#fff0bc"/><stop offset=".4" stop-color="#dfbd75"/><stop offset="1" stop-color="#b17bce" stop-opacity=".1"/></radialGradient><linearGradient id="ice-facet"><stop stop-color="${g}"/><stop offset=".5" stop-color="${f}" stop-opacity=".3"/><stop offset="1" stop-color="${a}"/></linearGradient><linearGradient id="amber-resin"><stop stop-color="#f2ce7c"/><stop offset=".5" stop-color="#bb7627"/><stop offset="1" stop-color="#eeb65b"/></linearGradient><linearGradient id="flame-color" x2="0" y2="1"><stop stop-color="#ffb955"/><stop offset=".5" stop-color="#ed682d"/><stop offset="1" stop-color="#9f3026" stop-opacity=".2"/></linearGradient><linearGradient id="lava-color"><stop stop-color="#b52922"/><stop offset=".4" stop-color="#f57732"/><stop offset=".7" stop-color="#d13d27"/><stop offset="1" stop-color="#ff9f40"/></linearGradient>`;

  const defs=`<defs><linearGradient id="sun-glow"><stop stop-color="#ffe2a0"/><stop offset="1" stop-color="${a}"/></linearGradient><linearGradient id="planet-colors" x2="1" y2="1"><stop stop-color="${g}"/><stop offset="1" stop-color="${a}"/></linearGradient><linearGradient id="aurora-colors"><stop stop-color="${a}"/><stop offset=".5" stop-color="${g}"/><stop offset="1" stop-color="#8c7bce"/></linearGradient><linearGradient id="sunset-colors" x2="0" y2="1"><stop stop-color="#f9c590"/><stop offset="1" stop-color="#cf6a95"/></linearGradient><linearGradient id="moon-colors"><stop stop-color="#f0f3ff"/><stop offset="1" stop-color="#8995af"/></linearGradient><linearGradient id="star-tail"><stop stop-color="${f}" stop-opacity="0"/><stop offset="1" stop-color="${f}"/></linearGradient><pattern id="wood-grain" width="260" height="200" patternUnits="userSpaceOnUse"><path d="M0 0H260M0 198H260M10 70Q160 20 250 90M10 90Q160 60 250 110M20 130Q130 180 240 140" fill="none" stroke="${a}" stroke-opacity=".25"/></pattern></defs>`;
  globalThis.GoogleRefreshedScenes={render:id=>`<svg viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true" data-scene="${Object.hasOwn(scenes,id)?id:'paper'}">${defs}<defs>${extraDefs}</defs>${(scenes[id]||scenes.paper)()}</svg>`};
})();
