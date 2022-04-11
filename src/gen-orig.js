'use strict'
/*
  convert word Sjis HTML to plain utf8 text
  output , dn1-orig.txt dn2-orig.txt and so on

*/
const fs=require('fs')
const iconv=require('iconv-lite');
const {komyobookbreaks}=require('./komyo');
const {saveDict,onLemmaLine}=require('./dictionary');
const {resetLemmaParser } = require('./lemmaparser');

let folders=(process.argv[2]||'sn').split(',')
if (folders[0]=='*') {
	folders='dn,mn,sn,an'.split(',')
}
const logprogress=true;
const paragraphs=[];
const writetodisk=true;
let bkseq=1;

// const logprogress=(process.argv[2]!=='*') 
const ParanumErrata={
	'mn03c19.html':[['287-3１','287-31']],
	'an02c14.html':[['50-1１','50-11']],
	'dn01c10.html':[['74-2．','74-2']]
}
const applyParanumErrata=(errata,line)=>{
	if (line[line.length-1]=='.' || line[line.length-1]==',') {
		line=line.substr(0,line.length-1);
	}
	if (!errata)return line;
	for (var i=0;i<errata.length;i++) {
		if (errata[i][0]==line) {
			return errata[i][1];
		}
	}
	return line;
}



const writeFile=(folder,bkseq)=>{
	const outfn=folder+bkseq+'-orig.txt';
	console.log("write "+outfn);
	if (writetodisk) fs.writeFileSync(outfn,paragraphs.join('\n'),'utf8');
	paragraphs.length=0;
}

const toText=(content,fn,folder,idx)=>{
	const lines =content.replace(/\r?\n/g,' ').replace(/<tr /g,'\n<tr ').split(/\n/);
	const out=[];
	const errata=ParanumErrata[fn];
	let prevln='',nextprefix='',mode='',pn='',isJ='';
	if (fn=='dn33c13.html') {
		isJ='『私は道を行った';
		//missing 
	}
	//const lines=html2txt(content);
	for (var i=0;i<lines.length;i++){
		let line=lines[i];
	
		if (line.indexOf('トップへ')>-1||line.indexOf('document.write')>-1) continue;
		
		line=line.replace(/<td(.+?)>(.*?)<\/td> +/g,(m,cls,body)=>{
			let s=body.replace(/<.+?>/g,'').trim();
			if (cls.match(/colspan="?2/)) s+='\t'
			s+='\t';
			return s;
		});

		line=line.replace(/<.+?>/g,'').trim()
			.replace(/   /g,' ');//MSHTML hardbreak long sentence with leading two blanks
		const leadingch=line.substr(0,5);
		if (line.match(/^\d+\-[１\d]+[.,．]?$/)) {
			line=applyParanumErrata(errata,line);
			pn=line;
			mode='N|';
			
		} else if (leadingch=='語\t語根\t') { 
		// dn09c03 219-3 wrong header  |述語	語根	品詞	語基	性	数	格	意味
		// check only first few bytes  |語	語根	品詞	活用	態	数	人称	意味
			mode='W|';
			continue;
		} else if (leadingch=='述語\t語根') { //
			mode='V|';
			continue;
		} else {
			const newmode={'訳文':'J|','メモ':'M|'}[line];
			if (newmode) {
				mode=newmode;
				continue;
			}			
		}

		if (line || prevln) {
			if (line&&line.indexOf('\t')==-1&&(mode=='W|'||mode=='V|')) {
				if (line.match(/\d/)) {
					line='X|'+line; //須展開
				} else {
					line='J|'+line;  //word 檔缺「訳文」
				}
			} else if (line) {
				if (mode=='W|'||mode=='V|') {
					const paranum=pn?pn:fn.substr(2).replace('.html','');
					onLemmaLine(line,folder+bkseq+'_'+paranum);
				}
				line=mode+line;
			}
			out.push(line); //remove extra emptyline
			if (mode=='N|') mode='T|'
		} else {
			mode='T|';
			resetLemmaParser();
		}
		prevln=line;
		
	};
	return out.join('\n');
}
const doit=folder=>{
	const bookbreaks=komyobookbreaks(folder)
	let files=fs.readdirSync(folder);
	if (folder=='sn') {
		if (logprogress) console.log('remove sn11c02,sn11c03, duplicate content')
		files=files.filter(fn=>fn.indexOf('sn11c02')==-1 && fn.indexOf('sn11c03')==-1);
	}

	bkseq=1;
	//files.length=10;
	files.forEach(fn=>{
		const newbkseq=bookbreaks[fn.replace(/\..+/g,'')];
		if(newbkseq&&bkseq!=newbkseq) {
			writeFile(folder,bkseq);
			bkseq=newbkseq;
		}
		if (logprogress) process.stdout.write('\r'+fn+'  ');
		const content=fs.readFileSync(folder+'/'+fn);
		const str=iconv.decode(content,'sjis')
		 .replace(/&#(\d+);/g,(m,m1)=>{
			const code=parseInt(m1);
			if (isNaN(code)) throw new Error("invalid char code"+m1)
			return String.fromCharCode(code);
		}).replace(/&(\S+?);/g,(m,m1)=>{
			if (m1=='ntilde') return 'ñ';
			else if (m1=='Ntilde') return 'Ñ';
			else if (m1=='nbsp') return ' ';
			else if (m1=='quot') return '"';
			else if (m1=='amp') return '&';
			else if (m1=='acirc') return 'â';
			else if (m1=='ucirc') return 'û';
			else if (m1=='eacute') return 'e';
			
			else throw new Error("invalid char "+m1+' at '+fn)
		})
	
		const txt=toText(str,fn,folder);

		paragraphs.push('F|'+fn.substr(0,fn.length-5)+'\n'+txt);
	})
	writeFile(folder,bkseq);
}

const t=new Date();
folders.forEach(doit);
console.log('saving dictionary');
if (writetodisk) saveDict();

console.log('elapsed',new Date()-t);