const replaceLine=(lines,from,to)=>{
    const at=lines.indexOf(from)
    if (~at) {
        lines[at]=to;
    } else {
        console.log('cannot replace line',from)
    }
}
export const prolog=(fn,lines)=>{
    if (fn=='dn3.txt') {
        const at=lines.indexOf('^n294')
        let extra='';
        for (let i=287;i<294;i++) {
            extra+='\n^n'+i+'\n';
        }
        lines.splice( at,0,extra);
        lines=lines.join('\n').split('\n')
    }
    else if (fn=='mn1.txt') {
        const at1=lines.indexOf('^n119')
        lines[at1]='^n119-135';
        //去除120-136
        const at2=lines.indexOf('^n120')
        const at3=lines.indexOf('^n136')
        lines.splice(at2, at3-at2,'');
    } else if (fn=='sn3.txt') {
        replaceLine(lines,'^n225','^n225-240');
        replaceLine(lines,'^n251','^n251-274');
        replaceLine(lines,'^n277','^n277-300');
        replaceLine(lines,'^n352','^n352-361');
        replaceLine(lines,'^n353','');
        replaceLine(lines,'^n362','^n362-391');
        replaceLine(lines,'^n392','');
        replaceLine(lines,'^n363','^n392');
        replaceLine(lines,'^n395','^n395-397');
        replaceLine(lines,'^n396','');
        replaceLine(lines,'^n398','^n398-407');
        replaceLine(lines,'^n399','');
        replaceLine(lines,'^n408','^n408-437');

        replaceLine(lines,'^n438','');
        replaceLine(lines,'^n409','^n438');

        replaceLine(lines,'^n441','^n441-449');
        replaceLine(lines,'^n442','');
        replaceLine(lines,'^n450','^n450-459');
        replaceLine(lines,'^n451','');
        replaceLine(lines,'^n460','^n460-549');
        replaceLine(lines,'^n550','');
        replaceLine(lines,'^n461','^n550');
        replaceLine(lines,'^n552','^n552-561');
        //replaceLine(lines,'^n553','');
        replaceLine(lines,'^n562','^n562-601');
        replaceLine(lines,'^n602','');
        replaceLine(lines,'^n563','^n602');

        replaceLine(lines,'^n612','^n612-616');
        replaceLine(lines,'^n613','');
        replaceLine(lines,'^n617','^n617-621');
        replaceLine(lines,'^n618','');
        replaceLine(lines,'^n622','^n622-626');
        replaceLine(lines,'^n623','');
        replaceLine(lines,'^n627','^n627-631');
        replaceLine(lines,'^n628','');
        replaceLine(lines,'^n632','^n632-636');
        replaceLine(lines,'^n633','');
        replaceLine(lines,'^n637','^n637-641');
        replaceLine(lines,'^n638','');
        replaceLine(lines,'^n642','^n642-646');
        replaceLine(lines,'^n643','');
        replaceLine(lines,'^n647','^n647-651');
        replaceLine(lines,'^n648','');
        replaceLine(lines,'^n652','^n652-656');
        replaceLine(lines,'^n653','');
        replaceLine(lines,'^n657','^n657-660');
        replaceLine(lines,'^n658','');
        replaceLine(lines,'^n681','^n681-688');
        replaceLine(lines,'^n682','');
        replaceLine(lines,'^n689','^n689-695');
        replaceLine(lines,'^n690','');
        replaceLine(lines,'^n696','^n696-701');
        replaceLine(lines,'^n697','');
        replaceLine(lines,'^n702','^n702-706');
        replaceLine(lines,'^n703','');
        
    } else if (fn=='sn4.txt'){
        replaceLine(lines,'^n171', '^n171-173');
        replaceLine(lines,'^n174', '^n174-176');
        replaceLine(lines,'^n177', '^n177-179');
        replaceLine(lines,'^n180', '^n180-182');
        replaceLine(lines,'^n183', '^n183-185');
        replaceLine(lines,'^n186','');
        replaceLine(lines,'^n184','^n186');

        replaceLine(lines,'^n189', '^n189-191');
        replaceLine(lines,'^n192', '^n192-194');
        replaceLine(lines,'^n195', '^n195-197');
        replaceLine(lines,'^n198', '^n198-200');
        replaceLine(lines,'^n201', '^n201-203');
        replaceLine(lines,'^n204','');
        replaceLine(lines,'^n202','^n204');

        replaceLine(lines,'^n207', '^n207-209');
        replaceLine(lines,'^n210', '^n210-212');
        replaceLine(lines,'^n213', '^n213-215');
        replaceLine(lines,'^n216', '^n216-218');
        replaceLine(lines,'^n219', '^n219-221');
        replaceLine(lines,'^n222','');
        replaceLine(lines,'^n220','^n222');

        replaceLine(lines,'^n379', '^n379-408');
    
    } else if (fn=='sn5.txt') {
        const at=lines.indexOf('^n121')
        let extra='';
        for (let i=117;i<121;i++) {
            extra+='\n^n'+i+'\n';
        }
        lines.splice( at,0,extra);

        replaceLine(lines,'^n42','^n42-47');
        replaceLine(lines,'^n43','');
        replaceLine(lines,'^n44','');
        replaceLine(lines,'^n45','');
        replaceLine(lines,'^n46','');
        replaceLine(lines,'^n47','');

        replaceLine(lines,'^n50','^n50-54');
        replaceLine(lines,'^n51','');
        replaceLine(lines,'^n52','');
        replaceLine(lines,'^n53','');
        replaceLine(lines,'^n54','');

        replaceLine(lines,'^n57','^n57-61');
        
        replaceLine(lines,'^n58','');
        replaceLine(lines,'^n59','');
        replaceLine(lines,'^n60','');
        replaceLine(lines,'^n61','');

        replaceLine(lines,'^n64','^n64-68');
        replaceLine(lines,'^n65','');
        replaceLine(lines,'^n66','');
        replaceLine(lines,'^n67','');
        replaceLine(lines,'^n68','');

        replaceLine(lines,'^n71','^n71-75');
        replaceLine(lines,'^n72','');
        replaceLine(lines,'^n73','');
        replaceLine(lines,'^n74','');
        replaceLine(lines,'^n75','');

        replaceLine(lines,'^n78','^n78-82');
        replaceLine(lines,'^n79','');
        replaceLine(lines,'^n80','');
        replaceLine(lines,'^n81','');
        replaceLine(lines,'^n82','');
        replaceLine(lines,'^n85','^n85-89');
        replaceLine(lines,'^n86','');
        replaceLine(lines,'^n87','');
        replaceLine(lines,'^n88','');
        replaceLine(lines,'^n89','');

        replaceLine(lines,'^n92','^n92-95');
        replaceLine(lines,'^n93','');
        replaceLine(lines,'^n94','');
        replaceLine(lines,'^n95','');
        
        replaceLine(lines,'^n98','^n98-102');
        replaceLine(lines,'^n99','');
        replaceLine(lines,'^n100','');
        replaceLine(lines,'^n101','');
        replaceLine(lines,'^n102','');

        replaceLine(lines,'^n122','^n122-126');
        replaceLine(lines,'^n123','');
        replaceLine(lines,'^n124','');
        replaceLine(lines,'^n125','');
        replaceLine(lines,'^n126','');

        replaceLine(lines,'^n128','^n128-132');
        replaceLine(lines,'^n129','');
        replaceLine(lines,'^n130','');
        replaceLine(lines,'^n131','');
        replaceLine(lines,'^n132','');

        replaceLine(lines,'^n134','^n134-138');
        replaceLine(lines,'^n135','');
        replaceLine(lines,'^n136','');
        replaceLine(lines,'^n137','');
        replaceLine(lines,'^n138','');
        replaceLine(lines,'^n258','^n258-269');
        
        replaceLine(lines,'^n270','^n270-279');
        replaceLine(lines,'^n280','^n280-291');
        replaceLine(lines,'^n292','^n292-301');
        replaceLine(lines,'^n302','^n302-310');
        replaceLine(lines,'^n312','^n312-323');
        replaceLine(lines,'^n324','^n324-333');
        replaceLine(lines,'^n334','^n334-345');
        replaceLine(lines,'^n346','^n346-356');
        replaceLine(lines,'^n357','^n357-366');
        replaceLine(lines,'^n417','^n417-428');        
        replaceLine(lines,'^n429','^n429-438');
        replaceLine(lines,'^n439','^n439-450');
        replaceLine(lines,'^n451','^n451-460');
        replaceLine(lines,'^n461','^n461-470');
        replaceLine(lines,'^n541','^n541-552');
        replaceLine(lines,'^n542','');
        //replaceLine(lines,'^n553','^n553-586');
        replaceLine(lines,'^n587','^n587-596');
        
        replaceLine(lines,'^n597','^n597-608');
        
        // replaceLine(lines,'^n609','^n609-640');
        replaceLine(lines,'^n641','^n641-650');
        
        replaceLine(lines,'^n651','^n651-662');
        replaceLine(lines,'^n652','');
        replaceLine(lines,'^n673','^n673-684');
        
        replaceLine(lines,'^n685','^n685-694');
        
        replaceLine(lines,'^n695','^n695-704');
        
        replaceLine(lines,'^n705','^n705-716');
        replaceLine(lines,'^n706','');
        // replaceLine(lines,'^n717','^n717-748');
        replaceLine(lines,'^n749','^n749-758');        
        replaceLine(lines,'^n759','^n759-770');

        // replaceLine(lines,'^n771','^n771-791');
        replaceLine(lines,'^n792','^n792-802');
        replaceLine(lines,'^n803','^n803-812');
        replaceLine(lines,'^n845','^n845-856');
        replaceLine(lines,'^n846','');
        // replaceLine(lines,'^n857','^n857-888');
        replaceLine(lines,'^n889','^n889-898');
        replaceLine(lines,'^n923','^n923-934');
        replaceLine(lines,'^n924','');
        // replaceLine(lines,'^n935','^n935-966');
        replaceLine(lines,'^n967','^n967-976');
        
        replaceLine(lines,'^n1166','^n1166-1171');
        
        replaceLine(lines,'^n1175','^n1175-1177');
        replaceLine(lines,'^n1176','');
        replaceLine(lines,'^n1178','^n1178-1180');
        replaceLine(lines,'^n1179','');
        replaceLine(lines,'^n1181','^n1181-1183');
        replaceLine(lines,'^n1182','');
        replaceLine(lines,'^n1184','^n1184-1186');
        replaceLine(lines,'^n1185','');
        replaceLine(lines,'^n1187','^n1187-1189');
        replaceLine(lines,'^n1188','');
        replaceLine(lines,'^n1190','^n1190-1192');
        replaceLine(lines,'^n1191','');
        replaceLine(lines,'^n1193','^n1193-1195');
        replaceLine(lines,'^n1194','');
        replaceLine(lines,'^n1196','^n1196-1198');
        replaceLine(lines,'^n1197','');
        replaceLine(lines,'^n1199','^n1199-1200');        
        replaceLine(lines,'^n1200','');
        
        //缺了這些段號
        replaceLine(lines,'^n587-596','^n553-586 \n^n587-596');
        replaceLine(lines,'^n641-650','^n609-640 \n^n641-650');
        replaceLine(lines,'^n673-684','^n663-672 \n^n673-684');
        replaceLine(lines,'^n749-758','^n717-748 \n^n749-758');
        replaceLine(lines,'^n792-802','^n771-791 \n^n792-802');
        replaceLine(lines,'^n889-898','^n857-888 \n^n889-898')
        replaceLine(lines,'^n967-976','^n935-966 \n^n967-976');

        lines=lines.join('\n').split('\n')
    }
    return lines;
}