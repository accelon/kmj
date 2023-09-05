import {LemmaPatch,DefPatch,RawDefPatch} from './raw-errata.js'
import { TDenList,tokenize } from 'ptk/nodebundle.cjs';
import {pnpatches} from './pnpatch.js'
//

import {breakCompound} from './compound.js'
export const LEMMA_REGEX=/([abcdeghijklmnoprstuvyāīūḍṭṇñḷṃṣṅ]+)/ig;
export const isNormalDef=rawdef=>(rawdef||'').indexOf('\t')>-1;
const skipwords=['nti','va','ti','pe','kareyya','hoti'];

export const normalizeLemma=str=>{ //remove punc, space and 'n
	const m=str.match(LEMMA_REGEX);
	if (!m) {
		return null;
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
	let context={memo:'',htmlfn:'',defs:[],pali:''};

	const groups={};
	let thegroup=[],pn='1-0';
	for (let i=0;i<lines.length;i++){
		const line=lines[i];
		if (line.slice(0,2)=='^n') {
			if (thegroup.length) {
				groups[pn]=thegroup;
			}
			thegroup=[];
			groups[line.slice(2)]=thegroup;
			pn=line.slice(2)
		} else {
			thegroup.push(line)
		}
	}
	

	const addEntry=pn=>{
		if (context.pali) out.push(context);
		context=Object.assign({pn,memo:'',fn:'',defs:[],pali:''});
    }

    for (let pn in groups){
		const lines=groups[pn];
		for (let i=0;i<lines.length;i++) {
			const line=lines[i];
			const first=line.charAt(0);
			if (first==='㊣') {
				addEntry(pn);
				context.pali=line.slice(1);
			} else if (first==='㊔'||first==='㊒') {
				context.defs.push(line.slice(1));
			} else if (first==='㉆') {
				context.jp=line.slice(1);
			} else if (first==='㊟') {
				context.memo+=line.slice(1);
			} else if (first==='㊑') {
				context.htmlfn=line.slice(1);
			}  else {
				console.log('line',i,line)
				throw 'unknown line type '
			}
		}
	}
	addEntry();
    return out;
}
export const patchRawDef=(line,patches)=>{
	if (!patches||!patches.length||!line) return line;
	for (let i=0;i<patches.length;i++) {
		if (line==patches[i][0]) {
			line=patches[i][1];
			if (patches[i][2]) {
				patches[i][2]--;
			} else {
				patches[i][0]='';
			}
		}
	}
	return line;
}
export const eachSentence=(lines,ctx,cb)=>{
	const out=parseRaw(lines);
	ctx.fnpf=ctx.fn.replace(/\..+$/,'');
	for (let i=0;i<out.length;i++) {
		const {pn,defs,pali,htmlfn}=out[i];
		const patchkey=ctx.fnpf+'_'+pn;
		ctx.pn=pn||'1-0';
		ctx.defpatch=DefPatch[patchkey];
		ctx.lemmapatch=LemmaPatch[patchkey];
		ctx.htmlfn=htmlfn;
		cb(pn,pali,defs);
	}
}
export const patchDef=(str,ctx)=>{
	const at=str.indexOf('\t');
	let err=false;
	let entry='',def='';
	if (at==-1) { //expansion
		err=true;
	} else {
		entry=normalizeLemma(str.slice(0,at));
		//if (ctx.pn=='171-2') console.log(ctx.pn,entry,ctx.lemmapatch)
		if (ctx.lemmapatch&&ctx.lemmapatch[entry]) {
			// console.log('patch lemma',entry,ctx.lemmapatch[entry]);
			entry=ctx.lemmapatch[entry];
		}
		def=str.slice(at+1);
		if (ctx.defpatch&&ctx.defpatch[entry]) {
			def=ctx.defpatch[entry];
		}
		if (def.indexOf('\t')==-1 && def!=='同上') err=true;
	}
	
	return [err,entry,def];
}

const parseReferences=(rawdef,ctx)=>{
	const out=[]
	let pn='';
	if (rawdef.indexOf('(')) {
		rawdef.replace(/([\d+\-]{2,})/g,(m,m1)=>{
			const at=m1.indexOf('-')
			if (~at) {
				out.push(m1);
				pn=m1.slice(0,at);
			} else {
				if (!pn) return ;//not a reference, leading paranum.
				out.push(pn+'-'+m1);
			}
		});
	};
	return out;
}
export const tidyDefLine=(defline,ctx)=>{
	const def=defline.split('\t');
	const lemma=def.shift();
	if (def.length==6) {
		def[6]=def[5];//move meaning to end
		const m=def[4].match(/[\(（〔](.+)[\)）〕]/);
		if (m) {
			def[5]='（'+m[1]+'）'
			def[4]=def[4].slice(0,m.index);
		} else {
			//console.log('wrong subcase format',def[4],ctx.pn)
			def[5]=def[4];
			def[4]='合';//複合詞的組成部份，單復數在最後一個部份
		}
		
	} else if (def.length!=7 && def.length!==1 && def.length!==2) {
		console.log('wrong def length',def.length,ctx.pn,def)
	}
	def.unshift(lemma);
	
	return def.join('\t')
}
export const parseNormalDef=(str,ctx)=>{
    const out=[];
    let [err,entry,def]=patchDef(str,ctx);

	let defs=ctx.lexicon.getDefs(entry);
	if (!defs) { //查無此詞, 試試去掉結尾長音
		if (entry.match(/[īāū]$/)) {
			entry=entry.replace(/ī$/,'i').replace(/ā$/,'a').replace(/ū$/,'u');
			defs=ctx.lexicon.getDefs(entry);
		} 
		if (!defs && ~def.indexOf('’n')) { //append ṃ
			defs=ctx.lexicon.getDefs(entry+'ṃ');
		}
	}
	if (!defs) { 
		return [entry];
	}
	if (def=='同上') {
		//SameAs 一開始是數字。然後不斷更新為最新的定義
		if (!ctx.SameAs[entry])console.log('cannot find 同上 for entry',entry,'in',ctx.pn);
		def=ctx.SameAs[entry];//取最接近的定義
		if (typeof def=='number') {// 之前沒出現過，只好用第一組定義
			def=defs[0]; //直接用第一組定義
		}
	} else {
		ctx.SameAs[entry]=def;//記錄最接近的定義
	}
    return [entry,def];
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

let errcount=0;
export const reuseLemmas=(rawdef,lemmas,j,ctx)=>{
    let newj=j;//consumed following rawdefs
    const found=[];
	
    const reuse=new TDenList(rawdef,{akey:'reuse',lang:'iast'});
	
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
					//先試簡單拆分，省去建 reuselemmadecomp 表
					const localdecomposed=localDecomp(lemma,ctx.locallex);
					if (localdecomposed) {
						found.push(...localdecomposed)
					} else {
						if (ctx.reuselemmadecomp[lemma]) {
							for (let i=0;i<ctx.reuselemmadecomp[lemma].length;i++) {
								const sublem=ctx.reuselemmadecomp[lemma][i];
								const at=findLemma(ctx.locallex,sublem,newj); //look ahead
								if (~at) {
									found.push(ctx.locallex[at]);
								} else {
									console.log('unknown reuse lemma(broken)',sublem,lemma,ctx.pn)
								}
							}
						} else {
							if (errcount<100) {
								console.log('unknown reuse lemma:',ctx.fnpf+'_'+ctx.pn,lemma);
							}
							errcount++;	
						}
					}
                }
            }
        }
    }
    lemmas.push(...found);
    return newj;
}


export const dumpGrammar=(lines,ctx,cb)=>{
	if (!ctx.stat) ctx.stat={total:0,ambigous:0,miss:0,
		lex:0};
	function emit(){
		if (cb) {
			cb.apply(null, arguments );
		} else if (ctx.onData) {
			ctx.onData.apply(null,arguments )
		}
	}
	eachSentence(lines,ctx,(pn,pali,rawdefs)=>{
		pali=pali.replace(/\[[^\]]+\]/g,''); //remove note

		const defs=[],lemmas=[];
		const patchkey=ctx.fn+'_'+pn;
		let consumed=0;
		for (let i=0;i<rawdefs.length;i++) {
			const [lemma,def]=parseNormalDef(rawdefs[i],ctx);
			if (!def) { //
				const references=parseReferences(rawdefs[i]);
				for (let j=0;j<references.length;j++) {
					let  lex=ctx.pnLexicon[references[j]];
					if (!lex) {
						const pnpatch=pnpatches[patchkey];
						if (pnpatch) {
							if (pnpatch && pnpatch[references[j]]){
								const newpn=pnpatch[references[j]];
								lex=ctx.pnLexicon[newpn];
							}
						}
					}
					if (!lex){
						console.log(ctx.htmlfn,pn,'broken reference',references[j]);
					} else {
						lemmas.push(...lex.lemmas);
						defs.push(...lex.defs);
					}
				}
			} else {
				lemmas.push(lemma);
				defs.push(def);
			}
		}
		ctx.pnLexicon[pn]={lemmas,defs};
		
		const decomposed=breakCompound(pali, lemmas, ctx.knownDecompose);
		const tokens=tokenize(pali);
	
		for (let i=0;i<tokens.length;i++) { 
			const tk=normalizeLemma(tokens[i].text);
			if (!tk) {
				emit(pn,i,tokens[i].text,tokens[i].text);//as it is
				continue;
			}
			ctx.stat.total++;
			let at1=lemmas.indexOf(tk,consumed);
			if (!~at1) {				
				at1=lemmas.indexOf(tk); //重頭找
			}
			
			if (!~at1) { //not found , try decomposed            
				const at3=decomposed[tk];
				let miss='';
				if (at3) {
					for (let j=0;j<decomposed[tk].length;j++) {
						const at4=lemmas.indexOf(decomposed[tk][j]);
						emit(pn, i, j==0?tokens[i].text:'', decomposed[tk][j], defs[at4])
					}
				} else {
					if (ctx.lexicon.contains(tk)) {
						ctx.stat.globallex++;
						//ugly , lexicon use old format 依（屬） no \t in between
						const defs=tidyDefLine(tk+'\t'+ctx.lexicon.getDefs(tk)[0] ,ctx).split('\t')
						defs.shift();
						emit(pn,i,tokens[i].text, tk, defs.join('\t'));	
						continue;
					} else if (!~skipwords.indexOf(tk)) {
						ctx.stat.miss++;
						if (!ctx.misses) ctx.misses={};
						if (!ctx.misses[tk]) ctx.misses[tk]=0;
						ctx.misses[tk]++;
						//console.log('miss',pn,tokens[i].text)
						miss='MISS'
					}
				
					emit(pn,i,tokens[i].text,tk,miss);
				}
			} else {
				emit(pn,i ,tokens[i].text, tk, defs[at1]);
				consumed=at1;
			}
		}
	})
}

