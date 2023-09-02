# kmj
komyoji html to offtext

## prerequisite
node crawl.js [pat]
pat: dn,mn,sn,an,kn

## steps

將光明寺 html 轉為純文本。行首置欄位類型。
㊣巴利原文 ㊔名詞 ㊒動詞 ㉆日譯 ㊟注文

    node tidy  



每個詞叫form ，form 是在經文呈現出的單詞拼法，
kmj 拆分帶屬性的詞為 entry 。
lexicon = 以entry 為key 的詞典，每個entry 有 sense 的陣列。

lemma = entry + nth sense (nth==0 可省略) lemma 為語義確定的form
lemma串，去掉標點符號。

    node lexicon 

轉成經文 json 格式，以「段.句」為key ，含巴利原文，以及當段lemma串。
lemma 有引用其他經段的，須設法展開。

    node json

比較經文及lemma串，產生逐詞拆分表 , {長詞:["拆法","拆法1"]}
並將經文串流標為lemma