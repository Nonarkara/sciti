# COVERAGE — sciti v2 dataset

Generated from indicators.csv on 2026-10-19 (ICT). 4,378 values, 59 indicators, 135 places in cities.csv (77 provinces, 49 municipalities, 9 depa project areas).

## By smart-city area (province level)

| Area | Indicators | Values | Avg provinces covered (of 77) |
|---|---|---|---|
| Economy | 25 | 1772 | 71 |
| Energy | 4 | 308 | 77 |
| Environment | 6 | 414 | 69 |
| Governance | 4 | 307 | 77 |
| Living | 5 | 385 | 77 |
| Mobility | 3 | 231 | 77 |
| People | 12 | 912 | 76 |

## Indicator coverage (provinces with a value, of 77)

| indicator | area | lens | provinces | period |
|---|---|---|---|---|
| border_customs_exports | Economy | border;logistics | 25 | 2024 (2567) |
| border_customs_trade | Economy | border;logistics;growth | 25 | 2024 (2567) |
| boi_investment | Economy | growth;logistics | 67 | 2025 (Jan-Dec 2568) |
| boi_investment_per_capita | Economy | growth | 67 | 2025 (Jan-Dec 2568) |
| boi_jobs | Economy | growth;talent | 67 | 2025 (Jan-Dec 2568) |
| boi_projects | Economy | growth;logistics | 67 | 2025 (Jan-Dec 2568) |
| boi_investment_prev | Economy | growth;logistics | 73 | 2024 (Jan-Dec 2567) |
| boi_projects_prev | Economy | growth;logistics | 73 | 2024 (Jan-Dec 2567) |
| inflation_cpi | Economy | retirement;families | 76 | 2024 (2567p) |
| gini | Economy | growth;retirement | 77 | 2566 |
| gpp_current | Economy | growth;talent | 77 | 2023 (2566) |
| gpp_per_capita | Economy | growth;talent | 77 | 2023 (2566) |
| gpp_real_cagr_2y | Economy | growth | 77 | 2021-2023 (2564r-2566p) |
| gpp_real_growth | Economy | growth | 77 | 2023 (2566p) |
| minimum_wage_daily | Economy | talent;logistics;growth | 77 | 2025-01 (Jan 2568) |
| new_firms | Economy | growth | 77 | 2025 (Jan-Dec 2568, 12 months) |
| new_firms_capital | Economy | growth | 77 | 2025 (2568) |
| new_firms_growth | Economy | growth | 77 | 2025 vs 2024 (2568 vs 2567) |
| new_firms_per_10k | Economy | growth;remote_work | 77 | 2025 (2568) |
| tourism_revenue | Economy | tourism;growth | 77 | 2025 (2568) |
| tourism_revenue_foreign | Economy | tourism | 77 | 2025 (2568) |
| tourism_revenue_per_resident | Economy | tourism;growth | 77 | 2025 (2568) |
| unemployment_rate | Economy | talent;growth | 77 | 2025 (2568, mean of Q1-Q4) |
| visitors_foreign | Economy | tourism | 77 | 2025 (2568) |
| visitors_total | Economy | tourism | 77 | 2025 (2568) |
| electricity_per_capita | Energy | growth | 77 | 2023 (2566) |
| electricity_residential_per_capita | Energy | families;retirement | 77 | 2023 (2566) |
| electricity_use_total | Energy | growth;logistics | 77 | 2023 (2566) |
| ev_charging_kwh | Energy | remote_work;growth | 77 | 2023 (2566) |
| pm25_annual_mean | Environment | retirement;families;tourism | 61 | 2025 (2568) |
| pm25_exceed_days_max | Environment | retirement;families;remote_work | 61 | 2025 (2568) |
| pm25_exceed_days_median | Environment | retirement;families | 61 | 2025 (2568) |
| forest_cover_share | Environment | retirement;families;tourism | 77 | 2024 (2567) |
| waste_generated | Environment | growth;families | 77 | 2024 (2567) |
| waste_per_capita | Environment | families | 77 | 2024 (2567) |
| digital_trainees_per_1000 | Governance | talent;remote_work | 76 | 2025 (2568) |
| depa_smart_city_areas | Governance | governance;growth | 77 | 2021-2025 |
| depa_smart_city_areas_current | Governance | governance | 77 | 2025-08-01 onward |
| municipalities_count | Governance | governance | 77 | 2024-12-31 |
| area_km2 | Living | retirement;families | 77 | 2024-12-31 |
| doctors_per_10k | Living | retirement;families | 77 | 2024 (2567) |
| hotel_occupancy | Living | tourism;retirement | 77 | 2025 (2568) |
| land_appraisal_median | Living | retirement;families;growth | 77 | appraisal round in effect (file updated 2026-05-08) |
| pop_density | Living | retirement;families;growth | 77 | 2025-12 / 2024 area |
| road_deaths_per_100k | Mobility | retirement;families | 77 | 2025 (2568) |
| road_deaths_per_100k_prev | Mobility | retirement;families | 77 | 2024 (2567) |
| vehicles_registered_per_1000 | Mobility | families;logistics | 77 | 2024 (2567) |
| higher_ed_institutions | People | talent | 74 | AY 2568 sem 1 |
| postgrad_share | People | talent | 74 | AY 2568 sem 1 |
| university_students | People | talent | 74 | AY 2568 sem 1 |
| university_students_per_1000 | People | talent | 74 | AY 2568 sem 1 |
| households_internet_share | People | remote_work;talent;families | 77 | 2569 Q2 |
| labour_force | People | talent;logistics | 77 | 2025 (2568, mean of Q1-Q4) |
| latent_pop_daytime | People | growth;tourism;talent | 77 | 2025 (2568) |
| latent_pop_night | People | growth | 77 | 2025 (2568) |
| latent_pop_night_ratio | People | growth;tourism;talent | 77 | 2025 (2568) |
| pop_age60plus_share | People | retirement;families | 77 | 2025 (2568) |
| pop_growth_cagr_3y | People | growth;families | 77 | 2022-12 to 2025-12 (Dec 2565-Dec 2568) |
| pop_registered | People | growth;retirement;talent | 77 | 2025-12 (Dec 2568) |

### Why some indicators have < 77 provinces

- **PM2.5 (61):** PCD has no permanent station in 16 provinces in the 2568 station file. Left blank — do not interpolate.
- **BOI 2568 (67) / 2567 (73):** provinces missing from the BOI province table had no approvals reported for that year (likely 0, but BOI does not print a zero row, so left blank).
- **University students (74):** MHESI file has no campus in Bueng Kan, Chai Nat, Sing Buri in AY2568/1 (or campuses registered to another province).
- **Border customs trade (25):** only provinces with land/river-border customs checkpoints (mapping in fetch/checkpoint_province_map.tsv). Seaports and airports excluded.
- **Land appraisal:** all 77 provinces fetched (the Treasury host drops TLS connections often; fetch/treasury_land.py retries and resumes).
- **CPI/inflation (76):** Bangkok is only published together with its vicinity.
- **Unemployment / labour force (76), digital trainees (76):** one province missing in the NSO table.

## Priority cities — indicator count per area

| city | Economy | Energy | Environment | Governance | Living | Mobility | People | total |
|---|---|---|---|---|---|---|---|---|
| Chiang Mai | 25 | 4 | 6 | 4 | 5 | 3 | 12 | 59 |
| Khon Kaen | 23 | 4 | 6 | 4 | 5 | 3 | 12 | 57 |
| Phuket | 23 | 4 | 6 | 4 | 5 | 3 | 12 | 57 |
| Nakhon Si Thammarat | 23 | 4 | 6 | 4 | 5 | 3 | 12 | 57 |
| Songkhla | 25 | 4 | 6 | 4 | 5 | 3 | 12 | 59 |
| Udon Thani | 23 | 4 | 6 | 4 | 5 | 3 | 12 | 57 |
| Nakhon Ratchasima | 23 | 4 | 6 | 4 | 5 | 3 | 12 | 57 |
| Chon Buri | 23 | 4 | 6 | 4 | 5 | 3 | 12 | 57 |
| Rayong | 23 | 4 | 6 | 4 | 5 | 3 | 12 | 57 |
| Nong Khai | 25 | 4 | 6 | 4 | 5 | 3 | 12 | 59 |
| Mukdahan | 25 | 4 | 6 | 4 | 5 | 3 | 12 | 59 |
| Tak | 25 | 4 | 6 | 4 | 5 | 3 | 12 | 59 |
| Chiang Rai | 25 | 4 | 6 | 4 | 5 | 3 | 12 | 59 |
| Sa Kaeo | 25 | 4 | 6 | 4 | 5 | 3 | 12 | 59 |
| Bangkok | 22 | 4 | 6 | 3 | 5 | 3 | 12 | 55 |

Municipality level: 49 municipalities have registered population (DOPA Dec 2568). Other indicators are province-level only — the frontend should show the parent province value and label it so.

## Gaps (no free, official, province-level source found in this pass)

| Need | Lens | Status | Best lead |
|---|---|---|---|
| Crime / safety by province | retirement, families | Royal Thai Police publishes national totals only (2565: 918,073 cases). Some provinces post their own on data.go.th (e.g. Amnat Charoen, Sing Buri, Surin), not all 77. | Ask RTP / depa for province crime counts; or NSO SYB ch.9 (national only). |
| Hospital beds by province | retirement, families | MOPH health-resource report (spd.moph.go.th) returns 403; NSO SYB T5.8 is national. ~20 provinces publish their own on data.go.th. | MOPH Health Data Center (HDC) or the GIS health resource report — needs a Thai IP or request. |
| Building/construction permits by province | growth | NSO SYB T12.6 by region only. | Department of Public Works & Town Planning or NSO provincial statistical reports (77 separate sites). |
| Average wages / salaries by province | talent | LFS wage tables are national/regional in the open API; only minimum wage by province included. | NSO LFS microdata (free with registration) or SSO contributor wages. |
| Graduates by province | talent | Only enrolment (current students) fetched. | MHESI dataset “ผู้สำเร็จการศึกษา” on data.go.th (same publisher) — next fetch. |
| Market land/property prices | retirement, growth | Only official Treasury appraisal (not market). | REIC (Government Housing Bank) — public dashboards, licence unclear. |
| GPP 2024 (2567) | growth | NESDC released 2567 GPP (seen in Samut Sakhon mirror, 433,722 MB) but no national CSV. Dataset uses 2023 (latest in NSO yearbook). | 77 provincial gdcatalog mirrors of nesdc-gpp-dashboard. |
| Urban green space per capita | retirement, families | Only forest cover (province scale). | Municipal GIS / ONEP — not open. |
| Public transport / commute | mobility | No province-level open indicator found. | OTP/DLT; GTFS feeds for Bangkok/Phuket/Khon Kaen. |
| Renewable energy / solar rooftop | energy | Not fetched. | ERC / PEA rooftop registrations. |
| Governance quality (ITA scores, e-services) | governance | Not fetched. | NACC ITA open data (itas.nacc.go.th) per local government. |
| Province-level electricity after 2566 | energy | Ministry of Energy file ends 2566. | PEA/MEA annual reports. |

## Unverified / needs a human check

- **depa label status of the 21 areas not in the 2568 renewal list.** They received 2-year labels in 2564–2566; the 4 Sep 2568 announcement renews 16 for 6 years and adds Phuket Tinicon Valley. Whether the other 21 still hold a valid label (e.g. via a separate renewal) was not found. cities.csv says “renewal not found”, not “expired”.
- **depa’s page says 37 cities as of Aug 2568, and 190 promotion zones / 227 proposals as of Jan 2569.** The promotion-zone list was not parsed.
- **MOPH physician counts:** the sheet does not say whether private-hospital doctors are included.
- **DBD registered-capital unit** is taken as million THB from the dataset label.
- **Customs checkpoint → province mapping** is by checkpoint name (fetch/checkpoint_province_map.tsv). 9 small trade-relief points with unclear location were left unmapped (total < 0.2 billion THB). Sangkhla Buri imports (≈65.6 billion THB) probably include pipeline gas.
- **Border trade with Cambodia** was 0 in Dec 2568 (DFT). Check the current crossing status before calling Sa Kaeo/Trat “border-investment” cities.
- **Minimum wage** is the Jan 2568 rate; later 2568 changes, if any, are not reflected.

## Export for the sciti repo (incoming/sciti_incoming.csv)

3,400 rows, 39 indicator ids, 77 provinces. Schema = data/SCHEMA.md on branch cursor/sciti-baseline-v2-cdc9 (validated with the same rules as ingest/incoming.mjs).

| indicator_id | periods | provinces (latest period) |
|---|---|---|
| economy.boi_jobs | 2025 | 67 |
| economy.boi_projects | 2025 | 67 |
| economy.border_trade | 2024 | 25 |
| economy.eec | 2026 | 77 |
| economy.gini | 2023 | 77 |
| economy.gpp | 2021, 2022, 2023 | 77 |
| economy.gpp_per_capita | 2023 | 77 |
| economy.gpp_real_growth | 2023 | 77 |
| economy.inflation | 2024 | 76 |
| economy.investment | 2024, 2025 | 67 |
| economy.minimum_wage | 2025 | 77 |
| economy.new_firms | 2025 | 77 |
| economy.new_firms_per_10k | 2025 | 77 |
| economy.sez | 2026 | 77 |
| economy.tourism_receipts | 2025 | 77 |
| economy.tourism_receipts_foreign | 2025 | 77 |
| economy.unemployment | 2025 | 77 |
| economy.visitors | 2025 | 77 |
| economy.visitors_foreign | 2025 | 77 |
| energy.electricity | 2023 | 77 |
| energy.ev_charging | 2023 | 77 |
| env.forest_cover | 2024 | 77 |
| env.pm25_annual | 2025 | 61 |
| env.pm25_bad_days | 2025 | 61 |
| env.pm25_bad_days_worst | 2025 | 61 |
| env.waste_per_person | 2024 | 77 |
| governance.digital_trainees_per_1000 | 2025 | 76 |
| governance.smart_city_areas | 2025 | 77 |
| living.doctors | 2022, 2023, 2024 | 77 |
| living.doctors_per_10k | 2024 | 77 |
| living.hotel_occupancy | 2025 | 77 |
| living.land_price | 2026 | 77 |
| mobility.road_deaths | 2024, 2025 | 77 |
| people.internet_households | 2026 | 77 |
| people.labour_force | 2025 | 77 |
| people.population | 2024, 2025 | 77 |
| people.tertiary | 2025 | 74 |
| people.tertiary_per_1000 | 2025 | 74 |
| people.unregistered_share | 2025 | 77 |

Site priority gaps: investment (economy.investment, BOI) ✔; border trade (economy.border_trade, 25 border provinces) ✔ and SEZ (economy.sez 1/0 for all 77) ✔; tertiary students (people.tertiary) ✔; doctors (living.doctors, living.doctors_per_10k) ✔ but **hospital beds (living.beds) still missing**; visitors and receipts (economy.visitors, economy.tourism_receipts) ✔; electricity (energy.electricity, 2023) ✔; GPP for all 77 for 2021–2023 (economy.gpp) ✔; land price (living.land_price, official appraisal) partial.
