import { strict as assert } from "node:assert";
import { callWithToolLoop, extractJson, type ResearchMessage, type CallModel } from "./claude";
import { discoveryParams, candidateParams, RESEARCH_MODEL } from "./prompts";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const usage = { input_tokens: 10, output_tokens: 5 };
const textMsg = (text: string, stop = "end_turn"): ResearchMessage =>
  ({ stop_reason: stop, content: [{ type: "text", text }], usage });

(async () => {
  await test("single end_turn call reports usage once", async () => {
    const seen: number[] = [];
    const call: CallModel = async () => textMsg('{"ok":true}');
    const msg = await callWithToolLoop(call, { messages: [] }, (u) => seen.push(u.input_tokens));
    assert.equal(msg.stop_reason, "end_turn");
    assert.deepEqual(seen, [10]);
  });

  await test("pause_turn resumes with appended assistant turn", async () => {
    const calls: Record<string, unknown>[] = [];
    let n = 0;
    const call: CallModel = async (params) => {
      calls.push(params);
      n++;
      return n === 1 ? textMsg("searching...", "pause_turn") : textMsg('{"done":1}');
    };
    const msg = await callWithToolLoop(call, { messages: [{ role: "user", content: "go" }] }, () => {});
    assert.equal(n, 2);
    const secondMessages = calls[1].messages as Array<{ role: string }>;
    assert.equal(secondMessages.length, 2);
    assert.equal(secondMessages[1].role, "assistant");
    assert.equal(msg.stop_reason, "end_turn");
  });

  await test("refusal throws RESEARCH_REFUSED", async () => {
    const call: CallModel = async () => ({ stop_reason: "refusal", content: [], usage });
    await assert.rejects(
      () => callWithToolLoop(call, { messages: [] }, () => {}),
      /RESEARCH_REFUSED/
    );
  });

  await test("max_tokens stop_reason throws RESEARCH_TRUNCATED", async () => {
    const call: CallModel = async () => textMsg("cut off mid-json", "max_tokens");
    await assert.rejects(
      () => callWithToolLoop(call, { messages: [] }, () => {}),
      /RESEARCH_TRUNCATED/
    );
  });

  await test("pause_turn cap: throws after 8 resumes", async () => {
    const call: CallModel = async () => textMsg("still going", "pause_turn");
    await assert.rejects(
      () => callWithToolLoop(call, { messages: [] }, () => {}),
      /RESEARCH_PAUSE_LOOP/
    );
  });

  await test("extractJson parses last text block", () => {
    const msg: ResearchMessage = {
      stop_reason: "end_turn",
      content: [
        { type: "server_tool_use", name: "web_search" },
        { type: "text", text: "preamble" },
        { type: "text", text: '{"candidates":[{"company":"A","website":"https://a.edu"}]}' },
      ],
      usage,
    };
    const parsed = extractJson(msg) as { candidates: unknown[] };
    assert.equal(parsed.candidates.length, 1);
  });

  await test("extractJson throws on no JSON", () => {
    assert.throws(() => extractJson(textMsg("not json")), /RESEARCH_BAD_JSON/);
  });

  await test("discoveryParams shape", () => {
    const p = discoveryParams({ segment: "nursing_program", niche: "PMHNP", region: "US Northeast", wanted: 30, excludeCompanies: ["Acme"] }) as {
      model: string; max_tokens: number; tools: unknown[]; messages: Array<{ content: string }>; output_config: unknown;
    };
    assert.equal(p.model, RESEARCH_MODEL);
    assert.ok(p.max_tokens >= 8000);
    assert.equal(p.tools.length, 2);
    assert.ok(p.messages[0].content.includes("PMHNP"));
    assert.ok(p.messages[0].content.includes("Acme"));
    assert.ok(p.output_config);
  });

  await test("candidateParams includes company, website, and no-fabrication rules", () => {
    const p = candidateParams({ segment: "nursing_program", niche: "", company: "Acme College", website: "https://acme.edu" }) as {
      messages: Array<{ content: string }>;
    };
    const prompt = p.messages[0].content;
    assert.ok(prompt.includes("Acme College"));
    assert.ok(prompt.includes("https://acme.edu"));
    assert.ok(/never guess|do not guess|NEVER guess/i.test(prompt));
    assert.ok(/under 500 characters/i.test(prompt));
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
