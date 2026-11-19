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
];

async function main() {
  if (process.env.TUTOR_TEST_LIVE !== '1') { console.log('skipped: set TUTOR_TEST_LIVE=1 to call the model'); return; }
  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  const { ROOM_CHECK_SYSTEM, repliedBackground, roomCheckMessage } = await import('../src/lib/tutor/v2/room-voices');
  const { client, model } = getModelClient('room-voices');
  let wrong = 0; let lostStudent = 0; const times: number[] = [];
  for (const c of CASES) {
    const t0 = Date.now();
    const msg = await client.messages.create({ model, max_tokens: 8, temperature: 0, system: ROOM_CHECK_SYSTEM, messages: [{ role: 'user', content: roomCheckMessage({ tutorSaid: c.tutor, heard: c.said, earlier: c.earlier }) }] });
    const ms = Date.now() - t0; times.push(ms);
    const raw = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
    const got = repliedBackground(raw) ? 'BACKGROUND' : 'STUDENT';
    if (got !== c.want) { wrong += 1; if (c.want === 'STUDENT') lostStudent += 1; }
    console.log(`${got === c.want ? '✓' : '✗'} ${String(ms).padStart(5)} ms  want ${c.want.padEnd(10)} got ${got.padEnd(10)} ${c.said.slice(0, 50)}${got === c.want ? '' : `   raw=${JSON.stringify(raw)}`}`);
  }
  times.sort((a, b) => a - b);
  console.log(`\n${model}: ${CASES.length - wrong}/${CASES.length} right; ${lostStudent} student line(s) taken for background; median ${times[Math.floor(times.length / 2)]} ms, slowest ${times[times.length - 1]} ms`);
  // A student who is ignored is the costly mistake.
  if (lostStudent) process.exit(1);
}
main();
