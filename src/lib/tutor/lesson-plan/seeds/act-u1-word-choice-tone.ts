/**
 * ACT — English / Word Choice & Tone: register consistency & precise diction.
 *
 * A recurring Rhetorical Skills question type in every ACT English passage
 * (~9 minutes per passage, 75 questions total): does the underlined word
 * match the passage's REGISTER (formal academic prose vs. conversational
 * memoir), and is it the most PRECISE choice among grammatically-fine
 * options? These are judgment questions, not grammar-rule questions — the
 * trap is picking a word that's correct in isolation but wrong for the
 * surrounding voice. All excerpts are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U1_WORD_CHOICE_TONE: LessonPlan = {
  id: 'evelyn.testprep.act.word-choice-tone.v1',
  title: 'Word Choice & Tone',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.word-choice-tone',
      standard: 'ACT-1.7',
      description:
        'Select the word or phrase that matches a passage\'s register — formal/academic vs. conversational — and expresses its meaning most precisely, avoiding slang, stiff overformality, and vague diction.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame word-choice/tone questions as a recurring, scorable ACT English pattern distinct from grammar.',
      script:
        'Across the 75 ACT English questions and five 9-minute passages, several questions in every passage don\'t test a grammar rule at all — they test WORD CHOICE. Is this word too casual for a formal, academic passage? Too stiff and fancy for a warm, conversational memoir? Just plain vague when a sharper word is sitting right there? These are fast points once you know what to check: the passage\'s register, and whether the word pins down an exact meaning.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-register-precision',
      kind: 'concept',
      goal: 'Teach register consistency across passage types and precise-vs-vague diction, with the traps that catch students.',
      keyIdeas: [
        'REGISTER is the passage\'s overall formality level. An academic/expository passage (history article, science profile) reads FORMAL: no slang, no filler like "kind of" or "pretty," no casual asides. A memoir or first-person narrative reads CONVERSATIONAL: contractions and everyday phrasing are natural there.',
        'TRAP 1 — SLANG IN ACADEMIC PROSE: a formal passage drops in something like "honestly pretty huge" or "a big deal." It\'s grammatically fine but tonally broken. Replace with the register-matched word ("substantial," "significant").',
        'TRAP 2 — STIFF FORMALITY IN A MEMOIR: a casual, contraction-filled narrative suddenly uses "ascertained" or "utilized" where "checked" or "used" fits the voice. The word isn\'t ungrammatical — it\'s the wrong VOICE for that writer.',
        'PRECISE VS. VAGUE: ACT often pairs a vague, all-purpose word ("good," "a lot," "nice," "big deal") with a precise one that names the exact quality. When both are grammatical, the precise word wins — as long as it still matches the passage\'s register.',
        'TRAP 3 — OVERCORRECTING TO "FANCY": ACT sometimes offers a long, impressive-sounding word as a distractor ("determined the veracity of," "made use of"). Longer isn\'t more precise. "Utilize" doesn\'t mean anything "use" doesn\'t already mean — prefer the plain, exact word.',
        'READ A FULL SENTENCE OF CONTEXT, not just the underlined word. Tone questions are answered by the surrounding sentences. Skim one sentence before and after to lock in the register before choosing.',
        'CONNOTATION MATTERS: near-synonyms carry different shading ("slender" vs. "skinny" vs. "scrawny"). Match the connotation to how the passage already treats the subject — approving, neutral, or critical.',
      ],
      vocabulary: [
        { term: 'register', definition: 'the level of formality a piece of writing maintains — academic, conversational, technical, etc.' },
        { term: 'diction', definition: 'an author\'s specific word choices.' },
        { term: 'connotation', definition: 'the emotional or attitudinal shading a word carries beyond its literal meaning.' },
        { term: 'vague modifier', definition: 'a filler descriptor ("nice," "a lot," "thing") that doesn\'t specify what quality is meant.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-slang-in-academic',
      kind: 'worked_example',
      problem:
        'A passage profiles a marine biologist\'s research on coral reefs, written in a formal, informative tone throughout. One sentence reads: "Her data revealed a change in reef health that was HONESTLY PRETTY HUGE." Which replacement for "HONESTLY PRETTY HUGE" best fits the passage\'s tone? (A) NO CHANGE (B) substantial (C) like, super major (D) not that small, actually',
      steps: [
        'Scan one sentence before and after: the passage has been formal throughout — "research," "data," "reef health" — no contractions or casual filler anywhere else.',
        '"Honestly pretty huge" is CONVERSATIONAL filler ("honestly," "pretty" as an intensifier) — it breaks the passage\'s register even though it\'s grammatically fine, so (A) NO CHANGE is out.',
        'Eliminate options that are also casual or vague: (C) "like, super major" is even more slangy; (D) "not that small, actually" is vague and conversational, plus an awkward double negative.',
        '(B) "substantial" is precise AND matches the formal register.',
      ],
      answer: '(B) substantial',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-stiff-in-memoir',
      kind: 'worked_example',
      problem:
        'A memoir passage narrates the writer\'s ninth birthday in a warm, conversational voice, full of contractions and casual asides. One sentence reads: "My mom UTILIZED the leftover cake to make french toast the next morning." Which replacement for "UTILIZED" best fits the passage\'s voice and is the most precise choice? (A) NO CHANGE (B) made use of (C) used (D) employed',
      steps: [
        'Anchor the register first: this is a memoir, written with contractions and casual phrasing elsewhere ("didn\'t," "Mom always said"). "Utilized" is stiff, bureaucratic diction that doesn\'t belong in that voice.',
        'Eliminate options that keep the stiffness: (A) keeps "utilized"; (B) "made use of" is a wordier synonym, still formal; (D) "employed" is even more formal and carries an unrelated job-related connotation here.',
        '(C) "used" is the plain, precise verb that matches the memoir\'s conversational register — no meaning is lost, and it\'s shorter.',
        'Precise, register-matched, and concise all point to the same answer.',
      ],
      answer: '(C) used',
      estimatedMinutes: 3,
    },
    {
      id: 'try-slang-formal',
      kind: 'try_yourself',
      problem:
        'A passage describes a historian\'s archival research in a formal, academic tone throughout. One sentence reads: "The newly uncovered letters were KIND OF A BIG DEAL for understanding the treaty\'s origins." Which replacement for "KIND OF A BIG DEAL" best fits the passage?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE' },
        { id: 'b', text: 'significant', correct: true },
        { id: 'c', text: 'super important' },
        { id: 'd', text: 'not exactly minor' },
      ],
      expectedAnswer: 'significant',
      hints: [
        'Scan the surrounding sentences — is the passage formal or conversational?',
        '"Kind of a big deal" is casual filler; eliminate options that are also casual or vague.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-vague-precise',
      kind: 'try_yourself',
      problem:
        'A formal science passage reads: "The experiment showed a GOOD difference between the two samples." Which replacement for "GOOD" is most precise while keeping the formal tone?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE' },
        { id: 'b', text: 'nice' },
        { id: 'c', text: 'measurable', correct: true },
        { id: 'd', text: 'big-time' },
      ],
      expectedAnswer: 'measurable',
      hints: [
        '"Good" doesn\'t say what kind of difference it was — that\'s a vague filler word.',
        'Pick the option that names a specific, measurable quality without breaking the formal register.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-stiff-memoir',
      kind: 'try_yourself',
      problem:
        'A memoir passage about the writer\'s grandmother\'s kitchen is warm and conversational throughout, full of contractions. One sentence reads: "She always ASCERTAINED that the pie crust was flaky before serving it." Which replacement for "ASCERTAINED" best fits the passage\'s voice?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE' },
        { id: 'b', text: 'made certain' },
        { id: 'c', text: 'checked', correct: true },
        { id: 'd', text: 'determined the veracity of' },
      ],
      expectedAnswer: 'checked',
      hints: [
        'This passage is a casual, conversational memoir — contractions and everyday phrasing throughout.',
        '"Ascertained" is stiff, formal diction. Pick the plain, short verb that matches a warm, conversational voice.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-longer-is-better',
      kind: 'misconception_check',
      question:
        'A student assumes the longest or most sophisticated-sounding word is always the "correct" ACT answer for word-choice questions. Where does this go wrong?',
      commonErrors: [
        {
          answer: 'Pick the fanciest or longest word available',
          misconception: 'Confusing formal vocabulary with correct vocabulary — assuming every ACT passage wants elevated diction.',
          correctsTo:
            'Match the word to the PASSAGE\'s own register, not to a general idea of "sophisticated" writing. A memoir wants plain, warm diction even though a science profile wants formal diction. And even within a formal passage, the most precise plain word usually beats a needlessly long synonym — "utilize" isn\'t better than "use" just because it\'s longer.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Register = the passage\'s formality level — check the surrounding sentences before judging an underlined word.',
        'Slang breaks a formal/academic passage; stiff, Latinate words break a conversational memoir.',
        'Between grammatically-fine choices, pick the one that\'s precise, not just longer or fancier.',
        'NO CHANGE is a legitimate answer when the original word already matches the passage\'s register.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.7', cedTitle: 'Word Choice & Tone' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
