import {kluer,nodefs,glob, writeChanged,filesFromPattern, readTextContent,patchBuf, readTextLines} from 'pitaka/cli';
import {bsearch,sortObj,fromObj} from 'pitaka/utils'
import {Lexicon} from './src/lexicon.js';
import {eachDef, eachSentence,normalizePali} from './src/raw-format.js'; 
import {TDenList,diffList,tokenizeIAST} from 'pitaka/denote'
import {breakCompound,matchCompound,appendDecompose} from './src/compound.js'

await nodefs; //export fs to global
const srcfolder='./raw/'
const files=filesFromPattern( '*.txt' , srcfolder);
const lexicon=new Lexicon( JSON.parse( readTextContent('./lexicon.json')));
const knownDecompose=appendDecompose( readTextLines('./knowndecompose.txt') );
appendDecompose(readTextLines('./manualdecomp.txt') , knownDecompose);

const ctx={};
const unknown={};
const tries=['pi','ṃ','m','n','ti','ca','hetu'];
const tryToken=tk=>{
	for (let i=0;i<tries.length;i++) {
		const t=tries[i];
		const ntk=tk.slice(0,tk.length-t.length);
		if (knownDecompose[ntk]||lexicon.entries[ntk]) return ntk;
	}
	return tk;		
}
let freq=0;
files.forEach(fn=>{
    const out=[];
    const lines=readTextLines(srcfolder+fn);
    //lines.length=114;
    ctx.fn=fn;
    ctx.fnpf=fn.replace('an1.txt','');
    process.stdout.write('\r'+ctx.fn+'       ')
    eachSentence(lines,ctx,(pn,pali,rawdefs)=>{
    	const pli=normalizePali(pali)
	    const tokens=tokenizeIAST(pli,{tokenOnly:true,removeBlank:true});
	    for (let i=0;i<tokens.length;i++) {
	        const tk=tokens[i];
	        if (lexicon.entries[tk]) {
	        	//console.log('in lexicon ',tk)
	        } else {
	        	if (knownDecompose[tk]) {
	        		//console.log('known decompose ',tk)
	        	} else {
	        		const newtk=tryToken(tk);

	        		if (newtk==tk) {
	        			if (!unknown[tk]) unknown[tk]=0;
	        			unknown[tk]++;	        		
	        			freq++;	
	        		}
	        		//console.log('unknown decompose',tk)
	        	}
	        }
	    }
    });
})
const LexiconArr=fromObj(lexicon.entries,true);
const partialMatch=(entry,lexicon)=>{
	const out=[]
	for (let i=0;i<entry.length-3;i++) {
		const sub=entry.slice(i);
		const at=bsearch(LexiconArr,  sub , true, 0);
		if (at==-1) continue;
		if (LexiconArr[at][0].length<4) continue;
		 //console.log(sub,LexiconArr[at][0])
		if (sub.slice(0, LexiconArr[at][0].length)==LexiconArr[at][0]) {
			out.push(LexiconArr[at][0]);
		}
	}
	//if (out.length) console.log(entry,out)
	return out;
}
const closestMatch=arr=>{
	const Decompose=fromObj(knownDecompose,true);
	for (let i=0;i<arr.length;i++) {
		const entry=arr[i][0];
		const at=bsearch( Decompose, entry,true,0);
		if (at==-1) continue;
		const possible=[];
		for (let j=0;j<Decompose[at].length;j++) {
			let matchcount=0;
		    const [comp,partstrs]=Decompose[at];
		    for (let k=0;k<partstrs.length;k++) {
			    const parts=partstrs[k].split(/[\-\+]/);
				for (let i=0;i<parts.length;i++) {
				 	const p=parts[i].slice(1,parts[i].length-1);
				 	if (entry.indexOf(p)>-1) {
				 		if (possible.indexOf(parts[i])==-1) possible.push(parts[i]);
				 	}
				}
		    }
		}
		possible.push( ... partialMatch(entry ,lexicon));
		if (possible.length) arr[i][1]=possible.join('+');
	}
	return arr;
}
console.log('total freq',freq)
const out=closestMatch(sortObj(unknown));

const outfn='unknown2.txt'
if (writeChanged(outfn,out.join('\n'))) console.log('written',outfn,out.length)
