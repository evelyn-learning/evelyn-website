// Header Full screen control (demo-polish, 2026-10-29): the board tool
// cluster is hidden by default, so the one control students looked for in
// it — Full screen — moves to the session header as a labelled button.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeaderFullscreenButton } from '../src/app/tutor/components/session/HeaderFullscreenButton';

const src = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');
let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

const on = renderToStaticMarkup(<HeaderFullscreenButton api={{ available: true, active: false, toggle() {} }} />);
check('renders with the testid', on.includes('data-testid="header-fullscreen"'));
check('labelled Full screen', on.includes('Full screen'));
check('title carries the label', on.includes('title="Full screen"'));

const active = renderToStaticMarkup(<HeaderFullscreenButton api={{ available: true, active: true, toggle() {} }} />);
check('active reads Exit full screen', active.includes('Exit full screen'));

const compact = renderToStaticMarkup(<HeaderFullscreenButton api={{ available: true, active: false, toggle() {} }} compact />);
check('compact keeps the title but hides the label text', compact.includes('title="Full screen"') && !/>Full screen</.test(compact));

check('unavailable renders nothing', renderToStaticMarkup(<HeaderFullscreenButton api={{ available: false, active: false, toggle() {} }} />) === '');
check('null api renders nothing', renderToStaticMarkup(<HeaderFullscreenButton api={null} />) === '');

// Wiring pins: stage → TutorSession state → SessionControls, and the phone slot.
const stage = src('src/app/tutor/components/session/SessionStage.tsx');
const ts = src('src/app/tutor/components/session/TutorSession.tsx');
const sc = src('src/app/tutor/components/SessionControls.tsx');
check('stage reports its fullscreen api', /onFullscreenApiRef\.current\?\.\(\{ available/.test(stage));
check('stage phone slot carries the compact button', /sm:hidden[^\n]*HeaderFullscreenButton[^\n]*compact/.test(stage) || /<HeaderFullscreenButton api=\{headerFsApi\} compact \/>/.test(stage));
check('TutorSession holds the api in state', /useState<FullscreenApi \| null>\(null\)/.test(ts));
check('TutorSession hands the api to the controls', /fullscreen=\{fullscreenApi\}/.test(ts));
check('TutorSession listens to the stage', /onFullscreenApi=\{setFullscreenApi\}/.test(ts));
check('SessionControls renders the button', /<HeaderFullscreenButton api=\{fullscreen/.test(sc));

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all header-fullscreen checks passed');
