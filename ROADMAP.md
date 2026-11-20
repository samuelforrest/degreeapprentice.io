# Roadmap

Order matters: each step should be pulling its weight before the next starts.

## Now: launch

- [x] Import every live degree apprenticeship from GOV.UK (232 listings)
- [ ] Add employers who only recruit on their own sites (PwC, Deloitte, KPMG, BAE, Rolls-Royce…)
- [ ] Run the GOV.UK importer weekly (a scheduled GitHub Action)
- [ ] Choose the final name and domain (then update `src/config/site.ts`)
- [ ] Deploy (Vercel or any static-friendly host) and submit the sitemap to Google Search Console
- [ ] Add privacy-friendly analytics (e.g. Plausible) and update the privacy page

## Next: keep data fresh

- [ ] Scheduled job that opens an issue for listings whose `closes` has passed, or whose `last_verified` is older than 90 days
- [ ] Link checker for `apply_url` / `source_url` in CI

## Later: only once students are coming back

- [ ] Employer profiles and clearly labelled featured listings (the revenue model; see About)
- [ ] CV and cover letter feedback, rate-limited, with a cost model worked out first
- [ ] Application tracker (accounts optional; the first build was removed to keep v1 focused)
