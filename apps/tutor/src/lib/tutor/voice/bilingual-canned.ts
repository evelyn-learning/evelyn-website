/**
 * Japanese versions of the runtime's canned spoken lines (latency covers,
 * liveness replies, escalation covers, the noise nag) for a bilingual
 * session whose tutor is currently speaking Japanese.
 *
 * GDI demo, live 2026-10-14: a Japanese-guided beginner session heard
 * "Let me see." / "Hmm, let me think about that." between Japanese turns.
 * The language follows the TUTOR's last turn (a beginner answers in English
 * while the tutor guides in Japanese). English-only sessions never get here:
 * cannedLanguage() returns undefined and every line is unchanged.
 *
 * Covers stay thinking-fillers, not acknowledgments (same rule as
 * COVER_POOLS) so they never double the brain's own opener.
 */
const JAPANESE_SCRIPT = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u;

export type CannedKind = 'cover' | 'liveness' | 'escalation-1' | 'escalation-2' | 'noise';

export const JA_CANNED: Record<CannedKind, readonly string[]> = {
  cover: ['えーと。', 'ちょっと待ってくださいね。', 'うーん、少し考えますね。', 'ええと、少々お待ちください。'],
  liveness: ['はい、ここにいますよ。少し考えています。', 'はい、聞いています。少し待ってくださいね。'],
  'escalation-1': ['もう少しだけ待ってくださいね。', 'まだ考えています。もう少しです。'],
  'escalation-2': ['すみません、少し接続が遅いようです。お待ちください。'],
  noise: ['すみません、よく聞き取れませんでした。もう一度言っていただけますか？'],
};

/** 'ja' when the session is bilingual with Japanese AND the tutor's most
 *  recent turn was in Japanese; otherwise undefined (= keep English). */
export function cannedLanguage(
  languages: readonly string[] | null | undefined,
  lastTutorText: string | undefined,
): 'ja' | undefined {
  if (!languages?.includes('ja') || !lastTutorText) return undefined;
  return JAPANESE_SCRIPT.test(lastTutorText) ? 'ja' : undefined;
}

/** The line to speak: the English `text` unchanged unless `lang` is 'ja'. */
export function localizeCanned(text: string, kind: CannedKind, lang: 'ja' | undefined, turnIndex: number): string {
  if (lang !== 'ja') return text;
  const pool = JA_CANNED[kind];
  return pool[((turnIndex % pool.length) + pool.length) % pool.length];
}

/** Last tutor utterance text from a transcript list (newest last). */
export function lastTutorText(entries: readonly { role: string; text: string }[]): string | undefined {
  for (let i = entries.length - 1; i >= 0; i--) if (entries[i].role === 'tutor' && entries[i].text.trim()) return entries[i].text;
  return undefined;
}
