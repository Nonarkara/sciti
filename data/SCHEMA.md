# Incoming figures

A research file dropped in `data/incoming` is read on the next ingest. Use `.csv` or `.json`. Rows that fail the checks below are rejected and listed in `baseline.incoming.rejected`. They are not stored as zero.

The built-in job keeps a figure the file does not mention. If the file repeats the same province, indicator and period, the incoming row replaces that one observation.

## Required columns

| Column | Meaning |
| --- | --- |
| `place_id` | Province id, `th-10` for Bangkok through `th-96`. Lower case. |
| `indicator_id` | Stable id. Use one from the list below when it matches. A new id is kept if it matches `^[a-z][a-z0-9_.]*$`. |
| `period` | `YYYY`, `YYYY-MM`, `YYYY-MM-DD`, or `YYYY-MM-DDTHH`. |
| `value` | A finite number. Blank is rejected. Zero is allowed when the source really says zero. |
| `unit` | The unit, in words. |
| `as_of` | The date the figure was current, `YYYY-MM-DD`. |
| `source_url` | `http` or `https` link to the file or page a reader can open. |
| `publisher` | The office that published the figure. |
| `licence` | SPDX id or a short name. Write `not stated` when the file itself does not give a licence. |

## Optional columns

| Column | Meaning |
| --- | --- |
| `source_name` | Shorter label for the source. |
| `note` | One sentence on how the figure was read. It becomes the method text for a new indicator. |
| `area` | One of `environment`, `economy`, `mobility`, `energy`, `people`, `living`, `governance`, or `other`. |
| `direction` | `higher` or `lower`. Default is `higher`. |
| `name_en`, `name_th`, `name_zh` | Names for a new indicator. An empty Thai or Chinese name is shown in English. |

JSON is either an array of those objects, or `{ "observations": [ ... ] }`.

## Stable ids

These ids are already named on the site. Send the same id and the row fills that line.

| Id | What it is | Derived? |
| --- | --- | --- |
| `people.population` | Registered population | no |
| `economy.gpp` | Gross provincial product, million baht | no |
| `economy.investment` | Investment | no |
| `env.pm25` | PM2.5 for one hour | no |
| `env.aqi` | Air quality index for one hour | no |
| `mobility.vehicles` | Registered vehicles, stock | no |
| `living.beds` | Hospital beds | no |
| `governance.datasets` | Open datasets in the catalog | no |
| `energy.electricity` | Electricity use | no |
| `market.price` | A price series | no |
| `market.reputation` | A reputation series | no |
| `people.tertiary` | Tertiary students or a skilled-worker count | no |
| `people.schools` | Schools | no |
| `economy.border_trade` | Cross-border trade value | no |
| `economy.sez` | Special economic zone, `1` or `0` for every province | no |
| `economy.visitors` | Visitors | no |
| `economy.tourism_receipts` | Tourism receipts | no |
| `mobility.broadband` | Broadband speed. Do not send a count of open datasets, or a household-internet share, under this id. | no |
| `living.land_price` | Official land appraisal. Not a market price. | no |
| `living.doctors` | Physicians. The sheet may omit private hospitals. | no |
| `living.doctors_per_10k` | Physicians per 10,000 registered people. | no |
| `living.density` | People per square kilometre. Do not send a population count under this id. | no |
| `env.pm25_bad_days` | Days PM2.5 was over the standard. Not the hourly reading. | no |
| `economy.gpp_real_growth` | One year of real output growth, in percent. | no |
| `economy.new_firms` | New juristic persons. | no |
| `economy.new_firms_per_10k` | New juristic persons per 10,000 people. | no |
| `economy.eec` | Eastern Economic Corridor, `1` or `0` for every province. | no |
| `economy.minimum_wage` | Statutory daily minimum wage. Not an average wage. | no |
| `economy.unemployment` | Unemployment rate. | no |
| `economy.visitors_foreign` | Foreign visitor trips. | no |
| `people.tertiary_per_1000` | Tertiary students per 1,000 people. | no |
| `people.internet_households` | Households with internet. Not a broadband speed. | no |
| `mobility.road_deaths` | Road deaths per 100,000 people. | no |
| `energy.electricity` | Electricity use. | no |
| `governance.emergency_decree` | `1` if any district is under the serious emergency decree, otherwise `0`, for every province. Not a crime count. The built-in table fills this. Do not send a partial list. | no |

`data/incoming/sciti_incoming.csv` is the cited file: 3,400 rows, 77 provinces. `data/research/` holds the city list, the indicator catalog, the depa table, and the notes on sources, coverage and lenses.

These are still empty. A blank is not stored as zero.

| Id | What is missing |
| --- | --- |
| `living.beds` | Hospital beds by province |
| `living.density` | Density. Population is in the file. Province area is not. |
| `governance.crime` | Provincial crime. The decree line above is not this. |
| `economy.permits` | Construction permits |
| `economy.wages` | Average wages. The minimum wage is a different series. |
| `people.graduates` | Graduates. Enrolment is a different series. |
| `people.schools` | Schools |
| `market.price` | A market sale price. The appraisal is `living.land_price`. |
| `market.reputation` | Reputation |
| `economy.gpp_2024` | Gross provincial product for 2024. 2021–2023 are under `economy.gpp`. |
| `env.green_space` | Urban green space. Forest cover is a different series. |
| `mobility.transit` | Transit use |
| `mobility.broadband` | Broadband speed |
| `governance.quality` | Governance quality |

These three are computed. Do not put them in the file.

| Id | How it is made |
| --- | --- |
| `people.population_cagr` | Compound yearly change in `people.population` |
| `economy.gpp_cagr` | Compound yearly change in `economy.gpp` |
| `mobility.vehicles_per_person` | `mobility.vehicles` divided by the latest `people.population` |

A yes or no such as `economy.sez` has to be `1` or `0` for every province. A list of only the yeses cannot rank the provinces that were left out, and a yes or no on its own does not publish an order.

## Example

```csv
place_id,indicator_id,period,value,unit,as_of,source_url,publisher,licence,area,direction,name_en,name_th,name_zh
th-10,people.tertiary,2024,1200,people,2024-06-01,https://example.ac.th/students.csv,Example university,not stated,people,higher,Tertiary students,นักศึกษาระดับอุดมศึกษา,高等教育在校生
```
