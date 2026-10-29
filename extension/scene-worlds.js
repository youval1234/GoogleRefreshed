// Original local vector scenes. Factories run only when the selected world is mounted.
'use strict';
(globalThis.GoogleRefreshedScenePacks ??= []).push(({a,g,f,b,path,circle,rect,group,line,caption})=>{
  const ellipse=(x,y,rx,ry,fill=a,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
  const placed=(x,y,body,angle=0,scale=1)=>`<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">${body}</g>`;
  const flecks=(prefix,count,color=f)=>Array.from({length:count},(_,i)=>circle((i*379+93)%1600,(i*227+81)%1000,.8+i%3*.55,color,`opacity="${.15+i%4*.07}" class="${prefix}" style="--w-phase:-${i*1.31}s"`)).join('');
  const blackhole=()=>`<defs>
    <radialGradient id="w-bh-atmosphere"><stop stop-color="#e9ac75" stop-opacity=".23"/><stop offset=".45" stop-color="#a98ac4" stop-opacity=".08"/><stop offset="1" stop-color="#96749d" stop-opacity="0"/></radialGradient>
    <linearGradient id="w-bh-disk" x2="1" y2=".2"><stop stop-color="#a77687" stop-opacity=".1"/><stop offset=".3" stop-color="#df986b"/><stop offset=".48" stop-color="#fff1b9"/><stop offset=".72" stop-color="#eebd83"/><stop offset="1" stop-color="#9d7fb0" stop-opacity=".1"/></linearGradient>
    <radialGradient id="w-bh-ring"><stop offset=".78" stop-color="#11101d" stop-opacity="0"/><stop offset=".88" stop-color="#f2cb8f" stop-opacity=".1"/><stop offset=".94" stop-color="#f3c884" stop-opacity=".55"/><stop offset="1" stop-color="#e7b478" stop-opacity="0"/></radialGradient>
    </defs>`+
    circle(1417,333,365,'url(#w-bh-atmosphere)')+flecks('w-bh-star',23,f)+
    placed(1417,333,group('w-bh-system',
      ellipse(0,0,234,66,'none','stroke="url(#w-bh-disk)" stroke-width="12" opacity=".28"')+
      ellipse(0,0,217,53,'none','stroke="url(#w-bh-disk)" stroke-width="2" opacity=".65"')+
      line('M-232 0C-143-9-135-133 0-142S145-15 232 0','url(#w-bh-disk)',10,.4)+
      line('M-228 0C-140-9-130-126 0-135S140-15 228 0','#f8d29a',1.5,.65)+
      circle(0,0,116,'url(#w-bh-ring)')+circle(0,0,101,'#0b101c')+
      circle(0,0,104,'none','stroke="#f4d6a1" stroke-width="1.5" opacity=".7"')+
      circle(0,0,108,'none','stroke="#c6afd7" stroke-width="3" opacity=".16"')+
      group('w-bh-disk-front',line('M-235 3C-140 74 133 76 235 3','url(#w-bh-disk)',10,.7)+
        line('M-231 6C-128 62 125 63 231 6','#fff0bc',1.5,.8)+
        line('M-223 17C-114 65 111 66 222 17','#e5af85',1,.6)+
        line('M-232 2C-136 71 130 71 232 2','#fff4d0',2,.75,'stroke-dasharray="10 85" class="w-bh-flow"'))+
      group('w-bh-lensing',line('M-199-23C-115-28-114-124 0-127S123-31 199-23','#f8deb0',1,.4,'stroke-dasharray="4 47"')+
        line('M-183-33C-108-35-105-119 0-122S113-39 183-33',g,1,.5,'stroke-dasharray="1 13"'))
    ),-13)+
    group('w-bh-spacetime',Array.from({length:6},(_,i)=>line(`M-45 ${200+i*47}C${45+i*13} ${167+i*39} ${216-i*10} ${267+i*32} ${228-i*8} ${431+i*37}`,a,1,.1+i*.025)).join('')+
      [71,104,139].map(r=>ellipse(92,817,r,r*.48,'none',`stroke="${a}" stroke-width="1" opacity=".2" transform="rotate(-24 92 817)"`)).join(''))+
    group('w-bh-infall',line('M-30 1000Q73 790 234 702M1335 1030Q1272 882 1420 741',g,1,.3,'stroke-dasharray="5 40"'));

  const cosmic=()=>`<defs>
    <radialGradient id="w-cosmic-haze"><stop stop-color="${g}" stop-opacity=".28"/><stop offset=".55" stop-color="#9b80b9" stop-opacity=".08"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
    <radialGradient id="w-cosmic-planet" cx=".28" cy=".23" r=".91"><stop stop-color="#ddcae0"/><stop offset=".42" stop-color="#a78ec7"/><stop offset=".76" stop-color="#5d5e91"/><stop offset="1" stop-color="#283652"/></radialGradient>
    <linearGradient id="w-cosmic-ring"><stop stop-color="#d2b9a2" stop-opacity=".1"/><stop offset=".45" stop-color="#e6d8c6"/><stop offset="1" stop-color="#9599bd" stop-opacity=".2"/></linearGradient>
    <clipPath id="w-cosmic-sphere">${circle(0,0,124)}</clipPath></defs>`+
    circle(1420,280,330,'url(#w-cosmic-haze)')+circle(20,415,380,'url(#w-cosmic-haze)')+flecks('w-cosmic-stars',28,f)+
    group('w-cosmic-nebula',path('M-100 165C97 41 160 270 256 285C355 302 344 474 238 506C120 543 245 702 111 790L-60 691C53 581-13 490 56 443C145 380 12 347-100 380Z',g,'opacity=".12"')+
      line('M-70 211C78 115 104 305 207 328S265 447 163 476S159 638 50 704',g,14,.08)+
      line('M-80 210C83 119 119 304 221 319S263 445 172 482S150 663 33 728',g,2,.25)+
      line('M-70 231C60 142 107 328 213 341S243 430 149 491S132 644 19 708',a,1,.35))+
    placed(1422,283,group('w-cosmic-giant',
      ellipse(0,0,211,57,'none','stroke="url(#w-cosmic-ring)" stroke-width="13" opacity=".4" transform="rotate(-25)"')+
      circle(0,0,124,'url(#w-cosmic-planet)')+
      `<g clip-path="url(#w-cosmic-sphere)">`+
      line('M-144-57Q-35-84 90-27T150-25M-143-25Q-22-60 80-3T152 5','#e7c7cf',13,.23)+
      line('M-144 15Q-33-20 71 35T152 44','#ddd4e0',19,.2)+
      line('M-142 52Q-5 22 110 82M-130 89Q-5 59 126 119','#505080',9,.22)+
      ellipse(39,39,20,8,'#d8b5ca','opacity=".35" transform="rotate(17 39 39)"')+
      ellipse(39,39,11,4,'#69608e','opacity=".45" transform="rotate(17 39 39)"')+'</g>'+
      circle(0,0,124,'none','stroke="#e4d9ee" opacity=".24"')+
      `<g transform="rotate(-25)">`+line('M-211 0A211 57 0 0 0 211 0','url(#w-cosmic-ring)',13,.7)+
      line('M-211 0A211 57 0 0 0 211 0','#e9decd',1,.6)+
      line('M-211 0A211 57 0 0 0 211 0',f,2,.65,'stroke-dasharray="3 69" class="w-cosmic-ring-dust"')+'</g>'
    ))+
    placed(117,808,group('w-cosmic-probe',
      rect(-30,-29,60,58,'url(#w-cosmic-planet)',`rx="5" stroke="${f}" stroke-opacity=".35"`)+
      [[-114,-43],[-114,5],[51,-43],[51,5]].map(([x,y])=>rect(x,y,63,38,g,`opacity=".38" stroke="${a}" stroke-width="1"`)+line(`M${x+21} ${y}v38m21-38v38M${x} ${y+19}h63`,f,.7,.3)).join('')+
      line('M-51 0H51M0-29V-63M0-65 25-95',a,3,.65)+
      path('M-31-72Q0-124 32-72Q0-54-31-72Z',g,'opacity=".6"')+
      line('M-31-72Q0-54 32-72',f,1,.4)+circle(25,-95,3,f,'opacity=".6"')+
      rect(-18,-18,36,36,b,'rx="4" opacity=".35"')+circle(0,0,10,g,'opacity=".6"')
    ),-19)+
    placed(1475,900,group('w-cosmic-moonlet',circle(0,0,44,'url(#w-cosmic-planet)','opacity=".6"')+circle(-14,-10,8,b,'opacity=".18"')+circle(9,16,13,b,'opacity=".16"')));

  const midnight=()=>`<defs>
    <radialGradient id="w-midnight-moonlight"><stop stop-color="${g}" stop-opacity=".25"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
    <linearGradient id="w-midnight-dome" x2="1" y2=".6"><stop stop-color="${g}"/><stop offset=".45" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <linearGradient id="w-midnight-lake" x2="0" y2="1"><stop stop-color="${g}" stop-opacity=".04"/><stop offset="1" stop-color="${g}" stop-opacity=".25"/></linearGradient></defs>`+
    circle(100,235,300,'url(#w-midnight-moonlight)')+circle(1450,825,330,'url(#w-midnight-moonlight)')+
    flecks('w-midnight-star',25,f)+
    placed(105,235,group('w-midnight-trails',
      [69,103,139,177].map((r,i)=>line(`M${-r*.87} ${r*.5}A${r} ${r} 0 0 1 ${r*.73} ${-r*.68}`,f,i%2?1:1.5,.16+i*.025)).join('')+
      circle(0,0,2,f,'opacity=".65"')
    ))+
    group('w-midnight-crescent',path('M218 298A49 49 0 1 0 247 360A44 44 0 0 1 218 298Z','#d9e3ec','opacity=".68"'))+
    path('M0 1000V894L103 794 194 860 288 787 430 936 670 1000M1060 1000 1245 876 1376 915 1490 826 1600 900V1000Z',a,'opacity=".16"')+
    path('M0 936Q280 884 540 962T1050 977T1600 937V1000H0Z','url(#w-midnight-lake)')+
    placed(1440,784,group('w-midnight-observatory',
      path('M-119 144V-13A119 119 0 0 1 119-13V144Z','url(#w-midnight-dome)',`opacity=".73" stroke="${a}" stroke-opacity=".3"`)+
      path('M-10-132C30-77 34-29 22-7H49Q64-70 21-130Z',b,'opacity=".8"')+
      line('M-91-89Q-45-65-49-13M-54-121Q-21-66-24-14M67-112Q94-62 95-14',f,1,.18)+
      path('M-132-12H132V4H-132ZM-130 142H130V157H-130Z',a,'opacity=".65"')+
      line('M-119 49H119M-119 95H119M-85 8V140M85 8V140',a,1,.38)+
      path('M-17 142V87Q0 60 18 87V142Z',b,'opacity=".6"')+
      rect(-76,29,19,31,'#e4cf9f','rx="8" opacity=".45" class="w-midnight-window"')+
      rect(58,29,19,31,'#e4cf9f','rx="8" opacity=".22"')+
      placed(2,-75,group('w-midnight-telescope',
        path('M-13 5 75-76 95-55 7 26Z',g,'opacity=".7"')+
        path('M75-76 82-83 103-62 95-55Z',a,'opacity=".8"')+
        line('M82-83 103-62',f,3,.4)+line('M0 10-21 34M0 10 20 38',a,4,.6)
      ))+
      line('M-150 166H149M-161 177H159M-172 188H167',a,2,.4)
    ))+
    group('w-midnight-pines',path('M-30 1000 41 840 25 842 73 740 58 746 90 664 117 742 106 738 152 834 136 831 201 1000ZM180 1000 222 918 211 921 237 852 254 918 244 916 290 1000Z',a,'opacity=".28"')+
      line('M90 691V1000M237 878V1000',b,3,.24))+
    group('w-midnight-water',Array.from({length:12},(_,i)=>line(`M${1330+i%3*15} ${957+i*4}h${170-i*11}`,f,1,.1+i%3*.055)).join(''))+
    group('w-midnight-meteor',line('M25 460 183 503','url(#star-tail)',2,.6));

  const amber=()=>{
    const outline='M-97-204C-37-246 66-216 99-144C132-71 91-14 112 65C139 150 48 232-34 221C-115 212-136 123-109 54C-85-7-146-126-97-204Z';
    return `<defs><linearGradient id="w-amber-resin" x2=".7" y2="1"><stop stop-color="#f4d48b"/><stop offset=".28" stop-color="#c18b40"/><stop offset=".52" stop-color="#edba58"/><stop offset=".82" stop-color="#a9602f"/><stop offset="1" stop-color="#e5ad56"/></linearGradient>
      <radialGradient id="w-amber-halo"><stop stop-color="#d9a14d" stop-opacity=".24"/><stop offset="1" stop-color="#d9a14d" stop-opacity="0"/></radialGradient>
      <clipPath id="w-amber-outline">${path(outline)}</clipPath></defs>`+
      circle(1410,484,345,'url(#w-amber-halo)')+circle(62,842,290,'url(#w-amber-halo)')+
      placed(1415,492,group('w-amber-specimen',
        path(outline,'url(#w-amber-resin)',`opacity=".82" stroke="${a}" stroke-opacity=".35"`)+
        path('M-97-204C-37-246 66-216 99-144C38-186-10-151-28-77C-45-6-100 11-109 54C-85-7-146-126-97-204Z','#fff0b5','opacity=".15"')+
        path('M112 65C139 150 48 232-34 221C28 196 63 160 54 105C44 42 94-14 112 65Z','#8f4f29','opacity=".18"')+
        `<g clip-path="url(#w-amber-outline)">`+
        group('w-amber-caustics',line('M-113-197C-28-205 44-109 25-37S-45 107 73 177','#fff1be',15,.1)+
          line('M-118-180C-26-207 28-104 12-34S-47 115 60 190','#fff0b5',2,.4)+
          line('M-130 83C-30 52 38 121 140 93','#ffe6a0',1.5,.3))+
        [[-70,-116,7],[52,-135,5],[76,-43,9],[-67,76,12],[38,127,5],[-31,157,8]].map(([x,y,r])=>circle(x,y,r,'#7a4d26','opacity=".13"')+circle(x-2,y-2,r,'none','stroke="#fff1b9" stroke-opacity=".27" stroke-width="1"')).join('')+
        group('w-amber-fossil',
          path('M-5-65Q-17-40-7-10Q-14 18 0 48Q14 18 8-11Q19-45 5-65Z','#7f542f','opacity=".55"')+
          path('M-8-28C-84-92-100-45-61-11C-38 10-17 13-7-5ZM8-28C87-95 106-47 62-11C41 7 19 12 7-5Z','#956333','opacity=".28"')+
          line('M-7-12-78-58M-7-12-61-15M7-12 84-59M7-12 65-16M-5-23-29 4-50 15M5-23 32 4 49 22M-3 4-26 32-36 60M3 4 27 33 34 60M-3-56-19-80M3-56 17-82','#775033',1.5,.55)+
          line('M-29-31-37-53M-48-25-64-42M29-31 38-55M48-25 67-43','#775033',.7,.4)+circle(0,-66,6,'#79522d','opacity=".65"')
        )+'</g>'+
        line('M-78-187C-102-129-99-61-85-21M66 135Q47 187 1 204','#fff0bf',2,.45)
      ),-7)+
      placed(80,837,group('w-amber-pebbles',
        path('M-99-16Q-42-104 20-74Q78-44 63 29Q29 97-44 64Q-96 47-99-16Z','url(#w-amber-resin)','opacity=".72"')+
        line('M-80-18Q-44-72 5-58','#ffeab5',2,.35)+
        path('M66 36Q98-14 143 15Q175 57 132 91Q85 108 66 36Z','url(#w-amber-resin)','opacity=".62"')+
        line('M80 31q26-20 49-5','#ffeab5',1.5,.4)
      ),12)+
      group('w-amber-botanical',line('M79 473Q164 349 121 208',a,2,.4)+
        [[112,242,-37],[125,279,45],[127,321,-48],[115,364,42],[95,411,-44]].map(([x,y,r])=>placed(x,y,path('M0 0Q-43-18-27-61Q12-44 0 0Z',g,'opacity=".3"')+line('M0 0-24-53',a,.8,.35),r)).join(''))+
      flecks('w-amber-mote',13,g);
  };

  const camel=(x,y,s,phase)=>placed(x,y,group('w-desert-camel',
    path('M-43-20Q-41-39-24-30Q-12-56 3-31Q22-49 33-25L47-24 50-43 46-53 56-59 66-51 60-34 59-11 41-4H-32L-43-14-53-13-58-20Z',a,'opacity=".67"')+
    line('M-31-5-30 30M-15-5-18 28M27-5 22 29M41-5 45 28',a,3,.67)+
    path('M-19-30H17V-8H-19Z',g,'opacity=".4"')+
    line('M60-45Q91-35 96-24',a,1,.4),`style="--w-phase:${phase}s"`),0,s);
  const desert=()=>`<defs><linearGradient id="w-desert-sand" x2=".2" y2="1"><stop stop-color="${g}"/><stop offset="1" stop-color="${a}"/></linearGradient>
    <radialGradient id="w-desert-sun"><stop stop-color="#f5ddb0" stop-opacity=".5"/><stop offset=".24" stop-color="#e8bf80" stop-opacity=".18"/><stop offset="1" stop-color="#e8bf80" stop-opacity="0"/></radialGradient>
    <linearGradient id="w-desert-mesa" x2="1" y2=".7"><stop stop-color="${g}" stop-opacity=".65"/><stop offset="1" stop-color="${a}" stop-opacity=".5"/></linearGradient></defs>`+
    circle(1430,280,285,'url(#w-desert-sun)')+circle(1430,280,49,'#e6c58d','opacity=".5"')+
    group('w-desert-heat',line('M1320 469Q1420 443 1580 464M1290 507Q1440 481 1640 512',g,8,.1))+
    path('M0 1000V876Q190 713 420 850T970 904Q1260 700 1600 824V1000Z',a,'opacity=".17"')+
    group('w-desert-dunes',path('M-120 1000V966C110 717 314 838 537 959Q887 1080 1190 884Q1430 756 1720 902V1050H-120Z','url(#w-desert-sand)','opacity=".28"')+
      line('M-40 916Q187 782 414 920M1130 940Q1390 796 1630 864',f,1,.19)+
      Array.from({length:6},(_,i)=>line(`M-40 ${946+i*13}Q${135+i*17} ${853+i*12} ${316+i*22} ${938+i*11}M${1250+i*13} ${946+i*8}Q1440 ${858+i*11} 1660 ${914+i*9}`,a,1,.12+i*.018)).join(''))+
    group('w-desert-mesa',path('M-30 1000 12 704 58 664 69 557 139 538 161 666 212 713 254 1000Z','url(#w-desert-mesa)')+
      path('M139 538 161 666 212 713 254 1000H159L123 751 118 617Z',b,'opacity=".16"')+
      line('M61 582 142 566M57 606 148 591M48 697 173 686M22 747 219 744M7 822 228 814M-2 893 240 883',a,2,.32)+
      line('M71 557 62 654 25 716M161 666 145 762 162 862',f,1,.16))+
    group('w-desert-caravan',camel(1334,918,.62,-2)+camel(1422,889,.76,-4)+camel(1527,863,.86,-6))+
    group('w-desert-wind',line('M-80 499Q63 465 223 514M-40 533Q67 511 188 543M1348 767Q1500 718 1670 759',g,1.5,.35,'stroke-dasharray="6 14 24 55"'))+
    group('w-desert-stones',path('M20 987 47 969 70 979 73 994ZM193 997 212 972 238 982 250 1000M1290 997 1314 988 1332 998Z',a,'opacity=".35"'));

  const cave=()=>`<defs><linearGradient id="w-cave-rock" x2=".8" y2="1"><stop stop-color="${g}" stop-opacity=".3"/><stop offset=".45" stop-color="${a}" stop-opacity=".7"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <radialGradient id="w-cave-glimmer"><stop stop-color="#8ebac9" stop-opacity=".3"/><stop offset="1" stop-color="#8ebac9" stop-opacity="0"/></radialGradient>
    <linearGradient id="w-cave-pool" x2="0" y2="1"><stop stop-color="${g}" stop-opacity=".04"/><stop offset="1" stop-color="${g}" stop-opacity=".25"/></linearGradient></defs>`+
    circle(90,839,320,'url(#w-cave-glimmer)')+circle(1510,648,275,'url(#w-cave-glimmer)')+
    group('w-cave-recess',path('M0 1000V102L120 152 249 369 213 549 290 791 353 1000ZM1600 1000V67L1472 158 1359 367 1396 528 1310 802 1244 1000Z',a,'opacity=".12"'))+
    group('w-cave-frame',path('M0 0H243L222 145 180 216 172 402 132 443 164 643 113 764 165 1000H0ZM1600 0H1385L1412 160 1459 242 1449 413 1498 468 1450 622 1486 811 1430 1000H1600Z','url(#w-cave-rock)')+
      path('M0 93 49 146 91 304 54 466 94 637 49 801 70 1000H0M1600 95 1550 220 1561 439 1518 628 1570 797 1536 1000H1600Z',b,'opacity=".22"')+
      line('M37 94 103 228 82 389 125 461 104 609 125 707M1560 159 1505 304 1530 462 1481 604 1516 766',f,1,.15)+
      line('M0 208 87 273M0 456 54 466 132 443M0 714 113 764M1600 322 1505 304M1600 613 1518 628M1600 854 1486 811',a,2,.3))+
    group('w-cave-teeth',[[52,20,37,215],[132,48,33,278],[211,10,28,168],[1443,0,34,210],[1509,48,42,320],[1580,4,36,220]].map(([x,y,w,h])=>
      path(`M${x-w} ${y}H${x+w}L${x+9} ${y+h} ${x-8} ${y+h-29}Z`,a,'opacity=".4"')+
      path(`M${x} ${y}H${x+w}L${x+9} ${y+h}Z`,g,'opacity=".12"')).join(''))+
    path('M0 1000V967Q320 908 610 970T1200 974T1600 944V1000Z','url(#w-cave-pool)')+
    placed(1490,943,group('w-cave-reflections',ellipse(0,0,111,7,'none',`stroke="${g}" opacity=".4"`)+ellipse(5,17,75,4,'none',`stroke="${f}" opacity=".18"`)))+
    group('w-cave-minerals',line('M1479 566 1516 592 1498 618 1542 645 1535 682M70 598 95 617 82 638 117 662',g,1.5,.5))+
    group('w-cave-garden',[[34,934,1],[87,945,.8],[137,955,.6],[1536,920,.65]].map(([x,y,s],i)=>placed(x,y,
      group('w-cave-mushroom',line('M0 5Q7 33 0 55',a,4,.5)+path('M-28 5Q-22-23 0-24Q24-22 29 5Q0 17-28 5Z',g,'opacity=".55"')+
        circle(-10,-4,2.3,f,'opacity=".5"')+circle(9,-10,2,f,'opacity=".4"'),`style="--w-phase:-${i*1.8}s"`),0,s)).join(''))+
    placed(132,326,group('w-cave-drop',path('M0 0Q-7 10 0 12Q7 10 0 0Z',g,'opacity=".7"')))+
    placed(1509,368,group('w-cave-drop w-cave-drop-second',path('M0 0Q-5 9 0 10Q5 9 0 0Z',g,'opacity=".7"')));

  // Original interpretation of a Mexica precinct: double stairs, twin shrines,
  // painted serpent balustrades and carved stone, rather than invented writing.
  const aztec=()=>{
    const stone='url(#w-a2-stone)',darkStone='url(#w-a2-shadow)',gold='#d2aa6b',ochre='#b66c3e',blue='#4a8f95',ink='#34342e';
    const radial=(r,n,start=0)=>Array.from({length:n},(_,i)=>
      path(`M-3 ${-r+10}Q-8 ${-r+1} 0 ${-r-7}Q8 ${-r+1} 3 ${-r+10}Z`,gold,`opacity=".58" transform="rotate(${start+i*360/n})"`)+
      line(`M0 ${-r-3}V${-r+8}`,ink,.7,.55,`transform="rotate(${start+i*360/n})"`)).join('');
    const masonry=(x,y,w,h,rows,cols,opacity=.3)=>{
      const dy=h/rows,dx=w/cols;let d='';
      for(let row=0;row<rows;row++){const yy=y+row*dy;d+=`M${x} ${yy.toFixed(1)}H${x+w}`;
        for(let col=0;col<cols;col++){const xx=x+(col+(row%2?.4:0))*dx;if(xx<x+w-4)d+=`M${xx.toFixed(1)} ${yy.toFixed(1)}v${dy.toFixed(1)}`;}}
      return line(d,b,.8,opacity);
    };
    const reliefPanel=(x,y,s,paint)=>placed(x,y,
      rect(-21,-21,42,42,b,'rx="2" opacity=".16"')+
      line('M-18 16V-15H15V-4H-5V6H15V17H-17M-10-7H6M-10 0V10',paint,2,.7)+
      path('M-21-21-15-23H17L21-18V20H-18Z','none',`stroke="${f}" stroke-width=".7" opacity=".22"`),0,s);
    const serpent=(x,y,s,paint,flip=1)=>placed(x,y,`<g transform="scale(${flip} 1)">`+
      path('M-38 9Q-49-1-45-18L-33-33-10-38 15-30 30-9 54-2 59 13 38 29-7 25-27 18Z',stone,`stroke="${ink}" stroke-width="1.2" stroke-opacity=".6"`)+
      path('M-39-16-28-28-9-30 14-24 24-10-5-9-13 3-31-1Z',paint,'opacity=".63"')+
      path('M-36 7-8 14 35 13 50 6 52 15 35 22-10 20Z',b,'opacity=".48"')+
      path('M-5-7 4 5 13-5 19 7 25 0 29 11H-4Z',gold,'opacity=".8"')+
      ellipse(-16,-17,8,6,ink,'opacity=".65"')+circle(-17,-18,2.8,gold,'opacity=".8"')+
      path('M-31-36-39-46-37-25M-15-37-14-49-3-35M5-30 16-42 16-22',paint,'opacity=".7"')+
      line('M-32-8-25-14M-32 3-21 6M9-16l10 3M38 3l8 1',gold,.8,.5)+
      line('M-21 28-19 38-10 39M-6 27-3 39 4 38',paint,2,.65)+
      '</g>',0,s);
    const torch=(x,y,s,i)=>placed(x,y,
      ellipse(0,11,34,8,b,'opacity=".2"')+
      path('M-19 5-15-32H15L20 5Z',stone,`stroke="${ink}" stroke-width="1" stroke-opacity=".45"`)+
      path('M-25-35H25L19-18H-19Z',darkStone)+ellipse(0,-35,26,7,stone)+ellipse(0,-35,19,4,b,'opacity=".6"')+
      line('M-12-5H12M-11-13H11M-7-28v7m14-7v7',gold,1,.65)+
      group('w-a2-fire',path('M-15-37C-30-54-6-58-10-86C8-75 2-63 12-72C9-58 27-50 15-37Z','#d37d3c','opacity=".8"')+
        path('M-7-37C-18-50 0-59 0-70C14-56 17-44 6-37Z','#f7cf7c','opacity=".9"'),`style="--w-a2-phase:-${i*1.9}s"`)+
      group('w-a2-heat-pool',ellipse(0,-37,57,49,'url(#w-a2-fireglow)'))+
      [0,1].map(n=>group('w-a2-incense',line(`M${-5+n*9}-83C${-17+n*12}-111 ${13-n*4}-118 ${n*6}-145S${-21+n*20}-178 ${-2+n*8}-196`,f,1.5,.2),`style="--w-a2-phase:-${i*4.3+n*5}s"`)).join(''),0,s);
    const agave=(x,y,s,i)=>placed(x,y,group('w-a2-agave',
      [-66,-44,-23,0,21,43,63].map((angle,j)=>placed(0,0,
        path(`M0 0Q${-11+j} -35 ${-3+j%3} ${-102-j%3*15}Q${14-j} -37 0 0Z`,j%2?blue:g,'opacity=".65"')+
        line(`M0 0Q${j-3} -45 ${-3+j%3} ${-93-j%3*15}`,f,.7,.28),angle)).join('')+
      path('M-18 0Q0-14 18 0Z',darkStone),`style="--w-a2-phase:-${i*3.4}s"`),0,s);
    const terrace=(i)=>{
      const yy=879-i*58,left=1234+i*26,right=1510-i*17,depth=91-i*8,top=yy-58;
      return path(`M${left} ${yy}H${right}V${top}H${left+20}Z`,stone)+
        path(`M${right} ${yy}L${right+depth} ${yy-31}V${top-31}L${right} ${top}Z`,darkStone)+
        path(`M${left+20} ${top}H${right}L${right+depth} ${top-31}H${left+58}Z`,g,'opacity=".52"')+
        path(`M${left-5} ${yy}H${right+4}V${yy+8}H${left-9}Z`,a,'opacity=".75"')+
        line(`M${left} ${yy-2}H${right}M${left+20} ${top}H${right}L${right+depth} ${top-31}`,gold,1,.6)+
        masonry(left+22,top+7,right-left-26,36,2,8,.28)+
        line(`M${right+28} ${top-8}V${yy-8}m27-47v36M${right} ${top+22}l${depth} -28`,b,.8,.26)+
        path(`M${left+29} ${yy-3}l11-4 5 4m${67+i*9} -41l8 5-3 8m73 20l10-4 7 5`,'none',`stroke="${b}" stroke-opacity=".25" stroke-width="1.4"`)+
        path(`M${left+31} ${top+14}h23v9h-23ZM${left+93} ${top+34}h31v9h-31ZM${right-51} ${top+12}h18v8h-18Z`,gold,`opacity="${.08+i*.02}"`);
    };
    const shrine=(x,paint)=>placed(x,633,
      path('M-51 0V-91H43L62-105V-13L43 0Z',stone,`stroke="${ink}" stroke-width="1" stroke-opacity=".35"`)+
      path('M43-91 62-105V-13L43 0Z',darkStone)+
      path('M-56-93H47V-105H-56ZM-53-105V-118H-35V-131H-17V-143H0V-131H17V-118H35V-105Z',paint,'opacity=".9"')+
      path('M47-93 68-106V-118L47-105Z',ink,'opacity=".7"')+
      rect(-23,-77,43,71,ink,'opacity=".83"')+rect(-28,-80,8,76,paint,'opacity=".8"')+
      rect(20,-80,7,76,paint,'opacity=".8"')+line('M-26-81H24M-41-20V-68M35-20V-68',gold,1,.65)+
      path('M-17-8V-69H-6V-8Z',gold,'opacity=".1"')+
      reliefPanel(-41,-43,.31,paint)+reliefPanel(35,-43,.31,paint)+
      line('M-51-85H43M-51-15H43M49-81l8-5v57M-31-103h61',f,.8,.2)+
      rect(-7,-126,10,8,gold,'opacity=".6"')+
      path('M-45-19-37-25-31-20M31-5l7-6 5 4','none',`stroke="${b}" stroke-opacity=".25" stroke-width="1"`));
    const stairs=()=>{
      let out=path('M1301 884 1342 636H1443L1482 884Z',darkStone);
      for(let i=0;i<26;i++){const t=i/26,y=880-i*9.4,l=1303+t*40,r=1480-t*38;
        out+=path(`M${l} ${y}H${r}V${y-4}H${l+.6}Z`,stone,'opacity=".87"')+
          line(`M${l} ${y-4}H${r}`,gold,.8,.55);}
      return out+path('M1291 885 1335 637H1345L1310 885ZM1382 885 1390 637H1403L1408 885ZM1472 885 1437 637H1448L1494 885Z',g,'opacity=".8"')+
        line('M1293 884 1338 639M1385 884 1394 639M1476 884 1440 639',f,1,.35)+
        line('M1300 859 1341 645M1395 858V645M1484 858 1443 645',blue,2.2,.48);
    };
    const relief=()=>placed(98,431,
      ellipse(4,10,145,150,b,'opacity=".25"')+circle(0,0,139,darkStone,`stroke="${ink}" stroke-width="3"`)+
      circle(0,0,132,stone)+circle(0,0,124,'none',`stroke="${gold}" stroke-width="2" opacity=".6"`)+
      circle(0,0,114,'none',`stroke="${b}" stroke-width="11" opacity=".24"`)+radial(116,24)+
      circle(0,0,98,'none',`stroke="${gold}" stroke-width="1.5" opacity=".55"`)+
      Array.from({length:12},(_,i)=>
        path('M-18-83-16-97H14L19-82 10-74H-10Z',i%3?ochre:blue,`opacity=".6" transform="rotate(${i*30})"`)+
        line('M-10-83v-8H6v7H-1v5',gold,1.3,.7,`transform="rotate(${i*30})"`)).join('')+
      circle(0,0,68,darkStone)+circle(0,0,61,'none',`stroke="${gold}" stroke-width="2" opacity=".5"`)+
      path('M-27-31Q-42-10-24 18L-32 34-12 42 0 34 12 42 32 34 24 18Q42-10 27-31L12-42 0-32-12-42Z',stone)+
      path('M-27-31-14-37-5-29-15-25-29-15-27 2-16 8-19 20-10 29-16 37-28 32-21 24-31 11-36-7ZM29-22 35-7 28 10 20 17 15 7 23 1 25-13ZM-3-5H3L8 7-7 9Z',ink,'opacity=".38"')+
      path('M-12-37 0-27 12-37 22-31 8-27 0-20-8-27ZM-25 11-16 15-15 21-24 18ZM25 11 16 15 15 21 24 18ZM0-8 3 3-1 6Z',gold,'opacity=".7"')+
      path('M-30-17-8-24-5-13-22-9ZM30-17 8-24 5-13 22-9Z',ink,'opacity=".8"')+
      circle(-16,-15,3,gold)+circle(16,-15,3,gold)+
      path('M-5-9-10 9H10L5-9M-24 21H24L18 32H-18Z',ochre,'opacity=".7"')+
      path('M-32-2-24 1-20 11-8 16M32-2 24 1 20 11 8 16M-19-30-6-35 0-28 6-35 19-30',gold,'fill-opacity="0" stroke="#d2aa6b" stroke-width="1.2" opacity=".65"')+
      line('M-19 24H19M-10 23V31M0 23V32M10 23V31',gold,1,.7)+
      line('M-32-19Q-20-29-7-23M32-19Q20-29 7-23M-24 36l10 2 13-7m25 5-10 2-13-7M-54-2h7m-5 9h5M47-2h7m-7 9h5',gold,.8,.65)+
      [-1,1].map(side=>placed(side*43,0,path('M-5-9H7V9H-5Z',blue)+circle(1,0,4,'none',`stroke="${gold}" stroke-width="1"`))).join('')+
      line('M-91-97-85-78M98 83 87 74M-113 63-99 54M46-122 40-110',b,1.5,.5)+
      line('M-102-87-86-76M88-95 78-83M-7 121-2 108',f,.8,.25),-7);
    return `<defs>
      <linearGradient id="w-a2-stone" x2=".8" y2="1"><stop stop-color="#c1ab80"/><stop offset=".45" stop-color="#a28c67"/><stop offset="1" stop-color="#76684f"/></linearGradient>
      <linearGradient id="w-a2-shadow" x2="1" y2="1"><stop stop-color="#68614e"/><stop offset="1" stop-color="#343b36"/></linearGradient>
      <radialGradient id="w-a2-fireglow"><stop stop-color="#efb16a" stop-opacity=".32"/><stop offset=".5" stop-color="#b66c3e" stop-opacity=".1"/><stop offset="1" stop-color="#b66c3e" stop-opacity="0"/></radialGradient>
      <linearGradient id="w-a2-lake" x2="0" y2="1"><stop stop-color="${blue}" stop-opacity=".08"/><stop offset="1" stop-color="${blue}" stop-opacity=".3"/></linearGradient>
      <radialGradient id="w-a2-haze"><stop stop-color="${g}" stop-opacity=".24"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
      </defs>`+
      circle(1440,287,300,'url(#w-a2-haze)')+
      circle(1450,199,49,gold,'opacity=".4"')+circle(1450,199,60,'none',`stroke="${gold}" stroke-width=".8" opacity=".22"`)+
      path('M1106 644 1178 536 1233 507 1261 461 1314 453 1356 399 1392 386 1452 279 1480 326 1500 340 1537 412 1600 372V900H1106Z',a,'opacity=".14"')+
      path('M1392 386 1452 279 1480 326 1500 340 1484 346 1469 329 1457 348 1444 330 1426 357 1412 354Z',f,'opacity=".19"')+
      line('M1447 357 1420 426 1395 445 1376 490M1479 368l24 67 37 24M1270 486l28 29 41-43',b,1.2,.12)+
      group('w-a2-clouds',path('M1139 337Q1192 318 1228 337T1322 332Q1361 321 1390 333M1391 418Q1456 391 1512 407T1662 392','none',`stroke="${g}" stroke-width="6" stroke-opacity=".15" stroke-linecap="round"`))+
      path('M0 882 150 832 239 850 308 894M1107 902 1280 850 1436 867 1600 833V1000H0Z',a,'opacity=".11"')+
      path('M0 935Q200 909 375 939T800 962T1260 927T1600 942V1000H0Z','url(#w-a2-lake)')+
      group('w-a2-water',line('M24 954h111m13 7h106m913-5h132m42 17h101m45-22h83M-24 979H84m82 9h155m1006-5h202',gold,1.3,.25)+
        line('M35 965h64m59 10h113m1003-9h101m85 24h111',blue,2,.3))+
      // Weathered jamb and low stone enclosure frame the relief without covering the UI.
      group('w-a2-left-wall',path('M0 214H193L219 237 205 277H187V760H0Z',darkStone,'opacity=".65"')+
        path('M0 224H193V255H0ZM0 737H205V766H0Z',stone,'opacity=".75"')+
        rect(0,260,182,472,stone,'opacity=".38"')+masonry(0,263,182,466,13,4,.3)+
        path('M177 267H192V724H176Z',b,'opacity=".3"')+
        line('M0 251H191M0 736H205M165 271V724',gold,1,.48)+
        rect(0,654,179,54,darkStone,'opacity=".8"')+
        [14,58,102,146].map((x,i)=>reliefPanel(x,681,.74,i%2?blue:ochre)).join('')+
        path('M8 230l12 8 17-6 10 8m114 477-12-8-12 6m29-417-10 8 5 12','none',`stroke="${b}" stroke-opacity=".3" stroke-width="1.3"`))+
      relief()+
      // Four substantial bodies with top and side faces, not a flat tier silhouette.
      group('w-a2-temple',Array.from({length:4},(_,i)=>terrace(i)).join('')+
        path('M1304 634H1462L1530 609H1366Z',stone)+
        path('M1301 632H1467V646H1301Z',a,'opacity=".9"')+
        shrine(1359,blue)+shrine(1444,ochre)+
        [0,1,2,3,4].map((i)=>reliefPanel(1284+i*52,851,.55,i%2?blue:ochre)).join('')+
        stairs()+
        path('M1220 901H1517L1620 860V880L1520 924H1210Z',darkStone)+
        path('M1218 898H1520L1620 858H1248Z',stone)+
        line('M1218 898H1520L1620 858M1210 923H1520',gold,1.2,.65)+
        masonry(1233,905,276,16,1,10,.4)+
        [0,1,2].map(i=>serpent(1302+i*92,880,.68,i===0?blue:ochre,i===2?-1:1)).join(''))+
      // A paved causeway sits below the reading area. Etched seams carry perspective.
      path('M0 1000 277 893H364L205 1000ZM1024 1000 1256 922H1539L1600 1000Z',stone,'opacity=".36"')+
      line('M0 986 263 899M35 1000 300 896M95 1000 331 896M0 948h211m-163 25h99M1045 994H1599M1108 974H1570M1165 954H1541M1263 924l-76 76m115-76-27 76m67-76 30 76m13-76 92 76',b,1,.4)+
      torch(217,873,.86,0)+torch(1273,918,.66,1)+torch(1553,861,.62,2)+
      agave(62,986,.92,0)+agave(167,1004,.65,1)+agave(1545,1020,.69,2)+
      group('w-a2-birds',line('M1178 237q8-9 16 0q9-9 17 0M1218 248q5-6 10 0q5-6 10 0',f,1.2,.4))+
      [[205,759],[231,804],[1322,773],[1562,745],[1307,814],[214,683]].map(([x,y],i)=>circle(x,y,.9+i%2,gold,`class="w-a2-ember" opacity=".5" style="--w-a2-phase:-${i*2.7}s"`)).join('');
  };

  const shadow=()=>`<defs><linearGradient id="w-shadow-wall" x2="1" y2=".5"><stop stop-color="${g}" stop-opacity=".24"/><stop offset="1" stop-color="${a}" stop-opacity=".08"/></linearGradient>
    <linearGradient id="w-shadow-beam" x2=".4" y2="1"><stop stop-color="${f}" stop-opacity=".13"/><stop offset="1" stop-color="${f}" stop-opacity="0"/></linearGradient>
    <radialGradient id="w-shadow-sphere" cx=".3" cy=".23" r=".8"><stop stop-color="${g}"/><stop offset=".6" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs>`+
    group('w-shadow-colonnade',
      path('M-15 730V345A133 133 0 0 1 251 345V730H223V345A105 105 0 0 0 13 345V730Z','url(#w-shadow-wall)')+
      line('M-7 730V345A125 125 0 0 1 243 345V730',a,1,.4)+
      path('M27 730V378A87 87 0 0 1 201 378V730H184V378A70 70 0 0 0 44 378V730Z',a,'opacity=".17"')+
      line('M0 513H18M217 513H250M1 631H16M220 631H248M16 731H247',a,2,.3)+
      path('M13 345V730H70V385Q38 357 13 345Z',b,'opacity=".2"'))+
    group('w-shadow-windowlight',path('M20 400 180 361 353 1000H83Z','url(#w-shadow-beam)')+
      path('M1363 160H1467L1650 1000H1417Z','url(#w-shadow-beam)'))+
    group('w-shadow-staircase',Array.from({length:8},(_,i)=>{
      const x=1280+i*21,y=970-i*42,w=320-i*20;return path(`M${x} ${y}H${x+w}V${y-19}H${x+24}Z`,'url(#w-shadow-wall)')+
        line(`M${x} ${y}H${x+w}M${x+24} ${y-19}H${x+w}`,a,1,.4)+
        path(`M${x+w-51} ${y}H${x+w}V${y-19}H${x+w-39}Z`,b,'opacity=".16"');
    }).join('')+
      path('M1427 657V331H1574V657Z',a,'opacity=".21"')+path('M1440 657V344H1560V657Z',b,'opacity=".7"')+
      path('M1440 344 1487 371V657H1440Z',g,'opacity=".17"')+
      line('M1427 657V331H1574M1440 344H1560',f,1,.17))+
    placed(1400,175,group('w-shadow-mobile',
      line('M0 0V103',a,1,.5)+
      path('M0 103 36 135 0 165-36 135Z','url(#w-shadow-wall)',`stroke="${a}" stroke-opacity=".45"`)+
      line('M0 103V165M-36 135H36',f,1,.16)
    ))+
    group('w-shadow-mobile-cast',path('M1340 930 1376 917 1462 970 1419 984Z',a,'opacity=".15"'))+
    placed(168,866,group('w-shadow-orb',ellipse(17,52,70,12,a,'opacity=".1"')+circle(0,0,49,'url(#w-shadow-sphere)','opacity=".6"')+
      circle(-15,-17,10,f,'opacity=".045"')))+
    group('w-shadow-floor',line('M0 979 269 892 302 897M0 959 255 878M1300 1000 1600 875',a,1,.14));

  return {blackhole,cosmic,midnight,amber,desert,cave,aztec,shadow};
});
