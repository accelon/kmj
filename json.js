import {kluer,nodefs,glob, writeChanged,filesFromPattern, readTextContent,patchBuf, readTextLines} from 'pitaka/cli';
import {Lexicon} from './src/lexicon.js';
import {eachDef, eachSentence} from './src/raw-format.js'; 
import {TDenList,diffList} from 'pitaka/denote'
await nodefs; //export fs to global
const srcfolder='./raw/'
const desfolder='./json/'

if (!fs.existsSync(desfolder)) fs.mkdirSync(desfolder);
const SameAs=JSON.parse(readTextContent('sameas.json')); //有 "同上" 的lemma, lexicon.js 產生
const files=filesFromPattern( process.argv[2]+'.txt' , srcfolder);
const lexicon=new Lexicon( JSON.parse( readTextContent('./lexicon.json')));
const ctx={};

const pnlemmas={}; 
const addLemmas=(id,lexicon)=>{
    if (!pnlemmas[id]) pnlemmas[id]=lexicon;
    else {
        let count=0,newid=id;
        while (pnlemmas[newid]) {
            newid=id+'.'+(++count);
        }
        pnlemmas[newid]=lexicon;
    }
}
//todo 'anabhiratisaññaṃ': [ 'sabba+loke+anabhirati+saññaṃ' ],
//pali sabbaloke anabhiratisaññaṃ
const extractDecompose=(str,str2)=>{
    const vri=new TDenList(str.toLowerCase().replace(/\[[^\]]+\]/g,''),{akey:'vri',lang:'iast'});
    const lemmas=new TDenList(str2,{akey:'lemmas',lang:'iast'});
    const out=[];
    const d=diffList(vri,lemmas).filter(it=>it.m);
    let decompose='',i=0;

    while (i<d.length) {
        if (!d[i].tk.trim()) {
            i++;
            continue;
        }
        if (d[i].m>0) { //words
            if (decompose && decompose[decompose.length-1]!=='\t') {
                out.push(decompose.replace(/[ \+]+$/,''));
            }
            decompose=d[i].tk+'\t';
        } else {
            const part=d[i].tk+(d[i].tail||'').replace(/[^\d]/,'')
            decompose+= part+'+';
        }
        i++;
    }
    if (decompose) {
        if (decompose[decompose.length-1]!=='\t') {
            decompose=decompose.replace(/[ \+]+$/,'')
            out.push(decompose);
            // console.log(out)            
            return out;
        }
    }
}
const Decompose=new Lexicon();
const addDecompose=decomposes=>{
    decomposes.forEach(line=>{
        const [w,part]=line.split('\t');
        Decompose.addRawDef(w,part);
    })
}
const diff=(str,  expanded, replaces )=>{
    const vri=new TDenList(str,{akey:'vri',lang:'iast'});
    const reuse=new TDenList(expanded,{akey:'reuse',lang:'iast'});

    const d=diffList(vri,reuse);
    //console.log(d.filter(it=>it.m),replaces)
}
files.forEach(fn=>{
    const out=[];
    const lines=readTextLines(srcfolder+fn);
    //lines.length=114;
    ctx.fn=fn;
    ctx.fnpf=fn.replace('.txt','');
    eachSentence(lines,ctx,(pn,pali,rawdefs)=>{
        const lemmas=[];
        let expanded
        rawdefs.forEach(rawdef=>{
            if (rawdef.indexOf('\t')===-1) { //expansion
                rawdef.replace(/(\d+\-\d+)/g,(m,m1)=>{
                    const expand = pnlemmas[ctx.fnpf+'_'+m1];

                    if (expand) {
                        if (!expanded)expanded=[];
                        expanded.push(...expand);
                    } else {
                        console.log('wrong pn',m1)
                    }
                });
            } else {
                eachDef(rawdef,ctx,(entry,def)=>{
                    if (def=='同上') {
                        def=SameAs[entry]; //overwrite def
                        if (!def)console.log('cannot find 同上 for entry',entry,'in',pn)
                        return;
                    }
                    const defs=lexicon.getDefs(entry);
                    if (!defs) {
                        console.log('entry not found',entry,lexicon)
                    } else {
                        if (SameAs.hasOwnProperty(entry)) SameAs[entry]=def;   //供之後 "同上" 替代的值
                        const sense=defs.indexOf(def);
                        if (sense==-1) {
                            console.log(entry,'sense not found',def)
                        } else {
                            lemmas.push(entry+(sense?sense:''));
                        }    
                    }
                })
            }
        })
        if (expanded) {
           //diff(pali, expanded.join(' '), lemmas)
        } else {
            const decomposes=extractDecompose(pali, lemmas.join(' '));
            if (decomposes) addDecompose(decomposes);
        }

        addLemmas(ctx.fnpf+'_'+pn,lemmas);
        out.push([pn, pali, lemmas.join(' ') ]);
        pn='';
    })
    const outfn=desfolder+fn.replace('.txt','.json');
    const outcontent=JSON.stringify(out,'',' ');
    // if (writeChanged(outfn,outcontent)) {
    //     console.log('written',outfn,outcontent.length)
    // }
})

Decompose.packRaw();
console.log(Decompose.entries);