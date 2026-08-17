---
name: Generated image optimization
description: AI-generated images ship huge (~1MB, 1024px) and must be downscaled to display size before going live.
---

# Optimize AI-generated images before shipping

The media-generation tool returns large assets: icons come out ~1024×1024 PNG at ~0.6–1.4MB each, hero/portrait images ~896×1280. A set of ~14 icons totaled ~13MB while displayed at only 40–48px.

**Rule:** before finalizing, downscale generated images to display-appropriate dimensions and strip metadata. Use ImageMagick (available as `convert` / `magick`; no `sharp`, `cwebp`, `pngquant`, or `optipng` in this env):

```
convert IN.png -resize 256x256 -strip -define png:compression-level=9 OUT.png   # small icons
convert hero.png -resize 720x720 -strip -define png:compression-level=9 hero.png # hero/large
```

Overwriting in place keeps filenames/import paths stable (no code change). This cut ~13MB → ~0.9MB with no visible quality loss at display size. Icons displayed at h-10/h-12 look crisp at 256px even with hover-scale animations.

**Why:** oversized payloads undermine a "luxury"/premium feel (slow first paint) and the architect flags it. Keep `fetchPriority="high"` only on the above-the-fold hero image; `loading="lazy"` on the rest.

**How to apply:** any time you generate a batch of decorative images/icons for a site, resize to ~256px (icons) / ~720px (hero) before declaring the visual work done.
