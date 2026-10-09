/**
 * Practice-figure SVG safety (src/lib/tutor/practice-figure/svg-safety.ts) —
 * the one validator used when a figure is authored and again when it is
 * served. One case per forbidden construct, plus the disguises a filter that
 * searched for known-bad strings would miss (entities, case, whitespace,
 * CSS escapes), and the shapes that must keep passing.
 *
 * Pure: no database, no network, no DOM.
 * Run: npm run test:practice-figure-svg   (npx tsx scripts/test-practice-figure-svg.ts)
 */
import { strict as assert } from 'node:assert';
import { MAX_FIGURE_SVG_CHARS, isSafeFigureSvg, validateFigureSvg, type SvgSafetyIssue } from '../src/lib/tutor/practice-figure/svg-safety';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL - ${name}`);
    console.error(e);
  }
}

const NS = 'xmlns="http://www.w3.org/2000/svg"';
const wrap = (inner: string, rootAttrs = '') => `<svg ${NS} viewBox="0 0 100 80"${rootAttrs ? ` ${rootAttrs}` : ''}>${inner}</svg>`;
const issuesOf = (svg: unknown): SvgSafetyIssue[] => {
  const r = validateFigureSvg(svg);
  return r.ok ? [] : r.issues;
};
/** Refused, and for the stated reason (others may be reported too). */
function refuses(svg: unknown, issue: SvgSafetyIssue, label = String(svg).slice(0, 70)): void {
  const got = issuesOf(svg);
  assert.ok(got.includes(issue), `${label}\n   expected ${issue}, got [${got.join(', ')}]`);
  assert.equal(isSafeFigureSvg(svg), false);
}

console.log('\nWhat a figure may be:\n');

test('a plain drawing passes: shapes, text, groups, defs, clip paths, markers, gradients, fragment references', () => {
  const ok = wrap(
    '<defs><clipPath id="c"><rect x="0" y="0" width="50" height="50"/></clipPath>'
    + '<marker id="m" viewBox="0 0 10 10" refX="9" refY="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#111"/></marker>'
    + '<linearGradient id="g"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs>'
    + '<rect width="100" height="80" fill="#ffffff"/>'
    + '<g clip-path="url(#c)" transform="translate(2 3)"><path d="M0,0L10,10" stroke="#1d4ed8" fill="none"/><circle cx="5" cy="5" r="2" fill="url(#g)"/></g>'
    + '<line x1="0" y1="0" x2="10" y2="10" stroke="#111" marker-end="url(#m)"/>'
    + '<polyline points="0,0 1,1"/><polygon points="0,0 1,1 2,0"/><ellipse cx="1" cy="1" rx="1" ry="2"/>'
    + '<text x="5" y="5" font-size="11" style="font-style:italic">y = x &lt; 2 &amp; x &gt; 0<tspan dy="3">a</tspan></text>'
    + '<use href="#m"/><use xlink:href="#m"/><!-- a comment --><title>t</title><desc>d</desc>',
    'role="img" font-family="system-ui, -apple-system, \'Segoe UI\', sans-serif" preserveAspectRatio="xMidYMid meet" xmlns:xlink="http://www.w3.org/1999/xlink"',
  );
  assert.deepEqual(issuesOf(ok), []);
  assert.equal(isSafeFigureSvg(ok), true);
  // Surrounding whitespace, single quotes, a negative viewBox origin, an inert <style>.
  assert.deepEqual(issuesOf(`\n  <svg ${NS} viewBox='-10 -10 120.5 80'><style>text { fill: #111; font-weight: 600 }</style><g></g></svg>\n`), []);
});

console.log('\nShape of the document:\n');

test('not a string / empty', () => {
  for (const v of [undefined, null, 42, {}, '', '   ']) refuses(v, 'empty', JSON.stringify(v));
});

test(`longer than ${MAX_FIGURE_SVG_CHARS} characters`, () => {
  const big = wrap(`<path d="${'M0,0L1,1'.repeat(26_000)}"/>`);
  assert.ok(big.length > MAX_FIGURE_SVG_CHARS);
  refuses(big, 'too_large', 'big');
  const fits = wrap(`<path d="${'M0,0L1,1'.repeat(24_000)}"/>`);
  assert.ok(fits.length <= MAX_FIGURE_SVG_CHARS);
  assert.deepEqual(issuesOf(fits), []);
});

test('must be ONE root <svg>, nothing around it', () => {
  refuses(`${wrap('')}${wrap('')}`, 'not_single_svg_root');
  refuses(`<div>${wrap('')}</div>`, 'not_single_svg_root');
  refuses(`hello ${wrap('')}`, 'not_single_svg_root');
  refuses(`${wrap('')} trailing`, 'not_single_svg_root');
  refuses('<g></g>', 'not_single_svg_root');
  refuses('just text', 'not_single_svg_root');
});

test('the root needs a viewBox of four numbers', () => {
  refuses(`<svg ${NS}><g></g></svg>`, 'missing_viewbox');
  refuses(`<svg ${NS} viewBox="0 0 100"><g></g></svg>`, 'missing_viewbox');
  refuses(`<svg ${NS} viewbox="0 0 100 80"><g></g></svg>`, 'missing_viewbox');
  refuses(`<svg ${NS} viewBox="a b c d"></svg>`, 'missing_viewbox');
});

test('must be well formed', () => {
  refuses(`<svg ${NS} viewBox="0 0 1 1"><g></svg>`, 'malformed');
  refuses(`<svg ${NS} viewBox="0 0 1 1"><g>`, 'malformed');
  refuses(`<svg ${NS} viewBox="0 0 1 1"><rect width=5/></svg>`, 'malformed');
  refuses(`<svg ${NS} viewBox="0 0 1 1"><rect hidden/></svg>`, 'malformed');
  refuses(`<svg ${NS} viewBox="0 0 1 1"><text>a < b</text></svg>`, 'malformed');
  refuses(`<svg ${NS} viewBox="0 0 1 1"><!-- never closed</svg>`, 'malformed');
  refuses(`<svg ${NS} viewBox="0 0 1 1"></g></svg>`, 'malformed');
});

test('no DOCTYPE / entity declarations, processing instructions or CDATA', () => {
  refuses(`<!DOCTYPE svg [<!ENTITY x "y">]>${wrap('')}`, 'doctype_or_entity');
  refuses(`<?xml version="1.0"?>${wrap('')}`, 'processing_instruction');
  refuses(`<?xml-stylesheet href="https://evil.example/x.css"?>${wrap('')}`, 'processing_instruction');
  refuses(wrap('<style><![CDATA[ a { } ]]></style>'), 'cdata');
});

console.log('\nThings that run code or load a resource:\n');

test('<script>', () => {
  refuses(wrap('<script>alert(1)</script>'), 'script_element');
  refuses(wrap('<SCRIPT>alert(1)</SCRIPT>'), 'script_element');
  refuses(wrap('<script href="#x"/>'), 'script_element');
  refuses(wrap('<g><g><script type="text/ecmascript">1</script></g></g>'), 'script_element');
});

test('<foreignObject>', () => {
  refuses(wrap('<foreignObject width="10" height="10"><div xmlns="http://www.w3.org/1999/xhtml">x</div></foreignObject>'), 'foreign_object');
  refuses(wrap('<foreignobject></foreignobject>'), 'foreign_object');
});

test('<iframe>', () => {
  refuses(wrap('<iframe src="https://evil.example"></iframe>'), 'iframe_element');
});

test('<image> — external, data: or otherwise', () => {
  refuses(wrap('<image href="https://evil.example/t.png" width="1" height="1"/>'), 'image_element');
  refuses(wrap('<image href="https://evil.example/t.png" width="1" height="1"/>'), 'external_href');
  refuses(wrap('<image xlink:href="data:image/png;base64,AAAA"/>'), 'image_element');
  refuses(wrap('<image xlink:href="data:image/png;base64,AAAA"/>'), 'data_url');
});

test('any element outside the drawing allowlist', () => {
  for (const el of ['a', 'animate', 'set', 'animateTransform', 'animateMotion', 'object', 'embed', 'audio', 'video', 'link', 'meta', 'filter', 'feImage', 'switch', 'div', 'handler', 'listener']) {
    refuses(wrap(`<${el}></${el}>`), 'disallowed_element', el);
  }
  // The classic: an animation that rewrites an href.
  refuses(wrap('<a><set attributeName="href" to="javascript:alert(1)"/><text>x</text></a>'), 'disallowed_element');
});

test('event-handler attributes (on*=), any case, any element', () => {
  refuses(wrap('', 'onload="alert(1)"'), 'event_handler');
  refuses(wrap('<rect onclick="x()" width="1" height="1"/>'), 'event_handler');
  refuses(wrap('<g ONMOUSEOVER="x()"></g>'), 'event_handler');
  refuses(wrap("<circle onfocus='x()' r='1'/>"), 'event_handler');
  refuses(wrap('<path onbegin="x()" d="M0,0"/>'), 'event_handler');
});

test('href / xlink:href that is not a same-document fragment', () => {
  refuses(wrap('<use href="https://evil.example/sprite.svg#a"/>'), 'external_href');
  refuses(wrap('<use xlink:href="//evil.example/sprite.svg#a"/>'), 'external_href');
  refuses(wrap('<use href="other.svg#a"/>'), 'external_href');
  refuses(wrap('<use href="javascript:alert(1)"/>'), 'external_href');
  refuses(wrap('<use href=""/>'), 'external_href');
  refuses(wrap('<linearGradient id="g" href="http://evil.example/#g"/>'), 'external_href');
  assert.deepEqual(issuesOf(wrap('<defs><path id="a.b-1" d="M0,0"/></defs><use href="#a.b-1"/>')), []);
});

test('javascript: URLs, however they are disguised', () => {
  refuses(wrap('<use href="javascript:alert(1)"/>'), 'script_url');
  refuses(wrap('<use href="JaVaScRiPt:alert(1)"/>'), 'script_url');
  refuses(wrap('<use href="  java\tscript:alert(1)"/>'), 'script_url');
  refuses(wrap('<use href="&#106;avascript:alert(1)"/>'), 'script_url');
  refuses(wrap('<use href="&#x6A;avascript&colon;alert(1)"/>'), 'script_url');
  refuses(wrap('<rect fill="javascript:alert(1)" width="1" height="1"/>'), 'script_url');
  refuses(wrap('<use href="vbscript:x"/>'), 'script_url');
});

test('data: URLs — none at all', () => {
  refuses(wrap('<use href="data:image/svg+xml;base64,PHN2Zz48L3N2Zz4="/>'), 'data_url');
  refuses(wrap('<rect fill="url(data:image/png;base64,AAAA)" width="1" height="1"/>'), 'data_url');
  refuses(wrap('<rect style="background: url(DATA:image/png;base64,AAAA)" width="1" height="1"/>'), 'data_url');
});

test('external URLs anywhere in an attribute value', () => {
  refuses(wrap('<rect fill="url(https://evil.example/p.svg#g)" width="1" height="1"/>'), 'external_url');
  refuses(wrap('<rect fill="url(//evil.example/p.svg#g)" width="1" height="1"/>'), 'external_url');
  refuses(wrap('<rect fill="url(other.svg#g)" width="1" height="1"/>'), 'external_url');
  refuses(wrap('<g clip-path="url( &quot;http://evil.example/c#c&quot; )"></g>'), 'external_url');
  refuses(wrap('<text font-family="x" style="src: local(x), ftp://evil.example/f.woff">t</text>'), 'external_url');
  refuses(`<svg xmlns="http://evil.example/ns" viewBox="0 0 1 1"></svg>`, 'external_url');
  assert.deepEqual(issuesOf(wrap('<rect fill="url(#g)" clip-path="url(\'#c\')" width="1" height="1"/>')), []);
});

test('<style> with @import or url(', () => {
  refuses(wrap('<style>@import "https://evil.example/x.css";</style>'), 'style_import');
  refuses(wrap('<style>@IMPORT url(x.css);</style>'), 'style_import');
  refuses(wrap('<style>@\\69mport "x.css";</style>'), 'style_import');
  refuses(wrap('<style>text { fill: url(https://evil.example/g.svg#g) }</style>'), 'style_url');
  refuses(wrap('<style>@font-face { font-family: x; src: url(f.woff) }</style>'), 'style_url');
  refuses(wrap('<style>rect { background: u\\72l(x.png) }</style>'), 'style_url');
  refuses(wrap('<style>rect { width: expression(alert(1)) }</style>'), 'style_expression');
  assert.deepEqual(issuesOf(wrap('<style>rect { fill: url(#g) }</style>')), []);
});

test('style="" attributes get the same checks', () => {
  refuses(wrap('<rect style="fill: url(https://evil.example/g.svg#g)" width="1" height="1"/>'), 'style_url');
  refuses(wrap('<rect style="@import \'x.css\'" width="1" height="1"/>'), 'style_import');
  refuses(wrap('<rect style="width: expression(alert(1))" width="1" height="1"/>'), 'style_expression');
  assert.deepEqual(issuesOf(wrap('<rect style="width:100%;height:auto;max-height:400px;fill:url(#g)" width="1" height="1"/>')), []);
});

test('every issue found is reported, once', () => {
  const r = validateFigureSvg(wrap('<script>1</script><script>2</script><rect onclick="x()" width="1" height="1"/><iframe></iframe>'));
  assert.equal(r.ok, false);
  if (!r.ok) assert.deepEqual([...r.issues].sort(), ['event_handler', 'iframe_element', 'script_element']);
});

test('never throws, whatever it is given', () => {
  for (const junk of ['<', '<<<>>>', '<svg', '<svg viewBox="0 0 1 1"', '</svg>', '<svg viewBox="0 0 1 1"><text>&#xFFFFFFFF;</text></svg>', '<svg a="\'" b=\'"\'>', '\u0000<svg>', '<svg viewBox="0 0 1 1"><g a="b" a="c"/></svg>']) {
    assert.doesNotThrow(() => validateFigureSvg(junk), junk);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
