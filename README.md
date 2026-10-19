# sciti

Which cities? sciti lines up figures that Thai offices have already published, for all 77 provinces, and it leaves a blank where a number was never published. It is not a government index.

The question on the first page is the product. A lens is a weighting you can read and move. Growth, quiet retirement, and talent at the border publish an order from the cited file. Families, logistics, remote work and tourism stay marked proposed. They publish an order only from the figures that are actually in the file, and the page says what is still missing.

## What a number is

Every figure has a source link, a publisher and a date. The ingest reads public files, retries, and on failure keeps the last good copy and marks it stale. It does not invent a zero. The cited file in `data/incoming/sciti_incoming.csv` fills investment, border trade, students, doctors, visitors, receipts, electricity, gross provincial product for 2021–2023, and the Treasury land appraisal. Hospital beds, provincial crime, construction permits, average wages, graduates, market sale prices, gross provincial product for 2024, urban green space, transit use, broadband speed and governance quality stay empty. The appraisal is not a market price. A province is called undervalued for its fundamentals only when its lens mark sits at least 5 points above the appraisal's percentile.

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

A weekly workflow, [.github/workflows/ingest.yml](.github/workflows/ingest.yml), refreshes the figures and commits them on `main`. A push made with the default Actions token does not start another workflow, so that commit does not publish the site by itself. The new figures reach GitHub Pages on the next push to `main` that is not made by that token. The deploy workflow can also be run by hand. This repo does not add a separate token to make the refresh publish on its own. Disable the ingest workflow if you do not want it to commit.

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

### Custom domain, when you choose to cut over

Do not cut over as part of merging this branch. The two hosts are not the same site.

What is true today, checked on 19 Oct 2026:

- GitHub Pages for this repo is the `gh-pages` branch, from `/`, with no custom domain attached. The Pages API reports `cname: null` and `https://nonarkara.github.io/sciti/`. The HTML there loads `/sciti/assets/…`. `last-modified` on that index was 11 Jul 2026. Pushing `main` is what replaces it, and only after this pull request is merged.
- `https://sciti.nonarkara.org` answers with `server: cloudflare`. The DNS is on Cloudflare (`liz.ns.cloudflare.com`, `jaxson.ns.cloudflare.com`) and the address is Cloudflare's anycast range. The HTML cache header `public, max-age=0, must-revalidate` is the usual Cloudflare Pages pattern. The page loads `/static/index-….js`, Leaflet from `unpkg.com`, and fonts from `fonts.googleapis.com`. The bundle names pages (`AsusPage`, `GeminiChat`, `ScitiBingoPage`) that are not in this repository's history. There is no `wrangler.toml`, no `_headers`, and no `CNAME` here. This repo's deploy workflow cannot be what is serving that hostname.
- The edge sends this content security policy: `default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`. The live page needs `unpkg` and Google Fonts. This build does not. Jost, Prompt and the Noto Sans SC subset are files in the site.

A safe cutover, in this order:

1. Merge only when you mean to publish GitHub Pages. Confirm `https://nonarkara.github.io/sciti/` in English, Thai and Chinese, including `/city/phuket`, `/bingo`, a missing path, and that scripts load from `/sciti/assets/`.
2. Leave the custom domain where it is while you do that. Do not add a `CNAME` to this repo. A `CNAME` would attach the hostname to GitHub Pages, and the project site's base path is `/sciti/`, so the apex domain would request assets at the wrong path.
3. Build a root copy for the domain with the base path `/`. That is `npm run build` without `GITHUB_ACTIONS=true`. Open `dist/index.html` and confirm the script and the stylesheet are `/assets/…`, and that the file does not mention `fonts.googleapis.com` or `unpkg.com`.
4. On Cloudflare, deploy that `dist` as a preview first (the Pages project that already owns the hostname, or a new project if the current one is a manual upload). Open the preview URL, not the public hostname. Check the map, the three languages, `/city/phuket`, `/bingo`, and a missing path.
5. Keep the current content security policy in place for the promotion. This build only needs `'self'`, so the old policy does not block it. Tightening the policy before the promotion would break the site that is live now, because that site still loads `unpkg` and Google Fonts.
6. Promote the preview. Then confirm the public hostname no longer requests `unpkg` or `fonts.googleapis.com`. After that, the policy can drop those two hosts: `script-src 'self'; style-src 'self'; font-src 'self'`. `img-src` can stay `'self' data:` unless a later page needs an outside image.
7. Rollback is the previous Cloudflare deployment. In the Pages project, roll the production deployment back to the one that was live before the promotion. Do not delete that deployment. DNS does not have to move. If the hostname was pointed somewhere else instead, put the DNS record back. Rolling back GitHub Pages is a separate act, described above, and it does not restore this hostname.

## Colour

The light ground is pale lemon yellow `#ffefae` and the ink is dark Tyrian blue `#12354e`, from plate 060 of the palette, as a screen conversion of the printed inks.
