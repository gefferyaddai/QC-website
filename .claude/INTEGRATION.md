# Integrating the home page revamp

## 1. Drop-in replacements

| From here                            | Goes to                    |
| ------------------------------------ | -------------------------- |
| `handoff/home.html`                  | `pages/home/home.html`     |
| `handoff/home.css`                   | `pages/home/home.css`      |
| `handoff/home.js`                    | `pages/home/home.js`       |
| `assets/wso-logo.png` (project root) | `assets/home/wso-logo.png` |

`home.js` keeps the existing `init(root)` / `destroy()` contract, so `pages/app.js`
and the `#css-home` stylesheet toggle need no changes. Class names your old file
depended on are preserved: `.fade-up` / `.visible`, `.role-card` / `.slide-in`,
`.count-num` with `data-target` + `data-suffix`, `.hero-stats`.

Nothing outside `pages/home/` is required — the page works as-is. Steps 2 and 3
carry the same premium treatment into the shell chrome.

## 2. `pages/navbar.css` — nav chrome (optional)

Three additions, no structural change to `index.html`:

```css
/* silver ring around the logo */
.brand img {
  border: 1px solid transparent;
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(
        135deg,
        #e8eaee,
        #b8bec8 40%,
        #f4f5f7 55%,
        #9aa1ad 80%,
        #dfe2e7
      )
      border-box;
  box-shadow: 0 2px 10px rgba(120, 110, 130, 0.18);
}

/* metallic hairline, revealed once scrolled (nav.js already adds .scrolled) */
.nav::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    #e07ab8,
    #c3c9d1 45%,
    #fff 50%,
    #c3c9d1 55%,
    #9b93ea
  );
  opacity: 0;
  transition: opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.nav.scrolled::before {
  opacity: 1;
}

/* tighter links so seven items never wrap */
.nav-links a {
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  padding: 8px 13px;
}
.nav-links .nav-join {
  padding: 8px 16px;
}
```

If your hamburger currently breaks at 900px, raise it to 1024px to match
`home.css` — otherwise the nav wraps between those widths.

## 3. `pages/footer.css` — light footer (optional)

The footer is dark today (`background: var(--text-dark)`). To carry the cream
ground all the way down:

```css
.footer {
  background: #fdfaf8;
  border-top: 1px solid rgba(180, 140, 170, 0.18);
}
.footer::before {
  /* the same metallic hairline */
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    #e07ab8,
    #c3c9d1 45%,
    #fff 50%,
    #c3c9d1 55%,
    #9b93ea
  );
  opacity: 0.9;
}
.footer-brand {
  color: #5c4d58;
}
.footer-brand span {
  color: #c0509a;
}
.footer-socials a {
  border-color: rgba(163, 171, 182, 0.32);
  color: #9e8ea0;
}
.footer-socials a:hover {
  background: #c0509a;
  border-color: #c0509a;
  color: #fff;
}
.footer-divider {
  background: linear-gradient(180deg, transparent, #a3abb6, transparent);
}
.footer-copy {
  color: #9e8ea0;
}
.footer-copy span {
  color: #5c4d58;
}
```

`.footer` needs `position: relative` for the `::before` rule (it may already
have it).

## Notes

- **three.js** loads on demand from `https://esm.sh/three@0.164.1` inside
  `chart3d()`. No build step. To vendor it, drop `three.module.js` beside
  `home.js` and change the `import()` specifier to a relative path. If the
  import fails, the hero renders without the graphic — nothing else breaks.
- **`.hero-visual` must keep an explicit height.** The WebGL canvas is
  `position: absolute; inset: 0`, so if the parent collapses the canvas
  renders at zero pixels.
- **The newsletter form is gone** — the Formspree handler went with it. The
  social-proof section replaced it. If you want the signup back, keep the old
  `#nlForm` markup and its submit handler.
- **Headline safety.** "Quantitative Investment Society" is real text in
  `home.html` and visible by default; the blur-up reveal is layered on by JS.
  It can never be missing, unlike the old typewriter version.
- **Placeholder numbers.** The proof section claims 3 research papers, 20+
  members, founded 2025. Swap those for real figures before shipping.
- **Nav/footer links.** The fragment's buttons use `data-route` attributes
  (`about`, `events`, `projects`) to match your router. Verify those route
  names against `pages/app.js`.
