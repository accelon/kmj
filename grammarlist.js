
import {nodefs,readTextContent,readTextLines, meta_sc,writeChanged, fromObj} from 'ptk/nodebundle.cjs';
import {dumpGrammar} from './src/raw-format.js'
import {loadKnownDecompose} from './src/decompose.js'
import {Lexicon} from './src/lexicon.js';
await nodefs; //export fs to global
const srcfolder='./raw/'; 
const desfolder='./grammar/'
const bkid=process.argv[2]||'dn1';

const SameAs=JSON.parse(readTextContent('sameas.json')); //有 "同上" 的lemma, lexicon.js 產生
const lexicon=new Lexicon( JSON.parse( readTextContent('lexicon.json')));
const knownDecompose=loadKnownDecompose(['knowndecompose.txt','knowndecompose-manual.txt']);
const books=meta_sc.booksOf(bkid);

const ctx={fn:'test1',lexicon,SameAs,knownDecompose}

books.forEach(book=>{	
    const out=[];
	const lines=readTextLines(srcfolder+book+'.txt');
    ctx.fn=book;
    ctx.pnLexicon={};//reset lemmas and defs of each pn;
    dumpGrammar(lines,ctx,(pn,ntoken,raw,lemma,def)=>{
        out.push(pn+'\t'+raw+(def?('\t'+lemma+'\t'+def):''))
    })
    writeChanged(desfolder+book+'.tsv',out.join('\n'),true);

    const {total,ambigous,miss} = ctx.stat;
    const arr=fromObj(ctx.misses,(a,b)=>[a,b]).sort((a,b)=>b[1]-a[1]);
    arr.length=10;
    if (books.length==1) console.log(arr,ctx.stat,'correct rate', ((total-miss)/total).toFixed(2));
});