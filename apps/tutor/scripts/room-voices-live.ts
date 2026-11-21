/// <reference types="node" />
/**
 * Other voices in the room — the check against the live model (src/lib/tutor/v2/room-voices.ts).
 * Spends a few cents: runs only with TUTOR_TEST_LIVE=1.
 *   TUTOR_TEST_LIVE=1 npx tsx scripts/room-voices-live.ts
 * The first four lines are what a television put into a teacher's session (ECS, embed-1795049380206).
 */
import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(process.cwd(), '.env.local') });

const KELLY = "I'm going to tell you about two students who each used AI on a piece of writing. First, Kelly finishes her story and asks an AI chatbot how to make it better. It suggests stronger verbs and smoother links between ideas. What do you make of Kelly?";
const MATHS = "So the slope is rise over run. Between the points two, three and four, seven, the rise is four and the run is two. What does that make the slope?";
const CASES: Array<{ said: string; tutor: string; want: 'BACKGROUND' | 'STUDENT'; earlier?: string[] }> = [
  { tutor: KELLY, want: 'BACKGROUND', said: 'increase inflammation and gallbladder, severe stomach problems, to bring people with diabetes, especially if they take medicines for it. Call your prescribers, you experience or heart racing effects, side effects of nausea, vomiting, diabetes, hydration, which may cause kidney problems.' },
  { tutor: KELLY, want: 'BACKGROUND', said: 'eligible patients' },
  { tutor: KELLY, want: 'BACKGROUND', said: 'the urine sinks a bit before.' },
  { tutor: KELLY, want: 'BACKGROUND', said: 'Here comes the big guy with the big deal' },
  { tutor: KELLY, want: 'BACKGROUND', said: 'increase inflammation and gallbladder severe' },
  { tutor: MATHS, want: 'BACKGROUND', said: "and he's through on goal, what a pass that was from the midfield, oh and it's saved" },
  { tutor: MATHS, want: 'BACKGROUND', said: 'did you take the chicken out of the freezer I told you this morning' },
  { tutor: MATHS, want: 'BACKGROUND', said: 'tonight at eleven, a winter storm warning for the whole county' },
  { tutor: MATHS, want: 'BACKGROUND', said: 'Mom, I am in my lesson, can you close the door' },
  { tutor: KELLY, want: 'STUDENT', said: 'I think she did fine, she kept her own voice' },
  { tutor: KELLY, want: 'STUDENT', said: 'honestly that reminds me of a kid I had last year' },
  { tutor: KELLY, want: 'STUDENT', said: 'who is Kelly again' },
  { tutor: KELLY, want: 'STUDENT', said: "hold on I'm distracted, the TV is on" },
  { tutor: KELLY, want: 'STUDENT', said: 'this is too much for me right now' },
  { tutor: KELLY, want: 'STUDENT', said: "I'm taking notes for you" },
  { tutor: MATHS, want: 'STUDENT', said: 'two' },
  { tutor: MATHS, want: 'STUDENT', said: 'um is it four over two so two' },
  { tutor: MATHS, want: 'STUDENT', said: 'can we do a different one this is boring' },
  { tutor: MATHS, want: 'STUDENT', said: 'the rice is for and the run is to so to' },
  { tutor: MATHS, want: 'STUDENT', said: 'my dog just threw up I need a minute' },
  { tutor: MATHS, want: 'STUDENT', said: 'do you know who won the game last night' },
  { tutor: MATHS, want: 'STUDENT', said: 'えっと、二だと思います' },
  { tutor: MATHS, want: 'STUDENT', said: 'four seven minus three' },
  { tutor: MATHS, want: 'STUDENT', said: 'why do we divide', earlier: ['tonight at eleven, a winter storm warning'] },
  // A student's own answers and first words that the check read as another voice, with what the tutor had just
  // said (ACT Math, portal-3d431436 and portal-87303e9f), and the first words of broadcasts beside them.
  { tutor: "You added 4 on the x side, and the y side needs its own 1: half of 2 is 1, and 1 squared is 1. So the right side is 4 + 4 + 1. Which number did you add on the y side? Yes, that's 1, since half of 2 is 1 and 1 squared is 1. Your completed form, (x − 2)² + (y + 1)² = 9, is right. From there, what are the center and the radius? Yes, the center is (2, −1) and the radius is 3. Now try one on your own, with the same steps: x² + y² + 6x − 2y − 6 = 0.", want: 'STUDENT', said: "So the center here would" },
  { tutor: "Are you with me so far? The x-value tells you where the vertex sits left to right. To get the y-value, put x = 3 back into the original equation. What do you get for y? No single formula gives both at once. You find x with −b/(2a), then substitute that x back into the equation to get y. Does that answer your question? If so, what do you get for y when you plug x = 3 into y = x² − 6x + 5?", want: 'STUDENT', said: "But my uh teacher told" },
  { tutor: "You find x with −b/(2a), then substitute that x back into the equation to get y. Does that answer your question? If so, what do you get for y when you plug x = 3 into y = x² − 6x + 5? Your teacher is right, and I should have said so. The y-value of the vertex can also be found directly with y = −(b² − 4ac)/(4a). For our parabola, b² − 4ac = 36 − 20 = 16, so y = −16/4 = −4, which matches what we got by substituting. Try it on a new parabola: what is the vertex of y = x² + 4x + 7? Find the x-value first, then use either method to get y.", want: 'STUDENT', said: "Oh, so here will be" },
  { tutor: "If so, what do you get for y when you plug x = 3 into y = x² − 6x + 5? Your teacher is right, and I should have said so. The y-value of the vertex can also be found directly with y = −(b² − 4ac)/(4a). For our parabola, b² − 4ac = 36 − 20 = 16, so y = −16/4 = −4, which matches what we got by substituting. Try it on a new parabola: what is the vertex of y = x² + 4x + 7? Find the x-value first, then use either method to get y. Yes, x = −2 is right. Now substitute −2 for x in y = x² + 4x + 7 to find y.", want: 'STUDENT', said: "And then I'll put uh" },
  { tutor: "Start by writing the formula with your numbers in it. What do you get when you put in θ = 90° and r = 12? Yes, 90 over 360 reduces to one quarter, so the sector is a quarter of πr². Now put in r = 12. What do you get? The question is the sector area: a circle with radius 12, and a sector with a 90° central angle. Give the answer in terms of π. You already have the sector as one quarter of πr², so with r = 12, what is it?", want: 'STUDENT', said: "or radius 12. So that'" },
  { tutor: "Good. Next are the circle formulas, which you'll need cold. A circle has a diameter of 10. What is its area, in terms of π? Not quite. The formula is πr², and it needs the radius. The 10 in this problem is the diameter, the distance straight across the circle, so it isn't r yet. What do you get for the radius first?", want: 'STUDENT', said: "That is a 100 pi." },
  { tutor: "Start by writing the formula with your numbers in it. What do you get when you put in θ = 90° and r = 12? Yes, 90 over 360 reduces to one quarter, so the sector is a quarter of πr². Now put in r = 12. What do you get? The question is the sector area: a circle with radius 12, and a sector with a 90° central angle. Give the answer in terms of π. You already have the sector as one quarter of πr², so with r = 12, what is it?", want: 'STUDENT', said: "or radius 12. So that'll be pi times 144 by 4. That would be" },
  { tutor: "Good. Next are the circle formulas, which you'll need cold. A circle has a diameter of 10. What is its area, in terms of π? Not quite. The formula is πr², and it needs the radius. The 10 in this problem is the diameter, the distance straight across the circle, so it isn't r yet. What do you get for the radius first?", want: 'STUDENT', said: "All right. So 25 pi." },
  { tutor: "Good. Next are the circle formulas, which you'll need cold. A circle has a diameter of 10. What is its area, in terms of π? Not quite. The formula is πr², and it needs the radius. The 10 in this problem is the diameter, the distance straight across the circle, so it isn't r yet. What do you get for the radius first?", want: 'STUDENT', said: "I'm sorry, 62." },
  { tutor: "You added 4 on the x side, and the y side needs its own 1: half of 2 is 1, and 1 squared is 1. So the right side is 4 + 4 + 1. Which number did you add on the y side? Yes, that's 1, since half of 2 is 1 and 1 squared is 1. Your completed form, (x − 2)² + (y + 1)² = 9, is right. From there, what are the center and the radius? Yes, the center is (2, −1) and the radius is 3. Now try one on your own, with the same steps: x² + y² + 6x − 2y − 6 = 0.", want: 'STUDENT', said: "So the center would be minus 3 comma 1 and radius would be um minus 3 square uh plus 1 plus 6. which is under root 16, which is 4." },
  { tutor: "Start by writing the formula with your numbers in it. What do you get when you put in θ = 90° and r = 12? Yes, 90 over 360 reduces to one quarter, so the sector is a quarter of πr². Now put in r = 12. What do you get? The question is the sector area: a circle with radius 12, and a sector with a 90° central angle. Give the answer in terms of π. You already have the sector as one quarter of πr², so with r = 12, what is it?", want: 'BACKGROUND', said: "eligible patients may pay as" },
  { tutor: "Start by writing the formula with your numbers in it. What do you get when you put in θ = 90° and r = 12? Yes, 90 over 360 reduces to one quarter, so the sector is a quarter of πr². Now put in r = 12. What do you get? The question is the sector area: a circle with radius 12, and a sector with a 90° central angle. Give the answer in terms of π. You already have the sector as one quarter of πr², so with r = 12, what is it?", want: 'BACKGROUND', said: "tonight at eleven a winter" },
  { tutor: "Good. Next are the circle formulas, which you'll need cold. A circle has a diameter of 10. What is its area, in terms of π? Not quite. The formula is πr², and it needs the radius. The 10 in this problem is the diameter, the distance straight across the circle, so it isn't r yet. What do you get for the radius first?", want: 'BACKGROUND', said: "and he's through on goal what" },
  { tutor: "Good. Next are the circle formulas, which you'll need cold. A circle has a diameter of 10. What is its area, in terms of π? Not quite. The formula is πr², and it needs the radius. The 10 in this problem is the diameter, the distance straight across the circle, so it isn't r yet. What do you get for the radius first?", want: 'BACKGROUND', said: "did you take the chicken out" },
  { tutor: "Start by writing the formula with your numbers in it. What do you get when you put in θ = 90° and r = 12? Yes, 90 over 360 reduces to one quarter, so the sector is a quarter of πr². Now put in r = 12. What do you get? The question is the sector area: a circle with radius 12, and a sector with a 90° central angle. Give the answer in terms of π. You already have the sector as one quarter of πr², so with r = 12, what is it?", want: 'BACKGROUND', said: "Call your prescriber if you experience" },
];

const FIRST = "Talk to me as you would to a colleague, and stop me or ask me to repeat anything at any time. To begin: when you hear about students writing with AI, what's your first reaction?";
/** Mixed stretches: `must` are words of the student's that have to come through; `mustNot` are the television's. */
const MIXED: Array<{ tutor: string; run: string; must: string[]; mustNot: string[] }> = [
  { tutor: FIRST, run: "tonight. exclusive here in China AI dominance. How advanced President Trump works that Chinese spy scandal and honestly my first reaction is worry because they stop thinking for themselves they just don't have fully phones like this", must: ['first reaction is worry', 'stop thinking for themselves'], mustNot: ['spy scandal', 'President Trump'] },
  { tutor: FIRST, run: "They have trifold phones and cars with screens in the back seats I think it depends on how they use it the city filled with robots and food deliveries", must: ['depends on how they use it'], mustNot: ['trifold', 'robots'] },
  { tutor: MATHS, run: "and back at home tonight dangerous floods battering both coasts is it two Florida underwater cars trapped", must: ['two'], mustNot: ['floods', 'Florida'] },
  { tutor: MATHS, run: "the slope is four over two which is two", must: ['four over two', 'is two'], mustNot: [] },
  { tutor: FIRST, run: "wait can you say the question again a winter storm warning for the whole county tonight at eleven", must: ['say the question again'], mustNot: ['winter storm'] },
];
const NOTHING: Array<{ tutor: string; run: string }> = [
  { tutor: FIRST, run: "They have trifold phones and cars with screen items in the back seats. The city filled with robots and food deliveries" },
  { tutor: FIRST, run: "And back at home tonight, dangerous floods battering both coasts, Florida underwater, cars trapped. First responders rescuing" },
  { tutor: KELLY, run: "increase inflammation and gallbladder, severe stomach problems. Call your prescribers" },
];

async function extraction(): Promise<number> {
  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  const { ROOM_CHECK_SYSTEM, ROOM_EXTRACT_SYSTEM, repliedBackground, roomCheckMessage, roomModelParams, roomReplyText, studentPart, studentWordsIn } = await import('../src/lib/tutor/v2/room-voices');
  const { client, model } = getModelClient('room-voices');
  const text = (m: { content: Array<{ type: string; text?: string }> }) => roomReplyText(m);
  // As the endpoint does it: both readings at once, put together by studentPart.
  const ask = async (tutor: string, run: string) => { const t0 = Date.now(); const content = roomCheckMessage({ tutorSaid: tutor, heard: run }); const [whole, picked] = await Promise.all([client.messages.create({ model, max_tokens: 16, ...(roomModelParams(model) as Record<string, never>), system: ROOM_CHECK_SYSTEM, messages: [{ role: 'user', content }] }), client.messages.create({ model, max_tokens: 300, ...(roomModelParams(model) as Record<string, never>), system: ROOM_EXTRACT_SYSTEM, messages: [{ role: 'user', content }] })]); return { got: studentPart(repliedBackground(text(whole)), studentWordsIn(text(picked), run), run), ms: Date.now() - t0 }; };
  let lost = 0; let leaked = 0;
  console.log('\nthe student\'s words out of a mixed stretch');
  for (const c of MIXED) {
    const { got, ms } = await ask(c.tutor, c.run);
    const has = (w: string) => (got ?? '').toLowerCase().includes(w.toLowerCase());
    const missing = c.must.filter((w) => !has(w)); const extra = c.mustNot.filter(has);
    if (missing.length) lost += 1; if (extra.length) leaked += 1;
    console.log(`${missing.length ? '✗' : extra.length ? '~' : '✓'} ${String(ms).padStart(5)} ms  ${JSON.stringify(got)}${missing.length ? `   MISSING ${JSON.stringify(missing)}` : ''}${extra.length ? `   television kept: ${JSON.stringify(extra)}` : ''}`);
  }
  for (const c of NOTHING) {
    const { got, ms } = await ask(c.tutor, c.run);
    if (got !== null) leaked += 1;
    console.log(`${got === null ? '✓' : '~'} ${String(ms).padStart(5)} ms  nothing of the student's in: ${c.run.slice(0, 50)}${got === null ? '' : `   kept: ${JSON.stringify(got)}`}`);
  }
  // A stretch that is the student's alone must come through, whole or nearly so: this is what decides a turn.
  for (const c of CASES) {
    const { got } = await ask(c.tutor, c.said);
    if (c.want === 'STUDENT' && got === null) { lost += 1; console.log(`✗ the student's own line found nothing: ${c.said}`); }
    if (c.want === 'BACKGROUND' && got !== null) { leaked += 1; console.log(`~ another voice kept: ${c.said.slice(0, 60)}`); }
  }
  console.log(`\nextraction: ${lost} stretch(es) lost words of the student's; ${leaked} kept some of the television`);
  return lost;
}

async function main() {
  if (process.env.TUTOR_TEST_LIVE !== '1') { console.log('skipped: set TUTOR_TEST_LIVE=1 to call the model'); return; }
  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  const { ROOM_CHECK_SYSTEM, repliedBackground, roomCheckMessage, roomModelParams, roomReplyText } = await import('../src/lib/tutor/v2/room-voices');
  const { client, model } = getModelClient('room-voices');
  let wrong = 0; let lostStudent = 0; const times: number[] = [];
  for (const c of CASES) {
    const t0 = Date.now();
    const msg = await client.messages.create({ model, max_tokens: 16, ...(roomModelParams(model) as Record<string, never>), system: ROOM_CHECK_SYSTEM, messages: [{ role: 'user', content: roomCheckMessage({ tutorSaid: c.tutor, heard: c.said, earlier: c.earlier }) }] });
    const ms = Date.now() - t0; times.push(ms);
    const raw = roomReplyText(msg as never);
    const got = repliedBackground(raw) ? 'BACKGROUND' : 'STUDENT';
    if (got !== c.want) { wrong += 1; if (c.want === 'STUDENT') lostStudent += 1; }
    console.log(`${got === c.want ? '✓' : '✗'} ${String(ms).padStart(5)} ms  want ${c.want.padEnd(10)} got ${got.padEnd(10)} ${c.said.slice(0, 50)}${got === c.want ? '' : `   raw=${JSON.stringify(raw)}`}`);
  }
  times.sort((a, b) => a - b);
  console.log(`\n${model}: ${CASES.length - wrong}/${CASES.length} right; ${lostStudent} student line(s) taken for background; median ${times[Math.floor(times.length / 2)]} ms, slowest ${times[times.length - 1]} ms`);
  // A student who is ignored is the costly mistake.
  const lostWords = await extraction();
  if (lostStudent || lostWords) process.exit(1);
}
main();
