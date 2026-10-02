<p align="center">
  <img src="docs/hero-banner.png" alt="SCITI — a civic studio around a map of Thailand. Scorecards and sticky notes in the drawing are illustration, not the app." width="100%">
</p>

# SCITI — Smart City Thailand Index

**ดัชนีเมืองอัจฉริยะไทย** · SCITI 2026

Editorial interface for an independent ranking of Thai cities and smart-zones. The in-app argument (`src/i18n.ts`) is: **rank what is operating, not what was announced.**

**Live:** [sciti.nonarkara.org](https://sciti.nonarkara.org) · **Pages:** [nonarkara.github.io/sciti](https://nonarkara.github.io/sciti/)

This repository is **not** an official government product and does not carry a government endorsement.

---

## What this is

A bilingual (English / Thai) static SPA: 37 city dossiers, seven equal-weight outcome pillars, rankings, a schematic map, pairwise compare, methodology, sources, and a smart-city bingo board. City data is compiled in (`src/data.ts`). There is no backend and no API key.

Figures below are **from this source**, not a government census.

| In this tree | Source |
|---|---|
| **37** scored city/zone dossiers | `CITIES` in `src/data.ts` |
| **118** self-declared smart-zones nationally; **81** did not meet the verifiable-data bar | Home copy in `src/i18n.ts` |
| **7** outcome pillars, equal weight | `PILLARS` and `METHODOLOGY_EN` in `src/data.ts` |
| Research notes (not a certification) | `public/Kimi_Agent_Smart City Site Audit/` |

The manga hero above is art direction for this public front door. Notebooks, radar charts, and sticky notes in the drawing are **illustration only** — they are not in-app HUD, and they are not this index's pillar set.

### Not SLIC-Index, not `smart-city-thailand-index`

Three public repos share a research lineage (outcomes over press releases, scores that can be inspected). They are **different products** with different geographies, pillar sets, and datasets. A rank here is not a [SLIC Index](https://github.com/Nonarkara/SLIC-Index) rank and is not a score from [`smart-city-thailand-index`](https://github.com/Nonarkara/smart-city-thailand-index).

| | [SLIC-Index](https://github.com/Nonarkara/SLIC-Index) | [smart-city-thailand-index](https://github.com/Nonarkara/smart-city-thailand-index) | This repo (`sciti`) |
|---|---|---|---|
| What the GitHub description says | Global city ranking (SLIC V3) | Thailand smart city index, built on SLIC methodology | Interface for measuring reality; sibling of SLIC methodology |
| Geography | International (100+ cities) | Thailand Smart City programme | Thailand — 37 scored dossiers in this tree |
| Pillars | 5 (Growth, Viability, Capability, Community, Creative) | 7, weighted composite | 7, **equal weight** (geometric mean of 4–7 indicators each) |
| Languages in-repo | English, Thai, Chinese | English, Thai, Chinese | English and Thai |
| Live | [slic.nonarkara.org](https://slic.nonarkara.org/) | [smart-city-thailand-index.vercel.app](https://smart-city-thailand-index.vercel.app) | [sciti.nonarkara.org](https://sciti.nonarkara.org) |

This tree is a standalone React SPA. It is not a fork of `smart-city-thailand-index` and does not publish SLIC V3 scores.

GitHub description for this repo: *Editorial Smart City Thailand interface (SCITI) — city narratives, not SLIC V3 scores. Sibling of smart-city-thailand-index.*

---

## Philosophy

From the methodology page (`METHODOLOGY_EN` in `src/data.ts`):

1. **Outcomes over plans.** If a project hasn't moved dirt or moved data, it doesn't count. Operating or under construction — not a press conference.
2. **Verified denominator.** Only cities with enough independently-verifiable data make the index. 118 self-declared; 37 scored; 81 out.
3. **Seven pillars, equal weight.** Livability, Economy, Safety, Wellbeing, Environment, Civic, Digital. Each pillar is the geometric mean of 4–7 indicators. Equal-weighted by design.
4. **Field verification.** Copy states every top-20 city was visited at least once in the past 18 months — operators, not only officials.
5. **Public + private + people.** Government data reconciled against private-sector telemetry and citizen reports, then footnoted.
6. **Open methodology.** Indicators, weights, and raw scores are meant to be public. Disagreements belong in GitHub issues. The index is described as annually updated.

The editorial line on the home page: *We rank what works. Not what was announced.*

---

## Ethical use

This is an independent editorial ranking. Use it as a critique you can inspect — not as a government list, a procurement stamp, or a paid placement.

- **No affiliation claimed.** About copy (`about_p2` in `src/i18n.ts`) states the project is not affiliated with depa, the Ministry of Interior (MOI), NESDC, or any city it ranks, and that cities and vendors cannot pay to be ranked.
- **Agencies in `SOURCES` are data sources**, not publishers, funders, or endorsers of this index (DEPA, NSO, PCD, NESDC appear alongside World Bank and OECD).
- **Do not treat a SCITI rank as a SLIC V3 rank**, or as a score from `smart-city-thailand-index`.
- **Do not treat the hero illustration as the model.** The drawing's scorecards are not the seven pillars above.
- **No secrets in this tree.** The SPA needs no environment variables. Do not commit `.env` files (see `.gitignore`). This README invents none.
- **CSV honesty.** The About page says raw indicator scores are released as CSV under CC BY 4.0. **This tree has no CSV export**; scores live in TypeScript (`src/data.ts`).
- **Contact strings in the footer** (`editors@sciti.in.th`, `@sciti_th`) are UI copy, not a verified inbox or account.

If you reuse numbers, attribute Smart City Thailand Index (SCITI) and this repository. If you disagree with a score or a method, open an issue.

---

## How it works

Client-only React 19 + TypeScript + Vite. Routing is in-memory (`src/App.tsx`); there is no server.

| Surface | What it does |
|---|---|
| Home | Editorial lede, 118 / 37 / 81 / 7 stats, pillar leaders, regional leaders, peer groups |
| Rankings | Sortable table or cards; filter by region; sort by composite or a pillar |
| City | Dossier: verdict, highlights, moves, seven-pillar bars |
| Map | Schematic Thailand pin map (coordinates in `src/pages/MapPage.tsx`) |
| Compare | Any two cities across all seven pillars |
| Methodology | The six rules above, plus pillar cards |
| Sources | Named sources with kind (Government / Multilateral / Local / Original) |
| Bingo | 5×5 smart-city expo bingo from `BINGO_EN` / `BINGO_TH` |
| About | Independence, annual cadence, open-data claim |

`main` deploys to GitHub Pages via `.github/workflows/deploy.yml` (Node 20, `GITHUB_ACTIONS` sets Vite `base` to `/sciti/`). Custom domain in the GitHub homepage field: [sciti.nonarkara.org](https://sciti.nonarkara.org).

---

## How to use

Requires **Node 20.19+ within 20.x, Node 22.13+ within 22.x, or Node 24+**, matching the locked Vite and ESLint requirements.
`.nvmrc` selects Node 22 for local development. GitHub Actions uses a current
release of the Node 20 line.

```bash
git clone https://github.com/Nonarkara/sciti.git
cd sciti
npm install
npm run dev
```

Open the Vite URL printed in the terminal (typically `http://localhost:5173`). Switch English / Thai in the top bar.

```bash
npm run lint
npm run build    # tsc -b && vite build
npm run preview
```

No environment variables are required. Do not add secrets to run the index.

---

## License

- **Source code** — [MIT](LICENSE). Copyright (c) 2026 Non Arkaraprasertkul.
- **Published scores** — the About page states CC BY 4.0 for raw indicator scores. If you reuse numbers from this repo, attribute Smart City Thailand Index (SCITI) and this repository.
- **Hero illustration** (`docs/hero-banner.png`) — bundled with this repository for the public README; HUD elements in the drawing are illustration only.
