import sys, os, re, json, datetime
sys.path.insert(0, os.path.dirname(__file__))
from textify import lines

MONTHS = {m: i for i, m in enumerate(["january","february","march","april","may","june","july","august","september","october","november","december"], 1)}
TODAY = datetime.date.today()

def iso(s):
    m = re.search(r'(\d{1,2}) ([A-Za-z]+) (\d{4})', s or '')
    if not m or m.group(2).lower() not in MONTHS: return None
    return datetime.date(int(m.group(3)), MONTHS[m.group(2).lower()], int(m.group(1))).isoformat()

def sections(L):
    out, key = {}, '_head'
    for l in L:
        if l.startswith('@@h'):
            key = l[4:].strip().replace('’', "'")
            out.setdefault(key, [])
        else:
            out.setdefault(key, []).append(l)
    return out

def after(block, label):
    if label in block:
        i = block.index(label)
        return block[i + 1] if i + 1 < len(block) else None
    return None

def town(addr):
    addr = re.sub(r'\[\[.*?\]\]', '', addr).strip()
    m = re.match(r'^(.*?)\s*\(([A-Z0-9 ]+)\)$', addr)
    if m: return m.group(1).strip()
    parts = [p.strip() for p in addr.split(',') if p.strip()]
    if parts and re.match(r'^[A-Z]{1,2}[0-9][0-9A-Z]? ?[0-9][A-Z]{2}$', parts[-1]): parts = parts[:-1]
    return parts[-1] if parts else None

def parse(path):
    L = lines(path); S = sections(L)
    vid = os.path.basename(path)[:-5]
    title = L[0][4:].strip()
    head = L[1:6]
    employer = head[0]
    closes = None
    for l in head:
        if l.startswith('Closes'):
            if 'today' in l: closes = TODAY.isoformat()
            elif 'tomorrow' in l: closes = (TODAY + datetime.timedelta(days=1)).isoformat()
            else: closes = iso(l)
    posted = next((iso(l) for l in head if l.startswith('Posted')), None)
    summ = S.get('Summary', [])
    labels = ['Wage', 'Training course', 'Hours', 'Start date', 'Duration', 'Positions available']
    first_label = min([summ.index(x) for x in labels if x in summ] or [len(summ)])
    summary = ' '.join(summ[:first_label]).strip()
    wage = after(summ, 'Wage')
    wage_extra = None
    if 'Wage' in summ:
        i = summ.index('Wage') + 2
        rest = [x for x in summ[i:summ.index('Training course') if 'Training course' in summ else i] if not x.startswith('[[') and 'Minimum wage' not in x]
        wage_extra = ' '.join(rest) or None
    course = after(summ, 'Training course')
    hours = None
    if 'Hours' in summ:
        for x in summ[summ.index('Hours') + 1: summ.index('Start date') if 'Start date' in summ else None]:
            if re.search(r'hours? .*a week', x): hours = x
    start = iso(after(summ, 'Start date'))
    duration = after(summ, 'Duration')
    positions = after(summ, 'Positions available')
    where_key = next((k for k in S if k.startswith('Where you')), None)
    PC = r'([A-Z]{1,2}[0-9][0-9A-Z]? ?[0-9][A-Z]{2})'
    addrs = []  # (line before postcode, postcode)
    blk = [x for x in (S.get(where_key) or []) if not x.startswith('You can') and 'available in these locations' not in x and not x.startswith('[[')]
    acc = []
    for x in blk:
        if ',' in x and re.search(PC + r'$', x.upper().strip()):
            parts = [p.strip() for p in x.split(',') if p.strip()]
            addrs.append((parts[-2] if len(parts) > 1 else None, parts[-1].upper()))
        elif re.fullmatch(PC, x.upper().strip()):
            addrs.append((acc[-1] if acc else None, x.upper().strip())); acc = []
        else:
            acc.append(x)
    if not addrs:
        m = re.match(r'^(.*?)\s*\(' + PC + r'\)', head[1]) if len(head) > 1 else None
        if m: addrs.append((m.group(1), m.group(2)))
    towns = []
    location_note = ' '.join(acc) if not addrs else None
    provider = (S.get('Training provider') or [None])[0]
    reqs = S.get('Essential qualifications', [])
    other_req = S.get('Other requirements', [])
    work = S.get("What you'll do at work", [])
    about = S.get('About this employer', [])
    website = next((m for x in about for m in re.findall(r'\[\[(https?://[^\]]+)\]\]', x) if 'gov.uk' not in m), None)
    apply_blk = S.get('Apply now', [])
    on_company_site = any("company's website" in x or 'employer' in x.lower() and 'website' in x.lower() for x in apply_blk)
    level = re.search(r'\(level (\d)\)', course or '')
    return dict(id=vid, title=title, employer=employer, closes=closes, posted=posted, summary=summary, wage=wage,
                wage_extra=wage_extra, course=course, level=int(level.group(1)) if level else None, hours=hours,
                start=start, duration=duration, positions=positions, addrs=addrs, location_note=location_note, provider=provider, reqs=reqs,
                other_req=other_req, work=work, website=website, on_company_site=on_company_site)

if __name__ == '__main__':
    d = sys.argv[1]
    out = [parse(os.path.join(d, f)) for f in sorted(os.listdir(d)) if f.endswith('.html')]
    json.dump(out, open(sys.argv[2], 'w'), indent=1, ensure_ascii=False)
    print(len(out))
