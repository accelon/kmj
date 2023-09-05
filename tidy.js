import {  meta_sc, entity2unicode,nodefs, 
	writeChanged, readTextContent,patchBuf} from 'ptk/nodebundle.cjs';
import { yellow } from 'ptk/cli/colors.cjs';
import {filesOf} from './src/kmj-folder.js'
import {tidyDefLine,patchRawDef} from './src/raw-format.js'
import HTMLErrata from './src/html-errata.js';
import { RawDefPatch } from './src/raw-errata.js';
await nodefs; //export fs to global
const srcfolder='./html/'; 
const desfolder='./raw/';

if (!fs.existsSync(desfolder)) fs.mkdirSync(desfolder);
const bkid=process.argv[2]||'dn1';
if (!process.argv[2]) console.log('file pattern',yellow('dn1~dn3, d1~d34, mn1~mn3, m1~m152, sn1~sn5, s1~s56, a1~a11'));

const books=meta_sc.booksOf(bkid);
const tidypali=str=>{
	return str.replace(/‘‘/g,'“').replace(/’’/g,'”')
}
const ctx={};
const toPlainText=(content,fn)=>{
	content=tidypali(content)
	const at=content.indexOf('<script');
	const out=['㊑'+fn]; //加上檔名比較好找
	content=content.slice(0,at);

	content=entity2unicode(content);
	content=content.replace(/\n/g,' ')
	.replace(/<font class="font[789]">　<\/font>/g,'㊣') //for pali text without pn
	.replace(/<\/font><font [^>]+?>/g,'')
	.replace(/<tr/g,'\n<tr').replace(/<td/g,'\t<td')
	const lines=content.split(/\r?\n/);
	
	let prefix='㊣';
	ctx.fn=fn;
	for (let i=0;i<lines.length;i++) {
		let line=lines[i].replace(/<[^>]+>/g,' ')
		          .replace(/　/g,' ').replace(/ +/g,' ').replace(/ ?\t ?/g,'\t').trim();
		
		if (line.indexOf('次へ→')>-1) continue;
		if (line.indexOf('←前へ')>-1) continue;
		const m=line.match(/^([\d\-]+)\.$/);
		if (m) {
			ctx.pn=m[1];
			ctx.patchkey=ctx.book+'_'+ctx.pn;
			out.push('^n'+ctx.pn);
			prefix='㊣';continue;
		}
		const first5=line.slice(0,5);
		if (line==='訳文'||line==='訳文 文') {prefix='㉆'; continue;}
		if (line==='メモ') {prefix='㊟'; continue;}
		if (first5==='語	語根	') {prefix='㊔';continue;}	
		if (first5==='述語	語根') {prefix='㊒';continue;}

		if (line[0]==='㊣' && line.match(/[a-z]/) ) prefix='㊣';//override
		if (line) {
			if (prefix=='㊒'||prefix=='㊔') {
				const patches=RawDefPatch[ctx.patchkey];
				if (patches) {
					line=patchRawDef(line,patches,ctx);
				}
				const at1=line.indexOf('\t'),at2=line.lastIndexOf('\t');
				if (~at1&&~at2&&at2!=at1) {
					if (~line.indexOf('\t'))line=tidyDefLine(line,ctx);	
				}				
			}
			out.push(prefix+line.replace(/㊣/g,'')); //remove extra ㊣
		}
		if (line.indexOf("<")>-1) {
			console.log('unclean tag in ',fn);
		}
	}
	return out;
}
books.forEach(book=>{	
	const files=filesOf(book,srcfolder);
	const out=[];
	ctx.book=book;
	files.forEach(fn=>{
		const errata=HTMLErrata[fn];
		let content=patchBuf(readTextContent(srcfolder+fn),errata);
		const output=toPlainText(content,fn);
		out.push(...output);
	});
	writeChanged(desfolder+book+'.txt',out.join('\n'),true);
})