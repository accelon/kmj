import {LemmaPatch,DefPatch} from './raw-errata.js'
import { TDenList } from 'ptk/nodebundle.cjs';
export const LEMMA_REGEX=/([abcdeghijklmnoprstuvyāīūḍṭṇñḷṃṣṅ]+)/ig;
export const isNormalDef=rawdef=>rawdef.indexOf('\t')>-1;
export const normalizeLemma=str=>{ //remove punc, space and 'n
	const m=str.match(LEMMA_REGEX)
	if (!m) {
		console.log("invalid lemma",str);
		return '';
	}
	const tk= m[0].toLowerCase().replace(/’+n/,'ṃ').replace(/’+$/,'');
	return tk;
}
export const doRaw=(ctx,cb)=>{
	const files=filesFromPattern('*.txt' , srcfolder);
	files.forEach(fn=>{
		ctx.fn=fn;
	    const lines=readTextLines(srcfolder+fn);
	    eachSentence(lines,ctx,cb);
	});
}

export const normalizePali=str=>{
	return str.toLowerCase().replace(/\[[^\]+]+\]/g,'')//dropping variants
	.replace(/(’+)nti/g,'n$1ti');
}

export const parseRaw=lines=>{
    const out=[];
    let ppn='',pn='',defs=[],pali='',jp='',memo='',fn='';
    const addEntry=()=>{
        out.push({pali,pn:ppn,defs,memo,jp,fn});
        ppn=pn,pali='',memo='', jp='',  defs=[];
    }
    for (let i=0;i<lines.length;i++){
        const line=lines[i];
        const first=line.charAt(0);
        if (line.slice(0,2)=='^n') {
            pn=line.slice(2);
            continue;
        } else if (first==='㊣') {
            if (pali) addEntry( pali, defs);
            pali=line.slice(1);
        } else if (first==='㊔'||first==='㊒') {
            defs.push(line.slice(1));
        } else if (first==='㉆') {
            jp=line.slice(1);
        } else if (first==='㊟') {
            memo+=line.slice(1);
        } else if (first==='㊑') {
            fn=line.slice(1);
        }  else {
            console.log('line',i,line)
            throw 'unknown line type '
        }

    }
    return out;
}

export const eachSentence=(lines,ctx,cb)=>{
	const out=parseRaw(lines);
	ctx.fnpf=ctx.fn.replace(/\..+$/,'');
	for (let i=0;i<out.length;i++) {
		const {pn,defs,pali}=out[i];
		ctx.pn=pn;
		ctx.defpatch=DefPatch[ctx.fnpf+'_'+pn];
		ctx.lemmapatch=LemmaPatch[ctx.fnpf+'_'+pn];
		cb(pn,pali,defs);
	}
}
export const eachDef=(str,ctx,cb)=>{
	const at=str.indexOf('\t');
	let err=false;
	if (at==-1) { //expansion
		err=true;
	} else {
		let entry=normalizeLemma(str.slice(0,at));
		//if (ctx.pn=='171-2') console.log(ctx.pn,entry,ctx.lemmapatch)
		if (ctx.lemmapatch&&ctx.lemmapatch[entry]) {
			// console.log('patch lemma',entry,ctx.lemmapatch[entry]);
			entry=ctx.lemmapatch[entry];
		}
		let def=str.slice(at+1);
		if (ctx.defpatch&&ctx.defpatch[entry]) {
			def=ctx.defpatch[entry];
		}
		if (def.indexOf('\t')==-1 && def!=='同上') err=true;
		else cb(entry,def);
	}
	if (err) console.log('error def',ctx.fn,ctx.pn,str)
}

export const parseNormalDef=(rawdef,ctx)=>{
    const out=[];
    eachDef(rawdef,ctx,(entry,def)=>{

        let defs=ctx.lexicon.getDefs(entry);
        if (!defs) { //查無此詞, 試試去掉結尾長音
			if (entry.match(/[īāū]$/)) {
				entry=entry.replace(/ī$/,'i').replace(/ā$/,'a').replace(/ū$/,'u');
				defs=ctx.lexicon.getDefs(entry);
			}
		}

		if (!defs) { 
			console.log('entry not found',entry,ctx.pn)
			return;
		}

	    if (def=='同上') {
			//SameAs 一開始是數字。然後不斷更新為最新的定義
            if (!ctx.SameAs[entry])console.log('cannot find 同上 for entry',entry,'in',ctx.pn);
			def=ctx.SameAs[entry];//取最接近的定義
			if (typeof def!=='string') {// 之前沒出現過，只好用第一組定義
				def=defs[0]; //直接用第一組定義
			}
		} else {
			ctx.SameAs[entry]=def;//記錄最接近的定義
		}

		if (defs.length===1) {
			if (defs[0]==def) out.push(entry);
			else console.log(entry,'single sense not match',def);
		} else {
			let sense=defs.indexOf(def);
			if (sense==-1){
				console.log(entry,'sense not found',ctx.pn,def)
			} else {
				out.push(entry+(sense?sense:''));
			}                    
		}
    })
    return out;
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

const diff=(str,  expanded, replaces )=>{
    const vri=new TDenList(str,{akey:'vri',lang:'iast'});
    const reuse=new TDenList(expanded,{akey:'reuse',lang:'iast'});

    const d=diffList(vri,reuse);
    //console.log(d.filter(it=>it.m),replaces)
}

let errcount=0;
export const reuseLemmas=(rawdef,lemmas,j,ctx)=>{
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
            if (typeof ctx.lexicon.entries[lemma]=='string') {
                //console.log('found in unilexicon',lemma)
                found.push(lemma);//one def, no ambiguity
            } else {
                const at=findLemma(ctx.locallex,lemma,newj); //look ahead
                if (at>j) {
                    found.push(ctx.locallex[at])
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

export const isIdenticalGrammar=(rawdefs,ctx)=>{
    if (rawdefs.length==1) {
        const m=rawdefs[0].match(/\((\d+\-\d+)\.\)/);
        if (m) {
            return m[1];
        }
    }
}