import {test1,test2,test3,test4,test5,test6,test7} from './src/worddict-testdata.js'
import {nodefs,readTextContent,readTextLines, meta_sc,writeChanged} from 'ptk/nodebundle.cjs';
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
const ctx={fn:'test1',lexicon,SameAs,pnLexicon:{},knownDecompose}


dumpGrammar(test7,ctx,(pn,ntoken,raw,lemma,def)=>{
     //console.log(pn+'\t'+raw+(def?('\t'+lemma+'\t'+def):''))
     //if (!def && raw!==lemma) console.log(ntoken,raw,lemma)
})
const {total,ambigous,miss} = ctx.stat;
console.log(ctx.stat, Math.floor((total-miss)*100/total)+'% correct');

