// scripts/tutor/voice-harness/utterances.ts
// The 12 authored tutor utterances (spec Phase 1). Raw text is what the
// brain would emit; `tts` is what every provider actually receives —
// through the REAL production pronunciation seam.
import { rewriteForTTS } from '../../../apps/marketing/src/lib/tutor/voice/tts-pronunciation';

export interface Utterance { id: string; style: string; raw: string; tts: string }

const RAW: Omit<Utterance, 'tts'>[] = [
  { id: 'u01', style: 'math', raw: 'So the derivative of x^2 is 2x — watch what happens when we apply the power rule to x^5.' },
  { id: 'u02', style: 'math', raw: 'Remember, sin of \\theta over cos of \\theta gives us tan of \\theta. That identity is doing all the work here.' },
  { id: 'u03', style: 'math', raw: 'Three quarters plus one half — we need a common denominator, so 3/4 becomes 6/8 and 1/2 becomes 4/8, giving 10/8.' },
  { id: 'u04', style: 'math', raw: 'So ln of e^3 is just 3, because ln and the exponential are inverse functions.' },
  { id: 'u05', style: 'alphanumeric', raw: 'Open your notes to equation 4b — the one from March 12th, 2026 — and check line 3 against problem A7.' },
  { id: 'u06', style: 'alphanumeric', raw: 'The velocity is 9.8 meters per second squared times 2.5 seconds, which is 24.5 meters per second.' },
  { id: 'u07', style: 'encouragement', raw: 'Yes! That is exactly right — you spotted the pattern before I even finished drawing it.' },
  { id: 'u08', style: 'encouragement', raw: 'Not quite, but you are close. Look at the second term again — what sign should it have?' },
  { id: 'u09', style: 'explanation', raw: 'Think of a supply curve as a ladder of willingness. At low prices only the most efficient producers show up. As the price climbs, each rung brings in producers with higher costs. That is why the curve slopes upward.' },
  { id: 'u10', style: 'explanation', raw: 'A parabola is the set of every point that is the same distance from the focus as it is from the directrix. Move the focus further from the directrix and the curve opens wider.' },
  { id: 'u11', style: 'question', raw: 'So here is my question for you... if we double the radius, what happens to the area? Take your time.' },
  { id: 'u12', style: 'question', raw: 'Before we move on — can you tell me, in your own words, why the base case matters in recursion?' },
];

export const UTTERANCES: Utterance[] = RAW.map((u) => ({ ...u, tts: rewriteForTTS(u.raw) }));
