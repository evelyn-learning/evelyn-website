/**
 * Grades 9-10 Computer Science — Web Development.
 *
 * Beyond HTML/CSS: JavaScript for interactivity, DOM, events.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_CS_WEB_DEVELOPMENT: LessonPlan = {
  id: 'evelyn.cs.9-10.web-development.v1',
  title: 'Web development — JavaScript and the DOM',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'cs',
  topic: 'web-development',
  locale: 'en',
  los: [
    {
      id: 'cs910.web-development',
      description: 'Add interactivity to a web page using JavaScript, DOM access, and event listeners.',
      standard: 'CSTA-3A-AP-14',
    },
  ],
  prerequisites: ['cs68.web'],
  followUps: ['cs910.databases'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame JS as what gives a web page behavior.',
      script: 'Static HTML is a poster. CSS makes the poster look nice. JavaScript turns it into a vending machine: press a button, something happens. Every interactive thing on a webpage — clicking like, expanding a menu, submitting a form — is JS in some form.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-js-dom',
      kind: 'concept',
      goal: 'JS basics + DOM + events.',
      keyIdeas: [
        'JS is a scripting language that runs IN THE BROWSER as part of the page.',
        'Variables: let count = 0. Functions: function add(a, b) { return a + b; }. Arrays: [1, 2, 3]. Objects: {name: "Maya", age: 14}.',
        'DOM (Document Object Model): the in-memory tree representation of the HTML page. JS can read and modify it.',
        'document.querySelector("#btn") — find one element by id or CSS selector.',
        'element.textContent = "Hello" — change what\'s shown.',
        'element.addEventListener("click", function() { ... }) — run code when something happens.',
        'EVENTS: click, input, submit, keydown, mouseover, etc. The browser fires these; you listen.',
        'JS runs CLIENT-SIDE — in the user\'s browser. Each user has their own copy.',
      ],
      vocabulary: [
        { term: 'DOM', definition: 'the live tree of HTML elements that JS can manipulate.' },
        { term: 'event listener', definition: 'a function registered to run when a specific event fires.' },
        { term: 'querySelector', definition: 'DOM method that finds the first element matching a CSS selector.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-counter',
      kind: 'worked_example',
      problem: 'Make a button that increments a counter each time it\'s clicked.',
      steps: [
        '<!-- HTML -->',
        '<button id="btn">Click me</button>',
        '<p id="count">0</p>',
        '',
        '// JS',
        'let n = 0;',
        'const btn = document.querySelector("#btn");',
        'const out = document.querySelector("#count");',
        'btn.addEventListener("click", () => {',
        '  n = n + 1;',
        '  out.textContent = n;',
        '});',
        '// Each click: increment n, update what the <p> shows.',
      ],
      answer: 'A button that updates a counter on each click.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You want code to run when the user types in an input field. What event do you listen for?',
      expectedAnswer: 'input (or keydown / keyup)',
      responseFormat: 'free',
      hints: [
        'Click is for buttons; input is for text boxes.',
        'Each keystroke fires the event.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-html-vs-dom',
      kind: 'misconception_check',
      question: 'A student says: "If I change textContent in JS, the HTML file on the server changes too." Why is that wrong?',
      commonErrors: [
        {
          answer: 'because the page changed',
          misconception: 'Confusing the live DOM with the HTML source.',
          correctsTo: 'JS modifies the DOM in the browser\'s memory. The HTML file on the server is unchanged. Refresh the page and your changes disappear unless you persist them (server, localStorage, cookies). The DOM is a working copy, not the source.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'HTML = structure. CSS = looks. JS = behavior.',
        'DOM is the live tree of elements; JS mutates it.',
        'Events fire when users interact; addEventListener registers a handler.',
        'Refreshing reverts JS changes — the source HTML is unchanged.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What does "client-side" vs "server-side" mean, and why does it matter for security?',
      hint: 'CLIENT-SIDE code runs on each user\'s machine — they can read it, modify it, or disable it. So you can NEVER trust client-side validation alone. SERVER-SIDE code runs on your servers; users see only the result. Sensitive checks (auth, payment, data integrity) must run server-side.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
