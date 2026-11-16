/// <reference types="node" />
/**
 * Replay harness — read an audio-student run (Task 6d) into a transcript and the countable scores.
 *
 *   npx tsx scripts/tutor/replay-harness/score-audio.ts <bundle.json> [<out.md>]
 *
 * Per student turn: the clip played, the live text (what the live session's recogniser heard on the day),
 * what this run's recogniser heard, the pick's fit, and word error of heard vs live. Scores that are counts
 * (summary reached + minute, pronunciation offered, misfits, longest retry run, tutor openers repeated) come
 * from the run; judgement calls (wrong "correct" verdicts, stop handling, persona answers) are read by hand.
 */
import fs from 'node:fs';

type Pick = { n: number; fit: string; why: string; live: string; heard: string; sec: number };
type Bundle = { fixture: string; sessionId?: string; minutes: number; endedBy: string; startedAt: string; turns: Array<{ role: string; text: string; clip?: number; heard?: string; fit?: string }>; events: Array<{ type: string; message: string }>; audio?: { picks: Pick[]; sttSocketSeconds?: number; clipSeconds?: number; silentTtsReplies?: number; storedTranscript?: Array<{ role: string; text: string }> } };

const CJK = /[぀-ヿ㐀-鿿]/;
// "11" and "eleven" are the same word to a listener: numbers are compared as words.
const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
export function tokens(s: string): string[] {
  const out: string[] = [];
  for (const w of s.toLowerCase().replace(/[’]/g, "'").split(/[^a-z0-9'぀-ヿ㐀-鿿]+/).filter(Boolean)) {
    if (CJK.test(w)) out.push(...[...w].filter((c) => CJK.test(c))); else { const x = w.replace(/^'+|'+$/g, ''); out.push(/^\d+$/.test(x) && Number(x) <= 20 ? NUM[Number(x)] : x); }
  }
  return out.filter(Boolean);
}
/** Word edit distance and reference length. */
export function wordErrors(ref: string, hyp: string): { errors: number; words: number } {
  const r = tokens(ref); const h = tokens(hyp);
  const d = Array.from({ length: r.length + 1 }, (_, i) => [i, ...Array(h.length).fill(0)] as number[]);
  for (let j = 1; j <= h.length; j++) d[0][j] = j;
  for (let i = 1; i <= r.length; i++) for (let j = 1; j <= h.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (r[i - 1] === h[j - 1] ? 0 : 1));
  return { errors: d[r.length][h.length], words: r.length };
}

const opener = (s: string) => s.trim().split(/(?<=[.!?。！？])\s+/)[0]?.slice(0, 60) ?? '';

/**
 * What the session kept as heard, per clip. The harness reads the words each brain turn was asked with; a turn the
 * client superseded (the recogniser split one clip and the second half replaced the first request) never finishes,
 * so its words are missing there. The stored transcript has every student line: each pick takes its own lines plus
 * any unmatched line just before them.
 */
export function heardFromStore(b: Bundle): Pick[] {
  const picks = (b.audio?.picks ?? []).map((p) => ({ ...p }));
  const stored = (b.audio?.storedTranscript ?? []).filter((t) => t.role === 'student').map((t) => t.text);
  if (!stored.length) return picks;
  const same = (x: string, y: string) => tokens(x).join(' ') === tokens(y).join(' ');
  let j = 0;
  for (const p of picks) {
    const frags = p.heard ? p.heard.split(' / ') : [];
    if (!frags.length) continue;
    const last = frags[frags.length - 1];
    let k = j; while (k < stored.length && !same(stored[k], last)) k += 1;
    if (k >= stored.length) continue;
    p.heard = stored.slice(j, k + 1).join(' / ');
    j = k + 1;
  }
  return picks;
}

export function scoreAudio(b: Bundle) {
  const picks = heardFromStore(b);
  let errs = 0; let words = 0;
  for (const p of picks) { if (!p.heard) continue; const w = wordErrors(p.live, p.heard); errs += w.errors; words += w.words; }
  const tutor = b.turns.filter((t) => t.role === 'tutor').map((t) => t.text);
  // Minute of the summary: the tutor turn that sums up (in its words), as a share of the run.
  const sumIdx = tutor.findIndex((t, i) => i > 2 && /\b(summary|to sum up|let'?s (?:review|recap)|what we (?:did|covered|practi[sc]ed) today|today you)\b|まとめ/i.test(t));
  const pronIdx = tutor.findIndex((t) => /pronunciation|発音/i.test(t) && /\?|？/.test(t));
  // Longest run of tutor turns asking for the same sentence again.
  let run = 0; let maxRun = 0;
  for (const t of tutor) { if (/\b(once more|try (?:it |that )?again|say (?:it|the (?:whole |complete )?sentence) (?:again|once more)|one more time|もう一度)\b/i.test(t)) { run += 1; maxRun = Math.max(maxRun, run); } else run = 0; }
  const openers = tutor.map(opener); const seen = new Map<string, number>(); for (const o of openers) seen.set(o, (seen.get(o) ?? 0) + 1);
  const repeatedOpeners = [...seen.entries()].filter(([o, n]) => n > 1 && o.length > 3).map(([o, n]) => `${n}× "${o}"`);
  const ev = (re: RegExp) => b.events.filter((e) => re.test(e.type)).length;
  return {
    fixture: b.fixture, sessionId: b.sessionId, minutes: Math.round(b.minutes * 10) / 10, endedBy: b.endedBy,
    studentTurns: picks.length, misfits: picks.filter((p) => p.fit === 'misfit').length, notHeard: picks.filter((p) => !p.heard).length,
    sttWerHeard: words ? Math.round((errs / words) * 1000) / 10 : null, sttWords: words,
    summaryTutorTurn: sumIdx >= 0 ? sumIdx + 1 : null,
    pronunciationOffered: pronIdx >= 0, maxRetryRun: maxRun, repeatedOpeners,
    idleNudges: ev(/^idle_nudge/), passedPartFacts: b.events.filter((e) => /passed/i.test(e.type) || /passed over|passed-over/i.test(e.message)).length,
    sttSocketMin: b.audio?.sttSocketSeconds ? Math.round(b.audio.sttSocketSeconds / 6) / 10 : null, clipMin: b.audio?.clipSeconds ? Math.round(b.audio.clipSeconds / 6) / 10 : null,
  };
}

export function transcriptMd(b: Bundle): string {
  const lines: string[] = [];
  let k = 0; const picks = heardFromStore(b);
  for (const t of b.turns) {
    if (t.role === 'tutor') { lines.push(`**T** ${t.text.replace(/\n+/g, ' ')}`); continue; }
    k += 1;
    const heard = picks[k - 1]?.heard ?? t.heard ?? '';
    const w = wordErrors(t.text, heard);
    lines.push(`**S${k}** clip #${t.clip} · fit **${t.fit}** · live: “${t.text}” · heard: “${heard || '(nothing)'}”${heard ? ` · word errors ${w.errors}/${w.words}` : ''}`);
  }
  return lines.join('\n\n');
}

if (require.main === module) {
  const [file, out] = process.argv.slice(2);
  const b = JSON.parse(fs.readFileSync(file, 'utf8')) as Bundle;
  const s = scoreAudio(b);
  console.log(JSON.stringify(s, null, 2));
  if (out) fs.writeFileSync(out, `# ${b.fixture} · v2 · real audio · session ${b.sessionId ?? '?'}\n\n\`\`\`json\n${JSON.stringify(s, null, 2)}\n\`\`\`\n\n${transcriptMd(b)}\n`);
}
