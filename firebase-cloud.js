import {initializeApp} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {getFirestore,collection,doc,getDocs,onSnapshot,setDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
const config={apiKey:"AIzaSyDmCVCdQkiMfKq4xMXG_dTu4ja7Eq-194s",authDomain:"map-link-converter-6a600.firebaseapp.com",projectId:"map-link-converter-6a600",storageBucket:"map-link-converter-6a600.firebasestorage.app",messagingSenderId:"165659257870",appId:"1:165659257870:web:2be7998a84a149b78fa05f"};
const app=initializeApp(config),auth=getAuth(app),db=getFirestore(app);
const $=id=>document.getElementById(id),cacheKey=uid=>"mlc-cloud-cache-v1-"+uid,queueKey=uid=>"mlc-cloud-queue-v1-"+uid;
let uid=null,unsub=null,remote=[],pending=[],online=()=>navigator.onLine;
const read=(k,d=[])=>{try{const value=JSON.parse(localStorage.getItem(k));return Array.isArray(value)?value:d}catch{return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const stableId=r=>{const s=String(r.url||r.name||"");let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return "legacy-"+(h>>>0).toString(16)};
const normalize=r=>({...r,id:r.id||stableId(r),deletedAt:r.deletedAt||null,updatedAt:r.updatedAt||Date.now()});
const merge=(a,b)=>{const map=new Map();for(const r of [...a,...b]){const x=normalize(r),old=map.get(x.id);if(!old||Number(x.updatedAt)>=Number(old.updatedAt))map.set(x.id,x)}return [...map.values()]};
function paint(message){$("cloudStatus").textContent=message;const list=merge(remote,pending).filter(r=>!r.deletedAt);window.MLCCloud?.onChange?.(list)}
function setCache(){if(uid){const old=read(cacheKey(uid));if(old.length&&JSON.stringify(old)!==JSON.stringify(remote))snapshot("cloud-"+uid,old);write(cacheKey(uid),remote)}}
function snapshot(scope,rows){try{const key="mlc-backups-"+scope;const history=read(key);history.push({at:new Date().toISOString(),rows});write(key,history.slice(-5))}catch{}}
function setQueue(){return uid?write(queueKey(uid),pending):false}
function enqueue(r){if(!uid)return false;const item=normalize(r),next=merge(pending.filter(x=>x.id!==item.id),[item]);if(!write(queueKey(uid),next)){paint("저장 공간 부족: 변경을 저장하지 못했습니다. 백업 후 저장 공간을 확인하세요.");return false}pending=next;paint(online()?"동기화 중…":"오프라인: 연결 후 동기화");void flush();return true}
let busy=false;
async function flush(){if(!uid||busy||!online()||!pending.length)return;busy=true;const active=uid;try{for(const item of [...pending]){if(uid!==active)break;await setDoc(doc(db,"users",active,"places",item.id),{...item,ownerUid:active,syncedAt:serverTimestamp()});if(uid!==active)break;pending=pending.filter(x=>!(x.id===item.id&&x.updatedAt===item.updatedAt));setQueue()}if(uid===active){if(!pending.length)localStorage.setItem("mlc-migrated-v1-"+active,"done");paint(pending.length?"동기화 대기":"동기화 완료")}}catch(e){if(uid===active)paint("동기화 대기: "+e.code)}finally{busy=false;if(uid&&uid!==active)void flush()}}
function subscribe(user){if(unsub){unsub();unsub=null}uid=user?.uid||null;remote=[];pending=[];if(!uid){$("cloudUser").textContent="로그인하지 않음";$("cloudLogin").hidden=false;$("cloudLogout").hidden=true;paint("로컬 장소만 표시");return}
const active=uid;remote=read(cacheKey(uid));pending=read(queueKey(uid));$("cloudUser").textContent=user.displayName||user.email||"로그인됨";$("cloudLogin").hidden=true;$("cloudLogout").hidden=false;paint("저장된 계정 장소 불러오는 중…");
unsub=onSnapshot(collection(db,"users",active,"places"),snap=>{if(uid!==active)return;remote=snap.docs.map(d=>normalize({...d.data(),id:d.id}));setCache();paint("클라우드 연결됨");void flush()},e=>{if(uid===active)paint("동기화 오류: "+e.code)});
void migrate(active)}
async function migrate(active){const marker="mlc-migrated-v1-"+active;if(localStorage.getItem(marker))return;const originals=window.MLCCloud?.getLocal?.()||[];if(!originals.length){localStorage.setItem(marker,"empty");return}try{const existing=await getDocs(collection(db,"users",active,"places"));if(uid!==active)return;const ids=new Set(existing.docs.map(d=>d.id));for(const r of originals){const item=normalize(r);if(!ids.has(item.id))enqueue(item)}paint("기존 로컬 장소를 계정에 병합 중")}catch(e){paint("초기 병합 대기: "+e.code)}}
window.MLCCloud={onChange:null,getLocal:null,get all(){return uid?merge(remote,pending):[]},get items(){return uid?merge(remote,pending).filter(x=>!x.deletedAt):[]},get uid(){return uid},save:r=>enqueue(r),remove:r=>enqueue({...normalize(r),deletedAt:Date.now(),updatedAt:Date.now()}),restore:r=>enqueue({...normalize(r),deletedAt:null,updatedAt:Date.now()}),get trash(){return uid?merge(remote,pending).filter(x=>x.deletedAt&&Date.now()-x.deletedAt<30*86400000):[]}};
$("cloudLogin").onclick=async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){paint("로그인 실패: "+e.code)}};
$("cloudLogout").onclick=async()=>{try{await signOut(auth)}catch(e){paint("로그아웃 실패: "+e.code)}};
$("cloudTrash").onclick=()=>{const trash=window.MLCCloud.trash;if(!uid){alert("로그인 후 휴지통을 이용할 수 있습니다.");return}if(!trash.length){alert("휴지통이 비어 있습니다.");return}const options=trash.map((r,i)=>(i+1)+". "+(r.name||"이름 없는 장소")).join("\n");const n=Number(prompt("복원할 장소 번호를 입력하세요 (30일 보관):\n"+options));if(n>=1&&n<=trash.length)window.MLCCloud.restore(trash[n-1])};
window.addEventListener("online",()=>void flush());
window.dispatchEvent(new Event("mlc-cloud-ready"));
onAuthStateChanged(auth,subscribe);
