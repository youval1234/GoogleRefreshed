// Original couture atelier: cut, drape, brass and paper; only the active scene mounts.
(() => {
  'use strict';
  (globalThis.GoogleRefreshedScenePacks ??= []).push(({a,g,f,b,path,circle,rect,group,line}) => {
    const brass='#b79872', ivory='#e9dac5', pearl='#f6ead8', plum='#74536d', ink='#423544', clay='#c09387';
    const at=(x,y,body,extra='')=>`<g transform="translate(${x} ${y})" ${extra}>${body}</g>`;
    const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
    const label=(x,y,s,size=10,extra='')=>`<text x="${x}" y="${y}" ${/\bfill=/.test(extra)?'':`fill="${f}"`} font-family="Georgia,serif" font-size="${size}" ${extra}>${s}</text>`;
    const hanger=(x,y,scale,body,i)=>at(x,y,`<g transform="scale(${scale})">`+line('M0-16Q0-29 10-27Q21-25 10-15L3-9-38 15H43L3-9',brass,1.5,.85)+group('q-fashion-garment',body,`style="--q-fashion-delay:-${i*4.1}s"`)+'</g>');
    const jacket=(color,kind)=>path('M-19 13-37 21-58 75-42 83-26 47-29 157Q0 169 30 157L27 46 44 84 61 73 39 21 19 13 1 34Z',color,'stroke="#b79872" stroke-width="1" stroke-opacity=".55"')+
      path('M-19 13 1 34-9 85-23 52-14 44-28 30ZM19 13 1 34 12 85 26 52 17 44 31 30Z',ivory,'opacity=".35"')+
      line('M2 82V157M-23 120l16-3M13 117l15 4M-22 150Q2 160 26 150',brass,1,.65)+[96,114,132].map(y=>circle(6,y,1.8,brass,'opacity=".9"')).join('')+
      line('M-45 70l8 3M39 72l8-3',ivory,.8,.5)+
      (kind?line('M-11 85-18 148M14 85l9 63',ink,.8,.25):rect(-17,83,14,18,brass,'fill-opacity=".1" stroke="#b79872" stroke-opacity=".3"'));
    const slip=()=>path('M-16 13-25 20-27 58Q-11 82-19 102L-48 185Q0 200 50 184L21 102Q13 82 28 58L25 20 16 13 11 37Q0 45-10 37Z','url(#q-fashion-satin)','stroke="#b79872" stroke-width="1" stroke-opacity=".4"')+
      [-15,-7,2,10,17].map((x,i)=>line(`M${x} 93Q${x-i*2} 140 ${x+(i-2)*10} 189`,pearl,.8,.45)).join('')+line('M-16 13-10 37M16 13 11 37M-26 58Q0 75 27 58',brass,1,.5);
    const sketch=()=>line('M0-47Q-8-47-8-37Q-8-28 0-28Q8-28 8-37Q8-47 0-47ZM-4-27V-18L-20-11-31 26M4-27V-18L20-11 32 26M-18-10Q-8 12-14 27L-34 84Q0 94 34 84L14 27Q8 12 18-10M-12 17H12M0 18V84',ink,1.1,.7)+
      line('M-4 28-17 85M4 28 17 85M-26 82H27M-3 91-5 103M3 91l5 12',ink,.7,.45);
    const pin=(x,y)=>circle(x,y,1.7,brass,'opacity=".75"');
    return {fashion:()=>`<defs>
      <linearGradient id="q-fashion-ivory" x2="1" y2=".3"><stop stop-color="#baa68d"/><stop offset=".2" stop-color="#eee3cf"/><stop offset=".45" stop-color="#f4e9d6"/><stop offset=".7" stop-color="#d6c2a6"/><stop offset="1" stop-color="#a68e7e"/></linearGradient>
      <linearGradient id="q-fashion-satin" x2="1" y2=".2"><stop stop-color="#604355"/><stop offset=".2" stop-color="#a48996"/><stop offset=".43" stop-color="#c9afb3"/><stop offset=".6" stop-color="#8d6d81"/><stop offset="1" stop-color="#573b52"/></linearGradient>
      <linearGradient id="q-fashion-chiffon" x2="1" y2=".1"><stop stop-color="${ivory}" stop-opacity=".1"/><stop offset=".4" stop-color="${pearl}" stop-opacity=".6"/><stop offset=".6" stop-color="${ivory}" stop-opacity=".2"/><stop offset="1" stop-color="${pearl}" stop-opacity=".45"/></linearGradient>
      <linearGradient id="q-fashion-mirror" x2="1" y2="1"><stop stop-color="${g}" stop-opacity=".27"/><stop offset=".4" stop-color="${f}" stop-opacity=".06"/><stop offset="1" stop-color="${a}" stop-opacity=".2"/></linearGradient>
      <linearGradient id="q-fashion-paper" x2="1" y2="1"><stop stop-color="${ivory}" stop-opacity=".8"/><stop offset="1" stop-color="${clay}" stop-opacity=".5"/></linearGradient>
      <linearGradient id="q-fashion-beam" x2=".2" y2="1"><stop stop-color="${pearl}" stop-opacity=".25"/><stop offset="1" stop-color="${pearl}" stop-opacity="0"/></linearGradient>
      <radialGradient id="q-fashion-aura"><stop stop-color="${g}" stop-opacity=".3"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
      <pattern id="q-fashion-herringbone" width="20" height="20" patternUnits="userSpaceOnUse">${line('M0 0 10 10 0 20M10 0 20 10 10 20',f,.6,.08)}</pattern>
      <clipPath id="q-fashion-mirror-clip">${path('M27 789V389Q27 302 147 257Q267 302 267 389V789Z',b)}</clipPath>
    </defs>`+
      circle(20,520,430,'url(#q-fashion-aura)')+circle(1550,620,450,'url(#q-fashion-aura)')+
      group('q-fashion-architecture',
        line('M0 901H1600M0 910H1600',brass,1,.2)+path('M0 1000 328 912H1270L1600 1000Z',a,'opacity=".045"')+
        line('M170 1000 430 912M450 1000 620 912M790 1000 798 912M1128 1000 1001 912M1450 1000 1211 912',brass,.7,.1)+
        rect(0,93,300,797,'url(#q-fashion-herringbone)')+rect(1288,93,312,797,'url(#q-fashion-herringbone)')+
        [18,294,1305,1585].map(x=>line(`M${x} 103V890`,brass,.8,.16)).join(''))+
      // A pinned designer's board: original pattern sketch, fabric notes and tactile swatches.
      at(53,131,`<g transform="rotate(-4 99 110)">`+
        rect(0,0,197,225,a,'rx="3" opacity=".13"')+rect(6,6,185,213,b,'rx="2" opacity=".55"')+
        rect(11,12,119,174,'url(#q-fashion-paper)','transform="rotate(3 70 100)"')+
        at(67,76,`<g transform="scale(.73)">${sketch()}</g>`)+
        label(25,176,'DRAPE STUDY',7,'fill="#423544" letter-spacing="2" opacity=".65"')+
        line('M23 183H105M23 190H86',ink,.6,.35)+
        [ivory,plum,clay,g].map((color,i)=>at(138,23+i*39,rect(0,0,37,30,color,'rx="1" opacity=".85"')+line('M3 4H34M3 8H34',f,.6,.14)+circle(18,3,1,brass))).join('')+
        pin(20,17)+pin(122,15)+pin(21,190)+pin(122,194)+label(18,214,'COLLECTION / 01',8,'letter-spacing="1.8" opacity=".55"')+
        path('M70-4 92-2 89 16 67 14Z',ivory,'opacity=".3"')+'</g>')+
      // Arched mirror, casting a restrained moving reflection behind the runway silhouette.
      group('q-fashion-mirror',
        path('M15 805V389Q15 288 147 241Q280 288 280 389V805Z',brass,'fill-opacity=".17" stroke="#b79872" stroke-width="1.5" stroke-opacity=".7"')+
        path('M27 789V389Q27 302 147 257Q267 302 267 389V789Z','url(#q-fashion-mirror)')+
        line('M34 780V389Q34 311 147 267Q260 311 260 389V780',brass,1,.35)+
        `<g clip-path="url(#q-fashion-mirror-clip)">`+group('q-fashion-mirror-light',path('M-27 272H4L324 795H291Z',pearl,'opacity=".15"')+path('M52 265H62L383 800H371Z',pearl,'opacity=".07"'))+'</g>')+
      // Ivory couture dress form. Pleats, cross-grain layers, pinheads and beadwork are individually drawn.
      at(151,803,
        ellipse(4,47,120,13,ink,'opacity=".16"')+path('M-103 30Q4 11 111 30V45Q4 67-103 45Z',brass,'opacity=".25"')+ellipse(4,30,107,17,brass,'opacity=".36"')+
        line('M0-34V23M-27 24H27',brass,5,.75)+
        path('M-11-326V-294Q-36-294-47-274L-32-237Q-16-207-20-183L-33-161Q-3-135 31-161L20-183Q16-207 32-237L47-274Q36-294 11-294V-326Z','url(#q-fashion-ivory)','stroke="#b79872" stroke-width=".9" stroke-opacity=".6"')+
        ellipse(0,-328,12,4,brass,'opacity=".9"')+circle(0,-336,4,brass,'opacity=".9"')+
        line('M0-322V-163M-40-267Q0-243 40-267M-26-216Q0-198 26-216',brass,.8,.45,'stroke-dasharray="2 3"')+
        path('M-47-274Q-21-289-3-263Q19-235 43-273L27-231Q16-209 20-187Q30-157 60-103Q81-53 105 9Q58 36 2 21Q-60 42-107 11L-62-111Q-32-163-20-187Q-16-209-30-232Z','url(#q-fashion-ivory)','stroke="#b79872" stroke-width="1" stroke-opacity=".5"')+
        path('M-47-274Q-14-240 12-247Q30-250 43-273L34-249Q0-219-38-250Z',pearl,'opacity=".65"')+
        line('M-33-233Q-8-213 26-231M-25-208Q-4-197 22-208M-20-188Q2-180 22-186',brass,1,.4)+
        Array.from({length:17},(_,i)=>{const x=-20+i*2.5,foot=-99+i*12.4;return line(`M${x.toFixed(1)} -178Q${(x*1.3).toFixed(1)} -104 ${foot.toFixed(1)} 13`,i%3===0?pearl:brass,i%3===0?1.8:.75,i%3===0?.6:.33);}).join('')+
        group('q-fashion-gown-skirt',
          path('M-18-181Q-45-94-107 11Q-67 2-39 12Q-12 23 2 21Q36 33 67 18L100 8Q58-56 23-181Q2-163-18-181Z','url(#q-fashion-chiffon)')+
          [-84,-68,-50,-32,-13,8,28,47,68,86].map((x,i)=>line(`M${-17+i*4} -173Q${x*.35} -88 ${x} 15`,pearl,.8,.4)).join('')+
          line('M-107 11Q-63 35 2 21Q54 35 105 9',brass,1.2,.55))+
        group('q-fashion-shoulder-drape',
          path('M-39-277Q-75-286-79-254Q-75-225-48-230Q-37-242-53-251Q-79-254-95-218Q-111-180-79-166Q-53-153-68-123Q-100-83-126-90Q-95-65-70-101Q-44-137-66-156Q-86-179-70-203Q-57-219-42-230L-20-257Z','url(#q-fashion-chiffon)','stroke="#e9dac5" stroke-width=".65" stroke-opacity=".35"')+
          line('M-48-271Q-73-279-73-253Q-66-232-51-240M-78-223Q-102-185-77-173Q-48-154-72-123',pearl,1,.4))+
        group('q-fashion-beadwork',Array.from({length:23},(_,i)=>{const t=i/22;return circle(-35+t*70,-262+Math.sin(t*Math.PI)*22,1.05,pearl,'opacity=".8"');}).join('')+
          [0,1,2,3,4].map(i=>circle(11+i*2.5,-224+i*8.5,.9,brass,'opacity=".85"')).join(''))+
        line('M-15-183H18',brass,1,.6)+rect(-3,-186,8,6,brass,'rx="1" opacity=".65"')+
        at(30,-191,group('q-fashion-label',line('M0 0 20 26',brass,.8,.6)+rect(11,26,26,36,ivory,'rx="1" opacity=".8"')+circle(24,30,1.5,ink,'opacity=".5"')+line('M17 42H31M17 47H28M17 52H31',ink,.6,.5))))+
      // A lighting mast and a quiet cone of photography light stop short of the reading area.
      at(300,180,line('M0 0V696M-26 710 0 688 20 709',brass,2,.45)+
        `<g transform="rotate(24)">`+rect(-25,-18,49,31,ink,'rx="3" opacity=".8"')+rect(-17,10,34,7,ivory,'rx="2" opacity=".5"')+
        group('q-fashion-spotlight',path('M-15 17H15L66 550H-126Z','url(#q-fashion-beam)'))+'</g>')+
      // A fashion editorial lightbox, using an original silhouette and typographic grid.
      at(1342,125,rect(0,0,195,279,brass,'rx="3" opacity=".35"')+rect(6,6,183,267,b,'opacity=".85"')+
        label(98,42,'ATELIER',23,'text-anchor="middle" letter-spacing="5"')+label(98,63,'FORM / FABRIC / FEELING',6.5,'text-anchor="middle" letter-spacing="1.4" opacity=".6"')+
        line('M18 78H177M18 254H177',brass,.7,.4)+
        group('q-fashion-poster',
          ellipse(97,230,38,4,a,'opacity=".15"')+path('M91 108Q82 112 87 124L91 129V139L71 148 80 179 61 226Q93 239 125 226L109 179 118 148 100 139V128Q110 113 101 107Z','url(#q-fashion-satin)')+
          path('M87 124Q73 119 78 104Q90 90 107 102L115 114Q101 121 87 124Z',brass,'opacity=".65"')+
          path('M77 151Q94 165 114 148L109 176Q98 183 80 176Z',ivory,'opacity=".48"')+
          line('M83 179 74 225M92 180 90 229M101 180 110 227',pearl,.7,.35))+
        label(98,267,'THE ART OF GETTING DRESSED',6.5,'text-anchor="middle" letter-spacing="1.15" opacity=".6"'))+
      // Three independent hanging pieces: herringbone jacket, silk slip and long tailored coat.
      group('q-fashion-rail',line('M1296 487H1589M1312 480V820M1574 480V820M1290 824H1334M1552 824H1597',brass,3,.65)+
        circle(1312,478,4,brass,'opacity=".8"')+circle(1574,478,4,brass,'opacity=".8"')+line('M1312 496H1574',pearl,.7,.35))+
      hanger(1340,491,.76,jacket(plum,0),0)+hanger(1425,491,.84,slip(),1)+hanger(1516,491,.87,jacket(clay,1),2)+
      // Low bench, rolled textiles, a folded pattern, measurement ribbon and actual tailoring tools.
      group('q-fashion-workbench',path('M-17 894H252L278 919H-17Z',brass,'opacity=".4"')+rect(-17,919,295,12,a,'opacity=".4"')+
        line('M15 931V1000M249 931V1000',brass,4,.4)+
        at(57,883,rect(-44,-24,100,24,plum,'rx="8" opacity=".75"')+ellipse(55,-12,9,12,clay,'opacity=".8"')+ellipse(55,-12,4.5,7,ivory,'opacity=".6"')+
          rect(-34,-43,94,20,ivory,'rx="7" opacity=".8"')+ellipse(59,-33,7,10,brass,'opacity=".6"')+ellipse(59,-33,3,5,ivory,'opacity=".7"')+
          line('M-33-28H46M-40-9H43',pearl,.6,.35))+
        at(160,885,`<g transform="rotate(-9)">`+path('M-31-36H24L34-25V8H-31Z','url(#q-fashion-paper)')+path('M24-36V-25H34',ivory,'opacity=".55"')+
          line('M-23-25Q-2-15 16-24M-18-15Q-11-2-21 5M10-16Q3-2 13 5',ink,.8,.5,'stroke-dasharray="2 2"')+'</g>')+
        at(224,895,ellipse(-22,-6,10,5,'none','stroke="#b79872" stroke-width="2"')+ellipse(-16,6,10,5,'none','stroke="#b79872" stroke-width="2"')+
          path('M-12-5 19-21 1-3 27 5-13 7Z',brass,'opacity=".85"')+circle(-8,0,2,ink,'opacity=".6"'))+
        at(23,890,rect(-9,-35,18,34,clay,'rx="2" opacity=".85"')+ellipse(0,-35,14,4,brass,'opacity=".7"')+ellipse(0,-1,14,4,brass,'opacity=".7"')+
          [-30,-25,-20,-15,-10,-5].map(y=>line(`M-8 ${y}H8`,pearl,.6,.5)).join(''))+
        group('q-fashion-measure',path('M54 889Q111 866 127 901Q143 932 101 936Q70 941 103 967Q127 981 115 1002','none','stroke="#e9dac5" stroke-opacity=".75" stroke-width="8"')+
          line('M64 886l1 7M77 884v5M91 885l-1 7M103 890l-3 5M113 900l-5 3M120 913l-7 1M115 926l-3-5M101 933l-1-5M88 945l6-1M97 958l4-5M111 969l3-5M120 982h-7',ink,.8,.65)))+
      // Draped fabric spill and matte shopping boxes create the lower-right foreground.
      at(1437,915,rect(-112,-73,197,13,a,'rx="2" opacity=".42"')+line('M-97-60V79M71-60V79',brass,4,.5)+
        group('q-fashion-fabric-spill',path('M-95-77Q-46-103-3-74Q45-44 17-5Q-9 32 17 81H115Q54 14 75-34Q91-65 56-78Q-2-92-95-77Z','url(#q-fashion-satin)','stroke="#b79872" stroke-opacity=".4" stroke-width=".7"')+
          [-35,-13,8,27,45].map((x,i)=>line(`M${x} -77Q${x+35} -51 ${x+23} -18Q${x+5} 30 ${x+44} 80`,ivory,.85,.3)).join(''))+
        rect(-134,-33,63,44,ivory,'rx="2" opacity=".75"')+rect(-139,-39,73,9,brass,'rx="2" opacity=".7"')+
        line('M-102-38V11M-133-12H-72',plum,3,.7)+label(-102,-17,'A',12,'text-anchor="middle" fill="#423544" opacity=".7"')+
        at(108,8,line('M-23-17Q-26-64-3-64Q18-64 16-17M-1-17Q-1-53 18-53Q36-53 37-17',brass,1.7,.7)+
          path('M-43-19H47L55 55H-52Z',ivory,'stroke="#b79872" stroke-opacity=".5" fill-opacity=".85"')+
          line('M38-13 45 50M-44 49H45',brass,1,.4)+label(1,16,'ATELIER',8,'text-anchor="middle" letter-spacing="1.2" fill="#423544" opacity=".65"')))+
      group('q-fashion-motes',[[41,387],[242,436],[20,732],[290,790],[1308,423],[1563,457],[1292,712],[1588,778],[260,274],[1329,899]].map(([x,y],i)=>circle(x,y,i%3?1:1.7,brass,`class="q-fashion-mote" opacity=".4" style="--q-fashion-delay:-${i*2.71}s"`)).join(''))
    };
  });
})();
