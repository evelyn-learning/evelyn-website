/*
 * Drawn teacher for a Keystone animated solution (samples, November 2026).
 *
 * A teacher is vector art drawn here, in the page: no video file and no
 * per-minute cost. The mouth is timed from the word timestamps that come back
 * with the voice recording: each word is turned into a short run of mouth
 * shapes from its spelling, spread over that word's start..end. Between words
 * the mouth rests. Eyes blink, the head moves a little, and the eyes glance up
 * at the board when a new caption line starts.
 *
 *   esTeacher.svg(teacher)                      → SVG markup for a portrait (also used on the picker cards)
 *   esTeacher.mount(holder, teacher, source)    → live teacher; source() returns
 *        { playing, step, ms, words: [[text, startMs, endMs], …], starts: [ms, …] } or null
 */
(function () {
  'use strict';

  var TEACHERS = [
    { key: 'hayes-r', kind: 'morph', name: 'Ms. Hayes', gender: 'female', dir: 'teachers/hayes-r' },
    { key: 'rivera-r', kind: 'morph', name: 'Ms. Rivera', gender: 'female', dir: 'teachers/rivera-r' },
    { key: 'hayes-m', kind: 'morph', name: 'Ms. Hayes (previous)', gender: 'female', dir: 'teachers/hayes-m' },
    { key: 'rivera-m', kind: 'morph', name: 'Ms. Rivera (previous)', gender: 'female', dir: 'teachers/rivera-m' },
    { key: 'chen3d', kind: 'film', name: 'Mr. Chen', gender: 'male', dir: 'teachers/chen3d' },
    { key: 'cole', kind: 'film', name: 'Mr. Cole', gender: 'male', dir: 'teachers/cole' },
  ];

  // ---------- portrait ----------

  function hairBack(t) {
    if (t.style === 'long') return '<path d="M52 92 C46 40 78 28 100 28 C124 28 156 40 148 94 C150 130 158 160 150 186 L50 186 C42 160 50 130 52 92 Z" fill="' + t.hair + '"/>';
    if (t.style === 'curly') {
      var c = [[62, 62, 24], [80, 42, 24], [104, 36, 25], [128, 44, 24], [142, 64, 23], [150, 90, 20], [52, 90, 20], [148, 112, 16], [54, 112, 16]], s = '';
      for (var i = 0; i < c.length; i++) s += '<circle cx="' + c[i][0] + '" cy="' + c[i][1] + '" r="' + c[i][2] + '" fill="' + t.hair + '"/>';
      return s;
    }
    return '';
  }

  function hairFront(t) {
    if (t.style === 'long') return '<path d="M56 84 C56 50 80 38 104 38 C128 38 146 52 145 86 C136 70 124 58 104 54 C92 66 72 70 56 84 Z" fill="' + t.hair + '"/>';
    if (t.style === 'curly') return '<path d="M58 78 C60 54 80 44 100 44 C122 44 140 54 142 78 C130 66 116 60 100 60 C84 60 70 66 58 78 Z" fill="' + t.hair + '"/>';
    var cap = '<path d="M55 86 C50 48 76 34 101 34 C128 34 150 48 145 86 C141 70 134 60 124 56 C108 62 84 62 72 56 C62 62 58 72 55 86 Z" fill="' + t.hair + '"/>';
    if (t.style === 'beard') cap += '<path d="M57 100 C58 132 76 148 100 148 C124 148 142 132 143 100 C138 118 128 126 118 122 C110 116 90 116 82 122 C72 126 62 118 57 100 Z" fill="' + t.hair + '"/>';
    return cap;
  }

  function svg(t, id) {
    id = id || t.key;
    var clip = 'tc-' + id, mclip = 'tm-' + id;
    return '' +
      '<svg class="tv-svg" viewBox="0 0 200 200" role="img" aria-label="' + t.name + '">' +
      '<defs><clipPath id="' + clip + '"><circle cx="100" cy="100" r="96"/></clipPath><clipPath id="' + mclip + '"><path data-p="mclip" d=""/></clipPath></defs>' +
      '<circle cx="100" cy="100" r="96" fill="' + t.bg + '"/>' +
      '<g clip-path="url(#' + clip + ')">' +
        '<g data-p="hairback">' + hairBack(t) + '</g>' +
        '<g data-p="body">' +
          '<path d="M28 204 C30 168 56 156 84 152 L116 152 C144 156 170 168 172 204 Z" fill="' + t.top + '"/>' +
          '<path d="M84 152 L100 172 L116 152 C110 148 90 148 84 152 Z" fill="#ffffff" opacity=".92"/>' +
        '</g>' +
        '<g data-p="head">' +
          '<path d="M86 132 L86 156 C92 164 108 164 114 156 L114 132 Z" fill="' + t.shade + '"/>' +
          '<ellipse cx="55" cy="96" rx="7" ry="11" fill="' + t.shade + '"/><ellipse cx="145" cy="96" rx="7" ry="11" fill="' + t.shade + '"/>' +
          '<path d="M56 88 C56 56 76 42 100 42 C124 42 144 56 144 88 C144 122 126 146 100 146 C74 146 56 122 56 88 Z" fill="' + t.skin + '"/>' +
          hairFront(t) +
          '<ellipse cx="72" cy="112" rx="9" ry="5" fill="#e2566a" opacity=".16"/><ellipse cx="128" cy="112" rx="9" ry="5" fill="#e2566a" opacity=".16"/>' +
          '<g data-p="eyes">' +
            '<ellipse cx="80" cy="92" rx="10" ry="8.6" fill="#ffffff"/><ellipse cx="120" cy="92" rx="10" ry="8.6" fill="#ffffff"/>' +
            '<g data-p="pupils"><circle cx="80" cy="92" r="5.8" fill="' + t.iris + '"/><circle cx="120" cy="92" r="5.8" fill="' + t.iris + '"/>' +
            '<circle cx="80" cy="92" r="2.9" fill="#0d0d12"/><circle cx="120" cy="92" r="2.9" fill="#0d0d12"/>' +
            '<circle cx="81.6" cy="90.4" r="1.5" fill="#ffffff"/><circle cx="121.6" cy="90.4" r="1.5" fill="#ffffff"/></g>' +
            '<ellipse data-p="lidL" cx="80" cy="83.5" rx="11.5" ry="0.1" fill="' + t.skin + '"/><ellipse data-p="lidR" cx="120" cy="83.5" rx="11.5" ry="0.1" fill="' + t.skin + '"/>' +
          '</g>' +
          '<g data-p="brows" stroke="' + t.brow + '" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M69 78 Q80 73 90 77"/><path d="M110 77 Q120 73 131 78"/></g>' +
          (t.glasses ? '<g fill="none" stroke="#2b2f3a" stroke-width="2.4"><rect x="66" y="82" width="28" height="21" rx="7"/><rect x="106" y="82" width="28" height="21" rx="7"/><path d="M94 91 Q100 88 106 91"/></g>' : '') +
          '<path d="M100 98 Q96 110 100 112 Q103 113 105 111" fill="none" stroke="' + t.shade + '" stroke-width="2.4" stroke-linecap="round"/>' +
          '<g transform="translate(100 126)">' +
            '<path data-p="mouth" d="" fill="#4a1722"/>' +
            '<g clip-path="url(#' + mclip + ')"><rect data-p="teeth" x="-24" y="-12" width="48" height="0" fill="#ffffff"/><ellipse data-p="tongue" cx="0" cy="10" rx="9" ry="0" fill="#d9697a"/></g>' +
            '<path data-p="lips" d="" fill="none" stroke="' + t.lip + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</g>' +
        '</g>' +
      '</g>' +
      '</svg>';
  }

  // ---------- mouth shapes: [half width, upper opening, lower opening, teeth, smile] ----------

  var SHAPES = {
    REST: [15, 0, 0, 0, 2.6], MBP: [14, 0, 0, 0, 0.4], AA: [15, 3, 14, 3, 0], EH: [16, 2.5, 8.5, 3, 0.5], EE: [19, 2, 4.5, 3.5, 1.6],
    OH: [10.5, 4, 11, 0, 0], OO: [7.5, 3, 6, 0, 0], FV: [14, 1, 2.5, 3, 0], L: [14, 2.5, 7, 3, 0.2], CONS: [15, 1.5, 3.6, 3, 0.5]
  };
  var OPEN = { AA: 1, EH: 1, EE: 1, OH: 1, OO: 1 };
  var DIGITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  var PAIRS = { th: 'L', sh: 'OO', ch: 'OO', ph: 'FV', oo: 'OO', ou: 'OH', ow: 'OH', ee: 'EE', ea: 'EE', ai: 'EH', ay: 'EH', oi: 'OH', wh: 'OO', qu: 'OO' };
  var ONE = { a: 'AA', e: 'EH', i: 'EE', o: 'OH', u: 'OO', y: 'EE', m: 'MBP', b: 'MBP', p: 'MBP', f: 'FV', v: 'FV', l: 'L', w: 'OO', r: 'OH' };

  /** A word's spelling → its run of mouth shapes (repeats merged). */
  function shapesFor(word) {
    var w = String(word).toLowerCase().replace(/\d/g, function (d) { return ' ' + DIGITS[+d] + ' '; }).replace(/[^a-z ]/g, '');
    if (/^\s*ph\s*$/.test(w)) w = 'pee aich';
    var out = [], i = 0, s;
    while (i < w.length) {
      if (w[i] === ' ') { i++; continue; }
      s = PAIRS[w.substr(i, 2)];
      if (s) i += 2; else { s = ONE[w[i]] || 'CONS'; i++; }
      if (w[i - 1] === 'e' && i === w.length && out.length > 1 && w.substr(i - 2, 2) !== 'ee') continue; // silent final e
      if (out[out.length - 1] !== s) out.push(s);
    }
    return out.length ? out : ['EH'];
  }

  /** The mouth shape at `ms` of a clip, from its timed words. */
  function shapeAt(words, ms, cache) {
    var i, w, run, total, k, at, span;
    for (i = 0; i < words.length; i++) {
      w = words[i];
      if (ms < w[1]) return 'REST';
      if (ms <= w[2] + 40) {
        run = cache[i] || (cache[i] = shapesFor(w[0]));
        total = 0;
        for (k = 0; k < run.length; k++) total += OPEN[run[k]] ? 2 : 1;
        at = (ms - w[1]) / Math.max(60, w[2] - w[1]) * total; span = 0;
        for (k = 0; k < run.length; k++) { span += OPEN[run[k]] ? 2 : 1; if (at <= span) return run[k]; }
        return run[run.length - 1];
      }
    }
    return 'REST';
  }

  function mouthD(m) { // m = [w, u, l, teeth, smile]
    var w = m[0], u = m[1], l = m[2], s = m[4], y = -s;
    return 'M' + (-w).toFixed(1) + ' ' + y.toFixed(1) +
      ' C' + (-w / 2).toFixed(1) + ' ' + (-u * 1.33 + s * 0.5).toFixed(1) + ' ' + (w / 2).toFixed(1) + ' ' + (-u * 1.33 + s * 0.5).toFixed(1) + ' ' + w.toFixed(1) + ' ' + y.toFixed(1) +
      ' C' + (w / 2).toFixed(1) + ' ' + (l * 1.33 + s * 0.7).toFixed(1) + ' ' + (-w / 2).toFixed(1) + ' ' + (l * 1.33 + s * 0.7).toFixed(1) + ' ' + (-w).toFixed(1) + ' ' + y.toFixed(1) + ' Z';
  }

  // ---------- the live teacher ----------

  function mount(holder, t, source) {
    holder.innerHTML = svg(t, t.key + '-live');
    function part(n) { return holder.querySelector('[data-p="' + n + '"]'); }
    var mouth = part('mouth'), lips = part('lips'), mclip = part('mclip'), teeth = part('teeth'), tongue = part('tongue');
    var hairback = part('hairback'), head = part('head'), body = part('body'), lidL = part('lidL'), lidR = part('lidR'), brows = part('brows'), pupils = part('pupils');
    var cur = SHAPES.REST.slice(), caches = {}, nextBlink = 1500, blinkAt = -1, lastLine = -1, lineAt = -1e9, t0 = Date.now(), stopped = false;
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 33); };

    function frame() {
      if (stopped) return;
      var now = Date.now() - t0, st = null, name = 'REST', i, line = -1, lid = 0.1, talk = false;
      try { st = source(); } catch (e) { st = null; }
      if (st && st.playing && st.words) {
        talk = true;
        name = shapeAt(st.words, st.ms, caches[st.step] || (caches[st.step] = {}));
        if (st.starts) for (i = 0; i < st.starts.length; i++) if (st.starts[i] <= st.ms) line = st.step * 100 + i;
        if (line !== lastLine) { lastLine = line; lineAt = now; }
      }
      var target = SHAPES[name], ease = name === 'REST' ? 0.22 : 0.42;
      for (i = 0; i < 5; i++) cur[i] += (target[i] - cur[i]) * ease;
      var d = mouthD(cur);
      mouth.setAttribute('d', d); lips.setAttribute('d', d); mclip.setAttribute('d', d);
      teeth.setAttribute('y', (-cur[1] * 1.1 - 1).toFixed(1)); teeth.setAttribute('height', Math.max(0, Math.min(cur[3], cur[1] + cur[2] - 1)).toFixed(1));
      tongue.setAttribute('cy', (cur[2] * 0.95).toFixed(1)); tongue.setAttribute('ry', (cur[2] > 6 ? cur[2] * 0.42 : 0).toFixed(1));

      if (now > nextBlink) { blinkAt = now; nextBlink = now + 2600 + Math.random() * 3200; }
      if (blinkAt >= 0) { var b = (now - blinkAt) / 150; lid = b >= 1 ? 0.1 : 0.1 + 10 * Math.sin(Math.PI * b); if (b >= 1) blinkAt = -1; }
      lidL.setAttribute('ry', lid.toFixed(1)); lidR.setAttribute('ry', lid.toFixed(1));
      lidL.setAttribute('cy', (83.5 + lid * 0.85).toFixed(1)); lidR.setAttribute('cy', (83.5 + lid * 0.85).toFixed(1));

      if (!reduce) {
        var since = now - lineAt, glance = since < 1300 ? Math.sin(Math.PI * since / 1300) : 0, lift = since < 700 ? Math.sin(Math.PI * since / 700) : 0;
        var sway = Math.sin(now / 1700) * (talk ? 1.6 : 0.7), nod = talk ? Math.sin(now / 430) * 0.9 : 0;
        if (hairback) hairback.setAttribute('transform', 'rotate(' + (sway * 0.6).toFixed(2) + ' 100 150)');
        head.setAttribute('transform', 'translate(0 ' + nod.toFixed(2) + ') rotate(' + sway.toFixed(2) + ' 100 150)');
        body.setAttribute('transform', 'translate(0 ' + (Math.sin(now / 1900) * 0.8).toFixed(2) + ')');
        brows.setAttribute('transform', 'translate(0 ' + (-2.6 * lift).toFixed(2) + ')');
        pupils.setAttribute('transform', 'translate(' + (-1.2 * glance).toFixed(2) + ' ' + (-2.4 * glance).toFixed(2) + ')');
      }
      raf(frame);
    }
    raf(frame);
    return { stop: function () { stopped = true; } };
  }


  // ---------- the illustrated ("film look") teacher: stacked picture layers ----------
  //
  // base.jpg is the resting face. The ten mouth layers are the same picture
  // with only the mouth area redrawn; `half` and `blink` have only the eye
  // area. The step's `vis` timeline ([[ms, key], …], built from the
  // pronunciation dictionary) says which mouth belongs to each moment.

  var FILM_KEYS = ['A', 'E', 'O', 'U', 'F', 'C', 'M', 'S', 'L', 'H'];

  function card(t) {
    if (t.kind !== 'film' && t.kind !== 'morph') return svg(t, t.key + '-card');
    return '<img class="tv-svg tv-photo" src="' + t.dir + '/base.jpg" alt="' + t.name + '">';
  }

  function indexAt(vis, ms) {
    var lo = 0, hi = vis.length - 1, at = -1, mid;
    while (lo <= hi) { mid = (lo + hi) >> 1; if (vis[mid][0] <= ms) { at = mid; lo = mid + 1; } else hi = mid - 1; }
    return at;
  }
  function keyAt(vis, ms) { var i = indexAt(vis, ms); return i < 0 ? 'R' : vis[i][1]; }
  function smooth(x) { return x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x); }

  /**
   * How much of each mouth is showing at `ms`. Between two neighbouring
   * entries of the timeline the mouth moves from one shape to the next over a
   * window centred on the change (up to 110 ms, never more than the shapes
   * themselves last), so the lips are almost always in motion, as in speech,
   * and never snap. Returns { key: weight } with the weights adding up to 1.
   */
  function mixAt(vis, ms, win) {
    win = win || 110;
    var i = indexAt(vis, ms), out = {}, cur = i < 0 ? 'R' : vis[i][1];
    var start = i < 0 ? -1e9 : vis[i][0], end = i + 1 < vis.length ? vis[i + 1][0] : 1e9, len = end - start, w, half, p;
    out[cur] = 1;
    if (i + 1 < vis.length) { // leaving for the next shape
      var nextLen = i + 2 < vis.length ? vis[i + 2][0] - end : 400;
      w = Math.min(win, len, nextLen); half = w / 2;
      if (ms > end - half) { p = smooth((ms - (end - half)) / w); out[cur] = 1 - p; out[vis[i + 1][1]] = (out[vis[i + 1][1]] || 0) + p; return out; }
    }
    if (i >= 0) { // still arriving from the one before
      var prev = i > 0 ? vis[i - 1][1] : 'R', prevLen = i > 0 ? start - vis[i - 1][0] : 400;
      w = Math.min(win, len, prevLen); half = w / 2;
      if (ms < start + half) { p = smooth((ms - (start - half)) / w); out[cur] = p; out[prev] = (out[prev] || 0) + 1 - p; }
    }
    return out;
  }

  function mountFilm(holder, t, source) {
    var html = '<div class="tv-film"><div class="tv-film-in"><img src="' + t.dir + '/base.jpg" alt="' + t.name + '">', i;
    for (i = 0; i < FILM_KEYS.length; i++) html += '<img data-k="' + FILM_KEYS[i] + '" src="' + t.dir + '/' + FILM_KEYS[i] + '.png" alt="" style="opacity:0">';
    html += '<img data-k="half" src="' + t.dir + '/half.png" alt="" style="opacity:0"><img data-k="blink" src="' + t.dir + '/blink.png" alt="" style="opacity:0"></div></div>';
    holder.innerHTML = html;
    var inner = holder.querySelector('.tv-film-in'), layers = {}, blink = holder.querySelector('[data-k="blink"]'), halfLid = holder.querySelector('[data-k="half"]');
    FILM_KEYS.forEach(function (k) { layers[k] = holder.querySelector('[data-k="' + k + '"]'); });
    var t0 = Date.now(), nextBlink = 1800, blinkAt = -1, stopped = false, lineAt = -1e9, lastLine = -1, nodAt = -1e9, lastIdx = -1, talkLevel = 0, last = t0;
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 33); };
    function frame() {
      if (stopped) return;
      var nowAbs = Date.now(), dt = Math.min(80, nowAbs - last), now = nowAbs - t0, st = null, mix = { R: 1 }, talk = false, k, line = -1, order, shown, a, idx;
      last = nowAbs;
      try { st = source(); } catch (e) { st = null; }
      if (st && st.playing && st.vis) {
        talk = true; mix = mixAt(st.vis, st.ms + 40); // the mouth leads the sound a little, as real lips do
        idx = indexAt(st.vis, st.ms + 40);
        if (idx !== lastIdx) { lastIdx = idx; if (idx >= 0 && (st.vis[idx][1] === 'A' || st.vis[idx][1] === 'H') && now - nodAt > 500) nodAt = now; } // a small nod on an open, stressed vowel
        if (st.starts) for (k = 0; k < st.starts.length; k++) if (st.starts[k] <= st.ms) line = st.step * 100 + k;
        if (line !== lastLine) { lastLine = line; lineAt = now; }
      }
      // Layers are opaque where they draw, so stacking two with weights a (below) and b (above) needs: below fully in, above at b / (a + b).
      order = FILM_KEYS.filter(function (key) { return mix[key] > 0.001; }).sort(function (x, y) { return mix[y] - mix[x]; });
      shown = mix.R || 0;
      for (k = 0; k < FILM_KEYS.length; k++) if (order.indexOf(FILM_KEYS[k]) < 0) layers[FILM_KEYS[k]].style.opacity = '0';
      for (k = order.length - 1; k >= 0; k--) { // smallest share on top
        var key = order[order.length - 1 - k], wgt = mix[key];
        a = shown + wgt > 0 ? wgt / (shown + wgt) : 0; shown += wgt;
        layers[key].style.opacity = a.toFixed(3); layers[key].style.zIndex = String(2 + k);
      }
      // blink: half, closed, half, each eased, about a fifth of a second in all
      if (now > nextBlink) { blinkAt = now; nextBlink = now + 2400 + Math.random() * 3600; }
      var b = blinkAt < 0 ? 1 : (now - blinkAt) / 210, closed = 0, halfO = 0;
      if (b < 1) { var c = Math.sin(Math.PI * b); halfO = smooth(c / 0.55); closed = smooth((c - 0.5) / 0.4); } else blinkAt = -1;
      halfLid.style.opacity = halfO.toFixed(2); blink.style.opacity = closed.toFixed(2);
      if (!reduce) {
        talkLevel += ((talk ? 1 : 0) - talkLevel) * Math.min(1, dt / 400);
        var since = now - lineAt, lift = since < 700 ? Math.sin(Math.PI * since / 700) : 0, sn = now - nodAt, nodHit = sn < 380 ? Math.sin(Math.PI * sn / 380) : 0;
        var sway = Math.sin(now / 2300) * (0.6 + 0.9 * talkLevel) + Math.sin(now / 870 + 1) * 0.45 * talkLevel;
        var nod = Math.sin(now / 2100) * 0.6 + nodHit * 1.5 * talkLevel - lift * 1.4;
        inner.style.transform = 'translate(' + (sway * 0.6).toFixed(2) + 'px,' + nod.toFixed(2) + 'px) rotate(' + sway.toFixed(2) + 'deg) scale(' + (1.04 + nodHit * 0.006).toFixed(4) + ')';
      }
      raf(frame);
    }
    raf(frame);
    return { stop: function () { stopped = true; } };
  }

  // ---------- the morphing teacher: real in-between frames ----------
  //
  // mouth.jpg holds the eleven mouth states and, for every pair of them, three
  // frames in between (made once, offline, by motion interpolation). Going
  // from one mouth to another therefore plays real movement: state, three
  // in-betweens, state, with a light blend between neighbouring frames so the
  // motion has no steps. eyes.jpg does the same from open to closed. Layout
  // comes from morph.json, which the page build puts in window.esMorph[key].

  function mountMorph(holder, t, source) {
    var M = (window.esMorph || {})[t.key], K = M.keys, n = K.length, steps = M.steps, index = {}, i;
    for (i = 0; i < n; i++) index[K[i]] = i;
    function pairStart(a, b) { return n + (a * (2 * n - a - 1) / 2 + (b - a - 1)) * steps; } // a < b
    function cellOf(a, b, f) { return f <= 0 ? a : f >= steps + 1 ? b : pairStart(a, b) + f - 1; }
    function box(m, cls) {
      return '<div class="tv-morph ' + cls + '" style="left:' + (m.left * 100).toFixed(3) + '%;top:' + (m.top * 100).toFixed(3) + '%;width:' + (m.width * 100).toFixed(3) + '%;height:' + (m.height * 100).toFixed(3) +
        '%;background-image:url(' + t.dir + '/' + (cls.indexOf('eyes') >= 0 ? 'eyes.jpg' : 'mouth.jpg') + ');background-size:' + (m.cols * 100) + '% ' + (m.rows * 100) + '%"></div>';
    }
    holder.innerHTML = '<div class="tv-film tv-film-big"><div class="tv-film-in"><img src="' + t.dir + '/base.jpg" alt="' + t.name + '">' +
      box(M.mouth, 'tv-m1') + box(M.mouth, 'tv-m2') + box(M.eyes, 'tv-eyes tv-e1') + box(M.eyes, 'tv-eyes tv-e2') + '</div></div>';
    var inner = holder.querySelector('.tv-film-in'), m1 = holder.querySelector('.tv-m1'), m2 = holder.querySelector('.tv-m2'), e1 = holder.querySelector('.tv-e1'), e2 = holder.querySelector('.tv-e2');
    function show(el, m, cell) {
      var col = cell % m.cols, row = (cell / m.cols) | 0;
      el.style.backgroundPosition = (m.cols > 1 ? col / (m.cols - 1) * 100 : 0).toFixed(3) + '% ' + (m.rows > 1 ? row / (m.rows - 1) * 100 : 0).toFixed(3) + '%';
    }
    var t0 = Date.now(), last = t0, nextBlink = 1800, blinkAt = -1, stopped = false, lineAt = -1e9, lastLine = -1, nodAt = -1e9, lastIdx = -1, talkLevel = 0;
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 33); };
    function frame() {
      if (stopped) return;
      var nowAbs = Date.now(), dt = Math.min(80, nowAbs - last), now = nowAbs - t0, st = null, mix = { R: 1 }, talk = false, k, line = -1, idx;
      last = nowAbs;
      try { st = source(); } catch (e) { st = null; }
      if (st && st.playing && st.vis) {
        talk = true; mix = mixAt(st.vis, st.ms + 50, 170); // the mouth leads the sound a little, as real lips do
        idx = indexAt(st.vis, st.ms + 50);
        if (idx !== lastIdx) { lastIdx = idx; if (idx >= 0 && (st.vis[idx][1] === 'A' || st.vis[idx][1] === 'H') && now - nodAt > 500) nodAt = now; }
        if (st.starts) for (k = 0; k < st.starts.length; k++) if (st.starts[k] <= st.ms) line = st.step * 100 + k;
        if (line !== lastLine) { lastLine = line; lineAt = now; }
      }
      // mouth: where we are between the two states in play
      var keys = [], a, b, pos, f, frac;
      for (k in mix) if (mix[k] > 0.0005 && index[k] != null) keys.push(k);
      keys.sort(function (x, y) { return index[x] - index[y]; });
      a = index[keys[0]]; b = keys.length > 1 ? index[keys[keys.length - 1]] : a;
      pos = a === b ? 0 : mix[K[b]] / (mix[K[a]] + mix[K[b]]) * (steps + 1);
      f = Math.floor(pos); frac = pos - f;
      show(m1, M.mouth, cellOf(a, b, f)); show(m2, M.mouth, cellOf(a, b, Math.min(steps + 1, f + 1)));
      m2.style.opacity = frac.toFixed(3);
      // blink: open, five in-betweens, closed, and back; about a quarter of a second
      if (now > nextBlink) { blinkAt = now; nextBlink = now + 2400 + Math.random() * 3600; }
      var bl = blinkAt < 0 ? 1 : (now - blinkAt) / 260, lid = 0;
      if (bl < 1) lid = smooth(Math.sin(Math.PI * bl)); else blinkAt = -1;
      var ep = lid * (M.eyes.steps + 1), ef = Math.floor(ep), efr = ep - ef; // 0 = open (base shows), steps + 1 = closed
      e1.style.opacity = ef >= 1 ? '1' : '0'; if (ef >= 1) show(e1, M.eyes, ef - 1);
      show(e2, M.eyes, Math.min(M.eyes.steps, ef)); e2.style.opacity = (ef > M.eyes.steps ? 0 : efr).toFixed(3);
      if (!reduce) {
        talkLevel += ((talk ? 1 : 0) - talkLevel) * Math.min(1, dt / 400);
        var since = now - lineAt, lift = since < 700 ? Math.sin(Math.PI * since / 700) : 0, sn = now - nodAt, nodHit = sn < 420 ? Math.sin(Math.PI * sn / 420) : 0;
        var sway = Math.sin(now / 2300) * (0.6 + 0.9 * talkLevel) + Math.sin(now / 870 + 1) * 0.45 * talkLevel;
        var nod = Math.sin(now / 2100) * 0.8 + nodHit * 2 * talkLevel - lift * 1.8;
        inner.style.transform = 'translate(' + (sway * 0.8).toFixed(2) + 'px,' + nod.toFixed(2) + 'px) rotate(' + sway.toFixed(2) + 'deg) scale(' + (1.04 + nodHit * 0.006).toFixed(4) + ')';
      }
      raf(frame);
    }
    raf(frame);
    return { stop: function () { stopped = true; } };
  }


  window.esTeacher = {
    TEACHERS: TEACHERS, svg: svg, card: card, shapesFor: shapesFor, shapeAt: shapeAt, keyAt: keyAt, mixAt: mixAt,
    mount: function (holder, t, source) { return t.kind === 'morph' ? mountMorph(holder, t, source) : t.kind === 'film' ? mountFilm(holder, t, source) : mount(holder, t, source); }
  };
})();
