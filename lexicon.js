/* create a lexicon */
import {kluer,nodefs,glob, writeChanged,filesFromPattern, readTextContent,patchBuf, readTextLines} from 'pitaka/cli';
await nodefs;
import {eachSentence,parseRawDefLine} from './src/raw-format.js'; 
import {Lexicon} from './src/lexicon.js'

const srcfolder='./raw/'

const files=filesFromPattern('[ds]n?',srcfolder);
const ctx={lexicon:new Lexicon() };

console.log('building lexicon');

files.forEach(fn=>{
	const lines=readTextLines(srcfolder+fn);
	ctx.fn=fn;
	eachSentence( lines,ctx,(cb,pali,defs)=>{
		eachDef( defs, ctx )
		defs.map(line=>{
			eachDef(line,ctx,(entry,def)=>{
				ctx.lexicon.addRawDef(entry,def);
			});
		});
	});
})

console.log('packing');
ctx.lexicon.packRaw();
const output=JSON.stringify(ctx.lexicon.entries,'',' ');
if (writeChanged('lexicon.json',output)) {
	console.log('written lexicon.json',output.length);
}