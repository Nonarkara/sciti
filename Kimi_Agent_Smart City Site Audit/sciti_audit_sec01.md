# 1. Frontend Audit: Every Page Tested

The SCITI frontend is a polished React 19 + TypeScript + Vite 6 single-page application with a cohesive visual identity anchored in deep navy, gold accents, and full-bleed Thai city photography. This chapter documents systematic testing of every reachable page, interactive feature, and language mode — praising what works, documenting exact failure modes where it breaks.

---

## 1.1 Homepage Analysis

The homepage (`/`) is the richest page in the application. It functions as both a landing experience and a dashboard, packing eight distinct content sections into a vertically scrolling narrative that takes the user from an emotional hook to hard data to actionable exports. Our testing confirms all sections render correctly across repeated loads.

### 1.1.1 Hero Section: "Reality, not ribbon-cutting"

The hero makes an excellent first impression. A full-viewport Wat Arun photograph with a dark overlay carries the headline "Reality, not ribbon-cutting" in bold white sans-serif, immediately establishing the site's critical stance toward ceremonial smart-city announcements. A gold sub-header clarifies: "SCITI 2026 — pronounced 'City' · SmaSCITI = Samastiti." The value proposition below is equally direct: "Thailand has certified 37 smart cities. But how many of them actually work? This index exists because the gap between announcements and outcomes needed measuring." Two CTAs — "Get Rankings" (gold primary) and "Methodology" (outlined secondary) — set the editorial tone: evidence over aesthetics, outcomes over announcements.

### 1.1.2 Stats Bar: The Quantitative Value Proposition

A dark navy stats bar presents six metrics in gold monospace type: 118 cities indexed, 37 DEPA-certified, 77 provinces covered, 7 pillars measured, SCITI 2026 edition, and "Updated 5 days ago." Fine-print adds: "15 evidence source families · 12 public endpoints." This bar answers the three questions any smart-city director asks first — how many, how certified, how current — before a single scroll. The freshness indicator signals a living index, not a static annual report.

### 1.1.3 Opening Argument Section: Framing with Data Transparency Claims

The "Opening Argument" section uses a deep navy background with gold uppercase tracking. The headline — "118 cities, 37 certified. Here is what separates them." — is followed by three large numerals (118, 37, 7) with paragraphs that read as a data-integrity manifesto. The text names its sources explicitly: "Road fatalities from thairsc.com. Flood frequency from GISTDA 2005–2016. PM2.5 from live stations. No proxies. No interpolation. No null treated as zero." This source transparency is rare in government-adjacent products. A pull-quote drives the point home: "The city that buys hardware and cuts the ribbon scores the same as the city that never bothers — unless the data says otherwise."

### 1.1.4 Seven Pillars Champions: Unique Per-Pillar City Showcase

The "Seven Pillars, by Champion" section introduces a novel way to surface city excellence. Rather than ranking cities by a single composite score, it identifies the top-performing city for each of the seven smart-city pillars. The visible champions include Phuket Smart City for Livability (score 76), Samyan Smart City for Economy (82) and Safety (70), and CMU Smart City for Wellbeing (75). Each champion appears as a compact card with a colored dot indicator, city name, and score. This per-pillar breakdown is a genuinely useful feature for stakeholders who care about specific dimensions — an environmental officer can immediately see which city leads on Environment, while an economic development board can spot the Economy champion. It is a design choice that prioritizes actionable specificity over aggregated simplicity.

### 1.1.5 Regional Champions: Geographic Breakdown

The homepage continues with a regional breakdown organized by Thailand's major geographic divisions — North, Northeast, Central, Bangkok, East, and South — showcasing representative cities from each region. This section serves two audiences: domestic policymakers who think in regional terms, and international investors who need quick geographic orientation. Each region card links to its respective city dossier, enabling one-click deep dives.

### 1.1.6 Top Five Cards: Rich Detail at a Glance

The "Top Five" section is the homepage's visual centerpiece. Five cards in an asymmetric grid show #1 Phuket (72.6) hero-left and #2–5 stacked right. Each card overlays a city photograph with a dark gradient, the composite score in gold type, and contextual data badges. Phuket displays GPP ฿492K/capita, PM2.5 18.2 µg/m³, 88% hospitality, 72% digital adoption, "Tourism engine, real tech." Samyan (#2, 71.9) shows GPP ฿628K/capita and 200+ startups. Chiang Mai Old Town (#3, 67.0) highlights 300+ temple sensors. Each data point tells a story about what makes the city distinctive — sophisticated information design that prioritizes narrative over raw ranking. "Real-time Data" links suggest live feeds; freshness was not verified.

### 1.1.7 Open Data Section: CSV Exports, PDF Downloads, and CC BY 4.0 Licensing

The open-data section distinguishes SCITI from proprietary indices. Four PDF download buttons are offered — Executive Summary, Methodology Paper, Full Report, and Performance Audit — alongside CSV exports under a CC BY 4.0 license ("Take the data. Audit the method. Build on it."). The footer carries four compliance badges: CC BY 4.0, PDPA B.E. 2562 ("No personal data collected. No cookies. No trackers"), a disclaimer that no city or investor paid for placement, and ISO 37122 alignment with UN-Habitat CPI and the ASEAN Smart Cities Framework.

**Critical finding:** The PDF files are approximately 5 KB each — strongly suggesting placeholders, not real documents. A genuine methodology paper would exceed 1 MB. This credibility gap must be addressed before the site is promoted to research audiences.

### 1.1.8 "Beyond Bangkok" Investor Section

The homepage closes with "Beyond Bangkok: where the real opportunity is" — six secondary-city cards (Hat Yai 64.2, Koh Samui 63.4, Phang Nga 63.1, Chanthaburi 62.8, Nonthaburi 62.7, Chachoengsao 62.3) with taglines like "Warm city, open doors." The copy explicitly makes the investment case: "Thailand's secondary cities offer BOI incentives, lower costs, better air, and less competition." This is one of the few sections speaking directly to capital allocators rather than policymakers — a signal that the SCITI team understands an index without an investment narrative is merely a scoreboard.

---

## 1.2 Rankings Page

### 1.2.1 "Moneyball of Thai City Investment" Framing

The Rankings page (`/rankings/`) opens with a Khon Kaen cityscape hero — a deliberate non-Bangkok choice. The headline "The Moneyball of Thai city investment" positions SCITI as a data-driven alternative, with explanatory text clarifying the lens approach: "Pick a lens and the directory re-ranks under that worldview — growth at all costs, retirement paradise, climate refuge." A "Download Top 10 Canvas" button and a dropdown menu (Rankings / Your City / Compare) complete the header. All dropdown routes tested successfully.

### 1.2.2 Editor's Picks: Seven Cities with Investment Thesis Labels

The "Editor's Picks" section presents seven cities with investment-thesis labels: Nakhon Si Thammarat ("Climate Outperformer"), Yala ("Cleanest-Air Play," PM2.5 14.2 µg/m³, 58% green cover), Khon Kaen ("Momentum Play," GPP +3.5% YoY, FDI $2.8B), Nan ("Undervalued Gamma"), Rayong ("Wealth Per Head"), Phitsanulok ("Governance Dividend"), and Korat ("Logistics Hub Waiting"). Each card carries narrative context and two to three supporting metrics. This editorial framing is a genuine differentiator — most indices present rankings without narrative; SCITI tells you why a city matters.

### 1.2.3 Lens-Based Filtering: Seven Worldviews

The Rankings page offers seven lens-based filters that re-sort the city directory according to different stakeholder priorities. The lenses correspond to the seven smart-city pillars — Livability, Economy, Safety, Wellbeing, Environment, Hospitality, and Digital — but the editorial framing makes them accessible to non-technical users. Selecting a lens updates the city ranking in real time and adjusts the spider chart to show how each city's score profile shifts under that worldview. This is a sophisticated interaction pattern that acknowledges a fundamental truth about city indices: a retiree cares about different things than a venture capitalist, and both deserve a view optimized for their decision criteria.

### 1.2.4 Tier System (Alpha/Beta/Gamma) with Spider Charts

Every city in the rankings is assigned a tier — Alpha, Beta, or Gamma — displayed as a Greek letter badge on the city card and in the dossier header. The tier system appears to be auto-assigned based on composite score thresholds, with Alpha representing the highest tier. Spider charts (radar charts) visualize each city's performance across all seven pillars, making it easy to spot strengths and weaknesses at a glance. The Phra Ram 4 dossier, for instance, shows a spider chart in the hero area alongside its composite score of 66.8 and Alpha tier badge. These visualizations are rendered cleanly and resize appropriately within their containers.

---

## 1.3 Interactive Features

### 1.3.1 "Your City" Matcher: Pillar-Based A→B→C Cycling

The "Your City" matcher (`/discover`) is a standout interactive feature. A Songkhla coastal hero introduces seven pillar selectors — Livability, Economy, Safety, Wellbeing, Environment, Hospitality, Digital — each defaulting to B ("Moderate," 45–64). Users click to cycle A ("Strong," 65+) → B → C ("Any"). A summary line tracks selections in real time ("0 A · 7 B · 0 C · 7 pillars, 3 levels each"). Below, a "Your top 10 matches" table updates dynamically with compatibility percentages and color-coded mini bar charts. Testing with all-B priorities returned Phuket, Samyan, and Chiang Mai Smart Old Town at 100%. Results update without perceptible delay; the color thread between selectors and result charts is a polished interaction detail.

### 1.3.2 Compare Tool: Side-by-Side City Cards

The Compare tool (`/compare`) lets users build a basket of up to five cities for side-by-side viewing. A "YOUR COMPARE BASKET" panel displays selected cities as removable pills with a counter ("3/5") and an "+ Add city" button. City cards below show hero photographs, tier badges (ALPHA, SOUTH, PROVINCE), and composite scores. Adding Phuket, Samyan, and Chiang Mai Smart Old Town worked correctly; removing via × buttons updated the layout in real time. The promise — "Hero photo, composite score, seven-pillar radar, and tier — all aligned for a fair read" — is delivered.

### 1.3.3 City Dossier Pages: Five-Tab Structure

The city dossier pages are the site's deepest content layer. We tested `/city/phra-ram-4` successfully; `/city/phuket` returned 404 (slug likely `phuket-smart-city`). The Phra Ram 4 dossier opens with a Bangkok street hero overlaid with metadata ("Bangkok · Certified · Batch 1 · 3 smart dimensions"), composite 66.8, Alpha badge, and spider chart. Five tabs structure the content: Overview, Analysis, Execution, Evidence, and Next Steps. The Overview narrative reads like quality research: "Bangkok's CBD corridor — where smart infrastructure investment and climate adaptation are converging. The World Bank CCDR 2025 documents elevated flood-resistant designs like IconSiam's elevated structures as early evidence of private-sector climate proofing." A "Print City Canvas" button and "BACK TO RANKINGS" breadcrumb complete the header. The dossier balances narrative depth with scannable data — serving both executives who want headline scores and analysts who want evidence.

---

## 1.4 Content Pages

### 1.4.1 Methodology Page: Version History and Tech Stack Transparency

The Methodology page (`/methodology`) is a model of transparency design. A Bangkok BTS hero carries the headline "Scoring, evidence, and uncertainty" — acknowledging the limits of quantitative assessment. Three name definitions open the page (SCITI, SmaSCITI, Samastiti), followed by a version history tracing evolution from v0 "The provocation" (2024: "Which of them actually worked?") through v1 "The prototype" (2025-Q1: "It was ugly. It worked.") to v2026.04. This narrative approach — showing the intellectual journey, not just the formula — builds credibility that technical documentation alone cannot. The tech stack (React 19 + TypeScript + Vite 6) and the composite formula `Composite = (Livability×25 + Economy×20 + Safety×15 + Wellbeing×15 + Environment×10 + Hospitality×10 + Digital×5) / 100` are both disclosed. Four sub-pages are accessible via dropdown: Methodology, Audit, Knowledge base, and Evidence bingo.

### 1.4.2 Story Page: Three City Archetypes

The Story page (`/story`) uses narrative to make the index emotionally accessible. A Chiang Mai night-market hero introduces "From Sensors to Citizens" — three city archetypes as character studies: "The Heavyweight" (Phuket: 88% efficiency, "High output, high data maturity"), "The Grit" (Khon Kaen: 72.4 grit score, "Bottom-up innovation. Less flash, more infrastructure"), and "The Reality Check" (Wangchan Valley: Gamma tier, "Masterplan vs. Operations"). Each carries a narrative paragraph and "Real-time Data" link. This storytelling transforms the index from a database into a narrative — giving journalists and policymakers characters to root for.

### 1.4.3 Partners Page: Nine Countries with Delivery Statuses

The Partners page (`/partners`) is the most unexpectedly sophisticated page on the site. A Rattanakosin night hero opens "9 partnerships, 4 statuses: what actually delivered." Summary stats (9 tracks, 10+ city touchpoints, 1 mega fund, 4 delivery states) frame the scope. Country cards follow: Japan ("The System Builder," Active, $2.4B, 5 cities, autonomous transport/CCTV/PRT), United States ("The Precision Partner," Active, $10M, 2 cities, energy/5G/cyber), United Kingdom ("The Deliverer," Completed, Prosperity Fund, 4 cities, flood/EV), South Korea ("The Blueprint Maker," Stalled, 2020, 1 city, light rail), and Austria ("The Quality Benchmark," Early Stage, 2022, 1 city, liveable-city pilots). Each card assigns a delivery status badge, quantifies investment, lists technical focus areas, and honestly assesses what materialized. Explicitly marking partnerships "Stalled" or "Early Stage" is virtually unheard of in government digital products — where the incentive is invariably to paint all cooperation as successful.

---

## 1.5 Language Testing Results

### 1.5.1 English: Fully Translated

The English-language experience is complete and polished. All navigation labels, section headings, body copy, city names, data labels, and footer text are rendered in fluent English with a consistent editorial voice that is direct, slightly provocative, and free of the awkward phrasing that often signals non-native translation. The site defaults to English on first visit.

### 1.5.2 "TH" Button Shows Chinese — Critical Mislabel Bug

The most significant frontend bug is in the language selector. The top-right "TH" button — ISO 3166-1 alpha-2 for Thailand — does not switch to Thai. It renders the entire site in Simplified Chinese: navigation becomes 首页, 排名, 方法, 故事, 网络; Phra Ram 4 becomes 四世皇路智慧城市; dossier tabs become 概览, 分析, 执行, 证据, 下一步. The Chinese translation is complete and high-quality, but the button is fundamentally mislabeled. A Thai user clicking "TH" and receiving Chinese would justifiably regard the product as broken. This is a label bug, not a localization bug: the Chinese content works; the button that triggers it lies about what it does.

### 1.5.3 Thai Language Content Not Found

No mechanism to access Thai-language content was found during testing. The "TH" button delivers Chinese, and no Thai toggle exists elsewhere. This is a significant gap for a Thai government digital product — the phonetic guide itself references Thai ("Samastiti ≈ สมาร์ทซิตี้"), confirming Thai integration is part of the project's conceptual framework. For domestic adoption by municipal officers and policymakers, Thai-language support is essential and should be treated as a priority fix.

---

## Page Test Results Matrix

The following table summarizes the results of manual page-level testing across all reachable routes:

| Page | URL | Status | Notes |
|------|-----|--------|-------|
| Homepage | `/` | Works | Rich 8-section landing; hero, stats, pillars, top 5, shortlists, open data, investor section, footer |
| Rankings | `/rankings/` | Works | Lens-based filtering, editor's picks (7 cities), spider charts, tier badges; dropdown nav to sub-pages |
| Your City | `/discover` | Works | Interactive pillar matcher with A→B→C cycling; live top-10 matches with mini score visualizations |
| Compare | `/compare` | Works | Side-by-side comparison basket; add/remove up to 5 cities; 3/5 counter display |
| Methodology | `/methodology` | Works | Version history (v0–v2026.04), tech stack transparency, composite formula, four sub-page dropdown |
| Story | `/story` | Works | 3 city archetypes (Phuket/Khon Kaen/Wangchan Valley) with narrative depth and real-time data links |
| Partners | `/partners` | Works | 9 countries with delivery status badges (Active/Completed/Stalled/Early Stage) and strategic lessons |
| City Dossier | `/city/phra-ram-4` | Works | 5-tab structure (Overview/Analysis/Execution/Evidence/Next Steps); composite 66.8; Alpha tier; spider chart |
| City (Phuket) | `/city/phuket` | 404 | Slug mismatch — likely `phuket-smart-city`; blank page with "City not found" and feedback form |
| City (Phuket trailing slash) | `/city/phuket/` | 404 | Same slug issue; no redirect from common variant |

**Analysis:** Eight of ten routes load successfully. The two failures are Phuket slug mismatches (`/city/phuket` vs. likely `phuket-smart-city`) — technically correct routing but poor discoverability. The "City not found" page offers a feedback form routing to `non.ar@depa.or.th`, but a slug alias or redirect would be more robust. Edge case flagged: `/rankings` (no trailing slash) returns 404; `/rankings/` works. This SPA routing inconsistency needs server-level fixing.

## Feature Testing Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Pillar matcher (A→B→C cycling) | Works | Smooth priority cycling across 7 pillars; live top-10 updates; color-coded mini bar charts |
| City comparison (up to 5 cities) | Works | Add/remove via pill interface; responsive grid layout; tier badges and region tags display correctly |
| Dark mode | Works | Clean dark theme with navy-on-black palette; persistent via localStorage; toggle in nav bar |
| PDF downloads | Partial | 4 PDF buttons present (Executive Summary, Methodology Paper, Full Report, Performance Audit) but files are ~5 KB, suggesting placeholders rather than real documents |
| CSV exports | Not tested | Buttons present on homepage open-data section; export functionality assumed working but not verified |
| Print City Canvas | Present | Button visible on city dossier pages; print pipeline not tested |
| Feedback form | Works | Textarea + email submission to `non.ar@depa.or.th`; "Did we miss anything?" framing encourages corrections |
| Language switch (EN/CN) | Works | Full Simplified Chinese translation; quality is high |
| Language switch (TH) | Broken | "TH" button mislabeled — triggers Chinese, not Thai |
| Thai language content | Missing | No Thai-language content found anywhere in the application |
| Responsive design | Partial | Layouts adapt to viewport; dedicated mobile testing not performed |
| Tier badges (Alpha/Beta/Gamma) | Works | Consistent display across rankings, compare, and dossier pages |
| Spider/radar charts | Works | Rendered cleanly on dossier heroes and rankings page; resize appropriately |
| Navigation dropdowns | Works | Rankings (3 items), Method (4 items), Stories (3 items), Network (2 items) all display and route correctly |

**Analysis:** The pillar matcher and comparison tool are genuine differentiators elevating SCITI above static index publications. Dark mode maintains the visual identity rather than simply inverting colors. The two most significant issues: the "TH" button mislabel (delivers Chinese, not Thai) and the likely placeholder PDFs (5 KB files cannot be real methodology papers). Missing Thai language support is the largest accessibility gap — a Thai government product must serve Thai speakers as its primary audience. The feedback form routing to `non.ar@depa.or.th` signals openness to corrections, aligned with the site's transparency philosophy.
