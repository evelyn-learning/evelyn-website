/**
 * AP Art History — Visual analysis: form, content, context.
 *
 * How to analyze a work of art: describe what you see, interpret
 * meaning, situate in historical context.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_ART_HISTORY_ANALYSIS: LessonPlan = {
  id: 'evelyn.ap.art-history.visual-analysis.v1',
  title: 'Visual analysis: form, content, context',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'arts',
  topic: 'art-history',
  locale: 'en',
  los: [
    {
      id: 'apart.visual-analysis',
      description: 'Conduct visual analysis of artworks using formal, contextual, and content-based approaches.',
      standard: 'AP-ART-1',
    },
  ],
  prerequisites: [],
  followUps: ['apart.modern-art'],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame analysis as a method, not opinion.',
      script: 'How do you ANALYZE art? Not just say "I like it" or "I don\'t". Art history teaches three layers: WHAT do you see (form), WHAT does it mean (content), and WHY was it made then (context). Master these and you can read any artwork.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-layers',
      kind: 'concept',
      goal: 'Form + content + context, with technique vocabulary.',
      keyIdeas: [
        'FORMAL ANALYSIS: describe what you SEE, in detail.',
        '  COMPOSITION: how elements arrange. Symmetrical? Asymmetrical? Where does the eye go?',
        '  COLOR: warm/cool, primary/secondary, hue/saturation/value. Color schemes (complementary, analogous).',
        '  LINE: thick/thin, smooth/jagged, straight/curved. Implied lines.',
        '  TEXTURE: smooth, rough, real or implied.',
        '  SCALE / SIZE: monumental → intimate.',
        '  MEDIUM: oil paint, fresco, marble, bronze, photography, video.',
        'CONTENT (iconography): WHAT the work depicts and what it MEANS.',
        '  Subject (e.g., crucifixion, portrait, landscape).',
        '  Symbols (lily = purity in Renaissance; flag = nation).',
        '  Figures and their roles.',
        'CONTEXT: WHEN and WHERE made; cultural conditions.',
        '  Patron (who paid? — affects subject choice).',
        '  Historical events.',
        '  Religious / political climate.',
        '  Position within an art MOVEMENT (Renaissance, Baroque, Impressionism, etc.).',
        'A strong analysis uses ALL THREE LAYERS, with specific evidence at each.',
      ],
      vocabulary: [
        { term: 'composition', definition: 'how visual elements are arranged in a work.' },
        { term: 'iconography', definition: 'the study of subjects and symbols in art.' },
        { term: 'patronage', definition: 'who commissioned and paid for an artwork.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-mona-lisa',
      kind: 'worked_example',
      problem: 'Briefly analyze the Mona Lisa using all three layers.',
      steps: [
        'FORMAL: a half-length portrait, woman seated, three-quarter pose. Pyramid composition (stable). Sfumato — soft, blurred edges, especially around eyes and mouth. Subdued color palette. Distant atmospheric landscape behind.',
        'CONTENT: a noble Florentine woman (Lisa del Giocondo, likely). Famous AMBIGUOUS smile — interpreted as serene, knowing, distant.',
        'CONTEXT: painted by Leonardo da Vinci ~1503-1519. High Renaissance Italy. Time of humanism, scientific inquiry, individualism. Leonardo experimented with anatomy, light, atmosphere — visible in the work.',
        'INTEGRATED: Renaissance values of humanism (focus on individual personality), scientific observation (atmospheric perspective in the landscape), and technical mastery (sfumato) all visible in this single work.',
      ],
      answer: 'integrate formal description + content + historical context',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In analyzing a piece of religious art, why does PATRONAGE matter?',
      expectedAnswer: 'patron influenced subject, content, scale; reveals what the funder valued / wanted shown',
      responseFormat: 'free',
      hints: [
        'A church commission and a private commission produce different art.',
        'Patron\'s influence often visible in symbolism and choice of subject.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skill',
      kind: 'misconception_check',
      question: 'Is a great artwork one that looks the most REALISTIC?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating greatness with realism.',
          correctsTo: 'No — different ages and movements value different things. Byzantine icons are deliberately STYLIZED; Cubism breaks realism on purpose; abstract expressionism has no "subject" to be realistic about. Realism is one tool among many. Greatness is judged by impact, innovation, technical skill within the chosen idiom.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three layers: FORM (what you see), CONTENT (what it means), CONTEXT (when/why).',
        'Formal analysis: composition, color, line, texture, scale, medium.',
        'Iconography: symbols and subjects.',
        'Context: patronage, era, movement.',
        'Strong analysis integrates all three with specific evidence.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does seeing an artwork in PERSON differ from seeing a reproduction?',
      hint: 'Scale (monumental works hit harder in person). Texture/brushstrokes visible. Color of original far more accurate. Surrounding architecture/space (cathedral altarpieces designed for that setting). Reproductions miss most of these.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
