export const parseLine=line=>{
    const [pn,rawtoken,lemma,root, ps,base,gender,num,cas,meaning ]=line.split('\t');
    return {pn,rawtoken,lemma,root,ps, base,gender,num,cas,meaning};
}