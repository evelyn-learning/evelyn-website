/**
 * Embed UI options — per-host choices about the in-frame session chrome.
 *
 * Defect this pins (GreenApple app walk 2026-10-05, M10): on a phone the only
 * finish control was an unlabelled red icon, and the ⋯ menu offered a "Humor"
 * selector inside a homework-help product. Two options, both resolved by
 * `resolveEmbedUiOptions` from the embed token (explicit `features.*` wins,
 * then a per-partner default, then today's behaviour):
 *   humorControl  — show the Humor section of the ⋯ menu   (default true)
 *   mobileFinish  — on small screens show a labelled "Finish" control in the
 *                   header that ends the session with the SAME `finish`
 *                   intent as the ⋯ menu's "Finish lesson"   (default false)
 * Every other host, and the retail /tutor page, renders what it rendered
 * before.
 *
 * Run: npx tsx scripts/test-embed-ui-options.tsx  (npm run test:embed-ui-options)
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { resolveEmbedUiOptions } from '../src/lib/tutor/portal/embed-ui-options';
import { EndControl } from '../src/app/tutor/components/session/EndControl';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}
const src = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8');
const noop = () => {};

/** The End/Pause button exactly as TutorSession rendered it inline before
 *  this change (unarmed / armed). */
const LEGACY_UNARMED =
  '<button title="End or pause — your progress is saved, resume anytime" aria-label="End or pause session" ' +
  'class="flex shrink-0 items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold border transition-colors bg-red-50 text-red-600 border-red-200 hover:bg-red-100">' +
  '<span class="inline-flex min-w-[2.25rem] justify-center sm:hidden">@ICON_NARROW@</span>@ICON_WIDE@' +
  '<span class="hidden sm:inline-block sm:min-w-[6.5rem]">End / Pause</span>' +
  '<span aria-live="polite" class="sr-only"></span></button>';

function main() {
  console.log('embed UI options');

  test('defaults: every host that says nothing keeps today\'s chrome', () => {
    for (const cfg of [
      undefined, null, {}, { partner_id: 'crimsora' }, { partner_id: 'academy' }, { partner_id: 'evelyntutor' },
      { partner_id: 'kanzoo' }, { partner_id: 'demo' }, { partner_id: '' },
      { partner_id: 'crimsora', features: {} }, { partner_id: 'crimsora', features: { text_mode: true } },
      { partner_id: 'GreenApple-Other' }, { partner_id: 42 }, { features: 'x' },
    ]) {
      assert.deepEqual(resolveEmbedUiOptions(cfg as never), { humorControl: true, mobileFinish: false, voiceMute: false, paceChip: true, videoControl: false, sessionTimer: true, endControl: true, toolsLow: false }, JSON.stringify(cfg));
    }
  });

  test('partner default: greenapple hides Humor and gets the labelled mobile Finish with no token change', () => {
    assert.deepEqual(resolveEmbedUiOptions({ partner_id: 'greenapple' }), { humorControl: false, mobileFinish: true, voiceMute: false, paceChip: true, videoControl: false, sessionTimer: true, endControl: true, toolsLow: false });
    assert.deepEqual(resolveEmbedUiOptions({ partner_id: 'greenapple', features: { text_mode: true } }), { humorControl: false, mobileFinish: true, voiceMute: false, paceChip: true, videoControl: false, sessionTimer: true, endControl: true, toolsLow: false });
  });

  test('partner default: gameclass gets the tutor-voice mute and no duplicate pace pill; nobody else does', () => {
    assert.deepEqual(resolveEmbedUiOptions({ partner_id: 'gameclass' }), { humorControl: true, mobileFinish: false, voiceMute: true, paceChip: false, videoControl: true, sessionTimer: true, endControl: true, toolsLow: true });
    assert.deepEqual(
      resolveEmbedUiOptions({ partner_id: 'gameclass', features: { voice_mute: false, pace_chip: true } }),
      { humorControl: true, mobileFinish: false, voiceMute: false, paceChip: true, videoControl: true, sessionTimer: true, endControl: true, toolsLow: true },
    );
    assert.deepEqual(
      resolveEmbedUiOptions({ partner_id: 'crimsora', features: { voice_mute: true, pace_chip: false } }),
      { humorControl: true, mobileFinish: false, voiceMute: true, paceChip: false, videoControl: false, sessionTimer: true, endControl: true, toolsLow: false },
    );
  });
  test('videoControl: default off; the video-lesson partner default on; an explicit token boolean wins', () => {
    assert.equal(resolveEmbedUiOptions({ partner_id: 'academy' }).videoControl, false);
    assert.equal(resolveEmbedUiOptions({ partner_id: 'gameclass' }).videoControl, true);
    assert.equal(resolveEmbedUiOptions({ partner_id: 'gameclass', features: { video_control: false } }).videoControl, false);
    assert.equal(resolveEmbedUiOptions({ partner_id: 'academy', features: { video_control: true } }).videoControl, true);
  });
  test('host-header options: a host that draws the timer and End itself turns ours off per token', () => {
    const o = resolveEmbedUiOptions({ partner_id: 'gameclass', features: { session_timer: false, end_control: false } });
    assert.equal(o.sessionTimer, false);
    assert.equal(o.endControl, false);
    assert.equal(resolveEmbedUiOptions({ partner_id: 'academy' }).toolsLow, false);
    assert.equal(resolveEmbedUiOptions({ partner_id: 'gameclass', features: { tools_low: false } }).toolsLow, false);
  });
  test('voice mute + pace pill are wired: option → TutorSession prop → control; mute goes through the handle', () => {
    const embed = src('src/app/tutor-portal/embed/page.tsx');
    const ts = src('src/app/tutor/components/session/TutorSession.tsx');
    const hook = src('src/app/tutor/hooks/useOpenAIRealtime.ts');
    assert.match(embed, /voiceMuteControl=\{uiOptions\.voiceMute\}/);
    assert.match(embed, /paceChip=\{uiOptions\.paceChip\}/);
    assert.match(ts, /voiceMuteControl = false, paceChip = true/);
    assert.match(ts, /\{paceChip && <button/);
    assert.match(ts, /setTutorVoiceMuted\?\.\(next\)/);
    assert.match(hook, /if \(voiceMutedRef\.current\) \{/);
    assert.ok(hook.includes('g.gain.value = 0;'), 'muted chunk plays through a zero gain');
  });

  test('explicit token fields win over the partner default, in both directions', () => {
    assert.deepEqual(
      resolveEmbedUiOptions({ partner_id: 'greenapple', features: { humor_control: true, mobile_finish: false } }),
      { humorControl: true, mobileFinish: false, voiceMute: false, paceChip: true, videoControl: false, sessionTimer: true, endControl: true, toolsLow: false },
    );
    assert.deepEqual(
      resolveEmbedUiOptions({ partner_id: 'crimsora', features: { humor_control: false, mobile_finish: true } }),
      { humorControl: false, mobileFinish: true, voiceMute: false, paceChip: true, videoControl: false, sessionTimer: true, endControl: true, toolsLow: false },
    );
    assert.deepEqual(resolveEmbedUiOptions({ partner_id: 'crimsora', features: { humor_control: false } }), { humorControl: false, mobileFinish: false, voiceMute: false, paceChip: true, videoControl: false, sessionTimer: true, endControl: true, toolsLow: false });
  });

  test('only real booleans count as explicit (a malformed claim falls back to the default)', () => {
    assert.deepEqual(
      resolveEmbedUiOptions({ partner_id: 'crimsora', features: { humor_control: 'false', mobile_finish: 1 } } as never),
      { humorControl: true, mobileFinish: false, voiceMute: false, paceChip: true, videoControl: false, sessionTimer: true, endControl: true, toolsLow: false },
    );
    assert.deepEqual(
      resolveEmbedUiOptions({ partner_id: 'greenapple', features: { humor_control: null, mobile_finish: 'no' } } as never),
      { humorControl: false, mobileFinish: true, voiceMute: false, paceChip: true, videoControl: false, sessionTimer: true, endControl: true, toolsLow: false },
    );
  });

  // ── the header end control ────────────────────────────────────────────────
  test('EndControl without mobileFinish is the previous End/Pause button, byte for byte', () => {
    const html = renderToStaticMarkup(<EndControl armed={false} mobileFinish={false} onPress={noop} />);
    const icons = [...html.matchAll(/<svg[\s\S]*?<\/svg>/g)].map((m) => m[0]);
    assert.equal(icons.length, 2, 'narrow-slot icon + wide icon');
    assert.match(icons[0], /class="[^"]*\bw-3\.5 h-3\.5\b/);
    assert.match(icons[1], /class="[^"]*\bhidden sm:inline-block w-3\.5 h-3\.5\b/);
    assert.equal(html, LEGACY_UNARMED.replace('@ICON_NARROW@', icons[0]).replace('@ICON_WIDE@', icons[1]));
    assert.equal((html.match(/<button/g) ?? []).length, 1);
    assert.doesNotMatch(html, /Finish/);
  });

  test('EndControl without mobileFinish, armed: "End?" / "End session?" as before', () => {
    const html = renderToStaticMarkup(<EndControl armed mobileFinish={false} onPress={noop} />);
    assert.match(html, /^<button title="Tap again to end the session" aria-label="Tap again to end the session" class="flex shrink-0 [^"]*bg-red-600 text-white border-red-600 hover:bg-red-700">/);
    assert.match(html, /<span class="inline-flex min-w-\[2\.25rem\] justify-center sm:hidden">End\?<\/span>/);
    assert.match(html, /<span class="hidden sm:inline-block sm:min-w-\[6\.5rem\]">End session\?<\/span>/);
    assert.match(html, /<span aria-live="polite" class="sr-only">Tap again to end the session<\/span>/);
    assert.doesNotMatch(html, /Finish/);
  });

  test('EndControl with mobileFinish: a TEXT "Finish" button below sm, End/Pause from sm up', () => {
    const html = renderToStaticMarkup(<EndControl armed={false} mobileFinish onPress={noop} />);
    const buttons = [...html.matchAll(/<button[\s\S]*?<\/button>/g)].map((m) => m[0]);
    assert.equal(buttons.length, 2);
    const [finish, end] = buttons;
    assert.match(finish, /data-testid="mobile-finish"/);
    assert.match(finish, /aria-label="Finish lesson"/);
    assert.match(finish, /class="flex sm:hidden shrink-0 /, 'shown on small screens only');
    assert.match(finish, />Finish<\/span>/, 'a visible text label');
    assert.doesNotMatch(finish, /<svg/, 'text, not only an icon');
    assert.match(end, /class="hidden sm:flex shrink-0 /, 'the icon-only control is not shown on small screens');
    assert.match(end, /End \/ Pause/);
  });

  test('EndControl with mobileFinish, armed: the label asks to confirm and keeps its width', () => {
    const html = renderToStaticMarkup(<EndControl armed mobileFinish onPress={noop} />);
    const finish = html.match(/<button[\s\S]*?<\/button>/)![0];
    assert.match(finish, />Finish\?<\/span>/);
    assert.match(finish, /aria-label="Tap again to finish the lesson"/);
    assert.match(finish, /min-w-\[2\.75rem\]/);
  });

  test('EndControl reports which control was pressed (finish intent only from the Finish button)', () => {
    const calls: Array<string | undefined> = [];
    const el = EndControl({ armed: false, mobileFinish: true, onPress: (intent) => calls.push(intent) }) as React.ReactElement<{ children: React.ReactElement<{ onClick: () => void }>[] }>;
    const [finishBtn, endBtn] = React.Children.toArray(el.props.children) as React.ReactElement<{ onClick: () => void }>[];
    finishBtn.props.onClick();
    endBtn.props.onClick();
    assert.deepEqual(calls, ['finish', undefined]);
  });

  // ── wiring ────────────────────────────────────────────────────────────────
  test('TutorSession: Finish uses the same end path and intent as the ⋯ menu\'s "Finish lesson"', () => {
    const ts = src('src/app/tutor/components/session/TutorSession.tsx');
    assert.match(ts, /<EndControl\s+armed=\{endArmed\}\s+mobileFinish=\{mobileFinishOn\}\s+onPress=\{pressEndControl\}/);
    assert.match(ts, /const mobileFinishOn = !!embedded && mobileFinish === true;/, 'embed-only: the retail page can never get it');
    const press = ts.slice(ts.indexOf('const pressEndControl ='), ts.indexOf('const endControlEl ='));
    assert.match(press, /if \(intent\) endIntentRef\.current = intent;/);
    assert.match(press, /if \(h\?\.endSession\) h\.endSession\(\);\s+else handleEndSession\(\);/);
    assert.match(press, /setTimeout\(\(\) => setEndArmed\(false\), 3000\)/, 'two-tap confirm kept');
  });

  test('TutorSession: the Humor section is rendered only when humorControl is on (default on)', () => {
    const ts = src('src/app/tutor/components/session/TutorSession.tsx');
    assert.match(ts, /humorControl = true,/);
    assert.match(ts, /\{humorControl && \(\s*<>\s*<div className="my-1 border-t border-slate-100" \/>\s*<p [^>]*>Humor<\/p>/);
  });

  test('embed page resolves the options from the token and passes both; /tutor passes neither', () => {
    const embed = src('src/app/tutor-portal/embed/page.tsx');
    assert.match(embed, /const uiOptions = useMemo\(\(\) => resolveEmbedUiOptions\(config\), \[config\]\);/);
    assert.match(embed, /humorControl=\{uiOptions\.humorControl\}/);
    assert.match(embed, /mobileFinish=\{uiOptions\.mobileFinish\}/);
    const retail = src('src/app/tutor/page.tsx');
    assert.doesNotMatch(retail, /humorControl|mobileFinish/);
  });

  console.log(`\n${passed}/${passed + failed} passed`);
  process.exit(failed ? 1 : 0);
}
main();
