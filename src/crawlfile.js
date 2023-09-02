import {readTextLines,readTextContent,writeChanged} from 'ptk/nodebundle.cjs'

export const host='https://komyojikyozo.web.fc2.com/'
export const sjis2utf8=buf=>{
    const decoder = new TextDecoder('shift_jis');
    const r = decoder.decode(buf);
    return r;
}

export const getFileList=async ()=>{
    if (!fs.existsSync('menu.html')){
        const res=await fetch(host+'menu.html')
        const text=sjis2utf8(await res.arrayBuffer());
        writeChanged('menu.html',text,true);
    }
    
    const buildFileList=(content)=>{
        const out=[];
        content.replace(/<A href=([a-z]+\/[a-z]+\d+\/[\da-z]+\.htm)[^>]+>([^<]+)/g,(m,filename,title)=>{
            out.push(filename+'\t'+title);
        })
        return out;

    }
    const menuhtml=readTextContent('menu.html');

    if (!fs.existsSync('filelist.txt')){
        const filelist=buildFileList(menuhtml);
        if (filelist.length) writeChanged('filelist.txt',filelist.join('\n'));
    }
    const out=readTextLines('filelist.txt')
    
    return out;
}
