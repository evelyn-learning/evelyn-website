import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { mountTutor } from '../dist/esm/embed.js';

const SESSION_URL = 'https://tutor.evelynlearning.com/embed?token=a.b.c';

/** The few DOM pieces mountTutor touches. */
function fakeDom() {
  const listeners = new Map();
  const view = {
    addEventListener: (type, fn) => listeners.set(type, fn),
    removeEventListener: (type, fn) => listeners.get(type) === fn && listeners.delete(type),
  };
  const children = [];
  const document = {
    defaultView: view,
    createElement(tag) {
      const element = { tagName: tag.toUpperCase(), style: {}, contentWindow: {}, remove: () => children.splice(children.indexOf(element), 1) };
      return element;
    },
  };
  const container = { ownerDocument: document, appendChild: (element) => children.push(element) };
  return { container, children, post: (event) => listeners.get('message')?.(event), listening: () => listeners.has('message') };
}

test('mountTutor creates the iframe with the permissions a voice session needs', () => {
  const dom = fakeDom();
  const { iframe } = mountTutor(dom.container, { sessionUrl: SESSION_URL });
  assert.deepEqual(dom.children, [iframe]);
  assert.equal(iframe.tagName, 'IFRAME');
  assert.equal(iframe.src, SESSION_URL);
  assert.equal(iframe.allow, 'microphone; camera; autoplay; clipboard-write');
  assert.equal(iframe.allowFullscreen, true);
  assert.equal(iframe.title, 'Tutor');
  assert.deepEqual(iframe.style, { width: '100%', height: '100%', border: '0' });
});

test('events from the session page reach the callbacks', () => {
  const dom = fakeDom();
  const seen = [];
  const { iframe } = mountTutor(dom.container, {
    sessionUrl: SESSION_URL,
    onStarted: (data) => seen.push(['started', data]),
    onProgress: (data) => seen.push(['progress', data]),
    onEnded: (data) => seen.push(['ended', data]),
    onEvent: (message) => seen.push(['event', message.type]),
  });
  const post = (data) => dom.post({ origin: 'https://tutor.evelynlearning.com', source: iframe.contentWindow, data });
  post({ type: 'evelyn:session_started', data: { session_id: 's1' } });
  post({ type: 'evelyn:progress', data: { session_id: 's1', lesson_progress: { percent: 40 } } });
  post({ type: 'evelyn:start_blocked', reason: 'minutes_exhausted' });
  post({ type: 'evelyn:session_ended', data: { session_id: 's1', duration: 300, ended_reason: 'time_limit' } });
  assert.deepEqual(seen, [
    ['event', 'evelyn:session_started'],
    ['started', { session_id: 's1' }],
    ['event', 'evelyn:progress'],
    ['progress', { session_id: 's1', lesson_progress: { percent: 40 } }],
    ['event', 'evelyn:start_blocked'],
    ['event', 'evelyn:session_ended'],
    ['ended', { session_id: 's1', duration: 300, ended_reason: 'time_limit' }],
  ]);
});

test('messages from another origin, another window or of another shape are ignored', () => {
  const dom = fakeDom();
  const seen = [];
  const { iframe } = mountTutor(dom.container, { sessionUrl: SESSION_URL, onEvent: (message) => seen.push(message), onEnded: (data) => seen.push(data) });
  const ended = { type: 'evelyn:session_ended', data: { session_id: 's1', duration: 1 } };
  dom.post({ origin: 'https://evil.example', source: iframe.contentWindow, data: ended });
  dom.post({ origin: 'https://tutor.evelynlearning.com.evil.example', source: iframe.contentWindow, data: ended });
  dom.post({ origin: 'https://tutor.evelynlearning.com', source: {}, data: ended });
  dom.post({ origin: 'https://tutor.evelynlearning.com', source: iframe.contentWindow, data: 'evelyn:session_ended' });
  dom.post({ origin: 'https://tutor.evelynlearning.com', source: iframe.contentWindow, data: null });
  dom.post({ origin: 'https://tutor.evelynlearning.com', source: iframe.contentWindow, data: { type: 'other:thing' } });
  assert.deepEqual(seen, []);
});

test('destroy removes the iframe and stops listening', () => {
  const dom = fakeDom();
  const mounted = mountTutor(dom.container, { sessionUrl: SESSION_URL });
  assert.ok(dom.listening());
  mounted.destroy();
  assert.deepEqual(dom.children, []);
  assert.ok(!dom.listening());
});

test('a session URL that is not a URL is refused', () => {
  assert.throws(() => mountTutor(fakeDom().container, { sessionUrl: 'embed?token=x' }));
});

test('the embed entry is safe for a browser bundle: no imports, no Node built-ins', () => {
  for (const file of ['../dist/esm/embed.js', '../dist/cjs/embed.js']) {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /\bimport\b|require\(|node:|process\./, file);
  }
});
