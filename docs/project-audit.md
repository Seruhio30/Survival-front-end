# Survival72 — Initial Project Audit

**Audit date:** 2026-08-11  
**Branch:** `chore/project-audit`  
**Repository:** `Survival-front-end`  
**Audit type:** Frontend technical audit  
**Implementation status:** No refactor or functional changes performed during this audit

---

## 1. Project Context

Survival72 is an educational website focused on helping church members and the general public prepare for emergencies.

The current public content mainly covers:

- 72-hour emergency kit
- Earthquakes
- Floods
- Hurricanes
- Landslides
- Family emergency plans
- Evacuation plans

Future ideas include:

- Original YouTube videos
- Monthly newsletters
- Weather information through APIs
- Emergency information and alerts
- Subscription system
- Email communication
- Exclusive content
- Talks and classes
- A future Join section

A professional and stable MVP is the immediate priority because the project will be presented during an important emergency-preparedness talk on **August 22, 2026**.

---

## 2. Audit Principles

This audit was performed under the following rules:

- Audit before refactoring.
- Do not remove unfamiliar or apparently unused code without understanding its purpose.
- Preserve the existing public website.
- Prioritize stability before adding new functionality.
- Consider responsive design, accessibility, SEO, performance, UX and basic frontend security.
- Keep implementation work outside this audit unless explicitly approved later.

No functional source files were intentionally modified during the audit.

---

## 3. Current Repository Structure

Main HTML files:

- `index.html`
- `secondaryPage.html`
- `form.html`
- `thanks.html`
- `update.html`
- `unsubscribe.html`
- `admin.html`

JavaScript:

- `scripts/common.js`
- `scripts/homeCard.js`
- `scripts/form.js`
- `scripts/admin.js`
- `scripts/unsubscribe.js`
- `scripts/updateSubscription-v2.js`

CSS:

- `styles/commun.css`
- `styles/home.css`
- `styles/secondaryPage.css`
- `styles/form.css`
- `styles/admin.css`
- `styles/thanks.css`
- `styles/unsubcribe.css`
- `styles/update.css`
- `styles/site.css`

Other resources:

- `img/`
- `pdf/`
- `.vscode/settings.json`

The repository did not contain a `README.md` at the beginning of the audit.

---

## 4. Functional Classification

### 4.1 Active public frontend

The currently active public website is mainly composed of:

- `index.html`
- `secondaryPage.html`
- `styles/commun.css`
- `styles/home.css`
- `styles/secondaryPage.css`
- `scripts/common.js`
- `scripts/homeCard.js`
- `img/`
- `pdf/`

The public navigation currently exposes:

- Inicio
- Guías y Consejos

The previous subscription navigation entry is commented out.

---

### 4.2 Dormant / incomplete subscription system

The following files belong to an older or unfinished subscription and administration implementation:

- `form.html`
- `thanks.html`
- `update.html`
- `unsubscribe.html`
- `admin.html`
- `scripts/form.js`
- `scripts/admin.js`
- `scripts/unsubscribe.js`
- `scripts/updateSubscription-v2.js`
- related CSS files

This system depends on an API running at:

`http://localhost:8080`

It is therefore not production-ready in its current state.

The subscription flow also appears to contain code from different implementation iterations, with inconsistent request formats and endpoint conventions.

This functionality must not be considered part of the current stable MVP until it is redesigned and validated.

---

### 4.3 Probable legacy or unused code

The following elements appear unused, incomplete or historical based on the current repository:

- `styles/site.css`
- `img/sitePlan-img/wireframe1.png`
- `img/sitePlan-img/wireframe2.png`
- `img/sitePlan-img/wireframe3.png`
- theme preference logic inside `common.js`
- `.is-flipped` JavaScript behavior
- `.expanded` behavior from `homeCard.js`

These items must not be deleted solely based on this audit.

They should first be evaluated during a dedicated cleanup task.

---

# 5. Prioritized Findings

## CRITICAL

### C-01 — Administrative functionality has no visible authentication

`admin.html` exposes subscriber-management functionality without any visible frontend authentication or authorization mechanism.

The associated JavaScript attempts to:

- list subscribers
- modify subscriber interests
- delete subscribers

If connected directly to a production backend without proper server-side authorization, this would represent a serious security risk.

**Recommendation:** Do not deploy or expose the administrative system until authentication and server-side authorization are properly designed.

---

### C-02 — Potential stored XSS in admin subscriber rendering

`scripts/admin.js` creates table rows using `innerHTML` with values received from the backend.

Examples include subscriber:

- names
- emails
- topics of interest
- subscription information

If malicious content were stored in the backend and returned to this interface, it could potentially be interpreted as HTML.

**Recommendation:** Render untrusted values with safe DOM APIs such as `textContent`, combined with backend validation and sanitization.

---

### C-03 — Unsubscribe flow appears functionally incomplete

`scripts/unsubscribe.js` obtains the subscriber email from the URL query parameters.

However, the cancellation request:

`DELETE http://localhost:8080/subscribers/cancelar`

does not send the email in the URL or request body.

Based on the frontend code reviewed, there is no visible way for the backend to know which subscription should be cancelled.

**Recommendation:** Redesign and validate the unsubscribe contract before reactivating this functionality.

---

### C-04 — Missing JavaScript dependency

`admin.html` references:

`scripts/updateSubscription.js`

but the repository only contains:

`scripts/updateSubscription-v2.js`

The referenced script does not exist.

**Recommendation:** Resolve this only when the dormant subscription/admin system is intentionally restored.

---

# 6. HIGH Priority Findings

## H-01 — Home responsive layout breaks at intermediate widths

The home currently changes its main layout to a mobile column only at:

`max-width: 600px`

Visual testing showed that approximately the 601–859 px range is problematic.

At 768 px:

- text is clipped horizontally
- the YouTube iframe overflows its available column
- disaster cards become constrained
- content becomes difficult to read

This is one of the highest-priority MVP issues.

---

## H-02 — Emergency-question cards have unstable layout

The home cards currently combine multiple interaction strategies.

CSS uses:

`:hover`

`common.js` toggles:

`.is-flipped`

`homeCard.js` toggles:

`.expanded`

No CSS rules were found for `.is-flipped` or `.expanded`.

Additionally:

`.card`

uses a fixed height while:

`.card-back`

uses automatic height.

Visual testing at 375 px, 768 px and desktop confirmed that expanded/back card content can overlap following cards and even the next section.

This problem occurs across multiple viewport sizes.

**Recommendation:** Redesign the card interaction as one single accessible interaction model.

---

## H-03 — Card interactions are not keyboard-accessible

The question cards primarily depend on mouse hover/click behavior.

No clear keyboard interaction model was found.

The cards are not implemented as semantic buttons and do not expose an accessible expanded/collapsed state.

**Recommendation:** Replace the current interaction with an accessible disclosure/card pattern.

---

## H-04 — Hamburger menu has incomplete accessibility state

The menu button has an `aria-label`, but JavaScript does not update:

- `aria-expanded`
- `aria-controls`

The state change is therefore mostly visual.

The label is also currently written in English on Spanish pages.

---

## H-05 — Invalid duplicated IDs in secondary page

`secondaryPage.html` contains repeated:

`id="li"`

across many list items.

HTML IDs must be unique.

The CSS currently depends on this duplicated ID through selectors such as:

`.zebra-list #li`

**Recommendation:** Replace the repeated ID with a class during a future HTML/CSS cleanup.

---

## H-06 — Duplicate `message` ID in unsubscribe page

`unsubscribe.html` contains two elements using:

`id="message"`

JavaScript accesses the element through:

`document.getElementById("message")`

which makes the behavior ambiguous and invalidates the uniqueness requirement for IDs.

---

## H-07 — Missing or incorrect main heading structure

`index.html` has multiple `<h1>` elements for individual emergency types but does not have one clear page-level H1.

`secondaryPage.html` has no `<h1>`.

This weakens document semantics, accessibility and SEO.

---

## H-08 — Incorrect page language

Several Spanish pages declare:

`lang="en"`

Affected pages include:

- `secondaryPage.html`
- `admin.html`
- `thanks.html`
- `unsubscribe.html`
- `update.html`

This negatively affects assistive technologies and language interpretation.

---

## H-09 — Local videos are heavy assets

Current local videos approximately weigh:

- Emergency backpack video: **3.7 MB**
- Family emergency plan video: **12 MB**

Combined size is roughly **15.7 MB**.

They represent one of the largest performance risks for mobile users and slower connections.

The videos visually scale correctly on `secondaryPage.html`, but the delivery strategy should be reconsidered.

Possible future options identified during the audit included:

- YouTube hosting
- stronger video compression
- optimized preload behavior
- poster-first lazy loading

### Follow-up — media optimization

The media-performance block later implemented the safest delivery improvement without changing the public experience:

- both local videos now use `preload="metadata"`
- both original H.264/AAC video files were retained
- no video was deleted or replaced with YouTube
- test encodes confirmed that stronger compression could reduce the files substantially, but they were not adopted because visual quality was not formally validated

Test-only CRF 26 encodes reduced the approximate sizes from **3.7 MB to 2.3 MB** and **12 MB to 6.8 MB** while retaining 720p/30 fps H.264/AAC. These files were not committed and remain only a documented future option.

---

## H-10 — Dormant subscription system is production-incompatible

The dormant subscriber system directly calls multiple endpoints under:

`http://localhost:8080`

Examples include:

- `/subscribers`
- `/subscribers/subscribe`
- `/subscribers/actualizar`
- `/subscribers/cancelar`

This cannot work from the public GitHub Pages deployment.

The feature should remain dormant until a production architecture exists.

---

## H-11 — Inconsistent subscription API contracts

Different frontend files appear to expect different data models.

Examples:

`form.js` sends Spanish properties such as:

- `nombre`
- `apellido`
- `terremoto`
- `huracan`

while `admin.js` expects properties such as:

- `firstName`
- `lastName`
- `topicsOfInterest`
- `subscriptionDate`

This suggests that multiple backend/frontend contract versions are present.

---

## H-12 — Admin Chart.js loading order appears incorrect

`admin.js` uses:

`new Chart(...)`

but Chart.js is loaded after `admin.js` in `admin.html`.

This can cause:

`Chart is not defined`

The admin implementation also contains simulated chart data rather than real subscriber statistics.

---

# 7. MEDIUM Priority Findings

## M-01 — Global italic typography reduces readability

The public shared CSS applies:

`font-style: italic`

to the entire body.

Long emergency-preparedness content is therefore rendered primarily in italics.

This reduces readability, especially:

- on mobile
- in long paragraphs
- for users with visual or reading difficulties

---

## M-02 — Justified mobile text creates excessive spacing

`secondaryPage.html` uses justified text.

At 375 px, visual testing showed very large gaps between words.

This reduces readability significantly.

---

## M-03 — No `:focus-visible` strategy

No focus-visible styling was found for the main public navigation and controls.

Keyboard users therefore have little intentional visual focus feedback beyond browser defaults.

---

## M-04 — No reduced-motion handling

The frontend uses transitions and transforms but does not contain:

`prefers-reduced-motion`

support.

This should be considered when interactive components are rebuilt.

---

## M-05 — Generic SEO titles

Both major public pages currently use:

`<title>Survival72</title>`

They do not describe the specific page content.

---

## M-06 — Weak and duplicated meta descriptions

The public meta description is approximately:

`Survival 72 - Inicio - SeruhioCode30`

This provides little meaningful information about the website and is duplicated across public pages.

Future metadata should describe:

- emergency preparation
- 72-hour emergency kits
- disaster preparedness
- family emergency planning

---

## M-07 — Branding inconsistencies

Different pages and footers reference:

- Survival72
- Survivor72
- SeruhioCode30

The final public brand should be consistent.

---

## M-08 — Naming inconsistencies

Examples include:

- `commun.css`
- `unsubcribe.css`
- `updateSubscription-v2.js`
- `id="how to"`
- `id="how-to"`
- `instal-date`

There is also a mix of Spanish and English naming conventions.

These names should eventually be normalized carefully, because renaming existing files can break references.

---

## M-09 — `site.css` appears unused

No current HTML page references:

`styles/site.css`

Its contents resemble an older global stylesheet.

It is likely legacy CSS but should only be removed during a dedicated cleanup after confirmation.

---

## M-10 — CSS duplication

Examples:

- global reset rules exist in several files
- `update.css` and `unsubcribe.css` are highly similar
- `thanks.css` redefines shared navigation/header/footer styles already present in `commun.css`

This increases maintenance cost and potential style conflicts.

---

## M-11 — Dead or incomplete theme preference code

`common.js` reads:

`localStorage.userPreferences`

and toggles:

`.dark-theme`

It also searches for:

`#save-preferences`

No corresponding control or `.dark-theme` CSS implementation was found.

This appears to be an incomplete or abandoned feature.

---

## M-12 — `homeCard.js` appears incomplete

`homeCard.js` toggles:

`.expanded`

No corresponding `.expanded` CSS rule was found.

The file is loaded by `index.html`, but the generated class has no visible styling effect based on the audited CSS.

---

## M-13 — Shared JavaScript mixes responsibilities

`common.js` currently handles:

- footer year
- last modified date
- hamburger navigation
- home card behavior
- scrolling/navigation behavior
- user preference/theme logic

Some of these responsibilities are global while others are page-specific.

This is manageable at the current size but will become difficult to maintain as Survival72 grows.

---

## M-14 — PDF behavior is inconsistent

Some PDF links use:

`target="_blank"`

others use:

`download`

and some use both.

The product should eventually establish a consistent UX:

- open guide
or
- download guide

depending on the intended action.

---

## M-15 — New-tab links need consistency

Several links use:

`target="_blank"`

without an explicit consistent `rel` policy.

External links should be reviewed for:

`rel="noopener noreferrer"`

where appropriate.

---

## M-16 — Image alternative text can be improved

Examples include:

- `alt="logo"`
- `alt="emergency backPack"`

Alternative text should use the site's language and describe meaningful image content appropriately.

---

## M-17 — Form UX relies heavily on browser dialogs

The dormant subscription system uses:

- `alert()`
- `confirm()`
- `prompt()`

These provide limited UX and accessibility compared with inline interface feedback.

---

## M-18 — Debugging code remains in dormant scripts

`updateSubscription-v2.js` contains extensive debugging code, including multiple:

- `console.log`
- `console.warn`
- `alert("Archivo JS cargado")`

This reinforces that the module represents unfinished development code.

---

## M-19 — Form HTML contains structural concerns

`form.html` contains nested fieldsets and the outer structure should be validated before reactivation.

The subscription date field exists in HTML but is not included in the data object sent by `form.js`.

---

# 8. LOW Priority Findings

## L-01 — Historical wireframes stored with production images

The following files are not referenced by the public HTML:

- `wireframe1.png`
- `wireframe2.png`
- `wireframe3.png`

They appear to be historical design artifacts.

They may eventually belong under documentation rather than production assets.

---

## L-02 — Commented historical code exists

Several HTML and CSS files contain old commented blocks.

Examples include:

- subscription navigation
- old PDF links
- old submit styles
- previous design experiments

These should eventually be cleaned after their purpose is confirmed.

---

## L-03 — Breakpoints are inconsistent

Current CSS uses multiple breakpoint values such as:

- 600px
- 768px
- 860px

There is no clearly documented responsive strategy.

---

## L-04 — Repeated hard-coded colors

Colors are repeated directly throughout CSS files.

Future maintainability would benefit from CSS custom properties.

This is not necessary for the immediate stabilization phase.

---

## L-05 — Some dimensions are rigid

Examples include fixed card/image dimensions and large fixed navigation padding.

Rigid values are contributing to intermediate-width layout problems.

---

# 9. Responsive Audit Results

Manual visual testing was performed using browser responsive tools.

## 375 px — Home

Observed:

- hamburger menu opens and closes
- primary content remains generally navigable
- question cards stack vertically
- expanded card content overlaps other cards
- orange back-card content exceeds fixed card height
- layout has noticeable unused horizontal space in some sections
- YouTube fits narrowly but spacing is limited
- disaster sections stack into one column

Overall:

**Usable but not stable.**

Primary issue:

**question card component**

---

## 768 px — Home

Observed:

- two-column hero layout remains active
- text is clipped horizontally
- YouTube iframe exceeds available column space
- question-card overflow persists
- expanded card overlaps disaster section
- two-column disaster layout becomes constrained
- disaster text is clipped

Overall:

**Broken intermediate responsive layout.**

This width range represents one of the most important MVP fixes.

---

## 1440 px — Home

Observed:

- navigation and upper hero section are reasonably usable
- two-column structure works much better
- question-card overflow still occurs
- expanded card can overlap the disaster section
- disaster cards remain visually dense
- long italic paragraphs reduce readability

Overall:

**Desktop is usable but the card component remains structurally broken.**

---

## 375 px — Secondary Page

Observed:

- page remains structurally stable
- menu functions
- kit list stacks correctly
- videos fit their containers
- PDF buttons have usable touch size
- justified paragraphs produce excessive word spacing
- headings become large multi-line blocks
- page is very long but remains usable

Overall:

**Usable with readability improvements needed.**

---

## 768 px — Secondary Page

Observed:

- content remains stable
- emergency kit list scales well
- video scales correctly
- PDF buttons remain usable
- no major component overlap was observed
- header consumes significant vertical space while menu is open
- justified text remains visually weak

Overall:

**Responsive structure is substantially stronger than the home page.**

---

# 10. External Services and Dependencies

Current public frontend integrations include:

### Google Analytics

Google tag ID currently present:

`G-FV5NQN7MK3`

Loaded from Google Tag Manager infrastructure.

---

### Google Fonts

Roboto is loaded through Google Fonts.

---

### YouTube

The home embeds a YouTube emergency-preparedness video.

---

### Costa Rica emergency institutions

The secondary page links to:

- Comisión Nacional de Emergencias (CNE)
- Instituto Meteorológico Nacional (IMN)
- Cruz Roja Costarricense
- Ministerio de Salud
- Bomberos de Costa Rica

---

### Developer portfolio

The footer links to the developer portfolio.

---

### Chart.js

Chart.js is used only by the dormant administrative interface and loaded through jsDelivr.

---

### Legacy local backend

The dormant subscription system references:

`http://localhost:8080`

No production API configuration was found in the current frontend.

---

# 11. Content Accuracy Risk

The home includes numerical claims about emergency events in Central America, including statistics related to:

- earthquakes
- floods
- hurricanes
- economic losses
- affected populations
- fatalities

No visible sources or citations were found alongside these claims.

Because Survival72 is an educational emergency-preparedness website, factual reliability is important.

Before the August 22 presentation, these statistics should be:

1. verified against authoritative sources,
2. updated if necessary,
3. cited clearly,
4. removed if they cannot be reliably supported.

Preferred future sources should prioritize official institutions and recognized emergency or meteorological authorities.

---

# 12. Performance Assessment

Main performance risks identified during the audit were:

1. local 12 MB family-plan video
2. local 3.7 MB backpack video
3. embedded YouTube content
4. Google Fonts
5. Google Analytics
6. relatively large flood image compared with other images

### Media optimization follow-up

The flood image was optimized from approximately **352 KB / 2048×1317** to **64 KB / 600×386**, an approximate **82% size reduction**, while preserving WebP and the existing visual presentation.

Loading behavior was also improved:

- disaster images retain `loading="lazy"` and now use `decoding="async"`
- the featured emergency-backpack image is no longer lazy-loaded and uses `fetchpriority="high"`
- key images include intrinsic dimensions where safe
- the YouTube iframe uses `loading="lazy"`
- local videos use `preload="metadata"`

All local multimedia references were verified after the changes. The original local video files remain intentionally unchanged.

---

# 13. Accessibility Assessment

Main issues identified:

- incomplete hamburger ARIA state
- interactive cards inaccessible through a clear keyboard pattern
- limited intentional focus styling
- no reduced-motion handling
- incorrect page language declarations
- repeated IDs
- heading hierarchy problems
- generic image alternative text
- global italic typography
- difficult justified text on small screens

Accessibility improvements should be integrated into stabilization work rather than treated as a cosmetic final step.

---

# 14. SEO Assessment

Current SEO foundation exists but is minimal.

Positive elements:

- viewport metadata
- basic meta description
- HTML language attribute exists
- semantic sectioning is partially used
- public pages are directly crawlable static HTML

Issues:

- incorrect language on `secondaryPage.html`
- weak page titles
- duplicated meta descriptions
- missing clear H1 hierarchy
- inconsistent brand naming
- unsourced content claims
- limited contextual metadata

SEO improvements should prioritize semantic correctness and accurate educational content before advanced optimization.

---

# 15. Basic Frontend Security Assessment

Current public informational pages have relatively low frontend attack surface.

The dormant subscription/admin system introduces significantly more risk.

Important concerns:

- admin operations without visible authentication
- potential unsafe `innerHTML` rendering
- direct localhost API coupling
- inconsistent API contracts
- cancellation logic issues
- personally identifiable subscriber information exposed through admin functionality
- email values carried through query parameters in unsubscribe flow

Security must primarily be enforced on the future backend.

### Admin security foundation follow-up

The dormant administrative interface was reviewed separately after the initial audit.

The following risk-reduction measures were applied:

* `admin.html` was converted into a disabled informational page and no longer exposes subscriber-management controls.
* `admin.html` no longer loads `scripts/admin.js`.
* the broken reference to the nonexistent `scripts/updateSubscription.js` file was removed from the administrative page.
* Chart.js is no longer loaded by `admin.html`; therefore its previous dependency-order concern is inactive while the panel remains disabled.
* subscriber values in the dormant `scripts/admin.js` implementation are no longer rendered using `innerHTML`; safe DOM construction with `createElement`, `textContent`, `dataset`, and `append` is used instead.
* the existing `http://localhost:8080` API references remain dormant and were not migrated or redesigned as part of this frontend security block.

The administrative panel must remain disabled for the public MVP until server-side authentication and authorization exist. Hiding navigation links, frontend checks, or JavaScript-only login logic would not provide adequate protection.

The backend implementation is not present in this repository, so administrative endpoints, authorization rules, API contracts, and production deployment configuration could not be validated here.


---

# 16. Maintenance Assessment

The project is small enough to stabilize without a large rewrite.

However, several signs of incremental historical growth are visible:

- multiple naming conventions
- duplicated CSS
- page-specific logic inside common scripts
- unfinished features
- dormant backend integrations
- debugging code
- historical design assets mixed with production assets
- inconsistent responsive rules
- repeated global styles

A controlled cleanup is recommended after the MVP is stable.

A full framework migration is not currently justified by the audited project size.

---

# 17. Proposed Target Architecture

This is a proposal only.

It must not be implemented automatically as part of the audit.

A reasonable future static frontend structure could evolve toward:

```text
Survival-front-end/
│
├── index.html
├── guides.html
│
├── assets/
│   ├── images/
│   ├── videos/
│   └── documents/
│
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── home.css
│   └── guides.css
│
├── js/
│   ├── main.js
│   ├── navigation.js
│   └── home.js
│
├── docs/
│   ├── project-audit.md
│   ├── architecture.md
│   └── decisions.md
│
└── README.md
---

# 18. MVP Priority Before August 22, 2026

Recommended priority order:

## Phase 1 — Stabilize public frontend

Focus on:

- home responsive failures
- emergency question cards
- YouTube responsiveness
- disaster section layout
- accessible hamburger menu
- valid HTML IDs
- heading hierarchy
- correct language attributes

---

## Phase 2 — Content and trust

Focus on:

- verify emergency statistics
- add authoritative references
- correct spelling and wording
- normalize Survival72 branding
- improve titles and descriptions

---

## Phase 3 — Performance

Completed in the media-optimization block:

- ✅ local video delivery strategy reviewed
- ✅ image optimization
- ✅ media loading behavior
- ✅ embedded YouTube loading improvement

Still available for future investigation:

- stronger local video compression after formal quality validation
- broader external-resource impact such as Google Fonts and Analytics

---

## Phase 4 — UX polish

Focus on:

- typography
- spacing
- visual hierarchy
- mobile readability
- consistent buttons
- navigation polish

---

## Phase 5 — Maintenance cleanup

Only after the public MVP is stable:

- identify confirmed dead code
- isolate dormant subscription functionality
- normalize naming
- consolidate CSS
- simplify JavaScript responsibilities
- reorganize assets

---

# 19. Features Explicitly Not Recommended Before MVP Stabilization

Unless required for the August 22 presentation, avoid prioritizing:

- weather API integration
- emergency alert API integration
- subscription rebuild
- production admin panel
- authentication system
- exclusive content
- Join section
- complex frontend framework migration
- major visual redesign
- unnecessary architecture abstractions

These features can be planned after the current public experience is stable.

---

# 20. Recommended Work Blocks After Audit

Each block should use its own Git branch.

Suggested sequence:

1. `fix/home-responsive-layout`
2. `fix/emergency-cards-accessibility`
3. `fix/html-accessibility-semantics`
4. `fix/content-accuracy`
5. `perf/media-optimization`
6. `feat/seo-foundation`
7. `refactor/frontend-cleanup`

Exact branch names may be adjusted when each task is formally scoped.

The dormant subscription system should receive its own dedicated architecture decision before any implementation work resumes.

---

# 21. Audit Conclusion

Survival72 does not currently require a complete rewrite.

The public website already has a usable educational foundation, existing content, downloadable guides, responsive elements and a functioning public deployment.

The main problems are concentrated in identifiable areas:

- unstable home card interaction
- intermediate responsive layout
- accessibility gaps
- semantic HTML issues
- heavy video delivery
- inconsistent historical code
- incomplete subscription/admin functionality
- content claims requiring verification

The safest strategy before August 22, 2026 is therefore:

**stabilize → validate → improve accessibility/content → optimize → clean up**

rather than:

**rewrite → add features → refactor everything**

The dormant subscription/admin implementation should remain isolated from the stable MVP until it receives a dedicated architecture and security review.

---

## Audit Status

**Initial project audit: COMPLETE**

**Functional refactor performed:** No  
**Public website intentionally modified:** No  
**Next recommended step:** Review and approve this audit, then create the first dedicated stabilization branch.
