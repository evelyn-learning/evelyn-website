// Pure tests for the daily status email: rendering, the small rules behind the Status fields, the
// send configuration and the Resend call (injected fetch). No database, no network.
// Run: npx tsx src/lib/keystone/pipeline/status.test.ts
import assert from "node:assert/strict";
import { STAGE_LABEL } from "../config";
import {
  FLAG_WORDS,
  afterSent,
  countSendBacks,
  goesOutToday,
  goingOutToday,
  heldReason,
  scrubSecrets,
  secretsOf,
  itemUrl,
  noteText,
  pacificDay,
  pacificTime,
  releaseTimerLate,
  renderStatusEmail,
  sendStatusEmail,
  statusSendConfig,
  whyHeld,
  type Status,
} from "./status";

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);
const Z = (s: string) => new Date(s);
const HOUR = 3_600_000;

(async () => {
  // --- FLAG_WORDS: exact words, every flag ---
  deepEqual(
    FLAG_WORDS,
    {
      solvers_split: "The two solvers disagreed; a third settled it",
      second_failure: "Failed a check twice",
      written_response: "Written response: no single right wording",
      type_not_supported: "We cannot read this question type yet",
      no_agreement: "No agreed answer",
      key_confirmed_by_reviewer: "Castle Rock confirmed a key we first disagreed with",
      section_title_unset: "No section name yet for this course",
      step_failed: "A check could not run",
      sample: "Random sample",
      unverified_type: "Question type not yet verified end to end",
      answer_to_confirm: "No key supplied: answer to confirm",
      owner_sent_back: "Sent back by you",
      owner_rewrite: "Rewritten after your note",
      question_resent: "The question was re-sent after our solution went out",
    },
    "FLAG_WORDS holds the agreed plain words for all fourteen flags",
  );
  equal(whyHeld(["sample"]), "Random sample", "one flag: its words");
  equal(whyHeld(["solvers_split", "unverified_type"]), "The two solvers disagreed; a third settled it. Question type not yet verified end to end", "two flags: both, in order");
  equal(whyHeld(undefined), "Held, no reason recorded", "flags missing: a held item still says it is held");
  equal(whyHeld([]), "Held, no reason recorded", "flags empty: same");
  equal(whyHeld(["mystery_flag"]), "mystery_flag", "an unknown flag is shown as it is, not dropped");

  // --- time: Pacific ---
  equal(pacificTime(Z("2026-11-18T00:12:00Z")), "Tue Nov 17, 4:12 pm PT", "PST formatting, like the agreed sample");
  equal(pacificTime(Z("2026-11-17T15:00:00Z")), "Tue Nov 17, 7:00 am PT", "morning");
  equal(pacificTime(Z("2026-11-17T08:05:00Z")), "Tue Nov 17, 12:05 am PT", "just after midnight is 12 am");
  equal(pacificTime(Z("2026-07-08T19:30:00Z")), "Wed Jul 8, 12:30 pm PT", "PDT (UTC-7) in summer; noon is 12 pm");
  const day = pacificDay(Z("2026-11-17T15:00:00Z"));
  equal(day.start.toISOString(), "2026-11-17T08:00:00.000Z", "Pacific day starts at midnight PST");
  equal(day.end.toISOString(), "2026-11-18T08:00:00.000Z", "and ends 24 h later on a normal day");
  const dst = pacificDay(Z("2026-11-01T18:00:00Z")); // Sun Nov 1 2026: clocks go back, a 25-hour day
  equal(dst.end.getTime() - dst.start.getTime(), 25 * HOUR, "the day the clocks go back is 25 hours");

  // --- going out today: Pacific day, inside the release window ---
  const tue7 = Z("2026-11-17T15:00:00Z"); // Tue 07:00 PT = 08:00 MT
  ok(goesOutToday(Z("2026-11-17T18:00:00Z"), tue7), "due Tue 11:00 MT: goes out today");
  ok(goesOutToday(Z("2026-11-16T23:30:00Z"), tue7), "overdue since Mon 16:30 MT: the timer releases it this morning");
  ok(!goesOutToday(Z("2026-11-18T16:00:00Z"), tue7), "due tomorrow: not today");
  const sat7 = Z("2026-11-21T15:00:00Z");
  ok(!goesOutToday(Z("2026-11-20T23:30:00Z"), sat7), "Saturday: overdue from Friday waits for Monday (no window today)");

  // --- the release timer heartbeat ---
  const wed10 = Z("2026-11-18T17:00:00Z"); // Wed 10:00 MT, inside the window
  ok(releaseTimerLate(null, wed10), "inside the window, never beaten: late");
  ok(releaseTimerLate(new Date(wed10.getTime() - 2 * HOUR - 1000), wed10), "inside the window, last beat over 2 h ago: late");
  ok(!releaseTimerLate(new Date(wed10.getTime() - 50 * 60_000), wed10), "inside the window, beat 50 min ago: fine");
  const wed1830 = Z("2026-11-19T01:30:00Z"); // Wed 18:30 MT: within 2 h after the window closed
  ok(releaseTimerLate(new Date(wed1830.getTime() - 3 * HOUR), wed1830), "within 2 h after the window: still checked");
  const wed2000 = Z("2026-11-19T03:00:00Z"); // Wed 20:00 MT: 3 h after close
  ok(!releaseTimerLate(null, wed2000), "3 h after the window closed: the timer may idle, no failure");
  ok(!releaseTimerLate(null, Z("2026-11-21T17:00:00Z")), "Saturday: no failure");

  // --- notes ---
  const pasted = `Please fix the table ${"<table><tr><td>cell &amp; value</td></tr></table>".repeat(20)}`;
  ok(pasted.length >= 900, "fixture: a long pasted-HTML note");
  const n = noteText(pasted);
  ok(n.length <= 200, `note cut to 200 characters (got ${n.length})`);
  ok(!/[<>]/.test(n), "note is plain text, no markup");
  ok(n.startsWith("Please fix the table cell & value"), `note keeps the words, entities decoded (${n.slice(0, 40)})`);
  equal(noteText("short note"), "short note", "a short note is unchanged");
  equal(noteText(undefined), "", "no note: empty");

  equal(itemUrl("991601"), "https://keystone.evelynlearning.com/item/991601", "item link shape");
  equal(itemUrl("a b/c"), "https://keystone.evelynlearning.com/item/a%20b%2Fc", "item id encoded in the link");

  // --- rendering ---
  const owners = (ev: number[], rv: number[], tc: number[], done: number[]): Status["byOwner"] => [
    { owner: "Evelyn", rows: (["received", "drafting", "ready", "changes_requested"] as const).map((s, i) => ({ label: STAGE_LABEL[s], n: ev[i] })) },
    { owner: "Castle Rock review", rows: (["in_review", "key_query"] as const).map((s, i) => ({ label: STAGE_LABEL[s], n: rv[i] })) },
    { owner: "Castle Rock technical", rows: [{ label: STAGE_LABEL.item_data, n: tc[0] }] },
    { owner: "Nobody (finished)", rows: (["approved", "delivered", "rejected"] as const).map((s, i) => ({ label: STAGE_LABEL[s], n: done[i] })) },
  ];
  const empty: Status = {
    byOwner: owners([0, 0, 0, 0], [0, 0], [0], [0, 0, 0]),
    waitingOnPraveen: [],
    notSolved: [],
    releasingToday: 0,
    castleRockLastDay: [],
    sendBacksOurs: { batch: 0, total: 0, causes: {} },
    cost: { yesterday: 0, perItem: 0 },
    failures: [],
    suggestions: [],
    blocked: [],
  };
  const e = renderStatusEmail(empty, tue7);
  equal(e.subject, "Keystone: 0 waiting on you, 0 in review, 0 approved", "subject with zeros");
  ok(!/FAIL/i.test(e.text), "no failures section when there are none");
  ok(e.text.includes("Tue Nov 17, 7:00 am PT"), "the body is dated in Pacific time");
  ok(!/BLOCKED BATCHES/.test(e.text) && !/Blocked batches/.test(e.html), "no blocked-batches section when none is blocked");

  const full: Status = {
    byOwner: owners([2, 1, 3, 1], [4, 1], [1], [5, 0, 1]),
    waitingOnPraveen: [{ itemId: "991601", why: "Random sample" }, { itemId: "991602", why: "No agreed answer" }],
    notSolved: [{ n: 2, dueAt: Z("2026-11-19T15:00:00Z") }],
    releasingToday: 3,
    castleRockLastDay: [
      { who: "Julie May", what: "asked for solution changes on", itemId: "991603", note: `<script>alert(1)</script> fix & redo` },
      { who: "Julie May", what: "approved", itemId: "991604" },
    ],
    sendBacksOurs: { batch: 1, total: 2, causes: {} },
    cost: { yesterday: 1.234, perItem: 0.4567 },
    failures: ["The release timer has not run in the last 2 hours"],
    suggestions: [{ subject: "3 answer keys to check", to: ["julie"] }],
    blocked: [{ batch: "batch-nov-16.xlsx", why: "2 item(s) not yet through the pipeline", since: Z("2026-11-17T01:00:00Z") }, { batch: "b9", why: "no batch record" }],
  };
  const r = renderStatusEmail(full, tue7);
  equal(r.subject, "Keystone: 2 waiting on you, 4 in review, 5 approved", "subject: numbers first, pattern exact");
  ok(!r.html.includes("<script>"), "a note's <script> is escaped in the HTML");
  ok(r.html.includes("&lt;script&gt;alert(1)&lt;/script&gt; fix &amp; redo"), "the note is shown escaped, & as &amp;");
  ok(r.text.includes("<script>alert(1)</script> fix & redo"), "the text alternative shows the note as written");
  ok(r.html.includes(`href="https://keystone.evelynlearning.com/item/991601"`), "waiting items are linked in HTML");
  ok(r.text.includes("https://keystone.evelynlearning.com/item/991601"), "and in text");
  ok(r.text.includes("Random sample") && r.html.includes("Random sample"), "with their reasons");
  const order = ["release timer", "BLOCKED BATCHES", "WAITING ON YOU", "GOING OUT TODAY", "NOT SOLVED", "BY OWNER", "CASTLE ROCK", "SEND-BACKS", "SUGGESTED EMAILS", "COST"].map((k) => r.text.indexOf(k));
  ok(order.every((x) => x >= 0), `every section present (${order})`);
  ok(order.every((x, i) => i === 0 || x > order[i - 1]), `sections in order, failures on top (${order})`);
  ok(r.text.includes("$1.23") && r.text.includes("$0.46"), "cost in dollars");
  ok(r.text.includes("- batch-nov-16.xlsx: 2 item(s) not yet through the pipeline (since Mon Nov 16, 5:00 pm PT)"), "blocked batch: name, why, since in Pacific");
  ok(r.text.includes("- b9: no batch record") && !/b9: no batch record \(since/.test(r.text), "blocked batch with no since: no since");
  ok(r.html.includes("Blocked batches (2)") && r.html.includes("2 item(s) not yet through the pipeline"), "blocked batches in the HTML");
  ok(r.text.includes("Thu Nov 19, 7:00 am PT"), "not-solved due time in Pacific");
  ok(r.text.includes("To Julie: 3 answer keys to check"), "suggestion with recipients");
  for (const piece of ["991601", "Random sample", "Julie May", "3 answer keys to check", "release timer"]) ok(r.html.includes(piece), `HTML carries ${piece} too`);
  const bad: Status = { ...full, waitingOnPraveen: [{ itemId: `x"><img src=x>`, why: "a<b" }], suggestions: [{ subject: "<b>s</b>", to: ["julie"] }], failures: ["<i>f</i>"] };
  const rb = renderStatusEmail(bad, tue7).html;
  ok(!rb.includes("<img") && !rb.includes("<b>s</b>") && !rb.includes("<i>f</i>"), "every data piece is escaped (ids, reasons, subjects, failures)");

  // --- held with a reason but no flag (pipeline.heldWhy) ---
  equal(heldReason([], "no release time"), "no release time", "heldWhy alone: its text");
  equal(heldReason(undefined, "no release time"), "no release time", "flags missing, heldWhy: its text");
  equal(heldReason(["sample"], "no release time"), "Random sample. no release time", "flags and heldWhy: both");
  equal(heldReason(["sample"], undefined), "Random sample", "flags only: as before");
  equal(heldReason([], undefined), "Held, no reason recorded", "neither: as before");
  const rw = renderStatusEmail({ ...empty, waitingOnPraveen: [{ itemId: "991605", why: heldReason([], "no release time") }] }, tue7);
  ok(rw.text.includes("- 991605: no release time"), "the waiting line shows the heldWhy text");

  // --- send-backs caused by us: lessons, cause "item" excluded, by batch ---
  const batchOf = new Map([["1", "bNew"], ["2", "bNew"], ["3", "bOld"], ["4", "bNew"], ["5", undefined]]);
  deepEqual(
    countSendBacks(
      [
        { itemId: "1", cause: "format" },
        { itemId: "2", cause: "item" },
        { itemId: "3", cause: "style" },
        { itemId: "4", cause: "format" },
        { itemId: "5", cause: "answer" },
        { itemId: "1", cause: "working" },
      ],
      batchOf,
      "bNew",
    ),
    { batch: 3, total: 5, causes: { format: 2, style: 1, answer: 1, working: 1 } },
    "batch = the latest batch's lessons, total = all, causes counted; cause item never counted",
  );
  deepEqual(countSendBacks([{ itemId: "2", cause: "item" }], batchOf, "bNew"), { batch: 0, total: 0, causes: {} }, "only cause item: nothing ours");
  deepEqual(countSendBacks([{ itemId: "1", cause: "format" }], batchOf, undefined), { batch: 0, total: 1, causes: { format: 1 } }, "no batch at all: batch 0");

  // --- going out today: only what the release would release (sample, blocked, skipped do not count) ---
  const due = Z("2026-11-17T18:00:00Z");
  const rows = [
    { itemId: "a", batchId: "b", releaseAt: due, state: "waiting until Tue 2026-11-17 11:00" },
    { itemId: "b", batchId: "b", releaseAt: Z("2026-11-17T14:00:00Z"), state: "would release now" },
    { itemId: "c", batchId: "b", releaseAt: due, state: "would be held as sample" },
    { itemId: "d", batchId: "b2", releaseAt: due, state: "batch blocked (no batch record): waits" },
    { itemId: "e", releaseAt: due, state: "no batch: would be held as sample" },
    { itemId: "f", batchId: "b", state: "no release time: would be held for Praveen" },
    { itemId: "g", batchId: "b", releaseAt: due, state: "no unreleased solution row: skipped" },
    { itemId: "h", batchId: "b", releaseAt: Z("2026-11-18T18:00:00Z"), state: "waiting until Wed 2026-11-18 11:00" },
    { itemId: "i", batchId: "b", releaseAt: Z("2026-11-17T14:00:00Z"), state: "due; outside the window, goes at Tue 2026-11-17 08:00" },
    { itemId: "j", batchId: "b", releaseAt: due, state: "being released by another call" },
  ];
  equal(goingOutToday(rows, tue7), 4, "a, b, i and j go out today; the sample, blocked, unbatched, untimed, skipped and tomorrow's do not");

  // --- key scrub for every printed error ---
  const keys = secretsOf({ KEYSTONE_RESEND_API_KEY: "re_TESTKEY_secret", RESEND_API_KEY: "re_OTHER_secret", OTHER: "x" });
  deepEqual(keys, ["re_TESTKEY_secret", "re_OTHER_secret"], "both Resend key variables");
  const scrubbed = scrubSecrets("fetch failed: Authorization: Bearer re_TESTKEY_secret at re_OTHER_secret", keys);
  ok(!scrubbed.includes("re_TESTKEY_secret") && !scrubbed.includes("re_OTHER_secret"), `keys scrubbed (${scrubbed})`);
  ok(scrubbed.startsWith("fetch failed"), "the message is kept");
  equal(scrubSecrets("plain", []), "plain", "nothing to scrub");

  // --- sent, then the heartbeat failed: a warning, never a failure ---
  const warnings: string[] = [];
  await afterSent(async () => { throw new Error("connection reset re_TESTKEY_secret"); }, (w) => warnings.push(w), keys);
  equal(warnings.length, 1, "one warning");
  ok(/sent/i.test(warnings[0]) && /heartbeat/i.test(warnings[0]) && !warnings[0].includes("re_TESTKEY_secret"), `warning says the mail went out, the heartbeat did not, key scrubbed (${warnings[0]})`);
  const none: string[] = [];
  await afterSent(async () => {}, (w) => none.push(w), keys);
  equal(none.length, 0, "a recorded heartbeat: no warning");

  // --- send configuration ---
  const env = { KEYSTONE_STATUS_TO: "praveen@evelynlearning.com", KEYSTONE_STATUS_FROM: "Keystone <praveen@evelynlearning.com>", KEYSTONE_RESEND_API_KEY: "re_TESTKEY_secret" };
  const cfg = statusSendConfig(env);
  deepEqual(cfg.to, ["praveen@evelynlearning.com"], "to from env");
  equal(cfg.key, "re_TESTKEY_secret", "key from KEYSTONE_RESEND_API_KEY");
  equal(statusSendConfig({ ...env, KEYSTONE_RESEND_API_KEY: undefined, RESEND_API_KEY: "re_fallback" }).key, "re_fallback", "falls back to RESEND_API_KEY");
  deepEqual(statusSendConfig({ ...env, KEYSTONE_STATUS_TO: "a@x.com, b@y.com" }).to, ["a@x.com", "b@y.com"], "several recipients, comma separated");
  for (const missing of ["KEYSTONE_STATUS_TO", "KEYSTONE_STATUS_FROM"] as const) {
    assert.throws(() => statusSendConfig({ ...env, [missing]: "" }), new RegExp(missing), `missing ${missing} refused`);
  }
  assert.throws(() => statusSendConfig({ ...env, KEYSTONE_RESEND_API_KEY: "" }), /KEYSTONE_RESEND_API_KEY/, "missing key refused");
  for (const from of ["info@evelyntutor.com", "x@evelynlearning.com.evil.io", "x@mail.evelynlearning.co", "Keystone <a@evelyntutor.com> praveen@evelynlearning.com"]) {
    assert.throws(() => statusSendConfig({ ...env, KEYSTONE_STATUS_FROM: from }), /evelynlearning\.com/, `FROM ${from} refused (Resend accounts must not mix)`);
  }
  try {
    statusSendConfig({ ...env, KEYSTONE_STATUS_FROM: "x@evelyntutor.com" });
  } catch (err) {
    ok(!String(err).includes("re_TESTKEY_secret"), "a refusal never shows the key");
  }

  // --- the Resend call: injected fetch, nothing logged with the key ---
  const logged: string[] = [];
  const orig = { log: console.log, error: console.error, warn: console.warn, info: console.info };
  const capture = (...a: unknown[]) => void logged.push(a.map(String).join(" "));
  Object.assign(console, { log: capture, error: capture, warn: capture, info: capture });
  const calls: { url: string; init: RequestInit }[] = [];
  let thrown = "";
  try {
    const fakeOk = (async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ id: "em_1" }), { status: 200 });
    }) as unknown as typeof fetch;
    const res = await sendStatusEmail({ subject: r.subject, html: r.html, text: r.text }, cfg, fakeOk);
    equal(res.id, "em_1", "the Resend id is returned");
    const fakeBad = (async () => new Response(`{"message":"bad key"}`, { status: 401 })) as unknown as typeof fetch;
    await sendStatusEmail({ subject: r.subject, html: r.html, text: r.text }, cfg, fakeBad).catch((err) => (thrown = String(err)));
  } finally {
    Object.assign(console, orig);
  }
  equal(calls.length, 1, "one request");
  equal(calls[0].url, "https://api.resend.com/emails", "Resend endpoint");
  equal(calls[0].init.method, "POST", "POST");
  const headers = new Headers(calls[0].init.headers);
  equal(headers.get("authorization"), "Bearer re_TESTKEY_secret", "Bearer key");
  const body = JSON.parse(String(calls[0].init.body));
  deepEqual(Object.keys(body).sort(), ["from", "html", "subject", "text", "to"], "body has from/to/subject/html/text");
  equal(body.from, env.KEYSTONE_STATUS_FROM, "from");
  deepEqual(body.to, ["praveen@evelynlearning.com"], "to");
  equal(body.subject, r.subject, "subject");
  ok(/401/.test(thrown) && !thrown.includes("re_TESTKEY_secret"), `a refused send throws without the key (${thrown})`);
  ok(logged.every((l) => !l.includes("re_TESTKEY_secret") && !/bearer/i.test(l)), "the key and the Authorization header are never logged");
  const fakeDown = (async () => { throw new TypeError("fetch failed: Bearer re_TESTKEY_secret"); }) as unknown as typeof fetch;
  const down = await sendStatusEmail({ subject: "s", html: "h", text: "t" }, cfg, fakeDown).then(() => "", (err) => String(err));
  ok(/could not be reached/.test(down) && !down.includes("re_TESTKEY_secret"), `a network error is thrown scrubbed (${down})`);

  console.log("status.test ok");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
