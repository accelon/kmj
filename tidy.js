import {kluer,nodefs,glob, writeChanged, readTextContent,patchBuf} from 'pitaka/cli';
import {entity2unicode} from 'pitaka/utils';
import { cs, sc } from 'pitaka/meta';
import {filesOf} from './src/kmj-folder.js'
import HTMLErrata from './src/html-errata.js';
await nodefs; //export fs to global
const srcfolder='./html/'; 
const desfolder='./raw/';

if (!fs.existsSync(desfolder)) fs.mkdirSync(desfolder);
const bkid=process.argv[2]||'m1';
if (!process.argv[2]) console.log('file pattern',kluer.yellow('dn1~dn3, d1~d34, mn1~mn3, m1~m152, sn1~sn5, s1~s56, a1~a11'));

const books=sc.booksOf(bkid);
const toPlainText=content=>{
	const at=content.indexOf('<script');
	const out=[];
	content=content.slice(0,at);

	content=entity2unicode(content);
	content=content.replace(/\n/g,' ').replace(/<tr/g,'\n<tr').replace(/<td/g,'\t<td')
	const lines=content.split(/\r?\n/);
	
	let prefix='㊣';
	for (let i=0;i<lines.length;i++) {
		const line=lines[i].replace(/<[^>]+>/g,' ')
		          .replace(/　/g,' ').replace(/ +/g,' ').replace(/ ?\t ?/g,'\t').trim();
		
		if (line.indexOf('次へ→')>-1) continue;
		
		const m=line.match(/^([\d\-]+)\.$/);
		if (m) {out.push('^n'+m[1]);prefix='㊣';continue;}
		const first5=line.slice(0,5);
		if (line==='訳文') {prefix='㉆'; continue;}
		if (line==='メモ') {prefix='㊟'; continue;}
		if (first5==='語	語根	') {prefix='㊔';continue;}	
		if (first5==='述語	語根') {prefix='㊒';continue;}
		if (line) out.push(prefix+line);
	}
	return out;
}
books.forEach(book=>{	
	const files=filesOf(book,srcfolder);
	const out=[];
	files.forEach(fn=>{
		let content=patchBuf(readTextContent(srcfolder+fn),HTMLErrata[fn]);
		const output=toPlainText(content);
		out.push(...output);
	});
	if (writeChanged(desfolder+book+'.txt',out.join('\n'))) {
		console.log('written',book,out.length);
	}
})