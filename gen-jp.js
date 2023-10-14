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
const addCk=(lines,sclines,fn)=>{
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
}

const convert=({fn,lines,memo})=>{
    const outfn=desfolder+fn.replace('.txt','.off');
    const memofn=desfolder+fn.replace('.txt','-notes.off');
    const sc= readTextLines(scfolder+fn.replace('.txt','.sc.off'));

    lines=prolog(fn,lines);
    lines=autoAlign(lines, sc , fn);
    if (~lines[1].indexOf('経」')) {
        lines[0]=lines[0]+lines[1];//move 経」 to first line
        lines[1]='';
    }
    lines=epilog(fn,lines);
    addCk(lines,sc,fn);
    
    writeChanged(outfn,lines.join('\n'),true)
    writeChanged(memofn,memo.join('\n'),true)
}
files.map(dofile).map(convert)