(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const deepClone = (value) => JSON.parse(JSON.stringify(value));
  const uid = (prefix = "layer") => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const round = (value) => Math.round(value * 10) / 10;

  const canvas = $("[data-image-canvas]");
  const overlay = $("[data-overlay-canvas]");
  const ctx = canvas.getContext("2d", { alpha: true });
  const octx = overlay.getContext("2d", { alpha: true });
  const stage = $("[data-stage]");
  const canvasWrap = $("[data-canvas-wrap]");
  const canvasStack = $("[data-canvas-stack]");
  const emptyState = $("[data-empty-state]");
  const fileInput = $("[data-file-input]");
  const dropHint = $("[data-drop-hint]");
  const toastNode = $("[data-toast]");
  const toolOptions = $("[data-tool-options]");
  const selectionOptions = $("[data-selection-options]");
  const toolTitle = $("[data-tool-title]");
  const layerList = $("[data-layer-list]");
  const statusNode = $("[data-document-status]");
  const sizeNode = $("[data-document-size]");
  const zoomValue = $("[data-zoom-value]");
  const resizeDialog = $("[data-resize-dialog]");
  const exportDialog = $("[data-export-dialog]");
  const newDialog = $("[data-new-dialog]");
  const a4Dialog = $("[data-a4-dialog]");
  const tabsNode = $("[data-document-tabs]");
  const tabList = $("[data-document-tab-list]");
  const mobileSheet = $("[data-mobile-sheet]");

  const assets = new Map();
  let blurScratch = document.createElement("canvas");
  let blurScratchCtx = blurScratch.getContext("2d");
  let toastTimer = 0;
  let busy = false;
  const documents = [];
  let activeDocumentId = "";

  const defaultAdjust = { brightness:100, contrast:100, saturation:100, grayscale:0, sepia:0, hue:0,
    exposure:0, highlights:0, shadows:0, whites:0, blacks:0, temperature:0, tint:0,
    vibrance:0, sharpen:0, vignette:0 };
  const state = {
    hasDocument: false,
    marquee: null,
    clipboard: null,
    spacePan: false,
    name: "image-philosophal",
    width: 0,
    height: 0,
    assetId: "",
    baseImage: null,
    layers: [],
    selectedId: null,
    selectedIds: [],
    snapEnabled: true,
    guidesEnabled: true,
    snapLines: [],
    tool: "select",
    zoom: 1,
    crop: null,
    draftLayer: null,
    interaction: null,
    adjust: { ...defaultAdjust },
    settings: {
      color: "#ee8426",
      fill: "transparent",
      width: 8,
      opacity: 1,
      fontSize: 48,
      fontWeight: 700,
      fontFamily: "Inter",
      fontStyle: "normal",
      textAlign: "left",
      lineHeight: 1.2,
      letterSpacing: 0,
      strokeWidth: 0,
      strokeColor: "#111827",
      shadowBlur: 0,
      shadowColor: "#111827",
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      text: "Texte",
      numberSize: 24,
      blur: 12,
      cropRatio: "free"
    },
    history: [],
    historyIndex: -1,
    nextNumber: 1
  };

  let v17Note = "Votre commentaire";
  let v17RedactionColor = "#20212e";
  const v17StyleColors=["#7564dd","#e7ad32","#c84b65","#22314d"];
  function v17Pick(preset){
    const styles={callout:"v17-callout",redact:"v17-redact",highlight:"highlight",arrow:"arrow",frame:"rect"};
    const tool=styles[preset];if(!tool)return;
    if(preset==="callout"){state.settings.color="#7564dd";state.settings.numberSize=24;}
    if(preset==="highlight"){state.settings.color="#e7ad32";state.settings.width=17;state.settings.opacity=1;}
    if(preset==="arrow"){state.settings.color="#7564dd";state.settings.width=5;}
    if(preset==="frame"){state.settings.color="#7564dd";state.settings.width=5;state.settings.fill="transparent";}
    setTool(tool);openInspector("tool");const menu=$('[data-v17-annotations]');if(menu)menu.open=false;
  }
  const TOOL_LABELS = { "v17-callout":"Repère commenté", "v17-redact":"Occultation opaque", "v16-select-rect":"Sélection rectangle", "v16-select-ellipse":"Sélection ellipse", "v16-select-lasso":"Sélection au lasso", "v16-select-color":"Sélection par couleur", "v16-mask-brush":"Pinceau de masque", marquee:"Sélection de pixels", eyedropper:"Pipette", hand:"Déplacer la vue", image:"Image",
    select: "Sélection",
    crop: "Recadrage",
    text: "Texte",
    brush: "Pinceau",
    highlight: "Surligneur",
    eraser: "Gomme",
    arrow: "Flèche",
    line: "Ligne",
    rect: "Rectangle",
    ellipse: "Ellipse",
    number: "Repère numéroté",
    blur: "Flou"
  };

  /* V16 : selections documentaires et masques non destructifs des calques image. */
  const maskEngine = window.PhilosophalSelection;
  let pixelSelection = null;
  let selectionDraft = null;
  let selectionMode = "replace";
  let selectionTolerance = 28;
  let selectionContiguous = true;
  let selectionFeather = 0;
  let maskBrushSize = 36;
  let maskBrushShow = false;
  let maskDraftCanvas = null;
  let maskDraftLayer = null;
  const maskedCache = new Map();
  function clearMaskedCache(){ maskedCache.clear(); }
  function imageDimensions(layer){const a=assets.get(layer?.assetId)?.image;return a?{w:a.naturalWidth||a.width,h:a.naturalHeight||a.height}:null;}
  function maskedSource(source,layer,fullQuality=false){
    if(layer.maskEnabled===false||(!layer.maskAssetId&&maskDraftLayer!==layer.id))return source;
    const draft=maskDraftLayer===layer.id?maskDraftCanvas:null;
    const mask=draft||assets.get(layer.maskAssetId)?.image;
    if(!mask)return source;
    const key=`${layer.id}:${layer.assetId}:${layer.maskAssetId}:${retouchVersion}:${fullQuality?'F':'P'}`;
    if(!draft&&maskedCache.has(key))return maskedCache.get(key);
    const w=source.naturalWidth||source.width,h=source.naturalHeight||source.height;
    const output=maskEngine.make(w,h),m=output.getContext('2d');
    m.drawImage(source,0,0,w,h);m.globalCompositeOperation='destination-in';m.drawImage(mask,0,0,w,h);
    if(!draft){if(maskedCache.size>=4)maskedCache.clear();maskedCache.set(key,output);}return output;
  }
  function selectionToolbarHtml(){
    const masked=selectedLayer();return `<section class="v16-panel" aria-label="Options de sélection">
      <div class="v16-panel-title">Détourage précis <span>V16</span></div>
      <label class="image-field">Combinaison<select data-v16-selection-mode>
        <option value="replace" ${selectionMode==='replace'?'selected':''}>Nouvelle sélection</option>
        <option value="add" ${selectionMode==='add'?'selected':''}>Ajouter à la sélection</option>
        <option value="subtract" ${selectionMode==='subtract'?'selected':''}>Soustraire de la sélection</option>
      </select></label>
      ${optionRange('Contour progressif','v16Feather',selectionFeather,0,50,1,' px')}
      ${state.tool==='v16-select-color' ? `${optionRange('Tolérance de couleur','v16Tolerance',selectionTolerance,0,120,1)}<label class="image-check-row"><input type="checkbox" data-v16-contiguous ${selectionContiguous?'checked':''}> Zone contiguë uniquement</label>`:''}
      <div class="v16-action-grid"><button type="button" data-v16-invert-selection>Inverser</button><button type="button" data-v16-clear-selection>Tout désélectionner</button></div>
      <button type="button" class="image-action-wide" data-v16-apply-mask ${pixelSelection&&masked?.type==='image'&&!masked.locked?'':'disabled'}>Créer un masque sur le calque choisi</button>
      <p class="v16-help">${pixelSelection?'Zone sélectionnée · Choisissez le calque image à détourer.':'Tracez une zone, ou cliquez sur une couleur.'}</p>
    </section>`;
  }
  function maskOptionsHtml(layer){
    return `<section class="v16-panel"><div class="v16-panel-title">Masque de calque <span>${layer.maskAssetId?'Actif':'Aucun'}</span></div>
      <p class="v16-help">Cachez des pixels sans supprimer l'image originale. Les masques suivent les déplacements, zooms et rotations du calque.</p>
      <div class="v16-action-grid"><button type="button" data-v16-create-mask ${layer.maskAssetId&&!pixelSelection?'disabled':''}>${pixelSelection?'Masquer hors sélection':'Créer un masque blanc'}</button>
      <button type="button" data-v16-edit-mask ${layer.maskAssetId?'':'disabled'}>Retoucher au pinceau</button></div>
      ${layer.maskAssetId?`<label class="image-check-row"><input type="checkbox" data-v16-mask-visible ${layer.maskEnabled!==false?'checked':''}> Activer le masque</label>
        <div class="v16-action-grid"><button type="button" data-v16-invert-mask>Inverser le masque</button><button type="button" data-v16-remove-mask>Retirer le masque</button></div>`:''}
    </section>`;
  }
  function maskBrushOptions(){return `<section class="v16-panel"><div class="v16-panel-title">Peindre le masque</div>
    <label class="image-field">Mode<select data-v16-brush-mode><option value="hide" ${!maskBrushShow?'selected':''}>Cacher (noir)</option><option value="show" ${maskBrushShow?'selected':''}>Révéler (blanc)</option></select></label>
    ${optionRange('Diamètre','v16BrushSize',maskBrushSize,2,250,1,' px')}
    <p class="v16-help">Peignez directement sur l'image. Le noir cache, le blanc révèle. Annuler : Ctrl + Z.</p>
    <button type="button" class="image-secondary-wide" data-v16-end-mask>Terminer le masque</button></section>`;}
  function resetTransientSelection(){ pixelSelection=null; selectionDraft=null; maskDraftCanvas=null; maskDraftLayer=null;clearMaskedCache();const action=$('[data-v16-selection-action]');if(action)action.hidden=true; }
  async function applyMaskFromSelection(allowBlank=false){
    if(!state.hasDocument||busy)return;
    const layer=selectedLayer();if(!layer||layer.type!=='image'||layer.locked){toast('Sélectionnez d’abord un calque image déverrouillé.');return;}
    if(!pixelSelection&&!allowBlank){toast('Dessinez une sélection avant de créer le masque.');return;}
    const dim=imageDimensions(layer);if(!dim)return;
    setBusy(true,'Création du masque…');
    try{
      let mask;
      if(pixelSelection){const feathered=maskEngine.feather(pixelSelection,selectionFeather);mask=maskEngine.toLocalMask(feathered,layer,dim.w,dim.h);}
      else{mask=maskEngine.make(dim.w,dim.h);const c=mask.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,dim.w,dim.h);}
      const a=await registerAssetFromCanvas(mask);
      layer.maskAssetId=a.id;layer.maskEnabled=true;clearMaskedCache();
      pixelSelection=null;selectionDraft=null;
      setTool('select');refreshLayers();pushHistory();toast('Masque créé : les pixels masqués sont conservés.');
    }catch(error){console.error('Masque V16',error);toast('La création du masque a échoué.');}
    finally{setBusy(false);}
  }
  async function invertCurrentMask(){const layer=selectedLayer();if(layer?.type!=='image'||!layer.maskAssetId||layer.locked||busy)return;
    const mask=assets.get(layer.maskAssetId)?.image;if(!mask)return;
    setBusy(true,'Inversion du masque…');try{const c=maskEngine.make(mask.naturalWidth,mask.naturalHeight),x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='destination-out';x.drawImage(mask,0,0);const a=await registerAssetFromCanvas(c);layer.maskAssetId=a.id;clearMaskedCache();refreshLayers();pushHistory();}finally{setBusy(false);}}
  function removeMask(){const layer=selectedLayer();if(!layer?.maskAssetId||layer.locked)return;delete layer.maskAssetId;delete layer.maskEnabled;clearMaskedCache();refreshLayers();pushHistory();}
  function beginMaskPaint(point){const layer=selectedLayer();if(layer?.type!=='image'||layer.locked||!layer.maskAssetId){toast('Choisissez un calque image ayant un masque.');return false;}
    const source=assets.get(layer.maskAssetId)?.image,dim=imageDimensions(layer);if(!source||!dim)return false;layer.maskEnabled=true;
    maskDraftCanvas=maskEngine.make(dim.w,dim.h);maskDraftCanvas.getContext('2d').drawImage(source,0,0,dim.w,dim.h);maskDraftLayer=layer.id;
    const p=maskEngine.pointToLocal(point,layer,dim.w,dim.h),diam=maskBrushSize*(dim.w/Math.max(.01,layer.w)+dim.h/Math.max(.01,layer.h))/2;
    maskEngine.stroke(maskDraftCanvas,p,p,diam,maskBrushShow);
    state.interaction={type:'v16-mask-paint',layerId:layer.id,last:p,diam};renderAll();return true;
  }
  async function finishMaskPaint(i){const layer=state.layers.find(l=>l.id===i.layerId);const buffer=maskDraftCanvas;
    if(!layer||!buffer)return;
    setBusy(true,'Enregistrement du masque…');
    try{const a=await registerAssetFromCanvas(buffer);layer.maskAssetId=a.id;layer.maskEnabled=true;clearMaskedCache();pushHistory();}
    catch(e){console.error('Pinceau masque',e);toast('Impossible de sauvegarder ce masque.');}
    finally{maskDraftCanvas=null;maskDraftLayer=null;setBusy(false);refreshLayers();}}
  function commitPixelSelection(type,points){
    if(!points.length)return;
    if(type==='lasso' && points.length<3){selectionDraft=null;renderOverlay();return;}
    if(type!=='lasso' && Math.hypot(points.at(-1).x-points[0].x,points.at(-1).y-points[0].y)<2){selectionDraft=null;renderOverlay();return;}
    const shape=maskEngine.shape(state.width,state.height,type,points);
    pixelSelection=maskEngine.compose(pixelSelection,shape,selectionMode);
    selectionDraft=null;renderOverlay();renderToolOptions();
  }
  function selectionOverlay(){
    const action=$('[data-v16-selection-action]');if(action)action.hidden=!pixelSelection;
    octx.save();
    if(pixelSelection){octx.globalAlpha=.17;octx.drawImage(pixelSelection,0,0);}
    if(selectionDraft?.points.length){
      const d=selectionDraft,p=d.points;
      octx.globalAlpha=1;octx.fillStyle='rgba(109,92,235,.14)';
      octx.strokeStyle='#8A71EC';octx.lineWidth=2/Math.max(.2,state.zoom);octx.setLineDash([5/Math.max(.2,state.zoom),4/Math.max(.2,state.zoom)]);
      octx.beginPath();octx.moveTo(p[0].x,p[0].y);
      if(d.kind==='lasso'){p.forEach(pt=>octx.lineTo(pt.x,pt.y));}
      else{const a=p[0],b=p.at(-1);const r={x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(b.x-a.x),h:Math.abs(b.y-a.y)};
        if(d.kind==='ellipse')octx.ellipse(r.x+r.w/2,r.y+r.h/2,Math.max(.1,r.w/2),Math.max(.1,r.h/2),0,0,2*Math.PI);
        else octx.rect(r.x,r.y,r.w,r.h);}
      octx.fill();octx.stroke();
    }
    octx.restore();
  }

  /* V15 : rendu de retouche non destructive, copie temporaire + cache limité. */
  const retouch = window.PhilosophalRetouch;
  const beforeCanvas = $("[data-before-canvas]");
  const beforeCtx = beforeCanvas.getContext("2d", {alpha:true});
  const beforeDivider = $("[data-before-divider]");
  let comparisonEnabled = false;
  let beforeHeld = false;
  let comparePosition = 50;
  let beforeDirty = true;
  let retouchCache = new Map();
  let retouchVersion = 0;
  let adjustFrame = 0;
  function clearRetouchCache(){retouchCache.clear(); retouchVersion++;}
  function retouchedImage(original, id, fullQuality=false) {
    if (!retouch?.active(state.adjust)) return original;
    const w=original.naturalWidth || original.videoWidth || original.width;
    const h=original.naturalHeight || original.videoHeight || original.height;
    const key=`${id}:${retouchVersion}:${fullQuality?'full':'preview'}:${w}x${h}`;
    if(retouchCache.has(key))return retouchCache.get(key);
    const adjusted=retouch.apply(original,w,h,state.adjust,{fullQuality});
    // Budget mémoire : ~64 Mo de pixels RGBA mis en cache au maximum.
    // Les exports pleine qualité gardent leur source mais pas les grandes copies.
    const pixelBudget = 16_000_000;
    const imagePixels = w * h;
    if (imagePixels <= pixelBudget) {
      let total = imagePixels;
      for (const item of retouchCache.values()) total += item.width * item.height;
      if (total > pixelBudget || retouchCache.size >= 3) retouchCache.clear();
      retouchCache.set(key, adjusted);
    }
    return adjusted;
  }
  function comparisonVisible(){return state.hasDocument && (comparisonEnabled || beforeHeld);}
  function updateComparison() {
    const visible=comparisonVisible();
    beforeCanvas.hidden=!visible;
    beforeDivider.hidden=!visible || beforeHeld || comparePosition===0 || comparePosition===100;
    if (!visible) {
      // Une toile de comparaison cachée peut occuper plus de 140 Mo en 6K.
      if (beforeCanvas.width > 1 || beforeCanvas.height > 1) {
        beforeCanvas.width = beforeCanvas.height = 1;
        beforeDirty = true;
      }
      return;
    }
    beforeCanvas.style.clipPath=beforeHeld?'inset(0 0 0 0)':`inset(0 ${100-comparePosition}% 0 0)`;
    beforeDivider.style.left=`${comparePosition}%`;
  }
  function drawBeforeDocument() {
    if(!comparisonVisible()) {updateComparison();return;}
    if(beforeCanvas.width!==state.width || beforeCanvas.height!==state.height){beforeCanvas.width=state.width;beforeCanvas.height=state.height;beforeDirty=true;}
    if(beforeDirty){drawDocumentTo(beforeCtx,{original:true});beforeDirty=false;}
    updateComparison();
  }
  function scheduleAdjustmentPreview() {
    if (adjustFrame) cancelAnimationFrame(adjustFrame);
    adjustFrame=requestAnimationFrame(()=>{adjustFrame=0;renderAll();});
  }
  function formatAdjustValue(key,value) {
    if(key==='hue')return `${value}°`;
    if(retouch?.advancedKeys.includes(key))return value>0?`+${value}`:String(value);
    return `${value} %`;
  }
  function resetAdjustmentGroup(group) {
    const groups={light:['exposure','highlights','shadows','whites','blacks'],color:['temperature','tint','vibrance'],detail:['sharpen','vignette']};
    (groups[group]||[]).forEach(key=>state.adjust[key]=0);
    clearRetouchCache();syncAdjustmentControls();renderAll();pushHistory();
  }

  /* V12 — projets persistants dans IndexedDB : aucune image envoyée au réseau. */
  const PROJECT_DB = "philosophal-editor-projets-v12";
  const PROJECT_REV = 2; // V19 : ajout non destructif des points de restauration.
  let projectDbPromise = null;
  let saveTimer = 0;
  let writeQueue = Promise.resolve();
  const v19Dirty = new Map();
  let v19Revision = 0;
  const V19_CHECKPOINT_INTERVAL = 4 * 60 * 1000;
  const V19_CHECKPOINT_KEEP = 3;
  const v19StorageNode = $("[data-v19-storage]");
  const v19RecoveryNode = $("[data-v19-recovery-list]");
  const v19RecoveryPanel = $("[data-v19-recovery-panel]");
  const v19RecoveryButton = $("[data-v19-recovery-toggle]");
  const persistedAssets = new Set();
  const saveIndicator = $("[data-save-status]");
  const projectDialog = $("[data-projects-dialog]");
  const projectList = $("[data-projects-list]");
  const projectEmpty = $("[data-projects-empty]");
  const projectFile = $("[data-project-file]");
  const emptyRecent = $("[data-empty-recent]");

  function saveStatus(text, kind = "") {
    if (!saveIndicator) return;
    saveIndicator.textContent = text;
    saveIndicator.dataset.status = kind;
  }

  function requestToPromise(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Impossible de lire la base locale"));
    });
  }

  function openProjectDb() {
    if (projectDbPromise) return projectDbPromise;
    if (!("indexedDB" in window)) return Promise.reject(new Error("Stockage local non disponible"));
    projectDbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(PROJECT_DB, PROJECT_REV);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("projects")) db.createObjectStore("projects", {keyPath:"id"});
        if (!db.objectStoreNames.contains("assets")) db.createObjectStore("assets", {keyPath:"id"});
        if (!db.objectStoreNames.contains("recovery")) db.createObjectStore("recovery", {keyPath:"id"});
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("Stockage local refusé"));
      req.onblocked = () => reject(new Error("Stockage bloqué par un autre onglet"));
    }).catch(error => { projectDbPromise = null; throw error; });
    return projectDbPromise;
  }

  function assetIdsFor(doc) {
    const ids = new Set();
    const collect = snapshot => {
      if (!snapshot) return;
      if (snapshot.assetId) ids.add(snapshot.assetId);
      (snapshot.layers || []).forEach(layer => { if (layer.assetId) ids.add(layer.assetId); if (layer.maskAssetId) ids.add(layer.maskAssetId); });
    };
    collect(doc.snapshot);
    (doc.history || []).forEach(collect);
    return [...ids];
  }

  function scheduleProjectSave() {
    if (!state.hasDocument || !activeDocumentId) return;
    v19Dirty.set(activeDocumentId, ++v19Revision);
    saveStatus("Modifications à enregistrer…", "pending");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { saveTimer = 0; void saveProjectNow(true); }, 900);
  }

  async function saveProjectNow(silent = false) {
    clearTimeout(saveTimer);
    saveTimer = 0;
    if (!state.hasDocument || !activeDocumentId) return false;
    saveActiveDocument();
    const record = documentRecordFromState(activeDocumentId);
    if (!record) return false;
    const data = {
      ...deepClone(record),
      version: 1,
      updatedAt: Date.now()
    };
    // V19 : la révision est capturée avec l'état pour ne jamais marquer comme
    // « enregistré » un document qui a changé pendant une écriture asynchrone.
    const revision = v19Dirty.get(data.id);
    saveStatus("Enregistrement local…", "pending");
    const write = async () => {
      const missing = [];
      for (const id of assetIdsFor(data)) {
        const entry = assets.get(id);
        if (!entry?.blob) throw new Error(`Image du projet absente (${id})`);
        if (!persistedAssets.has(id)) missing.push({id,blob:entry.blob});
      }
      const db = await openProjectDb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(["projects", "assets", "recovery"], "readwrite");
        const projects = tx.objectStore("projects");
        const backups = tx.objectStore("recovery");
        // Un ancien état est conservé toutes les 4 minutes maximum.
        // Les images restent dans le magasin partagé : pas de duplication de blobs.
        const previousRequest = projects.get(data.id);
        previousRequest.onsuccess = () => {
          const previous = previousRequest.result;
          if (!previous?.snapshot) return;
          const listRequest = backups.getAll();
          listRequest.onsuccess = () => {
            const existing = listRequest.result.filter(item => item.projectId === data.id)
              .sort((a,b) => b.createdAt - a.createdAt);
            if (existing[0] && Date.now() - existing[0].createdAt < V19_CHECKPOINT_INTERVAL) return;
            const checkpoint = {
              id: uid("restore"), projectId: data.id, name: previous.name,
              createdAt: Date.now(), updatedAt: previous.updatedAt,
              snapshot: previous.snapshot,
              // Limiter les copies d'historique pour préserver l'espace disque.
              history: (previous.history || []).slice(-10),
              historyIndex: -1
            };
            backups.put(checkpoint);
            existing.slice(V19_CHECKPOINT_KEEP - 1).forEach(item => backups.delete(item.id));
          };
        };
        projects.put(data);
        missing.forEach(entry => tx.objectStore("assets").put(entry));
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error("Écriture impossible"));
        tx.onabort = () => reject(tx.error || new Error("Espace local insuffisant"));
      });
      missing.forEach(entry => persistedAssets.add(entry.id));
      if (v19Dirty.get(data.id) === revision) v19Dirty.delete(data.id);
      if (activeDocumentId === data.id) {
        const changed = v19Dirty.has(data.id);
        saveStatus(changed ? "Modifications à enregistrer…" : "Enregistré sur cet appareil", changed ? "pending" : "saved");
      }
      if (!silent) toast("Projet enregistré sur cet appareil.");
      return true;
    };
    writeQueue = writeQueue.catch(() => {}).then(write);
    try { const result = await writeQueue; void updateRecentProjects(); return result; }
    catch (error) {
      if (activeDocumentId === data.id) saveStatus("Sauvegarde indisponible : exportez une copie", "error");
      if (!silent) toast(`Enregistrement impossible : ${error.message}`, 5000);
      return false;
    }
  }

  async function listSavedProjects() {
    const db = await openProjectDb();
    const records = await requestToPromise(db.transaction("projects", "readonly").objectStore("projects").getAll());
    return records.sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  async function updateRecentProjects() {
    try {
      const items = await listSavedProjects();
      if (emptyRecent) emptyRecent.hidden = items.length === 0;
    } catch (_) {
      if (emptyRecent) emptyRecent.hidden = true;
      saveStatus("Stockage local indisponible", "error");
    }
  }

  async function renderSavedProjects() {
    if (!projectList) return;
    projectList.textContent = "Chargement des projets…";
    try {
      const items = await listSavedProjects();
      projectEmpty.hidden = items.length > 0;
      projectList.innerHTML = items.map(project => {
        const width = Number(project.snapshot?.width) || 0;
        const height = Number(project.snapshot?.height) || 0;
        const date = new Date(project.updatedAt || 0).toLocaleString("fr-FR", {dateStyle:"medium",timeStyle:"short"});
        return `<article class="image-project-entry" role="listitem">
          <div class="image-project-entry-main"><label class="image-project-entry-label"><span class="sr-only">Nom du projet</span><input type="text" data-project-name="${escapeHtml(project.id)}" aria-label="Renommer ce projet" title="Cliquez pour renommer" maxlength="100" value="${escapeHtml(project.name || "Sans titre")}"></label>
          <small>${width} × ${height} px · ${escapeHtml(date)}</small></div>
          <div class="image-project-entry-actions">
            <button type="button" class="is-primary" data-load-project="${escapeHtml(project.id)}">Ouvrir</button>
            <button type="button" data-project-download="${escapeHtml(project.id)}" title="Exporter une copie éditable">Copie</button>
            <button type="button" class="is-danger" data-delete-project="${escapeHtml(project.id)}" aria-label="Supprimer ${escapeHtml(project.name || "projet")}">×</button>
          </div></article>`;
      }).join("");
    } catch (error) { projectList.textContent = `Impossible d’ouvrir la bibliothèque locale (${error.message}).`; projectEmpty.hidden = true; }
  }

  /* V19 : état du quota local et récupération d'une copie antérieure. */
  async function v19UpdateStorage() {
    if (!v19StorageNode) return;
    try {
      if (!navigator.storage?.estimate) { v19StorageNode.textContent = "Stockage local du navigateur"; return; }
      const {usage = 0, quota = 0} = await navigator.storage.estimate();
      const fmt = n => n < 1024*1024 ? `${Math.round(n/1024)} Ko` : `${Math.round(n/1024/1024)} Mo`;
      const ratio = quota ? usage / quota : 0;
      v19StorageNode.textContent = `Stockage du navigateur : ${fmt(usage)} utilisés${quota ? ` sur environ ${fmt(quota)} disponibles` : ""}.${ratio > .85 ? " Espace presque saturé : exportez vos projets." : ""}`;
      v19StorageNode.dataset.warning = ratio > .85 ? "true" : "false";
    } catch (_) { v19StorageNode.textContent = "Stockage local du navigateur"; }
  }

  async function v19ReadRecovery() {
    const db = await openProjectDb();
    const all = await requestToPromise(db.transaction("recovery", "readonly").objectStore("recovery").getAll());
    return all.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  async function v19RenderRecovery() {
    if (!v19RecoveryNode) return;
    v19RecoveryNode.textContent = "Recherche des versions précédentes…";
    try {
      await writeQueue.catch(() => {});
      const all = await v19ReadRecovery();
      v19RecoveryNode.innerHTML = all.length ? all.map(item => {
        const d = new Date(item.createdAt).toLocaleString("fr-FR", {dateStyle:"medium",timeStyle:"short"});
        const dims = item.snapshot ? `${item.snapshot.width} × ${item.snapshot.height} px` : "";
        return `<article class="image-project-entry" role="listitem"><div class="image-project-entry-main">
          <strong>${escapeHtml(item.name || "Sans titre")}</strong><small>${escapeHtml(d)} · ${escapeHtml(dims)}</small>
          </div><div class="image-project-entry-actions"><button type="button" class="is-primary" data-v19-restore="${escapeHtml(item.id)}">Récupérer une copie</button></div></article>`;
      }).join("") : '<p class="v19-recovery-empty">Aucun point de restauration pour le moment. Ils sont créés progressivement lorsque vous modifiez des projets enregistrés.</p>';
    } catch (error) { v19RecoveryNode.textContent = `Versions indisponibles : ${error.message}`; }
  }

  async function v19RestoreCheckpoint(id) {
    setBusy(true, "Récupération du projet…");
    try {
      await writeQueue.catch(() => {});
      const checkpoint = (await v19ReadRecovery()).find(item => item.id === id);
      if (!checkpoint?.snapshot) throw new Error("Ce point de restauration n'existe plus.");
      // Restaurer dans UN NOUVEAU PROJET : ne jamais écraser le projet actuel.
      const doc = {
        id: uid("doc"), name: `${checkpoint.name || "Projet"} · copie récupérée`,
        snapshot: deepClone(checkpoint.snapshot), history: deepClone(checkpoint.history || []),
        historyIndex: -1, zoom: 1, selectedId: null, version: 1, updatedAt: Date.now()
      };
      doc.snapshot.name = doc.name;
      // Seul l'état récupéré est requis ; l'historique antérieur peut référencer
      // d'anciens assets déjà nettoyés. On redémarre proprement à cet état.
      doc.history = [deepClone(doc.snapshot)]; doc.historyIndex = 0;
      for (const aid of assetIdsFor(doc)) await hydrateAsset(aid);
      const db = await openProjectDb();
      await new Promise((resolve,reject) => {
        const tx = db.transaction("projects", "readwrite");
        tx.objectStore("projects").put(doc);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error("Écriture impossible"));
        tx.onabort = () => reject(tx.error || new Error("Sauvegarde impossible"));
      });
      saveActiveDocument();
      documents.push(doc);
      activeDocumentId = "";
      loadDocumentRecord(doc.id);
      projectDialog.close();
      v19RecoveryPanel.hidden = true;
      v19RecoveryButton.setAttribute("aria-expanded", "false");
      toast("Copie récupérée : le projet d'origine a été conservé.", 4500);
    } catch (error) { toast(`Récupération impossible : ${error.message}`, 5500); }
    finally { setBusy(false); }
  }

  async function showProjects() {
    if (v19RecoveryPanel) v19RecoveryPanel.hidden = true;
    v19RecoveryButton?.setAttribute("aria-expanded", "false");
    await renderSavedProjects();
    void v19UpdateStorage();
    if (!projectDialog.open) projectDialog.showModal();
  }

  async function hydrateAsset(id) {
    if (assets.has(id)) return;
    const db = await openProjectDb();
    const stored = await requestToPromise(db.transaction("assets", "readonly").objectStore("assets").get(id));
    if (!stored?.blob) throw new Error("Image absente du stockage local");
    const src = URL.createObjectURL(stored.blob);
    try {
      const image = await loadImageElement(src);
      assets.set(id, {src,image,blob:stored.blob,revoke:true});
      persistedAssets.add(id);
    } catch (error) { URL.revokeObjectURL(src); throw error; }
  }

  async function readSavedProject(id) {
    const db = await openProjectDb();
    return requestToPromise(db.transaction("projects", "readonly").objectStore("projects").get(id));
  }

  async function loadSavedProject(id) {
    if (documents.some(doc => doc.id === id)) { loadDocumentRecord(id); projectDialog.close(); return; }
    setBusy(true,"Réouverture du projet…");
    try {
      const doc = await readSavedProject(id);
      if (!doc?.snapshot || !Number.isInteger(doc.snapshot.width) || !Number.isInteger(doc.snapshot.height) || doc.snapshot.width * doc.snapshot.height > 36_000_000 || doc.snapshot.width < 1 || doc.snapshot.height < 1) throw new Error("Projet invalide");
      for (const assetId of assetIdsFor(doc)) await hydrateAsset(assetId);
      saveActiveDocument();
      documents.push(doc);
      activeDocumentId = "";
      loadDocumentRecord(id);
      projectDialog.close();
      toast("Projet et calques restaurés.");
    } catch (error) { toast(`Impossible d’ouvrir le projet : ${error.message}`, 4200); }
    finally { setBusy(false); }
  }

  async function renameSavedProject(id, name) {
    const clean = String(name || "").trim().slice(0,100) || "Sans titre";
    try {
      await writeQueue.catch(() => {});
      const record = await readSavedProject(id);
      if (!record) throw new Error("Projet introuvable");
      record.name = clean;
      if (record.snapshot) record.snapshot.name = clean;
      (record.history || []).forEach(history => { history.name = clean; });
      record.updatedAt = Date.now();
      const db = await openProjectDb();
      await new Promise((resolve,reject) => {
        const tx = db.transaction("projects","readwrite");
        tx.objectStore("projects").put(record);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      const open = documents.find(doc => doc.id === id);
      if (open) {
        open.name=clean;
        open.snapshot.name=clean;
        (open.history||[]).forEach(history => {history.name=clean;});
      }
      if (activeDocumentId === id) {
        state.name=clean;
        (state.history||[]).forEach(history => {history.name=clean;});
        updateStatus();
      }
      renderDocumentTabs();
      saveStatus("Projet renommé et enregistré", "saved");
    } catch (error) {toast(`Renommage impossible : ${error.message}`,4000);}
  }

  async function pruneUnusedProjectAssets() {
    try {
      await writeQueue.catch(() => {});
      const projects = await listSavedProjects();
      const previous = await v19ReadRecovery();
      const used = new Set([...projects, ...previous].flatMap(assetIdsFor));
      const db = await openProjectDb();
      const keys = await requestToPromise(db.transaction("assets", "readonly").objectStore("assets").getAllKeys());
      const unused = keys.filter(id => !used.has(id));
      if (!unused.length) return;
      await new Promise((resolve, reject) => {
        const tx = db.transaction("assets", "readwrite");
        unused.forEach(id => tx.objectStore("assets").delete(id));
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      unused.forEach(id => persistedAssets.delete(id));
    } catch (_) { /* L'échec du nettoyage ne doit jamais interrompre le travail. */ }
  }

  async function deleteSavedProject(id) {
    const project = await readSavedProject(id);
    if (!project || !window.confirm(`Supprimer « ${project.name || 'Sans titre'} » de cet appareil ?`)) return;
    await writeQueue.catch(() => {});
    const db = await openProjectDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(["projects", "recovery"], "readwrite");
      tx.objectStore("projects").delete(id);
      const backups = tx.objectStore("recovery");
      const req = backups.getAll();
      req.onsuccess = () => req.result.filter(item => item.projectId === id).forEach(item => backups.delete(item.id));
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("Suppression impossible"));
    });
    v19Dirty.delete(id);
    // Les images d'autres projets sont conservées ; nettoyage après l'écriture.
    const index = documents.findIndex(doc => doc.id === id);
    if (index >= 0) {
      documents.splice(index,1);
      if (activeDocumentId === id) { activeDocumentId=""; if (documents.length) loadDocumentRecord(documents[0].id); else showEmptyDocument(); }
      else renderDocumentTabs();
    }
    await renderSavedProjects();
    await updateRecentProjects();
    void pruneUnusedProjectAssets();
    toast("Projet supprimé de la bibliothèque.");
  }

  async function blobAsDataUrl(blob) {
    return new Promise((resolve,reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error || new Error("Image illisible"));
      reader.readAsDataURL(blob);
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 120000);
  }

  async function downloadEditableProject(id = activeDocumentId) {
    if (!id) { toast("Ouvrez un projet pour l’exporter."); return; }
    if (id === activeDocumentId) { saveActiveDocument(); await saveProjectNow(true); }
    try {
      const doc = (documents.find(entry => entry.id === id) || await readSavedProject(id));
      if (!doc) throw new Error("Projet introuvable");
      const list = [];
      for (const assetId of assetIdsFor(doc)) {
        const blob = assets.get(assetId)?.blob || (await requestToPromise((await openProjectDb()).transaction("assets", "readonly").objectStore("assets").get(assetId)))?.blob;
        if (!blob) throw new Error("Image manquante dans ce projet");
        list.push({id:assetId,data:await blobAsDataUrl(blob)});
      }
      const manifest = {type:"philosophal-image-project",version:1,project:{...doc,history:(doc.history||[]).slice(-70)},assets:list};
      downloadBlob(new Blob([JSON.stringify(manifest)],{type:"application/json"}),`${fileBaseName(doc.name)}.phimage`);
      toast("Copie éditable téléchargée.");
    } catch (error) { toast(`Export du projet impossible : ${error.message}`, 4200); }
  }

  async function importEditableProject(file) {
    if (!file || file.size > 120_000_000) { toast("Fichier projet trop volumineux (maximum 120 Mo).",4000); return; }
    setBusy(true,"Import du projet…");
    try {
      const manifest = JSON.parse(await file.text());
      if (manifest.type !== "philosophal-image-project" || manifest.version !== 1 || !manifest.project?.snapshot || !Array.isArray(manifest.assets) || manifest.assets.length > 150) throw new Error("Fichier projet non reconnu");
      const snap = manifest.project.snapshot;
      if (!Number.isInteger(snap.width) || !Number.isInteger(snap.height) || snap.width < 1 || snap.height < 1 || snap.width*snap.height > 36_000_000) throw new Error("Dimensions non valides");
      const remap = new Map();
      for (const entry of manifest.assets) {
        if (!entry || typeof entry.id !== "string" || !/^data:image\/(png|jpeg|webp|gif|bmp|svg\+xml);base64,/i.test(entry.data) || entry.data.length > 130_000_000) throw new Error("Image du projet non reconnue");
        const res = await fetch(entry.data);
        const fileBlob = await res.blob();
        const converted = await registerAssetFromBlob(fileBlob);
        remap.set(entry.id, converted.id);
      }
      const convert = snapshot => {
        const copy = deepClone(snapshot);
        if (!remap.has(copy.assetId)) throw new Error("Fond de projet absent");
        copy.assetId = remap.get(copy.assetId);
        copy.layers = (copy.layers || []).map(layer => {
          if (layer.assetId) {
            if (!remap.has(layer.assetId)) throw new Error("Calque image absent");
            layer.assetId=remap.get(layer.assetId);
          if (layer.maskAssetId) { if (!remap.has(layer.maskAssetId)) throw new Error("Masque de calque absent"); layer.maskAssetId=remap.get(layer.maskAssetId); }
          }
          return layer;
        });
        return copy;
      };
      const doc = {
        id:uid("doc"),
        name:String(manifest.project.name||"Projet importé").slice(0,120),
        snapshot:convert(snap),
        history:(manifest.project.history||[]).slice(-70).map(convert),
        historyIndex:-1,
        zoom:1,
        selectedId:manifest.project.selectedId || null
      };
      if (!doc.history.length) doc.history=[deepClone(doc.snapshot)];
      doc.historyIndex=Number.isInteger(manifest.project.historyIndex)
        ? clamp(manifest.project.historyIndex,0,doc.history.length-1) : doc.history.length-1;
      saveActiveDocument(); documents.push(doc); activeDocumentId="";
      loadDocumentRecord(doc.id);
      if (projectDialog.open) projectDialog.close();
      await saveProjectNow(true);
      toast("Projet importé avec ses calques.");
    } catch (error) { toast(`Import impossible : ${error.message}`, 4500); }
    finally {setBusy(false);projectFile.value="";}
  }

  function togglePanel(panel) {
    if (panel === "inspector" && window.matchMedia("(max-width:900px)").matches) {
      if (document.body.classList.contains("image-inspector-open")) closeInspector(); else openInspector("tool");
      return;
    }
    const className = panel === "tools" ? "image-tools-hidden" : "image-panel-hidden";
    const hidden = document.body.classList.toggle(className);
    const trigger = $(`[data-toggle-${panel}]`);
    if (trigger) trigger.setAttribute("aria-pressed", String(!hidden));
    try { localStorage.setItem(`philosophal-image-v12-${panel}`, hidden ? "hidden" : "visible"); } catch (_) {}
    if (state.hasDocument && state.zoom <= 1) setTimeout(fitZoom,210);
  }
  function restorePanelPreferences() {
    try {
      if (localStorage.getItem("philosophal-image-v12-tools") === "hidden") document.body.classList.add("image-tools-hidden");
      if (localStorage.getItem("philosophal-image-v12-inspector") === "hidden") document.body.classList.add("image-panel-hidden");
    } catch (_) {}
    [["tools","image-tools-hidden"],["inspector","image-panel-hidden"]].forEach(([name,className]) => {
      const trigger=$(`[data-toggle-${name}]`);
      if (trigger) trigger.setAttribute("aria-pressed",String(!document.body.classList.contains(className)));
    });
  }

  function appPath(path) {
    if (window.PHILOSOPHAL_NAVIGATION) return window.PHILOSOPHAL_NAVIGATION.resolve(path);
    const localHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    const localMain = localHost && /^\/main(?:\/|$)/.test(window.location.pathname);
    return `${localMain ? "/main" : ""}${path}`;
  }

  function go(path) { window.location.assign(appPath(path)); }

  function toast(message, duration = 2300) {
    clearTimeout(toastTimer);
    toastNode.textContent = message;
    toastNode.hidden = false;
    toastTimer = setTimeout(() => { toastNode.hidden = true; }, duration);
  }

  function setBusy(active, label = "Traitement…") {
    busy = Boolean(active);
    document.body.classList.toggle("image-busy", busy);
    if (busy) statusNode.textContent = label;
    else updateStatus();
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function fileBaseName(name = "") {
    return String(name).replace(/\.[^.]+$/, "").trim() || "image-philosophal";
  }

  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  async function registerAssetFromBlob(blob) {
    const src = URL.createObjectURL(blob);
    const image = await loadImageElement(src);
    const id = uid("asset");
    assets.set(id, { src, image, blob, revoke: true });
    return { id, image };
  }

  async function registerAssetFromFile(file) {
    const src = URL.createObjectURL(file);
    const image = await loadImageElement(src);
    const id = uid("asset");
    assets.set(id, { src, image, blob: file, revoke: true });
    return { id, image };
  }

  function canvasToBlob(sourceCanvas, type = "image/png", quality) {
    return new Promise((resolve, reject) => {
      sourceCanvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("blob")), type, quality);
    });
  }

  async function registerAssetFromCanvas(sourceCanvas) {
    const blob = await canvasToBlob(sourceCanvas, "image/png");
    return registerAssetFromBlob(blob);
  }

  function currentSnapshot() {
    return {
      width: state.width,
      height: state.height,
      assetId: state.assetId,
      layers: deepClone(state.layers),
      selectedId: state.selectedId,
      selectedIds: [...activeSelectionIds()],
      adjust: { ...state.adjust },
      nextNumber: state.nextNumber,
      name: state.name
    };
  }


  function documentRecordFromState(id = activeDocumentId || uid("doc")) {
    if (!state.hasDocument) return null;
    return {
      id,
      name: state.name || "Image",
      snapshot: currentSnapshot(),
      history: deepClone(state.history || []),
      historyIndex: state.historyIndex,
      zoom: state.zoom || 1,
      selectedId: state.selectedId || null
    };
  }

  function saveActiveDocument() {
    if (!activeDocumentId || !state.hasDocument) return;
    const index = documents.findIndex((doc) => doc.id === activeDocumentId);
    if (index < 0) return;
    documents[index] = documentRecordFromState(activeDocumentId);
    renderDocumentTabs();
  }

  function registerCurrentDocument() {
    if (!state.hasDocument) return;
    const id = uid("doc");
    activeDocumentId = id;
    documents.push(documentRecordFromState(id));
    renderDocumentTabs();
    scheduleProjectSave();
  }

  function loadDocumentRecord(id) {
    if (id === activeDocumentId) return;
    if (saveTimer && activeDocumentId) void saveProjectNow(true);
    saveActiveDocument();
    const doc = documents.find((entry) => entry.id === id);
    if (!doc) return;
    activeDocumentId = id;
    state.hasDocument = true;
    state.history = deepClone(doc.history || []);
    state.historyIndex = Number.isInteger(doc.historyIndex) ? doc.historyIndex : Math.max(0, state.history.length - 1);
    state.zoom = doc.zoom || 1;
    restoreSnapshot(doc.snapshot);
    state.selectedId = doc.selectedId && state.layers.some(l => l.id === doc.selectedId) ? doc.selectedId : state.selectedId;
    if(state.selectedId && !state.selectedIds.includes(state.selectedId)) state.selectedIds=[state.selectedId];
    showDocument();
    renderAll();
    renderLayerList();
    renderSelectionOptions();
    updateHistoryButtons();
    renderDocumentTabs();
    requestAnimationFrame(fitZoom);
  }

  function closeDocument(id) {
    if (saveTimer && activeDocumentId) void saveProjectNow(true);
    saveActiveDocument();
    const index = documents.findIndex((doc) => doc.id === id);
    if (index < 0) return;
    const wasActive = id === activeDocumentId;
    documents.splice(index, 1);
    if (!wasActive) { renderDocumentTabs(); return; }
    const next = documents[Math.min(index, documents.length - 1)];
    activeDocumentId = "";
    if (next) loadDocumentRecord(next.id);
    else showEmptyDocument();
    // Libère les images des onglets fermés, mais uniquement après persistance.
    void writeQueue.catch(() => {}).then(v19ReleaseUnusedAssets);
  }

  function v19ReleaseUnusedAssets() {
    const used = new Set(documents.flatMap(assetIdsFor));
    if (state.hasDocument) assetIdsFor({snapshot:currentSnapshot(),history:state.history}).forEach(id => used.add(id));
    for (const [id, item] of assets) {
      if (used.has(id) || !persistedAssets.has(id)) continue;
      if (item.revoke) try {URL.revokeObjectURL(item.src);} catch (_) {}
      assets.delete(id);
    }
    // Les canevas de retouche ne doivent pas conserver d'images libérées.
    clearRetouchCache();
  }

  function showEmptyDocument() {
    state.hasDocument = false;
    activeDocumentId = "";
    comparisonEnabled=false;beforeHeld=false;updateComparison();clearRetouchCache();
    stage.hidden = true;
    emptyState.hidden = false;
    state.layers = [];
    state.selectedId = null;
    state.selectedIds=[];
    state.snapLines=[];
    state.marquee=null;resetTransientSelection();
    state.crop = null;
    state.history = [];
    state.historyIndex = -1;
    canvas.width = overlay.width = 1;
    canvas.height = overlay.height = 1;
    updateStatus();
    updateHistoryButtons();
    renderDocumentTabs();
  }

  function renderDocumentTabs() {
    if (!tabList) return;
    tabList.innerHTML = documents.map((doc, index) => `<button type="button" class="image-document-tab ${doc.id === activeDocumentId ? "is-active" : ""}" data-doc-tab="${doc.id}" title="${escapeHtml(doc.name)}"><span>${escapeHtml(doc.name || `Image ${index + 1}`)}</span><i data-doc-close="${doc.id}" aria-label="Fermer">×</i></button>`).join("");
    tabsNode?.classList.toggle("is-empty", documents.length === 0);
  }

  function pushHistory() {
    if (!state.hasDocument) return;
    const snapshot = currentSnapshot();
    const serialized = JSON.stringify(snapshot);
    if (state.historyIndex >= 0) {
      const previous = state.history[state.historyIndex];
      if (JSON.stringify(previous) === serialized) return;
    }
    state.history.splice(state.historyIndex + 1);
    state.history.push(snapshot);
    // Historique borné en taille APPROXIMATIVE : les traits de pinceau et
    // annotations très détaillés ne doivent pas remplir le stockage local.
    const budget = 10_000_000;
    const maxEntries = clamp(Math.floor(budget / Math.max(1000, serialized.length)), 2, 70);
    if (state.history.length > maxEntries) state.history.splice(0, state.history.length - maxEntries);
    state.historyIndex = state.history.length - 1;
    updateHistoryButtons();
    scheduleProjectSave();
  }

  function restoreSnapshot(snapshot) {
    if (!snapshot) return;
    const asset = assets.get(snapshot.assetId);
    if (!asset) return;
    state.width = snapshot.width;
    state.height = snapshot.height;
    state.assetId = snapshot.assetId;
    state.baseImage = asset.image;
    state.layers = deepClone(snapshot.layers);
    state.marquee=null;resetTransientSelection();
    state.adjust = { ...defaultAdjust, ...(snapshot.adjust || {}) };
    clearRetouchCache();
    state.nextNumber = snapshot.nextNumber || 1;
    state.name = snapshot.name || state.name;
    const selection = Object.prototype.hasOwnProperty.call(snapshot, "selectedId") ? snapshot.selectedId : state.selectedId;
    state.selectedId = state.layers.some(layer => layer.id === selection) ? selection : null;
    state.selectedIds = (snapshot.selectedIds || (state.selectedId ? [state.selectedId] : []))
      .filter(id => state.layers.some(layer => layer.id === id));
    if (!state.selectedIds.includes(state.selectedId)) state.selectedId=state.selectedIds.at(-1)||null;
    state.snapLines=[];
    state.crop = null;
    state.draftLayer = null;
    state.interaction = null;
    syncAdjustmentControls();
    resizeCanvases();
    renderAll();
    renderLayerList();
    renderToolOptions();
    updateStatus();
  }

  function undo() {
    if (busy || state.historyIndex <= 0) return;
    state.historyIndex -= 1;
    restoreSnapshot(state.history[state.historyIndex]);
    updateHistoryButtons();
    scheduleProjectSave();
  }

  function redo() {
    if (busy || state.historyIndex >= state.history.length - 1) return;
    state.historyIndex += 1;
    restoreSnapshot(state.history[state.historyIndex]);
    updateHistoryButtons();
    scheduleProjectSave();
  }

  function updateHistoryButtons() {
    $$('[data-undo]').forEach((button) => { button.disabled = state.historyIndex <= 0; });
    $$('[data-redo]').forEach((button) => { button.disabled = state.historyIndex < 0 || state.historyIndex >= state.history.length - 1; });
  }

  function resetHistory() {
    state.history = [];
    state.historyIndex = -1;
    pushHistory();
  }

  function resizeCanvases() {
    if (!state.hasDocument) return;
    canvas.width = state.width;
    canvas.height = state.height;
    overlay.width = state.width;
    overlay.height = state.height;
    // L'original avant/après n'est alloué que lorsqu'il est réellement affiché.
    if (comparisonVisible()) {beforeCanvas.width=state.width; beforeCanvas.height=state.height;}
    else {beforeCanvas.width=1; beforeCanvas.height=1;}
    beforeDirty=true;
    updateCanvasCssSize();
  }

  function updateCanvasCssSize() {
    if (!state.hasDocument) return;
    canvasStack.style.width = `${Math.max(1, state.width * state.zoom)}px`;
    canvasStack.style.height = `${Math.max(1, state.height * state.zoom)}px`;
    zoomValue.textContent = `${Math.round(state.zoom * 100)} %`;
  }

  function filterString() {
    const a = state.adjust;
    return `brightness(${a.brightness}%) contrast(${a.contrast}%) saturate(${a.saturation}%) grayscale(${a.grayscale}%) sepia(${a.sepia || 0}%) hue-rotate(${a.hue || 0}deg)`;
  }

  function prepareScratch(width, height) {
    if (blurScratch.width !== width || blurScratch.height !== height) {
      blurScratch.width = width;
      blurScratch.height = height;
      blurScratchCtx = blurScratch.getContext("2d");
    }
    blurScratchCtx.clearRect(0, 0, width, height);
  }

  const TYPE_FONTS = {
    Inter: 'Inter, system-ui, sans-serif',
    Editorial: 'Georgia, "Times New Roman", serif',
    Sans: 'Arial, Helvetica, sans-serif',
    Mono: '"Courier New", Consolas, monospace',
    Classique: '"Times New Roman", Times, serif'
  };
  function fontSpec(layer) {
    const family = TYPE_FONTS[layer.fontFamily] || TYPE_FONTS.Inter;
    return `${layer.fontStyle === "italic" ? "italic" : "normal"} ${layer.fontWeight || 700} ${Math.max(6, Number(layer.fontSize) || 48)}px ${family}`;
  }
  function textLayout(layer, measureCtx) {
    const lines = String(layer.text ?? "Texte").split("\n");
    const size = Math.max(6, Number(layer.fontSize) || 48);
    const spacing = clamp(Number(layer.letterSpacing) || 0, -8, 40);
    const leading = clamp(Number(layer.lineHeight) || 1.2, .75, 3);
    measureCtx.save(); measureCtx.font=fontSpec(layer);
    const lengths = lines.map(line => {
      const glyphs = [...(line || " ")];
      return Math.max(0, measureCtx.measureText(line || " ").width + Math.max(0, glyphs.length - 1) * spacing);
    });
    measureCtx.restore();
    return {lines, lengths, spacing, size, leading, width:Math.max(size*.5,...lengths), height: size+(lines.length-1)*size*leading};
  }
  function drawSpacedText(targetCtx, line, x, y, spacing) {
    if (!spacing) { targetCtx.fillText(line || " ", x,y); return; }
    let px=x; for(const char of [...(line||" ")]) {targetCtx.fillText(char,px,y);px+=targetCtx.measureText(char).width+spacing;}
  }
  function strokeSpacedText(targetCtx, line, x, y, spacing) {
    if(!spacing){targetCtx.strokeText(line||" ",x,y);return;}
    let px=x;for(const char of [...(line||" ")]){targetCtx.strokeText(char,px,y);px+=targetCtx.measureText(char).width+spacing;}
  }
  function drawMultilineText(targetCtx, layer) {
    const m=textLayout(layer,targetCtx);
    targetCtx.save();
    targetCtx.translate(layer.x || 0,layer.y || 0);
    if(layer.rotation)targetCtx.rotate(layer.rotation*Math.PI/180);
    if(layer.mirrorX)targetCtx.scale(-1,1);
    targetCtx.font=fontSpec(layer);targetCtx.textBaseline="top";targetCtx.textAlign="left";
    targetCtx.fillStyle=layer.color||state.settings.color;
    const shadow = clamp(Number(layer.shadowBlur)||0,0,60);
    if(shadow){targetCtx.shadowColor=layer.shadowColor||"#111827";targetCtx.shadowBlur=shadow;
      targetCtx.shadowOffsetX=Number.isFinite(Number(layer.shadowOffsetX))?Number(layer.shadowOffsetX):2;targetCtx.shadowOffsetY=Number.isFinite(Number(layer.shadowOffsetY))?Number(layer.shadowOffsetY):3;}
    const outline=clamp(Number(layer.strokeWidth)||0,0,20);
    m.lines.forEach((line,index)=>{
      const x=layer.textAlign==="center"?(m.width-m.lengths[index])/2:layer.textAlign==="right"?(m.width-m.lengths[index]):0;
      const y=index*m.size*m.leading;
      if(outline){targetCtx.lineWidth=outline*2;targetCtx.lineJoin="round";targetCtx.strokeStyle=layer.strokeColor||"#111827";
        strokeSpacedText(targetCtx,line,x,y,m.spacing);}
      drawSpacedText(targetCtx,line,x,y,m.spacing);
    });
    targetCtx.restore();
  }

  function drawArrow(targetCtx, layer) {
    const x1 = layer.x1, y1 = layer.y1, x2 = layer.x2, y2 = layer.y2;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const head = Math.max(12, (layer.width || 5) * 3.2);
    targetCtx.beginPath();
    targetCtx.moveTo(x1, y1);
    targetCtx.lineTo(x2, y2);
    targetCtx.stroke();
    targetCtx.beginPath();
    targetCtx.moveTo(x2, y2);
    targetCtx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
    targetCtx.moveTo(x2, y2);
    targetCtx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
    targetCtx.stroke();
  }

  function drawPath(targetCtx, layer) {
    const points = layer.points || [];
    if (!points.length) return;
    targetCtx.save();
    targetCtx.lineCap = "round";
    targetCtx.lineJoin = "round";
    targetCtx.lineWidth = Math.max(1, layer.width || 8);
    targetCtx.strokeStyle = layer.color || "#ee8426";
    targetCtx.globalAlpha *= layer.opacity ?? 1;
    if (layer.type === "eraser") targetCtx.globalCompositeOperation = "destination-out";
    targetCtx.beginPath();
    targetCtx.moveTo(points[0].x, points[0].y);
    if (points.length === 1) targetCtx.lineTo(points[0].x + .01, points[0].y + .01);
    for (let i = 1; i < points.length; i++) targetCtx.lineTo(points[i].x, points[i].y);
    targetCtx.stroke();
    targetCtx.restore();
  }

  function drawBlur(targetCtx, layer) {
    const rect = normalizedRect(layer.x1, layer.y1, layer.x2, layer.y2);
    if (rect.w < 2 || rect.h < 2) return;
    prepareScratch(targetCtx.canvas.width, targetCtx.canvas.height);
    blurScratchCtx.drawImage(targetCtx.canvas, 0, 0);
    targetCtx.save();
    targetCtx.beginPath();
    targetCtx.rect(rect.x, rect.y, rect.w, rect.h);
    targetCtx.clip();
    targetCtx.filter = `blur(${Math.max(2, layer.blur || 12)}px)`;
    targetCtx.drawImage(blurScratch, 0, 0);
    targetCtx.restore();
  }

  /* V17 : repère éditable, légende au plus près de la zone annotée. */
  function v17CaptionGeometry(layer){
    const r=Math.max(12,layer.radius||21),fs=Math.max(12,Math.round(r*.65));
    const message=String(layer.note||"").trim().replace(/\s+/g," ").slice(0,150);
    const maxW=Math.min(290,Math.max(120,state.width*.34)),words=message.split(" ");
    const mctx=ctx;mctx.save();mctx.font=`600 ${fs}px Inter, system-ui, sans-serif`;
    const lines=[];let current="";
    for(const word of words){const candidate=current?current+" "+word:word;
      if(mctx.measureText(candidate).width>maxW-24&&current){lines.push(current);current=word;}else current=candidate;
      if(lines.length>=3)break;
    }
    if(current&&lines.length<3)lines.push(current);
    const contents=lines.slice(0,3);if(!contents.length)contents.push("Note");
    const w=Math.min(maxW,Math.max(92,...contents.map(t=>mctx.measureText(t).width+24)));
    mctx.restore();const height=contents.length*(fs+5)+14;
    const right=layer.x+r+13;
    const x=right+w<=state.width-4?right:layer.x-r-13-w;
    const y=Math.max(2,Math.min(state.height-height-2,layer.y-height/2));
    return {x,y,w,h:height,r,fs,lines:contents};
  }
  function v17RoundedRect(g,x,y,w,h,r){r=Math.min(r,w/2,h/2);g.beginPath();g.moveTo(x+r,y);g.lineTo(x+w-r,y);g.quadraticCurveTo(x+w,y,x+w,y+r);g.lineTo(x+w,y+h-r);g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);g.lineTo(x+r,y+h);g.quadraticCurveTo(x,y+h,x,y+h-r);g.lineTo(x,y+r);g.quadraticCurveTo(x,y,x+r,y);g.closePath();}
  function drawV17Callout(g,layer){
    const geo=v17CaptionGeometry(layer),color=layer.color||"#7564dd";
    g.save();g.globalAlpha*=layer.opacity??1;
    g.strokeStyle=color;g.lineWidth=Math.max(1.5,geo.r*.09);g.lineCap="round";
    g.beginPath();g.moveTo(layer.x+(geo.x>layer.x?geo.r:-geo.r),layer.y);g.lineTo(geo.x>layer.x?geo.x:geo.x+geo.w,layer.y);g.stroke();
    g.fillStyle=layer.noteBg||"#ffffff";v17RoundedRect(g,geo.x,geo.y,geo.w,geo.h,Math.min(12,geo.r*.5));g.fill();
    g.strokeStyle=color;g.lineWidth=1.5;g.stroke();
    g.fillStyle=layer.noteColor||"#252238";g.font=`600 ${geo.fs}px Inter, system-ui, sans-serif`;
    g.textAlign="left";g.textBaseline="top";geo.lines.forEach((line,i)=>g.fillText(line,geo.x+12,geo.y+8+i*(geo.fs+5),geo.w-22));
    g.beginPath();g.arc(layer.x,layer.y,geo.r,0,Math.PI*2);g.fillStyle=color;g.fill();
    g.strokeStyle="#ffffff";g.lineWidth=2;g.stroke();
    g.font=`800 ${Math.max(11,geo.r*.9)}px Inter, system-ui, sans-serif`;g.textAlign="center";g.textBaseline="middle";g.fillStyle="#ffffff";
    g.fillText(String(layer.number||1),layer.x,layer.y+1);g.restore();
  }
  function drawV17Redaction(g,layer){const a=normalizedRect(layer.x1,layer.y1,layer.x2,layer.y2);if(a.w<1||a.h<1)return;
    g.save();g.globalAlpha=1;g.globalCompositeOperation="source-over";g.fillStyle=layer.redactColor||"#20212e";g.fillRect(a.x,a.y,a.w,a.h);g.restore();}

  function drawLayer(targetCtx, layer, { preview = false, original = false, fullQuality = false } = {}) {
    if (!layer || layer.visible === false) return;
    if(layer.type==="v17-callout"){drawV17Callout(targetCtx,layer);return;}
    if(layer.type==="v17-redact"){drawV17Redaction(targetCtx,layer);return;}
    if (layer.type === "clear") {
      targetCtx.save(); targetCtx.globalCompositeOperation="destination-out"; targetCtx.fillRect(layer.x,layer.y,layer.w,layer.h); targetCtx.restore(); return;
    }
    if (layer.type === "image") {
      const asset=assets.get(layer.assetId); if(!asset)return;
      targetCtx.save(); targetCtx.globalAlpha*=layer.opacity??1; targetCtx.filter=original?"none":filterString();
      targetCtx.imageSmoothingEnabled=state.settings.smoothing!==false; targetCtx.imageSmoothingQuality="high";
      targetCtx.translate(layer.x+layer.w/2,layer.y+layer.h/2); targetCtx.rotate((layer.rotation||0)*Math.PI/180);
      targetCtx.scale(layer.mirrorX?-1:1,layer.mirrorY?-1:1); targetCtx.drawImage(maskedSource(original ? asset.image : retouchedImage(asset.image,layer.assetId,fullQuality),layer,fullQuality),-layer.w/2,-layer.h/2,layer.w,layer.h); targetCtx.restore(); return;
    }
    if (layer.type === "blur") {
      if (!preview) drawBlur(targetCtx, layer);
      else drawPreviewRect(targetCtx, layer, "rgba(238,132,38,.18)", "#e27a1d");
      return;
    }
    if (["brush", "highlight", "eraser"].includes(layer.type)) {
      if (preview && layer.type === "eraser") {
        targetCtx.save();
        const clone = { ...layer, type: "brush", color: "#ee8426", opacity: .55 };
        drawPath(targetCtx, clone);
        targetCtx.restore();
      } else drawPath(targetCtx, layer);
      return;
    }

    targetCtx.save();
    targetCtx.globalAlpha *= layer.opacity ?? 1;
    targetCtx.strokeStyle = layer.color || "#ee8426";
    targetCtx.fillStyle = layer.fill && layer.fill !== "transparent" ? layer.fill : "transparent";
    targetCtx.lineWidth = Math.max(1, layer.width || 5);
    targetCtx.lineCap = "round";
    targetCtx.lineJoin = "round";

    if (layer.type === "text") {
      targetCtx.restore();
      targetCtx.save();
      targetCtx.globalAlpha *= layer.opacity ?? 1;
      drawMultilineText(targetCtx, layer);
      targetCtx.restore();
      return;
    }
    if (layer.type === "line") {
      targetCtx.beginPath(); targetCtx.moveTo(layer.x1, layer.y1); targetCtx.lineTo(layer.x2, layer.y2); targetCtx.stroke();
    } else if (layer.type === "arrow") {
      drawArrow(targetCtx, layer);
    } else if (layer.type === "rect") {
      const rect = normalizedRect(layer.x1, layer.y1, layer.x2, layer.y2);
      if (layer.fill && layer.fill !== "transparent") targetCtx.fillRect(rect.x, rect.y, rect.w, rect.h);
      targetCtx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    } else if (layer.type === "ellipse") {
      const rect = normalizedRect(layer.x1, layer.y1, layer.x2, layer.y2);
      targetCtx.beginPath();
      targetCtx.ellipse(rect.x + rect.w / 2, rect.y + rect.h / 2, Math.abs(rect.w / 2), Math.abs(rect.h / 2), 0, 0, Math.PI * 2);
      if (layer.fill && layer.fill !== "transparent") targetCtx.fill();
      targetCtx.stroke();
    } else if (layer.type === "number") {
      const radius = Math.max(12, layer.radius || 24);
      targetCtx.save();
      targetCtx.translate(layer.x, layer.y);
      if (layer.rotation) targetCtx.rotate((layer.rotation * Math.PI) / 180);
      if (layer.mirrorX) targetCtx.scale(-1, 1);
      targetCtx.beginPath();
      targetCtx.arc(0, 0, radius, 0, Math.PI * 2);
      targetCtx.fillStyle = layer.color || "#ee8426";
      targetCtx.fill();
      targetCtx.fillStyle = "#fff";
      targetCtx.font = `800 ${Math.max(11, radius * .9)}px Inter, system-ui, sans-serif`;
      targetCtx.textAlign = "center";
      targetCtx.textBaseline = "middle";
      targetCtx.fillText(String(layer.number || 1), 0, 1);
      targetCtx.restore();
    }
    targetCtx.restore();
  }

  function drawDocumentTo(targetCtx,{original=false,fullQuality=false}={}) {
    if (!state.hasDocument || !state.baseImage) return;
    targetCtx.save();
    targetCtx.setTransform(1,0,0,1,0,0);
    targetCtx.clearRect(0,0,state.width,state.height);
    targetCtx.imageSmoothingEnabled=state.settings.smoothing!==false;
    targetCtx.imageSmoothingQuality="high";
    targetCtx.filter=original?"none":filterString();
    targetCtx.drawImage(original ? state.baseImage : retouchedImage(state.baseImage,state.assetId,fullQuality),0,0,state.width,state.height);
    targetCtx.filter="none";
    state.layers.forEach(layer=>drawLayer(targetCtx,layer,{original,fullQuality}));
    targetCtx.restore();
  }
  function drawDocument(fullQuality=false) {drawDocumentTo(ctx,{fullQuality});}

  function renderAll() {
    drawDocument();
    beforeDirty=true;
    drawBeforeDocument();
    renderOverlay();
    updateCanvasCursor();
  }

  function drawPreviewRect(targetCtx, layer, fill, stroke) {
    const rect = normalizedRect(layer.x1, layer.y1, layer.x2, layer.y2);
    targetCtx.save();
    targetCtx.fillStyle = fill;
    targetCtx.strokeStyle = stroke;
    targetCtx.lineWidth = Math.max(2 / state.zoom, 2);
    targetCtx.setLineDash([8 / state.zoom, 6 / state.zoom]);
    targetCtx.fillRect(rect.x, rect.y, rect.w, rect.h);
    targetCtx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    targetCtx.restore();
  }

  function renderOverlay() {
    if (!state.hasDocument) return;
    octx.setTransform(1, 0, 0, 1, 0, 0);
    octx.clearRect(0, 0, overlay.width, overlay.height);

    if(state.marquee){const r=normalizedRect(state.marquee.x1,state.marquee.y1,state.marquee.x2,state.marquee.y2);octx.save();octx.strokeStyle="#fff";octx.lineWidth=2/state.zoom;octx.strokeRect(r.x,r.y,r.w,r.h);octx.strokeStyle="#242b37";octx.lineWidth=1/state.zoom;octx.setLineDash([5/state.zoom,5/state.zoom]);octx.strokeRect(r.x,r.y,r.w,r.h);octx.restore();}
    if (state.draftLayer) drawLayer(octx, state.draftLayer, { preview: true });

    if (state.crop) {
      const rect = normalizedRect(state.crop.x1, state.crop.y1, state.crop.x2, state.crop.y2);
      octx.save();
      octx.fillStyle = "rgba(13,18,22,.52)";
      octx.fillRect(0, 0, state.width, state.height);
      octx.clearRect(rect.x, rect.y, rect.w, rect.h);
      octx.strokeStyle = "#fff";
      octx.lineWidth = Math.max(1.5 / state.zoom, 1.5);
      octx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      octx.strokeStyle = "rgba(255,255,255,.62)";
      octx.lineWidth = Math.max(1 / state.zoom, 1);
      octx.beginPath();
      for (let i = 1; i <= 2; i++) {
        const x = rect.x + (rect.w * i) / 3;
        const y = rect.y + (rect.h * i) / 3;
        octx.moveTo(x, rect.y); octx.lineTo(x, rect.y + rect.h);
        octx.moveTo(rect.x, y); octx.lineTo(rect.x + rect.w, y);
      }
      octx.stroke();
      octx.restore();
    }

    if(state.guidesEnabled && state.tool==="select") {
      octx.save();octx.strokeStyle="rgba(109,92,235,.30)";octx.lineWidth=1/state.zoom;
      octx.setLineDash([4/state.zoom,6/state.zoom]);
      octx.beginPath();octx.moveTo(state.width/2,0);octx.lineTo(state.width/2,state.height);
      octx.moveTo(0,state.height/2);octx.lineTo(state.width,state.height/2);octx.stroke();octx.restore();
    }
    if(state.snapLines.length){octx.save();octx.strokeStyle="#6d5ceb";octx.lineWidth=1.4/state.zoom;
      state.snapLines.forEach(g=>{octx.beginPath();if(g.axis==="x"){octx.moveTo(g.value,0);octx.lineTo(g.value,state.height);}else{octx.moveTo(0,g.value);octx.lineTo(state.width,g.value);}octx.stroke();});octx.restore();}
    if(state.tool==="select") selectedLayers().forEach(layer=>drawSelectionOutline(layer));
    selectionOverlay();
  }

  function drawSelectionOutline(layer) {
    const box = layerBounds(layer);
    if (!box) return;
    const pad = 5 / state.zoom;
    octx.save();
    octx.strokeStyle = "#7564dd";
    octx.lineWidth = Math.max(1.2 / state.zoom, 1.2);
    octx.setLineDash([5 / state.zoom, 4 / state.zoom]);
    octx.strokeRect(box.x - pad, box.y - pad, box.w + pad * 2, box.h + pad * 2);
    octx.setLineDash([]);
    octx.fillStyle = "#fff";
    octx.strokeStyle = "#7564dd";
    const r = 4 / state.zoom;
    [[box.x, box.y], [box.x + box.w, box.y], [box.x, box.y + box.h], [box.x + box.w, box.y + box.h]].forEach(([x, y]) => {
      octx.beginPath(); octx.arc(x, y, r, 0, Math.PI * 2); octx.fill(); octx.stroke();
    });
    octx.restore();
  }

  function normalizedRect(x1, y1, x2, y2) {
    const x = Math.min(x1, x2), y = Math.min(y1, y2);
    return { x, y, w: Math.abs(x2 - x1), h: Math.abs(y2 - y1) };
  }

  function textMetrics(layer) {
    const m=textLayout(layer,octx);
    const pad=Math.max(0,(Number(layer.strokeWidth)||0)*2,Number(layer.shadowBlur)||0);
    return {width:m.width,height:m.height,pad};
  }

  function rotatePoint(x, y, cx, cy, degrees) {
    if (!degrees) return { x, y };
    const angle = (degrees * Math.PI) / 180;
    const dx = x - cx, dy = y - cy;
    return { x: cx + dx * Math.cos(angle) - dy * Math.sin(angle), y: cy + dx * Math.sin(angle) + dy * Math.cos(angle) };
  }

  function layerBounds(layer) {
    if (!layer) return null;
    if (["image","clear"].includes(layer.type)) {
      const cx=layer.x+layer.w/2,cy=layer.y+layer.h/2;
      const ps=[[layer.x,layer.y],[layer.x+layer.w,layer.y],[layer.x,layer.y+layer.h],[layer.x+layer.w,layer.y+layer.h]].map(([x,y])=>rotatePoint(x,y,cx,cy,layer.rotation||0));
      const xs=ps.map(p=>p.x),ys=ps.map(p=>p.y);return {x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};
    }
    if (["line", "arrow", "rect", "ellipse", "blur", "v17-redact"].includes(layer.type)) {
      const rect = normalizedRect(layer.x1, layer.y1, layer.x2, layer.y2);
      const pad = layer.type === "blur" ? 0 : Math.max(3, layer.width || 3);
      return { x: rect.x - pad, y: rect.y - pad, w: rect.w + pad * 2, h: rect.h + pad * 2 };
    }
    if (["brush", "highlight", "eraser"].includes(layer.type)) {
      const points = layer.points || [];
      if (!points.length) return null;
      const xs = points.map((p) => p.x), ys = points.map((p) => p.y), pad = Math.max(4, (layer.width || 8) / 2);
      return { x: Math.min(...xs) - pad, y: Math.min(...ys) - pad, w: Math.max(...xs) - Math.min(...xs) + pad * 2, h: Math.max(...ys) - Math.min(...ys) + pad * 2 };
    }
    if(layer.type==="v17-callout"){
      const geo=v17CaptionGeometry(layer);const left=Math.min(layer.x-geo.r,geo.x),right=Math.max(layer.x+geo.r,geo.x+geo.w);
      const top=Math.min(layer.y-geo.r,geo.y),bottom=Math.max(layer.y+geo.r,geo.y+geo.h);
      return {x:left,y:top,w:right-left,h:bottom-top};
    }
    if (layer.type === "number") {
      const r = Math.max(12, layer.radius || 24);
      return { x: layer.x - r, y: layer.y - r, w: r * 2, h: r * 2 };
    }
    if (layer.type === "text") {
      const m = textMetrics(layer);
      const x = layer.mirrorX ? layer.x - m.width : layer.x;
      const corners = [
        rotatePoint(x, layer.y, layer.x, layer.y, layer.rotation || 0),
        rotatePoint(x + m.width, layer.y, layer.x, layer.y, layer.rotation || 0),
        rotatePoint(x, layer.y + m.height, layer.x, layer.y, layer.rotation || 0),
        rotatePoint(x + m.width, layer.y + m.height, layer.x, layer.y, layer.rotation || 0)
      ];
      const xs = corners.map((p) => p.x), ys = corners.map((p) => p.y);
      return { x: Math.min(...xs)-m.pad, y: Math.min(...ys)-m.pad, w: Math.max(...xs) - Math.min(...xs)+m.pad*2, h: Math.max(...ys) - Math.min(...ys)+m.pad*2 };
    }
    return null;
  }

  function activeSelectionIds() {
    const list = (state.selectedIds||[]).filter(id=>state.layers.some(l=>l.id===id));
    if (state.selectedId && state.layers.some(l=>l.id===state.selectedId) && !list.includes(state.selectedId)) list.push(state.selectedId);
    return list;
  }
  function selectedLayers({unlocked=false}={}) {
    const ids=new Set(activeSelectionIds());
    return state.layers.filter(l=>ids.has(l.id)&&(!unlocked||!l.locked));
  }
  function selectedLayer() { return state.layers.find((layer) => layer.id === state.selectedId) || null; }
  function setSelection(ids,primary=null,{keepTool=false}={}) {
    const valid=[...new Set(ids)].filter(id=>state.layers.some(l=>l.id===id));
    state.selectedIds=valid;
    state.selectedId=valid.includes(primary)?primary:(valid.at(-1)||null);
    if(state.selectedId&&!keepTool&&state.tool!=="select")setTool("select");
    renderOverlay();renderLayerList();renderSelectionOptions();
  }
  function toggleSelection(id,{range=false}={}){
    if (!state.layers.some(l=>l.id===id))return;
    const ids=activeSelectionIds();
    if(range&&state.selectedId){
      const a=state.layers.findIndex(l=>l.id===state.selectedId),b=state.layers.findIndex(l=>l.id===id);
      const rangeIds=state.layers.slice(Math.min(a,b),Math.max(a,b)+1).map(l=>l.id);
      setSelection([...ids,...rangeIds],id);
    } else setSelection(ids.includes(id)?ids.filter(x=>x!==id):[...ids,id],id);
  }
  function unionBounds(layers){
    const bs=layers.map(layerBounds).filter(Boolean); if(!bs.length)return null;
    const x=Math.min(...bs.map(b=>b.x)),y=Math.min(...bs.map(b=>b.y));
    const maxX=Math.max(...bs.map(b=>b.x+b.w)),maxY=Math.max(...bs.map(b=>b.y+b.h));
    return {x,y,w:maxX-x,h:maxY-y};
  }
  function alignLayers(direction){
    const layers=selectedLayers({unlocked:true});if(!layers.length)return;
    const outer=layers.length===1?{x:0,y:0,w:state.width,h:state.height}:unionBounds(layers);
    const axis=direction.startsWith("x")?"x":"y";
    const side=axis==="x"?"w":"h";
    const edge=direction.endsWith("start")?"start":direction.endsWith("end")?"end":"center";
    layers.forEach(l=>{const b=layerBounds(l);if(!b)return;
      const goal=edge==="start"?outer[axis]:edge==="end"?outer[axis]+outer[side]-b[side]:outer[axis]+outer[side]/2-b[side]/2;
      translateLayer(l,axis==="x"?goal-b.x:0,axis==="y"?goal-b.y:0);
    });
    refreshLayers();pushHistory();
  }
  function distributeLayers(axis){
    const layers=selectedLayers({unlocked:true}).map(l=>({l,b:layerBounds(l)})).filter(v=>v.b);
    if(layers.length<3){toast("Sélectionnez au moins trois calques pour les répartir.");return;}
    const dim=axis==="x"?"w":"h";layers.sort((a,b)=>a.b[axis]-b.b[axis]);
    const low=layers[0].b[axis], high=layers.at(-1).b[axis]+layers.at(-1).b[dim];
    const space=(high-low-layers.reduce((total,v)=>total+v.b[dim],0))/(layers.length-1);
    let pos=low;layers.forEach(v=>{translateLayer(v.l,axis==="x"?pos-v.b.x:0,axis==="y"?pos-v.b.y:0);pos+=v.b[dim]+space;});
    refreshLayers();pushHistory();
  }
  function snappingOffset(initial,dx,dy,movingIds){
    state.snapLines=[];
    if(!state.snapEnabled||!initial)return {dx,dy};
    const tolerance=8/state.zoom;
    const referenceX=[0,state.width/2,state.width],referenceY=[0,state.height/2,state.height];
    state.layers.forEach(layer=>{
      if(movingIds.includes(layer.id)||layer.visible===false) return;
      const b=layerBounds(layer);if(!b)return;
      referenceX.push(b.x,b.x+b.w/2,b.x+b.w);
      referenceY.push(b.y,b.y+b.h/2,b.y+b.h);
    });
    const match=(start,shift,len,values,axis)=>{
      let best=null;
      for(const v of values)for(const pos of [start+shift,start+shift+len/2,start+shift+len]){
        const diff=v-pos;if(Math.abs(diff)<=tolerance&&(!best||Math.abs(diff)<Math.abs(best.diff)))best={diff,value:v};
      }
      if(best){state.snapLines.push({axis,value:best.value});return shift+best.diff;}
      return shift;
    };
    dx=match(initial.x,dx,initial.w,referenceX,"x");dy=match(initial.y,dy,initial.h,referenceY,"y");
    return {dx,dy};
  }


  function hitLayer(point) {
    const tolerance = Math.max(4, 8 / state.zoom);
    for (let i = state.layers.length - 1; i >= 0; i--) {
      const layer = state.layers[i];
      if (layer.visible === false || layer.locked || layer.type==="clear") continue;
      const box = layerBounds(layer);
      if (!box) continue;
      if (point.x >= box.x - tolerance && point.x <= box.x + box.w + tolerance && point.y >= box.y - tolerance && point.y <= box.y + box.h + tolerance) return layer;
    }
    return null;
  }

  function pointFromEvent(event) {
    const rect = overlay.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (state.width / rect.width),
      y: (event.clientY - rect.top) * (state.height / rect.height)
    };
  }

  function translateLayer(layer, dx, dy) {
    if (!layer) return;
    if (["line", "arrow", "rect", "ellipse", "blur", "v17-redact"].includes(layer.type)) {
      layer.x1 += dx; layer.y1 += dy; layer.x2 += dx; layer.y2 += dy;
    } else if (["brush", "highlight", "eraser"].includes(layer.type)) {
      (layer.points || []).forEach((point) => { point.x += dx; point.y += dy; });
    } else if (["text", "number", "v17-callout", "image", "clear"].includes(layer.type)) {
      layer.x += dx; layer.y += dy;
    }
  }

  function scaleLayer(layer, sx, sy) {
    const avg = Math.sqrt(Math.abs(sx * sy));
    if (["image","clear"].includes(layer.type)) {layer.x*=sx;layer.y*=sy;layer.w*=sx;layer.h*=sy;return;}
    if (["line", "arrow", "rect", "ellipse", "blur", "v17-redact"].includes(layer.type)) {
      layer.x1 *= sx; layer.x2 *= sx; layer.y1 *= sy; layer.y2 *= sy;
      if (layer.width) layer.width *= avg;
      if (layer.blur) layer.blur *= avg;
    } else if (["brush", "highlight", "eraser"].includes(layer.type)) {
      (layer.points || []).forEach((point) => { point.x *= sx; point.y *= sy; });
      layer.width *= avg;
    } else if (layer.type === "text") {
      layer.x *= sx; layer.y *= sy; layer.fontSize *= avg;
    } else if (["number","v17-callout"].includes(layer.type)) {
      layer.x *= sx; layer.y *= sy; layer.radius *= avg;
    }
  }

  function rotateLayerClockwise(layer, oldHeight) {
    const map = (point) => ({ x: oldHeight - point.y, y: point.x });
    if(layer.type==="image"){const c=map({x:layer.x+layer.w/2,y:layer.y+layer.h/2});layer.x=c.x-layer.w/2;layer.y=c.y-layer.h/2;layer.rotation=((layer.rotation||0)+90)%360;return;}
    if(layer.type==="clear"){const x=oldHeight-layer.y-layer.h,y=layer.x;Object.assign(layer,{x,y,w:layer.h,h:layer.w});return;}
    if (["line", "arrow"].includes(layer.type)) {
      const a = map({ x: layer.x1, y: layer.y1 });
      const b = map({ x: layer.x2, y: layer.y2 });
      Object.assign(layer, { x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    } else if (["rect", "ellipse", "blur"].includes(layer.type)) {
      const r = normalizedRect(layer.x1, layer.y1, layer.x2, layer.y2);
      const points = [map({ x: r.x, y: r.y }), map({ x: r.x + r.w, y: r.y }), map({ x: r.x, y: r.y + r.h }), map({ x: r.x + r.w, y: r.y + r.h })];
      const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
      Object.assign(layer, { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) });
    } else if (["brush", "highlight", "eraser"].includes(layer.type)) {
      layer.points = (layer.points || []).map(map);
    } else if (["text", "number"].includes(layer.type)) {
      const p = map({ x: layer.x, y: layer.y }); layer.x = p.x; layer.y = p.y; layer.rotation = ((layer.rotation || 0) + 90) % 360;
    }
  }

  function flipLayerHorizontal(layer, width) {
    if(["image","clear"].includes(layer.type)){layer.x=width-layer.x-layer.w;if(layer.type==="image"){layer.mirrorX=!layer.mirrorX;layer.rotation=-(layer.rotation||0);}return;}
    if (["line", "arrow", "rect", "ellipse", "blur"].includes(layer.type)) {
      layer.x1 = width - layer.x1; layer.x2 = width - layer.x2;
    } else if (["brush", "highlight", "eraser"].includes(layer.type)) {
      (layer.points || []).forEach((point) => { point.x = width - point.x; });
    } else if (["text", "number"].includes(layer.type)) {
      layer.x = width - layer.x;
      layer.mirrorX = !layer.mirrorX;
    }
  }

  function updateCanvasCursor() {
    const cursor = state.tool === "hand" || state.spacePan ? "grab" : state.tool === "select" ? "move" : state.tool === "text" ? "text" : "crosshair";
    canvasStack.dataset.cursor = cursor;
  }

  function updateStatus() {
    if (!state.hasDocument) {
      statusNode.textContent = "Aucune image";
      sizeNode.textContent = "—";
      return;
    }
    statusNode.textContent = state.name || "Image";
    sizeNode.textContent = `${state.width} × ${state.height} px`;
    if (activeDocumentId) {
      const doc = documents.find((entry) => entry.id === activeDocumentId);
      if (doc) doc.name = state.name || doc.name;
      renderDocumentTabs();
    }
  }

  function syncAdjustmentControls() {
    Object.entries(state.adjust).forEach(([key, value]) => {
      const input = $(`[data-adjust="${key}"]`);
      const output = $(`[data-adjust-output="${key}"]`);
      if (input) input.value = value;
      if (output) output.textContent = formatAdjustValue(key,value);
    });
  }

  async function openImageFile(file) {
    if (!file || !/^image\/(png|jpeg|webp|gif|bmp|x-ms-bmp|svg\+xml)$/i.test(file.type)) {
      toast("Choisissez une image JPG, PNG, WebP, GIF, BMP ou SVG.");
      return;
    }
    if (saveTimer && activeDocumentId) void saveProjectNow(true);
    saveActiveDocument();
    setBusy(true, "Ouverture…");
    try {
      const { id, image } = await registerAssetFromFile(file);
      let width = image.naturalWidth, height = image.naturalHeight;
      const pixels = width * height;
      if (Math.max(width, height) > 7200 || pixels > 36_000_000) {
        const ratio = Math.min(7200 / Math.max(width, height), Math.sqrt(36_000_000 / pixels));
        const w = Math.max(1, Math.round(width * ratio)), h = Math.max(1, Math.round(height * ratio));
        const reduced = document.createElement("canvas"); reduced.width = w; reduced.height = h;
        const rctx = reduced.getContext("2d"); rctx.imageSmoothingEnabled = true; rctx.imageSmoothingQuality = "high"; rctx.drawImage(image, 0, 0, w, h);
        const converted = await registerAssetFromCanvas(reduced);
        state.assetId = converted.id; state.baseImage = converted.image; width = w; height = h;
        toast(`Image très grande : optimisée à ${w} × ${h} px pour préserver les performances.`, 4200);
      } else {
        state.assetId = id; state.baseImage = image;
      }
      resetTransientSelection();state.hasDocument = true;
      state.name = fileBaseName(file.name);
      state.width = width; state.height = height;
      state.layers = [{id:uid(),type:"image",assetId:state.assetId,x:0,y:0,w:width,h:height,opacity:1,visible:true,name:fileBaseName(file.name)}];
      const empty=await blankAsset(width,height);state.assetId=empty.id;state.baseImage=empty.image;
      state.selectedId=state.layers[0].id;state.marquee=null;state.crop = null; state.draftLayer = null; state.nextNumber = 1;
      state.adjust = { ...defaultAdjust };
      syncAdjustmentControls();
      showDocument();
      resizeCanvases();
      renderAll();
      renderLayerList();
      renderToolOptions();
      updateStatus();
      resetHistory();
      registerCurrentDocument();
      requestAnimationFrame(fitZoom);
    } catch (_) {
      toast("Impossible d’ouvrir cette image.");
    } finally { setBusy(false); }
  }

  function showDocument() {
    emptyState.hidden = true;
    stage.hidden = false;
  }

  async function createBlank(width, height, background = "white") {
    if (saveTimer && activeDocumentId) void saveProjectNow(true);
    saveActiveDocument();
    width = clamp(Math.round(width), 1, 12000);
    height = clamp(Math.round(height), 1, 12000);
    setBusy(true, "Création…");
    try {
      const blank = document.createElement("canvas"); blank.width = width; blank.height = height;
      const bctx = blank.getContext("2d");
      if (background === "white") { bctx.fillStyle = "#fff"; bctx.fillRect(0, 0, width, height); }
      const asset = await registerAssetFromCanvas(blank);
      resetTransientSelection();state.hasDocument = true; state.assetId = asset.id; state.baseImage = asset.image;
      state.width = width; state.height = height; state.name = "nouvelle-image";
      state.layers = []; state.selectedId = null; state.crop = null; state.draftLayer = null; state.nextNumber = 1;
      state.adjust = { ...defaultAdjust };
      syncAdjustmentControls(); showDocument(); resizeCanvases(); renderAll(); renderLayerList(); renderToolOptions(); updateStatus(); resetHistory();
      registerCurrentDocument();
      requestAnimationFrame(fitZoom);
    } finally { setBusy(false); }
  }

  async function pasteFromClipboard() {
    if (!navigator.clipboard?.read) {
      toast("Utilisez Ctrl+V pour coller une image depuis le presse-papiers.");
      return;
    }
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((value) => value.startsWith("image/"));
        if (!type) continue;
        const blob = await item.getType(type);
        const file = new File([blob], `capture.${type.includes("png") ? "png" : "webp"}`, { type });
        await importImage(file);
        return;
      }
      toast("Aucune image trouvée dans le presse-papiers.");
    } catch (_) {
      toast("Le navigateur n’a pas autorisé la lecture du presse-papiers. Essayez Ctrl+V.");
    }
  }

  function setTool(tool) {
    if (!TOOL_LABELS[tool]) return;
    state.tool = tool;
    if(tool!=="marquee")state.marquee=null;
    if (tool !== "crop") state.crop = null;
    state.draftLayer = null;
    selectionDraft=null;
    state.interaction = null;
    $$('[data-tool]').forEach((button) => { const active = button.dataset.tool === tool; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
    $$('[data-mobile-tool]').forEach((button) => button.classList.toggle("is-active", button.dataset.mobileTool === tool));
    toolTitle.textContent = TOOL_LABELS[tool];
    renderToolOptions();
    renderOverlay();
    updateCanvasCursor();
    closeMobileSheet();
  }

  function optionColor(label = "Couleur", value = state.settings.color, key = "color") {
    return `<div class="image-option-row"><span>${label}</span><div class="image-color-row"><input type="color" aria-label="${escapeHtml(label)}" value="${escapeHtml(value)}" data-setting-color="${key}"><input type="text" aria-label="${escapeHtml(label)} en hexadécimal" value="${escapeHtml(value)}" data-setting-textcolor="${key}" maxlength="9" spellcheck="false"></div></div>`;
  }

  function optionRange(label, key, value, min, max, step = 1, suffix = "") {
    return `<label class="image-option-row"><span>${label}<output data-setting-output="${key}">${round(value)}${suffix}</output></span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-setting-range="${key}" data-suffix="${escapeHtml(suffix)}"></label>`;
  }

  function typographyOptions(layer, prefix="setting") {
    const fields=layer||state.settings;
    const attr=(key)=>prefix==="setting"?`data-type-setting="${key}"`:`data-type-selected="${key}"`;
    const v=(key,def)=>fields[key]??def;
    const select=(key,label,choices,def)=>`<label class="image-option-row v13-typography-control"><span>${label}</span><select ${attr(key)}>${choices.map(([value,text])=>`<option value="${value}" ${String(v(key,def))===String(value)?"selected":""}>${text}</option>`).join("")}</select></label>`;
    const number=(key,label,min,max,step,def,suffix="")=>{
      const raw=Number(v(key,def)),safe=Number.isFinite(raw)?clamp(raw,min,max):def;
      return `<label class="image-field v13-typography-control">${label}<div class="v13-number-wrap"><input type="number" min="${min}" max="${max}" step="${step}" value="${safe}" ${attr(key)}><small>${suffix}</small></div></label>`;
    };
    const color=(key,label,def)=>{
      const raw=String(v(key,def));const safe=/^#[0-9a-f]{6}$/i.test(raw)?raw:def;
      return `<label class="image-field v13-typography-control">${label}<input type="color" ${attr(key)} value="${safe}"></label>`;
    };
    return `<div class="v13-type-section"><div class="v13-type-heading"><strong>Typographie</strong><small>Modifiable à tout moment</small></div>
    ${select("fontFamily","Police",[["Inter","Inter · Contemporain"],["Editorial","Georgia · Éditoriale"],["Sans","Arial · Sans-serif"],["Classique","Times · Classique"],["Mono","Monospace"]],"Inter")}
    <div class="image-option-grid">${select("fontWeight","Graisse",[[400,"Normal"],[500,"Moyen"],[600,"Semi-gras"],[700,"Gras"],[800,"Extra-gras"],[900,"Noir"]],700)}${select("fontStyle","Style",[["normal","Droit"],["italic","Italique"]],"normal")}</div>
    ${select("textAlign","Alignement",[["left","À gauche"],["center","Centré"],["right","À droite"]],"left")}
    <div class="image-option-grid">${number("lineHeight","Interligne",.75,3,.05,1.2,"×")}${number("letterSpacing","Espacement",-8,40,.5,0,"px")}</div>
    <div class="image-option-grid">${number("strokeWidth","Contour",0,20,.5,0,"px")}${color("strokeColor","Couleur du contour","#111827")}</div>
    <div class="image-option-grid">${number("shadowBlur","Ombre",0,60,1,0,"px")}${color("shadowColor","Couleur de l’ombre","#111827")}</div>
    <div class="v13-type-presets"><span>Styles rapides</span><div><button type="button" data-type-preset="editorial">Éditorial</button><button type="button" data-type-preset="video">Sous-titre</button><button type="button" data-type-preset="minimal">Minimal</button></div></div></div>`;
  }

  function renderToolOptions() {
    const s = state.settings;
    let html = "";
    if (state.tool === "select") {
      html = `<div class="image-help"><strong>Sélectionner</strong><br>Cliquez sur une image ou une annotation pour la déplacer. Les poignées redimensionnent les images. Flèches : 1 px ; Maj + flèches : 10 px.</div>`;
    } else if(state.tool.startsWith("v16-select-")){
      html=selectionToolbarHtml();
    } else if(state.tool==="v16-mask-brush"){
      html=maskBrushOptions();
    } else if(state.tool==="marquee"){
      html=`<div class="image-help">Tracez une zone rectangulaire. Copiez-la ou coupez-la, puis collez-la comme un nouveau calque. <kbd>Ctrl+C / X / V</kbd>.</div><div class="image-option-grid"><button data-copy-pixels>Copier la zone</button><button data-cut-pixels>Couper la zone</button><button data-paste-layer>Coller</button><button data-crop-selection>Recadrer à la zone</button></div>`;
    } else if(state.tool==="eyedropper"){html=`${optionColor()}<div class="image-help">Cliquez dans l’image pour récupérer une couleur. Elle sera utilisée pour le texte et les formes.</div>`;
    } else if(state.tool==="hand"){html=`<div class="image-help">Faites glisser pour déplacer la vue. Vous pouvez aussi maintenir Espace. Ctrl + molette : zoom.</div>`;
    } else if (state.tool === "crop") {
      html = `<div class="image-option-row"><span>Proportions</span><div class="image-option-buttons">
        ${[["free","Libre"],["1","1:1"],["1.333333","4:3"],["1.777778","16:9"]].map(([value,label])=>`<button type="button" data-crop-ratio="${value}" class="${String(s.cropRatio)===value?"is-active":""}">${label}</button>`).join("")}
      </div></div>
      <div class="image-help">Tracez une zone, puis déplacez-la en glissant à l’intérieur. Les dimensions peuvent être saisies ci-dessous.</div>
      ${state.crop ? `<div class="image-option-grid"><label class="image-field">Largeur (px)<input type="number" min="1" max="${state.width}" data-crop-width value="${Math.round(Math.abs(state.crop.x2-state.crop.x1))}"></label><label class="image-field">Hauteur (px)<input type="number" min="1" max="${state.height}" data-crop-height value="${Math.round(Math.abs(state.crop.y2-state.crop.y1))}"></label></div><button type="button" class="image-action-wide" data-apply-crop>Appliquer le recadrage</button><button type="button" class="image-secondary-wide" data-cancel-crop>Annuler la sélection</button>` : ""}`;
    } else if (state.tool === "v17-callout") {
      html = `<div class="v17-help-heading">Repère avec légende <span>V17</span></div>
      <label class="image-option-row"><span>Légende du prochain repère</span><textarea data-v17-new-note maxlength="150" rows="3">${escapeHtml(v17Note)}</textarea></label>
      ${optionColor("Couleur",s.color,"color")}${optionRange("Taille du repère","numberSize",s.numberSize,12,70,1," px")}
      <p class="v17-tool-tip">Cliquez dans le document. Le numéro s'ajoute automatiquement ; cliquez sur le repère en mode Sélection pour modifier son texte.</p>
      <button type="button" class="image-secondary-wide" data-v17-renumber>Renuméroter les repères</button>`;
    } else if (state.tool === "v17-redact") {
      html = `<div class="v17-help-heading">Occultation opaque <span>V17</span></div>
      ${optionColor("Couleur du cache",v17RedactionColor,"v17RedactColor")}
      <p class="v17-privacy-warning"><strong>Attention :</strong> dans le projet éditable, l'information originale reste présente. Exportez une image aplatie (PNG, JPG, WebP ou PDF), puis vérifiez-la avant de la partager. Ne partagez pas le fichier .phimage pour masquer des données.</p>
      <p class="v17-tool-tip">Glissez pour couvrir entièrement un nom, numéro ou visage avec un aplat opaque.</p>`;
    } else if (state.tool === "text") {
      html = `<label class="image-option-row"><span>Texte</span><textarea data-setting-text="text" placeholder="Votre texte…">${escapeHtml(s.text)}</textarea></label>
      ${optionColor("Couleur", s.color, "color")}
      ${optionRange("Taille", "fontSize", s.fontSize, 10, 220, 1, " px")}
      ${typographyOptions(null,"setting")}<div class="image-help">Réglez le texte, puis cliquez sur l’image pour le placer.</div>`;
    } else if (["brush","highlight","eraser"].includes(state.tool)) {
      html = `${state.tool === "eraser" ? "" : optionColor(state.tool === "highlight" ? "Couleur du surligneur" : "Couleur", s.color, "color")}
      ${optionRange("Épaisseur", "width", s.width, 1, 120, 1, " px")}
      ${state.tool === "eraser" ? "" : optionRange("Opacité", "opacity", Math.round(s.opacity*100), 5, 100, 1, " %")}
      <div class="image-help">${state.tool === "eraser" ? "La gomme rend transparent ce qui se trouve en dessous." : "Dessinez directement sur l’image avec la souris, le stylet ou le doigt."}</div>`;
    } else if (["arrow","line","rect","ellipse"].includes(state.tool)) {
      html = `${optionColor("Contour", s.color, "color")}${optionRange("Épaisseur", "width", s.width, 1, 60, 1, " px")}`;
      if (["rect","ellipse"].includes(state.tool)) html += `${optionColor("Remplissage", s.fill === "transparent" ? "#ffffff" : s.fill, "fill")}<label class="image-check-row"><input type="checkbox" data-fill-toggle ${s.fill !== "transparent" ? "checked" : ""}><span><strong>Activer le remplissage</strong><small>Sinon la forme reste transparente.</small></span></label>`;
      html += `<div class="image-help">Faites glisser pour dessiner ${state.tool === "arrow" ? "une flèche" : state.tool === "line" ? "une ligne" : "la forme"}.</div>`;
    } else if (state.tool === "number") {
      html = `${optionColor("Couleur", s.color, "color")}${optionRange("Taille", "numberSize", s.numberSize, 12, 70, 1, " px")}<div class="image-help">Chaque clic ajoute automatiquement le numéro suivant : 1, 2, 3…</div>`;
    } else if (state.tool === "blur") {
      html = `${optionRange("Intensité du flou", "blur", s.blur, 2, 40, 1, " px")}<div class="image-help">Faites glisser sur une zone à masquer. Le flou reste modifiable comme un calque.</div>`;
    }
    toolOptions.innerHTML = html;
    renderSelectionOptions();
  }

  function renderSelectionOptions() {
    const layer = selectedLayer();
    const count=activeSelectionIds().length;
    if (!layer) { selectionOptions.hidden = true; selectionOptions.innerHTML = ""; return; }
    selectionOptions.hidden = false;
    if(count>1){selectionOptions.innerHTML=`<div class="v13-multiselection"><strong>${count} calques sélectionnés</strong><p>Déplacez-les ensemble, ou utilisez les commandes d’alignement dans l’onglet Calques.</p><div class="image-option-grid"><button type="button" data-duplicate-layer>Dupliquer</button><button type="button" data-delete-selected>Supprimer</button></div></div>`;return;}
    let html = `<div class="image-option-label"><span>Élément sélectionné</span><strong>${escapeHtml(layerLabel(layer))}</strong></div>`;
    if (layer.type === "image") {
      html+=maskOptionsHtml(layer);
      html+=`<div class="image-option-grid">${[["x","X",layer.x],["y","Y",layer.y],["w","Largeur",layer.w],["h","Hauteur",layer.h],["rotation","Angle",layer.rotation||0]].map(([key,label,value])=>`<label class="image-field">${label}<input type="number" data-image-prop="${key}" step="1" value="${Math.round(value)}"></label>`).join("")}</div><label class="image-check-row"><input type="checkbox" data-image-ratio checked>Garder les proportions</label><div class="image-option-grid"><button data-fit-layer="cover">Remplir le cadre</button><button data-fit-layer="contain">Tout conserver</button><button data-fit-layer="center">Centrer</button><button data-fit-layer="original">Taille originale</button><button data-transform-layer="flipX">Miroir horizontal</button><button data-transform-layer="flipY">Miroir vertical</button><button data-transform-layer="rotate">Tourner de 90°</button><button data-duplicate-layer>Dupliquer</button></div>`;
    } else if (layer.type === "text") {
      html += `<label class="image-option-row"><span>Contenu</span><textarea data-selected-text>${escapeHtml(layer.text || "")}</textarea></label>${optionColor("Couleur", layer.color || state.settings.color, "selectedColor")}${optionRange("Taille", "selectedFontSize", layer.fontSize || 48, 8, 260, 1, " px")}${typographyOptions(layer,"selected")}`;
    } else if (["line","arrow","rect","ellipse","brush","highlight"].includes(layer.type)) {
      html += `${optionColor("Couleur", layer.color || state.settings.color, "selectedColor")}${optionRange("Épaisseur", "selectedWidth", layer.width || 5, 1, 140, 1, " px")}`;
    } else if (layer.type === "v17-callout") {
      html += `<label class="image-option-row"><span>Légende</span><textarea data-v17-selected-note maxlength="150" rows="3">${escapeHtml(layer.note||"")}</textarea></label>
      <label class="image-option-row"><span>Numéro</span><input type="number" data-v17-selected-number min="1" max="999" step="1" value="${layer.number||1}"></label>
      ${optionColor("Couleur du repère",layer.color||state.settings.color,"selectedColor")}
      ${optionRange("Taille","selectedRadius",layer.radius||24,12,70,1," px")}`;
    } else if (layer.type === "v17-redact") {
      html += `${optionColor("Couleur",layer.redactColor||"#20212e","v17SelectedRedaction")}`;
    } else if (layer.type === "number") {
      html += `${optionColor("Couleur", layer.color || state.settings.color, "selectedColor")}${optionRange("Taille", "selectedRadius", layer.radius || 24, 10, 90, 1, " px")}`;
    } else if (layer.type === "blur") {
      html += `${optionRange("Intensité", "selectedBlur", layer.blur || 12, 2, 40, 1, " px")}`;
    } else if (layer.type === "eraser") {
      html += `${optionRange("Épaisseur", "selectedWidth", layer.width || 20, 1, 160, 1, " px")}`;
    }
    if(layer.type!=="image")html+=`<button class="image-secondary-wide" data-duplicate-layer>Dupliquer cet élément</button>`;
    html += `${layer.type !== "eraser" && layer.type !== "v17-redact" ? optionRange("Opacité", "selectedOpacity", Math.round((layer.opacity ?? 1) * 100), 5, 100, 1, " %") : ""}<button type="button" class="image-danger-wide" data-delete-selected>Supprimer cet élément</button>`;
    selectionOptions.innerHTML = html;
  }

  function layerLabel(layer) {
    if(layer.customName)return layer.customName;
    if(layer.type==="image")return layer.name||"Image importée";
    if(layer.type==="clear")return "Découpe transparente";
    const labels = { "v17-callout":"Repère commenté", "v17-redact":"Occultation", text:"Texte",brush:"Pinceau",highlight:"Surligneur",eraser:"Gomme",arrow:"Flèche",line:"Ligne",rect:"Rectangle",ellipse:"Ellipse",number:`Numéro ${layer.number || ""}`,blur:"Flou" };
    if (layer.type === "text") return String(layer.text || "Texte").split("\n")[0].slice(0, 32) || "Texte";
    return labels[layer.type] || "Calque";
  }

  function renderLayerList() {
    if (!state.hasDocument) { layerList.innerHTML = '<p class="image-help">Ouvrez une image pour afficher les calques.</p>'; return; }
    const items = [...state.layers].reverse().map((layer) => {
      const index = state.layers.indexOf(layer);
      return `<div class="image-layer ${activeSelectionIds().includes(layer.id) ? "is-selected" : ""}" data-layer-id="${layer.id}" draggable="true" title="Faire glisser pour changer l’ordre">
        <button type="button" class="image-layer-eye" data-layer-visibility="${layer.id}" title="Afficher / masquer">${icon(layer.visible===false?"hidden":"eye")}</button>
        <button type="button" class="image-layer-main" data-select-layer="${layer.id}" title="Ctrl ou Maj + clic : sélection multiple"><strong>${escapeHtml(layerLabel(layer))}${layer.maskAssetId?" <span class=\"v16-mask-mark\" title=\"Masque non destructif\">◧</span>":""}</strong><small>${escapeHtml(TOOL_LABELS[layer.type] || layer.type)}${layer.maskAssetId?(layer.maskEnabled===false?" · masque désactivé":" · masque actif"):""}</small></button>
        <div class="image-layer-actions"><button type="button" data-layer-rename="${layer.id}" title="Renommer" aria-label="Renommer le calque">✎</button><button type="button" data-layer-lock="${layer.id}" title="${layer.locked?"Déverrouiller":"Verrouiller"}" aria-label="${layer.locked?"Déverrouiller":"Verrouiller"}">${icon(layer.locked?"lock":"unlock")}</button><button type="button" data-layer-up="${layer.id}" ${index === state.layers.length - 1 ? "disabled" : ""} title="Monter" aria-label="Monter le calque">↑</button><button type="button" data-layer-down="${layer.id}" ${index === 0 ? "disabled" : ""} title="Descendre" aria-label="Descendre le calque">↓</button><button type="button" data-layer-delete="${layer.id}" title="Supprimer" aria-label="Supprimer le calque">${icon("trash")}</button></div>
      </div>`;
    }).join("");
    layerList.innerHTML = `${items}<div class="image-layer image-layer-base"><span class="image-layer-eye">${icon("image")}</span><div class="image-layer-main"><strong>Fond</strong><small>Toile du document</small></div><div></div></div>`;
  }

  function selectLayer(id) {
    setSelection(id?[id]:[],id);
  }

  function deleteSelected() {
    const ids=new Set(activeSelectionIds());
    const removable=state.layers.filter(l=>ids.has(l.id)&&!l.locked).map(l=>l.id);
    if(!removable.length){if(ids.size)toast("Déverrouillez ce calque pour le supprimer.");return;}
    const removeSet=new Set(removable);
    state.layers=state.layers.filter(l=>!removeSet.has(l.id));
    const kept=state.layers.filter(l=>ids.has(l.id)).map(l=>l.id);
    state.selectedIds=kept;state.selectedId=kept.at(-1)||null;
    renderAll();renderLayerList();renderSelectionOptions();pushHistory();
  }

  function ratioValue() {
    if (state.settings.cropRatio === "free") return 0;
    const value = Number(state.settings.cropRatio);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  function cropPointFromStart(start, current) {
    const ratio=ratioValue();if(!ratio)return current;
    let dx=current.x-start.x,dy=current.y-start.y;
    const sx=Math.sign(dx)||1,sy=Math.sign(dy)||1;
    if(Math.abs(dx/(dy||1))>ratio)dy=Math.abs(dx)/ratio*sy;else dx=Math.abs(dy)*ratio*sx;
    const roomX=sx>0?state.width-start.x:start.x,roomY=sy>0?state.height-start.y:start.y;
    const scale=Math.min(1,Math.abs(dx)>0?roomX/Math.abs(dx):1,Math.abs(dy)>0?roomY/Math.abs(dy):1);
    return{x:start.x+dx*scale,y:start.y+dy*scale};
  }

  function createDraft(type, start) {
    const base = { id: uid("draft"), type, visible: true, opacity: state.settings.opacity, color: state.settings.color, width: state.settings.width };
    if (["brush","highlight","eraser"].includes(type)) {
      return { ...base, points: [start], opacity: type === "highlight" ? Math.min(.32, state.settings.opacity) : type === "eraser" ? 1 : state.settings.opacity, width: type === "highlight" ? Math.max(14, state.settings.width * 2.4) : type === "eraser" ? Math.max(12, state.settings.width * 1.8) : state.settings.width };
    }
    if (["line","arrow","rect","ellipse","blur","v17-redact"].includes(type)) return { ...base, x1:start.x,y1:start.y,x2:start.x,y2:start.y, fill: state.settings.fill, blur: state.settings.blur, redactColor:v17RedactionColor };
    return base;
  }

function onPointerDown(event) {
    if(!state.hasDocument||busy||event.button>0)return;
    const p=pointFromEvent(event),point={x:clamp(p.x,0,state.width),y:clamp(p.y,0,state.height)};
    overlay.setPointerCapture?.(event.pointerId);event.preventDefault();
    if(state.tool.startsWith('v16-select-')){
      const kind=state.tool.slice('v16-select-'.length);
      if(kind==='color'){
        try{const found=maskEngine.fromColor(canvas,point.x,point.y,selectionTolerance,selectionContiguous);pixelSelection=maskEngine.compose(pixelSelection,found,selectionMode);renderOverlay();renderToolOptions();}
        catch(error){toast(error.message||'Sélection impossible.',4500);}
        return;
      }
      selectionDraft={kind,points:[point,point]};state.interaction={type:'v16-select'};renderOverlay();return;
    }
    if(state.tool==='v16-mask-brush'){beginMaskPaint(point);return;}
    if(state.tool==="hand"||state.spacePan){state.interaction={type:"pan",x:event.clientX,y:event.clientY,left:stage.scrollLeft,top:stage.scrollTop};return;}
    if(state.tool==="eyedropper"){const c=ctx.getImageData(clamp(Math.floor(point.x),0,state.width-1),clamp(Math.floor(point.y),0,state.height-1),1,1).data;state.settings.color="#"+[...c].slice(0,3).map(v=>v.toString(16).padStart(2,"0")).join("");renderToolOptions();toast(`Couleur : ${state.settings.color}`);return;}
    if(state.tool==="marquee"){state.marquee={x1:point.x,y1:point.y,x2:point.x,y2:point.y};state.interaction={type:"marquee",start:point};renderOverlay();return;}
    if(state.tool==="select"){
      const current=selectedLayer(),box=layerBounds(current);
      if(current?.type==="image"&&!current.locked&&box){const corners=[[box.x,box.y],[box.x+box.w,box.y],[box.x,box.y+box.h],[box.x+box.w,box.y+box.h]],index=corners.findIndex(([x,y])=>Math.hypot(p.x-x,p.y-y)<10/state.zoom);if(index>=0){state.interaction={type:"image-size",original:deepClone(current),box,index,anchor:corners[3-index]};return;}}
      const layer=hitLayer(point);
      if(event.ctrlKey||event.metaKey||event.shiftKey){if(layer)toggleSelection(layer.id);return;}
      if(layer){
        const ids=activeSelectionIds();if(!ids.includes(layer.id))setSelection([layer.id],layer.id);
        const selected=selectedLayers({unlocked:true}),originals=selected.map(l=>({id:l.id,layer:deepClone(l)}));
        state.interaction={type:"move-many",start:p,originals,bounds:unionBounds(selected),moved:false};
      } else {setSelection([]);state.interaction=null;}
      renderOverlay();return;
    }
    if(state.tool==="crop"){
      const r=state.crop&&normalizedRect(state.crop.x1,state.crop.y1,state.crop.x2,state.crop.y2);
      if(r&&point.x>r.x&&point.x<r.x+r.w&&point.y>r.y&&point.y<r.y+r.h)state.interaction={type:"crop-move",start:point,original:r};
      else{state.crop={x1:point.x,y1:point.y,x2:point.x,y2:point.y};state.interaction={type:"crop",start:point};}
      renderOverlay();renderToolOptions();return;
    }
    if(state.tool==="v17-callout"){
      const layer={id:uid(),type:"v17-callout",visible:true,locked:false,opacity:1,x:point.x,y:point.y,
        number:state.nextNumber++,note:v17Note.slice(0,150),color:state.settings.color,radius:state.settings.numberSize||24};
      state.layers.push(layer);setSelection([layer.id],layer.id,{keepTool:true});pushHistory();refreshLayers();return;
    }
    if(state.tool==="text"||state.tool==="number"){
      const layer=state.tool==="text"?{id:uid(),type:"text",visible:true,opacity:state.settings.opacity,color:state.settings.color,x:point.x,y:point.y,text:state.settings.text||"Texte",fontSize:state.settings.fontSize,fontWeight:state.settings.fontWeight,fontFamily:state.settings.fontFamily,fontStyle:state.settings.fontStyle,textAlign:state.settings.textAlign,lineHeight:state.settings.lineHeight,letterSpacing:state.settings.letterSpacing,strokeWidth:state.settings.strokeWidth,strokeColor:state.settings.strokeColor,shadowBlur:state.settings.shadowBlur,shadowColor:state.settings.shadowColor,shadowOffsetX:state.settings.shadowOffsetX,shadowOffsetY:state.settings.shadowOffsetY,rotation:0,mirrorX:false}:{id:uid(),type:"number",visible:true,opacity:1,color:state.settings.color,x:point.x,y:point.y,radius:state.settings.numberSize,number:state.nextNumber++,rotation:0,mirrorX:false};
      state.layers.push(layer);state.selectedId=layer.id;pushHistory();if(state.tool==="text")setTool("select");refreshLayers();return;
    }
    state.draftLayer=createDraft(state.tool,point);state.interaction={type:"draw",start:point};renderOverlay();
  }

function onPointerMove(event) {
    if(!state.hasDocument||!state.interaction)return;const i=state.interaction,p=pointFromEvent(event),point={x:clamp(p.x,0,state.width),y:clamp(p.y,0,state.height)};
    if(i.type==='v16-select'){
      if(selectionDraft){if(selectionDraft.kind==='lasso'){const previous=selectionDraft.points.at(-1);if(Math.hypot(point.x-previous.x,point.y-previous.y)>.8)selectionDraft.points.push(point);}else selectionDraft.points[1]=point;renderOverlay();}return;
    }
    if(i.type==='v16-mask-paint'){
      const layer=state.layers.find(l=>l.id===i.layerId),dim=imageDimensions(layer);if(layer&&dim&&maskDraftCanvas){const local=maskEngine.pointToLocal(point,layer,dim.w,dim.h);maskEngine.stroke(maskDraftCanvas,i.last,local,i.diam,maskBrushShow);i.last=local;clearMaskedCache();renderAll();}return;
    }
    if(i.type==="pan"){stage.scrollLeft=i.left-(event.clientX-i.x);stage.scrollTop=i.top-(event.clientY-i.y);return;}
    if(i.type==="move-many"){
      const rawX=p.x-i.start.x,rawY=p.y-i.start.y;
      const snap=snappingOffset(i.bounds,rawX,rawY,i.originals.map(o=>o.id));
      for(const item of i.originals){const l=state.layers.find(l=>l.id===item.id);if(!l)continue;
        Object.keys(l).forEach(k=>delete l[k]);Object.assign(l,deepClone(item.layer));
        translateLayer(l,snap.dx,snap.dy);
      }
      i.moved ||= Math.abs(rawX)+Math.abs(rawY)>.25;
      renderAll();return;
    }
    if(i.type==="image-size"){
      const l=selectedLayer(),o=i.original,b=i.box,[ax,ay]=i.anchor,sx=i.index%2?1:-1,sy=i.index>1?1:-1;
      const scale=clamp(((p.x-ax)*sx*b.w+(p.y-ay)*sy*b.h)/(b.w*b.w+b.h*b.h),.01,100);
      l.w=Math.max(1,o.w*scale);l.h=Math.max(1,o.h*scale);const cx=ax+sx*b.w*scale/2,cy=ay+sy*b.h*scale/2;l.x=cx-l.w/2;l.y=cy-l.h/2;i.moved=true;renderAll();return;
    }
    if(i.type==="crop-move"){const r=i.original,x=clamp(r.x+point.x-i.start.x,0,state.width-r.w),y=clamp(r.y+point.y-i.start.y,0,state.height-r.h);state.crop={x1:x,y1:y,x2:x+r.w,y2:y+r.h};renderOverlay();return;}
    if(i.type==="crop"||i.type==="marquee"){const a=i.type==="crop"?cropPointFromStart(i.start,point):point,r=i.type==="crop"?state.crop:state.marquee;r.x2=a.x;r.y2=a.y;renderOverlay();return;}
    if(i.type==="draw"&&state.draftLayer){if(["brush","highlight","eraser"].includes(state.draftLayer.type)){const last=state.draftLayer.points.at(-1);if(!last||Math.hypot(point.x-last.x,point.y-last.y)>Math.max(.3,1/state.zoom))state.draftLayer.points.push(point);}else{state.draftLayer.x2=point.x;state.draftLayer.y2=point.y;}renderOverlay();}
  }

function onPointerUp(event) {
    const i=state.interaction;if(!i)return;
    if(i.type==='v16-select'&&selectionDraft){if(event.type==='pointercancel'){selectionDraft=null;renderOverlay();}else{const d=selectionDraft;commitPixelSelection(d.kind,d.points);}}
    if(i.type==='v16-mask-paint'){state.interaction=null;if(event.type==='pointercancel'){maskDraftCanvas=null;maskDraftLayer=null;renderAll();}else void finishMaskPaint(i);try{overlay.releasePointerCapture?.(event.pointerId);}catch(_){}return;}
    if(["move-many","image-size"].includes(i.type)&&i.moved)pushHistory();
    state.snapLines=[];
    if(i.type==="draw"&&state.draftLayer){const l=state.draftLayer,box=layerBounds(l);if(box&&(box.w>1||box.h>1)){l.id=uid();state.layers.push(l);state.selectedId=l.id;pushHistory();}}
    state.interaction=null;state.draftLayer=null;refreshLayers();renderToolOptions();
    try{overlay.releasePointerCapture?.(event.pointerId);}catch(_){}
  }

  async function applyCrop() {
    if (!state.crop || busy) return;
    const r = normalizedRect(state.crop.x1, state.crop.y1, state.crop.x2, state.crop.y2);
    const x = clamp(Math.round(r.x), 0, state.width - 1), y = clamp(Math.round(r.y), 0, state.height - 1);
    const w = clamp(Math.round(r.w), 1, state.width - x), h = clamp(Math.round(r.h), 1, state.height - y);
    if (w < 1 || h < 1) return;
    setBusy(true, "Recadrage…");
    try {
      const source = document.createElement("canvas"); source.width = w; source.height = h;
      source.getContext("2d").drawImage(state.baseImage, x, y, w, h, 0, 0, w, h);
      const asset = await registerAssetFromCanvas(source);
      state.assetId = asset.id; state.baseImage = asset.image; state.width = w; state.height = h;
      state.layers.forEach((layer) => translateLayer(layer, -x, -y));
      state.crop = null; state.marquee=null; state.selectedId = null;
      resizeCanvases(); renderAll(); renderLayerList(); renderToolOptions(); updateStatus(); pushHistory(); fitZoom();
    } catch (_) { toast("Le recadrage n’a pas pu être appliqué."); }
    finally { setBusy(false); }
  }


  function a4TargetSize() {
    const dpi = clamp(Number($("[data-a4-dpi]")?.value || 200), 72, 600);
    const portrait = $("[data-a4-orientation]")?.value !== "landscape";
    let width = Math.round((210 / 25.4) * dpi);
    let height = Math.round((297 / 25.4) * dpi);
    if (!portrait) [width, height] = [height, width];
    return { width, height, dpi, portrait };
  }

  function a4Placement() {
    if (!state.hasDocument) return null;
    const target = a4TargetSize();
    const mode = $("[data-a4-mode]")?.value || "contain";
    const userScale = clamp(Number($("[data-a4-scale]")?.value || 100), 30, 250) / 100;
    const xPct = clamp(Number($("[data-a4-x]")?.value || 0), -100, 100) / 100;
    const yPct = clamp(Number($("[data-a4-y]")?.value || 0), -100, 100) / 100;
    const contain = Math.min(target.width / state.width, target.height / state.height);
    const cover = Math.max(target.width / state.width, target.height / state.height);
    const baseScale = mode === "cover" ? cover : contain;
    const scale = baseScale * userScale;
    const w = state.width * scale, h = state.height * scale;
    const x = (target.width - w) / 2 + xPct * target.width * .42;
    const y = (target.height - h) / 2 + yPct * target.height * .42;
    return { ...target, mode, scale, x, y, w, h };
  }

  function updateA4Preview() {
    if (!state.hasDocument || !a4Dialog?.open) return;
    const preview = $("[data-a4-preview]");
    const pctx = preview.getContext("2d", { alpha: true });
    const place = a4Placement();
    const bg = $("[data-a4-background]")?.value || "white";
    const maxW = 260, maxH = 360;
    const ratio = Math.min(maxW / place.width, maxH / place.height);
    preview.width = Math.max(1, Math.round(place.width * ratio));
    preview.height = Math.max(1, Math.round(place.height * ratio));
    pctx.clearRect(0, 0, preview.width, preview.height);
    if (bg === "white") { pctx.fillStyle = "#fff"; pctx.fillRect(0, 0, preview.width, preview.height); }
    pctx.save();
    pctx.scale(ratio, ratio);
    drawDocument();
    pctx.drawImage(canvas, place.x, place.y, place.w, place.h);
    pctx.restore();
    $("[data-a4-scale-output]").textContent = `${Math.round(Number($("[data-a4-scale]").value))} %`;
    $("[data-a4-x-output]").textContent = `${Math.round(Number($("[data-a4-x]").value))} %`;
    $("[data-a4-y-output]").textContent = `${Math.round(Number($("[data-a4-y]").value))} %`;
    $("[data-a4-summary]").textContent = `A4 ${place.portrait ? "portrait" : "paysage"} · ${place.width} × ${place.height} px · ${place.dpi} dpi · ${place.mode === "cover" ? "image couvrante" : place.mode === "free" ? "placement libre" : "image contenue"}`;
  }

  function openA4Dialog() {
    if (!state.hasDocument) { toast("Ouvrez d’abord une image."); return; }
    $("[data-a4-scale]").value = 100;
    $("[data-a4-x]").value = 0;
    $("[data-a4-y]").value = 0;
    a4Dialog.showModal();
    requestAnimationFrame(updateA4Preview);
  }

  async function applyA4() {
    if (!state.hasDocument || busy) return;
    const place = a4Placement();
    const bg = $("[data-a4-background]")?.value || "white";
    setBusy(true, "Mise en page A4…");
    try {
      const source = document.createElement("canvas");
      source.width = place.width; source.height = place.height;
      const sctx = source.getContext("2d", { alpha: true });
      if (bg === "white") { sctx.fillStyle = "#fff"; sctx.fillRect(0, 0, source.width, source.height); }
      sctx.imageSmoothingEnabled = true; sctx.imageSmoothingQuality = "high";
      sctx.save();
      sctx.drawImage(state.baseImage, place.x, place.y, place.w, place.h);
      sctx.restore();
      const transformedLayers = deepClone(state.layers);
      transformedLayers.forEach((layer) => { scaleLayer(layer, place.scale, place.scale); translateLayer(layer, place.x, place.y); });
      const asset = await registerAssetFromCanvas(source);
      state.assetId = asset.id; state.baseImage = asset.image;
      state.width = place.width; state.height = place.height;
      state.layers = transformedLayers;
      state.crop = null; state.selectedId = null;
      syncAdjustmentControls(); resizeCanvases(); renderAll(); renderLayerList(); renderToolOptions(); updateStatus(); pushHistory(); fitZoom();
      saveActiveDocument();
      toast(`Format A4 appliqué : ${place.width} × ${place.height} px.`);
    } catch (_) { toast("La mise en page A4 n’a pas pu être appliquée."); }
    finally { setBusy(false); }
  }

  async function resizeDocument(width, height) {
    if (!state.hasDocument || busy) return;
    width = clamp(Math.round(width), 1, 12000); height = clamp(Math.round(height), 1, 12000);
    if (width === state.width && height === state.height) return;
    setBusy(true, "Redimensionnement…");
    try {
      const sx = width / state.width, sy = height / state.height;
      const source = document.createElement("canvas"); source.width = width; source.height = height;
      const sctx = source.getContext("2d"); sctx.imageSmoothingEnabled = true; sctx.imageSmoothingQuality = "high"; sctx.drawImage(state.baseImage, 0, 0, width, height);
      const asset = await registerAssetFromCanvas(source);
      state.layers.forEach((layer) => scaleLayer(layer, sx, sy));
      state.assetId = asset.id; state.baseImage = asset.image; state.width = width; state.height = height; state.crop = null;
      resizeCanvases(); renderAll(); renderLayerList(); renderToolOptions(); updateStatus(); pushHistory(); fitZoom();
    } finally { setBusy(false); }
  }

  async function rotateDocument() {
    if (!state.hasDocument || busy) return;
    setBusy(true, "Rotation…");
    try {
      const oldWidth = state.width, oldHeight = state.height;
      const source = document.createElement("canvas"); source.width = oldHeight; source.height = oldWidth;
      const sctx = source.getContext("2d"); sctx.translate(oldHeight, 0); sctx.rotate(Math.PI / 2); sctx.drawImage(state.baseImage, 0, 0, oldWidth, oldHeight);
      const asset = await registerAssetFromCanvas(source);
      state.layers.forEach((layer) => rotateLayerClockwise(layer, oldHeight));
      state.assetId = asset.id; state.baseImage = asset.image; state.width = oldHeight; state.height = oldWidth; state.crop = null;
      resizeCanvases(); renderAll(); renderLayerList(); updateStatus(); pushHistory(); fitZoom();
    } finally { setBusy(false); }
  }

  async function flipDocument() {
    if (!state.hasDocument || busy) return;
    setBusy(true, "Retournement…");
    try {
      const source = document.createElement("canvas"); source.width = state.width; source.height = state.height;
      const sctx = source.getContext("2d"); sctx.translate(state.width, 0); sctx.scale(-1, 1); sctx.drawImage(state.baseImage, 0, 0, state.width, state.height);
      const asset = await registerAssetFromCanvas(source);
      state.layers.forEach((layer) => flipLayerHorizontal(layer, state.width));
      state.assetId = asset.id; state.baseImage = asset.image; state.crop = null;
      renderAll(); renderLayerList(); pushHistory();
    } finally { setBusy(false); }
  }

  function setZoom(value, keepCenter = true, anchor = null) {
    if (!state.hasDocument) return;
    const old = state.zoom;
    value = clamp(value, .04, 32);
    if (Math.abs(value - old) < .001) return;
    const oldRect=canvasStack.getBoundingClientRect();
    const normalized=anchor?{
      x:(anchor.x-oldRect.left)/Math.max(1,oldRect.width),
      y:(anchor.y-oldRect.top)/Math.max(1,oldRect.height)
    }:null;
    const centerX = stage.scrollLeft + stage.clientWidth / 2;
    const centerY = stage.scrollTop + stage.clientHeight / 2;
    const ratio = value / old;
    state.zoom = value; updateCanvasCssSize();
    if (keepCenter) requestAnimationFrame(() => {
      if(normalized){
        const next=canvasStack.getBoundingClientRect();
        stage.scrollLeft += (next.left+normalized.x*next.width-anchor.x);
        stage.scrollTop += (next.top+normalized.y*next.height-anchor.y);
      } else {
        stage.scrollLeft=centerX*ratio-stage.clientWidth/2;
        stage.scrollTop=centerY*ratio-stage.clientHeight/2;
      }
    });
    renderOverlay();
  }

  function fitZoom() {
    if (!state.hasDocument || !stage.clientWidth || !stage.clientHeight) return;
    const pad = window.innerWidth <= 620 ? 42 : 92;
    const availableW = Math.max(80, stage.clientWidth - pad), availableH = Math.max(80, stage.clientHeight - pad);
    const value = Math.min(8, availableW / state.width, availableH / state.height);
    state.zoom = clamp(value, .04, 8);
    updateCanvasCssSize();
    requestAnimationFrame(() => { stage.scrollLeft = Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2); stage.scrollTop = Math.max(0, (stage.scrollHeight - stage.clientHeight) / 2); });
    renderOverlay();
  }

  /* V14 : export PDF sans serveur, aperçu papier et calcul de résolution effective. */
  const production = () => window.PhilosophalProduction;
  const pdfOptions = () => ({
    paper: $('[data-pdf-paper]').value,
    orientation: $('[data-pdf-orientation]').value,
    fit: $('[data-pdf-fit]').value,
    margin: Number($('[data-pdf-margin]').value),
    quality: $('[data-pdf-quality]').value,
    dpi: Number($('[data-pdf-dpi]').value)
  });
  function updatePdfPreview() {
    if(!state.hasDocument || !$('[data-pdf-settings]'))return;
    $('[data-pdf-dpi]').disabled=$('[data-pdf-paper]').value!=='image';
    try{
      const p=production().previewPdf($('[data-pdf-preview]'),canvas,pdfOptions());
      const wmm=(p.pageWidth*25.4/72).toFixed(0), hmm=(p.pageHeight*25.4/72).toFixed(0);
      $('[data-pdf-resolution]').textContent=`${wmm} × ${hmm} mm · env. ${Math.round(p.effectiveDpi)} ppp réels`;
      $('[data-export-note]').textContent=`Image ${state.width} × ${state.height} px · ${Math.round(p.effectiveDpi)} ppp effectifs sur cette page.`;
    } catch(err) { $('[data-pdf-resolution]').textContent=err.message; }
  }
  function updateExportSummary() {
    if (!state.hasDocument) return;
    const format=$('[data-export-format]').value;
    const pdf=format==='application/pdf';
    const pdfPanel=$('[data-pdf-settings]'); if(pdfPanel) pdfPanel.hidden=!pdf;
    $('[data-export-quality]').closest('label').hidden=pdf;
    $('[data-export-maxwidth]').closest('label').hidden=pdf;
    $('[data-export-presets]')?.toggleAttribute('hidden',pdf);
    $('.image-export-presets')?.toggleAttribute('hidden',pdf);
    $('[data-raster-preset]')?.toggleAttribute('hidden',pdf);
    if(pdf){
      $('[data-export-summary]').textContent=`PDF · ${state.width} × ${state.height} px · 1 page`;
      drawDocument();updatePdfPreview();return;
    }
    const maxWidth = Number($('[data-export-maxwidth]')?.value || 0);
    const width = maxWidth > 0 && state.width > maxWidth ? Math.round(maxWidth) : state.width;
    const height = Math.round(state.height * (width / state.width));
    const quality = Number($('[data-export-quality]')?.value || 82);
    const label = format === 'image/png' ? 'PNG' : format === 'image/jpeg' ? 'JPG' : 'WebP';
    $('[data-export-summary]').textContent = `${width} × ${height} px · ${label}${format === 'image/png' ? '' : ` · ${quality} %`}`;
    $('[data-export-quality]').disabled = format === 'image/png';
    $('[data-export-quality-label]').textContent = format === 'image/png' ? 'sans perte' : `${quality} %`;
    $('[data-export-note]').textContent='Le traitement reste local.';
  }
  function downloadBlob(blob,name) {
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download=name;
    document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  async function exportImage() {
    if (!state.hasDocument || busy) return;
    const format = $('[data-export-format]').value;
    const quality = Number($('[data-export-quality]').value) / 100;
    const maxWidth = Number($('[data-export-maxwidth]').value || 0);
    const name = fileBaseName($('[data-export-name]').value || state.name || 'image-philosophal');
    setBusy(true,format==='application/pdf'?'Création PDF…':'Export…');
    try {
      drawDocument(true);
      if(format==='application/pdf'){
        const result=await production().createPdf(canvas,pdfOptions());
        downloadBlob(result.blob,`${name}.pdf`);exportDialog.close();
        toast(`PDF exporté · ${(result.blob.size/1024/1024).toFixed(2)} Mo · 1 page`);return;
      }
      const width = maxWidth > 0 && state.width > maxWidth ? Math.round(maxWidth) : state.width;
      const height = Math.max(1, Math.round(state.height * (width / state.width)));
      const out=document.createElement('canvas');out.width=width;out.height=height;
      const outCtx=out.getContext('2d');
      if(format==='image/jpeg'){outCtx.fillStyle='#fff';outCtx.fillRect(0,0,width,height);}
      outCtx.imageSmoothingEnabled=state.settings.smoothing!==false;outCtx.imageSmoothingQuality='high';
      outCtx.drawImage(canvas,0,0,width,height);
      const blob=await canvasToBlob(out,format,format==='image/png'?undefined:quality);
      const ext=format==='image/png'?'png':format==='image/jpeg'?'jpg':'webp';
      downloadBlob(blob,`${name}.${ext}`);exportDialog.close();
      toast(`Image exportée · ${(blob.size/1024).toFixed(blob.size>1024*1024?0:1)} Ko`);
    }catch(error){console.error('Export V14',error);toast(error?.message||'L’export n’a pas pu être créé.',5000);}
    finally{setBusy(false);}
  }
  function openExportDialog() {
    if(!state.hasDocument){toast('Ouvrez d’abord une image.');return;}
    $('[data-export-name]').value=state.name||'image-philosophal';
    updateExportSummary();exportDialog.showModal();
  }

  /* V14 — compositions 100 % éditables (rectangles + textes sur calques). */
  const templateDefinitions={
    editorial:{w:1080,h:1350,bg:'#191725',name:'Éditorial Philosophal',items:[
      {type:'rect',x1:68,y1:80,x2:190,y2:88,fill:'#9f8cf2',color:'#9f8cf2'},
      {type:'text',x:70,y:120,text:'PHILOSOPHAL / ESSAIS',fontSize:25,fontWeight:700,fontFamily:'Inter',letterSpacing:4,color:'#bcb0fb'},
      {type:'text',x:68,y:360,text:'Une idée.\nUn vertige.',fontSize:112,fontWeight:700,fontFamily:'Editorial',lineHeight:1.04,color:'#f7f4ff'},
      {type:'rect',x1:70,y1:1034,x2:1010,y2:1038,fill:'#8d7ada',color:'#8d7ada'},
      {type:'text',x:70,y:1090,text:'01   —   CHERCHER. DISCERNER. TRANSMETTRE.',fontSize:25,fontWeight:600,color:'#e2dcf0'}]},
    lesson:{w:1240,h:1754,bg:'#faf9ff',name:'Fiche pédagogique',items:[
      {type:'rect',x1:0,y1:0,x2:1240,y2:22,fill:'#7563dc',color:'#7563dc'},
      {type:'text',x:92,y:110,text:'PHILOSOPHAL  /  RESSOURCES',fontSize:29,fontWeight:700,letterSpacing:3,color:'#7563dc'},
      {type:'text',x:90,y:270,text:'Penser\nlibrement',fontSize:124,fontWeight:700,fontFamily:'Editorial',lineHeight:1.08,color:'#202033'},
      {type:'rect',x1:90,y1:590,x2:1150,y2:596,fill:'#d8cfff',color:'#d8cfff'},
      {type:'text',x:92,y:675,text:'NOTIONS   /   AUTEURS   /   MÉTHODES',fontSize:30,fontWeight:700,letterSpacing:2,color:'#7563dc'},
      {type:'text',x:92,y:780,text:'Idée principale :\n\nArgument :\n\nExemple :\n\nCe qu’il faut retenir :',fontSize:49,fontWeight:400,fontFamily:'Inter',lineHeight:1.6,color:'#353549'},
      {type:'text',x:92,y:1645,text:'PHILOSOPHAL.FR    ·    FICHE DE TRAVAIL',fontSize:23,fontWeight:600,color:'#827e98'}]},
    vertical:{w:1080,h:1920,bg:'#101019',name:'Vidéo verticale',items:[
      {type:'rect',x1:70,y1:160,x2:1010,y2:171,fill:'#856bf0',color:'#856bf0'},
      {type:'text',x:78,y:235,text:'PHILOSOPHIE DE L’AMOUR',fontSize:29,fontWeight:700,letterSpacing:2,color:'#b5a4f8'},
      {type:'text',x:70,y:650,text:'L’AMOUR\nEST-IL\nUN CHOIX ?',fontSize:122,fontWeight:700,fontFamily:'Editorial',lineHeight:1.16,color:'#f9f7ff'},
      {type:'rect',x1:70,y1:1560,x2:1010,y2:1568,fill:'#856bf0',color:'#856bf0'},
      {type:'text',x:78,y:1600,text:'PHILOSOPHAL   /   ÉPISODE 001',fontSize:33,fontWeight:600,color:'#dad3f7'}]},
    duality:{w:1280,h:720,bg:'#191820',name:'Musique et mystique',items:[
      {type:'rect',x1:0,y1:0,x2:640,y2:720,fill:'#e8e0fa',color:'#e8e0fa'},
      {type:'text',x:80,y:90,text:'MUSIQUE  ×  MYSTIQUE',fontSize:28,fontWeight:700,color:'#504369'},
      {type:'text',x:85,y:262,text:'VIA\nPOSITIVA',fontSize:91,fontWeight:700,fontFamily:'Editorial',lineHeight:1.07,color:'#353047'},
      {type:'text',x:735,y:262,text:'VIA\nNEGATIVA',fontSize:91,fontWeight:700,fontFamily:'Editorial',lineHeight:1.07,color:'#f0eafd'},
      {type:'text',x:85,y:638,text:'PHILOSOPHAL   /   TRANSCENDANCE',fontSize:24,fontWeight:700,color:'#504369'}]}
  };
  function layerFromTemplate(item){
    return {id:uid(),opacity:1,visible:true,locked:false,width:1,rotation:0,fontStyle:'normal',textAlign:'left',letterSpacing:0,lineHeight:1.2,fontFamily:'Inter',...item,
      name:item.type==='text'?(item.text.replace(/\\n/g,' ').slice(0,42)):('Forme '+String(item.fill||''))};
  }
  async function createTemplate(key){
    const tpl=templateDefinitions[key];if(!tpl||busy)return;
    $('[data-v14-templates-dialog]').close();
    await createBlank(tpl.w,tpl.h,'transparent');
    const background={type:'rect',x1:0,y1:0,x2:tpl.w,y2:tpl.h,color:tpl.bg,fill:tpl.bg,width:1};
    state.layers=[background,...tpl.items].map(layerFromTemplate);
    // Convert escaped newlines to real newlines for text editor.
    state.layers.forEach(l=>{if(l.type==='text')l.text=l.text.replace(/\\n/g,'\n');});
    state.name=tpl.name;state.selectedId=null;state.selectedIds=[];
    refreshLayers();renderToolOptions();updateStatus();resetHistory();saveActiveDocument();
    fitZoom();toast('Modèle créé : chaque élément reste modifiable.');
  }
  /* V14 — conversion de fichiers distincts sans toucher aux projets ouverts. */
  let batchFiles=[],batchRunning=false,batchCancelled=false;
  const batchDialog=$('[data-v14-batch-dialog]');
  const batchStatus=(msg)=>{const node=$('[data-v14-batch-status]');if(node)node.textContent=msg;};
  const updateBatchPicked=()=>{
    const el=$('[data-v14-batch-picked]');
    const size=batchFiles.reduce((n,f)=>n+f.size,0);
    el.textContent=batchFiles.length ? `${batchFiles.length} image(s) · ${(size/1024/1024).toFixed(1)} Mo · ${batchFiles.slice(0,3).map(f=>f.name).join(' · ')}${batchFiles.length>3?'…':''}` : 'Aucune image sélectionnée.';
  };
  function batchReady(){
    const size=batchFiles.reduce((n,f)=>n+f.size,0);
    if(!batchFiles.length)throw new Error('Sélectionnez au moins une image.');
    if(batchFiles.length>40)throw new Error('Limite de 40 images par lot.');
    if(size>150*1024*1024)throw new Error('Le lot dépasse 150 Mo. Divisez-le en plusieurs archives.');
    for(const f of batchFiles){if(!/\.(png|jpe?g|webp)$/i.test(f.name)&&!['image/png','image/jpeg','image/webp'].includes(f.type))throw new Error(`Format non pris en charge : ${f.name}`);}
  }
  async function decodeBatchFile(file){
    if(typeof createImageBitmap==='function')return await createImageBitmap(file);
    const url=URL.createObjectURL(file);
    try{const img=new Image();img.src=url;await img.decode();return img;}
    finally{URL.revokeObjectURL(url);}
  }
  async function runBatch(e){
    e.preventDefault();if(batchRunning)return;
    try{batchReady();}catch(err){batchStatus(err.message);$('[data-v14-batch-progress]').hidden=false;return;}
    batchRunning=true;batchCancelled=false;
    $('[data-v14-batch-run]').disabled=true;$('[data-v14-batch-close]').disabled=true;
    $('[data-v14-batch-stop]').hidden=false;$('[data-v14-batch-progress]').hidden=false;
    const meter=$('[data-v14-batch-meter]');meter.value=0;
    const format=$('[data-v14-batch-format]').value,quality=Number($('[data-v14-batch-quality]').value)/100;
    const maxWidth=Number($('[data-v14-batch-width]').value)||0;
    const ext=format==='image/jpeg'?'jpg':format==='image/png'?'png':'webp';
    const output=[];let failures=[];let outputBytes=0;const used=new Map();
    try{
      for(let i=0;i<batchFiles.length;i++){
        if(batchCancelled)break;
        const file=batchFiles[i];batchStatus(`Image ${i+1} / ${batchFiles.length} · ${file.name}`);
        await new Promise(resolve=>setTimeout(resolve,0));
        let img;
        try{
          img=await decodeBatchFile(file);
          const iw=img.width,ih=img.height;
          if(!iw||!ih||iw*ih>90_000_000)throw new Error('Dimensions trop élevées');
          const w=maxWidth>0?Math.min(iw,Math.round(maxWidth)):iw,h=Math.max(1,Math.round(ih*w/iw));
          const work=document.createElement('canvas');work.width=w;work.height=h;
          const cx=work.getContext('2d');if(!cx)throw new Error('Mémoire insuffisante');
          if(format==='image/jpeg'){cx.fillStyle='#fff';cx.fillRect(0,0,w,h);}
          cx.imageSmoothingQuality='high';cx.drawImage(img,0,0,w,h);
          const blob=await canvasToBlob(work,format,format==='image/png'?undefined:quality);
          if(outputBytes+blob.size>250*1024*1024)throw new Error('Limite de 250 Mo en sortie : répartissez vos images en lots plus petits');
          outputBytes+=blob.size;
          const base=file.name.replace(/\.[^.]*$/,'').replace(/[\\/\u0000-\u001f]/g,'_').slice(0,100)||'image';
          const occurrence=used.get(base)||0;used.set(base,occurrence+1);
          output.push({name:`${base}${occurrence?'_'+(occurrence+1):''}.${ext}`,blob});
          work.width=work.height=0;
        }catch(error){failures.push(`${file.name} : ${error.message}`);}
        finally{if(img?.close)img.close();}
        meter.value=Math.round((i+1)/batchFiles.length*100);
      }
      if(batchCancelled){batchStatus('Export arrêté. Aucun fichier incomplet n’a été téléchargé.');return;}
      if(!output.length)throw new Error('Aucune image ne peut être exportée.');
      batchStatus('Création de l’archive ZIP…');await new Promise(resolve=>setTimeout(resolve,0));
      const zip=await production().createZip(output);
      const filename=fileBaseName($('[data-v14-batch-name]').value||'images-philosophal');
      downloadBlob(zip,`${filename}.zip`);
      batchStatus(`${output.length} image(s) exportée(s) · ${(zip.size/1024/1024).toFixed(1)} Mo`+(failures.length?` · ${failures.length} échec(s) : ${failures.slice(0,2).join(' ; ')}`:''));
      toast(`Archive ZIP créée · ${output.length} images.`);
    }catch(error){console.error('Lot V14',error);batchStatus(error.message||'Le traitement a échoué.');}
    finally{batchRunning=false;$('[data-v14-batch-run]').disabled=false;$('[data-v14-batch-close]').disabled=false;$('[data-v14-batch-stop]').hidden=true;}
  }
  $('[data-v14-batch-files]').addEventListener('change',e=>{batchFiles=[...(e.target.files||[])];updateBatchPicked();});
  $('[data-v14-batch-form]').addEventListener('submit',runBatch);
  $('[data-v14-batch-quality]').addEventListener('input',e=>$('[data-v14-batch-quality-label]').textContent=`${e.target.value} %`);
  $('[data-v14-batch-stop]').addEventListener('click',()=>{batchCancelled=true;batchStatus('Arrêt demandé…');});
  batchDialog.addEventListener('cancel',e=>{if(batchRunning){e.preventDefault();batchCancelled=true;}});
  document.addEventListener('click',e=>{
    const btn=e.target.closest('button');if(!btn)return;
    if(btn.matches('[data-v14-templates]')){closeMobileSheet();$('[data-v14-templates-dialog]').showModal();return;}
    if(btn.matches('[data-v14-templates-close]')){$('[data-v14-templates-dialog]').close();return;}
    if(btn.matches('[data-v14-template]')){void createTemplate(btn.dataset.v14Template);return;}
    if(btn.matches('[data-v14-batch]')){closeMobileSheet();batchDialog.showModal();return;}
    if(btn.matches('[data-v14-batch-close]')&&!batchRunning){batchDialog.close();return;}
    if(btn.matches('[data-v14-batch-preset]')){
      const key=btn.dataset.v14BatchPreset;
      $('[data-v14-batch-width]').value=key==='web'?1600:key==='social'?2400:0;
      $('[data-v14-batch-format]').value=key==='original'?'image/png':key==='web'?'image/webp':'image/jpeg';
      $('[data-v14-batch-quality]').value=key==='web'?82:95;
      $('[data-v14-batch-quality]').dispatchEvent(new Event('input',{bubbles:true}));return;
    }
  });
  document.addEventListener('input',e=>{if(e.target.matches('[data-pdf-paper],[data-pdf-orientation],[data-pdf-fit],[data-pdf-margin],[data-pdf-quality],[data-pdf-dpi]'))updateExportSummary();});
  document.addEventListener('change',e=>{if(e.target.matches('[data-pdf-paper],[data-pdf-orientation],[data-pdf-fit],[data-pdf-margin],[data-pdf-quality],[data-pdf-dpi]'))updateExportSummary();});

  function openResizeDialog() {
    if (!state.hasDocument) { toast("Ouvrez d’abord une image."); return; }
    $("[data-resize-width]").value = state.width;
    $("[data-resize-height]").value = state.height;
    resizeDialog.dataset.ratio = String(state.width / state.height);
    resizeDialog.showModal();
  }

  function setInspectorTab(tab) {
    $$('[data-inspector-tab]').forEach((button) => { const active = button.dataset.inspectorTab === tab; button.classList.toggle("is-active", active); button.setAttribute("aria-selected", String(active)); });
    $$('[data-inspector-panel]').forEach((panel) => { const active = panel.dataset.inspectorPanel === tab; panel.hidden = !active; panel.classList.toggle("is-active", active); });
  }

  function openInspector(tab = "tool") { setInspectorTab(tab); document.body.classList.add("image-inspector-open"); }
  function closeInspector() { document.body.classList.remove("image-inspector-open"); }
  function openMobileSheet() { mobileSheet.hidden = false; }
  function closeMobileSheet() { mobileSheet.hidden = true; }

  function toggleFullscreen() {
    const active = !document.body.classList.contains("image-fullscreen");
    document.body.classList.toggle("image-fullscreen", active);
    $$('[data-fullscreen]').forEach((button) => button.setAttribute("aria-pressed", String(active)));
    if (active && document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else if (!active && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    setTimeout(fitZoom, 90);
  }

  function changeLayerOrder(id, direction) {
    const index = state.layers.findIndex((layer) => layer.id === id);
    if (index < 0) return;
    const target = index + direction;
    if (target < 0 || target >= state.layers.length) return;
    [state.layers[index], state.layers[target]] = [state.layers[target], state.layers[index]];
    renderAll(); renderLayerList(); pushHistory();
  }

  function changeSettingFromInput(input) {
    const key = input.dataset.settingRange;
    if (!key) return;
    const raw = Number(input.value);
    if (key === "opacity") state.settings.opacity = raw / 100;
    else state.settings[key] = raw;
    const output = $(`[data-setting-output="${key}"]`);
    if (output) output.textContent = `${round(raw)}${input.dataset.suffix || ""}`;
  }

  function applySelectedInput(target) {
    const layer = selectedLayer();
    if (!layer) return false;
    const key = target.dataset.settingRange || "";
    if (target.matches("[data-selected-text]")) layer.text = target.value;
    else if (key === "selectedFontSize") layer.fontSize = Number(target.value);
    else if (key === "selectedWidth") layer.width = Number(target.value);
    else if (key === "selectedRadius") layer.radius = Number(target.value);
    else if (key === "selectedBlur") layer.blur = Number(target.value);
    else if (key === "selectedOpacity") layer.opacity = Number(target.value) / 100;
    else return false;
    if (key) {
      const output = $(`[data-setting-output="${key}"]`);
      if (output) output.textContent = `${round(Number(target.value))}${target.dataset.suffix || ""}`;
    }
    renderAll(); renderLayerList(); return true;
  }

  document.addEventListener("click", (event) => {
    const closeHit = event.target.closest("[data-doc-close]");
    if (closeHit) { event.preventDefault(); event.stopPropagation(); closeDocument(closeHit.dataset.docClose); return; }
    const target = event.target.closest("button,a");
    if (!target) return;
    if (target.matches('[data-v16-apply-mask],[data-v16-create-mask]')){void applyMaskFromSelection(target.hasAttribute('data-v16-create-mask'));return;}
    if (target.matches('[data-v16-selection-action]')){openInspector('tool');return;}
    if (target.matches('[data-v16-edit-mask]')){setTool('v16-mask-brush');openInspector('tool');return;}
    if (target.matches('[data-v16-end-mask]')){setTool('select');return;}
    if (target.matches('[data-v16-invert-mask]')){void invertCurrentMask();return;}
    if (target.matches('[data-v16-remove-mask]')){removeMask();return;}
    if (target.matches('[data-v16-invert-selection]')){pixelSelection=pixelSelection?maskEngine.invert(pixelSelection):null;renderOverlay();renderToolOptions();return;}
    if (target.matches('[data-v16-clear-selection]')){pixelSelection=null;selectionDraft=null;renderOverlay();renderToolOptions();return;}
    if(target.matches('[data-v17-pick]')){v17Pick(target.dataset.v17Pick);return;}
    if(target.matches('[data-v17-palette]')){
      if(v17StyleColors.includes(target.dataset.v17Palette)){state.settings.color=target.dataset.v17Palette;renderToolOptions();}
      return;
    }
    if(target.matches('[data-v17-renumber]')){
      let number=1;state.layers.forEach(l=>{if(l.type==='number'||l.type==='v17-callout')l.number=number++;});
      state.nextNumber=number;refreshLayers();pushHistory();toast('Repères renumérotés dans l’ordre des calques.');return;
    }
    if (target.matches("[data-open-saved]")) { void showProjects(); return; }
    if (target.matches("[data-close-projects]")) { projectDialog.close(); return; }
    if (target.matches("[data-load-project]")) { void loadSavedProject(target.dataset.loadProject); return; }
    if (target.matches("[data-delete-project]")) { void deleteSavedProject(target.dataset.deleteProject); return; }
    if (target.matches("[data-project-download]")) { void downloadEditableProject(target.dataset.projectDownload); return; }
    if (target.matches("[data-download-project]")) { void downloadEditableProject(); return; }
    if (target.matches("[data-import-project]")) { projectFile.click(); return; }
    if (target.matches("[data-save-project]")) { void saveProjectNow(); return; }
    if (target.matches("[data-guide-toggle]")) {state.guidesEnabled=!state.guidesEnabled;target.classList.toggle("is-active",state.guidesEnabled);target.setAttribute("aria-pressed",String(state.guidesEnabled));renderOverlay();return;}
    if (target.matches("[data-snap-toggle]")) {state.snapEnabled=!state.snapEnabled;target.classList.toggle("is-active",state.snapEnabled);target.setAttribute("aria-pressed",String(state.snapEnabled));return;}
    if (target.matches("[data-align]")) {alignLayers(target.dataset.align);return;}
    if (target.matches("[data-distribute]")) {distributeLayers(target.dataset.distribute);return;}
    if (target.matches("[data-select-all-layers]")) {setSelection(state.layers.map(l=>l.id));return;}
    if (target.matches("[data-layer-clear-selection]")) {setSelection([]);return;}
    if (target.matches("[data-type-preset]")) {applyTypePreset(target.dataset.typePreset);return;}
    if (target.matches("[data-layer-rename]")) {renameLayer(target.dataset.layerRename);return;}
    if (target.matches("[data-toggle-tools]")) { togglePanel("tools"); return; }
    if (target.matches("[data-toggle-inspector]")) { togglePanel("inspector"); return; }
    if (target.closest(".image-more-popover")) { $("[data-more-menu]").open = false; }
    if (target.closest(".image-quickmore-panel")) { $("[data-quickmore]").open = false; }
    if (target.matches("[data-doc-tab]")) { loadDocumentRecord(target.dataset.docTab); return; }
    if (target.matches("[data-tab-add]")) { fileInput.click(); return; }
    if (target.matches("[data-open-image]")) fileInput.click();
    if (target.matches("[data-paste-image]")) pasteFromClipboard();
    if (target.matches("[data-new-image]")) newDialog.showModal();
    if (target.matches("[data-undo]")) undo();
    if (target.matches("[data-redo]")) redo();
    if (target.matches("[data-a4-image]")) openA4Dialog();
    if (target.matches("[data-resize-image]")) openResizeDialog();
    if (target.matches("[data-rotate-image]")) rotateDocument();
    if (target.matches("[data-flip-image]")) flipDocument();
    if (target.matches("[data-fullscreen]")) toggleFullscreen();
    if (target.matches("[data-export-image]")) openExportDialog();
    if (target.matches("[data-tool]")) setTool(target.dataset.tool);
    if (target.matches("[data-mobile-tool]")) setTool(target.dataset.mobileTool);
    if (target.matches("[data-mobile-more]")) openMobileSheet();
    if (target.matches("[data-close-mobile-sheet]")) closeMobileSheet();
    if (target.matches("[data-mobile-properties]")) { closeMobileSheet(); openInspector("tool"); }
    if (target.matches("[data-close-inspector]")) closeInspector();
    if (target.matches("[data-inspector-tab]")) setInspectorTab(target.dataset.inspectorTab);
    if (target.matches("[data-zoom-out]")) setZoom(state.zoom / 1.2);
    if (target.matches("[data-zoom-in]")) setZoom(state.zoom * 1.2);
    if (target.matches("[data-zoom-fit]")) fitZoom();
    if (target.matches("[data-zoom-value]")) setZoom(1);
    if (target.matches("[data-crop-ratio]")) { state.settings.cropRatio = target.dataset.cropRatio; renderToolOptions(); }
    if (target.matches("[data-apply-crop]")) applyCrop();
    if (target.matches("[data-cancel-crop]")) { state.crop = null; renderOverlay(); renderToolOptions(); }
    if (target.matches("[data-font-weight]")) { state.settings.fontWeight = Number(target.dataset.fontWeight); renderToolOptions(); }
    if (target.matches("[data-delete-selected]")) deleteSelected();
    if (target.matches("[data-select-layer]")) {
      if(event.ctrlKey||event.metaKey||event.shiftKey)toggleSelection(target.dataset.selectLayer,{range:event.shiftKey});
      else selectLayer(target.dataset.selectLayer);
    }
    if (target.matches("[data-layer-visibility]")) { const layer=state.layers.find(l=>l.id===target.dataset.layerVisibility); if(layer){layer.visible=layer.visible===false;renderAll();renderLayerList();pushHistory();} }
    if (target.matches("[data-layer-up]")) changeLayerOrder(target.dataset.layerUp, 1);
    if (target.matches("[data-layer-down]")) changeLayerOrder(target.dataset.layerDown, -1);
    if (target.matches("[data-layer-delete]")) { setSelection([target.dataset.layerDelete],target.dataset.layerDelete);deleteSelected(); }
    if (target.matches("[data-reset-adjustments]")) { state.adjust={ ...defaultAdjust };clearRetouchCache();syncAdjustmentControls();renderAll();pushHistory(); }
    if (target.matches("[data-v15-reset-group]")) {resetAdjustmentGroup(target.dataset.v15ResetGroup);}
    if (target.matches("[data-preset]")) {
      const preset=target.dataset.preset;
      const presets={
        clean:{contrast:106,vibrance:12,highlights:-8,shadows:8},
        soft:{contrast:94,shadows:12,highlights:-10,vibrance:-6},
        bw:{grayscale:100,contrast:112,blacks:-8},
        warm:{temperature:25,vibrance:8,highlights:-9},
        cool:{temperature:-12,shadows:-14,contrast:110,vibrance:-6},
        reset:{}
      };
      state.adjust={...defaultAdjust,...(presets[preset]||{})};
      clearRetouchCache();syncAdjustmentControls();renderAll();pushHistory();
    }
    if(target.matches("[data-export-preset]")){const preset=target.dataset.exportPreset;$("[data-export-format]").value=preset==="transparent"?"image/png":preset==="photo"?"image/jpeg":"image/webp";$("[data-export-quality]").value=preset==="photo"?92:82;$("[data-export-maxwidth]").value=preset==="web"?1600:0;updateExportSummary();}
    if (target.matches("[data-export-web]")) { $("[data-export-format]").value="image/webp";$("[data-export-quality]").value=82;$("[data-export-maxwidth]").value=1600;updateExportSummary(); }
    if (target.matches("[data-new-preset]")) { const [w,h]=target.dataset.newPreset.split("x");$("[data-new-width]").value=w;$("[data-new-height]").value=h;$("[data-export-format]").value=target.dataset.presetMime || "image/png"; }
  });

  const TYPE_KEYS = new Set(["fontFamily","fontWeight","fontStyle","textAlign","lineHeight","letterSpacing","strokeWidth","strokeColor","shadowBlur","shadowColor"]);
  function changeTypography(target){
    const key=target.dataset.typeSelected || target.dataset.typeSetting;
    if(!TYPE_KEYS.has(key))return false;
    const layer=target.dataset.typeSelected ? selectedLayer() : state.settings;
    if(!layer || (layer.locked&&target.dataset.typeSelected))return true;
    let val=target.value;
    if(["fontWeight","lineHeight","letterSpacing","strokeWidth","shadowBlur"].includes(key)){
      val=Number(val);if(!Number.isFinite(val))return true;
      const ranges={fontWeight:[400,900],lineHeight:[.75,3],letterSpacing:[-8,40],strokeWidth:[0,20],shadowBlur:[0,60]};val=clamp(val,...ranges[key]);
    }
    layer[key]=val;
    if(target.dataset.typeSelected){renderAll();renderLayerList();}
    return true;
  }
  function applyTypePreset(name){
    const styles={editorial:{fontFamily:"Editorial",fontWeight:700,fontStyle:"normal",textAlign:"left",letterSpacing:-1,lineHeight:1.08,strokeWidth:0,shadowBlur:0},video:{fontFamily:"Inter",fontWeight:900,fontStyle:"normal",textAlign:"center",letterSpacing:-.6,lineHeight:1.06,strokeWidth:2,strokeColor:"#111827",shadowBlur:4,shadowColor:"#111827"},minimal:{fontFamily:"Sans",fontWeight:400,fontStyle:"normal",textAlign:"left",letterSpacing:1.4,lineHeight:1.4,strokeWidth:0,shadowBlur:0}};
    const layer=state.tool==="text"?state.settings:(selectedLayer()?.type==="text"?selectedLayer():state.settings);
    if(layer.locked)return;Object.assign(layer,styles[name]||styles.minimal);
    if(layer!==state.settings){renderAll();pushHistory();renderSelectionOptions();}else renderToolOptions();
    toast("Style typographique appliqué.");
  }
  function renameLayer(id){
    const layer=state.layers.find(l=>l.id===id);if(!layer)return;
    const original=layer.customName||layerLabel(layer);
    const name=window.prompt("Nom du calque :",original);
    if(name===null)return;
    layer.customName=name.trim().slice(0,80)||undefined;
    renderLayerList();renderSelectionOptions();pushHistory();
  }
  let draggedLayerId=null;
  layerList.addEventListener("dragstart",e=>{
    const row=e.target.closest("[data-layer-id]");if(!row)return;
    draggedLayerId=row.dataset.layerId;e.dataTransfer.effectAllowed="move";
    e.dataTransfer.setData("text/plain",draggedLayerId);row.classList.add("is-dragging");
  });
  layerList.addEventListener("dragover",e=>{
    const row=e.target.closest("[data-layer-id]");if(!draggedLayerId||!row)return;
    e.preventDefault();e.dataTransfer.dropEffect="move";
    $$('[data-layer-id]',layerList).forEach(n=>n.classList.remove("is-drop-target"));
    row.classList.add("is-drop-target");
  });
  layerList.addEventListener("drop",e=>{
    e.preventDefault();const row=e.target.closest("[data-layer-id]");
    if(row&&draggedLayerId&&row.dataset.layerId!==draggedLayerId){
      const from=state.layers.findIndex(l=>l.id===draggedLayerId),to=state.layers.findIndex(l=>l.id===row.dataset.layerId);
      if(from>=0&&to>=0){const [layer]=state.layers.splice(from,1);state.layers.splice(to,0,layer);refreshLayers();pushHistory();}
    }
    draggedLayerId=null;
    $$('[data-layer-id]',layerList).forEach(n=>n.classList.remove("is-drop-target","is-dragging"));
  });
  layerList.addEventListener("dragend",()=>{draggedLayerId=null;renderLayerList();});

  document.addEventListener("input", (event) => {
    const target = event.target;
    if(target.matches('[data-v17-new-note]')){v17Note=target.value.slice(0,150);return;}
    if(target.matches('[data-v17-selected-note]')){const l=selectedLayer();if(l?.type==='v17-callout'&&!l.locked){l.note=target.value.slice(0,150);renderAll();}return;}
    if(target.matches('[data-v17-selected-number]')){const l=selectedLayer();if(l?.type==='v17-callout'&&!l.locked){l.number=clamp(Math.round(Number(target.value)||1),1,999);renderAll();}return;}
    if(target.matches('[data-setting-range="v16Feather"]')){selectionFeather=Number(target.value);renderToolOptions();return;}
    if(target.matches('[data-setting-range="v16Tolerance"]')){selectionTolerance=Number(target.value);renderToolOptions();return;}
    if(target.matches('[data-setting-range="v16BrushSize"]')){maskBrushSize=Number(target.value);renderToolOptions();return;}
    if(target.matches("[data-type-selected],[data-type-setting]")){changeTypography(target);return;}
    if (target.matches("[data-setting-range]")) {
      if (applySelectedInput(target)) return;
      changeSettingFromInput(target);
    }
    if (target.matches("[data-setting-text='text']")) state.settings.text = target.value;
    if (target.matches("[data-selected-text]")) { applySelectedInput(target); }
    if (target.matches("[data-setting-color]")) {
      const key = target.dataset.settingColor;
      if(key==='v17RedactColor'){v17RedactionColor=target.value;return;}
      if(key==='v17SelectedRedaction'){const l=selectedLayer();if(l?.type==='v17-redact'&&!l.locked){l.redactColor=target.value;renderAll();}return;}
      if (key === "selectedColor") { const layer=selectedLayer(); if(layer){layer.color=target.value; const text=$(`[data-setting-textcolor="selectedColor"]`); if(text)text.value=target.value; renderAll();} }
      else { state.settings[key] = target.value; const text=$(`[data-setting-textcolor="${key}"]`); if(text)text.value=target.value; }
    }
    if (target.matches("[data-setting-textcolor]")) {
      const key=target.dataset.settingTextcolor;
      if(/^#[0-9a-f]{6}$/i.test(target.value)&&key==='v17RedactColor'){v17RedactionColor=target.value;const color=$('[data-setting-color="v17RedactColor"]');if(color)color.value=target.value;return;}
      if(/^#[0-9a-f]{6}$/i.test(target.value)&&key==='v17SelectedRedaction'){const l=selectedLayer();if(l?.type==='v17-redact'&&!l.locked){l.redactColor=target.value;renderAll();const color=$('[data-setting-color="v17SelectedRedaction"]');if(color)color.value=target.value;}return;} if(/^#[0-9a-f]{6}$/i.test(target.value)){ if(key==="selectedColor"){const layer=selectedLayer();if(layer){layer.color=target.value;renderAll();}}else{state.settings[key]=target.value;const color=$(`[data-setting-color="${key}"]`);if(color)color.value=target.value;} }
    }
    if(target.matches('[data-v15-compare-slider]')) {comparePosition=Number(target.value);$('[data-v15-compare-output]').textContent=`${comparePosition} %`;drawBeforeDocument();}
    if (target.matches("[data-adjust]")) {
      const key=target.dataset.adjust; state.adjust[key]=Number(target.value); $(`[data-adjust-output="${key}"]`).textContent=formatAdjustValue(key,Number(target.value)); clearRetouchCache();scheduleAdjustmentPreview();
    }
    if (target.matches("[data-export-format],[data-export-quality],[data-export-maxwidth]")) updateExportSummary();
    if (target.matches("[data-a4-scale],[data-a4-x],[data-a4-y]")) updateA4Preview();
    if (target.matches("[data-resize-width],[data-resize-height]")) {
      const lock=$("[data-resize-lock]").checked, ratio=Number(resizeDialog.dataset.ratio||1);
      if(lock){ if(target.matches("[data-resize-width]")) $("[data-resize-height]").value=Math.max(1,Math.round(Number(target.value)/ratio)); else $("[data-resize-width]").value=Math.max(1,Math.round(Number(target.value)*ratio)); }
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if(target.matches('[data-v17-selected-note],[data-v17-selected-number],[data-setting-color="v17SelectedRedaction"],[data-setting-textcolor="v17SelectedRedaction"]')){pushHistory();return;}
    if(target.matches('[data-v16-selection-mode]')){selectionMode=target.value;return;}
    if(target.matches('[data-v16-contiguous]')){selectionContiguous=target.checked;return;}
    if(target.matches('[data-v16-brush-mode]')){maskBrushShow=target.value==='show';return;}
    if(target.matches('[data-v16-mask-visible]')){const l=selectedLayer();if(l?.maskAssetId){l.maskEnabled=target.checked;clearMaskedCache();refreshLayers();pushHistory();}return;}
    if(target.matches("[data-type-selected],[data-type-setting]")){changeTypography(target);if(target.dataset.typeSelected)pushHistory();return;}
    if (target.matches("[data-project-name]")) { void renameSavedProject(target.dataset.projectName, target.value); return; }
    if (target.matches('[data-v15-compare-enabled]')) {comparisonEnabled=target.checked;drawBeforeDocument();}
    if (target.matches("[data-adjust]")) {if(adjustFrame){cancelAnimationFrame(adjustFrame);adjustFrame=0;renderAll();}pushHistory();}
    if (target.matches("[data-selected-text],[data-setting-range^='selected']")) pushHistory();
    if (target.matches("[data-setting-color='selectedColor'],[data-setting-textcolor='selectedColor']")) pushHistory();
    if (target.matches("[data-fill-toggle]")) { state.settings.fill = target.checked ? ($('[data-setting-color="fill"]')?.value || "#ffffff") : "transparent"; }
    if (target.matches("[data-a4-orientation],[data-a4-dpi],[data-a4-mode],[data-a4-background]")) updateA4Preview();
  });

  /* Pointer et clavier : afficher l'original uniquement pendant la pression. */
  const holdButton=$('[data-v15-before-hold]');
  function holdOriginal(held){
    if(!state.hasDocument)return;
    beforeHeld=held;
    holdButton.classList.toggle('is-active',held);
    holdButton.setAttribute('aria-pressed',String(held));
    drawBeforeDocument();
  }
  holdButton.addEventListener('pointerdown',e=>{e.preventDefault();holdOriginal(true);});
  ['pointerup','pointercancel','pointerleave'].forEach(t=>holdButton.addEventListener(t,()=>holdOriginal(false)));
  holdButton.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();holdOriginal(true);}});
  holdButton.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();holdOriginal(false);}});
  holdButton.addEventListener('blur',()=>holdOriginal(false));

  projectFile.addEventListener("change", async () => { if (projectFile.files?.[0]) await importEditableProject(projectFile.files[0]); });
  document.addEventListener("pointerdown", (event) => {
    ["[data-more-menu]", "[data-quickmore]", "[data-v17-annotations]"].forEach(selector => {
      const menu = $(selector);
      if (menu?.open && !menu.contains(event.target)) menu.open = false;
    });
  });

  fileInput.addEventListener("change", async () => { const files=[...(fileInput.files||[])].filter((file)=>file.type.startsWith("image/")); for(const file of files) await openImageFile(file); fileInput.value=""; });

  $("[data-resize-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    if(event.submitter?.value==="cancel"){resizeDialog.close();return;}
    const w=Number($("[data-resize-width]").value), h=Number($("[data-resize-height]").value);
    resizeDialog.close(); resizeDocument(w,h);
  });
  $("[data-export-form]").addEventListener("submit", (event) => { event.preventDefault(); if(event.submitter?.value==="cancel"){exportDialog.close();return;} exportImage(); });
  $("[data-new-form]").addEventListener("submit", (event) => {
    event.preventDefault(); if(event.submitter?.value==="cancel"){newDialog.close();return;} const w=Number($("[data-new-width]").value),h=Number($("[data-new-height]").value),bg=$("[data-new-background]").value;newDialog.close();createBlank(w,h,bg);
  });
  $("[data-a4-form]").addEventListener("submit", (event) => { event.preventDefault(); if(event.submitter?.value==="cancel"){a4Dialog.close();return;} a4Dialog.close(); applyA4(); });

  overlay.addEventListener("pointerdown", onPointerDown);
  overlay.addEventListener("pointermove", onPointerMove);
  overlay.addEventListener("pointerup", onPointerUp);
  overlay.addEventListener("pointercancel", onPointerUp);

  window.addEventListener("paste", (event) => {
    if (event.target instanceof HTMLElement && event.target.matches("input,textarea,[contenteditable='true']")) return;
    const file=[...(event.clipboardData?.files||[])].find((entry)=>entry.type.startsWith("image/"));
    if(file){event.preventDefault();importImage(file);}
  });

  let dragDepth=0;
  window.addEventListener("dragenter", (event) => { if ([...event.dataTransfer?.types||[]].includes("Files")) { dragDepth++; dropHint.hidden=false; } });
  window.addEventListener("dragleave", () => { dragDepth=Math.max(0,dragDepth-1); if(!dragDepth)dropHint.hidden=true; });
  window.addEventListener("dragover", (event) => { if ([...event.dataTransfer?.types||[]].includes("Files")) { event.preventDefault(); if(event.dataTransfer)event.dataTransfer.dropEffect="copy"; } });
  window.addEventListener("drop", async (event) => { event.preventDefault(); dragDepth=0;dropHint.hidden=true;const files=[...(event.dataTransfer?.files||[])].filter((entry)=>entry.type.startsWith("image/"));for(const file of files)await importImage(file); });

  window.addEventListener("keydown", (event) => {
    const typing = event.target instanceof HTMLElement && (event.target.matches("input,textarea,select,[contenteditable='true'],[role='textbox']") || event.target.isContentEditable);
    const key = String(event.key || "").toLowerCase();
    const mod = event.ctrlKey || event.metaKey;

    if (!typing && !event.altKey && !event.ctrlKey && !event.metaKey && key === "h") { event.preventDefault(); go("/"); return; }
    if (!typing && !event.altKey && !event.ctrlKey && !event.metaKey && key === "p") { event.preventDefault(); go("/pomodoro/"); return; }

    if (mod && key === "s") { event.preventDefault(); if (!document.querySelector("dialog[open]")) void saveProjectNow(); return; }
    if(typing||document.querySelector("dialog[open]"))return;
    if(mod&&key==="c"){event.preventDefault();copySelection();return;}
    if(mod&&key==="x"){event.preventDefault();copySelection(true);return;}
    if(mod&&key==="v"&&state.clipboard){event.preventDefault();pasteLayer();return;}
    if(mod&&key==="d"){event.preventDefault();duplicateLayer();return;}
    if(mod&&key==="a"&&state.hasDocument){event.preventDefault();if(state.tool==="select"&&!event.shiftKey)setSelection(state.layers.map(l=>l.id));else{setTool("marquee");state.marquee={x1:0,y1:0,x2:state.width,y2:state.height};renderOverlay();}return;}
    if(event.code==="Space"){event.preventDefault();state.spacePan=true;updateCanvasCursor();return;}
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.key)&&selectedLayers({unlocked:true}).length){event.preventDefault();const d=event.shiftKey?10:1;selectedLayers({unlocked:true}).forEach(l=>translateLayer(l,event.key==="ArrowLeft"?-d:event.key==="ArrowRight"?d:0,event.key==="ArrowUp"?-d:event.key==="ArrowDown"?d:0));refreshLayers();pushHistory();return;}
    if (mod && key === "o") { event.preventDefault(); fileInput.click(); return; }
    if (mod && key === "z" && !event.shiftKey) { event.preventDefault(); undo(); return; }
    if ((mod && key === "y") || (mod && event.shiftKey && key === "z")) { event.preventDefault(); redo(); return; }
    if (typing) return;
    if (event.key === "Delete" || event.key === "Backspace") { if(state.selectedId){event.preventDefault();deleteSelected();} return; }
    if (event.key === "Escape") { if(pixelSelection){pixelSelection=null;selectionDraft=null;renderOverlay();renderToolOptions();return;} if(state.marquee){state.marquee=null;renderOverlay();}else if(state.crop){state.crop=null;renderOverlay();renderToolOptions();} else if(activeSelectionIds().length){setSelection([]);} else {closeInspector();closeMobileSheet();} return; }
    if (key === "f") { event.preventDefault(); toggleFullscreen(); return; }
    const shortcuts = { q:"v16-select-rect", s:"marquee",i:"eyedropper",v:"select",c:"crop",t:"text",b:"brush",m:"highlight",x:"eraser",a:"arrow",l:"line",r:"rect",e:"ellipse",n:"number",u:"blur" };
    if (shortcuts[key]) { event.preventDefault(); setTool(shortcuts[key]); }
  }, true);

  window.addEventListener("resize", () => { if(state.hasDocument && state.zoom <= 1)setTimeout(()=>{ if(window.innerWidth<=620) fitZoom(); },80); });
  document.addEventListener("fullscreenchange", () => { if(!document.fullscreenElement){document.body.classList.remove("image-fullscreen");$$('[data-fullscreen]').forEach(b=>b.setAttribute("aria-pressed","false"));setTimeout(fitZoom,70);} });

  window.addEventListener("beforeunload", event => {
    saveActiveDocument();
    // Ne pas perdre une modification si l'enregistrement est encore en cours.
    if (v19Dirty.size || saveTimer) {event.preventDefault();event.returnValue="";}
  });
  window.addEventListener("pagehide", () => {
    // Best effort : les navigateurs peuvent interrompre une écriture asynchrone.
    if (saveTimer && state.hasDocument) void saveProjectNow(true);
  });

  const icon = name => window.PhilosophalIcons.svg(name);
  function refreshLayers(){
    state.selectedIds=(state.selectedIds||[]).filter(id=>state.layers.some(l=>l.id===id));
    if(state.selectedId&&!state.selectedIds.includes(state.selectedId))state.selectedIds=[state.selectedId];
    if(!state.selectedId)state.selectedIds=[];
    renderAll();renderLayerList();renderSelectionOptions();updateStatus();
  }
  async function blankAsset(w,h,white=false){const c=document.createElement("canvas");c.width=w;c.height=h;if(white){const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,w,h);}return registerAssetFromCanvas(c);}
  async function importImage(file){
    if(!state.hasDocument){await openImageFile(file);return;}
    if(busy)return;
    setBusy(true,"Import du calque…");
    try{const a=await registerAssetFromFile(file),scale=Math.min(1,state.width/a.image.naturalWidth,state.height/a.image.naturalHeight),w=a.image.naturalWidth*scale,h=a.image.naturalHeight*scale;
      const l={id:uid(),type:"image",assetId:a.id,x:(state.width-w)/2,y:(state.height-h)/2,w,h,opacity:1,visible:true,name:fileBaseName(file.name)};
      state.layers.push(l);state.selectedId=l.id;setTool("select");refreshLayers();pushHistory();toast("Image ajoutée comme calque déplaçable.");
    }catch(e){toast("Cette image ne peut pas être importée.");}finally{setBusy(false);}
  }
  function duplicateLayer(){
    const items=selectedLayers({unlocked:true});if(!items.length||busy)return;
    const newIds=[];items.forEach(l=>{const copy=deepClone(l);copy.id=uid();copy.locked=false;
      translateLayer(copy,Math.min(12,state.width*.05),Math.min(12,state.height*.05));
      state.layers.push(copy);newIds.push(copy.id);});
    setSelection(newIds);refreshLayers();pushHistory();
  }
  async function copySelection(cut=false){
    if(!state.hasDocument||busy)return;
    if(state.marquee){
      const r=normalizedRect(state.marquee.x1,state.marquee.y1,state.marquee.x2,state.marquee.y2),x=clamp(Math.floor(r.x),0,state.width-1),y=clamp(Math.floor(r.y),0,state.height-1),w=clamp(Math.round(r.w),1,state.width-x),h=clamp(Math.round(r.h),1,state.height-y);
      if(r.w<1||r.h<1){toast("Tracez d’abord une zone à copier.");return;}
      setBusy(true,"Copie de la sélection…");
      try{drawDocument(true);const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(canvas,x,y,w,h,0,0,w,h);const a=await registerAssetFromCanvas(c);
        state.clipboard={id:uid(),type:"image",assetId:a.id,x,y,w,h,opacity:1,visible:true,name:"Zone copiée"};
        if(cut){state.layers.push({id:uid(),type:"clear",x,y,w,h,visible:true});pushHistory();refreshLayers();}toast(cut?"Zone coupée. Cliquez sur Coller la sélection.":"Zone copiée. Cliquez sur Coller la sélection.");
      }finally{setBusy(false);}
    }else{const l=selectedLayer();if(!l){toast("Sélectionnez un calque ou une zone.");return;}state.clipboard=deepClone(l);if(cut&&!l.locked)deleteSelected();toast(cut?"Calque coupé.":"Calque copié.");}
  }
  function pasteLayer(){if(!state.hasDocument||busy||!state.clipboard)return;const l=deepClone(state.clipboard);l.id=uid();l.locked=false;state.layers.push(l);state.selectedId=l.id;state.marquee=null;setTool("select");refreshLayers();pushHistory();toast("Sélection collée sur un nouveau calque.");}
  function fitLayer(mode){const l=selectedLayer();if(l?.type!=="image"||l.locked)return;const image=assets.get(l.assetId)?.image;if(!image)return;
    if(mode!=="center"){const scale=mode==="original"?1:(mode==="cover"?Math.max:Math.min)(state.width/image.naturalWidth,state.height/image.naturalHeight);l.w=image.naturalWidth*scale;l.h=image.naturalHeight*scale;l.rotation=0;}
    l.x=(state.width-l.w)/2;l.y=(state.height-l.h)/2;refreshLayers();pushHistory();
  }
  async function changeCanvasSize(){
    const w=Math.round(Number($('[data-canvas-width]').value)),h=Math.round(Number($('[data-canvas-height]').value));if(w<1||h<1||w>12000||h>12000)return;
    if(w*h>36_000_000){toast("Choisissez une toile de moins de 36 millions de pixels.");return;}
    setBusy(true,"Taille de la toile…");try{const oldW=state.width,oldH=state.height,source=document.createElement("canvas");source.width=w;source.height=h;const x=source.getContext("2d"),center=$('[data-canvas-anchor]').value==="center",dx=center?(w-oldW)/2:0,dy=center?(h-oldH)/2:0;x.drawImage(state.baseImage,dx,dy,oldW,oldH);const a=await registerAssetFromCanvas(source);state.assetId=a.id;state.baseImage=a.image;state.width=w;state.height=h;state.layers.forEach(l=>translateLayer(l,dx,dy));state.crop=null;state.marquee=null;resizeCanvases();refreshLayers();pushHistory();fitZoom();$('[data-canvas-dialog]').close();}finally{setBusy(false);}
  }
  let formatSource=null,formatDrag=null;
  function openFormatDialog(){if(!state.hasDocument||busy){toast("Ouvrez d’abord une image.");return;}drawDocument(true);formatSource=document.createElement("canvas");formatSource.width=state.width;formatSource.height=state.height;formatSource.getContext("2d").drawImage(canvas,0,0);$('[data-format-scale]').value=100;$('[data-format-x]').value=0;$('[data-format-y]').value=0;$('[data-format-dialog]').showModal();renderFormatPreview();}
  function formatPlacement(){const w=clamp(Math.round($('[data-format-width]').value),1,12000),h=clamp(Math.round($('[data-format-height]').value),1,12000),mode=$('[data-format-mode]').value,ratio=(mode==="cover"?Math.max:Math.min)(w/formatSource.width,h/formatSource.height),scale=ratio*Number($('[data-format-scale]').value)/100,sw=formatSource.width*scale,sh=formatSource.height*scale;return{w,h,sw,sh,x:(w-sw)/2+Number($('[data-format-x]').value)*w/100,y:(h-sh)/2+Number($('[data-format-y]').value)*h/100};}
  function renderFormatPreview(){if(!formatSource)return;const p=formatPlacement(),c=$('[data-format-preview]'),ratio=Math.min(480/p.w,320/p.h);c.width=Math.max(1,Math.round(p.w*ratio));c.height=Math.max(1,Math.round(p.h*ratio));const x=c.getContext("2d");if($('[data-format-background]').value==="white"){x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);}x.imageSmoothingEnabled=state.settings.smoothing!==false;x.imageSmoothingQuality="high";x.drawImage(formatSource,p.x*ratio,p.y*ratio,p.sw*ratio,p.sh*ratio);$('[data-format-summary]').textContent=`${p.w} × ${p.h} pixels à l’export · échelle ${$('[data-format-scale]').value} %`;$('[data-format-scale-output]').textContent=`${$('[data-format-scale]').value} %`;}
  async function applyExactFormat(){
    if(!formatSource||busy)return;const p=formatPlacement();if(p.w*p.h>36_000_000){toast("Choisissez moins de 36 millions de pixels.");return;}
    setBusy(true,"Préparation du format…");try{const a=await registerAssetFromCanvas(formatSource),b=await blankAsset(p.w,p.h,$('[data-format-background]').value==="white");state.width=p.w;state.height=p.h;state.assetId=b.id;state.baseImage=b.image;state.layers=[{id:uid(),type:"image",assetId:a.id,x:p.x,y:p.y,w:p.sw,h:p.sh,opacity:1,visible:true,name:"Image recadrée"}];state.adjust={ ...defaultAdjust };syncAdjustmentControls();state.selectedId=state.layers[0].id;state.crop=null;state.marquee=null;resizeCanvases();setTool("select");refreshLayers();pushHistory();fitZoom();$('[data-format-dialog]').close();$('[data-export-maxwidth]').value=0;toast(`Format ${p.w} × ${p.h} prêt. Vous pouvez encore déplacer l’image, puis exporter.` ,4000);}finally{setBusy(false);}
  }
  document.addEventListener("click",e=>{
    const b=e.target.closest("button");if(!b||busy)return;
    if(b.matches('[data-import-layer]'))$('[data-layer-file]').click();
    if(b.matches('[data-exact-format]'))openFormatDialog();
    if(b.matches('[data-canvas-size]')&&state.hasDocument){$('[data-canvas-width]').value=state.width;$('[data-canvas-height]').value=state.height;$('[data-canvas-dialog]').showModal();}
    if(b.matches('[data-duplicate-layer]'))duplicateLayer();
    if(b.matches('[data-copy-pixels]'))copySelection();
    if(b.matches('[data-cut-pixels]'))copySelection(true);
    if(b.matches('[data-paste-layer]'))pasteLayer();
    if(b.matches('[data-crop-selection]')&&state.marquee){const r={...state.marquee};setTool("crop");state.crop=r;applyCrop();}
    if(b.matches('[data-fit-layer]'))fitLayer(b.dataset.fitLayer);
    if(b.matches('[data-transform-layer]')){const l=selectedLayer();if(l?.type!=="image"||l.locked)return;if(b.dataset.transformLayer==="flipX")l.mirrorX=!l.mirrorX;if(b.dataset.transformLayer==="flipY")l.mirrorY=!l.mirrorY;if(b.dataset.transformLayer==="rotate")l.rotation=((l.rotation||0)+90)%360;refreshLayers();pushHistory();}
    if(b.matches('[data-layer-lock]')){const l=state.layers.find(l=>l.id===b.dataset.layerLock);if(l){l.locked=!l.locked;refreshLayers();pushHistory();}}
    if(b.matches('[data-format-preset]')){const[w,h]=b.dataset.formatPreset.split('x');$('[data-format-width]').value=w;$('[data-format-height]').value=h;$('[data-export-format]').value=b.dataset.presetMime || 'image/png';renderFormatPreview();}
    if(b.matches('[data-format-center]')){$('[data-format-x]').value=0;$('[data-format-y]').value=0;renderFormatPreview();}
  });
  document.addEventListener("change",e=>{
    const t=e.target,l=selectedLayer();
    if(t.matches('[data-image-prop]')&&l?.type==="image"&&!l.locked){const k=t.dataset.imageProp,v=Number(t.value);if(!Number.isFinite(v))return;if((k==='w'||k==='h')&&v<1)return;if((k==='w'||k==='h')&&$('[data-image-ratio]')?.checked){const ratio=l.w/l.h;if(k==='w')l.h=v/ratio;else l.w=v*ratio;}l[k]=v;refreshLayers();pushHistory();}
    if(t.matches('[data-crop-width],[data-crop-height]')&&state.crop){const r=normalizedRect(state.crop.x1,state.crop.y1,state.crop.x2,state.crop.y2);const w=clamp($('[data-crop-width]').value,1,state.width-r.x),h=clamp($('[data-crop-height]').value,1,state.height-r.y);state.crop={x1:r.x,y1:r.y,x2:r.x+w,y2:r.y+h};renderOverlay();renderToolOptions();}
    if(t.matches('[data-smoothing]')){state.settings.smoothing=t.checked;renderAll();renderFormatPreview();}
  });
  document.addEventListener('input',e=>{if(e.target.matches('[data-format-width],[data-format-height],[data-format-scale],[data-format-x],[data-format-y],[data-format-mode],[data-format-background]'))renderFormatPreview();});
  $('[data-layer-file]').addEventListener('change',async e=>{for(const f of e.target.files)await importImage(f);e.target.value='';});
  $('[data-format-form]').addEventListener('submit',e=>{e.preventDefault();if(e.submitter?.value==='cancel')$('[data-format-dialog]').close();else applyExactFormat();});
  $('[data-canvas-form]').addEventListener('submit',e=>{e.preventDefault();if(e.submitter?.value==='cancel')$('[data-canvas-dialog]').close();else changeCanvasSize();});
  $('[data-format-preview]').addEventListener('pointerdown',e=>{const c=e.currentTarget;c.setPointerCapture(e.pointerId);formatDrag={x:e.clientX,y:e.clientY,px:Number($('[data-format-x]').value),py:Number($('[data-format-y]').value)};e.preventDefault();});
  $('[data-format-preview]').addEventListener('pointermove',e=>{if(!formatDrag)return;const r=e.currentTarget.getBoundingClientRect();$('[data-format-x]').value=clamp(formatDrag.px+(e.clientX-formatDrag.x)/r.width*100,-150,150);$('[data-format-y]').value=clamp(formatDrag.py+(e.clientY-formatDrag.y)/r.height*100,-150,150);renderFormatPreview();});
  ['pointerup','pointercancel'].forEach(type=>$('[data-format-preview]').addEventListener(type,()=>formatDrag=null));
  window.addEventListener('keyup',e=>{if(e.code==='Space'){state.spacePan=false;updateCanvasCursor();}});
  window.addEventListener('blur',()=>{state.spacePan=false;state.interaction=null;});
  stage.addEventListener('wheel',e=>{if((e.ctrlKey||e.metaKey)&&state.hasDocument){e.preventDefault();setZoom(state.zoom*Math.exp(-e.deltaY*.002),true,{x:e.clientX,y:e.clientY});}},{passive:false});

  restorePanelPreferences();
  void updateRecentProjects();
  if (v19RecoveryButton && v19RecoveryPanel) {
    v19RecoveryButton.addEventListener("click", () => {
      v19RecoveryPanel.hidden = !v19RecoveryPanel.hidden;
      v19RecoveryButton.setAttribute("aria-expanded", String(!v19RecoveryPanel.hidden));
      if (!v19RecoveryPanel.hidden) void v19RenderRecovery();
    });
    v19RecoveryNode?.addEventListener("click", event => {
      const button = event.target.closest("[data-v19-restore]");
      if (button && !busy) void v19RestoreCheckpoint(button.dataset.v19Restore);
    });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && saveTimer) void saveProjectNow(true);
  });
  renderToolOptions();
  renderLayerList();
  renderDocumentTabs();
  updateHistoryButtons();
  updateStatus();
  /* V18 — Bibliothèque graphique personnelle, 100 % locale. Ne change pas le format .phimage. */
  const v18Dialog = $('[data-v18-dialog]');
  const v18ImportFile = $('[data-v18-import-file]');
  const v18ElementFile = $('[data-v18-element-file]');
  const v18Builtin = [
    {id:'builtin-philosophal',name:'Philosophal',colors:['#191725','#7564dd','#b7a8fa','#f6f3fd','#e6dbcf'],builtin:true},
    {id:'builtin-papier',name:'Papier & encre',colors:['#242135','#faf8f2','#a78d6e','#6b6287','#e9e3d8'],builtin:true},
    {id:'builtin-mystique',name:'Musique & mystique',colors:['#0f1019','#694c89','#d9caed','#ad8795','#eeeaf5'],builtin:true}
  ];
  const V18_DB='philosophal-bibliotheque-graphique-v18';
  const V18_MAX_ENTRY=14*1024*1024;
  let v18DbPromise=null, v18Tab='palettes', v18Records=[], v18OpenSerial=0;
  const v18Mime=/^image\/(png|jpeg|webp)$/i;
  const v18CleanName=s=>String(s||'').trim().slice(0,74)||'Sans titre';
  const v18Hex=s=>/^#[0-9a-f]{6}$/i.test(String(s||''))?s.toLowerCase():null;
  const v18ParseColors=s=>[...new Set(String(s||'').split(/[\s,;]+/).map(v18Hex).filter(Boolean))].slice(0,12);
  const v18TextFields=['color','fontFamily','fontWeight','fontStyle','fontSize','textAlign','lineHeight','letterSpacing','strokeWidth','strokeColor','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY'];
  const v18TextStyle=layer=>Object.fromEntries(v18TextFields.filter(k=>layer?.[k]!==undefined).map(k=>[k,layer[k]]));
  const v18FormatSize=(n)=>n>1024*1024?`${(n/1048576).toFixed(1)} Mo`:`${Math.round(n/1024)} Ko`;
  const v18ArrayBufferFromDataUrl=url=>{
    if(!/^data:image\/(png|jpeg|webp);base64,/i.test(url))throw new Error('Image non reconnue');
    const i=url.indexOf(','),raw=atob(url.slice(i+1));const result=new Uint8Array(raw.length);
    for(let n=0;n<raw.length;n++)result[n]=raw.charCodeAt(n);
    return new Blob([result],{type:url.slice(5,url.indexOf(';')).toLowerCase()});
  };
  const v18DataUrl=blob=>new Promise((resolve,reject)=>{
    if(!v18Mime.test(blob?.type||''))return reject(new Error('Seules les images PNG, JPG et WebP sont acceptées.'));
    const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(new Error('Impossible de lire cette image'));r.readAsDataURL(blob);
  });
  function v18OpenDb(){
    if(v18DbPromise)return v18DbPromise;
    if(!window.indexedDB)return Promise.reject(new Error('Le stockage local est indisponible'));
    v18DbPromise=new Promise((resolve,reject)=>{
      const r=indexedDB.open(V18_DB,1);
      r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('items'))r.result.createObjectStore('items',{keyPath:'id'});};
      r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||new Error('Stockage refusé'));
      r.onblocked=()=>reject(new Error('Fermez les autres onglets de l’éditeur puis réessayez'));
    }).catch(e=>{v18DbPromise=null;throw e;});
    return v18DbPromise;
  }
  async function v18GetAll(){const db=await v18OpenDb();return await requestToPromise(db.transaction('items','readonly').objectStore('items').getAll());}
  async function v18Write(items){
    const db=await v18OpenDb();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction('items','readwrite');
      items.forEach(item=>tx.objectStore('items').put(item));
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||new Error('Enregistrement impossible'));
      tx.onabort=()=>reject(tx.error||new Error('Espace de stockage insuffisant'));
    });
  }
  async function v18Delete(id){const db=await v18OpenDb();await new Promise((resolve,reject)=>{
    const tx=db.transaction('items','readwrite');tx.objectStore('items').delete(id);
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||new Error('Suppression impossible'));
  });}
  function v18Item(type,name,payload){return{id:uid('biblio'),type,name:v18CleanName(name),payload,updatedAt:Date.now()};}
  function v18ById(id){return v18Records.find(r=>r.id===id)||null;}
  async function v18Refresh(){v18Records=(await v18GetAll()).sort((a,b)=>b.updatedAt-a.updatedAt);v18Render();}
  function v18Open(){
    if(!v18Dialog)return;
    if(!v18Dialog.open)v18Dialog.showModal();
    const serial=++v18OpenSerial;
    v18Render();
    v18Refresh().catch(e=>{if(serial===v18OpenSerial){v18Records=[];v18Render();toast(`Sauvegarde de bibliothèque indisponible : ${e.message}`,4600);}});
  }
  function v18SavePanel(){
    if(v18Tab==='palettes')return `<div class="v18-create-heading"><strong>Créer une palette</strong><span>De 1 à 12 couleurs hexadécimales</span></div><div class="v18-inline-fields"><label>Nom<input type="text" data-v18-name maxlength="74" value="Ma palette"></label><label>Couleurs séparées par une virgule<input data-v18-colors type="text" spellcheck="false" value="#191725, #7564dd, #b7a8fa, #f6f3fd"></label><button type="button" class="is-primary" data-v18-save="palettes">Enregistrer</button></div>`;
    if(v18Tab==='styles')return `<div class="v18-create-heading"><strong>Enregistrer une typographie</strong><span>Utilise le calque texte sélectionné ou vos réglages actuels</span></div><div class="v18-inline-fields v18-inline-short"><label>Nom du style<input type="text" data-v18-name maxlength="74" value="Mon style de titre"></label><button type="button" class="is-primary" data-v18-save="styles">Enregistrer le style</button></div>`;
    if(v18Tab==='elements')return `<div class="v18-create-heading"><strong>Enregistrer un élément</strong><span>Images, logos, formes, textes et annotations restent éditables</span></div><div class="v18-inline-fields v18-inline-short"><label>Nom de l’élément<input type="text" data-v18-name maxlength="74" value="Mon élément"></label><button type="button" class="is-primary" data-v18-save="elements">Depuis la sélection</button><button type="button" data-v18-import-element>Importer une image</button></div>`;
    return `<div class="v18-create-heading"><strong>Enregistrer une composition</strong><span>La mise en page et les calques de votre document sont conservés</span></div><div class="v18-inline-fields v18-inline-short"><label>Nom de la composition<input type="text" data-v18-name maxlength="74" value="Ma composition"></label><button type="button" class="is-primary" data-v18-save="compositions">Enregistrer le document</button></div>`;
  }
  function v18Card(record){
    const p=record.payload||{};
    const title=escapeHtml(record.name),id=escapeHtml(record.id);
    if(record.type==='palettes'){
      const colors=(p.colors||[]).filter(v18Hex);
      return `<article class="v18-item" role="listitem"><div class="v18-item-heading"><div><strong>${title}</strong><small>${colors.length} couleurs${record.builtin?' · préinstallée':''}</small></div>${record.builtin?'':`<button type="button" class="v18-delete" data-v18-delete="${id}" aria-label="Supprimer ${title}">×</button>`}</div><div class="v18-swatches">${colors.map((c,i)=>`<button type="button" style="--v18-swatch:${c}" title="Appliquer ${c}" aria-label="Appliquer la couleur ${c}" data-v18-swatch="${id}:${i}"></button>`).join('')}</div><small>Cliquer une couleur pour l’appliquer</small></article>`;
    }
    if(record.type==='styles'){
      const s=p.style||{};return `<article class="v18-item" role="listitem"><div class="v18-item-heading"><div><strong>${title}</strong><small>${escapeHtml(s.fontFamily||'Inter')} · ${escapeHtml(s.fontWeight||400)} · ${escapeHtml(s.fontSize||48)} px</small></div><button type="button" class="v18-delete" data-v18-delete="${id}" aria-label="Supprimer ${title}">×</button></div><div class="v18-type-preview" style="color:${v18Hex(s.color)||'#7564dd'};font-family:Georgia,serif;font-weight:${Number(s.fontWeight)||400}">Aa Philosophal</div><button type="button" data-v18-apply="${id}">Appliquer le style</button></article>`;
    }
    if(record.type==='elements')return `<article class="v18-item" role="listitem"><div class="v18-item-heading"><div><strong>${title}</strong><small>${(p.layers||[]).length} calque(s) · éditable</small></div><button type="button" class="v18-delete" data-v18-delete="${id}" aria-label="Supprimer ${title}">×</button></div><div class="v18-item-action"><button type="button" data-v18-apply="${id}">Ajouter au document</button></div></article>`;
    const dim=`${p.width||0} × ${p.height||0} px`;
    return `<article class="v18-item" role="listitem"><div class="v18-item-heading"><div><strong>${title}</strong><small>${escapeHtml(dim)} · ${(p.layers||[]).length} calques</small></div><button type="button" class="v18-delete" data-v18-delete="${id}" aria-label="Supprimer ${title}">×</button></div><div class="v18-item-action"><button type="button" data-v18-apply="${id}">Ouvrir une copie</button><details class="v18-variants"><summary>Adapter le format ▾</summary><div><button type="button" data-v18-variant="${id}:vertical">9:16 · vertical</button><button type="button" data-v18-variant="${id}:square">1:1 · carré</button><button type="button" data-v18-variant="${id}:landscape">16:9 · horizontal</button></div></details></div></article>`;
  }
  function v18Render(){
    const labels={palettes:'Cliquez sur une couleur pour l’appliquer au calque sélectionné ou aux prochains tracés.',styles:'Appliquez un style sur un texte sélectionné. Sans texte sélectionné, il servira pour vos prochains textes.',elements:'Sélectionnez vos calques avant de les enregistrer. Les éléments conservés pourront être placés dans d’autres documents.',compositions:'Ouvrir une copie crée un nouveau projet, sans modifier l’original. Les déclinaisons préservent les proportions, avec une mise en page recentrée à ajuster si besoin.'};
    $('[data-v18-guide]').textContent=labels[v18Tab];
    $('[data-v18-save-panel]').innerHTML=v18SavePanel();
    $$('[data-v18-tab]',v18Dialog).forEach(b=>{b.classList.toggle('is-active',b.dataset.v18Tab===v18Tab);b.setAttribute('aria-selected',String(b.dataset.v18Tab===v18Tab));});
    const list=v18Tab==='palettes'?[...v18Builtin.map(p=>({...p,type:'palettes',payload:{colors:p.colors}})),...v18Records.filter(r=>r.type==='palettes')]:v18Records.filter(r=>r.type===v18Tab);
    $('[data-v18-list]').innerHTML=list.length?list.map(v18Card).join(''):'<div class="v18-no-items">Votre bibliothèque est vide dans cette catégorie. Créez votre premier élément ci-dessus.</div>';
  }
  function v18BuiltinById(id){const r=v18Builtin.find(p=>p.id===id);return r?{...r,type:'palettes',payload:{colors:r.colors}}:null;}
  function v18CurrentName(){return v18CleanName($('[data-v18-name]',v18Dialog)?.value);}
  async function v18CollectAssetPayload(layers,baseId=''){
    const ids=new Set((layers||[]).flatMap(l=>[l.assetId,l.maskAssetId]).filter(Boolean));if(baseId)ids.add(baseId);
    const result={};let total=0;
    for(const id of ids){
      const blob=assets.get(id)?.blob;
      if(!blob)throw new Error('Une image source est manquante. Enregistrez le projet puis réessayez.');
      total+=blob.size;if(total>V18_MAX_ENTRY)throw new Error('Cette création dépasse 14 Mo. Enregistrez-la plutôt comme projet .phimage.');
      result[id]=await v18DataUrl(blob);
    }
    return result;
  }
  async function v18SaveSelection(){
    if(!state.hasDocument)throw new Error('Ouvrez un document avant d’enregistrer un élément.');
    const selected=selectedLayers();if(!selected.length)throw new Error('Sélectionnez au moins un calque dans le document.');
    const bounds=unionBounds(selected);if(!bounds)throw new Error('Les calques sélectionnés ne peuvent pas être enregistrés.');
    return{layers:deepClone(selected),width:state.width,height:state.height,bounds,assets:await v18CollectAssetPayload(selected)};
  }
  async function v18SaveComposition(){
    if(!state.hasDocument)throw new Error('Créez ou ouvrez un document avant de l’enregistrer.');
    return{width:state.width,height:state.height,baseId:state.assetId,layers:deepClone(state.layers),assets:await v18CollectAssetPayload(state.layers,state.assetId)};
  }
  async function v18Save(category){
    const name=v18CurrentName();let payload;
    if(category==='palettes'){const colors=v18ParseColors($('[data-v18-colors]',v18Dialog).value);if(!colors.length)throw new Error('Ajoutez au moins une couleur au format #RRGGBB.');payload={colors};}
    else if(category==='styles'){const l=selectedLayer();payload={style:v18TextStyle(l?.type==='text'?l:state.settings)};}
    else if(category==='elements')payload=await v18SaveSelection();
    else payload=await v18SaveComposition();
    await v18Write([v18Item(category,name,payload)]);await v18Refresh();toast(`« ${name} » ajouté à votre bibliothèque.`);
  }
  function v18ApplyColor(record,index){
    const color=v18Hex(record?.payload?.colors?.[index]);if(!color)return;
    const layers=selectedLayers({unlocked:true}).filter(l=>!['image','clear','blur'].includes(l.type));
    if(layers.length){layers.forEach(l=>{l.color=color;if(l.type==='rect'&&l.fill&&l.fill!=='transparent')l.fill=color;});refreshLayers();pushHistory();}
    state.settings.color=color;renderToolOptions();toast(layers.length?`Couleur ${color} appliquée.`:`Couleur ${color} prête pour les prochains éléments.`);
  }
  function v18ApplyStyle(record){
    const style=record?.payload?.style;if(!style)return;
    const l=selectedLayer(),dest=l?.type==='text'&&!l.locked?l:state.settings;
    for(const k of v18TextFields)if(style[k]!==undefined)dest[k]=style[k];
    if(dest!==state.settings){refreshLayers();pushHistory();}else renderToolOptions();
    toast('Style typographique appliqué.');
  }
  async function v18ResolveAssets(map){
    const translated={};
    for(const [oldId,data] of Object.entries(map||{})){
      if(data.length>V18_MAX_ENTRY*1.5)throw new Error('Fichier image trop volumineux');
      const blob=v18ArrayBufferFromDataUrl(data);const newAsset=await registerAssetFromBlob(blob);
      translated[oldId]=newAsset.id;
    }
    return translated;
  }
  function v18RemapLayer(layer,assetIds){
    const copy=deepClone(layer);copy.id=uid('layer');copy.locked=false;
    if(copy.assetId){if(!assetIds[copy.assetId])throw new Error('Image manquante dans la bibliothèque');copy.assetId=assetIds[copy.assetId];}
    if(copy.maskAssetId){if(!assetIds[copy.maskAssetId])throw new Error('Masque manquant dans la bibliothèque');copy.maskAssetId=assetIds[copy.maskAssetId];}
    return copy;
  }
  async function v18AddElement(record){
    if(!state.hasDocument)throw new Error('Ouvrez une image ou créez d’abord une toile.');
    const p=record.payload,assetIds=await v18ResolveAssets(p.assets),layers=p.layers.map(l=>v18RemapLayer(l,assetIds));
    const bounds=p.bounds||unionBounds(layers);if(!bounds)throw new Error('Élément incomplet.');
    const scale=Math.min(1,0.83*state.width/Math.max(bounds.w,1),0.83*state.height/Math.max(bounds.h,1));
    // Scale and recenter as a single group, keeping text and images editable.
    layers.forEach(l=>{scaleLayer(l,scale,scale);translateLayer(l,(state.width-bounds.w*scale)/2-bounds.x*scale,(state.height-bounds.h*scale)/2-bounds.y*scale);});
    state.layers.push(...layers);setSelection(layers.map(l=>l.id));refreshLayers();pushHistory();toast('Élément ajouté sur des calques modifiables.');v18Dialog.close();
  }
  async function v18OpenComposition(record,variant='original'){
    const p=record.payload;if(!p||!p.width||!p.height)throw new Error('Composition incomplète.');
    const dims={vertical:[1080,1920],square:[1080,1080],landscape:[1920,1080]};
    const [w,h]=dims[variant]||[p.width,p.height];
    if(w*h>36e6)throw new Error('Dimensions de composition trop importantes.');
    const assetIds=await v18ResolveAssets(p.assets);
    await createBlank(w,h,'transparent');
    const base=assetIds[p.baseId];
    let insertedBase=[];
    if(base){const src=assets.get(base)?.image;
      if(variant==='original'){state.assetId=base;state.baseImage=src;}
      else if(src)insertedBase=[{id:uid('layer'),type:'image',assetId:base,x:0,y:0,w:p.width,h:p.height,opacity:1,visible:true,name:'Fond original'}];
    }
    let layers=p.layers.map(l=>v18RemapLayer(l,assetIds));
    if(variant!=='original'){
      const s=Math.min(w/p.width,h/p.height),dx=(w-p.width*s)/2,dy=(h-p.height*s)/2;
      // Background color extends to new canvas dimensions; no asset pixels are stretched.
      const back=layers.find(l=>l.type==='rect'&&Math.abs(l.x1)<1&&Math.abs(l.y1)<1&&Math.abs(l.x2-p.width)<1&&Math.abs(l.y2-p.height)<1&&v18Hex(l.fill));
      const backdrop=back?[{id:uid('layer'),type:'rect',x1:0,y1:0,x2:w,y2:h,color:back.fill,fill:back.fill,width:0,opacity:1,visible:true,name:'Fond du format'}]:[];
      layers=[...backdrop,...insertedBase,...layers];
      layers.forEach(l=>{if(!backdrop.includes(l)){scaleLayer(l,s,s);translateLayer(l,dx,dy);}});
    }
    state.layers=layers;state.selectedId=null;state.selectedIds=[];
    state.name=`${record.name}${variant==='original'?'':` · ${variant==='vertical'?'9-16':variant==='square'?'carré':'16-9'}`}`;
    resetHistory();refreshLayers();saveActiveDocument();scheduleProjectSave();fitZoom();v18Dialog.close();
    toast(variant==='original'?'Copie éditable ouverte.':'Variante créée. Ajustez le cadrage et les textes si nécessaire.');
  }
  async function v18ImportElement(file){
    if(!file||!v18Mime.test(file.type)||file.size>8*1024*1024)throw new Error('Choisissez un PNG, JPG ou WebP inférieur à 8 Mo.');
    const url=await v18DataUrl(file);
    let dimensions;
    if(typeof createImageBitmap==='function')try{dimensions=await createImageBitmap(file).then(bitmap=>{const p={width:bitmap.width,height:bitmap.height};bitmap.close();return p;});}catch(_){/* fallback Image */}
    if(!dimensions){const objectUrl=URL.createObjectURL(file);try{const image=await loadImageElement(objectUrl);dimensions={width:image.naturalWidth,height:image.naturalHeight};}finally{URL.revokeObjectURL(objectUrl);}}
    const layer={id:'asset-source',type:'image',assetId:'asset-source',x:0,y:0,w:dimensions.width,h:dimensions.height,opacity:1,visible:true,name:fileBaseName(file.name)};
    const record=v18Item('elements',fileBaseName(file.name),{layers:[layer],bounds:{x:0,y:0,w:dimensions.width,h:dimensions.height},width:dimensions.width,height:dimensions.height,assets:{'asset-source':url}});
    await v18Write([record]);await v18Refresh();toast('Image enregistrée comme élément réutilisable.');
  }
  async function v18Export(){
    const all=await v18GetAll();
    if(!all.length){toast('Aucun élément personnel à exporter.');return;}
    const text=JSON.stringify({type:'philosophal-graphic-library',version:1,exportedAt:new Date().toISOString(),entries:all});
    const blob=new Blob([text],{type:'application/json'});downloadBlob(blob,'bibliotheque-philosophal.json');toast(`Bibliothèque exportée · ${all.length} élément(s).`);
  }
  async function v18Import(file){
    if(!file||file.size>35*1024*1024)throw new Error('Fichier trop volumineux (maximum 35 Mo).');
    const data=JSON.parse(await file.text());
    if(data?.type!=='philosophal-graphic-library'||data.version!==1||!Array.isArray(data.entries))throw new Error('Ce fichier n’est pas une bibliothèque Philosophal V18.');
    if(data.entries.length>250)throw new Error('Maximum de 250 éléments par import.');
    const out=[];
    for(const r of data.entries){
      if(!['palettes','styles','elements','compositions'].includes(r?.type)||!r.payload||typeof r.payload!=='object')continue;
      const p=r.payload;
      if(r.type==='palettes'){
        const colors=(p.colors||[]).map(v18Hex).filter(Boolean).slice(0,12);if(!colors.length)continue;p.colors=colors;
      }
      if(r.type==='elements'||r.type==='compositions'){
        let bytes=0;for(const dataUrl of Object.values(p.assets||{})){
          if(typeof dataUrl!=='string'||!/^data:image\/(png|jpeg|webp);base64,/i.test(dataUrl))throw new Error('Une image importée n’est pas valide.');
          bytes+=dataUrl.length;
        }
        if(bytes>V18_MAX_ENTRY*1.5)throw new Error('Un élément importé dépasse la limite autorisée.');
        if(!Array.isArray(p.layers)||p.layers.length>300)throw new Error('Trop de calques dans un élément.');
      }
      out.push(v18Item(r.type,r.name,p));
    }
    if(!out.length)throw new Error('Aucun élément reconnu dans ce fichier.');
    await v18Write(out);await v18Refresh();toast(`${out.length} élément(s) importé(s) dans votre bibliothèque.`);
  }
  async function v18RunAction(fn){
    const list=$('[data-v18-list]');if(list)list.setAttribute('aria-busy','true');
    try{await fn();}catch(e){console.error('Bibliothèque V18',e);toast(e?.message||'Action impossible.',4500);}
    finally{if(list)list.removeAttribute('aria-busy');}
  }
  document.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.matches('[data-v18-library]')){event.preventDefault();v18Open();return;}
    if(b.matches('[data-v18-close]')){v18Dialog.close();return;}
    if(!v18Dialog.open)return;
    if(b.matches('[data-v18-tab]')){v18Tab=b.dataset.v18Tab;v18Render();return;}
    if(b.matches('[data-v18-save]')){void v18RunAction(()=>v18Save(b.dataset.v18Save));return;}
    if(b.matches('[data-v18-import-element]')){v18ElementFile.click();return;}
    if(b.matches('[data-v18-delete]')){
      const r=v18ById(b.dataset.v18Delete);if(!r||!window.confirm(`Supprimer « ${r.name} » de cette bibliothèque ?`))return;
      void v18RunAction(async()=>{await v18Delete(r.id);await v18Refresh();});return;
    }
    if(b.matches('[data-v18-swatch]')){
      const [id,index]=b.dataset.v18Swatch.split(':');v18ApplyColor(v18ById(id)||v18BuiltinById(id),Number(index));return;
    }
    if(b.matches('[data-v18-apply]')){
      const r=v18ById(b.dataset.v18Apply);if(!r)return;
      if(r.type==='styles')v18ApplyStyle(r);
      else if(r.type==='elements')void v18RunAction(()=>v18AddElement(r));
      else if(r.type==='compositions')void v18RunAction(()=>v18OpenComposition(r));return;
    }
    if(b.matches('[data-v18-variant]')){
      const [id,variant]=b.dataset.v18Variant.split(':');const r=v18ById(id);
      if(r)void v18RunAction(()=>v18OpenComposition(r,variant));return;
    }
    if(b.matches('[data-v18-import]')){v18ImportFile.click();return;}
    if(b.matches('[data-v18-export]')){void v18RunAction(v18Export);return;}
  });
  v18ImportFile.addEventListener('change',event=>{const f=event.target.files?.[0];if(f)void v18RunAction(()=>v18Import(f));event.target.value='';});
  v18ElementFile.addEventListener('change',event=>{const f=event.target.files?.[0];if(f)void v18RunAction(()=>v18ImportElement(f));event.target.value='';});
})();
