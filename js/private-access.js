(() => {
  "use strict";

  const SESSION_KEY = "philosophal-access-state-v2";
  const ROUNDS = 350000;
  const encoder = new TextEncoder();

  // Vérificateurs dérivés : aucun mot de passe ni hash SHA-256 direct n'est stocké ici.
  const ACCESS_PROFILES = Object.freeze([
    Object.freeze({
      role: "private",
      salt: "DQLxajf/7X4Q1DJmgd+m6g==",
      verifier: "iSbsV2ojr6OKNJa7qqZ7d8Id7pIQGY/GLTspGNehASk="
    }),
    Object.freeze({
      role: "student",
      salt: "3o+rRZlYJzR7193uyI5KVQ==",
      verifier: "T7S0i+mQG4IN8UgBJpgwtMVWonTZRqLliadDpv6+jvw="
    })
  ]);

  function readRole() {
    try {
      const value = sessionStorage.getItem(SESSION_KEY);
      return value === "private" || value === "student" ? value : "";
    } catch (_) {
      return "";
    }
  }

  function writeRole(value) {
    try {
      if (value === "private" || value === "student") sessionStorage.setItem(SESSION_KEY, value);
      else sessionStorage.removeItem(SESSION_KEY);
    } catch (_) {}
  }

  function ownerUnlocked() {
    return readRole() === "private";
  }

  function studentUnlocked() {
    return readRole() === "student";
  }

  function role() {
    return readRole();
  }

  function bytesToHex(bytes) {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function base64ToBytes(value) {
    const raw = atob(value);
    return Uint8Array.from(raw, (char) => char.charCodeAt(0));
  }

  async function sha256Hex(value) {
    if (!window.crypto?.subtle) return "";
    const digest = await crypto.subtle.digest("SHA-256", encoder.encode(String(value ?? "")));
    return bytesToHex(new Uint8Array(digest));
  }

  async function deriveVerifier(stageOneHex, saltBase64) {
    const material = await crypto.subtle.importKey(
      "raw",
      encoder.encode(stageOneHex),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: base64ToBytes(saltBase64),
        iterations: ROUNDS
      },
      material,
      256
    );
    return new Uint8Array(bits);
  }

  function equalBytes(left, right) {
    if (!(left instanceof Uint8Array) || !(right instanceof Uint8Array) || left.length !== right.length) return false;
    let diff = 0;
    for (let index = 0; index < left.length; index += 1) diff |= left[index] ^ right[index];
    return diff === 0;
  }

  async function unlockRole(password) {
    if (!window.crypto?.subtle || typeof TextEncoder === "undefined") return "";
    const stageOne = await sha256Hex(password);
    if (!stageOne) return "";

    // Les deux profils sont calculés à chaque tentative pour éviter de révéler le rôle par le temps de réponse.
    const attempts = await Promise.all(
      ACCESS_PROFILES.map((profile) => deriveVerifier(stageOne, profile.salt))
    );

    let matchedRole = "";
    for (let index = 0; index < ACCESS_PROFILES.length; index += 1) {
      const expected = base64ToBytes(ACCESS_PROFILES[index].verifier);
      if (equalBytes(attempts[index], expected)) matchedRole = ACCESS_PROFILES[index].role;
    }

    if (matchedRole) writeRole(matchedRole);
    return matchedRole;
  }

  async function unlock(password) {
    return (await unlockRole(password)) === "private";
  }

  function lock() {
    writeRole("");
  }

  window.FV_PRIVATE_ACCESS = Object.freeze({
    isUnlocked: ownerUnlocked,
    isStudentUnlocked: studentUnlocked,
    role,
    unlock,
    unlockRole,
    lock
  });
})();
