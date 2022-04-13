import {kluer,nodefs,glob, writeChanged,filesFromPattern, readTextContent,patchBuf, readTextLines} from 'pitaka/cli';
import {Lexicon} from './src/lexicon.js';
import {eachDef, eachSentence} from './src/raw-format.js'; 

await nodefs; //export fs to global
const srcfolder='./raw/'
const desfolder='./json/'

if (!fs.existsSync(desfolder)) fs.mkdirSync(desfolder);

const files=filesFromPattern('dn1?' , srcfolder);
const lexicon=new Lexicon( JSON.parse( readTextContent('./lexicon.json')));
const ctx={};

files.forEach(fn=>{
    const out=[];
    const lines=readTextLines(srcfolder+fn);
    ctx.fn=fn;
    eachSentence(lines,ctx,(pn,pali,rawdefs)=>{
        const lemmas=[];
        rawdefs.forEach(rawdef=>{
            
            eachDef(rawdef,ctx,(entry,def)=>{
                const defs=lexicon.getDefs(entry);
                if (!defs) {
                    console.log('entry not found',entry,lexicon)
                } else {
                    const sense=defs.indexOf(def);
                    if (sense==-1) {
                        console.log('sense not found',def)
                    } else {
                        lemmas.push(entry+(sense?sense:''));
                    }    
                }
            })
        })
        out.push([pn, pali, lemmas.join(' ') ]);
    })
    const outfn=desfolder+fn+'.json';
    const outcontent=JSON.stringify(out,'',' ');
    if (writeChanged(outfn,outcontent)) {
        console.log('written',outfn,outcontent.length)
    }
})