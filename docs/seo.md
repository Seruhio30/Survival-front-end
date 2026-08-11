# SEO Foundation

## Scope

This document describes the SEO foundation implemented for the current public Survival72 frontend.

The scope of this work is intentionally limited to the existing public pages:

- `index.html`
- `secondaryPage.html`

This phase does not include backend work, admin pages, subscription flows, Join, weather API integration, redesign work, blog content, keyword stuffing, or large-scale content generation.

## Public site URL

The current public deployment is:

`https://seruhio30.github.io/Survival-front-end/`

This URL is used as the base for canonical URLs, social metadata, `robots.txt`, and `sitemap.xml`.

## Page titles

### Home

`Survival72 | Preparación para emergencias y kit de 72 horas`

### Guides

`Guías y consejos para emergencias | Survival72`

Each public page has a unique and descriptive title based on its existing content.

## Meta descriptions

### Home

`Información práctica para prepararse ante emergencias y desastres naturales, organizar un kit de 72 horas y proteger a la familia.`

### Guides

`Guías prácticas para preparar un kit de emergencia de 72 horas, organizar suministros y actuar ante diferentes situaciones de emergencia.`

Descriptions are intentionally based on the current page content and do not introduce artificial keyword repetition.

## Canonical URLs

### Home

`https://seruhio30.github.io/Survival-front-end/`

### Guides

`https://seruhio30.github.io/Survival-front-end/secondaryPage.html`

The current `secondaryPage.html` path is preserved to avoid breaking existing internal links. A future URL cleanup should include a proper migration and redirect strategy before renaming the file.

## Open Graph metadata

Both public pages include basic Open Graph metadata:

- `og:type`
- `og:locale`
- `og:site_name`
- `og:title`
- `og:description`
- `og:url`
- `og:image`
- `og:image:alt`

The existing Survival72 logo is currently used as the social sharing image.

## Twitter / X metadata

Both public pages include basic Twitter/X card metadata:

- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`

The `summary` card type is used because the current social image is the existing Survival72 logo rather than a dedicated wide-format social preview image.

## Internal links

Existing public routes remain unchanged:

- `index.html`
- `secondaryPage.html`
- `secondaryPage.html#list`

No public page was renamed during this SEO foundation work.

The developer portfolio link in the footer was also corrected by removing an invalid leading space from its `href`.

## Images

Existing visible images already contain descriptive `alt` text.

No artificial SEO wording was added to image alternative text.

## robots.txt

A root-level `robots.txt` was added.

Current policy:

- all crawlable paths are allowed;
- the sitemap location is declared.

The presence of `robots.txt` does not imply that every HTML file in the repository should be indexed.

## sitemap.xml

A root-level sitemap was added containing only the current public informational pages:

- `/`
- `/secondaryPage.html`

The following HTML files are intentionally not included in this sitemap:

- `admin.html`
- `form.html`
- `thanks.html`
- `unsubscribe.html`
- `update.html`

Their indexing behavior can be reviewed separately when those flows are addressed.

## Structured data

No Schema.org structured data was added in this phase.

Although a generic `WebSite` schema could be technically valid, the current site does not require structured data to describe a more specific entity or content type clearly enough to justify adding schema only for completeness.

Structured data can be reconsidered later if Survival72 gains content or features that map clearly to a useful Schema.org type.

## Google Analytics

The existing Google Analytics configuration using measurement ID:

`G-FV5NQN7MK3`

was preserved.

The SEO changes do not add a second analytics implementation and do not modify the existing tracking configuration.

## Deferred SEO work

The following items are intentionally left for future work:

- renaming `secondaryPage.html` to a more semantic URL;
- redirect strategy for future URL changes;
- Google Search Console setup and verification;
- dedicated social sharing artwork;
- structured data if a clear content type becomes appropriate;
- keyword research;
- content strategy or blog;
- additional Core Web Vitals optimization;
- broader indexing policy for non-public workflow pages.
