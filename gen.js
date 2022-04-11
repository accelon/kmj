import {kluer,nodefs,glob, writeChanged,filesFromPattern, readTextContent,patchBuf, readTextLines} from 'pitaka/cli';
import Errata from './src/raw-errata.js';
import {parseRaw} from './src/raw-format.js';
import {TList,TIASTList,IASTTokenizer,combineList} from 'pitaka/denote'
import {isIAST} from 'pitaka/utils'

await nodefs; //export fs to global
const srcfolder='./raw/'
const desfolder='./json/'
if (!fs.existsSync(desfolder)) fs.mkdirSync(desfolder);

const pat=process.argv[2]|| 'd1';
const files=filesFromPattern(pat+'?' , srcfolder);
const pattern=/([a-zA-Zḍṭṇñḷṃṁṣśṅṛāīūâîû]+[a-zA-Zḍṭṇñḷṃṁṣśṅṛāīūâîû\-\(\)]+[a-zA-Zḍṭṇñḷṃṁṣśṅṛāīūâîû’]+)/ig;
const addDef=(Defs,rawtoken,def)=>{
    let used=false;
    const tokens=IASTTokenizer(rawtoken,{tokenOnly:true,pattern});
    if (tokens.length==1) {
        Defs.push([rawtoken , def]);
    } else {
        for (let i=0;i<tokens.length;i++) {
            if ( isIAST(tokens[i])) {
                if (!used) {
                    Defs.push([ tokens[i], def]);
                    used=true;
                } else {
                    console.log("more than one token", rawtoken, tokens[i])
                }
            } else {
                Defs.push([tokens[i],'']);
            }
        }
    }
}

files.forEach(fn=>{
    const content=patchBuf( readTextContent(srcfolder+fn), Errata[fn]);
    const sents=parseRaw(content.split(/\r?\n/));
    sents.forEach(({pali,defs},idx)=>{
        const vri=new TIASTList(pali,{akey:'vri'});
        const Defs=[];
        defs.forEach(def=>{
            const at=def.indexOf('\t');
            if (at>0) {
                addDef(Defs,def.slice(0,at),def.slice(at+1));
            } else {//macro
                
            }
        });
        const kmj=new TList(Defs,{akey:'kmj'});
        if (idx==13) console.log(combineList(kmj,vri))
    })
})
// readTextContent(srcfolder+fn+)