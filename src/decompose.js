import {readTextLines} from 'pitaka/cli'
import {fromObj,alphabetically0} from 'pitaka/utils'
export const loadKnownDecompose=filenames=>{
	if (typeof filenames=='string') filenames=[filenames];
	const entries={};
	filenames.forEach(fn=>{
		const lines=readTextLines(fn);
		for (let i=0;i<lines.length;i++) {
			const l=lines[i];
			const items=l.split(',');
			const compound=items.shift();
			if (!entries[compound]) entries[compound]=[];
			entries[compound].push(...items);
		}
	})
	const out=fromObj(entries,(entry, payload)=>[entry,payload]);
	out.sort(alphabetically0);
	return out;
}