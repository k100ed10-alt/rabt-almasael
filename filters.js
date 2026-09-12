document.addEventListener('DOMContentLoaded', boot);
if(document.readyState!=='loading') boot();
function boot(){
  if(window.__RABT_BOOTED) return;
  window.__RABT_BOOTED=true;
  const AR='٠١٢٣٤٥٦٧٨٩';
  const toA=n=>String(n).replace(/\d/g,d=>AR[d]);
  const TOC=window.RABT_TOC||[{
    id:'u1', title:'الوحدة الأولى: القياس الدائري',
    lessons:[
      {id:'1-1', title:'١-١ الراديان', page:'١١'},
      {id:'1-2', title:'١-٢ طول القوس', page:'١٥'},
      {id:'1-3', title:'١-٣ مساحة القطاع الدائري', page:'١٨'}
    ]
  }];
  const st=document.createElement('style');
  st.textContent='.acc{background:#fff;border:1px solid #eee4d0;border-radius:16px;margin:0 0 10px}.acc>summary,.lesson>summary{cursor:pointer;padding:14px 16px;font-weight:800;color:#163056;list-style:none;display:flex;justify-content:space-between;align-items:center}.acc>summary::-webkit-details-marker,.lesson>summary::-webkit-details-marker{display:none}.lesson{border-top:1px solid #f3ead8}.lesson>summary{font-size:15px;padding:12px 16px}.lesson small{color:#7a8494;font-weight:700}.qlist{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 12px 14px}.qnum{height:46px;border:1px solid #eadfc6;background:#fffcf6;border-radius:12px;font-weight:800;color:#163056}.qnum b{display:block}';
  document.head.appendChild(st);

  function list(){try{return load()}catch(e){return[]}}
  function ofLesson(id){
    return list().filter(p=>((window.RABT_META||{})[p.kind]||{}).lesson==id || id==='1-1');
  }
  function groups(arr){
    const m={};
    arr.forEach(p=>{
      let n='١';
      const f=p.text&&p.text.match(/تمرين\s*(\S+)/);
      if(f) n=f[1];
      (m[n]=m[n]||[]).push(p);
    });
    return m;
  }
  function paint(){
    const home=document.getElementById('homeCards');
    if(!home) return;
    const all=list();
    if(typeof stats==='function') stats(all);
    let html='';
    TOC.forEach(u=>{
      html+='<details class="acc" open><summary>'+u.title+'<span>▾</span></summary>';
      (u.lessons||[]).forEach(ls=>{
        const arr = ls.id==='1-1' ? all : [];
        const g=groups(arr);
        const keys=Object.keys(g);
        html+='<details class="lesson"><summary>'+ls.title+'<small>ص '+ls.page+'</small></summary>';
        if(!keys.length) html+='<div class="empty">لم تُضف أسئلة بعد</div>';
        else {
          html+='<div class="qlist">';
          keys.forEach(k=>{
            html+='<button type="button" class="qnum" data-n="'+k+'">سؤال '+k+'</button>';
          });
          html+='</div>';
        }
        html+='</details>';
      });
      html+='</details>';
    });
    home.innerHTML=html;
    home.querySelectorAll('.qnum').forEach(btn=>{
      btn.addEventListener('click',function(e){
        e.preventDefault(); e.stopPropagation();
        const n=this.getAttribute('data-n');
        const arr=list().filter(p=>p.text&&p.text.indexOf('تمرين '+n)===0);
        const body=arr.map(p=>'<p style="margin:8px 0;font-weight:800;line-height:1.8">'+p.text+'</p>').join('') || 'لا توجد فروع';
        const ib=document.getElementById('infoB');
        const it=document.getElementById('infoT');
        if(it) it.textContent='سؤال '+n;
        if(ib) ib.innerHTML=body;
        if(typeof openM==='function') openM('infoM');
      });
    });
  }
  window.render=paint;

  const loginBtn=document.getElementById('loginBtn');
  if(loginBtn){
    loginBtn.addEventListener('click',function(){ setTimeout(paint,50); });
  }
  document.querySelectorAll('.chip[data-f]').forEach(c=>{
    c.addEventListener('click',function(){
      document.querySelectorAll('.chip[data-f]').forEach(x=>x.classList.remove('on'));
      this.classList.add('on');
    });
  });
  const add=document.getElementById('btnAdd');
  if(add) add.addEventListener('click',function(){ if(typeof openM==='function') openM('addM'); });
  const cmp=document.getElementById('btnCmp');
  if(cmp) cmp.addEventListener('click',function(){ if(typeof openM==='function') openM('cmpM'); });
}
