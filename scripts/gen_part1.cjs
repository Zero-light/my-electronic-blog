const fs=require('fs');
const w=[
["abandon","/əˈbændən/","v. 放弃","They had to abandon the ship.","She abandoned her dream.","abandon hope","abandoned a.","abandonment n."],
["ability","/əˈbɪləti/","n. 能力","She has the ability to lead.","This test measures ability.","ability to do","able a.","inability n."],
["able","/ˈeɪbl/","a. 能够的","I am able to finish on time.","She is able to speak French.","be able to","ability n.","ably adv."],
["abroad","/əˈbrɔːd/","adv. 在国外","She studied abroad for two years.","He dreams of working abroad.","go abroad","study abroad",""],
["absence","/ˈæbsəns/","n. 缺席；缺乏","His absence was noted by all.","In the absence of evidence.","absence of","absent a.","absentee n."],
["absolute","/ˈæbsəluːt/","a. 绝对的；完全的","That is absolute nonsense.","I have absolute confidence in her.","absolute power","absolutely adv.","absolutism n."],
["absorb","/əbˈzɔːb/","v. 吸收；吸引","Plants absorb sunlight.","I was absorbed in the novel.","be absorbed in","absorption n.","absorbing a."],
["abstract","/ˈæbstrækt/","a. 抽象的 n.摘要","The concept is too abstract.","Write an abstract of the paper.","abstract art","abstraction n.","abstractly adv."],
["abundant","/əˈbʌndənt/","a. 丰富的；充裕的","Food was abundant at the party.","The region has abundant resources.","abundant in","abundance n.","abundantly adv."],
["abuse","/əˈbjuːz/","v./n. 滥用；虐待","He abused his power.","She suffered years of abuse.","drug abuse","abusive a.","abuser n."],
["academic","/ˌækəˈdemɪk/","a. 学术的；学院的","Her academic record is excellent.","He pursued an academic career.","academic year","academy n.","academically adv."],
["accelerate","/əkˈseləreɪt/","v. 加速；促进","The car accelerated quickly.","We need to accelerate growth.","accelerate progress","acceleration n.","accelerator n."],
["accept","/əkˈsept/","v. 接受；承认","She accepted the job offer.","I accept your apology.","accept responsibility","acceptable a.","acceptance n."],
["access","/ˈækses/","n./v. 通道；访问","Students need access to resources.","You can access the data online.","have access to","accessible a.","accessibility n."],
["accompany","/əˈkʌmpəni/","v. 陪伴；伴随","She accompanied me to the party.","Rain accompanied the storm.","be accompanied by","companion n.","accompaniment n."],
["accomplish","/əˈkʌmplɪʃ/","v. 完成；实现","We accomplished our mission.","What did you accomplish today?","accomplish a goal","accomplishment n.","accomplished a."],
["account","/əˈkaʊnt/","n. 账户；解释 v.说明","Open a bank account.","How do you account for this?","account for","accountant n.","accountable a."],
["accurate","/ˈækjərət/","a. 准确的；精确的","We need accurate data.","Her description was accurate.","accurate measurement","accuracy n.","accurately adv."],
["achieve","/əˈtʃiːv/","v. 达到；取得","He achieved his goal of going to university.","What do you want to achieve?","achieve success","achievement n.","achievable a."],
["acknowledge","/əkˈnɒlɪdʒ/","v. 承认；确认；致谢","She acknowledged her mistake.","Please acknowledge receipt.","acknowledge that","acknowledgment n.","acknowledged a."],
["acquire","/əˈkwaɪər/","v. 获得；习得；收购","It takes years to acquire a language.","The company acquired a startup.","acquire knowledge","acquisition n.","acquisitive a."]
];
