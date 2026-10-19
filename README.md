# sciti

Which cities? sciti lines up figures that Thai offices have already published, for all 77 provinces, and it leaves a blank where a number was never published. It is not a government index.

The question on the first page is the product. A lens is a weighting you can read and move. Growth, quiet retirement, and talent at the border are the three lenses that ship as the core. Families, logistics, remote work and tourism are marked proposed, and they do not publish an order until the figure that would justify one is in the file.

## What a number is

Every figure has a source link, a publisher and a date. The ingest reads public files, retries, and on failure keeps the last good copy and marks it stale. It does not invent a zero. Electricity by province, hospital beds by province, investment, prices, reputation, students, schools, border trade, special zones, visitors, tourism receipts and broadband are named and empty until a file arrives.

The map boundaries are [geoBoundaries](https://www.geoboundaries.org/) ADM1 for Thailand, built from OpenStreetMap, © OpenStreetMap contributors, under the ODbL.

## Add a figure

Put a `.csv` or `.json` in `data/incoming`. The columns are in [data/SCHEMA.md](data/SCHEMA.md). The next ingest picks the file up. A row without a source URL is rejected.

```bash
npm test
npm run build
npm run dev
```

`npm test` checks the weighting, the last-good fallback, and the incoming file rules. Nothing here calls a paid API.

## Languages

The public pages are English, Thai and Chinese. Thai is set in Prompt, English in Jost, Chinese in a subset of Noto Sans SC. The fonts are files in the site, not a request to a font host at view time.

## How this goes live

Pushing `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml). The job builds with `GITHUB_ACTIONS=true`, which sets the Vite base to `/sciti/`, and publishes the `dist` folder to the `gh-pages` branch with [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages). `force_orphan` is false, so that branch keeps history.

That publish is GitHub Pages, at `https://nonarkara.github.io/sciti/`.

`https://sciti.nonarkara.org` is a different origin. It is served by Cloudflare and it is not updated by this workflow. Merging to `main` changes the GitHub Pages site only. The custom domain changes when whoever runs DNS points that hostname at the new build. Do not add a `CNAME` file here unless that cutover is deliberate. A `CNAME` would also mean the site is served from the domain root, and the build would need `VITE_BASE=/` instead of `/sciti/`.

This repo does not create a Cloudflare Worker and it does not attach a card to anything. GitHub Actions on a public repository is the compute. There is no spend cap to set because there is no paid meter in this pipeline.

A weekly workflow, [.github/workflows/ingest.yml](.github/workflows/ingest.yml), refreshes the figures and commits them on `main`. That commit starts the deploy workflow. If you do not want a data refresh to republish the site, disable the ingest workflow.

### Rollback

The `gh-pages` branch keeps the previous publish. To roll back:

1. Revert the bad commit on `main` and push. The deploy workflow builds that older tree and publishes it again.
2. Or, on `gh-pages`, revert the publish commit and push `gh-pages`. The site returns to the previous files immediately. The next push to `main` will publish the current `main` again, so revert `main` too if the bad change is still there.

### What to check after a publish

On `https://nonarkara.github.io/sciti/`:

- The first screen asks which cities, in English, Thai and Chinese.
- The map loads, and a dashed province is one that is not scored.
- `/rankings`, `/discover`, `/story` and `/map` open the chooser. `/methodology` and `/sources` open Methods. `/bingo`, `/partners` and `/audit` open About, without the old award pages.
- `/city/phuket` opens Phuket.
- A missing path shows the site's own not-found page, via `404.html`, rather than a blank host error.
- Styles and scripts come from `/sciti/assets/`. A 404 on those means the base path is wrong.
- JSON and CSV downloads open.
- No award page, bingo page, or invented score remains.

Then look at `https://sciti.nonarkara.org` separately. Until its origin is this build, it will keep serving the previous site. Do not treat a green GitHub Pages deploy as a green custom domain.

## Colour

The light ground is pale lemon yellow `#ffefae` and the ink is dark Tyrian blue `#12354e`, from plate 060 of the palette, as a screen conversion of the printed inks.
