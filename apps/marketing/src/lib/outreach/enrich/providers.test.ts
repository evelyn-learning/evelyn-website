import { strict as assert } from "node:assert";
import type { EnrichInput } from "./types";
import { QuotaExhaustedError } from "./types";
import { apolloProvider } from "./apollo";
import { hunterProvider } from "./hunter";
import { prospeoProvider } from "./prospeo";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const input: EnrichInput = {
  name: "Jane Doe",
  title: "Director of Nursing",
  company: "Acme Health System",
  websiteDomain: "acme-health.edu",
};

// Same save/restore-prior-value pattern as cost.test.ts / ledger.test.ts,
// but wraps an async body so the env var isn't restored before the
// fetchFn-driven promise chain inside `fn` actually resolves.
async function withEnvVar<T>(key: string, value: string, fn: () => Promise<T> | T): Promise<T> {
  const prior = process.env[key];
  process.env[key] = value;
  try {
    return await fn();
  } finally {
    if (prior === undefined) delete process.env[key];
    else process.env[key] = prior;
  }
}

function fakeFetchJson(body: unknown, status = 200): typeof fetch {
  return (async () => new Response(JSON.stringify(body), { status })) as typeof fetch;
}

function fakeFetchThrows(): typeof fetch {
  return (async () => { throw new Error("ECONNREFUSED"); }) as unknown as typeof fetch;
}

async function assertQuotaExhausted(promise: Promise<unknown>, provider: string) {
  await assert.rejects(promise, (err: unknown) => {
    assert.ok(err instanceof QuotaExhaustedError);
    assert.equal((err as QuotaExhaustedError).provider, provider);
    assert.equal((err as Error).message, `QUOTA_EXHAUSTED:${provider}`);
    return true;
  });
}

(async () => {
  // ---------- Apollo ----------

  await test("apollo isConfigured false when key missing, true when set", async () => {
    const prior = process.env.APOLLO_API_KEY;
    delete process.env.APOLLO_API_KEY;
    assert.equal(apolloProvider.isConfigured(), false);
    await withEnvVar("APOLLO_API_KEY", "test-key", () => {
      assert.equal(apolloProvider.isConfigured(), true);
    });
    if (prior !== undefined) process.env.APOLLO_API_KEY = prior;
  });

  await test("apollo happy path returns verified email + linkedin", async () => {
    await withEnvVar("APOLLO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({
        person: {
          email: "jane@acme-health.edu",
          email_status: "verified",
          linkedin_url: "https://linkedin.com/in/janedoe",
        },
      });
      const result = await apolloProvider.match(input, fetchFn);
      assert.ok(result);
      assert.equal(result?.email, "jane@acme-health.edu");
      assert.equal(result?.linkedinUrl, "https://linkedin.com/in/janedoe");
      assert.equal(result?.provider, "apollo");
      assert.equal(result?.creditsUsed, 1);
    });
  });

  await test("apollo unverified email + no linkedin -> null (quality floor)", async () => {
    await withEnvVar("APOLLO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({
        person: { email: "jane@acme-health.edu", email_status: "unverified" },
      });
      assert.equal(await apolloProvider.match(input, fetchFn), null);
    });
  });

  await test("apollo email_not_unlocked placeholder -> null", async () => {
    await withEnvVar("APOLLO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({
        person: { email: "email_not_unlocked@domain.com", email_status: "verified" },
      });
      assert.equal(await apolloProvider.match(input, fetchFn), null);
    });
  });

  await test("apollo missing person -> null", async () => {
    await withEnvVar("APOLLO_API_KEY", "test-key", async () => {
      assert.equal(await apolloProvider.match(input, fakeFetchJson({})), null);
    });
  });

  await test("apollo 402 -> QuotaExhaustedError", async () => {
    await withEnvVar("APOLLO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({}, 402);
      await assertQuotaExhausted(apolloProvider.match(input, fetchFn), "apollo");
    });
  });

  await test("apollo 429 -> QuotaExhaustedError", async () => {
    await withEnvVar("APOLLO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({}, 429);
      await assertQuotaExhausted(apolloProvider.match(input, fetchFn), "apollo");
    });
  });

  await test("apollo 500 -> null", async () => {
    await withEnvVar("APOLLO_API_KEY", "test-key", async () => {
      assert.equal(await apolloProvider.match(input, fakeFetchJson({}, 500)), null);
    });
  });

  await test("apollo network throw -> null", async () => {
    await withEnvVar("APOLLO_API_KEY", "test-key", async () => {
      assert.equal(await apolloProvider.match(input, fakeFetchThrows()), null);
    });
  });

  // ---------- Hunter ----------

  await test("hunter isConfigured false when key missing, true when set", async () => {
    const prior = process.env.HUNTER_API_KEY;
    delete process.env.HUNTER_API_KEY;
    assert.equal(hunterProvider.isConfigured(), false);
    await withEnvVar("HUNTER_API_KEY", "test-key", () => {
      assert.equal(hunterProvider.isConfigured(), true);
    });
    if (prior !== undefined) process.env.HUNTER_API_KEY = prior;
  });

  await test("hunter happy path returns high-confidence email, no linkedin", async () => {
    await withEnvVar("HUNTER_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({ data: { email: "jane@acme-health.edu", score: 92 } });
      const result = await hunterProvider.match(input, fetchFn);
      assert.ok(result);
      assert.equal(result?.email, "jane@acme-health.edu");
      assert.equal(result?.linkedinUrl, undefined);
      assert.equal(result?.provider, "hunter");
      assert.equal(result?.creditsUsed, 1);
    });
  });

  await test("hunter low score -> null (quality floor)", async () => {
    await withEnvVar("HUNTER_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({ data: { email: "jane@acme-health.edu", score: 42 } });
      assert.equal(await hunterProvider.match(input, fetchFn), null);
    });
  });

  await test("hunter missing email -> null", async () => {
    await withEnvVar("HUNTER_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({ data: { email: null, score: 99 } });
      assert.equal(await hunterProvider.match(input, fetchFn), null);
    });
  });

  await test("hunter 402 -> QuotaExhaustedError", async () => {
    await withEnvVar("HUNTER_API_KEY", "test-key", async () => {
      await assertQuotaExhausted(hunterProvider.match(input, fakeFetchJson({}, 402)), "hunter");
    });
  });

  await test("hunter 429 -> QuotaExhaustedError", async () => {
    await withEnvVar("HUNTER_API_KEY", "test-key", async () => {
      await assertQuotaExhausted(hunterProvider.match(input, fakeFetchJson({}, 429)), "hunter");
    });
  });

  await test("hunter 500 -> null", async () => {
    await withEnvVar("HUNTER_API_KEY", "test-key", async () => {
      assert.equal(await hunterProvider.match(input, fakeFetchJson({}, 500)), null);
    });
  });

  await test("hunter network throw -> null", async () => {
    await withEnvVar("HUNTER_API_KEY", "test-key", async () => {
      assert.equal(await hunterProvider.match(input, fakeFetchThrows()), null);
    });
  });

  await test("hunter builds GET url with encoded name + domain + key", async () => {
    await withEnvVar("HUNTER_API_KEY", "s3cr3t", async () => {
      let capturedUrl: string | undefined;
      let capturedInit: RequestInit | undefined;
      const fetchFn = (async (url: string | URL, init?: RequestInit) => {
        capturedUrl = String(url);
        capturedInit = init;
        return new Response(JSON.stringify({ data: { email: "jane@acme-health.edu", score: 90 } }));
      }) as unknown as typeof fetch;
      await hunterProvider.match(input, fetchFn);
      assert.ok(capturedUrl?.startsWith("https://api.hunter.io/v2/email-finder?"));
      assert.ok(capturedUrl?.includes("domain=acme-health.edu"));
      assert.ok(capturedUrl?.includes(`full_name=${encodeURIComponent("Jane Doe")}`));
      assert.ok(capturedUrl?.includes("api_key=s3cr3t"));
      // Never leak the key in a thrown/logged message; this only checks the
      // wire request, which is expected to carry it per the vendor contract.
      assert.ok(capturedInit === undefined || capturedInit.method === undefined || capturedInit.method === "GET");
    });
  });

  // ---------- Prospeo ----------

  await test("prospeo isConfigured false when key missing, true when set", async () => {
    const prior = process.env.PROSPEO_API_KEY;
    delete process.env.PROSPEO_API_KEY;
    assert.equal(prospeoProvider.isConfigured(), false);
    await withEnvVar("PROSPEO_API_KEY", "test-key", () => {
      assert.equal(prospeoProvider.isConfigured(), true);
    });
    if (prior !== undefined) process.env.PROSPEO_API_KEY = prior;
  });

  await test("prospeo posts to enrich-person with nested data body", async () => {
    await withEnvVar("PROSPEO_API_KEY", "s3cr3t", async () => {
      let capturedUrl: string | undefined;
      let capturedInit: RequestInit | undefined;
      const fetchFn = (async (url: string | URL, init?: RequestInit) => {
        capturedUrl = String(url);
        capturedInit = init;
        return new Response(JSON.stringify({ person: { email: {}, linkedin_url: "" } }));
      }) as unknown as typeof fetch;
      await prospeoProvider.match(input, fetchFn);
      assert.equal(capturedUrl, "https://api.prospeo.io/enrich-person");
      assert.equal(capturedInit?.method, "POST");
      const headers = capturedInit?.headers as Record<string, string>;
      assert.equal(headers["X-KEY"], "s3cr3t");
      assert.equal(headers["content-type"], "application/json");
      const body = JSON.parse(capturedInit?.body as string);
      assert.deepEqual(body, {
        data: {
          full_name: "Jane Doe",
          company_website: "acme-health.edu",
          only_verified_email: true,
        },
      });
    });
  });

  await test("prospeo happy path returns VERIFIED email + person-level linkedin", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({
        person: {
          email: { status: "VERIFIED", revealed: true, email: "jane@acme-health.edu" },
          linkedin_url: "https://linkedin.com/in/janedoe",
        },
      });
      const result = await prospeoProvider.match(input, fetchFn);
      assert.ok(result);
      assert.equal(result?.email, "jane@acme-health.edu");
      assert.equal(result?.linkedinUrl, "https://linkedin.com/in/janedoe");
      assert.equal(result?.provider, "prospeo");
      assert.equal(result?.creditsUsed, 1);
    });
  });

  await test("prospeo legacy VALID status still accepted (backwards compat)", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({
        response: { email: { status: "VALID", revealed: true, email: "jane@acme-health.edu" } },
      });
      const result = await prospeoProvider.match(input, fetchFn);
      assert.ok(result);
      assert.equal(result?.email, "jane@acme-health.edu");
    });
  });

  await test("prospeo non-VERIFIED status -> email rejected (only_verified floor)", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({
        person: { email: { status: "GUESSED", revealed: true, email: "jane@acme-health.edu" } },
      });
      assert.equal(await prospeoProvider.match(input, fetchFn), null);
    });
  });

  await test("prospeo revealed:false -> email rejected even if status VERIFIED", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({
        person: { email: { status: "VERIFIED", revealed: false, email: "jane@acme-health.edu" } },
      });
      assert.equal(await prospeoProvider.match(input, fetchFn), null);
    });
  });

  await test("prospeo non-string linkedin_url field ignored, verified email still returned", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({
        person: {
          email: { status: "VERIFIED", revealed: true, email: "jane@acme-health.edu" },
          linkedin_url: { raw: "not-a-url" },
        },
      });
      const result = await prospeoProvider.match(input, fetchFn);
      assert.ok(result);
      assert.equal(result?.email, "jane@acme-health.edu");
      assert.equal(result?.linkedinUrl, undefined);
    });
  });

  await test("prospeo empty-string linkedin_url field ignored -> null (no email either)", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({ person: { linkedin_url: "" } });
      assert.equal(await prospeoProvider.match(input, fetchFn), null);
    });
  });

  await test("prospeo missing person/response/email -> null", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      assert.equal(await prospeoProvider.match(input, fakeFetchJson({})), null);
    });
  });

  await test("prospeo 400 INSUFFICIENT_CREDITS -> QuotaExhaustedError", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({ req_status: false, error_code: "INSUFFICIENT_CREDITS" }, 400);
      await assertQuotaExhausted(prospeoProvider.match(input, fetchFn), "prospeo");
    });
  });

  await test("prospeo 400 NO_MATCH -> null", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({ req_status: false, error_code: "NO_MATCH" }, 400);
      assert.equal(await prospeoProvider.match(input, fetchFn), null);
    });
  });

  await test("prospeo 400 other error_code -> null", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      const fetchFn = fakeFetchJson({ req_status: false, error_code: "DEPRECATED" }, 400);
      assert.equal(await prospeoProvider.match(input, fetchFn), null);
    });
  });

  await test("prospeo 402 -> QuotaExhaustedError", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      await assertQuotaExhausted(prospeoProvider.match(input, fakeFetchJson({}, 402)), "prospeo");
    });
  });

  await test("prospeo 429 -> QuotaExhaustedError", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      await assertQuotaExhausted(prospeoProvider.match(input, fakeFetchJson({}, 429)), "prospeo");
    });
  });

  await test("prospeo 500 -> null", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      assert.equal(await prospeoProvider.match(input, fakeFetchJson({}, 500)), null);
    });
  });

  await test("prospeo network throw -> null", async () => {
    await withEnvVar("PROSPEO_API_KEY", "test-key", async () => {
      assert.equal(await prospeoProvider.match(input, fakeFetchThrows()), null);
    });
  });

  // ---------- Provider identity ----------

  await test("provider name strings are exact lowercase vendor keys", () => {
    assert.equal(apolloProvider.name, "apollo");
    assert.equal(hunterProvider.name, "hunter");
    assert.equal(prospeoProvider.name, "prospeo");
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
