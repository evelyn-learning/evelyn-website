import { isBareArithmeticRecheck } from '../src/lib/tutor/voice/arithmetic-recheck';

let pass = 0, fail = 0;
function check(name: string, ok: boolean) { if (ok) pass++; else { fail++; console.log(`  ✗ ${name}`); } }
const yes = [
  '20% of 120 is 24; 20% of 15 is 3.',           // live 2026-09-05
  '2(x-3)+3x = 4(x+2)+7 gives 5x - 6 = 4x + 15.',
  '$3^2 + 1 = 10$.',
  'Six times four is twenty-four.',
  '12 divided by 4 equals 3, and 3 squared is 9.',
];
const no = [
  'So 20% of 120 gives you 24 students — see why the ninth grade contributes more?',
  'Right — same twenty percent rate, but ninth grade contributes twenty-four students.',
  'Now, what does 20% of 120 come to?',
  'Let me re-derive this myself before responding.',   // meta-narration handles this one
  'The mean is 7.',                                   // one number
  'Take your time.',
  'Exactly right. 20.',
];
for (const s of yes) check(`bare recheck: "${s}"`, isBareArithmeticRecheck(s) === true);
for (const s of no) check(`teaching survives: "${s.slice(0, 50)}"`, isBareArithmeticRecheck(s) === false);
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
