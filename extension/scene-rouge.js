// Le Rouge: an original theatrical horror department store. No remote art or frame loop.
(() => {
  'use strict';
  (globalThis.GoogleRefreshedScenePacks ??= []).push(({a,g,f,b,path,circle,rect,group,line}) => {
    const bone='#e8cdb2', edge='#b99b86', red='#a32436', hot='#dc5c55', deep='#490f20', metal='#8f645a';
    const at=(x,y,body,extra='')=>`<g transform="translate(${x} ${y})" ${extra}>${body}</g>`;
    const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
    const spine=(x,y,n,s=1)=>at(x,y,`<g transform="scale(${s})">`+Array.from({length:n},(_,i)=>at(0,i*16,path('M-4-5Q0-10 4-5L10 0 4 6 0 4-4 6-10 0Z',bone,'opacity=".8"')+line('M-2-4 2 4',deep,.7,.4))).join('')+'</g>');
    const bag=(x,y,s,kind,i)=>at(x,y,`<g transform="scale(${s})">`+group('q-rouge-bag',
      line('M0-300V-46',metal,1,.65)+
      (kind===0?path('M-37-13-32 40H44L38-13Z','url(#q-rouge-leather)','stroke="#b99b86" stroke-opacity=".5"')+path('M-18-12V-31Q3-52 23-31V-12','none','stroke="#b99b86" stroke-opacity=".6" stroke-width="2"')+line('M-32 0H38M-25 4V35M31 4V35',edge,.7,.4)+rect(-4,0,15,13,edge,'rx="1" opacity=".7"'):
      kind===1?path('M-42-16H41L44 34H-44Z','url(#q-rouge-leather)','stroke="#b99b86" stroke-opacity=".4"')+path('M-42-16 0 11 41-16',red,'stroke="#b99b86" stroke-opacity=".4"')+line('M-21-17V-33H22V-17',edge,2,.6)+circle(0,11,3,edge,'opacity=".8"'):
      path('M-32-23Q0-39 32-23L41 30Q0 54-41 30Z','url(#q-rouge-leather)','stroke="#b99b86" stroke-opacity=".35"')+line('M-23-25Q-21-62 0-62Q22-62 23-25',edge,2,.55)+[-21,-9,8,21].map((xx,j)=>line(`M${xx} -21Q${xx+(j-1)*5} 4 ${xx*1.35} 30`,hot,.8,.4)).join(''))+
      line('M0-46V-35',edge,1,.6),`style="--q-delay:-${i*3.2}s;--q-period:${18+i*2}s"`)+'</g>');
    const finger=(x,y,dx,dy,i)=>at(x,y,line(`M0 0Q${dx*.4} ${dy*.5} ${dx} ${dy}`,bone,3.5,.85)+circle(dx*.54,dy*.54,2.8,edge,'opacity=".75"')+path(`M${dx-2} ${dy}q${i%2?5:-5} 10 ${i%2?2:-2} 16l4-12Z`,bone,'opacity=".85"'));
    const lantern=(x,y,angle)=>at(x,y,`<g transform="rotate(${angle})">`+line('M0-90V-18',metal,2,.65)+rect(-17,-21,34,48,metal,'rx="6" opacity=".65"')+ellipse(0,27,17,5,edge,'opacity=".8"')+ellipse(0,29,13,3,bone,'opacity=".9"')+'</g>');
    const rib=(side,y,w,i)=>path(`M${side*4} ${y}C${side*(w*.34)} ${y-8} ${side*w} ${y-22} ${side*w} ${y-4}C${side*(w-3)} ${y+9} ${side*27} ${y+14} ${side*9} ${y+20}L${side*12} ${y+10}Q${side*(w-8)} ${y+2} ${side*(w-4)} ${y-6}Q${side*w*.65} ${y-6} ${side*6} ${y+2}Z`,'url(#q-rouge-ivory)',`opacity="${.93-i*.025}"`);
    const fold=(d,w=2,opacity=.65)=>line(d,hot,w,opacity);
    return {lerouge:()=>`<defs>
      <linearGradient id="q-rouge-leather" x2="1" y2="1"><stop stop-color="#73212c"/><stop offset=".48" stop-color="#a74744"/><stop offset="1" stop-color="#3a1621"/></linearGradient>
      <linearGradient id="q-rouge-tissue" x2="1" y2=".3"><stop stop-color="#4a1020"/><stop offset=".27" stop-color="#ba3541"/><stop offset=".45" stop-color="#e46f61"/><stop offset=".6" stop-color="#8c1b30"/><stop offset=".85" stop-color="#c74747"/><stop offset="1" stop-color="#4b1423"/></linearGradient>
      <linearGradient id="q-rouge-ivory" x2="1" y2=".3"><stop stop-color="#9e736a"/><stop offset=".3" stop-color="#e2bfa3"/><stop offset=".53" stop-color="#f4dfbe"/><stop offset=".7" stop-color="#d7b99e"/><stop offset="1" stop-color="#97666a"/></linearGradient>
      <linearGradient id="q-rouge-stone" x2="0" y2="1"><stop stop-color="${edge}" stop-opacity=".7"/><stop offset=".18" stop-color="${bone}" stop-opacity=".35"/><stop offset=".3" stop-color="${a}" stop-opacity=".38"/><stop offset="1" stop-color="${b}" stop-opacity=".6"/></linearGradient>
      <linearGradient id="q-rouge-spot" x2=".15" y2="1"><stop stop-color="#f1b388" stop-opacity=".3"/><stop offset=".45" stop-color="#e7b68d" stop-opacity=".14"/><stop offset="1" stop-color="#b23e3b" stop-opacity="0"/></linearGradient>
      <linearGradient id="q-rouge-redbeam" x2=".4" y2="1"><stop stop-color="#e65043" stop-opacity=".28"/><stop offset="1" stop-color="#b32e38" stop-opacity="0"/></linearGradient>
      <radialGradient id="q-rouge-floorlight"><stop stop-color="${red}" stop-opacity=".4"/><stop offset=".45" stop-color="${g}" stop-opacity=".14"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>
      <radialGradient id="q-rouge-redlight"><stop stop-color="#cb403d" stop-opacity=".3"/><stop offset="1" stop-color="#7c182b" stop-opacity="0"/></radialGradient>
    </defs>`+
      // Upper gantries, recessed wall panels and irregular carved pilasters establish the shop.
      group('q-rouge-architecture',
        path('M-30 1000V92L273 145V1000Z',a,'opacity=".08"')+path('M1298 1000V156L1624 91V1000Z',a,'opacity=".08"')+
        line('M-20 142 318 201M1290 204 1630 138M-20 154 318 213M1290 216 1630 150',metal,5,.26)+
        [24,92,245,1327,1500,1588].map((x,i)=>rect(x,174+(i%3)*10,5,815,a,'opacity=".23"')+line(`M${x+8} ${184+(i%3)*10}V1000`,edge,.65,.2)).join('')+
        [292,481,668,854].map(y=>line(`M-15 ${y}H285M1314 ${y}H1620`,metal,1,.18)).join('')+
        line('M-40 44 390 109M-30 63 383 126M1244 110 1650 26M1253 128 1655 46',metal,12,.22)+
        line('M14 0 308 94M232 0 414 92M1285 0 1211 94M1550 0 1336 92',metal,7,.17)+
        line('M0 925H1600M0 937H1600',a,1,.2))+
      circle(1460,590,340,'url(#q-rouge-redlight)')+circle(55,770,360,'url(#q-rouge-redlight)')+
      ellipse(1390,949,428,123,'url(#q-rouge-floorlight)')+ellipse(139,960,330,150,'url(#q-rouge-floorlight)')+
      // A red canopy folds in irregular lamellae rather than tidy repeated waves.
      group('q-rouge-canopy',path('M-20 0H361Q274 24 251 61Q218 102 132 99Q74 94 19 134L-20 149Z','url(#q-rouge-tissue)','opacity=".4"')+
        path('M1231 0H1630V139Q1548 80 1483 98Q1417 119 1386 74Q1350 23 1231 0Z','url(#q-rouge-tissue)','opacity=".4"')+
        fold('M-20 41Q92 21 139 54Q198 83 278 21',1.8,.35)+fold('M-20 68Q89 48 131 80Q181 109 249 51',1,.38)+fold('M1304 8Q1425 44 1449 78Q1493 101 1613 65',2,.34)+
        fold('M1384 12Q1430 27 1461 55Q1510 82 1633 28',1,.35))+
      // Uneven suspension points and individually drawn merchandise silhouettes.
      bag(50,258,.85,0,0)+bag(267,192,.68,1,1)+bag(1343,128,.62,2,2)+bag(1552,274,.88,1,3)+bag(1484,94,.57,0,4)+
      lantern(123,155,-15)+lantern(1467,167,13)+
      group('q-rouge-spotlight',path('M1459 197 1492 204 1605 888 1217 888Z','url(#q-rouge-spot)')+
        path('M112 185 140 176 343 953-49 953Z','url(#q-rouge-redbeam)'))+
      // Left display: a faceless bone-and-sinew couture figure framed by its living cloak.
      at(147,522,
        group('q-rouge-cloak',path('M-60-124Q-127-151-154-83Q-126 48-173 221L-198 478Q-95 443-28 478L36 454Q93 490 181 476L114 295Q51 91 77-113Q31-145-60-124Z','url(#q-rouge-tissue)','opacity=".8"')+
          path('M-100-112Q-69 32-118 217L-161 455-111 439Q-56 174-69-79ZM45-114Q11 72 52 229L106 457 150 463Q83 232 75 28L80-108Z',deep,'opacity=".65"')+
          [-113,-87,-60,-37,37,61,83,106].map((xx,i)=>fold(`M${xx*.62} -113Q${xx*.23} ${30+i*2} ${xx*.76} 191T${xx*1.52} 466`,i%3?1.2:2.4,.4+i%3*.1)).join('')+
          line('M-97-98Q-70 71-112 242L-148 443M64-108Q24 99 74 285L123 446',bone,.75,.4))+
        group('q-rouge-effigy',
          // The closed mask is smooth and sculptural, with asymmetric fissure inlays.
          path('M-17-252Q-40-229-31-194L-3-160Q32-172 35-209Q35-245 9-254Z','url(#q-rouge-ivory)')+
          path('M-12-238Q1-214-3-171L8-179Q18-214 4-244Z',deep,'opacity=".86"')+line('M-22-218Q-13-208-12-192M18-228 23-211 17-195',red,1.4,.8)+
          path('M-11-163-13-144-32-132 0-112 34-137 14-149 11-169Z','url(#q-rouge-ivory)')+
          path('M-2-144Q-52-164-88-151L-113-128-68-133Q-30-104-8-112ZM5-144Q35-159 77-144L112-118 70-125Q30-104 10-112Z','url(#q-rouge-ivory)')+
          line('M-90-145-65-141-30-123M27-132 65-139 99-124',bone,1.4,.55)+
          // Red tendons have deliberate branching and tapered paths beneath the ivory ribs.
          path('M-41-113Q-8-92-11-36L-26 57 0 89 27 52 14-37Q12-88 49-113Z','url(#q-rouge-tissue)')+
          [-25,-12,14,26].map((xx,i)=>fold(`M${xx} -108Q${xx*.2} -54 ${xx*.6} -6L${xx*.3} 60`,1.1,.7)).join('')+
          group('q-rouge-thorax',Array.from({length:6},(_,i)=>rib(-1,-113+i*21,49-i*3,i)+rib(1,-111+i*21,52-i*3,i)).join(''))+
          spine(0,-112,11,.74)+
          path('M-28 44-49 69-28 111-5 99 0 81 9 103 31 112 50 65 28 47 25 65 1 56-25 66Z','url(#q-rouge-ivory)')+
          // One articulated arm reaches out; the other drops with an elongated stone hand.
          at(-77,-126,group('q-rouge-arm',path('M0 0-36 57-81 93-84 86-48 43-18-7Z','url(#q-rouge-tissue)')+
            line('M-7 0-42 50-79 89',bone,5,.85)+circle(-41,50,6,edge,'opacity=".9"')+
            path('M-77 87-96 86-113 98-109 109-90 106-79 98Z','url(#q-rouge-ivory)')+
            [-104,-97,-90].map((xx,i)=>finger(xx,101,-15+i*6,28+i*3,i)).join(''), 'style="--q-delay:-3s"'))+
          at(79,-119,group('q-rouge-arm-right',path('M0 0 29 50 27 129 17 130 12 60-16 8Z','url(#q-rouge-tissue)')+
            line('M-5 2 21 57 22 124',bone,5,.85)+circle(20,58,6,edge,'opacity=".9"')+
            path('M17 123 7 135 13 152 29 151 35 135 27 122Z','url(#q-rouge-ivory)')+
            [12,20,28].map((xx,i)=>finger(xx,149,(i-1)*7,34-i*2,i)).join('')))+
          path('M-28 106Q-37 162-26 219L-34 289-23 292-12 218 0 130ZM28 105Q38 174 10 237L22 302 33 299 30 235Q57 163 43 111Z','url(#q-rouge-tissue)')+
          line('M-21 119-26 204-23 219-29 286M31 119 38 191 19 235 29 297',bone,5,.86)+
          path('M-34 285-41 326-25 333-20 314-22 288ZM23 298 28 329 54 331 59 340 19 342 13 301Z','url(#q-rouge-ivory)')+
          circle(-25,217,6,edge,'opacity=".75"')+circle(18,235,6,edge,'opacity=".75"')+
          line('M-18 125-14 151-22 192M34 129 43 160 34 190',hot,1.3,.75)
        ))+
      // Right sculpture: a headless ivory shell unfurling around a red fabric-like core.
      at(1422,650,
        group('q-rouge-plinth',ellipse(0,195,175,28,a,'opacity=".16"')+
          path('M-143 129H143L159 144V164H-158V144Z','url(#q-rouge-stone)')+
          rect(-145,164,290,69,'url(#q-rouge-stone)')+rect(-154,226,308,15,a,'opacity=".4"')+
          line('M-153 149H153M-145 172H145M-143 183H143',bone,1.1,.38)+
          [-113,-62,63,114].map(xx=>line(`M${xx} 185V224`,edge,2,.23)).join('')+line('M-126 180-108 182-103 217M88 174 95 192 88 207',deep,1,.35))+
        group('q-rouge-sculpture',
          // A smooth, hollow collar and asymmetric shoulder shells catch the spotlight.
          path('M-10-349Q-30-380-14-399Q5-414 25-400L37-360 66-351 49-316 15-321Z','url(#q-rouge-ivory)')+
          ellipse(6,-399,18,8,deep,'opacity=".8" transform="rotate(12 6 -399)"')+line('M-8-401Q5-408 22-399',bone,1.8,.85)+
          path('M-10-348Q-49-377-102-344L-139-307-126-287Q-98-318-58-311L-26-288 11-319Z','url(#q-rouge-ivory)')+
          path('M30-350Q85-378 130-341L153-305 134-283Q100-317 66-304L39-285 10-316Z','url(#q-rouge-ivory)')+
          line('M-120-310Q-76-351-27-327M49-327Q91-350 137-309',bone,2,.65)+
          path('M-54-312Q-78-251-56-202Q-43-155-65-100Q-86-32-46 37L14 60 54 9Q60-39 35-94Q22-143 43-190Q65-254 46-307L18-292-19-295Z','url(#q-rouge-ivory)')+
          path('M-20-301Q-44-251-25-206Q-3-165-21-118Q-43-59-17 0L11 37 25 8Q7-48 27-100Q43-150 22-203Q5-243 26-296Z',deep,'opacity=".9"')+
          // Fingers and plates of the crossed stone arm are individually jointed.
          path('M-119-294Q-145-257-130-215L-111-188-93-201-102-232-88-265-58-276-61-294Z','url(#q-rouge-ivory)')+
          path('M-109-210-63-251-34-270-18-264-30-246-64-221-92-196Z','url(#q-rouge-ivory)')+
          [-28,-20,-12,-4].map((xx,i)=>line(`M-49 ${-252+i*3} ${xx} ${-282+i*3} ${xx+10} ${-279+i*3}`,bone,4,.85)).join('')+
          line('M-126-287Q-138-250-121-222M-104-207-63-242',edge,1.2,.7)+
          // Layered clavicle ribs spread into the red drapery; the center stays hollow.
          group('q-rouge-shell-ribs',Array.from({length:5},(_,i)=>
            path(`M-48 ${-288+i*27}Q-13 ${-260+i*29} -28 ${-226+i*29}L-39 ${-209+i*28}Q-19 ${-253+i*27} -58 ${-271+i*27}Z`,'url(#q-rouge-ivory)')+
            path(`M46 ${-289+i*27}Q16 ${-258+i*28} 30 ${-226+i*28}L42 ${-211+i*27}Q24 ${-254+i*27} 57 ${-272+i*27}Z`,'url(#q-rouge-ivory)')).join(''))+
          group('q-rouge-heartcloth',path('M18-353Q-2-323 11-285Q48-245 31-194Q-1-143 18-104Q56-57 17-6Q-4 26 29 50Q50 68 86 98L119 127H-30Q-82 106-48 60Q-22 23-41-7Q-66-54-30-111Q3-160-11-199Q-39-246-11-290Q3-323-6-352Z','url(#q-rouge-tissue)')+
            fold('M9-344Q-10-310 23-265Q51-229 8-163Q-10-123 18-85Q45-48 0 11Q-17 47 29 78L68 120',3,.9)+
            fold('M0-339Q-16-301 9-268Q35-227-7-162Q-23-120 0-79Q23-35-17 7Q-40 50 3 86L38 122',1.7,.8)+
            line('M18-319Q6-293 26-270Q57-230 17-165Q-1-127 30-87Q58-41 11 18Q3 44 48 77L91 121',bone,1,.43)+
            fold('M-4-203Q14-180-10-130M22-104Q-7-69 1-36M-27 31Q-36 59 3 88',1.2,.85))+
          path('M-50 25Q-79 63-65 104L-44 124-12 116Q-57 87-34 52ZM32 43Q77 52 86 103L73 116Q56 80 17 70Z','url(#q-rouge-ivory)','opacity=".9"')+
          line('M-56 54Q-69 89-44 111M35 56Q68 65 75 99',bone,1.2,.75)
        )+
        // Sinewy fabric spills over the display lip in asymmetric hanging streamers.
        group('q-rouge-display-drape',path('M-103 107Q-37 63 27 94Q77 78 129 116L151 134Q94 137 53 121Q3 145-49 125L-46 184Q-32 211-56 244Q-75 263-42 280L-98 270Q-117 243-97 216L-100 155-130 149Z','url(#q-rouge-tissue)')+
          path('M35 121Q57 153 49 194Q36 220 62 244L47 280 91 267Q97 239 80 221Q67 187 87 147L104 130Z','url(#q-rouge-tissue)')+
          fold('M-101 120Q-66 104-46 116Q-8 137 27 111M-75 127-71 207Q-86 244-65 262M-62 129-56 198Q-68 235-55 251M46 128Q70 169 58 197Q53 222 70 243L62 265',2,.74)+
          line('M-106 128Q-73 115-48 126M-90 146-85 209Q-99 243-80 260M76 141Q61 184 73 212',bone,.9,.42))
      )+
      // Angular bags rest in the cloth instead of floating above it.
      at(1330,761,`<g transform="rotate(-12)">`+path('M-30-28H28L34 13H-34Z','url(#q-rouge-leather)','stroke="#b99b86" stroke-opacity=".55"')+line('M-13-29V-43H15V-29M-27-19H24M0-19V-8',edge,1.5,.75)+rect(-4,-11,10,8,bone,'rx="1" opacity=".55"')+'</g>')+
      at(1517,778,`<g transform="rotate(17)">`+path('M-36-38H34L39 9H-39Z','url(#q-rouge-leather)','stroke="#b99b86" stroke-opacity=".5"')+line('M-18-39V-53H18V-39M-34-27H33',edge,1.6,.7)+rect(-5,-27,12,11,edge,'rx="1" opacity=".65"')+'</g>')+
      // A floor of living crimson folds: layered channels, veins and tapered hems.
      group('q-rouge-floorcloth',path('M-40 919Q49 942 120 913Q214 879 286 934Q344 969 426 947Q482 922 539 956Q610 979 717 970Q812 949 926 973Q1044 981 1113 946Q1216 916 1322 950Q1427 974 1492 940Q1565 904 1640 929V1030H-40Z','url(#q-rouge-tissue)','opacity=".6"')+
        path('M-25 983Q105 946 216 981Q299 1005 403 983Q525 956 602 993Q744 1010 883 988Q1014 965 1103 994Q1214 1018 1325 981Q1468 938 1626 986V1020H-25Z',deep,'opacity=".56"')+
        fold('M-40 950Q68 971 139 940Q214 907 286 956Q343 990 437 963M1114 975Q1226 937 1336 969Q1449 994 1530 961L1631 951',2,.65)+
        fold('M-31 969Q100 987 173 962Q235 940 295 977M997 1004Q1148 967 1257 1000M1353 985Q1490 951 1629 981',1.2,.6)+
        line('M10 938Q63 955 113 935M188 929Q234 918 279 948M1157 953Q1228 934 1293 952M1449 963Q1536 929 1600 944',bone,.8,.27))+
      // Dust lives in the light cones; each speck has a distinct phase and position.
      group('q-rouge-dust',[[1399,212],[1366,302],[1503,364],[1304,487],[1513,605],[1439,723],[1263,827],[1517,903],[81,276],[198,352],[40,468],[246,621],[103,714],[257,846]].map(([x,y],i)=>circle(x,y,i%3?1:1.6,bone,`class="q-rouge-mote" opacity=".35" style="--q-delay:-${i*2.19}s"`)).join(''))
    };
  });
})();
