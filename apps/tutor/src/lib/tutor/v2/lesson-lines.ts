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
  // 2026-11-24: Hindi, Hinglish, French, Spanish. Spoken lines: no digits and no symbols in them.
  // Hindi: everyday words and तुम, as a teacher talks to a student; nothing literary.
  hi: {
    checkIns: ['यहाँ तक समझ आया?', 'अब तक सब ठीक है?', 'यह साफ़ है, या मैं एक बार फिर समझाऊँ?', 'समझ में आ रहा है?'],
    goOn: 'तो अब आगे बढ़ें?',
    goOnOrQuestion: 'आगे बढ़ें, या पहले तुम्हें कुछ पूछना है?',
    timeUp: (first) => (first ? `${first}, आज का समय पूरा हो गया। तुमने बहुत अच्छा किया। अगली बार मिलते हैं।` : 'आज का समय पूरा हो गया। तुमने बहुत अच्छा किया। अगली बार मिलते हैं।'),
    lookAtBoard: 'बोर्ड पर लिखा सवाल देखो, और बताओ कि तुम्हें क्या लगता है।',
    correction: (fix) => `एक सुधार: ${fix}`,
    unreachable: 'अभी टीचर से संपर्क नहीं हो पाया। इसे एक बार फिर भेजो।',
    nextStep: 'तुम्हें क्या लगता है, अगला कदम क्या होना चाहिए?',
  },
  // Hinglish, as its row has the tutor write it: Hindi words in Devanagari, English words in English spelling.
  'hi-Latn': {
    checkIns: ['यहाँ तक clear है?', 'अब तक सब ठीक है?', 'समझ आया, या मैं एक बार फिर explain करूँ?', 'यह point clear है?'],
    goOn: 'तो next part पर चलें?',
    goOnOrQuestion: 'Next part पर चलें, या पहले तुम्हारा कोई doubt है?',
    timeUp: (first) => (first ? `${first}, आज का time पूरा हो गया। तुमने बहुत अच्छा किया। अगली class में मिलते हैं।` : 'आज का time पूरा हो गया। तुमने बहुत अच्छा किया। अगली class में मिलते हैं।'),
    lookAtBoard: 'Board पर question देखो, और बताओ कि तुम्हें क्या लगता है।',
    correction: (fix) => `एक correction: ${fix}`,
    unreachable: 'अभी teacher से connect नहीं हो पाया। इसे एक बार फिर भेजो।',
    nextStep: 'तुम्हें क्या लगता है, next step क्या होगा?',
  },
  // French: tu. The space before ? ! : is French typography; a sentence still ends on its mark.
  fr: {
    checkIns: ['Tu me suis jusque-là ?', "Ça va pour l'instant ?", "C'est clair, ou tu veux que je réexplique ?", 'Tu as compris ?'],
    goOn: 'On passe à la suite ?',
    goOnOrQuestion: "On passe à la suite, ou tu as d'abord une question ?",
    timeUp: (first) => (first ? `${first}, c'est tout pour aujourd'hui. Tu as bien travaillé. À la prochaine !` : "C'est tout pour aujourd'hui. Tu as bien travaillé. À la prochaine !"),
    lookAtBoard: 'Regarde la question au tableau, et dis-moi ce que tu en penses.',
    correction: (fix) => `Une petite correction : ${fix}`,
    unreachable: "Je n'ai pas pu joindre le tuteur à l'instant. Envoie ton message encore une fois, s'il te plaît.",
    nextStep: 'À ton avis, quelle est la prochaine étape ?',
  },
  // Spanish: tú, Latin American (never vosotros). A question opens with ¿.
  es: {
    checkIns: ['¿Vas bien hasta aquí?', '¿Me sigues hasta ahora?', '¿Quedó claro, o te lo explico otra vez?', '¿Se entiende?'],
    goOn: '¿Pasamos a la siguiente parte?',
    goOnOrQuestion: '¿Pasamos a la siguiente parte, o tienes alguna pregunta antes?',
    timeUp: (first) => (first ? `${first}, se nos acabó el tiempo por hoy. Hiciste un muy buen trabajo. ¡Hasta la próxima!` : 'Se nos acabó el tiempo por hoy. Hiciste un muy buen trabajo. ¡Hasta la próxima!'),
    lookAtBoard: 'Mira la pregunta en la pizarra y dime qué piensas.',
    correction: (fix) => `Una corrección: ${fix}`,
    unreachable: 'No pude comunicarme con el tutor en este momento. Envía tu mensaje otra vez, por favor.',
    nextStep: '¿Cuál crees que es el siguiente paso?',
  },
};

/** The engine's lines for a lesson taught in another language; null for an English lesson (the caller's own
 *  English wording stands) and for a language with no lines yet (English, as before, rather than nothing). */
export function v2LessonLines(languages: readonly string[] | null | undefined, mode?: 'voice' | 'text'): V2LessonLines | null {
  const lang = taughtIn(languages);
  // Hinglish is written in Latin letters in a spoken lesson as well as a typed one (2026-11-24, the first spoken
  // test: the tutor wrote it so by itself, the Hindi voice reads it as well as the Devanagari form, and it is what
  // students who asked for Hinglish can read on the screen). `mode` stays for a language whose typed form differs.
  void mode;
  return lang ? TYPED[lang.code] ?? LINES[lang.code] ?? null : null;
}

/**
 * 2026-11-24 (a typed Hinglish test): the lines of a TYPED session, for a language that is typed in another script
 * than it is spoken from. Hinglish is typed in Latin letters, by the tutor and by students ("Bilkul sahi, x = 4 hai.");
 * the speech form above (Hindi words in Devanagari, for the voice) put Hindi script into such a chat, and the
 * student objected. A spoken session keeps the speech form; a language with no row here types as it speaks.
 */
const TYPED: Readonly<Record<string, V2LessonLines>> = {
  'hi-Latn': {
    checkIns: ['Yahan tak clear hai?', 'Ab tak sab theek hai?', 'Samajh aaya, ya main ek baar phir explain karun?', 'Yeh point clear hai?'],
    goOn: 'To next part par chalein?',
    goOnOrQuestion: 'Next part par chalein, ya pehle koi doubt hai?',
    timeUp: (first) => (first ? `${first}, aaj ka time poora ho gaya. Tumne bahut achha kiya. Agli class mein milte hain.` : 'Aaj ka time poora ho gaya. Tumne bahut achha kiya. Agli class mein milte hain.'),
    lookAtBoard: 'Board par question dekho, aur batao tumhe kya lagta hai.',
    correction: (fix) => `Ek correction: ${fix}`,
    unreachable: 'Abhi teacher se connect nahi ho paya. Ise ek baar phir bhejo.',
    nextStep: 'Tumhe kya lagta hai, next step kya hoga?',
  },
};
const ALL_LINES: readonly V2LessonLines[] = [...Object.values(LINES), ...Object.values(TYPED)];

/** Every check-in the engine may have appended, in any language: what tells one from a question the tutor put. */
export const V2_LESSON_CHECK_INS: readonly string[] = ALL_LINES.flatMap((l) => l.checkIns);

/** 2026-11-24: the engine's own asks before a held page, in any language, and those of them that offer a question
 *  first. The part-change readers know an ask by English and Japanese wording (part-close.ts, reply-gate.ts,
 *  part-flow.ts): these they know word for word, so the page held behind 「我們繼續下一個部分，好嗎？」 or "On passe à la
 *  suite ?" opens on the learner's yes as it does in English. */
const PART_ASKS: readonly string[] = ALL_LINES.flatMap((l) => [l.goOn, l.goOnOrQuestion]);
const QUESTION_FIRST_ASKS: readonly string[] = ALL_LINES.map((l) => l.goOnOrQuestion);
/** Whether `text` holds one of the engine's own part asks. */
export const v2HoldsLessonPartAsk = (text: string): boolean => PART_ASKS.some((l) => text.includes(l));
/** Whether a reply ends on the engine's own part ask that offers a question first: there a no is "no questions". */
export const v2EndsOnLessonQuestionFirst = (reply: string): boolean => { const t = reply.trim(); return QUESTION_FIRST_ASKS.some((l) => t.endsWith(l)); };
