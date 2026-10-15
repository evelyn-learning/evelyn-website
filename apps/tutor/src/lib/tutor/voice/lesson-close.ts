/**
 * After the lesson has closed, a student's goodbye is not a new turn.
 *
 * GDI starter session 2026-10-15 (embed-1792105245704): the student said
 * 「今日はここまでで大丈夫です」, the tutor closed the lesson (the close tool
 * fired), and then every 「はい、ありがとうございました」「またお願いします」
 * got another full farewell — eight of them — and one bare 「はい」 restarted
 * the kayaking exercise through the idle nudge. Once closed, a reply that is
 * only thanks / goodbye / acknowledgement gets no new tutor turn; anything
 * with content (a question, a request) still does.
 */

// Each clause of the utterance must be one of these, start to end.
const PLEASANTRY_CLAUSE = new RegExp(
  '^(?:' + [
    'はい', 'ええ', 'うん', 'そうですね', 'わかりました', '分かりました',
    'ありがとう(?:ございます|ございました)?', 'どうも(?:ありがとうございました)?',
    'お疲れ(?:様|さま)でした', '失礼します', '失礼しました',
    'また(?:次回|今度|明日|ね)?(?:も)?(?:よろしく)?(?:お願いします|お願いしますね)?',
    '次回(?:も)?(?:よろしく)?お願いします', 'よろしくお願いします', 'さようなら', 'じゃあね', 'では',
    'ok(?:ay)?', 'yes', 'yeah', 'thanks?(?: you)?(?: so much| very much)?', 'bye', 'goodbye', 'good bye',
    'see you(?: next time| later| soon)?', 'have a (?:good|nice) (?:day|one|evening)', 'take care',
  ].join('|') + ')$',
  'i',
);

export function isPleasantryOnly(text: string): boolean {
  if (typeof text !== 'string') return false;
  if (/[?？]/.test(text)) return false;
  const clauses = text
    .toLowerCase()
    .split(/[、。,.!！\n]+/)
    .map((c) => c.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  return clauses.length > 0 && clauses.every((c) => PLEASANTRY_CLAUSE.test(c));
}
