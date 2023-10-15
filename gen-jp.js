/* generate aligned japanese translation*/

import {nodefs,autoAlign,readTextLines, filesFromPattern,writeChanged, fromObj} from 'ptk/nodebundle.cjs';
import {epilog} from './epilog.js'
import {prolog} from './prolog.js'
await nodefs;
const srcfolder='raw/'
const scfolder='../sc/off/';
const desfolder='off/'
const pat=process.argv[2]||'';
let files=filesFromPattern( '?.txt' , srcfolder).filter(it=>it.match(/[dmsa]n\d/));
if (pat) files=files.filter(it=>~it.indexOf(pat))
// files.length=1;
const akbk={
    'dn1.txt':'^ak#dn【長部】^bk#dn1【長部一】',
    'dn2.txt':'^bk#dn2【長部二】',
    'dn3.txt':'^bk#dn3【長部三】',
    'mn1.txt':'^ak#mn【中部】^bk#mn1【中部一】',
    'mn2.txt':'^bk#mn2【中部二】',
    'mn3.txt':'^bk#mn3【中部三】',
    'sn1.txt':'^ak#sn【相應部】^bk#sn1【相應部一】',
    'sn2.txt':'^bk#sn2【相應部二】',
    'sn3.txt':'^bk#sn3【相應部三】',
    'sn4.txt':'^bk#sn3【相應部三】',
    'sn5.txt':'^bk#sn3【相應部三】',
    'an1.txt':'^ak#an【增支部】^bk#an1【增支部一】',
    'an2.txt':'^bk#an2【增支部二】',
    'an3.txt':'^bk#an3【增支部三】',
    'an4.txt':'^bk#an4【增支部四】',
    'an5.txt':'^bk#an5【增支部五】',
    'an6.txt':'^bk#an6【增支部六】',
    'an7.txt':'^bk#an7【增支部七】',
    'an8.txt':'^bk#an8【增支部八】',
    'an9.txt':'^bk#an9【增支部九】',
    'an10.txt':'^bk#an10【增支部十】',
    'an11.txt':'^bk#an11【增支部十一】',

}
const dofile=fn=>{
    const lines=readTextLines(srcfolder+fn);
    let paranum='',prevparanum='',i=0;
    const out=[],memo=[];
    while (i<lines.length){
        let line=lines[i];
        if (~line.indexOf('^n')) {
            paranum=line.slice(2).replace(/\-\d+/,'');
            if (paranum!==prevparanum) out.push('^n'+paranum)
            prevparanum=paranum;
        } else if (line.charAt(0)=='㉆') {
            out.push(line.slice(1));
        } else if (line.charAt(0)=='㊟') {
            out[out.length-1]+='^f'+ memo.length;
            let m='';
            while (line.charAt(0)=='㊟') {
                m+=line;
                i++;
                line=lines[i]
            }
            memo.push(memo.length+'\t'+m.trim());
            if (line.charAt(0)!=='㊟') i--;
        }
        i++;
    }
    return {fn,lines:out,memo};
}
const addCkBk=(lines,sclines,fn)=>{
    for (let i=0;i<lines.length;i++) {
        const scline=sclines[i];
        const line=lines[i];
        let tag,id;
        let m= ((scline||'').match(/\^ck#([a-z\d]+)/));
        if (!m) {
            m= ((scline||'').match(/\^ck(.)n#?([a-z\d]+)/));
            if (m) {
                tag='ck'+m[1]+'n';
                id=m[2];
            }
        } else {
            tag='ck'
            id=m[1]
        }
        if (id&&tag) {
            let m2=line.match(/「([^」]+経)」/);
            if (!m2&&fn.startsWith('an')) {
                m2=line.match(/「([^」]+品〕?)」/);
            }
            if (!m2) {
                console.log('cannot replace ck',line)
                lines[i]='^'+tag+'#'+id+lines[i];
            }
            else lines[i]=lines[i].replace(/「([^」]+)」/,'^'+tag+'#'+id+'「'+m2[1]+'」')
        }
    }
    lines[0]=(akbk[fn]||'')+lines[0];
}

const convert=({fn,lines,memo})=>{
    const outfn=desfolder+fn.replace('.txt','.kmj.off');
    const memofn=desfolder+fn.replace('.txt','-notes.off');
    const sc= readTextLines(scfolder+fn.replace('.txt','.sc.off'));

    lines=prolog(fn,lines);
    lines=autoAlign(lines, sc , fn);
    if (~lines[1].indexOf('経」')) {
        lines[0]=lines[0]+lines[1];//move 経」 to first line
        lines[1]='';
    }
    lines=epilog(fn,lines);
    addCkBk(lines,sc,fn);
    
    writeChanged(outfn,lines.join('\n'),true)
    writeChanged(memofn,memo.join('\n'),true)
}
files.map(dofile).map(convert)