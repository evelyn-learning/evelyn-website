/**
 * Source-level wiring pins for the in-flow fields (behaviour of the pure parts
 * is tested in test-lesson-context / test-system-prompt-parts).
 * Run: npx tsx scripts/test-inflow-wiring.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
const SRC = path.join(__dirname, '..', 'src');
const read = (...p: string[]) => fs.readFileSync(path.join(SRC, ...p), 'utf8');
const embed = read('app', 'tutor-portal', 'embed', 'page.tsx');
const ts = read('app', 'tutor', 'components', 'session', 'TutorSession.tsx');
const vtr = read('app', 'tutor', 'components', 'VoiceTutorRealtime.tsx');
const checks: Array<[string, boolean]> = [];
checks.push(['embed parses lessonContext from the raw payload', /parseLessonContext\(rawPayload\)/.test(embed)]);
checks.push(['embed parses entry', /parseEntry\(rawPayload\)/.test(embed)]);
checks.push(['embed title: config.title wins, else clamped label', /config\.title\s*\?\s*clampTitle\(config\.title\)/.test(embed) && /clampTitle\(buildDisplayName\(/.test(embed)]);
checks.push(['embed passes lessonContext and inFlow to TutorSession', /lessonContext=\{lessonContext\}/.test(embed) && /inFlow=\{inFlow\}/.test(embed)]);
checks.push(['TutorSession forwards both to VTR', /lessonContext=\{lessonContext\}/.test(ts) && /inFlow=\{inFlow\}/.test(ts)]);
checks.push(['VTR declares the props', /lessonContext\?: LessonContext;/.test(vtr) && /inFlow\?: boolean;/.test(vtr)]);
checks.push(['VTR feeds them to buildSystemPromptParts', /\.\.\.\(lessonContext \? \{ lessonContext \} : \{\}\),/.test(vtr) && /\.\.\.\(inFlow \? \{ inFlow: true \} : \{\}\),/.test(vtr)]);
let fail = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
console.log(`${checks.length - fail}/${checks.length} passed`);
process.exit(fail ? 1 : 0);
