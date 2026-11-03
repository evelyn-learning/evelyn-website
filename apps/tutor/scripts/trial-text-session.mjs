// Trial-lesson text driver: plays a scripted learner against the REAL embed
// (voice session, typed replies, silent fake microphone) so the fixed-script
// lesson can be exercised without a human at the mic. Pronunciation and
// perception (echo, barge-in) are NOT covered — those stay with voice runs.
//
// Usage (from apps/tutor):
//   node scripts/trial-text-session.mjs --variant <name> [--student gdi-trial-bot-N] [--port 3019]
//                                       [--max-min 32] [--out <dir>] [--smoke]
// Variants (see VARIANTS): base, errors, impatient, lost, beginner, polite, quiet, pron, straight, wild
// --smoke: stop after the first offer is answered (~6 min).
// Needs: a dev server on --port serving the worktree; the praveen link in
// ~/.evelyn/partners/gdi-trial.links.local.txt (its token payload is reused
// with the bot's student id, re-signed with ~/.evelyn/partners/gdi-demo.secret).
// After the run it dumps the session from the prod tunnel (read-only) and runs
// the checks in ./trial-text-session-checks.mjs.
import { chromium } from 'playwright';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { runChecks, TANGENTS } from './trial-text-session-checks.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes(k);
const variantName = arg('--variant', 'base');
const port = Number(arg('--port', '3019'));
const maxMin = Number(arg('--max-min', '32'));
const smoke = has('--smoke');
const outDir = arg('--out', path.join(os.tmpdir(), 'trial-text-session'));
fs.mkdirSync(outDir, { recursive: true });
const studentId = arg('--student', `gdi-trial-bot-${Math.random().toString(36).slice(2, 8)}`);
const seed = Number(arg('--seed', String(Date.now() % 100000)));
let rnd = seed;
const rand = () => { rnd = (rnd * 1103515245 + 12345) % 2147483648; return rnd / 2147483648; };
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

// ── token: reuse the praveen trial payload, swap the learner ──
const home = os.homedir();
const linkLine = fs.readFileSync(path.join(home, '.evelyn/partners/gdi-trial.links.local.txt'), 'utf8').split('\n').find((l) => l.startsWith('praveen\t'));
if (!linkLine) { console.error('no praveen link in gdi-trial.links.local.txt'); process.exit(1); }
const srcToken = new URL(linkLine.split('\t')[1]).searchParams.get('token');
const b64 = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const payload = JSON.parse(Buffer.from(srcToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
const now = Math.floor(Date.now() / 1000);
Object.assign(payload, { student_id: studentId, student_name: arg('--name', 'Haruto'), iat: now, exp: now + 6 * 3600 });
const secret = fs.readFileSync(path.join(home, '.evelyn/partners/gdi-demo.secret'), 'utf8').trim();
const sign = (p) => { const h = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' })); const pp = b64(JSON.stringify(p)); return `${h}.${pp}.${b64(crypto.createHmac('sha256', secret).update(`${h}.${pp}`).digest())}`; };
const embedUrl = `http://localhost:${port}/tutor-portal/embed?token=${sign(payload)}`;

// ── silent microphone ──
const silentWav = path.join(outDir, 'silence.wav');
if (!fs.existsSync(silentWav)) {
  const rate = 16000, secs = 30, data = Buffer.alloc(rate * secs * 2);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(silentWav, Buffer.concat([h, data]));
}

// ── the learner ──
// Each answer pool: [with typical errors, clean]. The variant decides which.
const POOL = {
  job: ['I work in sales department at electronics company in Osaka.', 'I work in the sales department of an electronics company in Osaka.'],
  recent: ['Last month I make a presentation for new product launch.', 'Last month I made a presentation for a new product launch.'],
  international: ['Yes, I have work with a customer from Germany two years ago.', 'Yes, I worked with a customer from Germany two years ago.'],
  improve: ['I want to improve speaking because I must explain products to foreign customers.', 'I want to improve my speaking because I have to explain our products to foreign customers.'],
  longTime: ['Yes, I have work in my company since five years.', 'Yes, I have worked at my company for five years.'],
  skillLearned: ['I have learn how to negotiate with suppliers.', 'I have learned how to negotiate with suppliers.'],
  helped: ['It has helped me to get better price.', 'It has helped me get a better price.'],
  events: ['Yes, I go to a trade show in Tokyo last year.', 'Yes, I went to a trade show in Tokyo last year.'],
  learnedAt: ['I learn about new battery technology.', 'I learned about new battery technology.'],
  trip: ['I visit our factory in Vietnam and check the quality.', 'I visited our factory in Vietnam and checked the quality.'],
  proud: ['I am proud of new website project.', 'I am proud of the new website project.'],
  responsible: ['I was responsible for test the website.', 'I was responsible for testing the website.'],
  challenge: ['Biggest challenge was schedule was very tight.', 'The biggest challenge was that the schedule was very tight.'],
  result: ['The project finish on time and customer was happy.', 'The project finished on time and the customer was happy.'],
  felt: ['I felt relief.', 'I felt relieved.'],
  lesson: ['I learned that communication is most important.', 'I learned that communication is the most important thing.'],
  difference: ['The first one means I still work here now. The second one means I worked here in the past, but not now.', 'The first one means I still work here now. The second one means I worked here before and I do not work here now.'],
  differenceWrong: ['The first means I worked here before and now I don\'t. The second means I still work here.'],
  when: ['Last March.', 'Two years ago.', 'Six months ago.'],
  why: ['Because it is important for my work.', 'Because my customers are from overseas.'],
  how: ['By practicing every day.', 'I asked my manager for advice.'],
  who: ['My manager and two colleagues.'],
  where: ['In Osaka, at our head office.'],
  generic: ['OK.', 'I see.', 'Yes, I understand.', 'OK, thank you.'],
  whichTense: ['Present perfect, because it is my experience until now.', 'I think past simple.'],
  whichWords: ['Last month.', '"Last year" shows the time is finished.'],
  howLong: ['For three years.', 'I have worked in my current department for three years.'],
  department: ['I have worked in my current department for three years.'],
  // straight answers for the follow-ups the tutor actually asks
  country: ['I visit Germany for business last year.', 'I visited Germany for business last year.'],
  product: ['The product is a new washing machine.', 'It was a new washing machine with a big drum.'],
  saw: ['I saw a robot that could talk.', 'I saw many new battery products.'],
  talkedAbout: ['We talk about the price and the delivery.', 'We talked about the price and the delivery date.'],
  customerSaid: ['The customer say the price is good.', 'The customer said the price was good.'],
  firstStep: ['First I make a plan with my team.', 'First, I made a plan with my team.'],
  nextStep: ['Then I call the supplier.', 'Then I called the supplier.'],
  total: ['It was about two hundred dollars.'],
  moneyUse: ['We give the money to a charity.', 'We gave the money to a charity.'],
  confident: ['I feel most confident with "I have worked at my company for five years."'],
  meeting: ['I had a meeting with my boss yesterday.'],
  colleague: ['Yes, I have worked with my colleague Tanaka on a website project.'],
  hobby: ['I have been playing tennis for ten years.'],
  nextTime: ['Next time I will prepare the slides earlier.'],
  companySize: ['My company has about three hundred people.'],
  dailyTask: ['I check emails and call customers every morning.'],
  useEmail: ['I will use "I have worked" in my next email to my boss.'],
};
// "starting with "X"" scaffolds: X + a tail that fits
const PREFIX_TAILS = [
  [/^i am a$/i, ['sales manager at an electronics company.']], [/^i work as a$/i, ['sales manager.']],
  [/^i$/i, ['visited our factory in Vietnam last year.', 'made a presentation for a new product launch.']],
  [/^i (?:worked|met|talked|spoke) with/i, ['a customer from Germany two years ago.', 'our supplier in Vietnam last year.']],
  [/^i have worked/i, ['with a customer from Germany.', 'at my company for five years.', 'on the new website project for two months.']],
  [/^i have learned/i, ['how to negotiate with suppliers.']], [/^it has helped me/i, ['get a better price from suppliers.']],
  [/^i work/i, ['in the sales department of an electronics company.']], [/^i am preparing/i, ['a presentation for the sales meeting.']],
  [/^the goal was/i, ['to sell more products to new customers.']], [/^i was responsible for/i, ['testing the website.']],
  [/^i'?m proud of/i, ['the new website project.']], [/^i felt/i, ['relieved when the project finished.']],
  [/^i learned/i, ['that communication is the most important thing.']], [/^i attended/i, ['a trade show in Tokyo last year.']],
  [/^the project/i, ['was successful because the customer was happy.']], [/^the biggest challenge was/i, ['that the schedule was very tight.']],
  [/^i (?:went|visited|met|made|gave)/i, ['to a trade show in Tokyo last year.']], [/^yes, i have/i, ['worked with a customer from Germany.']],
  [/^no, i haven'?t/i, ['worked with an international customer yet.']],
];
const scaffold = (text) => {
  const m = text.match(/\b(?:start(?:ing)?|begin(?:ning)?) with\s+["“「]([^"”」]{2,40})["”」]/i);
  if (!m) return null;
  const prefix = m[1].trim().replace(/[.…\s]+$/, '').trim();
  for (const [re, tails] of PREFIX_TAILS) if (re.test(prefix)) return `${prefix} ${pick(tails)}`;
  return `${prefix} for my company last year.`;
};
const VARIANTS = {
  // errors: share of answers taken from the error column; repeatErrorFirst: a repeat
  // ask is first said with one slip, then correctly; offers: answers to the
  // "one more / move on" offers in order; ambiguousYes: the first offer gets "Yes."
  // before a real answer; bargeTyped: type the offer answer during playback;
  // slowTurn: one 45 s silence (idle nudge); askQuestion: once ask what the question
  // was; postCloseMore: ask for more after the goodbye; menu: the pronunciation pick;
  // japanese: one answer in Japanese; moveOnOrder: once order "move on" mid-part;
  // wrongDifference: the summary contrast answer is reversed.
  base: { errors: 0.5, repeatErrorFirst: false, offers: ['One more, please.', "Let's move on."], ambiguousYes: false, bargeTyped: false, slowTurn: false, askQuestion: false, postCloseMore: false, menu: 'Skip, please.', japanese: false, moveOnOrder: false, wrongDifference: false },
  errors: { errors: 0.9, repeatErrorFirst: true, offers: ['One more.', 'One more practice.'], ambiguousYes: false, bargeTyped: false, slowTurn: false, askQuestion: true, postCloseMore: true, menu: '4', japanese: false, moveOnOrder: false, wrongDifference: true },
  impatient: { errors: 0.4, repeatErrorFirst: false, offers: ["Let's move on.", 'Next part.'], ambiguousYes: false, bargeTyped: true, slowTurn: false, askQuestion: false, postCloseMore: false, menu: 'skip and continue', japanese: false, moveOnOrder: true, wrongDifference: false },
  lost: { errors: 0.7, repeatErrorFirst: true, offers: ['Yes.', 'Yes.'], ambiguousYes: true, slowTurn: true, bargeTyped: false, askQuestion: true, postCloseMore: false, menu: 'I want to skip pronunciation.', japanese: true, moveOnOrder: false, wrongDifference: false },
  beginner: { errors: 1.0, repeatErrorFirst: true, offers: ['One more please.', 'Move on.'], ambiguousYes: false, bargeTyped: false, slowTurn: true, askQuestion: false, postCloseMore: true, menu: 'skip', japanese: true, moveOnOrder: false, wrongDifference: true },
  polite: { errors: 0.2, repeatErrorFirst: false, offers: ['Another one, please.', "No, let's go on to the next part."], ambiguousYes: false, bargeTyped: true, slowTurn: false, askQuestion: false, postCloseMore: false, menu: 'number four', japanese: false, moveOnOrder: false, wrongDifference: false },
  // run 18: quiet — 20 s pause after every repeat ask (the silent-continue path); offers answered loosely ("Uh, yeah, one more. sentence.")
  quiet: { errors: 0.5, repeatErrorFirst: true, offers: ['Uh, yeah, one more. sentence.', 'Yes.', 'Yes please, one more.', "OK, let's move on."], ambiguousYes: false, bargeTyped: false, slowTurn: false, askQuestion: false, postCloseMore: false, menu: 'Skip, please.', japanese: false, moveOnOrder: false, wrongDifference: false, silentAfterRepeat: true, finishEarly: true },
  // run 18: pron — picks the sentence drill; the clip is silence so the tutor must re-ask the SAME target; 20 s pauses after repeat asks
  // straight: a model learner — clean answers, prompt-following, accepts offers once, skips pronunciation
  straight: { errors: 0.0, repeatErrorFirst: false, offers: ['One more, please.', "Let's move on."], ambiguousYes: false, bargeTyped: false, slowTurn: false, askQuestion: false, postCloseMore: false, menu: '4', japanese: false, moveOnOrder: false, wrongDifference: false },
  // wild: goes off in random directions — a tangent (off-topic / meta / Japanese / odd / ramble) replaces ~22 % of answers
  wild: { errors: 0.5, repeatErrorFirst: false, offers: ['One more, please.', 'Yes.', "No, let's move on."], ambiguousYes: false, bargeTyped: false, slowTurn: false, askQuestion: false, postCloseMore: true, menu: 'a complete sentence', japanese: false, moveOnOrder: false, wrongDifference: false, wild: 0.22 },
  pron: { errors: 0.4, repeatErrorFirst: false, offers: ['One more, please.', "Let's move on."], ambiguousYes: false, bargeTyped: false, slowTurn: false, askQuestion: false, postCloseMore: false, menu: 'A complete sentence, please.', japanese: false, moveOnOrder: false, wrongDifference: false, silentAfterRepeat: true, finishEarly: false },
};
const V = VARIANTS[variantName];
if (!V) { console.error(`unknown variant ${variantName}; one of ${Object.keys(VARIANTS).join(', ')}`); process.exit(1); }

const quoted = (t) => {
  const out = [];
  for (const m of t.matchAll(/[“「]([^”」\n]{12,}?)[”」]/g)) out.push(m[1].trim());
  const parts = t.split('"');
  for (let i = 1; i < parts.length; i += 2) if (parts[i] && parts[i].trim().split(/\s+/).length >= 4) out.push(parts[i].trim());
  return out;
};
const slip = (s) => {
  // one typical slip: drop an article, or strip "-ed" from one verb
  const a = s.replace(/\b(a|an|the) /i, '');
  if (a !== s) return a;
  return s.replace(/\b(\w{3,})ed\b/, '$1');
};
const state = { offers: 0, askedQuestion: false, slowDone: false, japaneseDone: false, moveOnDone: false, postCloseDone: false, closed: false, lastRepeat: null, repeatSlipDone: false, ambiguousDone: false, answered: {}, bargeNext: false, student: 0 };
const fromPool = (key) => {
  const p = POOL[key]; if (!p) return null;
  const n = (state.answered[key] = (state.answered[key] ?? 0) + 1);
  if (p.length === 1) return p[0];
  const withErr = rand() < V.errors && n === 1;
  return withErr ? p[0] : p[1];
};
const OFFER_RE = /\b(?:one more|another|more practice|again|once more)\b[^.?!]*\b(?:move on|moving on|go on|continue|next)\b|\b(?:move on|go on|continue)\b[^.?!]*\b(?:one more|another|more practice)\b|もう一/i;
const MENU_RE = /\b[1-4]\)/g;
const CLOSE_RE = /\bthank you for today'?s lesson|\bthank you for your hard work today|レッスンは(?:これで|ここで)?終わり|今日のレッスンは終わり|\bwrap up here\b|\bthat'?s (?:all|it) for today|\bthat'?s our time|\bour time (?:is|has) (?:up|finished)|\bsee you (?:next|soon|again|later|tomorrow)|\bsee you[.!]|お疲れ|\bgood-?bye\b|have a (?:good|nice|great) (?:day|evening|night)|\bsession is over\b|time is up|\bwell done today\b|finished for today/i;
const REPEAT_RE = /\b(?:repeat|say|try|read)\b[^.?!]*(?:after me|once more|again|that (?:sentence|one)|it (?:once more|again)|for me)|\bcould you (?:say|try)\b/i;

function decide(text) {
  const t = text.trim();
  const sents = t.split(/(?<=[.?!。？])\s+/);
  const last = sents.slice(-2).join(' ');
  // the keyword rules read the LAST question the tutor asked (a long turn often
  // ends with "don't worry about mistakes" after the question itself)
  const lastQ = [...sents].reverse().find((x) => /[?？]\s*$/.test(x)) ?? last;
  if (CLOSE_RE.test(t) && !/\bbefore we finish\b/i.test(last)) {
    if (V.postCloseMore && !state.postCloseDone) { state.postCloseDone = true; return { text: 'Can I have one more practice, please?', why: 'post-close more' }; }
    state.closed = true; return null;
  }
  if ((t.match(MENU_RE) ?? []).length >= 3 || /\bindividual words\b.*\bcomplete sentence\b/i.test(t) || /\bwords\b.*\bsentence\b.*\b(?:naturally|natural)\b.*\bskip\b/i.test(t) || /単語.*一文.*スキップ/.test(t)) return { text: V.menu, why: 'menu' };
  if (OFFER_RE.test(last)) {
    if (V.ambiguousYes && !state.ambiguousDone) { state.ambiguousDone = true; return { text: 'Yes.', why: 'ambiguous yes' }; }
    const a = V.offers[Math.min(state.offers, V.offers.length - 1)]; state.offers += 1;
    if (V.bargeTyped) state.bargeNext = true;
    return { text: a, why: `offer ${state.offers}` };
  }
  if (/\bare you ready\b|準備|\bshall we (?:start|begin)\b|\bready to (?:start|begin)\b/i.test(last)) return { text: pick(['Yes, I\'m ready.', 'Yes, let\'s start.', 'OK, ready.']), why: 'ready' };
  if (/\bdifference between\b/i.test(t) && /\bworked here\b|\bhave worked\b/i.test(t)) return { text: V.wrongDifference ? POOL.differenceWrong[0] : fromPool('difference'), why: 'difference' };
  const q = quoted(t).filter((x) => !/[?？]\s*$/.test(x));
  if (q.length && (REPEAT_RE.test(t) || /\bstarting with\b/i.test(last) === false && /\bsay\b|\brepeat\b|\btry\b/i.test(last))) {
    const target = q[q.length - 1];
    if (/\bstarting with\b|\bstart with\b|\bbegin with\b/i.test(last) && target.split(' ').length <= 3) { /* a starter, not a repeat */ } else {
      if (V.repeatErrorFirst && state.lastRepeat !== target) { state.lastRepeat = target; return { text: slip(target), why: 'repeat with slip' }; }
      state.lastRepeat = target; return { text: target, why: 'repeat' };
    }
  }
  const sc = scaffold(lastQ) ?? scaffold(last);
  if (sc && !state.lastRepeat?.startsWith(sc.slice(0, 12))) { state.lastRepeat = sc; return { text: V.repeatErrorFirst && rand() < 0.5 ? slip(sc) : sc, why: 'scaffold' }; }
  if (V.askQuestion && !state.askedQuestion && state.student > 6 && /\?$/.test(last)) { state.askedQuestion = true; return { text: 'Sorry, what was the question?', why: 'ask question' }; }
  if (V.moveOnOrder && !state.moveOnDone && state.student > 14 && /\?$/.test(last)) { state.moveOnDone = true; return { text: "Let's move on to the next part now.", why: 'move-on order' }; }
  if (V.japanese && !state.japaneseDone && state.student > 3 && /\bwhy\b|\bwhen\b/i.test(last)) { state.japaneseDone = true; return { text: 'すみません、もう一度言ってください。', why: 'japanese' }; }
  const L = lastQ.toLowerCase();
  const rules = [
    [/which tense|past simple or present perfect|present perfect or past simple/, 'whichTense'], [/which words?|what words?|time word/, 'whichWords'],
    [/skill.*(improve|better)|improve/, 'improve'], [/international|foreign|overseas|abroad/, 'international'],
    [/what do you do|your job|about your work|about your job|where do you work|what is your job/, 'job'],
    [/recent (sale|project)|project you worked|one project|sale or project|working on now|preparing/, 'recent'],
    [/skill.*(learned|learnt)|learned at|have you learned/, 'skillLearned'], [/how long.*department|your (?:current )?department/, 'department'],
    [/how long/, 'howLong'], [/long time/, 'longTime'],
    [/helped you|help you|has helped/, 'helped'], [/exhibition|event|conference|trade show|last year/, 'events'],
    [/business trip|last trip|on your trip/, 'trip'], [/proud/, 'proud'], [/responsible|your role|what did you do in/, 'responsible'],
    [/challenge|difficult/, 'challenge'], [/result|outcome|how did it (end|go)|successful/, 'result'], [/feel|felt/, 'felt'],
    [/what did you learn|one thing you learned|lesson/, 'lesson'], [/what.*learn|learned at the|learn there/, 'learnedAt'],
    [/which country|what country|name of (?:a|the) (?:foreign )?country|country did you/, 'country'], [/what (?:was|is) the product|which product|product (?:was|is) it|about the product/, 'product'],
    [/what did you see|one thing you saw|saw there|caught your (?:eye|attention)/, 'saw'], [/talk(?:ed)? about|discuss/, 'talkedAbout'], [/customer (?:say|said)|did (?:the|your) customer/, 'customerSaid'],
    [/\bfirst,? (?:i|you)|first step|starting with "first/, 'firstStep'], [/\bthen,? (?:i|you)|next step|what did you do next|after that/, 'nextStep'], [/total|how much (?:money|did you)/, 'total'], [/with the money|the money after|donat/, 'moneyUse'],
    [/confident|more natural|which sentence/, 'confident'], [/meeting/, 'meeting'], [/colleague|co-?worker|team member/, 'colleague'], [/hobby|free time|weekend/, 'hobby'],
    [/next time|in the future|will you (?:do|use)|your next email|use .* with your boss/, 'nextTime'], [/how many people|company size|big is your company/, 'companySize'], [/every day|daily|typical day|morning/, 'dailyTask'], [/email/, 'useEmail'],
    [/\bwhen\b/, 'when'], [/\bwhy\b/, 'why'], [/\bhow\b/, 'how'], [/\bwho\b/, 'who'], [/\bwhere\b/, 'where'],
  ];
  for (const [re, key] of rules) if (re.test(L)) {
    const a = fromPool(key);
    if (a && a !== state.lastAnswer) { state.lastAnswer = a; return { text: a, why: key }; }
    if (a) { const alt = POOL[key][POOL[key].length - 1] !== a ? POOL[key][POOL[key].length - 1] : `${a.replace(/\.$/, '')}, as I said.`; state.lastAnswer = alt; return { text: alt, why: `${key} (alt)` }; }
  }
  if (/\?\s*$/.test(last)) {
    const fresh = ['I think it was a good experience for me.', 'It was last year, in the spring.', 'My boss helped me with it.', 'I did it with two colleagues from my team.', 'It took about three months.'];
    return { text: V.errors < 0.1 ? pick(fresh) : (fromPool('recent') ?? pick(POOL.generic)), why: 'fallback-q' };
  }
  return { text: pick(POOL.generic), why: 'fallback' };
}

// ── drive ──
const log = [];
const say = (s) => { const line = `${new Date().toISOString().slice(11, 19)} ${s}`; console.log(line); log.push(line); };
const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${silentWav}`, '--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ permissions: ['microphone'], viewport: { width: 1000, height: 820 } });
const turns = []; let inFlight = 0; let lastEnd = 0; let lastWords = 0;
// Tee the brain stream inside the page (UTF-8 safe, no body buffering in Playwright):
// window.__brain = { inFlight, turns: [{t, sentences, tools}] }
await ctx.addInitScript(() => {
  window.__brain = { inFlight: 0, turns: [] };
  const orig = window.fetch;
  window.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input : input?.url ?? '';
    if (!url.includes('/api/tutor/brain/stream')) return orig.apply(this, arguments);
    window.__brain.inFlight += 1;
    let res;
    try { res = await orig.apply(this, arguments); } catch (e) { window.__brain.inFlight -= 1; throw e; }
    try {
      const clone = res.clone();
      (async () => {
        const sentences = []; const tools = []; let buf = '';
        try {
          const reader = clone.body.getReader(); const dec = new TextDecoder('utf-8');
          for (;;) { const { value, done } = await reader.read(); if (done) break; buf += dec.decode(value, { stream: true });
            let i; while ((i = buf.indexOf('\n\n')) >= 0) { const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
              for (const line of chunk.split('\n')) { if (!line.startsWith('data: ')) continue; try { const ev = JSON.parse(line.slice(6)); if (ev.type === 'sentence' && ev.text) sentences.push(ev.text); if (ev.type === 'tool-call') tools.push(ev.name); } catch {} } } }
        } catch {}
        window.__brain.inFlight = Math.max(0, window.__brain.inFlight - 1);
        window.__brain.turns.push({ t: Date.now(), sentences, tools });
      })();
    } catch { window.__brain.inFlight = Math.max(0, window.__brain.inFlight - 1); }
    return res;
  };
});
// The session-audio recorder re-posts a growing buffer when the local upload
// route fails (no /var/data on a laptop); the body then exceeds what Playwright's
// pipe can carry. Answer those uploads with a stub so the recorder clears.
await ctx.route('**/api/tutor/session-audio*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"stub":true}' }));
const page = await ctx.newPage();
const pollBrain = async () => {
  const b = await page.evaluate(() => { const t = window.__brain?.turns.splice(0) ?? []; return { inFlight: window.__brain?.inFlight ?? 0, turns: t }; }).catch(() => ({ inFlight: 0, turns: [] }));
  inFlight = b.inFlight;
  for (const x of b.turns) { turns.push(x); lastEnd = Date.now(); lastWords = x.sentences.join(' ').split(/\s+/).filter(Boolean).length; say(`TUTOR  ${x.sentences.join(' ').slice(0, 400)}${x.tools.length ? `   [tools: ${x.tools.join(',')}]` : ''}`); }
};
page.on('pageerror', (e) => say(`PAGEERROR ${String(e).slice(0, 200)}`));
await page.goto(embedUrl, { waitUntil: 'domcontentloaded' });
say(`open ${embedUrl.slice(0, 60)}… student=${studentId} variant=${variantName} seed=${seed}`);
const orb = page.locator('[data-testid="tutor-orb-start"]');
try { await orb.waitFor({ state: 'visible', timeout: 30000 }); await orb.click(); say('clicked start'); } catch { say('no start orb (auto-start?)'); }
const input = page.locator('input[name="studentText"]');
const wait = (ms) => page.waitForTimeout(ms);
const t0 = Date.now();
const estPlaybackMs = () => lastWords * 420 + 1500;
async function waitQuiet(maxMs) {
  const end = Date.now() + maxMs;
  for (;;) {
    await pollBrain();
    const quietFor = Date.now() - lastEnd;
    if (inFlight === 0 && lastEnd > 0 && quietFor >= estPlaybackMs() && quietFor >= 2500) return true;
    if (Date.now() > end) return false;
    await wait(400);
  }
}
let sinceStudent = 0;
// The authored opener is spoken by the client (no brain stream), so the tee never sees it:
// answer its "Are you ready?" proactively, like a real student, instead of waiting for the idle nudge.
{
  const opened = await (async () => { const end = Date.now() + 12000; while (Date.now() < end) { const b = await page.evaluate(() => window.__brain?.turns.length ?? 0).catch(() => 0); if (b > 0) return true; await wait(500); } return false; })();
  if (!opened) {
    await wait(8000); // let the opener finish
    const ready = pick(["Yes, I'm ready.", "Yes, let's start.", 'OK, ready.']);
    try { await input.click({ timeout: 8000 }); await input.fill(ready); await input.press('Enter'); state.student += 1; sinceStudent = Date.now(); say(`STUDENT(ready, proactive) ${ready}`); } catch { say('input not ready for the proactive answer'); }
  }
}
while (Date.now() - t0 < maxMin * 60000 && state.student < 80 && !state.closed) {
  const quiet = await waitQuiet(150000);
  if (!quiet) { say('no tutor activity for 150 s'); break; }
  const since = turns.filter((x) => x.t > sinceStudent);
  const text = since.map((x) => x.sentences.join(' ')).join(' ');
  if (!text.trim()) {
    // dead page: the session ended server-side (pool / cap / auto-end) without a farewell we recognised
    if (sinceStudent && Date.now() - sinceStudent > 240000) { say('no tutor turn for 4 min after the last student turn — treating as ended'); state.closed = true; break; }
    await wait(3000); continue;
  }
  const d = decide(text);
  if (!d) { say('CLOSE detected — waiting for the farewell to finish'); break; }
  if (smoke && state.offers >= 1 && d.why.startsWith('offer') === false && /offer/.test(log.slice(-3).join(' '))) { say('SMOKE: first offer answered — stopping'); break; }
  let think = 2000 + rand() * 3000;
  if (V.slowTurn && !state.slowDone && state.student > 5 && !d.why.startsWith('repeat')) { state.slowDone = true; think = 48000; say('(slow turn: 48 s silence)'); }
  if (V.silentAfterRepeat && (d.why.startsWith('repeat') || d.why === 'scaffold')) { think = 20000; say('(20 s pause before the repeat)'); }
  if (V.finishEarly && !state.finishEarlyDone && state.student > 20 && /\?\s*$/.test(text.trim()) && !d.why.startsWith('offer')) { state.finishEarlyDone = true; d.text = 'We can finish it.'; d.why = 'finish early'; }
  if (V.wild && state.student > 1 && !d.why.startsWith('offer') && d.why !== 'menu' && d.why !== 'ready' && d.why !== 'difference' && rand() < V.wild) {
    const kinds = Object.keys(TANGENTS); const kind = kinds[Math.floor(rand() * kinds.length)];
    const pool = TANGENTS[kind]; d.text = pool[Math.floor(rand() * pool.length)]; d.why = `tangent:${kind}`;
  }
  if (state.bargeNext) { state.bargeNext = false; think = 0; say('(typed during playback)'); }
  await wait(think);
  try { await input.click({ timeout: 8000 }); await input.fill(d.text); await input.press('Enter'); }
  catch (e) { say(`input gone (${String(e.message).split('\n')[0].slice(0, 60)}) — treating as closed`); state.closed = true; break; }
  state.student += 1; sinceStudent = Date.now();
  say(`STUDENT(${d.why}) ${d.text}`);
  await wait(1500);
  if (smoke && state.offers >= 1) { say('SMOKE: first offer answered — stopping after the reply'); await waitQuiet(60000); break; }
}
if (state.closed) await wait(20000);
say('waiting 35 s for the autosave'); await wait(35000);
await browser.close();

// ── dump + checks ──
const dumpJs = path.join(outDir, `dump-${studentId}.js`);
fs.writeFileSync(dumpJs, `const d = db.tutorsessions.find({studentId:${JSON.stringify(studentId)}}).sort({createdAt:-1}).limit(1).toArray()[0];
if (!d) { print("NOT FOUND"); quit(1); }
const t0 = new Date(d.createdAt || d.startedAt).getTime();
const rel = (ts) => ts ? (Math.round((new Date(ts).getTime()-t0)/1000)+"s").padStart(6) : "     ?";
print(JSON.stringify({sessionId:d.sessionId, studentId:d.studentId, createdAt:d.createdAt, endedAt:d.endedAt, turns:(d.transcript||[]).length, events:(d.debugEvents||[]).length, wb:(d.whiteboardCommands||[]).length, lp:d.lessonProgress}));
print("=== TRANSCRIPT");
(d.transcript||[]).forEach((t,i)=>print(\`\${rel(t.timestamp)} \${String(i).padStart(3)} \${t.role}: \${t.text}\`));
print("=== WHITEBOARD");
(d.whiteboardCommands||[]).forEach((w,i)=>print(\`\${rel(w.timestamp)} \${String(i).padStart(3)} \${JSON.stringify(w).slice(0,400)}\`));
print("=== EVENTS");
(d.debugEvents||[]).forEach((e)=>print(\`\${rel(e.timestamp)} \${e.type}: \${String(e.message).slice(0,500)}\`));
`);
let dump = '';
try { dump = execFileSync('mongosh', ['--quiet', 'mongodb://127.0.0.1:2710/evelyn', '--file', dumpJs], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); } catch (e) { dump = `DUMP FAILED ${e.message}`; }
const dumpPath = path.join(outDir, `${studentId}.txt`);
fs.writeFileSync(dumpPath, dump);
fs.writeFileSync(path.join(outDir, `${studentId}.log`), log.join('\n'));
const minutes = (Date.now() - t0) / 60000;
console.log(`\n=== RUN ${studentId} variant=${variantName} ${minutes.toFixed(1)} min · est cost ≈ $${(minutes * 0.13).toFixed(2)} · dump ${dumpPath}`);
const result = runChecks(dump);
for (const r of result.lines) console.log(r);
console.log(`=== ${result.fails} FAIL · ${result.passes} PASS · ${result.warns} WARN`);
