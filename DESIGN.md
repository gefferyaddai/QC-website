---
name: UC Quants
description: Quantitative Investment Society at the University of Calgary — an instrument-grade design system pairing chrome/metallic precision with warm signal-pink and violet accents.
colors:
  signal-magenta-50: "#fdf3f8"
  signal-magenta-100: "#f9dff0"
  signal-magenta-200: "#f2bade"
  signal-magenta-400: "#e07ab8"
  signal-magenta-600: "#c0509a"
  signal-magenta-900: "#5a1a44"
  quant-violet-50: "#f3f2ff"
  quant-violet-100: "#e4e0fc"
  quant-violet-200: "#c9c4f7"
  quant-violet-400: "#9b93ea"
  quant-violet-600: "#6c61cc"
  instrument-silver-100: "#eef0f3"
  instrument-silver-300: "#c3c9d1"
  instrument-silver-400: "#a3abb6"
  instrument-silver-600: "#6b7280"
  neutral-canvas: "#fdfaf8"
  neutral-white: "#ffffff"
  ink: "#1a1018"
  ink-mid: "#5c4d58"
  ink-faint: "#9e8ea0"
  border-hairline: "rgba(180, 140, 170, 0.18)"
typography:
  display:
    fontFamily: "'DM Serif Display', serif"
    fontSize: "clamp(2.6rem, 6vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  h1:
    fontFamily: "'DM Serif Display', serif"
    fontSize: "clamp(2.2rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  h2:
    fontFamily: "'DM Serif Display', serif"
    fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h3:
    fontFamily: "'DM Serif Display', serif"
    fontSize: "clamp(1.1rem, 2vw, 1.4rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.75
  label:
    fontFamily: "'DM Sans', sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.14em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "24px"
  pill: "999px"
  full: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
components:
  button-primary:
    backgroundColor: "linear-gradient(180deg, #cf62a8, #b8478f)"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "linear-gradient(180deg, #cf62a8, #b8478f)"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-secondary-hover:
    textColor: "{colors.signal-magenta-600}"
  instrument-card:
    backgroundColor: "{colors.neutral-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "40px 44px"
  input-field:
    backgroundColor: "{colors.neutral-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "11px 16px"
---

# Design System: UC Quants

## Overview

**Creative North Star: "The Quant Atelier"**

UC Quants presents as a precision instrument built by craftspeople, not a finance-bro pitch deck and not a hacker terminal. The system's technical register comes first: a chrome/metallic materials language (brushed-silver gradient borders, a wave-signal chart motif on the home page) reads as instrumentation — measured, engineered, exact. Signal Magenta and Quant Violet are the atelier's human layer laid over that precision: warm pastel washes, italic DM Serif Display flourishes on key words, and softly rounded pill controls keep the site from reading as cold or corporate. The two registers are meant to coexist in every surface, not alternate between pages.

Explicitly rejected: dark-mode neon-green terminal / crypto-native aesthetics. This is a light, paper-bright system — depth and technicality come from material and structure (chrome gradients, hairline grids, layered blur glows), never from a dark canvas.

**Key Characteristics:**
- Instrument-grade chrome borders (`--metallic-border` gradient) frame the system's signature cards
- Italic `DM Serif Display` accents single words inside otherwise-sans headings as an emphasis device
- Every interactive surface (buttons, cards, form controls) is pill or large-radius rounded — no sharp corners anywhere in the UI layer
- Colored, never-black shadows: every box-shadow in the system is tinted signal-magenta or a dark ink, never neutral gray/black
- A repeating hairline grid-line background, radially masked, marks every page's hero as an "instrument readout" surface

## Colors

The palette pairs one warm accent (Signal Magenta) with one cool accent (Quant Violet) over a metallic neutral scale (Instrument Silver), all sitting on a warm off-white canvas rather than pure white or dark.

### Primary
- **Signal Magenta** (`#c0509a`, `--pink-600`): the system's one true accent — primary buttons, links, active nav states, eyebrows/labels, price/stat emphasis. Ranges from `#fdf3f8` (wash backgrounds) to `#5a1a44` (pressed/active text, deepest emphasis).

### Secondary
- **Quant Violet** (`#6c61cc`, `--lav-600`): the cool counterpart to Signal Magenta — used in gradient pairings (hero blobs, wave-signal chart, glow accents) and wherever a second hue is needed to avoid a single-accent design reading as flat. Rarely carries text; mostly fills, glows, and gradient stops.

### Tertiary
- **Instrument Silver** (`#a3abb6` core, `--metallic-border` / `--silver-sheen` gradients): the chrome materials language — always a multi-stop gradient (`linear-gradient(135deg, #e8eaee, #b8bec8 40%, #f4f5f7 55%, #9aa1ad 80%, #dfe2e7)`), never a flat metallic hex. Used exclusively for card borders and decorative hairlines/dividers, never for large fills or text.

### Neutral
- **Neutral Canvas** (`#fdfaf8`, `--off-white`): the default page background — warm off-white, not pure white.
- **Neutral White** (`#ffffff`): card and control surfaces, sitting on top of Neutral Canvas.
- **Ink** (`#1a1018`, `--text-dark`): primary text. 18.6:1 on white — excellent contrast.
- **Ink Mid** (`#5c4d58`, `--text-mid`): secondary/body copy, 7.9:1 on white — safe for any text size.
- **Ink Faint** (`#9e8ea0`, `--text-light`): captions/notes only, and only at large size or alongside an icon — it measures ~3.1:1 on white/canvas, below the 4.5:1 AA minimum for normal text. Treat as a decorative-tier tone, not a body-text tone.
- **Border Hairline** (`rgba(180, 140, 170, 0.18)`): the default 1px card/divider border, always this translucent mauve, never solid gray.

### Named Rules
**The One Accent Rule.** Signal Magenta is the only color ever used as an interactive/emphasis text color. Quant Violet never carries clickable text — it fills, glows, and gradients only.

**The No-Flat-Metal Rule.** Instrument Silver never appears as a flat fill or solid border color. It is always the `--metallic-border` or `--silver-sheen` multi-stop gradient — a flat gray reads as disabled/inert, not instrument-grade.

## Typography

**Display Font:** `DM Serif Display` (serif)
**Body Font:** `DM Sans` (sans-serif)

**Character:** A serif/sans pairing used for contrast, not for a full editorial voice — DM Serif Display is reserved for large display moments and single-word italic emphasis inside sans headings; DM Sans (weight 300 for body) carries everything else, keeping long-form copy light and quiet next to the heavier serif display type.

### Hierarchy
- **Display** (400, `clamp(2.6rem, 6vw, 5rem)`, 1.05): hero-scale display text.
- **H1** (400, `clamp(2.2rem, 5vw, 4rem)`, 1.1): page title, one per route (`.page-header h1` / `.hero-title`).
- **H2** (400, `clamp(1.6rem, 3.2vw, 2.4rem)`, 1.2): section titles; the word carrying emphasis is wrapped in `<em>` and rendered italic in Signal Magenta or Quant Violet.
- **H3** (400, `clamp(1.1rem, 2vw, 1.4rem)`, 1.3): card/subsection titles.
- **Body** (300, 1rem, 1.75): DM Sans at light weight throughout; lede/intro paragraphs run slightly larger, body copy inside cards runs ~14px at the same 300 weight and ~1.7 line-height.
- **Label** (700, 0.6875rem, 1.3, letter-spacing 0.14em, uppercase): eyebrows, form field labels, badges — always uppercase, always Signal Magenta or Ink.

### Named Rules
**The Single-Word Italic Rule.** Emphasis inside a heading is expressed by italicizing exactly one word or short phrase in `DM Serif Display`, colored Signal Magenta (or Quant Violet for cooler contexts) — never by bolding, underlining, or changing the whole heading's weight.

## Layout

Single-column, generously padded sections (~70–90px vertical section padding, hero sections running `min-height: 92vh`). Content sits inside a max-width wrap (`.home-wrap` / `.wrap`) rather than running edge-to-edge. Grid layouts (role cards, stat rows, member/project card grids) collapse to a single stacked column under the site's primary breakpoint at `900px`, with secondary refinements down to `480px`. Spacing rhythm is tight and consistent in steps of roughly 8 / 16 / 24 / 40px between related elements, widening to 60–90px between major sections.

## Elevation & Depth

Depth is structural and always present, not purely a hover response: primary buttons and the home page's role cards carry a resting colored shadow that intensifies on hover/press, and this resting-shadow treatment is the system's target state for every elevated surface (some card types — event, project, member cards — currently go flat-at-rest and only gain a shadow on hover; bring these in line with the buttons/role-card resting-shadow pattern rather than treating flat-at-rest as the norm). Shadows are never neutral black — every shadow in the system is tinted Signal Magenta (`rgba(192, 80, 154, …)`) or deep Ink, reinforcing the "warm instrument" character over a generic Material-style neutral shadow.

### Shadow Vocabulary
- **Resting (buttons, role cards)** (`box-shadow: 0 4px 18px rgba(192, 80, 154, .32), inset 0 1px 0 rgba(255,255,255,.4), inset 0 -1px 0 rgba(90,26,68,.35)`): the default elevated state — a colored ambient glow plus a subtle inset highlight/shade pair that reads as a soft bevel.
- **Hover/lift** (`box-shadow: 0 10px 30px rgba(192, 80, 154, .4), …` or `0 20px 50px rgba(192, 80, 154, 0.12)` on white cards): a larger, softer version of the resting shadow, paired with a `translateY(-2px to -6px)` lift.
- **Ambient background glow** (`filter: blur(40–80px)` on decorative "blob" divs): large, low-opacity color fields behind hero/section content — not a box-shadow, but the same warm-tinted depth language applied to background atmosphere.

### Named Rules
**The Warm Shadow Rule.** No shadow in this system is ever neutral gray or black — every box-shadow carries the Signal Magenta or Ink tint, even at low opacity.

## Shapes

Two form languages coexist by role: **pill** (`border-radius: 999px`) for every button, badge, and pill-shaped control — signaling "interactive, take action" — and **large-radius rounded** (`border-radius: 24px`, occasionally 12–16px for smaller elements) for every card and container surface. Full circles (`50%`) are reserved for avatars, icon badges, and decorative "orb"/blob shapes. No sharp (0px) corners appear anywhere in the interface layer; hairline dividers and gradient rules are the only straight-edge elements.

### Named Rules
**The No-Sharp-Corners Rule.** Every interactive or container element uses `pill`, `lg` (24px), or `full` (50%) radius — never a sharp or barely-rounded (≤4px) corner, which is reserved for the rare micro-badge/tooltip case only.

## Components

Buttons, cards, and inputs read as instrument-grade and confident: dimensional gradient fills and metallic-bordered surfaces, not flat/minimal Material-style controls.

### Buttons
- **Shape:** pill (`border-radius: 999px`), `padding: 14px 28px`.
- **Primary (`.btn-fill`):** `linear-gradient(180deg, #cf62a8, #b8478f)` fill, white text, resting colored shadow with an inset highlight/shade bevel (see Elevation).
- **Hover / Focus:** `translateY(-2px)` lift with a larger version of the resting shadow; timing uses `--ease-out-smooth` (`cubic-bezier(0.22, 1, 0.36, 1)`).
- **Secondary / Ghost (`.btn-line`):** transparent background, `1.5px solid rgba(180,140,170,.4)` border, Ink text; on hover the border and text both shift to Signal Magenta — no fill added.

### Cards / Containers — Instrument Card (signature component)
The system's signature surface: a `linear-gradient(white, white) padding-box, var(--metallic-border) border-box` double-background trick that produces a chrome gradient border around a flat white card — used for project cards, member cards, and any "featured content" container. `border-radius: 24px`, `padding: 40px 44px` (or `28px 24px 24px` for tighter member cards). This is the clearest expression of "The Quant Atelier": a plain white surface framed in brushed metal.
- **Corner Style:** 24px.
- **Background:** white fill, metallic-gradient border (see Named Rules → No-Flat-Metal Rule).
- **Shadow Strategy:** should carry the resting shadow per Elevation & Depth; currently hover-only on most instances — bring to resting-state per the elevation invariant.
- **Border:** always the metallic gradient, 1px, never a flat color.

### Inputs / Fields
- **Style:** white background, `1.5px solid rgba(180,140,170,.35)` border, `border-radius: 12px`, `padding: 11px 16px`, label above in the Label type role.
- **Focus:** border color shifts to Signal Magenta 600. (Add a visible focus ring/box-shadow alongside the border shift — the current border-only change is a weaker cue than the browser default it replaces.)

### Navigation
Sticky, translucent (`backdrop-filter: blur(16px)`) bar over the Neutral Canvas tint; brand wordmark in italic Signal Magenta; nav links get a rounded pill hover/active background in Signal Magenta 100/600. Mobile collapses to a hamburger (`.nav-toggle`) that slides in a full-width pill-linked menu; the shrink-on-scroll state tightens vertical padding.

## Do's and Don'ts

### Do:
- **Do** pair Signal Magenta with Quant Violet in gradients/glows when a second hue is needed — never introduce a third accent hue.
- **Do** use the `--metallic-border` / `--silver-sheen` gradients for any "premium/featured" surface, per the No-Flat-Metal Rule.
- **Do** italicize a single word in `DM Serif Display` for heading emphasis, per the Single-Word Italic Rule.
- **Do** tint every shadow Signal Magenta or Ink — never neutral gray/black, per the Warm Shadow Rule.
- **Do** keep every interactive/container corner at pill, 24px, or 50% — per the No-Sharp-Corners Rule.

### Don't:
- **Don't** use `ink-faint` (`#9e8ea0`) for body-weight or small caption text — it measures ~3.1:1 on the canvas/white background, below WCAG AA. Reserve it for large or icon-paired text only, or use `ink-mid` instead.
- **Don't** introduce a dark-mode or neon/terminal palette — explicitly rejected as an anti-reference for this system.
- **Don't** leave a card's `metallic-border` inconsistent with its neighbors' curve values (`box-shadow`, radius) — Instrument Cards across pages (project, member) should share identical shape and border treatment.
