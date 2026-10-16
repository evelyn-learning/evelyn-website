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
  if (clauses.length === 0) return false;
  if (clauses.every((c) => PLEASANTRY_CLAUSE.test(c))) return true;
  // embed-1792174263669: 「うん、こちらこそです。ありがとうございました。今日は色々
  // 練習できました。まだ難しいけど、また次回もお願いします。」 got a second full
  // farewell. A remark that ENDS on a goodbye is a goodbye; one that ends on
  // new content (「…ちょっと自信つきました。」) still gets its turn.
  return FAREWELL_CLAUSE.test(clauses[clauses.length - 1]) && !QUESTION_MARKER.test(text);
}

const FAREWELL_CLAUSE = new RegExp(
  '^(?:' + [
    'ありがとう(?:ございます|ございました)?', 'どうも(?:ありがとうございました)?',
    'お疲れ(?:様|さま)でした', '失礼します', '失礼しました',
    '(?:また)?(?:次回|今度|明日)?(?:も)?(?:よろしく)?お願いします(?:ね)?',
    'さようなら', 'じゃあね', 'またね',
    'thanks?(?: you)?(?: so much| very much)?', 'bye', 'goodbye', 'good bye',
    'see you(?: next time| later| soon)?', 'take care',
  ].join('|') + ')$',
  'i',
);
// A question anywhere keeps the turn, even after a goodbye. STT often drops
// the「？」, so the spoken question endings count too.
const QUESTION_MARKER = /[?？]|(?:です|ます|でした|ません)か|教えて|もう一(?:つ|回|度)|質問|one more|question/i;
