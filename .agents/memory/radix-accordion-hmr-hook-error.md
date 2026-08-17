---
name: Radix accordion HMR hook error
description: A scary "Invalid hook call / Cannot read useRef of null" at Radix CollectionProvider in the browser console is usually a transient Vite HMR artifact, not a real duplicate-React bug.
---

# Radix CollectionProvider "Invalid hook call" after heavy HMR

After a long edit session with many `[vite] hot updated` cycles followed by a full
reload, the browser console may show:

- `An error occurred in the <AccordionCollectionProvider> component`
- `Invalid hook call. Hooks can only be called inside of the body of a function component`
- unhandled `TypeError: Cannot read properties of null (reading 'useRef')` at
  `CollectionProvider` (Radix `@radix-ui/react-*` chunk)

**This is almost always a transient React-Refresh / HMR corruption**, where React
momentarily resolves to `null` mid-reload — NOT the "more than one copy of React"
cause the error message lists.

**Why:** React Fast Refresh can leave a stale module graph after dozens of hot
updates; the next hard reload briefly evaluates a Radix provider before React is
re-bound. A fresh page load has none of this state.

**How to apply — confirm it's transient instead of chasing a duplicate-React ghost:**
1. Check there is exactly one React: `ls node_modules/.pnpm | rg "^react@"` should
   show a single version, and `node -e "require.resolve('react',{paths:['artifacts/<slug>']})"`
   resolves to that one copy.
2. Restart the workflow and verify in a FRESH browser context (e.g. a `runTest`
   that loads `/` clean and exercises the accordion). If it works on fresh load,
   the console error was HMR noise — ship it.
Only if a fresh, non-HMR load reproduces the crash should you investigate real
duplicate-React / peer-dependency issues.
