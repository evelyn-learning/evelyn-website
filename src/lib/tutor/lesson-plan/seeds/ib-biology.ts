/**
 * IB DP Biology — anchor plan covering course shape, command terms,
 * and the "Nature of Science" lens IB rewards.
 */

import type { LessonPlan } from '../types';

export const SEED_IB_BIOLOGY: LessonPlan = {
  id: 'evelyn.ibdp.biology.v1',
  title: 'IB Biology — course shape, command terms, Nature of Science',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'science',
  topic: 'ib-biology',
  locale: 'en',
  los: [
    {
      id: 'ibdp.biology.overview',
      description: 'Map the IB Biology assessment shape, identify high-leverage command terms, and apply the Nature of Science framing IB examiners reward.',
      standard: 'IB-DP-BIO',
    },
  ],
  prerequisites: ['g912.science.biology-advanced'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'IB Biology rewards specific habits — command-term discipline, Nature-of-Science framing, and explicit links across topics.',
      script: 'Two students study the same content, sit the same paper, and score 4 vs 7. The 7 didn\'t know more biology — they knew how to ANSWER the questions IB asks. Today we map the assessment shape and drill the command-term discipline that turns content into marks.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ib-bio',
      kind: 'concept',
      goal: 'Course structure, papers, command terms, NOS, IA, key topic links.',
      keyIdeas: [
        'ASSESSMENT (under the new 2025+ syllabus): Paper 1 (multiple choice + data analysis), Paper 2 (short + extended response), Internal Assessment (one investigation, ~10 hours, 20% of grade).',
        'COMMAND TERMS are the verbs that tell you what answer the question wants. STATE = one-word answer. DESCRIBE = factual account. EXPLAIN = give reasons / mechanism. EVALUATE = weigh strengths and weaknesses. COMPARE AND CONTRAST = similarities AND differences. DISCUSS = balanced argument. DISTINGUISH = highlight differences.',
        'GET THE COMMAND TERM WRONG and you score zero on the question even if your biology is correct. "Explain photosynthesis" wants mechanism. Just describing the inputs and outputs gets no marks.',
        'NATURE OF SCIENCE is woven through every topic — IB explicitly rewards it. Knowing the HISTORY (Wallace + Darwin co-developing natural selection), the FALSIFIABILITY of hypotheses, the role of TECHNOLOGY (electron microscopes enabling cell theory), the LIMITS of models, and the SOCIAL DIMENSIONS (e.g. Henrietta Lacks).',
        'CORE TOPICS span: cell biology, molecular biology, genetics, ecology, evolution, human physiology. HL adds nucleic acids, metabolism, plant biology, animal physiology in greater depth.',
        'KEY MECHANISTIC THREADS: structure-function (every structure links to its job), water properties, enzymes (induced fit, inhibitors, activation energy), gene expression (transcription, translation, regulation), homeostasis (negative feedback loops), natural selection, ecological succession.',
        'THE IA is a single investigation: research question, hypothesis, method, data collection, analysis, evaluation. Grading rubric rewards CONTROL of variables, sufficient REPLICATION, and explicit EVALUATION of limitations.',
        'GRAPH skills are heavily tested. Always: title, axis labels with units, error bars where appropriate. Trends described in WORDS not just stated.',
      ],
      vocabulary: [
        { term: 'command term', definition: 'the verb in an IB exam question (state, describe, explain, evaluate, etc.) that defines what kind of answer earns marks; misreading the term costs marks even with correct content.' },
        { term: 'Nature of Science (NOS)', definition: 'IB-specific framing covering the history, methods, social dimensions, and limits of scientific knowledge; explicitly assessed across the syllabus.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-command',
      kind: 'worked_example',
      problem: 'Question: "Compare and contrast the structure and function of mitochondria and chloroplasts." Sketch what a high-band answer would include.',
      steps: [
        'Command term: COMPARE AND CONTRAST = similarities AND differences. Both must appear.',
        'Plan a table mentally: rows for structure, function, location, evolutionary origin; columns for mito vs chloro.',
        'SIMILARITIES (compare): both double-membrane organelles, both have own circular DNA + 70S ribosomes (endosymbiotic origin), both produce ATP, both have folded inner membrane to maximise surface area for membrane reactions.',
        'DIFFERENCES (contrast): mitochondria oxidise glucose to CO₂ + H₂O (cellular respiration); chloroplasts fix CO₂ + H₂O into glucose (photosynthesis). Mito = inner membrane folded into cristae; chloro = inner membrane forms thylakoid stacks (grana). Mito in nearly all eukaryotes; chloro in plants/algae only. Mito uses oxygen as final electron acceptor; chloro uses NADP⁺.',
        'High-band move: link both to ENDOSYMBIOTIC THEORY (Margulis) — Nature-of-Science point that earns extra marks.',
        'Structure: a clear table OR clearly signposted prose. Avoid mixing similarities and differences randomly across paragraphs.',
      ],
      answer: 'Address both similarities and differences explicitly; reference endosymbiotic origin for NoS marks.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Question: "EVALUATE the use of stem cells in the treatment of Type 1 diabetes." What does "evaluate" require, and what should the answer include?',
      expectedAnswer: 'EVALUATE = weigh strengths AND weaknesses, then a judgement. Answer must include: STRENGTHS — could replace destroyed beta cells, restoring insulin production; reduces lifelong injection burden; iPSCs avoid embryonic ethics. WEAKNESSES — risk of immune rejection (unless autologous iPSCs), risk of teratoma if differentiation incomplete, very expensive, long clinical-trial pipeline, ethical concerns around embryonic stem cells. JUDGEMENT — promising long-term but currently experimental; case-by-case based on patient circumstances. Without an explicit judgement, examiners dock marks even with full strengths/weaknesses lists.',
      responseFormat: 'free',
      hints: [
        '"Evaluate" needs strengths, weaknesses, AND a judgement.',
        'Pure description without weighing scores low.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-explain-vs-describe',
      kind: 'misconception_check',
      question: 'A student answers "Explain how enzymes are affected by temperature" by describing a graph (rate increases, peaks, then drops). Why does this lose marks?',
      commonErrors: [
        {
          answer: 'They described the temperature-rate curve correctly',
          misconception: 'Treating "explain" as equivalent to "describe."',
          correctsTo: 'EXPLAIN demands MECHANISM. Describing the curve answers "describe how rate varies with temperature." Explaining must say WHY: at low T, low kinetic energy means few productive collisions between enzyme and substrate; as T rises, more collisions occur with sufficient energy to reach activation energy; at the optimum, rate is maximised; above the optimum, hydrogen bonds maintaining the enzyme\'s active-site shape are disrupted and the enzyme DENATURES, losing function. The mechanism is what earns the explain marks. Memorise the command-term hierarchy and check it before writing.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Command terms set what answer earns marks — read them before answering.',
        'NoS framing earns explicit marks across topics.',
        'Mechanism > description; evaluate needs a judgement.',
        'Structure-function is the running thread across biology topics.',
        'IA: control variables, replicate sufficiently, evaluate limitations.',
        'Graphs need titles, units, and a worded trend.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
