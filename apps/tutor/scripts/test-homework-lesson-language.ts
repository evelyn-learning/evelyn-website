/* Homework in a lesson taught in Chinese or Japanese (2026-11-24, a Taiwan worksheet): the learner's answer as the
   checks read it, values named in Chinese, part labels of any script, the reply checks' wording, the plan's and the
   panel's words. Every English case here is a regression: English must read exactly as before. Pure: no model call,
   no database. */
import assert from 'node:assert/strict';
import { answerText, fullWidthToAscii } from '../src/lib/tutor/voice/answer-text';
import { keyedVerdicts, sanitizeConfirmedMarks, formatKeyedVerdictDebug, parseKeyedVerdictDebug } from '../src/lib/tutor/voice/keyed-verdict';
import { namedValues, partsAgree, normalizeKeyParts, KEY_SOLVE_SYSTEM, SAME_STATEMENT_SYSTEM } from '../src/lib/tutor/homework-build/key-solve';
import { BUILD_LOGIC_VERSION } from '../src/lib/tutor/homework-build/types';
import type { AnswerKey, AnswerPart } from '../src/lib/tutor/homework-build/types';
import { v2HomeworkCheck, sheetProblemNamed, problemNumbersNamed, partLabel, workedAnswerCredit } from '../src/lib/tutor/v2/homework';
import { v2HomeworkFacts } from '../src/lib/tutor/v2/homework-facts';
import { verdictMissing, lastQuestionOf, nonAnswer, isGuess, isBareNumber, givesCredit, unearnedCredit, castsDoubt, V2_VERDICT_OPENERS, V2_VERDICT_OPENERS_BY_LANGUAGE, v2VerdictOpeners } from '../src/lib/tutor/v2/homework-guards';
import { homeworkWording } from '../src/lib/tutor/lesson-plan/homework-wording';
import { buildHomeworkProblemPlan } from '../src/lib/tutor/lesson-plan/homework-problem';
import { buildHomeworkPlanFields } from '../src/lib/tutor/lesson-plan/homework';
import { homeworkProblemOf } from '../src/lib/tutor/lesson-plan/homework-problem-meta';
import { sessionStrings } from '../src/lib/tutor/i18n/session-strings';
import { TRANSCRIBE_MATERIAL_PROMPT_SINGLE, buildBatchTranscribePrompt } from '../src/lib/tutor/lesson-plan/material-extract';
import type { V2HomeworkProblem, V2State } from '../src/lib/tutor/v2/types';

const tests: Array<[string, () => void | Promise<void>]> = [];
const t = (name: string, f: () => void | Promise<void>) => { tests.push([name, f]); };

const num = (label: string, final: string, value: number, units?: string): AnswerPart => ({ label, final, canonical: { kind: 'number', value, ...(units ? { units } : {}) } });
const parts = (raw: Array<{ label: string; final: string; kind: 'number' | 'text'; number?: number; units?: string }>) =>
  normalizeKeyParts({ parts: raw.map((p) => ({ label: p.label, final: p.final, canonical: { kind: p.kind, number: p.number ?? 0, text: p.kind === 'text' ? p.final : '', units: p.units ?? '' } })) })!;
const key = (ps: AnswerPart[]): AnswerKey => ({ parts: ps, solvers: ['a', 'b'] });
// The five keys the build made for the test sheet (聯立方程式, 一元一次方程式, 分數計算, 雞兔同籠, 外角).
const K1 = key(parts([{ label: '', final: 'x = 3, y = 2', kind: 'text' }]));
const K2 = key([num('', 'x = 11', 11)]);
const K3 = key([num('1', '5/4', 1.25), num('2', '1', 1)]);
const K4 = key(parts([{ label: '', final: '雞23隻，兔12隻', kind: 'text' }]));
const K5 = key([num('', '110°', 110, '°')]);

/** One message through the v2 answer check, as "part:verdict(value)" joined, or UNDECIDED; then whether the problem is done. */
async function check(k: AnswerKey, said: string, history: string[] = []): Promise<string> {
  const problem: V2HomeworkProblem = { text: 'p', verified: true, hasFigure: false, parts: k.parts.map((p) => partLabel(p.label)) };
  const state = { history: history.map((h) => ({ role: 'user' as const, content: h })) } as unknown as V2State;
  const r = await v2HomeworkCheck({ key: k, problem, state, studentSaid: said, proseMatch: async () => null });
  return `${r.verdicts.map((v) => `${v.part || '·'}:${v.verdict}${v.value ? `(${v.value})` : ''}`).join(' ') || 'UNDECIDED'}${r.done ? ' DONE' : ''}`;
}
const RIGHT1 = '·:correct(x) ·:correct(y) DONE';
const WRONG1 = '·:incorrect(x) ·:incorrect(y)';
const RIGHT4 = '·:correct(雞) ·:correct(兔) DONE';
/** The same verdicts, whichever value the message named first. */
const sameVerdicts = (got: string, want: string, why: string) => assert.deepEqual(got.split(' ').sort(), want.split(' ').sort(), why);

t('answerText: English and plain notation come back byte for byte', () => {
  for (const s of ['x = 3, y = 2', 'I think it\'s 12 cm?', 'maybe 4 kcal/m^2/yr, because it\'s 10% twice', '(a) 8 (b) 24', 'The area is 52 cm².', '  45 degrees ', 'x ≤ −2 or x > 5', '½ of 3…', 'y = 2x + 3\n\nso m = 2', 'No, 42 < 45.5', 'café: 3 – 4 × 5', '']) {
    assert.equal(answerText(s), s);
  }
});
t('answerText: full-width forms are ASCII in any text', () => {
  assert.equal(fullWidthToAscii('x＝１１，y＝２？'), 'x=11,y=2?');
  assert.equal(answerText('x＝2，y＝3'), 'x=2,y=3'); assert.equal(answerText('（1）5/4'), '(1)5/4');
});
t('answerText: Chinese wording around a value', () => {
  const eq = (a: string, b: string) => assert.equal(answerText(a), b, a);
  eq('x 等於 3，y 等於 2', 'x = 3,y = 2'); eq('x是3，y是2', 'x = 3,y = 2'); eq('x=2、y=3', 'x=2, y=3'); eq('x是十一', 'x = 11');
  eq('答案是11', 'the answer is 11'); eq('答：x=3', 'the answer is x=3'); eq('我覺得是 11', 'maybe 11'); eq('可能是 11？', 'maybe 11?');
  eq('是 11 嗎？', '11?'); eq('是不是 11？', 'is it 11?'); eq('我不知道，也許 11', "I don't know, maybe 11"); eq('應該是 11 吧', 'maybe 11?');
  eq('110度', '110°'); eq('∠ACD 是 110 度', '∠ACD = 110°'); eq('角ACD等於110度', '∠ACD = 110°'); eq('一百一十度', '110°'); eq('九十度', '90°');
  eq('四分之五', '5/4'); eq('1又4分之1', '1 1/4'); eq('1又1/4', '1 1/4'); eq('百分之二十', '20%');
  eq('第(1)題是 5/4', '(1) 5/4'); eq('第一小題 5/4', '(1) 5/4'); eq('第二小題答案是 1', '(2) 1');
  // Words that only look like numbers or leads stay.
  eq('雞二十三隻，兔十二隻', '雞23隻,兔12隻'); eq('這是二元一次方程式', '這是二元一次方程式');
  for (const s of ['等一下，我想一想', '我答對了', '再試一度看看']) assert.ok(!/\d|answer|maybe|°/.test(answerText(s)), s);
});
t('answerText: Japanese wording around a value', () => {
  const eq = (a: string, b: string) => assert.equal(answerText(a), b, a);
  eq('xは11です', 'x = 11'); eq('x イコール 11', 'x = 11'); eq('答えは 11 です', 'the answer is 11'); eq('110度です', '110°');
  eq('4分の5', '5/4'); eq('四分の五', '5/4'); eq('たぶん 11', 'maybe 11'); eq('11ですか？', '11?'); eq('11だと思います', '11?'); eq('第2問は 5/4', '(2) 5/4');
});
t('answerText is idempotent', () => {
  for (const s of ['x 等於 3，y 等於 2', '答案是11', '是 11 嗎？', '雞有 23 隻，兔子有 12 隻', '第(1)題是 5/4', '答えは 11 です', '可能是 11？', '∠ACD 是 110 度', 'x=2，y=3']) assert.equal(answerText(answerText(s)), answerText(s), s);
});

t('the answer check: full-width punctuation never credits a wrong value', async () => {
  for (const s of ['x=2，y=3', 'x=2、y=3', 'x=2；y=3', 'x＝2，y＝3', 'x 等於 2，y 等於 3', 'x = 2, y = 3', 'x=2 y=3']) assert.equal(await check(K1, s), WRONG1, s);
  assert.equal(await check(K1, 'x=3，y=5'), '·:correct(x) ·:incorrect(y)');
  assert.equal(await check(K1, 'x=5，y=2'), '·:incorrect(x) ·:correct(y)');
});
t('the answer check: a system answered the way a learner in Taiwan writes it', async () => {
  for (const s of ['x = 3, y = 2', 'x=3，y=2', 'x=3、y=2', 'x 等於 3，y 等於 2', 'x是3，y是2', '答案是 x=3, y=2']) assert.equal(await check(K1, s), RIGHT1, s);
  assert.equal(await check(K1, 'y=2', ['x=3']), '·:correct(y) DONE');
  assert.equal(await check(K1, 'y 等於 2', ['x 等於 3']), '·:correct(y) DONE');
});
t('the answer check: one value, worded', async () => {
  for (const s of ['11', 'x=11', 'x 等於 11', '答案是11', '我覺得是 11', '是 11 嗎？', '所以 x = 11', '3x−6=2x+5，所以 x=11', '十一', 'x是十一', 'x＝１１', 'xは11です', '答えは 11 です']) assert.equal(await check(K2, s), '·:correct DONE', s);
  for (const s of ['x=10', 'x 等於 10', '答案是 10', 'xは10です']) assert.equal(await check(K2, s), '·:incorrect', s);
  // A bare or hedged wrong value is never denied, as in English.
  for (const s of ['10', '是 10 嗎？', '可能是 10', 'maybe 10?']) assert.equal(await check(K2, s), 'UNDECIDED', s);
});
t('the answer check: parts named the way the sheet numbers them', async () => {
  for (const s of ['(1) 5/4', '第(1)題是 5/4', '第一小題 5/4', '（1）5/4', '5/4', '四分之五', '(1) 1又1/4', '(1) 1.25', '(1) 四分之五']) assert.equal(await check(K3, s), '1:correct', s);
  for (const s of ['(2) 1', '第二小題答案是 1', '第(2)題：1']) assert.equal(await check(K3, s), '2:correct', s);
  assert.equal(await check(K3, '1', ['(1) 5/4']), '2:correct DONE');
  assert.equal(await check(K3, '(1) 5/4，(2) 1'), '1:correct 2:correct DONE');
  assert.equal(await check(K3, '第(1)題是 5/4，第(2)題是 1'), '1:correct 2:correct DONE');
});
t('the answer check: degrees', async () => {
  for (const s of ['110', '110度', '110°', '∠ACD = 110°', '∠ACD 是 110 度', '角ACD等於110度', '一百一十度', '110度です']) assert.equal(await check(K5, s), '·:correct DONE', s);
  for (const s of ['70度', '70']) assert.equal(await check(K5, s), 'UNDECIDED', s);
  assert.equal(await check(K5, '答案是 70 度'), '·:incorrect');
});

t('values named in Chinese: the key reads its own names', () => {
  assert.deepEqual(namedValues('雞23隻，兔12隻'), [{ name: '雞', value: 23 }, { name: '兔', value: 12 }]);
  assert.deepEqual(namedValues('雞 = 23 隻、兔 = 12 隻'), [{ name: '雞', value: 23 }, { name: '兔', value: 12 }]);
  assert.deepEqual(namedValues('大人有 3 人，小孩有 5 人'), [{ name: '大人', value: 3 }, { name: '小孩', value: 5 }]);
  assert.deepEqual(namedValues('雞有23隻和兔子有12隻'), [{ name: '雞', value: 23 }, { name: '兔子', value: 12 }]);
  // One quantity, a sentence, or a clause with no number: a plain text answer as before.
  for (const s of ['小明 12 歲', '是，因為兩邊相等', '雞23隻，其餘是兔', '23 chickens, 12 rabbits', 'The angles are 45° and 135°']) assert.deepEqual(namedValues(s), [], s);
  // English names as before.
  assert.deepEqual(namedValues('x = 7, PA = 17'), [{ name: 'x', value: 7 }, { name: 'pa', value: 17 }]);
  assert.deepEqual(namedValues('x = 7'), []);
  assert.deepEqual(K4.parts[0].values, [{ name: '雞', value: 23 }, { name: '兔', value: 12 }]);
});
t('values named in Chinese: a natural answer is decided, a swapped one is wrong', async () => {
  for (const s of ['雞23隻，兔12隻', '雞有 23 隻，兔子有 12 隻', '23隻雞、12隻兔', '兔12隻，雞23隻', '雞 23，兔 12', '雞二十三隻，兔十二隻', '答：雞 23 隻、兔 12 隻', '所以雞有23隻，兔有12隻。', '雞 = 23, 兔 = 12', '雞是23隻和兔子是12隻', '雞 23 隻 兔 12 隻']) sameVerdicts(await check(K4, s), RIGHT4, s);
  for (const s of ['雞12隻，兔23隻', '雞 = 12, 兔 = 23', '雞有 12 隻，兔有 23 隻', '所以雞12隻，兔23隻']) assert.equal(await check(K4, s), '·:incorrect(雞) ·:incorrect(兔)', s);
  assert.equal(await check(K4, '雞 20 隻，兔 15 隻'), '·:incorrect(雞) ·:incorrect(兔)');
  assert.equal(await check(K4, '兔子 12 隻'), '·:correct(兔)');
  assert.equal(await check(K4, '雞 23 隻', ['兔子 12 隻']), '·:correct(雞) DONE');
  assert.equal(await check(K4, '多了 24 隻腳，所以兔子有 12 隻'), '·:correct(兔)');
  // A longer form of a name is credited, never denied; a question never denies.
  assert.equal(await check(K4, '兔子有 23 隻'), 'UNDECIDED');
  assert.equal(await check(K4, '雞是 12 隻嗎？'), 'UNDECIDED');
});
t('values named in Chinese: working is not an answer', async () => {
  for (const s of ['假設全部都是雞，就有 70 隻腳', '如果雞有 35 隻，腳就有 70 隻', '雞和兔共 35 隻', '雞的腳有 46 隻', '雞有 2 隻腳，兔有 4 隻腳', '每隻雞有兩隻腳', '35 × 2 = 70', '23 和 12', '我不知道怎麼開始', '94 − 70 = 24']) assert.equal(await check(K4, s), 'UNDECIDED', s);
});
t('values named in Chinese: two solvers agree by name and number', () => {
  const p = (final: string) => parts([{ label: '', final, kind: 'text' }]);
  assert.equal(partsAgree(p('雞23隻，兔12隻'), p('雞 23 隻、兔 12 隻')), true);
  assert.equal(partsAgree(p('雞23隻，兔12隻'), p('兔 = 12 隻，雞 = 23 隻')), true);
  assert.equal(partsAgree(p('雞23隻，兔12隻'), p('兔23隻，雞12隻')), false);
  assert.equal(partsAgree(p('雞23隻，兔12隻'), p('23 chickens, 12 rabbits')), false);
  // English text answers as before.
  assert.equal(partsAgree(p('The angles are 45° and 135°'), p('45 degrees and 135 degrees')), true);
  assert.equal(partsAgree(p('x = 3, y = 2'), p('x = 3, y = 2')), true);
  assert.equal(partsAgree(p('y = 2x + 3'), p('y = 3x + 2')), false);
  assert.equal(partsAgree([num('', '110°', 110, '°')], [num('', '110 度', 110, '度')]), true);
  assert.equal(partsAgree([num('', '5 cm', 5, 'cm')], [num('', '5 m', 5, 'm')]), false);
});

t('part labels of any script keep their own record', async () => {
  for (const labels of [['甲', '乙'], ['①', '②'], ['(一)', '(二)'], ['A', 'B'], ['(1)', '(2)'], ['a', 'b']]) {
    const k = key([num(labels[0], '5', 5), num(labels[1], '6', 6)]);
    const [l0, l1] = k.parts.map((p) => partLabel(p.label));
    assert.ok(l0 && l1 && l0 !== l1, labels.join());
    const problem: V2HomeworkProblem = { text: 'p', verified: true, hasFigure: false, parts: [l0, l1] };
    assert.deepEqual(v2HomeworkFacts(problem, { confirmed: [`part:${l0}`] }), [`homework record: confirmed correct — part ${l0}; still open — part ${l1}`]);
    assert.deepEqual(sanitizeConfirmedMarks([`part:${l0}`, `value:${l1}=x`]), [`part:${l0}`, `value:${l1}=x`]);
    assert.deepEqual(parseKeyedVerdictDebug(formatKeyedVerdictDebug(l1, 'correct')), { part: l1, verdict: 'correct' });
    assert.deepEqual(homeworkProblemOf({ metadata: { kind: 'homework-problem', parentPlanId: 'p', n: 1, text: 't', priorConfirmed: [`part:${l0}`] } })?.priorConfirmed, [`part:${l0}`]);
  }
  const k = key([num('甲', '5', 5), num('乙', '6', 6)]);
  assert.equal(await check(k, '（甲）5'), '甲:correct'); assert.equal(await check(k, '甲：5'), '甲:correct'); assert.equal(await check(k, '甲 5'), '甲:correct');
  assert.equal(await check(k, '乙 6', ['甲 5']), '乙:correct DONE');
  assert.equal(await check(key([num('①', '5', 5), num('②', '6', 6)]), '① 5'), '①:correct');
  assert.deepEqual(sanitizeConfirmedMarks(['part:a b', 'part:<x>', 'nope', 'part:']), ['part:']);
});

t('English answers are judged exactly as before', async () => {
  const E1 = key(parts([{ label: '', final: 'x = 7, PA = 17', kind: 'text' }]));
  assert.equal(await check(E1, 'x = 7, PA = 17'), '·:correct(x) ·:correct(pa) DONE');
  assert.equal(await check(E1, 'x = 7 and PA = 20'), '·:correct(x) ·:incorrect(pa)');
  assert.equal(await check(K2, 'x = 11'), '·:correct DONE'); assert.equal(await check(K2, 'the answer is 12'), '·:incorrect');
  assert.equal(await check(K2, 'maybe 11?'), '·:correct DONE'); assert.equal(await check(K2, 'I think x is 12'), 'UNDECIDED');
  assert.equal(await check(K2, 'is it 12?'), 'UNDECIDED'); assert.equal(await check(K2, '3x - 6 = 2x + 5, so x = 11'), '·:correct DONE');
  assert.equal(await check(K3, '(1) 5/4 (2) 1'), '1:correct 2:correct DONE'); assert.equal(await check(K3, 'part 1: 1.25'), '1:correct');
  assert.equal(await check(K5, '110 degrees'), '·:correct DONE'); assert.equal(await check(K5, 'angle ACD is 110'), '·:correct DONE');
  assert.equal(await check(key([num('', '35.4 cm', 35.4, 'cm')]), '35.4 cm'), '·:correct DONE');
  assert.deepEqual(keyedVerdicts('[note — not from the student] x = 99', K2), []);
  assert.deepEqual(workedAnswerCredit('8 + 5 + 6 + 3 is 22, so 8 out of 22, which simplifies to 4/11', key([num('', '4/11', 4 / 11)])).map((v) => v.verdict), ['correct']);
});

t('verdict first: the words that say right and wrong in Chinese and Japanese', () => {
  const right = (s: string) => assert.equal(verdictMissing(s, ['correct']), null, s);
  const wrong = (s: string) => assert.equal(verdictMissing(s, ['incorrect']), null, s);
  for (const s of ['對，x 等於 11。接下來我們檢查一下。', '太棒了！x 就是 11。', '很棒！你算出來了。', '答對了！', '沒錯，就是這樣。', '正確！', '好厲害，完全正確。', '你做得很好，答案就是 11。', '完美！', '漂亮！x = 11。', '是的，x = 11。', '嗯，11 是對的。', '讚！', '正解です。次に進みましょう。', 'その通りです！', '正しいです。', 'はい、合っています。', '素晴らしい！', 'お見事です。', 'Yes, that is right.', 'Exactly.']) right(s);
  for (const s of ['不太對，再檢查一下第二步。', '還沒有喔，我們再看一次。', '這個答案不正確。', '差一點點！', '嗯，10 不是正確答案。', '有點可惜，再試試看。', '這裡有個小錯誤。', '再想想看？', '你算錯了一步。', '違います。もう一度考えてみましょう。', '惜しいですね。', '残念ですが、少し違うようです。', 'Not quite.', 'That is incorrect.']) wrong(s);
  // No verdict in these: a word inside another word, a question, a plain next step.
  for (const s of ['我們先看看對邊和對角的關係。', '相對來說，這一步比較難。', '你是不是把 2x 移到左邊了？', '好的，我們來看下一步。', '對於這一題，我們先看第一式。']) assert.equal(verdictMissing(s, ['correct']), 'correct', s);
  for (const s of ['你是不是把符號弄反了？', '好的，我們來看下一步。', '我們一起來檢查第一步吧。', '還不錯，我們繼續。', '這一步沒有錯誤。']) assert.equal(verdictMissing(s, ['incorrect']), 'incorrect', s);
  // A denial is not credit, and nothing decided asks for nothing.
  assert.equal(verdictMissing('不對，再看一次。', ['correct']), 'correct'); assert.equal(verdictMissing('不是對的。', ['correct']), 'correct');
  assert.equal(verdictMissing('我們繼續。', []), null);
});
t('the reply checks read a Chinese or Japanese turn', () => {
  assert.equal(lastQuestionOf('很好。那麼下一步應該怎麼做？'), '那麼下一步應該怎麼做？');
  assert.equal(lastQuestionOf('Good. What is the next step?'), 'What is the next step?');
  assert.equal(lastQuestionOf('いいですね。次は何をしますか？'), '次は何をしますか？');
  assert.deepEqual(nonAnswer('好', '你覺得下一步應該怎麼做？'), { said: '好', question: '你覺得下一步應該怎麼做？' });
  assert.deepEqual(nonAnswer('對', '這兩個方程式有什麼共同點？'), { said: '對', question: '這兩個方程式有什麼共同點？' });
  assert.ok(nonAnswer('6', '你注意到什麼？')); assert.equal(nonAnswer('70', '35 隻雞一共有幾隻腳？'), null); assert.equal(nonAnswer('70 隻', '那一共是多少？'), null);
  assert.equal(nonAnswer('好', '你知道怎麼移項嗎？'), null); assert.equal(nonAnswer('是', '這樣是不是比較簡單？'), null);
  assert.ok(nonAnswer('はい', '次は何をしますか？')); assert.equal(nonAnswer('はい', 'ここまで大丈夫ですか？'), null);
  assert.deepEqual(nonAnswer('yes', 'What is the next step?'), { said: 'yes', question: 'What is the next step?' });
  assert.equal(nonAnswer('yes', 'Does that make sense?'), null); assert.equal(nonAnswer('6', 'So, what do you get?'), null);
  for (const s of ['可能是 11？', '可能是 11?', '應該是 11 吧', '我猜是 11', '是不是 11？', '我不知道，也許 11', '是 11 嗎？', 'たぶん 11', 'maybe 11?', "I don't know, maybe y = -2?"]) assert.equal(isGuess(s), true, s);
  for (const s of ['11', 'x 等於 11', '可能是 400，因為 10% 算兩次', 'maybe 400, because it\'s 10% twice', '答案是 11']) assert.equal(isGuess(s), false, s);
  for (const s of ['11', '110°', '5/4', '11 隻', '23隻', '110度', '１１', '5 公里', '400 J']) assert.equal(isBareNumber(s), true, s);
  for (const s of ['雞 23 隻', 'x = 11', '因為 11', '11 and 12']) assert.equal(isBareNumber(s), false, s);
  for (const s of ['對，你答對了。', '沒錯！', '正解です。', 'Yes, that is right.']) assert.equal(givesCredit(s), true, s);
  for (const s of ['對邊是 BC。', '我們來看下一步。', 'Let us look again.']) assert.equal(givesCredit(s), false, s);
  const guessed = [{ label: '', value: '11' }];
  assert.equal(unearnedCredit('你自己算出來了，很棒。', guessed, true).length, 1); assert.equal(unearnedCredit('自分で求められましたね。', guessed, true).length, 1);
  assert.equal(unearnedCredit('You worked it out yourself.', guessed, true).length, 1); assert.equal(unearnedCredit('答案是對的。', guessed, true).length, 0);
  assert.equal(castsDoubt('你的答案只是猜的，還沒有確認。').length, 1); assert.equal(castsDoubt('我剛才太早確認了。').length, 1);
  assert.equal(castsDoubt('Your answer is still a guess.').length, 1); assert.equal(castsDoubt('你的答案是對的。').length, 0);
});
t('a problem named by its number', () => {
  const sheet = { problems: [1, 2, 3, 4, 5].map((k) => ({ n: k, text: 't', verified: true })) };
  const named = (s: string) => sheetProblemNamed(s, sheet);
  assert.equal(named('第2題'), 2); assert.equal(named('我想做第 3 題'), 3); assert.equal(named('第三題'), 3); assert.equal(named('第４題'), 4);
  assert.equal(named('問2をお願いします'), 2); assert.equal(named('3番'), 3); assert.equal(named('problem 2'), 2); assert.equal(named('Question 5 please'), 5);
  assert.equal(named('4'), null); assert.equal(named('第 9 題'), null); assert.equal(named('第一式減第二式'), null); assert.equal(named(null), null);
  assert.deepEqual(problemNumbersNamed('第 2 題做完了，接著看第 4 題。'), [2, 4]); assert.deepEqual(problemNumbersNamed('Problem 2 is done; on to question 4.'), [2, 4]);
});

t('the plan and the panel in the plan\'s language', () => {
  assert.equal(homeworkWording('zh-TW').problemTitle(4), '第 4 題'); assert.equal(homeworkWording('zh_tw').sheetTitle, '作業輔導'); assert.equal(homeworkWording('ja-JP').problemTitle(2), '問題 2');
  for (const l of [undefined, null, 'en', 'en-GB', 'xx']) { assert.equal(homeworkWording(l).problemTitle(4), 'Problem 4'); assert.equal(homeworkWording(l).sheetTitle, 'Homework help'); assert.equal(homeworkWording(l).sheetObjective, 'Work the uploaded problems in order.'); }
  const parent = (locale?: string) => ({ id: 'gen-p', title: 'x', curriculum: 'freestyle', grade: '7', subject: 'math', topic: 't', ...(locale ? { locale } : {}), estimatedMinutes: 20, los: [], segments: [], schemaVersion: 1, metadata: { kind: 'homework-help', problems: [{ n: 4, text: 'q' }] } }) as never;
  const meta = { parentPlanId: 'gen-p', n: 4, text: '雞兔同籠', figure: null, verified: true };
  const zh = buildHomeworkProblemPlan(parent('zh-TW'), meta, 'gen-c');
  assert.equal(zh.title, '第 4 題'); assert.equal(zh.los[0].shortTitle, '完成第 4 題'); assert.equal(zh.locale, 'zh-TW');
  const en = buildHomeworkProblemPlan(parent(), meta, 'gen-c');
  assert.equal(en.title, 'Problem 4'); assert.equal(en.los[0].shortTitle, 'Work problem 4'); assert.equal(en.los[0].description, 'Work problem 4.'); assert.equal(en.locale, 'en');
  // The session's language, when the sheet's plan carries none.
  assert.equal(buildHomeworkProblemPlan(parent(), meta, 'gen-c', { locale: 'zh-TW' }).title, '第 4 題');
  assert.equal(buildHomeworkPlanFields([{ n: 1, text: 'q' }], 't', 'gen-p').los[0].description, 'Work the uploaded problems in order.');
  assert.equal(buildHomeworkPlanFields([{ n: 1, text: 'q' }], 't', 'gen-p', 'zh-TW').los[0].description, '依照順序完成上傳的題目。');
  assert.equal(sessionStrings(['zh-TW']).problemN(4), '第 4 題'); assert.equal(sessionStrings(null).problemN(4), 'Problem 4'); assert.equal(sessionStrings(['ja']).problemN(4), '問題 4');
  assert.ok(sessionStrings(['zh-CN']).noAnswerCheck && sessionStrings(null).noAnswerCheck.startsWith('No answer check'));
});
t('the build\'s prompts ask for the problem\'s own language', () => {
  assert.match(KEY_SOLVE_SYSTEM, /7\. Write every "final", every unit and every step's relation in the language and script the problem itself is written in/);
  assert.match(SAME_STATEMENT_SYSTEM, /in the language the problem is written in/);
  assert.match(TRANSCRIBE_MATERIAL_PROMPT_SINGLE, /never translate it\. The bracketed descriptions are written in English/);
  assert.match(buildBatchTranscribePrompt(2), /never translate it/);
  assert.equal(BUILD_LOGIC_VERSION, 4);
});

// ── 2026-11-24: Hindi, Hinglish, French, Spanish ──────────────────────────────────────────────────────────────
const K6 = key([num('', '3/4', 0.75)]);
const K7 = key([num('', '20%', 20, '%')]);
const KP = key([num('a', '5/4', 1.25), num('b', '1', 1)]);
/** The answer check in a session taught in `languages`. */
async function checkIn(languages: string[] | undefined, k: AnswerKey, said: string, history: string[] = []): Promise<string> {
  const problem: V2HomeworkProblem = { text: 'p', verified: true, hasFigure: false, parts: k.parts.map((p) => partLabel(p.label)) };
  const state = { history: history.map((h) => ({ role: 'user' as const, content: h })) } as unknown as V2State;
  const r = await v2HomeworkCheck({ key: k, problem, state, studentSaid: said, languages, proseMatch: async () => null });
  return `${r.verdicts.map((v) => `${v.part || '·'}:${v.verdict}${v.value ? `(${v.value})` : ''}`).join(' ') || 'UNDECIDED'}${r.done ? ' DONE' : ''}`;
}

t('answerText: English comes back byte for byte in every session, and whatever else is typed in an English one', () => {
  const EN_TEXT = ['x = 3, y = 2', "I think it's 12 cm?", "maybe 4 kcal/m^2/yr, because it's 10% twice", '(a) 8 (b) 24', 'The area is 52 cm².', '  45 degrees ', 'x ≤ −2 or x > 5', 'y = 2x + 3\n\nso m = 2', 'No, 42 < 45.5', 'café: 3 – 4 × 5',
    'the answer is three quarters', 'one half', 'x is one', '3 by 4', 'da 12', 'x es 3', '3,5', '(2,3)', 'a comment on part b', 'It gives 5 over 2', 'three', 'minus 3', 'I got 7 percent', ''];
  for (const langs of [undefined, null, [], ['en'], ['en', 'ja'], ['en', 'hi'], ['en', 'fr'], ['en', 'es'], ['zh-TW'], ['ja']] as const) for (const s of EN_TEXT) assert.equal(answerText(s, langs as string[] | null | undefined), s, `${JSON.stringify(langs)}: ${s}`);
  // English typed in a Hinglish, French or Spanish lesson is read as English: the forms the checks already read stay.
  for (const langs of [['hi'], ['hi-Latn'], ['fr'], ['es']]) for (const s of ['x = 3, y = 2', 'the answer is 11', 'maybe 11?', "I don't know, maybe y = -2?", '(a) 8 (b) 24', 'x = 11', '5/4', '110°', 'is it 11?']) assert.equal(answerText(s, langs), s, `${langs}: ${s}`);
});
t('answerText: Hindi wording around a value', () => {
  const eq = (a: string, b: string) => { assert.equal(answerText(a), b, a); assert.equal(answerText(a, ['hi']), b, `hi: ${a}`); assert.equal(answerText(a, ['hi-Latn']), b, `hi-Latn: ${a}`); };
  eq('उत्तर 11 है', 'the answer is 11'); eq('उत्तर है ग्यारह', 'the answer is 11'); eq('जवाब 11 होगा', 'the answer is 11'); eq('x बराबर तीन', 'x = 3'); eq('x = 3 है', 'x = 3'); eq('x 3 है', 'x = 3'); eq('x की value 3 है', 'x = 3');
  eq('x = 2 और y = 3', 'x = 2, y = 3'); eq('x बराबर माइनस 3', 'x = -3');
  eq('शायद 11', 'maybe 11'); eq('मुझे लगता है 11 होगा', 'maybe 11'); eq('11 शायद', 'maybe 11'); eq('पता नहीं, शायद 11?', "I don't know, maybe 11?");
  // क्या … है? and a tag at the end are a hedge, as 嗎 is.
  eq('क्या यह 11 है?', 'is it 11?'); eq('क्या यह 11 है', 'is it 11?'); eq('क्या answer 11 है?', 'is it 11?'); eq('11 है क्या?', '11?'); eq('11 है ना?', '11?');
  eq('तीन बटा चार', '3/4'); eq('दो सही एक बटा तीन', '2 1/3'); eq('आधा', '1/2'); eq('110 डिग्री', '110°'); eq('एक सौ दस डिग्री', '110°'); eq('२५ प्रतिशत', '25%'); eq('बीस परसेंट', '20%');
  eq('भाग (a) का उत्तर 5/4 है', '(a) 5/4'); eq('(b) का answer 3 है', '(b) 3');
  // Words that only look like numbers or leads stay.
  for (const s of ['मुझे hint दो', 'जवाब दो', 'एक मिनट रुको', 'बता दो ना']) eq(s, s);
  eq('रुको, मैं सोच रहा हूँ।', 'रुको, मैं सोच रहा हूँ.');
});
t('answerText: Hinglish, with its English words and typed in Latin letters', () => {
  const eq = (a: string, b: string) => assert.equal(answerText(a, ['hi-Latn']), b, a);
  eq('answer 5 है', 'the answer is 5'); eq('answer है five', 'the answer is 5'); eq('answer four है', 'the answer is 4'); eq('x equals twenty one', 'x = 21'); eq('three by four', '3/4'); eq('3 by 4', '3/4');
  // Typed the way students type it; read so only in a Hindi or Hinglish session.
  eq('answer 5 hai', 'the answer is 5'); eq('shayad 11', 'maybe 11'); eq('3 bata 4', '3/4'); eq('5 hai kya?', '5?'); eq('kya 11 hai?', 'is it 11?'); eq('x barabar 3 hai', 'x = 3'); eq('pata nahi, shayad 11', "I don't know, maybe 11");
  for (const s of ['answer 5 hai', 'shayad 11', '3 bata 4', '3 by 4']) { assert.equal(answerText(s), s, s); assert.equal(answerText(s, ['fr']), s, s); }
});
t('answerText: French wording around a value', () => {
  const eq = (a: string, b: string) => assert.equal(answerText(a, ['fr']), b, a);
  eq('la réponse est 11', 'the answer is 11'); eq('La réponse est onze.', 'the answer is 11.'); eq('ça fait douze', '12'); eq("j'ai trouvé 7", 'the answer is 7'); eq("c'est 12", '12');
  eq('x égale 3', 'x = 3'); eq('x est égal à 3', 'x = 3'); eq('x est 5', 'x = 5'); eq('x vaut trois', 'x = 3'); eq('x = 2 et y = 3', 'x = 2, y = 3'); eq('x égale moins 3', 'x = -3'); eq('5 moins 3', '5 moins 3');
  eq("je pense que c'est 11", 'maybe 11'); eq('peut-être 11', 'maybe 11'); eq('11, je pense', 'maybe 11'); eq('je ne sais pas, peut-être 11 ?', "I don't know, maybe 11?");
  // "c'est … ?" and a tag at the end are a hedge, as 嗎 is.
  eq("c'est 11 ?", 'is it 11?'); eq("est-ce que c'est 11 ?", 'is it 11?'); eq('11, non ?', '11?');
  eq('trois quarts', '3/4'); eq('un demi', '1/2'); eq('la moitié', '1/2'); eq('deux et trois quarts', '2 3/4'); eq('3 sur 4', '3/4'); eq('deux tiers', '2/3'); eq('110 degrés', '110°'); eq('cent dix degrés', '110°'); eq('20 pour cent', '20%'); eq('vingt pour cent', '20%');
  eq("l'angle ABC fait 110 degrés", '∠ABC = 110°'); eq("(a) c'est 5/4", '(a) 5/4'); eq('partie b : 7', '(b) 7');
  // A decimal comma, as France writes it; never a pair in brackets or a named list.
  eq('3,5', '3.5'); eq('x = 2,5', 'x = 2.5'); eq('(2,3)', '(2,3)'); eq('x=2,y=3', 'x=2,y=3');
  for (const s of ['attends, je réfléchis', "c'est un problème difficile", "je n'ai pas compris"]) eq(s, s);
  // French wording is read with no session to say so; a bare French number needs one.
  assert.equal(answerText('la réponse est 11'), 'the answer is 11'); assert.equal(answerText("c'est 11 ?"), 'is it 11?'); assert.equal(answerText('trois quarts'), 'trois quarts'); assert.equal(answerText('3,5'), '3,5');
});
t('answerText: Spanish wording around a value', () => {
  const eq = (a: string, b: string) => assert.equal(answerText(a, ['es']), b, a);
  eq('la respuesta es 11', 'the answer is 11'); eq('La respuesta es treinta y dos.', 'the answer is 32.'); eq('me da 12', 'the answer is 12'); eq('da 12', '12'); eq('es 12', '12');
  eq('x es igual a 3', 'x = 3'); eq('x es 3', 'x = 3'); eq('x vale tres', 'x = 3'); eq('x = 2 y y = 3', 'x = 2, y = 3'); eq('menos 3', '-3');
  eq('creo que es 11', 'maybe 11'); eq('tal vez 11', 'maybe 11'); eq('11, creo', 'maybe 11'); eq('no sé, tal vez 11', "I don't know, maybe 11");
  // "¿es … ?" and a tag at the end are a hedge, as 嗎 is.
  eq('¿es 11?', 'is it 11?'); eq('¿Será 11?', 'is it 11?'); eq('11, ¿no?', '11?'); eq('11, ¿verdad?', '11?');
  eq('tres cuartos', '3/4'); eq('un medio', '1/2'); eq('la mitad', '1/2'); eq('dos y tres cuartos', '2 3/4'); eq('3 sobre 4', '3/4'); eq('dos tercios', '2/3'); eq('110 grados', '110°'); eq('ciento diez grados', '110°'); eq('20 por ciento', '20%'); eq('veinte por ciento', '20%');
  eq('el ángulo ABC es 110 grados', '∠ABC = 110°'); eq('(a) es 5/4', '(a) 5/4'); eq('parte b: 7', '(b) 7'); eq('3.5', '3.5');
  for (const s of ['espera, estoy pensando', 'es una ecuación difícil', 'no entendí']) eq(s, s);
  assert.equal(answerText('la respuesta es 11'), 'the answer is 11'); assert.equal(answerText('¿es 11?'), 'is it 11?'); assert.equal(answerText('tres cuartos'), 'tres cuartos');
});
t('answerText is idempotent in the new languages, with the session and without it', () => {
  const CASES: Array<[string[], string[]]> = [
    [['hi'], ['उत्तर 11 है', 'x बराबर तीन', 'क्या यह 11 है?', '11 है ना?', 'पता नहीं, शायद 11?', 'भाग (a) का उत्तर 5/4 है', 'तीन बटा चार', '110 डिग्री', 'x = 2 और y = 3', 'जवाब दो']],
    [['hi-Latn'], ['answer 5 है', 'answer 5 hai', 'shayad 11', '3 bata 4', 'kya 11 hai?', 'The answer is 11', 'x equals 4']],
    [['fr'], ['la réponse est 11', "c'est 11 ?", "je pense que c'est 11", 'trois quarts', '3,5', "(a) c'est 5/4", 'x = 2 et y = 3', '110 degrés', 'ça fait douze']],
    [['es'], ['la respuesta es 11', '¿es 11?', 'creo que es 11', 'tres cuartos', '(a) es 5/4', 'x = 2 y y = 3', '110 grados', 'me da 12']],
  ];
  for (const [langs, xs] of CASES) for (const s of xs) { const once = answerText(s, langs); assert.equal(answerText(once, langs), once, `${langs}: ${s}`); assert.equal(answerText(once), once, `${langs}, then no session: ${s}`); }
});

t('the answer check: one value, worded in Hindi and Hinglish', async () => {
  for (const s of ['11', 'ग्यारह', 'x बराबर 11', 'x बराबर ग्यारह', 'उत्तर 11 है', 'उत्तर ग्यारह है', 'x 11 है', 'शायद 11', 'क्या यह 11 है?', '11 है ना?', 'इसलिए x = 11', 'x की value 11 है']) assert.equal(await checkIn(['hi'], K2, s), '·:correct DONE', s);
  for (const s of ['x बराबर 10', 'उत्तर 10 है']) assert.equal(await checkIn(['hi'], K2, s), '·:incorrect', s);
  // A bare or hedged wrong value is never denied, and a request is no answer.
  for (const s of ['शायद 10', '10 है क्या?', 'मुझे hint दो', 'जवाब दो', 'रुको']) assert.equal(await checkIn(['hi'], K2, s), 'UNDECIDED', s);
  for (const s of ['answer 11 है', 'answer eleven है', 'x equals eleven', 'answer 11 hai', 'shayad 11', 'x = 11 hai', 'the answer is 11', 'I think 11']) assert.equal(await checkIn(['hi-Latn'], K2, s), '·:correct DONE', s);
  for (const s of ['answer 10 है', 'x barabar 10']) assert.equal(await checkIn(['hi-Latn'], K2, s), '·:incorrect', s);
  assert.equal(await checkIn(['hi-Latn'], K2, 'shayad 10'), 'UNDECIDED');
  for (const s of ['x बराबर 3 और y बराबर 2', 'x = 3 और y = 2', 'x तीन है, y दो है']) assert.equal(await checkIn(['hi'], K1, s), RIGHT1, s);
  assert.equal(await checkIn(['hi'], K1, 'x बराबर 2 और y बराबर 3'), WRONG1);
  assert.equal(await checkIn(['hi'], K1, 'y दो है', ['x तीन है']), '·:correct(y) DONE');
});
t('the answer check: one value, worded in French', async () => {
  for (const s of ['11', 'onze', 'x égale 11', 'x est égal à onze', 'la réponse est 11', 'ça fait onze', "c'est 11", 'x est 11', "je pense que c'est 11", "c'est 11 ?", 'donc x = 11', 'x vaut 11']) assert.equal(await checkIn(['fr'], K2, s), '·:correct DONE', s);
  for (const s of ['x égale 10', 'la réponse est 10']) assert.equal(await checkIn(['fr'], K2, s), '·:incorrect', s);
  for (const s of ['peut-être 10', "c'est 10 ?", 'attends']) assert.equal(await checkIn(['fr'], K2, s), 'UNDECIDED', s);
  for (const s of ['x égale 3 et y égale 2', 'x = 3 et y = 2', 'x vaut trois, y vaut deux']) assert.equal(await checkIn(['fr'], K1, s), RIGHT1, s);
  assert.equal(await checkIn(['fr'], K1, 'x égale 2 et y égale 3'), WRONG1);
  assert.equal(await checkIn(['fr'], K1, 'y vaut deux', ['x vaut trois']), '·:correct(y) DONE');
});
t('the answer check: one value, worded in Spanish', async () => {
  for (const s of ['11', 'once', 'x es igual a 11', 'x es igual a once', 'la respuesta es 11', 'me da once', 'es 11', 'x es 11', 'creo que es 11', '¿es 11?', 'entonces x = 11', 'x vale 11']) assert.equal(await checkIn(['es'], K2, s), '·:correct DONE', s);
  for (const s of ['x es igual a 10', 'la respuesta es 10']) assert.equal(await checkIn(['es'], K2, s), '·:incorrect', s);
  for (const s of ['tal vez 10', '¿es 10?', 'espera']) assert.equal(await checkIn(['es'], K2, s), 'UNDECIDED', s);
  for (const s of ['x es igual a 3 y y es igual a 2', 'x = 3 y y = 2', 'x es tres, y es dos']) assert.equal(await checkIn(['es'], K1, s), RIGHT1, s);
  assert.equal(await checkIn(['es'], K1, 'x es igual a 2 y y es igual a 3'), WRONG1);
});
t('the answer check: parts, fractions, degrees and percentages in the new languages', async () => {
  for (const [langs, s] of [[['fr'], "(a) c'est 5/4"], [['fr'], 'partie a : cinq quarts'], [['es'], '(a) es 5/4'], [['es'], 'parte a: cinco cuartos'], [['hi'], '(a) का उत्तर 5/4 है'], [['hi'], 'भाग a का उत्तर पाँच बटा चार है']] as const) assert.equal(await checkIn([...langs], KP, s), 'a:correct', s);
  for (const [langs, s] of [[['fr'], "la (b) c'est 1"], [['es'], 'la (b) es 1'], [['hi'], '(b) 1 है']] as const) assert.equal(await checkIn([...langs], KP, s), 'b:correct', s);
  for (const [langs, s] of [[['fr'], 'trois quarts'], [['fr'], '3 sur 4'], [['fr'], 'la réponse est trois quarts'], [['fr'], 'zéro virgule soixante-quinze'], [['fr'], '0,75'], [['es'], 'tres cuartos'], [['es'], '3 sobre 4'], [['es'], 'cero punto setenta y cinco'],
    [['hi'], 'तीन बटा चार'], [['hi'], 'उत्तर तीन बटा चार है'], [['hi-Latn'], 'three by four'], [['hi-Latn'], '3 by 4']] as const) assert.equal(await checkIn([...langs], K6, s), '·:correct DONE', s);
  for (const [langs, s] of [[['fr'], '110 degrés'], [['fr'], "l'angle ABC fait 110 degrés"], [['fr'], 'cent dix degrés'], [['es'], '110 grados'], [['es'], 'ciento diez grados'], [['hi'], '110 डिग्री'], [['hi'], 'एक सौ दस डिग्री']] as const) assert.equal(await checkIn([...langs], K5, s), '·:correct DONE', s);
  for (const [langs, s] of [[['fr'], 'la réponse est 70 degrés'], [['es'], 'la respuesta es 70 grados'], [['hi'], 'उत्तर 70 डिग्री है']] as const) assert.equal(await checkIn([...langs], K5, s), '·:incorrect', s);
  assert.equal(await checkIn(['fr'], K5, '70 degrés'), 'UNDECIDED');
  for (const [langs, s] of [[['fr'], '20 pour cent'], [['fr'], 'vingt pour cent'], [['es'], '20 por ciento'], [['es'], 'veinte por ciento'], [['hi'], '20 प्रतिशत'], [['hi'], 'बीस परसेंट'], [['hi-Latn'], 'twenty percent']] as const) assert.equal(await checkIn([...langs], K7, s), '·:correct DONE', s);
});
t('the answer check: an English session reads as before', async () => {
  for (const langs of [undefined, ['en'], ['en', 'ja']]) {
    for (const s of ['11', 'x = 11', 'the answer is 11', 'I think 11', 'maybe 11?']) assert.equal(await checkIn(langs, K2, s), '·:correct DONE', s);
    assert.equal(await checkIn(langs, K2, 'x = 10'), '·:incorrect'); assert.equal(await checkIn(langs, K2, 'maybe 10?'), 'UNDECIDED');
    // Number words and the weak wording of another language are not read in an English lesson.
    for (const s of ['onze', 'once', 'x es 11', 'eleven']) assert.equal(await checkIn(langs, K2, s), 'UNDECIDED', `${langs}: ${s}`);
    // A script of its own is read whatever the session, as 十一 is.
    assert.equal(await checkIn(langs, K2, 'ग्यारह'), '·:correct DONE'); assert.equal(await checkIn(langs, K2, '十一'), '·:correct DONE');
    assert.equal(await checkIn(langs, K1, 'x = 3, y = 2'), RIGHT1); assert.equal(await checkIn(langs, K1, 'x = 2, y = 3'), WRONG1);
  }
  assert.equal(await check(K2, 'x = 11'), await checkIn(undefined, K2, 'x = 11'));
});

t('the reply checks in Hindi and Hinglish', () => {
  for (const langs of [['hi'], ['hi-Latn'], undefined]) {
    for (const s of ['बिल्कुल सही। अब आगे चलते हैं।', 'हाँ, x चार है।', 'शाबाश!', 'बहुत बढ़िया, यही उत्तर है।', 'Correct! बहुत बढ़िया।']) assert.equal(verdictMissing(s, ['correct'], langs), null, s);
    for (const s of ['यह सही नहीं है।', 'अच्छा, अब अगला देखते हैं।', 'यह correct नहीं है।', 'नहीं, फिर से देखो।']) assert.equal(verdictMissing(s, ['correct'], langs), 'correct', s);
    for (const s of ['यह सही नहीं है।', 'नहीं, एक बार फिर देखो।', 'थोड़ी गलती है।', 'यह correct नहीं है।', 'लगभग, पर पूरा सही नहीं।']) assert.equal(verdictMissing(s, ['incorrect'], langs), null, s);
    for (const s of ['बिल्कुल सही।', 'अब अगला सवाल देखते हैं।']) assert.equal(verdictMissing(s, ['incorrect'], langs), 'incorrect', s);
  }
  assert.equal(lastQuestionOf('ठीक है। अब बताओ, x की value क्या है?'), 'अब बताओ, x की value क्या है?');
  assert.ok(nonAnswer('हाँ', 'x की value क्या है?')); assert.ok(nonAnswer('4', 'तुम्हें क्या दिख रहा है?'));
  for (const [said, q] of [['4', 'x की value क्या है?'], ['हाँ', 'क्या यह सही है?'], ['4', 'x कितना है?'], ['हाँ', 'समझ आया?'], ['चार', 'x कितना है?']]) assert.equal(nonAnswer(said, q), null, `${said} / ${q}`);
  for (const s of ['शायद 11?', 'क्या यह 11 है?', '11 है ना?', 'पता नहीं, शायद 11']) assert.equal(isGuess(s), true, s);
  for (const s of ['11', 'x बराबर 11', 'शायद 11, क्योंकि दोनों तरफ से 5 घटाया', 'उत्तर 11 है']) assert.equal(isGuess(s), false, s);
  for (const s of ['चार', '11', '23 मुर्गियाँ', '5 किलोमीटर', '110 डिग्री', 'बीस प्रतिशत']) assert.equal(isBareNumber(s, ['hi']), true, s);
  for (const s of ['x 4 है', 'क्योंकि 11', 'मुर्गियाँ 23 हैं और खरगोश 12']) assert.equal(isBareNumber(s, ['hi']), false, s);
  for (const s of ['बिल्कुल सही।', 'हाँ, यही है।', 'शाबाश!']) assert.equal(givesCredit(s), true, s);
  for (const s of ['ठीक है, अब अगला देखते हैं।', 'यह सही नहीं है।', 'देखो, यहाँ क्या हो रहा है।']) assert.equal(givesCredit(s), false, s);
  const guessed = [{ label: '', value: '11' }];
  assert.equal(unearnedCredit('तुमने खुद निकाल लिया कि x 11 है।', guessed, true).length, 1); assert.equal(unearnedCredit('हाँ, 11 सही है।', guessed, true).length, 0);
  assert.equal(castsDoubt('यह सिर्फ़ एक अंदाज़ा था।').length, 1); assert.equal(castsDoubt('तुम्हारा जवाब सही है।').length, 0);
});
t('the reply checks in French and Spanish, only in a lesson taught in them', () => {
  for (const s of ["Oui, c'est ça.", 'Exactement !', 'Très bien, x vaut 4.', 'Bravo, bonne réponse.']) assert.equal(verdictMissing(s, ['correct'], ['fr']), null, s);
  for (const s of ['Pas tout à fait.', "Non, ce n'est pas correct.", 'Voyons la suite.', 'Pas exactement.']) assert.equal(verdictMissing(s, ['correct'], ['fr']), 'correct', s);
  for (const s of ['Pas tout à fait.', 'Presque !', 'Non, regarde encore.', 'Il y a une petite erreur.']) assert.equal(verdictMissing(s, ['incorrect'], ['fr']), null, s);
  assert.equal(verdictMissing("Oui, c'est ça.", ['incorrect'], ['fr']), 'incorrect');
  for (const s of ['Sí, correcto.', '¡Exacto!', 'Muy bien, x vale 4.', 'Así es.']) assert.equal(verdictMissing(s, ['correct'], ['es']), null, s);
  for (const s of ['No del todo.', 'No es correcto.', 'Veamos lo siguiente.']) assert.equal(verdictMissing(s, ['correct'], ['es']), 'correct', s);
  for (const s of ['No del todo.', 'Casi.', 'No, revisa el signo.', 'Hay un error.']) assert.equal(verdictMissing(s, ['incorrect'], ['es']), null, s);
  assert.equal(verdictMissing('Sí, correcto.', ['incorrect'], ['es']), 'incorrect');
  // An English lesson, and a lesson in another language, never reads these rows.
  for (const langs of [undefined, ['en'], ['en', 'fr'], ['zh-TW'], ['hi']]) { assert.equal(verdictMissing("Oui, c'est ça.", ['correct'], langs), 'correct'); assert.equal(verdictMissing('Sí, correcto.', ['correct'], langs), 'correct'); assert.equal(nonAnswer('yes', 'Can you comment on that?', langs), null); assert.equal(nonAnswer('no', 'Is there an error here?', langs), null); }
  assert.ok(nonAnswer('oui', 'Que vaut x ?', ['fr'])); assert.ok(nonAnswer('4', 'Que remarques-tu ?', ['fr'])); assert.ok(nonAnswer('sí', '¿Cuánto vale x?', ['es'])); assert.ok(nonAnswer('4', '¿Qué notas?', ['es']));
  for (const [said, q, l] of [['4', 'Combien vaut x ?', 'fr'], ['oui', 'Tu comprends ?', 'fr'], ['oui', 'Est-ce que tu vois pourquoi ?', 'fr'], ['douze', 'Combien ça fait ?', 'fr'], ['4', '¿Cuánto vale x?', 'es'], ['sí', '¿Lo ves?', 'es'], ['sí', '¿Está claro, verdad?', 'es']]) assert.equal(nonAnswer(said, q, [l]), null, `${said} / ${q}`);
  for (const [l, s] of [['fr', 'peut-être 11 ?'], ['fr', "c'est 11 ?"], ['fr', 'je ne sais pas, peut-être 11'], ['es', '¿es 11?'], ['es', 'tal vez 11'], ['es', 'no sé, creo que 11']]) assert.equal(isGuess(s, [l]), true, s);
  for (const [l, s] of [['fr', "je pense que c'est 11 parce que 6 plus 5"], ['fr', 'x égale 11'], ['fr', 'la réponse est 11'], ['es', 'creo que es 11 porque 6 más 5'], ['es', 'x es 11']]) assert.equal(isGuess(s, [l]), false, s);
  for (const [l, s] of [['fr', 'douze'], ['fr', "c'est douze"], ['fr', '110 degrés'], ['es', 'doce'], ['es', 'es doce'], ['es', '20 por ciento']]) assert.equal(isBareNumber(s, [l]), true, s);
  assert.equal(isBareNumber('douze'), false); assert.equal(isBareNumber('doce', ['en']), false); assert.equal(isBareNumber('12'), true);
  const guessed = [{ label: '', value: '11' }];
  assert.equal(unearnedCredit('Tu as calculé x toi-même.', guessed, true, ['fr']).length, 1); assert.equal(unearnedCredit('Oui, 11 est juste.', guessed, true, ['fr']).length, 0);
  assert.equal(unearnedCredit('Lo resolviste paso a paso.', guessed, true, ['es']).length, 1); assert.equal(unearnedCredit('Sí, 11 es correcto.', guessed, true, ['es']).length, 0);
  assert.equal(castsDoubt('Tu as juste deviné.', ['fr']).length, 1); assert.equal(castsDoubt('Tu as trouvé la bonne réponse.', ['fr']).length, 0);
  assert.equal(castsDoubt('Solo adivinaste.', ['es']).length, 1); assert.equal(castsDoubt('Encontraste la respuesta.', ['es']).length, 0);
});
t('the verdict said in front of a draft that lacks it is read as that verdict', () => {
  for (const code of ['zh-TW', 'zh-CN', 'ja', 'hi', 'hi-Latn', 'fr', 'es']) {
    const o = V2_VERDICT_OPENERS_BY_LANGUAGE[code]; assert.ok(o, code);
    assert.equal(verdictMissing(`${o.correct} x = 4`, ['correct'], [code]), null, `${code}: ${o.correct}`); assert.equal(verdictMissing(`${o.incorrect} x = 4`, ['incorrect'], [code]), null, `${code}: ${o.incorrect}`);
    assert.equal(verdictMissing(`${o.incorrect} x = 4`, ['correct'], [code]), 'correct', `${code}: ${o.incorrect}`); assert.equal(verdictMissing(`${o.correct} x = 4`, ['incorrect'], [code]), 'incorrect', `${code}: ${o.correct}`);
    assert.equal(o.mixed, '');
  }
  assert.deepEqual(V2_VERDICT_OPENERS, { correct: "That's right.", incorrect: 'Not quite.', mixed: '' });
});
t('typed Hinglish: answers typed in Latin letters', async () => {
  const L = ['hi-Latn'];
  const eq = (a: string, b: string) => { assert.equal(answerText(a, L), b, a); assert.equal(answerText(a, ['hi']), b, `hi: ${a}`); assert.equal(answerText(answerText(a, L), L), b, `again: ${a}`); assert.equal(answerText(b), b, `no session: ${b}`); };
  eq('x ki value 4 hogi', 'x = 4'); eq('x ka maan 5 hai', 'x = 5'); eq('answer 12 hai', 'the answer is 12'); eq('jawab 4 hai', 'the answer is 4'); eq('4 hoga', '4'); eq('12 aayega', '12'); eq('shayad 4', 'maybe 4'); eq('4 hai kya?', '4?'); eq('11 hai na?', '11?');
  eq('kya yeh 11 hai?', 'is it 11?'); eq('pata nahi, shayad 11', "I don't know, maybe 11"); eq('mujhe lagta hai 11 hoga', 'maybe 11'); eq('x barabar 3', 'x = 3'); eq('x = 3 aur y = 2', 'x = 3, y = 2'); eq('x 3 hai aur y 2 hai', 'x = 3, y = 2');
  // What is no answer stays as typed, in Latin letters.
  for (const s of ['haan samajh gaya', 'nahi samajh aaya', 'ek doubt hai', 'aage badhao', 'x = 4', 'the answer is 4', 'I think 4']) eq(s, s);
  // Read so only in a Hindi or Hinglish session.
  for (const langs of [undefined, ['en'], ['en', 'hi'], ['fr'], ['es'], ['zh-TW']]) for (const s of ['x ki value 4 hogi', 'answer 12 hai', 'jawab 4 hai', '4 hoga', 'shayad 4', '4 hai kya?', 'ek doubt hai']) assert.equal(answerText(s, langs as string[] | undefined), s, `${langs}: ${s}`);
  for (const s of ['x ki value 11 hogi', 'answer 11 hai', 'jawab 11 hai', '11 hoga', 'shayad 11', '11 hai kya?', 'x = 11 hai', 'mujhe lagta hai 11']) assert.equal(await checkIn(L, K2, s), '·:correct DONE', s);
  for (const s of ['x ki value 10 hogi', 'answer 10 hai', 'jawab 10 hai']) assert.equal(await checkIn(L, K2, s), '·:incorrect', s);
  for (const s of ['shayad 10', '10 hai kya?', 'nahi samajh aaya', 'ek doubt hai', 'haan samajh gaya']) assert.equal(await checkIn(L, K2, s), 'UNDECIDED', s);
  assert.equal(await checkIn(L, K1, 'x 3 hai aur y 2 hai'), RIGHT1); assert.equal(await checkIn(L, K1, 'x ki value 2 hai aur y ki value 3 hai'), WRONG1);
  for (const s of ['x ki value 11 hogi', 'jawab 11 hai', '11 hoga']) assert.equal(await checkIn(['en'], K2, s), await check(K2, s), `an English session: ${s}`);
});
t('typed Hinglish: the reply checks read Hindi typed in Latin letters, only in a Hindi or Hinglish lesson', () => {
  const L = ['hi-Latn'];
  for (const s of ['Bilkul sahi, x = 4 hai.', 'Haan, yeh correct hai.', 'Sahi jawab!', 'Shabaash!', 'Bahut badhiya, yahi answer hai.']) { assert.equal(verdictMissing(s, ['correct'], L), null, s); assert.equal(verdictMissing(s, ['incorrect'], L), 'incorrect', s); }
  // "sahi nahi", "theek nahi" and "bilkul nahi" are denials.
  for (const s of ['Yeh sahi nahi hai.', 'Galat hai, phir se dekho.', 'Theek nahi hai.', 'Yeh poori tarah correct nahi hai.', 'Bilkul nahi.', 'Nahi, ek baar phir dekho.']) { assert.equal(verdictMissing(s, ['correct'], L), 'correct', s); assert.equal(verdictMissing(s, ['incorrect'], L), null, s); }
  assert.equal(verdictMissing('Theek hai, ab agla dekhte hain.', ['correct'], L), 'correct'); assert.equal(verdictMissing('Theek hai, ab agla dekhte hain.', ['incorrect'], L), 'incorrect');
  // An English lesson reads none of it: only English's own words count there, as before.
  for (const langs of [undefined, ['en'], ['en', 'hi']]) {
    for (const s of ['Bilkul sahi, x = 4 hai.', 'Sahi jawab!', 'Shabaash!']) assert.equal(verdictMissing(s, ['correct'], langs), 'correct', `${langs}: ${s}`);
    for (const s of ['Yeh sahi nahi hai.', 'Galat hai, phir se dekho.', 'Theek nahi hai.']) assert.equal(verdictMissing(s, ['incorrect'], langs), 'incorrect', `${langs}: ${s}`);
    assert.equal(nonAnswer('haan', 'x ki value kya hai?', langs), null); assert.equal(isGuess('shayad 4?', langs), true, 'a "?" is a hedge in any language');
    assert.equal(verdictMissing("That's right.", ['correct'], langs), null); assert.equal(verdictMissing('Not quite.', ['incorrect'], langs), null);
  }
  assert.ok(nonAnswer('haan', 'x ki value kya hai?', L)); assert.ok(nonAnswer('theek hai', 'Tumhe kya dikh raha hai?', L)); assert.ok(nonAnswer('4', 'Tumhe kya dikh raha hai?', L));
  for (const [said, q] of [['4', 'x ki value kya hai?'], ['haan', 'Kya yeh sahi hai?'], ['4', 'x kitna hai?'], ['haan', 'Samajh aaya?'], ['4 hoga', 'x kitna hoga?']]) assert.equal(nonAnswer(said, q, L), null, `${said} / ${q}`);
  for (const s of ['shayad 4?', '4 hai kya?', 'pata nahi, shayad 4', 'kya yeh 4 hai?']) assert.equal(isGuess(s, L), true, s);
  for (const s of ['x ki value 4 hogi', 'answer 4 hai', 'shayad 4, kyunki dono side se 5 ghataya']) assert.equal(isGuess(s, L), false, s);
  for (const s of ['4 hoga', '4 hai', '4']) assert.equal(isBareNumber(s, L), true, s);
  const guessed = [{ label: '', value: '11' }];
  assert.equal(unearnedCredit('Tumne khud nikal liya ki x 11 hai.', guessed, true, L).length, 1); assert.equal(unearnedCredit('Haan, 11 sahi hai.', guessed, true, L).length, 0);
  assert.equal(castsDoubt('Yeh sirf ek tukka tha.', L).length, 1); assert.equal(castsDoubt('Tumhara jawab sahi hai.', L).length, 0); assert.equal(castsDoubt('Yeh sirf ek tukka tha.').length, 0);
  // The verdict said in front of a draft: typed in a typed session, the speech form in a spoken one.
  const typed = v2VerdictOpeners(L, 'text');
  assert.deepEqual(typed, { correct: 'Haan, yeh correct hai.', incorrect: 'Yeh poori tarah correct nahi hai.', mixed: '' });
  assert.equal(v2VerdictOpeners(L, 'voice'), V2_VERDICT_OPENERS_BY_LANGUAGE['hi-Latn']); assert.equal(v2VerdictOpeners(L), V2_VERDICT_OPENERS_BY_LANGUAGE['hi-Latn']);
  assert.equal(verdictMissing(`${typed.correct} x = 4`, ['correct'], L), null); assert.equal(verdictMissing(`${typed.incorrect} x = 4`, ['incorrect'], L), null);
  assert.equal(verdictMissing(`${typed.incorrect} x = 4`, ['correct'], L), 'correct'); assert.equal(verdictMissing(`${typed.correct} x = 4`, ['incorrect'], L), 'incorrect');
  for (const code of ['hi', 'fr', 'es', 'zh-TW', 'ja']) assert.equal(v2VerdictOpeners([code], 'text'), V2_VERDICT_OPENERS_BY_LANGUAGE[code], code);
  for (const langs of [undefined, ['en'], ['en', 'hi']]) for (const mode of [undefined, 'text', 'voice'] as const) assert.equal(v2VerdictOpeners(langs, mode), V2_VERDICT_OPENERS);
});
t('a problem named by its number, and the plan\'s words, in the new languages', () => {
  const sheet = { problems: [1, 2, 3, 4, 5].map((k) => ({ n: k, text: 't', verified: true })) };
  const named = (s: string) => sheetProblemNamed(s, sheet);
  assert.equal(named("l'exercice 3"), 3); assert.equal(named('le numéro 2'), 2); assert.equal(named('problème 4'), 4); assert.equal(named('el problema 4'), 4); assert.equal(named('la pregunta 5'), 5); assert.equal(named('ejercicio 2'), 2);
  assert.equal(named('सवाल 3'), 3); assert.equal(named('प्रश्न नंबर 4'), 4); assert.equal(named('3 नंबर का सवाल'), 3); assert.equal(named('question 3 करते हैं'), 3); assert.equal(named('सवाल 9'), null);
  assert.deepEqual(problemNumbersNamed('problem 2 and number 4'), [2, 4]); assert.deepEqual(problemNumbersNamed('question 3'), [3]);
  assert.equal(homeworkWording('hi').problemTitle(4), 'सवाल 4'); assert.equal(homeworkWording('fr-FR').problemTitle(4), 'Exercice 4'); assert.equal(homeworkWording('es-419').problemTitle(4), 'Problema 4');
  assert.equal(homeworkWording('fr').sheetTitle, 'Aide aux devoirs'); assert.equal(homeworkWording('es').sheetTitle, 'Ayuda con la tarea'); assert.equal(homeworkWording('hi').sheetTitle, 'होमवर्क में मदद');
  // Hinglish: the board and the labels are English.
  assert.equal(homeworkWording('hi-Latn').problemTitle(4), 'Problem 4'); assert.equal(homeworkWording('hinglish').sheetTitle, 'Homework help');
  // The panel's heading and the plan's title say the same thing.
  for (const code of ['hi', 'fr', 'es', 'hi-Latn', 'zh-TW', 'ja']) assert.equal(sessionStrings([code]).problemN(4), homeworkWording(code).problemTitle(4), code);
});

(async () => {
  let failed = 0;
  for (const [name, f] of tests) {
    try { await f(); console.log('PASS', name); }
    catch (e) { failed++; console.log('FAIL', name, '\n  ', String((e as Error).message).split('\n').slice(0, 6).join('\n   ')); }
  }
  console.log(`\n${tests.length - failed} passed${failed ? `, ${failed} failed` : ''}`);
  if (failed) process.exit(1);
})();
