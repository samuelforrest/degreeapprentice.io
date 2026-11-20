# Downloads every live Level 6 and 7 vacancy from GOV.UK Find an apprenticeship.
# Usage: python3 fetch.py <work dir>
import os, re, sys, time, urllib.request

BASE = "https://www.findapprenticeship.service.gov.uk"
work = sys.argv[1]
os.makedirs(os.path.join(work, "detail"), exist_ok=True)

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (degreeapprentice.io importer)"})
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8")

ids = set()
# Search results aren't returned in a stable order, so page through every sort
# order and combine the IDs to make sure nothing is skipped.
for sort in ["AgeAsc", "ClosingAsc", "ExpectedStartDateAsc", "SalaryDesc"]:
    page = 1
    while True:
        html = get(f"{BASE}/apprenticeships?levelIds=6&levelIds=7&sort={sort}&pageNumber={page}")
        found = set(re.findall(r'href="/apprenticeship/(VAC\d+)"', html))
        if not found:
            break
        ids |= found
        page += 1
        time.sleep(0.25)
print(f"{len(ids)} vacancies")

for vid in sorted(ids):
    path = os.path.join(work, "detail", f"{vid}.html")
    if not os.path.exists(path):
        with open(path, "w", encoding="utf-8") as f:
            f.write(get(f"{BASE}/apprenticeship/{vid}"))
        time.sleep(0.25)
