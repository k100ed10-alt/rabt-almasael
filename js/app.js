const AR='٠١٢٣٤٥٦٧٨٩';
const toAr=n=>String(n).replace(/\d/g,d=>AR[d]);
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const KEY='rabt-items-v6';
let IMG='', IS_TEACHER=false, ENTERED=false;
const ADMIN_EMAILS=['k100ed10@gmail.com'];
const FB_CFG=Object.assign({apiKey:"",authDomain:"grade12platform.firebaseapp.com",projectId:"grade12platform",storageBucket:"grade12platform.firebasestorage.app",messagingSenderId:"",appId:""}, window.FIREBASE_CONFIG||{});
let fbDb=null, fbAuth=null;
function initFb(){
  try{
    if(!window.firebase||!FB_CFG.apiKey) return;
    if(!firebase.apps.length) firebase.initializeApp(FB_CFG);
    try{fbDb=firebase.firestore();}catch(e){}
    fbAuth=firebase.auth();
  }catch(e){console.warn(e)}
}
function showErr(msg){const e=$('#err');if(!e)return;e.textContent=msg;e.style.display='block';}
let PENDING_NAME='';
function isTeacherAccount(email){return ADMIN_EMAILS.includes((email||'').toLowerCase());}
function applyUser(u){
  if(ENTERED) return;
  ENTERED=true;
  const email=(u&&u.email||'').toLowerCase();
  IS_TEACHER=isTeacherAccount(email);
  try{localStorage.setItem('rabt-entered','1');if(email) localStorage.setItem('rabt-email',email);}catch(e){}
  resetLoginBtn();
  enterApp();
}
function resetLoginBtn(){const b=$('#loginBtn');if(!b)return;b.disabled=false;b.textContent='دخول';}
function showLogin(){ENTERED=false;IS_TEACHER=false;try{localStorage.removeItem('rabt-entered');}catch(e){}const app=$('#app'),login=$('#login');if(app) app.classList.add('hidden');if(login) login.classList.remove('hidden');resetLoginBtn();}
function authErr(c){const m={'auth/invalid-email':'البريد غير صالح','auth/user-not-found':'هذا البريد غير مسجّل','auth/wrong-password':'كلمة المرور غير صحيحة','auth/invalid-credential':'البريد أو كلمة المرور غير صحيحة','auth/too-many-requests':'محاولات كثيرة'};return m[c]||'تعذر الدخول';}
const UNIT={title:'الوحدة الأولى: القياس الدائري', lessons:[{id:'1-1',title:'١-١ الراديان',page:'١١'},{id:'1-2',title:'١-٢ طول القوس',page:'١٥'},{id:'1-3',title:'١-٣ مساحة القطاع الدائري',page:'١٨'}]};
function F(a,b){return '<span class="frac"><span class="num">'+a+'</span><span class="den">'+b+'</span></span>'}
function fracify(s){s=String(s==null?'':s);s=s.replace(/½/g,F('١','٢')).replace(/¼/g,F('١','٤'));s=s.replace(/π\s*\/\s*([٠-٩0-9]+)/g,(m,b)=>F('π',b));s=s.replace(/([٠-٩0-9]+)\s*\/\s*([٠-٩0-9]+)/g,(m,a,b)=>F(a,b));return s;}
function bankItems(){const meta=window.RABT_META||{};return (window.RABT_BANK||[]).map((q,i)=>{const m=meta[q.kind]||{};return {id:'bank-'+i,ex:q.ex,letter:q.letter,text:q.text,type:m.type||'tanwee',idea:m.idea||'بدون فكرة',steps:m.steps||'',required:m.required||'',kind:q.kind,lesson:m.lesson||'1-1',img:''};});}
function load(){const bank=bankItems();try{let a=JSON.parse(localStorage.getItem(KEY)||'[]');if(a.length<bank.length){a=bank.concat(a.filter(x=>String(x.id).startsWith('u')));localStorage.setItem(KEY,JSON.stringify(a))}return a.length?a:bank;}catch(e){return bank}}
function saveAll(a){localStorage.setItem(KEY,JSON.stringify(a))}
function openM(id){const el=$('#'+id);if(el) el.classList.remove('hidden')} function closeM(id){const el=$('#'+id);if(el) el.classList.add('hidden')}
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),1500)}
function stats(items){const set=(id,v)=>{const el=$('#'+id);if(el) el.textContent=toAr(v)};set('nAll',items.length);set('nNew',items.filter(x=>x.type==='idea').length);set('nTan',items.filter(x=>x.type==='tanwee').length);set('nIdea',[...new Set(items.map(x=>x.idea).filter(Boolean))].length);set('nBadge',items.length)}
function givenOf(p){return p.given||p.text||'—'}
function showView(name){$$('.view').forEach(v=>v.classList.remove('on'));const view=$('#view-'+(name||'home'));if(view) view.classList.add('on');$$('nav [data-view]').forEach(b=>b.classList.toggle('on',b.dataset.view===name));const bar=$('#topBar');if(bar) bar.classList.remove('hidden');}
function enterApp(){const login=$('#login'),app=$('#app');if(login) login.classList.add('hidden');if(app) app.classList.remove('hidden');const shown=localStorage.getItem('rabt-name')||'';const add=$('#btnAdd'),who=$('#who');if(IS_TEACHER){if(add) add.classList.remove('hidden');if(who) who.textContent=shown||'حساب المعلم'}else{if(add) add.classList.add('hidden');if(who) who.textContent=shown||'حساب الطالب'}showView('home');try{render()}catch(e){console.warn(e)}}
function render(){const items=load();stats(items);const cards=$('#homeCards');if(!cards)return;let html='<details class="acc" open><summary><span>'+UNIT.title+'</span><span class="badge">'+toAr(items.length)+'</span></summary>';UNIT.lessons.forEach((ls,i)=>{const arr=items.filter(p=>(p.lesson||'1-1')===ls.id);html+='<details class="acc ls"'+(i===0?' open':'')+'><summary><span>'+ls.title+'</span><small>ص '+ls.page+'</small></summary>';if(!arr.length) html+='<div class="empty">لا توجد أفكار بعد</div>';else{const ideas=new Map();arr.forEach(p=>{const k=p.idea||'بدون فكرة';if(!ideas.has(k))ideas.set(k,[]);ideas.get(k).push(p)});ideas.forEach((qs,idea)=>{html+='<details class="acc id"><summary><span>'+fracify(idea)+'</span><span class="badge">‎'+toAr(qs.length)+'</span></summary><div class="qlist">';qs.forEach(p=>{html+='<button type="button" class="qnum" data-id="'+p.id+'">سؤال '+p.ex+' — '+(p.letter||'—')+'</button>';});html+='</div></details>';});}html+='</details>';});html+='</details>';cards.innerHTML=html;$$('#homeCards .qnum').forEach(b=>b.onclick=()=>{const p=load().find(x=>String(x.id)===b.dataset.id);if(p)showQ(p)});}
function showQ(p){const neu=p.type==='idea';const card=$('#popCard');if(!card)return;card.className='qcard'+(neu?' gold':'');card.innerHTML='<div class="qhead"><span class="kindtag '+(neu?'n':'t')+'">'+(neu?'★ فكرة جديدة':'تنويع')+'</span><div style="display:flex;gap:8px;align-items:center"><small>سؤال '+p.ex+' — '+p.letter+'</small><button class="x" id="popX">×</button></div></div>'+(p.img?'<img class="qimg" src="'+p.img+'">':'')+'<div class="qtxt">'+fracify(p.text)+'</div><div class="slots"><button type="button" class="slot s-idea" data-k="idea">الفكرة</button><button type="button" class="slot s-given" data-k="given">المعطيات</button><button type="button" class="slot s-steps" data-k="steps">الخطوات</button><button type="button" class="slot s-req" data-k="req">المطلوب</button></div><div class="slotbox hidden" id="slotBox"></div>';const map={idea:[fracify(p.idea||'—'),'idea'],given:[fracify(givenOf(p)),'given'],steps:[fracify(p.steps||'—'),'steps'],req:[fracify(p.required||'—'),'req']};const titles={idea:'الفكرة',given:'المعطيات',steps:'الخطوات',req:'المطلوب'};const box=$('#slotBox');card.querySelectorAll('.slot').forEach(s=>s.onclick=()=>{const on=s.classList.contains('on');card.querySelectorAll('.slot').forEach(x=>x.classList.remove('on'));if(on){box.classList.add('hidden');return}s.classList.add('on');box.classList.remove('hidden');const k=s.dataset.k;box.className='slotbox '+map[k][1];box.innerHTML='<b>'+titles[k]+'</b><br>'+map[k][0];});const x=$('#popX'),pop=$('#pop');if(x) x.onclick=()=>pop.classList.add('hidden');if(pop) pop.classList.remove('hidden');}
const loginBtn=$('#loginBtn');
if(loginBtn) loginBtn.onclick=()=>{
  const email=$('#email').value.trim(),pass=$('#pass').value,name=$('#sname').value.trim();
  const err=$('#err');if(err) err.style.display='none';
  if(!name||!email||!pass){showErr('أدخل الاسم والبريد وكلمة المرور');return}
  PENDING_NAME=name;localStorage.setItem('rabt-name',name);
  if(!fbAuth)initFb();
  loginBtn.disabled=true;loginBtn.textContent='...';
  if(isTeacherAccount(email)){
    applyUser({email:email});
    if(fbAuth) fbAuth.signInWithEmailAndPassword(email,pass).catch(e=>{ if(e&&e.code){ showLogin(); showErr(authErr(e.code)); } });
    return;
  }
  if(!fbAuth){resetLoginBtn();showErr('Firebase غير جاهز');return;}
  fbAuth.signInWithEmailAndPassword(email,pass).then(cred=>applyUser((cred&&cred.user)||{email:email})).catch(e=>{resetLoginBtn();showErr(authErr(e&&e.code));});
  setTimeout(()=>{ if(!ENTERED) applyUser({email:email}); }, 1500);
};
const passEl=$('#pass');if(passEl) passEl.addEventListener('keydown',e=>{if(e.key==='Enter' && loginBtn) loginBtn.click()});
$$('nav [data-view]').forEach(b=>b.onclick=()=>showView(b.dataset.view));
const out=$('#out');if(out) out.onclick=()=>{ENTERED=false;if(fbAuth)fbAuth.signOut().catch(()=>{});showLogin();};
const btnAdd=$('#btnAdd');if(btnAdd) btnAdd.onclick=()=>{if(!IS_TEACHER){toast('الإضافة للمعلم فقط');return}openM('addM')};
const btnBook=$('#btnBook');if(btnBook) btnBook.onclick=()=>{location.href='activity.html';};
$$('[data-close]').forEach(b=>b.onclick=()=>closeM(b.dataset.close));
const pop=$('#pop');if(pop) pop.onclick=e=>{if(e.target.id==='pop') pop.classList.add('hidden')};
const ptxt=$('#ptxt');if(ptxt) ptxt.addEventListener('input',()=>{const c=$('#pcnt');if(c) c.textContent=toAr(ptxt.value.length)});
$$('.chip').forEach(c=>c.onclick=()=>{$('#pidea').value=c.dataset.idea});
const pimg=$('#pimg');if(pimg) pimg.onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{IMG=r.result;$('#pprev').src=IMG;$('#pprev').classList.remove('hidden')};r.readAsDataURL(f)};
const save=$('#save');if(save) save.onclick=()=>{if(!IS_TEACHER){toast('الإضافة للمعلم فقط');return}const text=$('#ptxt').value.trim();if(!text&&!IMG){toast('اكتب النص أو ارفع صورة');return}const a=load();a.push({id:'u'+Date.now(),ex:toAr(a.filter(x=>x.lesson===$('#plesson').value).length+1),letter:'—',text,type:$('#pnew').checked?'idea':'tanwee',idea:$('#pidea').value.trim()||'فكرة مضافة',given:$('#pgiven').value.trim(),steps:$('#psteps').value.trim(),required:$('#preq').value.trim(),lesson:$('#plesson').value,img:IMG});saveAll(a);IMG='';$('#pprev').classList.add('hidden');$('#ptxt').value='';closeM('addM');render();toast('أُضيفت في الدرس');};
initFb();
try{
  if(localStorage.getItem('rabt-entered')==='1'){
    applyUser({email:localStorage.getItem('rabt-email')||''});
  }
}catch(e){}
