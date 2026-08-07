(function () {
  "use strict";

  const browser = document.querySelector("[data-repere-browser]");
  if (!browser) return;

  const panel = browser.querySelector("[data-repere-panel]");
  const initialList = browser.querySelector("[data-repere-list]");
  const description = browser.querySelector("[data-repere-view-description]");
  const buttons = Array.from(browser.querySelectorAll("[data-repere-view]"));

  if (!panel || !initialList || !description || !buttons.length) return;

  const sourceCards = Array.from(initialList.querySelectorAll(".blog-repere")).map((card) => card.cloneNode(true));
  sourceCards.sort((left, right) => {
    const leftLabel = left.querySelector("dt")?.textContent.trim() || "";
    const rightLabel = right.querySelector("dt")?.textContent.trim() || "";
    return leftLabel.localeCompare(rightLabel, "fr", { sensitivity: "base" });
  });

  const categories = [
    {
      id: "concepts",
      label: "Définir et classer",
      description: "Préciser l’extension, la forme ou l’identité d’une notion."
    },
    {
      id: "raisonnement",
      label: "Raisonner et argumenter",
      description: "Organiser une démonstration, une explication ou une discussion."
    },
    {
      id: "connaissance",
      label: "Connaître et établir le vrai",
      description: "Accéder à un objet, justifier une affirmation et en évaluer la vérité."
    },
    {
      id: "realite",
      label: "Penser le réel et ses modalités",
      description: "Distinguer des façons d’être, des conditions d’existence et des possibilités."
    },
    {
      id: "action",
      label: "Juger, agir et vivre ensemble",
      description: "Penser l’action, les normes, le droit et la vie collective."
    }
  ];

  const themes = [
    "Art",
    "Bonheur",
    "Conscience",
    "Devoir",
    "État",
    "Inconscient",
    "Justice",
    "Langage",
    "Liberté",
    "Nature",
    "Raison",
    "Religion",
    "Science",
    "Technique",
    "Temps",
    "Travail",
    "Vérité"
  ];

  const viewDescriptions = {
    alphabetical: "La liste officielle, présentée dans son ordre alphabétique.",
    categories: "Une proposition de regroupement en cinq familles, selon l’usage principal de chaque distinction.",
    themes: "Une proposition personnelle des repères associés aux notions du programme de Terminale. Ce classement n’est pas fixé et peut varier selon l’interprétation."
  };

  const countLabel = (count) => `${count} repère${count > 1 ? "s" : ""}`;

  function renderAlphabetical() {
    const list = document.createElement("div");
    list.className = "blog-repere-list";
    sourceCards.forEach((card) => list.append(card.cloneNode(true)));
    panel.replaceChildren(list);
  }

  function renderCategories() {
    const groups = document.createElement("div");
    groups.className = "blog-repere-groups";

    categories.forEach((category, index) => {
      const cards = sourceCards.filter((card) => card.dataset.category === category.id);
      if (!cards.length) return;

      const section = document.createElement("section");
      section.className = "blog-repere-group";

      const heading = document.createElement("header");
      heading.className = "blog-repere-group-heading";

      const copy = document.createElement("div");
      const eyebrow = document.createElement("span");
      eyebrow.textContent = `Famille ${String(index + 1).padStart(2, "0")}`;
      const title = document.createElement("h3");
      title.textContent = category.label;
      const summary = document.createElement("p");
      summary.textContent = category.description;
      copy.append(eyebrow, title, summary);

      const count = document.createElement("strong");
      count.textContent = countLabel(cards.length);
      heading.append(copy, count);

      const list = document.createElement("div");
      list.className = "blog-repere-list blog-repere-group-list";
      cards.forEach((card) => list.append(card.cloneNode(true)));
      section.append(heading, list);
      groups.append(section);
    });

    panel.replaceChildren(groups);
  }

  function renderThemes() {
    const grid = document.createElement("div");
    grid.className = "blog-repere-theme-grid";

    themes.forEach((theme) => {
      const cards = sourceCards.filter((card) => (card.dataset.themes || "").split("|").includes(theme));
      if (!cards.length) return;

      const section = document.createElement("section");
      section.className = "blog-repere-theme";

      const heading = document.createElement("header");
      const title = document.createElement("h3");
      title.textContent = theme;
      const count = document.createElement("span");
      count.textContent = countLabel(cards.length);
      heading.append(title, count);

      const items = document.createElement("div");
      items.className = "blog-repere-theme-items";

      cards.forEach((card) => {
        const term = card.querySelector("dt");
        const definition = card.querySelector(".blog-repere-definition");
        const example = card.querySelector(".blog-repere-example");
        if (!term || !definition || !example) return;

        const details = document.createElement("details");
        details.className = "blog-repere-theme-item";
        const summary = document.createElement("summary");
        const summaryText = document.createElement("span");
        summaryText.textContent = term.textContent;
        const marker = document.createElement("i");
        marker.setAttribute("aria-hidden", "true");
        marker.textContent = "+";
        summary.append(summaryText, marker);

        const body = document.createElement("div");
        body.className = "blog-repere-theme-body";
        const definitionCopy = document.createElement("p");
        definitionCopy.className = "blog-repere-theme-definition";
        definitionCopy.innerHTML = definition.innerHTML;
        const exampleCopy = document.createElement("p");
        exampleCopy.className = "blog-repere-theme-example";
        exampleCopy.innerHTML = example.innerHTML;
        body.append(definitionCopy, exampleCopy);

        details.append(summary, body);
        items.append(details);
      });

      section.append(heading, items);
      grid.append(section);
    });

    panel.replaceChildren(grid);
  }

  const renderers = {
    alphabetical: renderAlphabetical,
    categories: renderCategories,
    themes: renderThemes
  };

  function selectView(view) {
    if (!renderers[view]) return;
    buttons.forEach((button) => {
      const active = button.dataset.repereView === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    description.textContent = viewDescriptions[view];
    renderers[view]();
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => selectView(button.dataset.repereView));
  });

  selectView("alphabetical");
})();
