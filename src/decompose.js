import {readTextLines,fromObj,alphabetically0} from 'ptk/nodebundle.cjs'

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
			
			entries[compound].push(...items.map(it=>it.split('+')));
		}
	})
	return entries;
	// const out=fromObj(entries,(entry, payload)=>[entry,payload]);
	// out.sort(alphabetically0);
	// const lemmas=out.map(it=>it[0]);
	// const payloads=out.map(it=>it[1]);
	// return [lemmas,payloads];
}