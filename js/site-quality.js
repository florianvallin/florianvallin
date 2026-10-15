/* Sécurité des pages, nettoyage des textes et activation volontaire des médias. */
(() => {
  'use strict';
  const VERSION = '20261014-audit1';
  if (window.PHILOSOPHAL_QUALITY?.version === VERSION) { window.PHILOSOPHAL_QUALITY.refresh(); return; }
  const cleanText = value => String(value).replace(/[\u00ad\u034f\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufeff]/g, '').replace(/[\u00a0\u202f]/g, ' ');
  function upgradeDestination(value) {
    const url = new URL(value);
    if (url.protocol !== 'http:' || !['philosophal.fr', 'www.philosophal.fr', 'florianvallin.github.io'].includes(url.hostname)) return '';
    url.protocol = 'https:';
    return url.href;
  }
  function mediaHost(value) {
    try {
      const url = new URL(value, location.href);
      if (!['http:', 'https:'].includes(url.protocol) || url.origin === location.origin) return '';
      return url.hostname.toLowerCase();
    } catch { return ''; }
  }
  const redirect = upgradeDestination(location.href);
  if (redirect) { location.replace(redirect); return; }
  const production = ['philosophal.fr', 'www.philosophal.fr', 'florianvallin.github.io'].includes(location.hostname);
  if (production && location.protocol === 'https:' && !document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy'; meta.content = 'upgrade-insecure-requests'; document.head.append(meta);
  }
  const protectedText = 'script,style,pre,code,textarea,input,[contenteditable],.editor-paper,.editor-canvas,.image-canvas';
  function tidy(root) {
    if (!root || root.nodeType === 1 && root.closest?.(protectedText)) return;
    const visit = node => {
      if (node.parentElement?.closest(protectedText)) return;
      const next = cleanText(node.data);
      if (next !== node.data) node.data = next;
    };
    if (root.nodeType === 3) { visit(root); return; }
    const walker = document.createTreeWalker(root, 4);
    let node;
    while ((node = walker.nextNode())) visit(node);
  }
  function gate(frame) {
    const src = frame.getAttribute('data-external-src') || frame.getAttribute('src');
    const host = src && mediaHost(src);
    if(src&&!host&&frame.hasAttribute('data-external-src')){
      try{if(['http:','https:','blob:','data:','about:'].includes(new URL(src,location.href).protocol)){frame.removeAttribute('data-external-src');frame.src=src;}}catch{}
      return;
    }
    if (!host || frame.dataset.externalApproved === 'true' || frame._phMediaGate || !frame.parentElement) return;
    frame.setAttribute('data-external-src', src); frame.removeAttribute('src'); frame.hidden = true;
    frame.parentElement.classList.add('ph-media-pending');
    const panel = document.createElement('div'); panel.className = 'ph-media-consent';
    const title = document.createElement('strong'); title.textContent = 'Lire ce média externe';
    const text = document.createElement('p'); text.textContent = `En activant ce lecteur, vous contactez ${host}, qui applique sa propre politique de confidentialité.`;
    const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Activer le lecteur';
    const link = document.createElement('a'); link.href = src; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Ouvrir dans un nouvel onglet';
    button.addEventListener('click', () => {
      frame.dataset.externalApproved = 'true'; frame.hidden = false; frame.src = src;
      frame.parentElement.classList.remove('ph-media-pending'); panel.remove(); frame._phMediaGate = null;
    }, {once: true});
    panel.append(title, text, button, link); frame.before(panel); frame._phMediaGate = panel;
  }
  function refresh(root = document.documentElement) {
    tidy(root);
    const frames = [...(root.matches?.('iframe') ? [root] : []), ...root.querySelectorAll('iframe')];
    frames.forEach(gate);
    root.querySelectorAll('a[target="_blank"]').forEach(link => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener'); rel.add('noreferrer'); link.setAttribute('rel', [...rel].join(' '));
    });
  }
  // Couvre aussi les lecteurs créés par les pages privées après déchiffrement.
  const proto = window.HTMLIFrameElement?.prototype;
  const descriptor = proto && Object.getOwnPropertyDescriptor(proto, 'src');
  if (descriptor?.set) {
    Object.defineProperty(proto, 'src', {...descriptor, set(value) {
      if (mediaHost(value) && this.dataset.externalApproved !== 'true') this.setAttribute('data-external-src', String(value));
      else descriptor.set.call(this, value);
    }});
    const original = proto.setAttribute;
    proto.setAttribute = function(name, value) {
      if (String(name).toLowerCase() === 'src' && mediaHost(value) && this.dataset.externalApproved !== 'true') name = 'data-external-src';
      return original.call(this, name, value);
    };
  }
  window.PHILOSOPHAL_QUALITY = Object.freeze({version: VERSION, cleanText, upgradeDestination, mediaHost, refresh});
  function mount() {
    refresh();
    if (typeof MutationObserver !== 'undefined') {
      const queued = new Set(); let pending = false;
      const flush = () => {pending = false; for (const node of queued) {
        if (node.isConnected) {if (node.nodeType === 3) tidy(node); else if (node.nodeType === 1) refresh(node);}
      } queued.clear();};
      new MutationObserver(records => {
        for (const record of records) {
          if (record.type === 'characterData' || record.type === 'attributes') queued.add(record.target);
          else for (const node of record.addedNodes) queued.add(node);
        }
        if (!pending && queued.size) {pending = true; queueMicrotask(flush);}
      }).observe(document, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['data-external-src']});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once: true}); else mount();
})();
