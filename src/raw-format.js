import {LemmaPatch,DefPatch} from './raw-errata.js'
export const LEMMA_REGEX=/([abcdeghijklmnoprstuvyāīūḍṭṇñḷṃṣṅ]+)/ig;

export const normalizeLemma=str=>{ //remove punc, space and 'n
	const m=str.match(LEMMA_REGEX)
	if (!m) {
		console.log("invalid lemma",str);
		return '';
	}
	const tk= m[0].toLowerCase().replace(/’+n/,'ṃ').replace(/’+$/,'');
	return tk;
}

export const parseRaw=lines=>{
    const out=[];
    let ppn='',pn='',defs=[],pali='',jp='',memo='';
    const addEntry=()=>{
        out.push({pali,pn:ppn,defs,memo,jp});
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
		if (ctx.defpatch&&ctx.defpatch[entry]) def=ctx.defpatch[entry];
		if (def.indexOf('\t')==-1 && def!=='同上') err=true;
		else cb(entry,def);
	}
	if (err) console.log('error def',ctx.fn,ctx.pn,str)
}