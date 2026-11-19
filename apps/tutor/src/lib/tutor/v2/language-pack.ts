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

import { TUTOR_V2_PART_ASK_CLAUSES } from '../orchestrator/flags';

export interface V2LanguagePack {
  /** The lead of a part ask, said just before it, that names the part ("Next is present perfect.", 「次は Present perfect です。」). */
  askLead: RegExp;
  /** Task 7r fix round 3 (I-D): the wider forward leads, read only with PART_ASK_CLAUSES (次に / つぎは / 続いて / このあと). */
  askLeadWide?: RegExp;
  /** A go-on ask as a whole sentence ending the reply (「それとも、このまま進みますか？」, 「次は Past simple に進みますが、よろしいですか？」).
   *  Absent: the language's asks are read by its frames elsewhere (English: reply-gate.ts / part-close.ts, as before). */
  askGoOn?: RegExp;
  /** The question-first check as a whole sentence before the go-on (「何か質問がありますか？」). */
  askQuestionFirst?: RegExp;
  /** Task 7r (PART_ASK_CLAUSES): the ask read by its clauses, not as whole-sentence templates. `asks`: a sentence that asks or
   *  invites (か。 / ？ / ましょうか / でしょうか / いいですか); `goOn`: a go-on verb as asked (進みますか, 続けますか, そのまま進みましょうか,
   *  進んでよろしいでしょうか); `questions`: the "questions?" clause (質問がありますか); `or`: a sentence that opens as the other half
   *  of a choice (それとも…). Absent: askGoOn / askQuestionFirst as before. */
  askClauses?: { asks: RegExp; goOn: RegExp; questions: RegExp; or: RegExp };
  /** Task 7r (ASK_ONE_TEST): asks to speak or try the pack's wording carries with no question mark (Japanese: 〜てみましょう on a
   *  learner's verb, 繰り返して, 教えて / 言って… ください, a sentence ending どうぞ). `not`: what makes such a sentence no ask now (a
   *  condition, later, homework: 「わからない単語があれば、いつでも教えてください。」, 「次回までに…書いてみてください。」). A request quoted
   *  as a phrase being taught (「"Please tell me" は「教えてください」です。」) never counts: quoted spans are left out first. */
  invites?: { ask: RegExp; not: RegExp };
  /** A filler leading a learner's answer ("Uh,", "Um", 「えっと、」): taken off before the answer is read. */
  answerFiller: RegExp;
}

// A Japanese go-on verb as a question: 進みますか / 進みましょうか / 進んでもいいですか / 進みますが、よろしいですか (and 行く, 移る).
const JA_GO = '(?:(?:進み|行き|移り)(?:ますか|ましょうか|ますが[、,]?\\s*(?:よろしい|いい|大丈夫)(?:です|でしょう)?か)|(?:進んで|行って|移って)も?(?:いい|よい|よろしい|大丈夫)(?:です|でしょう)?か)';
// Only these may come before it: a connective, このまま, and the destination as the lesson's next part (次に / 先へ / 次の…に / 次は X に).
// 「仕事は順調に進みますか？」 asks about their work: its words before the verb are none of these.
const JA_GO_ON = new RegExp(`^(?:(?:それとも|では|じゃあ|それでは|さて|そろそろ)[、,]?\\s*)*(?:このまま\\s*)?(?:次は[^。！？?]{1,40}?に\\s*|(?:次|先|つぎ|さき)(?:に|へ)\\s*|次の[^。！？?]{1,20}?(?:に|へ)\\s*)?${JA_GO}[。．]?[?？]?["'」』）)]*$`, 'u');
const JA_QUESTION_FIRST = /^(?:(?:では|じゃあ|まず|先に)[、,]?\s*)?(?:何か|なにか)?\s*(?:ご?質問|聞きたいこと)(?:は|が)(?:何か|なにか)?\s*(?:あります|ございます)か[。．]?[?？]?["'」』）)]*$/u;
// Task 7r (PART_ASK_CLAUSES): mic test 5 (embed-1795050656326) asked 「質問がありますか、それとも続けますか。」, 「それとも、そのまま進みましょうか。」,
// 「過去形の練習に進んでよろしいでしょうか。」, 「それとも、先にまとめに進みますか。」, 「最後にまとめに進みましょうか。」. A go-on verb only in an asked
// form (続けてみますか, a practice ask, has none).
const JA_CLAUSE_GO = /(?:進み|行き|移り|続け|始め|入り)(?:ますか|ましょうか|ますが)|(?:進んで|行って|移って|続けて|始めて|入って)(?:も)?(?:いい|よい|よろしい|大丈夫)(?:です|でしょう)?か|(?:その|この)まま[^。！？?]{0,12}(?:進|行|続け)/u;
const JA_CLAUSE_QUESTIONS = /(?:ご?質問|聞きたいこと)(?:は|が)(?:何か|なにか)?\s*(?:あります|ございます|ありません)か/u;
const JA_CLAUSE_ASKS = /(?:[?？]|か[。．]?)["'」』）)]*\s*$/u;
const JA_CLAUSE_OR = /^(?:それとも|または|あるいは)/u;
// Task 7r fix round 1 (I2): not 考え / 練習し / 始め + てみましょう (「一緒に考えてみましょう。」 is the tutor's set-up, as 「一語ずつ練習しましょう。」).
const JA_INVITE_ASK = /(?:言っ|話し|答え|書い|読ん|使っ|作っ|続け|繰り返し|発音し|尋ね)てみましょう|繰り返して(?:ください|みて|ね|[。．！!]|$)|(?:教えて|始めて|聞かせて|言って|話して|答えて|書いて|読んで|使って|作って|続けて|発音して|練習して|選んで|尋ねて)(?:みて)?(?:ください|くださいね|ちょうだい|もらえますか)|どうぞ[。．！!]?["'」』）)]*$/u;
// Fix round 2 (N1): whole markers only, and only ever applied to an invitation (never to a sentence that is itself a question):
// 今までに / 同時に / 〜ときは in 「今までに、海外出張をしたことがありますか。」 are no condition.
const JA_INVITE_NOT = /次回|次の機会|今度[はも、,]|(?<!今)までに|(?:あれ|すれ|れ)ば[、,]|があれば|あったら|たら[、,]|なら[、,]|いつでも|宿題|あとで|後で/u;
// Fix round 2 (N3): forward leads besides 次は: 次に、 / つぎは / では次 / 続いて / このあと(は) / この次は (「次に、会話の練習をします。」).
const JA_LEAD = /^(?:(?:では|じゃあ|それでは|さて)[、,]?\s*)?次は[、,]?\s*\S/u;
const JA_LEAD_WIDE = /^(?:(?:では|じゃあ|それでは|さて)[、,]?\s*)?(?:次は|次に|つぎは|つぎに|続いて|このあと(?:は)?|この後(?:は)?|この次は)[、,]?\s*\S/u;

export const V2_LANGUAGE_PACKS: Record<string, V2LanguagePack> = {
  en: {
    // Task 7i's lead (part-flow.ts NEXT_LEAD, moved here): "Next is …", the runtime's NEXTS, "Next: …".
    askLead: /^(?:(?:ok(?:ay)?|good|great|so|now|right)[,.!]?\s+)?next(?: (?:is|up is|up|comes|we have)\b|:)/i,
    answerFiller: /^(?:(?:uh|um|er|erm|ah|hmm)[,.]?\s+)+/i,
  },
  ja: {
    askLead: JA_LEAD,
    askLeadWide: JA_LEAD_WIDE,
    askGoOn: JA_GO_ON,
    askQuestionFirst: JA_QUESTION_FIRST,
    askClauses: { asks: JA_CLAUSE_ASKS, goOn: JA_CLAUSE_GO, questions: JA_CLAUSE_QUESTIONS, or: JA_CLAUSE_OR },
    invites: { ask: JA_INVITE_ASK, not: JA_INVITE_NOT },
    answerFiller: /^(?:(?:えっと|ええと|えーと|えーっと|あの|あのう|あのー|うーん|まあ|えー)[、,…]?\s*)+/u,
  },
};

/** The packs of the lesson's teaching languages; none given: every pack. A language with no pack has none. */
export function v2LanguagePacks(languages?: readonly string[]): V2LanguagePack[] {
  const codes = languages?.length ? languages.map((c) => c.toLowerCase().split(/[-_]/)[0]!) : Object.keys(V2_LANGUAGE_PACKS);
  return [...new Set(codes)].map((c) => V2_LANGUAGE_PACKS[c]).filter((x): x is V2LanguagePack => !!x);
}

/** Task 7r fix round 2: whether one of the languages reads part asks by clauses (a pack with askClauses). */
export function v2ReadsByClauses(languages?: readonly string[], clauses: boolean = TUTOR_V2_PART_ASK_CLAUSES): boolean {
  return clauses && v2LanguagePacks(languages).some((p) => !!p.askClauses);
}

/** Whether a sentence is a part ask's lead in one of the languages. */
export function v2IsAskLead(sentence: string, languages?: readonly string[], wide: boolean = false): boolean {
  const s = sentence.trim();
  return v2LanguagePacks(languages).some((p) => (wide && p.askLeadWide ? p.askLeadWide : p.askLead).test(s));
}

/** The part ask a reply's sentences end on, read by position in the packs that word a go-on: the last sentence a go-on, the
 *  sentence before it when it is the question-first check, and the lead before those. `ask`: the ask's own sentences (one or
 *  two); `lead`: the lead ('' when none). Null: the reply does not end on such an ask. */
/** Task 7r (PART_ASK_CLAUSES, `clauses`): in a pack with askClauses, by clauses: the last sentence asks; the sentence before it is
 *  part of the ask when it asks too and the last holds no go-on or questions clause of its own or opens as the other half of a
 *  choice (「最後にまとめに進みましょうか。」「それとも、もう一語練習しますか。」); the ask holds a go-on verb or the questions clause; `lead` is
 *  the sentence before the ask only when it is a "次は…" / "Next is…" lead (fix round 1, C1: 「次は会話の練習です。」). Whether it names a plan part
 *  is the caller's test (part-flow.ts v2EndingPartAsk). */
export function v2EndingAsk(sentences: readonly string[], languages?: readonly string[], clauses: boolean = TUTOR_V2_PART_ASK_CLAUSES): { ask: string; lead: string } | null {
  const xs = sentences.map((x) => x.trim()).filter(Boolean);
  const last = xs[xs.length - 1];
  if (!last) return null;
  for (const p of v2LanguagePacks(languages)) {
    const c = clauses ? p.askClauses : undefined;
    if (c) {
      if (!c.asks.test(last)) continue;
      const holds = (x: string) => c.goOn.test(x) || c.questions.test(x);
      let i = xs.length - 1;
      const prev = xs[i - 1];
      if (prev && c.asks.test(prev) && (holds(prev) || c.or.test(last)) && (!holds(last) || c.or.test(last))) i -= 1;
      const askXs = xs.slice(i);
      if (!askXs.some(holds)) continue;
      // Fix round 1 (C1): the sentence before is the lead only as a "次は…" / "Next is…" lead (a lead pointing forward), in any of
      // the languages: 「過去形とは違って、今も続いていることを表します。何か質問はありますか。」 is the lesson's contrast and a check-in.
      // Fix round 2 (N3): a choice between doing something and moving on, with no questions clause (「発音の練習もできます。やりますか、それとも、
      // まとめに進みますか。」), reads the part offered in the sentence before it as well: the learner names the one they want.
      const before = i >= 1 ? xs[i - 1]! : '';
      const choice = askXs.some((x) => /それとも/u.test(x)) && !askXs.some((x) => c.questions.test(x));
      return { ask: askXs.join(' '), lead: before && (v2IsAskLead(before, languages, true) || choice) ? before : '' };
    }
    if (!p.askGoOn?.test(last)) continue;
    let i = xs.length - 1;
    if (i >= 1 && p.askQuestionFirst?.test(xs[i - 1]!)) i -= 1;
    const ask = xs.slice(i).join(' ');
    const lead = i >= 1 && v2IsAskLead(xs[i - 1]!, languages) ? xs[i - 1]! : '';
    return { ask, lead };
  }
  return null;
}

/** A quoted span used as a phrase ("…", 「…」 followed by は / と / という / です / の / を…): a phrase being taught, not said to them. */
const QUOTED_PHRASE = /(?:「[^」]*」|『[^』]*』|"[^"]*"|“[^”]*”)(?=\s*(?:は|と|って|という|です|でした|の|を|で|に|も|が|より))/gu;

/** Task 7r (ASK_ONE_TEST): whether a sentence asks them to speak or try something in the wording of one of the packs (none
 *  given: every pack), its quoted phrases left out, and not under a condition or for later (fix round 1, I2). */
export function v2InvitesToSpeak(sentence: string, languages?: readonly string[]): boolean {
  const s = v2WithoutQuotedPhrases(sentence);
  return !!s && !v2InviteHeldBack(s, languages) && v2LanguagePacks(languages).some((p) => !!p.invites && p.invites.ask.test(s));
}
/** A sentence with its quoted phrases left out (QUOTED_PHRASE). */
export const v2WithoutQuotedPhrases = (sentence: string) => sentence.replace(QUOTED_PHRASE, ' ').trim();
/** Task 7r fix round 1 (I2): a request under a condition or for later in one of the packs (「…があれば、いつでも教えてください。」). */
export function v2InviteHeldBack(sentence: string, languages?: readonly string[]): boolean {
  return v2LanguagePacks(languages).some((p) => !!p.invites && p.invites.not.test(sentence));
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
