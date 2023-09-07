import {readTextLines} from 'ptk/nodebundle.cjs'
import { fromIAST } from 'provident-pali';
export const parseLine=line=>{
    const [pn,rawtoken,lemma,root, ps,base,gender,num,cas,meaning ]=line.split('\t');
    return {pn,rawtoken,lemma,root,ps, base,gender,num,cas,meaning};
}
export const loadGrammarCode=(codename,folder='')=>{
    const lines=readTextLines(folder+'stat/stat-'+codename+'.txt');
    const out={};
    let code=3;
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
            const root=obj.root?GCodes.roots[obj.root]:2;
            const ps=obj.ps?GCodes.pss[obj.ps]:2;
            const base=obj.base?GCodes.bases[obj.base]:2;
            const gender=obj.gender?GCodes.genders[obj.gender]:2;
            const num=obj.num?GCodes.nums[obj.num]:2;
            const cas=obj.cas?GCodes.cass[obj.cas]:2;
            const meaning=obj.meaning?GCodes.meanings[obj.meaning]:2;
            const lemma=fromIAST(obj.lemma)
            if (obj.rawtoken) {
                wordgrammar=[];
                out.push([rawtoken,wordgrammar]);
            }
            wordgrammar.push(`${lemma},${root},${ps},${base},${gender},${num},${cas},${meaning}`);
        } else {
            out.push([obj.rawtoken,null]);
        }
    }
    return out;
}