# SCITI Website Audit — Raw Findings

## Frontend Audit (Manual Testing)

### Pages Tested
| Page | URL | Status | Notes |
|------|-----|--------|-------|
| Homepage | / | ✅ Works | Rich content, hero, stats, pillars, top 5, shortlists |
| Rankings | /rankings/ | ✅ Works | Lens-based filtering, editor's picks, spider charts |
| Your City | /discover | ✅ Works | Interactive pillar matcher, top 10 matches |
| Compare | /compare | ✅ Works | Side-by-side comparison basket (up to 5 cities) |
| Methodology | /methodology | ✅ Works | Version history, tech stack transparency |
| Story | /story | ✅ Works | 3 city archetypes with narrative |
| Partners | /partners | ✅ Works | 9 countries, delivery statuses, strategic lessons |
| City Dossier | /city/phra-ram-4 | ✅ Works | Tabbed: Overview/Analysis/Execution/Evidence/Next Steps |
| City (failed) | /city/phuket | ❌ 404 | Wrong slug — should be /city/phuket-smart-city? |
| City (failed) | /city/phuket/ | ❌ 404 | No city data for "phuket" slug |

### Language Testing
| Language | Button | Content | Status |
|----------|--------|---------|--------|
| English | Default | Fully translated | ✅ |
| Chinese | "TH" button | Partially translated | ⚠️ Mislabeled as "TH" |
| Thai | Not found | — | ❌ Missing or mislabeled |

### Feature Testing
| Feature | Status | Notes |
|---------|--------|-------|
| Dark mode | ✅ Works | Clean dark theme, persistent via localStorage |
| CSV exports | Not tested | Buttons present on homepage |
| PDF downloads | ✅ Works | But files are tiny (~5KB — likely placeholders) |
| Print City Canvas | Button present | Not tested |
| Feedback form | ✅ Present | Textarea + email to non.ar@depa.or.th |
| City comparison | ✅ Works | Add/remove cities, 5 city limit |
| Pillar matcher | ✅ Works | A→B→C cycling, live results |
| Responsive design | ⚠️ Partial | Needs mobile testing |

## Backend/Technical Audit

### Hosting & Infrastructure
- Cloudflare CDN (HTTP/2)
- GitHub Pages (confirmed by source code)
- React 19 + TypeScript + Vite 6 (from methodology page)
- Single JS bundle + vendor chunk code splitting

### Security Headers
| Header | Present | Status |
|--------|---------|--------|
| X-Content-Type-Options | ✅ nosniff | Good |
| Referrer-Policy | ✅ strict-origin-when-cross-origin | Good |
| Access-Control-Allow-Origin | ✅ * | Good for open data |
| Strict-Transport-Security | ❌ Missing | 🔴 Critical |
| Content-Security-Policy | ❌ Missing | 🔴 Critical |
| X-Frame-Options | ❌ Missing | 🔴 Should add |

### SEO Meta Tags
| Tag | Present | Quality |
|-----|---------|---------|
| description | ✅ | Generic, needs city-specific on dossiers |
| og:title | ✅ | Good |
| og:description | ✅ | Same as meta description |
| og:image | ✅ | 1182x1182 logo |
| twitter:card | ✅ | summary_large_image |
| robots | ✅ | index, follow |
| theme-color | ✅ | #0C2F53 |
| keywords | ✅ | Basic |

### Performance Issues
| Issue | Severity | Details |
|-------|----------|---------|
| Cache-Control max-age=0 | 🔴 High | No browser caching for HTML |
| CF-Cache-Status: DYNAMIC | 🔴 High | Cloudflare not caching HTML |
| Hero image preload | ✅ Good | LCP optimization present |
| Google Fonts async | ✅ Good | Non-blocking load |
| Leaflet async | ✅ Good | Non-blocking |
| Modulepreload | ✅ Good | Vendor chunk preloaded |

### Critical Bugs
| Bug | Severity | Impact |
|-----|----------|--------|
| SPA routing 404 | 🔴 Critical | /rankings returns 404; only /rankings/ works |
| City slug mismatch | 🔴 Critical | /city/phuket 404s; actual slug may differ |
| Language mislabel | 🟡 Medium | "TH" button shows Chinese, not Thai |
| PDF placeholders | 🟡 Medium | PDFs are ~5KB — likely not real documents |
| No Thai language | 🟡 Medium | Claims trilingual but Thai may be missing |
| Cloudflare beacon | 🟡 Medium | Contradicts "no trackers" claim |

### Content Observations
1. **Exceptional**: Partners page with strategic lessons per country
2. **Exceptional**: City dossier with 5-tab structure
3. **Exceptional**: Open data philosophy with CC BY 4.0
4. **Good**: Evidence-based methodology transparency
5. **Good**: Version history from v0 to 2026.04
6. **Gap**: No interactive map visualization
7. **Gap**: No search functionality
8. **Gap**: No API documentation page
9. **Gap**: Limited global comparative context
