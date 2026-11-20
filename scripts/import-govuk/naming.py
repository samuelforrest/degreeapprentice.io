# The filename scheme for listings: {company}-{role}-{location}-{start year}.md
#   amazon-software-development-engineer-london-2027
#   lloyds-banking-group-accounting-and-finance-bristol-2027
# role is the advertised title minus filler ("Apprentice", "Degree", "Level 6",
# the company or town name again, contract notes in brackets).
import re

FILLER = {
    'apprentice', 'apprentices', 'apprenticeship', 'apprenticeships', 'degree', 'graduate', 'level', 'l6', 'l7',
    'programme', 'program', 'scheme', 'intake', 'apprenticeship', 'role', 'trainee', 'the', 'uk', 'a', 'an',
    'september', 'sept', 'january', 'cohort', 'fixed', 'term', 'contract', 'ftc', 'month', 'months', 'year', 'years',
}

def slugify(s):
    s = s.lower().replace('&', ' and ').replace('.', '')
    s = re.sub(r"[’']", '', s)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

def role_words(title, company, towns):
    t = re.sub(r'\(.*?\)|\[.*?\]', ' ', title)
    words = slugify(t).split('-')
    drop = set(slugify(company).split('-')) | {w for town in towns for w in slugify(town).split('-')}
    out = [w for w in words if w and w not in FILLER and w not in drop and not re.fullmatch(r'\d+|20\d\d', w)]
    # Drop exact repeats, keep the first five words, then trim joiners left
    # dangling at either end ("and", "of", "in").
    seen, uniq = set(), []
    for w in out:
        if w not in seen: uniq.append(w); seen.add(w)
    uniq = uniq[:5]
    joiners = {'and', 'of', 'in', 'for', 'to', 'with', 'or'}
    while uniq and uniq[0] in joiners: uniq.pop(0)
    while uniq and uniq[-1] in joiners: uniq.pop()
    return uniq

def listing_slug(company, title, towns, starts):
    parts = [slugify(company)]
    parts += role_words(title, company, towns) or ['apprenticeship']
    parts.append(slugify(towns[0]) if len(towns) == 1 else 'multiple-locations' if towns else 'uk')
    if starts: parts.append(starts[:4])
    return '-'.join(p for p in parts if p)
