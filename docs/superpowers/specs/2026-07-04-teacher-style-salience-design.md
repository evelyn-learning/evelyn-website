# Teacher persona mid-session style salience — design

**Date:** 2026-07-04 · **Branch:** `teacher-personas` · **Status:** approved (user), building

## Problem

The T1 judge repeatedly notes the persona is "present but not strongly
distinctive beyond the opening" (`style-consistent` 4/5). Mechanism: the
per-turn `<opening_directive>` (which carries the teacher intro) retires
after ≤4 brain turns; after that only the static `<teacher_identity>`
system-prompt block remains, and its salience loses to the live
conversation — the voice drifts generic-enthusiastic.

## Decision

Per-turn `<teacher_style>` micro-block (user-approved over static-block
strengthening and a staged approach): per-turn steering is what fixed the
opener/resume cases; static nudges have repeatedly under-delivered against
drift. Cost accepted: ~70 tokens/turn on teacher sessions after the
opening directive retires. Never retires — style persists all session.

## Components

1. **`renderTeacherStyleReminder(t): string | null`** (pure,
   `src/lib/tutor/ai/teacher-persona.ts`): distills the AUDIBLE markers —
   pace, ≤2 catchphrases, ≤3 analogy domains — ending with an audibility
   line ("a stranger reading any two consecutive turns should hear {name},
   not a generic tutor — weave these in where they fit, never force
   them"). Error-response style stays static-only (keeps the block at the
   ~70-token budget). `null` when none of the three markers is present
   (⇒ no block, fail-soft). Byte-stable per persona; DEMO_TEACHERS all
   ≤400 chars (test-pinned).
2. **Client wiring** (`VoiceTutorRealtime`): attach `styleReminder` to the
   brain request when `NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER` is on AND a
   `teacherPersona` is present AND the opening directive is NOT riding
   this turn (the directive already carries identity salience; the
   reminder takes over exactly at retirement). Flag off / no persona ⇒
   field `undefined` ⇒ request byte-identical (same invariant as
   `openingDirective` / `demoStop`).
3. **Route** (`api/tutor/brain/stream/route.ts`): accept
   `styleReminder?: string`, ≤2000-char guard (mirrors `openingDirective`).
4. **Rendering** (`src/lib/tutor/voice/claude-brain.ts`):
   `BrainTurnInput.styleReminder` → `<teacher_style>` block adjacent to
   `openingDirectiveBlock` in BOTH user-content assembly sites. Per-turn
   user content — cache prefix untouched.

## Testing

- Unit (`scripts/test-teacher-persona.ts`): distills present fields, skips
  absent ones, `null` on style-less persona, length cap, audibility
  phrase, all DEMO_TEACHERS render ≤ cap.
- Wiring: flag-off / persona-absent ⇒ no field (byte-identical pattern).
- Live: T1 ×2 — target `style-consistent` 5/5 with "distinctive" notes;
  eyeball mid-session turns for catchphrases/analogies; console line
  confirms the block attaches only post-retirement.
