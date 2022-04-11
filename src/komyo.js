const knowngaps={'dn286~293':true};
const addgaps=(prefix,str)=>{
	str.split(',').forEach(item=>knowngaps[prefix+item]=true)
}
addgaps('sn','225~240,251~274,277~300,352~361,362~391,395~397,398~407,408~437,441~449,450~459,460~549,552~561,562~601,612~616,617~621,622~626,627~631,632~636,637~641,642~646,647~651,652~656,657~660,681~688,689~695,696~701,702~706'); //sn3
addgaps('sn','171~173,174~176,177~179,180~182,183~185,189~191,192~194,195~197,198~200,201~203,207~209,210~212,213~215,216~218,219~221,379~408');
addgaps('sn','42~47,50~54,57~61,64~68,71~75,78~82,85~89,92~95,98~102,115~120,122~126,128~132,134~138,224~240,250~274,270~279,258~269,276~300,280~291,292~301,302~310,311~366,417~428,429~438,439~450,451~460,461~470,541~586,587~596,597~640,641~650,651~672,673~684,685~694,695~704,705~748,749~758,759~791,792~802,803~812,845~888,889~898,923~966,967~976,1166~1171,1175~1177,1178~1180,1181~1183,1184~1186,1187~1189,1190~1192,1193~1195,1196~1198,1199~1200');
addgaps('an','102~109,118~128,132~139,142~149,152~159,162~169,175~186,281~283,285~286,288~289,291~292,294~295,336~338,339~341,342~344,345~347,348~350,351~353,354~356,357~359,360~362,363~365,366~381,383~389,390~393,394~397,398~401,402~406,407~411,412~418,419~426,427~434,435~442,443~452,453~462,463~472,473~482,483~492,493~502,503~512,513~522,523~532,533~542,543~552,564~570,575~576,577~579,580~583,584~599,156~166,200~209,225~228,229~232,233~236,240~266,267~746,3~5,13~14,39~40,49~50,51~54,61~62,63~64,65~67,69~70,73~74,81~83,85~86,91~92,97~98,104~105,108~110,113~114,117~118,119~120,217~218,22~29,30~69,70~117,118~165,166~213,214~261,262~309,310~357,358~405,406~453,454~501,503~511,512~671,1~6,7~8,11~12,1~10,11~14,21~22,23~24,25~26,27~28,35~36,37~38,39~40,54~55,66~67,72~73,110~114,175~186,189~190,198~200,219~223,260~261,290~295,386~387,398~401,402~406,600~611,191~200,202~230,232~246,78~79,191~200,202~230,232~246,17~19,20~21,22~24,78~79,124~127,143~151,153~163,169~171,191~200,202~230,157~163,164~183,97~99,147~155,157~163,164~184,3~4,5~10,54~55,77~78,82~86,88~91,97~99,104~106,107~112,119~120,124~125,138~143,144~146,147~156,157~163,164~184,277~303,304~783,17~19,43~44,55~56,74~75,81~85,98~99,101~102,105~106,118~120,125~126,136~137,142~145,149~150,175~176,207~210,214~217,221~231,254~256,258~263,264~273,274~783,1~2,3~4,17~20,42~44,45~46,53~54,55~56,57~60,61~64,71~72,73~75,79~80,81~86,88~90,91~92,95~96,97~100,101~102,105~106,111~117,118~120,124~126,129~130,133~134,135~138,139~140,141~146,147~150,151~155,156~158,164~166,167~168,173~183,199~200,201~210,211~220,221~231,234~240,241~242,244~245,246~249,250~253,254~256,257~263,257~263,265~271,273~285,287~292,294~302,308~1151,18~20,59~60,61~62,63~64,67~70,91~92,94~95,107~108,109~110,116~117,125~126,135~136,171~173,203~204,207~208,223~224,225~226,251~253,273~285,293~302,120~139,143~169,170~649,2~4,5~7,8~9,21~22,32~33,39~40,47~48,65~67,73~74,82~84,88~89,92~95,96~97,119~121,2~7,14~15,21~22,31~34,38~41,45~48,65~67,68~69,71~74,75~77,80~81,82~84,86~95,96~106,107~116,96~622,626~652,653~1132,1~5,17~19,44~45,48~49,1~10,16~19,24~26,27~31,37~42,47~48,50~51,54~55,57~60,65~66,69~70,72~73,75~82,91~116,120~146,147~626,3~4,17~18,25~26,49~50,59~60,67~68,71~72,73~79,81~82,2~4,6~8,13~14,15~18,21~27,31~34,37~38,39~40,41~48,49~50,51~53,54~55,56~58,59~60,61~65,71~80,81~626,74~81,84~91,95~112,113~432,8~10,15~16,17~18,27~28,30~31,32~33,46~51,1~2,4~5,7~10,15~19,24~25,33~34,39~40,42~51');


const allbookbreaks={
	'dn':{'dn14c01':2,'dn24c01':3},
	'mn':{'mn06c01':2,'mn11c01':3},
	'sn':{'sn12c01':2,'sn22c001':3,'sn35c001':4,'sn45c001':5},
	'an':{'an02c01':2,'an03c001':3,'an04c001':4,'an05c001':5,'an06c001':6,'an07c001':7}

}

const komyobookbreaks=nikaya=>allbookbreaks[nikaya];
module.exports={komyobookbreaks,knowngaps};