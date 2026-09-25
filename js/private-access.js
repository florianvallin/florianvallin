(() => {
  "use strict";
  const SESSION_KEY = "philosophal-private-access-v1";
  const PASSWORD_HASH = "f6cf7f88816a2ec9b06d512d87224c0a7e04f4bc9b0acefbe837af735b4c78e9";
  function isUnlocked() {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch (_) { return false; }
  }
  async function digest(value) {
    if (!window.crypto?.subtle || typeof TextEncoder === "undefined") return "";
    const bytes = new TextEncoder().encode(String(value || ""));
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  async function unlock(password) {
    const valid = (await digest(password)) === PASSWORD_HASH;
    if (valid) { try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (_) {} }
    return valid;
  }
  function lock() { try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {} }
  window.FV_PRIVATE_ACCESS = Object.freeze({ isUnlocked, unlock, lock });
})();
