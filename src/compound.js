import {tokenize,TDenList,diffList,tokenizeIAST, bsearch, alphabetically} from 'ptk/nodebundle.cjs'

const findPart=(compounds,from,part)=>{
    for (let i=from;i<compounds.length;i++) {
        if (compounds[i].tk.slice(0,part.length)==part) return i;
    }
    return -1;
}
const groupCompound=(compounds,parts)=>{
    const out=[],breakat=[];
    let i=0,j=0;
    while (i<compounds.length && j<parts.length) {
        const p=parts[j].tk.slice(0,parts[j].tk.length-1);
        const at=findPart(compounds, i, p);
        if (at>-1) {
            breakat[i]=j;
            j++;
            i++;
        } else {
            //console.log('cannot find part in compound',parts[j].tk,compounds.map(it=>it.tk).join(' '))
            j++;
        }
    }
    breakat[compounds.length]=parts.length;
    for (let i=0;i<breakat.length-1;i++) {
        out[compounds[i].tk]=
            parts.slice( breakat[i], breakat[i+1])
            .map(it=>(it.tk+(it.tail||'')).trim())
    }
    return out;
}
export const matchCompound=(str, lemmas, lexicon,ctx) =>{ 
    const knownDecompose=ctx.knownDecompose;
    const tokens=tokenizeIAST(str,{tokenOnly:true,removeBlank:true});
    for (let i=0;i<tokens.length;i++) {
        const tk=tokens[i];
    }
}
let logcount=0;
export const breakCompound_old=(str,str2,ctx)=>{
    const vri=new TDenList(str.toLowerCase().replace(/\[[^\]]+\]/g,''),{akey:'vri',lang:'iast'});
    const lemmas=new TDenList(str2,{akey:'lemmas',lang:'iast'});
    const out={};
    const d=diffList(vri,lemmas).filter(it=>it.m&&it.tk.trim() 
        && it.tk!=='pe'&& it.tk.match(/[a-z]/) && isNaN(parseInt(it.tk)));
    
    //以 1開始，以-1結束才是復合字
    while (d.length&&d[d.length-1].m==1) d.pop();
    while (d.length&&d[0].m==-1) d.shift();

    const compounds=d.filter(it=>it.m==1);
    const parts=d.filter(it=>it.m==-1);

    if (!d.length) return [];
    if (compounds.length==0) {
        console.log('missing compound',ctx.pn,d);
    } else if (compounds.length==1) {
        out[compounds[0].tk]=parts.map(it=>(it.tk+(it.tail||'')).trim())
    } else {
        if (compounds.length>=parts.length) {
            //console.log(ctx.pn,compounds.length,parts.length,d)
        } else {
            const [lemma,part2]=groupCompound(compounds,parts);
            out[lemma]=part2;
        }
    }
    //if (logcount<10) console.log(out)
    //logcount++;
    return out;
}

export const appendDecompose=(arr,out={})=>{
    for (let i=0;i<arr.length;i++) {
        const items=arr[i].split(',');
        const compound=items.shift();
        if (out[compound]) {
            console.log('warning ',compound,'exists');
        }
        out[compound]=items;
    }
    return out;
}

export const localDecomp=(lemma,lexicon)=>{ //very simple decompose using local lexicon
	if (lemma=='-') return [];
	const out=[];
	let remain=lemma,found=false;
	while (remain.length) {
        if (remain.length>1 && remain[0]==remain[1]) {
            remain=remain.slice(1);//double consonant
        }    

        found=false;
		for (let i=0;i<lexicon.length;i++) {
			if (!lexicon[i]) continue;
			const lex=lexicon[i].replace(/\d+$/,'');
			if (remain.startsWith(lex)) {
				out.push(lexicon[i])
				remain=remain.slice(lex.length);
				found=true;
            }
		}
		if (!found) break;
	}
	return remain.length>0?null:out;
}




//將
export const breakCompound=(str,lemmas,knownDecompose)=>{
    const validDecompose=(parts)=>{
        for (let i=0;i<parts.length;i++) {
            if (!~(lemmas.indexOf(parts[i]))) return false;
        }
        return true;
    }    
    const compoundwords=tokenize(str).map(it=>it.text.trim().toLowerCase())
    .filter(it=>!!it).filter(it=> !~lemmas.indexOf(it));
    const out={};
    if (!compoundwords) return out;

    for (let i=0;i<compoundwords.length;i++) {
        const w=compoundwords[i];
        const decomp=localDecomp(compoundwords[i],lemmas);
        if (decomp) {
            out[compoundwords[i]]=decomp;
            continue;
        }

        const knowns=knownDecompose[w];
        if (!knowns) continue;
        for (let j=0;j<knowns.length;j++) {
            if (validDecompose(knowns[j])) {
                out[compoundwords[i]]=knowns[j];
            }
        }
    }
    return out;

}