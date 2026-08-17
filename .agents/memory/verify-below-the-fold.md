---
name: Verifying below-the-fold sections
description: How to visually verify content far down a long SPA page when the screenshot tool can't reach it.
---

The `screenshot` (app_preview) tool renders a fixed viewport from the top and does NOT
scroll. Two consequences on long single-page apps:

- Navigating to a hash URL (e.g. `/#studio`) does NOT scroll to the anchor — React renders
  the element after the browser's initial hash jump, so the page stays at the top.
- Viewport height is capped at 3000px, so anything below ~3000px is uncapturable in one shot.

**How to apply:** to verify a section far down the page (and to exercise interactivity like
tab switching), use the `testing` skill (`runTest`) — its Playwright agent can scroll to the
section, click elements, and assert on the resulting state. Static screenshots only suffice
for above-the-fold / top-of-page checks.

**Note:** the testing/headless browser has no WebGL, so any R3F/Three.js canvas shows its
fallback there — expected, not a bug.
