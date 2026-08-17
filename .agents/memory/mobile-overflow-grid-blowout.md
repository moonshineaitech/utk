---
name: Mobile horizontal-overflow from responsive grid blowout
description: Why a section gets clipped on the right on mobile even when the page root has overflow-x-hidden.
---

- A page root with `overflow-x-hidden` does NOT fix overflow — it HIDES it. Any descendant wider than the viewport is silently clipped on the right (and can't be scrolled to), which the user perceives as "this section is cut off on mobile."
- **Classic cause:** a grid that only declares columns at a breakpoint (e.g. `lg:grid-cols-2`) has, below that breakpoint, a single implicit `auto` column track. An item with a large intrinsic / min-content width — a Three.js / R3F `<canvas>`, a wide multi-column table, a `whitespace-nowrap` line — blows that `auto` track wider than the container, overflowing the viewport.
- **Fixes:** declare the mobile track explicitly (`grid-cols-1 lg:grid-cols-2`); add `min-w-0` to flex/grid children that hold wide content; and prefer an aspect-ratio media box (`aspect-video w-full`) over a fixed-height container that a canvas can outgrow.
- **Verify by measuring, not eyeballing:** compare `document.documentElement.scrollWidth` vs `clientWidth` at a mobile width (equal ⇒ no overflow). The clip is invisible in a static screenshot, so a Playwright/runTest check that reads these values is the reliable signal.
