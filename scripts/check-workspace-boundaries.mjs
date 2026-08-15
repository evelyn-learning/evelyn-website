// scripts/check-workspace-boundaries.mjs
// Structural invariants created by the M1a workspace split. A violation here
// means someone re-coupled the marketing site to the tutor engine (which
// re-couples their deploys), or made the engine depend on marketing.
//
// Run: npm run check:boundaries   (exit 0 = clean, exit 1 = violation)
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Anchor on this file, not on cwd: the greps use repo-relative paths, so
// running the check from an app directory must not silently search nothing.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Rules 1 and 3 match import SPECIFIERS, not the bare substring `lib/tutor`.
// packages/core carries five comments that reference the pre-split paths
// (cartesia-voice-registry.ts, geo-accent.ts, knowledge/types.ts) — accurate
// history, not a dependency cycle. The forms that DO create one are
// `from '…'`, side-effect `import '…'`, `require('…')` and dynamic
// `import('…')`, against either the `@/lib/tutor…` alias or a relative
// specifier resolving into a `lib/tutor` directory. `.tsx` is included so
// core's components/ subtree is covered too.
//
// EVERY `tutor` path segment is followed by a boundary — `(/|['"])` — so that
// `@/lib/tutorial`, `@/lib/tutoring-notes` and `@/app/tutorials` are not
// reported as dependency violations. No such module exists today; this is
// prevention, not a fix.
//
// AND THE SEGMENT MUST ALSO ADMIT `-portal`, WHICH IS NOT COSMETIC.
// `apps/tutor/src/app/tutor-portal/` is a real directory containing `embed/`
// and `replay/`. A boundary of `tutor(/|['"])` alone demands `/` or a quote
// immediately after `tutor`, so it silently STOPS matching
// `@/app/tutor-portal/embed/page`, `@/app/tutor-portal`, and
// `import('@/app/tutor-portal/replay/page')` — all of which the original
// bare-substring rule 1 caught. That is not hypothetical residue: commit
// 4971a5bc in this branch cut a `/tutor-portal` branch out of marketing's
// AppShell, so a re-introduction is exactly the thing this check exists to
// stop, and it would otherwise ship green. Rule 3 gains nothing from the
// `-portal` alternative (there is no `lib/tutor-portal`) but loses nothing
// either, so one shared constant stays honest for all of them.
//
// Rules 2 and 4 are mirrors of each other: neither app may reach into the
// other's directory. Rule 2 is a plain substring grep because a tutor file
// naming `apps/marketing` at all is worth a look; rule 4 is written in rule
// 3's specifier style so that prose mentioning the other app stays legal,
// which is the same allowance core gets.
const TUTOR_SEG = `tutor(-portal)?(/|['\\"])`;
const SPECIFIER = `(from|import|require)[[:space:]]*\\(?[[:space:]]*['\\"]`;

const RULES = [
  { name: 'marketing must not import tutor',
    cmd: `grep -rnE "@/(lib|app)/${TUTOR_SEG}" apps/marketing/src --include=*.ts --include=*.tsx || true` },
  { name: 'tutor must not reference apps/marketing',
    cmd: `grep -rn "apps/marketing" apps/tutor/src apps/tutor/scripts --include=*.ts --include=*.tsx || true` },
  { name: 'core must not import tutor',
    cmd: `grep -rnE "${SPECIFIER}(@/lib/${TUTOR_SEG}|(\\.{1,2}/)[^'\\"]*lib/${TUTOR_SEG})" packages/core/src --include=*.ts --include=*.tsx || true` },
  { name: 'marketing must not reference apps/tutor',
    cmd: `grep -rnE "${SPECIFIER}(@evelyn/${TUTOR_SEG}|(\\.{1,2}/)[^'\\"]*apps/${TUTOR_SEG})" apps/marketing/src apps/marketing/scripts --include=*.ts --include=*.tsx || true` },
];

let failed = false;
for (const r of RULES) {
  const out = execSync(r.cmd, { encoding: 'utf8', cwd: REPO_ROOT }).trim();
  if (out) { failed = true; console.error(`VIOLATION — ${r.name}:\n${out}\n`); }
  else console.log(`ok — ${r.name}`);
}
process.exit(failed ? 1 : 0);
