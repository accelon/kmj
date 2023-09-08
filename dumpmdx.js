import {nodefs, writeChanged} from 'ptk/nodebundle.cjs'
import {default as jsdict}  from "js-mdict"
await nodefs
// Note: *.mdd file only support lookup method.
const Mdict=jsdict.default;
// loading dictionary

const dict = new Mdict("xsjrihanshuangjie.mdd");

writeChanged('xsjrihanshuangjie.json2',JSON.stringify(dict),true)
