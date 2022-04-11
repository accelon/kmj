const regMorphed=/([bcdghjklmnprstvyṅñṇḍṭḷṁṃŋaāiīuūeo\-\+\d#]+)/gi;
const regLemmaN=/([bcdghjklmnprstvyṅñṇḍṭḷṁṃŋaāiīuūeod]+)(#\d+)?/gi;
const regLemma=/([bcdghjklmnprstvyṅñṇḍṭḷṁṃŋaāiīuūeo\-’]+)/gi;
const regToken=/([bcdghjklmnprstvyṅñṇḍṭḷṁṃŋaāiīuūeo\-]+)/gi;
const regLex=/([bcdghjklmnprstvyṅñṇḍṭḷṁṃŋaāiīuūeo’]+#?\d*)|X\([ ,\d+\-\|~]+\)/gi
const regPart=/([bcdghjklmnprstvyṅñṇḍṭḷṁṃŋaāiīuūeod]+#?\d*)/i;
const regRef=/X\(([ ,，\d\-~]+)\|(\d+)\)/;
module.exports={regMorphed,regLemmaN,regLex,regPart,regRef,regLemma,regToken};