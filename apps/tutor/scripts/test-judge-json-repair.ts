import { repairJudgeJson } from '../src/lib/tutor/voice/judge-json-repair';

let pass = 0, fail = 0;
function check(name: string, ok: boolean, detail = '') { if (ok) pass++; else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); } }

// Live 2026-09-05 shape: fenced, unescaped inner quotes in the claim.
const live = '```json\n{\n  "grounded": true,\n  "issues": [\n    {\n      "claim": "Not quite on (a) — think about it like a store manager who decides which shoppers walk through the "new layout" door versus the "old layout" door.",\n      "why": "The student said (a) was observational; the tutor contradicts the board, which says the startup assigns designs."\n    }\n  ]\n}\n```';
const r1 = repairJudgeJson(live);
check('live: repaired', !!r1, JSON.stringify(r1));
check('live: grounded read', r1?.grounded === true);
check('live: one issue with the full claim', r1?.issues?.length === 1 && /"new layout" door/.test(r1!.issues![0].claim), JSON.stringify(r1?.issues));
check('live: method escaped', r1?.method === 'escaped');

const okJson = '{"grounded": false, "issues": [{"claim": "x = 3", "why": "board says x = 4"}]}';
const r2 = repairJudgeJson(okJson);
check('valid json passes through', r2?.grounded === false && r2?.issues?.length === 1);

const salvageOnly = 'Here is my verdict: "grounded": false, "claim": "the slope is 2", "why": "board shows slope 3" } trailing';
const r3 = repairJudgeJson(salvageOnly);
check('salvage path finds grounded + pair', r3?.method === 'salvaged' && r3?.grounded === false && r3?.issues?.length === 1, JSON.stringify(r3));

check('nothing verdict-shaped ⇒ null', repairJudgeJson('The tutor did fine today.') === null);
check('empty ⇒ null', repairJudgeJson('') === null);

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
