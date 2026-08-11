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

- responsive layout fixes
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

## Current Public Frontend

The active public frontend mainly consists of:

    index.html
    secondaryPage.html

    scripts/
      common.js
      homeCard.js

    styles/
      commun.css
      home.css
      secondaryPage.css

    img/
    pdf/

## Dormant / Incomplete Functionality

The repository also contains an older subscription and administration implementation.

Related files include:

    admin.html
    form.html
    thanks.html
    unsubscribe.html
    update.html

    scripts/
      admin.js
      form.js
      unsubscribe.js
      updateSubscription-v2.js

This system currently depends on a local backend at:

    http://localhost:8080

It is incomplete and must not be considered production-ready.

The subscription/admin functionality will require a separate architecture and security review before being reactivated.

## Documentation

The initial technical audit is available at:

    docs/project-audit.md

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

1. Fix responsive issues.
2. Fix emergency-card interaction.
3. Improve accessibility and semantic HTML.
4. Verify educational content and sources.
5. Improve media performance.
6. Improve SEO.
7. Perform controlled frontend cleanup.

Future ideas such as weather APIs, alerts, subscriptions, email systems, exclusive content and the Join section should be addressed after the public MVP is stable.

## License

No license has been defined yet.
