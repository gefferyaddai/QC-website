# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences: (1) current and prospective University of Calgary students deciding whether to join the society and apply via the "Join Us" form, and (2) recruiters, employers, and sponsor/partner firms evaluating the club's credibility, output, and talent pool.

## Product Purpose

UC Quants (Quantitative Investment Society) is a multidisciplinary student society at the University of Calgary uniting programmers, financial analysts, and researchers to advance expertise in quantitative finance, programming, and financial innovation. The site recruits new members, showcases the society's work (research, projects, events), and demonstrates credibility to partners/recruiters. Success is measured by member applications and by the site reading as credible to external partners and recruiters.

## Positioning

Differentiated by industry partnerships and outcomes rather than generic finance-club programming: named partnerships (Wall Street Oasis, VANTEDGE), published research output, and placing members into quant/finance roles and opportunities. Also grounded in technical/quant rigor (Python, Black-Scholes, Monte Carlo, Black-Litterman, live backtesting) as the mechanism behind that credibility.

## Operating Context

Site is a static, client-side-routed multi-page app (single `index.html` shell with a JS router in `pages/app.js` swapping content into `#app-content`; URL never changes). No backend/CMS — content is hand-authored HTML/CSS/JS per page (`pages/home`, `pages/about`, `pages/events`, `pages/meet-the-team`, `pages/projects`, `pages/partner`). Recruitment funnels to an external Google Form ("Join Us"). Social/contact channels: Instagram, LinkedIn, email.

## Capabilities and Constraints

- Pages: Home, About, Events, Meet the Team, Projects, Partner.
- Existing research/project deliverables live as PDFs in `assets/projects/` (Black-Litterman, Black-Scholes, Monte Carlo Option Pricing) and are referenced as "3 research papers published."
- No framework/build step currently in use — plain HTML/CSS/JS with per-page stylesheets toggled by the router.
- Sponsor/partner assets and additional event/team content are largely unpopulated placeholders (`assets/sponsors`, `assets/events`, `assets/meet-the-team` notes files are empty) — do not fabricate sponsor logos, testimonials, or team bios not yet provided.

## Brand Commitments

- Name: "UC Quants" / "Quantitative Investment Society," University of Calgary.
- Existing partners to credit: Wall Street Oasis, VANTEDGE.
- Tagline/mission line: "To establish a leading student platform dedicated to advancing expertise in quantitative finance, programming, and financial innovation."

## Evidence on Hand

- Real stats (confirmed, must stay accurate, not placeholders): 40+ members, 3 research papers published, founded 2025.
- Real project/research PDFs in `assets/projects/`.
- Real logos: `assets/home/ucquants-logo.jpg`, `assets/home/wso-logo.png` (Wall Street Oasis).
- No testimonials, case studies, press, or additional sponsor/team assets on hand yet — future work must not invent these.

## Product Principles

- Credibility over hype: back every claim with a real stat, partner, or artifact already on hand; never invent proof.
- Serve two audiences without splitting the page in two: prospective members need "why join," recruiters/partners need "why credible" — both should read from the same evidence (partnerships, research, outcomes).
- Technical rigor is the brand: the quant/coding substance (models, backtesting, research) is the differentiator, not generic finance-club framing.
- Numbers are commitments: 40+ members / 3 papers / founded 2025 must be kept accurate as the club grows, not treated as fixed copy.

## Accessibility & Inclusion

No product-specific accessibility requirement established beyond standard web accessibility practice.
