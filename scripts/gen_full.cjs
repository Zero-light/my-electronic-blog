/**
 * Generate 3000+ word bank from multiple sources + smart templates
 * 1. Load wordbank.json (410 hand-crafted words)
 * 2. Load kaoyan_basic.json (1050 words)
 * 3. Generate missing examples via templates
 * 4. Output merged wordbank.json
 */
const fs=require('fs');
const path=require('path');
const out='../public/assets/words/wordbank.json';

// Load existing sources
let words=[];
const seen=new Set();

function add(word,phonetic,meaning,ex1,ex2,col1,col2,der1,der2){
  const k=word.toLowerCase();
  if(seen.has(k)) return;
  seen.add(k);
  words.push({word,phonetic,meaning,examples:[ex1||'',ex2||''].filter(Boolean),collocations:[col1||'',col2||''].filter(Boolean),derivatives:[der1||'',der2||''].filter(Boolean)});
}

// 1. Load existing wordbank.json
try{
  const j=JSON.parse(fs.readFileSync(out,'utf8'));
  j.words.forEach(w=>add(w.word,w.phonetic,w.meaning,w.examples[0],w.examples[1],w.collocations[0],w.collocations[1],w.derivatives[0],w.derivatives[1]));
  console.log('Loaded wordbank:',j.words.length);
}catch(e){console.log('No existing wordbank');}

// 2. Load kaoyan words
try{
  const k=JSON.parse(fs.readFileSync('../public/assets/words/kaoyan_basic.json','utf8'));
  k.words.forEach(w=>add(w.word,w.phonetic||'/--/',w.meaning,w.example||'',w.exampleTranslation||'','','','',''));
  console.log('Loaded kaoyan:',k.words.length);
}catch(e){console.log('No kaoyan');}

// 3. Smart template generation for common word patterns
const templates={
  v:['I need to [word] this carefully.','She [word]ed it yesterday.','We should [word] the plan.','He [word]s every morning.'],
  n:['The [word] is important.','This [word] helps a lot.','We discussed the [word].','A good [word] makes difference.'],
  a:['This is very [word].','She seems [word] today.','It was a [word] experience.','The result is [word].'],
  adv:['He did it [word].','She spoke [word] about it.','It happened [word].','We [word] agreed.'],
};
const commonVerbs=['accept','achieve','adapt','adjust','advance','analyze','apply','approach','approve','argue','arrange','assess','assist','assume','attempt','attract','avoid','benefit','calculate','capture','celebrate','clarify','collect','combine','communicate','compare','compete','complete','compose','concentrate','conduct','confirm','connect','consider','construct','consult','consume','contain','contribute','convert','convince','cooperate','coordinate','correct','cultivate','debate','declare','decline','decorate','define','deliver','demonstrate','depend','describe','design','destroy','detect','determine','devote','discover','discuss','display','distribute','dominate','educate','eliminate','emerge','emphasize','employ','enable','encounter','encourage','enforce','engage','enhance','ensure','establish','estimate','evaluate','examine','exceed','exchange','exclude','execute','exercise','exhibit','expand','explain','explore','export','express','extend','facilitate','finance','focus','forecast','formulate','generate','govern','guarantee','handle','highlight','identify','illustrate','implement','imply','import','impose','indicate','influence','inform','initiate','innovate','insert','inspect','install','integrate','interact','interpret','intervene','introduce','invest','investigate','involve','isolate','justify','launch','maintain','manage','manipulate','manufacture','measure','mediate','mention','migrate','modify','monitor','motivate','negotiate','notify','obtain','occupy','operate','organize','overcome','participate','perceive','perform','permit','persuade','plan','possess','predict','prepare','preserve','prevent','process','produce','promote','propose','protect','prove','provide','publish','purchase','pursue','qualify','react','realize','recognize','recommend','recover','reduce','reflect','regulate','reinforce','reject','release','rely','remove','replace','represent','request','require','research','resolve','respond','restore','restrict','reveal','review','revise','satisfy','schedule','select','separate','simplify','simulate','specify','stimulate','strengthen','submit','substitute','succeed','summarize','supervise','supply','support','suppose','surround','survive','suspend','sustain','target','tolerate','track','transfer','transform','translate','transport','treat','trigger','undergo','undertake','unify','update','upgrade','utilize','validate','verify','volunteer','witness'];
const commonNouns=['ability','absence','abundance','access','accomplishment','achievement','acquisition','adaptation','adjustment','advance','advantage','advice','agreement','allocation','alternative','ambition','analysis','application','appreciation','approach','argument','aspect','assessment','assignment','assistance','association','assumption','atmosphere','attempt','attention','attitude','authority','awareness','barrier','basis','benefit','budget','burden','campaign','capability','capacity','category','challenge','characteristic','circumstance','collapse','combination','commitment','communication','community','companion','comparison','compensation','competition','complaint','complexity','component','concentration','concept','concern','conclusion','condition','confidence','conflict','confusion','connection','conscience','consequence','conservation','consideration','consistency','constraint','construction','consumption','contact','contribution','controversy','convention','cooperation','coordination','corporation','correlation','creativity','crisis','criterion','criticism','curiosity','debate','decision','declaration','decline','defense','definition','demonstration','dependence','description','desire','destination','destruction','determination','development','device','diagnosis','difference','difficulty','dilemma','dimension','direction','disagreement','discipline','discovery','discrimination','discussion','disorder','distinction','distribution','diversity','division','documentation','dominance','duration','economy','education','effect','efficiency','effort','element','elimination','emergency','emission','emphasis','employment','encounter','encouragement','engagement','enhancement','enterprise','enthusiasm','environment','equipment','establishment','evaluation','evidence','evolution','examination','exception','exchange','exclusion','execution','exercise','exhibition','existence','expansion','expectation','experience','experiment','expertise','explanation','exploitation','exploration','exposure','extension','facility','factor','failure','feature','feedback','flexibility','foundation','framework','frequency','function','generation','goal','government','growth','guidance','hardship','highlight','hypothesis','identity','ignorance','illustration','imagination','impact','implementation','implication','importance','impression','improvement','incentive','incident','inclusion','indication','individual','industry','inequality','influence','information','infrastructure','initiative','innovation','insight','inspection','institution','instruction','integration','integrity','intention','interaction','interpretation','intervention','introduction','investigation','investment','involvement','isolation','judgment','justification','knowledge','leadership','legislation','limitation','management','manipulation','manufacturing','mechanism','medication','methodology','migration','minority','mission','modification','momentum','monitoring','motivation','negotiation','network','notion','objective','obligation','observation','obstacle','occupation','operation','opportunity','opposition','option','organization','orientation','outcome','participation','perception','performance','permission','persistence','perspective','phenomenon','philosophy','platform','policy','population','portion','possession','potential','poverty','precaution','precision','prediction','preference','prejudice','preparation','presence','preservation','pressure','prevention','priority','procedure','production','profession','progress','projection','promotion','proportion','proposal','prospect','protection','provision','publication','purpose','qualification','reaction','reality','recognition','recommendation','recovery','reduction','reflection','reform','regulation','reinforcement','rejection','relationship','relevance','reliability','relief','reluctance','replacement','representation','reputation','requirement','research','resistance','resolution','resource','response','responsibility','restoration','restriction','revelation','revenue','revolution','risk','routine','sacrifice','satisfaction','security','sensitivity','separation','significance','similarity','solution','source','specification','stability','standard','statistic','status','stimulation','strategy','strength','structure','struggle','submission','substitute','suggestion','supervision','supply','support','suppression','sustainability','symbol','tendency','tension','territory','testimony','tolerance','tradition','transformation','transition','trend','uncertainty','understanding','unemployment','unity','utilization','validity','variation','variety','venture','version','violation','visibility','vision','volunteer','vulnerability','welfare','willingness','wisdom','withdrawal','witness'];
const commonAdjs=['abnormal','absolute','abstract','abundant','academic','acceptable','accessible','accurate','active','actual','acute','adequate','advanced','adverse','aggressive','alert','alternative','ambiguous','ambitious','ancient','annual','apparent','applicable','appropriate','arbitrary','artificial','attractive','automatic','available','aware','basic','beneficial','capable','chronic','classic','cognitive','coherent','collective','commercial','comparable','compatible','competent','competitive','complete','complex','comprehensive','concentrated','confident','conscious','conservative','considerable','consistent','constant','contemporary','contradictory','controversial','convenient','conventional','convincing','cooperative','corporate','correct','creative','critical','crucial','cultural','current','decisive','defensive','democratic','dense','dependent','desirable','desperate','destructive','determined','digital','diverse','domestic','dominant','dramatic','dynamic','effective','efficient','elaborate','electronic','emotional','empirical','enormous','enthusiastic','environmental','essential','ethical','evident','evolutionary','excessive','exclusive','experimental','explicit','extensive','external','extraordinary','extreme','favorable','feasible','federal','flexible','formal','former','frequent','fundamental','general','generous','genuine','global','gradual','hostile','identical','illegal','immediate','immune','implicit','impressive','inadequate','inclusive','independent','indigenous','individual','industrial','inevitable','influential','inherent','initial','innovative','instant','integral','intellectual','intense','intensive','interactive','internal','intimate','invisible','involved','isolated','keen','legislative','legitimate','liberal','limited','literal','logical','magnetic','massive','mature','maximum','mechanical','mental','military','minimal','mobile','moderate','modest','moral','mutual','narrative','negative','negligible','nervous','neutral','notable','numerous','objective','obvious','operational','opposing','optimal','organic','original','overall','partial','particular','passive','permanent','persistent','personal','physical','pleasant','polar','political','positive','potential','practical','precious','precise','predictable','preliminary','premium','primary','prime','primitive','principal','productive','professional','profound','progressive','prominent','promising','proper','prospective','protective','provincial','psychological','public','punctual','radical','random','rapid','rational','raw','realistic','reasonable','receptive','reciprocal','regulatory','relevant','reliable','remarkable','remote','renewable','representative','residential','resistant','responsible','restricted','revolutionary','rigid','robust','rural','satisfactory','sensitive','severe','sexual','significant','similar','skeptical','skilled','social','solar','sole','sophisticated','specific','spectacular','spiritual','stable','statistical','steady','strategic','strict','structural','subjective','substantial','successful','sufficient','suitable','superficial','superior','sustainable','symbolic','systematic','temporary','tender','theoretical','thorough','tolerant','toxic','traditional','transparent','tremendous','trivial','typical','ultimate','unanimous','uncomfortable','underground','underlying','unique','universal','unprecedented','urban','urgent','valid','valuable','variable','vast','verbal','viable','vigorous','violent','virtual','visible','visual','vital','vivid','voluntary','vulnerable'];

// Generate for each word without examples
function genExamples(word,pos){
  const tmpl=templates[pos]||templates.n;
  return [tmpl[0].replace('[word]',word),tmpl[1].replace('[word]',word)];
}
function genCol(word,pos){
  if(pos==='v') return ['to '+word+' effectively',word+' the process'];
  if(pos==='a') return ['highly '+word,word+' enough'];
  return ['important '+word,'key '+word];
}

let generated=0;
[commonVerbs,commonNouns,commonAdjs].forEach((list,i)=>{
  const pos=i===0?'v':i===1?'n':'a';
  list.forEach(w=>{
    if(seen.has(w.toLowerCase())) return;
    seen.add(w.toLowerCase());
    const ex=genExamples(w,pos);
    const col=genCol(w,pos);
    add(w,'',pos==='v'?'v. '+w:pos==='a'?'a. '+w:'n. '+w,ex[0],ex[1],col[0],col[1],'','');
    generated++;
  });
});

// 4. Load extra advanced words
try{
  const extra=require('./extra_words.cjs');
  extra.forEach(e=>{
    const pos=e.pos==='v'?'v':e.pos==='a'?'a':'n';
    const ex=genExamples(e.word,pos);
    const col=genCol(e.word,pos);
    add(e.word,'',e.meaning,ex[0],ex[1],col[0],col[1],'','');
  });
  console.log('Extra words loaded:',extra.length);
}catch(e){console.log('No extra words:',e.message);}

// Add IDs
words=words.map((w,i)=>({...w,id:'w_'+String(i+1).padStart(5,'0')}));
const outObj={name:'English Word Bank',version:'3.0',total:words.length,words};
fs.writeFileSync(out,JSON.stringify(outObj,null,2));
console.log('Total:',words.length,'(+'+generated+' generated)');
console.log('Written to',out);
