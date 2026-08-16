(function () {
    "use strict";

    const form = document.getElementById("manage-form");

    if (!form) {
        return;
    }

    const firstNameInput = document.getElementById("firstName");
    const countryCodeInput = document.getElementById("countryCode");
    const preferenceInputs = Array.from(
        form.querySelectorAll('input[name="preferences"]')
    );

    const firstNameError = document.getElementById("first-name-error");
    const countryError = document.getElementById("country-error");
    const preferencesError = document.getElementById("preferences-error");

    const managementStatus = document.getElementById("management-status");
    const feedback = document.getElementById("form-feedback");

    const submitButton = document.getElementById("manage-submit");
    const submitLabel = submitButton.querySelector(".submit-label");

    let managementToken = null;
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

    function showFeedback(message, type, shouldFocus = true) {
        feedback.textContent = message;
        feedback.classList.remove("is-success", "is-error");
        feedback.classList.add("is-visible", `is-${type}`);

        if (shouldFocus) {
            feedback.focus();
        }
    }

    function showManagementStatus(message, type, shouldFocus = true) {
        managementStatus.textContent = message;
        managementStatus.classList.remove(
            "is-loading",
            "is-error"
        );
        managementStatus.classList.add("is-visible", `is-${type}`);

        if (shouldFocus) {
            managementStatus.focus();
        }
    }

    function hideManagementStatus() {
        managementStatus.textContent = "";
        managementStatus.classList.remove(
            "is-visible",
            "is-loading",
            "is-error"
        );
    }

    function getSelectedPreferences() {
        return preferenceInputs
            .filter((input) => input.checked)
            .map((input) => input.value);
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
        const countryCode = countryCodeInput.value.trim();

        if (!countryCode) {
            setFieldError(
                countryCodeInput,
                countryError,
                "Selecciona tu país."
            );
            return false;
        }

        if (!/^[A-Za-z]{2}$/.test(countryCode)) {
            setFieldError(
                countryCodeInput,
                countryError,
                "El código de país debe tener exactamente 2 letras."
            );
            return false;
        }

        setFieldError(countryCodeInput, countryError, "");
        return true;
    }

    function validatePreferences() {
        if (getSelectedPreferences().length === 0) {
            preferencesError.textContent =
                "Selecciona al menos un tema de interés.";
            return false;
        }

        preferencesError.textContent = "";
        return true;
    }

    function validateForm() {
        const firstNameValid = validateFirstName();
        const countryValid = validateCountryCode();
        const preferencesValid = validatePreferences();

        return firstNameValid
            && countryValid
            && preferencesValid;
    }

    function focusFirstInvalidField() {
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
            ? "Guardando..."
            : "Guardar cambios";
    }

    function getManagementEndpoint() {
        const config = window.Survival72Config;

        if (!config || !config.apiBaseUrl) {
            return null;
        }

        return `${config.apiBaseUrl.replace(/\/$/, "")}/api/subscriptions/manage`;
    }

    function captureManagementToken() {
        const hash = window.location.hash;

        if (!hash) {
            return null;
        }

        const parameters = new URLSearchParams(hash.slice(1));
        const token = parameters.get("token");

        if (!token || !token.trim()) {
            return null;
        }

        history.replaceState(
            null,
            document.title,
            `${window.location.pathname}${window.location.search}`
        );

        return token.trim();
    }

    function populateForm(subscription) {
        firstNameInput.value = subscription.firstName || "";
        countryCodeInput.value = subscription.countryCode || "";

        const selectedPreferences = new Set(
            Array.isArray(subscription.preferences)
                ? subscription.preferences
                : []
        );

        preferenceInputs.forEach((input) => {
            input.checked = selectedPreferences.has(input.value);
        });
    }

    function buildPayload() {
        const firstName = firstNameInput.value.trim();

        return {
            firstName: firstName || null,
            countryCode: countryCodeInput.value.trim().toUpperCase(),
            preferences: getSelectedPreferences()
        };
    }

    async function readJsonSafely(response) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    async function loadSubscription() {
        const endpoint = getManagementEndpoint();

        if (!endpoint) {
            showManagementStatus(
                "El servicio de gestión no está disponible en este momento.",
                "error"
            );
            return;
        }

        showManagementStatus(
            "Cargando suscripción...",
            "loading",
            false
        );

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${managementToken}`
            }
        });

        const responseBody = await readJsonSafely(response);

        if (response.status === 200 && responseBody) {
            populateForm(responseBody);
            hideManagementStatus();
            form.hidden = false;
            firstNameInput.focus();
            return;
        }

        if (
            response.status === 404
            && responseBody
            && responseBody.code === "SUBSCRIPTION_ACCESS_NOT_FOUND"
        ) {
            showManagementStatus(
                "Este enlace de gestión no es válido o ya no está disponible.",
                "error"
            );
            return;
        }

        showManagementStatus(
            "No pudimos cargar tu suscripción en este momento. Intenta nuevamente más tarde.",
            "error"
        );
    }

    async function updateSubscription() {
        const endpoint = getManagementEndpoint();

        if (!endpoint) {
            showFeedback(
                "El servicio de gestión no está disponible en este momento.",
                "error"
            );
            return;
        }

        const response = await fetch(endpoint, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${managementToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(buildPayload())
        });

        const responseBody = await readJsonSafely(response);

        if (response.status === 200 && responseBody) {
            populateForm(responseBody);

            showFeedback(
                "Tus cambios fueron guardados correctamente.",
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

        if (
            response.status === 404
            && responseBody
            && responseBody.code === "SUBSCRIPTION_ACCESS_NOT_FOUND"
        ) {
            form.hidden = true;

            showManagementStatus(
                "Este enlace de gestión no es válido o ya no está disponible.",
                "error"
            );
            return;
        }

        showFeedback(
            "No pudimos guardar los cambios en este momento. Intenta nuevamente más tarde.",
            "error"
        );
    }

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
            await updateSubscription();
        } catch {
            showFeedback(
                "No pudimos conectar con el servicio. Verifica tu conexión e intenta nuevamente.",
                "error"
            );
        } finally {
            setSubmittingState(false);
        }
    });

    async function initializeManagement() {
        managementToken = captureManagementToken();

        if (!managementToken) {
            showManagementStatus(
                "Este enlace de gestión no es válido o ya no está disponible.",
                "error"
            );
            return;
        }

        try {
            await loadSubscription();
        } catch {
            showManagementStatus(
                "No pudimos conectar con el servicio. Verifica tu conexión e intenta nuevamente.",
                "error"
            );
        }
    }

    initializeManagement();
})();
