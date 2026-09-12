(function(){
  let FM='idea';
  function key(p){
    if(FM==='idea') return p.idea||'بدون فكرة';
    if(FM==='steps') return p.steps||'بدون خطوات';
    if(FM==='req') return p.required||'بدون مطلوب';
    return '';
  }
  function paint(){
    const items=load();
    stats(items);
    const home=$('#homeCards');
    if(!items.length){home.innerHTML='<div class="empty">لا توجد مسائل</div>';return}
    if(FM==='all'){
      home.innerHTML=items.map(cardHTML).join('');
    } else {
      const map=new Map();
      items.forEach(p=>{const k=key(p);if(!map.has(k))map.set(k,[]);map.get(k).push(p)});
      let h='';
      map.forEach((arr,title)=>{
        h+=`<div class="group" style="font-weight:800;color:#163056;margin:14px 2px 8px;display:flex;justify-content:space-between;align-items:center"><span>${title}</span><span class="badge">${String(arr.length).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d])}</span></div>`;
        h+=arr.map(cardHTML).join('');
      });
      home.innerHTML=h;
    }
    document.querySelectorAll('[data-info]').forEach(b=>b.onclick=()=>{
      const [id,kind]=b.dataset.info.split('|');
      const p=load().find(x=>String(x.id)===id);
      if(!p)return;
      $('#infoT').textContent=kind==='steps'?'الخطوات':'المعطيات';
      $('#infoB').innerHTML='<div style="line-height:1.9;font-weight:700">'+(kind==='steps'?(p.steps||''):((p.required||'')+' — '+p.text))+'</div>';
      openM('infoM');
    });
  }
  window.render=function(){
    paint();
    const items=load();
    const all=$('#allCards'), ideas=$('#ideaCards');
    if(all) all.innerHTML=items.map(cardHTML).join('');
    if(ideas){
      const uniq=[...new Map(items.filter(x=>x.idea).map(x=>[x.idea,x])).values()];
      ideas.innerHTML=uniq.map(x=>'<article class="card"><p class="q" style="text-align:right">'+x.idea+'</p><span class="kind">'+items.filter(i=>i.idea===x.idea).length+' مسائل</span></article>').join('');
    }
  };
  document.querySelectorAll('.chip[data-f]').forEach(c=>{
    c.onclick=()=>{
      document.querySelectorAll('.chip[data-f]').forEach(x=>x.classList.remove('on'));
      c.classList.add('on');
      FM=c.dataset.f;
      paint();
    };
  });
})();
