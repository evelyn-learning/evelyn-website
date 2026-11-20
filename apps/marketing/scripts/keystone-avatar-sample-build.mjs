/**
 * Avatar samples: wraps one built animated solution with a "choose your
 * teacher" picker, a drawn teacher beside the live caption, and a choice of
 * recorded voices (accents).
 *
 *   node apps/marketing/scripts/keystone-avatar-sample-build.mjs <animated-out>/<itemId>/solution.html <sampleDir>
 *
 * <sampleDir> must already hold voices.json + audio/<key>/step-N.mp3 (from
 * keystone-avatar-voices.ts). Writes <sampleDir>/solution.html, which opens
 * straight from disk. The player itself is not changed: a small script placed
 * before it points its audio at the chosen voice and gives it that voice's
 * line timings. Choice is kept in the address (?teacher=…&accent=…).
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [src, outDir] = process.argv.slice(2);
if (!src || !outDir) { console.error("Usage: keystone-avatar-sample-build.mjs <solution.html> <sampleDir>"); process.exit(1); }
const here = path.dirname(fileURLToPath(import.meta.url));
const teacherJs = await readFile(path.join(here, "../src/lib/keystone/avatar/teacher.js"), "utf8");
const voices = JSON.parse(await readFile(path.join(outDir, "voices.json"), "utf8"));
let html = await readFile(src, "utf8");

const css = `
.tv-pick { border: 1px solid #e6ebf2; border-radius: 10px; padding: 12px 14px; margin: 0 0 14px 0; background: #fbfcfe; font-family: Arial, Helvetica, sans-serif; }
.tv-pick h3 { margin: 0 0 8px 0; font-size: 12pt; color: #14213a; }
.tv-cards { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 10px 0; }
.ai-solution button.tv-card { width: 104px; min-height: 0; box-shadow: none; padding: 8px 6px 6px; border: 2px solid #e6ebf2; border-radius: 12px; background: #fff; cursor: pointer; text-align: center; font: inherit; color: #14213a; }
.tv-card .tv-svg { width: 76px; height: 76px; display: block; margin: 0 auto 4px; }
.tv-card b { display: block; font-size: 10pt; }
.ai-solution button.tv-card[aria-pressed="true"] { border-color: #7a2a8e; background: #f8f1fb; }
.tv-row2 { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 10pt; color: #44506a; }
.ai-solution button.tv-chip { min-height: 0; box-shadow: none; border: 1.5px solid #7a2a8e; color: #7a2a8e; background: #fff; border-radius: 999px; padding: 4px 12px; font: inherit; font-weight: bold; cursor: pointer; }
.ai-solution button.tv-chip[aria-pressed="true"] { background: #7a2a8e; color: #fff; }
.tv-speak { display: flex; align-items: flex-start; gap: 10px; margin: 6px 0 4px 0; }
.tv-face { flex: none; width: 92px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 8.5pt; color: #44506a; }
.tv-face .tv-svg { width: 92px; height: 92px; display: block; }
.tv-speak .es-live { flex: 1; min-width: 0; }
`;

const pre = `
(function () {
  var VOICES = ${JSON.stringify(voices)};
  var q = new URLSearchParams(location.search);
  var T = window.esTeacher.TEACHERS, teacher = T.filter(function (t) { return t.key === q.get('teacher'); })[0] || T[0];
  var accent = { us: 1, ca: 1, gb: 1 }[q.get('accent')] ? q.get('accent') : 'ca';
  var voice = VOICES[accent + (teacher.gender === 'female' ? '-f' : '-m')];
  window.esSample = { teacher: teacher, accent: accent, voice: voice, audio: null };
  // The chosen voice's line timings go into the spec the player is about to read.
  var specEl = document.getElementById('es-spec'), data = JSON.parse(specEl.textContent);
  data.timing = { steps: voice.steps.map(function (s) { return { file: s.file, durationMs: s.durationMs, starts: s.starts, timing: 'aligned' }; }) };
  specEl.textContent = JSON.stringify(data);
  // The player asks for audio/step-N.mp3; hand it the chosen voice's clip, and keep hold of the audio element.
  var Real = window.Audio, desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
  window.Audio = function () {
    var a = new Real();
    Object.defineProperty(a, 'src', {
      get: function () { return desc.get.call(a); },
      set: function (v) { var m = /step-(\\d+)\\.mp3/.exec(v); a._step = m ? +m[1] - 1 : -1; desc.set.call(a, String(v).replace(/^audio\\//, 'audio/' + voice.key + '/')); }
    });
    window.esSample.audio = a;
    return a;
  };
})();
`;

const post = `
(function () {
  var S = window.esSample, T = window.esTeacher, root = document.getElementById('es-root');
  function go(teacher, accent) { location.search = '?teacher=' + teacher + '&accent=' + accent; }
  // picker
  var pick = document.createElement('div'); pick.className = 'tv-pick';
  var names = { ca: 'Canadian', gb: 'British', us: 'American' };
  pick.innerHTML = '<h3>Choose your teacher</h3><div class="tv-cards">' + T.TEACHERS.map(function (t) {
    return '<button type="button" class="tv-card" data-t="' + t.key + '" aria-pressed="' + (t.key === S.teacher.key) + '">' + T.svg(t, t.key + '-card') + '<b>' + t.name + '</b></button>';
  }).join('') + '</div><div class="tv-row2"><span>Accent:</span>' + ['ca', 'gb', 'us'].map(function (a) {
    return '<button type="button" class="tv-chip" data-a="' + a + '" aria-pressed="' + (a === S.accent) + '">' + names[a] + '</button>';
  }).join('') + '<span>Voice now: ' + S.voice.name + ' (' + S.voice.accent + ', ' + S.voice.gender + ')</span></div>';
  var bar = root.querySelector('.es-bar'); bar.parentNode.insertBefore(pick, bar);
  // The card portraits get a resting smile.
  Array.prototype.forEach.call(pick.querySelectorAll('.tv-card'), function (c) {
    var d = 'M-15 -2.6 C-7.5 1.3 7.5 1.3 15 -2.6 C7.5 1.8 -7.5 1.8 -15 -2.6 Z';
    c.querySelector('[data-p="mouth"]').setAttribute('d', d); c.querySelector('[data-p="lips"]').setAttribute('d', d);
    c.addEventListener('click', function () { go(c.getAttribute('data-t'), S.accent); });
  });
  Array.prototype.forEach.call(pick.querySelectorAll('.tv-chip'), function (c) { c.addEventListener('click', function () { go(S.teacher.key, c.getAttribute('data-a')); }); });
  // the teacher beside the live caption
  var live = document.getElementById('es-live'), row = document.createElement('div'), face = document.createElement('div'), holder = document.createElement('div');
  row.className = 'tv-speak'; face.className = 'tv-face';
  live.parentNode.insertBefore(row, live); face.appendChild(holder);
  var label = document.createElement('div'); label.textContent = S.teacher.name; face.appendChild(label);
  row.appendChild(face); row.appendChild(live);
  T.mount(holder, S.teacher, function () {
    var a = S.audio; if (!a || a._step == null || a._step < 0) return null;
    var st = S.voice.steps[a._step]; if (!st) return null;
    return { playing: !a.paused && !a.ended, step: a._step, ms: a.currentTime * 1000, words: st.words, starts: st.starts };
  });
})();
`;

const specAt = html.indexOf('<script type="application/json" id="es-spec">');
const playerAt = html.indexOf("<script>", html.indexOf("</script>", specAt));
if (specAt < 0 || playerAt < 0) throw new Error("this page does not look like a built animated solution");
html = html.slice(0, playerAt) + `<script>${teacherJs}</script>\n<script>${pre}</script>\n` + html.slice(playerAt);
const bootAt = html.lastIndexOf("</body>");
html = html.slice(0, bootAt) + `<script>${post}</script>\n` + html.slice(bootAt);
html = html.replace("</head>", `<style>${css}</style>\n</head>`);
await writeFile(path.join(outDir, "solution.html"), html);
console.log(`Wrote ${path.join(outDir, "solution.html")} (${Object.keys(voices).length} voices)`);
