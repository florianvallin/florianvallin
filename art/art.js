(() => {
  const videos = Array.isArray(window.ART_VIDEOS) ? window.ART_VIDEOS : [];
  if (!videos.length) return;

  const media = document.getElementById("artMedia");
  const title = document.getElementById("artTitle");
  const list = document.getElementById("selectionList");
  const trigger = document.getElementById("selectionTrigger");
  const drawer = document.getElementById("selectionDrawer");
  const closeButton = document.getElementById("selectionClose");
  const backdrop = document.getElementById("drawerBackdrop");
  const position = document.getElementById("artPosition");
  const selectionCount = document.getElementById("selectionCount");
  const triggerCount = document.getElementById("selectionTriggerCount");

  let currentSlug = null;

  const bySlug = (slug) => videos.find((video) => video.slug === slug) || videos[0];
  const indexOf = (slug) => Math.max(0, videos.findIndex((video) => video.slug === slug));
  const formatNumber = (number) => String(number).padStart(2, "0");

  function youtubeId(url) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace(/^\//, "").split("/")[0];
      if (parsed.pathname.includes("/embed/")) return parsed.pathname.split("/embed/")[1].split("/")[0];
      if (parsed.pathname.includes("/shorts/")) return parsed.pathname.split("/shorts/")[1].split("/")[0];
      return parsed.searchParams.get("v");
    } catch (_) {
      return null;
    }
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

  function renderList(activeSlug) {
    list.innerHTML = "";

    videos.forEach((video, index) => {
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
      number.textContent = formatNumber(index + 1);

      const main = document.createElement("span");
      main.className = "selection-item-main";

      const kind = document.createElement("span");
      kind.className = "selection-kind";
      kind.textContent = video.type === "youtube" ? "YouTube" : "Vidéo";

      const name = document.createElement("span");
      name.className = "selection-name";
      name.textContent = video.title;

      const arrow = document.createElement("span");
      arrow.className = "selection-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";

      main.append(kind, name);
      link.append(number, main, arrow);
      list.append(link);
    });
  }

  function render(video, updateUrl = false) {
    if (!video || video.slug === currentSlug) return;
    currentSlug = video.slug;

    renderMedia(video);
    renderList(video.slug);
    title.textContent = video.title;
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
    closeButton.focus({ preventScroll: true });
  }

  function closeDrawer({ focusTrigger = true } = {}) {
    document.body.classList.remove("drawer-open");
    trigger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.tabIndex = -1;
    if (focusTrigger) trigger.focus({ preventScroll: true });
  }

  const countLabel = `${formatNumber(videos.length)} fragment${videos.length > 1 ? "s" : ""}`;
  if (selectionCount) selectionCount.textContent = countLabel;
  if (triggerCount) triggerCount.textContent = formatNumber(videos.length);

  trigger.addEventListener("click", openDrawer);
  closeButton.addEventListener("click", () => closeDrawer());
  backdrop.addEventListener("click", () => closeDrawer());

  list.addEventListener("click", (event) => {
    const link = event.target.closest("[data-video-slug]");
    if (!link) return;
    event.preventDefault();
    render(bySlug(link.dataset.videoSlug), true);
    closeDrawer({ focusTrigger: false });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("drawer-open")) {
      closeDrawer();
    }
  });

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    render(bySlug(params.get("v")), false);
  });

  const initialParams = new URLSearchParams(window.location.search);
  const initial = bySlug(initialParams.get("v"));
  currentSlug = null;
  render(initial, false);
})();
