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

export interface RenderStudentProfileOptions {
  /** Task D1 (pedagogy opener): include `prefs.interests` in the preferences
   *  line so the brain can theme examples. Default/absent ⇒ output is
   *  byte-identical to the pre-D1 rendering (interests deliberately omitted).
   *  Pure — the CALLER reads the flag env (isPedagogyOpenerFlagValue). */
  includeInterests?: boolean;
}

export function renderStudentProfileBlock(
  profile: StudentProfile | null,
  opts?: RenderStudentProfileOptions,
): string {
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
  if (opts?.includeInterests && prefs.interests?.length) {
    prefBits.push(`interests=${prefs.interests.join('/')}`);
  }
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
  // CRITICAL: these are HISTORICAL sessions, NOT the active session.
  // The active session's subject + topic are stamped in the system
  // prompt's "Current Session Context" block. Do not let an entry
  // below override that ground truth.
  const recent = profile.recentSessions
    .slice(-RECENT_SESSIONS_SHOWN)
    .reverse();
  if (recent.length) {
    lines.push(``, `prior sessions (HISTORICAL — not the current session):`);
    for (const s of recent) {
      const tag = [s.subject, s.topic, s.grade].filter(Boolean).join(' / ');
      const lo = s.losTouched.length ? ` LOs: ${s.losTouched.join(', ')}` : '';
      const summary = s.summary ? ` — ${s.summary}` : '';
      // Per-bucket topic-notes counts from this session — primes the
      // brain to make natural callbacks ("we added a tip about X to your
      // notes last time"). Per Q11d.
      const n = s.notesOverlaysAddedThisSession;
      const notesParts: string[] = [];
      if (n?.theory) notesParts.push(`${n.theory} theory`);
      if (n?.methods) notesParts.push(`${n.methods} method${n.methods === 1 ? '' : 's'}`);
      if (n?.pointers) notesParts.push(`${n.pointers} pointer${n.pointers === 1 ? '' : 's'}`);
      const notesNote = notesParts.length ? ` · added to notes: ${notesParts.join(', ')}` : '';
      lines.push(`  - ${s.endedAt.slice(0, 10)} · ${tag}${lo}${notesNote}${summary}`);
    }
  }

  // Round 28 (first-turn verbosity): this block used to MANDATE opening
  // with a gap callback ("OPEN with a concrete callback… don't wait"),
  // which — stacked with the warm-resume directive and the last-opener
  // variety instruction — made returning students' first turns a recap
  // monologue. History now weaves in AT THE MOMENT the material touches
  // it; the opener belongs to the present session.
  lines.push(``, `Do NOT front-load this history into your session opener — the opening belongs to THIS session's content (one short continuity clause at most). When the material at hand touches an open gap above, fold the callback in AT THAT MOMENT. If the gap entry includes a "student previously said:" line, weave that EXACT phrase in when you address it ("last time you said 'X' — let's revisit why that's not quite right"). Quoting the student's own words verbatim is the most effective re-grounding move; paraphrasing the concept ("different denominators tripped you up") is weaker. Pick the single most relevant gap; do not list multiple.`);
  if (activeGaps.length) {
    lines.push(``, `Keep weaving gaps in AS you teach, not just at the open: whenever the material at hand exercises an open gap above, fold in one quick check of that specific weak point (a small question or step the student does themselves) and scaffold based on what they show — never announce that a record says they are weak. If they handle a previously-gapped concept correctly, acknowledge the growth concretely and specifically (contrast with what they previously said, when a quote is available). If they stumble on it again, record it via the gap tools as usual — re-recording across sessions is how the system confirms and tracks the gap.`);
  }
  lines.push(``, `Read the rest of the profile, internalize, and let it shape your pacing and scaffolding without narrating it.`);
  lines.push(`</student_profile>`);
  return lines.join('\n');
}
