---
name: R3F Environment maps in the sandbox
description: Why drei <Environment> must use self-contained Lightformers, not preset/HDR CDN env maps, for refractive materials here.
---

Use drei `<Environment resolution={...}>` with child `<Lightformer>` elements to light/reflect refractive materials (e.g. `MeshTransmissionMaterial`). Do NOT use `<Environment preset="..." />` or `files={...}` HDRs.

**Why:** preset/HDR env maps fetch from external CDNs (pmndrs market / github raw) at runtime. That network dependency is fragile in the Replit preview and can silently leave transmission materials looking flat/black. Lightformers build the env map in-scene with zero external fetch, so it always works offline.

**How to apply:** Any R3F scene that needs reflections/refraction (glass, crystal, chrome). See `artifacts/utk-ai/src/components/crystal-scene.tsx`. Also gate the heavy Canvas behind IntersectionObserver + `prefers-reduced-motion`, and reduce `samples`/`resolution`/mesh count on small screens for mobile FPS.

## MeshTransmissionMaterial renders solid black on an alpha canvas

If `MeshTransmissionMaterial` glass looks solid black/dark on a `Canvas` with `gl={{ alpha: true }}` (no scene background), it is sampling the transparent buffer (reads as black) for its transmission. Fix: give the material a light `background={new THREE.Color(...)}` so refraction shows a luminous tint instead of black. Per-crystal light backgrounds keep colored gems visibly tinted.

Alternative (and what crystal-scene.tsx uses): with `transmissionSampler`, the glass refracts the actual rendered scene, so a full-screen backdrop sphere (a `Sky` mesh, `side={THREE.BackSide}`) supplies what it samples — no per-material `background` needed. This works on a **dark** backdrop too: bright `Lightformer` env + additive emissive geometry (e.g. laser beams) give the gems luminous highlights against an abyssal background.

## drei MeshTransmissionMaterial ref does not accept a MeshPhysicalMaterial ref

To mutate a `<MeshTransmissionMaterial ref={...}>` per-frame (e.g. `mat.current.color`/`attenuationColor`), its `ref` prop wants drei's own `MeshTransmissionMaterialType`, which is NOT assignable from `THREE.MeshPhysicalMaterial` (incompatible `dispose`/`isMeshPhysicalMaterial`). tsc also rejects `Ref<unknown>`. **Fix:** type your `useRef` as `MeshPhysicalMaterial` for ergonomic runtime access, and cast only at the JSX prop: `ref={mat as unknown as Ref<never>}` (`Ref<never>`/`any` are the only casts tsc accepts). **Why:** saves re-deriving this through 4+ failed cast attempts. Build runs tsc only (no eslint), so the cast is safe.

## Guard the R3F Canvas with a WebGL feature-check, not just an error boundary

When WebGL is unavailable (headless browsers, some devices), `THREE.WebGLRenderer` throws "Error creating WebGL context". A React error boundary catches it for prod, BUT Vite's dev `runtime-error-plugin` has a global handler that still shows a blocking overlay in development regardless of the boundary. **Fix:** detect support up front (`canvas.getContext('webgl2'|'webgl')`, lose the probe context) and only mount the Canvas when present — render a static fallback otherwise. This avoids the throw entirely (no dev overlay, graceful prod). Keep an error boundary too as a safety net for runtime context-loss. **Why it matters for testing:** the Playwright testing subagent's browser has no WebGL, so it always takes the fallback path — you cannot visually verify WebGL content there; verify the graceful fallback instead, and confirm 3D visuals in a real GPU browser.
