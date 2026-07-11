## 2. Backend & Technical Audit

A government-backed smart city assessment platform cannot be judged solely by its user interface. The infrastructure beneath SCITI determines whether it can sustain public trust, scale under load, and comply with Thailand's Personal Data Protection Act B.E. 2562 (2019). This chapter subjects the site's hosting stack, security posture, search-engine readiness, and runtime performance to systematic inspection using curl-based header analysis, manual page auditing, and established benchmarking standards.

---

### 2.1 Infrastructure

#### 2.1.1 Cloudflare CDN with HTTP/2, GitHub Pages Hosting

SCITI is served through Cloudflare's content delivery network with HTTP/2 enabled, confirmed by the `HTTP/2 200` response line and Cloudflare-specific headers (`CF-Cache-Status`, `CF-RAY`) present in every server response [^1^]. The origin is GitHub Pages, as verified by the `Server: cloudflare` and `X-GitHub-Request-Id` header patterns visible in the response set. This is a pragmatic choice for a public-sector digital product: GitHub Pages offers free, reliable static hosting with built-in version control, while Cloudflare provides global edge caching and DDoS mitigation without infrastructure overhead.

However, the combination creates a governance gap. GitHub Pages is designed for developer documentation and project sites, not production government services. There is no service-level agreement (SLA), no dedicated support channel, and no contractual data residency guarantee. For a platform that presents itself as Thailand's official smart city intelligence hub, hosting on a free-tier developer service—even fronted by Cloudflare—raises questions about institutional commitment and long-term sustainability. The `404` responses returned for `/city/phuket` and `/city/phuket/` (both variants tested) further suggest that client-side routing is not properly supported by the static hosting layer, a common Single Page Application (SPA) pitfall on GitHub Pages [^2^].

#### 2.1.2 React 19 + TypeScript + Vite 6 + Zero CSS Frameworks

The technology stack, disclosed on the `/methodology` page and corroborated by the compiled output, is modern and disciplined: React 19, TypeScript, Vite 6, with Tailwind CSS absent and no heavy UI component library detected [^3^]. The build produces a single JavaScript bundle plus a vendor chunk, with `modulepreload` directives in the HTML `<head>` to ensure non-blocking early fetch. This is architecturally sound: minimal runtime overhead, strong type safety, and fast builds.

The absence of CSS frameworks is notable. SCITI renders its entire interface through custom CSS, which keeps the bundle lean but introduces maintainability risk as the codebase grows. The choice of React 19—still relatively new at the time of audit—suggests an active development team willing to adopt cutting-edge releases, though it also carries the risk of undiscovered framework-level issues in production. Vite 6's native ES module support and tree-shaking contribute to the clean dependency graph observed in the vendor chunk analysis.

#### 2.1.3 Data as TypeScript Constants: Version-Controlled, Auditable

SCITI's most significant architectural decision is storing city data, pillar scores, and rankings as TypeScript constants rather than fetching from an external database or API. This has three implications. First, every data change is version-controlled through Git, producing an auditable trail that aligns with the platform's open-government ethos. The methodology page documents a version history from v0 through 2026.04, confirming this practice [^3^].

Second, the entire application is a static site with zero runtime data dependencies. This eliminates an entire class of backend vulnerabilities—no SQL injection, no API rate-limiting concerns, no database connection failures. Third, it caps the platform's data scale. As the number of assessed cities grows beyond the current ~19, the bundle size will increase linearly, and build times will extend. For the current dataset, this trade-off is defensible. At 100+ cities, the architecture would require reconsideration, likely through a transition to a headless CMS or static API layer.

---

### 2.2 Security Assessment

#### 2.2.1 Present: X-Content-Type-Options, Referrer-Policy, CORS

Three security headers are correctly configured on SCITI's responses. The `X-Content-Type-Options: nosniff` directive prevents MIME-type sniffing attacks, where a browser might execute a disguised script file. The `Referrer-Policy: strict-origin-when-cross-origin` setting limits referrer leakage to external domains, transmitting only the origin (not the full path) on cross-origin requests. The `Access-Control-Allow-Origin: *` header is appropriately permissive for a public open-data platform, allowing any origin to fetch SCITI resources—consistent with the CC BY 4.0 licensing claimed in the footer [^1^].

These present headers demonstrate baseline security awareness. The `nosniff` and `Referrer-Policy` combination protects against common web attacks without breaking functionality, and the open CORS policy aligns with the platform's stated data-sharing philosophy. However, three critical headers are entirely absent, and their omission elevates the platform's risk profile beyond what these baseline measures can mitigate.

#### 2.2.2 Missing: HSTS, CSP, X-Frame-Options — 3 Critical Headers Absent

The curl analysis returned no trace of `Strict-Transport-Security`, `Content-Security-Policy`, or `X-Frame-Options` in any response [^1^]. This is a significant failure for a government platform handling public data, and each absence carries distinct risks.

| Header | Status | Value (if present) | Risk Level | Impact |
|--------|--------|-------------------|------------|--------|
| X-Content-Type-Options | ✅ Present | `nosniff` | None | Prevents MIME sniffing |
| Referrer-Policy | ✅ Present | `strict-origin-when-cross-origin` | None | Limits referrer leakage |
| Access-Control-Allow-Origin | ✅ Present | `*` | Low | Open CORS for public data |
| Strict-Transport-Security | ❌ Missing | — | 🔴 Critical | Vulnerable to SSL stripping |
| Content-Security-Policy | ❌ Missing | — | 🔴 Critical | No XSS injection barrier |
| X-Frame-Options | ❌ Missing | — | 🔴 Should add | Clickjacking risk |

**Table 1: Security Headers Checklist.** Present headers indicate baseline awareness; three critical omissions expose the platform to well-documented attack vectors. Source: curl response analysis [^1^].

**HTTP Strict Transport Security (HSTS)** is the most consequential absence. Without `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, an attacker on a shared network can downgrade HTTPS connections to HTTP via SSL stripping—stripping the secure protocol and intercepting traffic in plaintext. For a government platform that asks users to input feedback (including email addresses) through a form on the `/partners` page, this is a direct vector for credential and data interception. The fix is a single line added at the Cloudflare edge: HSTS should be enabled in Cloudflare's SSL/TLS settings with a minimum max-age of one year and the preload directive.

**Content-Security-Policy (CSP)** is the second critical gap. SCITI loads Google Fonts, Leaflet map tiles, and Cloudflare analytics scripts from external origins. Without a CSP, any Cross-Site Scripting (XSS) vulnerability—whether in React's rendering pipeline, a third-party dependency, or user-generated content added in the future—allows arbitrary script execution with full access to the page's DOM, localStorage (where dark mode preference is stored), and any authenticated state. A baseline policy such as `default-src 'self'; script-src 'self' 'unsafe-inline' static.cloudflareinsights.com; style-src 'self' fonts.googleapis.com 'unsafe-inline'; font-src fonts.gstatic.com; img-src 'self' *.tile.openstreetmap.org; connect-src 'self' cloudflareinsights.com` would substantially reduce the attack surface while accommodating the current third-party dependencies [^4^].

**X-Frame-Options** mitigates clickjacking by preventing the site from being embedded in `<iframe>` elements on attacker-controlled pages. While less critical for a read-only data platform than for a transactional site, the absence is still notable given that SCITI could be framed to display misleading rankings or capture user interactions. A simple `X-Frame-Options: DENY` or the CSP equivalent `frame-ancestors 'none'` closes this vector.

These three headers can all be configured at the Cloudflare layer without code changes. Their simultaneous absence suggests either a configuration oversight or a deliberate decision to minimize header complexity that has not been revisited since launch.

#### 2.2.3 PDPA Compliance Claimed but Cloudflare Beacon Present

SCITI's footer and methodology pages emphasize transparency and the absence of tracking. Yet the curl responses reveal `cloudflareinsights.com` beacon scripts embedded in the HTML, and the `CF-Cache-Status: DYNAMIC` header confirms active Cloudflare processing [^1^]. Cloudflare Analytics collects visitor IP addresses, user agent strings, and browsing patterns—data categories classified as personal data under Thailand's PDPA B.E. 2562 [^5^].

The contradiction is direct: the platform claims no trackers while deploying Cloudflare's client-side analytics beacon. PDPA compliance requires explicit consent for data collection, a clear privacy notice, and potentially a data processing agreement (DPA) with Cloudflare Inc. None of these were visible during the audit. If SCITI is to maintain its credibility as an open-government initiative, it must either (a) remove the Cloudflare beacon and rely solely on server-side logs that can be anonymized, or (b) implement a cookie consent banner and publish a comprehensive privacy policy that discloses Cloudflare's role as a data processor. The latter is the standard approach for government sites using Cloudflare globally, but it requires legal review and administrative effort.

---

### 2.3 SEO & Meta Tags

#### 2.3.1 OG Tags, Twitter Cards, Robots, Theme-Color Present

SCITI's `<head>` section is comprehensively equipped with social sharing metadata. Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) are all present, as are Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`). The `robots` meta is set to `index, follow`, and `theme-color` is configured to `#0F2F53`—the site's navy brand color [^1^].

| Tag / Element | Present | Quality Assessment | Recommendation |
|---------------|---------|-------------------|----------------|
| `<meta name="description">` | ✅ Yes | Generic; identical across all pages | Add city-specific descriptions on dossier pages |
| `og:title` | ✅ Yes | Good; consistent with page title | — |
| `og:description` | ✅ Yes | Duplicates meta description | Customize per city dossier |
| `og:image` | ✅ Yes | 1182×1182 logo at high resolution | Good for social sharing |
| `og:url` | ✅ Yes | Canonical URL present | Ensure SPA router updates dynamically |
| `twitter:card` | ✅ Yes | `summary_large_image` | Optimal for visual engagement |
| `robots` | ✅ Yes | `index, follow` | Correct for public content |
| `theme-color` | ✅ Yes | `#0F2F53` navy | Consistent with brand |
| `keywords` | ✅ Yes | Basic set present | Expand with city-specific terms |
| Schema.org JSON-LD | ❌ No | — | Add `WebSite`, `Organization`, `City` schemas |

**Table 2: SEO Meta Tags Audit.** Core social and indexing metadata is well implemented, but city-specific customization and structured data are absent. Source: manual `<head>` inspection [^1^].

This metadata foundation enables proper rendering when SCITI links are shared on Facebook, LINE (Thailand's dominant messaging platform), Twitter/X, and LinkedIn. The 1182×1182 `og:image` is a square logo at sufficient resolution for high-DPI displays. The `twitter:card: summary_large_image` setting maximizes visual impact on X/Twitter timelines. These are correct choices for a platform whose primary distribution channel is likely social sharing among urban policy professionals.

#### 2.3.2 Meta Description Generic: Needs City-Specific on Dossiers

The meta description is identical across all pages, including individual city dossiers such as `/city/phra-ram-4`. This is a missed opportunity. When a user searches Google for "Phra Ram 4 smart city assessment" or shares a specific city dossier on social media, the preview text is the same generic description as the homepage. Search engines may interpret this as duplicate content, diluting the ranking potential of individual city pages.

The fix requires the React router to inject city-specific descriptions into the `<head>` when a dossier route mounts. For Phra Ram 4, the description should read something like: "Phra Ram 4 Smart City Assessment — 7 pillar analysis, evidence-based scoring, and actionable next steps for Bangkok's emerging smart district." This is a straightforward enhancement using React Helmet Async or Vite's `transformIndexHtml` hook, and it would measurably improve click-through rates from search results.

#### 2.3.3 No Schema.org Structured Data

Despite its data-rich content, SCITI contains no Schema.org JSON-LD structured data. Three schemas would be immediately relevant. First, `WebSite` with `SearchAction` would enable a site search box directly in Google results—a powerful feature given that SCITI currently has no on-site search functionality. Second, `Organization` would properly identify DEPA as the publisher, linking to official social profiles and improving knowledge panel rendering. Third, and most critically, `City` or `GovernmentOrganization` schemas on individual dossier pages would allow Google to understand that Phra Ram 4 is a geographic entity with assessed properties, potentially triggering rich results for smart city-related queries [^6^].

The absence of structured data is a competitive disadvantage. Rival smart city indices—such as those from IMD or IESE—typically implement Organization and WebSite schemas as standard practice. SCITI's refusal to do so leaves search engine understanding entirely dependent on unstructured text parsing, which is less reliable for the technical and numerical content that constitutes the bulk of the platform.

---

### 2.4 Performance

#### 2.4.1 LCP Preload, Async Fonts, Modulepreload — Good

SCITI's performance architecture shows evidence of deliberate optimization. The largest contentful paint (LCP) element—the hero image on the homepage—is preloaded via `<link rel="preload" as="image">`, ensuring it renders before the JavaScript bundle executes. Google Fonts are loaded asynchronously with `display=swap`, preventing invisible text during font download. Leaflet's mapping library is loaded asynchronously, deferring its payload until after the primary content is interactive. The vendor JavaScript chunk is prefetched using `<link rel="modulepreload">`, which instructs the browser to parse the module graph in parallel with HTML parsing [^1^].

These are all best-practice techniques aligned with Google's Core Web Vitals guidance. The LCP preload directly improves the LCP metric—one of the three Core Web Vitals that Google uses as a ranking signal. The `modulepreload` directive on the vendor chunk eliminates the waterfall delay that would otherwise occur when the main bundle's `import()` statements are encountered. Together, these optimizations suggest that the development team has internalized modern performance engineering principles.

| Indicator | Status | Details / Value | Assessment |
|-----------|--------|----------------|------------|
| LCP element preload | ✅ Present | Hero image preloaded in `<head>` | Good — reduces largest contentful paint time |
| Google Fonts loading | ✅ Async | `display=swap` prevents FOIT | Good — text renders immediately with fallback font |
| Leaflet (maps) loading | ✅ Async | Deferred loading | Good — non-critical dependency |
| Modulepreload (vendor) | ✅ Present | Vendor chunk prefetched | Good — eliminates parse waterfall |
| Cache-Control (HTML) | 🔴 Critical | `max-age=0, must-revalidate` | No browser caching; full round-trip on every visit |
| CF-Cache-Status | 🔴 Critical | `DYNAMIC` | Cloudflare not caching HTML at edge |
| Code splitting | ✅ Present | Main bundle + vendor chunk | Good — parallel download and parsing |
| Bundle size | ⚠️ Watch | Single JS bundle (no lazy routes) | Room for route-based code splitting |

**Table 3: Performance Indicators.** Client-side optimizations are well executed, but server-level caching is entirely absent, negating much of the frontend work. Source: curl response analysis, `<head>` inspection [^1^].

#### 2.4.2 Cache-Control max-age=0 — No Browser Caching

The `Cache-Control: max-age=0, must-revalidate, no-transform` header on HTML responses instructs browsers to revalidate every request with the origin server before displaying cached content [^1^]. In practice, this means that every time a user navigates to SCITI—even revisiting within seconds—the browser sends a full HTTP request and waits for a 200 response before rendering anything. On slow or intermittent mobile connections (common in Thailand's secondary cities), this creates a perceptible delay that the frontend optimizations cannot overcome.

The `must-revalidate` directive is particularly aggressive: it forbids browsers from serving stale content even when the origin is unreachable. For a static site whose HTML changes only on deployment, this is unnecessarily conservative. A more appropriate policy would be `Cache-Control: public, max-age=3600` for HTML (one hour) and `max-age=31536000, immutable` for versioned assets (JS, CSS, images with hash in filename). This would allow browsers to serve the page instantly on repeat visits while still revalidating periodically.

#### 2.4.3 CF-Cache-Status DYNAMIC — Cloudflare Not Caching HTML

The `CF-Cache-Status: DYNAMIC` header is the most concerning performance finding. In Cloudflare's terminology, `DYNAMIC` means the content is not cached at Cloudflare's edge and is instead fetched from the origin (GitHub Pages) on every request [^1^]. This nullifies the primary benefit of using a CDN: serving content from a geographically close edge server rather than routing every request to GitHub's US-based infrastructure.

The combination of `Cache-Control: max-age=0` and `CF-Cache-Status: DYNAMIC` means that a user in Chiang Mai, Hat Yai, or Khon Kaen is making a full round-trip to GitHub Pages for every page load, through Cloudflare's Bangkok or Singapore edge. The latency is not catastrophic—GitHub Pages has its own CDN—but it is suboptimal. More critically, it means SCITI gains no DDoS protection or origin shielding from Cloudflare for HTML content. If GitHub Pages experiences an outage or rate-limiting event, SCITI goes offline regardless of Cloudflare's presence.

The fix is a Cloudflare Page Rule: create a rule matching `sciti.dopa.go.th/*` with the setting "Cache Level: Cache Everything" and a Browser Cache TTL of 2 hours. This instructs Cloudflare to treat HTML as cacheable while respecting the origin's revalidation directives. For a site that deploys infrequently (monthly version updates per the methodology page), even a 24-hour edge cache would be safe and would dramatically improve perceived performance for repeat visitors [^3^].

Furthermore, the current setup does not leverage Cloudflare's static asset optimization features. The JavaScript and CSS bundles, while code-split, are not served with `CF-Cache-Status: HIT` consistently, suggesting that asset caching policies may also need review. Enabling Cloudflare's Auto Minify for JavaScript and CSS, and ensuring proper cache-busting through Vite's hashed filename generation (`assets/index-[hash].js`), would complete a coherent caching strategy.

The performance paradox of SCITI is this: the frontend is meticulously optimized with every modern technique available, while the server layer systematically undermines those efforts by refusing to cache anything. This is not uncommon in statically generated SPA deployments, where the development team focuses on bundle size and render performance while neglecting HTTP-level caching policy. The correction is entirely configuration-based—no code changes required—and should be treated as a priority fix before the next public communications push.

---

### Summary of Findings

The backend audit reveals a platform with a sound architectural foundation (React 19 + Vite 6, version-controlled data, CDN fronting) that is undermined by security and caching misconfigurations at the edge. Three critical security headers are absent, creating exploitable vulnerabilities in a government context. Social metadata is well implemented but lacks page-level specificity. Frontend performance optimizations are state-of-the-art, yet entirely negated by zero caching on both browser and CDN layers. The PDPA compliance claim is contradicted by active Cloudflare analytics tracking. All identified issues can be resolved through Cloudflare configuration changes and minor React head-management enhancements, with no backend infrastructure modifications required.

[^1^]: Curl HTTP response header analysis, SCITI homepage (`sciti.dopa.go.th`), conducted during audit session. See Section 1 Methodology for full curl command and raw output.
[^2^]: Manual path testing, `/city/phuket` and `/city/phuket/` variants, both returned HTTP 404 with no redirect. See Frontend Audit findings.
[^3^]: SCITI Methodology page (`/methodology`), version history table and technology stack disclosure, accessed during audit.
[^4^]: Mozilla Developer Network, "Content-Security-Policy" reference, developer.mozilla.org/en-US/docs/Web/HTTP/CSP.
[^5^]: Thailand Personal Data Protection Act B.E. 2562 (2019), Section 4 (definitions of personal data) and Section 19 (consent requirements).
[^6^]: Google Search Central, "Structured data markup that Google Search supports," developers.google.com/search/docs/appearance/structured-data/search-gallery.
