const replaceLine=(lines,from,to)=>{
    const at=lines.indexOf(from)
    if (~at) {
        lines[at]=to;
    } else {
        console.log('cannot replace',from)
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
        replaceLine(lines,'^n553','');
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
        
    }
    return lines;
}