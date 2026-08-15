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
// EVERY `tutor` path segment is followed by a boundary — `(/|['"])`. Without
// one, `@/lib/tutorial` or `@/lib/tutoring-notes` would be reported as a
// dependency violation. No such module exists today, so this is prevention,
// not a fix; both planted-probe directions are covered by the check's own
// verification (a real violation must trip, a `lib/tutorial` must not).
//
// Rules 2 and 4 are mirrors of each other: neither app may reach into the
// other's directory. Rule 2 is a plain substring grep because a tutor file
// naming `apps/marketing` at all is worth a look; rule 4 is written in rule
// 3's specifier style so that prose mentioning the other app stays legal,
// which is the same allowance core gets.
const TUTOR_SEG = `tutor(/|['\\"])`;
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
