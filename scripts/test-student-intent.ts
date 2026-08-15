/**
 * Regression tests for the shared new-problem detector that both the
 * voice-final and typed-input paths call. Guards against pattern drift
 * causing typed "Draw a 30° inclined plane…" / "Show an animal cell…"
 * prompts to stop firing newPage (the 2026-04-24 Biology session
 * regression).
 */

import { detectStudentIntent } from '../apps/marketing/src/lib/tutor/voice/student-intent';

interface Case { text: string; expected: boolean; why: string }

const cases: Case[] = [
  // --- Imperative draw/show/plot ---
  { text: 'Draw a 30° inclined plane', expected: true, why: 'draw a' },
  { text: 'Draw me a pendulum', expected: true, why: 'draw me a' },
  { text: 'Draw the water cycle', expected: true, why: 'draw the' },
  { text: 'Show an animal cell and highlight the nucleus', expected: true, why: 'show an' },
  { text: 'Show me the cell cycle', expected: true, why: 'show me the' },
  { text: 'Plot position vs time for a ball', expected: true, why: 'plot a' },
  { text: 'Sketch a projectile motion diagram', expected: true, why: 'sketch a' },
  { text: 'Illustrate the water cycle', expected: true, why: 'illustrate the' },
  { text: 'Graph the function y = 2x', expected: true, why: 'graph the' },

  // --- Scenario setups ---
  { text: 'A ball is dropped from rest', expected: true, why: 'a ball is dropped' },
  { text: 'A block is placed on a frictionless surface', expected: true, why: 'a block is placed' },
  { text: 'Two masses are connected by a rope', expected: true, why: 'two masses are connected' },
  { text: 'An object is thrown at 30°', expected: true, why: 'an object is thrown' },
  { text: 'A car moves at 20 m/s', expected: true, why: 'a car moves' },
  { text: 'A rock falls from a cliff', expected: true, why: 'a rock falls' },

  // --- Transitions ---
  { text: 'Now do a similar problem', expected: true, why: 'now do' },
  { text: 'Next problem please', expected: true, why: 'next problem' },
  { text: 'Let me try another one', expected: true, why: 'another one' },
  { text: "Let's try a different example", expected: true, why: "let's try a" },
  { text: 'Move on to projectile motion', expected: true, why: 'move on to' },
  { text: 'New example with friction', expected: true, why: 'new example' },

  // --- Topic naming ---
  { text: "Let's talk about photosynthesis", expected: true, why: "let's talk about" },
  { text: 'Tell me about black holes', expected: true, why: 'tell me about' },
  { text: 'Teach me how cell division works', expected: true, why: 'teach me how' },
  { text: "Let's study the periodic table", expected: true, why: "let's study the" },

  // --- Standalone compute phrases ---
  { text: 'Compute the mechanical advantage', expected: true, why: 'compute the ma' },
  { text: 'Find the acceleration', expected: true, why: 'find the acceleration' },
  { text: 'Calculate the frequency of the wave', expected: true, why: 'calculate the frequency' },
  { text: 'Determine the momentum', expected: true, why: 'determine the momentum' },

  // --- NEGATIVES: tutor-oriented replies that must NOT trigger ---
  { text: 'Yes that is right', expected: false, why: 'affirmation' },
  { text: "I don't know what to do next", expected: false, why: 'student confusion' },
  { text: 'Can you explain that again?', expected: false, why: 'explain again — continues' },
  { text: 'What do you mean by mechanical advantage?', expected: false, why: 'question about term' },
  { text: 'Hmm, let me think', expected: false, why: 'thinking aloud' },
  { text: 'The answer is 100', expected: false, why: 'student answer' },
  { text: 'I got 3.5', expected: false, why: 'student number' },
  { text: 'Why?', expected: false, why: 'follow-up question' },
  { text: 'Can you draw it?', expected: false, why: 'reference to existing item, no determiner + noun' },
  { text: 'Go ahead', expected: false, why: 'permission' },
  { text: 'Hi', expected: false, why: 'greeting' },
];

let pass = 0;
let fail = 0;
for (const c of cases) {
  const result = detectStudentIntent(c.text);
  const ok = result.newProblem === c.expected;
  if (ok) {
    pass++;
    console.log(`✓ [${c.expected ? 'new' : 'cont'}] "${c.text}" — ${c.why}`);
  } else {
    fail++;
    console.log(`✗ [${c.expected ? 'new' : 'cont'}] "${c.text}" — expected ${c.expected}, got ${result.newProblem}. ${c.why}${result.matchedPattern ? ` (matched: ${result.matchedPattern})` : ''}`);
  }
}

console.log(`\n${pass}/${pass + fail} student-intent cases passed`);
if (fail > 0) process.exit(1);
