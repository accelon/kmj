import {filesFromPattern,readTextLines} from 'pitaka/cli'
import {eachSentence} from './raw-format.js'; 
const srcfolder='./raw/'
export const doRaw=(ctx,cb)=>{
	const files=filesFromPattern('*.txt' , srcfolder);
	files.forEach(fn=>{
		ctx.fn=fn;
	    const lines=readTextLines(srcfolder+fn);
	    eachSentence(lines,ctx,cb);
	});
}
