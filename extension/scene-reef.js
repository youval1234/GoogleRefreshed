// A layered reef ecosystem. All marine geometry is local and mounted only on selection.
(() => {
  'use strict';
  (globalThis.GoogleRefreshedScenePacks ??= []).push(({a,g,f,b,path,circle,rect,group,line}) => {
    const at=(x,y,body,extra='')=>`<g transform="translate(${x} ${y})" ${extra}>${body}</g>`;
    const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
    const clownBody='M-40 0C-29-21-5-29 20-19Q38-13 44 0C31 23 10 28-12 18Q-31 13-40 0Z';
    const fishMotion=(x,y,s,flip,body,i,cls='r-fish')=>at(x,y,`<g transform="scale(${s*flip} ${s})">`+group(cls,body,`style="--r-phase:-${i*2.17}s;--r-speed:${18+i*2.3}s;--r-travel:${24+i%3*13}px"`)+'</g>');
    const clown=(x,y,s,flip,i)=>fishMotion(x,y,s,flip,
      group('r-tail',path('M-38 0-62-19Q-67 0-62 19Z','#e89857','stroke="#915744" stroke-width="1.1"')+line('M-42 0-61-11M-42 0-63 0M-42 0-61 11','#f4c48f',.8,.5))+
      path('M-28-13Q-13-39 10-26L25-13M-16 17Q0 35 23 18','#df824c','stroke="#92513b" stroke-width=".8"')+
      path(clownBody,'url(#r-clown-color)','stroke="#925c43" stroke-width="1"')+
      `<g clip-path="url(#r-clown-mask)">`+
      path('M-29-25Q-12-4-22 25L-11 29Q-2 0-14-28ZM4-29Q18-3 5 30L17 28Q29 0 15-27ZM31-18Q24-1 31 19L40 13Q34 0 40-13Z','#f6e3c5','stroke="#715341" stroke-width="1.4"')+'</g>'+
      path('M5 3Q-7-3-13 8Q-4 15 5 3Z','#f0bb71','opacity=".7"')+
      circle(32,-5,3,'#383e37')+circle(32.7,-5.7,.8,'#fff0d4')+line('M40 5l4-1','#714c3b',.8,.8),i);
    const angel=(x,y,s,flip,i)=>fishMotion(x,y,s,flip,
      group('r-tail',path('M-20 0-47-17Q-41 0-47 17Z','#e5c77c','opacity=".85"'))+
      path('M-21 0Q-10-36 15-46Q10-21 31-4Q38 0 31 7Q10 22 18 49Q-11 31-21 0Z','url(#r-angel-color)','stroke="#887860" stroke-width=".8"')+
      path('M-10-24 0-35 4 37-7 27ZM13-39 21-21 20 28 14 43Z','#465c6a','opacity=".8"')+
      line('M-2 25q-4 25-16 40M16 30q10 17 8 30','#d7c78d',1.2,.75)+
      circle(25,-1,2.6,'#334543')+circle(25.5,-1.6,.7,'#f5e7c5')+
      line('M2-34Q4-21 9-12',f,.7,.24),i);
    const tang=(x,y,s,flip,i)=>fishMotion(x,y,s,flip,
      group('r-tail',path('M-35 0-59-19Q-56 0-59 19Z','#e8c66d','stroke="#9e995e" stroke-width=".8"'))+
      path('M-37 0C-20-38 21-32 43-4Q49 0 43 5C20 31-17 31-37 0Z','url(#r-tang-color)','stroke="#365a75" stroke-width="1"')+
      path('M-28-12Q-5-26 16-14Q27-7 35-7L38 1Q12-6-4 11L-22 13Q-5-7-28-12Z','#32475d','opacity=".85"')+
      path('M-7 7Q5-2 14 5Q6 14-7 7Z','#9cc1c8','opacity=".6"')+
      circle(34,-2,2.7,'#263c44')+circle(34.7,-2.8,.7,'#e4ead4'),i);
    const smallFish=(x,y,s,color,flip=1)=>`<g transform="translate(${x} ${y}) scale(${s*flip} ${s})">`+
      path('M-13 0Q0-12 15 0Q0 11-13 0L-24-9V9Z',color,'opacity=".65"')+
      line('M-9-1Q0-5 9-1',f,.6,.25)+'</g>';
    const staghorn=(x,y,s,color,tip,angle=0)=>at(x,y,`<g transform="rotate(${angle}) scale(${s})">`+group('r-staghorn',
      line('M0 4C-1-32 8-59 2-106M1-21Q-30-36-37-71M1-38Q29-51 34-86M5-62Q-15-72-17-111M2-87Q24-105 23-137M-34-60-57-78-60-102M-35-65-24-89-28-107M30-73 56-89 56-118M33-78 20-96 17-114M-13-98-32-116-30-137M19-123 36-141 34-160',color,10,.88)+
      line('M0 0Q-1-32 6-57M-37-69-57-84M33-85 49-100M2-106 20-128',tip,3,.47)+
      line('M-60-96v-5M-28-102v-5M-30-132v-5M-17-106v-5M23-132v-5M34-155v-5M56-113v-5M17-110v-4',tip,6,.7)
    )+'</g>');
    const seaFan=(x,y,s,color)=>at(x,y,`<g transform="scale(${s})">`+group('r-seafan',
      path('M0 14C-39-30-90-65-92-123C-94-171-53-184-23-164C-5-201 40-181 49-154C92-164 113-122 87-91C119-59 73-16 42-14Q13-6 0 14Z',color,'opacity=".42"')+
      line('M0 14Q-16-72-22-166M0 8Q-57-72-83-132M0 8Q33-80 46-153M0 8Q62-34 87-91M-14-65Q-54-87-71-137M-14-65Q12-113 8-165M14-48Q44-58 78-109',color,2.8,.9)+
      [-135,-111,-87,-63].map((v,i)=>line(`M${-69+i*7} ${v}Q-10 ${v-23} ${67-i*4} ${v+4}`,color,1,.65)).join('')+
      line('M-20-18Q-63-102-58-157M-9-1Q-42-84-36-174M9-8Q11-102 27-170M21-13Q56-67 68-142',color,.8,.55)+
      line('M0 14Q-16-72-22-166',f,.8,.18)
    )+'</g>');
    const plate=(x,y,s,color)=>at(x,y,`<g transform="scale(${s})">`+
      path('M-72 0Q-75-13-51-18Q-47-31-24-28Q-11-37 7-27Q32-35 44-19Q69-21 75-7Q79 8 52 13Q26 32-5 22Q-44 29-65 12Z',color,'opacity=".85"')+
      path('M-72 0Q-25 18 20 2T75-7Q79 8 52 13Q26 32-5 22Q-44 29-65 12Z',b,'opacity=".17"')+
      line('M-64-4Q-20 12 16-2T66-8M-33-17Q-5-4 34-13',f,1,.25)+
      path('M-10 21 0 58 18 55 11 19Z',color,'opacity=".45"')+'</g>');
    const grass=(x,y,s,flip=1)=>at(x,y,`<g transform="scale(${s*flip} ${s})">`+group('r-grass',
      path('M0 0Q-35-76-13-149Q-6-79 11 0M11 0Q21-139 63-181Q37-86 24 0M-14 0Q-71-64-66-122Q-39-78 0 0M25 0Q69-106 109-121Q69-59 40 0Z','#618c80','opacity=".65"')+
      line('M11 0Q-10-85-13-149M24 0Q37-86 63-181',g,1,.23)
    )+'</g>');
    const sponge=(x,y,h,w,color)=>at(x,y,
      path(`M${-w} 8Q${-w-6} ${-h*.4} ${-w+3} ${-h}Q0 ${-h-15} ${w-3} ${-h}Q${w+4} ${-h*.5} ${w} 8Z`,color,'opacity=".83"')+
      ellipse(0,-h,w-2,7,b,'opacity=".55"')+ellipse(0,-h+2,w-6,3,color,'opacity=".65"')+
      line(`M${-w+5} ${-h+12}Q${-w+1} ${-h*.5} ${-w+5} 0`,f,1.4,.19)+
      [0,1,2].map(i=>circle(w*.35,-h*.7+i*h*.18,1.3,b,'opacity=".16"')).join(''));
    const turtle=()=>at(1398,283,`<g transform="rotate(-12) scale(1.12)">`+group('r-turtle',
      at(-37,22,group('r-turtle-front-fin',path('M0-6C-20 11-42 48-45 76C-22 65-4 45 16 9Z','#83a78a','stroke="#537c74" stroke-width="1"')+line('M2 5Q-14 43-35 64','#bed0a3',1,.36)))+
      at(47,19,group('r-turtle-back-fin',path('M-8-4Q26 7 43 36Q13 31-12 13Z','#789e83','stroke="#537c74" stroke-width="1"')))+
      at(-34,-28,group('r-turtle-far-fin',path('M-3 5Q-19-13-20-46Q5-32 17-4Z','#668b7b','opacity=".85"')))+
      at(40,-25,group('r-turtle-far-hind',path('M-7 6Q8-17 29-27Q27-6 10 14Z','#648e7c','opacity=".9"')))+
      path('M-49-4Q-62-26-85-22Q-104-18-109-3Q-100 12-82 13Q-66 13-50 8Z','#91af8c','stroke="#577f70" stroke-width="1"')+
      line('M-105-4-101 1M-91 5q9 5 18 1','#4b7467',1,.7)+circle(-91,-9,2.7,'#2e514a')+circle(-90.3,-9.5,.7,'#e2dcb3')+
      path('M56 9 72 3 57-3Z','#71977e')+
      ellipse(0,0,61,41,'url(#r-turtle-shell)','stroke="#507e73" stroke-width="1.8"')+
      path('M-52-18Q-12-48 37-24Q61-7 53 20Q10 50-38 25Q-62 9-52-18Z','none','stroke="#b3c8a0" stroke-width="1" opacity=".6"')+
      path('M-18-18 7-24 25-9 21 14-2 24-22 8ZM-18-18-37-21-48-6-39 12-22 8M7-24 24-33 44-21 44-5 25-9M21 14 40 21 48 8 44-5M-2 24 0 36 25 31 40 21M-22 8-39 12-35 28-15 35 0 36', 'none','stroke="#456d64" stroke-width="1.6" opacity=".72"')+
      path('M-18-18 7-24 25-9Q1-11-22 8Z','#b8c6a0','opacity=".25"')+
      circle(-61,-11,2,'#b5c8a1','opacity=".4"')+circle(-68,-15,1.5,'#b5c8a1','opacity=".4"')
    )+'</g>');
    const coralreef=()=>`<defs><linearGradient id="r-clown-color" x2=".2" y2="1"><stop stop-color="#f6b262"/><stop offset="1" stop-color="#d57749"/></linearGradient><clipPath id="r-clown-mask">${path(clownBody,b)}</clipPath><linearGradient id="r-angel-color" x2="1" y2="1"><stop stop-color="#e9d28c"/><stop offset=".55" stop-color="#c8b87f"/><stop offset="1" stop-color="#8aa9a3"/></linearGradient><linearGradient id="r-tang-color" x2=".4" y2="1"><stop stop-color="#79b7d0"/><stop offset=".6" stop-color="#4e93bd"/><stop offset="1" stop-color="#3f758e"/></linearGradient><linearGradient id="r-turtle-shell" x2="1" y2="1"><stop stop-color="#b9c59b"/><stop offset=".5" stop-color="#84a58a"/><stop offset="1" stop-color="#557d75"/></linearGradient><linearGradient id="r-water-rays" x2=".4" y2="1"><stop stop-color="${g}" stop-opacity=".21"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></linearGradient><radialGradient id="r-water-halo"><stop stop-color="${g}" stop-opacity=".16"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient><linearGradient id="r-rock" x2="1" y2="1"><stop stop-color="#728e89" stop-opacity=".6"/><stop offset="1" stop-color="${a}" stop-opacity=".22"/></linearGradient></defs>`+
      circle(1480,280,430,'url(#r-water-halo)')+
      group('r-surface-rays',path('M42 0H94L280 754H209ZM176 0H204L343 660H297ZM1373 0H1441L1265 741H1216ZM1507 0H1532L1475 606H1434Z','url(#r-water-rays)'))+
      group('r-surface-shimmer',line('M-40 168Q30 133 100 161T246 165M8 205Q93 171 177 197M1300 139Q1386 111 1467 140T1640 137M1394 188Q1482 155 1576 180',f,1.3,.075))+
      group('r-distant-bed',path('M0 1000V911Q175 805 364 937Q640 1025 951 973Q1260 888 1600 873V1000Z',a,'opacity=".13"'))+
      group('r-rock-ledges',
        path('M-30 1000V858L36 821 93 832 144 794 214 810 266 874 316 909 356 1000Z','url(#r-rock)')+
        path('M1210 1000 1247 933 1309 894 1345 816 1412 797 1465 825 1519 779 1581 790 1640 844V1000Z','url(#r-rock)')+
        path('M-30 936 37 878 111 899 163 855 243 900 282 975 318 1000H-30ZM1274 1000 1325 914 1379 899 1431 932 1500 867 1573 890 1630 953V1000Z',b,'opacity=".14"')+
        line('M-10 865 35 844 91 852 146 815 203 830M1280 934 1326 914 1360 838 1410 818 1459 847M1515 799 1567 810 1610 853',g,1.5,.2))+
      seaFan(1435,875,1.16,'#b078a7')+seaFan(153,868,.95,'#c6868c')+
      grass(35,956,1.1)+grass(1575,940,1.1,-1)+grass(1285,1006,.8)+
      staghorn(-7,904,.93,'#c16e6e','#efb29c',-18)+staghorn(89,899,1.05,'#dc916e','#f3c6a0',5)+
      staghorn(1510,888,1.12,'#cc816b','#efb78c',9)+staghorn(1600,923,.9,'#b986b5','#e0b8ce',-12)+
      plate(30,857,.86,'#c87e99')+plate(220,922,1,'#a291bb')+plate(1395,942,1.06,'#d8987a')+
      group('r-sponge-garden',sponge(17,1013,76,15,'#9d9abd')+sponge(53,1007,116,17,'#a4a1c0')+sponge(94,1020,93,14,'#8e91b4')+
        sponge(1492,1014,111,17,'#c8ad7e')+sponge(1531,1022,82,13,'#c69b78')+sponge(1568,1011,141,18,'#c9b58c'))+
      at(183,994,group('r-anemone',
        ellipse(0,0,54,13,'#8f9896','opacity=".6"')+
        Array.from({length:12},(_,i)=>{const x=-43+i*7.8,y=-22-(i*13%30),s=i%2?-1:1;return line(`M${x*.75} 0Q${x+s*11} ${y*.42} ${x} ${y}q${s*-9}-11 ${s*2}-22`,'#d5a2a0',4.5,.8)+circle(x+s*2,y-22,3,'#efc4b6','opacity=".7"');}).join('')
      ))+
      at(1356,1002,group('r-brain-coral',path('M-56 0Q-65-51-23-65Q14-89 48-54Q76-30 58 0Z','#a9b68e','opacity=".78"')+
        line('M-44-6q22-12 9-28t12-19M-18-3q-12-19 9-25t-5-30M8-6q18-12 0-27t15-27M38-8q-18-14 1-25t-8-17','#6f927e',2,.65)))+
      turtle()+
      clown(178,619,.8,1,1)+clown(1380,706,.62,-1,3)+
      angel(1456,541,.81,-1,2)+angel(67,392,.65,1,5)+tang(248,461,.82,1,4)+
      at(1325,191,group('r-school-one',smallFish(0,0,.72,'#c8d8bd',-1)+smallFish(49,-19,.56,'#b6d1c3',-1)+smallFish(91,9,.66,'#b6d1c3',-1)+smallFish(135,-10,.49,'#c8d8bd',-1)))+
      at(69,286,group('r-school-two',smallFish(0,0,.57,'#d6c7a0')+smallFish(39,13,.45,'#dacda8')+smallFish(78,-16,.52,'#d6c7a0')))+
      at(1318,824,group('r-school-three',smallFish(0,0,.52,'#92b8c0')+smallFish(36,-18,.44,'#92b8c0')+smallFish(66,8,.5,'#92b8c0')))+
      group('r-caustics',line('M9 846Q65 826 100 851T187 851M1356 908Q1391 885 1421 909T1519 909M1423 827q49-27 101-9',f,2,.12)+
        line('M36 955Q75 929 121 950M1420 994Q1480 966 1526 984',g,2,.16))+
      group('r-bubbles',[[52,738],[240,815],[1492,663],[1579,476],[1264,907],[113,514]].map(([x,y],i)=>at(x,y,
        circle(0,0,3+i%3,'none',`stroke="${f}" stroke-width=".9" opacity=".36" class="r-bubble" style="--r-phase:-${i*2.37}s"`))).join(''));
    return {coralreef};
  });
})();
