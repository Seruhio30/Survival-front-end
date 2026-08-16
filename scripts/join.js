(function () {
    "use strict";

    const form = document.getElementById("join-form");

    if (!form) {
        return;
    }

    const emailInput = document.getElementById("email");
    const firstNameInput = document.getElementById("firstName");
    const countryCodeInput = document.getElementById("countryCode");
    const preferenceInputs = Array.from(
        form.querySelectorAll('input[name="preferences"]')
    );

    const emailError = document.getElementById("email-error");
    const firstNameError = document.getElementById("first-name-error");
    const countryError = document.getElementById("country-error");
    const preferencesError = document.getElementById("preferences-error");

    const feedback = document.getElementById("form-feedback");
    const submitButton = document.getElementById("join-submit");
    const submitLabel = submitButton.querySelector(".submit-label");

    let isSubmitting = false;

    function setFieldError(input, errorElement, message) {
        errorElement.textContent = message;

        if (message) {
            input.setAttribute("aria-invalid", "true");
        } else {
            input.removeAttribute("aria-invalid");
        }
    }

    function clearFeedback() {
        feedback.textContent = "";
        feedback.classList.remove("is-visible", "is-success", "is-error");
    }

    function showFeedback(message, type) {
        feedback.textContent = message;
        feedback.classList.remove("is-success", "is-error");
        feedback.classList.add("is-visible", `is-${type}`);
        feedback.focus();
    }

    function getSelectedPreferences() {
        return preferenceInputs
            .filter((input) => input.checked)
            .map((input) => input.value);
    }

    function validateEmail() {
        const email = emailInput.value.trim();

        if (!email) {
            setFieldError(
                emailInput,
                emailError,
                "Ingresa tu correo electrónico."
            );
            return false;
        }

        if (email.length > 254) {
            setFieldError(
                emailInput,
                emailError,
                "El correo electrónico es demasiado largo."
            );
            return false;
        }

        if (!emailInput.validity.valid) {
            setFieldError(
                emailInput,
                emailError,
                "Ingresa un correo electrónico válido."
            );
            return false;
        }

        setFieldError(emailInput, emailError, "");
        return true;
    }

    function validateFirstName() {
        const firstName = firstNameInput.value.trim();

        if (firstName.length > 80) {
            setFieldError(
                firstNameInput,
                firstNameError,
                "El nombre no puede superar los 80 caracteres."
            );
            return false;
        }

        setFieldError(firstNameInput, firstNameError, "");
        return true;
    }

    function validateCountryCode() {
        if (!countryCodeInput.value) {
            setFieldError(
                countryCodeInput,
                countryError,
                "Selecciona tu país."
            );
            return false;
        }

        setFieldError(countryCodeInput, countryError, "");
        return true;
    }

    function validatePreferences() {
        const selectedPreferences = getSelectedPreferences();

        if (selectedPreferences.length === 0) {
            preferencesError.textContent =
                "Selecciona al menos un tema de interés.";
            return false;
        }

        preferencesError.textContent = "";
        return true;
    }

    function validateForm() {
        const emailValid = validateEmail();
        const firstNameValid = validateFirstName();
        const countryValid = validateCountryCode();
        const preferencesValid = validatePreferences();

        return emailValid
            && firstNameValid
            && countryValid
            && preferencesValid;
    }

    function focusFirstInvalidField() {
        if (emailInput.getAttribute("aria-invalid") === "true") {
            emailInput.focus();
            return;
        }

        if (firstNameInput.getAttribute("aria-invalid") === "true") {
            firstNameInput.focus();
            return;
        }

        if (countryCodeInput.getAttribute("aria-invalid") === "true") {
            countryCodeInput.focus();
            return;
        }

        if (preferencesError.textContent) {
            preferenceInputs[0].focus();
        }
    }

    function setSubmittingState(submitting) {
        isSubmitting = submitting;
        submitButton.disabled = submitting;
        submitButton.setAttribute("aria-disabled", String(submitting));
        submitLabel.textContent = submitting
            ? "Enviando..."
            : "Enviar solicitud";
    }

    function buildPayload() {
        const firstName = firstNameInput.value.trim();

        return {
            email: emailInput.value.trim(),
            firstName: firstName || null,
            countryCode: countryCodeInput.value,
            preferences: getSelectedPreferences()
        };
    }

    function getJoinEndpoint() {
        const config = window.Survival72Config;

        if (!config || !config.apiBaseUrl) {
            return null;
        }

        return `${config.apiBaseUrl.replace(/\/$/, "")}/api/join`;
    }

    async function submitJoinRequest() {
        const endpoint = getJoinEndpoint();

        if (!endpoint) {
            showFeedback(
                "El servicio de suscripción no está disponible en este momento. Intenta nuevamente más tarde.",
                "error"
            );
            return;
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(buildPayload())
        });

        let responseBody = null;

        try {
            responseBody = await response.json();
        } catch {
            responseBody = null;
        }

        if (
            response.status === 200
            && responseBody
            && responseBody.status === "REQUEST_ACCEPTED"
        ) {
            form.reset();

            showFeedback(
                "Solicitud recibida. Revisa tu correo para continuar.",
                "success"
            );

            return;
        }

        if (response.status === 400) {
            showFeedback(
                "Revisa la información ingresada e intenta nuevamente.",
                "error"
            );
            return;
        }

        showFeedback(
            "No pudimos procesar la solicitud en este momento. Intenta nuevamente más tarde.",
            "error"
        );
    }

    emailInput.addEventListener("blur", validateEmail);
    firstNameInput.addEventListener("blur", validateFirstName);
    countryCodeInput.addEventListener("change", validateCountryCode);

    preferenceInputs.forEach((input) => {
        input.addEventListener("change", validatePreferences);
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        clearFeedback();

        if (!validateForm()) {
            focusFirstInvalidField();
            return;
        }

        setSubmittingState(true);

        try {
            await submitJoinRequest();
        } catch {
            showFeedback(
                "No pudimos conectar con el servicio. Verifica tu conexión e intenta nuevamente.",
                "error"
            );
        } finally {
            setSubmittingState(false);
        }
    });
})();
