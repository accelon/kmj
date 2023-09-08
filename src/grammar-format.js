import {readTextLines} from 'ptk/nodebundle.cjs'
import { fromIAST } from 'provident-pali';
export const parseLine=line=>{
    const [pn,rawtoken,lemma,root, ps,base,gender,num,cas,meaning ]=line.split('\t');
    return {pn,rawtoken,lemma,root,ps, base,gender,num,cas,meaning};
}
export const GRAMMAR_CODE_NULL=4
export const GRAMMAR_CODE_START=5;
export const loadGrammarCode=(codename,folder='')=>{
    const lines=readTextLines(folder+'stat/stat-'+codename+'.txt');
    const out={};
    let code=GRAMMAR_CODE_START; //  1:token seperator, 2:part seperator, 3:lemma with no grammar, 4:null-grammar code
    for (let i=0;i<lines.length;i++) {
        const [v]=lines[i].split('\t');
        out[v]=code++;
    }
    return out;
}
export const loadGrammarCodes=(folder='')=>{
    const roots=loadGrammarCode('roots',folder);
    const pss=loadGrammarCode('pss',folder);
    const bases=loadGrammarCode('bases',folder);
    const genders=loadGrammarCode('genders',folder);
    const nums=loadGrammarCode('nums',folder);
    const cass=loadGrammarCode('cass',folder);
    const meanings=loadGrammarCode('meanings',folder);
    
    return {roots,pss, bases,genders,nums,cass,meanings};
}

let GCodes;
export const loadGrammar=(fn,folder='')=>{
    if (!fn.endsWith('.tsv'))fn+='.tsv';
    const lines=readTextLines(fn);
    const out=[];
    let wordgrammar=[]; //
    if (!GCodes) GCodes= loadGrammarCodes(folder);
    for (let i=0;i<lines.length;i++) {
        const obj=parseLine(lines[i]);
        const at=obj.pn.lastIndexOf('-');
        const pn=obj.pn.slice(0,at);
        if (!out[pn]) out[pn]=[];
        const rawtoken=fromIAST(obj.rawtoken);
        if (obj.lemma) {
            const root=obj.root?GCodes.roots[obj.root]:GRAMMAR_CODE_NULL;
            const ps=obj.ps?GCodes.pss[obj.ps]:GRAMMAR_CODE_NULL;
            const base=obj.base?GCodes.bases[obj.base]:GRAMMAR_CODE_NULL;
            const gender=obj.gender?GCodes.genders[obj.gender]:GRAMMAR_CODE_NULL;
            const num=obj.num?GCodes.nums[obj.num]:GRAMMAR_CODE_NULL;
            const cas=obj.cas?GCodes.cass[obj.cas]:GRAMMAR_CODE_NULL;
            const meaning=obj.meaning?GCodes.meanings[obj.meaning]:GRAMMAR_CODE_NULL;
            const lemma=fromIAST(obj.lemma)
            if (obj.rawtoken) {
                wordgrammar=[];
                out[pn].push([rawtoken,wordgrammar]);
            }
            wordgrammar.push(`${lemma},${root},${ps},${base},${gender},${num},${cas},${meaning}`);
        } else {
            out[pn].push([obj.rawtoken,null]);
        }
    }
    return out;
}

