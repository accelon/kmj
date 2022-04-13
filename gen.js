import {kluer,nodefs,glob, writeChanged,filesFromPattern, readTextContent,patchBuf, readTextLines} from 'pitaka/cli';
import Errata from './src/raw-errata.js';
import {parseRaw} from './src/raw-format.js'; 
import {TDenList, diffList,tokenizeIASTPunc} from 'pitaka/denote'
await nodefs; //export fs to global
const srcfolder='./raw/'
const desfolder='./json/'
if (!fs.existsSync(desfolder)) fs.mkdirSync(desfolder);

const pat=process.argv[2]|| 'd1';
const files=filesFromPattern(pat+'?' , srcfolder);

const addDef=(Defs,rawtoken,rawdef)=>{
    let used=false;
    Defs.push([rawtoken,{rawdef}]);
}

files.forEach(fn=>{
    const content=patchBuf( readTextContent(srcfolder+fn), Errata[fn]);
    const sents=parseRaw(content.split(/\r?\n/));
    sents.forEach(({pali,defs},idx)=>{
        const vri=new TDenList(pali,{akey:'vri',lang:'iast'});
        const Defs=[];
        defs.forEach(def=>{
            const at=def.indexOf('\t');
            if (at>0) {
                addDef(Defs,def.slice(0,at),def.slice(at+1));
            } else {//macro
                
            }
        });
        const kmj=new TDenList(Defs,{akey:'kmj',lang:'iast'});
        
        const diff=diffList(vri,kmj);//.filter(it=>it.m);
        if (idx==0){
            console.log(diff);//,vri.data,kmj.data)
        }
    })
})
// readTextContent(srcfolder+fn+)