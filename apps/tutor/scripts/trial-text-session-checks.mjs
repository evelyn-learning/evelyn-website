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
  ok('no fixed_script_offer_unmade', ev('fixed_script_offer_unmade').length === 0, ev('fixed_script_offer_unmade').map((e) => e.msg).join(' | '));
  const offerSpoken = ev('fixed_script_offer_spoken').map((e) => e.msg);
  const offerPlanted = ev('fixed_script_offer_planted').map((e) => e.msg);
  ok('every planted offer was spoken', offerPlanted.length === 0 || offerSpoken.length >= offerPlanted.length, `planted ${offerPlanted.length}, spoken ${offerSpoken.length}`);
  for (let i = 0; i < student.length; i++) {
    const s = student[i];
    if (!/^\s*(?:one more|another one|more practice)/i.test(s.text)) continue;
    const reply = tutor.find((x) => x.i > s.i);
    if (reply) ok(`"one more" at ${s.t}s got a new item`, !/question on the board|card on the board|look at the board/i.test(reply.text), reply.text.slice(0, 120));
  }
  // a silent advance: the part advanced while a planted offer had never been spoken
  const silentAdvance = ev('fixed_script_auto_advance').filter((e) => !/reason=announced/.test(e.msg));
  info(`auto advances: ${silentAdvance.length} (${silentAdvance.map((e) => e.msg.replace(/"/g, '')).join('; ').slice(0, 300)})`);

  // 3. narrated notes / third-person learner / plan clauses in spoken text
  const NARR = /\[(?:runtime|system) note|^(?:gently|briefly|then|now),? (?:point|model|name|acknowledge|accept|praise)\b|\bmodel the pattern\b|\band ask for one\b|^let me (?:ask|say) (?:that |it )?again simply|\bthe student(?:'s)?\b|\bthe learner(?:'s)?\b|\bI gave them\b|\bthe correct response\b|\bso I should\b|\bis only a repeat\b|\bbring (?:that|it) back\b|\brepeat of the sentence\b|\bruntime\b|\bvalidator\b|\bthe board already\b|\bthis note\b/i;
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

  // 10. corrections: a tutor turn that says the student's sentence is correct must not also "correct" it with the same words (false correction)
  // 11. counts worth a look
  const counts = ['brain_validator_retry', 'idle_nudge_sent', 'drop_self_voice', 'meta_narration_dropped', 'fixed_script_noask_continue', 'fixed_script_offer_continue', 'transition_ask_off_part', 'judge_kill_resume_diverged', 'menu_pick_resolved', 'adjacent_duplicate_sentence_dropped', 'typed_turn_superseded', 'render_dropped'];
  info(counts.map((c) => `${c}=${events.filter((e) => e.type === c || e.type.startsWith(c + '_')).length}`).join(' · '));
  const retries = ev('brain_validator_retry').map((e) => e.msg.slice(0, 60));
  if (retries.length) info(`retries: ${retries.join(' | ')}`);
  const lat = ev('turn_latency').map((e) => Number((e.msg.match(/TOTAL=(\d+)/) ?? [])[1])).filter((n) => n > 0).sort((a, b) => a - b);
  if (lat.length) info(`turn latency median ${lat[Math.floor(lat.length / 2)]} ms · p90 ${lat[Math.floor(lat.length * 0.9)]} ms`);
  return { lines: out, passes, fails, warns };
}
