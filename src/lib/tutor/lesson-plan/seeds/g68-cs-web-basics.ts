/**
 * Grades 6-8 Computer Science — Web Basics (HTML/CSS).
 *
 * What HTML is, what CSS is, why they're separate.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_CS_WEB_BASICS: LessonPlan = {
  id: 'evelyn.cs.6-8.web-basics.v1',
  title: 'Web basics — HTML structures, CSS styles',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'cs',
  topic: 'web-basics',
  locale: 'en',
  los: [
    {
      id: 'cs68.web',
      description: 'Distinguish HTML (structure) from CSS (presentation) and write a small page using both.',
      standard: 'CSTA-2-AP-14',
    },
  ],
  prerequisites: ['cs68.intro'],
  followUps: ['cs912.web-development'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame HTML and CSS as the bones and the clothes of a web page.',
      script: 'Every website you\'ve ever seen — every YouTube page, every Wikipedia article, every game — is built from two main languages working together. HTML is the BONES: what is on the page. CSS is the CLOTHES: how it looks. Same bones, different clothes = different look. Same clothes, different bones = different page.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-html-css',
      kind: 'concept',
      goal: 'Tags, attributes, selectors, properties.',
      keyIdeas: [
        'HTML uses TAGS: <h1>Heading</h1>, <p>paragraph</p>, <a href="...">link</a>, <img src="...">.',
        'Most tags come in PAIRS: open <p> and close </p>. The slash on the close tag is critical.',
        'Tags can NEST: <p>Hello <strong>world</strong>!</p>. Inner closes before outer.',
        'CSS uses SELECTORS + PROPERTIES: h1 { color: red; font-size: 32px; }',
        'CSS lives either inside a <style> tag or in a separate .css file linked with <link>.',
        'Why split? CHANGE: changing CSS doesn\'t require touching HTML. REUSE: one stylesheet styles many pages.',
        'A web page is just a TEXT FILE with a .html extension. Open one in a text editor — no magic.',
      ],
      vocabulary: [
        { term: 'tag', definition: 'an HTML marker like <p> that wraps content.' },
        { term: 'selector', definition: 'a CSS pattern (like h1 or .button) saying which elements to style.' },
        { term: 'property', definition: 'a CSS rule like color or font-size with a value.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-page',
      kind: 'worked_example',
      problem: 'Write a tiny HTML page with one heading and one paragraph, with the heading in blue.',
      steps: [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '  <style>',
        '    h1 { color: blue; }',
        '  </style>',
        '</head>',
        '<body>',
        '  <h1>Hello!</h1>',
        '  <p>This is my first page.</p>',
        '</body>',
        '</html>',
        '// h1 selector applies color blue to every h1 on the page.',
      ],
      answer: 'A page with a blue heading and a paragraph.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You want every paragraph on the page to have a font size of 18 pixels. Write the CSS rule.',
      expectedAnswer: 'p { font-size: 18px; }',
      responseFormat: 'free',
      hints: [
        'The selector targets every <p> tag.',
        'The property is font-size; the value is 18px.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-formatting-in-html',
      kind: 'misconception_check',
      question: 'A student writes <p color="red">hi</p>. Will the text be red?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating HTML attributes as styling.',
          correctsTo: 'Color is a CSS property, not an HTML attribute on <p>. Modern HTML keeps presentation OUT of the markup. Use CSS: <p style="color: red">hi</p>, or better, set p { color: red; } in a stylesheet.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'HTML = structure (tags and content). CSS = presentation (colors, sizes, layout).',
        'Tags usually come in pairs; close tags have a slash.',
        'CSS rules have a selector and a block of property: value pairs.',
        'A web page is just a .html text file.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Modern sites also use JavaScript. What does JS add that HTML and CSS can\'t do?',
      hint: 'HTML and CSS describe a STATIC page. JS adds BEHAVIOR: respond to clicks, fetch data, update the page after it loads. HTML is what is, CSS is how it looks, JS is what it does.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
