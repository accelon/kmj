/* make use of legacy decompose-edit.txt */
import {nodefs,readTextLines,readTextContent ,writeChanged} from 'pitaka/cli'
import {unique,sortObj,toBase26} from 'pitaka/utils'
import {fromIAST,lexify,stringifyLex} from 'provident-pali'
await nodefs;

const srcfile="../../cap/komyoji/decompose-edit.txt" //https://github.com/dhamma/komyoji
const tidyUp=content=>{
	return content.replace(/#\d+/g,'');//remove the lexeme selector
}
const multilex=[];
const lexemes={};
const normalizeLex=str=>{
	return str.replace('+++-jjh-','-')
	.replace('a-bb-++vy','a-vy')
	.replace(/\-\+/g,'-').replace(/\+\-/g,'-').replace(/[\~~\?]/g,'').trim();
}
const normalizePart=str=>{
	str=str.replace(/esu$/,'a')
	.replace(/eyya$/,'a')
	.replace(/aṃsu$/,'a')
	.replace(/āni$/,'a')
	.replace(/ā$/,'a')

	.replace(/a[ñm]$/,'a').replace(/[ṃn]$/,'')

	if (str.match(/[svhgdbprtk]$/)) str+='a';
	return str;
}
let sandhiless=0;
const decompose_provident=[];
const errordecompose=[];
const packSandhiless=formula=>{
	let s='',acc=0;
	formula.replace(/-/g,(m,idx)=>{
		s+= (idx-acc).toString().padStart(2,'0');
		acc++;
	})
	if (s.length==2 && s[0]=='0') s=s.slice(1)
	return s;

}
const processCompound=lines=>{
	const out=[];
	for (let i=0;i<lines.length;i++){
		const line=lines[i];
		const at=line.indexOf('=');
		if (at==-1) continue;
		const compound=line.slice(0,at);
		const lexs=unique(line.slice(at+1).split('|'));
		if (lexs.length>1) {
			multilex.push(line);
		}

		/* unique lexemes */
		lexs.forEach((lex,idx)=>{
				if (compound=='abbhāmattaṃva') console.log(compound,lex)

			lex=normalizeLex(lex)
			const parts=lex.split(/[\+\-\d]+/).filter(it=>it.length>1);//drop single char part -k- -p-

			if (idx==0) {
				let formula=parts.map(fromIAST).join('-').replace('!','').replace('~','');
				const w=fromIAST(compound);
				if (formula.indexOf('??')>-1) {
					console.log("wrong data",compound,parts)
				} else {
					if (w!==formula) {
						if (formula.replace(/\-/g,'')==w) {
							formula=packSandhiless(formula);
							sandhiless++;
							decompose_provident.push(w +'='+ formula );

						} else {
							const lex=lexify(w,formula.split('-'));
							const wrongparts=lex.filter(it=>it==-1);
							if (wrongparts.length) {
								errordecompose.push(w+'='+formula+'!!'+lex.join('+'));
							} else{
								decompose_provident.push(w +'='+ stringifyLex(lex) );
							}
						}
					}
					
 				}
			}

			parts.forEach(part=>{
				part=normalizePart(part)
				if (part.length<2)return;
				if (!lexemes[part])lexemes[part]=0;
				lexemes[part]++;
			})
		})
	}
}



let rawcontent=tidyUp(readTextContent(srcfile));
const rawlines=rawcontent.split('\n');
processCompound(rawlines);
const output=sortObj(lexemes)
if (writeChanged('lexemes.txt',output.join('\n'))){
	console.log('written lexemes',output.length)
}
if (writeChanged('multilex.txt',multilex.join('\n'))){
	console.log('multilex written',multilex.length)
}
if (writeChanged('decompose.txt',decompose_provident.join('\n'))){
	console.log('decompose written',decompose_provident.length)
}
if (writeChanged('errordecompose.txt',errordecompose.join('\n'))){
	console.log('errordecompose written',errordecompose.length)
}
console.log('sandhiless',sandhiless,'with sandhi',decompose_provident.length-sandhiless)
