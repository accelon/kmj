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
const prolog=(fn,lines)=>{
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
    }

    return lines;
}
const combinnextline=(lines,pat)=>{ //經名被品名擠到下一行
    const at=lines.indexOf(pat);
    if (~at) {
        lines[at]=lines[at]+lines[at+1];
        lines[at+1]='';
    } else {
        console.log('cannot combine',pat)
    }
}
const epilog=(fn,lines)=>{
    if (fn=='mn1.txt') {
        combinnextline(lines,'^n439「小双品」')
    } else if (fn=='mn2.txt') {
        combinnextline(lines,'^n107「比丘品」')
        combinnextline(lines,'^n282「王品」')
        combinnextline(lines,'^n383「婆羅門品」')
    } else if (fn=='mn3.txt') {
        combinnextline(lines,'^n272「分別品」')
    }
    return lines;
}
const convert=({fn,lines})=>{
    const outfn=desfolder+fn.replace('.txt','.off');
    const sc= readTextLines(scfolder+fn.replace('.txt','.sc.off'));

    lines=prolog(fn,lines);
    lines=autoAlign(lines, sc , fn);
    if (~lines[1].indexOf('経」')) {
        lines[0]=lines[0]+lines[1];//move 経」 to first line
        lines[1]='';
    }
    lines=epilog(fn,lines);
    addCk(lines,sc);
    
    writeChanged(outfn,lines.join('\n'),true)
}
files.map(dofile).map(convert)