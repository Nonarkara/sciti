# SCITI — Smart City Thailand Index

Editorial interface for an independent ranking of Thai cities and smart-zones. The in-app argument (`src/i18n.ts`) is: **rank what is operating, not what was announced.**

**Live:** [https://nonarkara.github.io/sciti/](https://nonarkara.github.io/sciti/) (GitHub Pages)

This repository is **not** an official government product and does not carry a government endorsement. The About copy states the project is not affiliated with depa, the Ministry of Interior (MOI), NESDC, or any city it ranks, and that cities and vendors cannot pay for placement.

## Not SLIC-Index, not `smart-city-thailand-index`

Three public repos share a research lineage (outcomes over press releases, scores that can be inspected). They are **different products** with different geographies, pillar sets, and datasets. A rank here is not a [SLIC Index](https://github.com/Nonarkara/SLIC-Index) rank and is not a score from [`smart-city-thailand-index`](https://github.com/Nonarkara/smart-city-thailand-index).

| | [SLIC-Index](https://github.com/Nonarkara/SLIC-Index) | [smart-city-thailand-index](https://github.com/Nonarkara/smart-city-thailand-index) | This repo (`sciti`) |
|---|---|---|---|
| What the GitHub description says | Global city ranking (SLIC V3) | Thailand smart city index, built on SLIC methodology | Interface for measuring reality; sibling of SLIC methodology |
| Geography | International (100+ cities) | Thailand Smart City programme | Thailand — 37 scored dossiers in this tree |
| Pillars | 5 (Growth, Viability, Capability, Community, Creative) | 7, weighted composite | 7, **equal weight** (geometric mean of 4–7 indicators each) |
| Languages in-repo | English, Thai, Chinese | English, Thai, Chinese | English and Thai |
| Live | [slic.nonarkara.org](https://slic.nonarkara.org/) | [smart-city-thailand-index.vercel.app](https://smart-city-thailand-index.vercel.app) | [nonarkara.github.io/sciti](https://nonarkara.github.io/sciti/) |

This tree is a standalone React SPA. It is not a fork of `smart-city-thailand-index` and does not publish SLIC V3 scores.

## What this app contains

Figures below are **from this source**, not a government census.

- **37** city/zone dossiers in `src/data.ts` (`CITIES`)
- Home-page copy (`src/i18n.ts`) describes **118** self-declared smart-zones nationally, of which **37** meet the verifiable-data bar and **81** do not
- Seven outcome pillars, equal-weighted: Livability, Economy, Safety, Wellbeing, Environment, Civic, Digital (`PILLARS` and `METHODOLOGY_EN` in `src/data.ts`)
- Methodology and source lists are in-app pages
- Bilingual UI (English / Thai)
- Static SPA: React 19, TypeScript, Vite. City data is compiled in; there is no backend or API key
- Deployed from `main` to GitHub Pages (`.github/workflows/deploy.yml`)

The About page says raw indicator scores are released as CSV under CC BY 4.0. **This tree has no CSV export**; scores live in TypeScript (`src/data.ts`).

`public/Kimi_Agent_Smart City Site Audit/` holds research and audit notes. Those files are not a government certification.

## Independence

From `about_p2` in `src/i18n.ts`:

> We are not affiliated with depa, MOI, NESDC, or any city we rank. We accept no payment from cities or vendors to be ranked. Methodology is open. Disagreements are welcomed.

Thai government agencies appear in `SOURCES` as **data sources** (alongside World Bank and OECD), not as publishers, funders, or endorsers of this index.

## How to run

Requires Node.js 20+ (GitHub Actions uses Node 20).

```bash
git clone https://github.com/Nonarkara/sciti.git
cd sciti
npm install
npm run dev
```

Open the Vite URL printed in the terminal (typically `http://localhost:5173`).

```bash
npm run lint
npm run build    # tsc -b && vite build
```

No environment variables are required. Do not commit `.env` files (see `.gitignore`).

## License

- **Source code** — [MIT](LICENSE). Copyright (c) 2026 Non Arkaraprasertkul.
- **Published scores** — the About page states CC BY 4.0 for raw indicator scores. If you reuse numbers from this repo, attribute Smart City Thailand Index (SCITI) and this repository.

Methodology disagreements: open a GitHub issue. The footer displays `editors@sciti.in.th`; that is UI copy, not a verified inbox.
