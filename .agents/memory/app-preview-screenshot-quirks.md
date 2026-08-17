---
name: app_preview screenshot quirks
description: Limitations of the app_preview screenshot tool when verifying long pages
---

# app_preview screenshot does NOT follow hash anchors

Passing `path: "/#flagships"` (or any `#section`) to the `app_preview` screenshot
tool captures the **top** of the page, not the anchored section. The client-side
scroll-to-anchor happens after the capture, so the hash is effectively ignored for
the screenshot.

**Why:** the tool snapshots the rendered DOM at/near load, before the browser's
hash-scroll settles.

**How to apply:** to visually verify a section far down a long single-page app, do
NOT rely on the hash. A taller `viewport_size` (e.g. `[1280, 3000]`, max edge 3000)
often does NOT help either: if the first section is `min-h-screen` (typical hero),
it stretches to fill the taller viewport, so the whole frame is still just the hero
(tell: the hero's "scroll" indicator sits at the very bottom of the shot). When that
happens, the screenshot tool simply cannot reach lower sections — verify them via
architect/code review + typecheck + console-log checks instead. Don't waste retries
re-shooting the same URL expecting a different scroll position.
