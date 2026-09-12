(function(){
  function ar(n){return String(n).replace(/\d/g,d=>'0123456789'.includes(d)?'\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669'[d]:d)}
  function items(){return (typeof load==='function')?load():[]}
  function byLesson(lessonId){
    return items().filter(p=>{
      const m=(window.RABT_META||{})[p.kind]||{};
      return (m.lesson||'1-1')===lessonId;
    });
  }
  function exercises(list){
    const map=new Map();
    list.forEach(p=>{
      const num=(p.text.match(/تمرين\s+([^(:]+)/)||[])[1] || p.kind;
      if(!map.has(num)) map.set(num,[]);
      map.get(num).push(p);
    });
    return map;
  }
  function showQ(list){
    const box=$('#infoB');
    const t=$('#infoT');
    if(!box) return;
    t.textContent='السؤال';
    box.innerHTML=list.map(p=>'<div class="card" style="margin-bottom:8px"><span class="kind">'+(p.required||'')+'</span><p class="q">'+p.text+'</p></div>').join('');
    openM('infoM');
  }
  function paint(){
    const toc=window.RABT_TOC||[];
    const home=$('#homeCards');
    if(!home) return;
    stats(items());
    let html='';
    toc.forEach(u=>{
      html+='<details class="acc unit" open><summary class="acc-h">'+u.title+'</summary>';
      (u.lessons||[]).forEach(ls=>{
        const list=byLesson(ls.id);
        const ex=exercises(list);
        html+='<details class="acc lesson"><summary class="acc-h2">'+ls.title+'<small> ص '+ls.page+'</small></summary>';
        if(!ex.size){
          html+='<div class="empty">لا توجد أسئلة لهذا الدرس بعد</div>';
        } else {
          html+='<div class="qlist">';
          [...ex.keys()].forEach(num=>{
            const arr=ex.get(num);
            html+='<button class="qnum" data-ex="'+num+'" data-ls="'+ls.id+'">سؤال '+num+' <span>'+ar(arr.length)+'</span></button>';
          });
          html+='</div>';
        }
        html+='</details>';
      });
      html+='</details>';
    });
    home.innerHTML=html;
    home.querySelectorAll('.qnum').forEach(b=>b.onclick=()=>{
      const list=byLesson(b.dataset.ls).filter(p=>((p.text.match(/تمرين\s+([^(:]+)/)||[])[1]||'')===b.dataset.ex);
      showQ(list);
    });
  }
  window.render=paint;
  const style=document.createElement('style');
  style.textContent='.acc{background:#fff;border:1px solid #eee4d0;border-radius:16px;margin:0 0 10px;overflow:hidden}.acc-h{list-style:none;cursor:pointer;padding:14px 16px;font-weight:800;color:#163056;display:flex;justify-content:space-between}.acc-h::-webkit-details-marker{display:none}.acc-h2{list-style:none;cursor:pointer;padding:12px 16px;font-weight:800;color:#1c2d4a;border-top:1px solid #f3ead8;display:flex;justify-content:space-between;align-items:center}.acc-h2 small{color:#7a8494;font-weight:700}.qlist{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 12px 14px}.qnum{height:44px;border:1px solid #eadfc6;background:#fffcf6;border-radius:12px;font-weight:800;color:#163056;display:flex;align-items:center;justify-content:space-between;padding:0 12px}.qnum span{background:#163056;color:#fff;min-width:22px;height:22px;border-radius:6px;display:grid;place-items:center;font-size:12px}';
  document.head.appendChild(style);
})();
