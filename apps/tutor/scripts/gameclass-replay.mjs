// GameClass replay: a stand-in for GameClass's lesson page that drives the
// REAL tutor embed with the message order and timing recorded from their live
// sessions (debugEvents of embed-1792061278976 / -1792072934925, 10-15):
//   - frame prewarmed hidden; evelyn:lesson right after evelyn:ready
//   - "Ask Tutor": evelyn:start, then the first evelyn:video_state ~28 ms LATER
//   - the host answers video_command within ~50 ms and reports play/pause
//   - a moment arrives in the SAME tick as video_state paused at its position
//   - minimize / restore pairs (evelyn:pause / evelyn:resume) a few s apart
//   - question moments with 4 options; exit ticket at the end (not yet seen live)
// It checks what the student would get: the opening hook, the moment banner on
// screen, options and the recap reaching the tutor, the hand-back to the video.
//
// Scenarios: start (session opens at 0 s: hook, moments, options, exit ticket)
//            midlesson (opens at 50 s: normal opener with a question pinned,
//                       then a moment — its banner must replace the pin)
// Usage (from apps/tutor):  npm run live:gameclass-replay --  [start|midlesson|all] [prod|dev]
// prod = tutor.evelynlearning.com (costs a little and writes a session row under
// partner `academy`, student_id gc-replay-*); dev = localhost:3027.
// After the run it reads the session's stored debug events from prod Mongo
// (read-only, over ssh) — the same evidence used to check GameClass's sessions.
import { chromium } from 'playwright';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import { execFileSync } from 'node:child_process';

const which = process.argv[2] || 'all';
const target = process.argv[3] || 'prod';
const ORIGIN = target === 'prod' ? 'https://tutor.evelynlearning.com' : `http://localhost:${process.env.EMBED_PORT || 3027}`;
const envFile = target === 'prod' ? '../../.env.local.production' : '../../.env.local';
const secrets = JSON.parse(fs.readFileSync(envFile, 'utf8').match(/^PORTAL_PARTNER_SECRETS=(.*)$/m)[1]);
const b64 = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const sign = (payload, secret) => { const h = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' })); const p = b64(JSON.stringify(payload)); return `${h}.${p}.${b64(crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest())}`; };

const DURATION = 240;
// A neutral lesson (no client content): speech lines + visual notes, the shape GameClass sends.
const TIMELINE = [
  { start: 0, end: 6, text: 'Maya wants to start a lemonade stand, but she needs forty dollars for supplies.' },
  { start: 6, end: 12, text: 'She has two ways to get the money: borrow it from her uncle, or let her friend Leo put in money and share the profits.' },
  { start: 12, kind: 'visual', text: 'Visual 1 "Two Paths": left, Uncle Ray with a loan note "$40, pay back $44 in two months"; right, Leo with a sign "I pay $40, I get half the profit".' },
  { start: 14, end: 22, text: 'If she borrows, she has to pay back the forty dollars plus four dollars extra. That extra is called interest.' },
  { start: 22, end: 30, text: 'If Leo invests, she pays nothing back, but Leo owns half of the stand and gets half of every dollar of profit.' },
  { start: 30, end: 36, text: 'So which deal is better? It depends on how much the stand earns.' },
  { start: 36, kind: 'visual', text: 'Visual 2 "Loan vs Partner": a table — Loan: you keep 100% of profit, you owe $44 no matter what. Partner: you keep 50% of profit, you owe nothing if sales are bad.' },
  { start: 40, end: 50, text: 'In the first month Maya sells lemonade for one hundred dollars and her supplies cost forty.' },
  { start: 50, end: 60, text: 'That leaves sixty dollars of profit before paying anyone back.' },
  { start: 60, end: 72, text: 'With the loan, she pays forty-four and keeps sixteen. With Leo, she gives him thirty and keeps thirty.' },
  { start: 72, kind: 'visual', text: 'Visual 3 "Month One": Loan → Maya keeps $16. Partner → Maya keeps $30, Leo gets $30.' },
  { start: 75, end: 90, text: 'But the loan is paid off after that. Next month, every dollar of profit is hers.' },
  { start: 90, end: 110, text: 'With Leo, he keeps getting half of the profit every month, for as long as the stand runs.' },
  { start: 110, end: 120, text: 'So the loan costs more now, and the partner costs more later.' },
  { start: 120, kind: 'visual', text: 'Visual 4 "Check-in question": Which deal lets Maya keep all of her profit after she pays it back? A) the loan B) Leo\'s deal C) both D) neither.' },
  { start: 125, end: 150, text: 'There is also risk. If it rains all month and she sells nothing, she still owes her uncle forty-four dollars.' },
  { start: 150, end: 170, text: 'With Leo, a bad month means they both get nothing, and she owes nothing.' },
  { start: 170, end: 200, text: 'A loan is called debt. Giving someone a share of your business is called equity.' },
  { start: 200, kind: 'visual', text: 'Visual 5 "Debt vs Equity": Debt = borrow and pay back with interest, keep ownership. Equity = share ownership, share profits and risk.' },
  { start: 205, end: 235, text: 'Maya chooses the loan, because she expects a sunny summer and wants to keep the whole stand.' },
];

let grandPass = 0; let grandFail = 0; const notes = [];

async function scenario(name) {
  const now = Math.floor(Date.now() / 1000);
  const studentId = `gc-replay-${name}-${now}`;
  const startPos = name === 'start' ? 0 : 50;
  const payload = {
    partner_id: 'academy', student_id: studentId, student_name: 'Maya', subject: 'math', level: 'Grade 6',
    session_goal: 'homework-help', max_duration_minutes: 20, input_mode: 'voice', iat: now, exp: now + 7200,
    entry: 'in-flow', title: 'Borrow or Share?', topic: 'Debt vs equity',
    description: 'A lemonade stand compares a loan with interest to a partner who takes a share of the profit.',
    // GameClass's panel options (their partner defaults), forced via the token.
    features: { video_control: true, voice_mute: true, pace_chip: false, tools_low: true },
  };
  const token = sign(payload, secrets.academy);
  const embedUrl = `${ORIGIN}/tutor-portal/embed?token=${token}&prewarm=1`;

  const hostHtml = `<!doctype html><html><body style="margin:0;font-family:sans-serif">
<button id="ask">Ask Tutor</button>
<iframe id="tutor" src="${embedUrl}" allow="microphone; autoplay; clipboard-write" style="display:none;width:420px;height:760px;border:0"></iframe>
<script>
window.__msgs = []; window.__pos = ${startPos}; window.__playing = false; window.__playAt = 0;
const O = ${JSON.stringify(ORIGIN)};
window.post = (m) => document.getElementById('tutor').contentWindow.postMessage(m, O);
window.pos = () => window.__playing ? window.__pos + (Date.now() - window.__playAt) / 1000 : window.__pos;
window.setVideo = (state, p) => { window.__pos = p; window.__playing = state === 'playing'; window.__playAt = Date.now();
  window.post({ type: 'evelyn:video_state', state, position_seconds: Math.round(p * 100) / 100, duration_seconds: ${DURATION} }); };
window.addEventListener('message', (e) => {
  if (!e.data || typeof e.data.type !== 'string') return;
  window.__msgs.push({ t: Date.now(), ...e.data });
  if (e.data.type === 'evelyn:ready') window.post({ type: 'evelyn:lesson', timeline: ${JSON.stringify(TIMELINE)} });
  // GameClass answers a video command within ~50 ms.
  if (e.data.type === 'evelyn:video_command') setTimeout(() => window.setVideo(e.data.command === 'pause' ? 'paused' : 'playing', window.pos()), 50);
});
// GameClass order: start first, the first video report ~28 ms later.
document.getElementById('ask').onclick = () => { document.getElementById('tutor').style.display = 'block'; window.post({ type: 'evelyn:start' }); setTimeout(() => window.setVideo('paused', ${startPos}), 28); };
</script></body></html>`;
  const server = http.createServer((_, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(hostHtml); }).listen(3028);

  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ permissions: ['microphone'], viewport: { width: 900, height: 820 } });
  const brain = [];
  ctx.on('request', (r) => { if (r.url().includes('/api/tutor/brain/stream')) { let body = {}; try { body = JSON.parse(r.postData() || '{}'); } catch {} brain.push({ t: Date.now(), body, raw: r.postData() || '' }); } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:3028/');
  const frame = await (await page.waitForSelector('#tutor', { state: 'attached' })).contentFrame();

  let pass = 0; let fail = 0;
  const ok = (label, cond, detail = '') => { console.log(`${cond ? 'PASS' : 'FAIL'}  [${name}] ${label}${detail ? `  — ${detail}` : ''}`); cond ? pass++ : fail++; };
  const note = (s) => { console.log(`NOTE  [${name}] ${s}`); notes.push(`[${name}] ${s}`); };
  const wait = (ms) => page.waitForTimeout(ms);
  const msgs = () => page.evaluate(() => window.__msgs);
  const post = (m) => page.evaluate((mm) => window.post(mm), m);
  const setVideo = (state, p) => page.evaluate(([s, pp]) => window.setVideo(s, pp), [state, p]);
  async function until(fn, timeoutMs, stepMs = 200) { const end = Date.now() + timeoutMs; for (;;) { const v = await fn(); if (v) return v; if (Date.now() > end) return null; await wait(stepMs); } }
  const tutorPlays = (afterT) => until(async () => (await msgs()).find((m) => m.type === 'evelyn:video_command' && m.command === 'play' && m.t > afterT), 60000);
  // The banner: the kind label + the host title, on screen in the frame.
  const bannerShown = (label, title) => frame.evaluate(([l, t]) => {
    const els = Array.from(document.querySelectorAll('span')).filter((s) => s.textContent?.trim() === l);
    return els.some((s) => { const box = s.parentElement; const r = box?.getBoundingClientRect(); return !!box && box.textContent.includes(t) && !!r && r.width > 0 && r.height > 0; });
  }, [label, title]).catch(() => false);
  const brainWith = (needle, afterT) => brain.find((b) => b.t >= afterT && b.raw.includes(needle));
  // Moments arrive exactly like GameClass's: the pause report and the moment in one tick.
  const moment = (m) => page.evaluate((mm) => { window.setVideo('paused', mm.position_seconds); window.post({ type: 'evelyn:moment', ...mm }); }, m);
  const lastTutorText = () => frame.evaluate(() => Array.from(document.querySelectorAll('p')).map((e) => e.textContent?.trim()).filter((t) => t && t.length > 20).slice(-1)[0] || '').catch(() => '');

  // ── warm frame, then Ask Tutor ──
  const ready = await until(async () => (await msgs()).find((m) => m.type === 'evelyn:ready'), 60000);
  ok('evelyn:ready from the hidden prewarmed frame', !!ready);
  await wait(1500);
  const tAsk = Date.now();
  await page.click('#ask');
  const firstBrain = await until(async () => brain.find((b) => b.t >= tAsk), 30000);
  const opening = firstBrain?.body?.openingDirective || '';
  if (name === 'start') {
    ok('start hook: the opening turn carries LESSON START', opening.includes('LESSON START'), opening ? `"${opening.slice(0, 90)}…"` : 'no openingDirective');
    const openNow = String(firstBrain?.body?.lessonNow ?? '');
    ok('start hook: the opening turn knows where the video is', /paused at 0:00 of 4:00/.test(openNow), openNow.slice(0, 110));
    const played = await tutorPlays(tAsk);
    await wait(500);
    note(`opener said: "${(await lastTutorText()).slice(0, 220)}"`);
    ok('start hook: the tutor hands back to the video (video_command play)', !!played, played ? `${((played.t - tAsk) / 1000).toFixed(1)} s after Ask` : 'no play command in 60 s');
    if (!played) await setVideo('playing', 0);

    // ── teaching moment at 36 s ──
    await wait(4000);
    const tM1 = Date.now();
    await moment({ kind: 'teaching_moment', position_seconds: 36, title: 'Loan or partner: which costs more?', summary: 'Visual 2 "Loan vs Partner" table.', transcript: 'So which deal is better? It depends on how much the stand earns.' });
    const b1 = await until(() => bannerShown('Teaching moment', 'Loan or partner: which costs more?'), 8000);
    ok('banner: "Teaching moment" + title on screen', !!b1);
    const d1 = await until(async () => brainWith('a teaching moment: \\"Loan or partner', tM1) || brainWith('a teaching moment: "Loan or partner', tM1), 15000);
    ok('moment: directive reached the tutor', !!d1);
    await wait(6000);
    note(`banner still visible 6 s later (while the tutor answers): ${await bannerShown('Teaching moment', 'Loan or partner: which costs more?')}`);
    const p1 = await tutorPlays(tM1);
    note(`tutor on the moment: "${(await lastTutorText()).slice(0, 220)}"`);
    if (!p1) { note('tutor did not resume within 60 s after the teaching moment — resuming as the student would'); await setVideo('playing', 36); }
    else ok('banner: gone once the video plays again', !!(await until(async () => !(await bannerShown('Teaching moment', 'Loan or partner: which costs more?')), 3000)));

    // ── minimize / restore, like GameClass's panel ──
    await wait(2000);
    await post({ type: 'evelyn:pause', reason: 'minimized' }); await wait(4000); await post({ type: 'evelyn:resume' });
    await wait(1500);

    // ── question moment at 120 s with 4 options and a wrong answer ──
    const tM2 = Date.now();
    await moment({ kind: 'question', position_seconds: 120, title: 'Who keeps all the profit?', question: 'Which deal lets Maya keep all of her profit after she pays it back?', options: ['the loan', "Leo's deal", 'both', 'neither'], student_answer: "Leo's deal", correct_answer: 'the loan' });
    ok('banner: "Question" + title on screen', !!(await until(() => bannerShown('Question', 'Who keeps all the profit?'), 8000)));
    const d2 = await until(async () => brainWith('Answer options shown to the student', tM2), 15000);
    ok('options: all four options reach the tutor', !!d2 && ['the loan', "Leo's deal", 'both', 'neither'].every((o) => d2.raw.includes(o)));
    const p2 = await tutorPlays(tM2);
    note(`tutor on the question: "${(await lastTutorText()).slice(0, 220)}"`);
    if (!p2) { note('tutor did not resume within 60 s after the question — resuming as the student would'); await setVideo('playing', 120); }

    // ── exit ticket at 236 s ──
    await wait(3000);
    const tM3 = Date.now();
    await moment({ kind: 'exit_ticket', position_seconds: 236, title: 'Exit ticket: debt or equity?', question: 'Leo gets half the profit every month. Is that debt or equity?', options: ['debt', 'equity'] });
    ok('banner: "Exit ticket" + title on screen', !!(await until(() => bannerShown('Exit ticket', 'Exit ticket: debt or equity?'), 8000)));
    const d3 = await until(async () => brainWith('sum up the key takeaways', tM3), 15000);
    ok('exit ticket: recap directive reached the tutor', !!d3);
    const lessonNow = String(d3?.body?.lessonNow ?? '');
    ok('exit ticket: the tutor sees the whole lesson (start and end lines)', lessonNow.includes('lemonade stand') && lessonNow.includes('Maya chooses the loan'), `${lessonNow.length} chars`);
    ok('exit ticket: lesson length known and "nearly over"', /of 4:00/.test(lessonNow) && lessonNow.includes('The lesson is nearly over.'), lessonNow.slice(0, 110));
    await wait(20000);
    const recap = await lastTutorText();
    note(`recap said: "${recap.slice(0, 300)}"`);
    ok('exit ticket: the recap does not give away "equity" as the answer', !/\bLeo'?s? deal is equity\b|\bthe answer is equity\b/i.test(recap));
  } else {
    ok('mid-lesson start: no hook (video at 50 s)', !opening.includes('LESSON START'));
    await wait(12000);
    note(`opener said: "${(await lastTutorText()).slice(0, 220)}"`);
    // The student does not answer; the video moves on and a moment arrives
    // while the opener's question is still pinned (the 10-15 live case).
    await setVideo('playing', 50);
    await wait(5000);
    await moment({ kind: 'teaching_moment', position_seconds: 60, title: 'Month one: who keeps more?', summary: 'Visual 3 "Month One".' });
    ok('banner: shown even though the opener\'s question was pinned', !!(await until(() => bannerShown('Teaching moment', 'Month one: who keeps more?'), 8000)));
    await wait(15000);
  }

  await post({ type: 'evelyn:host_end', reason: 'finished' });
  await wait(6000);
  await browser.close(); server.close();

  // ── the stored session, read like a GameClass session ──
  if (target === 'prod') {
    const js = `const d=db.tutorsessions.findOne({studentId:{$regex:${JSON.stringify(studentId)}}}); if(!d){print('NO SESSION ROW')} else {print('session '+d.sessionId+' status='+d.status+' cost='+d.estimatedCost); for(const e of d.debugEvents||[]){ if(/^(host_start|lesson_start|moment_|qpin_set|qpin_drop|resume_lesson_fired|video_state|standby_enter)/.test(e.type)) print('  '+new Date(e.timestamp).toISOString().slice(11,23)+' '+e.type+' '+String(e.message).slice(0,110)); }}`;
    try {
      const tmp = '/tmp/gc-replay-read.js'; fs.writeFileSync(tmp, js);
      execFileSync('scp', ['-q', '/tmp/gc-replay-read.js', 'root@85.239.239.134:/tmp/gc-replay-read.js']);
      const out = execFileSync('ssh', ['root@85.239.239.134', 'mongosh "mongodb://127.0.0.1:2710/evelyn?directConnection=true" --quiet /tmp/gc-replay-read.js'], { encoding: 'utf8', timeout: 30000 });
      console.log(out);
      ok('stored: lesson_start_hook recorded', name !== 'start' || out.includes('lesson_start_hook'));
      ok('stored: moment_banner recorded', out.includes('moment_banner'));
    } catch (e) { note(`could not read the stored session: ${String(e).slice(0, 120)}`); }
  }
  grandPass += pass; grandFail += fail;
}

for (const s of which === 'all' ? ['start', 'midlesson'] : [which]) await scenario(s);
console.log(`\n${grandPass}/${grandPass + grandFail} passed${notes.length ? `\n--- notes\n${notes.join('\n')}` : ''}`);
process.exit(grandFail ? 1 : 0);
