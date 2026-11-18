/*
 * Animated solution player (shared by every item). Plain ES5, no dependency, no network, no storage.
 * build.ts inlines this file, player.css, the item's figure.svg, its spec (as JSON) and its board.js into one page.
 *
 * ---- board.js (the item's own code) ---------------------------------------------------------------------------
 * The only thing board.js may do at load is:
 *
 *   esBoard.define({
 *     actions:  { name: function (api, args) {} },   // run by {"do":"call","fn":"name","args":{}} and by board buttons
 *     practice: function (api) {},                   // practice kind "custom": wire the task once, at load
 *     solve:    function (api) {},                   // practice kind "custom": complete the task (headless check)
 *     explore:  function (api) {},                   // wire the explore box (slider) once, at load
 *     rest:     function (api, played) {}            // after every return to Fresh (played=false) or Practice (true)
 *   });
 *
 * api (ids are layer ids in figure.svg; an element works wherever an id does):
 *   api.fast                     true while the board is brought up to date silently. Every action must honour it:
 *                                apply the end state at once. The helpers below already do.
 *   api.el(id)                   the element
 *   api.show(id) / api.hide(id)  fade a layer in / out (class es-off)
 *   api.draw(id)                 show it and draw its .es-draw strokes (they need pathLength="1")
 *   api.flash(id)                pulse it twice
 *   api.dim(id) / api.undim(id)  grey it back / restore it
 *   api.move(id, dx, dy, slide, done)   set its transform to translate(dx,dy); slide=true glides there (1.2 s);
 *                                done() runs when it has arrived (at once when fast)
 *   api.pos(id)                  [dx, dy] of its current translate
 *   api.ink(html, cls)           pen a line on the ink strip; cls "hi" or "result" or nothing
 *   api.wither()                 fade the ink away
 *   api.mark(d, color)           a marker stroke (path data, viewBox units) that draws itself, stays about 3 s, fades
 *   api.answer()                 flash the answer bar
 *   api.readout(text)            the line under the board
 *   api.after(ms, fn)            a timer that is cancelled when the board is reset; fn runs at once when fast
 *   api.animate(ms, frame, done) frame(u) with u from 0 to 1 over ms; when fast: frame(1) and done() at once;
 *                                cancelled (without done) when the board is reset
 *   api.svgPoint(evt)            a pointer event's position in viewBox units: {x, y}
 *   api.playing()                true while the explanation is playing (ignore taps and drags then)
 *   api.played()                 true once the explanation has been started at least once
 *   api.practising()             true while the practice task is open (Practice state, not yet completed)
 *   api.practiceDone(text)       practice kind "custom": the task is complete; runs practice.done cues, shows text
 *   api.rest()                   bring the board back to its resting state (Fresh, or Practice once played)
 *   api.cue(cue)                 run one cue object, as the spec would
 *
 * ---- page API (used by the review page) -------------------------------------------------------------------------
 *   window.esPlayer.state()      { step, line, timeMs, playing, paused, version, practice, played, steps, clock }
 *                                practice: "off" | "ready" | "done"; clock: "audio" | "virtual" (no clip) | null
 *                                step and line count from 0; both are -1 when nothing is playing
 *   .pause() .resume() .playFrom(step) .stop()      (.stop() also returns the board to its resting state)
 *   .buildAll()                  show the finished board at once (every cue, no animation)
 *   .solvePractice()             practice kind "custom": calls board.js solve(api)
 *   The page posts { type: "es-player", event: "step"|"line"|"pause"|"resume"|"end", step, line } to window.parent.
 *   window.esSpeed (a number set before this script runs) plays everything that many times faster (headless check).
 */
(function () {
  'use strict';
  var def = { actions: {} };
  var booted = false;
  window.esBoard = {
    define: function (d) { def = d || {}; if (!def.actions) def.actions = {}; },
    boot: function () { if (!booted) { booted = true; boot(); } }
  };

  function $(id) { return document.getElementById(id); }
  function list(nodes) { return Array.prototype.slice.call(nodes); }
  function oops(what, e) { if (window.console && console.error) console.error('es-player: ' + what + ': ' + (e && e.message ? e.message : e)); }

  function boot() {
    var root = $('es-root'), DATA = JSON.parse($('es-spec').textContent);
    var STEPS = DATA.steps, BOARD = DATA.board, PRACTICE = DATA.practice || { kind: 'custom' }, TIMING = DATA.timing;
    var steps = list(root.querySelectorAll('.es-step'));
    var boardEl = $('es-board'), svg = boardEl.querySelector('svg'), ink = $('es-ink'), readoutEl = $('es-readout');
    var live = $('es-live'), liveHead = $('es-live-head'), liveText = $('es-live-text'), answerBar = $('es-answer');
    var playBtn = $('es-play'), pauseBtn = $('es-pause');
    var speed = Math.max(0.25, Math.min(16, +window.esSpeed || 1));
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var raf = window.requestAnimationFrame || function (f) { return setTimeout(function () { f(Date.now()); }, 16); };
    var caf = window.cancelAnimationFrame || clearTimeout;
    var END_TEXT = BOARD.readoutEnd || 'Press "Reset board" to try it yourself.';
    var versionMatch = /\/v(\d+)\//.exec(window.location.pathname || '');
    var VERSION = versionMatch ? +versionMatch[1] : (+DATA.version || 0);

    var cur = -1, line = -1, paused = false, played = false, practice = 'off', fast = false;
    var audio = new Audio(), clock = null, ticker = null, gapTimer = null, gapWaiting = false, runToken = 0;
    var timers = [], anims = [], folding = null;

    /* ---------- the board: snapshot of the figure as authored, so a reset is exact ---------- */
    var snap = [];
    function capture() { // taken once the practice task is wired, so the classes that wiring adds survive a reset
      list(svg.querySelectorAll('*')).forEach(function (el) {
        var attrs = {}, i;
        for (i = 0; i < el.attributes.length; i++) attrs[el.attributes[i].name] = el.attributes[i].value;
        el.esKept = true;
        snap.push({ el: el, attrs: attrs, text: el.querySelector('*') ? null : el.textContent });
      });
    }
    function restoreFigure() {
      list(svg.querySelectorAll('*')).forEach(function (el) { if (!el.esKept && el.parentNode) el.parentNode.removeChild(el); });
      snap.forEach(function (rec) {
        var el = rec.el, i, name, drop = [];
        for (i = 0; i < el.attributes.length; i++) if (!(el.attributes[i].name in rec.attrs)) drop.push(el.attributes[i].name);
        for (i = 0; i < drop.length; i++) el.removeAttribute(drop[i]);
        for (name in rec.attrs) if (el.getAttribute(name) !== rec.attrs[name]) el.setAttribute(name, rec.attrs[name]);
        if (rec.text !== null && el.textContent !== rec.text) el.textContent = rec.text;
      });
    }
    function cancelPending() {
      timers.forEach(clearTimeout); timers = [];
      anims.forEach(function (a) { a.dead = true; caf(a.id); }); anims = [];
    }

    /* ---------- primitives ---------- */
    function el(x) {
      var e = typeof x === 'string' ? $(x) : x;
      if (!e) throw new Error('no element "' + x + '"');
      return e;
    }
    function add(e, c) { e.classList.add(c); }
    function rem(e, c) { e.classList.remove(c); }
    function has(e, c) { return e.classList.contains(c); }
    function reflow(e) { void e.getBoundingClientRect(); }
    function show(x) { rem(el(x), 'es-off'); }
    function hide(x) { add(el(x), 'es-off'); }
    function draw(x) {
      var e = el(x), strokes = list(e.querySelectorAll('.es-draw'));
      rem(e, 'es-off');
      if (has(e, 'es-draw')) strokes.unshift(e);
      strokes.forEach(function (l) { rem(l, 'es-go'); if (fast) return; reflow(l); add(l, 'es-go'); });
    }
    function flash(x) { var e = el(x); rem(e, 'es-pulse'); if (fast) return; reflow(e); add(e, 'es-pulse'); }
    function dim(x) { add(el(x), 'es-dim'); }
    function undim(x) { rem(el(x), 'es-dim'); }
    function pos(x) {
      var m = /translate\(\s*(-?[\d.]+(?:e-?\d+)?)(?:[\s,]+(-?[\d.]+(?:e-?\d+)?))?/.exec(el(x).getAttribute('transform') || '');
      return m ? [+m[1], +(m[2] || 0)] : [0, 0];
    }
    function place(e, x, y) { e.setAttribute('transform', 'translate(' + (Math.round(x * 100) / 100) + ',' + (Math.round(y * 100) / 100) + ')'); }
    function after(ms, fn) {
      if (fast) { fn(); return; }
      var id = setTimeout(function () { timers.splice(timers.indexOf(id), 1); fn(); }, ms / speed);
      timers.push(id);
    }
    function animate(ms, frame, done) {
      if (fast || reduce || ms <= 0) { frame(1); if (done) done(); return null; }
      var a = { dead: false, id: 0 }, t0 = null, total = ms / speed;
      function tick(ts) {
        if (a.dead) return;
        if (t0 === null) t0 = ts;
        var u = Math.min(1, (ts - t0) / total);
        frame(u);
        if (u < 1) { a.id = raf(tick); return; }
        anims.splice(anims.indexOf(a), 1);
        if (done) done();
      }
      a.id = raf(tick); anims.push(a);
      return a;
    }
    function move(x, dx, dy, slide, done) {
      var e = el(x), from = pos(e);
      if (e.esMove) { e.esMove.dead = true; caf(e.esMove.id); e.esMove = null; }
      if (!slide) { place(e, dx, dy); if (done) done(); return; }
      e.esMove = animate(1200, function (u) {
        var k = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        place(e, from[0] + (dx - from[0]) * k, from[1] + (dy - from[1]) * k);
      }, function () { e.esMove = null; if (done) done(); });
    }
    function write(html, cls) {
      var d = document.createElement('div');
      d.className = 'es-ink-line' + (cls ? ' es-' + cls : '');
      d.innerHTML = html; ink.appendChild(d);
      if (fast) add(d, 'es-on'); else { reflow(d); add(d, 'es-on'); }
    }
    function wither() { // old ink fades out in place (taken out of the flow, so the strip never grows), then leaves
      var old = list(ink.children).filter(function (d) { return !has(d, 'es-wither'); });
      if (fast || reduce) { list(ink.children).forEach(function (d) { ink.removeChild(d); }); return; }
      var tops = old.map(function (d) { return d.offsetTop; });
      old.forEach(function (d, i) { d.style.top = tops[i] + 'px'; add(d, 'es-wither'); });
      setTimeout(function () { old.forEach(function (d) { if (d.parentNode === ink) ink.removeChild(d); }); }, 500);
    }
    function mark(d, color) {
      if (fast) return;
      var p = document.createElementNS(svg.namespaceURI, 'path');
      p.setAttribute('d', d); p.setAttribute('pathLength', '1'); p.setAttribute('class', 'es-mark es-draw');
      p.setAttribute('stroke', color || '#7a2a8e'); p.setAttribute('stroke-width', '3');
      svg.appendChild(p); reflow(p); add(p, 'es-go');
      after(3800, function () { add(p, 'es-fade'); });
      after(5600, function () { if (p.parentNode) p.parentNode.removeChild(p); });
    }
    function flashAnswer() {
      if (fast) return;
      add(answerBar, 'es-flash');
      setTimeout(function () { rem(answerBar, 'es-flash'); }, 2500);
    }
    function setReadout(t) { readoutEl.textContent = t || ''; }
    function setLive(head, text) { liveHead.textContent = head; liveText.textContent = text; }
    function svgPoint(e) {
      var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      return p.matrixTransform(svg.getScreenCTM().inverse());
    }
    function reset() { cancelPending(); restoreFigure(); wither(); }

    function ids(c) { return c.id === undefined ? [] : (typeof c.id === 'string' ? [c.id] : c.id); }
    function runCue(c) {
      try {
        switch (c['do']) {
          case 'show': ids(c).forEach(show); break;
          case 'hide': ids(c).forEach(hide); break;
          case 'draw': ids(c).forEach(draw); break;
          case 'flash': ids(c).forEach(flash); break;
          case 'dim': ids(c).forEach(dim); break;
          case 'undim': ids(c).forEach(undim); break;
          case 'move': move(ids(c)[0], c.to[0], c.to[1], !!c.slide); break;
          case 'ink': write(c.html, c.cls); break;
          case 'wither': wither(); break;
          case 'mark': mark(c.d, c.color); break;
          case 'answer': flashAnswer(); break;
          case 'reset': reset(); break;
          case 'call': def.actions[c.fn](api, c.args || {}); break;
          default: throw new Error('unknown cue');
        }
      } catch (e) { oops('cue ' + JSON.stringify(c), e); }
    }
    function runCues(cues) { (cues || []).forEach(runCue); }
    function silently(fn) { var was = fast; fast = true; try { fn(); } finally { fast = was; } }

    var api = {
      fast: false, el: el, show: show, hide: hide, draw: draw, flash: flash, dim: dim, undim: undim, move: move, pos: pos,
      ink: write, wither: wither, mark: mark, answer: flashAnswer, readout: setReadout, after: after, animate: animate,
      svgPoint: svgPoint, cue: runCue,
      playing: function () { return cur >= 0; },
      played: function () { return played; },
      practising: function () { return practice === 'ready' && cur < 0; },
      practiceDone: function (text) { finishPractice(text); },
      rest: function () { if (cur < 0) rest(); }
    };
    if (Object.defineProperty) Object.defineProperty(api, 'fast', { get: function () { return fast; } });

    /* ---------- resting states: Fresh before the explanation has run, Practice after ---------- */
    function rest() {
      silently(function () {
        reset(); setLive('', '');
        if (played) runCues(PRACTICE.setup); else runCues(BOARD.fresh);
      });
      practice = played ? 'ready' : 'off';
      if (played) add(boardEl, 'es-practising'); else rem(boardEl, 'es-practising');
      setReadout(played ? BOARD.readoutPractice : BOARD.readoutFresh);
      resetOrder();
      if (def.rest) { try { def.rest(api, played); } catch (e) { oops('board.js rest', e); } }
    }
    function catchUp(k) { // the board as it stands at the start of step k: Fresh plus every earlier cue, applied at once
      silently(function () {
        reset(); runCues(BOARD.fresh);
        for (var i = 0; i < k; i++) STEPS[i].lines.forEach(function (l) { runCues(l.cues); });
      });
    }
    function finishPractice(text) {
      if (practice !== 'ready') return;
      practice = 'done';
      runCues(PRACTICE.done);
      setReadout(text || PRACTICE.doneText || 'Done.');
    }

    /* ---------- steps fold and unfold; the one just finished folds away at the pace of the next clip ---------- */
    function bodyOf(li) { return li.querySelector('.es-body'); }
    function setChev(li) { li.querySelector('.es-chev').setAttribute('aria-expanded', has(li, 'es-closed') ? 'false' : 'true'); }
    function collapse(li, ms) {
      if (has(li, 'es-closed')) return;
      var b = bodyOf(li), h = b.scrollHeight;
      if (reduce) ms = 0;
      b.style.transition = 'none'; b.style.height = h + 'px'; b.style.opacity = '1'; void b.offsetHeight;
      b.style.transition = 'height ' + ms + 'ms linear, opacity ' + ms + 'ms linear'; b.style.height = '0px'; b.style.opacity = '0';
      add(li, 'es-closed'); setChev(li);
      folding = ms > 1000 ? { li: li, endAt: Date.now() + ms } : null;
    }
    function expand(li, ms) {
      if (!has(li, 'es-closed')) return;
      var b = bodyOf(li);
      b.style.transition = 'none'; b.style.height = 'auto'; var h = b.scrollHeight; b.style.height = '0px'; void b.offsetHeight;
      b.style.transition = 'height ' + ms + 'ms ease, opacity ' + ms + 'ms ease'; b.style.height = h + 'px'; b.style.opacity = '1';
      rem(li, 'es-closed'); setChev(li);
      if (folding && folding.li === li) folding = null;
      setTimeout(function () { if (!has(li, 'es-closed')) b.style.height = 'auto'; }, ms + 30);
    }
    function freezeFold() {
      if (!folding) return;
      var b = bodyOf(folding.li), cs = window.getComputedStyle(b), h = cs.height, o = cs.opacity;
      b.style.transition = 'none'; b.style.height = h; b.style.opacity = o;
    }
    function resumeFold(ms) {
      if (!folding) return;
      var b = bodyOf(folding.li); void b.offsetHeight;
      b.style.transition = 'height ' + ms + 'ms linear, opacity ' + ms + 'ms linear'; b.style.height = '0px'; b.style.opacity = '0';
      folding.endAt = Date.now() + ms;
    }
    steps.forEach(function (li) {
      setChev(li);
      li.querySelector('.es-stephead').addEventListener('click', function (e) {
        var t = e.target;
        while (t && t !== li) { if (has(t, 'es-listen')) return; t = t.parentNode; }
        if (has(li, 'es-closed')) expand(li, 300); else collapse(li, 300);
      });
    });

    /* ---------- playback ---------- */
    function emit(event) {
      var msg = { type: 'es-player', event: event, step: cur, line: line };
      try { window.parent.postMessage(msg, '*'); } catch (e) { /* no parent to tell */ }
    }
    function spansOf(k) { return list(steps[k].querySelectorAll('.es-caption > span')); }
    function markSaid(k, i) { spansOf(k).forEach(function (s, j) { if (j === i) add(s, 'es-said'); else rem(s, 'es-said'); }); }
    function markStep(k) {
      steps.forEach(function (li, i) {
        if (i === k) add(li, 'es-now'); else rem(li, 'es-now');
        if (k >= 0 && i > k) add(li, 'es-ahead'); else rem(li, 'es-ahead');
      });
    }
    function estimate(k) { var n = 0; STEPS[k].lines.forEach(function (l) { n += l.len; }); return n * 60; }
    function startsFor(k, dur) { // when each line starts, in ms of the clip: recorded timing when present, else by length
      var t = TIMING && TIMING.steps && TIMING.steps[k], lines = STEPS[k].lines, i, total = 0, acc = 0, out = [];
      if (t && t.starts && t.starts.length === lines.length) {
        var scale = t.durationMs > 0 && Math.abs(t.durationMs - dur) > 250 ? dur / t.durationMs : 1; // a re-encoded clip keeps its proportions
        for (i = 0; i < lines.length; i++) out.push(i === 0 ? 0 : t.starts[i] * scale);
        return out;
      }
      for (i = 0; i < lines.length; i++) total += lines[i].len;
      for (i = 0; i < lines.length; i++) { out.push(dur * acc / total); acc += lines[i].len; }
      return out;
    }
    function now() {
      if (!clock) return 0;
      if (clock.mode === 'audio') return audio.currentTime * 1000;
      return paused || clock.over ? clock.at : Math.min(clock.dur, clock.at + (Date.now() - clock.base) * speed);
    }
    function stopTicker() { if (ticker !== null) { clearInterval(ticker); ticker = null; } }
    function startTicker() { stopTicker(); ticker = setInterval(tick, 30); }
    function fireLine(k, i) {
      line = i; markSaid(k, i);
      liveText.textContent = STEPS[k].lines[i].say;
      runCues(STEPS[k].lines[i].cues);
      emit('line');
    }
    function tick() {
      if (cur < 0 || paused || !clock || clock.over) return;
      var t = now(), idx = -1, i;
      for (i = 0; i < clock.starts.length; i++) if (clock.starts[i] <= t + 1) idx = i;
      while (line < idx) fireLine(cur, line + 1);
      if (clock.mode === 'audio' ? audio.ended : t >= clock.dur) finishStep();
    }
    function finishStep() {
      if (!clock || clock.over) return;
      var k = cur;
      while (line < STEPS[k].lines.length - 1) fireLine(k, line + 1);
      clock.over = true; clock.at = clock.dur; stopTicker();
      gapWaiting = true;
      gapTimer = setTimeout(nextStep, 600 / speed);
    }
    function nextStep() {
      gapWaiting = false; gapTimer = null;
      var k = cur;
      markSaid(k, -1);
      if (k + 1 < STEPS.length) run(k + 1, true);
      else { emit('end'); halt(); setLive('', ''); setReadout(END_TEXT); }
    }
    function halt() { // playback off; the board is left as it is
      runToken++;
      try { audio.pause(); } catch (e) { /* nothing was loaded */ }
      stopTicker(); clearTimeout(gapTimer); gapTimer = null; gapWaiting = false;
      if (cur >= 0) markSaid(cur, -1);
      if (folding) { resumeFold(reduce ? 0 : 300); folding = null; }
      cur = -1; line = -1; paused = false; clock = null; markStep(-1);
      playBtn.disabled = false; pauseBtn.disabled = true; pauseBtn.textContent = 'Pause';
    }
    function begin(k, token, mode, dur) {
      if (token !== runToken || clock) return;
      clock = { mode: mode, dur: dur, starts: startsFor(k, dur), at: 0, base: Date.now(), over: false };
      if (k > 0) collapse(steps[k - 1], dur / speed); // the previous step folds away at the pace of this clip
      if (paused) freezeFold(); else startTicker();
      tick();
    }
    function run(k, chained) {
      var token = ++runToken;
      stopTicker(); clearTimeout(gapTimer); gapTimer = null; gapWaiting = false;
      if (cur >= 0) markSaid(cur, -1);
      cur = k; line = -1; paused = false; clock = null; played = true; practice = 'off';
      rem(boardEl, 'es-practising');
      markStep(k);
      if (folding && folding.li !== steps[k]) { resumeFold(reduce ? 0 : 300); folding = null; } // a fold in progress finishes quickly on a jump
      expand(steps[k], 300);
      steps.forEach(function (li, i) { if (i < k - 1) collapse(li, 300); });
      if (!chained) catchUp(k); // a jump first brings the board, silently, to where it stands at the start of this step
      setLive('Step ' + (k + 1) + ' · ' + STEPS[k].title, '');
      playBtn.disabled = true; pauseBtn.disabled = false; pauseBtn.textContent = 'Pause';
      setReadout('');
      emit('step');
      var fallback = function () { begin(k, token, 'virtual', (TIMING && TIMING.steps && TIMING.steps[k] && TIMING.steps[k].durationMs) || estimate(k)); };
      try { audio.pause(); } catch (e) { /* nothing was loaded */ }
      audio.onloadedmetadata = function () {
        if (token !== runToken) return;
        try { audio.playbackRate = speed; } catch (e) { /* stays at 1 */ }
        if (isFinite(audio.duration) && audio.duration > 0) begin(k, token, 'audio', audio.duration * 1000); else fallback();
      };
      audio.onended = function () { if (token === runToken && clock && clock.mode === 'audio') finishStep(); };
      audio.onerror = fallback;
      audio.src = 'audio/step-' + (k + 1) + '.mp3';
      try { audio.defaultPlaybackRate = speed; audio.playbackRate = speed; } catch (e) { /* stays at 1 */ }
      var p;
      try { p = audio.play(); } catch (e) { fallback(); }
      if (p && p['catch']) p['catch'](function () { if (token === runToken && !paused) fallback(); });
    }
    function pause() {
      if (cur < 0 || paused) return;
      if (clock && clock.mode === 'virtual') clock.at = now();
      paused = true;
      try { audio.pause(); } catch (e) { /* nothing was loaded */ }
      stopTicker(); clearTimeout(gapTimer); gapTimer = null;
      freezeFold();
      pauseBtn.textContent = 'Resume';
      emit('pause');
    }
    function resume() {
      if (cur < 0 || !paused) return;
      paused = false; pauseBtn.textContent = 'Pause';
      emit('resume');
      if (gapWaiting) { gapTimer = setTimeout(nextStep, 600 / speed); return; }
      if (!clock) { // paused before the clip had loaded
        var p0 = audio.play(); if (p0 && p0['catch']) p0['catch'](function () {});
        return;
      }
      if (clock.mode === 'audio') { var p = audio.play(); if (p && p['catch']) p['catch'](function () {}); }
      else clock.base = Date.now();
      resumeFold(Math.max(300, (clock.dur - now()) / speed));
      startTicker();
    }
    function stop() { halt(); rest(); }
    function playFrom(k) {
      k = Math.max(0, Math.min(STEPS.length - 1, Math.floor(+k) || 0));
      run(k, false);
    }

    playBtn.addEventListener('click', function () { playFrom(0); });
    pauseBtn.addEventListener('click', function () { if (paused) resume(); else pause(); });
    steps.forEach(function (li, i) { li.querySelector('.es-listen').addEventListener('click', function () { playFrom(i); }); }); // Listen plays on from there to the end
    $('es-reset').addEventListener('click', function () { if (cur >= 0) stop(); else rest(); });
    list(root.querySelectorAll('.es-boardbar [data-button]')).forEach(function (b) {
      var spec = BOARD.buttons[+b.getAttribute('data-button')];
      b.addEventListener('click', function () {
        if (cur >= 0) return;
        try { def.actions[spec.action](api, spec.args || {}); } catch (e) { oops('button ' + spec.action, e); }
      });
    });
    $('es-transcript-btn').addEventListener('click', function () {
      var tr = $('es-transcript'), open = !has(tr, 'es-show');
      if (open) add(tr, 'es-show'); else rem(tr, 'es-show');
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* ---------- taps: equation lines, terms, folds, choices ---------- */
    function tappable(node, attr, cls) {
      var extra = document.createElement('span');
      extra.className = cls; extra.textContent = node.getAttribute(attr);
      node.parentNode.insertBefore(extra, node.nextSibling);
      node.setAttribute('tabindex', '0'); node.setAttribute('role', 'button'); node.setAttribute('aria-expanded', 'false');
      var toggle = function () {
        var open = !has(node, 'es-open');
        if (open) add(node, 'es-open'); else rem(node, 'es-open');
        node.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      node.addEventListener('click', toggle);
      node.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggle(); } });
    }
    list(root.querySelectorAll('.es-eq [data-how]')).forEach(function (n) { tappable(n, 'data-how', 'es-how'); });
    list(root.querySelectorAll('.es-term[data-def]')).forEach(function (n) { tappable(n, 'data-def', 'es-term-def'); });
    list(root.querySelectorAll('.es-fold')).forEach(function (f) {
      var body = document.createElement('div'), head = document.createElement('button'), mk = document.createElement('span');
      body.className = 'es-fold-body';
      while (f.firstChild) body.appendChild(f.firstChild);
      head.type = 'button'; head.className = 'es-fold-head'; head.setAttribute('aria-expanded', 'false');
      mk.className = 'es-fold-mark'; mk.textContent = '▸';
      head.appendChild(mk); head.appendChild(document.createTextNode(f.getAttribute('data-title') || 'More'));
      f.appendChild(head); f.appendChild(body); add(f, 'es-wired');
      head.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = !has(f, 'es-open');
        if (open) add(f, 'es-open'); else rem(f, 'es-open');
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    list(root.querySelectorAll('.es-choices')).forEach(function (box) {
      var want = box.getAttribute('data-answer'), why = box.getAttribute('data-why'), fb = box.parentNode.querySelector('.es-fb');
      var btns = list(box.querySelectorAll('button'));
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          var ok = b.textContent.replace(/^\s+|\s+$/g, '') === want;
          btns.forEach(function (x) { rem(x, 'es-right'); rem(x, 'es-wrong'); });
          add(b, ok ? 'es-right' : 'es-wrong');
          if (fb) fb.textContent = ok ? 'Yes.' + (why ? ' ' + why : '') : 'Not quite. Try again, or read on.';
        });
      });
    });

    /* ---------- practice: drag one element to its place ---------- */
    function grab(node, onDown, onMove, onUp) {
      var held = false;
      node.addEventListener('pointerdown', function (e) {
        if (!api.practising() || has(node, 'es-off') || !onDown(e)) return;
        held = true; add(node, 'es-held');
        try { node.setPointerCapture(e.pointerId); } catch (err) { /* older browsers: the move still arrives while over it */ }
        e.preventDefault();
      });
      node.addEventListener('pointermove', function (e) { if (held) onMove(e); });
      var up = function () { if (!held) return; held = false; rem(node, 'es-held'); onUp(); };
      node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
    }
    if (PRACTICE.kind === 'drag-snap') {
      (function () {
        var node = el(PRACTICE.drag), off = null, tol = PRACTICE.tolerance || 16;
        add(node, 'es-drag');
        grab(node, function (e) { var p = svgPoint(e), at = pos(node); off = [p.x - at[0], p.y - at[1]]; return true; },
          function (e) { var p = svgPoint(e); place(node, p.x - off[0], p.y - off[1]); },
          function () {
            var at = pos(node), dx = at[0] - PRACTICE.snap[0], dy = at[1] - PRACTICE.snap[1];
            if (Math.sqrt(dx * dx + dy * dy) < tol) { place(node, PRACTICE.snap[0], PRACTICE.snap[1]); finishPractice(); }
            else setReadout(PRACTICE.missText || 'Close, but not quite there. Try again.');
          });
      })();
    }

    /* ---------- practice: drag chips into their slots ---------- */
    var placedCount = 0;
    function resetOrder() { placedCount = 0; }
    if (PRACTICE.kind === 'order') {
      PRACTICE.chips.forEach(function (c) {
        var node = el(c.id), slot = el(c.slot), home = pos(node), off = null;
        add(node, 'es-chip');
        function centre() { var b = node.getBBox(), at = pos(node); return [at[0] + b.x + b.width / 2, at[1] + b.y + b.height / 2]; }
        function hit() {
          var p = centre(), found = null;
          PRACTICE.chips.forEach(function (o) {
            var s = el(o.slot).getBBox();
            if (p[0] > s.x - 8 && p[0] < s.x + s.width + 8 && p[1] > s.y - 8 && p[1] < s.y + s.height + 8) found = o.slot;
          });
          return found;
        }
        grab(node, function (e) {
          if (has(node, 'es-placed')) return false;
          var p = svgPoint(e), at = pos(node); off = [p.x - at[0], p.y - at[1]];
          node.parentNode.appendChild(node); // on top while it is carried
          return true;
        }, function (e) { var p = svgPoint(e); place(node, p.x - off[0], p.y - off[1]); },
          function () {
            var where = hit(), b, s, left;
            if (where !== c.slot) { place(node, home[0], home[1]); if (where) setReadout(PRACTICE.missText || 'Not there. Try another place.'); return; }
            b = node.getBBox(); s = slot.getBBox();
            place(node, s.x + s.width / 2 - (b.x + b.width / 2), s.y + s.height / 2 - (b.y + b.height / 2));
            add(node, 'es-placed'); add(slot, 'es-good'); placedCount++;
            runCues(c.placed);
            left = PRACTICE.chips.length - placedCount;
            if (left === 0) finishPractice(); else setReadout((PRACTICE.stepText || 'Right. {n} to go.').replace('{n}', String(left)));
          });
      });
    }
    if (PRACTICE.kind === 'custom' && def.practice) { try { def.practice(api); } catch (e) { oops('board.js practice', e); } }
    if (def.explore) { try { def.explore(api); } catch (e) { oops('board.js explore', e); } }

    /* ---------- the board and the caption never change size: reserve room for the longest of everything ---------- */
    function reserve() {
      var h = 0, keepHead = liveHead.textContent, keepText = liveText.textContent, keepRead = readoutEl.textContent;
      var groups = [[]], probe = ink.cloneNode(false);
      var gather = function (cues) { (cues || []).forEach(function (c) { if (c['do'] === 'wither' || c['do'] === 'reset') groups.push([]); else if (c['do'] === 'ink') groups[groups.length - 1].push(c); }); };
      STEPS.forEach(function (s) { s.lines.forEach(function (l) { gather(l.cues); }); });
      groups.push([]); gather(PRACTICE.done);
      probe.removeAttribute('id'); probe.style.cssText = 'position:absolute;visibility:hidden;min-height:0;left:0;top:0;width:' + ink.offsetWidth + 'px';
      boardEl.appendChild(probe);
      groups.forEach(function (g) {
        probe.innerHTML = '';
        g.forEach(function (c) { var d = document.createElement('div'); d.className = 'es-ink-line' + (c.cls ? ' es-' + c.cls : ''); d.innerHTML = c.html; probe.appendChild(d); });
        if (probe.offsetHeight > h) h = probe.offsetHeight;
      });
      boardEl.removeChild(probe);
      ink.style.minHeight = Math.max(58, h) + 'px';
      h = 0;
      live.style.minHeight = '0';
      STEPS.forEach(function (s, k) {
        s.lines.forEach(function (l) { setLive('Step ' + (k + 1) + ' · ' + s.title, l.say); if (live.offsetHeight > h) h = live.offsetHeight; });
      });
      live.style.minHeight = h + 'px'; setLive(keepHead, keepText);
      h = 0; readoutEl.style.minHeight = '0';
      [BOARD.readoutFresh, BOARD.readoutPractice, END_TEXT, PRACTICE.doneText, PRACTICE.missText].forEach(function (t) {
        if (!t) return; readoutEl.textContent = t; if (readoutEl.offsetHeight > h) h = readoutEl.offsetHeight;
      });
      readoutEl.style.minHeight = h + 'px'; readoutEl.textContent = keepRead;
    }
    var resizeTimer = null;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(reserve, 150); });

    window.esPlayer = {
      state: function () {
        return { step: cur, line: line, timeMs: Math.round(now()), playing: cur >= 0 && !paused, paused: paused, version: VERSION, practice: practice, played: played, steps: STEPS.length, clock: clock ? clock.mode : null };
      },
      pause: pause, resume: resume, playFrom: playFrom,
      stop: function () { if (cur >= 0) stop(); },
      buildAll: function () { if (cur >= 0) halt(); catchUp(STEPS.length); practice = 'off'; rem(boardEl, 'es-practising'); setLive('', ''); setReadout(END_TEXT); },
      solvePractice: function () { if (def.solve) def.solve(api); }
    };

    capture();
    rest(); // on load: the givens only. Nothing is derived until the tutor derives it.
    reserve();
  }
})();
