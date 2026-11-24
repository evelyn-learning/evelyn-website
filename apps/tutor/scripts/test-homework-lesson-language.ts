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
import { verdictMissing, lastQuestionOf, nonAnswer, isGuess, isBareNumber, givesCredit, unearnedCredit, castsDoubt } from '../src/lib/tutor/v2/homework-guards';
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

(async () => {
  let failed = 0;
  for (const [name, f] of tests) {
    try { await f(); console.log('PASS', name); }
    catch (e) { failed++; console.log('FAIL', name, '\n  ', String((e as Error).message).split('\n').slice(0, 6).join('\n   ')); }
  }
  console.log(`\n${tests.length - failed} passed${failed ? `, ${failed} failed` : ''}`);
  if (failed) process.exit(1);
})();
