/**
 * Tutor brain v2 — the lines the ENGINE says itself, in the language the lesson is taught in.
 *
 * The model writes its replies in the lesson's language (lesson-language-section.ts). A few lines are not the
 * model's: the runtime adds a check-in to a reply that asked nothing, asks before a held page opens, says goodbye
 * at the time box, reads a card's ask the reply left unsaid. Written in English they put an English sentence at
 * the end of a Chinese reply (first spoken zh-TW run, 2026-11-24: 「…求下面聯立方程式的 x 和 y」 then "Are you with
 * me so far?"). Each has its wording here, per language; English stays where it was defined, word for word.
 *
 * A line here carries no plan wording: plan part names are stored in English, so the asks that name a part in
 * English ("Next is worked example.") ask without the name in another language.
 *
 * Pure. Client-safe.
 */
import { taughtIn } from '../voice/lesson-language';

export interface V2LessonLines {
  /** How a reply that asked nothing hands the turn to the student; rotated. */
  checkIns: readonly string[];
  /** Before a held page of the next part opens. */
  goOn: string;
  goOnOrQuestion: string;
  /** The goodbye at the end of the time box, with and without the student's first name. */
  timeUp: (first: string) => string;
  /** A card's ask too long to read aloud. */
  lookAtBoard: string;
  /** Leads the runtime's own correction of the reply's arithmetic. */
  correction: (fix: string) => string;
  /** Shown in the transcript when a turn could not be reached. */
  unreachable: string;
  /** Homework: said in place of a draft that gave the answer away. */
  nextStep: string;
}

const LINES: Readonly<Record<string, V2LessonLines>> = {
  'zh-TW': {
    checkIns: ['到這裡都聽得懂嗎？', '目前為止還可以嗎？', '這樣清楚嗎？還是要我再說一次？', '這樣聽得懂嗎？'],
    goOn: '我們繼續下一個部分，好嗎？',
    goOnOrQuestion: '我們繼續下一個部分，還是你想先問問題？',
    timeUp: (first) => (first ? `${first}，今天的時間到了。你做得很好，下次見。` : '今天的時間到了。你做得很好，下次見。'),
    lookAtBoard: '請看白板上的題目，然後告訴我你的想法。',
    correction: (fix) => `更正一下：${fix}`,
    unreachable: '剛才連不上老師，請再傳一次。',
    nextStep: '你覺得下一步應該怎麼做？',
  },
  'zh-CN': {
    checkIns: ['到这里都听得懂吗？', '目前为止还可以吗？', '这样清楚吗？还是要我再讲一遍？', '这样听得懂吗？'],
    goOn: '我们继续下一个部分，好吗？',
    goOnOrQuestion: '我们继续下一个部分，还是你想先问问题？',
    timeUp: (first) => (first ? `${first}，今天的时间到了。你做得很好，下次见。` : '今天的时间到了。你做得很好，下次见。'),
    lookAtBoard: '请看白板上的题目，然后告诉我你的想法。',
    correction: (fix) => `更正一下：${fix}`,
    unreachable: '刚才连不上老师，请再发一次。',
    nextStep: '你觉得下一步应该怎么做？',
  },
  ja: {
    checkIns: ['ここまで大丈夫ですか？', 'ここまでついてこられていますか？', 'わかりましたか？それとも、もう一度説明しましょうか？', 'ここまでわかりましたか？'],
    goOn: '次に進んでもいいですか？',
    goOnOrQuestion: '次に進みますか？それとも、先に質問がありますか？',
    timeUp: (first) => (first ? `${first}さん、今日はここまでです。よくがんばりました。また次回。` : '今日はここまでです。よくがんばりました。また次回。'),
    lookAtBoard: 'ボードの問題を見て、考えを聞かせてください。',
    correction: (fix) => `一つ訂正です。${fix}`,
    unreachable: '先生につながりませんでした。もう一度送ってください。',
    nextStep: '次は何をすればいいと思いますか？',
  },
};

/** The engine's lines for a lesson taught in another language; null for an English lesson (the caller's own
 *  English wording stands) and for a language with no lines yet (English, as before, rather than nothing). */
export function v2LessonLines(languages: readonly string[] | null | undefined): V2LessonLines | null {
  const lang = taughtIn(languages);
  return lang ? LINES[lang.code] ?? null : null;
}

/** Every check-in the engine may have appended, in any language: what tells one from a question the tutor put. */
export const V2_LESSON_CHECK_INS: readonly string[] = Object.values(LINES).flatMap((l) => l.checkIns);
