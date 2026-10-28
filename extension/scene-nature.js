// Nature collection: original local vector compositions. Only the selected scene mounts.
(globalThis.GoogleRefreshedScenePacks??=[]).push(({a,g,f,b,path,circle,rect,group,line})=>{
  const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
  const at=(x,y,body,transform='')=>`<g transform="translate(${x} ${y}) ${transform}">${body}</g>`;
  const noise=(i,salt)=>{let x=Math.imul(i+1,2654435761)^salt;x=Math.imul(x^(x>>>16),2246822507);return ((x^(x>>>13))>>>0)/4294967296;};
  const leaf=(x,y,s,r,color=g)=>at(x,y,path('M0 0C-30-19-40-64-8-102C29-84 42-31 0 0Z',color,'opacity=".65"')+line('M0 0Q-9-47-8-94M-6-34-25-51M-8-55 16-72',f,1,.23),`rotate(${r}) scale(${s})`);
  const ripple=(d,color=g,w=1.5,opacity=.4)=>line(d,color,w,opacity);
  const bloom=(x,y,s,color='#d995ad')=>at(x,y,
    [0,72,144,216,288].map(r=>`<g transform="rotate(${r})">${path('M0 5C-26-2-30-29-10-38C11-48 28-24 13-7Z',color,'opacity=".8"')}${line('M0 0 1-28',f,.8,.18)}</g>`).join('')+circle(0,0,7,'#dec68e','opacity=".9"')+circle(1,-2,3,f,'opacity=".35"'),`scale(${s})`);
  const pine=(x,y,s=1)=>at(x,y,path('M-5 0H5V190H-5Z',a,'opacity=".5"')+
    path('M0-30Q-11 0-28 16L-13 14Q-29 37-49 54L-23 48Q-42 75-66 96L-37 88Q-55 116-79 139Q-30 127 0 137Q35 128 79 139Q55 116 37 88L66 96Q42 75 23 48L49 54Q29 37 13 14L28 16Q11 0 0-30Z',g,'opacity=".55"')+
    line('M-28 16Q0 7 28 16M-48 54Q0 38 48 54M-65 96Q0 79 65 96M-77 139Q0 121 77 139','#e9f2f6',3,.36),`scale(${s})`);
  const snowflake=(x,y,s,phase)=>at(x,y,group('n-snowflake',
    [0,60,120].map(r=>line('M0-8V8M0-4-3-6M0-4 3-6M0 4-3 6M0 4 3 6',f,1,.55,`transform="rotate(${r})"`)).join(''),
    `style="--n-delay:-${phase}s;--n-snow-duration:${14+phase%11}s;--n-snow-drift:${Math.floor(phase)%2?18:-13}px"`),`scale(${s})`);
  const fish=(x,y,s,color,flip=1)=>at(x,y,group('n-reef-fish',
    path('M-32 0C-17-23 14-25 38-2C16 22-15 23-32 0Z',color,'opacity=".75"')+
    path('M-31 0-53-20-50 20Z',color,'opacity=".6"')+path('M-12-18 0-35 16-19M-12 17 5 29 17 17',a,'opacity=".55"')+
    line('M-12-16Q-1 0-10 17M1-20Q15 0 3 20',f,3,.4)+circle(25,-4,2.5,b,'opacity=".8"')+
    line('M31 5 37 2',b,1,.45),`style="--n-fish-speed:${14+x%7}s;--n-fish-phase:-${x%9}s"`),`scale(${s*flip} ${s})`);
  const crystal=(x,y,s,r)=>at(x,y,path('M0-125 31-77 28 30 0 58-29 30-34-78Z','url(#n-ice-prism)',`stroke="${g}" stroke-opacity=".35"`)+
    path('M0-125 4-60 28 30 0 58Z',f,'opacity=".18"')+path('M-34-78-9-63 0 58-29 30Z',a,'opacity=".25"')+
    line('M0-125-9-63 4-60 31-77M-9-63 0 58M4-60 0 58',f,1,.35),`rotate(${r}) scale(${s})`);

  const ocean=()=>`<defs>
    <linearGradient id="n-ocean-depth" x2="0" y2="1"><stop stop-color="${g}" stop-opacity=".24"/><stop offset="1" stop-color="${a}" stop-opacity=".48"/></linearGradient>
    <linearGradient id="n-ocean-curl" x2=".7" y2="1"><stop stop-color="${g}"/><stop offset=".45" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <radialGradient id="n-ocean-beacon"><stop stop-color="#e4d9b5" stop-opacity=".35"/><stop offset="1" stop-color="#e4d9b5" stop-opacity="0"/></radialGradient></defs>`+
    group('n-ocean-far',path('M-150 795Q100 738 370 796T930 799T1660 759V1060H-150Z','url(#n-ocean-depth)')+
      ripple('M-150 795Q100 738 370 796T930 799T1660 759',g,1,.45)+
      Array.from({length:7},(_,i)=>ripple(`M${-30+i%2*50} ${822+i*22}q140-27 254 4M${1250+i%3*28} ${797+i*21}q145-21 293 5`,f,1,.16)).join(''))+
    group('n-ocean-breaker',path('M-90 1010V738C-24 544 166 560 215 669C248 744 183 818 121 780C89 761 91 721 122 706C142 698 160 708 167 724C167 671 79 660 37 716C-9 776 36 844 114 871C225 907 367 888 484 1010Z','url(#n-ocean-curl)','opacity=".75"')+
      path('M-90 738C-24 544 166 560 215 669C244 736 190 802 135 784C181 788 206 751 198 717C191 671 148 647 109 653C26 665-5 748 29 804C-25 773-36 744-90 738Z',f,'opacity=".28"')+
      ripple('M-60 734C3 588 158 590 197 675C230 742 175 796 128 770M-42 760C-8 650 74 634 126 663M15 817Q72 860 152 876M74 863Q165 929 319 933',f,2,.5)+
      ripple('M-8 828Q-3 880 117 916M71 897Q154 952 277 960M-22 910Q70 971 184 982',g,2,.5)+
      [[25,657,3],[69,631,2],[101,634,4],[166,657,2],[191,700,3],[176,761,2],[34,798,3],[76,848,2],[135,878,3]].map(([x,y,r])=>circle(x,y,r,f,'opacity=".35"')).join(''))+
    `<g transform="translate(1440 714)">`+group('n-ocean-lighthouse',
      path('M-151 262-122 203-58 172-28 195 14 151 84 184 105 240 176 275Z',a,'opacity=".5"')+
      path('M-66 193-28 214 14 151 11 223 77 253 84 184 105 240 176 275H-151Z',b,'opacity=".22"')+
      path('M-34 176-24-98H24L35 176Z',f,'opacity=".65"')+path('M-27-17H28L30 28H-29ZM-31 79H32L34 124H-33Z',a,'opacity=".75"')+
      path('M8-98H24L35 176H8Z',b,'opacity=".24"')+rect(-33,-134,66,37,b,'rx="3" opacity=".65"')+
      rect(-25,-129,50,25,'#e5d4a0','opacity=".65"')+line('M-10-129V-105M10-129V-105',a,2,.7)+
      path('M-43-136 0-164 43-136Z',a,'opacity=".85"')+line('M0-164V-176M-48-97H48M-45-107V-96M45-107V-96',a,2,.7)+
      path('M-9 176V140Q0 130 9 140V176Z',b,'opacity=".7"')+rect(-4,44,8,19,b,'rx="3" opacity=".6"')+
      group('n-ocean-lamplight',circle(0,-116,107,'url(#n-ocean-beacon)')+path('M-25-124-282-198V-69L-25-106Z','#d5d4b2','opacity=".07"'))
    )+'</g>'+
    `<g transform="translate(258 739) scale(.65)">`+group('n-ocean-yacht',line('M0-74V59',a,2,.6)+path('M-5-69-66 44H-5Z',f,'opacity=".43"')+
      path('M5-46 53 44H5Z',g,'opacity=".7"')+path('M-78 56H65L47 74H-54Z',a,'opacity=".6"')+
      ripple('M-84 86Q-15 75 67 84M-65 94H44',g,1,.4))+'</g>';

  const spring=()=>`<defs><radialGradient id="n-spring-light"><stop stop-color="${g}" stop-opacity=".28"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient></defs>`+
    circle(25,520,430,'url(#n-spring-light)')+circle(1520,770,360,'url(#n-spring-light)')+
    group('n-spring-orchard',line('M-30 1000C83 762 64 483 160 205M102 388Q44 289-35 271M103 416Q227 371 261 242M79 635Q175 559 220 509',a,5,.6)+
      [[153,220,.7],[213,343,.8],[252,259,.58],[107,390,.7],[31,306,.65],[83,536,.7],[175,561,.65]].map(([x,y,s],i)=>bloom(x,y,s,i%2?'#d99bb4':'#e4b8c2')).join('')+
      [[140,264,.58,-43],[112,351,.65,57],[79,490,.68,-60],[103,579,.58,58],[193,531,.5,49]].map(([x,y,s,r])=>leaf(x,y,s,r)).join(''))+
    group('n-spring-garden',
      [[1350,825,1],[1450,763,.85],[1533,889,1.1]].map(([x,y,s],i)=>at(x,y,
        line('M0 175Q-10 93 0 0',a,3,.6)+leaf(-4,107,.5,-60)+leaf(0,133,.6,51)+
        path('M-32-28Q-19-23-18-50L0-28Q18-50 19-24L33-30Q39 14 0 30Q-37 13-32-28Z',i%2?'#dba98b':'#cf87a6','opacity=".8"')+
        line('M-18-23Q-19 13 0 30M0-27V28M18-24Q22 10 0 30',f,1,.3),`scale(${s})`)).join('')+
      [0,1,2].map(i=>at(1410+i*70,968-i*28,
        line('M0 55Q-15-87 3-185',a,2,.6)+Array.from({length:6},(_,j)=>at(j%2?12:-7,-160+j*25,
          path('M-8-6Q0-19 9-6L13 12Q2 19-12 10Z','#b8a1cf','opacity=".75"')+line('M-6 10 4 13',f,1,.28))).join(''))).join(''))+
    group('n-spring-grass',Array.from({length:22},(_,i)=>{const x=i<11?i*23:1350+i%11*25,h=30+i*17%70;return line(`M${x} 1015q${i%2?15:-15}-${h*.65} ${i%2?8:-8}-${h}`,a,1.4,.4);}).join(''))+
    at(1408,320,group('n-spring-butterfly',group('n-spring-wings',path('M0 0C-32-58-66-27-37 9C-60 35-13 41 0 4C35 42 65 11 38-7C63-53 17-52 0 0Z','#d6b577','opacity=".8"')+
      line('M0 0-33-22M0 2-29 21M0 0 32-24M0 2 30 20',a,1,.35))+line('M0-10V14M-1-7-7-14M1-7 8-14',a,2,.7)))+
    at(205,709,group('n-spring-bee',ellipse(0,0,14,8,'#d7bc77','opacity=".9"')+line('M-5-7V7M3-7V7',a,3,.6)+
      group('n-spring-bee-wings',ellipse(-4,-9,7,11,f,'opacity=".35"')+ellipse(6,-9,7,11,f,'opacity=".35"'))+circle(13,-1,3,a,'opacity=".75"')));

  const ice=()=>`<defs><linearGradient id="n-ice-prism" x2=".7" y2="1"><stop stop-color="${f}" stop-opacity=".6"/><stop offset=".42" stop-color="${g}" stop-opacity=".65"/><stop offset="1" stop-color="${a}" stop-opacity=".45"/></linearGradient>
    <radialGradient id="n-ice-glow"><stop stop-color="${g}" stop-opacity=".22"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient></defs>`+
    circle(1400,320,320,'url(#n-ice-glow)')+circle(50,810,380,'url(#n-ice-glow)')+
    group('n-ice-massif',path('M-30 1000V720L27 622 83 657 123 563 184 578 227 691 285 1000ZM1260 1000 1298 699 1370 602 1451 585 1545 659 1630 625V1000ZM1377 1000V826C1368 744 1450 751 1473 832L1486 1000Z','url(#n-ice-prism)','opacity=".75" fill-rule="evenodd"')+
      path('M27 622 48 811 83 657 84 895 123 563 135 826 227 691 184 578ZM1298 699 1339 868 1370 602 1397 704 1451 585 1437 710 1545 659 1518 895 1630 625V1000H1486L1473 832C1450 751 1368 744 1377 826V1000H1260Z',a,'opacity=".18"')+
      line('M27 622 48 811 9 903M123 563 135 826 83 657M1451 585 1437 710M1370 602 1397 704M1545 659 1518 895',f,1.8,.45)+
      line('M1369 998V824C1361 732 1457 739 1481 831L1495 1000',f,2,.38)+
      line('M16 744 74 770M86 705 131 725 185 696M1525 760 1595 729M1514 818 1572 800M1315 745 1352 773',f,1.2,.32)+
      path('M1394 770 1398 823 1406 766 1415 809 1420 767 1428 820 1433 774Z',f,'opacity=".25"'))+
    group('n-ice-shards',crystal(63,877,.8,-15)+crystal(144,954,1.15,9)+crystal(1490,934,.6,-21))+
    at(1420,251,group('n-ice-rosette',
      [0,60,120,180,240,300].map(r=>`<g transform="rotate(${r})">${line('M0 0V-92M0-27-22-45M0-27 22-45M0-55-17-70M0-55 17-70M0-78-10-88M0-78 10-88',g,2,.7)}${path('M0-8-8-16 0-24 8-16Z',f,'opacity=".35"')}</g>`).join('')+
      circle(0,0,13,'none',`stroke="${a}" opacity=".5"`)))+
    group('n-ice-sheen',line('M28 887 209 629M1330 934 1568 617',f,5,.24)+
      [[76,742],[228,813],[1435,755],[1550,498]].map(([x,y])=>at(x,y,path('M0-10 2-2 10 0 2 2 0 10-2 2-10 0-2-2Z',f,'opacity=".65"'))).join(''))+
    group('n-ice-lake',ellipse(1440,979,170,11,'none',`stroke="${g}" opacity=".3"`)+ellipse(100,985,150,8,'none',`stroke="${f}" opacity=".2"`));

  const snow=()=>`<defs><linearGradient id="n-snow-bank" x2="0" y2="1"><stop stop-color="${f}" stop-opacity=".3"/><stop offset="1" stop-color="${g}" stop-opacity=".28"/></linearGradient>
    <radialGradient id="n-snow-window"><stop stop-color="#e8c78f" stop-opacity=".4"/><stop offset="1" stop-color="#e8c78f" stop-opacity="0"/></radialGradient></defs>`+
    group('n-snow-distance',Array.from({length:10},(_,i)=>pine(i*190-50,880+(i%3)*25,.6+i%3*.18)).join(''),'opacity=".25"')+
    group('n-snow-dunes',path('M-80 1000V933Q164 814 410 950T960 987Q1290 850 1700 952V1050H-80Z','url(#n-snow-bank)')+
      line('M-80 933Q164 814 410 950M1110 947Q1360 870 1660 948',f,1.5,.25))+
    group('n-snow-pines',pine(58,672,1.5)+pine(206,814,1.1)+pine(1546,765,1.4))+
    `<g transform="translate(1384 807)">`+group('n-snow-cabin',
      path('M-92-36 18-108 126-40V126H-92Z',a,'opacity=".55"')+
      path('M-111-42 17-141 143-42 126-29 16-111-97-27Z',g,'opacity=".85"')+
      path('M-111-42 17-141 143-42Q108-49 83-69L16-120-62-55Q-82-37-111-42Z','#eaf1f6','opacity=".7"')+
      path('M59-113V-155H83V-94Z',a,'opacity=".6"')+path('M55-155Q70-164 87-154V-148H55Z','#eaf1f6','opacity=".7"')+
      line('M-86-1H120M-86 22H120M-86 45H120M-86 68H120M-86 91H120M-86 113H120',b,2,.23)+
      rect(-65,10,42,44,b,'rx="2" opacity=".65"')+rect(-60,15,32,34,'#d7b984','opacity=".8"')+
      rect(58,12,39,43,b,'rx="2" opacity=".65"')+rect(63,17,29,33,'#d7b984','opacity=".7"')+
      line('M-44 15V49M-60 32H-28M78 17V50M63 34H92',a,2,.75)+
      path('M-5 126V48Q14 30 31 48V126Z',b,'opacity=".55"')+circle(21,87,2,'#d7b984','opacity=".7"')+
      path('M-12 126H41L54 139H-22ZM-29 141H61L75 151H-42Z',g,'opacity=".65"')+
      group('n-snow-windowlight',circle(-43,33,83,'url(#n-snow-window)'))+
      group('n-snow-smoke',line('M70-168C44-188 89-204 66-230S69-272 84-282',g,9,.13)+line('M70-168C44-188 89-204 66-230S69-272 84-282',f,1,.25))
    )+'</g>'+
    Array.from({length:31},(_,i)=>snowflake(noise(i,73)*1600,35+noise(i,911)*910,.4+noise(i,347)*.65,noise(i,811)*25)).join('');

  const coralreef=()=>`<defs><linearGradient id="n-reef-ray" x2=".2" y2="1"><stop stop-color="${g}" stop-opacity=".2"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></linearGradient>
    <linearGradient id="n-reef-shell" x2="1" y2="1"><stop stop-color="#9dbea0"/><stop offset="1" stop-color="${a}"/></linearGradient></defs>`+
    group('n-reef-sunrays',path('M0 0H128L260 780H64ZM1390 0H1456L1600 790H1458Z','url(#n-reef-ray)'))+
    group('n-reef-bed',path('M0 1000V940Q169 851 350 979T1010 999Q1335 865 1600 947V1000Z',a,'opacity=".22"'))+
    group('n-reef-branches',line('M94 1000Q102 863 77 750M87 829 35 796 17 730M91 883 155 846 174 782M80 775 121 727 111 681M1522 1000Q1495 869 1519 717M1508 826 1437 775 1427 722M1511 781 1574 736 1588 686M1507 891 1571 859 1594 808','#ca8eaa',9,.65)+
      line('M35 796 62 746M155 846 129 802M121 727 151 700M1437 775 1470 732M1574 736 1547 698M1571 859 1539 824','#dca0b6',5,.7)+
      [[17,730],[62,746],[174,782],[111,681],[151,700],[1427,722],[1588,686],[1547,698],[1594,808]].map(([x,y],i)=>circle(x,y,5+i%3,'#deadc2','opacity=".7"')).join(''))+
    group('n-reef-fan',line('M1334 1005Q1287 878 1364 773M1334 962 1285 880M1334 942 1398 855M1328 917 1369 832M1337 866 1320 816',a,3,.65)+
      Array.from({length:13},(_,i)=>line(`M1333 975Q${1250+i*12} ${847-i%3*15} ${1262+i*13} ${795+i%4*18}`,'#d8a889',1,.4)).join(''))+
    group('n-reef-tubes',Array.from({length:8},(_,i)=>{const x=12+i*26,y=937+i%3*18;return path(`M${x-8} 1020V${y}Q${x} ${y-17} ${x+8} ${y}V1020Z`,i%2?'#b5a7bd':'#99b6b4','opacity=".55"')+ellipse(x,y,8,4,b,'opacity=".5"');}).join(''))+
    group('n-reef-seagrass',Array.from({length:13},(_,i)=>{const x=i<7?200+i*21:1370+i%6*29,h=50+i*19%105;return path(`M${x} 1010Q${x-29} ${980-h*.5} ${x-5} ${1010-h}Q${x+4} ${975-h*.5} ${x+8} 1010Z`,g,'opacity=".43"');}).join(''))+
    fish(150,529,1.35,'#d7b977')+fish(1420,479,.7,'#a9c5ce',-1)+fish(1484,528,.4,'#c9a5b9',-1)+
    `<g transform="translate(1440 248) rotate(-12)">`+group('n-reef-turtle',
      group('n-reef-turtle-fins',path('M-36-15Q-85-73-96-48Q-75-10-42 8M-24 28Q-49 71-19 65L9 29M23-26Q61-66 69-35L43-2M32 22Q67 49 72 26L49 10','#8daaa1','opacity=".75"'))+
      ellipse(1,0,49,36,'url(#n-reef-shell)','opacity=".8"')+path('M-20-24 11-31 34-12 28 18 1 29-27 13Z','none',`stroke="${g}" stroke-width="1.4" opacity=".5"`)+
      line('M-20-24-10-8 12-10 34-12M-10-8-12 12 1 29M12-10 18 10 28 18M-12 12 18 10',g,1.4,.5)+
      ellipse(55,-3,18,12,'#9cb9a3','opacity=".8"')+circle(62,-7,1.5,b,'opacity=".7"')
    )+'</g>'+
    group('n-reef-bubbles',[[38,620],[182,843],[111,497],[74,753],[221,903],[1491,766],[1443,554],[1581,822],[1517,422],[1401,927]].map(([x,y],i)=>at(x,y,
      circle(0,0,3+i%3*2,'none',`stroke="${f}" stroke-width="1" opacity=".32" class="n-reef-bubble" style="--n-delay:-${i*1.83}s"`))).join(''));

  const hawaii=()=>`<defs><linearGradient id="n-hawaii-sea" x2="0" y2="1"><stop stop-color="${g}" stop-opacity=".2"/><stop offset="1" stop-color="${a}" stop-opacity=".32"/></linearGradient>
    <linearGradient id="n-hawaii-hills" x2="1" y2="1"><stop stop-color="${g}"/><stop offset="1" stop-color="${a}"/></linearGradient></defs>`+
    group('n-hawaii-tradeclouds',path('M-70 240Q-7 216 61 234Q118 205 185 246Q247 222 290 261Q148 253 86 269Q7 248-70 263ZM1290 177Q1350 149 1404 179Q1455 152 1530 192Q1578 175 1640 205Q1480 206 1397 213Z',g,'opacity=".15"'))+
    group('n-hawaii-island',path('M1200 947 1300 803 1366 749 1417 630 1472 641 1541 773 1630 863V1000Z','url(#n-hawaii-hills)','opacity=".55"')+
      path('M1417 630 1410 737 1366 749 1300 803 1262 906 1370 848 1427 760 1472 641Z',b,'opacity=".24"')+
      path('M1417 630 1444 650 1472 641 1459 660 1439 666Z','#b3ad86','opacity=".35"')+
      line('M1444 672 1427 760 1370 848M1472 680 1493 764 1567 866M1335 822 1313 896',g,1,.4))+
    group('n-hawaii-lagoon',path('M-100 1000V887Q150 853 420 935T1000 979Q1330 882 1690 915V1050H-100Z','url(#n-hawaii-sea)')+
      ripple('M-100 887Q150 853 420 935M1220 946Q1390 896 1650 921',f,2,.3)+
      ripple('M1280 960Q1440 919 1610 947M10 951Q166 930 288 970',g,2,.5))+
    group('n-hawaii-palm',path('M-20 1010Q101 703 142 338L159 341Q145 721 20 1010Z',a,'opacity=".5"')+
      path('M149 345C80 217-28 210-90 266Q51 231 149 345C89 168 186 144 248 199Q163 186 149 345C216 220 308 253 332 313Q237 276 149 345C80 304 7 352-6 425Q55 363 149 345C211 335 260 390 232 454Q217 392 149 345Z',g,'opacity=".6"')+
      line('M149 345Q68 240-62 264M149 345Q155 183 225 194M149 345Q249 264 315 303M149 345Q50 337 8 399',a,1,.45)+
      [[150,357],[163,363],[143,375]].map(([x,y])=>ellipse(x,y,9,12,a,'opacity=".55"')).join(''))+
    `<g transform="translate(136 913) rotate(-11)">`+group('n-hawaii-hibiscus',
      leaf(-10,24,1.2,-75,a)+leaf(20,40,1.05,71,g)+
      [0,72,144,216,288].map(r=>`<g transform="rotate(${r})">${path('M0 10C-22 2-47-19-33-43C-20-65 13-54 25-34C42-16 28 5 0 10Z','#d68d96','opacity=".8"')}${line('M0 7-13-35M-2-1-26-26',f,1,.19)}</g>`).join('')+
      circle(0,0,11,'#c27c88','opacity=".8"')+line('M0 0Q18-22 21-48','#e1c983',3,.9)+
      [[21,-48],[16,-43],[26,-42],[20,-37]].map(([x,y])=>circle(x,y,3,'#efdaa3','opacity=".9"')).join('')
    )+'</g>'+
    at(315,875,group('n-hawaii-canoe',path('M-57 45H65L42 62H-32Z',a,'opacity=".65"')+line('M-8-60V45M-45 57-67 70 53 70 42 59',a,2,.55)+
      path('M-3-57 43 30H-3Z','#d5a085','opacity=".7"')+line('M-3-39 29 22',f,1,.28)),'scale(.65)')+
    group('n-hawaii-frangipani',[[45,659,.55],[227,743,.4],[1512,934,.4]].map(([x,y,s],i)=>at(x,y,group('n-hawaii-drifting-flower',bloom(0,0,s,'#dfd7af'),`style="--n-delay:-${i*2.3}s"`))).join(''));

  const fjord=()=>{
    const left='M-30 168C22 148 67 168 95 201C115 220 157 218 175 252C195 285 175 330 199 362C222 394 204 439 221 477C235 512 210 553 226 590C252 647 214 685 236 729C256 771 238 798 258 835C279 872 295 894 336 916C354 929 367 944 375 961L-30 1003Z';
    const right='M1630 154C1576 140 1542 177 1515 201C1492 222 1452 206 1429 245C1412 279 1429 316 1406 348C1380 383 1400 419 1378 457C1355 494 1375 536 1354 574C1334 611 1350 646 1325 683C1302 718 1318 750 1298 786C1279 819 1301 847 1332 864C1361 881 1344 906 1390 922C1452 943 1559 928 1630 951Z';
    const spruce=(x,y,s,shade=1)=>at(x,y,group('n-fjord-spruce',
      path('M0-126C-9-105-15-97-27-83L-13-87C-22-67-32-59-41-47L-22-53C-32-32-43-20-56-8L-30-13C-44 5-55 18-68 28C-43 23-22 23 0 29C23 24 45 27 68 31C52 17 42 3 32-12L54-7C41-20 31-33 21-53L42-46C31-60 22-72 12-87L27-82C13-101 7-111 0-126Z',a,`opacity="${.45*shade}"`)+
      path('M0-126C-1-88 5-53 1 27C20 21 36 21 54 25C34 6 26-19 21-53L13-53C9-86 5-103 0-126Z',g,`opacity="${.16*shade}"`)+
      line('M0-101V49',b,2,.27),`style="--n-fjord-wind-delay:-${((x*.029)%11).toFixed(2)}s"`),`scale(${s})`);
    return `<defs>
      <linearGradient id="n-fjord-left-rock" x2="1" y2=".35"><stop stop-color="${g}" stop-opacity=".56"/><stop offset=".45" stop-color="${a}" stop-opacity=".5"/><stop offset="1" stop-color="${b}" stop-opacity=".8"/></linearGradient>
      <linearGradient id="n-fjord-right-rock" x2="1" y2=".2"><stop stop-color="${b}" stop-opacity=".6"/><stop offset=".4" stop-color="${a}" stop-opacity=".5"/><stop offset="1" stop-color="${g}" stop-opacity=".4"/></linearGradient>
      <linearGradient id="n-fjord-inlet" x2=".4" y2="1"><stop stop-color="${g}" stop-opacity=".06"/><stop offset=".55" stop-color="${g}" stop-opacity=".2"/><stop offset="1" stop-color="${a}" stop-opacity=".38"/></linearGradient>
      <linearGradient id="n-fjord-cascade" x2="0" y2="1"><stop stop-color="#d1e5e9" stop-opacity=".65"/><stop offset=".8" stop-color="#c8e2e6" stop-opacity=".45"/><stop offset="1" stop-color="#c8e2e6" stop-opacity="0"/></linearGradient>
      <linearGradient id="n-fjord-haze" x2="0" y2="1"><stop stop-color="${g}" stop-opacity="0"/><stop offset=".6" stop-color="${g}" stop-opacity=".14"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></linearGradient>
      <clipPath id="n-fjord-left-face">${path(left)}</clipPath><clipPath id="n-fjord-right-face">${path(right)}</clipPath></defs>`+
      group('n-fjord-distant-valley',
        path('M-40 850C98 721 189 640 290 699C371 750 413 706 496 760C561 803 626 783 712 838C809 900 894 827 977 783C1051 745 1122 779 1204 699C1294 612 1432 694 1630 777V1000H-40Z',a,'opacity=".075"')+
        path('M-40 914C160 759 274 772 390 828C515 888 597 860 701 904C803 943 913 893 1033 826C1175 749 1313 781 1630 894V1000H-40Z',g,'opacity=".075"'))+
      path('M-40 1000V957C157 925 274 960 388 956C559 949 616 914 741 910C862 906 922 876 873 857C836 843 819 821 840 799C858 778 840 762 814 753C865 769 882 789 857 812C833 836 891 851 909 867C951 904 857 924 779 936C632 956 592 981 448 1000Z','url(#n-fjord-inlet)')+
      path('M-40 954C233 903 451 958 734 945C1000 932 1282 893 1630 937V1040H-40Z','url(#n-fjord-inlet)')+
      group('n-fjord-cliffs',path(left,'url(#n-fjord-left-rock)')+path(right,'url(#n-fjord-right-rock)')+
        `<g clip-path="url(#n-fjord-left-face)">`+
        path('M-20 184C44 174 78 208 85 249C105 334 36 407 82 506C107 557 71 635 119 712C158 778 106 864 158 949H-30Z',g,'opacity=".09"')+
        path('M126 201C166 290 123 370 168 459C187 504 162 565 187 607C215 657 174 736 206 784C242 839 210 900 301 962H375C345 901 277 874 258 835C238 798 256 771 236 729C214 685 252 647 226 590C210 553 235 512 221 477C204 439 222 394 199 362C175 330 195 285 175 252Z',b,'opacity=".18"')+
        [0,1,2,3,4,5,6,7].map(i=>{
          const y=307+i*78;return line(`M-20 ${y}C51 ${y-16} 87 ${y+19} 142 ${y+11}S229 ${y+38} 295 ${y+12}`,a,6+i%3,.18)+
            line(`M-20 ${y-5}C51 ${y-20} 87 ${y+13} 142 ${y+7}S229 ${y+31} 295 ${y+8}`,f,.8,.13);
        }).join('')+
        line('M31 267C47 307 28 345 55 377S50 438 72 480M121 374C105 428 143 455 125 507S148 574 141 633M77 621C93 666 71 699 99 739S103 803 129 836M173 726Q157 766 185 812T212 888',b,2,.28)+
        path('M-10 289Q55 265 101 298L111 312Q51 294-10 316ZM45 521Q112 496 177 530L180 545Q109 518 48 542ZM49 759Q127 737 200 769L199 781Q125 757 53 781Z','#799385','opacity=".16"')+'</g>'+
        `<g clip-path="url(#n-fjord-right-face)">`+
        path('M1580 152C1511 234 1561 312 1512 409C1491 449 1532 522 1487 574C1450 619 1491 697 1438 752C1396 798 1421 859 1372 902L1340 955H1630V150Z',g,'opacity=".09"')+
        path('M1437 223C1445 292 1407 324 1425 384C1443 445 1392 487 1417 545C1445 612 1378 640 1405 705C1418 745 1362 801 1378 835C1393 868 1354 887 1390 922L1280 934V300Z',b,'opacity=".14"')+
        [0,1,2,3,4,5,6,7].map(i=>{
          const y=287+i*79;return line(`M1270 ${y+34}C1374 ${y+4} 1416 ${y+37} 1477 ${y+8}S1579 ${y-7} 1650 ${y-22}`,a,7+i%3,.19)+
            line(`M1270 ${y+28}C1374 ${y-2} 1416 ${y+31} 1477 ${y+3}S1579 ${y-12} 1650 ${y-27}`,f,.8,.14);
        }).join('')+
        line('M1560 236Q1527 284 1543 328T1517 418M1468 354Q1496 394 1460 456T1461 535M1551 519Q1517 567 1538 614T1501 708M1412 646Q1432 678 1403 722T1396 791M1533 768Q1510 817 1542 852',b,2,.27)+
        path('M1419 377Q1497 363 1580 330L1597 342Q1491 383 1427 391ZM1356 659Q1444 636 1525 652L1529 665Q1440 652 1361 673ZM1385 817Q1479 804 1604 781L1617 795Q1478 822 1389 833Z','#6f8b80','opacity=".19"')+'</g>'+
        line('M-20 169C22 148 67 168 95 201C115 220 157 218 175 252M1630 154C1576 140 1542 177 1515 201C1492 222 1452 206 1429 245',g,2,.28))+
      group('n-fjord-ridge-forest',
        [[27,177,.21],[45,181,.27],[75,201,.23],[118,229,.28],[139,233,.24],[167,261,.21],[1470,232,.25],[1491,221,.24],[1514,210,.32],[1541,184,.27],[1573,164,.31]].map(([x,y,s])=>spruce(x,y,s,.72)).join(''))+
      group('n-fjord-falls',
        line('M1482 448C1466 506 1497 567 1477 630S1452 701 1464 770C1477 831 1444 867 1438 921',a,10,.16)+
        path('M1478 446C1466 506 1488 558 1472 616C1453 678 1454 718 1460 770C1470 830 1437 867 1436 927H1446C1449 866 1484 827 1475 766C1467 710 1467 679 1483 620C1503 559 1478 500 1487 447Z','url(#n-fjord-cascade)','opacity=".7"')+
        line('M1481 450C1469 507 1492 564 1477 622S1458 709 1466 767C1478 830 1442 870 1441 924','#e0eff1',1.3,.65,'stroke-dasharray="2 18 10 29" class="n-fjord-water-thread"')+
        line('M1490 481C1479 536 1499 566 1488 610S1475 668 1481 713C1489 752 1473 790 1475 823','#d5eaed',.8,.4,'stroke-dasharray="10 17 1 13" class="n-fjord-water-thread n-fjord-water-thread-fine"')+
        line('M1432 540C1420 585 1441 623 1427 667S1410 744 1420 783C1427 814 1412 838 1406 857','#d5e7ea',1,.26,'stroke-dasharray="9 18" class="n-fjord-water-thread n-fjord-water-thread-fine"'))+
      group('n-fjord-cascade-mist',ellipse(1439,923,42,12,'#d0e3e5','opacity=".13"')+ellipse(1423,913,27,17,'#d0e3e5','opacity=".07"')+
        ellipse(1459,916,24,18,'#d0e3e5','opacity=".09"'))+
      group('n-fjord-reflections',
        line('M17 977Q169 946 319 971M1283 965Q1419 935 1601 967',f,1,.18)+
        Array.from({length:13},(_,i)=>{const x=i<6?27+i%3*41:1320+i%4*53,y=964+i*3%35;return line(`M${x} ${y}q${17+i%3*12}-3 ${39+i%3*27} 1`,g,.8,.2+i%3*.04);}).join('')+
        line('M1420 934q28-5 55 0M1413 942q31-6 63-1M1429 951h42','#d0e7e9',1,.25))+
      path('M-30 943C49 894 133 882 206 907C243 920 272 941 301 953L300 1003H-30Z',a,'opacity=".25"')+
      group('n-fjord-foreground-forest',
        [[9,945,.8],[43,931,.98],[92,919,.63],[124,916,.75],[159,917,.4],[20,965,.51],[68,969,.62],[1559,933,.5],[1590,931,.7]].map(([x,y,s])=>spruce(x,y,s)).join(''))+
      at(221,866,group('n-fjord-boathouse',
        path('M-38 15 1-17 39 15V77H-38Z','#a27468','opacity=".85"')+
        path('M-49 16 0-28 50 14 43 22 0-14-41 24Z',a,'opacity=".8"')+
        path('M1-17 39 15V77H1Z',b,'opacity=".15"')+
        line('M-32 21V75M-24 15V75M-16 5V75M-8-3V75M8-5V74M16 3V74M24 13V74M32 20V74','#d7b6a6',.6,.22)+
        rect(-9,35,20,42,b,'opacity=".65"')+rect(-29,31,11,18,'#dcc79d','opacity=".75"')+rect(20,31,10,18,'#dcc79d','opacity=".7"')+
        line('M-36 78H42M-23 32V48M21 39H29',a,2,.75)+
        path('M-45 79H74L88 87H-48Z',a,'opacity=".7"')+line('M-38 87V102M72 86V102M-38 87H73',a,2,.5)))+
      at(1511,965,group('n-fjord-ferry',
        path('M-47-3H49L32 10H-28Z',a,'opacity=".65"')+rect(-30,-17,54,14,'#d1dce0','rx="3" opacity=".6"')+
        line('M-21-12H15',a,3,.65)+line('M2-18V-28M-30 15Q3 12 40 15',a,1,.4)))+
      group('n-fjord-mist-far',path('M-130 686C107 592 238 704 459 682S806 608 1031 678S1415 631 1730 689V790H-130Z','url(#n-fjord-haze)'))+
      group('n-fjord-mist-near',path('M-120 924C127 858 278 919 500 938S875 873 1120 914S1478 898 1730 945V1020H-120Z','url(#n-fjord-haze)'));
  };

  const emeraldCut=(x,y,s,r)=>at(x,y,group('n-emerald-cut',
    path('M-63-113H63L107-69V69L63 113H-63L-107 69V-69Z','url(#n-emerald-cut)',`stroke="${g}" stroke-opacity=".6" stroke-width="1.5"`)+
    path('M-63-113-42-72H42L63-113ZM107-69 64-43V43L107 69ZM63 113 42 72H-42L-63 113ZM-107 69-64 43V-43L-107-69Z',g,'opacity=".35"')+
    path('M-63-113-42-72-64-43-107-69ZM42-72 63-113 107-69 64-43ZM64 43 107 69 63 113 42 72ZM-42 72-63 113-107 69-64 43Z',f,'opacity=".17"')+
    path('M-42-72H42L64-43V43L42 72H-42L-64 43V-43Z',a,'opacity=".5"')+
    path('M-42-72H42L64-43V43L42 72H-42L-64 43V-43Z','none',`stroke="${f}" opacity=".28"`)+
    line('M-63-113-42-72M63-113 42-72M107-69 64-43M107 69 64 43M63 113 42 72M-63 113-42 72M-107 69-64 43M-107-69-64-43',f,1,.25)+
    path('M-42-72H8L-64 43V-24Z',f,'opacity=".12" class="n-emerald-sheen"')+
    path('M42 72H-5L64-43V25Z',g,'opacity=".2" class="n-emerald-sheen-secondary"')
  ),`rotate(${r}) scale(${s})`);
  const emerald=()=>`<defs><linearGradient id="n-emerald-cut" x2="1" y2="1"><stop stop-color="#b5dac8"/><stop offset=".22" stop-color="${g}"/><stop offset=".55" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <radialGradient id="n-emerald-halo"><stop stop-color="${g}" stop-opacity=".25"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient></defs>`+
    circle(1445,330,300,'url(#n-emerald-halo)')+circle(110,808,360,'url(#n-emerald-halo)')+
    emeraldCut(1445,308,1.12,18)+emeraldCut(98,774,1.22,-22)+emeraldCut(239,954,.32,25)+
    group('n-emerald-geology',path('M1290 1000 1355 886 1405 908 1454 803 1518 830 1572 751 1640 829V1000Z',a,'opacity=".24"')+
      path('M1454 803 1458 924 1405 908 1355 886 1321 973M1572 751 1554 914 1518 830',g,'opacity=".28"')+
      line('M1280 965 1366 940 1388 976 1460 927 1533 947 1609 892','#b2a574',1.5,.45))+
    group('n-emerald-veins',line('M-10 182 63 211 41 267 112 305 94 341 177 382M63 211 131 193 160 243M112 305 189 291 225 341M1420 528 1471 571 1441 619 1514 650 1496 699 1580 738M1471 571 1540 553 1567 607','#b6aa7a',1.4,.42))+
    group('n-emerald-glints',[[1410,211],[1518,350],[40,706],[161,822],[1450,847]].map(([x,y],i)=>at(x,y,path('M0-11 2-2 11 0 2 2 0 11-2 2-11 0-2-2Z',f,`opacity=".6" class="n-emerald-glint" style="--n-delay:-${i*1.9}s"`))).join(''));
  return {ocean,spring,ice,snow,coralreef,hawaii,fjord,emerald};
});
