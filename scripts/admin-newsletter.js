(function () {
    "use strict";

    const PAGE_SIZE = 10;

    const state = {
        currentPage: 0,
        totalPages: 0,
        hasNext: false,
        loading: false,
        editingId: null,
        submitting: false,
        audiencePage: 0,
        audienceTotalPages: 0,
        audienceHasNext: false,
        loadingAudience: false,
        markingReady: false,
        selectedNewsletterStatus: null,
        formDirty: false
    };

    const elements = {
        newsletterView: document.getElementById("newsletter-view"),
        globalFeedback: document.getElementById("newsletter-global-feedback"),
        filterStatus: document.getElementById("newsletter-filter-status"),
        newsletterList: document.getElementById("newsletter-list"),
        emptyMessage: document.getElementById("empty-newsletter-message"),
        previousPageButton: document.getElementById(
            "newsletter-previous-page-button"
        ),
        nextPageButton: document.getElementById(
            "newsletter-next-page-button"
        ),
        pageSummary: document.getElementById("newsletter-page-summary"),
        refreshButton: document.getElementById("refresh-newsletters-button"),
        newButton: document.getElementById("new-newsletter-button"),
        form: document.getElementById("newsletter-form"),
        id: document.getElementById("newsletter-id"),
        subject: document.getElementById("newsletter-subject"),
        body: document.getElementById("newsletter-body"),
        submitButton: document.getElementById("newsletter-submit"),
        formFeedback: document.getElementById("newsletter-form-feedback"),
        editorTitle: document.getElementById("newsletter-editor-title"),
        cancelEditButton: document.getElementById(
            "cancel-newsletter-edit-button"
        ),
        editorPanel: document.getElementById("newsletter-editor-panel"),
        showReadyButton: document.getElementById(
            "show-newsletter-ready-button"
        ),
        readyConfirmation: document.getElementById(
            "newsletter-ready-confirmation"
        ),
        confirmReadyButton: document.getElementById(
            "confirm-newsletter-ready-button"
        ),
        cancelReadyButton: document.getElementById(
            "cancel-newsletter-ready-button"
        ),
        audiencePanel: document.getElementById(
            "newsletter-audience-panel"
        ),
        audienceSummary: document.getElementById(
            "newsletter-audience-summary"
        ),
        audienceFeedback: document.getElementById(
            "newsletter-audience-feedback"
        ),
        audienceList: document.getElementById(
            "newsletter-audience-list"
        ),
        audiencePagination: document.getElementById(
            "newsletter-audience-pagination"
        ),
        audiencePreviousButton: document.getElementById(
            "newsletter-audience-previous-button"
        ),
        audienceNextButton: document.getElementById(
            "newsletter-audience-next-button"
        ),
        audiencePageSummary: document.getElementById(
            "newsletter-audience-page-summary"
        ),
        preferenceCheckboxes: Array.from(
            document.querySelectorAll(
                'input[name="newsletter-preferences"]'
            )
        )
    };

    const PREFERENCE_LABELS = {
        GENERAL_PREPAREDNESS: "Preparación del hogar y la familia",
        EMERGENCY_KIT: "Mochila y suministros de emergencia",
        PRACTICAL_SKILLS: "Emergencias y habilidades prácticas",
        EVENTS_AND_UPDATES: "Charlas y novedades de Survival72"
    };

    const STATUS_LABELS = {
        DRAFT: "Borrador",
        READY_TO_SEND: "Lista para enviar",
        SENT: "Enviada"
    };

    function setFeedback(message, type) {
        elements.globalFeedback.textContent = message || "";
        elements.globalFeedback.classList.remove(
            "is-visible",
            "is-success",
            "is-error"
        );

        if (!message) {
            return;
        }

        elements.globalFeedback.classList.add("is-visible");

        if (type === "success") {
            elements.globalFeedback.classList.add("is-success");
        }

        if (type === "error") {
            elements.globalFeedback.classList.add("is-error");
        }
    }

    function setFormFeedback(message, type) {
        elements.formFeedback.textContent = message || "";
        elements.formFeedback.classList.remove(
            "is-visible",
            "is-success",
            "is-error"
        );

        if (!message) {
            return;
        }

        elements.formFeedback.classList.add("is-visible");

        if (type === "success") {
            elements.formFeedback.classList.add("is-success");
        }

        if (type === "error") {
            elements.formFeedback.classList.add("is-error");
        }
    }

    function getSelectedPreferences() {
        return elements.preferenceCheckboxes
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);
    }

    function resetForm(options = {}) {
        state.editingId = null;
        state.formDirty = false;

        elements.form.reset();
        elements.id.value = "";
        elements.editorTitle.textContent = "Nueva newsletter";
        elements.submitButton.textContent = "Crear newsletter";
        elements.cancelEditButton.hidden = true;

        if (!options.keepFeedback) {
            setFormFeedback("", null);
        }
    }

    function buildPayload() {
        return {
            subject: elements.subject.value.trim(),
            body: elements.body.value.trim(),
            preferences: getSelectedPreferences()
        };
    }

    function validatePreferences() {
        if (getSelectedPreferences().length > 0) {
            return true;
        }

        setFormFeedback(
            "Selecciona al menos una preferencia para la audiencia.",
            "error"
        );

        elements.preferenceCheckboxes[0]?.focus();
        return false;
    }

    function applyNewsletterToForm(item) {
        state.editingId = item.id;
        state.selectedNewsletterStatus = item.status || "DRAFT";
        state.formDirty = false;

        elements.id.value = String(item.id);
        elements.subject.value = item.subject || "";
        elements.body.value = item.body || "";

        const selectedPreferences = new Set(
            Array.isArray(item.preferences) ? item.preferences : []
        );

        for (const checkbox of elements.preferenceCheckboxes) {
            checkbox.checked = selectedPreferences.has(checkbox.value);
        }

        elements.editorTitle.textContent =
            item.status === "SENT"
                ? "Newsletter enviada"
                : "Editar newsletter";

        elements.submitButton.textContent = "Guardar cambios";
        elements.cancelEditButton.hidden = false;

        const readOnly = item.status === "SENT";

        elements.subject.disabled = readOnly;
        elements.body.disabled = readOnly;

        for (const checkbox of elements.preferenceCheckboxes) {
            checkbox.disabled = readOnly;
        }

        elements.submitButton.hidden = readOnly;

        elements.showReadyButton.hidden =
            readOnly || item.status !== "DRAFT";

        elements.readyConfirmation.hidden = true;
    }

    function handleNewsletterFormChange() {
        if (state.editingId === null) {
            return;
        }

        state.formDirty = true;
        elements.showReadyButton.hidden = true;
        elements.readyConfirmation.hidden = true;
    }

    function restoreEditableForm() {
        elements.subject.disabled = false;
        elements.body.disabled = false;

        for (const checkbox of elements.preferenceCheckboxes) {
            checkbox.disabled = false;
        }

        elements.submitButton.hidden = false;
        elements.showReadyButton.hidden = true;
        elements.readyConfirmation.hidden = true;
    }


    function setAudienceFeedback(message, type) {
        elements.audienceFeedback.textContent = message || "";
        elements.audienceFeedback.classList.remove(
            "is-visible",
            "is-success",
            "is-error"
        );

        if (!message) {
            return;
        }

        elements.audienceFeedback.classList.add("is-visible");

        if (type === "success") {
            elements.audienceFeedback.classList.add("is-success");
        }

        if (type === "error") {
            elements.audienceFeedback.classList.add("is-error");
        }
    }

    function resetAudience() {
        state.audiencePage = 0;
        state.audienceTotalPages = 0;
        state.audienceHasNext = false;
        state.loadingAudience = false;

        elements.audienceSummary.textContent = "";
        elements.audienceList.replaceChildren();
        elements.audiencePanel.hidden = true;
        elements.audiencePagination.hidden = true;

        setAudienceFeedback("", null);
        updateAudiencePagination();
    }

    function updateAudiencePagination() {
        elements.audiencePreviousButton.disabled =
            state.loadingAudience || state.audiencePage <= 0;

        elements.audienceNextButton.disabled =
            state.loadingAudience || !state.audienceHasNext;

        const displayPage = state.audienceTotalPages === 0
            ? 0
            : state.audiencePage + 1;

        elements.audiencePageSummary.textContent =
            `Página ${displayPage} de ${state.audienceTotalPages}`;
    }

    function renderAudienceMembers(items) {
        elements.audienceList.replaceChildren();

        for (const member of items) {
            const article = document.createElement("article");
            article.className = "admin-audience-member";

            const name = document.createElement("strong");
            name.textContent =
                member.firstName?.trim() || "Sin nombre";

            const email = document.createElement("p");
            email.textContent = member.email || "Sin email";

            const preferences = document.createElement("p");
            preferences.textContent =
                Array.isArray(member.preferences) &&
                member.preferences.length > 0
                    ? member.preferences
                        .map(
                            (preference) =>
                                PREFERENCE_LABELS[preference] ||
                                preference
                        )
                        .join(", ")
                    : "Sin preferencias";

            article.append(name, email, preferences);
            elements.audienceList.append(article);
        }
    }

    function formatDate(value) {
        if (!value) {
            return "Sin fecha";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("es-CR", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date);
    }

    function buildQuery() {
        const params = new URLSearchParams();

        params.set("page", String(state.currentPage));
        params.set("size", String(PAGE_SIZE));

        if (elements.filterStatus.value) {
            params.set("status", elements.filterStatus.value);
        }

        return params.toString();
    }

    function createBadge(text) {
        const badge = document.createElement("span");
        badge.className = "admin-content-badge";
        badge.textContent = text;
        return badge;
    }

    function renderNewsletters(items) {
        elements.newsletterList.replaceChildren();
        elements.emptyMessage.hidden = items.length !== 0;

        for (const item of items) {
            const article = document.createElement("article");
            article.className = "admin-content-card";

            const subject = document.createElement("h3");
            subject.textContent = item.subject || "Sin asunto";

            const meta = document.createElement("div");
            meta.className = "admin-content-meta";
            meta.append(
                createBadge(
                    STATUS_LABELS[item.status] || item.status || "Sin estado"
                )
            );

            const preferencesTitle = document.createElement("strong");
            preferencesTitle.textContent = "Preferencias:";

            const preferences = document.createElement("p");
            preferences.className = "admin-content-description";

            const selectedPreferences = Array.isArray(item.preferences)
                ? item.preferences
                : [];

            preferences.textContent = selectedPreferences.length > 0
                ? selectedPreferences
                    .map(
                        (preference) =>
                            PREFERENCE_LABELS[preference] || preference
                    )
                    .join(", ")
                : "Sin preferencias";

            const updatedAt = document.createElement("p");
            updatedAt.className = "admin-content-description";
            updatedAt.textContent =
                `Actualizada: ${formatDate(item.updatedAt || item.createdAt)}`;

            const actions = document.createElement("div");
            actions.className = "admin-content-actions";

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "admin-button admin-button-secondary";
            editButton.textContent = item.status === "SENT"
                ? "Ver"
                : "Editar";
            editButton.dataset.newsletterId = String(item.id);

            actions.append(editButton);

            article.append(
                subject,
                meta,
                preferencesTitle,
                preferences,
                updatedAt,
                actions
            );

            elements.newsletterList.append(article);
        }
    }



    async function loadAudiencePreview() {
        const admin = window.Survival72Admin;

        if (
            state.editingId === null ||
            state.loadingAudience
        ) {
            return;
        }

        state.loadingAudience = true;
        elements.audiencePanel.hidden = false;
        elements.audienceSummary.textContent = "";
        setAudienceFeedback("Cargando audiencia...", null);
        updateAudiencePagination();

        try {
            const params = new URLSearchParams({
                page: String(state.audiencePage),
                size: String(PAGE_SIZE)
            });

            const response = await admin.apiFetch(
                `/api/admin/newsletters/${state.editingId}/audience-preview?${params}`,
                {
                    method: "GET",
                    headers: admin.buildHeaders()
                }
            );

            if (await admin.handleProtectedResponse(response)) {
                return;
            }

            if (!response.ok) {
                const body = await admin.readResponseBody(response);

                setAudienceFeedback(
                    body?.message ||
                        "No fue posible cargar la audiencia.",
                    "error"
                );
                return;
            }

            const preview = await admin.readResponseBody(response);

            state.audiencePage = preview?.page ?? 0;
            state.audienceTotalPages = preview?.totalPages ?? 0;
            state.audienceHasNext = Boolean(preview?.hasNext);

            const totalAudience = Number(preview?.totalAudience ?? 0);

            elements.audienceSummary.textContent =
                `Audiencia estimada: ${totalAudience} ` +
                `${totalAudience === 1 ? "suscriptor" : "suscriptores"}.`;

            renderAudienceMembers(
                Array.isArray(preview?.content) ? preview.content : []
            );

            elements.audiencePagination.hidden =
                state.audienceTotalPages <= 1;

            setAudienceFeedback("", null);
        } catch {
            setAudienceFeedback(
                "No fue posible conectar con el servidor para cargar la audiencia.",
                "error"
            );
        } finally {
            state.loadingAudience = false;
            updateAudiencePagination();
        }
    }

    async function markNewsletterReady() {
        const admin = window.Survival72Admin;

        if (
            state.editingId === null ||
            state.markingReady
        ) {
            return;
        }

        state.markingReady = true;
        elements.confirmReadyButton.disabled = true;
        elements.cancelReadyButton.disabled = true;
        elements.confirmReadyButton.textContent =
            "Marcando como lista...";

        setFormFeedback("", null);

        try {
            const response = await admin.apiFetch(
                `/api/admin/newsletters/${state.editingId}/ready`,
                {
                    method: "POST",
                    headers: admin.buildHeaders({
                        csrf: true
                    })
                }
            );

            if (await admin.handleProtectedResponse(response)) {
                return;
            }

            const body = await admin.readResponseBody(response);

            if (!response.ok) {
                setFormFeedback(
                    body?.message ||
                        "No fue posible marcar la newsletter como lista.",
                    "error"
                );
                return;
            }

            restoreEditableForm();
            applyNewsletterToForm(body);

            setFormFeedback(
                "Newsletter marcada como lista para enviar.",
                "success"
            );

            await loadNewsletters();
            await loadAudiencePreview();
        } catch {
            setFormFeedback(
                "No fue posible conectar con el servidor para marcar la newsletter como lista.",
                "error"
            );
        } finally {
            state.markingReady = false;
            elements.confirmReadyButton.disabled = false;
            elements.cancelReadyButton.disabled = false;
            elements.confirmReadyButton.textContent =
                "Sí, marcar lista";
        }
    }

    async function loadNewsletterForEditing(newsletterId) {
        const admin = window.Survival72Admin;

        setFormFeedback("", null);

        try {
            const response = await admin.apiFetch(
                `/api/admin/newsletters/${newsletterId}`,
                {
                    method: "GET",
                    headers: admin.buildHeaders()
                }
            );

            if (await admin.handleProtectedResponse(response)) {
                return;
            }

            if (!response.ok) {
                const body = await admin.readResponseBody(response);

                setFeedback(
                    body?.message ||
                        "No fue posible cargar la newsletter seleccionada.",
                    "error"
                );
                return;
            }

            const item = await admin.readResponseBody(response);

            restoreEditableForm();
            applyNewsletterToForm(item);

            state.audiencePage = 0;
            await loadAudiencePreview();

            elements.editorPanel.scrollIntoView({
                block: "start"
            });

            elements.subject.focus();
        } catch {
            setFeedback(
                "No fue posible conectar con el servidor para abrir la newsletter.",
                "error"
            );
        }
    }

    async function handleFormSubmit(event) {
        event.preventDefault();

        if (state.submitting) {
            return;
        }

        setFormFeedback("", null);

        if (!elements.form.reportValidity()) {
            return;
        }

        if (!validatePreferences()) {
            return;
        }

        const admin = window.Survival72Admin;
        const editing = state.editingId !== null;
        const path = editing
            ? `/api/admin/newsletters/${state.editingId}`
            : "/api/admin/newsletters";
        const method = editing ? "PATCH" : "POST";

        state.submitting = true;
        elements.submitButton.disabled = true;
        elements.submitButton.textContent = "Guardando...";

        try {
            const response = await admin.apiFetch(path, {
                method,
                headers: admin.buildHeaders({
                    json: true,
                    csrf: true
                }),
                body: JSON.stringify(buildPayload())
            });

            if (await admin.handleProtectedResponse(response)) {
                return;
            }

            const body = await admin.readResponseBody(response);

            if (!response.ok) {
                setFormFeedback(
                    body?.message ||
                        "No fue posible guardar la newsletter.",
                    "error"
                );
                return;
            }

            const returnedStatus = body?.status || "DRAFT";

            const message = editing
                ? returnedStatus === "DRAFT"
                    ? "Newsletter actualizada correctamente. El estado actual es Borrador."
                    : "Newsletter actualizada correctamente."
                : "Newsletter creada correctamente.";

            restoreEditableForm();
            resetForm({ keepFeedback: true });
            resetAudience();

            setFormFeedback(message, "success");

            state.currentPage = 0;
            await loadNewsletters();
        } catch {
            setFormFeedback(
                "No fue posible conectar con el servidor para guardar la newsletter.",
                "error"
            );
        } finally {
            state.submitting = false;
            elements.submitButton.disabled = false;

            if (!elements.submitButton.hidden) {
                elements.submitButton.textContent =
                    state.editingId === null
                        ? "Crear newsletter"
                        : "Guardar cambios";
            }
        }
    }

    function handleNewsletterListClick(event) {
        const button = event.target.closest("[data-newsletter-id]");

        if (!button) {
            return;
        }

        const newsletterId = Number(button.dataset.newsletterId);

        if (!Number.isInteger(newsletterId) || newsletterId <= 0) {
            return;
        }

        loadNewsletterForEditing(newsletterId);
    }

    function updatePagination() {
        elements.previousPageButton.disabled =
            state.loading || state.currentPage <= 0;

        elements.nextPageButton.disabled =
            state.loading || !state.hasNext;

        const displayPage = state.totalPages === 0
            ? 0
            : state.currentPage + 1;

        elements.pageSummary.textContent =
            `Página ${displayPage} de ${state.totalPages}`;
    }

    async function loadNewsletters() {
        const admin = window.Survival72Admin;

        if (
            !admin ||
            !admin.isAuthenticated() ||
            state.loading
        ) {
            return;
        }

        state.loading = true;
        setFeedback("", null);

        elements.refreshButton.disabled = true;
        updatePagination();

        try {
            const response = await admin.apiFetch(
                `/api/admin/newsletters?${buildQuery()}`,
                {
                    method: "GET",
                    headers: admin.buildHeaders()
                }
            );

            if (await admin.handleProtectedResponse(response)) {
                return;
            }

            if (!response.ok) {
                const body = await admin.readResponseBody(response);

                setFeedback(
                    body?.message ||
                        "No fue posible cargar las newsletters.",
                    "error"
                );
                return;
            }

            const page = await admin.readResponseBody(response);

            state.currentPage = page?.page ?? 0;
            state.totalPages = page?.totalPages ?? 0;
            state.hasNext = Boolean(page?.hasNext);

            renderNewsletters(
                Array.isArray(page?.content) ? page.content : []
            );
        } catch {
            setFeedback(
                "No fue posible conectar con el servidor para cargar las newsletters.",
                "error"
            );
        } finally {
            state.loading = false;
            elements.refreshButton.disabled = false;
            updatePagination();
        }
    }

    function reset() {
        state.currentPage = 0;
        state.totalPages = 0;
        state.hasNext = false;
        state.loading = false;
        state.editingId = null;
        state.submitting = false;
        state.markingReady = false;
        state.selectedNewsletterStatus = null;

        elements.filterStatus.value = "";
        elements.newsletterList.replaceChildren();
        elements.emptyMessage.hidden = true;

        restoreEditableForm();
        resetForm();
        resetAudience();
        setFeedback("", null);
        updatePagination();
    }

    function bindEvents() {
        elements.refreshButton.addEventListener(
            "click",
            loadNewsletters
        );

        elements.newButton.addEventListener("click", () => {
            restoreEditableForm();
            resetForm();
            resetAudience();
            elements.subject.focus();
        });

        elements.form.addEventListener(
            "submit",
            handleFormSubmit
        );

        elements.form.addEventListener(
            "input",
            handleNewsletterFormChange
        );

        elements.form.addEventListener(
            "change",
            handleNewsletterFormChange
        );

        elements.cancelEditButton.addEventListener("click", () => {
            restoreEditableForm();
            resetForm();
            resetAudience();
            elements.subject.focus();
        });

        elements.showReadyButton.addEventListener("click", () => {
            if (state.formDirty) {
                setFormFeedback(
                    "Guarda los cambios antes de marcar la newsletter como lista para enviar.",
                    "error"
                );
                return;
            }

            elements.readyConfirmation.hidden = false;
            elements.showReadyButton.hidden = true;
            elements.confirmReadyButton.focus();
        });

        elements.confirmReadyButton.addEventListener(
            "click",
            markNewsletterReady
        );

        elements.cancelReadyButton.addEventListener("click", () => {
            elements.readyConfirmation.hidden = true;

            if (state.selectedNewsletterStatus === "DRAFT") {
                elements.showReadyButton.hidden = false;
                elements.showReadyButton.focus();
            }
        });

        elements.audiencePreviousButton.addEventListener(
            "click",
            () => {
                if (
                    state.audiencePage <= 0 ||
                    state.loadingAudience
                ) {
                    return;
                }

                state.audiencePage -= 1;
                loadAudiencePreview();
            }
        );

        elements.audienceNextButton.addEventListener(
            "click",
            () => {
                if (
                    !state.audienceHasNext ||
                    state.loadingAudience
                ) {
                    return;
                }

                state.audiencePage += 1;
                loadAudiencePreview();
            }
        );

        elements.newsletterList.addEventListener(
            "click",
            handleNewsletterListClick
        );

        elements.filterStatus.addEventListener("change", () => {
            state.currentPage = 0;
            loadNewsletters();
        });

        elements.previousPageButton.addEventListener("click", () => {
            if (state.currentPage <= 0 || state.loading) {
                return;
            }

            state.currentPage -= 1;
            loadNewsletters();
        });

        elements.nextPageButton.addEventListener("click", () => {
            if (!state.hasNext || state.loading) {
                return;
            }

            state.currentPage += 1;
            loadNewsletters();
        });
    }

    bindEvents();
    restoreEditableForm();
    resetForm();
    resetAudience();
    updatePagination();

    window.Survival72AdminNewsletter = {
        loadNewsletters,
        reset
    };
})();
