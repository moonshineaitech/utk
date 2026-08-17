---
name: First-user admin bootstrap race
description: Why JIT "first user becomes admin" provisioning must be atomic, and how it's guarded.
---

# First-user admin bootstrap must be atomic

When provisioning users just-in-time and granting admin to "the first user" (zero existing admins), the read-then-insert is a TOCTOU race: two near-simultaneous first signups can both observe 0 admins and both become admin (privilege escalation).

**Why:** Plain `select count(*) where role='admin'` followed by an `insert` is not isolated; concurrent requests interleave.

**How to apply:** Run the zero-admin check + insert inside one DB transaction guarded by a Postgres advisory lock (`select pg_advisory_xact_lock(<const>)`) so only one request performs the bootstrap at a time. The `ADMIN_EMAILS` allowlist path doesn't need the lock (deterministic). Alternative: drop first-user-admin entirely and rely on the allowlist. Lives in `artifacts/api-server/src/lib/auth.ts`.

## Sibling race: removing the last admin

The mirror-image hazard is *demotion*: two concurrent "change role away from admin" requests can both read "2 admins remain" and both succeed, leaving zero admins (lockout). The last-admin guard (count + update in the role-PATCH route) must run in a transaction under the **same** advisory-lock constant as the bootstrap, so bootstrap and all demotions serialize against each other and the "more than one admin" invariant holds. Don't pick a different lock key for the two paths — they protect the same admin-count invariant and must mutually exclude.
