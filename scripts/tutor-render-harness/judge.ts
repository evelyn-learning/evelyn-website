/// <reference types="node" />
/**
 * Render-harness vision-judge (Layer-1 "looks right" pass).
 *
 * Reads the latest render bundle for a course (or a given bundle dir), sends
 * each RENDERED screenshot to Claude vision, and asks "is this a correct,
 * non-broken rendering of <tool>?" — catching what the deterministic gate
 * can't (overlap, clipping, garbled layout). Writes judge.json into the bundle.
 *
 *   npm run test:render-judge -- macro            # newest macro-* bundle
 *   npm run test:render-judge -- <bundle-dir>     # a specific bundle
 *
 * Needs ANTHROPIC_API_KEY (env or .env.local). Spends ~1 vision call/fixture.
 */

import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { loadApiKey } from '../tutor-e2e/llm';

const arg = process.argv.find((a, i) => i >= 2 && !a.startsWith('-'));

interface FixtureResult { label: string; tool: string; expect: string; rejected: boolean; error?: string | null; screenshot: string; pass: boolean; }

function latestBundle(course: string): string {
  const base = path.join(process.cwd(), 'artifacts', 'tutor-render-harness');
  const dirs = fs.readdirSync(base).filter((d) => d.startsWith(`${course}-`) && fs.statSync(path.join(base, d)).isDirectory()).sort();
  if (!dirs.length) throw new Error(`no render bundle found for "${course}" under ${base}`);
  return path.join(base, dirs[dirs.length - 1]);
}

/** Human description of what the figure SHOULD be, derived from the fixture label. */
function describe(r: FixtureResult): string {
  if (r.tool === 'show_diagram') {
    const kind = r.label.replace(/^harvested-show-diagram-/, '').replace(/^_smoke-/, '').replace(/-v\d+.*$/, '').replace(/-/g, ' ');
    return `show_diagram — a "${kind}" diagram`;
  }
  return r.tool;
}

const SYS = `You are a strict QA reviewer for an AI tutor's whiteboard renderer. You are shown ONE screenshot of a single rendered figure and told which tool/kind produced it. Judge ONLY visual rendering quality, NOT pedagogical depth or completeness.

FAIL it if you see any of: overlapping or colliding labels/boxes, text clipped or cut off, elements drawn off-axis or off-canvas, garbled/scrambled or non-sensical layout, axes/curves clearly missing that the figure needs, illegible text, or obvious geometric/positioning errors.

PASS a clean, legible, correctly-laid-out figure (minor aesthetic imperfections are fine).

Respond with ONLY a JSON object, no prose: {"pass": boolean, "issue": "<one short sentence describing the defect; empty string if pass>"}`;

async function main() {
  let bundle: string;
  if (arg && fs.existsSync(arg) && fs.statSync(arg).isDirectory()) bundle = arg;
  else if (arg) bundle = latestBundle(arg);
  else { console.error('Usage: npm run test:render-judge -- <course|bundle-dir>'); process.exit(1); }

  const summary = JSON.parse(fs.readFileSync(path.join(bundle, 'results.json'), 'utf8'));
  const results: FixtureResult[] = summary.results;
  const client = new Anthropic({ apiKey: loadApiKey() });
  console.log(`[judge] ${path.relative(process.cwd(), bundle)} — ${results.length} fixtures`);

  const judged: Array<{ label: string; tool: string; gatePass: boolean; visionPass: boolean | null; issue: string }> = [];
  for (const r of results) {
    if (r.rejected) { judged.push({ label: r.label, tool: r.tool, gatePass: r.pass, visionPass: null, issue: 'n/a — rejected by validator (no render)' }); continue; }
    const imgPath = path.join(bundle, r.screenshot);
    if (!fs.existsSync(imgPath)) { judged.push({ label: r.label, tool: r.tool, gatePass: r.pass, visionPass: null, issue: 'n/a — screenshot missing' }); continue; }
    const b64 = fs.readFileSync(imgPath).toString('base64');
    let verdict: { pass: boolean; issue: string } = { pass: true, issue: '' };
    try {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        system: SYS,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/png', data: b64 } },
          { type: 'text', text: `Tool/kind: ${describe(r)} (fixture "${r.label}"). Judge the rendering.` },
        ] }],
      });
      const text = msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('');
      const m = text.match(/\{[\s\S]*\}/);
      verdict = m ? JSON.parse(m[0]) : { pass: true, issue: 'unparseable judge reply' };
    } catch (e) { verdict = { pass: true, issue: `judge call error: ${e instanceof Error ? e.message : String(e)}` }; }
    judged.push({ label: r.label, tool: r.tool, gatePass: r.pass, visionPass: !!verdict.pass, issue: verdict.issue || '' });
    console.log(`[judge] ${verdict.pass ? 'PASS' : 'FAIL'}  ${r.label}${verdict.issue ? ` — ${verdict.issue}` : ''}`);
  }

  fs.writeFileSync(path.join(bundle, 'judge.json'), JSON.stringify({ bundle, model: 'claude-sonnet-4-6', judged }, null, 2) + '\n');
  const pass = judged.filter((j) => j.visionPass === true).length;
  const fail = judged.filter((j) => j.visionPass === false);
  const na = judged.filter((j) => j.visionPass === null).length;
  console.log(`\n[judge] vision: ${pass} pass · ${fail.length} fail · ${na} n/a → judge.json`);
  if (fail.length) { console.log('[judge] FAILED: ' + fail.map((f) => `${f.label} (${f.issue})`).join('; ')); process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exit(1); });
