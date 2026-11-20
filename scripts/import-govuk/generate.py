# Turns parsed GOV.UK Find an apprenticeship vacancies into content/roles/*.md files.
# Usage: python3 generate.py <vacancies.json> <content/roles> <postcodes.json>
import datetime, glob, sys, os, re, json, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from naming import listing_slug

V = json.load(open(sys.argv[1])); OUT = sys.argv[2]; PCACHE = sys.argv[3]

COMPANY = {
    'WSP UK LIMITED': ('WSP', 'https://www.wsp.com'), 'STANTEC UK LIMITED': ('Stantec', 'https://www.stantec.com'),
    'AMAZON UK SERVICES LTD.': ('Amazon', 'https://www.amazon.co.uk'), 'THALES UK LIMITED': ('Thales', 'https://www.thalesgroup.com'),
    'Arcadis': ('Arcadis', 'https://www.arcadis.com'), 'DALCOUR MACLAREN LIMITED': ('Dalcour Maclaren', None),
    'Lloyds Banking Group': ('Lloyds Banking Group', 'https://www.lloydsbankinggroup.com'), 'BAM NUTTALL LIMITED': ('BAM Nuttall', None),
    'SIEMENS MOBILITY LIMITED': ('Siemens Mobility', 'https://www.siemens.com'), 'DEVONPORT ROYAL DOCKYARD LIMITED': ('Babcock International', 'https://www.babcockinternational.com'),
    'CAVENDISH NUCLEAR LIMITED': ('Cavendish Nuclear', None), 'TKMS ATLAS UK LIMITED': ('TKMS Atlas UK', None),
    'TROWERS & HAMLINS LLP': ('Trowers & Hamlins', None), 'Babcock International': ('Babcock International', 'https://www.babcockinternational.com'),
    'AWE PLC': ('AWE', 'https://www.awe.co.uk'), 'FGP Surveyors Limited': ('FGP Surveyors', None),
    'WM MORRISON SUPERMARKETS P L C': ('Morrisons', 'https://www.morrisons.com'), 'MHA': ('MHA', None),
    'BABCOCK INTEGRATED TECHNOLOGY LIMITED': ('Babcock International', 'https://www.babcockinternational.com'),
    'Molson Coors Beverage Company': ('Molson Coors', 'https://www.molsoncoors.com'), 'CAPGEMINI UK PLC': ('Capgemini', 'https://www.capgemini.com'),
    'BBC Public Service': ('BBC', 'https://www.bbc.co.uk'), 'CISCO INTERNATIONAL LIMITED': ('Cisco', 'https://www.cisco.com'),
    'Network Rail': ('Network Rail', 'https://www.networkrail.co.uk'), 'PA Consulting': ('PA Consulting', 'https://www.paconsulting.com'),
    'PAUL BASHAM ASSOCIATES LTD': ('Paul Basham Associates', None), 'Method Consulting Llp': ('Method Consulting', None),
    'CRANSWICK PLC': ('Cranswick', 'https://www.cranswick.plc.uk'), 'TLT LLP': ('TLT', 'https://www.tlt.com'),
    'BASKETDROP LTD.': ('Basketdrop', None), 'HARDCASTLE BURTON LLP': ('Hardcastle Burton', None),
    'HANSON QUARRY PRODUCTS EUROPE  LIMITED': ('Hanson', None), 'Babcock Technology Centre': ('Babcock International', 'https://www.babcockinternational.com'),
    'BABCOCK MISSION CRITICAL SERVICES UK LIMITED': ('Babcock International', 'https://www.babcockinternational.com'),
    'Halo': ('Halo', None), 'PORTLAND FUEL LIMITED': ('Portland Fuel', None), 'WHIRLEDGE & NOTT LIMITED': ('Whirledge & Nott', None),
    'Lear Corportation': ('Lear Corporation', 'https://www.lear.com'), 'Actemium Design': ('Actemium', None),
    'SIEMENS PUBLIC LIMITED COMPANY': ('Siemens', 'https://www.siemens.com'), 'ABACUS ARK LTD': ('Abacus Ark', None),
    'Higgs LLP': ('Higgs LLP', None), 'ALMAC PHARMA SERVICES LIMITED': ('Almac', 'https://www.almacgroup.com'),
    'QIAGEN MANCHESTER LIMITED': ('QIAGEN', 'https://www.qiagen.com'), 'EDWARDS LIMITED': ('Edwards', None),
    'Clarke and Simpson': ('Clarke and Simpson', None), 'ACTIVATE MANAGEMENT LIMITED': ('Activate Management', None),
    'Yunex Traffic': ('Yunex Traffic', None), 'HOLLIS GLOBAL LIMITED': ('Hollis', 'https://www.hollisglobal.com'),
    'Be Real Estate': ('Be Real Estate', None), 'HORSELL CHILDCARE LIMITED': ('Horsell Childcare', None),
    'LONDON & SURREY MONTESSORI SCHOOLS LTD': ('London & Surrey Montessori Schools', None), 'BAM CONSTRUCT UK LIMITED': ('BAM Construct', None),
    'Office of Communications (Ofcom)': ('Ofcom', 'https://www.ofcom.org.uk'), 'Seymour Taylor': ('Seymour Taylor', None), 'SVG IT LTD': ('SVG IT', None),
}

COURSE_SECTORS = [
    (r'civil engineer', ['Engineering', 'Construction & Property']),
    (r'surveyor|site management|geospatial', ['Construction & Property']),
    (r'building services', ['Engineering', 'Construction & Property']),
    (r'rail', ['Engineering', 'Transport & Logistics']),
    (r'digital and technology|machine learning|data scientist|user experience', ['Technology']),
    (r'broadcast', ['Creative & Media', 'Engineering']),
    (r'journalist', ['Creative & Media']),
    (r'engineer|manufacturing|scientist and nuclear', ['Engineering']),
    (r'accountancy|accounting', ['Accounting & Audit']),
    (r'solicitor', ['Law']),
    (r'financial services', ['Banking & Finance']),
    (r'project manager|project controls|sales professional', ['Business & Management']),
    (r'teacher|academic', ['Education']),
    (r'food industry|retail', ['Consumer & Retail']),
    (r'supply chain', ['Transport & Logistics']),
    (r'environmental', ['Energy & Utilities']),
    (r'scientist', ['Healthcare & Life Sciences']),
    (r'social researcher', ['Public Sector']),
]
EMPLOYER_SECTORS = {
    'Thales': 'Defence & Aerospace', 'AWE': 'Defence & Aerospace', 'Babcock International': 'Defence & Aerospace',
    'Babcock (Devonport Royal Dockyard)': 'Defence & Aerospace', 'TKMS Atlas UK': 'Defence & Aerospace', 'Cavendish Nuclear': 'Energy & Utilities',
    'Lloyds Banking Group': 'Banking & Finance', 'BBC': 'Creative & Media', 'Network Rail': 'Transport & Logistics',
    'Siemens Mobility': 'Transport & Logistics', 'Yunex Traffic': 'Transport & Logistics', 'Ofcom': 'Public Sector',
    'Morrisons': 'Consumer & Retail', 'Molson Coors': 'Consumer & Retail', 'Cranswick': 'Consumer & Retail', 'Amazon': 'Technology',
    'Cisco': 'Technology', 'Capgemini': 'Consulting', 'PA Consulting': 'Consulting', 'Portland Fuel': 'Energy & Utilities',
    'WSP': 'Consulting', 'Stantec': 'Consulting', 'Arcadis': 'Consulting',
}

COUNTIES = {'west midlands', 'greater manchester', 'merseyside', 'kent', 'surrey', 'essex', 'hampshire', 'devon', 'dorset', 'buckinghamshire',
    'oxfordshire', 'berkshire', 'hertfordshire', 'lancashire', 'yorkshire', 'north yorkshire', 'west yorkshire', 'south yorkshire',
    'east yorkshire', 'cheshire', 'cumbria', 'cumberland', 'derbyshire', 'nottinghamshire', 'leicestershire', 'lincolnshire', 'norfolk',
    'suffolk', 'somerset', 'wiltshire', 'gloucestershire', 'worcestershire', 'warwickshire', 'staffordshire', 'shropshire',
    'northamptonshire', 'cambridgeshire', 'bedfordshire', 'central bedfordshire', 'tyne and wear', 'county durham', 'cornwall',
    'west sussex', 'east sussex', 'middlesex', 'gb', 'uk', 'england', 'scotland', 'wales', 'herts', 'west berkshire'}
STREETY = re.compile(r'\d|\b(street|st|road|rd|lane|ln|way|wy|avenue|ave|place|park|square|row|court|house|building|centre|center|close|drive|quay|green|walk|business|estate|floor|unit|dockyard|hq|campus|station|wharf|plaza|gate|crescent|terrace|parade|mews|yard|works|limited|ltd|llp|plc|corporation|barns?|offices?|hall|tower|point|forum|quadrant|senate|mailbox|establishment|exchange|interchange|priory|royal|riverview|cottages?)\b', re.I)

SMALL = {'Of', 'And', 'The', 'For', 'In', 'On', 'At', 'Upon'}
KEEP_UPPER = {'UK', 'LLP', 'PLC', 'NHS', 'BPP', 'QA', 'IT', 'UCL', 'UWE', 'KTN', 'LTD'}

def nice_case(s):
    words = s.title().split(' ')
    out = []
    for i, w in enumerate(words):
        if w.upper() in KEEP_UPPER: out.append(w.upper())
        elif i > 0 and w in SMALL: out.append(w.lower())
        else: out.append(w)
    return ' '.join(out).replace("'S ", "'s ")

def clean_place(s):
    s = s.strip().strip(',')
    return nice_case(s) if s.isupper() or re.search(r'\b(Of|And|The)\b', s) else s

# Postcode -> (region, admin_district), cached so reruns don't hit the API.
cache = json.load(open(PCACHE)) if os.path.exists(PCACHE) else {}
need = sorted({pc for v in V for _, pc in v['addrs'] if pc not in cache})
for i in range(0, len(need), 100):
    req = urllib.request.Request('https://api.postcodes.io/postcodes', data=json.dumps({'postcodes': need[i:i + 100]}).encode(),
                                 headers={'Content-Type': 'application/json'})
    for r in json.load(urllib.request.urlopen(req))['result']:
        res = r['result']
        cache[r['query']] = [res['region'], res['admin_district'], res['country']] if res else None
json.dump(cache, open(PCACHE, 'w'))

TOWN_FIX = {'Kingston Upon Hull': 'Hull', 'Kingston upon Hull': 'Hull', 'Newcastle Upon Tyne': 'Newcastle upon Tyne',
    'Burton On Trent': 'Burton upon Trent', 'Burton on Trent': 'Burton upon Trent', 'City of Milton Keynes': 'Milton Keynes',
    'Milton Keynes': 'Milton Keynes', 'Tynemouth North Shields': 'North Shields', 'Stoke-On-Trent': 'Stoke-on-Trent',
    'St. Helens': 'St Helens', 'Sutton-in-Ashield': 'Sutton-in-Ashfield', 'Bournemouth, Christchurch and Poole': 'Bournemouth',
    'Christchurch and Poole': 'Bournemouth', 'Cumberland': 'Carlisle', 'Central Bedfordshire': 'Bedfordshire',
    'West Northamptonshire': 'Northampton', 'North Northamptonshire': 'Kettering', 'Herts': None, 'GB': None}

def fix_town(t):
    t = re.sub(r',?\s*(United Kingdom|Suffolk|Wiltshire|UK|GB)$', '', t)
    return TOWN_FIX.get(t, t)

def town_for(cand, pc):
    info = cache.get(pc)
    if info and info[0] == 'London': return 'London'
    if cand and not STREETY.search(cand) and cand.lower() not in COUNTIES and len(cand) < 30 and fix_town(clean_place(cand)):
        return fix_town(clean_place(cand))
    if info and info[1]:
        return fix_town(re.sub(r', City of$', '', info[1]))
    return None

def clean_provider(p):
    p = clean_place(p)
    p = re.sub(r',? the$', '', p, flags=re.I)
    p = re.sub(r'^The ', '', p)
    p = {'Sccu': 'SCCU', 'Cu Apprenticeships (Better Futures)': 'CU Apprenticeships (Better Futures)'}.get(p, p)
    p = re.sub(r' (Public Limited Company|Limited|Ltd\.?|PLC|Infrastructure Limited)$', '', p, flags=re.I)
    p = re.sub(r' (Limited|Financial|Infrastructure)$', '', p) if p.startswith(('Kaplan', 'Network Rail')) else p
    return {'Awe': 'AWE', 'Awe PLC': 'AWE'}.get(p, p)

def slugify(s):
    s = s.lower().replace('&', ' and ')
    s = re.sub(r'\(.*?\)', ' ', s)
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s

def money(n): return int(n.replace(',', '').split('.')[0])

def wage(w):
    if not w or w == 'Competitive': return None, None, 'Competitive'
    m = re.fullmatch(r'£([\d,.]+) a year', w)
    if m: return money(m.group(1)), None, None
    m = re.fullmatch(r'£([\d,.]+) to £([\d,.]+) a year', w)
    if m: return money(m.group(1)), money(m.group(2)), None
    if 'depending on your age' in w: return None, None, 'Apprentice minimum wage or above, depending on age'
    return None, None, w[:120]

def course_name(c):
    return re.sub(r'\s*\((degree|integrated degree|Degree)\)', '', re.sub(r'\s*\(level \d\)', '', c)).strip()

def requirements(reqs):
    out, prefix = [], ''
    for r in reqs:
        if r.endswith(' in:'): prefix = r[:-4]; continue
        if r.startswith('Share if you have'): continue
        r = re.sub(r'\(grade (grade\s*)?', '(', r, flags=re.I)  # "(grade Grade 4-9)" -> "(4-9)"
        r = re.sub(r'\s+', ' ', r).strip()
        if prefix and not r.lower().startswith(prefix.lower()):
            r = f'{prefix}: {r}'
        out.append(r)
    return out

def y(v):  # YAML scalar
    if v is None: return 'null'
    if isinstance(v, bool): return 'true' if v else 'false'
    if isinstance(v, int): return str(v)
    return json.dumps(v, ensure_ascii=False)

# A vacancy keeps its filename across re-runs: find files already pointing at it.
existing = {}
for f in glob.glob(os.path.join(OUT, '*.md')):
    m = re.search(r'findapprenticeship\.service\.gov\.uk/apprenticeship/(VAC\d+)', open(f).read())
    if m: existing[m.group(1)] = os.path.basename(f)[:-3]
taken = {os.path.basename(f)[:-3] for f in glob.glob(os.path.join(OUT, '*.md'))}

used, written = set(), 0
SKIP = {'VAC2000062769'}  # already listed by hand: lloyds-banking-group-digital-and-technology-solutions-manchester-2027.md
for v in V:
    if v['id'] in SKIP: continue
    v['title'] = re.sub(r'^Job Posting Title:?\s*', '', v['title']).strip()
    company, website = COMPANY.get(v['employer'], (v['employer'], None))
    if not website and v['website'] and v['website'].startswith('https://'):
        website = re.match(r'https://[^/]+', v['website']).group(0)
    towns = []
    for cand, pc in v['addrs']:
        t = town_for(cand, pc)
        if t and t not in towns: towns.append(t)
    sectors = []
    for pat, secs in COURSE_SECTORS:
        if re.search(pat, v['course'], re.I): sectors = list(secs); break
    es = EMPLOYER_SECTORS.get(company)
    if es and es not in sectors: sectors.append(es)
    sectors = sectors[:3] or ['Business & Management']
    smin, smax, snote = wage(v['wage'])
    reqs = requirements(v['reqs'])
    elig = '; '.join(reqs)
    if len(elig) > 200: elig = elig[:197].rsplit(';', 1)[0] + '…' if ';' in elig[:197] else elig[:197] + '…'
    num = v['id'].replace('VAC', '')
    if v['id'] in existing:
        slug = existing[v['id']]
    else:
        base = listing_slug(company, v['title'], towns, v['start'])
        slug, n = base, 2
        while slug in used or slug in taken:
            slug, n = f'{base}-{n}', n + 1
    used.add(slug)
    course = course_name(v['course'])
    url = f"https://www.findapprenticeship.service.gov.uk/apprenticeship/{v['id']}"
    provider = clean_provider(v['provider']) if v['provider'] else None

    # Description: written from the structured facts, not the employer's marketing copy.
    pos = v['positions']
    body = [f"A Level {v['level']} {course.lower()} apprenticeship with {company}"
            + (f", studying with {provider}" if provider else '') + '.']
    body.append('')
    body.append('## Key facts')
    body.append('')
    facts = [('Start date', v['start'] and datetime.date.fromisoformat(v['start']).strftime('%-d %B %Y')),
             ('Duration', v['duration']), ('Hours', v['hours']), ('Positions', pos),
             ('Training course', f"{course} (Level {v['level']})")]
    body += [f'- **{k}:** {val}' for k, val in facts if val]
    if not towns and v['location_note']:
        body += ['', '## Location', '', 'This role can be based in different places. See the full listing for where you could work.']
    if reqs:
        body += ['', '## Entry requirements', ''] + [f'- {r}' for r in reqs]
    body += ['', '## How to apply', '']
    body.append("Apply through GOV.UK Find an apprenticeship." + (" After signing in, you'll finish your application on the employer's website." if v['on_company_site'] else ''))

    fm = [
        ('title', v['title']), ('company', company), ('company_website', website), ('level', v['level']),
        ('sectors', sectors), ('locations', towns), ('salary', smin), ('salary_max', smax), ('salary_note', snote),
        ('duration', v['duration']), ('eligibility', elig or None), ('qualification', f"{course} (Level {v['level']})"),
        ('training_provider', provider), ('opens', v['posted']), ('closes', v['closes']), ('starts', v['start']),
        ('apply_url', url), ('source_url', url), ('last_verified', datetime.date.today().isoformat()),
    ]
    lines = ['---'] + [f"{k}: {json.dumps(val, ensure_ascii=False) if isinstance(val, list) else (val if k in ('opens', 'closes', 'starts', 'last_verified') and val else y(val))}" for k, val in fm] + ['---', '', *body, '']
    open(os.path.join(OUT, slug + '.md'), 'w').write('\n'.join(lines))
    written += 1
print('wrote', written)
