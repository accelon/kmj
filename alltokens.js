import {kluer,nodefs,glob, writeChanged,filesFromPattern,readTextContent, readTextLines} from 'pitaka/cli';
import {sortObj,alphabetically0} from 'pitaka/utils'
import {tokenizeIAST} from 'pitaka/denote'
import {Lexicon} from './src/lexicon.js';
await nodefs;
const lexicon=JSON.parse( readTextContent('./lexicon.json'));
import {doRaw,normalizePali} from './src/doraw.js'
const ctx={};

const Tokens={};
let fn='';
doRaw(ctx, (pn,pali,rawdefs)=>{
	if (fn!==ctx.fn) {
		process.stdout.write('\r'+ctx.fn+'       ')
		fn=ctx.fn;
	}
	pali=normalizePali(pali)
	const tokens=tokenizeIAST(pali,{tokenOnly:true,removeBlank:true});
	for (let i=0;i<tokens.length;i++) {
		const tk=tokens[i];
		if (!Tokens[tk])  Tokens[tk]=0;
		Tokens[tk]++;
	}
})
let out=sortObj(Tokens, alphabetically0) ;
const compounds=[],parts=[];

out.forEach(it=>{
	(lexicon[it[0]]?parts:compounds).push(it[0]);
})
if (writeChanged('compounds.txt',compounds.join('\n'))) {
	console.log('written compounds.txt', compounds.length)
}
if (writeChanged('parts.txt',parts.join('\n'))) {
	console.log('written parts.txt', parts.length)
}
