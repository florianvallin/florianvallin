(() => {
  "use strict";

  const Books = window.PhilosophalBooks;
  const overlay = document.querySelector("[data-book-drop-overlay]");
  const label = document.querySelector("[data-book-drop-label]");
  if (!Books || !overlay) return;

  let dragDepth = 0;

  function hasFiles(event) {
    return Array.from(event.dataTransfer?.types || []).includes("Files");
  }

  function show(text = "Déposez votre livre ici") {
    if (label) label.textContent = text;
    overlay.hidden = false;
    document.body.classList.add("media-book-dragging");
  }

  function hide() {
    dragDepth = 0;
    overlay.hidden = true;
    document.body.classList.remove("media-book-dragging");
  }

  window.addEventListener("dragenter", (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth += 1;
    show();
  });

  window.addEventListener("dragover", (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  });

  window.addEventListener("dragleave", (event) => {
    if (!hasFiles(event)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) hide();
  });

  window.addEventListener("drop", async (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || []);
    const file = files.find((candidate) => Books.isSupported(candidate));
    if (!file) {
      show("Format non pris en charge — EPUB, TXT, HTML, Markdown ou FB2");
      setTimeout(hide, 1700);
      return;
    }

    try {
      show("Import du livre…");
      const record = await Books.saveFile(file);
      const base = new URL("./lecteur/", location.href);
      base.searchParams.set("book", record.id);
      base.searchParams.set("fresh", "1");
      location.assign(base.href);
    } catch (error) {
      show(error?.message || "Impossible d’importer ce livre.");
      setTimeout(hide, 2200);
    }
  });
})();
