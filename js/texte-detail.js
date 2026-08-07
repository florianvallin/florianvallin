(() => {
  "use strict";
  const target = document.querySelector("[data-text-detail]");
  if (!target) return;
  const params = new URLSearchParams(window.location.search);
  const cleanPathMatch = window.location.pathname.match(/^\/textes\/([^/]+)\/?$/);
  const reservedPaths = new Set(["lire", "philosophie", "theologie", "autres"]);
  const cleanPathId = cleanPathMatch && !reservedPaths.has(cleanPathMatch[1]) ? decodeURIComponent(cleanPathMatch[1]) : null;
  const id = params.get("id") || cleanPathId;
  const text = (window.FV_TEXT_CATALOG || []).find((item) => item.id === id);
  if (!text) {
    target.innerHTML = `<div class="text-detail-inner"><p class="text-breadcrumb"><a href="/textes/">Textes</a></p><h1>Texte introuvable</h1><div class="text-placeholder"><p>Cette référence n’existe pas ou n’est plus disponible.</p></div></div>`;
    return;
  }
  target.classList.remove("text-detail--philosophie", "text-detail--theologie", "text-detail--autres");
  target.classList.add(`text-detail--${text.section}`);
  const sectionLabel = window.FV_TEXT_SECTION_LABELS[text.section];
  const sections = text.sections || [text.section];
  const isDualSection = sections.includes("philosophie") && sections.includes("theologie");
  const sectionHeading = isDualSection ? "Philosophie & théologie" : sectionLabel;
  const sectionSymbols = { philosophie:"φ", theologie:"✦", autres:"—" };
  const sectionMark = sections.map((section) => `<span class="text-detail-section-symbol text-detail-section-symbol--${section}">${sectionSymbols[section] || ""}</span>`).join("");
  const textUrl = window.FV_TEXT_URL || ((item) => `/textes/${encodeURIComponent(typeof item === "string" ? item : item.id)}/`);
  const cleanTextUrl = textUrl(text);
  if (window.location.pathname.includes("/textes/lire/")) window.history.replaceState({}, "", cleanTextUrl);

  let returnUrl = "/textes/";
  try {
    const storedReturn = window.sessionStorage.getItem("fvTextCatalogReturn") || "";
    const storedPath = storedReturn.split("?")[0];
    if (["/textes/", "/textes/philosophie/", "/textes/theologie/", "/textes/autres/"].includes(storedPath)) returnUrl = storedReturn;
  } catch (_) {}
  const themes = text.themes || (text.theme ? [text.theme] : []);
  const currentProgramThemes = window.FV_CURRENT_PROGRAM_THEMES || [];
  const allCatalogThemes = window.FV_ALL_TEXT_THEMES || themes;
  const catalogUrl = (key, value) => `/textes/?${key}=${encodeURIComponent(value)}`;
  const themeTag = (theme) => {
    const isProgramTheme = currentProgramThemes.includes(theme);
    const themeClass = `text-tag${isProgramTheme ? " text-tag--program" : ""}`;
    return `<a class="${themeClass}" href="${catalogUrl("theme", theme)}"${isProgramTheme ? ' title="Notion du programme de Terminale" aria-label="#' + theme.toLocaleLowerCase("fr") + ', notion du programme de Terminale"' : ""}>#${theme.toLocaleLowerCase("fr")}</a>`;
  };
  const linkThemesInHtml = (html) => {
    const themesByLength = [...allCatalogThemes].sort((a, b) => b.length - a.length);
    if (!themesByLength.length) return html;
    const pattern = new RegExp(`\\b(${themesByLength.map((theme) => theme.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")).join("|")})\\b`, "giu");
    return html.split(/(<[^>]+>)/g).map((part) => {
      if (part.startsWith("<")) return part;
      return part.replace(pattern, (match) => `<a href="${catalogUrl("theme", allCatalogThemes.find((theme) => theme.localeCompare(match, "fr", { sensitivity:"base" }) === 0) || match)}" aria-label="Voir les textes sur ${match}">${match}</a>`);
    }).join("");
  };
  const escapeAttribute = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // A definition is useful at its first encounter in the excerpt; repeating
  // the tooltip on every occurrence makes the text visually noisy.
  const definedGlossaryTerms = new Set();
  const addGlossaryTerms = (html) => {
    const glossary = text.glossary || [];
    if (!glossary.length) return html;
    const terms = [...glossary].sort((a, b) => b.term.length - a.term.length);
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])(${terms.map(({ term }) => term.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")).join("|")})(?![\\p{L}\\p{N}_])`, "giu");
    return html.split(/(<[^>]+>)/g).map((part) => {
      if (part.startsWith("<")) return part;
      return part.replace(pattern, (match) => {
        const item = terms.find(({ term }) => term.localeCompare(match, "fr", { sensitivity:"base" }) === 0);
        const termKey = item && item.term.toLocaleLowerCase("fr");
        if (!item || definedGlossaryTerms.has(termKey)) return match;
        definedGlossaryTerms.add(termKey);
        return `<span class="text-glossary-term" tabindex="0" data-tooltip="${escapeAttribute(item.definition)}" aria-label="${escapeAttribute(match)} : ${escapeAttribute(item.definition)}">${match}</span>`;
      });
    }).join("");
  };
  const readingParts = text.parts?.length ? text.parts : [{
    context:text.context,
    readingQuestions:text.readingQuestions,
    readingBlocks:text.readingBlocks,
    paragraphs:text.paragraphs,
    work:text.work,
    publication:text.publication
  }];
  const renderContext = (part) => {
    const questions = (part.readingQuestions || []).length
      ? `<div class="text-context-questions"><span>Questions directrices</span><ul>${part.readingQuestions.map((question) => `<li>${linkThemesInHtml(question)}</li>`).join("")}</ul></div>`
      : "";
    return part.context ? `<aside class="text-context" aria-label="Repère de lecture"><span class="text-context-label">Repère de lecture</span><p>${linkThemesInHtml(part.context)}</p>${questions}</aside>` : "";
  };
  const firstContext = renderContext(readingParts[0]);
  const renderReadingBlock = (block) => {
    if (block.type === "heading") {
      return '<h2 class="text-scripture-heading">' + block.text + '</h2>';
    }
    if (block.type === "divider") {
      return '<hr class="text-scripture-chapter-divider" aria-hidden="true">';
    }
    if (block.type === "omission") {
      return '<p class="text-scripture-omission" aria-label="Passage non reproduit">' + (block.text || "[…]") + '</p>';
    }
    if (block.type === "pause") {
      const pauseLabel = block.reference + (block.title ? " — " + block.title : "");
      const pauseTitle = block.reference + (block.title ? " <span>(" + block.title + ")</span>" : "");
      const pauseIntro = block.intro ? '<p class="text-scripture-pause-intro">' + block.intro + '</p>' : "";
      return '<aside class="text-scripture-pause" aria-label="' + escapeAttribute(pauseLabel) + '">' +
        '<p class="text-scripture-pause-title">' + pauseTitle + '</p>' +
        pauseIntro +
        '<blockquote>' + addGlossaryTerms(block.text || "") + '</blockquote>' +
      '</aside>';
    }
    const chapterClass = String(block.marker || "").startsWith("GENÈSE") ? " text-scripture-marker--chapter" : "";
    return '<div class="text-scripture-verse">' +
      '<span class="text-scripture-marker' + chapterClass + '" aria-label="' + escapeAttribute(block.aria || block.marker || "") + '">' + (block.marker || "") + '</span>' +
      '<p class="text-scripture-text">' + addGlossaryTerms(block.text || "") + '</p>' +
    '</div>';
  };
  const renderReadingPart = (part, index) => {
    if ((part.readingBlocks || []).length) {
      const body = part.readingBlocks.map(renderReadingBlock).join("");
      const divider = index > 0 ? '<hr class="text-reading-part-divider" aria-hidden="true">' + renderContext(part) : "";
      return divider + '<article class="text-reading text-reading--scripture">' +
        '<div class="text-reading-content">' + body + '</div>' +
      '</article>' +
      '<p class="text-detail-reference"><strong>' + text.author + '</strong>, <cite>' + (part.work || text.work) + '</cite>, ' + (part.publication || text.publication) + '.</p>';
    }
    const body = (part.paragraphs || []).map((paragraph) => `<p>${addGlossaryTerms(paragraph)}</p>`).join("");
    const divider = index > 0 ? `<hr class="text-reading-part-divider" aria-hidden="true">${renderContext(part)}` : "";
    return `${divider}<article class="text-reading" data-line-numbered>
      <span class="text-reading-quote text-reading-quote--open" aria-hidden="true">«</span>
      <div class="text-reading-content">${body}</div>
      <span class="text-reading-quote text-reading-quote--close" aria-hidden="true">»</span>
      <div class="text-reading-line-numbers" aria-hidden="true"></div>
    </article>
    <p class="text-detail-reference"><strong>${text.author}</strong>, <cite>${part.work || text.work}</cite>, ${part.publication || text.publication}.</p>`;
  };
  const readingSections = readingParts.map(renderReadingPart).join("");
  const noteBadges = {
    definition: "déf.",
    concept: "concept",
    school: "école",
    current: "courant",
    analysis: "",
    prose: ""
  };
  const renderReadingNote = (note, type = note.type || "analysis") => {
    if (type === "opposition") {
      return `<section class="text-note text-note--opposition"><div class="text-note-poles"><div><strong>${note.left.term}</strong><p>${linkThemesInHtml(note.left.definition)}</p></div><div><strong>${note.right.term}</strong><p>${linkThemesInHtml(note.right.definition)}</p></div></div>${note.conclusion ? `<p class="text-note-conclusion">${linkThemesInHtml(note.conclusion)}</p>` : ""}</section>`;
    }
    if (type === "plain") {
      return `<p class="text-note-prose">${linkThemesInHtml(note.definition || "")}</p>`;
    }
    const items = (note.items || []).length
      ? `<ol>${note.items.map((item) => `<li>${linkThemesInHtml(item)}</li>`).join("")}</ol>`
      : "";
    const badge = note.badge === false ? "" : (note.badge || noteBadges[type] || "");
    const content = `<strong>${note.term}${badge ? ` <span>(${badge})</span>` : ""}</strong> : ${linkThemesInHtml(note.definition || "")}${items}`;
    return type === "prose" ? `<p class="text-note-prose">${content}</p>` : `<li class="text-note">${content}</li>`;
  };
  let notesListOpen = false;
  const readingNotesContent = (text.readingNotes || []).reduce((html, note) => {
    const type = note.type || "analysis";
    if (type === "opposition" || type === "prose" || type === "plain") {
      if (notesListOpen) { html += "</ul>"; notesListOpen = false; }
      return `${html}${renderReadingNote(note, type)}`;
    }
    if (!notesListOpen) { html += '<ul class="text-notes-list">'; notesListOpen = true; }
    return `${html}${renderReadingNote(note, type)}`;
  }, "") + (notesListOpen ? "</ul>" : "");
  const readingNotes = readingNotesContent
    ? `<section class="text-reading-notes text-disclosure"><button class="text-disclosure-trigger" type="button" aria-expanded="false"><span>Aller encore plus loin</span><i aria-hidden="true"></i></button><div class="text-disclosure-panel"><div class="text-disclosure-panel-inner text-reading-notes-content">${readingNotesContent}</div></div></section>`
    : "";
  const artworks = text.artworks || [];
  const artworkGallery = artworks.length ? `<section class="text-art-gallery" data-art-gallery data-direction="next" tabindex="0" aria-labelledby="text-art-gallery-title">
    <header class="text-art-gallery-heading">
      <div><span>Iconographie</span><h2 id="text-art-gallery-title">Le mythe de l’androgyne en images</h2></div>
      <small>Balayez ou utilisez les flèches</small>
    </header>
    <span class="text-art-gallery-progress" aria-hidden="true"><i data-art-progress></i></span>
    <div class="text-art-gallery-stage">
      <span class="text-art-gallery-count" data-art-count aria-live="polite">01 / ${String(artworks.length).padStart(2, "0")}</span>
      ${artworks.map((artwork, index) => `<figure class="text-art-slide${index === 0 ? " is-active" : ""}" data-art-slide aria-hidden="${index === 0 ? "false" : "true"}"${index === 0 ? "" : " inert"}>
        <button class="text-art-zoom" type="button" data-art-zoom="${index}" aria-label="Agrandir : ${escapeAttribute(artwork.title)}">
          <span class="text-art-image-wrap"><img src="${escapeAttribute(artwork.src)}" alt="${escapeAttribute(artwork.alt)}" ${index === 0 ? 'loading="eager"' : 'loading="lazy"'} decoding="async"></span>
          <span class="text-art-zoom-hint" aria-hidden="true"><i></i>Agrandir</span>
        </button>
        <figcaption><strong>${artwork.title}</strong><span>${artwork.details || ""}</span></figcaption>
      </figure>`).join("")}
    </div>
    <div class="text-art-gallery-controls">
      <button type="button" class="text-art-gallery-arrow text-art-gallery-arrow--previous" data-art-previous aria-label="Voir l’œuvre précédente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg></button>
      <div class="text-art-gallery-thumbnails" role="group" aria-label="Choisir une œuvre">${artworks.map((artwork, index) => `<button type="button" data-art-dot="${index}" aria-label="Afficher l’œuvre ${index + 1} : ${escapeAttribute(artwork.title)}"${index === 0 ? ' class="is-active" aria-current="true"' : ""}><img src="${escapeAttribute(artwork.src)}" alt="" loading="lazy" decoding="async"><span>${String(index + 1).padStart(2, "0")}</span></button>`).join("")}</div>
      <button type="button" class="text-art-gallery-arrow text-art-gallery-arrow--next" data-art-next aria-label="Voir l’œuvre suivante"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
    </div>
    <dialog class="text-art-lightbox" data-art-lightbox aria-label="Œuvre agrandie">
      <button type="button" class="text-art-lightbox-close" data-art-close aria-label="Fermer l’image agrandie">×</button>
      <button type="button" class="text-art-lightbox-arrow text-art-lightbox-arrow--previous" data-art-lightbox-previous aria-label="Œuvre précédente"><span aria-hidden="true">←</span></button>
      <button type="button" class="text-art-lightbox-arrow text-art-lightbox-arrow--next" data-art-lightbox-next aria-label="Œuvre suivante"><span aria-hidden="true">→</span></button>
      <div class="text-art-lightbox-viewport"><img class="text-art-lightbox-image" data-art-lightbox-image alt=""></div>
      <footer class="text-art-lightbox-footer"><p class="text-art-lightbox-caption" data-art-lightbox-caption></p><a class="text-art-lightbox-original" data-art-lightbox-original href="#" target="_blank" rel="noopener">Ouvrir l’image seule <span aria-hidden="true">↗</span></a></footer>
    </dialog>
  </section>` : "";
  const relationInfo = {
    suite: { label:"Dans le même dialogue" },
    identique: { label:"Même thèse" },
    proche: { label:"Thèse proche" },
    adverse: { label:"Thèse adverse" }
  };
  const relationOrder = ["suite", "identique", "proche", "adverse"];
  const groupedRelations = (text.relatedTexts || []).reduce((groups, related) => {
    const targetText = (window.FV_TEXT_CATALOG || []).find((item) => item.id === related.id);
    if (!targetText) return groups;
    const kind = relationInfo[related.kind] ? related.kind : "proche";
    (groups[kind] ||= []).push(related);
    return groups;
  }, {});
  const relatedGroups = relationOrder.filter((kind) => groupedRelations[kind]?.length).map((kind) => {
    const relation = relationInfo[kind];
    const links = groupedRelations[kind].map((related) => `<li><a href="${textUrl(related.id)}">${related.label}</a><span>${related.relation}</span></li>`).join("");
    return `<section class="text-relation-group text-relation-group--${kind} text-disclosure"><button class="text-relation-group-heading text-disclosure-trigger" type="button" aria-expanded="false"><i class="text-relation-kind-icon" aria-hidden="true"></i><strong>${relation.label}</strong><i class="text-relation-toggle" aria-hidden="true"></i></button><div class="text-disclosure-panel"><div class="text-disclosure-panel-inner"><ul>${links}</ul></div></div></section>`;
  }).join("");
  const related = relatedGroups ? `<aside class="text-relations" aria-label="Parcours de lecture associé"><span class="text-relations-heading">Poursuivre la réflexion</span>${relatedGroups}</aside>` : "";
  const blogGuide = {
    category:"Fiche de référence",
    title:"Les repères conceptuels en philosophie",
    description:"La liste complète et des définitions courtes pour retrouver la distinction utile à ce texte.",
    href:"/blog/reperes-conceptuels-philosophie-terminale/"
  };
  const blogBridge = `<aside class="text-blog-bridge" aria-label="Billet de blog complémentaire">
    <span class="text-blog-bridge-mark" aria-hidden="true">B</span>
    <div><span class="text-blog-bridge-eyebrow">${blogGuide.category}</span><strong>${blogGuide.title}</strong><p>${blogGuide.description}</p></div>
    <a href="${blogGuide.href}">Lire <span aria-hidden="true">→</span></a>
  </aside>`;
  const readingPath = (window.FV_TEXT_PATHS || []).find((path) => path.texts.includes(text.id));
  const pathIndex = readingPath ? readingPath.texts.indexOf(text.id) : -1;
  const nextText = readingPath && pathIndex < readingPath.texts.length - 1
    ? (window.FV_TEXT_CATALOG || []).find((item) => item.id === readingPath.texts[pathIndex + 1])
    : null;
  const pathNavigation = readingPath ? `<nav class="text-path-navigation" aria-label="Continuer le parcours ${readingPath.label}">
    <div class="text-path-navigation-copy"><span>Parcours de lecture</span><strong>${readingPath.label}</strong><small>Étape ${pathIndex + 1} sur ${readingPath.texts.length}</small></div>
    ${nextText
      ? `<a href="${textUrl(nextText)}"><span>Texte suivant</span><strong>${nextText.author} — ${nextText.title}</strong><i aria-hidden="true">→</i></a>`
      : `<a href="${returnUrl}"><span>Parcours terminé</span><strong>Revenir aux résultats</strong><i aria-hidden="true">→</i></a>`}
  </nav>` : "";
  document.title = `${text.title} — ${text.author} | Florian Vallin`;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = `https://florianvallin.fr${cleanTextUrl}`;
  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.name = "description";
    document.head.append(description);
  }
  description.content = text.description;
  target.innerHTML = `<div class="text-detail-inner">
    <p class="text-breadcrumb"><a class="text-back-results" href="${returnUrl}"><span aria-hidden="true">←</span> Retour aux résultats</a><span aria-hidden="true">·</span><a href="/textes/${text.section}/">${sectionLabel}</a></p>
    <p class="text-detail-section text-detail-section--${text.section}${isDualSection ? " text-detail-section--dual" : ""}">${sectionMark}<span>${sectionHeading}</span></p>
    <h1>${text.title}${text.familiarIdea ? ` <span class="text-detail-familiar-idea">(${text.familiarIdea})</span>` : ""}</h1>
    <p class="text-detail-author"><a class="text-detail-author-link" href="${catalogUrl("auteur", text.author)}" aria-label="Voir les textes de ${text.author}">${text.author}</a>${text.authorMeta ? ` <span class="text-detail-author-meta">${text.authorMeta}</span>` : ""}</p>
    <div class="text-detail-tags">${themes.slice(0, 4).map(themeTag).join("")}</div>
    ${firstContext}
    ${blogBridge}
    ${related}
    ${readingSections}
    ${artworkGallery}
    ${readingNotes}
    ${pathNavigation}
    <aside class="text-detail-cta" aria-label="Accompagnement sur ce texte">
      <div class="text-detail-cta-copy">
        <span class="text-detail-cta-eyebrow">Cours particulier</span>
        <h2>Besoin d’aller plus loin sur ce texte ou ce thème&nbsp;?</h2>
        <p>Approfondissons les notions, les enjeux du texte et le thème auquel il se rattache, à votre rythme.</p>
      </div>
      <a class="text-detail-cta-link" href="/#contact">Travailler ce texte avec moi <span aria-hidden="true">→</span></a>
    </aside>
  </div>`;
  const artworkGalleryElement = target.querySelector("[data-art-gallery]");
  if (artworkGalleryElement) {
    const slides = [...artworkGalleryElement.querySelectorAll("[data-art-slide]")];
    const dots = [...artworkGalleryElement.querySelectorAll("[data-art-dot]")];
    const counter = artworkGalleryElement.querySelector("[data-art-count]");
    const progress = artworkGalleryElement.querySelector("[data-art-progress]");
    const stage = artworkGalleryElement.querySelector(".text-art-gallery-stage");
    const lightbox = artworkGalleryElement.querySelector("[data-art-lightbox]");
    const lightboxImage = artworkGalleryElement.querySelector("[data-art-lightbox-image]");
    const lightboxCaption = artworkGalleryElement.querySelector("[data-art-lightbox-caption]");
    const lightboxOriginal = artworkGalleryElement.querySelector("[data-art-lightbox-original]");
    let activeArtwork = 0;
    const showArtwork = (nextIndex) => {
      const normalizedIndex = (nextIndex + slides.length) % slides.length;
      if (normalizedIndex !== activeArtwork) artworkGalleryElement.dataset.direction = nextIndex < activeArtwork ? "previous" : "next";
      activeArtwork = normalizedIndex;
      slides.forEach((slide, index) => {
        const isActive = index === activeArtwork;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
        if (isActive) slide.removeAttribute("inert");
        else slide.setAttribute("inert", "");
      });
      dots.forEach((dot, index) => {
        const isActive = index === activeArtwork;
        dot.classList.toggle("is-active", isActive);
        if (isActive) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      if (counter) counter.textContent = `${String(activeArtwork + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      if (progress) progress.style.width = `${((activeArtwork + 1) / slides.length) * 100}%`;
    };
    showArtwork(0);
    artworkGalleryElement.querySelector("[data-art-previous]")?.addEventListener("click", () => showArtwork(activeArtwork - 1));
    artworkGalleryElement.querySelector("[data-art-next]")?.addEventListener("click", () => showArtwork(activeArtwork + 1));
    dots.forEach((dot, index) => dot.addEventListener("click", () => showArtwork(index)));
    artworkGalleryElement.addEventListener("keydown", (event) => {
      if (lightbox?.open) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); showArtwork(activeArtwork - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); showArtwork(activeArtwork + 1); }
    });
    let touchStartX = 0;
    let touchStartY = 0;
    let lastSwipeAt = 0;
    stage?.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0]?.clientX || 0;
      touchStartY = event.changedTouches[0]?.clientY || 0;
    }, { passive:true });
    stage?.addEventListener("touchend", (event) => {
      const deltaX = (event.changedTouches[0]?.clientX || 0) - touchStartX;
      const deltaY = (event.changedTouches[0]?.clientY || 0) - touchStartY;
      if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      lastSwipeAt = Date.now();
      showArtwork(activeArtwork + (deltaX < 0 ? 1 : -1));
    }, { passive:true });
    const setLightboxArtwork = (index) => {
      const artwork = artworks[(index + artworks.length) % artworks.length];
      if (!artwork || !lightboxImage || !lightboxCaption || !lightboxOriginal) return;
      showArtwork((index + artworks.length) % artworks.length);
      lightboxImage.src = artwork.src;
      lightboxImage.alt = artwork.alt;
      lightboxCaption.innerHTML = `<strong>${artwork.title}</strong><span>${artwork.details || ""}</span>`;
      lightboxOriginal.href = artwork.src;
    };
    artworkGalleryElement.querySelectorAll("[data-art-zoom]").forEach((button) => button.addEventListener("click", () => {
      if (Date.now() - lastSwipeAt < 500 || !lightbox) return;
      setLightboxArtwork(Number.parseInt(button.dataset.artZoom, 10) || 0);
      if (typeof lightbox.showModal === "function") lightbox.showModal();
      else lightbox.setAttribute("open", "");
    }));
    artworkGalleryElement.querySelector("[data-art-lightbox-previous]")?.addEventListener("click", () => setLightboxArtwork(activeArtwork - 1));
    artworkGalleryElement.querySelector("[data-art-lightbox-next]")?.addEventListener("click", () => setLightboxArtwork(activeArtwork + 1));
    artworkGalleryElement.querySelector("[data-art-close]")?.addEventListener("click", () => lightbox?.close());
    lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
    lightbox?.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); setLightboxArtwork(activeArtwork - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); setLightboxArtwork(activeArtwork + 1); }
    });
  }
  target.querySelectorAll(".text-disclosure").forEach((disclosure, index) => {
    const trigger = disclosure.querySelector(":scope > .text-disclosure-trigger");
    const panel = disclosure.querySelector(":scope > .text-disclosure-panel");
    if (!trigger || !panel) return;
    const panelId = `text-disclosure-panel-${index + 1}`;
    panel.id = panelId;
    panel.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-controls", panelId);
    trigger.addEventListener("click", () => {
      const willOpen = !disclosure.classList.contains("is-open");
      disclosure.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
      panel.setAttribute("aria-hidden", String(!willOpen));
    });
  });
  const glossaryTerms = [...target.querySelectorAll(".text-glossary-term")];
  if (glossaryTerms.length) {
    const tooltip = document.createElement("div");
    tooltip.className = "text-glossary-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.setAttribute("aria-hidden", "true");
    document.body.appendChild(tooltip);
    let activeTerm = null;
    const positionTooltip = (term) => {
      const rect = term.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const margin = 14;
      const left = Math.max(margin + tooltipRect.width / 2, Math.min(window.innerWidth - margin - tooltipRect.width / 2, rect.left + rect.width / 2));
      const below = rect.top < tooltipRect.height + 18;
      tooltip.classList.toggle("is-below", below);
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${below ? rect.bottom : rect.top}px`;
    };
    const showTooltip = (term) => {
      activeTerm = term;
      tooltip.textContent = term.dataset.tooltip || "";
      tooltip.classList.add("is-visible");
      tooltip.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => positionTooltip(term));
    };
    const hideTooltip = () => {
      activeTerm = null;
      tooltip.classList.remove("is-visible", "is-below");
      tooltip.setAttribute("aria-hidden", "true");
    };
    glossaryTerms.forEach((term) => {
      term.addEventListener("mouseenter", () => showTooltip(term));
      term.addEventListener("mouseleave", hideTooltip);
      term.addEventListener("focus", () => showTooltip(term));
      term.addEventListener("blur", hideTooltip);
    });
    window.addEventListener("scroll", () => activeTerm && positionTooltip(activeTerm), { passive:true });
    window.addEventListener("resize", () => activeTerm && positionTooltip(activeTerm));
  }
  const readings = [...target.querySelectorAll("[data-line-numbered]")];
  if (!readings.length) return;

  const renderLineNumbers = (reading) => {
    const content = reading.querySelector(".text-reading-content");
    const numbers = reading.querySelector(".text-reading-line-numbers");
    const lines = [];
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const words = node.textContent.matchAll(/\S+/g);
      for (const word of words) {
        const range = document.createRange();
        range.setStart(node, word.index);
        range.setEnd(node, word.index + word[0].length);
        [...range.getClientRects()].forEach((rect) => {
          const top = Math.round(rect.top - reading.getBoundingClientRect().top);
          if (!lines.some((line) => Math.abs(line - top) <= 2)) lines.push(top);
        });
      }
    }
    lines.sort((a, b) => a - b);
    const railTop = numbers.getBoundingClientRect().top - reading.getBoundingClientRect().top;
    numbers.innerHTML = lines.map((top, index) => (index + 1) % 5 === 0
      ? `<span style="top:${top - railTop}px">${index + 1}</span>` : "").join("");
  };
  const redraw = () => requestAnimationFrame(() => readings.forEach(renderLineNumbers));
  redraw();
  window.addEventListener("resize", redraw, { passive:true });
})();
