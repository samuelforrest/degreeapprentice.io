# GOV.UK importer

Pulls every live Level 6 and 7 apprenticeship from [Find an apprenticeship](https://www.findapprenticeship.service.gov.uk) into `content/roles/`.

```bash
WORK=$(mktemp -d)
python3 scripts/import-govuk/fetch.py "$WORK"
python3 scripts/import-govuk/parse.py "$WORK/detail" "$WORK/vacancies.json"
python3 scripts/import-govuk/generate.py "$WORK/vacancies.json" content/roles scripts/import-govuk/postcodes.json
bun run validate
```

- **Filenames** follow the site-wide scheme `{company}-{role}-{location}-{start year}.md` (see `naming.py`).
- **Re-running is safe.** Each file's apply link contains its GOV.UK vacancy number, so a vacancy keeps its filename and is updated in place. Hand-written listings aren't touched.
- **Closed vacancies are kept.** They show as "Closed" and are hidden unless "Show closed" is ticked. Delete the files if you'd rather drop them.
- **New employers** show up under their legal name, such as `ACME HOLDINGS LIMITED`. Add them to `COMPANY` in `generate.py` to give them a clean name and website.
- **Towns** come from each address's postcode via [postcodes.io](https://postcodes.io). Lookups are cached in `postcodes.json`.
- **Duplicates of hand-written listings** go in `SKIP` in `generate.py`.
- **Descriptions** are built from the vacancy's facts (course, provider, dates, entry requirements), not copied from the employer's advert.
