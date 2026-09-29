(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const { PDFDocument, StandardFonts, degrees, rgb } = window.PDFLib || {};
  const pdfjsLib = window.pdfjsLib;
  const JSZip = window.JSZip;

  if (!PDFDocument || !pdfjsLib || !JSZip) {
    document.body.innerHTML = '<main style="max-width:720px;margin:80px auto;padding:24px;font-family:sans-serif"><h1>Outils PDF indisponibles</h1><p>Les bibliothèques nécessaires n’ont pas pu être chargées. Vérifie ta connexion internet puis recharge la page.</p></main>';
    return;
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

  const ui = {
    toolButtons: $$('[data-tool]'),
    kicker: $('[data-tool-kicker]'), title: $('[data-tool-title]'), description: $('[data-tool-description]'),
    dropzone: $('[data-dropzone]'), fileInput: $('[data-file-input]'), dropTitle: $('[data-drop-title]'), dropCopy: $('[data-drop-copy]'), dropNote: $('[data-drop-note]'),
    panel: $('[data-panel]'), summary: $('[data-file-summary]'), controls: $('[data-controls]'), content: $('[data-content]'), actionRow: $('[data-action-row]'),
    reset: $('[data-reset]'), progress: $('[data-progress]'), progressLabel: $('[data-progress-label]'), progressPercent: $('[data-progress-percent]'), progressBar: $('[data-progress-bar]'), message: $('[data-message]')
  };

  const tools = {
    organize: { kicker:'Pages', title:'Organiser un PDF', description:'Réorganise les pages, tourne-les ou retire celles dont tu n’as plus besoin.', accept:'application/pdf,.pdf', multiple:false, drop:'Choisir un PDF', note:'PDF uniquement · traitement local' },
    merge: { kicker:'Assemblage', title:'Fusionner plusieurs PDF', description:'Place les documents dans le bon ordre puis crée un seul PDF.', accept:'application/pdf,.pdf', multiple:true, drop:'Choisir des PDF', note:'Plusieurs PDF · tu pourras modifier leur ordre' },
    split: { kicker:'Sélection', title:'Extraire ou diviser un PDF', description:'Garde seulement certaines pages ou découpe le document en plusieurs fichiers.', accept:'application/pdf,.pdf', multiple:false, drop:'Choisir un PDF', note:'PDF uniquement · pages personnalisables' },
    compress: { kicker:'Poids', title:'Compresser un PDF', description:'Essaie une optimisation légère ou une reconstruction plus forte par images.', accept:'application/pdf,.pdf', multiple:false, drop:'Choisir un PDF', note:'PDF uniquement · deux niveaux de compression' },
    'images-to-pdf': { kicker:'Conversion', title:'Transformer des images en PDF', description:'Assemble des images JPG ou PNG dans un seul document PDF.', accept:'image/jpeg,image/png,.jpg,.jpeg,.png', multiple:true, drop:'Choisir des images', note:'JPG / JPEG / PNG · plusieurs fichiers possibles' },
    'pdf-to-images': { kicker:'Conversion', title:'Transformer un PDF en images', description:'Exporte chaque page au format PNG ou JPG.', accept:'application/pdf,.pdf', multiple:false, drop:'Choisir un PDF', note:'PDF uniquement · export par page' },
    mark: { kicker:'Habillage', title:'Ajouter un filigrane ou des numéros', description:'Insère un texte discret et/ou une numérotation sur toutes les pages.', accept:'application/pdf,.pdf', multiple:false, drop:'Choisir un PDF', note:'PDF uniquement · texte et pagination' }
  };

  const state = { tool:'organize', files:[], organizePages:[], pdfPageCount:0, pdfjsDoc:null, busy:false };

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return '';
    const units = ['o','Ko','Mo','Go']; let n = bytes; let i = 0;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n >= 10 || i === 0 ? n.toFixed(0) : n.toFixed(1)} ${units[i]}`;
  }

  function baseName(fileName) { return String(fileName || 'document').replace(/\.[^.]+$/, ''); }
  function safeName(name) { return String(name).replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim() || 'document'; }
  async function bytesOf(file) { return new Uint8Array(await file.arrayBuffer()); }
  function setBusy(busy) { state.busy = busy; ui.reset.disabled = busy; ui.toolButtons.forEach(b => b.disabled = busy); }
  function showMessage(text, kind = 'ok') { ui.message.textContent = text; ui.message.className = `pdf-message${kind === 'error' ? ' is-error' : kind === 'warning' ? ' is-warning' : ''}`; ui.message.hidden = !text; }
  function hideMessage() { ui.message.hidden = true; ui.message.textContent = ''; ui.message.className = 'pdf-message'; }
  function progress(label, value = 0) { ui.progress.hidden = false; ui.progressLabel.textContent = label; ui.progressBar.value = Math.max(0, Math.min(100, value)); ui.progressPercent.textContent = `${Math.round(value)} %`; }
  function hideProgress() { ui.progress.hidden = true; ui.progressBar.value = 0; ui.progressPercent.textContent = ''; }
  function tick() { return new Promise(resolve => requestAnimationFrame(() => resolve())); }

  function downloadBytes(bytes, name, type = 'application/pdf') {
    const blob = bytes instanceof Blob ? bytes : new Blob([bytes], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = safeName(name); document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2500);
  }

  function fileChip(file, extra = '') {
    const div = document.createElement('div'); div.className = 'pdf-file-chip';
    div.innerHTML = `<span>PDF</span><div><strong></strong><small></small></div>`;
    $('strong', div).textContent = file.name;
    $('small', div).textContent = `${formatBytes(file.size)}${extra ? ` · ${extra}` : ''}`;
    return div;
  }

  function clearWorkbench() {
    state.files = []; state.organizePages = []; state.pdfPageCount = 0; state.pdfjsDoc = null;
    ui.fileInput.value = ''; ui.summary.innerHTML = ''; ui.controls.innerHTML = ''; ui.content.innerHTML = ''; ui.actionRow.innerHTML = '';
    ui.panel.hidden = true; ui.dropzone.hidden = false; hideMessage(); hideProgress();
  }

  function selectTool(tool) {
    if (state.busy || !tools[tool]) return;
    state.tool = tool;
    ui.toolButtons.forEach(button => { const active = button.dataset.tool === tool; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
    const meta = tools[tool]; ui.kicker.textContent = meta.kicker; ui.title.textContent = meta.title; ui.description.textContent = meta.description; ui.dropTitle.textContent = meta.drop; ui.dropNote.textContent = meta.note;
    ui.fileInput.accept = meta.accept; ui.fileInput.multiple = meta.multiple; clearWorkbench();
  }

  function validateFiles(files) {
    const meta = tools[state.tool];
    let list = [...files];
    if (!meta.multiple) list = list.slice(0, 1);
    if (state.tool === 'images-to-pdf') return list.filter(f => /image\/(jpeg|png)/i.test(f.type) || /\.(jpe?g|png)$/i.test(f.name));
    return list.filter(f => /application\/pdf/i.test(f.type) || /\.pdf$/i.test(f.name));
  }

  async function handleFiles(fileList) {
    if (state.busy) return;
    hideMessage();
    const files = validateFiles(fileList);
    if (!files.length) { showMessage(state.tool === 'images-to-pdf' ? 'Choisis des images JPG ou PNG.' : 'Choisis un fichier PDF valide.', 'error'); return; }
    state.files = files;
    ui.dropzone.hidden = true; ui.panel.hidden = false;
    try {
      if (state.tool === 'organize') await setupOrganize();
      else if (state.tool === 'merge') setupMerge();
      else if (state.tool === 'split') await setupSplit();
      else if (state.tool === 'compress') await setupCompress();
      else if (state.tool === 'images-to-pdf') setupImagesToPdf();
      else if (state.tool === 'pdf-to-images') await setupPdfToImages();
      else if (state.tool === 'mark') await setupMark();
    } catch (error) { console.error(error); clearWorkbench(); showMessage(error?.message || 'Impossible de lire ce fichier.', 'error'); }
  }

  async function getPdfJs(file) {
    const data = await file.arrayBuffer();
    return pdfjsLib.getDocument({ data }).promise;
  }

  async function inspectPdf(file) {
    const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption:false });
    return { doc, pages:doc.getPageCount() };
  }

  function addPrimary(label, handler) { const b = document.createElement('button'); b.type='button'; b.className='pdf-primary'; b.textContent=label; b.addEventListener('click', handler); ui.actionRow.appendChild(b); return b; }
  function addSecondary(label, handler) { const b = document.createElement('button'); b.type='button'; b.className='pdf-secondary'; b.textContent=label; b.addEventListener('click', handler); ui.actionRow.appendChild(b); return b; }

  function rangeField(label, value, min, max, step = 1) {
    const wrap = document.createElement('label'); wrap.className = 'pdf-field';
    wrap.innerHTML = `<span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><small class="pdf-range-value"></small>`;
    const input = $('input', wrap), out = $('small', wrap); const sync = () => out.textContent = input.value; sync(); input.addEventListener('input', sync); return { wrap, input, out };
  }

  /* ---------- ORGANISER ---------- */
  async function setupOrganize() {
    const file = state.files[0]; progress('Lecture du PDF…', 8); setBusy(true);
    try {
      const [info, pdfjs] = await Promise.all([inspectPdf(file), getPdfJs(file)]);
      state.pdfPageCount = info.pages; state.pdfjsDoc = pdfjs; state.organizePages = Array.from({length:info.pages}, (_, i) => ({ source:i, rotation:0 }));
      ui.summary.appendChild(fileChip(file, `${info.pages} page${info.pages > 1 ? 's' : ''}`));
      ui.controls.innerHTML = '<div class="pdf-empty-inline">Astuce : utilise ← et → pour déplacer une page. Les boutons ↻ et × permettent de la tourner ou de la supprimer.</div>';
      addPrimary('Télécharger le PDF réorganisé', exportOrganized);
      addSecondary('Restaurer les pages', () => { state.organizePages = Array.from({length:state.pdfPageCount}, (_, i) => ({source:i,rotation:0})); renderOrganizePages(); });
      await renderOrganizePages();
    } finally { hideProgress(); setBusy(false); }
  }

  async function renderOrganizePages() {
    ui.content.innerHTML = '<div class="pdf-pages" data-page-grid></div>'; const grid = $('[data-page-grid]', ui.content);
    for (let i = 0; i < state.organizePages.length; i++) {
      const item = state.organizePages[i]; const card = document.createElement('article'); card.className='pdf-page-card';
      card.innerHTML = `<div class="pdf-page-preview"><canvas></canvas></div><div class="pdf-page-title"><span>Page ${i+1}</span><small>origine ${item.source+1}</small></div><div class="pdf-page-actions"><button type="button" data-act="left" title="Déplacer à gauche">←</button><button type="button" data-act="right" title="Déplacer à droite">→</button><button type="button" data-act="rotate" title="Tourner">↻</button><button type="button" data-act="delete" class="is-danger" title="Supprimer">×</button></div>`;
      grid.appendChild(card);
      const page = await state.pdfjsDoc.getPage(item.source + 1); const viewport = page.getViewport({ scale:0.38, rotation:(page.rotate + item.rotation) % 360 }); const canvas = $('canvas', card), ctx = canvas.getContext('2d'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height); await page.render({ canvasContext:ctx, viewport }).promise;
      $('.pdf-page-actions',card).addEventListener('click', e => { const act=e.target.closest('button')?.dataset.act; if (!act) return; const idx=[...grid.children].indexOf(card); if (act==='left'&&idx>0) [state.organizePages[idx-1],state.organizePages[idx]]=[state.organizePages[idx],state.organizePages[idx-1]]; else if (act==='right'&&idx<state.organizePages.length-1) [state.organizePages[idx+1],state.organizePages[idx]]=[state.organizePages[idx],state.organizePages[idx+1]]; else if (act==='rotate') state.organizePages[idx].rotation=(state.organizePages[idx].rotation+90)%360; else if (act==='delete') state.organizePages.splice(idx,1); else return; renderOrganizePages(); });
      if (i % 4 === 3) await tick();
    }
  }

  async function exportOrganized() {
    if (!state.organizePages.length) { showMessage('Il faut conserver au moins une page.', 'error'); return; }
    setBusy(true); progress('Création du PDF…', 5); hideMessage();
    try {
      const src = await PDFDocument.load(await state.files[0].arrayBuffer()); const out = await PDFDocument.create();
      for (let i=0;i<state.organizePages.length;i++) { const item=state.organizePages[i]; const [copy]=await out.copyPages(src,[item.source]); const angle=(copy.getRotation().angle + item.rotation) % 360; copy.setRotation(degrees(angle)); out.addPage(copy); progress('Création du PDF…', 10 + ((i+1)/state.organizePages.length)*80); }
      const bytes = await out.save({ useObjectStreams:true }); downloadBytes(bytes, `${baseName(state.files[0].name)}-organise.pdf`); showMessage('PDF réorganisé généré.');
    } catch (e) { console.error(e); showMessage('Impossible de générer le PDF réorganisé.', 'error'); } finally { hideProgress(); setBusy(false); }
  }

  /* ---------- FUSIONNER ---------- */
  function setupMerge() {
    ui.summary.innerHTML=''; state.files.forEach(f=>ui.summary.appendChild(fileChip(f)));
    ui.controls.innerHTML='<div class="pdf-empty-inline">Place les fichiers dans l’ordre souhaité avant de fusionner.</div>';
    renderFileOrder(); addPrimary('Fusionner et télécharger', mergePdfs);
  }
  function renderFileOrder() {
    ui.content.innerHTML='<div class="pdf-file-list" data-file-list></div>'; const list=$('[data-file-list]',ui.content);
    state.files.forEach((file,i)=>{ const row=document.createElement('div'); row.className='pdf-file-row'; row.innerHTML=`<span class="pdf-file-index">${i+1}</span><div class="pdf-file-meta"><strong></strong><small>${formatBytes(file.size)}</small></div><div class="pdf-row-actions"><button class="pdf-mini-btn" data-act="up" title="Monter">↑</button><button class="pdf-mini-btn" data-act="down" title="Descendre">↓</button><button class="pdf-mini-btn is-danger" data-act="remove" title="Retirer">×</button></div>`; $('strong',row).textContent=file.name; $('.pdf-row-actions',row).addEventListener('click',e=>{const act=e.target.closest('button')?.dataset.act;if(!act)return;const idx=[...list.children].indexOf(row);if(act==='up'&&idx>0)[state.files[idx-1],state.files[idx]]=[state.files[idx],state.files[idx-1]];else if(act==='down'&&idx<state.files.length-1)[state.files[idx+1],state.files[idx]]=[state.files[idx],state.files[idx+1]];else if(act==='remove')state.files.splice(idx,1);else return;ui.summary.innerHTML='';state.files.forEach(f=>ui.summary.appendChild(fileChip(f)));renderFileOrder();});list.appendChild(row);});
  }
  async function mergePdfs() {
    if (!state.files.length) return; setBusy(true); hideMessage(); progress('Fusion des PDF…',3);
    try { const out=await PDFDocument.create(); for(let i=0;i<state.files.length;i++){const src=await PDFDocument.load(await state.files[i].arrayBuffer());const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p));progress(`Fusion : ${i+1}/${state.files.length}`,8+((i+1)/state.files.length)*84);await tick();}const bytes=await out.save({useObjectStreams:true});downloadBytes(bytes,'fusion-philosophal.pdf');showMessage(`${state.files.length} PDF fusionnés.`);} catch(e){console.error(e);showMessage('La fusion a échoué. Un des PDF est peut-être protégé ou endommagé.','error');} finally{hideProgress();setBusy(false);}
  }

  /* ---------- EXTRAIRE / DIVISER ---------- */
  async function setupSplit() {
    const file=state.files[0],info=await inspectPdf(file); state.pdfPageCount=info.pages; ui.summary.appendChild(fileChip(file,`${info.pages} page${info.pages>1?'s':''}`));
    ui.controls.innerHTML=`<div class="pdf-field grow"><span>Pages à extraire</span><input data-ranges type="text" value="1-${info.pages}" placeholder="Ex. 1-3, 7, 10-12"><small class="pdf-range-value">Utilise des virgules : 1-3, 7, 10-12</small></div><div class="pdf-field"><span>Découpage automatique</span><input data-chunk type="number" min="1" max="${info.pages}" value="1"><small class="pdf-range-value">pages par fichier</small></div>`;
    ui.content.innerHTML='<div class="pdf-empty-inline">« Extraire » crée un seul PDF avec la sélection. « Diviser » crée un ZIP contenant plusieurs PDF successifs.</div>';
    addSecondary('Diviser en plusieurs PDF (.zip)', splitIntoChunks); addPrimary('Extraire les pages', extractPages);
  }
  function parseRanges(text,count){const result=[];for(const raw of String(text).split(',')){const part=raw.trim();if(!part)continue;const m=part.match(/^(\d+)\s*-\s*(\d+)$/);if(m){let a=+m[1],b=+m[2];const step=a<=b?1:-1;for(let n=a;;n+=step){if(n>=1&&n<=count&&!result.includes(n-1))result.push(n-1);if(n===b)break;}}else if(/^\d+$/.test(part)){const n=+part;if(n>=1&&n<=count&&!result.includes(n-1))result.push(n-1);}}return result;}
  async function extractPages(){const indices=parseRanges($('[data-ranges]',ui.controls).value,state.pdfPageCount);if(!indices.length){showMessage('Indique au moins une page valide.','error');return;}setBusy(true);progress('Extraction des pages…',15);try{const src=await PDFDocument.load(await state.files[0].arrayBuffer()),out=await PDFDocument.create();const pages=await out.copyPages(src,indices);pages.forEach(p=>out.addPage(p));progress('Finalisation…',85);downloadBytes(await out.save({useObjectStreams:true}),`${baseName(state.files[0].name)}-extrait.pdf`);showMessage(`${indices.length} page${indices.length>1?'s':''} extraite${indices.length>1?'s':''}.`);}catch(e){console.error(e);showMessage('Extraction impossible.','error');}finally{hideProgress();setBusy(false);}}
  async function splitIntoChunks(){const n=Math.max(1,Math.min(state.pdfPageCount,parseInt($('[data-chunk]',ui.controls).value,10)||1));setBusy(true);progress('Découpage du PDF…',4);try{const src=await PDFDocument.load(await state.files[0].arrayBuffer()),zip=new JSZip();const total=Math.ceil(state.pdfPageCount/n);for(let i=0;i<total;i++){const start=i*n,end=Math.min(start+n,state.pdfPageCount),indices=Array.from({length:end-start},(_,k)=>start+k),out=await PDFDocument.create(),pages=await out.copyPages(src,indices);pages.forEach(p=>out.addPage(p));zip.file(`${baseName(state.files[0].name)}-${String(i+1).padStart(2,'0')}.pdf`,await out.save({useObjectStreams:true}));progress(`Lot ${i+1}/${total}`,8+((i+1)/total)*70);await tick();}progress('Création du ZIP…',86);const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}},m=>progress('Création du ZIP…',86+m.percent*.13));downloadBytes(blob,`${baseName(state.files[0].name)}-divise.zip`,'application/zip');showMessage(`${total} fichier${total>1?'s':''} PDF créé${total>1?'s':''}.`);}catch(e){console.error(e);showMessage('Découpage impossible.','error');}finally{hideProgress();setBusy(false);}}

  /* ---------- COMPRESSER ---------- */
  async function setupCompress(){const file=state.files[0],info=await inspectPdf(file);state.pdfPageCount=info.pages;ui.summary.appendChild(fileChip(file,`${info.pages} page${info.pages>1?'s':''}`));ui.controls.innerHTML=`<div class="pdf-field grow"><span>Mode</span><div class="pdf-radio-row"><label><input type="radio" name="compress-mode" value="light" checked>Optimisation légère</label><label><input type="radio" name="compress-mode" value="strong">Compression forte</label></div></div>`;const range=rangeField('Qualité images',0.72,0.35,0.95,0.05);range.input.dataset.quality='';range.out.textContent='72 %';range.input.addEventListener('input',()=>range.out.textContent=`${Math.round(+range.input.value*100)} %`);ui.controls.appendChild(range.wrap);range.wrap.dataset.qualityWrap='';ui.content.innerHTML='<div class="pdf-empty-inline" data-compress-help>L’optimisation légère conserve le texte et la structure. Son gain dépend du PDF d’origine.</div>';$$('input[name="compress-mode"]',ui.controls).forEach(r=>r.addEventListener('change',()=>{const strong=$('input[name="compress-mode"]:checked',ui.controls).value==='strong';$('[data-quality-wrap]',ui.controls).style.display=strong?'flex':'none';$('[data-compress-help]',ui.content).textContent=strong?'La compression forte reconstruit les pages comme des images JPG. Le texte ne sera plus sélectionnable, mais le poids peut nettement diminuer.':'L’optimisation légère conserve le texte et la structure. Son gain dépend du PDF d’origine.';}));$('[data-quality-wrap]',ui.controls).style.display='none';addPrimary('Compresser et télécharger',compressPdf);}
  async function compressPdf(){const mode=$('input[name="compress-mode"]:checked',ui.controls)?.value||'light';setBusy(true);hideMessage();progress('Compression…',4);try{let bytes;if(mode==='light'){const src=await PDFDocument.load(await state.files[0].arrayBuffer());bytes=await src.save({useObjectStreams:true,addDefaultPage:false,objectsPerTick:40});progress('Finalisation…',90);}else{const quality=+$('[data-quality]',ui.controls).value||.72;const pdfjs=await getPdfJs(state.files[0]),out=await PDFDocument.create();for(let i=1;i<=pdfjs.numPages;i++){const page=await pdfjs.getPage(i),viewport=page.getViewport({scale:1.35}),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:false});canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);await page.render({canvasContext:ctx,viewport}).promise;const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',quality));const jpg=await out.embedJpg(await blob.arrayBuffer());const [vx,vy,vw,vh]=page.view;const w=Math.abs(vw-vx),h=Math.abs(vh-vy);const p=out.addPage([w,h]);p.drawImage(jpg,{x:0,y:0,width:w,height:h});progress(`Compression : page ${i}/${pdfjs.numPages}`,5+(i/pdfjs.numPages)*88);canvas.width=1;canvas.height=1;await tick();}bytes=await out.save({useObjectStreams:true});}downloadBytes(bytes,`${baseName(state.files[0].name)}-compresse.pdf`);const pct=Math.round((1-bytes.length/state.files[0].size)*100);showMessage(pct>0?`PDF généré : environ ${pct} % plus léger (${formatBytes(bytes.length)}).`:`PDF généré (${formatBytes(bytes.length)}). Ce document était déjà bien optimisé.` , pct>0?'ok':'warning');}catch(e){console.error(e);showMessage('Compression impossible. Essaie l’autre mode ou un PDF non protégé.','error');}finally{hideProgress();setBusy(false);}}

  /* ---------- IMAGES -> PDF ---------- */
  function setupImagesToPdf(){ui.summary.innerHTML='';state.files.forEach(f=>ui.summary.appendChild(fileChip(f)));ui.controls.innerHTML=`<div class="pdf-field"><span>Format des pages</span><select data-page-mode><option value="auto">Taille de l’image</option><option value="a4">A4 portrait</option></select></div><div class="pdf-field"><span>Marge A4</span><select data-margin><option value="18">Petite</option><option value="32" selected>Normale</option><option value="50">Large</option></select></div>`;renderImageOrder();addPrimary('Créer le PDF',imagesToPdf);}
  function renderImageOrder(){ui.content.innerHTML='<div class="pdf-file-list" data-file-list></div>';const list=$('[data-file-list]',ui.content);state.files.forEach((file,i)=>{const row=document.createElement('div');row.className='pdf-file-row';row.innerHTML=`<span class="pdf-file-index">${i+1}</span><div class="pdf-file-meta"><strong></strong><small>${formatBytes(file.size)}</small></div><div class="pdf-row-actions"><button class="pdf-mini-btn" data-act="up">↑</button><button class="pdf-mini-btn" data-act="down">↓</button><button class="pdf-mini-btn is-danger" data-act="remove">×</button></div>`;$('strong',row).textContent=file.name;$('.pdf-row-actions',row).addEventListener('click',e=>{const act=e.target.closest('button')?.dataset.act;if(!act)return;const idx=[...list.children].indexOf(row);if(act==='up'&&idx>0)[state.files[idx-1],state.files[idx]]=[state.files[idx],state.files[idx-1]];else if(act==='down'&&idx<state.files.length-1)[state.files[idx+1],state.files[idx]]=[state.files[idx],state.files[idx+1]];else if(act==='remove')state.files.splice(idx,1);else return;ui.summary.innerHTML='';state.files.forEach(f=>ui.summary.appendChild(fileChip(f)));renderImageOrder();});list.appendChild(row);});}
  async function imagesToPdf(){if(!state.files.length)return;setBusy(true);progress('Création du PDF…',4);try{const out=await PDFDocument.create(),mode=$('[data-page-mode]',ui.controls).value,margin=+$('[data-margin]',ui.controls).value||32,A4=[595.28,841.89];for(let i=0;i<state.files.length;i++){const file=state.files[i],data=await file.arrayBuffer(),image=/png/i.test(file.type)||/\.png$/i.test(file.name)?await out.embedPng(data):await out.embedJpg(data);let pw,ph,x,y,w,h;if(mode==='a4'){[pw,ph]=A4;const scale=Math.min((pw-margin*2)/image.width,(ph-margin*2)/image.height);w=image.width*scale;h=image.height*scale;x=(pw-w)/2;y=(ph-h)/2;}else{pw=image.width;ph=image.height;x=0;y=0;w=pw;h=ph;}const page=out.addPage([pw,ph]);page.drawImage(image,{x,y,width:w,height:h});progress(`Image ${i+1}/${state.files.length}`,8+((i+1)/state.files.length)*84);await tick();}downloadBytes(await out.save({useObjectStreams:true}),'images-philosophal.pdf');showMessage(`${state.files.length} image${state.files.length>1?'s':''} convertie${state.files.length>1?'s':''} en PDF.`);}catch(e){console.error(e);showMessage('Conversion impossible. Utilise des images JPG ou PNG valides.','error');}finally{hideProgress();setBusy(false);}}

  /* ---------- PDF -> IMAGES ---------- */
  async function setupPdfToImages(){const file=state.files[0],pdfjs=await getPdfJs(file);state.pdfPageCount=pdfjs.numPages;ui.summary.appendChild(fileChip(file,`${pdfjs.numPages} page${pdfjs.numPages>1?'s':''}`));ui.controls.innerHTML=`<div class="pdf-field"><span>Format</span><select data-image-format><option value="png">PNG</option><option value="jpeg">JPG</option></select></div><div class="pdf-field"><span>Résolution</span><select data-scale><option value="1">Standard</option><option value="1.5" selected>Haute</option><option value="2">Très haute</option></select></div>`;ui.content.innerHTML='<div class="pdf-empty-inline">Une page = une image. S’il y a plusieurs pages, elles seront rassemblées dans un fichier ZIP.</div>';addPrimary('Convertir et télécharger',pdfToImages);}
  async function pdfToImages(){setBusy(true);progress('Conversion en images…',3);try{const pdfjs=await getPdfJs(state.files[0]),format=$('[data-image-format]',ui.controls).value,scale=+$('[data-scale]',ui.controls).value||1.5,zip=new JSZip(),outputs=[];for(let i=1;i<=pdfjs.numPages;i++){const page=await pdfjs.getPage(i),viewport=page.getViewport({scale}),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:format==='png'});canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);if(format==='jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);}await page.render({canvasContext:ctx,viewport}).promise;const mime=format==='png'?'image/png':'image/jpeg',ext=format==='png'?'png':'jpg',blob=await new Promise(r=>canvas.toBlob(r,mime,.9));const name=`${baseName(state.files[0].name)}-page-${String(i).padStart(3,'0')}.${ext}`;outputs.push({name,blob});progress(`Page ${i}/${pdfjs.numPages}`,5+(i/pdfjs.numPages)*78);canvas.width=1;canvas.height=1;await tick();}if(outputs.length===1){downloadBytes(outputs[0].blob,outputs[0].name,outputs[0].blob.type);}else{for(const o of outputs)zip.file(o.name,o.blob);progress('Création du ZIP…',87);const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:5}},m=>progress('Création du ZIP…',87+m.percent*.12));downloadBytes(blob,`${baseName(state.files[0].name)}-images.zip`,'application/zip');}showMessage(`${outputs.length} image${outputs.length>1?'s':''} générée${outputs.length>1?'s':''}.`);}catch(e){console.error(e);showMessage('Conversion impossible.','error');}finally{hideProgress();setBusy(false);}}

  /* ---------- FILIGRANE / NUMEROS ---------- */
  async function setupMark(){const file=state.files[0],info=await inspectPdf(file);state.pdfPageCount=info.pages;ui.summary.appendChild(fileChip(file,`${info.pages} page${info.pages>1?'s':''}`));ui.controls.innerHTML=`<div class="pdf-field grow"><span>Texte du filigrane (facultatif)</span><input type="text" data-watermark placeholder="Ex. Philosophal · document de travail"></div><div class="pdf-field"><span>Position du filigrane</span><select data-position><option value="center">Centre</option><option value="top">Haut</option><option value="bottom">Bas</option></select></div><div class="pdf-field"><span>Numéros de pages</span><select data-numbers><option value="none">Aucun</option><option value="bottom" selected>En bas</option><option value="top">En haut</option></select></div>`;const opacity=rangeField('Opacité',0.16,0.06,0.6,0.02);opacity.input.dataset.opacity='';opacity.out.textContent='16 %';opacity.input.addEventListener('input',()=>opacity.out.textContent=`${Math.round(+opacity.input.value*100)} %`);ui.controls.appendChild(opacity.wrap);ui.content.innerHTML='<div class="pdf-empty-inline">Le filigrane est ajouté en diagonale. Les numéros sont centrés en haut ou en bas de chaque page.</div>';addPrimary('Appliquer et télécharger',markPdf);}
  function winAnsiSafe(text){return String(text).replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/–|—/g,'-').replace(/…/g,'...').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E\xA0-\xFF]/g,'?');}
  async function markPdf(){const watermark=winAnsiSafe($('[data-watermark]',ui.controls).value.trim()),position=$('[data-position]',ui.controls).value,numbers=$('[data-numbers]',ui.controls).value,opacity=+$('[data-opacity]',ui.controls).value||.16;if(!watermark&&numbers==='none'){showMessage('Ajoute un filigrane ou active les numéros de pages.','error');return;}setBusy(true);progress('Ajout des éléments…',5);try{const pdf=await PDFDocument.load(await state.files[0].arrayBuffer()),font=await pdf.embedFont(StandardFonts.Helvetica),pages=pdf.getPages();pages.forEach((page,i)=>{const {width,height}=page.getSize();if(watermark){const size=Math.max(20,Math.min(48,width/12)),textWidth=font.widthOfTextAtSize(watermark,size),x=Math.max(10,(width-textWidth)/2),y=position==='top'?height-70:position==='bottom'?45:height/2;page.drawText(watermark,{x,y,size,font,color:rgb(.39,.33,.44),opacity,rotate:degrees(-28)});}if(numbers!=='none'){const text=`${i+1} / ${pages.length}`,size=9,tw=font.widthOfTextAtSize(text,size);page.drawText(text,{x:(width-tw)/2,y:numbers==='top'?height-20:13,size,font,color:rgb(.38,.36,.4),opacity:.78});}progress(`Page ${i+1}/${pages.length}`,8+((i+1)/pages.length)*84);});downloadBytes(await pdf.save({useObjectStreams:true}),`${baseName(state.files[0].name)}-marque.pdf`);showMessage('Filigrane / pagination appliqué.');}catch(e){console.error(e);showMessage('Impossible de modifier ce PDF.','error');}finally{hideProgress();setBusy(false);}}

  /* ---------- ÉVÉNEMENTS ---------- */
  ui.toolButtons.forEach(button => button.addEventListener('click', () => selectTool(button.dataset.tool)));
  ui.reset.addEventListener('click', clearWorkbench);
  ui.dropzone.addEventListener('click', () => ui.fileInput.click());
  ui.dropzone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ui.fileInput.click(); } });
  ui.fileInput.addEventListener('change', () => handleFiles(ui.fileInput.files));
  ['dragenter','dragover'].forEach(type => ui.dropzone.addEventListener(type, e => { e.preventDefault(); ui.dropzone.classList.add('is-dragover'); }));
  ['dragleave','drop'].forEach(type => ui.dropzone.addEventListener(type, e => { e.preventDefault(); ui.dropzone.classList.remove('is-dragover'); }));
  ui.dropzone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));

  selectTool('organize');
})();
