/* Garden-style refresh: repaint current screen without reloading or discarding input. */
(function(){"use strict";
const indicator=document.createElement("div"),fill=document.createElement("div");
indicator.id="pullRefresh";indicator.className="pull-refresh";indicator.setAttribute("aria-hidden","true");
fill.className="pull-refresh-fill";indicator.append(fill);document.body.append(indicator);
let start=null,distance=0,finishing=false,finishTimer,resetTimer;
const hide=()=>{indicator.style.transform="translate(-50%,-180%)";indicator.style.opacity="0"};
function reset(){start=null;distance=0;hide()}
window.addEventListener("touchstart",e=>{if(finishing||e.touches.length!==1||window.scrollY>0||document.querySelector("dialog[open]")||e.target.closest?.("input,textarea,select,button,a,summary,iframe")){reset();return}clearTimeout(finishTimer);clearTimeout(resetTimer);start={x:e.touches[0].clientX,y:e.touches[0].clientY};distance=0;fill.style.width="0%"},{passive:true});
window.addEventListener("touchmove",e=>{if(!start)return;if(e.touches.length!==1||window.scrollY>0){reset();return}const x=e.touches[0].clientX-start.x,delta=e.touches[0].clientY-start.y;if(Math.abs(x)>30&&Math.abs(x)>Math.abs(delta)){reset();return}if(delta<=0){distance=0;hide();return}if(e.cancelable)e.preventDefault();distance=Math.min(88,delta*.55);fill.style.width=Math.round(distance/88*100)+"%";indicator.style.transform="translate(-50%,"+Math.min(42,distance/2)+"px)";indicator.style.opacity="1"},{passive:false});
window.addEventListener("touchend",()=>{if(!start)return;const ready=distance>=58;start=null;distance=0;if(!ready){hide();return}finishing=true;fill.style.width="100%";window.dispatchEvent(new Event("mlc-screen-refresh"));indicator.style.transform="translate(-50%,18px)";indicator.style.opacity="1";finishTimer=setTimeout(()=>{hide();resetTimer=setTimeout(()=>{fill.style.width="0%";finishing=false},240)},520)});
window.addEventListener("touchcancel",reset,{passive:true});
})();
