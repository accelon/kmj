/* create a lexicon */
import {kluer,nodefs,glob, writeChanged,filesFromPattern, readTextContent,patchBuf, readTextLines} from 'pitaka/cli';
import {alphabetically0,alphabetically} from 'pitaka/utils'
// import {fromIAST,providently} from 'provident-pali'
await nodefs;
import {eachSentence,eachDef} from './src/raw-format.js'; 
import {Lexicon} from './src/lexicon.js'

const srcfolder='./raw/'

const files=filesFromPattern('n?',srcfolder);
const ctx={lexicon:new Lexicon() };

console.log('building lexicon');
const SameAs={};
files.forEach(fn=>{
	const lines=readTextLines(srcfolder+fn);
	ctx.fn=fn;
	eachSentence( lines,ctx,(cb,pali,defs)=>{
		defs.forEach(line=>{
			if (line.indexOf('\t')==-1) return;//skip expansion
			eachDef(line,ctx,(entry,def)=>{
				if (def.indexOf('\t')>-1) { //skip '同上', def must have '\t'
					ctx.lexicon.addRawDef(entry,def);
				} else {
					if (def==='同上') {
						if (!SameAs[entry]) SameAs[entry]=0;
						SameAs[entry]++;
					} else {
						console.log('wrong def',def)
					}
				}
			});	
		})
	});
})
writeChanged('sameas.json',JSON.stringify(SameAs,'',' '));
console.log('packing');
ctx.lexicon.packRaw();
const lexicon=[];
const entries=[];
for (let entry in ctx.lexicon.entries) {
	entries.push(entry);
	if (ctx.lexicon.entries[entry].length==1){
		lexicon.push([entry,ctx.lexicon.entries[entry][0]]);
	} else {
		lexicon.push([entry,ctx.lexicon.entries[entry]]);
	}
}

lexicon.sort(alphabetically0);

const out={};
for (let i=0;i<lexicon.length;i++) {
	const [entry,defs]=lexicon[i];
	out[entry]=defs;
}
const output=JSON.stringify(out,'',' ');
if (writeChanged('lexicon.json',output)) {
	console.log('written lexicon.json',output.length);
}
entries.sort(alphabetically)
if (writeChanged('entries.txt',entries.join('\n'))) {
	console.log('written entries.txt',entries.length);
}