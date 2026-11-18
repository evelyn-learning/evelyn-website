/**
 * Tutor brain v2 — the words of a language the engine reads in the tutor's replies and the learner's answers, one pack per
 * teaching language (keyed on its code, never on a partner). Engine code asks a pack; it holds no wording of its own.
 *
 * Task 7n (PART_ASK_LANGS), mic test 4 (embed-1795028886172, flag 3): the part-change ask in a Japanese-led reply
 * (「…次は Present perfect です。何か質問がありますか？それとも、このまま進みますか？」) was read by English frames only, so "Uh, move on."
 * opened nothing and the tutor asked again in English. A pack says how the ask is worded in its language: read by POSITION,
 * as the reply's last sentence (a go-on), with the question-first check as the sentence before it and the lead that names
 * the part ("次は X です。") before that.
 */

export interface V2LanguagePack {
  /** The lead of a part ask, said just before it, that names the part ("Next is present perfect.", 「次は Present perfect です。」). */
  askLead: RegExp;
  /** A go-on ask as a whole sentence ending the reply (「それとも、このまま進みますか？」, 「次は Past simple に進みますが、よろしいですか？」).
   *  Absent: the language's asks are read by its frames elsewhere (English: reply-gate.ts / part-close.ts, as before). */
  askGoOn?: RegExp;
  /** The question-first check as a whole sentence before the go-on (「何か質問がありますか？」). */
  askQuestionFirst?: RegExp;
  /** A filler leading a learner's answer ("Uh,", "Um", 「えっと、」): taken off before the answer is read. */
  answerFiller: RegExp;
}

// A Japanese go-on verb as a question: 進みますか / 進みましょうか / 進んでもいいですか / 進みますが、よろしいですか (and 行く, 移る).
const JA_GO = '(?:(?:進み|行き|移り)(?:ますか|ましょうか|ますが[、,]?\\s*(?:よろしい|いい|大丈夫)(?:です|でしょう)?か)|(?:進んで|行って|移って)も?(?:いい|よい|よろしい|大丈夫)(?:です|でしょう)?か)';
// Only these may come before it: a connective, このまま, and the destination as the lesson's next part (次に / 先へ / 次の…に / 次は X に).
// 「仕事は順調に進みますか？」 asks about their work: its words before the verb are none of these.
const JA_GO_ON = new RegExp(`^(?:(?:それとも|では|じゃあ|それでは|さて|そろそろ)[、,]?\\s*)*(?:このまま\\s*)?(?:次は[^。！？?]{1,40}?に\\s*|(?:次|先|つぎ|さき)(?:に|へ)\\s*|次の[^。！？?]{1,20}?(?:に|へ)\\s*)?${JA_GO}[。．]?[?？]?["'」』）)]*$`, 'u');
const JA_QUESTION_FIRST = /^(?:(?:では|じゃあ|まず|先に)[、,]?\s*)?(?:何か|なにか)?\s*(?:ご?質問|聞きたいこと)(?:は|が)(?:何か|なにか)?\s*(?:あります|ございます)か[。．]?[?？]?["'」』）)]*$/u;
const JA_LEAD = /^(?:(?:では|じゃあ|それでは|さて)[、,]?\s*)?次は[、,]?\s*\S/u;

export const V2_LANGUAGE_PACKS: Record<string, V2LanguagePack> = {
  en: {
    // Task 7i's lead (part-flow.ts NEXT_LEAD, moved here): "Next is …", the runtime's NEXTS, "Next: …".
    askLead: /^(?:(?:ok(?:ay)?|good|great|so|now|right)[,.!]?\s+)?next(?: (?:is|up is|up|comes|we have)\b|:)/i,
    answerFiller: /^(?:(?:uh|um|er|erm|ah|hmm)[,.]?\s+)+/i,
  },
  ja: {
    askLead: JA_LEAD,
    askGoOn: JA_GO_ON,
    askQuestionFirst: JA_QUESTION_FIRST,
    answerFiller: /^(?:(?:えっと|ええと|えーと|えーっと|あの|あのう|あのー|うーん|まあ|えー)[、,…]?\s*)+/u,
  },
};

/** The packs of the lesson's teaching languages; none given: every pack. A language with no pack has none. */
export function v2LanguagePacks(languages?: readonly string[]): V2LanguagePack[] {
  const codes = languages?.length ? languages.map((c) => c.toLowerCase().split(/[-_]/)[0]!) : Object.keys(V2_LANGUAGE_PACKS);
  return [...new Set(codes)].map((c) => V2_LANGUAGE_PACKS[c]).filter((x): x is V2LanguagePack => !!x);
}

/** Whether a sentence is a part ask's lead in one of the languages. */
export function v2IsAskLead(sentence: string, languages?: readonly string[]): boolean {
  const s = sentence.trim();
  return v2LanguagePacks(languages).some((p) => p.askLead.test(s));
}

/** The part ask a reply's sentences end on, read by position in the packs that word a go-on: the last sentence a go-on, the
 *  sentence before it when it is the question-first check, and the lead before those. `ask`: the ask's own sentences (one or
 *  two); `lead`: the lead ('' when none). Null: the reply does not end on such an ask. */
export function v2EndingAsk(sentences: readonly string[], languages?: readonly string[]): { ask: string; lead: string } | null {
  const xs = sentences.map((x) => x.trim()).filter(Boolean);
  const last = xs[xs.length - 1];
  if (!last) return null;
  for (const p of v2LanguagePacks(languages)) {
    if (!p.askGoOn?.test(last)) continue;
    let i = xs.length - 1;
    if (i >= 1 && p.askQuestionFirst?.test(xs[i - 1]!)) i -= 1;
    const ask = xs.slice(i).join(' ');
    const lead = i >= 1 && v2IsAskLead(xs[i - 1]!, languages) ? xs[i - 1]! : '';
    return { ask, lead };
  }
  return null;
}

/** A learner's answer with its leading fillers taken off ("Uh, move on." → "move on.", 「えっと、はい」 → 「はい」), in the lesson's
 *  languages; unchanged when nothing would be left. */
export function v2WithoutFillers(said: string, languages?: readonly string[]): string {
  let s = said.trim();
  for (let k = 0; k < 3; k++) {
    let changed = false;
    for (const p of v2LanguagePacks(languages)) { const t = s.replace(p.answerFiller, '').trim(); if (t && t !== s) { s = t; changed = true; } }
    if (!changed) break;
  }
  return s;
}
