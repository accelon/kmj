/* crawl komyoji website*/
import {nodefs,writeChanged} from 'ptk/nodebundle.cjs'
await nodefs;
const desfolder='html/';
const pat=process.argv[2]||'dn01';
import {getFileList,host,sjis2utf8} from './src/crawlfile.js'

const filelist=(await getFileList()).filter(it=>it.startsWith(pat));

const downloadfile=async f=>{
    const [filename,title]=f.split('\t');
    const at=filename.lastIndexOf('/');
    const folder=filename.slice(at+1,at+3);
    const localfilename=desfolder+folder+'/'+filename.slice(at+1);
    if (!fs.existsSync(desfolder+folder)) {
        fs.mkdirSync(desfolder+folder);
    }
    const remotefilename=filename.replace('.htm','')+'.files/sheet001.htm';
    const res=await fetch(host+remotefilename);
    const text=sjis2utf8 (await res.arrayBuffer()).replace('shift_jis','utf8');
    writeChanged(localfilename,text,true);
}
for (let i=0;i<filelist.length;i++) {
    await downloadfile(filelist[i])
}
