/* filter out possible decompose */
import {kluer,nodefs,glob, writeChanged,filesFromPattern, readTextContent,patchBuf, readTextLines} from 'pitaka/cli';
import {compoundSimilarity} from 'pitaka/pali'
import {alphabetically0,sortObj,toObj,bsearch} from 'pitaka/utils'
import {loadKnownDecompose} from './src/decompose.js'
await nodefs;
const compounds=toObj(readTextLines('./compounds.txt')); //from alltokens.js

import {Lexicon} from './src/lexicon.js';
const lexicon=new Lexicon( JSON.parse( readTextContent('./lexicon.json')));
const inpfn='./decomposes.txt' ;//output of json.js
const entries=JSON.parse(readTextContent(inpfn))
const out={};
const partCount={};
const addParts=parts=>{
	parts.forEach(p=>{
		if (!partCount[p]) partCount[p]=0;
		partCount[p]++
	})
}
for (let compound in entries) {
	const decomposes=entries[compound];
	if (compound.length<4) continue

	for (let j=0;j<decomposes.length;j++) {
		const partstr=decomposes[j].replace(/\d+/g,'');
		const parts=partstr.split('+');
		if (parts.length<2) continue;
		if (compound[0]!=='p' && parts[0]=='pi') parts.shift()
		const {sim,partcount}=compoundSimilarity(compound,parts);

		if (sim>=0.85) {
			if (!out[compound]) out[compound]=[];
			parts.length=partcount;
			const confirmedparts=parts.join('+');
			if (out[compound].indexOf(confirmedparts)==-1) out[compound].push(confirmedparts);


			addParts(parts)
		}
	}
}
const out2=sortObj(out,alphabetically0);
if (writeChanged('knowndecompose.txt',out2.join('\n'))){
	console.log('written knowndecompose',out2.length);
}


const pcount=sortObj(partCount);
if (writeChanged('partcount.txt',pcount.join('\n'))){
	console.log('partcount.txt',pcount.length)
}

const undecomposed=[],unknowncompound=[];
const filterParts=(comp,parts)=>{
	const out=[];
	for (let i=0;i<parts.length;i++) {
		let ok=false;
		const p=parts[i].replace(/\d+$/,'');
		if ((comp.indexOf(p)>-1) ||
		(comp.indexOf(p.slice(1))>-1) ||
		(comp.indexOf(p.slice(0,p.length-1))>-1)) {
			if (out.indexOf(p)==-1) out.push(p);
		}
	}
	return out;
}

for (let comp in compounds) {
	if (!out[comp]) {
		if (entries[comp]) {
			const parts=filterParts(comp,entries[comp]);
			if (parts.length) {
				undecomposed.push([comp, parts]);
			}
		}
		else unknowncompound.push(comp);
	}
}

if (writeChanged('undecomposed.txt',undecomposed.join('\n'))) {
	console.log('written undecomposed',undecomposed.length)
}
if (writeChanged('unknowncompound.txt',unknowncompound.join('\n'))) {
	console.log('written unknowncompound',unknowncompound.length)
}