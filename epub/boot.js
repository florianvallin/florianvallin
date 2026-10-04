(() => {
  const local = ["localhost", "127.0.0.1", "::1"].includes(location.hostname);
  if (local || location.protocol !== "https:" || !("serviceWorker" in navigator)) return;
  addEventListener("load", () => navigator.serviceWorker.register("/sw-atelier.js?v=20261005-v32", {scope: "/", updateViaCache: "none"}).then(registration => registration.update()).catch(() => {}), {once: true});
})();
