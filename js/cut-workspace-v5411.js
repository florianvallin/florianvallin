/* Philosophal V54.11 — ergonomie et non-régression du mode Pro.
   Les données des pistes, le montage et les moteurs d'export restent inchangés. */
(() => {
  'use strict';
  const q=id=>document.getElementById(id);
  const root=q('v12ProRoot'),deck=q('v25Deck'),divider=q('v25Divider'),grip=q('v25InspectorGrip');
  const preset=q('v27LayoutPreset');
  if(!root||!deck||!divider||!grip||!preset||!window.v25ApplyLayout||!window.v25ReadLayout)return;
  const within=(n,min,max)=>Math.max(min,Math.min(max,n));
  const presets=[['montage','Équilibré'],['preview','Grand moniteur'],['timeline','Grande timeline'],['portrait','Vidéo verticale'],['compact','Inspecteur large'],['custom','Personnalisé']];
  const wrap=document.createElement('div');wrap.id='v5411QuickViews';wrap.setAttribute('role','group');wrap.setAttribute('aria-label','Disposition de l’espace de montage');
  const label=document.createElement('label');label.textContent='Espace';label.htmlFor='v5411Preset';
  const selector=document.createElement('select');selector.id='v5411Preset';selector.title='Répartition de la prévisualisation, de la timeline et de l’inspecteur';
  for(const [v,name] of presets){const option=document.createElement('option');option.value=v;option.textContent=name;selector.append(option)}
  wrap.append(label,selector);
  const status=document.createElement('output');status.id='v5411LayoutStatus';status.setAttribute('aria-label','Dimensions actuelles du studio');
  const reset=document.createElement('button');reset.type='button';reset.id='v5411Reset';reset.textContent='↺';reset.title='Rétablir la disposition équilibrée';reset.setAttribute('aria-label','Réinitialiser la disposition');
  const anchor=q('v27LayoutMenu');let before=anchor;while(before&&before.parentElement!==deck)before=before.parentElement;if(before){deck.insertBefore(wrap,before);deck.insertBefore(status,before);deck.insertBefore(reset,before)}else deck.append(wrap,status,reset);
  function refresh(){
    if(!document.body.classList.contains('v12-pro-mode'))return;
    const layout=window.v25ReadLayout();const current=preset.value;
    selector.value=presets.some(x=>x[0]===current)?current:'custom';
    const upper=Number(layout.upper)||49,inspector=Number(layout.inspector)||300;
    status.value=Math.round(upper)+' % image · '+Math.round(inspector)+' px panneau';
    divider.setAttribute('aria-valuemin','30');divider.setAttribute('aria-valuemax','69');divider.setAttribute('aria-valuenow',String(Math.round(upper)));
    divider.setAttribute('aria-valuetext',Math.round(upper)+' % pour le moniteur');
    grip.setAttribute('aria-valuemin','210');grip.setAttribute('aria-valuemax','500');grip.setAttribute('aria-valuenow',String(Math.round(inspector)));
    grip.setAttribute('aria-valuetext','Inspecteur : '+Math.round(inspector)+' pixels');
  }
  function setPreset(value){
    if(value==='custom'){q('v27LayoutMenu').open=true;requestAnimationFrame(refresh);return}
    if(typeof window.v27SetPreset==='function')window.v27SetPreset(value);
    else{preset.value=value;preset.dispatchEvent(new Event('change',{bubbles:true}))}
    requestAnimationFrame(refresh);
  }
  selector.addEventListener('change',()=>setPreset(selector.value));
  reset.addEventListener('click',()=>setPreset('montage'));
  // Double clic sur une poignée : retour à une proportion standard, sans altérer les médias.
  divider.addEventListener('dblclick',()=>setPreset('montage'));
  grip.addEventListener('dblclick',()=>window.v25ApplyLayout({inspector:300,collapsed:false}));
  grip.tabIndex=0;grip.setAttribute('role','separator');grip.setAttribute('aria-label','Largeur du panneau de propriétés. Flèches gauche et droite pour ajuster.');grip.setAttribute('aria-orientation','vertical');
  grip.addEventListener('keydown',e=>{
    if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight'&&e.key!=='Home'&&e.key!=='End')return;
    e.preventDefault();e.stopPropagation();
    const before=window.v25ReadLayout();let width=Number(before.inspector)||300;
    if(e.key==='ArrowLeft')width+=e.shiftKey?30:10;
    if(e.key==='ArrowRight')width-=e.shiftKey?30:10;
    if(e.key==='Home')width=210;
    if(e.key==='End')width=500;
    window.v25ApplyLayout({inspector:within(width,210,500),collapsed:false});
    preset.value='custom';preset.dispatchEvent(new Event('change',{bubbles:true}));
    refresh();
  });
  const dragElements=[divider,grip];
  for(const element of dragElements){
    element.addEventListener('pointerdown',()=>element.classList.add('v5411-grabbing'));
    for(const event of ['pointerup','pointercancel','lostpointercapture'])element.addEventListener(event,()=>{element.classList.remove('v5411-grabbing');requestAnimationFrame(refresh)});
  }
  // La navigation classique entre les ateliers reste intacte : seuls les menus du dock se ferment.
  document.addEventListener('pointerdown',event=>{
    if(!deck.contains(event.target))deck.querySelectorAll('details[open]').forEach(d=>d.open=false);
  },{passive:true});
  document.addEventListener('keydown',event=>{
    if(!document.body.classList.contains('v12-pro-mode'))return;
    if(event.key==='Escape')deck.querySelectorAll('details[open]').forEach(d=>d.open=false);
    if(event.code==='Digit0'&&event.ctrlKey&&event.altKey&&!event.shiftKey){event.preventDefault();setPreset('montage')}
  });
  deck.addEventListener('change',()=>requestAnimationFrame(refresh));
  deck.addEventListener('input',()=>requestAnimationFrame(refresh));
  deck.addEventListener('pointerup',()=>requestAnimationFrame(refresh));
  q('v12ProBtn')?.addEventListener('click',()=>requestAnimationFrame(()=>requestAnimationFrame(refresh)));
  window.addEventListener('pageshow',refresh);
  window.addEventListener('resize',refresh);
  // Read-only status; observe dimensions without replacing the Cut layout engine.
  if(typeof ResizeObserver==='function')new ResizeObserver(()=>{
    if(document.body.classList.contains('v12-pro-mode'))refresh();
  }).observe(root);
  refresh();
})();
