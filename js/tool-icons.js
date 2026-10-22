/* Icônes vectorielles locales : un trait cohérent, accompagné de libellés. */
(() => {
  'use strict';
  const paths = {
    select:'<path d="m5 3 14 11-7 1-3 7z"/>',
    marquee:'<rect x="4" y="4" width="16" height="16" rx="1" stroke-dasharray="3 3"/>',
    crop:'<path d="M7 3v14h14M3 7h14v14M17 7l4-4"/>',
    text:'<path d="M4 6V4h16v2M12 4v16M8 20h8"/>',
    brush:'<path d="m14 4 3-2 5 5-2 3-9 9-6-6zM5 13c-4 0-1 6-4 7 5 2 10-1 9-4"/>',
    highlight:'<path d="m14 3 7 7-9 9-7-7zM5 12l-3 5 5 5 5-3M2 22h12"/>',
    eraser:'<path d="m13 3 8 8-10 10H6l-5-5zM6 11l8 8M11 21h11"/>',
    arrow:'<path d="M4 20 20 4M10 4h10v10"/>',
    line:'<path d="M4 20 20 4"/><circle cx="4" cy="20" r="1"/><circle cx="20" cy="4" r="1"/>',
    rect:'<rect x="4" y="5" width="16" height="14" rx="1"/>',
    ellipse:'<ellipse cx="12" cy="12" rx="9" ry="7"/>',
    number:'<circle cx="12" cy="12" r="9"/><path d="m9 9 3-2v10M9 17h6"/>',
    blur:'<path d="M4 4h16v16H4z"/><path d="M8 4v16M12 4v16M16 4v16M4 8h16M4 12h16M4 16h16" stroke-dasharray="1 3"/>',
    eyedropper:'<path d="m15 3 6 6-3 3-6-6zM13 7 3 17v4h4L17 11M5 15l4 4"/>',
    hand:'<path d="M5 12V7a2 2 0 0 1 4 0V5a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v7c0 5-3 7-7 7H11c-3 0-4-2-6-5l-3-4c-1-2 1-4 3-1l2 2"/>',
    image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="2"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
    duplicate:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    undo:'<path d="m8 3-5 5 5 5M3 8h11a7 7 0 0 1 0 14"/>',
    redo:'<path d="m16 3 5 5-5 5M21 8H10a7 7 0 0 0 0 14"/>',
    rotate:'<path d="M20 8a9 9 0 1 0 1 7M20 3v5h-5"/>',
    flip:'<path d="M12 2v20M8 5 2 19h6zM16 5l6 14h-6z"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    hidden:'<path d="m3 3 18 18M9 5a11 11 0 0 1 13 7l-3 4M6 6a18 18 0 0 0-4 6s4 7 10 7l4-1M10 10l4 4"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    unlock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0M12 14v3"/>',
    trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
    organize:'<rect x="3" y="3" width="7" height="8" rx="1"/><rect x="14" y="3" width="7" height="8" rx="1"/><rect x="3" y="15" width="7" height="6" rx="1"/><path d="M14 18h7m-3-3 3 3-3 3"/>',
    merge:'<path d="M3 3h7v8H3zM14 3h7v8h-7zM6 14l6 5 6-5M12 19v3"/>',
    split:'<path d="M7 3h10v8H7zM12 11v4M4 21v-6h16v6M1 21h6M17 21h6"/>',
    compress:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="m2 2 4 4M2 6h4V2m16 0-4 4m0-4v4h4M2 22l4-4m-4 0h4v4m16 0-4-4m0 4v-4h4"/>',
    compose:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M6 7h5v10H6zM14 7h4v10h-4z"/>',
    interleave:'<path d="M3 3h6v6H3zM15 3h6v6h-6zM7 12l5 4 5-4M3 19h18M12 16v5"/>',
    nup:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M3 12h18"/>',
    resize:'<rect x="8" y="8" width="13" height="13" rx="1"/><path d="M3 16V3h13M3 3l7 7M3 8V3h5"/>',
    metadata:'<path d="M5 3h10l4 4v14H5zM15 3v5h4M12 11v6M12 9h.01"/>',
    flatten:'<path d="M4 3h16v18H4zM7 7h3v3H7zM13 8h4M7 14h10M7 17h7"/>',
    mark:'<path d="M8 15V8a4 4 0 0 1 8 0v7M5 15h14v4H5zM3 22h18"/>',
    scan:'<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5M7 7h10v10H7zM1 12h22"/>',
    edit:'<path d="M13 3H4v18h16v-9M14 8l5-5 3 3-5 5-4 1z"/>',
    outline:'<path d="M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1"/>',
    presets:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="7" cy="18" r="2" fill="currentColor"/>',
    'extract-text':'<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>',
    'split-spread':'<rect x="2" y="5" width="20" height="14" rx="1"/><path d="M12 2v20" stroke-dasharray="2 3"/><path d="m8 9-3 3 3 3m8-6 3 3-3 3"/>',
    booklet:'<path d="M2 5c4-2 7-2 10 0 3-2 6-2 10 0v15c-4-2-7-2-10 0-3-2-6-2-10 0zM12 5v15M5 8h4M15 8h4"/>',
    upload:'<path d="M4 15v6h16v-6M12 16V3m-5 5 5-5 5 5"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    play:'<path d="m7 3 14 9-14 9z"/>',
    pause:'<path d="M6 3h4v18H6zM14 3h4v18h-4z"/>',
    fullscreen:'<path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6"/>'
  };
  paths['images-to-pdf'] = paths.image;
  paths['pdf-to-images'] = paths.image;
  const svg = name => `<svg class="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.more}</svg>`;
  window.PhilosophalIcons = { svg };
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = svg(el.dataset.icon); el.setAttribute('aria-hidden', 'true'); });
})();
