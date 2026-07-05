# VTR Seam Extraction Slice 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract VoiceTutorRealtime's ~850 lines of module-level pure material into `src/lib/tutor/orchestrator/` with characterization tests, shrinking VTR to ~12.1k lines with zero component-body changes.

**Architecture:** Two-step: (1) create the five orchestrator modules by VERBATIM copy + characterization tests against them; (2) swap VTR to import from them, delete the originals, re-export the public surface so no consumer changes. Spec: `docs/superpowers/specs/2026-07-05-vtr-seam-extraction-slice1-design.md` (has the exact declaration→module table).

**Tech Stack:** Pure TS moves; ts-node plain-assert tests.

## Global Constraints

- Moves are VERBATIM — code and doc comments copy unchanged; only `export` keywords are added and import statements adjusted. NO logic edits, however tempting.
- The component body (the `export function VoiceTutorRealtime(` function and everything inside) is UNTOUCHED except the deletion of the moved module-level declarations above it and the new import lines.
- Public surface preserved via re-exports from `VoiceTutorRealtime.tsx`: `RealtimeHandle`, `TutorMilestone`, `TutorResumeState`, `isMuteMeCommand` (grep consumers first; re-export whatever they import from this path).
- If any candidate declaration turns out to reference component scope, LEAVE IT and note it in the report.
- Gate after each task: `npx tsc --noEmit` clean + `npm run test:student-marks` (44) + `test:caption-sync` (22) + `test:render-sync` (22) + `test:recordings` (43) green.

---

### Task 1: Orchestrator modules (verbatim copies) + characterization tests

**Files:**
- Create: `src/lib/tutor/orchestrator/flags.ts`, `text-heuristics.ts`, `ink-capture.ts`, `format-lesson-plan.ts`, `types.ts` (contents per the spec's table — copy each declaration + its full doc comment verbatim from `VoiceTutorRealtime.tsx`, add `export` to each)
- Create: `scripts/test-orchestrator-helpers.ts`
- Modify: `package.json` (script next to `test:student-marks`)
- DO NOT touch `VoiceTutorRealtime.tsx` in this task (momentary duplication is intended — the tests must pass against the modules while the originals still run in prod code).

**Interfaces:** Produces the five modules; Task 2 swaps VTR onto them. Copy import dependencies each declaration needs (e.g. `formatLessonPlanForRealtime` and `types.ts` will need their existing type imports — read the top of VTR's import block and bring exactly what each module requires; `ink-capture.ts` has no imports; `types.ts` needs whatever `TutorResumeState`/`RealtimeHandle` reference — check for `StudentMarkEvent`, `SpokenCaption`, transcript types).

- [ ] **Step 1: Write the characterization tests** (against the NEW modules — they will fail to import until Step 2 creates them; expected values below are derived from the current source, verify each against the actual code while copying and FIX THE TEST if your reading differs — the code is the truth, these tests pin it):

```ts
/**
 * Characterization tests for orchestrator helpers extracted from
 * VoiceTutorRealtime (seam-extraction slice 1). These pin CURRENT behavior
 * across the move — they are not aspirational specs.
 * Run: npm run test:orchestrator-helpers
 */
import {
  isSafeOpener,
  isJudgeKillRestatement,
  detectStudentBroughtProblem,
  isMuteMeCommand,
  extractSentence1Normalized,
  deepEqualParams,
} from '../src/lib/tutor/orchestrator/text-heuristics';
import { sanitizeInkOcrText } from '../src/lib/tutor/orchestrator/ink-capture';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// isSafeOpener — read the implementation while copying and derive at least
// 4 cases: a short content-free runway phrase (true), a sentence with a
// number (expected per code), a question (expected per code), an over-long
// sentence (expected per code). Assert what the CODE does.
// isJudgeKillRestatement — ≥4 cases: verbatim restatement (true), reworded
// same content words (per code), numeric-token mismatch (false), fully
// diverged content (false).
// detectStudentBroughtProblem — ≥3 cases: student text echoing the authored
// problem (null), genuinely new numbers + work-intent phrasing (non-null),
// casual chat (null).
// isMuteMeCommand — 3 cases incl. a clear mute request and a non-mute
// sentence containing the word mute.
// extractSentence1Normalized + deepEqualParams — 2 quick pins each.
// sanitizeInkOcrText — meta-description rejected, >120 chars rejected,
// clean short text passes, non-string undefined.

console.log(`\norchestrator-helpers: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

(The comment blocks above are YOUR instructions: write the concrete cases by reading each function as you copy it. Minimum 20 checks total. No vacuous assertions.)

Add the npm script:

```json
"test:orchestrator-helpers": "TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{\"module\":\"commonjs\",\"baseUrl\":\"./\"}' scripts/test-orchestrator-helpers.ts",
```

- [ ] **Step 2: Create the five modules** — verbatim copies per the spec table, each declaration exported, each module opening with a short header comment ("Extracted verbatim from VoiceTutorRealtime.tsx (seam-extraction slice 1, 2026-07-05). Pure module — no component state.").

- [ ] **Step 3: Run** `npm run test:orchestrator-helpers` (≥20 passed, 0 failed) and `npx tsc --noEmit` (clean — duplication across two files is fine for tsc as long as nothing re-declares in the same module scope).

- [ ] **Step 4: Commit** — `refactor(tutor): orchestrator pure modules (verbatim) + characterization tests — slice 1 step 1`

---

### Task 2: Swap VoiceTutorRealtime onto the modules

**Files:**
- Modify: `src/app/tutor/components/VoiceTutorRealtime.tsx` ONLY.

**Steps:**
- [ ] **Step 1:** grep every consumer of this file first: `grep -rn "from '.*VoiceTutorRealtime'" src scripts --include="*.ts*"` — list what each imports (expect `VoiceTutorRealtime`, `RealtimeHandle`, `TutorMilestone`, `TutorResumeState`, `isMuteMeCommand`).
- [ ] **Step 2:** delete the moved declarations from VTR; add imports from the five orchestrator modules; add re-exports for the public surface consumers use, e.g.:

```ts
export type { RealtimeHandle, TutorMilestone, TutorResumeState } from '@/lib/tutor/orchestrator/types';
export { isMuteMeCommand } from '@/lib/tutor/orchestrator/text-heuristics';
```

(If VTR itself uses `isMuteMeCommand` internally, import it normally AND re-export.) Interfaces/props that stay in VTR (`VoiceTutorRealtimeProps`) keep any type imports they need.
- [ ] **Step 3:** sanity: `git diff --stat` shows VTR shrinking ~800-900 lines; `git diff` on VTR shows ONLY deletions above the component + the import/re-export block — zero hunks inside the component function.
- [ ] **Step 4:** full gate: `npx tsc --noEmit` + all six suites (`test:orchestrator-helpers`, `test:student-marks`, `test:caption-sync`, `test:render-sync`, `test:recordings`, `test:pedagogy-teacher`).
- [ ] **Step 5: Commit** — `refactor(tutor): VoiceTutorRealtime imports orchestrator modules — slice 1 complete (~850 lines out)`

---

### Task 3: Verification gate

- [ ] All suites + tsc (again, from clean).
- [ ] Smoke: dev server responds 200 on /tutor; run `npm run test:tutor-e2e -- coop-arith` — 0 anomalies (proves the live orchestrator path intact end-to-end).
- [ ] Report honestly.
