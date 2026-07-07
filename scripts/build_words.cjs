// Compiles wordbank.json from word_data/*.txt
const fs=require('fs'),path=require('path');
const dir='./word_data';let all=[];
if(fs.existsSync(dir)){fs.readdirSync(dir).filter(f=>f.endsWith('.txt')).forEach(f=>{
  const lines=fs.readFileSync(path.join(dir,f),'utf8').split('\n').filter(l=>l.trim());
  lines.forEach(line=>{
    const p=line.split('|');if(p.length<5)return;
    all.push({id:'w_'+String(all.length+1).padStart(5,'0'),word:p[0],phonetic:p[1],meaning:p[2],
      examples:[p[3],p[4]].filter(Boolean),collocations:p[5]?[p[5],p[6]].filter(Boolean):[],
      derivatives:p[7]?[p[7],p[8]].filter(Boolean):[]});
  });
  console.log(f,lines.length,'words');
});}
fs.writeFileSync('../public/assets/words/wordbank.json',JSON.stringify({name:'English Word Bank',version:'2.0',total:all.length,words:all},null,2));
console.log('Total:',all.length,'words');
