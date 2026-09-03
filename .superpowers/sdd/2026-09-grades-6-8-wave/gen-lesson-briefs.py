#!/usr/bin/env python3
"""Generate one per-lesson fan-out brief per curriculum row.

Reads a signed <course>-CURRICULUM.md, emits <workspace>/lesson-briefs/<course>/
u<N>-<slug>.md for every topic row except the named exemplars. Each brief is
self-contained enough that an authoring agent needs only it plus the fan-out
contract and its exemplar.
"""
import re, sys, os, json

def parse(md_path):
    units = []          # [(unit_no, unit_title, [rows])]
    cur = None
    for line in open(md_path):
        m = re.match(r'^##\s+Unit\s+(\d+)\s+[—-]\s+(.+?)\s*$', line)
        if m:
            cur = (int(m.group(1)), m.group(2).strip(), [])
            units.append(cur)
            continue
        if cur is None:
            continue
        if line.startswith('##'):          # left the unit sections
            cur = None
            continue
        if not line.strip().startswith('|'):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) < 5:
            continue
        if cells[0].lower() == 'slug' or set(cells[0]) <= set('-: '):
            continue                        # header / separator
        slug = cells[0].strip('`')
        cur[2].append({
            'slug': slug, 'title': cells[1], 'standard': cells[2],
            'scope': cells[3], 'salvage': cells[4],
        })
    return units

def main():
    course   = sys.argv[1]                    # m6math
    prefix   = sys.argv[2]                    # M6MATH
    md       = sys.argv[3]
    outdir   = sys.argv[4]
    exemplars= set(sys.argv[5:])              # slugs written by the controller

    units = parse(md)
    flat = []
    for uno, utitle, rows in units:
        for i, r in enumerate(rows, 1):
            r.update(unit=uno, unit_title=utitle, topic=i)
            flat.append(r)

    bad = [(u, t, len(r)) for u, t, r in units if len(r) != 4]
    print(f"units={len(units)} topics={len(flat)}"
          + (f"  ⚠️ NON-4-TOPIC UNITS: {bad}" if bad else ""))
    if len(units) != 10 or len(flat) != 40:
        print("⚠️ expected 10 units × 4 topics = 40 — NOT generating briefs")
        return 1

    os.makedirs(os.path.join(outdir, course), exist_ok=True)
    written = 0
    for idx, r in enumerate(flat):
        if r['slug'] in exemplars:
            continue
        prev_lo = f"{course}.{flat[idx-1]['slug']}" if idx > 0 else None
        next_lo = f"{course}.{flat[idx+1]['slug']}" if idx + 1 < len(flat) else None
        sym = f"SEED_{prefix}_U{r['unit']}_" + r['slug'].upper().replace('-', '_')
        fn  = f"{course}-u{r['unit']}-{r['slug']}.ts"
        body = f"""# Lesson brief — {course} · Unit {r['unit']} Topic {r['topic']} · {r['title']}

You are authoring ONE lesson-plan seed file. Follow the fan-out contract
exactly: `.superpowers/sdd/2026-09-grades-6-8-wave/{course}-FANOUT-CONTRACT.md`.
Read it in full before you write anything. It carries the segment recipe, the
lint requirements, the TypeScript shape and the hard rules.

## Your lesson — these values are authoritative, use them verbatim

| Field | Value |
|---|---|
| Unit | {r['unit']} — {r['unit_title']} |
| Topic index in unit | {r['topic']} |
| Title | {r['title']} |
| Slug | `{r['slug']}` |
| Standard | `{r['standard']}` |
| Seed file | `apps/tutor/src/lib/tutor/lesson-plan/seeds/{fn}` |
| Export symbol | `{sym}` |
| Plan id | `evelyn.ms.{course}.{r['slug']}.v1` |
| Learning-objective id | `{course}.{r['slug']}` |
| `los[0].standard` | `{prefix}-{r['unit']}.{r['topic']}` |
| `cedUnit` / `cedTopic` / `cedTitle` | `'{r['unit']}'` / `'{r['unit']}.{r['topic']}'` / `'{r['title']}'` |
| `prerequisites` | {json.dumps([prev_lo] if prev_lo else [])} |
| `followUps` | {json.dumps([next_lo] if next_lo else [])} |

## Scope — teach exactly this, and nothing adjacent

{r['scope']}

The neighbouring topics in this course own their own lessons; do not teach
theirs. The signed curriculum
(`.superpowers/sdd/2026-09-grades-6-8-wave/{course}-CURRICULUM.md`) lists every
sibling topic and an "Explicitly excluded" section naming what belongs to the
next grade — read both and stay inside your row.

## Salvage

{r['salvage']}

## Hard rules

- Write ONLY `{fn}`. Do not touch `store.ts`, do not register anything, do not
  commit, do not push, do not run a deploy, do not touch a database, do not
  dispatch subagents. The controller registers all lessons in one batched edit.
- Every number must be arithmetically correct. Check each worked example and
  each answer by hand before you report.
- Age-appropriate for thirteen- and fourteen-year-olds (Grade 8).
- Report back: the file you wrote, and any place the contract or this brief was
  wrong or ambiguous. Do not paste the file's contents into your reply.
"""
        with open(os.path.join(outdir, course, f"u{r['unit']}-{r['slug']}.md"), 'w') as f:
            f.write(body)
        written += 1
    print(f"wrote {written} lesson briefs to {outdir}/{course}/ "
          f"(skipped {len(exemplars)} exemplars)")
    return 0

sys.exit(main())
