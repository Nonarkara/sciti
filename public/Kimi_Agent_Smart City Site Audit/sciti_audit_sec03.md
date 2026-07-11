## 3. Critical Bugs: Priority Fixes

Chapters 1 and 2 documented SCITI's considerable strengths — a polished frontend, sophisticated interactive features, and a transparency-first design philosophy. This chapter turns to what breaks. Eight distinct bugs were identified through systematic testing, ranging from routing failures that block access to entire pages, to a language mislabel that undermines credibility with Thai government stakeholders, to placeholder documents that damage trust in the platform's evidentiary claims. Each bug is presented with the exact URL tested, the HTTP response received, the severity classification, and a specific recommended fix. The master Bug Priority Matrix at the end of this chapter consolidates all eight findings into an action-ready format for the development team.

The severity framework used here has three tiers. **Show-stoppers** (Section 3.1) are bugs that must be resolved before the site is submitted for any government award, international index listing, or media promotion. They block functionality, return 404 errors on common URLs, or misrepresent the product's cultural identity. **High-priority** bugs (Section 3.2) degrade trust and accessibility but do not block core navigation. **Medium-priority** bugs (Section 3.3) are UX gaps and technical debt that should be addressed in the next development sprint.

---

### 3.1 Show-Stoppers (Fix Before Award Submission)

Three bugs fall into the show-stopper category. Each has a direct, demonstrable impact on a user's ability to access content or trust the platform. Together they represent the minimum viable repair set.

#### 3.1.1 SPA Routing: `/rankings` Returns 404; Only `/rankings/` Works

**Test Result:** `GET https://sciti.dopa.go.th/rankings` → HTTP 404 Not Found. `GET https://sciti.dopa.go.th/rankings/` → HTTP 200 OK [^2^].

This is the most technically straightforward of the show-stoppers and also the most damaging to discoverability. A user who types `sciti.dopa.go.th/rankings` into a browser address bar — the natural form, without a trailing slash — receives a blank 404 page. The same user who clicks an internal navigation link within the SPA arrives at `/rankings/` (with trailing slash) and sees the fully functional Rankings page with lens filtering, editor's picks, and spider charts. The inconsistency between these two paths is invisible to users who navigate internally but fatal to anyone arriving from an external link, a bookmark, or manual entry.

**Root Cause:** SCITI is a React Router-based single-page application hosted on GitHub Pages. GitHub Pages is a static file server: it looks for a physical `/rankings/index.html` file when `/rankings/` is requested, and finds it. When `/rankings` is requested (no trailing slash), GitHub Pages looks for a physical file named `rankings` at the repository root — which does not exist — and returns 404 [^2^]. React Router never gets a chance to handle the route because the server intercepts the request before the SPA JavaScript bundle loads.

**Why this matters pre-submission:** Award reviewers, journalists, and government evaluators frequently test sites by typing URLs directly. A 404 on `/rankings` suggests the site is unfinished. The Rankings page is the intellectual core of the product — the page that delivers the index's primary value proposition. If it is unreachable by the most natural URL form, the platform fails its core function for a meaningful segment of visitors.

**Recommended Fix:** The standard solution for SPAs on GitHub Pages is the "404 redirect trick." Create a `404.html` file at the repository root that duplicates `index.html` in structure but contains a small script to capture the requested path, store it in `sessionStorage`, redirect to `/#/path`, and have the SPA router read the stored path on mount and navigate accordingly. This is a well-documented pattern for React SPAs on GitHub Pages and requires no server configuration changes. Alternatively, migrating hosting to Netlify or Vercel — which natively support SPA routing through `_redirects` or `vercel.json` configuration — eliminates the problem entirely and adds additional benefits (edge functions, preview deployments, better caching control). Either approach resolves the issue within one development day.

---

#### 3.1.2 City Slug Mismatch: `/city/phuket` 404s; Actual Slug Is `/city/phuket-smart-city`

**Test Result:** `GET https://sciti.dopa.go.th/city/phuket` → HTTP 404 Not Found. `GET https://sciti.dopa.go.th/city/phuket/` → HTTP 404 Not Found [^2^].

Phuket is Thailand's most internationally recognized city brand and the #1 ranked city in the SCITI index with a composite score of 72.6. It appears on the homepage as "Phuket Smart City" in the Seven Pillars Champions section (Livability champion, score 76) and as the #1 card in the Top Five section [^2^]. A user who sees "Phuket" on the homepage and reasonably types `/city/phuket` into the address bar receives a 404 page with a "City not found" message and a feedback form. The actual dossier URL is `/city/phuket-smart-city` — a slug that is neither visible on the homepage nor guessable from the display name.

**Root Cause:** The city slug generation logic appends "-smart-city" to certain city names but not others. The Phra Ram 4 dossier is accessible at `/city/phra-ram-4` (no suffix), suggesting the suffix rule is inconsistent or manually applied. The homepage display name "Phuket Smart City" contains the suffix, but users do not internalize URL construction rules from display text — they type the shortest recognizable form.

**Why this matters pre-submission:** Phuket is the platform's headline city. It is the first city mentioned in the Top Five, the Livability champion, and the archetype for "The Heavyweight" on the Story page [^2^]. A 404 on `/city/phuket` is not an edge case — it is the most likely city dossier URL that a first-time visitor would attempt to access. The "City not found" page, while offering a feedback form routing to `non.ar@depa.or.th`, is a dead-end experience that converts curiosity into frustration.

**Recommended Fix:** Implement slug aliases. The router should accept `/city/phuket` and redirect (HTTP 301) to `/city/phuket-smart-city`. This can be achieved by maintaining a mapping table of common name variants to canonical slugs, or by adding a redirect rule in the routing configuration. At minimum, the 10 most prominent cities (the Top Five plus the Seven Pillars Champions, with overlap removed) should have alias entries. A more robust approach is to generate slugs deterministically from city names using a consistent normalization function (lowercase, hyphenate spaces, remove special characters) and apply it uniformly across the dataset — eliminating the "-smart-city" suffix rule entirely if it cannot be applied consistently.

---

#### 3.1.3 Language Button Labeled "TH" Shows Chinese — Credibility-Damaging for Thai Government Site

**Test Result:** Clicked top-right language button labeled "TH" (element index 5 in the navigation bar). Page content switched to Simplified Chinese: navigation labels became 首页, 排名, 方法, 故事, 网络; the Phra Ram 4 dossier title became 四世皇路智慧城市; dossier tabs became 概览, 分析, 执行, 证据, 下一步 [^2^].

This is the most credibility-damaging bug in the entire application. The "TH" button uses the ISO 3166-1 alpha-2 country code for Thailand. A Thai government official, municipal officer, or citizen clicking a button labeled "TH" expects Thai-language content (ภาษาไทย). Instead, they receive Simplified Chinese — a language associated with a different country entirely. The Chinese translation itself is complete and high-quality, but the button label fundamentally misrepresents what it delivers.

**Root Cause:** The language configuration maps the "TH" locale code to Chinese content, or the button label was copy-pasted from a different locale setting and never corrected. The Simplified Chinese translation (evidenced by characters like 智, 能, 城, 市) is labeled as "TH" in the UI. This is almost certainly a copy-paste error during internationalization setup — the developer implemented Chinese (zh-CN) content but assigned it the wrong locale label.

**Why this matters pre-submission:** SCITI is positioned as a Thai government-backed smart city index. Its domain (`dopa.go.th`) is a Thai government domain. Its primary audience includes Thai municipal officers who may not read English fluently. A "TH" button that delivers Chinese is not merely a bug — it is a political liability. A Thai government platform that cannot correctly label its own national language undermines the very credibility the index is designed to establish. The phonetic guide on the homepage itself references Thai script ("Samastiti ≈ สมาร์ทซิตี้"), confirming that Thai integration is part of the project's conceptual framework [^2^].

**Recommended Fix:** This is a one-line change in the i18n configuration. The locale label "TH" must be remapped to Thai-language content. If Thai translations are not yet available, the button label should be changed to "CN" or "中文" immediately — restoring truth-in-labeling — and Thai content should be prioritized in the next localization sprint. The current Chinese content can remain; it simply needs the correct label. Do not let the perfect (full Thai translation) be the enemy of the urgent (a button that tells the truth).

---

### 3.2 High Priority

Three bugs fall into the high-priority category. They do not block navigation but erode trust in the platform's evidentiary claims and accessibility commitments.

#### 3.2.1 PDF Downloads Are ~5 KB Placeholders

**Test Result:** `GET https://sciti.dopa.go.th/downloads/SCITI-2026-Executive-Summary.pdf` → 4,997 bytes (4.88 KB). Same approximate size for Methodology Paper, Full Report, and Performance Audit PDFs [^2^].

The open-data section on the homepage offers four PDF download buttons under a CC BY 4.0 license: Executive Summary, Methodology Paper, Full Report, and Performance Audit [^2^]. These documents are the evidentiary backbone of the platform's transparency claims. A genuine executive summary for a 118-city smart city index would be 20–50 pages and several megabytes. A methodology paper with evidence-source documentation, composite formula derivation, and version history would exceed 1 MB. The downloaded files are 4.88 KB — smaller than the site's favicon. They are placeholders, not documents.

**Root Cause:** The PDF files are likely empty or minimally-generated PDF shells created as build artifacts. They have the correct filenames and MIME types (`application/pdf`) but contain no substantive content — possibly just a title page or a blank page with margins.

**Impact:** This is a credibility trap. Users who click "Download Methodology Paper" and receive a 5 KB file will conclude the methodology does not exist — undermining every claim about evidence-based scoring and transparency. The CC BY 4.0 license slogan "Take the data. Audit the method. Build on it." becomes ironic when the method is not actually available for audit. For award submissions, peer review, and academic citation, downloadable methodology documentation is essential.

**Recommended Fix:** Generate the actual documents. The methodology page already contains rich content — version history, composite formula, evidence sources, tech stack disclosure [^3^]. Exporting this to PDF is a matter of rendering the page to print media via browser print-to-PDF or a headless Chromium pipeline. The Full Report can be compiled from city dossier data with a template. Until real documents are ready, replace the download buttons with "Coming Soon" labels or remove them entirely. Offering broken downloads is worse than offering none.

---

#### 3.2.2 Thai Language Translation Potentially Missing — 67 Million Thai Speakers Cannot Use Site

**Test Result:** No Thai-language content (ภาษาไทย) was found anywhere in the application during testing. The "TH" button delivers Simplified Chinese. No alternative Thai toggle exists [^2^].

Thailand has a population of approximately 71 million, of whom roughly 67 million are Thai speakers. English proficiency is concentrated in urban professional populations; municipal officers in secondary cities, provincial governors, and community stakeholders frequently operate exclusively in Thai. A Thai government digital product that offers only English and Chinese — with the Chinese mislabeled as Thai — fails its primary domestic audience.

**Root Cause:** Thai localization may be planned but not yet implemented, or the translation files may exist but be incorrectly mapped (as suggested by the "TH" → Chinese mislabel in Section 3.1.3). The phonetic guide on the homepage ("Samastiti ≈ สมาร์ทซิตี้") demonstrates that the project team is comfortable with Thai script and that Thai integration is conceptually intended [^2^].

**Impact:** Domestic adoption is the pathway to institutional legitimacy. If Thai municipal officers cannot read the site in their own language, SCITI remains a foreign-facing showcase rather than a domestic tool. For a platform whose mission is to "close the gap between announcements and outcomes" in Thai cities, the absence of Thai content is a foundational gap.

**Recommended Fix:** Commission Thai translation of all UI strings, navigation labels, and city dossier narratives. Prioritize the homepage, navigation, and Top Five city dossiers. If budget is constrained, machine translation (Google Translate API or DeepL Thai) with professional post-editing can produce usable results faster than full manual translation. The i18n framework is already in place (evidenced by the working English-Chinese toggle); adding Thai is a matter of adding a `th` locale file, not architectural work.

---

#### 3.2.3 Cloudflare Beacon Contradicts "No Trackers" Claim

**Test Result:** `curl` analysis of the HTML response reveals `cloudflareinsights.com` beacon script embedded in the page. The `CF-Cache-Status: DYNAMIC` header confirms active Cloudflare processing [^1^]. The footer carries a PDPA B.E. 2562 badge with the text "No personal data collected. No cookies. No trackers" [^1^].

These two facts are directly contradictory. Cloudflare Analytics (the `cloudflareinsights.com` beacon) collects visitor IP addresses, user agent strings, request timestamps, and browsing patterns — all classified as personal data under Thailand's Personal Data Protection Act B.E. 2562 (2019) [^5^]. The claim "No trackers" is false as a matter of technical fact.

**Root Cause:** The Cloudflare beacon is likely enabled by default in the Cloudflare dashboard — a common configuration for sites using Cloudflare's free tier. The "No trackers" claim in the footer appears to have been written without awareness that the beacon is active.

**Impact:** This is a legal and credibility risk, not merely a technical inconsistency. PDPA compliance requires explicit consent for personal data collection, a clear privacy notice, and potentially a data processing agreement with Cloudflare Inc. [^5^]. If a regulatory audit or investigative journalist tests the claim and discovers the beacon, the resulting coverage will focus on the discrepancy rather than the product's merits. For a platform whose brand is built on transparency, a falsified privacy claim is especially damaging.

**Recommended Fix:** Two viable paths exist. **Path A (recommended):** Remove the Cloudflare beacon from the Cloudflare dashboard (Analytics → Client-side analytics → Disable) and rely on server-side logs, which can be anonymized at the origin. This restores truth to the "No trackers" claim with zero code changes. **Path B:** If analytics are operationally necessary, replace the "No trackers" badge with a full privacy notice that discloses Cloudflare's role as a data processor, describes what data is collected, and provides a consent mechanism. Path B requires legal review and administrative effort but maintains analytics capability.

---

### 3.3 Medium Priority

Three bugs fall into the medium-priority category. They are UX gaps and technical debt that should be addressed in the next development sprint but do not block core functionality or credibility.

#### 3.3.1 No Search Functionality Across 118 Cities

SCITI indexes 118 cities across 77 provinces but provides no search interface [^2^]. Users must browse the Rankings page (which lists all cities) or use the "Your City" matcher to find cities by pillar preference. There is no text search by city name, province, or keyword. For a user looking for "Nakhon Ratchasima" or "Korat" (the city's common name), the only path is manual scrolling through a ranked list. This is a basic UX gap that becomes more painful as the dataset grows. A client-side search box indexing city names, provinces, and common aliases would resolve this with minimal implementation effort — the data is already loaded in the JavaScript bundle, so no backend search infrastructure is needed.

---

#### 3.3.2 Mobile Responsiveness Untested

The SCITI layouts adapt to viewport width (evidenced by responsive grid patterns on the Rankings and Compare pages), but no dedicated mobile testing was performed during this audit [^2^]. Thailand has one of the highest mobile internet usage rates in Southeast Asia — the majority of domestic traffic to a government site will come from smartphones. The interactive features (pillar matcher A→B→C cycling, comparison basket with add/remove pills, lens-based filtering) are complex touch interactions that may have usability issues on small screens. The spider charts, while rendering correctly on desktop, may be unreadable at mobile viewport widths. A dedicated mobile audit should be performed using Chrome DevTools device emulation and physical devices (iPhone, Android) before the site is promoted to general audiences.

---

#### 3.3.3 No Schema.org Structured Data for Google Dataset Search Discovery

SCITI contains no Schema.org JSON-LD structured data in its HTML [^1^]. This omission means Google cannot understand that the site is a structured dataset of city assessments, cannot generate rich snippets for city dossiers, and cannot include SCITI in Google Dataset Search — a specialized search engine for discoverable datasets. For an open-data platform whose competitive advantage is transparency, the inability to be discovered through structured data search is a missed opportunity.

Three schemas would deliver immediate value. A `WebSite` schema with `SearchAction` would enable a site search box in Google results. An `Organization` schema would properly identify DEPA as the publisher. A `Dataset` schema on the open-data section would register SCITI with Google Dataset Search, making the 118-city index discoverable to researchers worldwide [^6^]. Implementation requires adding `<script type="application/ld+json">` blocks to the HTML `<head>` — a task estimated at two to four hours for a developer familiar with JSON-LD syntax.

---

### 3.4 Bug Priority Matrix

The following table consolidates all eight bugs into a single action-ready matrix. Severity is classified as Show-stopper (S), High (H), or Medium (M). Impact describes the user or institutional consequence. Fix complexity estimates the development effort. Recommended action specifies the concrete next step.

| Bug | Severity | Impact | Fix Complexity | Recommended Action |
|-----|----------|--------|----------------|--------------------|
| SPA routing: `/rankings` 404; only `/rankings/` works [^2^] | S | External links, bookmarks, direct URL entry fail for all SPA routes | Low (1 day) | Add 404.html redirect trick for GitHub Pages SPA, or migrate to Netlify/Vercel |
| City slug mismatch: `/city/phuket` 404s [^2^] | S | Most prominent city dossier unreachable by intuitive URL | Low (½ day) | Implement slug aliases: `/city/phuket` → 301 → `/city/phuket-smart-city`; apply to Top 10 cities |
| "TH" button renders Chinese (四世皇路智慧城市) [^2^] | S | Credibility collapse with Thai government stakeholders; political liability | Trivial (1 hour) | Remap "TH" locale to Thai content; if unavailable, relabel button to "CN"/"中文" immediately |
| PDF downloads are ~5 KB placeholders [^2^] | H | Transparency claims undermined; methodology unauditable | Medium (3–5 days) | Generate real PDFs from existing page content, or replace buttons with "Coming Soon" labels |
| Thai language content missing (67M speakers) [^2^] | H | Domestic audience cannot use the site; government site without Thai | Medium (1–2 weeks) | Commission Thai translation; prioritize UI strings and Top 5 dossiers; use MT+post-edit if budget-constrained |
| Cloudflare beacon contradicts "no trackers" claim [^1^] | H | PDPA compliance risk; credibility damage if exposed; legal liability | Low (1 hour) | Disable Cloudflare client-side analytics in dashboard, or add full privacy notice + consent mechanism |
| No search across 118 cities [^2^] | M | Users must manually browse; worsens with dataset growth | Low (1–2 days) | Add client-side search box indexing city names, provinces, and aliases; no backend needed |
| Mobile responsiveness untested [^2^] | M | Majority of Thai traffic is mobile; complex interactions untested on touch | Low (2–3 days) | Run Chrome DevTools mobile emulation + physical device tests; fix touch-target sizes and chart readability |
| No Schema.org structured data [^1^] | M | Invisible to Google Dataset Search; no rich snippets; missed research discovery | Low (½ day) | Add JSON-LD blocks for WebSite, Organization, and Dataset schemas; register with Google Dataset Search |

**Table 4: Bug Priority Matrix.** Eight bugs organized by severity, impact, effort, and concrete action. Show-stoppers must be resolved before any public promotion; high-priority items before institutional adoption; medium-priority items in the next sprint. Sources: manual page testing [^2^], curl header analysis [^1^].

**Interpretation:** Three of the eight bugs are show-stoppers that can each be resolved within one development day. The SPA routing fix (404.html redirect) and the "TH" button relabel are both low-effort, high-impact changes. The slug alias implementation requires a mapping table but no architectural work. Collectively, the three show-stoppers represent approximately two days of focused development — a small investment to remove the most visible failures before award submission or media coverage.

The high-priority bugs require more substantive effort. Thai translation is the largest single item at one to two weeks, but it unlocks domestic adoption by 67 million speakers. PDF generation is a content-production task rather than a development task — the engineering work (rendering pages to PDF) is straightforward, but the content must be written and reviewed. The Cloudflare beacon fix is a dashboard toggle that takes minutes.

The medium-priority items — search, mobile testing, and structured data — are all low-effort enhancements that would measurably improve usability and discoverability. A client-side search box is particularly valuable because the data is already in the bundle; implementation requires only a fuzzy-match library ( Fuse.js or similar) and a UI component. Schema.org markup is a one-time addition that pays ongoing dividends in search visibility.

The total repair effort for all eight bugs is estimated at three to four weeks of one developer's time, with Thai translation being the only multi-week item. Addressing just the show-stoppers and high-priority bugs (excluding Thai translation) would require less than one week. For a platform of this ambition and quality, the gap between current state and a bug-free submission is narrow — but the show-stoppers must be cleared first.

[^1^]: Curl HTTP response header analysis, SCITI homepage (`sciti.dopa.go.th`), conducted during audit session. See Section 2 Methodology for full curl command and raw output.
[^2^]: Manual page testing, element interaction testing, and language toggle testing across all reachable routes and features. See Section 1 Frontend Audit for detailed test logs.
[^3^]: SCITI Methodology page (`/methodology`), version history table and technology stack disclosure, accessed during audit.
[^5^]: Thailand Personal Data Protection Act B.E. 2562 (2019), Section 4 (definitions of personal data) and Section 19 (consent requirements).
[^6^]: Google Search Central, "Structured data markup that Google Search supports," developers.google.com/search/docs/appearance/structured-data/search-gallery.
