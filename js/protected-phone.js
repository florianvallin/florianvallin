/**
 * Numéro masqué : décalage -3 → inversion → base64 (inverse de l’encodage côté build).
 */
function decodeProtectedPayload(encoded) {
  const unshifted = encoded
    .split("")
    .map((c) => String.fromCharCode(c.charCodeAt(0) - 3))
    .join("");
  const reversed = unshifted.split("").reverse().join("");
  return atob(reversed);
}

function initProtectedPhoneBlocks() {
  document.querySelectorAll(".protected-content").forEach((element) => {
    const trigger = element.querySelector(".protected-trigger");
    const encoded = element.getAttribute("data-encoded");
    const contentType = element.getAttribute("data-content-type");
    if (!trigger || !encoded || contentType !== "phone") return;

    trigger.addEventListener(
      "click",
      () => {
        const decoded = decodeProtectedPayload(encoded);
        const tel = decoded.replace(/\s/g, "");
        const link = document.createElement("a");
        link.href = `tel:${tel}`;
        link.textContent = decoded;
        const isAlert = element.closest(".contact-alert");
        if (isAlert) {
          link.className = "contact-alert__link";
        } else {
          link.className = "phone-number";
          link.id = "phoneNumber";
        }
        trigger.setAttribute("aria-expanded", "true");
        element.replaceWith(link);
      },
      { once: true }
    );
  });
}

document.addEventListener("DOMContentLoaded", initProtectedPhoneBlocks);
