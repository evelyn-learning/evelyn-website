/**
 * Render a student profile into the compact <student_profile> block the
 * brain reads at the top of every turn. Bounded by design — we don't
 * dump every field, only the slice useful for THIS session.
 */

import type { StudentProfile, MasteryEntry, GapEntry } from './types';

const RECENT_GAPS_SHOWN = 5;
const RECENT_SESSIONS_SHOWN = 3;
const TOP_MASTERY_SHOWN = 8;
const SCORE_LABEL = (s: number): string =>
  s >= 0.8 ? 'strong'
    : s >= 0.6 ? 'on track'
    : s >= 0.4 ? 'wobbly'
    : s >= 0.2 ? 'weak'
    : 'unseen';

export function renderStudentProfileBlock(profile: StudentProfile | null): string {
  if (!profile) return '';
  const lines: string[] = [`<student_profile>`];
  if (profile.name) lines.push(`name: ${profile.name}`);
  if (profile.grade) lines.push(`grade: ${profile.grade}`);
  if (profile.locale) lines.push(`locale: ${profile.locale}`);
  if (profile.curriculum) lines.push(`curriculum: ${profile.curriculum}`);

  // Preferences — only emit non-defaults so the prompt stays small.
  const prefs = profile.preferences;
  const prefBits: string[] = [];
  if (prefs.humorCeiling) prefBits.push(`humor=${prefs.humorCeiling}`);
  if (prefs.pacing) prefBits.push(`pacing=${prefs.pacing}`);
  if (prefs.modality) prefBits.push(`modality=${prefs.modality}`);
  if (prefs.tone) prefBits.push(`tone=${prefs.tone}`);
  if (prefBits.length) lines.push(`preferences: ${prefBits.join(', ')}`);

  // Top mastery — most-recently-touched first.
  const masteryArr: MasteryEntry[] = Object.values(profile.mastery)
    .sort((a, b) => b.lastTouchedAt.localeCompare(a.lastTouchedAt))
    .slice(0, TOP_MASTERY_SHOWN);
  if (masteryArr.length) {
    lines.push(``, `recent mastery (most-recent first):`);
    for (const m of masteryArr) {
      lines.push(`  - ${m.loId} → ${SCORE_LABEL(m.score)} (score=${m.score.toFixed(2)}, exposures=${m.exposures})`);
    }
  }

  // Open gaps — most-recently-seen first.
  const openGaps: GapEntry[] = profile.gaps
    .filter((g) => g.status === 'open')
    .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))
    .slice(0, RECENT_GAPS_SHOWN);
  if (openGaps.length) {
    lines.push(``, `open learning gaps (address opportunistically when relevant):`);
    for (const g of openGaps) {
      lines.push(`  - [${g.loId}] ${g.description}`);
    }
  }

  // Recent sessions — for "last week we did X" continuity.
  const recent = profile.recentSessions
    .slice(-RECENT_SESSIONS_SHOWN)
    .reverse();
  if (recent.length) {
    lines.push(``, `recent sessions:`);
    for (const s of recent) {
      const tag = [s.subject, s.topic, s.grade].filter(Boolean).join(' / ');
      const lo = s.losTouched.length ? ` LOs: ${s.losTouched.join(', ')}` : '';
      const summary = s.summary ? ` — ${s.summary}` : '';
      lines.push(`  - ${s.endedAt.slice(0, 10)} · ${tag}${lo}${summary}`);
    }
  }

  lines.push(``, `When relevant, REFER BACK to past sessions ("last time you struggled with X, let's start there"). Don't dump the profile back at the student verbatim — read it, internalize it, act on it.`);
  lines.push(`</student_profile>`);
  return lines.join('\n');
}
