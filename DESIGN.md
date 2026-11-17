---
name: UC Quants
description: Quantitative Investment Society at the University of Calgary — an institutional, type-led system taken from the LinkedIn banner. Warm cream canvas, black Times-style serif, pastel pink and lavender circles in every masthead, one deep-mauve accent, hairline rules, a 12-column grid.
colors:
  mauve-600: "#b0698c"
  mauve-700: "#8a3c62"
  neutral-canvas: "#f7f2ef"
  neutral-white: "#ffffff"
  ink: "#111111"
  ink-mid: "#4f4a47"
  ink-faint: "#6b6562"
  rule: "rgba(17, 17, 17, 0.14)"
typography:
  display:
    fontFamily: "'Times New Roman', Tinos, Times, serif"
    fontSize: "clamp(3.4rem, 10vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.95
  h1:
    fontFamily: "'Times New Roman', Tinos, Times, serif"
    fontSize: "clamp(2.2rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  h2:
    fontFamily: "'Times New Roman', Tinos, Times, serif"
    fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h3:
    fontFamily: "'Times New Roman', Tinos, Times, serif"
    fontSize: "clamp(1.1rem, 2vw, 1.4rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  entry-title:
    fontFamily: "'Times New Roman', Tinos, Times, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.2
  figure:
    fontFamily: "'Times New Roman', Tinos, Times, serif"
    fontSize: "2.4rem"
    fontWeight: 400
    lineHeight: 1
  wordmark:
    fontFamily: "'Times New Roman', Tinos, Times, serif"
    fontSize: "1.45rem"
    fontWeight: 400
  lede:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  body-small:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: ".9375rem"
    fontWeight: 400
    lineHeight: 1.7
  link:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: ".9rem"
    fontWeight: 600
  nav:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
  label:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.14em"
rounded:
  none: "0px"
  full: "50%"
spacing:
  s1: "8px"
  s2: "16px"
  s3: "24px"
  s4: "40px"
  s5: "64px"
  s6: "96px"
  s7: "144px"
components:
  link-arrow:
    backgroundColor: "transparent"
    textColor: "{colors.mauve-700}"
  input-field:
    backgroundColor: "{colors.neutral-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "13px 16px"
---

# Design System: UC Quants

## Overview

UC Quants presents the way an asset manager or research desk does: quiet, typographic, exact. Structure comes from a 12-column grid, whitespace and hairline rules. Decoration is confined to one place: every masthead repeats the LinkedIn banner, two soft overlapping pastel circles (pink into lavender) on the left with the black serif title to their right. Everywhere else there are no gradients, shadows or textures. The brand is carried by the palette (cream, black, the two pastels and their deep-mauve text tone) and by the Times-style serif (`--font-serif`) headings.

Explicitly rejected: dark-mode, neon or terminal aesthetics, and anything that reads as a pitch deck. The footer is the only dark surface.

All tokens live in `pages/theme.css`.

## Colors

- **Neutral Canvas** (`#f7f2ef`, `--off-white`): every page background.
- **Neutral White** (`#ffffff`, `--white`): the modal and form fields only.
- **Ink** (`#111111`, `--text-dark`): headings, primary text, strong rules, the footer ground.
- **Ink Mid** (`#4f4a47`, `--text-mid`): body copy. ~8:1 on cream.
- **Ink Faint** (`#6b6562`, `--text-light`): captions and secondary labels. ~5:1 on cream.
- **Pastel Pink** (`#f8d1de`, `--pastel-pink`) and **Pastel Lavender** (`#c9c6e5`, `--pastel-lav`): the banner circles only. Never text, never a fill outside the masthead. Intermediate gradient stops and the masthead ground tint are `color-mix()` blends of these two (and the canvas), never separate hex values.
- **Rule** (`rgba(17, 17, 17, .14)`, `--rule`): the one hairline. Ink at low alpha, never tinted.
- **Deep Mauve 700** (`#8a3c62`, `--pink-700`; the pastel pink deepened to 6.5:1): the accent for small text — links, link arrows, role and date labels, focus rings.
- **Mauve 600** (`#b0698c`, `--pink-600`): the accent for non-text marks only — the active-nav underline, the focused input border.

### Named Rules

**The One Accent Rule.** Mauve is the only text colour besides ink; the pastels are decoration. It marks things you can act on (links) and where you are (active nav), plus the small labels that classify an entry. It never fills a surface, never colours a heading or a figure, and no further hue is introduced.

**The Small-Text-Steps-Down Rule.** Mauve text below ~18px uses `--pink-700`; `--pink-600` falls under 4.5:1 at that size.

**The Neutral Rule Rule.** Lines are ink: `--rule` for quiet dividers (under the nav, under a masthead), solid `--text-dark` at 1px to open a content block. No tinted, gradient or metallic lines.

## Typography

Two faces only. the Times-style serif (`--font-serif`) for headings, figures and the wordmark; `DM Sans` for everything else. No third face.

- **Display**: the home hero title only.
- **H1**: one per inner page, the masthead statement.
- **H2**: section statements. **H3**: block titles inside a section.
- **Body** is DM Sans 400 in Ink Mid. Weight 300 is not loaded.
- **Label**: uppercase, tracked 0.14em, weight 600 — classification and captions.
- Headings are roman throughout. An `<em>` inside a heading gets no italic and no colour.
- Figures use `font-variant-numeric: tabular-nums`.

**The Statement Heading Rule.** A section is introduced by one declarative sentence at heading scale — never by a small eyebrow stacked above a title.

## Layout

- 12-column grid (`.swiss-grid`), 24px gutter, content capped at 1200px / 92% width.
- Vertical rhythm comes only from the spacing ladder `--s1`…`--s7`.
- Every masthead is the banner (`.masthead` in `theme.css`): pastel circles on the left, the title column starting ~40% in. Home adds the italic strapline "Investment | Research" (`.masthead-tagline`). Under 900px the circles slide right behind the title as a tint and the title takes the full width. No photographs in mastheads.
- Content blocks (roles, team members, projects, events, benefits) are opened by a 1px ink rule across the top. No cards: no border box, fill, radius or shadow.
- Primary breakpoint 900px; grids collapse to one column.

## Shapes, Elevation

All corners are 0px. The only circles are the logo mark. There are no shadows and no blurs anywhere; depth is not part of this system.

## Components

- **Join Us** (`.nav-join`): a plain nav link like the others, set at regular weight (400). The site has no buttons.
- **Link arrow** (`.link-arrow` and per-page equivalents): every other call to action. Mauve 700 text, weight 600, with the sliding `.arrow`. No button chrome.
- **Figures** (`.stat`, `.stat-num`, `.stat-label`): a serif numeral in ink over an uppercase label. Used on Home and Join. The numbers are commitments and must match `PRODUCT.md`.
- **Logo fields** (placements): every mark rendered greyscale at 75% opacity so no brand colour competes with the page. Partner marks on the Partner route keep their colour.
- **Navigation**: solid canvas bar, serif wordmark in ink, DM Sans links. Active route gets a 2px mauve underline. A `--rule` line appears under the bar once scrolled.
- **Footer**: ink ground, white type, white-alpha hairlines.
- **Inputs**: white, 1px ink-alpha border, 0 radius, label above in the Label role; mauve border and outline on focus.

## Do / Don't

- **Do** separate with whitespace first, a rule second.
- **Do** keep mauve to links, active state and small classification labels.
- **Don't** add gradients, shadows, blurs, rounded corners or background grids outside the masthead circles, or photographs outside the event rows.
- **Don't** set copy in a third typeface or colour a heading.
- **Don't** invent figures, partners or testimonials (see `PRODUCT.md`).
