/* generate aligned japanese translation*/

import {nodefs,autoAlign,readTextLines, filesFromPattern,writeChanged, fromObj} from 'ptk/nodebundle.cjs';

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
    let paranum='',prevparanum='';
    const out=[];
    for (let i=0;i<lines.length;i++) {
        const line=lines[i];
        if (~line.indexOf('^n')) {
            paranum=line.slice(2).replace(/\-\d+/,'');
            if (paranum!==prevparanum) out.push('^n'+paranum)
            prevparanum=paranum;
        } else if (line.charAt(0)=='㉆') {
            out.push(line.slice(1));
        }
    }
    return {fn,lines:out};
}
const addCk=(lines,sclines)=>{
    for (let i=0;i<lines.length;i++) {
        const scline=sclines[i];

        const line=lines[i];
        const m= ((scline||'').match(/\^ck#?([a-z\d]+)/));
        if (m) {
            const m2=line.match(/「([^」]+経)」/);
            if (!m2) console.log('cannot replace ck',line)
            else lines[i]=lines[i].replace(/「([^」]+経)」/,'^ck#'+m[1]+'「'+m2[1]+'」')
        }
    }
}
const convert=({fn,lines})=>{
    const outfn=desfolder+fn.replace('.txt','.off');
    const sc= readTextLines(scfolder+fn.replace('.txt','.sc.off'));

    if (fn=='dn3.txt') {
        const at=lines.indexOf('^n294')
        let extra='';
        for (let i=287;i<294;i++) {
            extra+='\n^n'+i+'\n';
        }
        lines.splice( at,0,extra);
        lines=lines.join('\n').split('\n')
        
    }   
    lines=autoAlign(lines, sc , fn);
    if (~lines[1].indexOf('経」')) {
        lines[0]=lines[0]+lines[1];//move 経」 to first line
        lines[1]='';
    }
    let content=lines.join('\n');
    addCk(lines,sc);


    writeChanged(outfn,content,true)
}
files.map(dofile).map(convert)