/**
 * AP Art History — Modern art movements (1860-present).
 *
 * Impressionism, Post-Impressionism, Cubism, Surrealism, Abstract
 * Expressionism, Pop Art, Postmodernism.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_ART_HISTORY_MODERN: LessonPlan = {
  id: 'evelyn.ap.art-history.modern-movements.v1',
  title: 'Modern art movements (1860-present)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'arts',
  topic: 'art-history',
  locale: 'en',
  los: [
    {
      id: 'apart.modern-art',
      description: 'Identify major modern art movements and their distinguishing features.',
      standard: 'AP-ART-9',
    },
  ],
  prerequisites: ['apart.visual-analysis'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Modern art as rebellion against tradition.',
      script: 'Until the 1860s, painting mostly meant capturing reality realistically. Then photography came along and did that better. Painters had to find a NEW reason to paint. The result: 150 years of revolutions — Impressionism, Cubism, Surrealism, Pop. Each redefined what art could be.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-movements',
      kind: 'concept',
      goal: 'Survey of major movements with key artists and ideas.',
      keyIdeas: [
        'IMPRESSIONISM (1860s-1880s): paint LIGHT and atmosphere, not detail. Visible brushstrokes, outdoor scenes, ordinary subjects. Monet, Renoir, Degas. Reaction to photography\'s monopoly on detail.',
        'POST-IMPRESSIONISM (1880s-1900s): individual responses pushing beyond. Cézanne (geometric structure), Van Gogh (emotional color), Gauguin (symbolism), Seurat (pointillism).',
        'EXPRESSIONISM (early 20th C): art expresses INNER FEELING, not outward appearance. Distorted forms. Munch\'s Scream.',
        'CUBISM (~1907-1920s): Picasso and Braque. Show objects from MULTIPLE angles AT ONCE. Fractured planes. Reduced color. Picasso\'s Les Demoiselles d\'Avignon.',
        'SURREALISM (1920s-): unconscious, dreams, juxtaposition. Dalí (melting clocks), Magritte (this-is-not-a-pipe), Frida Kahlo. Influenced by Freud.',
        'ABSTRACT EXPRESSIONISM (1940s-50s): post-WWII NYC. Pure paint, no representation. Pollock\'s drip paintings, Rothko\'s color fields. Action vs color-field branches.',
        'POP ART (1950s-60s): elevate POPULAR culture. Comics, ads, celebrities. Warhol\'s soup cans, Lichtenstein\'s comic dots. Critique or celebration of consumerism (debated).',
        'POSTMODERNISM (1970s-): mixing styles, parody, no single grand narrative. Often conceptual. Cindy Sherman (constructed self-portraits), Banksy.',
        'CONTEMPORARY: digital, video, performance, installation. Art is whatever artists say it is.',
      ],
      vocabulary: [
        { term: 'Impressionism', definition: 'mid-19th-century movement capturing light and momentary impressions.' },
        { term: 'Cubism', definition: 'early-20th-century movement showing multiple viewpoints simultaneously.' },
        { term: 'abstraction', definition: 'art that does not represent recognizable objects.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pollock',
      kind: 'worked_example',
      problem: 'Explain why Jackson Pollock\'s drip paintings count as art when "anyone could do that".',
      steps: [
        'CONTEXT: post-WWII NYC, Abstract Expressionism. Old certainties (representational realism, religious narratives) had been shattered.',
        'INNOVATION: Pollock laid canvas on the FLOOR and dripped/flung paint across it. The PROCESS of painting was visible in the result.',
        'CONTENT: not representational — the painting IS itself. About pure energy, motion, the unconscious gesture.',
        'CRAFT: the drips look chaotic but Pollock controlled rhythm, density, color layering with precision. Try it — the imitations look very different.',
        'IMPACT: shifted what painting could be. Influence on every subsequent generation.',
        '"Anyone could do that" misses both the historical moment AND the actual technical mastery. Easy to imitate badly; hard to make compelling.',
      ],
      answer: 'process-as-art, post-WWII context, technical control of chaos, paradigm-shifting innovation',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How is Pop Art (Warhol) different from earlier high-art subjects?',
      expectedAnswer: 'elevates popular/commercial imagery (soup cans, celebrities) to art status; collapses high-low distinction',
      responseFormat: 'free',
      hints: [
        'Earlier art focused on royalty, religion, mythology.',
        'Warhol used what was around in mass culture.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-modern-skill',
      kind: 'misconception_check',
      question: 'Did modern artists abandon technical skill?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating realism with skill.',
          correctsTo: 'No — Picasso could paint photo-realistically as a teenager (see his Blue Period works). He chose to break realism for new expressive possibilities. Most major modernists trained traditionally before innovating. Skill became less about realism and more about vision and execution.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Impressionism: light and brush, outdoor scenes.',
        'Cubism: multiple viewpoints, fractured planes.',
        'Surrealism: dreams, unconscious.',
        'Abstract Expressionism: pure gesture and color.',
        'Pop Art: popular culture as subject.',
        'Postmodernism: mix, parody, conceptual.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is digital art (NFTs, AI-generated images) challenging the art market?',
      hint: 'Questions: what makes art "original"? Does art need a unique physical object (NFTs say no)? Who is the artist when AI generates? Reshaping the same questions modernism asked but with new technology. Whatever happens, the art world is in the middle of major restructuring.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
