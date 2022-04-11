'use strict'
//const dictionary={}
const {parseLemmaLine,skipremain}=require('./lemmaparser');
const DICTFILENAME='kmj-rawdict.txt'
const {bsearch,regPaliword}=require('pengine');
// const LemmasDefs=[],Lemmas=[];
const LEMMA_PREFIX='|'
const TK_DEFAULT=0;
const TK_UNRESOLVED=-1;
const TK_LITERAL=-2;
const TK_XREF=-3;
const TK_DUPLICATED=-4; //相同的詞郤有不同的gcode 

const {readFileSync,writeFileSync}=require('fs')

const getLemma=function(idx){return this.lemmas[idx]};
const indexOfLemma=function(str){return bsearch(this.lemmas,str)};
const findLemma=function(str){return bsearch(this.lemmas,str,true)};


const loadDict=(fn=DICTFILENAME,seq=false)=>{
	const arr=readFileSync(fn||DICTFILENAME,'utf8').split(/\r?\n/);
	let lemma='',lemmacount=0;
	let def=[];
	const lemmas=[],defs=[];
	arr.forEach(line=>{
		if (line[0]==LEMMA_PREFIX) {
			lemma=line.substr(1);
			if (lemmas.length) defs.push(def)
			lemmas.push(lemma);
			def=[];
			lemmacount++;
		} else if (line){
			if (seq) line+='\t'+def.length;
			def.push(line)
		}
	})
	defs.push(def);
	const inst={lemmas,defs};
	inst.withSeq=seq;
	inst.getLemma=getLemma.bind(inst);
	inst.getRawDef=getRawDef.bind(inst);
	inst.getDef=getDef.bind(inst);
	inst.setRawDef=setRawDef.bind(inst);
	inst.indexOfLemma=indexOfLemma.bind(inst)
	inst.findLemma=findLemma.bind(inst);

	return inst;
}
const getRawDef=function(s,n,withStat){
	const D=this;
	const at=(typeof s=='number')?s:D.indexOfLemma(s);
	if (at==-1) return null;
	const defs= at>-1?D.defs[at]:null;
	if (defs&&typeof n=='number') {
		if (!defs[n]) {
			console.error('cannot find #',n,'of',s);
			return s;
		}
		const at=withStat?0:defs[n].indexOf('\t')+1;
		return defs[n].substr(at);
	}
	return defs.map(def=>{
		const at=withStat?0:def.indexOf('\t')+1;
		return def.substr(at);
	});
}
const getDef=function(s,n=0,withStat){
	const D=this;
	const rawdef=D.getRawDef(s,n,withStat);
	if (!rawdef)return null;
	return rawToObj(rawdef,null,withStat);
}

const rawToObj=(line,extra,withStat)=>{
	const def=line.split('\t');
	let stat=null,freq=0;
	if (withStat) {
		stat=def.shift();
		const arr=stat.split('|');
		freq=arr.length==1?1:arr.reduce((a,b)=>parseInt(a)+parseInt(b));
	}
	return def?{freq,stat,extra,root:def[0],type:def[1],
		base:def[2],gender:def[3],num:def[4],cas:def[5],meaning:def[6]||'',seq:def[7]}:{};
}
const rawFromObj=(o,extra='')=>{
	return (extra?extra+'\t':'')+o.root+'\t'+o.type+'\t'+o.base+'\t'+o.gender+'\t'+o.num+'\t'+o.cas+'\t'+o.meaning
	+((typeof o.seq!=='undefined')?'\t'+o.seq:'');
}
const setRawDef=function(s,n,def,withStat){
	const D=this;
	const at=(typeof s=='number')?s:D.indexOfLemma(s);
	if (at==-1) return null;
	const defs= at>-1?D.defs[at]:null;
	//update lemma
	// console.log('update',s,'\n',LemmasDefs[at][n],'\n',def);

	const at2=withStat?0:defs[at][n].indexOf('\t')+1;
	D.defs[at][n]=D.defs[at][n].substr(0,at2)+def;
}
const LexiconFields=['root','type','base','gender','num','cas','meaning'];
// const setDefField=(s,n,field,value)=>{
// 	let def=getRawDef(s,n);
// 	const at=LexiconFields.indexOf(field);
// 	if (!at) throw new Error('invalid field name '+field);

// 	const fields=def.split('\t');
// 	fields[at]=value;
// 	// console.log('set field',s,n,field,value)
// 	setRawDef(s,n,fields.join('\t'));
// }


//will not add to dictionary for this remaining lemma


const lastoccur_pos={dn:1,mn:2,sn:3,an:4}
const rawdict={};

const addDef=(lemma,def,uid,extra)=>{
	lemma=lemma.trim();
	if (!rawdict[lemma]) rawdict[lemma]={};

	if (!rawdict[lemma][def+extra]) rawdict[lemma][def+extra]=['',0,0,0,0]; //最後一次出現、四部頻次
	rawdict[lemma][def+extra][0]++;

    const fid={dn:1,mn:2,sn:3,an:4}[uid.substr(0,2)];

	rawdict[lemma][def+extra][fid]++;
	rawdict[lemma][def+extra][0]=uid;
}
const onLemmaLine=(line,uid)=>{
	parseLemmaLine(line,uid,addDef);
}
const saveDict=()=>{
	const out=[];
	for (let lemma in rawdict) {
		const defs=[]
		for(let def in rawdict[lemma]) {
			let sum=0;
			for (let i=1;i<rawdict[lemma][def].length;i++) {
				sum+=rawdict[lemma][def][i];
				
			}
			//console.log(rawdict[lemma][def],sum)
			defs.push([ rawdict[lemma][def] , sum,def] );
			defs.sort((a,b)=>b[1]-a[1]);
		}
		const entries=defs.map(item=>{
			let occ=item[0].shift();
			const sum=item[1];
			const def=item[2];
			return (sum==1?occ:item[0].join('|'))+'\t'+def+'\n';
		})
		out.push(['|'+lemma,'\n',entries]);
	}
	const alphabetically=(a,b)=>a[0]>b[0]?1: ((a[0]<b[0])?-1:0);
	out.sort(alphabetically);
	let content=out.join('\n').replace(/\n,/g,'\n').replace(/,\n/g,'\n');
	writeFileSync('kmj-rawdict.txt',content,'utf8');
}

const mangleLem=(lemma,gcode)=>{
	let mangled=lemma;
	if (gcode==-1) mangled+='#0'; //def not in dictionary
	else if (gcode>0) mangled+='#'+gcode;
	return mangled;
}
const mangleLemmas=(D,lemmas,def,prevword,uid)=>{
	const out=[];
	lemmas.forEach(lemma=>{
		let defs=D.getRawDef(lemma);
		if (!defs) {
			defs=D.getRawDef(lemma.replace(/’.+/g,''));
		}
		if (!defs) {
			if (skipremain.indexOf(lemma)>-1)return;

			throw new Error('lemma not found '+lemma+' uid:'+uid)
			out.push(lemma+'#0');
			return;
		}
		let at=(defs||[]).indexOf(def)
		if (at==-1) {
			at=(defs||[]).indexOf(def+'|'+prevword)
		}
		out.push(mangleLem(lemma,at));
	})
	return out;
}
const countPaliWord=str=>{
	let c=0;
	str.replace(regPaliword,(m,m1)=>c++);
	return c;
}

const oneDef={};
'atthi,bhikkhave,kho,iti,hi,na,api,neva,ca,ce,yo,vā,puna,āvuso,eko,eso,bho,katamo,pana'+
',phasso,sabbaso,sampajāno,samayo,rāgo,doso,moho,seyyo,kāyo,obhāso,yoniso,saddho,gilāno'
',ājīvo,pabbajito,anicco,puriso,gotamo,thero,nisinno,virato,loko,sacco'+
',upapajjatī,uppajjeyya,viharanti,pajānāti,pajānātī,lokasmi'.split(',').forEach(a=>oneDef[a]=true);

const isSamasa=str=>{
	return !!str.match(/^[有相持帯依隣]/);
}
const parseSamasa=str=>{
	if (!str)return null;
	const reg=/([有相持帯依隣])/;
	const Case=/[主対具奪属与処呼絶]/
	const regSamasa=/([依有])（([副相持帯依隣主対具奪属与処呼絶]+)）/;
	const m1=str.match(reg);
	const m2=str.match(regSamasa);
	if (m1||m2) {
		let cas='',secondary='';
		if (m2){
			if (m2[2].match(Case)) cas=m2[2];
			else secondary=m2[2];	
		}
		const samasa=m2?m2[1]+secondary : m1[1];
		return {samasa,cas};
	}
	return null;
}

module.exports={saveDict,addDef,loadDict,
	mangleLemmas,onLemmaLine,LexiconFields,
	rawToObj,rawFromObj,
	getDef,getRawDef,setRawDef,getLemma,indexOfLemma,mangleLem,countPaliWord,oneDef,
	isSamasa,parseSamasa,
TK_DEFAULT,TK_UNRESOLVED,TK_LITERAL,TK_XREF,TK_DUPLICATED};