(() => {
  "use strict";

  // La carte emploie la même taille, les mêmes colonnes et les mêmes styles
  // que le lecteur. Aucun découpage arbitraire en nombre de caractères.
  async function build({ blob, width, height, options, configure, cancelled, onProgress }) {
    const host = document.createElement("div");
    host.className = "reader-pagination-host";
    host.style.width = `${width}px`;
    host.style.height = `${height}px`;
    host.setAttribute("aria-hidden", "true");
    host.inert = true;
    document.body.appendChild(host);
    let book, view;
    const pages = [];
    try {
      book = window.ePub(await blob.arrayBuffer());
      await book.ready;
      view = book.renderTo(host, {
        ...options, width, height, manager: "default", flow: "paginated",
        allowScriptedContent: false, resizeOnOrientationChange: false
      });
      configure(view);
      const sections = [];
      book.spine.each(section => { if (section.linear !== "no") sections.push(section); });
      for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex += 1) {
        if (cancelled()) return [];
        const section = sections[sectionIndex];
        await view.display(section.href);
        const contents = view.getContents()[0];
        const doc = contents?.document;
        if (!doc?.body) continue;
        await doc.fonts?.ready;
        await Promise.all([...doc.images].map(image => image.decode?.().catch(() => {}) || Promise.resolve()));
        if (cancelled()) return [];
        const frameView = view.manager.views.first();
        frameView?.expand?.();
        const layout = view.manager.layout;
        const step = Math.max(1, layout.pageWidth || width);
        const count = Math.max(1, Math.round((frameView?.width?.() || contents.scrollWidth()) / step));
        const thumbs = await miniatureColumns(doc, step, height, count, cancelled);
        for (let column = 0; column < count; column += 1) {
          const mapped = view.manager.mapping.page(contents, section.cfiBase, column * step, (column + 1) * step);
          pages.push({
            index: pages.length, number: pages.length + 1, kind: "epub-page",
            sectionIndex: section.index, column, href: section.href,
            cfi: mapped.start, endCfi: mapped.end, thumbUrl: thumbs[column],
            title: `Page ${pages.length + 1}`, locator: { type: "epub", cfi: mapped.start }
          });
        }
        onProgress?.(sectionIndex + 1, sections.length, pages.length);
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      return pages.map(page => ({ ...page, total: pages.length,
        ratio: pages.length <= 1 ? 0 : page.index / (pages.length - 1) }));
    } finally {
      try { view?.destroy(); } catch (_) {}
      try { book?.destroy(); } catch (_) {}
      host.remove();
    }
  }

  async function miniatureColumns(doc, width, height, count, cancelled) {
    const scale = Math.min(220 / width, 320 / height, 1);
    const palette = doc.defaultView.getComputedStyle(doc.body);
    const sheets = Array.from({ length: count }, () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      ctx.fillStyle = palette.backgroundColor === "rgba(0, 0, 0, 0)" ? "#fffdf9" : palette.backgroundColor;
      ctx.fillRect(0, 0, width, height);
      ctx.textBaseline = "alphabetic";
      return { canvas, ctx };
    });
    const rtl = palette.direction === "rtl";
    const locate = rect => {
      const column = rtl ? Math.floor(Math.abs(rect.right - width) / width) : Math.floor(Math.max(0, rect.left + .1) / width);
      const offset = rtl ? -column * width : column * width;
      return { sheet: sheets[column], x: rect.left - offset, y: rect.top };
    };
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    let node, processed = 0;
    while ((node = walker.nextNode())) {
      if (cancelled()) return [];
      if (!node.textContent.trim() || node.parentElement?.closest("script,style,noscript")) continue;
      const style = doc.defaultView.getComputedStyle(node.parentElement);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      for (const match of node.textContent.matchAll(/\S+/gu)) {
        const range = doc.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const rect = range.getClientRects()[0];
        if (!rect || !rect.width || !rect.height) continue;
        const { sheet, x, y } = locate(rect);
        if (!sheet) continue;
        sheet.ctx.font = font;
        sheet.ctx.fillStyle = style.color;
        sheet.ctx.direction = style.direction;
        sheet.ctx.textAlign = style.direction === "rtl" ? "right" : "left";
        sheet.ctx.fillText(match[0], style.direction === "rtl" ? x + rect.width : x, y + rect.height * .8);
      }
      if (++processed % 100 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    }
    for (const image of doc.images) {
      if (!image.complete || !image.naturalWidth) continue;
      const rect = image.getBoundingClientRect();
      const { sheet, x, y } = locate(rect);
      if (sheet) { try { sheet.ctx.drawImage(image, x, y, rect.width, rect.height); } catch (_) {} }
    }
    return sheets.map(({ canvas }) => {
      try { return canvas.toDataURL("image/webp", .72); } catch (_) { return null; }
    });
  }

  function indexAt(pages, cfi) {
    if (!pages.length || !cfi) return -1;
    try {
      const compare = new window.ePub.CFI().compare.bind(new window.ePub.CFI());
      let low = 0, high = pages.length - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (compare(pages[mid].cfi, cfi) <= 0) low = mid + 1;
        else high = mid - 1;
      }
      return Math.max(0, high);
    } catch (_) { return -1; }
  }
  window.PhilosophalPagination = { build, indexAt };
})();
