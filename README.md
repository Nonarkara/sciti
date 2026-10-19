# sciti

Which cities? sciti lines up figures that Thai offices have already published, for all 77 provinces, and it leaves a blank where a number was never published. It is not a government index.

The question on the first page is the product. A lens is a weighting you can read and move. Growth, quiet retirement, and talent and border investment publish an order from the cited file. Talent, industry and ports, border trade, families, remote work and tourism stay marked proposed. They publish an order only from the figures that are actually in the file, and the page says what is still missing.

Quiet retirement, families, remote work and tourism also carry a legal line, not a crime rate. Provincial crime is still missing. Parts of Yala, Pattani and Narathiwat are under emergency-decree extension 86, in force 20 October 2569 through 19 January 2570, so those three are marked and moved down on those four lenses. Songkhla is not under that decree. Industry and ports does not use border trade. Border trade scores a province with no checkpoint as 0, on a log(1 + value) scale stretched up to the largest province, so a small checkpoint stays small.

## What a number is

Every figure has a source link, a publisher and a date. The ingest reads public files, retries, and on failure keeps the last good copy and marks it stale. It does not invent a zero. The cited file in `data/incoming/sciti_incoming.csv` fills investment, border trade, students, doctors, visitors, receipts, electricity, gross provincial product for 2021–2023, and the Treasury land appraisal. The emergency-decree line is filled by `ingest/sources/security.mjs` from extension 86, the Cabinet resolution of 6 October 2569, cited from the Thai PBS report, for all 77 provinces. A Royal Gazette notice for that extension was not found. Hospital beds, provincial crime, construction permits, average wages, graduates, market sale prices, gross provincial product for 2024, urban green space, transit use, broadband speed and governance quality stay empty. The appraisal is not a market price. A province is called undervalued for its fundamentals only when its lens mark sits at least 5 points above the appraisal's percentile.

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

### Custom domain

`https://sciti.nonarkara.org` is the Cloudflare Pages project `smart-city-thailand-index`. Today that project is built from [github.com/Nonarkara/smart-city-thailand-index](https://github.com/Nonarkara/smart-city-thailand-index): `public/CNAME` is `sciti.nonarkara.org`, and `scripts/cdpt.sh` deploys with wrangler to that project after its own tests. This repository does not deploy that hostname. Merging here publishes GitHub Pages only. Do not add a `CNAME` file here. A `CNAME` would also attach the hostname to GitHub Pages, and this project's Pages base path is `/sciti/`.

The live project is not only static. It has Pages Functions at `functions/api/cities.ts` and `functions/api/[[catchall]].ts`. Those functions read a generated city index and return the old composite scores. It also has a Supabase client and a visitor log. None of that is in this build.

`scripts/deploy-cf.sh` is the cutover script for a later day. It is not run by CI. It reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from the environment and does not contain a secret. It runs the tests, lint, and a root build (`GITHUB_ACTIONS` unset, so the base path is `/`), then:

```bash
npx wrangler pages deploy dist --project-name smart-city-thailand-index --branch preview-v2
```

It uploads `dist` only, so the preview has no Pages Functions. It then checks the preview URL: the new script is served as JavaScript, real app routes and a sample of the 135 live sitemap URLs end at HTTP 200, an unknown path is a 404, and `/api/cities` is a 404 that does not return `compositeScore`. It runs `tools/slop-lint.mjs` against the preview. It stops there. It does not deploy branch `main`, which is what would replace production.

`public/_redirects` is the map of the old site. It was written from the live sitemap (118 `/city/` pages, plus `/about`, `/rankings`, `/methodology`, `/story`, `/why`, `/showcase`, `/creative-economy`, `/partners`, `/map`, `/program`, `/knowledge`, `/discover`, `/invest`, `/compare`, `/references`, `/audit`) and from the routes that answer 200 because the old shell catches them (`/bingo`, `/asus`, `/canvas/:id`, `/kimi`, `/data/cities.json`, `/downloads/SCITI-2026-cities-dataset.csv`). Award and chat addresses go to About. Rankings, the story and the map go to the chooser. Methodology and references go to Methods. Each known city and canvas slug goes to its province, including the trailing-slash form. Plain rules are written first, under the 2,000 static cap. The only wildcards are last, under the 100 dynamic cap: `/place/* / 200` rewrites a province to the root index, and the same form covers methods and indicators. There is no status-404 rule. `/api/cities` is not a file and not a rule, so it falls through to `404.html`.

Promote only after the preview has been read in English, Thai and Chinese:

```bash
npx wrangler pages deploy dist --project-name smart-city-thailand-index --branch main --commit-dirty=true
```

The new deployment carries `public/_headers`. That policy is `'self'` plus `'unsafe-inline'` for the small path-restore script. It does not allow `unpkg` or Google Fonts. The deployment that is live now keeps the old policy until this one is promoted. Promoting does not change DNS. The hostname already points at the project.

Rollback is the previous Cloudflare deployment. In the project `smart-city-thailand-index`, open Deployments and roll production back to the deployment that was live before the promotion. Do not delete it. Rolling back GitHub Pages does not restore this hostname.

Caps, from Cloudflare's Pages limits (updated 5 Sep 2026) and Pages Functions pricing (updated 8 Sep 2026). This plan stays on static Pages:

- Static requests and bandwidth are not billed.
- Free plan: 500 builds a month, one at a time, 20 minutes each, 20,000 files, 25 MiB a file, 100 custom domains, 2,000 static redirects and 100 dynamic ones.
- Pages Functions are billed as Workers. The free Workers allowance is 100,000 requests a day. This upload does not include a Function, a Worker, KV, D1, Durable Objects, R2, or paid image resizing. Do not turn those on to keep the old city API.

### Proposed note for the other repository

Do not push this. It is the text for a later pull request on `Nonarkara/smart-city-thailand-index`, after the preview above has been promoted.

Title: The live site now ships from Nonarkara/sciti

```markdown
# This repository is no longer the live site

https://sciti.nonarkara.org is built from https://github.com/Nonarkara/sciti and deployed to the Cloudflare Pages project `smart-city-thailand-index`.

This repository is the previous site. It is not the place to change the public pages. The `cea-submission/` award pack, the bingo page, the city composite scores, the Gemini chat and the visitor log are not part of the new site.

`scripts/cdpt.sh` still knows how to deploy this tree to the same Pages project. Do not run it. A deploy from here would replace the new site with this one. Leave the last production deployment in the Cloudflare dashboard so it can be rolled back to.

The new site's old-address map lives in `sciti/public/_redirects`.
```

## Colour

The light ground is pale lemon yellow `#ffefae` and the ink is dark Tyrian blue `#12354e`, from plate 060 of the palette, as a screen conversion of the printed inks.
