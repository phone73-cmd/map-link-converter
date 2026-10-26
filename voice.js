/* Browser-local speech choices. Voice names do not guarantee perceived quality. */
(function(g){"use strict";
const $=id=>document.getElementById(id),KEY="mlc-voice-preferences-v1";
const RATE_KEY="mlc-japanese-speech-rate-v1",rates=[0.5,0.6,0.7,0.8,0.9,1.0];
let rate=1;try{const saved=Number(localStorage.getItem(RATE_KEY));if(rates.includes(saved))rate=saved}catch{}
const languages=[{code:"ja",label:"일본어",lang:"ja-JP",sample:"こんにちは。場所の名前を読み上げます。"}];
// Restrict Kyoko only in Chrome on Apple devices; Android keeps all Japanese voices.
const nav=g.navigator||{},brands=nav.userAgentData?.brands||[],ua=nav.userAgent||"";
const chrome=(brands.some(b=>b.brand==="Google Chrome")||/Chrome\/|CriOS\//.test(ua))&&!/Edg(?:e|A|iOS)?\/|OPR\/|Opera|SamsungBrowser\//.test(ua);
const android=/Android/i.test(ua)||/Android/i.test(nav.userAgentData?.platform||"");
const apple=/Macintosh|Mac OS X|iPhone|iPad|iPod/i.test(ua)||/Mac|iPhone|iPad|iPod/i.test(nav.platform||"");
const kyokoOnly=chrome&&apple&&!android;
const isKyoko=v=>/^kyoko(?:$|[\s(_-])/i.test(v.name||"")||/(?:^|[./_-])kyoko(?:$|[./_\s()-])/i.test(v.voiceURI||"");
const missingVoice=()=>kyokoOnly?"사용 가능한 Kyoko 음성이 없습니다. 기기의 일본어 Kyoko 음성을 확인하세요.":"사용 가능한 일본어 음성이 없습니다. 기기의 일본어 음성을 확인하세요.";
const supported=!!(g.speechSynthesis&&g.SpeechSynthesisUtterance);
let preferences={};try{const saved=JSON.parse(localStorage.getItem(KEY)||"{}");if(saved&&typeof saved==="object"&&!Array.isArray(saved))preferences=saved}catch{}
const key=v=>JSON.stringify([v.voiceURI||"",v.name||"",v.lang||""]);
const code=lang=>String(lang||"").toLowerCase().split(/[-_]/)[0];
function available(lang){if(!supported||code(lang)!=="ja")return [];let all=[];try{all=g.speechSynthesis.getVoices()}catch{}const found=new Map();for(const v of all){if(code(v.lang)!==code(lang)||(kyokoOnly&&!isKyoko(v)))continue;found.set(key(v),v)}return [...found.values()].sort((a,b)=>a.name.localeCompare(b.name)||a.lang.localeCompare(b.lang))}
// Automatic selection follows the browser default and locale, never a quality ranking.
function score(v,lang){return (v.default?10:0)+(String(v.lang).toLowerCase()===lang.toLowerCase()?5:0)}
function choose(lang){const list=available(lang),saved=preferences[code(lang)];return list.find(v=>key(v)===saved)||[...list].sort((a,b)=>score(b,lang)-score(a,lang))[0]||null}
let active=null;
function stop(){if(supported)g.speechSynthesis.cancel();if(active?.button){active.button.classList.remove("speaking");active.button.setAttribute("aria-pressed","false")}active=null}
function speak({text,lang,button,report=()=>{}}){if(!supported){report("이 브라우저는 음성 재생을 지원하지 않습니다.");return false}if(active?.button===button&&button){stop();return false}const voice=choose(lang);if(!voice){stop();report(missingVoice());return false}stop();const utterance=new g.SpeechSynthesisUtterance(String(text||""));utterance.lang=voice.lang;utterance.voice=voice;utterance.rate=rate;active={button,utterance};if(button){button.classList.add("speaking");button.setAttribute("aria-pressed","true")}const finish=()=>{if(active?.utterance===utterance){if(button){button.classList.remove("speaking");button.setAttribute("aria-pressed","false")}active=null}};utterance.onend=finish;utterance.onerror=e=>{finish();if(e.error!=="canceled"&&e.error!=="interrupted")report("음성을 재생하지 못했습니다. 다른 음성을 선택하거나 연결 상태를 확인하세요.")};try{g.speechSynthesis.speak(utterance);return true}catch{finish();report("음성을 재생하지 못했습니다.");return false}}
const rows=[];
function refresh(){for(const {info,select,preview,hint} of rows){const list=available(info.lang),saved=preferences[info.code],chosen=choose(info.lang);select.replaceChildren();const auto=document.createElement("option");auto.value="";auto.textContent=chosen?"자동 선택":kyokoOnly?"사용 가능한 Kyoko 음성이 없습니다":"사용 가능한 음성 없음";select.append(auto);for(const voice of list){const option=document.createElement("option");option.value=key(voice);option.textContent=voice.name;select.append(option)}const savedAvailable=list.some(v=>key(v)===saved);select.value=savedAvailable?saved:"";select.disabled=!list.length;preview.disabled=!list.length;hint.textContent=!supported?"이 브라우저는 음성 재생을 지원하지 않습니다.":!list.length?missingVoice():saved&&!savedAvailable?"저장된 음성을 사용할 수 없어 자동 선택합니다.":select.value?"이 브라우저에서 선택한 음성을 사용합니다.":"자동 선택: "+(choose(info.lang)?.name||"")}}
function init(){const container=$("voiceControls");if(!container)return;for(const info of languages){const row=document.createElement("div"),label=document.createElement("label"),controls=document.createElement("div"),select=document.createElement("select"),preview=document.createElement("button"),hint=document.createElement("p");row.className="voice-row";label.htmlFor="voice-"+info.code;label.textContent=info.label;select.id=label.htmlFor;controls.className="voice-row-controls";preview.type="button";preview.className="secondary voice-preview";preview.textContent="미리 듣기";preview.setAttribute("aria-label",info.label+" 음성 미리 듣기");preview.setAttribute("aria-pressed","false");hint.className="muted voice-hint";hint.id="voice-hint-"+info.code;select.setAttribute("aria-describedby",hint.id);select.onchange=()=>{stop();preferences[info.code]=select.value;try{localStorage.setItem(KEY,JSON.stringify(preferences));refresh()}catch{refresh();hint.textContent="저장 공간을 사용할 수 없어 이번 실행에서만 적용됩니다."}};preview.onclick=()=>speak({text:info.sample,lang:info.lang,button:preview,report:message=>{$("voiceMessage").textContent=message}});const rateLabel=document.createElement("label"),rateSelect=document.createElement("select");
rateLabel.htmlFor="voice-rate-"+info.code;rateLabel.textContent="읽기 속도";rateSelect.id=rateLabel.htmlFor;rateSelect.setAttribute("aria-label","일본어 읽기 속도");
for(const value of rates){const option=document.createElement("option");option.value=String(value);option.textContent=value.toFixed(1)+"배";rateSelect.append(option)}
rateSelect.value=String(rate);rateSelect.onchange=()=>{const value=Number(rateSelect.value);if(!rates.includes(value)){rateSelect.value=String(rate);return}stop();rate=value;try{localStorage.setItem(RATE_KEY,String(rate));$("voiceMessage").textContent=""}catch{$("voiceMessage").textContent="저장 공간을 사용할 수 없어 읽기 속도는 이번 실행에서만 적용됩니다."}};
controls.append(select,rateLabel,rateSelect,preview);row.append(label,controls,hint);container.append(row);rows.push({info,select,preview,hint})}refresh();if(supported){g.speechSynthesis.addEventListener?.("voiceschanged",refresh);[250,1000,3000].forEach(delay=>setTimeout(refresh,delay))}$("openSettings")?.addEventListener("click",refresh);$("openSyncSettings")?.addEventListener("click",refresh);g.addEventListener("focus",refresh);$("settingsDialog")?.addEventListener("close",stop)}
g.MLCVoice={speak,stop,available,choose,refresh};init();
})(window);
