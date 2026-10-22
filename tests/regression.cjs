/* Run with Playwright installed: CHROMIUM_PATH=/path/to/chromium node tests/regression.cjs */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const {parseMapLink}=require('../parser.js').MapLinkParser;
for(const value of ['190,135','-190,135','34,181','34,135x','134.5,135'])assert.equal(parseMapLink('https://maps.apple.com/?coordinate='+encodeURIComponent(value)).coords,null);
assert.deepEqual(parseMapLink('https://maps.apple.com/?coordinate=34.667919,135.430367').coords,{lat:34.667919,lng:135.430367});
assert.throws(()=>parseMapLink('https://maps.apple.com.evil.test/?ll=34,135'));
async function cloudChecks(){
 const elements=new Map(),data=new Map();let authCallback,resolveWrite;const writes=[];
 const el=id=>{if(!elements.has(id))elements.set(id,{});return elements.get(id)};
 const context={window:{addEventListener(){},dispatchEvent(){}},document:{getElementById:el},navigator:{onLine:true},localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},initializeApp:()=>({}),getAuth:()=>({}),getFirestore:()=>({}),GoogleAuthProvider:class{},onAuthStateChanged:(_,cb)=>authCallback=cb,onSnapshot:()=>()=>{},collection:(_, ...parts)=>parts,doc:(_, ...parts)=>parts,setDoc:(ref,item)=>{writes.push({ref,item});return new Promise(r=>resolveWrite=r)},serverTimestamp:()=>0,Event:class{},alert(){},prompt(){},Date,console};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'firebase-cloud.js'),'utf8').replace(/^import .*;\n/gm,''),context);
 const cloud=context.window.MLCCloud;
 // Account switching during an outstanding write must flush the next account's queue.
 data.set('mlc-migrated-v1-a','done');data.set('mlc-migrated-v1-b','done');authCallback({uid:'a'});assert.equal(cloud.save({id:'a1',url:'https://maps.apple.com/?ll=1,1',updatedAt:1}),true);
 authCallback({uid:'b'});cloud.save({id:'b1',url:'https://maps.apple.com/?ll=2,2',updatedAt:2});resolveWrite();await new Promise(r=>setImmediate(r));assert.equal(writes.length,2);assert.equal(writes[1].ref[1],'b');resolveWrite();await new Promise(r=>setImmediate(r));
 // A full storage quota must leave existing pending edits intact and report failure.
 context.navigator.onLine=false;context.localStorage.setItem=()=>{throw Error('quota')};const before=JSON.stringify(cloud.items);assert.equal(cloud.save({id:'lost',url:'https://maps.apple.com/?ll=3,3'}),false);assert.equal(JSON.stringify(cloud.items),before);assert.match(el('cloudStatus').textContent,/저장하지 못했습니다/);
}
async function uiChecks(){
 const {chromium}=require('playwright');
 const mime={'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json','.woff2':'font/woff2'};
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');const name=url.pathname.startsWith('/test-fonts/')?path.join('/tmp/mlc-validation/node_modules/@fontsource/noto-sans-kr',url.pathname.slice('/test-fonts/'.length)):path.join(root,url.pathname==='/'?'index.html':url.pathname);try{res.setHeader('Content-Type',mime[path.extname(name)]||'text/html');res.end(fs.readFileSync(name))}catch{res.statusCode=404;res.end()}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-gpu']}:{} )});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',r=>r.abort());
  const sample={url:'https://maps.apple.com/?coordinate=34.667919,135.430367&name=Hotel',name:'Hotel',koreanName:'히요리 호텔 오사카 난바 스테이션 긴 장소 이름',japaneseName:'日和ホテル大阪なんば駅前',englishName:'Hiyori Hotel Osaka Namba Station',coords:{lat:34.667919,lng:135.430367},updatedAt:1};
  const shots=process.env.SCREENSHOT_DIR;if(shots)fs.mkdirSync(shots,{recursive:true});
  const noOverflow=async label=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,label);
  async function font(){const css='/tmp/mlc-validation/node_modules/@fontsource/noto-sans-kr/400.css';if(fs.existsSync(css)){await page.addStyleTag({content:fs.readFileSync(css,'utf8').replace(/url\(\.\//g,'url(/test-fonts/')+'body{font-family:"Noto Sans KR",sans-serif}'});await page.evaluate(()=>document.fonts.ready)}}
  for(const width of [320,375,390,430,768,1280]){
   await page.setViewportSize({width,height:800});await page.goto(origin);await font();await page.evaluate(r=>localStorage.setItem('map-link-converter-history-v1',JSON.stringify(Array.from({length:12},(_,i)=>({...r,url:r.url+'&i='+i})))),sample);await page.reload();await font();await noOverflow('home '+width);
   await page.locator('.history-title').first().click();await page.locator('#languages').evaluate(e=>e.open=true);await noOverflow('result '+width);if(shots&&[320,390,1280].includes(width))await page.screenshot({path:path.join(shots,'result-'+width+'.png'),fullPage:true});
   await page.locator('#enterSelection').click();await page.locator('#selectAll').check();assert.equal(await page.locator('#deleteSelected').innerText(),'삭제 (12)');await noOverflow('selection '+width);if(shots&&width===320)await page.screenshot({path:path.join(shots,'selection-320.png'),fullPage:true});await page.locator('#cancelSelection').click();
   await page.locator('#openSettings').click();assert.equal(await page.locator('.cloud-tool-row').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),3);assert.equal(await page.locator('#settingsDialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true,'settings '+width);if(shots&&[320,390].includes(width))await page.screenshot({path:path.join(shots,'settings-'+width+'.png')});await page.locator('#closeSettings').click();
   for(const provider of ['Google','Apple']){await page.locator('.history-actions button').filter({hasText:provider}).first().click();assert.equal(await page.locator('#external'+provider).isVisible(),true);assert.equal(await page.locator('#external'+(provider==='Apple'?'Google':'Apple')).isVisible(),false);assert.equal(await page.locator('#mapDialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true,'map '+width);const link=await page.locator('#external'+provider).boundingBox(),container=await page.locator('.map-dialog-actions').boundingBox();assert.ok(Math.abs(link.width-container.width)<2);await page.locator('input[value="walking"]').check();assert.match(await page.locator('#external'+provider).getAttribute('href'),provider==='Apple'?/dirflg=w/:/travelmode=walking/);if(shots&&width===390&&provider==='Apple')await page.screenshot({path:path.join(shots,'map-390.png')});await page.locator('#closeMap').click()}
  }
  // No Firebase SDK: local export must still contain all saved places.
  await page.locator('#openSettings').click();const download=page.waitForEvent('download');await page.locator('#cloudExport').click();const file=await download;const exported=JSON.parse(fs.readFileSync(await file.path(),'utf8'));assert.equal(exported.local.length,12);assert.equal(exported.format,'map-link-converter-v1.2.0');
  await page.locator('#cloudLogin').click();assert.match(await page.locator('#cloudStatus').innerText(),/불러오지 못했습니다/);
  const badDialog=page.waitForEvent('dialog').then(async d=>{const message=d.message();await d.accept();return message});await page.locator('#cloudImport').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'map-link-converter-v1.2.0',local:[{url:'https://maps.apple.com.evil.test'}],cloud:[]}))});assert.match(await badDialog,/가져오기 실패/);
  const goodDialog=page.waitForEvent('dialog').then(d=>d.accept());await page.locator('#cloudImport').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...exported,local:[{...sample,url:sample.url+'&new=1'}]}))});await goodDialog;await page.waitForFunction(()=>document.querySelectorAll('.history-item').length===13);assert.equal(await page.locator('.history-item').count(),13);
  await page.locator('#closeSettings').click();await page.locator('#url').fill(sample.url);await page.locator('#analyze').click();await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('quota')}});await page.locator('#save').click();assert.match(await page.locator('#message').innerText(),/저장 공간을 사용할 수 없습니다/);
  assert.deepEqual(errors,[]);console.log('PASS: 6 viewports; analysis/languages/list/selection/settings/map, provider routing, SDK-unavailable backup/import, quota failure; no uncaught page errors.');
 }finally{await browser.close();server.close()}
}
(async()=>{await cloudChecks();console.log('PASS: coordinate bounds, deceptive hosts, account-switch queue, quota-safe cloud enqueue.');await uiChecks()})().catch(e=>{console.error(e);process.exitCode=1});
