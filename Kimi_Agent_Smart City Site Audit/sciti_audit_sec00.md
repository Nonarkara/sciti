# Executive Summary

The SCITI 2026 Critical Audit is a systematic, evidence-based assessment of the Smart City Thailand Index (SCITI) across six dimensions: frontend quality, backend infrastructure, critical bugs, global benchmarking, content gaps, and award readiness. This report is not a promotional review. It is an audit — commissioned to identify what works, what breaks, and what must change before SCITI can credibly claim a place among the world's leading smart city intelligence platforms.

The findings are stark: SCITI's visual design and interactive features are award-calibre, but its backend infrastructure, language support, and document delivery are incomplete. Three show-stopping bugs — each fixable within a single development day — currently prevent the platform from meeting the baseline credibility threshold expected of a Thai government-backed digital product. The good news: the gap between "audit findings" and "submission-ready" is narrow, measurable, and closeable within 90 days.

---

## Key Findings

**Finding 1: The frontend is genuinely impressive — and then it breaks.**
SCITI delivers a polished React 19 + TypeScript + Vite 6 experience with a distinctive navy-and-gold visual identity, seven-pillar spider charts, an innovative "Your City" matcher with live A→B→C priority cycling, and a side-by-side comparison tool for up to five cities [^1^]. The Partners page marks international partnerships as "Stalled" and "Early Stage" alongside "Active" and "Completed" — a level of transparency virtually unheard of in government digital products [^1^]. City dossiers open with narrative depth that reads like quality research: "Bangkok's CBD corridor — where smart infrastructure investment and climate adaptation are converging" [^1^]. Then the cracks appear. The top-right "TH" language button — ISO country code for Thailand — renders the entire site in Simplified Chinese (四世皇路智慧城市, 概览, 分析) [^2^]. No Thai-language content exists anywhere in the application, despite the domain being `dopa.go.th` and the project's phonetic guide referencing Thai script ("Samastiti ≈ สมาร์ทซิตี้") [^1^][^2^]. For a Thai government platform, a language selector that lies about what it delivers is not a UI bug — it is a credibility collapse.

**Finding 2: Routing failures block access to the platform's core content.**
Three show-stopping routing bugs were confirmed: `/rankings` (no trailing slash) returns HTTP 404 while `/rankings/` works — the natural URL form fails [^2^]; `/city/phuket` returns 404 while the actual slug is likely `/city/phuket-smart-city` — Thailand's #1 ranked city is unreachable by its common name [^2^]; and the PDF download buttons deliver files of approximately 5 KB each, suggesting empty shells rather than real documents [^1^]. A genuine methodology paper for a 118-city index would exceed 1 MB. These are not cosmetic issues: they erode the very transparency claims the platform is built on.

**Finding 3: The technical foundation is sound; the edge configuration is not.**
SCITI runs on Cloudflare CDN + GitHub Pages with HTTP/2, LCP preloading, async fonts, and modulepreload directives — all best-practice frontend performance techniques [^1^]. Yet three critical security headers are entirely absent (HSTS, CSP, X-Frame-Options) [^1^], the `Cache-Control: max-age=0` header forces full round-trips on every visit, and `CF-Cache-Status: DYNAMIC` confirms Cloudflare is not caching HTML at the edge [^1^]. The frontend team did everything right; the infrastructure configuration undermines it all. Most critically, the footer claims "No personal data collected. No cookies. No trackers" while the Cloudflare Analytics beacon (`cloudflareinsights.com`) is actively collecting visitor IP addresses and browsing patterns — data classified as personal under Thailand's PDPA B.E. 2562 [^1^][^5^].

**Finding 4: The gap between SCITI and global benchmarks is content, not code.**
Against IMD's 146-city citizen-perception survey (120 residents per city), IESE's 183-city statistically rigorous DP2 methodology, and Copenhagenize's per-city policy recommendations, SCITI competes well on visualisation but lacks the content infrastructure that makes an index a "bible" [^25^][^13^][^17^]. There is no citizen perception survey, no self-assessment tool, no financing guidance, no case study library, no procurement guide, and no Thai-language content for 67 million speakers [^1^][^2^]. Every one of these gaps is addressable within 90 days with existing models to follow.

---

## Verdict

**SCITI is 65% award-ready with bug fixes, 80% with content additions, and 95% with community features.**

The breakdown: the frontend design team has delivered award-calibre work — data visualisation scores 8/10, interface design 8/10 — that is undermined by backend configuration gaps (routing 6/10, security 3/10, caching 4/10) and incomplete content infrastructure (PDFs 2/10, language 3/10, SEO 4/10) [^1^]. The show-stoppers are all fixable within two development days. The content additions — a readiness self-assessment, a financing guide, a case study library, and Thai-language translation — require four to six weeks but transform the platform from a ranking table into a decision-support tool. The community layer — training programs, city twinning, an expert directory, and an annual summit — builds the institutional ecosystem that turns a website into a movement.

The foundation is strong. The execution needs polish. The path is clear.

---

## Top 3 Priorities

| Priority | Fix | Why It Matters First | Effort |
|:---|:---|:---|:---|
| **1. Fix the "TH" button** | Relabel to "CN"/"中文" immediately; if Thai translations exist, map correctly; if not, commission them for the next sprint | A Thai government site that cannot correctly label its own national language is a political liability before it is a technical bug. Every other fix is wasted if a Thai official's first click destroys trust [^2^]. | 1 hour (relabel) / 1–2 weeks (Thai content) |
| **2. Fix routing and slugs** | Implement slug aliases (`/city/phuket` → `/city/phuket-smart-city`); add 404.html redirect trick for GitHub Pages SPA; test all 118 city routes | Award reviewers, journalists, and evaluators type URLs directly. A 404 on the #1 city or the rankings page suggests the product is unfinished [^2^]. | 1–2 days |
| **3. Generate real PDFs** | Export methodology page content to PDF; compile city dossier data into Full Report; write Executive Summary and Performance Audit; or replace buttons with "Coming Soon" | Transparency is SCITI's brand promise. Offering 5 KB placeholder downloads undermines every claim about evidence-based scoring and auditability [^1^]. Broken downloads are worse than no downloads. | 3–5 days |

---

## The Vision

SCITI's trajectory is not a single website launch — it is a three-phase transformation from **Thai index** to **ASEAN platform** to **global movement**. In Phase 1 (2026), the 90-day action plan clears the show-stoppers, adds the four quick-win content pieces (readiness self-assessment, financing guide, case study library, procurement guide), and submits to three Red Dot Design Award categories. In Phase 2 (2027), SCITI expands from 118 Thai cities to include all 26 ASEAN Smart Cities Network pilot cities across 10 member states, using IMD's HDI-based peer grouping to ensure fair comparison between Singapore and Phnom Penh [^30^][^109^]. The Digital Twin Playbook and Climate Adaptation Toolkit address the fastest-growing investment segments in Southeast Asian urban development [^48^][^50^]. In Phase 3 (2028+), the annual SCITI Summit rotates between Bangkok, Chiang Mai, and Khon Kaen; research partnerships with Thai universities validate methodology through peer-reviewed sensitivity analysis; and the composite scores feed directly into DEPA certification, BOI incentive allocation, and municipal performance evaluation. The measure of SCITI's ultimate success is not pageviews — it is whether a mayor in Nakhon Sawan can cite her city's Environment score to justify a flood-management budget, or whether a city manager in Hat Yai can point to a Hospitality score to attract tourism investment. When that happens, SCITI is no longer a website. It is infrastructure.
