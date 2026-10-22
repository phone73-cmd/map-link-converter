(function(g){"use strict";
const valid=s=>{const m=String(s||"").match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);if(!m)return null;const lat=+m[1],lng=+m[2];return Math.abs(lat)<=90&&Math.abs(lng)<=180?{lat,lng}:null};
function parseMapLink(input){const raw=String(input||"").trim();const plain=valid(raw);if(plain){const url=new URL("https://maps.apple.com/");url.searchParams.set("coordinate",plain.lat+","+plain.lng);return {provider:"좌표 직접 입력",inputType:"coordinates",name:"",koreanName:"",japaneseName:"",englishName:"",address:"",coords:plain,confidence:"candidate",source:"직접 입력 좌표",url:url.href}}if(/^[+\-\d.,\s]+$/.test(raw))throw Error("위도(-90~90), 경도(-180~180) 순서로 입력해 주세요.");let u;try{u=new URL(input.trim())}catch{throw Error("올바른 URL을 입력해 주세요.")}if(!["http:","https:"].includes(u.protocol))throw Error("HTTP(S) 링크만 지원합니다.");if(u.hostname.toLowerCase()!=="maps.apple.com")throw Error("Apple Maps 링크만 지원합니다.");
const p=u.searchParams;let name=p.get("name")||p.get("q")||"",address=p.get("address")||"",coords=null,confidence="none",source="";
for(const [v,c,s] of [[p.get("coordinate"),"place","Apple coordinate"],[p.get("ll"),"center","Apple ll"],[p.get("sll"),"center","Apple sll"],[p.get("daddr"),"candidate","Apple destination"]]){const found=valid(v);if(found){coords=found;confidence=c;source=s;break}}
if(valid(name))name="";
let japaneseName=p.get("name_ja")||p.get("japanese_name")||"";
if(!japaneseName&&/[\u3040-\u30ff\u3400-\u9fff]/.test(name))japaneseName=name;
let koreanName=p.get("name_ko")||p.get("korean_name")||"";
if(!koreanName&&/[\uac00-\ud7a3]/.test(name))koreanName=name;
let englishName=p.get("name_en")||p.get("english_name")||"";
if(!englishName&&/[a-zA-Z]/.test(name)&&!/[\uac00-\ud7a3\u3040-\u30ff\u3400-\u9fff]/.test(name))englishName=name;
return {koreanName,englishName,japaneseName,provider:"Apple Maps",name,address,coords,confidence,source,url:u.href}}
g.MapLinkParser={parseMapLink}})(typeof module!=="undefined"?module.exports:window);