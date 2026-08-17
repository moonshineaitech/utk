---
name: utk.ai founder section (Ryan Siebert)
description: Verified facts and accuracy traps for the founder profile on the utk.ai landing site.
---

# Founder section — Ryan Siebert (Founder, GoldRock AI)

The `#founder` section on `home.tsx` profiles Ryan Siebert. Most credentials are
the owner's own stated claims on his own marketing site (fine to present as such).
Two things are NOT derivable from code and carry real accuracy traps:

## The Guardian claim — verified, but framing matters
- The Oct 28 2025 Guardian piece (Patrick Gelsinger / Christian AI / Gloo) **does**
  genuinely mention "Ryan Siebert, an AI product developer and hackathon attender"
  who got Gloo's unreleased pre-beta LLM to emit a meth recipe via **prompt
  injection**, then disclosed the vulnerability to Gloo's president. Verified by
  fetching the article — it really says this.
- **Trap:** the article does NOT co-bill Ryan with Pat Gelsinger. Gelsinger is the
  article's main subject; Ryan appears later in the same piece. Never write
  "alongside Pat Gelsinger" or imply they were named together for jailbreaking.
  Correct frame: "featured in The Guardian" with an outbound link + an *excerpted*
  (ellipsis-marked) quote. We omit the "meth recipe" specifics on the luxury site
  (the quote uses a bracketed "[restricted, dangerous output]" substitution).
- **Verified extra context (safe to use):** it really IS a big national feature.
  Verbatim title: "An ex-Intel CEO's mission to build a Christian AI." Gelsinger was
  *forced out* of Intel in Dec 2024. The piece genuinely cites **Peter Thiel** and
  **Andreessen Horowitz** (Katherine Boyle) as figures of the Silicon-Valley
  Christian-AI movement. So you MAY name-drop them to convey magnitude — but ONLY
  as "others featured in the same story," never as Ryan's peers/endorsers.
- **Don't overstate the model:** Gloo's was an *unreleased / pre-beta* LLM, NOT a
  "frontier model." Use "a pre-release / not-yet-released AI model." Avoid "frontier."

**Why:** the user originally described it as "jailbreaking alongside Pat Gelsinger";
that co-billing is false and would be a damaging false press attribution.

## No real headshot exists
- There is no photo of Ryan in the repo (only generic AI-founder video montages).
- Do **not** generate a fake AI likeness of a real named person. The section uses
  an ocean-gradient "RS" monogram badge over an **abstract crystal** `architect.png`
  hero (a drafting-compass-on-blueprint motif — not a face). If a real photo is
  wanted, ask the user to supply one to swap in.
- All founder imagery is purpose-generated **abstract crystal art, no people**:
  `src/assets/founder/architect.png`, `builds/{claudeofwar,better-siri,ruby,portfolio}.png`,
  and the `founder.mp4` film montage. Keep this constraint on any regeneration —
  no faces, no weapons (ClaudeOfWar is abstract strategy), on ocean palette.

## No fabricated metrics
- The stat band + copy may only reuse the **real** numbers: 55+ live products,
  1.2M+ hours/yr automated, this site shipped in <1 day, featured in The Guardian.
  Never invent new figures (revenue, client counts, percentages, ratings).
- **Why:** the whole section is a real person's real reputation; fabricated stats
  would be false advertising about an identifiable individual.

## City-name constraint still applies here
- Use "the University of Tennessee" / "UT" in founder credentials, never
  "Knoxville" (site-branding city rule). SCAR = Supply Chain Automation & Robotics
  Institute at UT.
