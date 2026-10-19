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
| `mobility.broadband` | Broadband. Do not send a count of open datasets under this id. | no |

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
