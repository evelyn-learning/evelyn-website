import { strict as assert } from "node:assert";
import { priceUsageUsd, costCapUsd } from "./cost";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;

(async () => {
  await test("plain input+output tokens", () => {
    // 100K in = $0.50, 10K out = $0.25
    assert.ok(close(priceUsageUsd({ input_tokens: 100_000, output_tokens: 10_000 }), 0.75));
  });

  await test("cache write 1.25x, cache read 0.1x input rate", () => {
    const usd = priceUsageUsd({
      input_tokens: 0, output_tokens: 0,
      cache_creation_input_tokens: 100_000,  // $0.625
      cache_read_input_tokens: 100_000,      // $0.05
    });
    assert.ok(close(usd, 0.675));
  });

  await test("web search requests at $0.01 each", () => {
    const usd = priceUsageUsd({
      input_tokens: 0, output_tokens: 0,
      server_tool_use: { web_search_requests: 5 },
    });
    assert.ok(close(usd, 0.05));
  });

  await test("null/absent optional fields are zero", () => {
    assert.ok(close(priceUsageUsd({
      input_tokens: 1000, output_tokens: 0,
      cache_creation_input_tokens: null, cache_read_input_tokens: null, server_tool_use: null,
    }), 0.005));
  });

  await test("costCapUsd default and env override", () => {
    delete process.env.LEAD_RESEARCH_COST_CAP_USD;
    assert.equal(costCapUsd(), 20);
    process.env.LEAD_RESEARCH_COST_CAP_USD = "12.5";
    assert.equal(costCapUsd(), 12.5);
    process.env.LEAD_RESEARCH_COST_CAP_USD = "banana";
    assert.equal(costCapUsd(), 20);
    process.env.LEAD_RESEARCH_COST_CAP_USD = "-3";
    assert.equal(costCapUsd(), 20);
    delete process.env.LEAD_RESEARCH_COST_CAP_USD;
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
