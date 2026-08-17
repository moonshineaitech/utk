---
name: utk.ai mobile text clipping
description: Why long domain names got cut off at the screen edge on mobile, and the correct fix
---

# Mobile horizontal text clipping (utk.ai home.tsx)

Symptom: long unbreakable domain tokens ("GoldRockHealth.com", "AdvisoryAutomated.com",
"GulfShoresBooking.com", "BecomeTheAutomator.com", "eformative.com") and the body text
beside them were cut off at the right edge on mobile.

Root cause: the page root wrapper has `overflow-x-hidden`, so any content wider than the
viewport is **clipped** (not scrollable). Inside flex/grid cards, a child defaults to
`min-width: auto`, so a long unbreakable word forces the column/track wider than its card
and the overflow gets clipped.

**Why `break-words` alone did NOT fix it:** `break-words` (= `overflow-wrap: break-word`)
does not reduce a flex/grid item's min-content contribution, so the track still sized to
the longest word. The parent must be allowed to shrink.

Fix (the durable rule): for any flex/grid column holding a long unbreakable string, add
`min-w-0` to the column AND `break-words` (often `max-w-full`) to the text element. Together
the track can shrink to the container and the word wraps instead of overflowing.

How to apply: whenever you add a venture/domain name heading inside a card column, give the
column `min-w-0` and the heading `break-words max-w-full`. Applies to the featured flagship
card, the 4-up flagships, the eformative proof card, the founder press masthead/story grid,
and the projects grid (both the `<img>` cards' `<h4>` and the brand-tile `<span>`).
