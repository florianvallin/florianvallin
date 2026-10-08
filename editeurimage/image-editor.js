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

  const defaultAdjust = { brightness:100, contrast:100, saturation:100, grayscale:0, sepia:0, hue:0 };
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
      text: "Texte",
      numberSize: 24,
      blur: 12,
      cropRatio: "free"
    },
    history: [],
    historyIndex: -1,
    nextNumber: 1
  };

  const TOOL_LABELS = { marquee:"Sélection de pixels", eyedropper:"Pipette", hand:"Déplacer la vue", image:"Image",
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

  function appPath(path) {
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
    assets.set(id, { src, image, revoke: true });
    return { id, image };
  }

  async function registerAssetFromFile(file) {
    const src = URL.createObjectURL(file);
    const image = await loadImageElement(src);
    const id = uid("asset");
    assets.set(id, { src, image, revoke: true });
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
  }

  function loadDocumentRecord(id) {
    if (id === activeDocumentId) return;
    saveActiveDocument();
    const doc = documents.find((entry) => entry.id === id);
    if (!doc) return;
    activeDocumentId = id;
    state.hasDocument = true;
    state.history = deepClone(doc.history || []);
    state.historyIndex = Number.isInteger(doc.historyIndex) ? doc.historyIndex : Math.max(0, state.history.length - 1);
    state.zoom = doc.zoom || 1;
    restoreSnapshot(doc.snapshot);
    state.selectedId = doc.selectedId || null;
    showDocument();
    renderAll();
    renderLayerList();
    renderSelectionOptions();
    updateHistoryButtons();
    renderDocumentTabs();
    requestAnimationFrame(fitZoom);
  }

  function closeDocument(id) {
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
  }

  function showEmptyDocument() {
    state.hasDocument = false;
    activeDocumentId = "";
    stage.hidden = true;
    emptyState.hidden = false;
    state.layers = [];
    state.selectedId = null;
    state.marquee=null;
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
    if (state.historyIndex >= 0) {
      const previous = state.history[state.historyIndex];
      if (JSON.stringify(previous) === JSON.stringify(snapshot)) return;
    }
    state.history.splice(state.historyIndex + 1);
    state.history.push(snapshot);
    if (state.history.length > 70) state.history.shift();
    state.historyIndex = state.history.length - 1;
    updateHistoryButtons();
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
    state.marquee=null;
    state.adjust = { ...defaultAdjust, ...snapshot.adjust };
    state.nextNumber = snapshot.nextNumber || 1;
    state.name = snapshot.name || state.name;
    const selection = Object.prototype.hasOwnProperty.call(snapshot, "selectedId") ? snapshot.selectedId : state.selectedId;
    state.selectedId = state.layers.some(layer => layer.id === selection) ? selection : null;
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
  }

  function redo() {
    if (busy || state.historyIndex >= state.history.length - 1) return;
    state.historyIndex += 1;
    restoreSnapshot(state.history[state.historyIndex]);
    updateHistoryButtons();
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

  function drawMultilineText(targetCtx, layer) {
    const lines = String(layer.text || "Texte").split("\n");
    const fontSize = Math.max(6, layer.fontSize || 48);
    const weight = layer.fontWeight || 700;
    const lineHeight = fontSize * 1.2;
    targetCtx.save();
    targetCtx.translate(layer.x || 0, layer.y || 0);
    if (layer.rotation) targetCtx.rotate((layer.rotation * Math.PI) / 180);
    if (layer.mirrorX) targetCtx.scale(-1, 1);
    targetCtx.font = `${weight} ${fontSize}px Inter, system-ui, sans-serif`;
    targetCtx.textBaseline = "top";
    targetCtx.textAlign = "left";
    targetCtx.fillStyle = layer.color || state.settings.color;
    lines.forEach((line, index) => targetCtx.fillText(line || " ", 0, index * lineHeight));
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

  function drawLayer(targetCtx, layer, { preview = false } = {}) {
    if (!layer || layer.visible === false) return;
    if (layer.type === "clear") {
      targetCtx.save(); targetCtx.globalCompositeOperation="destination-out"; targetCtx.fillRect(layer.x,layer.y,layer.w,layer.h); targetCtx.restore(); return;
    }
    if (layer.type === "image") {
      const asset=assets.get(layer.assetId); if(!asset)return;
      targetCtx.save(); targetCtx.globalAlpha*=layer.opacity??1; targetCtx.filter=filterString();
      targetCtx.imageSmoothingEnabled=state.settings.smoothing!==false; targetCtx.imageSmoothingQuality="high";
      targetCtx.translate(layer.x+layer.w/2,layer.y+layer.h/2); targetCtx.rotate((layer.rotation||0)*Math.PI/180);
      targetCtx.scale(layer.mirrorX?-1:1,layer.mirrorY?-1:1); targetCtx.drawImage(asset.image,-layer.w/2,-layer.h/2,layer.w,layer.h); targetCtx.restore(); return;
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

  function drawDocument() {
    if (!state.hasDocument || !state.baseImage) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = state.settings.smoothing !== false;
    ctx.imageSmoothingQuality = "high";
    ctx.filter = filterString();
    ctx.drawImage(state.baseImage, 0, 0, state.width, state.height);
    ctx.filter = "none";
    state.layers.forEach((layer) => drawLayer(ctx, layer));
    ctx.restore();
  }

  function renderAll() {
    drawDocument();
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

    const selected = selectedLayer();
    if (selected && state.tool === "select") drawSelectionOutline(selected);
  }

  function drawSelectionOutline(layer) {
    const box = layerBounds(layer);
    if (!box) return;
    const pad = 5 / state.zoom;
    octx.save();
    octx.strokeStyle = "#ee8426";
    octx.lineWidth = Math.max(1.2 / state.zoom, 1.2);
    octx.setLineDash([5 / state.zoom, 4 / state.zoom]);
    octx.strokeRect(box.x - pad, box.y - pad, box.w + pad * 2, box.h + pad * 2);
    octx.setLineDash([]);
    octx.fillStyle = "#fff";
    octx.strokeStyle = "#e37717";
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
    octx.save();
    const size = Math.max(6, layer.fontSize || 48);
    octx.font = `${layer.fontWeight || 700} ${size}px Inter, system-ui, sans-serif`;
    const lines = String(layer.text || "Texte").split("\n");
    const width = Math.max(...lines.map((line) => octx.measureText(line || " ").width), size * .5);
    const height = lines.length * size * 1.2;
    octx.restore();
    return { width, height };
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
    if (["line", "arrow", "rect", "ellipse", "blur"].includes(layer.type)) {
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
      return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
    }
    return null;
  }

  function selectedLayer() { return state.layers.find((layer) => layer.id === state.selectedId) || null; }

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
    if (["line", "arrow", "rect", "ellipse", "blur"].includes(layer.type)) {
      layer.x1 += dx; layer.y1 += dy; layer.x2 += dx; layer.y2 += dy;
    } else if (["brush", "highlight", "eraser"].includes(layer.type)) {
      (layer.points || []).forEach((point) => { point.x += dx; point.y += dy; });
    } else if (["text", "number", "image", "clear"].includes(layer.type)) {
      layer.x += dx; layer.y += dy;
    }
  }

  function scaleLayer(layer, sx, sy) {
    const avg = Math.sqrt(Math.abs(sx * sy));
    if (["image","clear"].includes(layer.type)) {layer.x*=sx;layer.y*=sy;layer.w*=sx;layer.h*=sy;return;}
    if (["line", "arrow", "rect", "ellipse", "blur"].includes(layer.type)) {
      layer.x1 *= sx; layer.x2 *= sx; layer.y1 *= sy; layer.y2 *= sy;
      if (layer.width) layer.width *= avg;
      if (layer.blur) layer.blur *= avg;
    } else if (["brush", "highlight", "eraser"].includes(layer.type)) {
      (layer.points || []).forEach((point) => { point.x *= sx; point.y *= sy; });
      layer.width *= avg;
    } else if (layer.type === "text") {
      layer.x *= sx; layer.y *= sy; layer.fontSize *= avg;
    } else if (layer.type === "number") {
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
      if (output) output.textContent = key === "hue" ? `${value}°` : `${value} %`;
    });
  }

  async function openImageFile(file) {
    if (!file || !/^image\/(png|jpeg|webp|gif|bmp|x-ms-bmp|svg\+xml)$/i.test(file.type)) {
      toast("Choisissez une image JPG, PNG, WebP, GIF, BMP ou SVG.");
      return;
    }
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
      state.hasDocument = true;
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
    saveActiveDocument();
    width = clamp(Math.round(width), 1, 12000);
    height = clamp(Math.round(height), 1, 12000);
    setBusy(true, "Création…");
    try {
      const blank = document.createElement("canvas"); blank.width = width; blank.height = height;
      const bctx = blank.getContext("2d");
      if (background === "white") { bctx.fillStyle = "#fff"; bctx.fillRect(0, 0, width, height); }
      const asset = await registerAssetFromCanvas(blank);
      state.hasDocument = true; state.assetId = asset.id; state.baseImage = asset.image;
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

  function renderToolOptions() {
    const s = state.settings;
    let html = "";
    if (state.tool === "select") {
      html = `<div class="image-help"><strong>Sélectionner</strong><br>Cliquez sur une image ou une annotation pour la déplacer. Les poignées redimensionnent les images. Flèches : 1 px ; Maj + flèches : 10 px.</div>`;
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
    } else if (state.tool === "text") {
      html = `<label class="image-option-row"><span>Texte</span><textarea data-setting-text="text" placeholder="Votre texte…">${escapeHtml(s.text)}</textarea></label>
      ${optionColor("Couleur", s.color, "color")}
      ${optionRange("Taille", "fontSize", s.fontSize, 10, 220, 1, " px")}
      <div class="image-option-row"><span>Graisse</span><div class="image-option-buttons"><button type="button" data-font-weight="400" class="${s.fontWeight===400?"is-active":""}">Normal</button><button type="button" data-font-weight="700" class="${s.fontWeight===700?"is-active":""}">Gras</button></div></div>
      <div class="image-help">Réglez le texte, puis cliquez sur l’image pour le placer.</div>`;
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
    if (!layer) { selectionOptions.hidden = true; selectionOptions.innerHTML = ""; return; }
    selectionOptions.hidden = false;
    let html = `<div class="image-option-label"><span>Élément sélectionné</span><strong>${escapeHtml(layerLabel(layer))}</strong></div>`;
    if (layer.type === "image") {
      html+=`<div class="image-option-grid">${[["x","X",layer.x],["y","Y",layer.y],["w","Largeur",layer.w],["h","Hauteur",layer.h],["rotation","Angle",layer.rotation||0]].map(([key,label,value])=>`<label class="image-field">${label}<input type="number" data-image-prop="${key}" step="1" value="${Math.round(value)}"></label>`).join("")}</div><label class="image-check-row"><input type="checkbox" data-image-ratio checked>Garder les proportions</label><div class="image-option-grid"><button data-fit-layer="cover">Remplir le cadre</button><button data-fit-layer="contain">Tout conserver</button><button data-fit-layer="center">Centrer</button><button data-fit-layer="original">Taille originale</button><button data-transform-layer="flipX">Miroir horizontal</button><button data-transform-layer="flipY">Miroir vertical</button><button data-transform-layer="rotate">Tourner de 90°</button><button data-duplicate-layer>Dupliquer</button></div>`;
    } else if (layer.type === "text") {
      html += `<label class="image-option-row"><span>Contenu</span><textarea data-selected-text>${escapeHtml(layer.text || "")}</textarea></label>${optionColor("Couleur", layer.color || state.settings.color, "selectedColor")}${optionRange("Taille", "selectedFontSize", layer.fontSize || 48, 8, 260, 1, " px")}`;
    } else if (["line","arrow","rect","ellipse","brush","highlight"].includes(layer.type)) {
      html += `${optionColor("Couleur", layer.color || state.settings.color, "selectedColor")}${optionRange("Épaisseur", "selectedWidth", layer.width || 5, 1, 140, 1, " px")}`;
    } else if (layer.type === "number") {
      html += `${optionColor("Couleur", layer.color || state.settings.color, "selectedColor")}${optionRange("Taille", "selectedRadius", layer.radius || 24, 10, 90, 1, " px")}`;
    } else if (layer.type === "blur") {
      html += `${optionRange("Intensité", "selectedBlur", layer.blur || 12, 2, 40, 1, " px")}`;
    } else if (layer.type === "eraser") {
      html += `${optionRange("Épaisseur", "selectedWidth", layer.width || 20, 1, 160, 1, " px")}`;
    }
    if(layer.type!=="image")html+=`<button class="image-secondary-wide" data-duplicate-layer>Dupliquer cet élément</button>`;
    html += `${layer.type !== "eraser" ? optionRange("Opacité", "selectedOpacity", Math.round((layer.opacity ?? 1) * 100), 5, 100, 1, " %") : ""}<button type="button" class="image-danger-wide" data-delete-selected>Supprimer cet élément</button>`;
    selectionOptions.innerHTML = html;
  }

  function layerLabel(layer) {
    if(layer.type==="image")return layer.name||"Image importée";
    if(layer.type==="clear")return "Découpe transparente";
    const labels = { text:"Texte",brush:"Pinceau",highlight:"Surligneur",eraser:"Gomme",arrow:"Flèche",line:"Ligne",rect:"Rectangle",ellipse:"Ellipse",number:`Numéro ${layer.number || ""}`,blur:"Flou" };
    if (layer.type === "text") return String(layer.text || "Texte").split("\n")[0].slice(0, 32) || "Texte";
    return labels[layer.type] || "Calque";
  }

  function renderLayerList() {
    if (!state.hasDocument) { layerList.innerHTML = '<p class="image-help">Ouvrez une image pour afficher les calques.</p>'; return; }
    const items = [...state.layers].reverse().map((layer) => {
      const index = state.layers.indexOf(layer);
      return `<div class="image-layer ${state.selectedId === layer.id ? "is-selected" : ""}" data-layer-id="${layer.id}">
        <button type="button" class="image-layer-eye" data-layer-visibility="${layer.id}" title="Afficher / masquer">${icon(layer.visible===false?"hidden":"eye")}</button>
        <button type="button" class="image-layer-main" data-select-layer="${layer.id}"><strong>${escapeHtml(layerLabel(layer))}</strong><small>${escapeHtml(TOOL_LABELS[layer.type] || layer.type)}</small></button>
        <div class="image-layer-actions"><button type="button" data-layer-lock="${layer.id}" title="${layer.locked?"Déverrouiller":"Verrouiller"}" aria-label="${layer.locked?"Déverrouiller":"Verrouiller"}">${icon(layer.locked?"lock":"unlock")}</button><button type="button" data-layer-up="${layer.id}" ${index === state.layers.length - 1 ? "disabled" : ""} title="Monter" aria-label="Monter le calque">↑</button><button type="button" data-layer-down="${layer.id}" ${index === 0 ? "disabled" : ""} title="Descendre" aria-label="Descendre le calque">↓</button><button type="button" data-layer-delete="${layer.id}" title="Supprimer" aria-label="Supprimer le calque">${icon("trash")}</button></div>
      </div>`;
    }).join("");
    layerList.innerHTML = `${items}<div class="image-layer image-layer-base"><span class="image-layer-eye">${icon("image")}</span><div class="image-layer-main"><strong>Fond</strong><small>Toile du document</small></div><div></div></div>`;
  }

  function selectLayer(id) {
    state.selectedId = id || null;
    if (id) setTool("select");
    renderOverlay(); renderLayerList(); renderSelectionOptions();
  }

  function deleteSelected() {
    if (!state.selectedId || selectedLayer()?.locked) return;
    const index = state.layers.findIndex((layer) => layer.id === state.selectedId);
    if (index < 0) return;
    state.layers.splice(index, 1); state.selectedId = null;
    renderAll(); renderLayerList(); renderSelectionOptions(); pushHistory();
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
    if (["line","arrow","rect","ellipse","blur"].includes(type)) return { ...base, x1:start.x,y1:start.y,x2:start.x,y2:start.y, fill: state.settings.fill, blur: state.settings.blur };
    return base;
  }

function onPointerDown(event) {
    if(!state.hasDocument||busy||event.button>0)return;
    const p=pointFromEvent(event),point={x:clamp(p.x,0,state.width),y:clamp(p.y,0,state.height)};
    overlay.setPointerCapture?.(event.pointerId);event.preventDefault();
    if(state.tool==="hand"||state.spacePan){state.interaction={type:"pan",x:event.clientX,y:event.clientY,left:stage.scrollLeft,top:stage.scrollTop};return;}
    if(state.tool==="eyedropper"){const c=ctx.getImageData(clamp(Math.floor(point.x),0,state.width-1),clamp(Math.floor(point.y),0,state.height-1),1,1).data;state.settings.color="#"+[...c].slice(0,3).map(v=>v.toString(16).padStart(2,"0")).join("");renderToolOptions();toast(`Couleur : ${state.settings.color}`);return;}
    if(state.tool==="marquee"){state.marquee={x1:point.x,y1:point.y,x2:point.x,y2:point.y};state.interaction={type:"marquee",start:point};renderOverlay();return;}
    if(state.tool==="select"){
      const current=selectedLayer(),box=layerBounds(current);
      if(current?.type==="image"&&!current.locked&&box){const corners=[[box.x,box.y],[box.x+box.w,box.y],[box.x,box.y+box.h],[box.x+box.w,box.y+box.h]],index=corners.findIndex(([x,y])=>Math.hypot(p.x-x,p.y-y)<10/state.zoom);if(index>=0){state.interaction={type:"image-size",original:deepClone(current),box,index,anchor:corners[3-index]};return;}}
      const layer=hitLayer(point);state.selectedId=layer?.id||null;
      state.interaction=layer?{type:"move",layerId:layer.id,last:p,moved:false}:null;
      renderOverlay();renderLayerList();renderSelectionOptions();return;
    }
    if(state.tool==="crop"){
      const r=state.crop&&normalizedRect(state.crop.x1,state.crop.y1,state.crop.x2,state.crop.y2);
      if(r&&point.x>r.x&&point.x<r.x+r.w&&point.y>r.y&&point.y<r.y+r.h)state.interaction={type:"crop-move",start:point,original:r};
      else{state.crop={x1:point.x,y1:point.y,x2:point.x,y2:point.y};state.interaction={type:"crop",start:point};}
      renderOverlay();renderToolOptions();return;
    }
    if(state.tool==="text"||state.tool==="number"){
      const layer=state.tool==="text"?{id:uid(),type:"text",visible:true,opacity:state.settings.opacity,color:state.settings.color,x:point.x,y:point.y,text:state.settings.text||"Texte",fontSize:state.settings.fontSize,fontWeight:state.settings.fontWeight,rotation:0,mirrorX:false}:{id:uid(),type:"number",visible:true,opacity:1,color:state.settings.color,x:point.x,y:point.y,radius:state.settings.numberSize,number:state.nextNumber++,rotation:0,mirrorX:false};
      state.layers.push(layer);state.selectedId=layer.id;pushHistory();if(state.tool==="text")setTool("select");refreshLayers();return;
    }
    state.draftLayer=createDraft(state.tool,point);state.interaction={type:"draw",start:point};renderOverlay();
  }

function onPointerMove(event) {
    if(!state.hasDocument||!state.interaction)return;const i=state.interaction,p=pointFromEvent(event),point={x:clamp(p.x,0,state.width),y:clamp(p.y,0,state.height)};
    if(i.type==="pan"){stage.scrollLeft=i.left-(event.clientX-i.x);stage.scrollTop=i.top-(event.clientY-i.y);return;}
    if(i.type==="move"){const l=state.layers.find(l=>l.id===i.layerId);if(!l)return;const dx=p.x-i.last.x,dy=p.y-i.last.y;i.moved||=Math.abs(dx)+Math.abs(dy)>.05;translateLayer(l,dx,dy);i.last=p;renderAll();return;}
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
    if(["move","image-size"].includes(i.type)&&i.moved)pushHistory();
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

  function setZoom(value, keepCenter = true) {
    if (!state.hasDocument) return;
    const old = state.zoom;
    value = clamp(value, .04, 32);
    if (Math.abs(value - old) < .001) return;
    const centerX = stage.scrollLeft + stage.clientWidth / 2;
    const centerY = stage.scrollTop + stage.clientHeight / 2;
    const ratio = value / old;
    state.zoom = value; updateCanvasCssSize();
    if (keepCenter) requestAnimationFrame(() => { stage.scrollLeft = centerX * ratio - stage.clientWidth / 2; stage.scrollTop = centerY * ratio - stage.clientHeight / 2; });
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

  function updateExportSummary() {
    if (!state.hasDocument) return;
    const maxWidth = Number($("[data-export-maxwidth]")?.value || 0);
    const width = maxWidth > 0 && state.width > maxWidth ? Math.round(maxWidth) : state.width;
    const height = Math.round(state.height * (width / state.width));
    const format = $("[data-export-format]")?.value || "image/webp";
    const quality = Number($("[data-export-quality]")?.value || 82);
    const label = format === "image/png" ? "PNG" : format === "image/jpeg" ? "JPG" : "WebP";
    $("[data-export-summary]").textContent = `${width} × ${height} px · ${label}${format === "image/png" ? "" : ` · ${quality} %`}`;
    $("[data-export-quality]").disabled = format === "image/png";
    $("[data-export-quality-label]").textContent = format === "image/png" ? "sans perte" : `${quality} %`;
  }

  async function exportImage() {
    if (!state.hasDocument || busy) return;
    const format = $("[data-export-format]").value;
    const quality = Number($("[data-export-quality]").value) / 100;
    const maxWidth = Number($("[data-export-maxwidth]").value || 0);
    const name = fileBaseName($("[data-export-name]").value || state.name || "image-philosophal");
    const width = maxWidth > 0 && state.width > maxWidth ? Math.round(maxWidth) : state.width;
    const height = Math.max(1, Math.round(state.height * (width / state.width)));
    setBusy(true, "Export…");
    try {
      drawDocument();
      const out = document.createElement("canvas"); out.width = width; out.height = height;
      const outCtx = out.getContext("2d");
      if (format === "image/jpeg") { outCtx.fillStyle = "#fff"; outCtx.fillRect(0, 0, width, height); }
      outCtx.imageSmoothingEnabled = state.settings.smoothing !== false; outCtx.imageSmoothingQuality = "high";
      outCtx.drawImage(canvas, 0, 0, width, height);
      const blob = await canvasToBlob(out, format, format === "image/png" ? undefined : quality);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const ext = format === "image/png" ? "png" : format === "image/jpeg" ? "jpg" : "webp";
      link.href = url; link.download = `${name}.${ext}`; document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1600);
      exportDialog.close();
      toast(`Image exportée · ${(blob.size / 1024).toFixed(blob.size > 1024*1024 ? 0 : 1)} Ko`);
    } catch (_) { toast("L’export n’a pas pu être créé."); }
    finally { setBusy(false); }
  }

  function openExportDialog() {
    if (!state.hasDocument) { toast("Ouvrez d’abord une image."); return; }
    $("[data-export-name]").value = state.name || "image-philosophal";
    updateExportSummary();
    exportDialog.showModal();
  }

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
    if (target.matches("[data-select-layer]")) selectLayer(target.dataset.selectLayer);
    if (target.matches("[data-layer-visibility]")) { const layer=state.layers.find(l=>l.id===target.dataset.layerVisibility); if(layer){layer.visible=layer.visible===false;renderAll();renderLayerList();pushHistory();} }
    if (target.matches("[data-layer-up]")) changeLayerOrder(target.dataset.layerUp, 1);
    if (target.matches("[data-layer-down]")) changeLayerOrder(target.dataset.layerDown, -1);
    if (target.matches("[data-layer-delete]")) { state.selectedId=target.dataset.layerDelete; deleteSelected(); }
    if (target.matches("[data-reset-adjustments]")) { state.adjust={ ...defaultAdjust };syncAdjustmentControls();renderAll();pushHistory(); }
    if (target.matches("[data-preset]")) {
      const preset=target.dataset.preset;
      if(preset==="clean") state.adjust={...defaultAdjust,brightness:104,contrast:108,saturation:104};
      if(preset==="soft") state.adjust={...defaultAdjust,brightness:106,contrast:94,saturation:92};
      if(preset==="bw") state.adjust={...defaultAdjust,brightness:102,contrast:112,grayscale:100};
      if(preset==="warm") state.adjust={...defaultAdjust,brightness:104,contrast:105,saturation:88,sepia:42};
      if(preset==="cool") state.adjust={...defaultAdjust,brightness:103,contrast:104,saturation:105,hue:15};
      if(preset==="reset") state.adjust={ ...defaultAdjust };
      syncAdjustmentControls();renderAll();pushHistory();
    }
    if(target.matches("[data-export-preset]")){const preset=target.dataset.exportPreset;$("[data-export-format]").value=preset==="transparent"?"image/png":preset==="photo"?"image/jpeg":"image/webp";$("[data-export-quality]").value=preset==="photo"?92:82;$("[data-export-maxwidth]").value=preset==="web"?1600:0;updateExportSummary();}
    if (target.matches("[data-export-web]")) { $("[data-export-format]").value="image/webp";$("[data-export-quality]").value=82;$("[data-export-maxwidth]").value=1600;updateExportSummary(); }
    if (target.matches("[data-new-preset]")) { const [w,h]=target.dataset.newPreset.split("x");$("[data-new-width]").value=w;$("[data-new-height]").value=h;$("[data-export-format]").value=target.dataset.presetMime || "image/png"; }
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (target.matches("[data-setting-range]")) {
      if (applySelectedInput(target)) return;
      changeSettingFromInput(target);
    }
    if (target.matches("[data-setting-text='text']")) state.settings.text = target.value;
    if (target.matches("[data-selected-text]")) { applySelectedInput(target); }
    if (target.matches("[data-setting-color]")) {
      const key = target.dataset.settingColor;
      if (key === "selectedColor") { const layer=selectedLayer(); if(layer){layer.color=target.value; const text=$(`[data-setting-textcolor="selectedColor"]`); if(text)text.value=target.value; renderAll();} }
      else { state.settings[key] = target.value; const text=$(`[data-setting-textcolor="${key}"]`); if(text)text.value=target.value; }
    }
    if (target.matches("[data-setting-textcolor]")) {
      const key=target.dataset.settingTextcolor; if(/^#[0-9a-f]{6}$/i.test(target.value)){ if(key==="selectedColor"){const layer=selectedLayer();if(layer){layer.color=target.value;renderAll();}}else{state.settings[key]=target.value;const color=$(`[data-setting-color="${key}"]`);if(color)color.value=target.value;} }
    }
    if (target.matches("[data-adjust]")) {
      const key=target.dataset.adjust; state.adjust[key]=Number(target.value); $(`[data-adjust-output="${key}"]`).textContent=key==="hue"?`${target.value}°`:`${target.value} %`; renderAll();
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
    if (target.matches("[data-adjust]")) pushHistory();
    if (target.matches("[data-selected-text],[data-setting-range^='selected']")) pushHistory();
    if (target.matches("[data-setting-color='selectedColor'],[data-setting-textcolor='selectedColor']")) pushHistory();
    if (target.matches("[data-fill-toggle]")) { state.settings.fill = target.checked ? ($('[data-setting-color="fill"]')?.value || "#ffffff") : "transparent"; }
    if (target.matches("[data-a4-orientation],[data-a4-dpi],[data-a4-mode],[data-a4-background]")) updateA4Preview();
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

    if (event.altKey && !event.ctrlKey && !event.metaKey && key === "c") { event.preventDefault(); go("/mediatheque/"); return; }
    if (event.altKey && !event.ctrlKey && !event.metaKey && key === "h") { event.preventDefault(); go("/"); return; }
    if (!typing && !event.altKey && !event.ctrlKey && !event.metaKey && key === "h") { event.preventDefault(); go("/"); return; }
    if (!typing && !event.altKey && !event.ctrlKey && !event.metaKey && key === "p") { event.preventDefault(); go("/pomodoro/"); return; }

    if(typing||document.querySelector("dialog[open]"))return;
    if(mod&&key==="c"){event.preventDefault();copySelection();return;}
    if(mod&&key==="x"){event.preventDefault();copySelection(true);return;}
    if(mod&&key==="v"&&state.clipboard){event.preventDefault();pasteLayer();return;}
    if(mod&&key==="d"){event.preventDefault();duplicateLayer();return;}
    if(mod&&key==="a"&&state.hasDocument){event.preventDefault();setTool("marquee");state.marquee={x1:0,y1:0,x2:state.width,y2:state.height};renderOverlay();return;}
    if(event.code==="Space"){event.preventDefault();state.spacePan=true;updateCanvasCursor();return;}
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.key)&&selectedLayer()&&!selectedLayer().locked){event.preventDefault();const d=event.shiftKey?10:1;translateLayer(selectedLayer(),event.key==="ArrowLeft"?-d:event.key==="ArrowRight"?d:0,event.key==="ArrowUp"?-d:event.key==="ArrowDown"?d:0);refreshLayers();pushHistory();return;}
    if (mod && key === "o") { event.preventDefault(); fileInput.click(); return; }
    if (mod && key === "z" && !event.shiftKey) { event.preventDefault(); undo(); return; }
    if ((mod && key === "y") || (mod && event.shiftKey && key === "z")) { event.preventDefault(); redo(); return; }
    if (typing) return;
    if (event.key === "Delete" || event.key === "Backspace") { if(state.selectedId){event.preventDefault();deleteSelected();} return; }
    if (event.key === "Escape") { if(state.marquee){state.marquee=null;renderOverlay();}else if(state.crop){state.crop=null;renderOverlay();renderToolOptions();} else if(state.selectedId){state.selectedId=null;renderOverlay();renderLayerList();renderSelectionOptions();} else {closeInspector();closeMobileSheet();} return; }
    if (key === "f") { event.preventDefault(); toggleFullscreen(); return; }
    const shortcuts = { s:"marquee",i:"eyedropper",v:"select",c:"crop",t:"text",b:"brush",m:"highlight",x:"eraser",a:"arrow",l:"line",r:"rect",e:"ellipse",n:"number",u:"blur" };
    if (shortcuts[key]) { event.preventDefault(); setTool(shortcuts[key]); }
  }, true);

  window.addEventListener("resize", () => { if(state.hasDocument && state.zoom <= 1)setTimeout(()=>{ if(window.innerWidth<=620) fitZoom(); },80); });
  document.addEventListener("fullscreenchange", () => { if(!document.fullscreenElement){document.body.classList.remove("image-fullscreen");$$('[data-fullscreen]').forEach(b=>b.setAttribute("aria-pressed","false"));setTimeout(fitZoom,70);} });

  window.addEventListener("beforeunload", () => { saveActiveDocument(); assets.forEach((asset) => { if(asset.revoke) try{URL.revokeObjectURL(asset.src);}catch(_){}}); });

  const icon = name => window.PhilosophalIcons.svg(name);
  function refreshLayers(){renderAll();renderLayerList();renderSelectionOptions();updateStatus();}
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
  function duplicateLayer(){const l=selectedLayer();if(!l||busy)return;const copy=deepClone(l);copy.id=uid();copy.locked=false;translateLayer(copy,Math.min(12,state.width*.05),Math.min(12,state.height*.05));state.layers.push(copy);state.selectedId=copy.id;refreshLayers();pushHistory();}
  async function copySelection(cut=false){
    if(!state.hasDocument||busy)return;
    if(state.marquee){
      const r=normalizedRect(state.marquee.x1,state.marquee.y1,state.marquee.x2,state.marquee.y2),x=clamp(Math.floor(r.x),0,state.width-1),y=clamp(Math.floor(r.y),0,state.height-1),w=clamp(Math.round(r.w),1,state.width-x),h=clamp(Math.round(r.h),1,state.height-y);
      if(r.w<1||r.h<1){toast("Tracez d’abord une zone à copier.");return;}
      setBusy(true,"Copie de la sélection…");
      try{drawDocument();const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(canvas,x,y,w,h,0,0,w,h);const a=await registerAssetFromCanvas(c);
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
  function openFormatDialog(){if(!state.hasDocument||busy){toast("Ouvrez d’abord une image.");return;}drawDocument();formatSource=document.createElement("canvas");formatSource.width=state.width;formatSource.height=state.height;formatSource.getContext("2d").drawImage(canvas,0,0);$('[data-format-scale]').value=100;$('[data-format-x]').value=0;$('[data-format-y]').value=0;$('[data-format-dialog]').showModal();renderFormatPreview();}
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
  stage.addEventListener('wheel',e=>{if((e.ctrlKey||e.metaKey)&&state.hasDocument){e.preventDefault();setZoom(state.zoom*Math.exp(-e.deltaY*.002));}},{passive:false});

  renderToolOptions();
  renderLayerList();
  renderDocumentTabs();
  updateHistoryButtons();
  updateStatus();
})();
