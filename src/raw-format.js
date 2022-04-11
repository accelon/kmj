export const parseRaw=lines=>{
    const out=[];
    let pn='',defs=[],pali='',jp='',memo='';
    const addEntry=()=>{
        out.push({pali,pn,defs,memo,jp});
        pn='',pali='',memo='', jp='',  defs=[];
    }
    for (let i=0;i<lines.length;i++){
        const line=lines[i];
        const first=line.charAt(0);
        if (line.slice(0,2)=='^n') {
            pn=line.slice(2);
            continue;
        } else if (first==='㊣') {
            if (pali) addEntry( pali, defs);
            pali=line.slice(1);
        } else if (first==='㊔'||first==='㊒') {
            defs.push(line.slice(1));
        } else if (first==='㉆') {
            jp=line.slice(1);
        } else if (first==='㊟') {
            memo+=line.slice(1);
        }  else {
            console.log(line)
            throw 'unknown line type'
        }

    }
    return out;
}