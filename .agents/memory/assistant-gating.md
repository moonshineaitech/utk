---
name: Gated AI assistant
description: Durable decisions/gotchas for utk.ai's gated AI + FAQ assistant — Turnstile fail-closed detection, global rate-limit locking, and gpt-5-nano token budgeting.
---

# Gated AI assistant (utk.ai)

Lives in `artifacts/api-server/src/lib/assistant.ts` + `routes/assistant.ts` and `artifacts/utk-ai/src/components/assistant-widget.tsx`. Canned FAQ decision tree = free/instant; only free-form typed questions hit `gpt-5-nano` and require a Turnstile-issued pass.

## Turnstile must fail CLOSED in production
Decide whether to use Cloudflare's public test keys (which always pass) with `REPLIT_DEPLOYMENT !== "1"` **AND** `NODE_ENV !== "production"`. Also reject the known test keys if pasted into prod env (treat them as "not real").
**Why:** Relying on `NODE_ENV === "production"` alone is a fail-OPEN hole — a Replit deployment may not set `NODE_ENV`, so the app would silently fall back to test keys and auto-pass every human check. Replit deployments reliably set `REPLIT_DEPLOYMENT=1`, so use it as the positive deployment signal.
**How to apply:** When no real key is configured: in genuine local dev → use test keys; otherwise → return empty site key (frontend disables free-form AI) and make verify return false. The canned FAQ tree keeps working regardless.

## Global spend backstop needs a GLOBAL lock, not a per-IP lock
The reserve-usage transaction must take a **single constant** advisory lock (`pg_advisory_xact_lock(hashtext('utk_assistant_usage'))`), not `hashtext(ip)`.
**Why:** A per-IP lock only serializes one IP. Concurrent distinct/spoofed IPs each read the same below-cap global count and all insert, racing past the global daily cap — the hard cost ceiling fails. One global lock serializes the whole check-and-insert so the global cap actually holds.
**How to apply:** Hold the lock only for the fast count+insert (reservation), commit, then do the slow AI call OUTSIDE the lock. Reserve a usage row up front; delete it (best-effort) if the AI call fails so users aren't charged a slot for our errors.

## gpt-5-nano is a reasoning model — budget tokens accordingly
`max_completion_tokens` is shared between reasoning and visible output. Set it too low and the model can spend the whole budget on reasoning and return an EMPTY string.
**Why:** A concise FAQ assistant doesn't need a huge budget, but it still needs headroom above the reasoning spend. Use `reasoning_effort: "low"` + a moderate cap (~1500) to keep cost/latency down without truncating replies. Chat uses `chat.completions`, no `temperature` (unsupported), last ~8 messages of history.
