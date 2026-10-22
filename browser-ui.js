(function(g){"use strict";
const $=id=>document.getElementById(id);let dirty=false,closing=false,pendingOpen=null;
function beforeUnload(event){if(!dirty)return;event.preventDefault();event.returnValue=""}
function changed(){if(dirty)return;dirty=true;g.addEventListener("beforeunload",beforeUnload)}
function clean(){dirty=false;g.removeEventListener("beforeunload",beforeUnload)}
function canLeave(){return !dirty||g.confirm("저장하지 않은 입력·수정 내용이 있습니다. 저장하지 않고 계속할까요?")}
function reload(){if(!canLeave())return false;clean();g.location.reload();return true}
function openDialog(id){const dialog=$(id);if(dialog.open)return;if(closing){pendingOpen=id;return}dialog.showModal();g.history.pushState({...g.history.state,mlcDialog:id},"")}
function closeDialog(id){const dialog=$(id);if(!dialog.open)return;dialog.close();if(g.history.state?.mlcDialog===id){closing=true;g.history.back()}}
g.addEventListener("popstate",()=>{closing=false;document.querySelectorAll("dialog[open]").forEach(d=>{if(g.history.state?.mlcDialog!==d.id)d.close()});if(pendingOpen){const id=pendingOpen;pendingOpen=null;openDialog(id)}});
document.querySelectorAll("dialog").forEach(d=>d.addEventListener("cancel",event=>{event.preventDefault();closeDialog(d.id)}));
$("url").addEventListener("input",changed);$("result").addEventListener("input",changed);
$("reloadApp").onclick=reload;
const motion=()=>g.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth";
$("scrollTop").onclick=()=>g.scrollTo({top:0,behavior:motion()});
function updateTop(){$("scrollTop").hidden=g.scrollY<400}g.addEventListener("scroll",updateTop,{passive:true});updateTop();
// Browser tabs keep their native pull-to-refresh. Custom gestures run only in standalone mode.
const standalone=g.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
let pull=null;const hint=$("pullRefresh");
function resetPull(){pull=null;hint.hidden=true;hint.textContent=""}
if(standalone){document.documentElement.classList.add("standalone-refresh");document.addEventListener("touchstart",event=>{if(event.touches.length!==1||g.scrollY>0||document.querySelector("dialog[open]")||event.target.closest("input,textarea,select,button,a,summary,iframe")){resetPull();return}pull={x:event.touches[0].clientX,y:event.touches[0].clientY,distance:0}},{passive:true});document.addEventListener("touchmove",event=>{if(!pull)return;if(event.touches.length!==1||g.scrollY>0){resetPull();return}const x=event.touches[0].clientX-pull.x,y=event.touches[0].clientY-pull.y;if(y<=0||Math.abs(x)>30){resetPull();return}pull.distance=y;if(y>12){if(event.cancelable)event.preventDefault();hint.hidden=false;hint.textContent=y>=80?"놓으면 새로고침":"당겨서 새로고침"}},{passive:false});document.addEventListener("touchend",()=>{const ready=pull?.distance>=80;resetPull();if(ready)reload()},{passive:true});document.addEventListener("touchcancel",resetPull,{passive:true})}
g.MLCUI={changed,clean,canLeave,reload,openDialog,closeDialog,isDirty:()=>dirty,isNavigating:()=>closing};
})(window);
