# Survival72

Survival72 is an educational emergency-preparedness website focused on helping people and families prepare for natural disasters and other emergency situations.

The current public website includes information about:

- 72-hour emergency kits
- Earthquakes
- Floods
- Hurricanes
- Landslides
- Family emergency plans
- Evacuation plans
- Downloadable PDF guides
- Emergency institution resources in Costa Rica

## Current Status

The project is currently in an **MVP stabilization phase**.

The immediate goal is to have a professional, stable and reliable public version ready before an important emergency-preparedness presentation on **August 22, 2026**.

Current priorities include:

- responsive layout stabilization (home completed for 375px, 768px and 1440px)
- accessibility improvements
- semantic HTML cleanup
- content verification
- SEO improvements
- media performance optimization
- removal or isolation of confirmed legacy code

No major redesign or framework migration is currently planned.

## Public Website

The current production version is deployed through GitHub Pages:

https://seruhio30.github.io/Survival-front-end/

## Local Development

The project is a static frontend built with:

- HTML
- CSS
- JavaScript

Recommended local environment:

- VS Code
- Ubuntu / WSL
- Warp terminal
- Live Server

Clone the repository and open it locally:

    git clone https://github.com/Seruhio30/Survival-front-end.git
    cd Survival-front-end

Open `index.html` with Live Server.

The repository currently includes a VS Code setting that uses Live Server port:

    5502

A typical local URL is:

    http://127.0.0.1:5502/index.html

### Join local integration

The new Join frontend is available at:

    form.html

For frontend-only development, the normal local port can still be used.

For end-to-end Join testing against the current backend CORS configuration, serve the frontend from:

    http://localhost:5500

Example:

    python3 -m http.server 5500

Then open:

    http://localhost:5500/form.html

The current backend development CORS configuration allows `localhost:5500` and `127.0.0.1:5500`. This is a backend environment constraint, not a requirement of the Join JavaScript itself.

## Current Public Frontend

The active public frontend mainly consists of:

    index.html
    secondaryPage.html
    form.html

    scripts/
      common.js
      config.js
      homeCard.js
      join.js

    styles/
      commun.css
      form.css
      home.css
      secondaryPage.css

    img/
    pdf/

### Join frontend

The Join form sends the canonical payload to:

    POST /api/join

Public fields:

- `email` — required, maximum 254 characters
- `firstName` — optional, maximum 80 characters
- `countryCode` — required ISO 3166-1 alpha-2 code
- `preferences` — one or more canonical preference values

Current preference mapping:

- Preparación general → `GENERAL_PREPAREDNESS`
- Mochila y kit de emergencia → `EMERGENCY_KIT`
- Contenido educativo → `EDUCATIONAL_CONTENT`
- Eventos y capacitaciones → `EVENTS_AND_TRAINING`

The frontend treats every successful `200 REQUEST_ACCEPTED` response identically and does not expose whether the request represents a new subscription, an active duplicate, or a rejoin.

Success feedback is displayed inline:

    Solicitud recibida. Revisa tu correo para continuar.

The form does not use `alert()`, does not store subscription data in `localStorage`, and does not log the email or full payload.

API configuration is isolated in:

    scripts/config.js

Local development uses `http://localhost:8080`. The production API URL remains intentionally unset until the backend has a confirmed production HTTPS URL.

## Subscription Management Frontend

The subscription management frontend is available at:

    manage/

The route is compatible with backend-generated links using:

    /manage#token=<management-token>

The management token is read only from `window.location.hash`, kept only in memory, and removed from the browser address bar with `history.replaceState()` after capture. It is not stored in `localStorage` or `sessionStorage`, and it is never sent as a query parameter.

The page uses:

    GET /api/subscriptions/manage
    PATCH /api/subscriptions/manage

Both requests authenticate with:

    Authorization: Bearer <management-token>

The editable fields are limited to:

- `firstName`
- `countryCode`
- `preferences`

The frontend requires at least one preference, validates `firstName` up to 80 characters, and requires a two-letter country code.

Invalid, revoked, missing, or unavailable management access is handled with the same neutral message without exposing the reason.

The management frontend reuses `scripts/config.js` and does not duplicate API base URLs.

End-to-end validation confirmed successful GET loading, PATCH persistence, invalid-token handling, and revoked-token handling against the real backend. The backend CORS configuration was also updated separately to allow `PATCH` requests from the approved local frontend origin.

## Subscription Unsubscribe Frontend

The canonical unsubscribe frontend is available at:

    unsubscribe/

The route is compatible with backend-generated links using:

    /unsubscribe#token=<management-token>

The management token is read only from `window.location.hash`, kept only in memory, and removed from the browser address bar with `history.replaceState()` after capture. It is not stored in `localStorage` or `sessionStorage`, and it is never sent as a query parameter.

Opening the page does not cancel the subscription. Cancellation only occurs after an explicit user action.

The page uses:

    POST /api/subscriptions/unsubscribe

The request authenticates with:

    Authorization: Bearer <management-token>

The frontend blocks duplicate submissions, displays a `Cancelando...` state while the request is in progress, handles successful cancellation inline, and treats invalid, revoked, missing, or unavailable subscription access with the same neutral message.

Network or temporary backend failures keep the action available so the user can retry.

The frontend reuses `scripts/config.js` and does not duplicate API base URLs.

JavaScript syntax validation, Git diff validation, and mobile visual validation were completed successfully. A complete local end-to-end success test remains pending because obtaining a raw management token without changing backend architecture, manipulating persisted test data, or configuring email was intentionally kept outside this block.

## Dormant / Incomplete Functionality

The repository still contains parts of the older subscription and administration implementation.

The legacy Join page has now been replaced by the canonical `form.html` + `scripts/join.js` implementation.

Remaining legacy/incomplete files include:

    admin.html
    thanks.html
    unsubscribe.html
    update.html

    scripts/
      admin.js
      form.js
      unsubscribe.js
      updateSubscription-v2.js

`scripts/form.js` is retained only as legacy code and is not loaded by the new Join flow.

This system currently depends on a local backend at:

    http://localhost:8080
It is incomplete and must not be considered production-ready.

As part of the admin security foundation work, the public administrative interface has been temporarily disabled. `admin.html` no longer loads administrative JavaScript, Chart.js, or the previously referenced missing `scripts/updateSubscription.js` file.

The dormant `scripts/admin.js` file has also been hardened to avoid rendering backend-provided subscriber data through `innerHTML`. Safe DOM APIs such as `textContent`, `createElement`, `dataset`, and `append` are used instead.

The historical root-level Admin (`admin.html` and `scripts/admin.js`) remains legacy and is not the functional basis of the current administration system. Frontend-only controls must never be treated as security.

The canonical Admin now uses the secured backend contracts under `/api/admin/**`, Spring Security HTTP sessions, cookies with credentials, and CSRF protection. Production API configuration and deployment remain pending.

## Documentation

The initial technical audit is available at:

    docs/project-audit.md


The current public SEO foundation is documented at:

```
docs/seo.md
```
The audit includes findings related to:

- frontend structure
- HTML
- CSS
- JavaScript
- responsive behavior
- accessibility
- SEO
- performance
- frontend security
- external services
- legacy/incomplete functionality
- MVP priorities
- proposed future architecture

## External Services

The current public frontend uses or links to services including:

- Google Analytics
- Google Fonts
- YouTube
- Comisión Nacional de Emergencias de Costa Rica
- Instituto Meteorológico Nacional
- Cruz Roja Costarricense
- Ministerio de Salud
- Bomberos de Costa Rica

## Git Workflow

Development should be performed using dedicated branches for each block of work.

Examples:

    fix/home-responsive-layout
    fix/emergency-cards-accessibility
    fix/html-accessibility-semantics
    fix/content-accuracy
    perf/media-optimization
    feat/seo-foundation
    refactor/frontend-cleanup

Branch names and commit messages should be written in English.

## Development Approach

The project follows these principles:

1. Audit before refactoring.
2. Work in small, testable steps.
3. Avoid unnecessary changes.
4. Preserve the public website while improving it.
5. Validate changes before continuing.
6. Keep documentation updated.
7. Treat responsive design, accessibility, SEO, performance and UX as part of the implementation.
8. Do not remove unfamiliar code until its purpose is understood.

## MVP Direction

Before adding major features, the current public site should first be stabilized.

Recommended order:

1. ✅ Fix responsive issues.
2. ✅ Fix emergency-card interaction.
3. ✅ Improve accessibility and semantic HTML.
4. ✅ Verify educational content and sources.
5. ✅ Improve media performance.
6. Improve SEO.
7. Perform controlled frontend cleanup.

The emergency-question cards now use an accessible disclosure interaction based on semantic buttons and `aria-expanded`, with consistent behavior across mouse, touch and keyboard.

The public frontend now also includes improved semantic heading hierarchy, Spanish language metadata, accessible navigation landmarks, hamburger-menu ARIA state management, descriptive image alternative text, a keyboard skip link, consistent `:focus-visible` styles, unique HTML IDs, descriptive download links and improved accessible naming for multimedia content.

Media performance optimization now includes lazy loading for the embedded YouTube iframe, metadata-only preload behavior for local videos, intrinsic dimensions for key images, prioritized loading for the featured emergency-backpack image, asynchronous decoding for secondary disaster images and optimization of the flood image from approximately **352 KB / 2048×1317** to **64 KB / 600×386**.

The two local H.264/AAC videos were analyzed and compression alternatives were tested without replacing the originals. The production files remain approximately **3.7 MB** and **12 MB** to avoid unverified quality regressions. Their delivery now uses `preload="metadata"`.

Future ideas such as weather APIs, alerts, subscriptions, email systems, exclusive content and the Join section should be addressed after the public MVP is stable.

## Admin Content frontend — August 2026

The canonical Content Admin frontend is available at `admin/index.html`.

Current MVP capabilities:

- Admin login, session recovery and logout through the canonical `/api/admin/auth/**` endpoints;
- CSRF token and header obtained from the session endpoint and kept only in JavaScript memory;
- authenticated Content listing with type/status filters and simple previous/next pagination;
- creation of `ARTICLE` content;
- creation of `VIDEO` content using a supported YouTube URL or video ID;
- editing through the canonical `PATCH /api/admin/content/{id}` contract;
- `DRAFT`, `PUBLISHED` and `ARCHIVED` status management;
- optional targeting through the four canonical subscriber preferences;
- accessible inline feedback without `alert()`;
- responsive layout validated at 375×812, 768×1024 and 1440×900.

The new implementation uses `scripts/config.js` as the API base URL source and does not reuse the legacy `scripts/admin.js` logic. Credentials, CSRF tokens and session identifiers are not stored in localStorage or sessionStorage.

A real local end-to-end validation was performed against the Spring Boot backend and MySQL, covering invalid and valid login, Content listing, ARTICLE creation, VIDEO creation from a `youtu.be` URL, editing, publishing, archiving, logout and expired-session recovery.

Newsletter, dashboard, subscriber editing, legacy cleanup and production deployment remain outside this frontend block.

## License

No license has been defined yet.

## Educational content verification — August 2026

The public emergency-preparedness content was reviewed against current official sources, prioritizing Costa Rican institutions.

Main updates:

- clarified the difference between a portable 72-hour emergency backpack and a household emergency reserve;
- removed unsupported or misattributed disaster statistics;
- replaced alarmist or unverifiable claims with practical preparedness guidance;
- updated earthquake, flood, tropical cyclone and landslide recommendations;
- clarified that immediate emergencies in Costa Rica should be reported through 9-1-1;
- added official Costa Rican information sources including CNE, IMN, Cruz Roja, Bomberos, OVSICORI and RSN;
- updated all seven downloadable educational PDFs with reviewed safety guidance, source attribution and an August 2026 verification date;
- documented verification decisions and sources in `docs/content-sources.md`.

The educational-content review intentionally did not include SEO, visual redesign, admin, backend, subscriptions, Join, weather APIs or real-time alerts.
