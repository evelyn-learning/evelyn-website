#!/usr/bin/env node
/**
 * Replay harness — mechanical measures for discussion sessions (v2/discussion.ts), from offline bundles.
 * The judged measures (did it complicate with consequences, notice a shift, stay with the source) are for a
 * blind reviewer: rubrics/ecs-ch2.txt.
 *
 *   node scripts/tutor/replay-harness/score-discussion.mjs <bundle.json> [...]
 */
import fs from 'node:fs';

// Keep in step with DISCUSSION_VERDICT_WORDS in src/lib/tutor/v2/discussion.ts.
const VERDICT = /\b(?:that's (?:right|correct|wrong|exactly right)|you're (?:right|correct|wrong)|exactly right|correct!|great (?:answer|point|question|thinking)|excellent|perfect(?:ly put)?|well said|spot on|love that|brilliant)\b/gi;
const COMPLAINTS = ['complaint_reask', 'complaint_ignored', 'complaint_lost', 'move_on', 'verdict_only'];

const rows = [];
for (const f of process.argv.slice(2).filter((x) => x.endsWith('.json') && !x.endsWith('.score.json'))) {
  const b = JSON.parse(fs.readFileSync(f, 'utf8'));
  const tutor = b.turns.filter((t) => t.role === 'tutor').map((t) => t.text);
  const words = tutor.map((t) => t.split(/\s+/).filter(Boolean).length).sort((a, c) => a - c);
  const verdicts = tutor.flatMap((t) => t.match(VERDICT) ?? []);
  rows.push({
    run: f.split('/').pop().replace(/\.json$/, ''),
    min: +b.minutes.toFixed(1),
    tutorTurns: tutor.length,
    medianWords: words[Math.floor(words.length / 2)] ?? 0,
    maxWords: words[words.length - 1] ?? 0,
    twoQuestions: tutor.filter((t) => (t.match(/\?/g) ?? []).length >= 2).length,
    repeated: tutor.filter((t) => { const p = t.split(/\n\n+/).map((x) => x.trim().slice(0, 60)).filter(Boolean); return new Set(p).size < p.length; }).length,
    verdictWords: verdicts.length ? verdicts.join('|') : 0,
    stockStruggling: tutor.filter((t) => /finds writing hard|struggl\w* (?:writer|student)|keeps? them going/i.test(t)).length,
    stockTimed: tutor.filter((t) => /timed|in-class essay|without the tool in class/i.test(t)).length,
    complaints: b.turns.filter((t) => COMPLAINTS.includes(t.tag)).map((t) => t.tag).join('|') || 0,
    ended: b.endedBy,
    direction: b.nextDirection ?? '',
    shifts: b.thinking?.shifts?.length ?? 0,
    weighed: b.thinking?.weighed?.length ?? 0,
  });
}
console.table(rows);
