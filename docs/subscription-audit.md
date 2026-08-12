# Subscription Flow Audit

## Purpose

This document audits the dormant Survival72 subscription system before any attempt to reactivate, refactor, or replace it.

The goal is to reconstruct the current frontend behavior and identify apparent API contracts, dependencies, bugs, security/privacy risks, reusable concepts, and obsolete implementation details.

This audit does **not** reactivate the feature and does **not** define a new backend contract.

The original backend exists in a separate repository. Therefore, all backend behavior inferred from this frontend must be treated as apparent until that repository is reviewed.

## Scope

Files inspected:

- `form.html`
- `update.html`
- `unsubscribe.html`
- `thanks.html`
- `scripts/form.js`
- `scripts/updateSubscription-v2.js`
- `scripts/unsubscribe.js`

Related references inspected:

- `index.html`
- `secondaryPage.html`
- `docs/project-audit.md`
- `docs/seo.md`
- `README.md`

Admin functionality was not modified or re-audited as part of this work.

## Current Feature State

The subscription system is dormant.

The public navigation links that previously exposed `form.html` are commented out in:

- `index.html`
- `secondaryPage.html`

Therefore, the current public frontend does not provide an active navigation path into the subscription flow.

All subscription JavaScript files currently depend directly on:

`http://localhost:8080`

This makes the existing implementation incompatible with the public deployment.

The feature must remain inactive until a production-compatible architecture and verified backend contract exist.

# 1. Reconstructed Subscription Flow

## 1.1 New subscription

Current apparent flow:

    form.html
        ↓
    scripts/form.js
        ↓
    POST http://localhost:8080/subscribers/subscribe
        ↓
    backend response treated as text
        ↓
    alert(response text)
        ↓
    if response.ok
        ↓
    form reset
        ↓
    thanks.html

### Form fields

`form.html` contains:

- `nombre` — required
- `apellido` — required
- `email` — required, `type="email"`
- `ciudad` — optional
- `fecha` — optional
- `terremoto` — optional checkbox
- `huracan` — optional checkbox
- `inundacion` — optional checkbox
- `deslizamiento` — optional checkbox

The `fecha` field is currently not included in the JavaScript payload.

If `ciudad` is empty, the frontend sends `"No especificada"`.

## 1.2 Update interests

Current apparent flow:

    update.html
        ↓
    #updateSubscriptionForm
        ↓
    scripts/updateSubscription-v2.js
        ↓
    POST http://localhost:8080/subscribers/actualizar

The HTML checkbox names use English terminology:

- `earthquake`
- `flood`
- `hurricane`
- `landslide`

The JavaScript maps them to Spanish properties before sending the request:

- `terremoto`
- `inundacion`
- `huracan`
- `deslizamiento`

No redirect occurs after a successful update.

## 1.3 Cancellation from update page

Current apparent flow:

    update.html
        ↓
    #cancelSubscriptionForm
        ↓
    email entered manually
        ↓
    POST http://localhost:8080/subscribers/cancelar

The request sends a JSON body containing the email.

## 1.4 Unsubscribe page

Current apparent flow:

    unsubscribe.html?email=user@example.com
        ↓
    scripts/unsubscribe.js
        ↓
    URLSearchParams reads email
        ↓
    readonly email field is populated
        ↓
    confirm()
        ↓
    DELETE http://localhost:8080/subscribers/cancelar

The DELETE request sends:

- no request body
- no email query parameter
- no path parameter
- no visible subscriber identifier
- no unsubscribe token

Based only on this frontend repository, the backend has no visible information identifying which subscription should be cancelled.

The intended backend contract is:

**UNKNOWN UNTIL BACKEND REVIEW**

# 2. Apparent API Endpoints

| Operation | Method | Endpoint |
|---|---|---|
| Create subscription | POST | `/subscribers/subscribe` |
| Update interests | POST | `/subscribers/actualizar` |
| Cancel from update page | POST | `/subscribers/cancelar` |
| Cancel from unsubscribe page | DELETE | `/subscribers/cancelar` |

All calls currently use:

`http://localhost:8080`

These are frontend-observed contracts only and must not be considered authoritative until the historical backend repository is reviewed.

# 3. Apparent Request Payloads

## 3.1 Subscribe

`POST /subscribers/subscribe`

    {
      "nombre": "string",
      "apellido": "string",
      "email": "string",
      "ciudad": "string",
      "terremoto": true,
      "huracan": false,
      "inundacion": true,
      "deslizamiento": false
    }

Notes:

- `fecha` exists in the form but is not sent.
- `ciudad` defaults to `"No especificada"` when blank.
- Name, last name, email, and city are trimmed before sending.

## 3.2 Update interests

`POST /subscribers/actualizar`

    {
      "email": "string",
      "terremoto": true,
      "inundacion": false,
      "huracan": true,
      "deslizamiento": false
    }

The email is not explicitly trimmed before sending.

## 3.3 Cancel from update page

`POST /subscribers/cancelar`

    {
      "email": "string"
    }

The email is not explicitly trimmed before sending.

## 3.4 Cancel from unsubscribe page

`DELETE /subscribers/cancelar`

No payload or visible subscriber identifier is sent.

Correct intended behavior:

**UNKNOWN UNTIL BACKEND REVIEW**

# 4. Apparent Backend Responses

## Subscribe

`scripts/form.js` reads the response using `response.text()` and displays that text with `alert()`.

The exact backend response format is:

**UNKNOWN UNTIL BACKEND REVIEW**

## Update interests

On success, the response body is ignored.

On HTTP failure, the response body is read using `response.text()`.

The exact response format is:

**UNKNOWN UNTIL BACKEND REVIEW**

## Cancel from update page

On success, the response body is ignored.

On HTTP failure, the response body is read using `response.text()`.

The exact response format is:

**UNKNOWN UNTIL BACKEND REVIEW**

## Cancel from unsubscribe page

The response body is not read.

Only `response.ok` is checked.

The exact response format is:

**UNKNOWN UNTIL BACKEND REVIEW**

# 5. Contract Inconsistencies

## 5.1 Two cancellation contracts

The same apparent backend route is called using two different methods.

From `update.html`:

    POST /subscribers/cancelar

    {
      "email": "..."
    }

From `unsubscribe.html`:

    DELETE /subscribers/cancelar

The DELETE request contains no visible subscriber identifier.

These contracts cannot safely be assumed to represent the same backend behavior.

Correct intended contract:

**UNKNOWN UNTIL BACKEND REVIEW**

## 5.2 Mixed API naming

Observed paths mix English and Spanish terminology:

- `/subscribe`
- `/actualizar`
- `/cancelar`

This is not inherently invalid, but the API naming should be reviewed before building a new client.

## 5.3 Multiple historical data models

The general project audit already identified another apparent contract mismatch.

The subscription form sends properties such as:

- `nombre`
- `apellido`
- `terremoto`
- `huracan`

Historical admin code expects properties such as:

- `firstName`
- `lastName`
- `topicsOfInterest`
- `subscriptionDate`

This suggests that multiple frontend/backend contract versions existed.

The authoritative historical contract is:

**UNKNOWN UNTIL BACKEND REVIEW**

# 6. localhost Dependency

The inspected JavaScript directly calls:

`http://localhost:8080`

Affected scripts:

- `scripts/form.js`
- `scripts/updateSubscription-v2.js`
- `scripts/unsubscribe.js`

Problems:

- incompatible with the public static deployment
- tightly couples frontend code to one environment
- no production/staging/local configuration
- API URLs are duplicated across page scripts

Classification:

**REPLACE**

A future implementation should centralize API configuration and subscription requests.

# 7. Debugging and Temporary Code

## scripts/form.js

Contains:

- `console.log()` with the complete subscription payload
- `console.error()`
- `alert()` for backend response
- `alert()` for network failure

The payload log includes subscriber email and preferences.

## scripts/updateSubscription-v2.js

Contains extensive debugging code:

- multiple `console.log()`
- `console.warn()`
- `console.error()`
- two page-load `alert("Archivo JS cargado")` calls
- submit tracing
- DOM lookup tracing
- request payload logging
- response status logging

Comments such as `CORREGIDO a POST según backend` indicate previous manual contract changes.

Classification for temporary debugging code:

**REMOVE**

## scripts/unsubscribe.js

Contains:

- `confirm()`
- `console.error()`

The inline status-message approach is conceptually more reusable than the alert-based flows.

`confirm()` should not define the future Join experience.

Classification:

**REFACTOR / REPLACE**

## prompt()

No use of `prompt()` was found in the inspected subscription files.

# 8. Current Form Validation

## New subscription

Native HTML validation currently provides:

- required first name
- required last name
- required email
- browser email format validation

Not required:

- city
- date
- any interest checkbox

JavaScript trims:

- first name
- last name
- email
- city

No visible custom frontend validation exists for:

- minimum or maximum lengths
- topic selection
- duplicate subscriptions
- normalization beyond trimming
- backend-specific validation rules

Backend validation is:

**UNKNOWN UNTIL BACKEND REVIEW**

## Update interests

The email field is:

- required
- `type="email"`

No interest checkbox is required.

The frontend allows submitting an update with all interests unchecked.

Whether this is valid business behavior is:

**UNKNOWN UNTIL BACKEND REVIEW**

## Cancellation

The update-page cancellation form requires an email with native HTML validation.

The unsubscribe-page email input is readonly and populated from the URL.

No independent ownership verification is visible in the frontend.

# 9. Error Handling

## Subscribe

HTTP response handling:

- response text is displayed through `alert()`
- redirect occurs only when `response.ok` is true

Network failure handling:

- error is logged to the console
- a generic alert is displayed

This provides basic feedback, but the UX is tightly coupled to browser alerts and raw backend text.

## Update interests

HTTP failure:

- backend response text is displayed through `alert()`

Network failure:

- error is only logged to the console
- no visible user-facing error message is shown

This is an incomplete failure experience.

## Cancel from update page

HTTP failure:

- backend response text is displayed through `alert()`

Network failure:

- error is only logged to the console
- no visible user-facing error message is shown

## Unsubscribe page

HTTP success, HTTP failure, and network failure are displayed inline through `#message`.

This interaction pattern is more reusable conceptually than the alert-based flows.

# 10. Email Query Parameter Handling

`scripts/unsubscribe.js` reads the subscriber email from:

    ?email=user@example.com

using:

`URLSearchParams(window.location.search)`

If no email exists:

- an inline error message is shown
- the unsubscribe form is hidden

If an email exists:

- it is displayed in a readonly input
- it is included in the confirmation dialog

No code in this frontend repository was found that constructs an `unsubscribe.html?email=...` URL.

Therefore, the origin of this URL is:

**UNKNOWN UNTIL BACKEND REVIEW**

It may have been generated by the backend, outgoing email content, or another historical system.

This must be verified rather than assumed.

# 11. Security and Privacy Risks

## Email exposed in URL

Passing subscriber email directly in a query string can expose personal information through:

- browser history
- copied or shared URLs
- hosting or server logs
- analytics systems
- referrer information depending on browser and site policy

Classification:

**REPLACE**

A future unsubscribe mechanism should prefer an opaque, server-generated unsubscribe token rather than exposing the email address directly.

## No visible authorization for cancellation

The current frontend shows no visible mechanism such as:

- authentication
- signed token
- one-time token
- unsubscribe secret
- ownership verification challenge

The unsubscribe DELETE request does not send the email or another visible identifier.

Actual backend protections are:

**UNKNOWN UNTIL BACKEND REVIEW**

## Subscriber data logged to console

Subscription and update payloads are written to the browser console.

These payloads include:

- email address
- subscriber identity fields
- topic preferences

Classification:

**REMOVE**

## Raw backend messages shown to users

Some response bodies are passed directly into `alert()`.

Depending on backend behavior, this could expose internal implementation details or unsuitable raw error messages.

The backend error-response contract must be reviewed before reuse.

# 12. HTML and DOM Issues Found

These issues are documented but are not fixed as part of this audit.

## form.html

The outer `<fieldset>` is not closed before the form ends.

`id="instal-date"` appears to be a historical or misspelled identifier.

The date field is not included in the JavaScript payload.

## update.html

`lang="en"` is used although the visible content is Spanish.

The page combines two responsibilities:

- updating interests
- cancelling a subscription

Whether these should remain together should be reconsidered for the future product flow.

## unsubscribe.html

`lang="en"` is used although the visible content is Spanish.

Two elements use:

`id="message"`

Duplicate IDs create ambiguous DOM targeting.

## thanks.html

`lang="en"` is used although the visible content is Spanish.

The main-page anchor markup is incomplete.

`id="how to"` contains whitespace.

These issues are independent from the backend contract and should only be fixed in an appropriate implementation or polish scope.

# 13. Classification

## form.html

**REFACTOR**

Reusable:

- basic subscription form concept
- native HTML validation
- topic selection concept

Needs cleanup and redesign before reactivation.

## scripts/form.js

**REFACTOR**

Reusable concepts:

- intercept form submit
- construct explicit request data
- send JSON
- check HTTP status
- redirect after successful subscription

Replace or remove:

- hardcoded localhost
- alerts
- direct payload logging
- page-specific API configuration

## update.html

**UNKNOWN UNTIL BACKEND REVIEW**

The concept of subscription preference management may remain useful.

However, the future flow should only be defined after confirming the historical backend capabilities and deciding what Join actually needs.

## scripts/updateSubscription-v2.js

**REPLACE**

The current implementation contains extensive temporary/debugging code and tightly coupled API calls.

Reusable behavior should be reconstructed cleanly rather than preserving this script as-is.

## unsubscribe.html

**REFACTOR**

Reusable concepts:

- dedicated unsubscribe page
- inline status messaging
- explicit confirmation before a destructive action

Replace:

- email-as-query-state model
- duplicate DOM IDs
- current contract assumptions

## scripts/unsubscribe.js

**REPLACE**

The current DELETE contract appears incomplete and the query-string email model presents privacy concerns.

The future implementation should use a verified backend-defined unsubscribe contract.

## thanks.html

**KEEP conceptually / REFACTOR implementation**

A dedicated success state after subscription is useful.

The page should eventually be aligned with the current public frontend.

## Hardcoded `http://localhost:8080`

**REPLACE**

## Alert-based feedback

**REPLACE**

## Debug console output containing subscriber data

**REMOVE**

## Native browser form validation

**KEEP / REFACTOR**

Keep it as a first validation layer, complemented by explicit frontend UX and mandatory backend validation.

## Email query parameter unsubscribe model

**REPLACE**

## Existing backend contracts

**UNKNOWN UNTIL BACKEND REVIEW**

# 14. Code Potentially Reusable for Future Join

The current implementation should not be copied wholesale.

Useful concepts include:

1. explicit subscription request construction
2. native email validation
3. topic checkbox mapping
4. asynchronous submission using `fetch`
5. JSON request bodies
6. `response.ok` checks
7. dedicated post-subscription success state
8. inline unsubscribe status messaging
9. confirmation before destructive cancellation

These concepts should be reimplemented behind a cleaner API/service boundary.

# 15. Code That Should Be Retired or Replaced

The following should not be carried directly into Join:

- hardcoded `http://localhost:8080`
- duplicated API URLs across page scripts
- `alert()`-based application feedback
- page-load debugging alerts
- verbose temporary console logging
- console logging of subscriber payloads
- DELETE unsubscribe request without an identifier
- email address used directly as unsubscribe URL state
- duplicate `id="message"`
- historical `updateSubscription-v2.js` implementation as-is
- assumptions about backend response formats before verification

# 16. Backend Review Required

The original backend exists in a separate repository.

Before implementing Join, the backend repository should be inspected to determine:

- actual controller routes
- actual HTTP methods
- request DTOs
- response DTOs
- subscriber entity or model
- persistence model
- duplicate-email behavior
- validation rules
- update semantics
- unsubscribe semantics
- whether DELETE cancellation ever accepted an identifier elsewhere
- email-generation logic
- unsubscribe-link generation logic
- whether tokens existed historically
- CORS configuration
- environment configuration
- security controls
- error response structure
- whether the English and Spanish property models correspond to different API versions

Until that review is complete, no frontend-observed API contract should be considered authoritative.

# 17. Recommendation for Future Join

Do not connect the future Join experience directly to these historical scripts.

Recommended sequence:

    1. Preserve this audit as historical evidence.
    2. Review the separate backend repository.
    3. Establish the actual historical API contracts.
    4. Decide what functionality Join needs for the MVP.
    5. Define one canonical subscription API contract.
    6. Define a safe unsubscribe contract, preferably token-based.
    7. Centralize frontend API access and environment configuration.
    8. Build Join against the verified or newly defined contract.
    9. Add inline states for loading, success, validation, and failure.
    10. Only then reconnect subscription functionality to the public site.

The likely best direction is to reuse the business concepts, not the historical frontend implementation.

Join should be treated as a clean frontend integration against a verified contract rather than as a reactivation of `form.js`, `updateSubscription-v2.js`, or `unsubscribe.js`.

# Audit Status

Frontend subscription flow:

**AUDITED**

Production readiness:

**NOT READY**

Backend contract:

**UNKNOWN UNTIL BACKEND REVIEW**

Feature activation:

**REMAIN DORMANT**

Next recommended investigation:

**Audit the historical backend repository before defining or implementing Join.**
