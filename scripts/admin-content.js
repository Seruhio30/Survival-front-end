(function () {
    "use strict";

    const PAGE_SIZE = 10;

    const state = {
        csrfToken: null,
        csrfHeaderName: null,
        authenticated: false,
        username: null,
        currentPage: 0,
        totalPages: 0,
        hasNext: false,
        editingId: null,
        submittingLogin: false,
        submittingContent: false,
        activeSection: "content"
    };

    const elements = {
        loginView: document.getElementById("login-view"),
        contentView: document.getElementById("content-view"),
        newsletterView: document.getElementById("newsletter-view"),
        adminNavigation: document.getElementById("admin-navigation"),
        showContentButton: document.getElementById("show-content-button"),
        showNewslettersButton: document.getElementById("show-newsletters-button"),
        loginForm: document.getElementById("login-form"),
        username: document.getElementById("username"),
        password: document.getElementById("password"),
        loginSubmit: document.getElementById("login-submit"),
        loginFeedback: document.getElementById("login-feedback"),
        logoutButton: document.getElementById("logout-button"),
        sessionUser: document.getElementById("session-user"),
        globalFeedback: document.getElementById("global-feedback"),
        contentFilters: document.getElementById("content-filters"),
        filterType: document.getElementById("filter-type"),
        filterStatus: document.getElementById("filter-status"),
        contentList: document.getElementById("content-list"),
        emptyContentMessage: document.getElementById("empty-content-message"),
        previousPageButton: document.getElementById("previous-page-button"),
        nextPageButton: document.getElementById("next-page-button"),
        pageSummary: document.getElementById("page-summary"),
        refreshContentButton: document.getElementById("refresh-content-button"),
        newContentButton: document.getElementById("new-content-button"),
        cancelEditButton: document.getElementById("cancel-edit-button"),
        editorTitle: document.getElementById("editor-title"),
        contentForm: document.getElementById("content-form"),
        contentId: document.getElementById("content-id"),
        contentType: document.getElementById("content-type"),
        contentTitle: document.getElementById("content-title-input"),
        contentDescription: document.getElementById("content-description"),
        youtubeField: document.getElementById("youtube-field"),
        youtubeVideoId: document.getElementById("youtube-video-id"),
        contentStatus: document.getElementById("content-status"),
        contentSubmit: document.getElementById("content-submit"),
        contentFormFeedback: document.getElementById("content-form-feedback"),
        preferenceCheckboxes: Array.from(
            document.querySelectorAll('input[name="preferences"]')
        )
    };

    function getApiBaseUrl() {
        const apiBaseUrl = window.Survival72Config?.apiBaseUrl;

        if (!apiBaseUrl) {
            throw new Error("API_NOT_CONFIGURED");
        }

        return apiBaseUrl;
    }

    function setFeedback(element, message, type) {
        element.textContent = message || "";
        element.classList.remove("is-visible", "is-success", "is-error");

        if (!message) {
            return;
        }

        element.classList.add("is-visible");

        if (type === "success") {
            element.classList.add("is-success");
        }

        if (type === "error") {
            element.classList.add("is-error");
        }
    }

    function setAuthenticatedView(authenticated) {
        state.authenticated = authenticated;

        elements.loginView.hidden = authenticated;
        elements.adminNavigation.hidden = !authenticated;
        elements.logoutButton.hidden = !authenticated;

        if (authenticated) {
            showAdminSection(state.activeSection);
        } else {
            elements.contentView.hidden = true;
            elements.newsletterView.hidden = true;
        }

        if (!authenticated) {
            elements.sessionUser.textContent = "";
        }
    }

    function showAdminSection(section) {
        const showNewsletter = section === "newsletter";

        state.activeSection = showNewsletter ? "newsletter" : "content";

        elements.contentView.hidden = showNewsletter;
        elements.newsletterView.hidden = !showNewsletter;

        elements.showContentButton.setAttribute(
            "aria-current",
            showNewsletter ? "false" : "page"
        );
        elements.showNewslettersButton.setAttribute(
            "aria-current",
            showNewsletter ? "page" : "false"
        );

        if (
            showNewsletter &&
            state.authenticated &&
            window.Survival72AdminNewsletter?.loadNewsletters
        ) {
            window.Survival72AdminNewsletter.loadNewsletters();
        }
    }

    function storeCsrfFromSession(session) {
        state.csrfToken = session?.csrfToken || null;
        state.csrfHeaderName = session?.csrfHeaderName || null;
    }

    function clearSessionState() {
        state.csrfToken = null;
        state.csrfHeaderName = null;
        state.authenticated = false;
        state.username = null;
        state.currentPage = 0;
        state.totalPages = 0;
        state.hasNext = false;
        state.editingId = null;
        state.activeSection = "content";

        setAuthenticatedView(false);

        if (window.Survival72AdminNewsletter?.reset) {
            window.Survival72AdminNewsletter.reset();
        }
        resetContentForm();
    }

    function buildHeaders(options = {}) {
        const headers = {
            Accept: "application/json"
        };

        if (options.json) {
            headers["Content-Type"] = "application/json";
        }

        if (
            options.csrf &&
            state.csrfToken &&
            state.csrfHeaderName
        ) {
            headers[state.csrfHeaderName] = state.csrfToken;
        }

        return headers;
    }

    async function apiFetch(path, options = {}) {
        const response = await fetch(`${getApiBaseUrl()}${path}`, {
            credentials: "include",
            ...options
        });

        return response;
    }

    async function readResponseBody(response) {
        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            return null;
        }

        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    async function loadSession(options = {}) {
        try {
            const response = await apiFetch("/api/admin/auth/session", {
                method: "GET",
                headers: buildHeaders()
            });

            if (!response.ok) {
                throw new Error("SESSION_REQUEST_FAILED");
            }

            const session = await readResponseBody(response);

            storeCsrfFromSession(session);

            if (session?.authenticated) {
                state.username = session.username || null;
                setAuthenticatedView(true);

                elements.sessionUser.textContent = state.username
                    ? `Sesión activa: ${state.username}`
                    : "Sesión administrativa activa.";

                if (!options.skipContentLoad) {
                    await loadContent();
                }

                return true;
            }

            const csrfToken = state.csrfToken;
            const csrfHeaderName = state.csrfHeaderName;

            clearSessionState();

            state.csrfToken = csrfToken;
            state.csrfHeaderName = csrfHeaderName;

            if (options.expired) {
                setFeedback(
                    elements.loginFeedback,
                    "Tu sesión expiró. Inicia sesión nuevamente.",
                    "error"
                );
            }

            return false;
        } catch (error) {
            clearSessionState();

            const message = error.message === "API_NOT_CONFIGURED"
                ? "La API de Survival72 no está configurada para este entorno."
                : "No fue posible comprobar la sesión. Verifica la conexión e intenta de nuevo.";

            setFeedback(elements.loginFeedback, message, "error");
            return false;
        }
    }

    async function handleLogin(event) {
        event.preventDefault();

        if (state.submittingLogin) {
            return;
        }

        setFeedback(elements.loginFeedback, "", null);

        if (!elements.loginForm.reportValidity()) {
            return;
        }

        if (!state.csrfToken || !state.csrfHeaderName) {
            const sessionReady = await loadSession({ skipContentLoad: true });

            if (
                sessionReady ||
                (!state.csrfToken || !state.csrfHeaderName)
            ) {
                if (sessionReady) {
                    return;
                }

                setFeedback(
                    elements.loginFeedback,
                    "No fue posible preparar la sesión segura para iniciar sesión.",
                    "error"
                );
                return;
            }
        }

        state.submittingLogin = true;
        elements.loginSubmit.disabled = true;
        elements.loginSubmit.textContent = "Iniciando sesión...";

        try {
            const response = await apiFetch("/api/admin/auth/login", {
                method: "POST",
                headers: buildHeaders({
                    json: true,
                    csrf: true
                }),
                body: JSON.stringify({
                    username: elements.username.value.trim(),
                    password: elements.password.value
                })
            });

            if (!response.ok) {
                const body = await readResponseBody(response);

                if (response.status === 401 || response.status === 403) {
                    setFeedback(
                        elements.loginFeedback,
                        "Usuario o contraseña incorrectos.",
                        "error"
                    );
                    return;
                }

                setFeedback(
                    elements.loginFeedback,
                    body?.message || "No fue posible iniciar sesión.",
                    "error"
                );
                return;
            }

            elements.password.value = "";

            const authenticated = await loadSession();

            if (!authenticated) {
                setFeedback(
                    elements.loginFeedback,
                    "La autenticación se completó, pero no fue posible recuperar la sesión.",
                    "error"
                );
            }
        } catch (error) {
            const message = error.message === "API_NOT_CONFIGURED"
                ? "La API de Survival72 no está configurada para este entorno."
                : "No fue posible conectar con el servidor.";

            setFeedback(elements.loginFeedback, message, "error");
        } finally {
            state.submittingLogin = false;
            elements.loginSubmit.disabled = false;
            elements.loginSubmit.textContent = "Iniciar sesión";
        }
    }

    async function handleLogout() {
        elements.logoutButton.disabled = true;

        try {
            const response = await apiFetch("/api/admin/auth/logout", {
                method: "POST",
                headers: buildHeaders({
                    csrf: true
                })
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    clearSessionState();
                    await loadSession({ skipContentLoad: true });
                    return;
                }

                setFeedback(
                    elements.globalFeedback,
                    "No fue posible cerrar la sesión correctamente.",
                    "error"
                );
                return;
            }

            clearSessionState();

            setFeedback(
                elements.loginFeedback,
                "Sesión cerrada correctamente.",
                "success"
            );

            elements.username.focus();
        } catch {
            setFeedback(
                elements.globalFeedback,
                "No fue posible conectar con el servidor para cerrar sesión.",
                "error"
            );
        } finally {
            elements.logoutButton.disabled = false;
        }
    }

    function buildContentQuery() {
        const params = new URLSearchParams();

        params.set("page", String(state.currentPage));
        params.set("size", String(PAGE_SIZE));

        if (elements.filterType.value) {
            params.set("type", elements.filterType.value);
        }

        if (elements.filterStatus.value) {
            params.set("status", elements.filterStatus.value);
        }

        return params.toString();
    }

    async function handleProtectedResponse(response) {
        if (response.status !== 401 && response.status !== 403) {
            return false;
        }

        clearSessionState();
        await loadSession({
            skipContentLoad: true,
            expired: true
        });

        return true;
    }

    async function loadContent() {
        setFeedback(elements.globalFeedback, "", null);

        elements.refreshContentButton.disabled = true;
        elements.previousPageButton.disabled = true;
        elements.nextPageButton.disabled = true;

        try {
            const response = await apiFetch(
                `/api/admin/content?${buildContentQuery()}`,
                {
                    method: "GET",
                    headers: buildHeaders()
                }
            );

            if (await handleProtectedResponse(response)) {
                return;
            }

            if (!response.ok) {
                const body = await readResponseBody(response);

                setFeedback(
                    elements.globalFeedback,
                    body?.message || "No fue posible cargar el contenido.",
                    "error"
                );
                return;
            }

            const page = await readResponseBody(response);

            state.currentPage = page?.page ?? 0;
            state.totalPages = page?.totalPages ?? 0;
            state.hasNext = Boolean(page?.hasNext);

            renderContent(Array.isArray(page?.content) ? page.content : []);
            updatePagination();
        } catch {
            setFeedback(
                elements.globalFeedback,
                "No fue posible conectar con el servidor para cargar el contenido.",
                "error"
            );
        } finally {
            elements.refreshContentButton.disabled = false;
            updatePagination();
        }
    }

    function createBadge(text) {
        const badge = document.createElement("span");
        badge.className = "admin-content-badge";
        badge.textContent = text;
        return badge;
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

    function renderContent(items) {
        elements.contentList.replaceChildren();
        elements.emptyContentMessage.hidden = items.length !== 0;

        for (const item of items) {
            const article = document.createElement("article");
            article.className = "admin-content-card";

            const title = document.createElement("h3");
            title.textContent = item.title || "Sin título";

            const meta = document.createElement("div");
            meta.className = "admin-content-meta";
            meta.append(
                createBadge(item.type || "SIN TIPO"),
                createBadge(item.status || "SIN ESTADO")
            );

            const description = document.createElement("p");
            description.className = "admin-content-description";
            description.textContent =
                item.description?.trim() || "Sin descripción.";

            const preferencesTitle = document.createElement("strong");
            preferencesTitle.textContent = "Preferencias:";

            const preferences = document.createElement("p");
            preferences.className = "admin-content-description";
            preferences.textContent =
                Array.isArray(item.preferences) && item.preferences.length > 0
                    ? item.preferences.join(", ")
                    : "Contenido general";

            const date = document.createElement("p");
            date.className = "admin-content-description";
            date.textContent = `Actualizado: ${formatDate(item.updatedAt || item.createdAt)}`;

            const actions = document.createElement("div");
            actions.className = "admin-content-actions";

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "admin-button admin-button-secondary";
            editButton.textContent = "Editar";
            editButton.dataset.contentId = String(item.id);

            actions.append(editButton);

            article.append(
                title,
                meta,
                description,
                preferencesTitle,
                preferences,
                date,
                actions
            );

            elements.contentList.append(article);
        }
    }

    function updatePagination() {
        elements.previousPageButton.disabled = state.currentPage <= 0;
        elements.nextPageButton.disabled = !state.hasNext;

        const displayPage = state.totalPages === 0
            ? 0
            : state.currentPage + 1;

        elements.pageSummary.textContent =
            `Página ${displayPage} de ${state.totalPages}`;
    }

    function getSelectedPreferences() {
        return elements.preferenceCheckboxes
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);
    }

    function updateYouTubeField() {
        const isVideo = elements.contentType.value === "VIDEO";

        elements.youtubeField.hidden = !isVideo;
        elements.youtubeVideoId.disabled = !isVideo;
        elements.youtubeVideoId.required = isVideo;

        if (!isVideo) {
            elements.youtubeVideoId.value = "";
        }
    }

    function resetContentForm() {
        state.editingId = null;

        elements.contentForm.reset();
        elements.contentId.value = "";
        elements.contentType.value = "ARTICLE";
        elements.contentStatus.value = "DRAFT";
        elements.editorTitle.textContent = "Nuevo contenido";
        elements.contentSubmit.textContent = "Crear contenido";
        elements.cancelEditButton.hidden = true;

        setFeedback(elements.contentFormFeedback, "", null);
        updateYouTubeField();
    }

    function buildContentPayload() {
        return {
            type: elements.contentType.value,
            title: elements.contentTitle.value.trim(),
            description:
                elements.contentDescription.value.trim() || null,
            youtubeVideoId:
                elements.contentType.value === "VIDEO"
                    ? elements.youtubeVideoId.value.trim()
                    : null,
            status: elements.contentStatus.value,
            preferences: getSelectedPreferences()
        };
    }

    async function handleContentSubmit(event) {
        event.preventDefault();

        if (state.submittingContent) {
            return;
        }

        setFeedback(elements.contentFormFeedback, "", null);

        if (!elements.contentForm.reportValidity()) {
            return;
        }

        const editing = state.editingId !== null;
        const method = editing ? "PATCH" : "POST";
        const path = editing
            ? `/api/admin/content/${state.editingId}`
            : "/api/admin/content";

        state.submittingContent = true;
        elements.contentSubmit.disabled = true;
        elements.contentSubmit.textContent = "Guardando...";

        try {
            const response = await apiFetch(path, {
                method,
                headers: buildHeaders({
                    json: true,
                    csrf: true
                }),
                body: JSON.stringify(buildContentPayload())
            });

            if (await handleProtectedResponse(response)) {
                return;
            }

            const body = await readResponseBody(response);

            if (!response.ok) {
                setFeedback(
                    elements.contentFormFeedback,
                    body?.message || "No fue posible guardar el contenido.",
                    "error"
                );
                return;
            }

            const message = editing
                ? "Contenido actualizado correctamente."
                : "Contenido creado correctamente.";

            resetContentForm();

            setFeedback(
                elements.contentFormFeedback,
                message,
                "success"
            );

            state.currentPage = 0;
            await loadContent();
        } catch {
            setFeedback(
                elements.contentFormFeedback,
                "No fue posible conectar con el servidor para guardar el contenido.",
                "error"
            );
        } finally {
            state.submittingContent = false;
            elements.contentSubmit.disabled = false;

            if (state.editingId === null) {
                elements.contentSubmit.textContent = "Crear contenido";
            } else {
                elements.contentSubmit.textContent = "Guardar cambios";
            }
        }
    }

    async function loadContentForEditing(contentId) {
        setFeedback(elements.contentFormFeedback, "", null);

        try {
            const response = await apiFetch(
                `/api/admin/content/${contentId}`,
                {
                    method: "GET",
                    headers: buildHeaders()
                }
            );

            if (await handleProtectedResponse(response)) {
                return;
            }

            if (!response.ok) {
                const body = await readResponseBody(response);

                setFeedback(
                    elements.globalFeedback,
                    body?.message || "No fue posible cargar el contenido seleccionado.",
                    "error"
                );
                return;
            }

            const item = await readResponseBody(response);

            state.editingId = item.id;

            elements.contentId.value = String(item.id);
            elements.contentType.value = item.type;
            elements.contentTitle.value = item.title || "";
            elements.contentDescription.value = item.description || "";
            elements.contentStatus.value = item.status || "DRAFT";

            updateYouTubeField();

            if (item.type === "VIDEO") {
                elements.youtubeVideoId.value = item.youtubeVideoId || "";
            }

            const selectedPreferences = new Set(
                Array.isArray(item.preferences) ? item.preferences : []
            );

            for (const checkbox of elements.preferenceCheckboxes) {
                checkbox.checked = selectedPreferences.has(checkbox.value);
            }

            elements.editorTitle.textContent = "Editar contenido";
            elements.contentSubmit.textContent = "Guardar cambios";
            elements.cancelEditButton.hidden = false;

            document.getElementById("editor-panel").scrollIntoView({
                block: "start"
            });

            elements.contentTitle.focus();
        } catch {
            setFeedback(
                elements.globalFeedback,
                "No fue posible conectar con el servidor para abrir el contenido.",
                "error"
            );
        }
    }

    function handleContentListClick(event) {
        const button = event.target.closest("[data-content-id]");

        if (!button) {
            return;
        }

        const contentId = Number(button.dataset.contentId);

        if (!Number.isInteger(contentId) || contentId <= 0) {
            return;
        }

        loadContentForEditing(contentId);
    }

    function bindEvents() {
        elements.loginForm.addEventListener("submit", handleLogin);
        elements.logoutButton.addEventListener("click", handleLogout);

        elements.showContentButton.addEventListener("click", () => {
            showAdminSection("content");
        });

        elements.showNewslettersButton.addEventListener("click", () => {
            showAdminSection("newsletter");
        });

        elements.contentType.addEventListener(
            "change",
            updateYouTubeField
        );

        elements.contentForm.addEventListener(
            "submit",
            handleContentSubmit
        );

        elements.contentList.addEventListener(
            "click",
            handleContentListClick
        );

        elements.cancelEditButton.addEventListener(
            "click",
            resetContentForm
        );

        elements.newContentButton.addEventListener("click", () => {
            resetContentForm();
            elements.contentTitle.focus();
        });

        elements.refreshContentButton.addEventListener(
            "click",
            loadContent
        );

        elements.filterType.addEventListener("change", () => {
            state.currentPage = 0;
            loadContent();
        });

        elements.filterStatus.addEventListener("change", () => {
            state.currentPage = 0;
            loadContent();
        });

        elements.previousPageButton.addEventListener("click", () => {
            if (state.currentPage <= 0) {
                return;
            }

            state.currentPage -= 1;
            loadContent();
        });

        elements.nextPageButton.addEventListener("click", () => {
            if (!state.hasNext) {
                return;
            }

            state.currentPage += 1;
            loadContent();
        });
    }

    window.Survival72Admin = {
        apiFetch,
        buildHeaders,
        readResponseBody,
        handleProtectedResponse,
        isAuthenticated() {
            return state.authenticated;
        }
    };

    async function initialize() {
        bindEvents();
        resetContentForm();
        await loadSession();
    }

    initialize();
})();
