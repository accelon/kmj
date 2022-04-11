'use strict'
const {LemmaTypo,DefPatch}=require('./patches');
const {regLemma}=require('./pat');
const KnownLemma={
	'pajānāti':'pra-jñā	動	現	能	単	三	知る、了知する',
    'hoti' :'bhū	動	現	能	単	三	ある、なる、存在する',
    'honti':'bhū	動	現	能	複	三	ある、存在する',
	'viharati':'vi-hṛ	動	現	能	単	三	住する',
	'na':'不変	‐	‐	‐	‐	ない',
	'pahoti':'pra-bhū	動	現	能	単	三	生ずる、発生する、できる、可能である', //dn
	'natthi':'na-as	形	a	男	単	三	存在しない',
	'kandanti':'krand	動	現	能	複	三	なく、悲泣する',
	'nissāya':'ni-śri	動	連	‐	‐	‐	依って、依止して、～のために、近くに',
	'kāreyya':'kṛ	動	願	能	単	三	なす',
	'gacchati':'gam	動	現	能	単	三	行く',
	'carati':'car	動	現	能	単	三	行ずる',
	'nibbindati':'nir-vid	動	現	能	単	三	厭う、厭悪する',
	'yāpeti':'yā　使	動	現	能	単	三	行かせる、存続させる、生存させる',
	'carāmā':'car	動	現	能	複	一	行ずる',
	'paripūrenti':'pari-pṝ　使	動	現	能	複	三	完成させる',
    'paripūrentī':'[paripūrenti]',
    'maññati':'man	動	現	能	単	三	考える',
    'maññi':'man	動	ア	能	単	三	考える、思う',
    'atthi':'as	動	現	能	単	三	ある、なる',
    'parivajjeti':'pari-vṛj　使	動	現	能	単	三	避ける、回避する',
}

const findLemma=(lemma,manglewords)=>{
	for (let i=manglewords.length-1;i>=0;i--) {
		if (manglewords[i]==lemma ||
			manglewords[i].substr(0,lemma.length+1)
		==lemma+'#') return i;
	}
	return -1;
}
/* similar with addDef in dictionary , need combine*/
const sameAsAbove=(status,def,lemma,manglewords)=>{
	let at=findLemma(lemma,manglewords);
	if (at==-1) {
		if (!def) def=KnownLemma[lemma];
		if (!def){
			console.log(chalk.red('undefined ',def,lemma,status.fn,status.lineidx));
		}

		if (lemma.match(/([āīū])$/)) {
			const l2=shortvowelend(lemma);
			at=findLemma(l2,manglewords);
		}
	}

	if (at>-1){
		manglewords.push( manglewords[at] );
		return manglewords;
	} else {
		console.log('cannot find sameAsAbove',lemma,status.fn+'_'+status.pn);
	}

}
let sentencedict={};
let olemma='';
//const regLemma=/([bcdghjklmnprstvyṅñṇḍṭḷṁṃŋaāiīuūeo]+)(#\d+)?/gi;

const skipremain='pe,ti'.split(',');

const normalizeLemma=s=>{
	if (s[0]=='X')return s;
    s=s.replace(/-$/g,'').replace(/-/g,'').replace(/^’+/g,'');
    const endq=s.match(/(’+)$/);
    if (endq) s=s.substr(0,s.length-endq[1].length);
    return s.replace(/’+/,'');
}
const aliasLemma=s=>s.replace(/’{1,2}n$/,'ṃ');
const aliasLemma2=s=>s.replace(/n$/,'ṃ');

const extractlemma=str=>{
	let lemma=[];
	str.replace(regLemma,(m,m1)=>{
        const s=normalizeLemma(m1);
		if (s) lemma.push(s.toLowerCase());
	});
	return lemma;
}
const shortvowelend=s=>{
	let ch=s[s.length-1];
	if (ch=='ā') ch='a';
	else if  (ch=='ī') ch='i';
	else if  (ch=='ū') ch='u';
	return s.substr(0,s.length-1)+ch;
}
const parseLemmaLine=(line,uid,addDef)=>{
	const fields=line.split(/\t/);
    let f0=fields[0];
	if (LemmaTypo[uid]) {
		f0=LemmaTypo[uid][f0]||f0;
	}
	const lemmas=extractlemma(f0);
	let lemma=lemmas.shift();
	if (!lemma) console.log(lemmas,line)
	
	fields.shift();
	let def=fields.join('\t');

	if (DefPatch[uid]&&DefPatch[uid][lemma]) def=DefPatch[uid][lemma];

	if (fields[6]&&olemma&&fields[6].indexOf('　→')>-1){
		def+='|'+olemma;
    }

	if (def=='同上' || def.indexOf('\t')==-1){ //sn4_351-31	依（属）
        def=sentencedict[lemma];//先找同一句的解釋

		if (!def&&lemma.match(/[āīū]$/)) {
			def=sentencedict[shortvowelend(lemma)]
        }
        if (!def) {
            def=sentencedict[aliasLemma(lemma)]
            if (!def) def=sentencedict[aliasLemma2(lemma)]
        }

		//if (!def &&DefPatch[uid]) def=DefPatch[uid][lemma];
		
		if (!def) def=KnownLemma[lemma];
		if (!def) {
			console.log('undefined def',lemma,uid)
		}

		//有時會參考之前的句子，就不往前找了。「同上」基本上是常用字，採取字典的第一個義項。
		// if (!def && !rawdict[lemma]) { 
		// 	console.log("missing def",lemma,uid)
		// 	def='UNKNOWN!'
		// }
    }

    addDef&&addDef(lemma,def,uid,'');
    sentencedict[lemma]=def; //新定義會覆蓋，「同上」取最近的那個定義 
	lemmas.forEach(remain=> { //詞條有空格，後綴首詞，這樣會產生一筆新的義項（see manasi korati）
		if (skipremain.indexOf(remain)==-1){
            addDef&&addDef(remain,def,uid,'|'+lemma);
            sentencedict[remain]=def;
		} 
	})
    olemma=lemma;
    lemmas.unshift(lemma);
    return {lemmas,def};
}


/*
const parseLemmaLine=(line)=>{
	const arr=status.line.substr(2).split('\t');
	const rawlemma=arr.shift();
	let def=arr.join('\t');
	const lemmas=extractlemma(rawlemma);
	const ow=prevword;
	const lemma=lemmas[0];
	prevword=lemmas[0];
	if (def=='同上') { 
		if (lemmas.length>1 && skipremain.indexOf(lemmas[1])==-1 ) {
			//specially for "manasi karoti"
			lemmas.forEach(lem=>sameAsAbove(status,def,lem,manglewords));
			return manglewords;			
			// console.log(chalk.bgRed('同上 with more than one lemma'),lemmas,status.pn,status.lineidx+1)
		}
		return sameAsAbove(status,def,lemma,manglewords);
	}

}
*/
const resetLemmaParser=()=>{
    sentencedict={};
}
module.exports={parseLemmaLine,resetLemmaParser,skipremain,normalizeLemma};
