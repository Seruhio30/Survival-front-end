(function () {
    "use strict";

    const actionContainer = document.getElementById("unsubscribe-action");
    const submitButton = document.getElementById("unsubscribe-submit");
    const submitLabel = submitButton
        ? submitButton.querySelector(".submit-label")
        : null;
    const statusElement = document.getElementById("unsubscribe-status");

    if (
        !actionContainer
        || !submitButton
        || !submitLabel
        || !statusElement
    ) {
        return;
    }

    let managementToken = null;
    let isSubmitting = false;
    let isCancelled = false;

    function getUnsubscribeEndpoint() {
        const config = window.Survival72Config;

        if (!config || !config.apiBaseUrl) {
            return null;
        }

        return `${config.apiBaseUrl.replace(/\/$/, "")}/api/subscriptions/unsubscribe`;
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

    function showStatus(message, type) {
        statusElement.textContent = message;
        statusElement.classList.remove("is-success", "is-error");
        statusElement.classList.add("is-visible", `is-${type}`);
        statusElement.focus();
    }

    function setSubmittingState(submitting) {
        isSubmitting = submitting;
        submitButton.disabled = submitting;
        submitButton.setAttribute("aria-disabled", String(submitting));
        submitLabel.textContent = submitting
            ? "Cancelando..."
            : "Cancelar mi suscripción";
    }

    async function readJsonSafely(response) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    async function unsubscribe() {
        const endpoint = getUnsubscribeEndpoint();

        if (!endpoint) {
            showStatus(
                "El servicio de cancelación no está disponible en este momento.",
                "error"
            );
            return;
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${managementToken}`
            }
        });

        const responseBody = await readJsonSafely(response);

        if (response.status === 200) {
            isCancelled = true;
            managementToken = null;
            actionContainer.hidden = true;

            showStatus(
                "Tu suscripción fue cancelada correctamente.",
                "success"
            );
            return;
        }

        if (
            response.status === 404
            && responseBody
            && responseBody.code === "SUBSCRIPTION_ACCESS_NOT_FOUND"
        ) {
            managementToken = null;
            actionContainer.hidden = true;

            showStatus(
                "Este enlace de cancelación no es válido o ya no está disponible.",
                "error"
            );
            return;
        }

        showStatus(
            "No pudimos cancelar tu suscripción en este momento. Intenta nuevamente más tarde.",
            "error"
        );
    }

    submitButton.addEventListener("click", async function () {
        if (isSubmitting || isCancelled || !managementToken) {
            return;
        }

        setSubmittingState(true);

        try {
            await unsubscribe();
        } catch {
            showStatus(
                "No pudimos conectar con el servicio. Verifica tu conexión e intenta nuevamente.",
                "error"
            );
        } finally {
            if (!isCancelled && managementToken) {
                setSubmittingState(false);
            }
        }
    });

    function initializeUnsubscribe() {
        managementToken = captureManagementToken();

        if (!managementToken) {
            actionContainer.hidden = true;

            showStatus(
                "Este enlace de cancelación no es válido o ya no está disponible.",
                "error"
            );
        }
    }

    initializeUnsubscribe();
})();
