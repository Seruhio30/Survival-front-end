# Emergency Cards Interaction Decision

## Context

The home emergency-question cards previously combined three different interaction mechanisms:

- CSS `:hover` rotation
- JavaScript `.is-flipped`
- JavaScript `.expanded`

Only the hover state had a matching CSS implementation. The JavaScript states were inconsistent and the fixed-height card layout allowed the orange back content to overlap neighboring cards and following sections.

## Decision

The emergency cards now use a single disclosure interaction model.

Each card uses:

- a semantic `<button>` as the interactive control
- `aria-expanded` as the source of truth for open/closed state
- `aria-controls` to associate the button with its content panel
- the native `hidden` attribute to hide collapsed content

The content stays in the normal document flow instead of using an absolute-positioned 3D flip layout.

## Accessibility

The interaction now supports:

- mouse
- touch
- keyboard navigation
- Enter and Space through native button behavior
- visible keyboard focus
- accessible expanded/collapsed state

## Removed Behavior

The following legacy interaction states are no longer used:

- `.is-flipped`
- `.expanded`

`scripts/homeCard.js` was removed because its only responsibility was toggling `.expanded` on `.card-inner`, both of which are no longer part of the component.

`scripts/common.js` remains in use because it also provides shared site functionality and now contains the single emergency-card interaction handler.

## Validation

The component was manually validated at:

- 375 × 812
- 768 × 1024
- 1440 × 900

Checks included:

- no card overlap
- no horizontal overflow
- consistent open/close behavior
- mouse interaction
- touch-compatible click behavior
- keyboard interaction
- visible focus
- content remaining within normal page flow