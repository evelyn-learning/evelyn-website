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
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const [src, outDir, dictFile] = process.argv.slice(2);
if (!src || !outDir || !dictFile) { console.error("Usage: keystone-avatar-sample-build.mjs <solution.html> <sampleDir> <cmudict.dict>"); process.exit(1); }
const here = path.dirname(fileURLToPath(import.meta.url));
const teacherJs = await readFile(path.join(here, "../src/lib/keystone/avatar/teacher.js"), "utf8");
const voices = JSON.parse(await readFile(path.join(outDir, "voices.json"), "utf8"));
let html = await readFile(src, "utf8");

// ---------- mouth timeline from real pronunciation ----------
// Each timed word is looked up in the CMU pronouncing dictionary; its sounds
// become mouth frames spread over the word's start..end (vowels get more time,
// only a stressed, loud open vowel opens the mouth fully, and shapes too short
// for real lips are dropped). Long silences rest the mouth. Result per step: vis = [[ms, key], …], key R = rest.
const dict = new Map();
for (const line of (await readFile(dictFile, "utf8")).split("\n")) {
  const m = /^([^\s(]+)(?:\(\d+\))?\s+(.+?)(?:\s+#.*)?$/.exec(line);
  if (m && !dict.has(m[1])) dict.set(m[1], m[2].trim().split(/\s+/));
}
const DIGIT = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
function sounds(word) {
  const out = [];
  for (const part of String(word).replace(/\d/g, (d) => ` ${DIGIT[+d]} `).replace(/[^A-Za-z' ]/g, " ").split(/\s+/).filter(Boolean)) {
    const hit = dict.get(part.toLowerCase());
    if (hit && !(part.length > 1 && part === part.toUpperCase() && part.length <= 4 && !/[AEIOU]/.test(part))) out.push(...hit);
    else if (hit && part !== part.toUpperCase()) out.push(...hit);
    else if (part === part.toUpperCase() && part.length <= 8) for (const ch of part) out.push(...(dict.get(ch.toLowerCase()) ?? ["AH0"]));
    else if (hit) out.push(...hit);
    else for (const ch of part.toLowerCase()) out.push("aeiou".includes(ch) ? { a: "AE1", e: "EH1", i: "IH1", o: "AO1", u: "UH1" }[ch] : "mbp".includes(ch) ? "M" : "fv".includes(ch) ? "F" : "T");
  }
  return out;
}
function framesOf(ph) {
  const stress = /\\d$/.test(ph) ? +ph.slice(-1) : -1, p = ph.replace(/\\d$/, "");
  const weak = stress === 0, strong = stress === 1;
  switch (p) {
    case "AA": return [[weak ? "C" : strong ? "A" : "H", 2]];
    case "AE": return [[weak ? "C" : strong ? "A" : "H", 2]];
    case "AH": return [[weak ? "C" : "H", weak ? 1.2 : 1.8]];
    case "AY": return weak ? [["H", 2]] : [["A", 1.4], ["E", 1]];
    case "AW": return weak ? [["H", 2]] : [["A", 1.4], ["U", 1]];
    case "AO": return [["O", 2]];
    case "OW": return [["O", 1.5], ["U", 0.8]];
    case "OY": return [["O", 1.4], ["E", 1]];
    case "UW": case "UH": return [["U", 2]];
    case "W": return [["U", 1]];
    case "IY": case "EY": return [[weak ? "S" : "E", 2]];
    case "EH": return [[weak ? "C" : "H", 1.7]];
    case "IH": return [[weak ? "C" : "E", 1.5]];
    case "ER": return [["C", 1.6]];
    case "R": return [["C", 1]];
    case "F": case "V": return [["F", 1]];
    case "M": case "B": case "P": return [["M", 1]];
    case "L": case "TH": case "DH": return [["L", 1]];
    case "S": case "Z": case "T": case "D": case "N": case "SH": case "CH": case "JH": case "ZH": return [["S", 1]];
    default: return [["C", 1]]; // K G HH NG Y
  }
}
function loudness(file) { // 20 ms loudness of the recording, 0..1 against its own loud level
  const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-f", "s16le", "-ac", "1", "-ar", "8000", "-"], { maxBuffer: 1 << 28 });
  const win = 160, rms = [];
  for (let i = 0; i + win * 2 <= pcm.length; i += win * 2) { let a = 0; for (let j = 0; j < win; j++) { const v = pcm.readInt16LE(i + j * 2); a += v * v; } rms.push(Math.sqrt(a / win)); }
  const peak = [...rms].sort((a, b) => a - b)[Math.floor(rms.length * 0.95)] || 1;
  return rms.map((v) => Math.min(1, v / peak));
}
function timeline(words, loud) {
  const at20 = (ms) => loud[Math.max(0, Math.min(loud.length - 1, Math.round(ms / 20)))] ?? 0;
  let vis = [];
  words.forEach((w, i) => {
    const [text, a, b] = w, run = sounds(text).flatMap(framesOf), total = run.reduce((s, r) => s + r[1], 0) || 1, span = Math.max(80, b - a);
    let at = a;
    for (const [k, wgt] of run) { vis.push([at, k, (span * wgt) / total]); at += (span * wgt) / total; }
    const next = words[i + 1];
    if (!next || next[1] - b > 110) vis.push([b + 40, "R", next ? next[1] - b - 40 : 400]);
  });
  // How loud the voice is decides how far the mouth opens: a quiet open vowel is half open, a quiet half-open one is small.
  vis = vis.map(([ms, k, d]) => { const l = Math.max(at20(ms + d * 0.3), at20(ms + d * 0.6)); return [ms, k === "A" && l < 0.5 ? "H" : k === "H" && l < 0.28 ? "C" : k, d]; });
  // A long silence inside the words rests the mouth.
  let from = -1; const quiet = [];
  loud.forEach((v, i) => { const q = v < 0.05; if (q && from < 0) from = i; if (!q && from >= 0) { if (i - from >= 11) quiet.push([from * 20 + 20, i * 20]); from = -1; } });
  vis = vis.filter(([ms]) => !quiet.some(([f, t]) => ms >= f && ms < t));
  for (const [f] of quiet) vis.push([f, "R", 220]);
  vis.sort((x, y) => x[0] - y[0]);
  // Lips cannot change shape faster than about every 55 ms: a shorter shape is dropped, unless it is a lip closure (M, F), which is always seen.
  const out = [];
  for (let i = 0; i < vis.length; i++) {
    const [ms, k] = vis[i], len = (vis[i + 1]?.[0] ?? ms + 300) - ms, prev = out[out.length - 1];
    if (prev && prev[1] === k) continue;
    if (len < 55 && k !== "M" && k !== "F" && out.length) continue;
    out.push([Math.round(ms), k]);
  }
  return out;
}
let unknown = new Set();
for (const v of Object.values(voices)) for (const st of v.steps) {
  for (const w of st.words) for (const part of String(w[0]).replace(/[^A-Za-z' ]/g, " ").split(/\s+/).filter(Boolean)) if (!dict.has(part.toLowerCase())) unknown.add(part);
  st.vis = timeline(st.words, loudness(path.join(outDir, st.file)));
}
console.log(`Words not in the dictionary (spelled out or guessed): ${[...unknown].join(", ") || "none"}`);

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
.tv-photo { border-radius: 50%; object-fit: cover; }
.tv-face.tv-big { width: 124px; }
.tv-film { width: 124px; height: 124px; border-radius: 50%; overflow: hidden; box-shadow: 0 2px 10px rgba(20,33,58,.18); background: #dfe6ee; }
.tv-film-in { position: relative; width: 100%; height: 100%; transform-origin: 50% 85%; will-change: transform; }
.tv-speak.tv-stack { flex-direction: column; align-items: center; }
.tv-speak.tv-stack .es-live { align-self: stretch; flex: none; }
.tv-face.tv-huge { width: 176px; }
.tv-film.tv-film-big { width: 176px; height: 176px; }
.tv-morph { position: absolute; background-repeat: no-repeat; -webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 80%); mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 80%); }
.tv-film-in img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: block; }
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
    return '<button type="button" class="tv-card" data-t="' + t.key + '" aria-pressed="' + (t.key === S.teacher.key) + '">' + T.card(t) + '<b>' + t.name + '</b></button>';
  }).join('') + '</div><div class="tv-row2"><span>Accent:</span>' + ['ca', 'gb', 'us'].map(function (a) {
    return '<button type="button" class="tv-chip" data-a="' + a + '" aria-pressed="' + (a === S.accent) + '">' + names[a] + '</button>';
  }).join('') + '<span>Voice now: ' + S.voice.name + ' (' + S.voice.accent + ', ' + S.voice.gender + ')</span></div>';
  var bar = root.querySelector('.es-bar'); bar.parentNode.insertBefore(pick, bar);
  // The card portraits get a resting smile.
  Array.prototype.forEach.call(pick.querySelectorAll('.tv-card'), function (c) {
    if (!c.querySelector('[data-p="mouth"]')) { c.addEventListener('click', function () { go(c.getAttribute('data-t'), S.accent); }); return; }
    var d = 'M-15 -2.6 C-7.5 1.3 7.5 1.3 15 -2.6 C7.5 1.8 -7.5 1.8 -15 -2.6 Z';
    c.querySelector('[data-p="mouth"]').setAttribute('d', d); c.querySelector('[data-p="lips"]').setAttribute('d', d);
    c.addEventListener('click', function () { go(c.getAttribute('data-t'), S.accent); });
  });
  Array.prototype.forEach.call(pick.querySelectorAll('.tv-chip'), function (c) { c.addEventListener('click', function () { go(S.teacher.key, c.getAttribute('data-a')); }); });
  // the teacher beside the live caption
  var live = document.getElementById('es-live'), row = document.createElement('div'), face = document.createElement('div'), holder = document.createElement('div');
  row.className = 'tv-speak' + (S.teacher.kind === 'morph' ? ' tv-stack' : ''); face.className = 'tv-face' + (S.teacher.kind === 'morph' ? ' tv-huge' : S.teacher.kind === 'film' ? ' tv-big' : '');
  live.parentNode.insertBefore(row, live); face.appendChild(holder);
  var label = document.createElement('div'); label.textContent = S.teacher.name; face.appendChild(label);
  row.appendChild(face); row.appendChild(live);
  T.mount(holder, S.teacher, function () {
    var a = S.audio; if (!a || a._step == null || a._step < 0) return null;
    var st = S.voice.steps[a._step]; if (!st) return null;
    return { playing: !a.paused && !a.ended, step: a._step, ms: a.currentTime * 1000, words: st.words, starts: st.starts, vis: st.vis };
  });
})();
`;

const specAt = html.indexOf('<script type="application/json" id="es-spec">');
const playerAt = html.indexOf("<script>", html.indexOf("</script>", specAt));
if (specAt < 0 || playerAt < 0) throw new Error("this page does not look like a built animated solution");
// A morphing teacher's sheet layout (morph.json beside its pictures) is put in the page, since a page opened from disk cannot fetch it.
const morph = {};
for (const d of await readdir(path.join(outDir, "teachers"))) {
  try { morph[d] = JSON.parse(await readFile(path.join(outDir, "teachers", d, "morph.json"), "utf8")); } catch { /* not a morphing teacher */ }
}
html = html.slice(0, playerAt) + `<script>window.esMorph = ${JSON.stringify(morph)};</script>\n<script>${teacherJs}</script>\n<script>${pre}</script>\n` + html.slice(playerAt);
const bootAt = html.lastIndexOf("</body>");
html = html.slice(0, bootAt) + `<script>${post}</script>\n` + html.slice(bootAt);
html = html.replace("</head>", `<style>${css}</style>\n</head>`);
await writeFile(path.join(outDir, "solution.html"), html);
console.log(`Wrote ${path.join(outDir, "solution.html")} (${Object.keys(voices).length} voices)`);
