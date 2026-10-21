/* Philosophal — PDF + CBR (traitement dans le navigateur, sans envoi des documents). */
(() => {
  'use strict';
  const PDF_JS_URL = '/epub/vendor/pdfjs/pdf.min.js';
  const PDF_WORKER_URL = '/epub/vendor/pdfjs/pdf.worker.min.js';
  let pdfjsPromise = null;

  async function ensurePDFJS() {
    if (window.pdfjsLib?.getDocument) return window.pdfjsLib;
    if (!pdfjsPromise) {
      pdfjsPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = PDF_JS_URL;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = () => window.pdfjsLib?.getDocument
          ? resolve(window.pdfjsLib) : reject(new Error('Moteur PDF indisponible.'));
        script.onerror = () => reject(new Error('Moteur PDF non chargé (connexion indisponible).'));
        document.head.appendChild(script);
      }).catch(error => { pdfjsPromise = null; throw error; });
    }
    return pdfjsPromise;
  }

  async function makePdfBook(blob, onProgress) {
    const pdfjs = await ensurePDFJS();
    pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
    // Le contenu ne quitte pas le navigateur : on fournit les octets localement.
    const data = new Uint8Array(await blob.arrayBuffer());
    if (String.fromCharCode(...data.slice(0, 5)) !== '%PDF-') throw new Error('Le fichier PDF est invalide.');
    const task = pdfjs.getDocument({ data, isEvalSupported: false, useSystemFonts: true });
    const pdf = await task.promise;
    if (pdf.numPages < 1) throw new Error('Ce PDF ne contient aucune page.');
    const pdfMetadata = await pdf.getMetadata().catch(() => ({}));
    const info = pdfMetadata?.info || {};
    const firstPage = await pdf.getPage(1);
    const firstViewport = firstPage.getViewport({ scale: 1 });
    const createdUrls = new Set();
    const cache = new Map();
    const makeSection = index => ({
      id: index,
      href: `page-${index + 1}`,
      philosophalSize: { width: firstViewport.width, height: firstViewport.height },
      load: async () => {
        if (cache.has(index)) return cache.get(index);
        const page = await pdf.getPage(index + 1);
        const original = page.getViewport({ scale: 1 });
        // Garde une résolution convenable en contrôlant la mémoire, même sur mobile.
        const scale = Math.min(2.2, Math.max(1, 1780 / Math.max(original.width, original.height)));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error('Impossible de préparer la page PDF.');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: context, viewport }).promise;
        const rendered = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .91));
        canvas.width = 0;
        canvas.height = 0;
        if (!rendered) throw new Error('Impossible de convertir la page PDF en image.');
        const url = URL.createObjectURL(rendered);
        createdUrls.add(url);
        cache.set(index, url);
        if (cache.size > 5) {
          const [oldIndex, oldUrl] = cache.entries().next().value;
          cache.delete(oldIndex);
          URL.revokeObjectURL(oldUrl);
          createdUrls.delete(oldUrl);
        }
        return url;
      },
      unload() { /* Le cache borné gère les URL ; les pages actives restent disponibles. */ }
    });
    const book = {
      metadata: { title: info.Title || '', author: info.Author || '', language: '' },
      getTextPage: async index => {
        const page = await pdf.getPage(index + 1);
        const content = await page.getTextContent();
        return (content.items || []).map(item => item.str || '').join(' ');
      },
      sections: Array.from({ length: pdf.numPages }, (_, index) => makeSection(index)),
      rendition: { layout: 'pre-paginated', spread: 'auto' },
      toc: [],
      resolveHref: href => ({ index: Math.max(0, Math.min(pdf.numPages - 1, Number(String(href).replace(/[^\d]/g, '')) - 1 || 0)) }),
      destroy() {
        for (const url of createdUrls) URL.revokeObjectURL(url);
        createdUrls.clear(); cache.clear();
        pdf.destroy().catch(() => {});
      }
    };
    // Construction d'un sommaire naturel par page ; on conserve les marque-pages PDF si disponibles.
    const outline = await pdf.getOutline().catch(() => null);
    if (outline?.length) {
      const flatten = async (items, depth = 0) => {
        for (const item of items) {
          let dest = item.dest;
          if (typeof dest === 'string') dest = await pdf.getDestination(dest).catch(() => null);
          let index = 0;
          if (Array.isArray(dest) && dest[0]) index = await pdf.getPageIndex(dest[0]).catch(() => 0);
          book.toc.push({ label: item.title || `Page ${index + 1}`, href: `page-${index + 1}`, depth });
          if (item.items?.length) await flatten(item.items, depth + 1);
        }
      };
      await flatten(outline);
    } else {
      book.toc = Array.from({length: Math.min(pdf.numPages, 250)}, (_, index) => ({label:`Page ${index + 1}`,href:`page-${index + 1}`}));
    }
    onProgress?.(pdf.numPages);
    return book;
  }

  window.PhilosophalFormats = Object.freeze({ makePdfBook, convertCBR: (...args) => window.PhilosophalFormats.prepareImport(...args) });
})();
