const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../voice.js'),'utf8');
function boot(data=new Map(),failSave=false){
 const elements=new Map(),spoken=[];let cancels=0;
 class Element{
  constructor(tag){this.tag=tag;this.children=[];this.value='';this.classList={add(){},remove(){}}}
  set id(value){this._id=value;elements.set(value,this)}get id(){return this._id}
  setAttribute(k,v){this[k]=v}addEventListener(){}append(...items){this.children.push(...items)}replaceChildren(){this.children=[]}
 }
 for(const id of ['voiceControls','voiceMessage','openSettings','openSyncSettings','settingsDialog']){const e=new Element('div');e.id=id}
 const voices=[{name:'Kyoko',voiceURI:'com.apple.voice.compact.ja-JP.Kyoko',lang:'ja-JP'},{name:'Kyoko',voiceURI:'com.apple.voice.super-compact.ja-JP.Kyoko',lang:'ja-JP'}];
 const window={navigator:{userAgent:'Macintosh Chrome/130.0'},speechSynthesis:{getVoices:()=>voices,cancel(){cancels++},speak:u=>spoken.push(u),addEventListener(){}},SpeechSynthesisUtterance:class{constructor(text){this.text=text}},addEventListener(){}};
 const localStorage={getItem:k=>data.get(k)??null,setItem(k,v){if(failSave)throw Error('quota');data.set(k,v)}};
 vm.runInNewContext(source,{window,document:{getElementById:id=>elements.get(id),createElement:tag=>new Element(tag)},localStorage,setTimeout(){}});
 return {elements,spoken,voice:window.MLCVoice,data,get cancels(){return cancels}};
}
const key='mlc-japanese-speech-rate-v1';
let b=boot(),rate=b.elements.get('voice-rate-ja'),select=b.elements.get('voice-ja');
assert.equal(rate.value,'1');assert.deepEqual(rate.children.map(e=>e.textContent),['0.5배','0.6배','0.7배','0.8배','0.9배','1.0배']);
const controls=b.elements.get('voiceControls').children[0].children[1];
assert.deepEqual(controls.children.map(e=>e.tag),['select','label','select','button']);
assert.equal(controls.children[1].textContent,'읽기 속도');assert.equal(select.children.length,3,'both same-name Kyoko variants remain');
select.value=JSON.stringify(['com.apple.voice.super-compact.ja-JP.Kyoko','Kyoko','ja-JP']);select.onchange();
const voiceSaved=b.data.get('mlc-voice-preferences-v1');
for(const value of ['0.5','0.6','0.7','0.8','0.9','1']){
 rate.value=value;rate.onchange();assert.equal(b.data.get(key),value);
 controls.children[3].onclick();assert.equal(b.spoken.at(-1).rate,Number(value));assert.match(b.spoken.at(-1).voice.voiceURI,/super-compact/);
 b.voice.stop();b.voice.speak({text:'大阪城',lang:'ja-JP'});assert.equal(b.spoken.at(-1).rate,Number(value));
}
rate.value='0.7';rate.onchange();assert.equal(b.data.get('mlc-voice-preferences-v1'),voiceSaved);
b=boot(b.data);assert.equal(b.elements.get('voice-rate-ja').value,'0.7');b.voice.speak({text:'京都',lang:'ja-JP'});assert.equal(b.spoken.at(-1).rate,0.7);assert.match(b.spoken.at(-1).voice.voiceURI,/super-compact/);
for(const saved of ['2','0.55','0','NaN','garbage','null','']){const t=boot(new Map([[key,saved]]));t.voice.speak({text:'京都',lang:'ja-JP'});assert.equal(t.spoken.at(-1).rate,1)}
b.elements.get('voice-rate-ja').value='9';b.elements.get('voice-rate-ja').onchange();assert.equal(b.elements.get('voice-rate-ja').value,'0.7');
const f=boot(new Map(),true);f.elements.get('voice-rate-ja').value='0.5';f.elements.get('voice-rate-ja').onchange();f.voice.speak({text:'京都',lang:'ja-JP'});assert.equal(f.spoken.at(-1).rate,0.5);assert.match(f.elements.get('voiceMessage').textContent,/이번 실행/);
console.log('PASS: 6 rates, default, UI order, both Kyoko variants, preview/place speech rate, persistence, voice preference preserved, invalid values and storage failure. Speech/DOM mocked; real device quality not tested.');
