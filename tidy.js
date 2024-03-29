import {  meta_sc, entity2unicode,nodefs, 
	writeChanged, readTextContent,patchBuf} from 'ptk/nodebundle.cjs';
import { yellow } from 'ptk/cli/colors.cjs';
import {filesOf} from './src/kmj-folder.js'
import {tidyDefLine,patchRawDef} from './src/raw-format.js'
import HTMLErrata from './src/html-errata.js';
import { RawDefPatch } from './src/raw-errata.js';
import {custompn} from './custompn.js'
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
//㊑  htm 檔名
//㊣  巴利原文
//㉆  譯文
//㊟  注釋
//㊔  名詞
//㊒  動詞

const ctx={prevpn:0}; 
const toPlainText=(content,fn)=>{
	content=tidypali(content)
	const at=content.indexOf('<script');
	const out=['㊑'+fn]; //加上檔名比較好找

	if (!custompn[fn]) out.push('^n'+(ctx.prevpn+1)+'-0'); //還沒出現 ^n 之前，補一個虛的號，讓小標題歸入同一段。
	else if (parseInt(custompn[fn])>0) {
		out.push('^n'+custompn[fn]+'-0');
	}
	content=content.slice(0,at);

	content=entity2unicode(content);
	content=content.replace(/\n/g,' ')
	.replace(/ class="font11">([A-Za-z\&‘])/g,'>㊣$1')  //for pali text without pn
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
			 if (ctx.fn=='sn/sn48c74.htm') console.log(m[1])
			ctx.pn=m[1];
			ctx.patchkey=ctx.book+'_'+ctx.pn;
			out.push('^n'+ctx.pn);
			ctx.prevpn=parseInt(ctx.pn);
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
const epilog=(book,lines)=>{
	if (book=='mn2') {
		//443-12 , 443-13 redundant
		let at=lines.indexOf('^n444-13');
		const at2=lines.indexOf('^n443-12',at+1);
		const at3=lines.indexOf('^n444-14');
		if (~at2 && ~at3) {
			lines.splice(at2,at3-at2);
		} else {
			console.log('cannot fix epilog 443')
		}
	} else if (book=='mn3') {
		let at=lines.indexOf('^n167-2');
		const at2=lines.indexOf('^n166-3',at+1);
		if (~at2) {
			lines[at2]='^n167-3';
		} else {
			console.log('cannot fix epilog 167',at,at2)
		}
	}
	return lines;
}
books.forEach(book=>{	
	const files=filesOf(book,srcfolder);
	const out=[];
	ctx.book=book;
	ctx.prevpn=0; // reset pn , check sn4.txt , first pn should not be 717-0
	files.forEach(fn=>{
		const errata=HTMLErrata[fn];
		let content=patchBuf(readTextContent(srcfolder+fn),errata);
		const output=toPlainText(content,fn);
		out.push(...output);
	});

	epilog(book,out)
	
	writeChanged(desfolder+book+'.txt',out.join('\n'),true);
})