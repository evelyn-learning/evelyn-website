/* The short things a learner says in a lesson taught in Hindi, Hinglish, French or Spanish (2026-11-24,
   v2/lesson-words.ts): brief answers, calls to stop or wait, thanks and goodbyes over the close, and the answer to
   "shall we go on?" (in Chinese too). Every English case here is a regression: English must read as before. Pure. */
import assert from 'node:assert/strict';
import { v2CloseCalledOff } from '../src/lib/tutor/v2/close-mic';
import { asksToWait, reopensClose } from '../src/lib/tutor/v2/close-heard';
import { answeredAsItEnded } from '../src/lib/tutor/v2/interrupted';
import { plainlyTheStudent, sameWords, studentWordsIn } from '../src/lib/tutor/v2/room-voices';
import { v2MoveAnswer } from '../src/lib/tutor/v2/part-flow';
import { leftOpen, mayOpenPart } from '../src/lib/tutor/v2/part-close';
import { isPartFrame } from '../src/lib/tutor/v2/reply-gate';
import { v2LessonLines } from '../src/lib/tutor/v2/lesson-lines';
import { LESSON_WORDS, lessonMoveWords } from '../src/lib/tutor/v2/lesson-words';
import { LESSON_LANGUAGES } from '../src/lib/tutor/voice/lesson-language';

let n = 0; const t = (name: string, f: () => void) => { f(); n++; console.log('PASS', name); };

t('every taught language but English and Japanese has its part-change answers', () => {
  for (const row of LESSON_LANGUAGES) {
    const own = lessonMoveWords(row.base);
    if (row.base === 'en' || row.base === 'ja') assert.equal(own, null, row.code); else assert.ok(own, row.code);
  }
  assert.deepEqual(Object.keys(LESSON_WORDS).sort(), ['es', 'fr', 'hi']);
});

t('a brief answer over the end of a question was heard', () => {
  const Q = ['Good.', 'Shall we go on?'];
  for (const said of ['हाँ', 'हां।', 'जी हाँ, चलो', 'ठीक है', 'नहीं', 'अभी नहीं', 'समझ गया', 'oui', 'Oui, vas-y.', "d'accord", 'non, pas encore', 'sí', 'Sí, claro.', 'vale', 'todavía no', 'Yeah.', "Yeah, let's go."]) assert.equal(answeredAsItEnded(said, Q, 2), true, said);
  for (const said of ['हाँ लेकिन मुझे पहले वाला सवाल फिर से समझना है', 'x बराबर चार', 'la réponse est quatre', 'la respuesta es cuatro', 'wait what did you say about the wheat side of it']) assert.equal(answeredAsItEnded(said, Q, 2), false, said);
  // Over an earlier sentence, or over a statement, it is still a cut.
  assert.equal(answeredAsItEnded('हाँ', Q, 1), false); assert.equal(answeredAsItEnded('oui', ['So x is 4.'], 1), false);
});

t('a call to stop, wait or say it again, and a brief answer, are the student beyond doubt', () => {
  for (const said of ['रुको', 'रुको!', 'एक मिनट', 'टीचर, एक मिनट', 'फिर से बताओ', 'दोबारा समझाओ', 'क्या कहा?', 'थोड़ा धीरे बोलो', 'समझ नहीं आया', 'मुझे समझ नहीं आया', 'हाँ', 'ठीक है', 'धन्यवाद', 'पता नहीं',
    'attends', 'Attends !', 'stop', 'une seconde', 'tu peux répéter ?', 'Pardon, tu peux répéter la question ?', "j'ai pas compris", 'je ne comprends pas', 'moins vite', 'oui', 'merci',
    'espera', '¡Espera!', 'un momento', '¿puedes repetir?', 'Perdón, ¿me lo puedes repetir?', 'no entendí', 'más despacio', 'otra vez', 'sí', 'gracias',
    'Stop.', 'wait', 'Sorry, can you say that again?', 'yes', "I don't know"]) assert.equal(plainlyTheStudent(said), true, said);
  for (const said of ['आज मौसम बहुत अच्छा है और हम बाहर जाएंगे', 'सरकार ने कल नई योजना की घोषणा की', 'le président a annoncé hier une nouvelle réforme', 'el gobierno anunció nuevas medidas económicas hoy', 'eligible patients', 'Call your prescribers']) assert.equal(plainlyTheStudent(said), false, said);
  // A Devanagari word is one word with its vowel signs, in the room check's comparisons.
  assert.equal(sameWords('समीकरण को हल करो', 'समीकरण, को हल करो!'), true); assert.equal(sameWords('समीकरण', 'समकरण'), false);
  assert.equal(studentWordsIn('उत्तर चार है', 'आज की ताज़ा खबर उत्तर चार है मौसम साफ़ रहेगा'), 'उत्तर चार है');
});

t('asking the tutor to wait', () => {
  for (const said of ['रुको', 'एक मिनट रुको', 'मुझे थोड़ा time दो', 'सोचने दो', 'attends', 'une seconde', 'laisse-moi réfléchir', 'Attends, je cherche.', 'espera', 'dame un minuto', 'déjame pensar', 'un momento, por favor',
    'pause for a second', 'hold on, give me a minute', 'Could you hold on a minute?']) assert.equal(asksToWait(said), true, said);
  for (const said of ['रुको, यह negative क्यों है?', 'x चार है', "attends, pourquoi c'est négatif ?", 'x vaut quatre', 'espera, ¿por qué es negativo?', 'x es cuatro',
    'hold on, what does that mean?', 'she attends school on Mondays', 'pause, why is it negative?', 'the answer is four']) assert.equal(asksToWait(said), false, said);
});

t('thanks and a goodbye over the closing words let the lesson end; anything else reopens it', () => {
  for (const said of ['धन्यवाद टीचर, बाय', 'ठीक है, thank you', 'हाँ जी, धन्यवाद', 'धन्यवाद रिया', 'शुक्रिया, फिर मिलेंगे', 'merci, au revoir', 'Merci beaucoup, à bientôt !', 'merci Clara', "D'accord, merci, bonne journée.",
    'gracias, hasta luego', '¡Muchas gracias, profe! Adiós.', 'gracias Laura', 'Sí, gracias, nos vemos.', 'thanks, bye', 'thank you Riley', 'Okay, great, see you next time.']) assert.equal(v2CloseCalledOff(said), false, said);
  for (const said of ['रुको, एक सवाल है', 'एक और सवाल पूछना था', 'लेकिन', 'धन्यवाद, पर homework क्या है?', "attends, j'ai une question", 'mais', 'merci, mais je ne comprends pas la fin', 'espera, una pregunta', 'pero no entendí', 'gracias, ¿y la tarea?',
    'wait one more thing', 'thanks, but what about part b']) assert.equal(v2CloseCalledOff(said), true, said);
  assert.equal(reopensClose('merci, au revoir'), false); assert.equal(reopensClose('gracias, adiós'), false); assert.equal(reopensClose('thanks, bye'), false); assert.equal(reopensClose('wait'), true);
});

t('the held page opens on a yes in the lesson\'s language', () => {
  const CASES: Array<[string, { go: string[]; no: string[]; question: string[]; other: string[] }]> = [
    ['zh-TW', { go: ['好', '好的，繼續', '可以', '沒問題'], no: ['沒有', '沒有，謝謝'], question: ['為什麼是負的？', '我有一個問題'], other: ['等一下', '再說一次'] }],
    ['zh-CN', { go: ['好', '继续', '没问题'], no: ['没有'], question: ['为什么是负的？'], other: ['等一下', '再讲一遍'] }],
    ['hi', { go: ['हाँ', 'हाँ, चलो', 'जी', 'ठीक है', 'आगे बढ़ो', 'कोई सवाल नहीं', 'नहीं, आगे चलो'], no: ['नहीं', 'जी नहीं'], question: ['एक सवाल है', 'यह negative क्यों है?', 'क्यों'], other: ['रुको', 'अभी नहीं', 'फिर से समझाओ', 'समझ नहीं आया'] }],
    ['hi-Latn', { go: ['हाँ', 'yes', 'okay, next', 'ठीक है, चलो', 'कोई doubt नहीं'], no: ['नहीं', 'no'], question: ['एक doubt है', 'why is it negative?'], other: ['रुको', 'wait', 'एक बार फिर explain करो'] }],
    ['fr', { go: ['oui', 'Oui, vas-y.', "d'accord", 'on continue', 'pas de question', 'non, on continue', 'ok'], no: ['non', 'Non, merci.'], question: ["j'ai une question", "pourquoi c'est négatif ?", 'comment'], other: ['attends', 'pas encore', 'réexplique', "je n'ai pas compris"] }],
    ['es', { go: ['sí', 'Sí, sigamos.', 'claro', 'dale', 'no tengo preguntas', 'no, sigamos', 'ok'], no: ['no', 'No, gracias.'], question: ['tengo una pregunta', '¿por qué es negativo?', 'cómo'], other: ['espera', 'todavía no', 'explícame otra vez', 'no entendí'] }],
  ];
  for (const [code, c] of CASES) {
    const l = v2LessonLines([code])!;
    const plain = `x = 4. ${l.goOn}`; const first = `x = 4. ${l.goOnOrQuestion}`;
    for (const said of c.go) for (const last of [plain, first]) assert.equal(v2MoveAnswer(said, last, [code]), 'go', `${code}: ${said}`);
    // A bare no is "no questions" only to an ask that offers one first.
    for (const said of c.no) { assert.equal(v2MoveAnswer(said, first, [code]), 'go', `${code}: ${said}`); assert.equal(v2MoveAnswer(said, plain, [code]), 'other', `${code}: ${said} (no question offered)`); }
    for (const said of c.question) assert.equal(v2MoveAnswer(said, first, [code]), 'question', `${code}: ${said}`);
    for (const said of c.other) assert.equal(v2MoveAnswer(said, first, [code]), 'other', `${code}: ${said}`);
    // The engine's own ask leaves the way open, strictly too, and counts as a part-change frame.
    for (const ask of [l.goOn, l.goOnOrQuestion]) {
      const last = `x = 4. ${ask}`;
      assert.equal(leftOpen(last, c.go[0]!, true), true, `${code}: ${ask}`); assert.equal(isPartFrame(ask), true, `${code}: ${ask}`);
      assert.equal(mayOpenPart({ title: 'Practice', studentSaid: c.go[0]!, lastTutor: last, pagesOpen: 3, strict: true, go: v2MoveAnswer(c.go[0]!, last, [code]) === 'go' }), true, `${code}: ${ask}`);
      assert.equal(mayOpenPart({ title: 'Practice', studentSaid: c.other[0]!, lastTutor: last, pagesOpen: 3, strict: true, go: v2MoveAnswer(c.other[0]!, last, [code]) === 'go' }), false, `${code}: ${ask} / ${c.other[0]}`);
    }
  }
});

t('an English lesson\'s part-change answers are read as before', () => {
  const ask = 'Next is worked example. Shall we go on, or do you have a question first?';
  for (const [said, want] of [['Yes.', 'go'], ['No.', 'go'], ['Uh, move on.', 'go'], ['Why is it negative?', 'question'], ['Please explain that again.', 'other'], ['sí', 'other'], ['oui', 'other'], ['हाँ', 'other'], ['好', 'other']] as const) {
    assert.equal(v2MoveAnswer(said, ask), want, said); assert.equal(v2MoveAnswer(said, ask, ['en']), want, said); assert.equal(v2MoveAnswer(said, ask, ['en', 'ja']), want, said);
  }
  assert.equal(v2MoveAnswer('はい', '次に進んでもいいですか？', ['ja']), 'go');
  assert.equal(isPartFrame('Shall we go on?'), true); assert.equal(isPartFrame('Does that make sense so far?'), false); assert.equal(isPartFrame('यहाँ तक समझ आया?'), false); assert.equal(isPartFrame('Tu as compris ?'), false);
  assert.equal(leftOpen('So x is 4. Does that make sense so far?', 'Yes.', true), false); assert.equal(leftOpen('तो x चार है। यहाँ तक समझ आया?', 'हाँ', true), false);
});

t('typed Hinglish: the answer to "shall we go on?" in Latin letters', () => {
  const typed = v2LessonLines(['hi-Latn'], 'text')!;
  const plain = `Bilkul sahi, x = 4 hai. ${typed.goOn}`; const first = `Bilkul sahi, x = 4 hai. ${typed.goOnOrQuestion}`;
  for (const langs of [['hi-Latn'], ['hi']]) {
    for (const said of ['haan samajh gaya, aage badhao', 'haan', 'han', 'ha', 'ji', 'theek hai', 'thik hai', 'ok', 'aage badho', 'aage badhao', 'aage badhein', 'chalo', 'aage chalein', 'samajh gayi', 'samajh aaya', 'koi doubt nahi', 'yes', 'Haan sir, aage badhiye']) for (const last of [plain, first]) assert.equal(v2MoveAnswer(said, last, langs), 'go', `${langs}: ${said}`);
    for (const said of ['nahi', 'nahin', 'Nahi sir', 'no']) { assert.equal(v2MoveAnswer(said, first, langs), 'go', said); assert.equal(v2MoveAnswer(said, plain, langs), 'other', `${said} (no question offered)`); }
    for (const said of ['ek doubt hai', 'ek sawal hai', 'mera ek doubt hai', 'yeh negative kyun hai?', 'kyun']) assert.equal(v2MoveAnswer(said, first, langs), 'question', said);
    for (const said of ['abhi nahi', 'nahi samajh aaya', 'samajh nahi aaya', 'phir se batao', 'dobara samjhao', 'ruko', 'ek minute', 'pata nahi']) assert.equal(v2MoveAnswer(said, first, langs), 'other', said);
  }
  for (const ask of [typed.goOn, typed.goOnOrQuestion]) {
    const last = `x = 4 hai. ${ask}`;
    assert.equal(isPartFrame(ask), true, ask); assert.equal(leftOpen(last, 'haan', true), true, ask);
    assert.equal(mayOpenPart({ title: 'Practice', studentSaid: 'haan, aage badho', lastTutor: last, pagesOpen: 3, strict: true, go: v2MoveAnswer('haan, aage badho', last, ['hi-Latn']) === 'go' }), true, ask);
    assert.equal(mayOpenPart({ title: 'Practice', studentSaid: 'nahi samajh aaya', lastTutor: last, pagesOpen: 3, strict: true, go: v2MoveAnswer('nahi samajh aaya', last, ['hi-Latn']) === 'go' }), false, ask);
  }
  // Read in no other lesson: an English one reads these exactly as before.
  const en = 'Next is worked example. Shall we go on, or do you have a question first?';
  for (const langs of [undefined, ['en'], ['en', 'ja'], ['en', 'hi'], ['fr'], ['es']]) for (const said of ['haan', 'han', 'ha', 'ji', 'theek hai', 'aage badho', 'chalo', 'nahi', 'ek doubt hai', 'ruko', 'samajh gaya']) assert.equal(v2MoveAnswer(said, en, langs as string[] | undefined), 'other', `${langs}: ${said}`);
  for (const langs of [undefined, ['en']]) { assert.equal(v2MoveAnswer('ok', en, langs), 'go'); assert.equal(v2MoveAnswer('no', en, langs), 'go'); assert.equal(v2MoveAnswer('yes', en, langs), 'go'); }
});

t('typed Hinglish: thanks and a goodbye in Latin letters, only in a Hindi or Hinglish lesson', () => {
  for (const said of ['thank you sir', 'dhanyavaad', 'shukriya sir, bye', 'alvida', 'theek hai, phir milte hain', 'Bahut dhanyavaad teacher', 'haan ji, thank you']) assert.equal(v2CloseCalledOff(said, ['hi-Latn']), false, said);
  for (const said of ['ruko ek doubt hai', 'lekin', 'thank you, par homework kya hai?', 'ek aur sawal']) assert.equal(v2CloseCalledOff(said, ['hi-Latn']), true, said);
  // Without the session, and in an English one, the English reading stands.
  for (const langs of [undefined, ['en'], ['fr']]) { assert.equal(v2CloseCalledOff('theek hai, phir milte hain', langs), true); assert.equal(v2CloseCalledOff('thanks, bye', langs), false); assert.equal(v2CloseCalledOff('thank you sir', langs), false); assert.equal(v2CloseCalledOff('wait one more thing', langs), true); assert.equal(reopensClose('ji', langs), false); assert.equal(reopensClose('wait', langs), true); }
});

console.log(`\n${n} passed`);
