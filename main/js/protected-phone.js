/**
 * Coordonnées masquées dans le HTML : décalage -3 → inversion → base64.
 * Le contenu n'est reconstruit qu'après une action volontaire de l'utilisateur.
 */
function decodeProtectedPayload(encoded) {
  const unshifted = encoded
    .split("")
    .map((c) => String.fromCharCode(c.charCodeAt(0) - 3))
    .join("");
  const reversed = unshifted.split("").reverse().join("");
  return atob(reversed);
}

function initProtectedContactBlocks() {
  document.querySelectorAll(".protected-content").forEach((element) => {
    const trigger = element.querySelector(".protected-trigger");
    const encoded = element.getAttribute("data-encoded");
    const contentType = element.getAttribute("data-content-type");

    if (!trigger || !encoded || !["phone", "email"].includes(contentType)) return;

    trigger.addEventListener(
      "click",
      () => {
        const decoded = decodeProtectedPayload(encoded);
        const link = document.createElement("a");

        if (contentType === "phone") {
          link.href = `tel:${decoded.replace(/\s/g, "")}`;
          link.setAttribute("aria-label", `Appeler le ${decoded}`);
        } else {
          link.href = `mailto:${decoded}`;
          link.setAttribute("aria-label", `Envoyer un e-mail à ${decoded}`);
        }

        link.textContent = decoded;
        link.className = element.closest(".contact-method")
          ? "contact-direct-link"
          : element.closest(".contact-alert")
            ? "contact-alert__link"
            : "phone-number";

        trigger.setAttribute("aria-expanded", "true");
        element.replaceWith(link);
      },
      { once: true },
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProtectedContactBlocks, { once: true });
} else {
  initProtectedContactBlocks();
}
