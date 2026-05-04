/**
 * Grades 3-5 ELA — Informational Writing.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_INFORMATIONAL_WRITING: LessonPlan = {
  id: 'evelyn.g35.ela.informational-writing.v1',
  title: 'Grades 3-5 ELA — Informational Writing',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.informational-writing',
      description: 'Write informative pieces with a clear topic, structured paragraphs, supporting facts, and a conclusion.',
      standard: 'CCSS.ELA-LITERACY.W.4.2',
    },
  ],
  prerequisites: ['g35.ela.narrative-developed'],
  followUps: ['g35.ela.opinion-argument'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Informational writing is everywhere — articles, reports, instructions, encyclopedia entries — and it follows a learnable pattern.',
      script: 'Want to teach someone about volcanoes? You don\'t just dump 50 facts in a row. You introduce the topic, organise into related groups (what causes them, types, where they happen), and conclude with the big picture. Today we drill the structure.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-info-writing',
      kind: 'concept',
      goal: 'Structure of informational pieces + research + voice.',
      keyIdeas: [
        'STRUCTURE: introduction → body paragraphs (each on a sub-topic) → conclusion.',
        'INTRODUCTION: state the topic and why it matters. Optionally a hook (interesting fact, question).',
        'BODY PARAGRAPHS: each focuses on ONE sub-topic. Topic sentence + 3-5 supporting facts.',
        'TRANSITIONS between paragraphs: "Another important...", "In addition...", "Furthermore...".',
        'CONCLUSION: restates the main idea and may suggest why the reader should care.',
        'FACTS over opinions. Avoid "I think" or "in my opinion" in informational writing.',
        'CITE SOURCES if you used research. Even informally — "according to..." — to build trust.',
        'TEXT FEATURES: headings, captions, diagrams help readers navigate longer pieces.',
        'VOICE: clear, neutral, professional. Aim for conversational but informed.',
        'DIFFERENT FROM PERSUASIVE: informational presents facts; persuasive argues for an opinion. Don\'t confuse the two.',
      ],
      vocabulary: [
        { term: 'informational writing', definition: 'writing that explains, describes, or teaches about a topic using facts.' },
        { term: 'sub-topic', definition: 'a smaller, focused area within a main topic, usually one per body paragraph.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-info',
      kind: 'worked_example',
      problem: 'Outline an informational piece on volcanoes (3 paragraphs).',
      steps: [
        'INTRODUCTION: "Volcanoes are openings in Earth\'s surface where hot melted rock erupts. They have shaped continents and even climates throughout history." (Topic + significance.)',
        'BODY 1 — How volcanoes form: "Volcanoes form where two tectonic plates meet or where there is a hotspot under Earth\'s crust. Magma from below pushes up through cracks and erupts as lava." (Sub-topic 1.)',
        'BODY 2 — Types of volcanoes: "Three main types are shield (low and wide), composite (tall with explosive eruptions), and cinder cone (small with steep sides)." (Sub-topic 2.)',
        'CONCLUSION: "Although they can be destructive, volcanoes are a vital part of Earth\'s natural cycles, creating new land and enriching soil." (Restates main idea + significance.)',
      ],
      answer: 'Three-paragraph outline with intro, two body sub-topics, conclusion.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Pick one fact about your favourite animal and turn it into a body paragraph (topic sentence + 2-3 facts + closing sentence).',
      expectedAnswer: 'Example: "Octopuses are remarkably intelligent. Studies show they can solve mazes and open jars to reach food. They can recognise individual humans and remember them for weeks. Their problem-solving rivals that of some mammals." (Topic + 3 facts + closing implied.)',
      responseFormat: 'free',
      hints: [
        'Topic sentence: state ONE big thing about the animal.',
        '3 facts: specific, factual, supporting the topic sentence.',
        'Optional closing: link back to the topic.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-opinion-leak',
      kind: 'misconception_check',
      question: 'A student writes informational paragraphs about whales but includes "I think whales are the coolest animals." Why is this a problem?',
      commonErrors: [
        {
          answer: '"I think whales are the coolest"',
          misconception: 'Treating informational writing as if opinions are welcome.',
          correctsTo: 'Informational writing presents FACTS, not feelings. "I think" signals an OPINION, which belongs in opinion writing. Either remove the sentence or rewrite as a fact: "Whales are among the largest animals on Earth, and many people consider them fascinating." The second version notes the impression without claiming it as the author\'s opinion.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Structure: intro → body (one sub-topic per paragraph) → conclusion.',
        'Facts, not opinions.',
        'Topic sentence + supporting facts in each body paragraph.',
        'Transitions between paragraphs.',
        'Cite sources where appropriate.',
        'Voice: clear, neutral, professional.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When and why might an informational piece use a chart or diagram instead of a paragraph?',
      hint: 'When data has multiple values that need comparison (chart), or when relationships between parts are spatial (diagram). Examples: comparing animal weights → bar chart; explaining a frog life cycle → diagram. Visuals can convey patterns words cannot, and they save reading time when the information is structured.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
