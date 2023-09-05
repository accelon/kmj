export const test1=`^n1-0
㊑dn/dn01c01.htm
㊣ Namo tassa bhagavato arahato sammāsambuddhassa
㊔Namo	nam	名	as	中	単	主	南無、礼拝
㊔tassa		代	代的	男	単	与	それ、かれ
㊔bhagavato		名	ant	男	単	与	世尊
㊔arahato	arh	名現分	ant	男	単	与	阿羅漢、応供
㊔sammā		不変	‐	‐	‐	‐	正しい、正しく
㊔sambuddhassa	saṃ-budh	名過分	a	男	単	与	等覚者`.split(/\r?\n/)

//同上
export const test2=`^n168-4
㊣Natthi attakāre, natthi parakāre, natthi purisakāre, natthi balaṃ, natthi vīriyaṃ, natthi purisathāmo, natthi purisaparakkamo.
㊔Na		不変	‐	‐	‐	‐	ない
㊒atthi	as	動	現	能	単	三	ある
㊔atta		名	an	男	依（具）	自分、我、アートマン
㊔kāre,	kṛ	名	a （代）	男	複	主	行為、所作、字、文字、作者
㊔natthi	同上
㊔para		形	代的	‐	依（具）	他の、上の、超えた
㊔kāre,	kṛ	名	a （代）	男	複	主	行為、所作、字、文字、作者
㊔natthi	同上
㊔purisa		名	a	男	依（具）	人間、男
㊔kāre,	kṛ	名	a （代）	男	複	主	行為、所作、字、文字、作者
㊔natthi	同上
㊔balaṃ,		名形	a	中	単	主	力
㊔natthi	同上
㊔vīriyaṃ,		名	a	中	単	主	精進、勤
㊔natthi	同上
㊔purisa		名	a	男	依（属）	人間、男
㊔thāmo,		名	a	男	単	主	力、勢力
㊔natthi	同上
㊔purisa		名	a	男	依（属）	人間、男
㊔parakkamo.	para-kram	名	a	男	単	主	努力
㉆自己の行為はなく、他者の行為はなく、人間の行為はない。〔浄穢を決定するような〕力はない。精進はない。人間の力はない。人間の努力はない。
㊟・ Natthi attakāre ほかを、『南伝』は「自作もなく」、『パーリ』は「自己による行為はない」、『原始』は「自己による諸行為はなく」などと主格ふうに解する。このゴーサーラの所説をはじめ、ニカーヤ中には、 -e という形の語を、男中性複数主格で取ると通じやすい箇所が散見される。水野文法 §24-1. の注でいわれる古形 -āse と似たものか。おそらく a 語基にもかかわらず代名詞的変化をしているものと思われるため、語基を a （代）とした。
㊟・ vīriya は viriya の異体と解した。`.split(/\r?\n/)

//同上
export const test3=`^n1-4
㊣ Tatra sudaṃ suppiyo paribbājako anekapariyāyena buddhassa avaṇṇaṃ bhāsati, dhammassa avaṇṇaṃ bhāsati, saṅghassa avaṇṇaṃ bhāsati;
㊔Tatra		不変	‐	‐	‐	‐	そこで、そこに、そのとき、そのなかで、
㊔sudaṃ		不変	‐	‐	‐	‐	じつに、まさに
㊔suppiyo		名	a	男	単	主	人名、スッピヤ
㊔paribbājako	pari-vraj	名	a	男	単	主	遍歴行者、遊行者
㊔aneka		形	代的	‐	持	一つならぬ、多くの
㊔pariyāyena	pari-i	名	a	男	単	具	法門、理由
㊔buddhassa	budh	名過分	a	男	単	属	仏、仏陀、覚者
㊔avaṇṇaṃ		名	a	中	単	対	不称賛、誹謗
㊒bhāsati,	bhāṣ	動	現	能	単	三	語る、話す、言う
㊔dhammassa	dhṛ	名	a	男中	単	属	法、仏法
㊔avaṇṇaṃ		名	a	中	単	対	不称賛、誹謗
㊔bhāsati,	同上
㊔saṅghassa	saṃ-hṛ	名	a	男	単	属	僧、僧伽
㊔avaṇṇaṃ		名	a	中	単	対	不称賛、誹謗
㊔bhāsati;	同上`.split(/\r?\n/)

//引用
export const test4=`^n274-11
㊣‘sotthi, bhaddante [bhadante (sī. syā.)], hotu rañño;
㊔‘sotthi,		名	i	女	単	主	平安、安穏、幸福、吉祥
㊔bhaddante		名	a	男	単	呼	尊者、大徳
㊒hotu	bhū	動	命	能	単	三	ある
㊔rañño;		名	an	男	単	属	王
㉆「尊者よ、王に平穏あれ。
㊟・辞書類によれば、 bhaddante の語は a 語基男性名詞の特殊な呼格であるが、「汝に吉祥あれ」 bhaddaṃ te に由来するらしい。
^n274-12
㊣sotthi, bhaddante, hotu rañño’ti.
㊔sotthi, bhaddante, hotu rañño (274-11)
㊔ti.		不変	‐	‐	‐	‐	と、といって、かく、このように、ゆえに`.split(/\r?\n/)

//㊔imesaṃ 前後定義不同
export const test5=`^n194-11
㊣“Pisuṇaṃ vācaṃ pahāya pisuṇāya vācāya paṭivirato hoti; ito sutvā na amutra akkhātā imesaṃ bhedāya; amutra vā sutvā na imesaṃ akkhātā, amūsaṃ bhedāya.
㊔“Pisuṇaṃ		形	a	女	単	対	離間の、中傷の
㊔vācaṃ	vac	名	ā	女	単	対	語、言葉 →両舌
㊒pahāya	pra-hā	動	連	‐	‐	‐	捨てる、断ずる
㊔pisuṇāya		形	a	女	単	奪	離間の、中傷の
㊔vācāya	vac	名	ā	女	単	奪	語、言葉
㊔paṭivirato	prati-vi-ram	過分	a	男	単	主	回避した、離れた
㊒hoti;	bhū	動	現	能	単	三	ある、存在する
㊔ito		不変	‐	‐	‐	‐	これより、ここから
㊒sutvā	śru	動	連	‐	‐	‐	聞く
㊔na		不変	‐	‐	‐	‐	ない
㊔amutra		不変	‐	‐	‐	‐	そこに、あそこに
㊔akkhātā	ā-khyā	名	ar	男	単	主	告げるもの、語るもの
㊔imesaṃ		代	代的	男	複	属	これら
㊔bhedāya;	bhid	名	a	男	単	与	破壊、不和合
㊔amutra		不変	‐	‐	‐	‐	そこに、あそこに
㊔vā		不変	‐	‐	‐	‐	あるいは
㊒sutvā	śru	動	連	‐	‐	‐	聞く
㊔na		不変	‐	‐	‐	‐	ない
㊔imesaṃ		代	代的	男	複	与	これら
㊔akkhātā,	ā-khyā	名	ar	男	単	主	告げるもの、語るもの
㊔amūsaṃ		代	代的	男	複	属	それら、あれら
㊔bhedāya.	bhid	名	a	男	単	与	破壊、不和合`.split(/\r?\n/)

//addhānamaggappaṭipanno 自動拆分
export const test6=`^n1-2
㊣ ekaṃ samayaṃ bhagavā antarā ca rājagahaṃ antarā ca nāḷandaṃ addhānamaggappaṭipanno hoti mahatā bhikkhusaṅghena saddhiṃ pañcamattehi bhikkhusatehi.
㊔ekaṃ		数	代的	男	単	副対	一、とある
㊔samayaṃ		名	a	男	単	副対	時、集会
㊔bhagavā		名	ant	男	単	主	世尊
㊔antarā		名形	a	中	単	副奪	途中、中間
㊔ca		不変	‐	‐	‐	‐	と、また、そして、しかし
㊔rājagahaṃ		名	a	男	単	対	地名、王舎城、マガダ国の首都
㊔antarā		名形	a	中	単	副奪	途中、中間
㊔ca		不変	‐	‐	‐	‐	と、また、そして、しかし
㊔nāḷandaṃ		名	a	女	単	対	地名、王舎城付近の村
㊔addhāna		名	a	中	依（与）	時間、世、行路、旅行
㊔magga		名	a	男	依（対）	道 →道路、旅路
㊔paṭipanno	prati-pad	過分	a	男	単	主	目的に向かって歩いた、進んだ
㊒hoti	bhū	動	現	能	単	三	ある、存在する
㊔mahatā		形	ant	男	単	具	大きな、偉大な
㊔bhikkhu	bhikṣ	名	u	男	依（属）	比丘、（特に男性の）出家者
㊔saṅghena	saṃ-hṛ	名	a	男	単	具	僧伽、（特に仏教の）教団
㊔saddhiṃ		不変	‐	‐	‐	‐	共に、一緒に（具格支配）
㊔pañca		数	特	‐	帯	五
㊔mattehi		形	a	中	複	具	量、だけ、のみ、程度
㊔bhikkhu	bhikṣ	名	u	男	帯	比丘
㊔satehi.		数	a	中	複	具	百`.split(/\r?\n/);

//should return 201-24 , 205-5, 205-6
export const test7=`^n201-24
㊣201-24
^n204-1
㊣ 204. ‘‘Tatraggivessana, ye te samaṇabrāhmaṇā evaṃvādino evaṃdiṭṭhino –
㊔204. ‘‘Tatraggivessana, ye te samaṇabrāhmaṇā evaṃvādino evaṃdiṭṭhino – (201-24.)
^n205-5
㊣205-5
^n205-6
㊣205-6
^n205-8
㊣ dukkhaṃyeva tasmiṃ samaye vedanaṃ vedeti.
㊔dukkhaṃyeva tasmiṃ samaye vedanaṃ vedeti. (205-5, 6.)`.split(/\r?\n/);