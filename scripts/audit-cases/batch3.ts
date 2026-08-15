/**
 * Clip-audit cases — batch 3 (fractions/trees/organizers):
 * FractionComparisonRenderer, TreeRenderer, VennDiagramRenderer,
 * WritingFrameRenderer, GraphicOrganizerRenderer (kwl/t_chart),
 * EarlyMathRenderer (bar_model).
 * All fixed 2026-08-07 — every case is now a permanent regression test
 * (expectViolation:false, same payloads that used to clip).
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { AuditCase } from '../lib/svg-text-extents';
import { FractionComparisonRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/FractionComparisonRenderer';
import { TreeRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/TreeRenderer';
import { VennDiagramRenderer } from '../../apps/marketing/src/app/tutor/components/whiteboard/VennDiagramRenderer';
import WritingFrameRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/WritingFrameRenderer';
import GraphicOrganizerRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/GraphicOrganizerRenderer';
import EarlyMathRenderer from '../../apps/marketing/src/app/tutor/components/whiteboard/EarlyMathRenderer';

/**
 * The extent checker only sees <text>/<tspan> INSIDE the svg — content the
 * fixes moved to HTML (h3 titles) or foreignObject (organizer items) passes
 * it trivially. This wrapper ALSO asserts the strings are actually present
 * in the rendered markup; on failure it swaps in an intentionally-clipping
 * sentinel svg so the harness reports the case as an unexpected failure.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withContentCheck(name: string, el: React.ReactElement<any>, mustContain: string[]): AuditCase {
  let missing: string[];
  try {
    const markup = renderToStaticMarkup(el);
    missing = mustContain.filter((s) => !markup.includes(s));
  } catch {
    missing = mustContain; // render threw — the harness will surface it
    return { name, expectViolation: false, el };
  }
  if (missing.length > 0) {
    return {
      name: `${name} — MISSING content: ${missing.map((s) => s.slice(0, 30)).join(' | ')}`,
      expectViolation: false,
      el: React.createElement(
        'svg',
        { viewBox: '0 0 10 10' },
        React.createElement('text', { x: 0, fontSize: 12 }, 'content-missing-sentinel'),
      ),
    };
  }
  return { name, expectViolation: false, el };
}

export const CASES: AuditCase[] = [
  {
    name: 'FractionComparisonRenderer bar label',
    expectViolation: false,
    el: React.createElement(FractionComparisonRenderer, {
      figure: { fractions: [{ numerator: 2, denominator: 3, label: 'two-thirds of the pizza' }], style: 'bar' },
    }),
  },
  {
    name: 'FractionComparisonRenderer circle labels',
    expectViolation: false,
    el: React.createElement(FractionComparisonRenderer, {
      figure: {
        fractions: [
          { numerator: 2, denominator: 3, label: 'two-thirds of the pizza remaining after lunch' },
          { numerator: 1, denominator: 2, label: 'one-half' },
        ],
        style: 'circle',
      },
    }),
  },
  withContentCheck(
    'TreeRenderer title moved to HTML heading',
    React.createElement(TreeRenderer, {
      title: 'Probability of drawing two red cards without replacement',
      type: 'probability',
      root: {
        label: 'Start',
        children: [
          { label: 'Red', probability: '1/2', node: { label: 'R' } },
          { label: 'Black', probability: '1/2', node: { label: 'B' } },
        ],
      },
    }),
    ['Probability of drawing two red cards without replacement'],
  ),
  {
    name: 'TreeRenderer long node + branch labels',
    expectViolation: false,
    el: React.createElement(TreeRenderer, {
      type: 'probability',
      showLeafProbabilities: true,
      root: {
        label: 'All the students surveyed at lunch',
        children: [
          {
            label: 'brings a packed lunch from home',
            probability: '2/5',
            node: { label: 'Brings packed lunch every day', value: 'about 120 students total' },
          },
          {
            label: 'buys lunch',
            probability: '3/5',
            node: { label: 'Buys cafeteria lunch' },
          },
        ],
      },
    }),
  },
  withContentCheck(
    'VennDiagramRenderer title moved to HTML heading',
    React.createElement(VennDiagramRenderer, {
      title: 'Students who play a sport and students who play an instrument',
      sets: [{ label: 'Plays a school sport' }, { label: 'Plays an instrument' }],
      regions: { a: { items: ['Ravi'] }, b: { items: ['Chloe'] }, ab: { items: ['Sam'] } },
    }),
    ['Students who play a sport and students who play an instrument'],
  ),
  {
    name: 'VennDiagramRenderer 3-set long labels + neither items',
    expectViolation: false,
    el: React.createElement(VennDiagramRenderer, {
      sets: [
        { label: 'Students in the jazz band program' },
        { label: 'Students on the robotics team roster' },
        { label: 'Students in the drama club production' },
      ],
      regions: {
        onlyA: { value: '12' },
        onlyB: { value: '9' },
        onlyC: { value: '7' },
        ABC: { value: '2' },
        neither: { items: ['students who do neither activity this semester'] },
      },
    }),
  },
  {
    name: 'WritingFrameRenderer sentence_stems long stems',
    expectViolation: false,
    el: React.createElement(WritingFrameRenderer, {
      spec: {
        kind: 'sentence_stems',
        stems: [
          'I predict the main character will change her mind because the evidence in chapter three shows that',
          'The author uses the storm as a symbol of the conflict between the two families, which suggests that',
          'One question I still have after reading this passage is',
        ],
      },
    }),
  },
  {
    name: 'WritingFrameRenderer five_paragraph long thesis hint',
    expectViolation: false,
    el: React.createElement(WritingFrameRenderer, {
      spec: {
        kind: 'five_paragraph',
        thesisHint:
          'School districts should start the high school day later because sleep research shows teenagers learn better after 8am',
        bodyTopics: [
          'sleep research on teenage circadian rhythms and academic performance',
          'attendance and tardiness data from districts that moved start times',
          'counterarguments about buses and after-school sports, and why they can be solved',
        ],
      },
    }),
  },
  withContentCheck(
    'GraphicOrganizerRenderer kwl items in foreignObject',
    React.createElement(GraphicOrganizerRenderer, {
      spec: {
        kind: 'kwl',
        know: ['Water evaporates from the ocean when the sun heats it'],
        want: ['Where does the water go when it soaks into the ground'],
        learned: ['The water cycle moves water between the ocean, the air, and the land over and over'],
      },
    }),
    [
      'Water evaporates from the ocean when the sun heats it',
      'Where does the water go when it soaks into the ground',
      'The water cycle moves water between the ocean, the air, and the land over and over',
      'what I Know',
    ],
  ),
  withContentCheck(
    'GraphicOrganizerRenderer t_chart headers + items in foreignObject',
    React.createElement(GraphicOrganizerRenderer, {
      spec: {
        kind: 't_chart',
        leftHeader: 'Advantages of renewable energy sources',
        rightHeader: 'Disadvantages of renewable energy sources',
        leftItems: ['No greenhouse gas emissions while generating electricity'],
        rightItems: ['Output depends on the weather and the time of day'],
      },
    }),
    [
      'Advantages of renewable energy sources',
      'Disadvantages of renewable energy sources',
      'No greenhouse gas emissions while generating electricity',
      'Output depends on the weather and the time of day',
    ],
  ),
  {
    name: 'EarlyMathRenderer bar_model tiny part + long question',
    expectViolation: false,
    el: React.createElement(EarlyMathRenderer, {
      spec: {
        kind: 'bar_model',
        whole: { value: 48, label: 'savings goal' },
        parts: [
          { value: 46, label: 'money already saved' },
          { value: 2, label: 'still needs to save' },
        ],
        question: 'How much more money does Priya need to save each week to reach her goal before the trip',
      },
    }),
  },
];
