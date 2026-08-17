---
name: AI video montage hero
description: Turning generateVideo AI clips into a looping muted hero video montage with ffmpeg
---

# AI video montage for hero visuals

`generateVideo` / `generateVideoAsync` (media-generation skill) produce clips that are **9:16 or 16:9 only**, **4/6/8s max**, and **include an audio track**. `ffmpeg` AND `ffprobe` are available in this environment — no install needed.

To build a looping hero "video montage" from several clips:
- Generate clips async in parallel (`Promise.all` of `generateVideoAsync`), then `wait_for_background_tasks`.
- Crop each to the target card aspect (e.g. 720x1280 9:16 → `crop=720:900` for a 4:5 portrait card), normalize fps + format, then chain with `xfade` crossfades (offset = clipDur − xfadeDur, accumulated per clip).
- **Strip audio with `-an`**, add `-movflags +faststart`, output h264 `yuv420p` crf ~24 (≈2MB for ~16s at 720x900).
- Extract a poster: `ffmpeg -ss <t> -i out.mp4 -frames:v 1 -q:v 3 poster.jpg`.

**Why:** clips arrive with sound and the wrong aspect for a card; a hero video must be muted, seamlessly loopable, web-light, and fit its layout box.

**How to apply:** for any "make the visual a video / montage" request. Render `<video autoPlay muted loop playsInline preload="metadata" poster>`. For `prefers-reduced-motion: reduce`, render the poster `<img>` instead — CSS cannot pause video playback, so a `motion-reduce:` class is not enough.
