const combinnextline=(lines,pat,count=1)=>{ //經名被品名擠到下一行
    const at=lines.indexOf(pat);
    if (~at) {
        for (let i=0;i<count;i++) { //接後面幾行？
            lines[at]+=lines[at+i+1];
            lines[at+i+1]='';
        }
    } else {
        console.log('cannot combine',pat)
    }
}

export const epilog=(fn,lines)=>{
    if (fn=='mn1.txt') {
        combinnextline(lines,'^n439「小双品」')
    } else if (fn=='mn2.txt') {
        combinnextline(lines,'^n107「比丘品」')
        combinnextline(lines,'^n282「王品」')
        combinnextline(lines,'^n383「婆羅門品」')
    } else if (fn=='mn3.txt') {
        combinnextline(lines,'^n272「分別品」')
    } else if (fn=='sn1.txt') {
        combinnextline(lines,'^n11「ナンダナ品」（『相応部』1-11）')
        combinnextline(lines,'^n21「剣品」')
        combinnextline(lines,'^n31「サトゥッラパ身品」')
        combinnextline(lines,'^n41「燃焼品」（『相応部』1-41）')
        combinnextline(lines,'^n51「老品」')
        combinnextline(lines,'^n61「征服品」（『相応部』1-61）')
        combinnextline(lines,'^n71「断品」（『相応部』1-71）')

        combinnextline(lines,'^n102「種々異学品」')
        combinnextline(lines,'^n112「コーサラ相応」',2)
        combinnextline(lines,'^n132「第三品」')
        combinnextline(lines,'^n137「悪魔相応」',2)
        combinnextline(lines,'^n162「比丘尼相応」')
        combinnextline(lines,'^n182「第二品」')
        combinnextline(lines,'^n197「優婆塞品」')
        combinnextline(lines,'^n209「ヴァンギーサ相応」')
        combinnextline(lines,'^n235「夜叉相応」')
        combinnextline(lines,'^n247「帝釈相応」',2)
        combinnextline(lines,'^n257「第二品」')
        combinnextline(lines,'^n267「第三品」')
    } else if (fn=='sn2.txt') {
        combinnextline(lines,'^n21「十力品」')
        combinnextline(lines,'^n31「カラーラ・カッティヤ品」')
        combinnextline(lines,'^n41「居士品」')
        combinnextline(lines,'^n73「中略〔品〕」')
        combinnextline(lines,'^n95「第二品」（『相応部』14-11）')
    } else if (fn=='sn3.txt') {
        combinnextline(lines,'^n22「荷物品」（『相応部』22-22）');
        combinnextline(lines,'^n103「辺品」');
        combinnextline(lines,'^n224「第二の行品」');
        combinnextline(lines,'^n250「第三の行品」');
        combinnextline(lines,'^n276「第四の行品」');
    } else if (fn=='sn4.txt') {
        combinnextline(lines,'^n104「軛安穏者品」');
    } else if (fn=='sn5.txt') {
        combinnextline(lines,'^n21「邪性品」')
        combinnextline(lines,'^n31「行道品」（『相応部』45-31）');
        combinnextline(lines,'^n161「尋求品」');
        combinnextline(lines,'^n172「暴流品」');
        combinnextline(lines,'^n312-323「再ガンガー略品」');
        combinnextline(lines,'^n324-333「再不放逸品」');
        combinnextline(lines,'^n334-345「再力所作品」');  
        combinnextline(lines,'^n357-366「再暴流品」'); 

        combinnextline(lines,'^n461-470「暴流品」'); 
        combinnextline(lines,'^n587-596「暴流品」');
        combinnextline(lines,'^n695-704「暴流品」'); 
        combinnextline(lines,'^n977「出入息相応」「一法品」'); 

        combinnextline(lines,'^n511「老品」');
        combinnextline(lines,'^n531「覚分品」');
        combinnextline(lines,'^n541-552「ガンガー略品」');
        combinnextline(lines,'^n833「鉄球品」');
        combinnextline(lines,'^n845-856「ガンガー略品」');
        combinnextline(lines,'^n923-934「禅相応」',2);
        combinnextline(lines,'^n997「預流相応」「ヴェールドヴァーラ品」');
        combinnextline(lines,'^n1047「有慧品」');
    }

    return lines;
}