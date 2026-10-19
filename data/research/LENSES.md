# LENSES — "Moneyball for the urban economy"

The idea is to judge cities on numbers that actually predict an outcome, not on reputation. Each lens is a persona, a question they ask, and a set of indicators that have a direction.

The "moneyball" move is to look for places where the **fundamentals score high but the price is low**. Price here means official land appraisal, the minimum wage and inflation. Those places are undervalued.

How the frontend should compute a lens:
- Z-score each indicator across the 77 provinces. Log-transform the skewed ones: land, border trade, BOI per capita, tourism per resident, density, labour force, foreign visitors and EV kWh.
- Flip the sign where lower is better.
- Average the scores, with equal weights unless the user moves sliders.
- Score a province only if it has at least 60% of the lens indicators. Show how many it has.

`fetch/lens_preview.py` does exactly this. Its output, `lens_scores_preview.csv`, is **illustrative only**: equal weights, no expert calibration, and not an official ranking.

All indicator ids are defined in `indicators_catalog.csv`.

## 1. Growth seeker ("grow a lot, ecology not a constraint")
**Question:** where is money, firm formation and population momentum strongest?
**Indicators (+ = good):**
- + `gpp_real_cagr_2y` (NESDC chain volume)
- + `gpp_per_capita`
- + `pop_growth_cagr_3y` (DOPA)
- + `boi_investment_per_capita` (BOI 2568)
- + `new_firms_per_10k` and + `new_firms_growth` (DBD)
- + `latent_pop_night_ratio` (NSO: unregistered residents, i.e. people moving in faster than the register shows)

Context to show next to the score, but not scored: `tourism_revenue_per_resident`, `electricity_per_capita` and `border_customs_trade`.
**Illustrative top 10:** Phuket, Chon Buri, Rayong, Bangkok, Pathum Thani, Samut Prakan, Samut Sakhon, Nonthaburi, Chachoengsao, Nakhon Pathom.
**Moneyball variant:** growth score minus z(`land_appraisal_median`). This finds fast-growing provinces where land is still cheap.

## 2. Quiet retirement
**Question:** where is the air clean, the roads safe and a doctor close, at a low cost and with little crowding?
**Indicators:**
- − `pm25_exceed_days_median` and − `pm25_annual_mean` (PCD 2568)
- − `road_deaths_per_100k` (DDC RTDDI 2568)
- + `doctors_per_10k` (MOPH 2567)
- − `pop_density`
- + `forest_cover_share`
- − `land_appraisal_median` (Treasury)
- − `inflation_cpi`

Context: `pop_age60plus_share`, which shows existing retiree communities.
**Not yet available:** crime by province and hospital beds (see COVERAGE.md gaps). These matter a lot for this persona, so label the score "without safety data".
**Illustrative top 10:** Mae Hong Son, Ranong, Lampang, Tak, Yala, Nakhon Si Thammarat, Satun, Phatthalung, Chiang Mai, Phang Nga.
Note: the worst-station PM2.5 (`pm25_exceed_days_max`) is very different in the north. Show both, and warn that the 16 provinces without a PCD station have no PM2.5 value.

## 3. Talent + border investment
**Question:** where can I hire skilled people and reach the Mekong/ASEAN neighbours?
**Indicators:**
- + `university_students_per_1000` and + `postgrad_share` (MHESI AY2568)
- + `labour_force` (NSO LFS 2568)
- + `households_internet_share` (NSO ICT 2569Q2)
- + `border_customs_trade` (Customs 2567, land/river checkpoints only)
- − `minimum_wage_daily` (from the employer's view)
- + `boi_jobs`

Flags, not scored:
- `border_sez` (10 Border SEZs)
- `eec` (Chachoengsao, Chon Buri, Rayong)
- `border_trade_by_country_2568.csv` (national DFT totals: Malaysia 315.1 bn, Laos 293.4 bn, Myanmar 193.7 bn and Cambodia 92.0 bn THB in 2568; Cambodia was 0 in December 2568)

**Illustrative top 10:** Bangkok, Chon Buri, Pathum Thani, Maha Sarakham, Songkhla, Ranong, Nakhon Pathom, Yasothon, Rayong, Samut Sakhon.
**Border shortlist (SEZ provinces, by border customs trade 2567):** see `border_checkpoints_2567.csv`. The largest are Songkhla (Sadao, Padang Besar), Mukdahan, Sa Kaeo (Khlong Luek/Aranyaprathet), Nong Khai, Nakhon Phanom, Chiang Rai (Chiang Khong, Mae Sai, Chiang Saen), Tak (Mae Sot) and Kanchanaburi (Sangkhla Buri, which probably includes pipeline gas).

## Proposed extra lenses (indicators already in the dataset)
| Lens | Question | Indicators (direction) | Missing for a complete lens |
|---|---|---|---|
| **Young families** | Safe, healthy, affordable, with schools and jobs | + doctors_per_10k, − pm25_exceed_days_median, − road_deaths_per_100k, + households_internet_share, + university_students_per_1000, − land_appraisal_median, − unemployment_rate | school quality (O-NET by province, NIETS), childcare places, crime |
| **Logistics / industrial investor** | Where to put a plant or a DC | + border_customs_trade, + boi_investment_per_capita, + electricity_per_capita, + labour_force, − minimum_wage_daily; flags eec, border_sez | industrial-estate land price (IEAT), port/rail distance, truck volumes (DLT) |
| **Remote worker / digital nomad** | Good internet, clean air, cheap, lively | + households_internet_share, − pm25_exceed_days_median, − land_appraisal_median, + new_firms_per_10k, + visitors_foreign, + doctors_per_10k | co-working count, rent levels, broadband speed (Ookla open data, CC BY-NC-SA, non-commercial only) |
| **Tourism operator** | Demand and international mix | + tourism_revenue_per_resident, + visitors_foreign, + hotel_occupancy, + forest_cover_share, − pm25_exceed_days_median | seasonality (monthly MOTS sheets are in the same xlsx), airport seats |

Illustrative top 10s:
- Families: Bangkok, Maha Sarakham, Khon Kaen, Nakhon Pathom, Pathum Thani, Yala, Nong Bua Lamphu, Phitsanulok, Songkhla, Sakon Nakhon
- Logistics: Bangkok, Samut Sakhon, Rayong, Samut Prakan, Saraburi, Pathum Thani, Prachin Buri, Phra Nakhon Si Ayutthaya, Chon Buri, Songkhla
- Remote work: Bangkok, Phuket, Chon Buri, Surat Thani, Rayong, Songkhla, Chiang Mai, Khon Kaen, Phang Nga, Krabi
- Tourism: Phuket, Phang Nga, Chiang Mai, Chon Buri, Krabi, Surat Thani, Phetchaburi, Bangkok, Prachuap Khiri Khan, Kanchanaburi

## Caveats to show in the UI
- All values are province level except `pop_registered` for 49 municipalities. A municipality inherits its province's value for every other indicator, and the UI must say so.
- Different years are mixed: GPP 2023, BOI/DBD/MOTS/PCD/RTDDI 2025, Customs and doctors 2024, and Energy 2023. Show the `period` field.
- Per-capita values use the DOPA house register. In places with many unregistered residents (Bangkok, Phuket, Chon Buri and Samut Sakhon; see `latent_pop_night_ratio`), "per resident" figures come out too high.
