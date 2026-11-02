// Checks over a session dump (the text produced by trial-text-session.mjs:
// header JSON, === TRANSCRIPT, === WHITEBOARD, === EVENTS). Each check is a
// generic lesson-quality rule from the GDI runs 11–17; PASS/FAIL/WARN lines.
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set(['the', 'a', 'an', 'to', 'of', 'and', 'is', 'it', 'that', 'this', 'in', 'on', 'for', 'now', 'then', 'next', 'let', 's', 'lets', 'we', 'you', 'i', 'so']);
const content = (s) => norm(s).split(' ').filter((w) => w && !STOP.has(w));
const jaccard = (a, b) => { const A = new Set(a), B = new Set(b); const inter = [...A].filter((x) => B.has(x)).length; return inter / (new Set([...A, ...B]).size || 1); };

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
  ok('every planted offer was spoken', offerPlanted.length === 0 || offerSpoken.length >= offerPlanted.length, `planted ${offerPlanted.length}, spoken ${offerSpoken.length}`);
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
  const NARR = /\[(?:runtime|system) note|^(?:gently|briefly|then|now),? (?:point|model|name|acknowledge|accept|praise)\b|\bmodel the pattern\b|\band ask for one\b|^let me (?:ask|say) (?:that |it )?again simply|\bthe student(?:'s)?\b|\bthe learner(?:'s)?\b|\bI gave them\b|\bthe correct response\b|\bso I should\b|\bis only a repeat\b|\bbring (?:that|it) back\b|\brepeat of the sentence\b|\bruntime\b|\bvalidator\b|\bthe board already\b|\bthis note\b|\bnotes above\b|\binstructions for me\b|\bcarry on with the lesson\b|\banswer your last point first\b|\blesson isn'?t over yet\b|\bin japanese, the (?:word|phrase|sentence) is\b|\bfinally said\b|\bphrase large\b|\bnote below\b|\bmeasured result\b|\bdidn'?t come through\b|\bi'?ll go with\b/i;
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
  const badPins = ev('qpin_set').concat(ev('qpin_set_verbatim'), ev('qpin_set_ask')).map((e) => (e.msg.match(/"([^"]*)/) ?? [])[1] ?? '').filter((g) => g !== undefined && (/^\s*["“]?\s*$/.test(g) || content(g).length < 2));
  ok('no stray / empty Q-pin', badPins.length === 0, badPins.map((g) => `"${g}"`).join(' | '));

  // 6b. Q-pin gists are grounded in the tutor's turn (no invented examples)
  const ungrounded = [];
  for (const e of ev('qpin_set')) {
    const g = (e.msg.match(/"([^"]*)/) ?? [])[1] ?? ''; if (content(g).length < 4) continue;
    const turn = [...tutor].reverse().find((x) => x.t <= e.t + 1);
    if (!turn) continue;
    const tt = new Set(content(turn.text)); const cg = content(g); const hit = cg.filter((w) => tt.has(w)).length / cg.length;
    if (hit < 0.6) ungrounded.push(`${e.t}s "${g}" (${Math.round(hit * 100)}%)`);
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
  const noNote = reached.filter((s) => !noteSegs.has(s));
  ok('every part reached got its entry note', noNote.length === 0, noNote.join(', '));

  // 10d. run 18: no offer re-planted (the spoken offer went unrecognised) and no probe loop (three tutor questions on one point, each answered)
  ok('no fixed_script_offer_replanted', ev('fixed_script_offer_replanted').length === 0, ev('fixed_script_offer_replanted').map((e) => `${e.t}s`).join(' '));
  const FRAME = new Set(['can', 'could', 'would', 'will', 'do', 'does', 'did', 'tell', 'me', 'say', 'one', 'more', 'what', 'which', 'how', 'who', 'when', 'where', 'why', 'about', 'your', 'using', 'starting', 'with', 'please', 'or', 'was', 'were', 'are', 'be', 'there', 'at', 'from', 'yes', 'no', 'just', 'like', 'sentence', 'example']);
  const stem = (w) => w.replace(/(?:ions?|ing|ed|es|est|er|ly|s|e)$/u, '');
  const qOf = (x) => { const ss = x.text.split(/(?<=[.?!。？！])\s+/).filter((s) => /\?\s*$/.test(s)); if (!ss.length) return null; const ws = content(ss[ss.length - 1]).filter((w) => !FRAME.has(w)).map(stem).filter((w) => w.length > 2); return ws.length >= 2 ? ws : null; };
  const probeLoops = [];
  for (let k = 2; k < tutor.length; k++) {
    const a = qOf(tutor[k - 2]), b = qOf(tutor[k - 1]), c = qOf(tutor[k]);
    if (!a || !b || !c) continue;
    const answered = (p, q) => student.some((s) => s.i > p.i && s.i < q.i && content(s.text).length >= 2 && !/\?\s*$/.test(s.text));
    if (!answered(tutor[k - 2], tutor[k - 1]) || !answered(tutor[k - 1], tutor[k])) continue;
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

  // 11. counts worth a look
  const counts = ['brain_validator_retry', 'idle_nudge_sent', 'drop_self_voice', 'meta_narration_dropped', 'fixed_script_noask_continue', 'fixed_script_offer_continue', 'transition_ask_off_part', 'judge_kill_resume_diverged', 'menu_pick_resolved', 'adjacent_duplicate_sentence_dropped', 'typed_turn_superseded', 'render_dropped'];
  info(counts.map((c) => `${c}=${events.filter((e) => e.type === c || e.type.startsWith(c + '_')).length}`).join(' · '));
  const retries = ev('brain_validator_retry').map((e) => e.msg.slice(0, 60));
  if (retries.length) info(`retries: ${retries.join(' | ')}`);
  const lat = ev('turn_latency').map((e) => Number((e.msg.match(/TOTAL=(\d+)/) ?? [])[1])).filter((n) => n > 0).sort((a, b) => a - b);
  if (lat.length) info(`turn latency median ${lat[Math.floor(lat.length / 2)]} ms · p90 ${lat[Math.floor(lat.length * 0.9)]} ms`);
  return { lines: out, passes, fails, warns };
}
