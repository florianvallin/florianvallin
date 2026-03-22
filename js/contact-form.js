/**
 * Formulaire contact (Netlify) — validation, fetch POST, alertes.
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("contact-submit-btn");
  const submitText = document.getElementById("contact-submit-text");
  const submitSpinner = document.getElementById("contact-submit-spinner");
  const successAlert = document.getElementById("contact-success-alert");
  const errorAlert = document.getElementById("contact-error-alert");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const subjectInput = document.getElementById("subject");

  function hideAlert(el) {
    if (el) el.classList.add("hidden");
  }

  function showAlert(el) {
    if (!el) return;
    if (el === successAlert) hideAlert(errorAlert);
    if (el === errorAlert) hideAlert(successAlert);
    el.classList.remove("hidden");
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function clearFieldErrors() {
    ["email-error", "message-error"].forEach(function (id) {
      const err = document.getElementById(id);
      if (err) {
        err.textContent = "";
        err.classList.add("sr-only");
        err.classList.remove("contact-field-error");
      }
    });
  }

  function setFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (field && errorEl) {
      field.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.classList.remove("sr-only");
      errorEl.classList.add("contact-field-error");
    }
  }

  function clearFieldError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (field && errorEl) {
      field.removeAttribute("aria-invalid");
      errorEl.textContent = "";
      errorEl.classList.add("sr-only");
      errorEl.classList.remove("contact-field-error");
    }
  }

  function validateForm(formEl) {
    clearFieldErrors();
    hideAlert(successAlert);
    hideAlert(errorAlert);
    let ok = true;

    const email = formEl.querySelector("#email");
    if (email) {
      if (!email.value) {
        setFieldError("email", "email-error", "Veuillez saisir votre adresse e-mail");
        ok = false;
      } else if (!email.validity.valid) {
        setFieldError("email", "email-error", "Veuillez saisir une adresse e-mail valide");
        ok = false;
      }
    }

    const message = formEl.querySelector("#message");
    if (message && !message.value.trim()) {
      setFieldError("message", "message-error", "Veuillez saisir votre message");
      ok = false;
    }

    return ok;
  }

  function setLoading(loading) {
    if (!submitBtn || !submitText || !submitSpinner) return;
    submitBtn.disabled = loading;
    if (loading) {
      submitText.classList.add("is-hidden");
      submitSpinner.classList.add("is-visible");
    } else {
      submitText.classList.remove("is-hidden");
      submitSpinner.classList.remove("is-visible");
    }
  }

  function submitForm(event) {
    event.preventDefault();
    if (!validateForm(form)) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const recaptchaField = form.querySelector(
      'textarea[name="g-recaptcha-response"], input[name="g-recaptcha-response"]'
    );
    if (recaptchaField && !String(recaptchaField.value || "").trim()) {
      showAlert(errorAlert);
      return;
    }

    setLoading(true);
    hideAlert(successAlert);
    hideAlert(errorAlert);

    const formData = new FormData(form);
    // Netlify AJAX example posts to "/" (not the current pathname)
    const action = form.getAttribute("action");
    const url =
      action && action.trim() !== "" ? action : "/";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        setLoading(false);
        showAlert(successAlert);
        form.reset();
        clearFieldErrors();
      })
      .catch(function (err) {
        console.error("Error submitting form:", err);
        setLoading(false);
        showAlert(errorAlert);
      });
  }

  form.addEventListener("submit", submitForm);

  if (emailInput && subjectInput) {
    emailInput.addEventListener("input", function () {
      if (emailInput.value) {
        subjectInput.value = "Contact " + emailInput.value;
      }
      if (!emailInput.value.trim() || emailInput.validity.valid) {
        clearFieldError("email", "email-error");
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener("input", function () {
      clearFieldError("message", "message-error");
    });
  }
});
