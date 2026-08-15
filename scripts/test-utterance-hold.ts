import { endsMidThought, mergeHeldTranscript, HOLD_MS } from '../apps/marketing/src/lib/tutor/voice/utterance-hold';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

check('hold-ms', HOLD_MS === 1400);
// The live truncation: "Could you give me a" (session portal-d9bacb7e).
check('dangling-article', endsMidThought('Could you give me a') === true);
check('dangling-article-period', endsMidThought('Could you give me a.') === true);
check('dangling-the', endsMidThought('What about the') === true);
check('dangling-to', endsMidThought('I want to') === true);
check('dangling-of', endsMidThought('the derivative of') === true);
check('dangling-and', endsMidThought('mean is 14 and') === true);
check('dangling-my', endsMidThought('can you check my') === true);
// Complete thoughts must NOT hold:
check('complete-question', endsMidThought('Could you give me a hint?') === false);
check('complete-number', endsMidThought('The answer is 14.') === false);
check('complete-yes', endsMidThought('Yeah, makes sense.') === false);
check('single-word-a-is-not-held', endsMidThought('a') === false); // bare noise, not a cut sentence
check('empty', endsMidThought('') === false);
check('synthetic-never', endsMidThought('[start lesson]') === false);
// "so" / "because" trail off mid-reasoning:
check('dangling-so', endsMidThought('I multiplied by five so') === true);
check('dangling-because', endsMidThought('the median stays because') === true);
// merge: single space, trims, drops the held text's trailing period.
check('merge-basic', mergeHeldTranscript('Could you give me a', 'harder problem?') === 'Could you give me a harder problem?');
check('merge-period', mergeHeldTranscript('Could you give me a.', 'harder problem?') === 'Could you give me a harder problem?');
check('merge-trim', mergeHeldTranscript(' I want to ', ' try again. ') === 'I want to try again.');
// Complete utterances that USED to false-positive (review round 1):
check('question-stranded-prep', endsMidThought('What page is it on?') === false);
check('question-converge-to', endsMidThought('What does it converge to?') === false);
check('complete-demonstrative', endsMidThought('Can you explain that') === false);
check('complete-pronoun', endsMidThought('I already tried this') === false);
check('complete-over', endsMidThought('The test is over') === false);
// Un-punctuated dangling articles still hold:
check('dangling-the-no-punct', endsMidThought('what about the') === true);

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all utterance-hold checks passed');
