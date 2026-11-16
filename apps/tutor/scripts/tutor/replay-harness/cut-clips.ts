/// <reference types="node" />
/**
 * Replay harness — cut a real learner's recorded turns into clips (Task 6d).
 *
 * Input: the session recording's student track (24 kHz mono pcm16, one continuous
 * track; student.meta.json gives wallStartMs) and the live transcript dump
 * (dump-*.js format: a JSON header line with createdAt, then "=== TRANSCRIPT" with
 * "<sec>s <n> <role>: <text>" lines, seconds since createdAt).
 *
 * Alignment: audio second = transcript second + (createdAt - wallStartMs) / 1000.
 * A student turn's text is stored when its transcript arrives, a second or two after
 * the learner stops; each turn's speech is the voiced span between the previous
 * transcript line and that moment (+1.2 s). The student track is the echo-cancelled
 * microphone, so the tutor's voice is a low murmur in it and a barge-in is kept.
 * Voiced = 50 ms frames over max(floor + 18 dB, -50 dBFS, turn peak - 25 dB), floor =
 * 10th percentile of frames where the tutor track is silent.
 *
 * Output (laptop only, never in git): <audioDir>/clips/NN.wav + clips.json
 *   [{ n, text, sec, at, words, wps, check }]  check = ok | short | slow | fast | empty
 *
 *   npx tsx scripts/tutor/replay-harness/cut-clips.ts --audio ~/.evelyn/gdi-audio/josh --transcript <dump.txt>
 */
import fs from 'node:fs';
import path from 'node:path';

export type LiveTurn = { t: number; role: 'tutor' | 'student'; text: string };
export type Clip = { n: number; text: string; sec: number; at: number; words: number; wps: number; check: string };

export function parseLiveDump(text: string): { createdAt: string; turns: LiveTurn[] } {
  const lines = text.split('\n');
  const head = JSON.parse(lines[0]) as { createdAt: string };
  const turns: LiveTurn[] = []; let on = false;
  for (const l of lines.slice(1)) {
    if (l.startsWith('=== TRANSCRIPT')) { on = true; continue; }
    if (l.startsWith('=== ')) break;
    if (!on) continue;
    const m = l.match(/^\s*(-?\d+)s\s+\d+\s+(tutor|student):\s?(.*)$/);
    if (m) turns.push({ t: Number(m[1]), role: m[2] as 'tutor' | 'student', text: m[3] });
    else if (turns.length && l.trim()) turns[turns.length - 1].text += ` ${l.trim()}`;
  }
  return { createdAt: head.createdAt, turns };
}

const SR = 24000; const FRAME = 0.05;
function frameDb(buf: Buffer): number[] {
  const n = Math.floor(buf.length / 2); const per = Math.round(SR * FRAME); const out: number[] = [];
  for (let s = 0; s + per <= n; s += per) {
    let q = 0; for (let i = s; i < s + per; i++) { const v = buf.readInt16LE(i * 2) / 32768; q += v * v; }
    out.push(20 * Math.log10(Math.sqrt(q / per) + 1e-9));
  }
  return out;
}

export function wav(pcm: Buffer, rate = SR): Buffer {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

const wordCount = (s: string) => (s.match(/[A-Za-z']+/g)?.length ?? 0) + Math.ceil((s.match(/[぀-ヿ㐀-鿿]/g)?.length ?? 0) / 3);

function main() {
  const arg = (k: string) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : ''; };
  const dir = arg('--audio').replace(/^~/, process.env.HOME ?? '~');
  const live = parseLiveDump(fs.readFileSync(arg('--transcript'), 'utf8'));
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'student.meta.json'), 'utf8')) as { attempts: Array<{ wallStartMs: number }> };
  const offset = (new Date(live.createdAt).getTime() - meta.attempts[0].wallStartMs) / 1000;
  const st = fs.readFileSync(path.join(dir, 'student.pcm16')); const tu = fs.readFileSync(path.join(dir, 'tutor.pcm16'));
  const sDb = frameDb(st); const tDb = frameDb(tu);
  const tutorOn = (f: number) => (tDb[f] ?? -200) > -90;
  const quiet = sDb.filter((_, f) => !tutorOn(f)).sort((a, b) => a - b);
  const floor = quiet[Math.floor(quiet.length * 0.1)] ?? -70;
  const thr = Math.max(floor + 18, -50);
  console.log(`offset ${offset.toFixed(2)} s · student ${(sDb.length * FRAME).toFixed(0)} s · floor ${floor.toFixed(1)} dB · voiced > ${thr.toFixed(1)} dB`);
  const outDir = path.join(dir, 'clips'); fs.mkdirSync(outDir, { recursive: true });
  const clips: Clip[] = []; let prevEnd = 0;
  live.turns.forEach((turn, i) => {
    if (turn.role !== 'student') return;
    const endF = Math.min(sDb.length - 1, Math.round((turn.t + offset + 1.2) / FRAME));
    // From just after the previous transcript line (the tutor's turn, whose voice may still be playing: a learner who
    // talks over it is recorded too, the tutor's voice itself echo-cancelled to a murmur) or the previous clip.
    const prevT = i > 0 ? live.turns[i - 1].t : -offset;
    const startF = Math.max(prevEnd + 1, Math.round((prevT + offset + 0.5) / FRAME), endF - Math.round(60 / FRAME));
    // Voiced: over the session threshold and within 25 dB of this turn's loudest frame (a room murmur or echo stays out).
    let peak = -200; for (let f = startF; f <= endF; f++) peak = Math.max(peak, sDb[f]);
    const voiced: number[] = []; for (let f = startF; f <= endF; f++) if (sDb[f] > Math.max(thr, peak - 25)) voiced.push(f);
    const n = clips.length + 1;
    let a: number; let z: number; let check = 'ok';
    if (!voiced.length) { a = Math.max(startF, endF - Math.round(3 / FRAME)); z = endF; check = 'empty'; }
    else {
      // All speech in the tutor-silent gap (the learner's own pauses stay in), minus lone blips (< 0.15 s, > 1 s from other speech).
      const runs: number[][] = []; for (const f of voiced) { const r = runs[runs.length - 1]; if (r && f - r[r.length - 1] <= 2) r.push(f); else runs.push([f]); }
      const kept = runs.filter((r, j) => r.length >= 3 || [runs[j - 1], runs[j + 1]].some((o) => o && Math.min(Math.abs(o[0] - r[r.length - 1]), Math.abs(r[0] - o[o.length - 1])) <= Math.round(1 / FRAME)));
      // A silence over 5 s splits the gap: the turn is the last group (an earlier group was not this transcript).
      let g = (kept.length ? kept : runs); let cut = 0; for (let j = 1; j < g.length; j++) if (g[j][0] - g[j - 1][g[j - 1].length - 1] > Math.round(5 / FRAME)) cut = j; g = g.slice(cut);
      voiced.splice(0, voiced.length, ...g.flat());
      const k = 0;
      a = Math.max(startF, voiced[k] - Math.round(0.3 / FRAME)); z = Math.min(endF, voiced[voiced.length - 1] + Math.round(0.35 / FRAME));
    }
    prevEnd = z;
    const per = Math.round(SR * FRAME);
    const pcm = st.subarray(a * per * 2, (z + 1) * per * 2);
    fs.writeFileSync(path.join(outDir, `${String(n).padStart(2, '0')}.wav`), wav(pcm));
    const sec = Math.round(((z - a + 1) * FRAME) * 100) / 100; const words = wordCount(turn.text);
    const speechSec = voiced.length ? (voiced[voiced.length - 1] - voiced[0] + 1) * FRAME : 0;
    const wps = speechSec ? Math.round((words / speechSec) * 10) / 10 : 0;
    if (check === 'ok') check = sec < 0.5 ? 'short' : wps > 4.5 ? 'fast' : (words > 2 && wps < 0.6) ? 'slow' : 'ok';
    clips.push({ n, text: turn.text, sec, at: Math.round(a * FRAME * 10) / 10, words, wps, check });
    console.log(`${String(n).padStart(2)} turn ${String(i).padStart(2)} @${turn.t}s audio ${(a * FRAME).toFixed(1)}-${(z * FRAME).toFixed(1)} (${sec}s, ${wps} w/s) ${check.padEnd(5)} ${turn.text.slice(0, 70)}`);
  });
  fs.writeFileSync(path.join(dir, 'clips.json'), JSON.stringify(clips, null, 2));
  console.log(`${clips.length} clips → ${outDir}; checks: ${JSON.stringify(clips.reduce<Record<string, number>>((m, c) => ({ ...m, [c.check]: (m[c.check] ?? 0) + 1 }), {}))}`);
}

if (require.main === module) main();
