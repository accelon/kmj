/* generate grammar tsv*/
import {nodefs,readTextContent,readTextLines, filesFromPattern,writeChanged, fromObj} from 'ptk/nodebundle.cjs';
import {parseLine} from './src/grammar-format.js'
await nodefs;
const srcfolder='grammar/'
const desfolder=''

const roots={};
const pss={}
const bases={}
const genders={}
const nums={}
const cass={};
const meanings={};
const statobjects={roots,pss,nums,meanings,bases,genders,cass};

const files=filesFromPattern( '?.tsv' , srcfolder).filter(it=>it.match(/[dmsa]n\d/));
// files.length=1;
const incObj=(v,name)=>{
    if (!v) return;
    const statobj=statobjects[name+'s']
    if (!statobj[v]) statobj[v]=0;
    statobj[v]++;
}
const compiletsv=(fn)=>{
    const lines=readTextLines(srcfolder+fn);
    for (let i=0;i<lines.length;i++) {
        const obj=parseLine(lines[i]);
        incObj(obj.ps,'ps');
        incObj(obj.cas,'cas');
        incObj(obj.num,'num');
        
        incObj(obj.base,'base');
        incObj(obj.gender,'gender');

        incObj(obj.root,'root');
        incObj(obj.meaning,'meaning');

        //const rootfrag=(obj.root||'').replace(/ /g,'').split(/[・（）\(\),､、→／，～「」]/);
        //rootfrag.forEach(it=>incObj(it,'root'));

        // if (obj.cas=='善き、善巧の、巧みな') console.log(fn,obj.pn)
        //const meaningfrag=(obj.meaning||'').replace(/ /g,'').split(/[・（）\(\),､、→／，～「」]/);
        //meaningfrag.forEach(it=>incObj(it,'meaning'));
    }
    
}
files.forEach(compiletsv)
for (let i in statobjects) {
    let arr=fromObj( statobjects[i],(a,b)=>[a,b]);
    arr.sort((a,b)=>b[1]-a[1]);
    arr=arr.map(it=>it.join('\t'))
    writeChanged('../cs/off/'+i+'.tsv',arr.join('\n'),true)
}
