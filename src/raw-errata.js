export const LemmaPatch={
//'seyyathīdaṃ':'seyyathidaṃ', //for lemma
//'evarūpāya':'evarūpā',

	'dn1_13-2':{'pāṇi-saraṃ':'pāṇissaraṃ'},
	'dn1_26-2':{'vivar(d)aṇaṃ':'vivadaṇaṃ'},
	'dn1_15-2':{'kaṭṭ(h)issaṃ':'kaṭṭissaṃ'},
	'dn1_16-2':{'b(v)ījaniṃ':'vījaniṃ','n(a)hāpanaṃ':'nhāpanaṃ'}, //vījaniṃ扇子 nhāpanaṃ字典查得到，似乎不是錯字
	'dn1_26-2':{'saṃvar(d)aṇaṃ':'saṃvadaṇaṃ','vivar(d)aṇaṃ':'vivadaṇaṃ'},
	'dn1_21-2':{'uppāt(d)aṃ':'uppātaṃ','tappan(ṇ)aṃ':'tappanaṃ'},
	'dn1_27-2':{'anupp(p)adānaṃ':'anuppadānaṃ','tappan(ṇ)aṃ':'tappanaṃ'},
	'dn1_31-1':{'upatt(kk)ilese':'upakkilese'}, //dn1 31-1 should be upkkilese
	'dn1_46-8':{'s(p)ammussati':'pammussati','s(p)ammussati.':'pammussati.'}, //dn1 46-8
	'dn1_171-2':{'naatthi':'natthi'},
	'dn1_155-3':{'sañjayaṃ':'sañcayaṃ'},// 155-4
	'dn1_155-4':{'sañjayaṃ':'sañcayaṃ'},
	'dn1_171-2':{'naatthi':'natthi'},
	'dn1_197-2':{'pāṇi-saraṃ':'pāṇissaraṃ'},
	'dn1_199-2':{'kaṭṭ(h)issaṃ':'kaṭṭissaṃ'},
	'dn1_200-2':{'n(a)hāpanaṃ':'nhāpanaṃ','b(v)ījaniṃ':'vījaniṃ'},
	'dn1_205-2':{'uppāt(d)aṃ':'uppādaṃ'},
	'dn1_210-2':{'saṃvar(d)aṇaṃ':'saṃvadaṇaṃ','vivar(d)aṇaṃ':'vivadaṇaṃ'},
	'dn1_211-2':{'anupp(p)adānaṃ,':'anuppadānaṃ','tappan(ṇ)aṃ':'tappanaṃ'},
	'dn1_382-3':{'manusakena':'mānusakena'},
	'dn2_96-1':{'idapaccayā':'idappaccayā'},
	'dn2_156-6':{'giñjakaāvasathe':'giñjakāvasathe'},
	'dn2_273-6':{'dukkhassaantaṃ':'dukkhassantaṃ'},//
	'dn2_277-8':{'dukkhassaantaṃ':'dukkhassantaṃ'},//
	'dn2_317-2':{'assudha (assa)':'assudha'},
	'dn3_43-1':{'padosikāaṃ':'padosikaṃ'},//
	'dn3_341-12':{'ākāsāa':'ākāsā'}, 
	'dn3_359-21':{'ākāsāa':'ākāsā'}, //


	'mn1_mn01c26-10':{'panaudana':'panudana'},
		'mn1_138-5':{'panaudana':'panudana'}, //for gen-orig, use lastest pn
	'mn1_234-3':{'gaddhaba':'gaddha'}, //鷹
	'mn1_375-1':{'aparṃ':'apara'},
	'mn1_411-12':{'ukkoṭanavañcana-nikati-sāciyogā':'ukkoṭanavañcananikatisāciyogā'
	,'chedana-vadhabandhanaviparāmosa-ālopa-sahasākārā':'chedanavadhabandhanaviparāmosaālopasahasākārā'},
	'mn2_330-1':{'aparṃ':'apara'},
	'mn2 372-24':{'arahanto(-antā)':'arahanto'}, 
	'mn3_189-15':{'mahāamatta':'mahāmatta'},
	'sn1_176-10':{'manusakena':'mānusakena'},
	'sn2_sn12c60-5':{'Parivīmaṃsaana':'Parivīmaṃsana'},
		'sn2_60-39':{'Parivīmaṃsaana':'Parivīmaṃsana'}, //for gen-orig
	'sn2_sn14c21-1':{'Appasuta':'Appassuta'},
		'sn2_14c21':{'Appasuta':'Appassuta'},//for gen-orig
	'sn4_132-26':{'kiñciakkha':'kiñcikkha'},
	'sn5_1083-10':{'ponobhavikā':'ponobbhavikā'},//

	// 'an3_98-1':{'saṅkhyaṃ':'saṅkhayaṃ'},//
	// 'an3_106-6':{'a’ṇu':'aṇu'},
	'an3_130-4':{'manusakena':'mānusakena'},
	'an3_131-5':{'manusakena':'mānusakena'},
}

const bhavissati={'bhavissati':'bhū	動	未	能	単	三	ある、なる'};
export const DefPatch={
	'mn1_102-13':{'pahāya':'pra-hā	動	連	‐	‐	‐	捨てる'},
	'mn1_159-28':{'ayaṃ':'	代	代的	女	単	主	これ'},
	'mn1_415-10':bhavissati, //只出現bhavissanti},
	'mn1_435-12':bhavissati, //只出現bhavissanti},
	'mn1_431-8':{'nisīdiṃ':'ni-sad	動	ア	能	単	一	坐する'},
	'mn2_257-10':{'agacchiṃ':'gam	動	ア	能	単	一	行く'},
	'mn2_309-20':{'kāresi':'kṛ　使	動	ア	能	単	三	なさしめる'},//同上 先出現 
	'mn2_315-8':{'kāresi':'kṛ　使	動	ア	能	単	三	なさしめる'},//同上 先出現 
	'mn2_470-15':{'pajānāmī':'pra-jñā	動	現	能	単	一	知る、了知する'},//在上一句
	'mn3_76-11':{'ārādhentī':'ā-rādh　使	動	現	能	複	三	喜ばせる、到達する'},// ārādhentntti 是錯字
	'sn1_249-16':{'pahīyetha':'pra-hā　受	動	願	反	単	三	捨てられる'},
	'sn2_146-5':{'apakassa':'	動	連	‐	‐	‐	除去する、捨てる'},
	'sn4_247-24':{'ḍessāmī':'ḍī	動	未	能	単	一	飛ぶ'},//我增加的
	'sn4_345-69':{'paṭibhāsi':'prati-bhā	動	ア	能	単	三	明らかとなる、現れる、見える、思える'},
	'an3_30-7':{'manasi':'manasi-kṛ	動	命	能	複	二	作意する','karoti':'kṛ	動	現	能	単	三	作意する|manasi'},
	'an4_90-27':{'vadeyya':'vad	動	願	能	単	三	言う'},
	'an4_192-48':{'anuparivattati':'anu-pari-vṛt	動	現	能	単	三	随転する、従事する'},
	'an5_209-3':{'sārajjanti':'saṃ-raj	動	現	能	複	三	執着する、貪着する'},
	'sn4_351-31':{'labheyyaṃ':'labh	動	願	能反	依（属）	一	得る'},
	'sn3_347-10':{'carāma':'car	動	現	能	複	一	行ずる'},
	'an7_72-90':bhavissati,
	'an10_111-6':{'asekhāya':'a-śikṣ	名	a	女	単	具	無学'},
			
}

//修改 內文
export const RawPatch={
    'dn1_168-4':[["natthi","na,atthi",6]],
    'dn1_171-2':[["naatthi","na atthi"],["natthi","na,atthi",9]],
     ['dn1_242-3']:[
        ["vītarāgaṃ","vīta rāgaṃ",2]
    ],
    'sn2_150-9':[["natthi","na,atthi",4]],
    'sn3_212-7':[["natthi","na,atthi",3]]
}


export const RawDefPatch={
	'dn2_246-1':[['satta\t\t数\t特\t‐\t有（帯）','satta\t\t数\t特\t‐\t有（帯）\t七']],
	'sn4_351-31':[['labheyyaṃ\t依（属）','labheyyaṃ\tlabh\t動\t願\t能反\t単\t一\t得る']]
}


