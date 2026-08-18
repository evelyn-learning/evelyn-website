// apps/tutor/scripts/tutor/verdict-bank/probes/index.ts
import type { VerdictProbe } from '../types';
import { INCIDENT_PROBES } from './incidents';
import { MATRIX_PROBES } from './matrix';
import { CONTROL_PROBES } from './controls';

export const ALL_PROBES: VerdictProbe[] = [...INCIDENT_PROBES, ...MATRIX_PROBES, ...CONTROL_PROBES];

// Known gaps (2026-08-18 verdict-probe-bank plan): voice channel (harness
// is typed-only — STT/turn-taking bugs invisible here), MCQ-letter answers
// (no scriptable ground truth yet), board-card submissions (typed path
// can't emit the [try-yourself submission…] marker), and the exact
// lesson-scripted-expectation cell of portal-e3af265a (needs the crimsora
// algebra-1 module seeded; probe 1 approximates it).
