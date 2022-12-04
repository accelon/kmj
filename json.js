import {nodefs,writeChanged,filesFromPattern, readTextContent
    , readTextLines} from 'ptk/nodebundle.cjs';
import {Lexicon} from './src/lexicon.js';
import {TDenList,diffList} from 'ptk/nodebundle.cjs'
import {eachDef, eachSentence} from './src/raw-format.js'; 
import {breakCompound,matchCompound} from './src/compound.js'

await nodefs; //export fs to global
const srcfolder='./raw/'
const desfolder='./json/'

if (!fs.existsSync(desfolder)) fs.mkdirSync(desfolder);
const SameAs=JSON.parse(readTextContent('sameas.json')); //有 "同上" 的lemma, lexicon.js 產生
const files=filesFromPattern( process.argv[2]+'.txt' , srcfolder);
if (!files.length) console.log('missing pattern')
const lexicon=new Lexicon( JSON.parse( readTextContent('./lexicon.json')));
const ctx={};

const pnlemmas={}; 
const addLemmas=(id,lex)=>{
    if (!pnlemmas[id]) pnlemmas[id]=lex;
    else {
        let count=0,newid=id;
        while (pnlemmas[newid]) {
            newid=id+'.'+(++count);
        }
        pnlemmas[newid]=lex;
    }
}
//todo 'anabhiratisaññaṃ': [ 'sabba+loke+anabhirati+saññaṃ' ],
//pali sabbaloke anabhiratisaññaṃ

const Decompose=new Lexicon();
const addDecompose=decomposes=>{
    decomposes.forEach(line=>{
        const [w,part]=line.split('\t');
        Decompose.addRawDef(w,part);
    });
}
const findLemma=(lemmas,entry,from=0,debug)=>{
    let at=lemmas.lastIndexOf(entry);
    if (at>-1) return at;
    for (let i=lemmas.length;i--;i>from) {
        if (!lemmas[i]) continue;
        if (lemmas[i].slice(0,entry.length)===entry) return i; //skip tailing sense
    }
    return -1;
}
const reuseLemmas=(rawdef,lemmas,locallex,j,ctx)=>{
    let newj=j;//consumed following rawdefs
    const found=[];
    const reuse=new TDenList(rawdef,{akey:'reuse',lang:'iast'});
    //if (debug) console.log(lemmas)
    for (let i=0;i<reuse.data.length;i++){
        const lemma=reuse.data[i].tk;
        const at=findLemma(lemmas,lemma);        
        if (at>-1) {
            found.push(lemmas[at])
        } else {
            if (typeof lexicon.entries[lemma]=='string') {
                //console.log('found in unilexicon',lemma)
                found.push(lemma);//one def, no ambiguity
            } else {
                const at=findLemma(locallex,lemma,newj); //look ahead
                if (at>j) {
                    found.push(locallex[at])
                    newj=at;
                } else {                
                    if (errcount<10) console.log('unknown reuse lemma:',ctx.fnpf+'_'+ctx.pn,reuse.data[i].tk);
                    errcount++;
                }
            }
        }
    }
    //if (found.length) console.log(found,rawdef)
    lemmas.push(...found);
    return newj;
}
const diff=(str,  expanded, replaces )=>{
    const vri=new TDenList(str,{akey:'vri',lang:'iast'});
    const reuse=new TDenList(expanded,{akey:'reuse',lang:'iast'});

    const d=diffList(vri,reuse);
    //console.log(d.filter(it=>it.m),replaces)
}
const parseNormalDef=(rawdef,locallex,ctx)=>{
    const out=[];
    eachDef(rawdef,ctx,(entry,def)=>{
        if (def=='同上') {
            def=SameAs[entry]; //overwrite def
            if (!def)console.log('cannot find 同上 for entry',entry,'in',pn);
        }
        const defs=lexicon.getDefs(entry);
        if (!defs) {
            console.log('entry not found',entry)
        } else {
            if (SameAs.hasOwnProperty(entry)) SameAs[entry]=def;   //供之後 "同上" 替代的值
            if (defs.length===1) {
                if (defs[0]==def) out.push(entry);
                else console.log(entry,'single sense not match',def);
            } else {
                const sense=defs.indexOf(def);
                if (sense==-1) {
                    console.log(entry,'sense not found',def)
                } else {
                    out.push(entry+(sense?sense:''));
                }                    
            }
        }
    })
    return out;
}
const isIdentical=(rawdefs,ctx)=>{
    if (rawdefs.length==1) {
        const m=rawdefs[0].match(/\((\d+\-\d+)\.\)/);
        if (m) {
            return m[1];
        }
    }
}

const isNormalDef=rawdef=>rawdef.indexOf('\t')>-1;
let errcount=0;
const genDecomposes=true; //產生decomposes.txt ，供validdecompose.js找出可能的拆分
// ctx.knownDecompose=loadKnownDecompose( readTextLines('./knowndecompose.txt'));


files.forEach(fn=>{

    const out=[];
    const lines=readTextLines(srcfolder+fn);
    //lines.length=114;
    ctx.fn=fn;
    ctx.fnpf=fn.replace('.txt','');
    process.stdout.write('\r'+ctx.fn+'       ')
    eachSentence(lines,ctx,(pn,pali,rawdefs)=>{
        ctx.debug=pn=='2-1';
        const lemmas=[];
        let j=0, done =false;
        ctx.pn=pn;
        const locallex=[];
        for (let j=0;j<rawdefs.length;j++) { //預先建好 本段的 lexicon 
            if (isNormalDef(rawdefs[j])) {
                locallex[j]=parseNormalDef(rawdefs[j],locallex,ctx)[0];
            }
        }
        const identical=isIdentical(rawdefs,ctx);
        if (identical) {
            const reuse=pnlemmas[ctx.fnpf+'_'+identical];
            if (reuse) {
                lemmas.push(...reuse);
                done=true;
            }
        }
        if (!done) while (j<rawdefs.length){
            const rawdef=rawdefs[j];
            if (isNormalDef(rawdef)) { 
                lemmas.push(locallex[j]);
            } else {//contain expansion
                rawdef.replace(/(\d+\-\d+)/g,(m,m1)=>{
                    const expand = pnlemmas[ctx.fnpf+'_'+m1];
                    if (expand) {
                        lemmas.push(...expand)
                    } else {
                        console.log('wrong pn',m1)
                    }
                });
                if (rawdef.indexOf('（同上）')>-1) {
                    //look ahead for vars //an3_15-39
                    j=reuseLemmas(rawdef.replace('（同上）',''),lemmas,locallex,j,ctx);
                }
            }
            j++;
        }

        if (genDecomposes) {
            const decomposes=breakCompound(pali, lemmas.join(' '),ctx);
            if (decomposes) addDecompose(decomposes);            
        } else {
            matchCompound(pali,lemmas, lexicon, ctx);
        }

        addLemmas(ctx.fnpf+'_'+pn,lemmas);
        out.push([pn, pali, lemmas.join(' ') ]);
        pn='';
    })
    const outfn=desfolder+fn.replace('.txt','.json');
    const outcontent=JSON.stringify(out,'',' ');
    writeChanged(outfn,outcontent,true)
})

if (genDecomposes){
    Decompose.packRaw();
    const decomposes=JSON.stringify(Decompose.entries,'',' ' );
    writeChanged('decomposes.txt',decomposes,true)
}

