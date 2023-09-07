# kmj
komyoji html to offtext


## dump 抓網頁
從光明寺網站取回html，放到 html/?n 目錄，去除中間目錄。

    node dump [pat]
    pat: dn,mn,sn,an,kn


## tidy 簡化標記

將光明寺 html 轉為純文本。行首置欄位類型。
㊣巴利原文 ㊔名詞 ㊒動詞 ㉆日譯 ㊟注文

    node tidy [bkid]
    bkid 為每一冊的檔名或集合名（如kn 代表所有小部的經）
    bkid 沿用suttacentral 命名規則

## lexicon 產生字典
lemma = entry + nth sense (nth==0 可省略) lemma 為語義確定的form
lemma串，去掉標點符號。

    node lexicon 

每個詞叫form ，form 是在經文呈現出的單詞拼法，
kmj 拆分帶屬性的詞為 entry 。
lexicon = 以entry為主鍵的詞典，每個entry 有 sense 的陣列。


## grammar 逐詞文法
產生每一冊的逐字文法檔
    
    node grammarlist [bkid]

## json

轉成經文 json 格式，以「段.句」為key ，含巴利原文，以及當段lemma串。
lemma 有引用其他經段的，須設法展開。

    node json

比較經文及lemma串，產生逐詞拆分表 , {長詞:["拆法","拆法1"]}
並將經文串流標為lemma