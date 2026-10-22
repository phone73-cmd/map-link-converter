(function(g){"use strict";
const $=id=>document.getElementById(id);
let current={state:"loading",detail:"로그인 상태를 확인하고 있습니다."};
const text={loading:"로그인 상태 확인 중…",signedout:"로그인하지 않음 · 이 기기에만 저장",syncing:"변경사항 동기화 중…",waiting:"계정 연결 확인 중…",complete:"계정 동기화 완료",offline:"오프라인 · 연결 후 동기화",error:"동기화 오류 · 설정에서 확인",unavailable:"로그인 확인 불가 · 이 기기 저장"};
function render(){const state=!navigator.onLine&&!["signedout","unavailable"].includes(current.state)?"offline":current.state;$("syncSummary").dataset.state=state;$("mainSyncText").textContent=text[state]||text.waiting;$("openSyncSettings").title=current.detail||text[state];$("mainLogin").hidden=!["signedout","unavailable"].includes(current.state);$("mainLogin").disabled=!navigator.onLine;}
function set(value){current={...current,...value};render()}
$("openSyncSettings").onclick=()=>g.MLCUI.openDialog("settingsDialog");
$("mainLogin").onclick=()=>$("cloudLogin").click();
g.addEventListener("online",render);g.addEventListener("offline",render);
g.MLCSyncStatus={set};render();setTimeout(()=>{if(current.state==="loading")set({state:"unavailable",detail:"로그인 기능을 확인하지 못했습니다. 인터넷 연결 후 새로고침해 주세요."})},12000);
})(window);
