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
const COMPLAINTS = ['complaint_reask', 'complaint_ignored', 'complaint_lost', 'move_on', 'verdict_only', 'complaint_unheard', 'complaint_steered', 'complaint_prescribed'];
// Keep in step with DISCUSSION_HYPOTHETICAL in src/lib/tutor/v2/discussion.ts.
const HYPOTHETICAL = /\b(?:picture|imagine|think of|suppose|consider|what about|take) (?:a|one|another) (?:student|child|pupil|kid|learner) (?:who|that|whose)\b/i;
const lastQuestionWords = (t) => ((t.split(/(?<=[.!?])\s+/).filter((x) => x.trim().endsWith('?')).pop() ?? '').split(/\s+/).filter(Boolean).length);
// Keep in step with DISCUSSION_JUDGING_OPENER in src/lib/tutor/v2/discussion.ts.
const JUDGING_OPENER = /^\s*(?:that'?s|that is|this is|you'?re right|good|great|fair|nice|interesting|what a)\b/i;

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
    judgingOpeners: tutor.slice(1).filter((t) => JUDGING_OPENER.test(t)).length,
    endsOnQuestion: tutor.length > 1 ? +(tutor.slice(1, -1).filter((t) => /\?\s*$/.test(t.trim())).length / Math.max(1, tutor.length - 2)).toFixed(2) : 0,
    permissionAsks: tutor.filter((t) => /would you like to (?:look|go|move|turn)|shall we (?:look|move|go)|want to (?:look|move) (?:at|on)/i.test(t)).length,
    directionAsks: tutor.filter((t) => /explore (?:next|further)|most (?:valuable|useful) (?:for you )?to explore|take (?:this|one thread) (?:next|further)/i.test(t)).length,
    complications: b.thinking?.complications ?? 0,
    hypotheticals: tutor.filter((t) => HYPOTHETICAL.test(t)).length,
    longQuestions: tutor.filter((t) => lastQuestionWords(t) > 22).length,
    saidShift: tutor.filter((t) => /\b(?:shift(?:ed)?|changed? your mind|you(?:'ve| have) moved)\b/i.test(t)).length,
    steered: b.thinking?.steered ? 'y' : '',
    ownExample: b.thinking?.example ? 'y' : '',
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
