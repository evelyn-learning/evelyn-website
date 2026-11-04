// Checks over a session dump (the text produced by trial-text-session.mjs:
// header JSON, === TRANSCRIPT, === WHITEBOARD, === EVENTS). Each check is a
// generic lesson-quality rule from the GDI runs 11–17; PASS/FAIL/WARN lines.
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set(['the', 'a', 'an', 'to', 'of', 'and', 'is', 'it', 'that', 'this', 'in', 'on', 'for', 'now', 'then', 'next', 'let', 's', 'lets', 'we', 'you', 'i', 'so']);
const content = (s) => norm(s).split(' ').filter((w) => w && !STOP.has(w));
const jaccard = (a, b) => { const A = new Set(a), B = new Set(b); const inter = [...A].filter((x) => B.has(x)).length; return inter / (new Set([...A, ...B]).size || 1); };

// Tangents the "wild" learner throws in (exported so the checks can recognise them in a dump).
export const TANGENTS = {
  offtopic: ['Do you like sushi?', "Let's talk about football instead.", 'Tell me a joke.', 'What is the weather like in Nagoya today?', 'My cat was sick this morning.', 'Can we do some math instead?', 'What do you think about the Prime Minister?'],
  meta: ['Can you repeat that, please?', 'Slower, please.', "What does 'responsibility' mean?", 'Sorry, I did not understand the question.', 'Are you a robot?', 'How much longer is this lesson?', 'Can you say that in Japanese?'],
  japanese: ['すみません、わかりません。', 'もう一度お願いします。', '今日は疲れています。'],
  odd: ['Three.', 'Yes no maybe.', 'Hmm.', 'I I I think think the the project.', 'BANANA.'],
  ramble: ['Well, actually, before I answer that, I should say that my company has many departments and my department is the biggest one and we have many customers in Japan and also some in Korea and Taiwan and last year we also started selling in Vietnam, which was very interesting for me because I had never been to Vietnam before.'],
};
export const TANGENT_SET = new Set(Object.values(TANGENTS).flat());

export function parseDump(dump) {
  const lines = dump.split('\n');
  const header = (() => { try { return JSON.parse(lines[0]); } catch { return null; } })();
  const iT = lines.indexOf('=== TRANSCRIPT'), iW = lines.indexOf('=== WHITEBOARD'), iE = lines.indexOf('=== EVENTS');
  const rel = (l) => Number((l.match(/^\s*(\d+)s/) ?? [])[1] ?? -1);
  const transcript = lines.slice(iT + 1, iW).map((l) => { const m = l.match(/^\s*(\d+)s\s+(\d+)\s+(tutor|student):\s?(.*)$/); return m ? { t: +m[1], i: +m[2], role: m[3], text: m[4] } : null; }).filter(Boolean);
  const wb = lines.slice(iW + 1, iE).map((l) => { const m = l.match(/^\s*(\d+)s\s+(\d+)\s+(\{.*)$/); if (!m) return null; let j = null; try { j = JSON.parse(m[3]); } catch { try { j = JSON.parse(m[3].replace(/,"timestamp".*$/, '}')); } catch { j = { action: (m[3].match(/"action":"(\w+)"/) ?? [])[1], raw: m[3] }; } } return { t: +m[1], i: +m[2], ...j }; }).filter(Boolean);
  const events = lines.slice(iE + 1).map((l) => { const m = l.match(/^\s*(\d+)s\s+([a-z0-9_]+):\s?(.*)$/i); return m ? { t: +m[1], type: m[2], msg: m[3] } : null; }).filter(Boolean);
  return { header, transcript, wb, events };
}

export function runChecks(dump) {
  const out = []; let passes = 0, fails = 0, warns = 0;
  const ok = (label, cond, detail = '') => { out.push(`${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`); cond ? passes++ : fails++; };
  const warn = (label, detail = '') => { out.push(`WARN  ${label}${detail ? ` — ${detail}` : ''}`); warns++; };
  const info = (label) => out.push(`INFO  ${label}`);
  if (/^NOT FOUND|^DUMP FAILED/.test(dump)) { ok('session dump found', false, dump.slice(0, 120)); return { lines: out, passes, fails, warns }; }
  const { header, transcript, wb, events } = parseDump(dump);
  const tutor = transcript.filter((x) => x.role === 'tutor');
  const student = transcript.filter((x) => x.role === 'student');
  const ev = (type) => events.filter((e) => e.type === type);
  info(`turns ${transcript.length} (tutor ${tutor.length}, student ${student.length}) · events ${events.length} · wb ${wb.length} · completed ${JSON.stringify(header?.lp?.completedSegmentIds ?? [])} · current ${header?.lp?.currentSegmentId}`);

  // 1. pages: every completed segment after the overview has its own page, and that page's first item is a card
  const pages = []; let cur = null;
  for (const w of wb) {
    if (w.action === 'newPage') { cur = { title: w.data?.title ?? w.title ?? '', items: [], t: w.t }; pages.push(cur); continue; }
    if (!cur) continue;
    if (w.action === 'removeItems') { const ids = new Set(w.data?.ids ?? w.ids ?? []); for (const p of pages) p.items = p.items.filter((it) => !ids.has(it.data?.id ?? it.id)); continue; }
    if (['showProblem', 'showSentence', 'handwrite', 'showTable', 'showText', 'showSteps'].includes(w.action)) cur.items.push(w);
  }
  const partPages = pages.filter((p) => /^Part \d/.test(p.title));
  const completed = (header?.lp?.completedSegmentIds ?? []).filter((s) => s !== 'overview');
  ok('one page per part reached', partPages.length >= completed.length, `${partPages.length} part pages for ${completed.length} completed parts (+current)`);
  for (const p of partPages) {
    if (/Summary|まとめ/.test(p.title)) continue; // the recap part has no authored card
    const first = p.items[0];
    ok(`page "${p.title}" opens with its card`, !!first && first.action === 'showProblem', first ? `${first.action} first` : 'EMPTY page');
  }
  const emptyPages = pages.filter((p) => p.items.length === 0 && /^Part \d/.test(p.title));
  ok('no empty part page', emptyPages.length === 0, emptyPages.map((p) => p.title).join('; '));
  const dupTitles = partPages.map((p) => p.title).filter((t, i, a) => a.indexOf(t) !== i);
  ok('no part page opened twice', dupTitles.length === 0, dupTitles.join('; '));

  // 2. offers: every offer part that completed was offered aloud; no unmade offers; "one more" never re-uses the board card
  const unmade = ev('fixed_script_offer_unmade');
  const rescued = unmade.filter((u) => ev('fixed_script_offer_spoken').some((s) => /engine fallback/.test(s.msg) && s.t >= u.t && s.t <= u.t + 5));
  ok('no fixed_script_offer_unmade', unmade.length === rescued.length, unmade.filter((u) => !rescued.includes(u)).map((e) => e.msg).join(' | '));
  if (rescued.length) warn('offer unmade by the brain, spoken by the engine fallback', rescued.map((e) => `${e.t}s`).join(' '));
  const offerSpoken = ev('fixed_script_offer_spoken').map((e) => e.msg);
  const offerPlanted = ev('fixed_script_offer_planted').map((e) => e.msg);
  // a planted offer the student pre-empted with a move-on order (typed advance) needs no spoken offer
  const preempted = ev('fixed_script_offer_planted').filter((p) => ev('typed_advance_app').some((a) => a.t >= p.t && a.t <= p.t + 90) && !offerSpoken.some((s) => s.includes((p.msg.match(/"([^"]+)"/) ?? [])[1] ?? '\u0000'))).length;
  ok('every planted offer was spoken', offerPlanted.length === 0 || offerSpoken.length + preempted >= offerPlanted.length, `planted ${offerPlanted.length}, spoken ${offerSpoken.length}, pre-empted by a move-on order ${preempted}`);
  for (let i = 0; i < student.length; i++) {
    const s = student[i];
    if (!/^\s*(?:one more|another one|more practice)/i.test(s.text)) continue;
    const reply = tutor.find((x) => x.i > s.i);
    if (reply) {
      const newCard = wb.some((w) => ['handwrite', 'showProblem', 'showSentence'].includes(w.action) && w.t >= reply.t - 1 && w.t <= reply.t + 8);
      ok(`"one more" at ${s.t}s got a new item`, newCard || !/question on the board|card on the board|look at the board/i.test(reply.text), reply.text.slice(0, 120));
    }
  }
  // a silent advance: the part advanced while a planted offer had never been spoken
  const silentAdvance = ev('fixed_script_auto_advance').filter((e) => !/reason=announced/.test(e.msg));
  info(`auto advances: ${silentAdvance.length} (${silentAdvance.map((e) => e.msg.replace(/"/g, '')).join('; ').slice(0, 300)})`);

  // 3. narrated notes / third-person learner / plan clauses in spoken text
  const NARR = /\[(?:runtime|system) note|^(?:gently|briefly|then|now),? (?:point|model|name|acknowledge|accept|praise)\b|\bmodel the pattern\b|\band ask for one\b|^let me (?:ask|say) (?:that |it )?again simply|\bthe student(?:'s)?\b|\bthe learner(?:'s)?\b|\bI gave them\b|\bthe correct response\b|\bso I should\b|\bis only a repeat\b|\bbring (?:that|it) back\b|\brepeat of the sentence\b|\bruntime\b|\bvalidator\b|\bthe board already\b|\bthis note\b|\bnotes above\b|\binstructions for me\b|\bcarry on with the lesson\b|\banswer your last point first\b|\blesson isn'?t over yet\b|\bin japanese, the (?:word|phrase|sentence) is\b|\bfinally said\b|\bphrase large\b|\bnote below\b|\bmeasured result\b|\bdidn'?t come through\b|\bi'?ll go with\b|\b(?:was|has been|is) already answered\b|\balready answered (?:earlier|before)\b|\bhere'?s the (?:full |whole |complete )?sentence on the board\b|\btake a moment to look at the (?:sentence|board|card)\b|\b(?:let me|i'?ll) close this part\b/i;
  const narr = tutor.filter((x) => NARR.test(x.text));
  ok('no narrated notes in tutor speech', narr.length === 0, narr.map((x) => `${x.t}s "${x.text.slice(0, 100)}"`).join(' | '));

  // 4. adjacent near-duplicate sentences in one tutor turn
  const dupSent = [];
  for (const x of tutor) {
    const ss = x.text.split(/(?<=[.?!。？！])\s+/).filter((s) => content(s).length >= 3);
    for (let k = 1; k < ss.length; k++) if (jaccard(content(ss[k - 1]), content(ss[k])) >= 0.75) dupSent.push(`${x.t}s "${ss[k - 1]}" / "${ss[k]}"`);
  }
  ok('no adjacent duplicate sentences', dupSent.length === 0, dupSent.join(' | ').slice(0, 300));

  // 5. duplicate sentence cards on one page
  const dupCards = [];
  for (const p of pages) {
    const seen = new Map();
    for (const it of p.items) if (it.action === 'showSentence') { const k = norm(it.data?.sentence ?? ''); if (seen.has(k)) dupCards.push(`${p.title}: "${it.data?.sentence}"`); seen.set(k, 1); }
  }
  ok('no duplicate sentence card on a page', dupCards.length === 0, dupCards.join(' | ').slice(0, 300));

  // 6. Q-pin gists are real questions
  const gistOf = (msg) => { const m = msg.match(/"([\s\S]*)"\s*$/) ?? msg.match(/"([^"]*)/); return m ? m[1] : ''; };
  const badPins = ev('qpin_set').concat(ev('qpin_set_verbatim'), ev('qpin_set_ask')).map((e) => gistOf(e.msg)).filter((g) => g !== undefined && (/^\s*["“]?\s*$/.test(g) || content(g).length < 2));
  ok('no stray / empty Q-pin', badPins.length === 0, badPins.map((g) => `"${g}"`).join(' | '));

  // 6b. Q-pin gists are grounded in the tutor's turn (no invented examples)
  const ungrounded = [];
  for (const e of ev('qpin_set')) {
    const g = gistOf(e.msg); if (content(g).length < 4) continue;
    const turn = [...tutor].reverse().find((x) => x.t <= e.t + 1);
    if (!turn) continue;
    const tt = new Set(content(turn.text)); const cg = content(g); const hit = cg.filter((w) => tt.has(w)).length / cg.length;
    if (hit < 0.4) ungrounded.push(`${e.t}s "${g}" (${Math.round(hit * 100)}%)`);
  }
  ok('Q-pin gists grounded in the turn', ungrounded.length === 0, ungrounded.join(' | ').slice(0, 300));

  // 7. after the close: no further tutor question
  const closed = ev('lesson_closed')[0];
  if (closed) {
    const after = tutor.filter((x) => x.t > closed.t + 2 && /\?\s*$/.test(x.text));
    ok('no tutor question after the close', after.length === 0, after.map((x) => `${x.t}s "${x.text.slice(-80)}"`).join(' | '));
  } else warn('lesson did not close', `current ${header?.lp?.currentSegmentId}`);

  // 8. level-check cards in first person
  const lc = ev('sentence_board_auto').filter((e) => /source=levelcheck/.test(e.msg)).map((e) => (e.msg.match(/"([^"]+)"/) ?? [])[1] ?? '');
  const thirdPerson = lc.filter((s) => /^(?:you|your)\b/i.test(s));
  ok('level-check cards are in first person', thirdPerson.length === 0, thirdPerson.join(' | '));
  info(`level-check cards: ${lc.length}`);

  // 9. every student turn got a tutor reply within 60 s
  const stalls = [];
  for (const s of student) { const r = tutor.find((x) => x.i > s.i); if (!r) { if (!closed) stalls.push(`${s.t}s no reply`); } else if (r.t - s.t > 60) stalls.push(`${s.t}s → ${r.t}s (${r.t - s.t}s)`); }
  ok('every student turn answered within 60 s', stalls.length === 0, stalls.join(' | '));

  // 10. run 18 (voice): silent continue after a repeat / listen ask — the tutor spoke over the student's turn
  const REPEAT_ASK = /\b(?:repeat after me|listen,? then repeat|say (?:it|that|the (?:full |whole )?sentence)|try saying|say (?:it )?(?:once more|again)|let'?s say the)\b/i;
  const lastSentences = (s, n) => s.split(/(?<=[.?!。？！])\s+/).filter(Boolean).slice(-n).join(' ');
  const silentCont = [];
  for (const e of ev('fixed_script_noask_continue')) {
    const prev = [...tutor].reverse().find((x) => x.t < e.t);
    if (prev && REPEAT_ASK.test(lastSentences(prev.text, 2))) silentCont.push(`${e.t}s after "${lastSentences(prev.text, 1).slice(0, 80)}"`);
  }
  ok('no silent continue after a repeat ask', silentCont.length === 0, silentCont.join(' | '));

  // 10b. run 18: the pronunciation target armed matches the ask (a sentence ask never arms a single word; "repeat after me: X" arms X)
  const armBad = [];
  for (const e of events.filter((x) => x.type === 'pronunciation_auto_armed' || x.type === 'pronunciation_armed')) {
    const target = (e.msg.match(/"([^"]+)"/) ?? [])[1] ?? ''; if (!target) continue;
    const turn = [...tutor].reverse().find((x) => x.t <= e.t + 1); if (!turn) continue;
    const tail = lastSentences(turn.text, 3);
    const words = content(target).length;
    if (/\b(?:one|a|this|the) (?:complete |full |whole )?sentence\b/i.test(tail) && REPEAT_ASK.test(tail) && words <= 1) armBad.push(`${e.t}s word "${target}" for a sentence ask`);
    const colon = tail.match(/repeat after me:\s*([^.?!]+)/i);
    if (colon && norm(colon[1]) !== norm(target) && !norm(colon[1]).startsWith(norm(target))) armBad.push(`${e.t}s armed "${target}" but asked "${colon[1].trim()}"`);
  }
  ok('pronunciation arm matches the ask', armBad.length === 0, armBad.join(' | ').slice(0, 300));
  const notAttempted = ev('pronunciation_unavailable').filter((e) => /not_attempted/.test(e.msg)).length;
  info(`pronunciation: armed ${ev('pronunciation_armed').length} · clips ${ev('pronunciation_clip_sent').length} · not_attempted ${notAttempted} (silence bot: expected)`);

  // 10c. run 18: every part reached got its entry note (the pronunciation menu was never spoken)
  const noteSegs = new Set(ev('fixed_script_note_delivered').concat(ev('fixed_script_entry_note_planted')).map((e) => (e.msg.match(/(?:segment )?"([^"]+)"/) ?? [])[1]).filter(Boolean));
  const reached = (header?.lp?.completedSegmentIds ?? []).concat(header?.lp?.currentSegmentId ? [header.lp.currentSegmentId] : []).filter((s) => s && s !== 'overview');
  const pageTitles = partPages.map((p) => norm(p.title));
  const segHasPage = (seg) => { const w = norm(seg.replace(/-/g, ' ')).split(' ')[0]; return pageTitles.some((t) => t.includes(w)) || seg === 'summary'; };
  // a skipped part (carry-over level check) is listed as completed but never had a page — no note expected
  const noNote = reached.filter((s) => !noteSegs.has(s) && segHasPage(s));
  ok('every part reached got its entry note', noNote.length === 0, noNote.join(', '));

  // 10d. run 18: no offer re-planted (the spoken offer went unrecognised) and no probe loop (three tutor questions on one point, each answered)
  const replanted = ev('fixed_script_offer_replanted').filter((r) => !ev('typed_advance_app').some((a) => Math.abs(a.t - r.t) <= 5) && !ev('fixed_script_offer_spoken').some((s) => s.t >= r.t && s.t <= r.t + 6)); // a re-plant the move-on order made moot, or that the next turn spoke, is fine
  ok('no fixed_script_offer_replanted', replanted.length === 0, replanted.map((e) => `${e.t}s`).join(' '));
  const FRAME = new Set(['can', 'could', 'would', 'will', 'do', 'does', 'did', 'tell', 'me', 'say', 'one', 'more', 'what', 'which', 'how', 'who', 'when', 'where', 'why', 'about', 'your', 'using', 'starting', 'with', 'please', 'or', 'was', 'were', 'are', 'be', 'there', 'at', 'from', 'yes', 'no', 'just', 'like', 'sentence', 'example']);
  const stem = (w) => w.replace(/(?:ions?|ing|ed|es|est|er|ly|s|e)$/u, '');
  const qOf = (x) => { const ss = x.text.split(/(?<=[.?!。？！])\s+/).filter((s) => /\?\s*$/.test(s)); if (!ss.length) return null; const ws = content(ss[ss.length - 1]).filter((w) => !FRAME.has(w)).map(stem).filter((w) => w.length > 2); return ws.length >= 2 ? ws : null; };
  const probeLoops = [];
  for (let k = 2; k < tutor.length; k++) {
    const a = qOf(tutor[k - 2]), b = qOf(tutor[k - 1]), c = qOf(tutor[k]);
    if (!a || !b || !c) continue;
    const answered = (p, q) => student.some((s) => s.i > p.i && s.i < q.i && content(s.text).length >= 2 && !/\?\s*$/.test(s.text) && !TANGENT_SET.has(s.text.trim()));
    if (!answered(tutor[k - 2], tutor[k - 1]) || !answered(tutor[k - 1], tutor[k])) continue; // a re-ask after a tangent is right, not a loop
    if (jaccard(a, b) >= 0.5 && jaccard(b, c) >= 0.5) probeLoops.push(`${tutor[k - 2].t}s→${tutor[k].t}s "${c.join(' ').slice(0, 60)}"`);
  }
  ok('no three-question probe loop', probeLoops.length === 0, probeLoops.join(' | ').slice(0, 300));

  // 10e. run 18: the close note is obeyed within two tutor turns, and no answered summary question is re-asked
  const closeReq = ev('fixed_script_close_requested')[0];
  if (closeReq) {
    const closeCall = events.find((e) => e.t >= closeReq.t && /closeSessionNotes|close_session_notes/.test(`${e.type} ${e.msg}`));
    const between = tutor.filter((x) => x.t > closeReq.t && (!closeCall || x.t < closeCall.t - 2)); // the turn that carries the close call is the wrap itself
    ok('close note obeyed within two tutor turns', between.length <= 2, `${between.length} tutor turns after the close note${closeCall ? '' : ' and no close call'}`);
    const sumStart = ev('fixed_script_note_delivered').find((e) => /segment "summary"/.test(e.msg))?.t ?? closeReq.t - 120;
    const asked = [];
    const reAsked = [];
    for (const x of tutor.filter((y) => y.t >= sumStart)) {
      const q = qOf(x); if (!q || q.length < 4) continue;
      const prior = asked.find((p) => jaccard(p.q, q) >= 0.6 && student.some((s) => s.i > p.i && s.i < x.i && content(s.text).length >= 3));
      if (prior) reAsked.push(`${prior.t}s→${x.t}s "${q.join(' ').slice(0, 60)}"`);
      asked.push({ q, i: x.i, t: x.t });
    }
    ok('no answered summary question re-asked', reAsked.length === 0, reAsked.join(' | ').slice(0, 300));
  }

  // 10f. voice run 19 (embed-1793676043999): classes the text checks missed
  // a "(rendered: …)" entry is silent only when no spoken tutor entry sits within 2 s before it (the silent-turn fallback logs its line as a separate entry)
  const silentTurns = tutor.filter((x, i) => (/^\(rendered: [a-z_]+\)\s*$/i.test(x.text.trim()) || x.text.trim() === '') && !tutor.some((y) => y !== x && y.t >= x.t - 2 && y.t <= x.t && !/^\(rendered:/.test(y.text.trim()) && y.text.trim() !== ''));
  ok('no silent tutor turn (all sentences dropped)', silentTurns.length === 0, silentTurns.map((x) => `${x.t}s`).join(' '));
  const prevPage = ev('student_card_on_previous_page');
  ok('no student card routed to a previous page after an advance', prevPage.length === 0, prevPage.map((e) => `${e.t}s`).join(' '));
  const readinessAsks = ev('readiness_ask_note_planted').filter((e) => e.t > 60); // the authored opener's own "Are you ready?" registers at ~2 s — that one is the plan's
  ok('no readiness ask on a fixed-script plan', readinessAsks.length === 0, readinessAsks.map((e) => `${e.t}s`).join(' '));
  const abandoned = [];
  for (const a of ev('fixed_script_auto_advance')) {
    const turn = [...tutor].reverse().find((x) => x.t <= a.t + 1 && x.t >= a.t - 12);
    const cont = ev('fixed_script_noask_continue').find((c) => c.t >= a.t && c.t <= a.t + 12);
    if (turn && /\?\s*$/.test(turn.text.trim()) && cont && !student.some((s) => s.t > turn.t && s.t < cont.t)) abandoned.push(`${a.t}s "${turn.text.slice(-60)}"`);
  }
  ok('auto-advance never abandons an open question', abandoned.length === 0, abandoned.join(' | ').slice(0, 300));
  const ackCards = wb.filter((w) => w.action === 'showSentence' && /^(?:okay|ok|sure|alright|great|good|right|now|next|let'?s)\b/i.test(String(w.data?.sentence ?? '')) && content(String(w.data?.sentence ?? '')).length <= 5);
  ok('no acknowledgement line carded', ackCards.length === 0, ackCards.map((w) => `${w.t}s "${w.data?.sentence}"`).join(' | ').slice(0, 300));
  const crossDup = [];
  for (let k = 1; k < tutor.length; k++) {
    if (student.some((s) => s.i > tutor[k - 1].i && s.i < tutor[k].i)) continue;
    const a = tutor[k - 1].text.split(/(?<=[.?!。？！])\s+/).filter(Boolean).pop() ?? '';
    const b = tutor[k].text.split(/(?<=[.?!。？！])\s+/).filter(Boolean)[0] ?? '';
    if (content(a).length >= 3 && jaccard(content(a), content(b)) >= 0.6) crossDup.push(`${tutor[k - 1].t}s→${tutor[k].t}s "${a.slice(0, 50)}"`);
  }
  ok('no near-duplicate sentence across two consecutive tutor turns', crossDup.length === 0, crossDup.join(' | ').slice(0, 300));
  const summaryPage = pages.find((p) => /Summary|まとめ/.test(p.title));
  if (summaryPage) ok('summary page has its recap card', summaryPage.items.some((it) => it.action === 'showProblem'), summaryPage.items.length ? `${summaryPage.items.length} items, no showProblem` : 'EMPTY');
  const jaOnly = tutor.filter((x, idx) => { const prevS = [...student].reverse().find((s) => s.i < x.i); return prevS && !/[\u3040-\u30FF\u4E00-\u9FFF]/.test(prevS.text) && /[\u3040-\u30FF\u4E00-\u9FFF]/.test(x.text) && !/[A-Za-z]{3,}/.test(x.text.replace(/\(rendered[^)]*\)/, '')); });
  ok('no Japanese-only turn after an English student turn', jaOnly.length === 0, jaOnly.map((x) => `${x.t}s`).join(' '));

  // 10g. wild learner: after a tangent the tutor stays in bounds — answers briefly (≤ 3 sentences on it), returns to the lesson with a question,
  //      and nothing advances / changes page because of the tangent
  const tangents = student.filter((s) => TANGENT_SET.has(s.text.trim()));
  if (tangents.length) {
    const outOfBounds = [];
    const closedAt = ev('lesson_closed')[0]?.t ?? Infinity;
    for (const tg of tangents) {
      if (tg.t > closedAt) continue; // after the farewell no return question is owed
      const reply = tutor.find((x) => x.i > tg.i); if (!reply) continue;
      const ss = reply.text.split(/(?<=[.?!。？！])\s+/).filter(Boolean);
      const asks = ss.some((x) => /[?？]\s*$/.test(x) || /\b(?:please|try|tell me|say|answer)\b/i.test(x) || /(?:てください|ますか|でしょうか|ましょう)[。」]?\s*$/.test(x));
      const inSummary = (() => { const sumNote = ev('fixed_script_note_delivered').find((e) => /segment "summary"/.test(e.msg)); const sumPage = pages.find((p) => /Summary|まとめ/.test(p.title)); const t0 = Math.min(sumNote?.t ?? Infinity, sumPage?.t ?? Infinity); return reply.t >= t0; })();
      if ((ss.length > 6 && !inSummary) || !asks) outOfBounds.push(`${tg.t}s "${tg.text.slice(0, 30)}" → ${ss.length} sentences${asks ? '' : ', no return question'}`);
      // a turn-cap auto-advance that happens to coincide is not "caused"; only the student-driven paths are
      const adv = events.find((e) => /^(?:typed_advance_app|fixed_script_menu_cap|student_jump)/.test(e.type) && e.t >= tg.t && e.t <= tg.t + 6 && !/move on|next part/i.test(tg.text));
      if (adv) outOfBounds.push(`${tg.t}s tangent caused an advance (${adv.type})`);
      const closed = ev('lesson_closed').find((e) => e.t >= tg.t && e.t <= tg.t + 10);
      if (closed) outOfBounds.push(`${tg.t}s tangent closed the lesson`);
    }
    ok(`tangents (${tangents.length}) kept in bounds`, outOfBounds.length === 0, outOfBounds.join(' | ').slice(0, 400));
    const mathAnswered = tangents.filter((tg) => /math/i.test(tg.text)).some((tg) => { const r = tutor.find((x) => x.i > tg.i); return r && /\d+\s*[+×x*\-−]\s*\d+|equation|algebra/i.test(r.text); });
    ok('no off-subject teaching after a tangent', !mathAnswered);
  }
  // 10h. page order: part pages appear in plan order and each advance paints its page within 20 s
  const partNums = partPages.map((p) => Number((p.title.match(/Part (\d+)/) ?? [])[1])).filter(Boolean);
  ok('part pages in plan order', partNums.every((n, i) => i === 0 || n > partNums[i - 1]), partNums.join(','));
  const latePages = [];
  for (const a of ev('fixed_script_auto_advance').concat(ev('typed_advance_app'))) {
    const to = (a.msg.match(/→ "([^"]+)"/) ?? a.msg.match(/→ ([a-z-]+)/) ?? [])[1]; if (!to || to === 'summary') continue;
    // the page is deferred until the first brain turn of the new part flushes (by design) — it must exist before the NEXT advance, and within 120 s
    const nextAdv = ev('fixed_script_auto_advance').concat(ev('typed_advance_app')).map((e) => e.t).filter((t) => t > a.t + 2).sort((x, y) => x - y)[0] ?? Infinity;
    const pg = pages.find((p) => p.t >= a.t - 2 && p.t <= Math.min(a.t + 120, nextAdv + 2) && /^Part \d/.test(p.title));
    if (!pg) latePages.push(`${a.t}s → ${to}`);
  }
  ok('every advance painted its page before the next one', latePages.length === 0, latePages.join(' | '));

  // 10i. voice run 21 (embed-1793719782028, Praveen): visual / flow classes the text checks missed (handoff §4)
  const SENT_SPLIT = /(?<=[.?!。？！])\s+/;
  const sentencesOf = (t) => t.split(SENT_SPLIT).map((x) => x.trim()).filter(Boolean);
  const cardText = (w) => String(w.data?.sentence ?? '');
  // B. the student's readiness answer / acknowledgement is never a card
  const READINESS = /^(?:(?:yes|yeah|yep|ok|okay|sure|alright|all right|fine|はい|ええ|うん)[,.!、。]?\s*)*(?:i(?:'m| am) ready|let'?s (?:start|begin|go|do it)|ready|(?:yes|yeah|yep|ok|okay|sure|alright|はい|わかりました|大丈夫です)|please)?[.!。]?$/i;
  const readinessCards = wb.filter((w) => w.action === 'showSentence' && content(cardText(w)).length <= 4 && READINESS.test(cardText(w).trim()) && student.some((s) => Math.abs(s.t - w.t) <= 8 && norm(s.text) === norm(cardText(w))));
  ok('no student readiness answer / acknowledgement carded', readinessCards.length === 0, readinessCards.map((w) => `${w.t}s "${cardText(w)}"`).join(' | ').slice(0, 300));
  // C. two consecutive sentences in one turn that both announce the same part
  const partNames = (() => {
    const tbl = wb.find((w) => w.action === 'showTable' && Array.isArray(w.data?.rows));
    const fromTable = tbl ? tbl.data.rows.map((r) => String(r[1] ?? '')).filter(Boolean) : [];
    const fromPages = partPages.map((p) => (p.title.split('·')[1] ?? '').trim()).filter(Boolean);
    return [...new Set([...fromTable, ...fromPages].map((n) => norm(n)).filter((n) => n && !/^(?:overview|summary|level check)$/.test(n)))];
  })();
  const ANNOUNCE = /\b(?:move (?:on )?to|moving (?:on )?to|go on to|turn to|let'?s (?:practi[sc]e|do|start|try|look at|work on|go to)|we'?ll (?:practi[sc]e|do|start|work on|look at|move)|we will (?:practi[sc]e|do|start)|next,? (?:we|let)|time for|now for|on to)\b/i;
  const dupAnnounce = [];
  for (const x of tutor) {
    const ss = sentencesOf(x.text);
    for (let k = 1; k < ss.length; k++) {
      const a = norm(ss[k - 1]), b = norm(ss[k]);
      const shared = partNames.find((n) => a.includes(n) && b.includes(n));
      if (shared && ANNOUNCE.test(ss[k - 1]) && ANNOUNCE.test(ss[k]) && !/[?？]/.test(ss[k - 1] + ss[k])) dupAnnounce.push(`${x.t}s "${ss[k - 1].slice(0, 50)}" / "${ss[k].slice(0, 50)}"`);
    }
  }
  ok('no part announced twice in consecutive sentences', dupAnnounce.length === 0, dupAnnounce.join(' | ').slice(0, 300));
  // D. an answered question re-asked in ANY part (10e covers the summary; this covers everything before it)
  {
    const sumT = ev('fixed_script_note_delivered').find((e) => /segment "summary"/.test(e.msg))?.t ?? ev('fixed_script_entry_note_planted').find((e) => /"summary"/.test(e.msg))?.t ?? Infinity;
    // the re-ask names the board question ("back to the question on the board: …"), the earlier ask got a substantive answer, and the tutor's reply to that answer affirmed it
    const BOARD_REASK = /\b(?:back to|again|once more|return to)?[^.?!]*\b(?:question on the board|board question|question from the board)\b/i;
    const AFFIRM = /\b(?:correct|right|good|great|nice|exactly|perfect|yes|well done|natural version)\b|そうですね|正しい|いいですね/i;
    const asked = []; const reAsked = [];
    for (const x of tutor.filter((y) => y.t < sumT)) {
      const q = qOf(x); if (!q || q.length < 4) { continue; }
      const prior = BOARD_REASK.test(x.text) ? asked.find((p) => jaccard(p.q, q) >= 0.6 && student.some((s) => s.i > p.i && s.i < x.i && content(s.text).length >= 3 && !/\?\s*$/.test(s.text) && !TANGENT_SET.has(s.text.trim()) && AFFIRM.test(tutor.find((r) => r.i > s.i)?.text ?? ''))) : null;
      if (prior) reAsked.push(`${prior.t}s→${x.t}s "${q.join(' ').slice(0, 60)}"`);
      asked.push({ q, i: x.i, t: x.t });
    }
    const engineSaw = ev('correct_retry_note_planted').filter((e) => /earlier answered question re-asked/.test(e.msg) && tutor.some((x) => Math.abs(x.t - e.t) <= 2 && /\?\s*$/.test(x.text.trim())));
    for (const e of engineSaw) if (!reAsked.some((r) => r.includes(`→${e.t - 1}s`) || r.includes(`→${e.t}s`) || r.includes(`→${e.t + 1}s`))) reAsked.push(`${e.t}s engine detected the re-ask but the question still spoke`);
    ok('no answered board question re-asked before the summary', reAsked.length === 0, reAsked.join(' | ').slice(0, 300));
  }
  // E. "<Persona> here:" lead in spoken text (the bare "Ryota here." sentence is already dropped; the lead form survived)
  const persona = (ev('persona_resolved')[0]?.msg.match(/teacher=([a-z]+)/i) ?? [])[1] ?? '';
  const LEAD = persona ? new RegExp(`(?:^|[.!?。」]\\s*)${persona} here[:,.]`, 'i') : /(?:^|[.!?。」]\s*)[A-Z][a-z]+ here:/;
  const leads = tutor.filter((x) => LEAD.test(x.text));
  ok('no "<persona> here:" lead in tutor speech', leads.length === 0, leads.map((x) => `${x.t}s`).join(' '));
  // F. audible cuts: a validator kill after sentences already played
  const audibleCuts = ev('judge_kill_snapshot').map((e) => ({ t: e.t, heard: Number((e.msg.match(/heard=(\d+)/) ?? [])[1] ?? 0) })).filter((c) => c.heard >= 1);
  if (audibleCuts.length) warn(`audible cuts (validator kill after ${audibleCuts.reduce((n, c) => n + c.heard, 0)} heard sentences)`, `${audibleCuts.length}× at ${audibleCuts.map((c) => `${c.t}s(heard=${c.heard})`).join(' ')}`);
  else info('audible cuts: 0');
  // H. one-word verdict acks ("Noted." / "Accepted.") sound robotic
  const terseAcks = tutor.filter((x) => /^(?:noted|accepted|acknowledged|understood|confirmed)[.!](?:\s|$)/i.test(x.text.trim()));
  ok('no one-word verdict ack ("Noted." / "Accepted.")', terseAcks.length === 0, terseAcks.map((x) => `${x.t}s "${x.text.slice(0, 30)}"`).join(' | '));
  // I. one correction card per student sentence; no card that is an ordered fragment of another on the same page
  const isSubseq = (a, b) => { let j = 0; for (const w of b) if (w === a[j]) j++; return j === a.length; };
  const fragCards = [];
  // bot run r42 (95 s): a level-check model card beside the student's longer answer is not the class — the FRAGMENT must be a correction card
  const correctionTexts = new Set(ev('sentence_board_auto').filter((e) => /kind=correction/.test(e.msg)).map((e) => norm((e.msg.match(/"([^"]+)"/) ?? [])[1] ?? '')).filter(Boolean));
  const pronTargets = new Set(events.filter((x) => x.type === 'pronunciation_auto_armed' || x.type === 'pronunciation_armed').map((e) => norm((e.msg.match(/"([^"]+)"/) ?? [])[1] ?? '')).filter(Boolean));
  for (const p of pages.filter((p) => !/Summary|まとめ/.test(p.title))) {
    const cards = p.items.filter((it) => it.action === 'showSentence').map((it) => ({ t: it.t, text: cardText(it), toks: norm(cardText(it)).split(' ').filter(Boolean) })).filter((c) => !pronTargets.has(c.toks.join(' ')));
    for (const a of cards) for (const b of cards) if (a !== b && correctionTexts.has(a.toks.join(' ')) && a.toks.length >= 3 && a.toks.length < b.toks.length && isSubseq(a.toks, b.toks)) fragCards.push(`${p.title.slice(0, 12)} ${a.t}s "${a.text}" ⊂ "${b.text}"`);
  }
  const twoCorrections = []; { const byT = new Map(); for (const e of ev('sentence_board_auto').filter((e) => /kind=correction/.test(e.msg) && !/not placed/.test(e.msg))) byT.set(e.t, (byT.get(e.t) ?? 0) + 1); for (const [t, n] of byT) if (n >= 2) twoCorrections.push(`${t}s ×${n}`); }
  ok('one correction card per student sentence', fragCards.length === 0 && twoCorrections.length === 0, [...twoCorrections, ...fragCards].join(' | ').slice(0, 300));
  // J. a student-sentence card placed on the departing page while the same turn advanced the part
  const advanceTs = ev('fixed_script_auto_advance').filter((e) => !/topic-intro/.test(e.msg)).map((e) => e.t).concat(ev('fixed_script_entry_note_planted').filter((e) => /brain advance/.test(e.msg) && !/"topic-intro"/.test(e.msg)).map((e) => e.t));
  const departing = [];
  // the rule (Task 43 §J) is about the CORRECTION of the student's last sentence; a model card of an uncorrected answer stays on its part's page by design (Task 27 §B)
  for (const w of wb.filter((w) => w.action === 'showSentence' && correctionTexts.has(norm(cardText(w))))) {
    const adv = advanceTs.find((t) => w.t >= t - 2 && w.t <= t + 2); if (adv === undefined) continue;
    const nextPage = wb.find((p) => p.action === 'newPage' && p.t >= adv - 2 && /^Part \d/.test(p.data?.title ?? ''));
    if (nextPage && nextPage.i > w.i) departing.push(`${w.t}s "${cardText(w).slice(0, 40)}" (page at ${nextPage.t}s)`);
  }
  ok('no correction card left on the departing page by an advancing turn', departing.length === 0, departing.join(' | ').slice(0, 300));
  // K. menu part: the menu is asked within 20 s of the pronunciation page paint
  const pronPage = pages.find((p) => /Pronunciation|発音/.test(p.title));
  if (pronPage) {
    const MENU_TEXT = /(?:individual words|complete sentence|speaking more naturally|skip and continue)[^.?!]*(?:individual words|complete sentence|speaking more naturally|skip and continue)|\b(?:1, 2, 3,? or 4|option[s]? 1)\b/i;
    const firstMenu = ev('fixed_script_menu_asked').map((e) => e.t).concat(tutor.filter((x) => MENU_TEXT.test(x.text) && /[?？]/.test(x.text)).map((x) => x.t)).filter((t) => t >= pronPage.t - 20).sort((a, b) => a - b)[0];
    const pronEntry = ev('fixed_script_entry_note_planted').filter((e) => /"pronunciation"/.test(e.msg)).map((e) => e.t)[0] ?? pronPage.t;
    const skipped = ev('typed_advance_app').concat(ev('fixed_script_auto_advance')).some((e) => e.t >= pronEntry && e.t <= pronEntry + 25 && /summary/.test(e.msg));
    ok('pronunciation menu asked within 20 s of the page', skipped || (firstMenu !== undefined && firstMenu - pronPage.t <= 20), firstMenu === undefined ? `page ${pronPage.t}s, menu never asked` : `page ${pronPage.t}s → menu ${firstMenu}s (${firstMenu - pronPage.t}s)`);
  }
  // M. summary page: no re-card of a sentence already carded earlier, and no re-card of the student's own earlier sentence
  if (summaryPage) {
    const earlier = new Set(wb.filter((w) => w.action === 'showSentence' && w.t < summaryPage.t).map((w) => norm(cardText(w))));
    const stemmed = (t) => content(t).map(stem);
    const reCards = [];
    for (const it of summaryPage.items.filter((it) => it.action === 'showSentence')) {
      const txt = cardText(it);
      if (earlier.has(norm(txt))) { reCards.push(`${it.t}s "${txt}" (carded earlier)`); continue; }
      const own = student.find((s) => s.t < summaryPage.t && content(s.text).length >= 3 && jaccard(stemmed(s.text), stemmed(txt)) >= 0.75);
      if (own) reCards.push(`${it.t}s "${txt}" (student's ${own.t}s sentence)`);
    }
    ok('summary page re-cards nothing from earlier', reCards.length === 0, reCards.join(' | ').slice(0, 300));
  }

  // 10j. voice run 22 (embed-1793737430878, Praveen) — the three rules (Task 44)
  const PROPOSAL = /^\s*(?:(?:okay|ok|so|now|good|great|alright|well|then),?\s+)?(?:shall we|would you like|do you want|want to|how about|are you ready|ready|can we)\b[^.!?]*\b(?:one more|another|more practice|practi[sc]e|try|move on|go on|continue|next (?:part|section|step|one)|summary|conversation|pronunciation|past simple|present perfect|skip|stop|finish|wrap up|start|begin|sentence|question|item|word)\b[^.!?]*[?？]\s*$/i;
  const ASKS = (x) => /[?？]\s*$/.test(x.trim()) || /^\s*(?:please\b|tell me\b|say\b|try\b|give me\b|describe\b|repeat\b|listen\b)/i.test(x);
  // R1: the pointer moved at the end of a turn that left a question open (not an advance fired on the reply)
  const underOpenAsk = [];
  for (const e of ev('fixed_script_auto_advance').filter((e) => !/\(on the reply\)|reason=(?:spoken_opener|announced|menu_unpicked)/.test(e.msg))) {
    const turn = [...tutor].reverse().find((x) => x.t <= e.t + 1 && x.t >= e.t - 15);
    if (!turn) continue;
    const replied = student.some((s) => s.t > turn.t && s.t <= e.t);
    if (!replied && /[?？]\s*$/.test(turn.text.trim())) underOpenAsk.push(`${e.t}s ${e.msg.replace(/"/g, '').slice(0, 50)} after "${turn.text.slice(-50)}"`);
  }
  ok('R1: the pointer never moves while a question is open', underOpenAsk.length === 0, underOpenAsk.join(' | ').slice(0, 300));
  // R2: an offer / proposal ends the turn; no re-offer right after an acceptance
  const offerThenAsk = [];
  const reOffer = [];
  for (let k = 0; k < tutor.length; k++) {
    const ss = sentencesOf(tutor[k].text);
    const pi = ss.findIndex((x) => PROPOSAL.test(x));
    if (pi >= 0 && ss.slice(pi + 1).some((x) => ASKS(x) && !PROPOSAL.test(x))) offerThenAsk.push(`${tutor[k].t}s "${ss[pi].slice(0, 40)}" → "${ss.slice(pi + 1).find((x) => ASKS(x)).slice(0, 40)}"`);
    if (k > 0) {
      const prevS = [...student].reverse().find((s) => s.i < tutor[k].i && s.i > tutor[k - 1].i);
      const prevProposed = sentencesOf(tutor[k - 1].text).some((x) => PROPOSAL.test(x));
      if (prevS && prevProposed && /^\s*(?:yes|yeah|ok|okay|sure|one more|another|more practice|please)\b/i.test(prevS.text) && ss.some((x) => PROPOSAL.test(x))) reOffer.push(`${tutor[k].t}s after "${prevS.text.slice(0, 30)}"`);
    }
  }
  ok('R2: an offer ends the turn (no ask after it)', offerThenAsk.length === 0, offerThenAsk.join(' | ').slice(0, 300));
  ok('R2: no re-offer on the turn after an acceptance', reOffer.length === 0, reOffer.join(' | ').slice(0, 300));
  // R3: one authority per action — no duplicate authored card on a page; no engine menu line after a resolved pick
  const cardWordsOf = (st) => new Set(norm(st).split(' ').filter((w) => w && !['a', 'an', 'the', 'um', 'uh'].includes(w)));
  const dupProblems = [];
  for (const p of pages) {
    const probs = p.items.filter((it) => it.action === 'showProblem').map((it) => cardWordsOf(String(it.data?.problem?.statement ?? '')));
    for (let i = 0; i < probs.length; i++) for (let j = i + 1; j < probs.length; j++) {
      const A = probs[i], B = probs[j]; if (A.size < 8) continue;
      let inter = 0; for (const w of A) if (B.has(w)) inter++;
      if (inter / (A.size + B.size - inter) >= 0.9) dupProblems.push(`${p.title.slice(0, 14)}`);
    }
  }
  ok('R3: no duplicate authored card on a page', dupProblems.length === 0, dupProblems.join(' | '));
  const menuAfterPick = ev('menu_pick_resolved').flatMap((pk) => events.filter((e) => /^(?:transition_ask_engine_fallback|menu_entry_engine_fallback)$/.test(e.type) && e.t >= pk.t && e.t <= pk.t + 12).map((e) => `${pk.t}s pick → ${e.type} ${e.t}s`));
  ok('R3: no engine menu line after a resolved pick', menuAfterPick.length === 0, menuAfterPick.join(' | '));

  // 10k. voice run 23 (embed-1793747507104, Praveen) — Task 45
  // §1: no retraction of an earlier verdict ("I should not have said Good"); no judge note planted during the level check
  const retractions = tutor.filter((x) => /\bI should not have said\b|\bwas not a correct answer to my question\b|\bI was wrong to say\b/i.test(x.text)).map((x) => `${x.t}s "${x.text.slice(0, 60)}"`);
  ok('45 §1: no retraction of an earlier verdict', retractions.length === 0, retractions.join(' | ').slice(0, 300));
  const lcPage = pages.find((p) => /level check|レベルチェック/i.test(p.title));
  const lcAdv = ev('fixed_script_level_advance')[0]?.t ?? ev('fixed_script_auto_advance').find((e) => /"level-check"/.test(e.msg))?.t ?? null;
  const lcStart = lcPage ? lcPage.t : null;
  // the judge runs after the level-set advance within the same turn: + 10 s
  const lcNotes = lcAdv !== null && lcStart !== null ? ev('judge_correction_note_planted').filter((e) => e.t >= lcStart && e.t <= lcAdv + 10) : [];
  ok('45 §1: no judge correction note planted in the level check', lcNotes.length === 0, lcNotes.map((e) => `${e.t}s ${e.msg.slice(0, 50)}`).join(' | '));
  // §2a: a question the tutor invited is answered, not deflected
  const deflected = [];
  for (let k = 1; k < tutor.length; k++) {
    const prevS = [...student].reverse().find((s) => s.i < tutor[k].i && s.i > tutor[k - 1].i);
    if (!prevS || !/[?？]\s*$/.test(prevS.text.trim())) continue;
    if (!/\bask me\b|\bask (?:one|a|your) question\b|質問してみて|質問して/i.test(tutor[k - 1].text)) continue;
    if (/\brather keep the focus\b|\bfocus on (?:your|our) (?:English|learning|practice)\b|\bget back to our practice\b|\bI['’]m your AI tutor\b/i.test(tutor[k].text)) deflected.push(`${tutor[k].t}s "${tutor[k].text.slice(0, 60)}"`);
  }
  ok('45 §2a: a question the tutor invited is answered, not deflected', deflected.length === 0, deflected.join(' | ').slice(0, 300));
  // §2b: the card question is not asked again after the student answered its paraphrase correctly in that part
  const cardReasks = ev('answered_card_question_reask_dropped').length;
  const cardQ = (pg) => String(pg.items.find((it) => it.action === 'showProblem')?.data?.problem?.statement ?? '');
  const reaskedCard = [];
  for (const pg of pages) {
    const q = cardQ(pg); if (!q || !/[?？]\s*$/.test(q.trim()) || /\d\)/.test(q)) continue;
    const qc = content(q);
    const asks = tutor.filter((x) => pg.t0 !== undefined && x.t >= pg.t0 && (pg.t1 === undefined || x.t <= pg.t1) && sentencesOf(x.text).some((sn) => /[?？]\s*$/.test(sn.trim()) && jaccard(content(sn), qc) >= 0.6));
    if (asks.length >= 2) {
      const firstAnswered = student.some((st) => st.t > asks[0].t && st.t < asks[1].t && content(st.text).length >= 4);
      if (firstAnswered) reaskedCard.push(`${asks[1].t}s "${q.slice(0, 40)}"`);
    }
  }
  ok('45 §2b: the card question is not asked twice in its part after an answer', reaskedCard.length === 0, reaskedCard.join(' | ').slice(0, 300) + (cardReasks ? ` (${cardReasks} dropped by the engine)` : ''));
  // §3: after a retry ask + reply, the affirming turn cards the student's sentence (any card containing the reply's content)
  const RETRY_ASK = /\b(?:say|try|repeat)\b[^.!?。]*\b(?:again|once more|one more time|(?:the|that|this|your) (?:whole |full |complete )?sentence)\b|もう一度/i;
  const AFFIRM = /\b(?:correct|right|clear|good|great|exactly|natural|(?<!present |past )perfect|well done)\b|正しい|ですね/i;
  const BUT = /\b(?:but|however|though|although)\b|でも|しかし/i;
  const CORR_CUE = /\b(?:should be|not quite|almost|instead of|we say|let['’]s fix|small fix|one fix|missing)\b/i;
  const CHOICE_Q = /\bis it\s+["“「][^"”」]+["”」]\s+or\s+["“「][^"”」]+["”」]/i;
  const uncardedRetry = [];
  for (let k = 1; k < tutor.length; k++) {
    const prevT = tutor[k - 1];
    const reply = [...student].reverse().find((s) => s.i < tutor[k].i && s.i > prevT.i);
    if (!reply) continue;
    const oneWordPick = CHOICE_Q.test(prevT.text) && content(reply.text).length <= 2;
    if (!(RETRY_ASK.test(prevT.text) || oneWordPick)) continue;
    if (!AFFIRM.test(tutor[k].text) || CORR_CUE.test(tutor[k].text) || BUT.test(tutor[k].text)) continue;
    // "on the board" = any sentence card up to 25 s after the affirming turn (an earlier card of the same sentence counts)
    const cards = wb.filter((w) => /showSentence|handwrite/.test(w.action) && w.t <= tutor[k].t + 25).map((w) => String(w.data?.sentence ?? w.data?.text ?? ''));
    if (oneWordPick) {
      const rc = content(reply.text);
      if (!rc.length) continue;
      if (!cards.some((c) => rc.every((wd) => norm(c).split(' ').includes(wd)))) uncardedRetry.push(`${tutor[k].t}s "${reply.text.slice(0, 40)}"`);
      continue;
    }
    const replySentences = sentencesOf(reply.text).map((x) => content(x)).filter((x) => x.length >= 4);
    if (!replySentences.length) continue;
    const carded = replySentences.every((rc) => cards.some((c) => jaccard(content(c), rc) >= 0.5 || (content(c).length >= 2 && rc.join(' ').includes(content(c).join(' ')))));
    if (!carded) uncardedRetry.push(`${tutor[k].t}s "${reply.text.slice(0, 40)}"`);
  }
  ok('45 §3: the affirmed retry / elicited fix is on the board', uncardedRetry.length === 0, uncardedRetry.join(' | ').slice(0, 300));
  // §4 / §6: an advancing turn's student cards paint before the part page turns, and the page break waits for the transition sentence
  const breakBeforeCard = ev('sentence_board_auto').filter((e) => ev('auto_newpage_on_advance_flushed').some((f) => f.t <= e.t && f.t >= e.t - 2 && !/at turn end/.test(f.msg)) && !/anchor=start/.test(e.msg) && /kind=correction/.test(e.msg)).map((e) => `${e.t}s ${e.msg.slice(0, 50)}`);
  ok('45 §6: no correction card after the part page break in the same turn', breakBeforeCard.length === 0, breakBeforeCard.join(' | ').slice(0, 300));
  const unanchored = ev('auto_newpage_on_advance_flushed').filter((f) => /after \d+ student card/.test(f.msg) && !/on the transition sentence/.test(f.msg) && ev('page_break_anchored').some((a) => Math.abs(a.t - f.t) <= 2)).map((f) => `${f.t}s ${f.msg.slice(0, 50)}`);
  ok('45 §4: a student card and the part page break never share an unanchored batch', unanchored.length === 0, unanchored.join(' | ').slice(0, 300));
  // §5: a no-ask continuation never re-speaks the verdict
  const ECHO = /\b(?:your|that|this|the)\s+(?:sentence|answer|reply)\b[^.!?]*\b(?:is|was|sounds|works|fits)\s+(?:also\s+|very\s+)?(?:correct|right|clear|good|fine|great|natural|perfect|well)\b|\byou said it well\b|\bwell (?:said|done)\b/i;
  const echoed = ev('fixed_script_noask_continue').flatMap((c) => tutor.filter((x) => x.t >= c.t && x.t <= c.t + 8).filter((x) => ECHO.test(sentencesOf(x.text)[0] ?? '')).map((x) => `${x.t}s "${x.text.slice(0, 60)}"`));
  ok('45 §5: the no-ask continuation does not re-speak the verdict', echoed.length === 0, echoed.join(' | ').slice(0, 300));
  // §7a: no pronunciation item armed twice in a part (a "once more" re-arm of the current item excepted)
  const armed = ev('pronunciation_armed');
  const repeats = [];
  for (let i = 1; i < armed.length; i++) {
    const txt = (m) => norm(m.replace(/^\S+\s+/, ''));
    const cur = txt(armed[i].msg);
    const earlier = armed.slice(0, i - 1).map((a) => txt(a.msg));
    if (earlier.includes(cur) && cur !== txt(armed[i - 1].msg)) repeats.push(`${armed[i].t}s "${cur.slice(0, 40)}"`);
  }
  ok('45 §7a: no pronunciation item given again in a part', repeats.length === 0, repeats.join(' | ').slice(0, 300));
  // §7b: the pointer never moves on a reply that accepts the current part's offer
  const movedOnAcceptance = ev('fixed_script_auto_advance').filter((e) => /\(on the reply\)/.test(e.msg)).flatMap((e) => {
    const st = [...student].reverse().find((s) => s.t <= e.t + 1 && s.t >= e.t - 6);
    const prevT = st ? [...tutor].reverse().find((x) => x.i < st.i) : null;
    if (!st || !prevT) return [];
    const offer = sentencesOf(prevT.text).some((x) => /[?？]\s*$/.test(x.trim()) && /\b(?:one more|another|more practice)\b|もう(?:一|ひと)/i.test(x) && /\b(?:or|move on|summary|next)\b|次|まとめ/i.test(x));
    const accepts = /\b(?:one more|another|more practice|practice|yes|yeah|sure|ok|okay|please)\b|もう(?:一|ひと)|はい/i.test(st.text) && !/\b(?:move on|next|skip|summary|stop|finish)\b|次|進/i.test(st.text);
    return offer && accepts ? [`${e.t}s after "${st.text.slice(0, 30)}"`] : [];
  });
  ok('45 §7b: the pointer never moves on a reply that accepts an offer', movedOnAcceptance.length === 0, movedOnAcceptance.join(' | ').slice(0, 300));

  // 11. counts worth a look
  const counts = ['brain_validator_retry', 'idle_nudge_sent', 'drop_self_voice', 'meta_narration_dropped', 'fixed_script_noask_continue', 'fixed_script_offer_continue', 'transition_ask_off_part', 'judge_kill_resume_diverged', 'menu_pick_resolved', 'adjacent_duplicate_sentence_dropped', 'typed_turn_superseded', 'render_dropped'];
  info(counts.map((c) => `${c}=${events.filter((e) => e.type === c || e.type.startsWith(c + '_')).length}`).join(' · '));
  const retries = ev('brain_validator_retry').map((e) => e.msg.slice(0, 60));
  if (retries.length) info(`retries: ${retries.join(' | ')}`);
  const lat = ev('turn_latency').map((e) => Number((e.msg.match(/TOTAL=(\d+)/) ?? [])[1])).filter((n) => n > 0).sort((a, b) => a - b);
  if (lat.length) info(`turn latency median ${lat[Math.floor(lat.length / 2)]} ms · p90 ${lat[Math.floor(lat.length * 0.9)]} ms`);
  return { lines: out, passes, fails, warns };
}
