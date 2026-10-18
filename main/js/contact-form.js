/**
 * Formulaire de contact (Netlify)
 * Validation personnalisée + notifications flottantes accessibles.
 */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("contact-submit-btn");
  const submitText = document.getElementById("contact-submit-text");
  const submitSpinner = document.getElementById("contact-submit-spinner");
  const successAlert = document.getElementById("contact-success-alert");
  const errorAlert = document.getElementById("contact-error-alert");
  const emailInput = document.getElementById("email");
  const prestationInput = document.getElementById("prestation");
  const messageInput = document.getElementById("message");
  const subjectInput = document.getElementById("subject");

  let popupTimer = null;

  // Désactive les bulles natives du navigateur afin d'utiliser une validation cohérente avec le site.
  form.noValidate = true;

  // Les anciennes alertes intégrées restent masquées : la notification flottante les remplace.
  successAlert?.classList.add("hidden");
  errorAlert?.classList.add("hidden");

  const popup = createPopup();

  function createPopup() {
    const root = document.createElement("div");
    root.className = "form-popup";
    root.setAttribute("aria-hidden", "true");

    const icon = document.createElement("span");
    icon.className = "form-popup__icon";
    icon.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "form-popup__content";

    const title = document.createElement("p");
    title.className = "form-popup__title";

    const message = document.createElement("div");
    message.className = "form-popup__message";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "form-popup__close";
    close.setAttribute("aria-label", "Fermer la notification");
    close.textContent = "×";
    close.addEventListener("click", hidePopup);

    content.append(title, message);
    root.append(icon, content, close);
    document.body.appendChild(root);

    return { root, icon, title, message };
  }

  function showPopup(type, title, messages, duration) {
    window.clearTimeout(popupTimer);

    popup.root.classList.remove("form-popup--success", "form-popup--error", "is-visible");
    popup.root.classList.add(type === "success" ? "form-popup--success" : "form-popup--error");
    popup.root.setAttribute("role", type === "success" ? "status" : "alert");
    popup.root.setAttribute("aria-live", type === "success" ? "polite" : "assertive");
    popup.root.setAttribute("aria-hidden", "false");

    popup.icon.textContent = type === "success" ? "✓" : "!";
    popup.title.textContent = title;
    popup.message.replaceChildren();

    if (messages.length === 1) {
      const paragraph = document.createElement("p");
      paragraph.textContent = messages[0];
      popup.message.appendChild(paragraph);
    } else {
      const intro = document.createElement("p");
      intro.textContent = "Merci de compléter :";

      const list = document.createElement("ul");
      messages.forEach(function (text) {
        const item = document.createElement("li");
        item.textContent = text;
        list.appendChild(item);
      });

      popup.message.append(intro, list);
    }

    // Deux frames garantissent que la transition d'entrée est toujours jouée.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        popup.root.classList.add("is-visible");
      });
    });

    popupTimer = window.setTimeout(hidePopup, duration);
  }

  function hidePopup() {
    window.clearTimeout(popupTimer);
    popup.root.classList.remove("is-visible");
    popup.root.setAttribute("aria-hidden", "true");
  }

  function clearInvalidState(field) {
    if (!field) return;
    field.removeAttribute("aria-invalid");
  }

  function markInvalid(field) {
    if (!field) return;
    field.setAttribute("aria-invalid", "true");
  }

  function clearAllInvalidStates() {
    [emailInput, prestationInput, messageInput].forEach(clearInvalidState);
  }

  function validateForm() {
    clearAllInvalidStates();

    const missing = [];
    let firstInvalid = null;

    const registerError = function (field, label) {
      markInvalid(field);
      missing.push(label);
      if (!firstInvalid) firstInvalid = field;
    };

    if (!emailInput || !emailInput.value.trim()) {
      registerError(emailInput, "Votre adresse e-mail");
    } else if (!emailInput.validity.valid) {
      registerError(emailInput, "Une adresse e-mail valide");
    }

    if (!prestationInput || !prestationInput.value) {
      registerError(prestationInput, "Le type d’accompagnement souhaité");
    }

    if (!messageInput || !messageInput.value.trim()) {
      registerError(messageInput, "Votre message");
    }

    return { valid: missing.length === 0, missing, firstInvalid };
  }

  function setLoading(loading) {
    if (!submitBtn || !submitText || !submitSpinner) return;

    submitBtn.disabled = loading;
    submitBtn.setAttribute("aria-busy", String(loading));
    submitText.classList.toggle("is-hidden", loading);
    submitSpinner.classList.toggle("is-visible", loading);
  }

  async function submitForm(event) {
    event.preventDefault();
    hidePopup();

    const validation = validateForm();
    if (!validation.valid) {
      showPopup("error", "Informations manquantes", validation.missing, 6500);
      validation.firstInvalid?.focus();
      return;
    }

    const recaptchaField = form.querySelector(
      'textarea[name="g-recaptcha-response"], input[name="g-recaptcha-response"]'
    );

    if (recaptchaField && !String(recaptchaField.value || "").trim()) {
      showPopup(
        "error",
        "Validation nécessaire",
        ["Veuillez confirmer que vous n’êtes pas un robot."],
        6500
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(form);
      const action = form.getAttribute("action");
      const url = action && action.trim() !== "" ? action : "/";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      form.reset();
      clearAllInvalidStates();

      showPopup(
        "success",
        "Message bien envoyé",
        ["Merci pour votre message. Je vous répondrai dans les plus brefs délais."],
        5000
      );
    } catch (error) {
      console.error("Erreur lors de l’envoi du formulaire :", error);

      showPopup(
        "error",
        "Envoi impossible",
        ["Le message n’a pas pu être envoyé. Réessayez dans quelques instants ou contactez-moi directement par e-mail."],
        7000
      );
    } finally {
      setLoading(false);
    }
  }

  form.addEventListener("submit", submitForm);

  emailInput?.addEventListener("input", function () {
    clearInvalidState(emailInput);
    if (subjectInput) {
      subjectInput.value = emailInput.value.trim()
        ? "Contact " + emailInput.value.trim()
        : "[%{siteName}] Nouveau message";
    }
  });

  prestationInput?.addEventListener("change", function () {
    clearInvalidState(prestationInput);
  });

  messageInput?.addEventListener("input", function () {
    clearInvalidState(messageInput);
  });
});
