/**
 * G10 — Geometry: Similarity (AA, SAS-similarity, SSS-similarity).
 *
 * Two figures are SIMILAR when they have the same shape but possibly
 * different sizes — proportional sides, equal angles. The scale
 * factor connects every length pair. Three triangle similarity
 * criteria, dominant of which is AA (just two equal angles is
 * enough).
 */

import type { LessonPlan } from '../types';

export const SEED_G10_GEOM_SIMILARITY: LessonPlan = {
  id: 'evelyn.g10.math.geometry.similarity.v1',
  title: 'Similarity',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'math',
  topic: 'similarity',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsg.srt.a.2',
      description: 'Verify experimentally the properties of similar figures via dilation.',
      standard: 'CCSS.MATH.CONTENT.HSG.SRT.A.2',
    },
    {
      id: 'ccss.math.hsg.srt.b.5',
      description: 'Use congruence and similarity criteria for triangles to solve problems.',
      standard: 'CCSS.MATH.CONTENT.HSG.SRT.B.5',
    },
  ],
  prerequisites: ['ccss.math.8.g.a.4'],
  followUps: ['ccss.math.hsg.srt.c.6'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a photo zoom to anchor "same shape, different size".',
      script: 'Take a photo on your phone. Pinch to zoom in. The image gets bigger, but no part stretches more than another — your face stays your face. That\'s SIMILARITY: same shape, possibly different size, EVERY length scaled by the same factor.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-similarity',
      kind: 'concept',
      goal: 'Definition of similar; scale factor; the three triangle similarity shortcuts.',
      keyIdeas: [
        'Two figures are SIMILAR (~) if they have:',
        '  All corresponding ANGLES equal, AND',
        '  All corresponding SIDES proportional (same ratio).',
        'SCALE FACTOR (k): the ratio of corresponding side lengths. If figure 2 is twice as big as figure 1, k = 2.',
        'For TRIANGLES, three sufficient criteria (analogous to congruence):',
        'AA — two pairs of corresponding angles equal. (The third is automatic since angles sum to 180°.) MOST common shortcut.',
        'SAS-similarity — two pairs of sides PROPORTIONAL and the included angle equal.',
        'SSS-similarity — all three pairs of sides proportional.',
        'Once triangles are similar, you can SOLVE for unknown sides using proportions: corresponding-sides ratio is constant.',
        'CONGRUENT triangles are a special case of similar — with k = 1.',
      ],
      vocabulary: [
        { term: 'similar', definition: 'same shape, possibly different size; angles equal, sides proportional.' },
        { term: 'scale factor', definition: 'the constant ratio between corresponding sides of similar figures.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-aa',
      kind: 'worked_example',
      problem: 'Triangle ABC has angles 40°, 60°, 80°. Triangle DEF has angles 40°, 60°. Are they similar?',
      steps: [
        'Two pairs of equal angles given (40° and 60°).',
        'AA criterion satisfied → triangles similar.',
        '(The third angle of DEF must be 180 − 40 − 60 = 80° — it\'s forced.)',
      ],
      answer: 'Yes — similar by AA',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-find-side',
      kind: 'worked_example',
      problem: 'Triangle ABC ~ Triangle DEF. AB = 6, DE = 9, BC = 8. Find EF.',
      steps: [
        'Set up the proportion: AB/DE = BC/EF (corresponding sides).',
        '6/9 = 8/EF.',
        'Cross-multiply: 6 · EF = 9 · 8.',
        '6 · EF = 72. EF = 12.',
        'Sense-check: scale factor from ABC to DEF is 9/6 = 1.5. So EF should be 1.5 × 8 = 12. ✓',
      ],
      answer: '12',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two similar triangles. Smaller has sides 3, 4, 5. Larger has shortest side 9. Find the longest side of the larger triangle.',
      expectedAnswer: '15',
      responseFormat: 'numeric',
      hints: [
        'Scale factor: 9/3 = 3.',
        'Longest side of larger = 5 × 3 = 15.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-similar-vs-congruent',
      kind: 'misconception_check',
      question: 'Two triangles have all three angles equal (50°, 60°, 70°) and one pair of sides also equal (length 8). Asha concludes they\'re similar but not necessarily congruent. Right?',
      commonErrors: [
        {
          answer: 'yes — angles only give similar',
          misconception: 'Stopping at "similar" without using the equal side to upgrade to congruence.',
          correctsTo: 'They\'re BOTH similar AND congruent. AAA + one pair of corresponding sides equal forces the scale factor k = 1 — meaning every side pair must be equal. That\'s congruence (matches the AAS / ASA criteria depending on which side is given).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Similar = same shape, possibly different size.',
        'Corresponding angles equal AND corresponding sides proportional.',
        'Scale factor k connects every length pair.',
        'Triangle shortcuts: AA, SAS-similarity, SSS-similarity.',
        'Congruent is the k = 1 special case of similar.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A 6-foot person casts a 4-foot shadow. At the same time, a tree casts a 30-foot shadow. How tall is the tree?',
      hint: 'Person and shadow form a triangle similar to tree and shadow (sun rays at the same angle). Person height / person shadow = tree height / tree shadow → 6/4 = h/30 → h = 45 feet.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
