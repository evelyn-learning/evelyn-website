/**
 * Render a student profile into the compact <student_profile> block the
 * brain reads at the top of every turn. Bounded by design — we don't
 * dump every field, only the slice useful for THIS session.
 */

import type { StudentProfile, MasteryEntry, GapEntry } from './types';
import { isGapStale } from './store';

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

  // Active gaps — surfaces 'candidate' (single observation, low confidence),
  // 'confirmed' (promoted), and legacy 'open' entries. 'resolved' suppressed.
  // Stale entries (candidate > 21d, confirmed/open > 90d since lastSeenAt)
  // are also hidden via isGapStale — lazy TTL decay so the brain stops
  // referencing weakness the student has likely outgrown without us
  // having to mutate the underlying data.
  // Most-recently-seen first.
  const now = Date.now();
  const activeGaps: GapEntry[] = profile.gaps
    .filter((g) =>
      (g.status === 'candidate' || g.status === 'confirmed' || g.status === 'open')
      && !isGapStale(g, now),
    )
    .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))
    .slice(0, RECENT_GAPS_SHOWN);
  if (activeGaps.length) {
    lines.push(``, `open learning gaps (address opportunistically when relevant):`);
    for (const g of activeGaps) {
      const obs = g.evidence?.observation ?? g.description ?? '(no detail)';
      const tag = g.kind === 'prerequisite'
        ? `prereq: "${g.conceptLabel ?? '(?)'}"`
        : `[${g.loId ?? '(?)'}]`;
      const meta = g.confidence !== undefined
        ? ` (${g.status}, conf=${g.confidence.toFixed(2)})`
        : '';
      lines.push(`  - ${tag} ${obs}${meta}`);
      const quotes = g.evidence?.studentQuotes ?? [];
      if (quotes.length) {
        lines.push(`      student previously said: ${quotes.map((q) => `"${q}"`).join(' / ')}`);
      }
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

  lines.push(``, `When this session's topic touches an open gap above, OPEN with a concrete callback to it — don't wait until the student fails. If the gap entry includes a "student previously said:" line, weave that EXACT phrase into your opening so the student feels heard ("last time you said 'X' — let's revisit why that's not quite right"). Quoting the student's own words verbatim is the most effective re-grounding move; paraphrasing the concept ("different denominators tripped you up") is weaker. Pick the single most relevant gap; do not list multiple. Read the rest of the profile, internalize, and let it shape your pacing and scaffolding without narrating it.`);
  lines.push(`</student_profile>`);
  return lines.join('\n');
}
