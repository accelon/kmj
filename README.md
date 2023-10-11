# kmj
komyoji html to offtext


## dump 抓網頁
從光明寺網站取回html，放到 html/?n 目錄，去除中間目錄。

    node crawl [pat]
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

## 搭配 accelon/cs 
產生 cs 需要的對照表

    node gen-cs

## 產生 日譯對齊文件 到 off

    node gen-jp