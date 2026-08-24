(() => {
  const videos = Array.isArray(window.ART_VIDEOS) ? window.ART_VIDEOS : [];
  if (!videos.length) return;

  const media = document.getElementById("artMedia");
  const title = document.getElementById("artTitle");
  const kicker = document.getElementById("artKicker");
  const description = document.getElementById("artDescription");
  const tags = document.getElementById("artTags");
  const list = document.getElementById("selectionList");
  const trigger = document.getElementById("selectionTrigger");
  const drawer = document.getElementById("selectionDrawer");
  const closeButton = document.getElementById("selectionClose");
  const backdrop = document.getElementById("drawerBackdrop");
  const position = document.getElementById("artPosition");
  const selectionCount = document.getElementById("selectionCount");
  const triggerCount = document.getElementById("selectionTriggerCount");
  const search = document.getElementById("selectionSearch");
  const sectionsRoot = document.getElementById("selectionSections");

  let currentSlug = null;
  let activeSection = "all";

  const normalize = (value) => String(value || "").toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, " ").replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  const bySlug = (slug) => videos.find((video) => video.slug === slug) || videos[0];
  const indexOf = (slug) => Math.max(0, videos.findIndex((video) => video.slug === slug));
  const formatNumber = (number) => String(number).padStart(2, "0");
  const sectionOf = (video) => video.section || "Autres";
  const searchText = (video) => normalize([video.title, video.section, video.description, ...(video.tags || []), ...(video.keywords || [])].join(" "));

  function youtubeId(url) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace(/^\//, "").split("/")[0];
      if (parsed.pathname.includes("/embed/")) return parsed.pathname.split("/embed/")[1].split("/")[0];
      if (parsed.pathname.includes("/shorts/")) return parsed.pathname.split("/shorts/")[1].split("/")[0];
      return parsed.searchParams.get("v");
    } catch (_) { return null; }
  }

  function setFallback(video) {
    media.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "art-media-fallback";
    const text = document.createElement("p");
    text.append("La vidéo ne peut pas être intégrée ici. ");
    const link = document.createElement("a");
    link.href = video.src;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "L’ouvrir directement";
    text.append(link, ".");
    wrapper.append(text);
    media.append(wrapper);
  }

  function renderMedia(video) {
    media.innerHTML = "";
    if (video.type === "youtube") {
      const id = youtubeId(video.src);
      if (!id) return setFallback(video);
      const iframe = document.createElement("iframe");
      iframe.className = "art-youtube";
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`;
      iframe.title = video.title;
      iframe.loading = "eager";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      media.append(iframe);
      return;
    }
    const videoElement = document.createElement("video");
    videoElement.className = "art-video";
    videoElement.controls = true;
    videoElement.playsInline = true;
    videoElement.preload = "metadata";
    videoElement.src = video.src;
    videoElement.setAttribute("aria-label", video.title);
    const fallback = document.createElement("a");
    fallback.href = video.src;
    fallback.textContent = "Ouvrir la vidéo";
    videoElement.append("Votre navigateur ne peut pas lire cette vidéo. ", fallback, ".");
    media.append(videoElement);
  }

  function filteredVideos() {
    const query = normalize(search?.value);
    return videos.filter((video) => {
      const sectionMatch = activeSection === "all" || normalize(sectionOf(video)) === activeSection;
      const queryMatch = !query || query.split(" ").every((word) => searchText(video).includes(word));
      return sectionMatch && queryMatch;
    });
  }

  function renderSections() {
    if (!sectionsRoot) return;
    const sections = [...new Set(videos.map(sectionOf))].sort((a,b) => a.localeCompare(b,"fr"));
    sectionsRoot.innerHTML = ["all", ...sections].map((section) => {
      const value = section === "all" ? "all" : normalize(section);
      const label = section === "all" ? "Tout" : section;
      const active = value === activeSection;
      return `<button type="button" data-art-section="${value}" class="${active ? "is-active" : ""}" aria-pressed="${active}">${label}</button>`;
    }).join("");
  }

  function renderList(activeSlug) {
    const visible = filteredVideos();
    list.innerHTML = "";
    if (!visible.length) {
      list.innerHTML = '<p class="selection-empty">Aucun fragment ne correspond à cette recherche.</p>';
    } else {
      visible.forEach((video) => {
        const absoluteIndex = indexOf(video.slug);
        const link = document.createElement("a");
        link.className = "selection-item";
        link.href = `/art/?v=${encodeURIComponent(video.slug)}`;
        link.dataset.videoSlug = video.slug;
        if (video.slug === activeSlug) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        }
        const number = document.createElement("span");
        number.className = "selection-index";
        number.textContent = formatNumber(absoluteIndex + 1);
        const main = document.createElement("span");
        main.className = "selection-item-main";
        const kind = document.createElement("span");
        kind.className = "selection-kind";
        kind.textContent = `${sectionOf(video)} · ${video.type === "youtube" ? "YouTube" : "Vidéo"}`;
        const name = document.createElement("span");
        name.className = "selection-name";
        name.textContent = video.title;
        const itemTags = document.createElement("span");
        itemTags.className = "selection-item-tags";
        itemTags.textContent = (video.tags || []).slice(0,3).map((tag) => `#${tag.replace(/\s+/g,"-")}`).join("  ");
        const arrow = document.createElement("span");
        arrow.className = "selection-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        main.append(kind, name, itemTags);
        link.append(number, main, arrow);
        list.append(link);
      });
    }
    if (selectionCount) selectionCount.textContent = `${formatNumber(visible.length)} fragment${visible.length > 1 ? "s" : ""}`;
  }

  function renderTags(video) {
    if (!tags) return;
    tags.innerHTML = (video.tags || []).map((tag) => `<button type="button" data-art-tag="${tag.replace(/"/g,"&quot;")}">#${tag.replace(/\s+/g,"-")}</button>`).join("");
  }

  function render(video, updateUrl = false) {
    if (!video) return;
    currentSlug = video.slug;
    renderMedia(video);
    renderList(video.slug);
    title.textContent = video.title;
    if (kicker) kicker.textContent = `${sectionOf(video)} · fragment visuel`;
    if (description) description.textContent = video.description || "";
    renderTags(video);
    document.title = `${video.title} | Art — Florian Vallin`;
    const currentIndex = indexOf(video.slug) + 1;
    if (position) position.textContent = `${formatNumber(currentIndex)} / ${formatNumber(videos.length)}`;
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("v", video.slug);
      history.pushState({ artVideo: video.slug }, "", url);
    }
  }

  function openDrawer() {
    document.body.classList.add("drawer-open");
    trigger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.tabIndex = 0;
    setTimeout(() => (search || closeButton).focus({ preventScroll:true }), 120);
  }

  function closeDrawer({ focusTrigger = true } = {}) {
    document.body.classList.remove("drawer-open");
    trigger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.tabIndex = -1;
    if (focusTrigger) trigger.focus({ preventScroll:true });
  }

  if (triggerCount) triggerCount.textContent = formatNumber(videos.length);
  renderSections();

  trigger.addEventListener("click", openDrawer);
  closeButton.addEventListener("click", () => closeDrawer());
  backdrop.addEventListener("click", () => closeDrawer());

  list.addEventListener("click", (event) => {
    const link = event.target.closest("[data-video-slug]");
    if (!link) return;
    event.preventDefault();
    render(bySlug(link.dataset.videoSlug), true);
    closeDrawer({ focusTrigger:false });
  });

  sectionsRoot?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-art-section]");
    if (!button) return;
    activeSection = button.dataset.artSection || "all";
    renderSections();
    renderList(currentSlug);
  });

  search?.addEventListener("input", () => renderList(currentSlug));
  tags?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-art-tag]");
    if (!button || !search) return;
    search.value = button.dataset.artTag || "";
    activeSection = "all";
    renderSections();
    renderList(currentSlug);
    openDrawer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("drawer-open")) closeDrawer();
  });

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    render(bySlug(params.get("v")), false);
  });

  const initialParams = new URLSearchParams(window.location.search);
  render(bySlug(initialParams.get("v")), false);
})();
