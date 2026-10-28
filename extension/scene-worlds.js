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

  const aztec=()=>`<defs><linearGradient id="w-aztec-stone" x2="1" y2="1"><stop stop-color="${g}"/><stop offset="1" stop-color="${a}"/></linearGradient>
    <radialGradient id="w-aztec-light"><stop stop-color="#d5b075" stop-opacity=".22"/><stop offset="1" stop-color="#d5b075" stop-opacity="0"/></radialGradient></defs>`+
    circle(1460,723,380,'url(#w-aztec-light)')+
    group('w-aztec-far-terrace',path('M1080 1000 1230 873H1310V833H1388V790H1460V836H1520V891H1600V1000Z',a,'opacity=".1"'))+
    placed(1448,941,group('w-aztec-temple',
      Array.from({length:6},(_,i)=>{const y=-i*39,w=176-i*15;return path(`M${-w} ${y}H${w}L${w-11} ${y-35}H${-w+11}Z`,'url(#w-aztec-stone)',`opacity="${.45+i*.035}"`)+line(`M${-w} ${y}H${w}`,f,1,.18)+line(`M${w-11} ${y-35}v35`,b,2,.17);}).join('')+
      path('M-30 0-20-235H20L30 0Z',b,'opacity=".25"')+
      Array.from({length:17},(_,i)=>line(`M${-29+i*.5} ${-i*13.5}H${29-i*.5}`,g,1,.45)).join('')+
      path('M-104-234H104V-247H-104ZM-93-247V-311H-25V-247ZM25-247V-311H93V-247Z','url(#w-aztec-stone)','opacity=".75"')+
      path('M-100-311H-85V-324H-66V-336H-48V-324H-30V-311H-19V-301H-100ZM19-311H30V-324H48V-336H66V-324H85V-311H100V-301H19Z',a,'opacity=".7"')+
      rect(-72,-289,31,42,b,'opacity=".45"')+rect(41,-289,31,42,b,'opacity=".45"')+
      line('M-91-256H-26M27-256H90M-88-295H-30M29-295H87',f,1,.25)+
      line('M-143-20h21m-66-36h25m-11-78h30m5-39h30m195 153h27m-34-78h27m-39-78h20',a,1,.35)+
      [-118,118].map(x=>placed(x,5,line('M0 0V-49M-12 0H12',a,4,.7)+
        group('w-aztec-flame',path('M-8-49Q-18-61-3-80Q0-69 7-84Q19-62 8-49Z','#d9af72','opacity=".7"')+
          path('M-3-49Q-9-58 2-70Q10-59 4-49Z','#f1d3a2','opacity=".8"')))).join('')+
      line('M-190 15H190M-204 26H204',a,2,.4)
    ))+
    placed(99,537,group('w-aztec-stela',
      path('M-59 130-64-121-48-159H48L63-121 58 130Z','url(#w-aztec-stone)','opacity=".52"')+
      line('M-49 113-51-118-40-145H39L51-117 48 114Z',f,1,.2)+
      circle(0,-51,40,'none',`stroke="${a}" stroke-width="3" opacity=".65"`)+circle(0,-51,26,'none',`stroke="${g}" stroke-width="2" opacity=".55"`)+
      Array.from({length:8},(_,i)=>placed(0,-51,path('M-4-41 0-54 4-41Z',a,'opacity=".6"'),i*45)).join('')+
      path('M0-70 15-51 0-32-15-51Z',g,'opacity=".5"')+
      line('M-31 8H-8V31H8V8H31V53H8V76H-8V53H-31Z',a,3,.55)+
      line('M-34 102H34M-29 91H29',f,1,.18)
    ),-4)+
    group('w-aztec-agave',path('M90 1000Q21 894-45 885Q30 872 92 971Q23 817 39 778Q104 860 105 963Q113 846 157 809Q144 904 116 972Q171 897 219 891Q182 960 125 1000Z',g,'opacity=".42"')+
      line('M90 1000Q55 914 39 816M105 1000Q125 909 150 844M111 1000Q174 933 200 909',a,1,.5))+
    group('w-aztec-pollen',[[71,273],[238,714],[1333,416],[1540,479],[1465,661],[91,829]].map(([x,y],i)=>circle(x,y,1.5,'#d0b786',`class="w-aztec-mote" style="--w-phase:-${i*2.1}s" opacity=".45"`)).join(''));

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
