
// Shared utilities: nav highlight, persistence, progress compute, CSV export
export function setActiveNav(current){
  document.querySelectorAll('.navlink').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href')===current);
  });
}

export function loadProgress(key){
  try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch(e){ return {}; }
}
export function saveProgress(key, map){
  localStorage.setItem(key, JSON.stringify(map));
}

export function initChecklist(section, storageKey){
  let PROG = loadProgress(storageKey);
  const cbs = section.querySelectorAll('input.cb');
  cbs.forEach(cb=>{
    const id = cb.dataset.id;
    cb.checked = !!PROG[id];
    cb.addEventListener('change', ()=>{ PROG[id]=cb.checked; saveProgress(storageKey, PROG); computeProgress(section); });
    cb.addEventListener('click', e=>e.stopPropagation());
  });

  // tools
  section.querySelectorAll('.card').forEach(card => {
    const mark = card.querySelector('.mark-card');
    const unmark = card.querySelector('.unmark-card');
    const toggle = card.querySelector('.toggle-card');
    const details = card.querySelectorAll('details');
    const cbsIn = card.querySelectorAll('input.cb');
    const header = card.querySelector('.month');
    header.style.cursor='pointer';
    header.title='Cliquer pour ouvrir/fermer tous les modules';
    header.addEventListener('click', ()=>{
      const hasClosed = Array.from(details).some(d=>!d.open);
      details.forEach(d=>d.open = hasClosed);
    });
    mark?.addEventListener('click', ()=>{ cbsIn.forEach(cb=>{cb.checked=true; PROG[cb.dataset.id]=true;}); saveProgress(storageKey, PROG); computeProgress(section); });
    unmark?.addEventListener('click', ()=>{ cbsIn.forEach(cb=>{cb.checked=false; PROG[cb.dataset.id]=false;}); saveProgress(storageKey, PROG); computeProgress(section); });
    toggle?.addEventListener('click', ()=>{
      const hasClosed = Array.from(details).some(d=>!d.open);
      details.forEach(d=>d.open = hasClosed);
    });
  });

  // search
  const search = section.querySelector('input.search');
  if(search){
    search.addEventListener('input', (e)=>{
      const q = (e.target.value || "").toLowerCase();
      section.querySelectorAll('.card').forEach(card=>{
        const txt = (card.innerText || "").toLowerCase();
        card.classList.toggle('hidden', q && !txt.includes(q));
      });
    });
  }

  // expand/collapse/reset/print
  section.querySelector('.expand')?.addEventListener('click', ()=> section.querySelectorAll('details').forEach(d=>d.open=true));
  section.querySelector('.collapse')?.addEventListener('click', ()=> section.querySelectorAll('details').forEach(d=>d.open=false));
  section.querySelector('.reset')?.addEventListener('click', ()=>{
    if(confirm('Réinitialiser cette page ?')){
      PROG={}; saveProgress(storageKey, PROG); cbs.forEach(cb=>cb.checked=false); computeProgress(section);
    }
  });
  section.querySelector('.print')?.addEventListener('click', ()=>{ section.querySelectorAll('details').forEach(d=>d.open=true); setTimeout(()=>window.print(), 50); });

  computeProgress(section);
}

export function computeProgress(section){
  const globalBar = section.querySelector('.globalBar');
  const globalPct = section.querySelector('.globalPct');
  const all = section.querySelectorAll('input.cb');
  const total = all.length;
  const done = Array.from(all).filter(cb=>cb.checked).length;
  const p = total? Math.round(done*100/total) : 0;
  if(globalBar) globalBar.style.width = p+'%';
  if(globalPct) globalPct.textContent = p+'%';
  // per card
  section.querySelectorAll('.card').forEach(card=>{
    const cs = card.querySelectorAll('input.cb');
    const t = cs.length; const d = Array.from(cs).filter(c=>c.checked).length;
    const pc = t? Math.round(d*100/t):0;
    const badge = card.querySelector('.pct'); if(badge) badge.textContent = pc+'%';
  });
}

export function exportAllCSV(filename, keys){
  // keys = [{key:'edu_progress', label:'Education'}, ...]
  const rows = [["Namespace","Item","Done"]];
  keys.forEach(k=>{
    let map = {};
    try { map = JSON.parse(localStorage.getItem(k.key) || "{}"); } catch(e){ map = {}; }
    Object.entries(map).forEach(([id, val])=>{
      rows.push([k.label, id, val ? "1" : "0"]);
    });
  });
  const csv = rows.map(r=>r.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
