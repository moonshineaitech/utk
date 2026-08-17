---
name: Screenshot tool ignores URL hash anchors
description: The app_preview screenshot tool always captures from the top; it does not scroll to #anchor fragments.
---

# Verifying below-the-fold sections

The `screenshot` (app_preview) tool loads the page and captures from the top of the document. Passing a path with a hash fragment (e.g. `/#why`, `/#craft`) does **not** scroll to that section — every capture shows the hero/top. Tall viewports also cap at 3000px, so a single shot can't reach far-down sections on a long landing page.

**To verify lower sections / layout (overflow, table fit, image loading):** use the Playwright testing subagent (`runTest`). It can scroll to a section by id, assert `scrollWidth === clientWidth` (no horizontal overflow), check that `<img>` elements have natural width > 0 (actually loaded, not just present), and confirm column/card counts.

**Why:** spent several screenshot calls trying hash anchors that all returned the hero. The testing subagent verified the real state in one pass.
