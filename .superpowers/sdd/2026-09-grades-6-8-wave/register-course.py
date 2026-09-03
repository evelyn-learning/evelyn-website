#!/usr/bin/env python3
"""Register lesson-plan seeds in store.ts in ONE mechanical edit.

  register-course.py <course> <PREFIX> <curriculum.md> <store.ts> [slug ...]

With no slugs, registers all 40 rows of the curriculum (in curriculum order);
with slugs, registers only those rows. Idempotent: a symbol already imported
is skipped. Inserts import lines after the LAST existing `import { SEED_`
line and array entries before the `];` that closes SEED_PLANS. Refuses if a
seed file named by a row does not exist on disk.
"""
import re, sys, os

course, prefix, md, store = sys.argv[1:5]
only = set(sys.argv[5:])

rows = []
unit = 0
for line in open(md):
    m = re.match(r'^##\s+Unit\s+(\d+)\s+[—-]', line)
    if m:
        unit = int(m.group(1)); continue
    if not unit or not line.strip().startswith('|'):
        continue
    c = [x.strip() for x in line.strip().strip('|').split('|')]
    if len(c) < 5 or c[0].lower() == 'slug' or set(c[0]) <= set('-: '):
        continue
    rows.append((unit, c[0].strip('`')))
assert len(rows) == 40, f'expected 40 rows, parsed {len(rows)}'
if only:
    missing = only - {s for _, s in rows}
    assert not missing, f'unknown slugs: {missing}'
    rows = [r for r in rows if r[1] in only]

seed_dir = os.path.join(os.path.dirname(store), 'seeds')
src = open(store).read()
imports, entries, skipped = [], [], []
for u, slug in rows:
    sym = f"SEED_{prefix}_U{u}_" + slug.upper().replace('-', '_')
    fn = f"{course}-u{u}-{slug}"
    path = os.path.join(seed_dir, fn + '.ts')
    if not os.path.exists(path):
        sys.exit(f'REFUSING: seed file missing on disk: {path}')
    if f'import {{ {sym} }}' in src:
        skipped.append(sym); continue
    imports.append(f"import {{ {sym} }} from './seeds/{fn}';")
    entries.append(f"  {sym},")

if imports:
    last_import = list(re.finditer(r"^import \{ SEED_[A-Z0-9_]+ \} from '\./seeds/[^']+';\n", src, re.M))[-1]
    src = src[:last_import.end()] + '\n'.join(imports) + '\n' + src[last_import.end():]
    close = re.search(r"^\];\n\nconst seedById", src, re.M)
    assert close, 'could not find the SEED_PLANS closing `];`'
    src = src[:close.start()] + '\n'.join(entries) + '\n' + src[close.start():]
    open(store, 'w').write(src)
print(f'registered {len(imports)} · skipped (already present) {len(skipped)}')
