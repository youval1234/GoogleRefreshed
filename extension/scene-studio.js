// Original studio, culture and atmospheric scenes. Geometry is mounted only on selection.
(() => {
  'use strict';
  (globalThis.GoogleRefreshedScenePacks ??= []).push(({a,g,f,b,path,circle,rect,group,line,caption}) => {
    const scenes={};
    const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
    const placed=(x,y,body,extra='')=>`<g transform="translate(${x} ${y})" ${extra}>${body}</g>`;
    const glow=(id,color=g)=>`<radialGradient id="${id}"><stop stop-color="${color}" stop-opacity=".26"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
    const book=(x,y,w,h,i)=>placed(x,y,
      rect(0,-h,w,h,[a,g,'#b58f6c','#78968c','#a28b9e'][i%5],`rx="2" opacity="${.36+i%3*.1}"`)+
      line(`M3 ${-h+7}h${w-6}M3-9h${w-6}`,f,1,.3)+
      line(`M${w-3} ${-h+3}V-3`,b,1,.25)+
      rect(w*.3,-h*.7,Math.max(2,w*.4),h*.28,f,'rx="1" opacity=".1"'),i%7===0?'transform-origin="bottom"':'');
    scenes.library=()=>`<defs>${glow('s-library-glow','#d9b373')}<linearGradient id="s-library-wood" x2="1" y2=".15"><stop stop-color="${a}" stop-opacity=".42"/><stop offset=".5" stop-color="${b}" stop-opacity=".25"/><stop offset="1" stop-color="${g}" stop-opacity=".32"/></linearGradient><linearGradient id="s-library-chair" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".7"/><stop offset="1" stop-color="${a}" stop-opacity=".48"/></linearGradient><linearGradient id="s-library-beam" x2=".2" y2="1"><stop stop-color="#e7c58e" stop-opacity=".19"/><stop offset="1" stop-color="#e7c58e" stop-opacity="0"/></linearGradient></defs>`+
      circle(1460,660,340,'url(#s-library-glow)')+
      group('s-library-case',
        path('M-25 998V284Q-25 141 128 127Q280 141 280 284V998Z','url(#s-library-wood)',`stroke="${a}" stroke-opacity=".4" stroke-width="2"`)+
        path('M-5 967V289Q-5 162 128 148Q259 162 259 289V967Z',b,'opacity=".22"')+
        line('M-15 293Q128 122 269 293M-11 980H269M-11 970H269',f,1,.18)+
        [373,554,735,916].map((y,row)=>
          rect(-9,y,274,10,a,'opacity=".5"')+line(`M-9 ${y}H264`,f,1,.27)+
          Array.from({length:10},(_,i)=>book(-3+i*26,y,17+i%3*2,65+(i*37+row*23)%75,i+row*3)).join('')
        ).join('')+
        line('M4 294V966M250 294V966',g,2,.25)+
        path('M85 248Q127 205 170 248Q127 233 85 248Z',a,'opacity=".45"')+
        circle(128,220,5,g,'opacity=".65"'))+
      group('s-library-window',
        path('M1340 510V268Q1340 172 1425 145Q1510 172 1510 268V510Z',g,'opacity=".12"')+
        line('M1340 510V268Q1340 172 1425 145Q1510 172 1510 268V510ZM1425 158V510M1343 305H1507',a,4,.4)+
        line('M1353 491V270Q1353 190 1425 164Q1496 190 1496 270V491',f,1,.15)+
        path('M1357 491 1389 389 1418 491M1448 491 1474 377 1497 491',a,'opacity=".12"'))+
      placed(1425,834,group('s-library-chair',
        path('M-98 78-113-85Q-111-139-73-148L-60-92Q0-126 60-92L73-148Q111-139 113-85L98 78Z','url(#s-library-chair)')+
        path('M-60-92Q0-126 60-92L70 29Q0 6-70 29Z',g,'opacity=".22"')+
        rect(-79,23,158,43,'url(#s-library-chair)','rx="14"')+
        path('M-113-50Q-133-60-130-10L-111 66H-83L-94-18Q-94-48-113-50ZM113-50Q133-60 130-10L111 66H83L94-18Q94-48 113-50Z',a,'opacity=".5"')+
        line('M-76 74-82 136M76 74 82 136',a,7,.65)+
        line('M-54-80Q0-104 54-80M-63 13Q0-3 63 13',f,1,.2)+
        [-34,0,34].map(x=>circle(x,-56,2.5,a,'opacity=".55"')).join('')+
        path('M-40 8Q-5-9 20 8Q43-6 75 7L67 30Q43 20 19 34Q-7 22-35 33Z','#c9b797','opacity=".7"')+
        group('s-library-page',path('M20 8Q38-16 64-20L67 30Q43 20 19 34Z',f,'opacity=".25"')+line('M20 8 19 34',a,1,.45))
      ))+
      group('s-library-lamp',
        line('M1285 966V600',a,4,.65)+ellipse(1285,970,37,6,a,'opacity=".4"')+
        path('M1246 552H1324L1350 622H1220Z',g,'opacity=".65"')+
        line('M1246 552H1324M1220 622H1350',f,1,.25)+
        group('s-library-lamplight',path('M1220 622H1350L1490 1020H1070Z','url(#s-library-beam)')+ellipse(1285,621,61,6,'#e5c18b','opacity=".32"')))+
      group('s-library-dust',[[1247,677],[1368,748],[1295,829],[1440,915],[1198,944],[1409,608]].map(([x,y],i)=>circle(x,y,1.4,'#e4c78f',`class="s-library-mote" style="--s-phase:-${i*2.1}s" opacity=".5"`)).join(''));
    scenes.sunset=()=>`<defs>${glow('s-sunset-haze','#e9ac8c')}<linearGradient id="s-sunset-sun" x2="0" y2="1"><stop stop-color="#ffe5ad"/><stop offset=".53" stop-color="#eeb491"/><stop offset="1" stop-color="#cf8293"/></linearGradient><linearGradient id="s-sunset-water" x2="0" y2="1"><stop stop-color="${g}" stop-opacity=".24"/><stop offset="1" stop-color="${a}" stop-opacity=".15"/></linearGradient><clipPath id="s-sunset-sky">${rect(0,0,1600,790,b)}</clipPath><linearGradient id="s-sunset-stone" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".62"/><stop offset="1" stop-color="${a}" stop-opacity=".32"/></linearGradient></defs>`+
      circle(1415,714,395,'url(#s-sunset-haze)')+
      `<g clip-path="url(#s-sunset-sky)">`+group('s-sunset-sundrift',circle(1415,747,154,'url(#s-sunset-sun)','opacity=".87"'))+'</g>'+
      group('s-sunset-highcloud',
        path('M-40 237C20 215 48 233 91 235C148 199 215 230 275 246C192 236 158 263 114 257C55 249 10 260-40 259Z',g,'opacity=".17"')+
        path('M1250 251C1302 228 1361 242 1411 246C1475 218 1530 241 1640 270C1528 247 1495 279 1415 268C1354 260 1310 266 1250 270Z',g,'opacity=".15"')+
        line('M42 242q79-23 148 1M1350 254q75-16 154 3',f,1,.12))+
      group('s-sunset-water',path('M0 789Q270 769 540 801T1080 803T1600 778V1000H0Z','url(#s-sunset-water)')+
        line('M0 792Q270 772 540 804T1080 806T1600 781',g,1,.42))+
      group('s-sunset-coast',
        path('M-30 681 51 668 94 704 114 761 176 781 188 846 252 873 294 947 400 1000H-30Z','url(#s-sunset-stone)')+
        path('M51 668 94 704 114 761 176 781 188 846 252 873 294 947 400 1000H315L228 965 200 905 136 875 122 814 69 788 53 729Z',a,'opacity=".24"')+
        path('M-30 750 54 744 70 812 125 833 137 895 217 930 247 1000H-30Z',b,'opacity=".2"')+
        line('M-15 700 48 689 74 715 88 774 148 798 161 857 225 885 268 958M-14 776 27 775 46 829 102 854 113 909 184 946',f,1,.19)+
        line('M-15 870 52 879 65 916 112 935M165 891 171 937 217 960',a,1.5,.35)+
        path('M-13 667Q34 640 61 665L58 681H-10Z',g,'opacity=".28"')+
        rect(9,625,35,42,f,'opacity=".4"')+path('M3 626 26 608 50 626Z',a,'opacity=".5"')+rect(22,645,8,22,b,'opacity=".4"')+
        line('M110 761Q123 711 116 659M160 783Q165 749 160 708',a,3,.55)+
        path('M116 655C101 677 100 698 102 719Q118 714 132 719C129 689 130 676 116 655ZM160 705C149 720 148 737 149 753Q163 748 176 754C169 736 170 718 160 705Z',a,'opacity=".55"'))+
      group('s-sunset-glints',Array.from({length:18},(_,i)=>line(`M${1330-i%4*21} ${806+i*10}h${144+i%5*17}`,i%3?'#e5ba98':f,i%3?1:1.7,.12+i%4*.045)).join(''))+
      group('s-sunset-foam',line('M-20 957Q112 959 226 1003M1060 971Q1330 917 1630 973',f,1.5,.22)+
        line('M1304 922q79-18 148-2M103 982q40 4 77 19',f,1,.18))+
      placed(1355,815,group('s-sunset-boat',line('M-29 1H30L18 10H-18Z',a,2,.6)+line('M0-40V0',a,1,.5)+path('M-3-36V-3H-24Z',f,'opacity=".35"')))+
      group('s-sunset-gulls',line('M1310 392q10-10 22 0 11-10 21 0M1390 420q7-7 15 0 7-7 14 0',a,1.8,.45));

    const officeLeaf=(x,y,angle,s=1)=>`<g transform="translate(${x} ${y}) rotate(${angle}) scale(${s})">`+path('M0 0C-29-20-36-52-4-74C24-54 34-23 0 0Z',g,'opacity=".46"')+line('M0 0-3-66',a,1,.4)+'</g>';
    scenes.office=()=>`<defs><linearGradient id="s-office-glass" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".25"/><stop offset="1" stop-color="${f}" stop-opacity=".06"/></linearGradient><linearGradient id="s-office-screen" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".13"/><stop offset="1" stop-color="${b}" stop-opacity=".75"/></linearGradient><clipPath id="s-office-window">${rect(1320,173,245,366,b,'rx="5"')}</clipPath>${glow('s-office-afternoon','#c7b997')}</defs>`+
      circle(1510,570,410,'url(#s-office-afternoon)')+
      group('s-office-window',rect(1307,160,270,395,a,'rx="9" opacity=".22"')+rect(1320,173,245,366,'url(#s-office-glass)','rx="5"')+
        `<g clip-path="url(#s-office-window)">`+group('s-office-cloud',path('M1270 288Q1330 260 1397 288Q1445 247 1530 284L1640 310Q1530 300 1460 315Q1350 292 1270 312Z',f,'opacity=".15"'))+
        Array.from({length:7},(_,i)=>rect(1320+i*39,507-i*23%81,26,75+i*23%81,a,'opacity=".12"')).join('')+'</g>'+
        line('M1320 350H1565M1443 173V539',a,5,.4)+line('M1328 182H1557M1328 531H1557',f,1,.17)+
        rect(1437,337,13,4,a,'rx="2" opacity=".6"'))+
      group('s-office-windowlight',path('M1320 540H1565L1660 998H1100Z',f,'opacity=".035"')+line('M1443 540 1350 1000',b,8,.08))+
      placed(84,100,group('s-office-hanging',
        line('M-36 0 0 132 36 0',a,1,.35)+path('M-39 120H39L29 183H-29Z',a,'opacity=".45"')+
        line('M-12 126Q-42 207-11 295M9 126Q42 220 10 337M20 150Q75 192 62 265',a,2,.5)+
        [[-26,188,-42,.6],[-22,230,36,.7],[-10,283,-20,.75],[25,202,35,.6],[24,253,-40,.75],[11,330,18,.7],[62,251,40,.7]].map(([x,y,r,s])=>officeLeaf(x,y,r,s)).join('')
      ))+
      group('s-office-desktop',
        path('M-30 884H277L299 902H-30Z',g,'opacity=".48"')+line('M0 902V1000M260 902V1000',a,7,.55)+
        rect(5,633,247,168,a,'rx="12" opacity=".45"')+rect(14,643,229,144,'url(#s-office-screen)','rx="7"')+
        line('M127 802V862M91 864H163',a,9,.55)+circle(129,793,2,f,'opacity=".3"')+
        rect(28,659,202,12,g,'rx="3" opacity=".16"')+circle(36,665,2,f,'opacity=".4"')+
        path('M29 755 59 713 87 744 122 692 165 750 204 715 228 755Z',g,'opacity=".18"')+
        line('M33 770H128M33 762H87',a,2,.38)+
        group('s-office-screen-sheen',path('M150 643H197L110 787H64Z',f,'opacity=".05"'))+
        path('M49 867H191L215 883H33Z',a,'opacity=".35"')+
        [0,1,2].map(i=>line(`M${49-i*4} ${870+i*4}h${144+i*8}`,f,.7,.2)).join('')+
        ellipse(242,876,11,7,g,'opacity=".36"'))+
      group('s-office-sideboard',line('M1315 931H1620M1343 934V1000M1563 934V1000',a,5,.45)+
        path('M1340 903 1427 891 1463 916 1372 926Z',a,'opacity=".45"')+
        line('M1345 906 1425 895M1352 911 1432 900',f,1,.18)+
        path('M1398 896 1403 906 1413 901 1407 893Z',g,'opacity=".7"')+
        path('M1503 855H1551L1544 913H1510Z',g,'opacity=".44"')+ellipse(1527,855,24,5,a,'opacity=".55"')+
        line('M1552 863q26 0 17 25-5 10-20 8',a,3,.45))+
      group('s-office-coffee-steam',line('M1519 838q-12-16 1-35t-2-30M1537 838q13-15 0-29t2-27',f,1.5,.25));

    scenes.colorful=()=>`<defs><linearGradient id="s-color-fold" x2="1" y2="1"><stop stop-color="#d99baf"/><stop offset=".48" stop-color="#b68fc4"/><stop offset="1" stop-color="#688aa8"/></linearGradient><linearGradient id="s-color-ribbon" x2="1" y2="1"><stop stop-color="#e8bf79"/><stop offset=".5" stop-color="#cc8c8f"/><stop offset="1" stop-color="#9b78b5"/></linearGradient>${glow('s-color-aura','#bc8fa9')}</defs>`+
      circle(30,473,350,'url(#s-color-aura)')+circle(1500,780,360,'url(#s-color-aura)')+
      placed(140,179,group('s-color-mobile-top',
        line('M0-70V24M-118 24H118M-95 24V112M100 24V88',f,1.3,.38)+
        path('M-95 112C-157 85-200 146-141 201C-85 189-56 153-95 112Z','#cf8b9f','opacity=".7"')+
        path('M-95 112C-129 135-140 168-141 201',b,'opacity=".14"')+
        circle(100,124,36,'#d9b768','opacity=".7"')+
        placed(-4,24,group('s-color-mobile-lower',
          line('M0 0V239M-80 239H88M-80 239V291M88 239V333',f,1.2,.35)+
          path('M-80 291A57 57 0 0 0-80 405V291Z','#78b9b6','opacity=".65"')+
          path('M50 332Q109 302 131 356Q144 410 87 446Q27 414 50 332Z','#8c98ca','opacity=".7"')+
          line('M-80 291V405M64 338Q112 320 122 362',f,1,.24)
        ))
      ))+
      placed(1450,776,group('s-color-sculpture',
        ellipse(0,191,146,18,b,'opacity=".13"')+
        path('M-104 122C-159 21-107-140-6-176C83-195 165-92 116-16C83 47-55 18-47 88C-45 117 11 125 55 104L81 159C9 204-71 184-104 122Z','url(#s-color-fold)','opacity=".67"')+
        path('M-6-176C-38-130-66-35-39 8C-16 42 56 14 83-17C35-7 4-16 12-49C21-83 60-119 68-146Q41-181-6-176Z',f,'opacity=".1"')+
        path('M-47 88C-22 65 42 55 72 31C16 111 8 126 55 104L81 159C27 170-25 143-47 88Z',b,'opacity=".15"')+
        line('M-6-176C-88-144-144 19-104 122M-47 88Q-57 115-20 133',f,1.5,.24)
      ))+
      group('s-color-plinth',path('M1340 983 1460 948 1596 982 1475 1020Z',a,'opacity=".19"')+line('M1460 948 1475 1020',f,1,.12))+
      group('s-color-orbitals',[[39,779,7,'#d9b768'],[218,682,9,'#78b9b6'],[1320,511,6,'#cf8b9f'],[1530,236,8,'#8c98ca']].map(([x,y,r,c],i)=>circle(x,y,r,c,`class="s-color-bead" style="--s-phase:-${i*2.1}s" opacity=".6"`)).join(''));
    const dna=()=>{
      const frames=Array.from({length:4},(_,phase)=>{
        const backbone=sign=>Array.from({length:47},(_,i)=>{const t=i*.17+phase*Math.PI/2,x=1442+sign*Math.sin(t)*69,y=177+i*10;return `${i?'L':'M'}${x.toFixed(2)} ${y}`;}).join('');
        const rungs=Array.from({length:24},(_,i)=>{const t=i*.34+phase*Math.PI/2,y=177+i*20,x=Math.sin(t)*69;return `M${(1442-x).toFixed(2)} ${y}H${(1442+x).toFixed(2)}`;}).join('');
        return [backbone(-1),backbone(1),rungs];
      });
      return [0,1,2].map((side)=>path(frames[0][side],'none',`stroke="${side===0?a:side===1?g:'#a5b2a0'}" stroke-width="${side===2?1.3:2.4}" opacity="${side===2?.36:.64}" class="s-science-dna" style="${frames.map((d,i)=>`--s-dna-${i}:path('${d[side]}')`).join(';')}"`)).join('');
    };
    scenes.science=()=>`<defs><linearGradient id="s-science-glass" x2="1" y2=".2"><stop stop-color="${f}" stop-opacity=".22"/><stop offset=".22" stop-color="${f}" stop-opacity=".02"/><stop offset=".8" stop-color="${g}" stop-opacity=".08"/><stop offset="1" stop-color="${g}" stop-opacity=".3"/></linearGradient><linearGradient id="s-science-liquid" x2="1" y2="1"><stop stop-color="#a1d5c6" stop-opacity=".63"/><stop offset="1" stop-color="${a}" stop-opacity=".44"/></linearGradient>${glow('s-science-aura')}<clipPath id="s-science-vessel-clip">${path('M78 689H124V756C173 780 209 826 192 874C181 910 146 930 101 930C56 930 21 910 10 874C-7 826 29 780 78 756Z',b)}</clipPath></defs>`+
      circle(93,832,340,'url(#s-science-aura)')+circle(1465,410,310,'url(#s-science-aura)')+
      group('s-science-chemistry',
        line('M71 257 132 222 193 257V328L132 364 71 328ZM81 264 132 235M183 264V322M132 351 82 322M71 257 33 235M193 328 233 351',a,1.8,.6)+
        caption(6,235,'HO',13,g)+caption(231,365,'OH',13,g)+
        circle(132,293,25,'none',`stroke="${g}" stroke-opacity=".2"`)+
        circle(132,222,3,g,'opacity=".5"')+circle(71,328,3,g,'opacity=".5"'))+
      group('s-science-retort',
        line('M17 971H222M214 971V665M197 665H231',a,4,.6)+
        line('M214 765H132M200 756V775M163 756V775',g,3,.5)+
        path('M78 689H124V756C173 780 209 826 192 874C181 910 146 930 101 930C56 930 21 910 10 874C-7 826 29 780 78 756Z','url(#s-science-glass)',`stroke="${a}" stroke-width="1.6" stroke-opacity=".6"`)+
        `<g clip-path="url(#s-science-vessel-clip)">`+
        path('M0 829Q100 808 203 831V940H0Z','url(#s-science-liquid)')+
        group('s-science-meniscus',ellipse(101,830,97,13,g,'opacity=".25"')+line('M12 827Q101 808 188 829',f,1,.22))+
        [[45,872,4],[79,902,3],[119,866,5],[149,897,3],[101,836,3],[61,846,2]].map(([x,y,r],i)=>placed(x,y,circle(0,0,r,g,`class="s-science-bubble" style="--s-phase:-${i*1.4}s" opacity=".6"`))).join('')+'</g>'+
        line('M88 701V758Q36 787 30 830M29 864Q35 903 70 913M80 690H122M78 700H124',f,2,.35)+
        ellipse(101,689,24,5,g,'opacity=".25"')+
        line('M156 791l12 9M164 806l11 6M171 824l11 4',a,1,.4)+
        path('M69 930H135L153 947H52Z',a,'opacity=".38"')+
        line('M52 948H152',f,1,.18))+
      group('s-science-helix',dna()+line('M1353 164V651M1531 164V651',a,1,.1)+
        [177,277,377,477,577,647].map(y=>line(`M1347 ${y}h12M1525 ${y}h12`,a,1,.22)).join(''))+
      placed(1440,859,group('s-science-dish',
        ellipse(0,16,131,54,'url(#s-science-glass)',`stroke="${a}" stroke-opacity=".45"`)+
        ellipse(0,0,131,54,'url(#s-science-glass)',`stroke="${f}" stroke-opacity=".22"`)+
        ellipse(0,6,118,43,'url(#s-science-liquid)','opacity=".33"')+
        [[-63,-6,13],[-23,18,8],[17,-23,16],[66,8,11],[29,27,7]].map(([x,y,r])=>circle(x,y,r,g,'opacity=".25"')+circle(x-3,y-3,r*.45,f,'opacity=".09"')).join('')+
        line('M-102-31Q-50-66 38-46',f,1.5,.3)
      ));

    scenes.scary=()=>`<defs>${glow('s-scary-moon-haze','#a67d80')}<radialGradient id="s-scary-moon"><stop stop-color="#cdb7aa" stop-opacity=".7"/><stop offset=".8" stop-color="#a18183" stop-opacity=".55"/><stop offset="1" stop-color="#7f5f71" stop-opacity=".35"/></radialGradient>${glow('s-scary-flame','#e3af84')}<linearGradient id="s-scary-plaster" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".4"/><stop offset="1" stop-color="${a}" stop-opacity=".3"/></linearGradient></defs>`+
      circle(1450,260,250,'url(#s-scary-moon-haze)')+circle(1450,260,89,'url(#s-scary-moon)')+
      path('M1395 237q39-44 91-19M1431 306q32-31 71-22','none','stroke="#544553" stroke-width="11" opacity=".08"')+
      group('s-scary-farforest',Array.from({length:9},(_,i)=>{const x=i*207-40;return path(`M${x-7} 1000Q${x+15} 838 ${x} ${764-i%3*35}Q${x+12} 820 ${x+15} 1000Z`,a,'opacity=".12"')+line(`M${x+2} 889l-28-50m30 6 35-46`,a,2,.12);}).join(''))+
      group('s-scary-lefttree',
        path('M-21 1030C40 920 72 816 51 688C28 562 38 453 75 357C94 310 77 244 91 176C98 232 118 267 114 311C137 277 169 259 197 224C181 276 145 307 128 356C103 428 78 474 87 552C105 519 130 504 145 468C145 509 136 535 117 563C100 590 99 626 105 662C143 641 158 603 188 584C175 622 148 667 112 695C128 829 99 952 38 1030Z',a,'opacity=".5"')+
        line('M70 716Q94 822 54 952M64 597Q52 470 105 360M112 353Q148 309 161 285M89 556 73 526M102 678 143 649',g,1.5,.19)+
        line('M84 398Q20 359-15 300M108 345Q58 298 42 252M103 554Q37 525 6 473M143 517 191 490 214 450',a,4,.38)+
        ellipse(77,751,9,18,b,'opacity=".3"')+line('M77 735Q88 750 77 768',g,1,.15))+
      group('s-scary-righttree',
        path('M1650 870Q1514 716 1538 539Q1563 417 1519 347Q1488 306 1478 231Q1512 289 1540 309Q1522 254 1550 189Q1547 269 1574 330Q1612 290 1650 268Q1624 321 1586 360Q1609 440 1584 543Q1564 689 1650 780Z',a,'opacity=".45"')+
        line('M1551 451Q1470 406 1440 347M1570 377Q1613 343 1640 299M1556 622Q1503 582 1480 526',a,5,.38))+
      placed(1437,813,group('s-scary-house',
        path('M-102 142-86-37-28-81 83-46 105 142Z','url(#s-scary-plaster)')+
        path('M-127-21-32-161 112-25-26-83Z',a,'opacity=".65"')+
        path('M-32-161-26-83 112-25Z',b,'opacity=".28"')+
        path('M-66-108-61-177-38-173-43-135Z',a,'opacity=".58"')+
        line('M-122-20-31-150 103-27M-58-165l12 2M-72 21 76 13M-76 68 84 59M-85 114 92 103',g,1,.19)+
        path('M-65-8-39-14-39 24-67 28ZM27-13 53-8 58 29 29 25ZM-23 142-24 84Q-5 50 19 79L23 142Z',b,'opacity=".78"')+
        group('s-scary-candle',rect(-59,-1,14,20,'#d4a47a','opacity=".5"')+circle(-52,8,55,'url(#s-scary-flame)'))+
        line('M-71 9-35 16M24 2 62 15M27 17 60 4M-12 122l21-1',a,3,.45)+
        path('M-33 142H32L42 151H-43ZM-45 153H43L52 161H-56Z',a,'opacity=".28"')
      ))+
      placed(204,415,group('s-scary-lantern',
        line('M0 0V109',a,1,.5)+path('M-15 119 14 114 12 151-11 155Z',g,'opacity=".35"')+
        path('M-19 120-2 104 19 114ZM-13 156 14 151 15 158-13 162Z',a,'opacity=".65"')+
        line('M-1 118 1 151',a,1,.55)+circle(0,136,69,'url(#s-scary-flame)')
      ))+
      group('s-scary-fence',[0,1,2,3,4,5].map(i=>path(`M${5+i*30} 1000V${928+i%2*6}l7-13 7 13V1000Z`,a,'opacity=".24"')).join('')+line('M0 952H190M0 976H190',a,3,.25))+
      group('s-scary-fog-near',path('M-180 991C80 833 312 991 511 987S1013 900 1248 950S1591 957 1750 915V1100H-180Z',g,'opacity=".12"'))+
      group('s-scary-fog-far',path('M-100 629Q90 523 291 647M1260 472Q1470 373 1700 465',g,'opacity=".09"'));
    const reel=(x,y,r)=>placed(x,y,group('s-retro-reel',
      circle(0,0,r,'#c1b397','opacity=".65"')+circle(0,0,r*.66,'#3a3438','opacity=".65"')+
      Array.from({length:6},(_,i)=>`<g transform="rotate(${i*60})">${rect(-3,-r*.7,6,r*.43,'#c1b397','rx="2" opacity=".7"')}</g>`).join('')+
      circle(0,0,r*.18,'#b19a78','opacity=".8"')
    ));
    scenes.retro=()=>`<defs><linearGradient id="s-retro-case" x2=".8" y2="1"><stop stop-color="#c4a783" stop-opacity=".8"/><stop offset="1" stop-color="${a}" stop-opacity=".55"/></linearGradient><radialGradient id="s-retro-tube"><stop stop-color="#42594f"/><stop offset="1" stop-color="#243530"/></radialGradient><pattern id="s-retro-scan" width="6" height="5" patternUnits="userSpaceOnUse">${line('M0 0H6','#c6d5b2',.6,.11)}</pattern><clipPath id="s-retro-screen">${rect(-13,426,230,146,b,'rx="17"')}</clipPath>${glow('s-retro-screen-glow','#96bba2')}</defs>`+
      circle(40,501,300,'url(#s-retro-screen-glow)')+
      group('s-retro-monitor',
        path('M-54 398Q-60 381-35 380H228Q254 380 262 402L284 577Q286 603 258 608H-45Z','url(#s-retro-case)')+
        rect(-40,402,290,195,'#8c705c','rx="16" opacity=".46"')+rect(-25,415,254,169,'#544d42','rx="22" opacity=".6"')+
        rect(-13,426,230,146,'url(#s-retro-tube)','rx="17"')+
        `<g clip-path="url(#s-retro-screen)">`+
          line('M-5 541 31 504 62 522 105 472 145 514 180 494 224 532','#9bb79d',1,.38)+
          line('M-10 551H219M-10 561H219M27 552 14 575M71 551 67 575M116 551 120 575M160 552 174 575','#9bb79d',.7,.2)+
          rect(-13,426,230,146,'url(#s-retro-scan)')+
          group('s-retro-scanbeam',rect(-13,432,230,18,'#d9e6bb','opacity=".035"'))+
          circle(174,457,15,'#b4c7a4','opacity=".35"')+
        '</g>'+
        line('M-6 435Q90 422 202 435',f,1.2,.16)+
        [22,32,42,52,62,72,82].map(x=>line(`M${x} 594v5`,b,2,.35)).join('')+
        circle(210,599,3,'#b8c384','opacity=".7"')+
        path('M9 609H193L210 640H-8Z',a,'opacity=".4"')+
        line('M0 641H215',f,1,.15))+
      placed(1444,280,group('s-retro-turntable',
        rect(-137,-124,274,249,'url(#s-retro-case)','rx="16" opacity=".42"')+
        placed(-12,0,group('s-retro-vinyl',
          circle(0,0,102,'#2c2b30','opacity=".85"')+
          [93,85,77,69,60,52].map(r=>circle(0,0,r,'none','stroke="#c7b69a" stroke-width=".65" opacity=".13"')).join('')+
          circle(0,0,35,'#bd866b','opacity=".8"')+
          path('M-34-8Q0-33 34-8V8Q0-14-34 8Z','#d7b58e','opacity=".7"')+
          circle(0,0,5,'#45343c','opacity=".8"')+
          path('M-90-43Q-102-13-94 16L-55 3Q-59-10-52-25Z',f,'opacity=".055"')
        ))+
        circle(107,-92,11,a,'opacity=".6"')+line('M107-92 84-14 49 24',g,5,.6)+line('M107-92 84-14 49 24',f,1,.3)+
        rect(39,17,17,9,a,'rx="2" opacity=".7"')+circle(107,94,6,'#bd866b','opacity=".75"')+
        line('M86 94H64',a,2,.5)
      ))+
      placed(1435,803,group('s-retro-player',
        rect(-145,-102,290,193,'url(#s-retro-case)','rx="12"')+rect(-131,-90,260,169,b,'rx="8" opacity=".4"')+
        rect(-115,-70,228,115,'#b9a07d','rx="9" opacity=".5"')+
        path('M-105-57H103V10Q8 29-105 10Z','#403a3d','opacity=".75"')+
        reel(-53,-18,27)+reel(53,-18,27)+line('M-53-44H53M-53 8H53','#b7a58b',1.5,.45)+
        path('M-92 44-81 18H82L94 44Z','#645147','opacity=".65"')+
        [-66,-35,-4,27,58].map((x,i)=>rect(x,61,22,12,i===1?'#be7c6d':g,'rx="2" opacity=".5"')).join('')+
        path('M-26 64-18 67-26 72Z',b,'opacity=".5"')+
        [[-119,-78],[119,-78],[-119,58],[119,58]].map(([x,y])=>circle(x,y,2.5,a,'opacity=".6"')+line(`M${x-1.5} ${y}h3`,f,.7,.3)).join('')+
        line('M-89-83H88',f,1,.2)
      ))+
      group('s-retro-tape',line('M1333 889C1220 970 1587 1068 1580 924S1480 1000 1635 1003',a,4,.35)+
        line('M1333 889C1220 970 1587 1068 1580 924S1480 1000 1635 1003',f,.7,.16))+
      group('s-retro-floating-bars',path('M-20 844H126V859H-20ZM-20 870H167V883H-20ZM-20 897H205V908H-20Z','#bd866b','opacity=".16"'));

    const flange=(y)=>ellipse(1430,y,116,26,a,'opacity=".42"')+ellipse(1430,y-5,116,26,'url(#s-reactor-metal)',`stroke="${g}" stroke-opacity=".28"`)+
      Array.from({length:8},(_,i)=>{const t=i*Math.PI/4;return circle(1430+Math.cos(t)*100,y-5+Math.sin(t)*19,3,g,'opacity=".45"');}).join('');
    scenes.radioactive=()=>`<defs><linearGradient id="s-reactor-metal" x2="1" y2=".1"><stop stop-color="${a}" stop-opacity=".55"/><stop offset=".25" stop-color="${f}" stop-opacity=".12"/><stop offset=".55" stop-color="${b}" stop-opacity=".35"/><stop offset="1" stop-color="${g}" stop-opacity=".28"/></linearGradient><linearGradient id="s-reactor-glass" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".3"/><stop offset=".35" stop-color="${f}" stop-opacity=".035"/><stop offset="1" stop-color="${g}" stop-opacity=".25"/></linearGradient><linearGradient id="s-reactor-core" x2="1" y2="0"><stop stop-color="#6b9b55" stop-opacity=".2"/><stop offset=".48" stop-color="#d4e89d" stop-opacity=".8"/><stop offset="1" stop-color="#78b758" stop-opacity=".35"/></linearGradient>${glow('s-reactor-glow','#b1cf74')}<clipPath id="s-reactor-chamber">${rect(1346,354,168,326,b,'rx="32"')}</clipPath></defs>`+
      circle(1450,515,350,'url(#s-reactor-glow)')+circle(52,897,270,'url(#s-reactor-glow)')+
      placed(142,283,group('s-reactor-gauge',
        circle(0,0,106,'url(#s-reactor-metal)',`stroke="${a}" stroke-opacity=".5" stroke-width="2"`)+
        circle(0,0,91,b,'opacity=".6"')+circle(0,0,83,'none',`stroke="${g}" stroke-opacity=".25"`)+
        Array.from({length:17},(_,i)=>line('M0-72V-62',i>12?'#c3a664':g,i%4?1:2,.5,`transform="rotate(${-122+i*15.25})"`)).join('')+
        path('M-63 47A79 79 0 0 1 56-55','none',`stroke="${g}" stroke-width="3" opacity=".28"`)+
        group('s-reactor-needle',line('M-10 7 59-40',g,2,.8)+circle(0,0,7,a,'opacity=".9"')+circle(0,0,3,g,'opacity=".8"'))+
        rect(-37,44,74,13,g,'rx="3" opacity=".18"')+line('M-21 50H-12M-5 50H4M11 50H20',g,2,.65)
      ))+
      group('s-reactor-pipes',
        line('M1308 405H1268V710H1328M1552 395H1592V763H1514',a,13,.48)+
        line('M1308 405H1268V710H1328M1552 395H1592V763H1514',g,2,.27)+
        line('M0 756H88V891H216V1020',a,20,.45)+
        line('M0 752H88V887H216',g,2,.28)+
        line('M0 756H88V891H216V1020',g,4,.4,'stroke-dasharray="10 90" class="s-reactor-coolant"')+
        [[29,756],[88,815],[150,891],[216,957]].map(([x,y],i)=>rect(x-9,y-16,i%2?18:26,i%2?32:20,'url(#s-reactor-metal)','rx="3"')).join(''))+
      group('s-reactor-vessel',
        rect(1340,338,180,366,'url(#s-reactor-glass)','rx="40"')+
        `<g clip-path="url(#s-reactor-chamber)">`+
          group('s-reactor-corelight',[-44,0,44].map((x,i)=>rect(1430+x-12,378-i%2*12,24,284+i%2*20,'url(#s-reactor-core)','rx="12"')).join(''))+
          [[1387,612],[1436,554],[1482,641],[1455,465],[1404,409]].map(([x,y],i)=>placed(x,y,circle(0,0,2+i%2,g,`class="s-reactor-bubble" style="--s-phase:-${i*1.7}s" opacity=".7"`))).join('')+
          line('M1362 397V628M1371 388V651',f,2,.2)+
        '</g>'+
        flange(344)+flange(701)+
        rect(1396,277,68,43,'url(#s-reactor-metal)','rx="7"')+line('M1430 277V246H1503',a,10,.55)+
        path('M1342 709H1518L1548 758H1312Z','url(#s-reactor-metal)')+
        line('M1347 758V914M1512 758V914M1328 917H1530',a,7,.48)+
        [1352,1507].map(x=>line(`M${x} 384V660`,a,7,.4)).join('')+
        group('s-reactor-containment',
          ellipse(1430,443,93,19,'none',`stroke="${g}" stroke-width="1.2" stroke-opacity=".4" stroke-dasharray="25 11"`)+
          ellipse(1430,583,93,19,'none',`stroke="${g}" stroke-width="1.2" stroke-opacity=".4" stroke-dasharray="25 11"`)
        ))+
      placed(89,891,group('s-reactor-valve',circle(0,0,34,'none',`stroke="${g}" stroke-width="5" opacity=".5"`)+line('M-24-24 24 24M-24 24 24-24',g,3,.55)+circle(0,0,6,a,'opacity=".8"')))+
      group('s-reactor-hazard-plate',rect(18,600,176,67,a,'rx="5" opacity=".2"')+
        Array.from({length:8},(_,i)=>path(`M${20+i*22} 600h10l-12 15h-10Z`,g,'opacity=".4"')).join('')+
        circle(107,639,6,g,'opacity=".65"')+
        [0,120,240].map(n=>path('M-4-12-9-30A31 31 0 0 1 9-30L4-12Z',g,`transform="translate(107 639) rotate(${n})" opacity=".5"`)).join(''))+
      group('s-reactor-steam',path('M-100 995Q130 882 360 1000M1290 996Q1460 916 1680 980',g,'opacity=".1"'));
    return scenes;
  });
})();
