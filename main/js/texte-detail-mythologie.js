(() => {
  "use strict";
  const target = document.querySelector("[data-text-detail]");
  if (!target) return;

  const match = window.location.pathname.match(/^\/textes\/([^/]+)\/?$/);
  const id = new URLSearchParams(window.location.search).get("id") || (match ? decodeURIComponent(match[1]) : "");
  const text = (window.FV_TEXT_CATALOG || []).find((item) => item.id === id);

  const esc = (value = "") => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  if (!text || text.section !== "mythologie") {
    target.innerHTML = `<div class="text-detail-inner"><p class="text-breadcrumb"><a href="/textes/mythologie/">← Mythologie</a></p><h1>Texte introuvable</h1><div class="text-placeholder"><p>Cette référence n’existe pas ou n’est plus disponible.</p></div></div>`;
    return;
  }

  target.classList.add("text-detail--mythologie");

  const themeTags = (text.themes || []).map((theme) =>
    `<a class="text-tag" href="/textes/mythologie/?theme=${encodeURIComponent(theme)}">#${esc(theme.toLocaleLowerCase("fr"))}</a>`
  ).join("");

  const questions = (text.readingQuestions || []).length
    ? `<section class="text-context"><div class="text-context-card"><span class="text-context-label">Questions directrices</span><ol class="text-reading-questions">${text.readingQuestions.map((q) => `<li>${q}</li>`).join("")}</ol></div></section>`
    : "";

  const glossary = (text.glossary || []).length
    ? `<section class="text-reading-notes text-disclosure is-open"><button class="text-disclosure-trigger" type="button" aria-expanded="true"><span>Repères et vocabulaire</span><i aria-hidden="true"></i></button><div class="text-disclosure-panel"><div class="text-disclosure-panel-inner text-reading-notes-content"><ul class="text-notes-list">${text.glossary.map((item) => `<li class="text-note"><strong>${esc(item.term)}</strong> : ${item.definition || ""}</li>`).join("")}</ul></div></div></section>`
    : "";

  const renderNote = (note) => {
    if (note.type === "opposition" && note.left && note.right) {
      return `<section class="text-note text-note--opposition"><div class="text-note-poles"><div><strong>${esc(note.left.term)}</strong><p>${note.left.definition || ""}</p></div><div><strong>${esc(note.right.term)}</strong><p>${note.right.definition || ""}</p></div></div>${note.conclusion ? `<p class="text-note-conclusion">${note.conclusion}</p>` : ""}</section>`;
    }
    if (note.type === "prose" || note.type === "plain") {
      return `<p class="text-note-prose"><strong>${esc(note.term || "")}</strong>${note.term ? " : " : ""}${note.definition || ""}</p>`;
    }
    const items = (note.items || []).length ? `<ol>${note.items.map((item) => `<li>${item}</li>`).join("")}</ol>` : "";
    return `<li class="text-note"><strong>${esc(note.term || "Repère")}</strong> : ${note.definition || ""}${items}</li>`;
  };

  let notesHtml = "";
  let listOpen = false;
  (text.readingNotes || []).forEach((note) => {
    const standalone = ["opposition", "comparison", "prose", "plain"].includes(note.type);
    if (standalone) {
      if (listOpen) { notesHtml += "</ul>"; listOpen = false; }
      notesHtml += renderNote(note);
    } else {
      if (!listOpen) { notesHtml += '<ul class="text-notes-list">'; listOpen = true; }
      notesHtml += renderNote(note);
    }
  });
  if (listOpen) notesHtml += "</ul>";
  const notes = notesHtml
    ? `<section class="text-reading-notes text-disclosure"><button class="text-disclosure-trigger" type="button" aria-expanded="false"><span>Aller encore plus loin</span><i aria-hidden="true"></i></button><div class="text-disclosure-panel"><div class="text-disclosure-panel-inner text-reading-notes-content">${notesHtml}</div></div></section>`
    : "";

  const paragraphs = (text.paragraphs || []).map((paragraph, index) =>
    `<p class="text-passage-paragraph" data-paragraph="${index + 1}">${paragraph}</p>`
  ).join("");

  const related = (text.relatedTexts || []).length
    ? `<section class="text-related"><div class="text-related-head"><span>Textes liés</span><h2>Poursuivre la lecture</h2></div><div class="text-related-grid">${text.relatedTexts.map((item) => `<a class="text-related-card" href="/textes/${encodeURIComponent(item.id)}/"><span>${esc(item.kind || "proche")}</span><strong>${esc(item.label || item.id)}</strong><p>${esc(item.relation || "")}</p></a>`).join("")}</div></section>`
    : "";

  const author = text.author
    ? `<a class="text-detail-author-link" href="/textes/mythologie/?auteur=${encodeURIComponent(text.author)}">${esc(text.author)}</a>`
    : "";

  target.innerHTML = `<div class="text-detail-inner">
    <p class="text-breadcrumb"><a class="text-back-results" href="/textes/mythologie/"><span aria-hidden="true">←</span> Retour aux résultats</a><span aria-hidden="true">·</span><a href="/textes/mythologie/">Mythologie</a></p>
    <p class="text-detail-section text-detail-section--mythologie"><span class="text-detail-section-symbol text-detail-section-symbol--mythologie">Μ</span><span>Mythologie</span></p>
    <h1>${text.title}${text.familiarIdea ? ` <span class="text-detail-familiar-idea">(${text.familiarIdea})</span>` : ""}</h1>
    <p class="text-detail-author">${author}${text.authorMeta ? ` <span class="text-detail-author-meta">${esc(text.authorMeta)}</span>` : ""}</p>
    <div class="text-detail-tags">${themeTags}</div>
    <section class="text-context"><div class="text-context-card"><span class="text-context-label">Repères de lecture</span><p>${text.context || text.description || ""}</p></div></section>
    ${questions}
    <article class="text-passage"><header class="text-passage-header"><div><span class="text-passage-label">Extrait</span><h2>${esc(text.work || text.title)}</h2></div><p>${esc(text.publication || "")}</p></header><div class="text-passage-body">${paragraphs}</div></article>
    ${glossary}
    ${notes}
    ${related}
    <aside class="text-detail-cta" aria-label="Accompagnement sur ce texte"><div class="text-detail-cta-copy"><span class="text-detail-cta-eyebrow">Cours particulier</span><strong>Besoin d’aller plus loin sur ce texte ?</strong><p>Je peux t’aider à l’expliquer, à construire une problématique ou à le relier à une notion philosophique.</p></div><a class="btn-primary" href="/#contact">Prendre contact</a></aside>
  </div>`;

  document.title = `${text.title} — ${text.author || "Mythologie"} | Florian Vallin`;
  const description = document.querySelector('meta[name="description"]');
  if (description && text.description) description.content = text.description;

  target.querySelectorAll(".text-disclosure-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.closest(".text-disclosure");
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      section?.classList.toggle("is-open", !expanded);
    });
  });
})();
