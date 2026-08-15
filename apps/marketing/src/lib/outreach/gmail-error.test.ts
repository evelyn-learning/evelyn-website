import assert from "node:assert/strict";
import { test } from "node:test";
import { httpStatusOf } from "./gmail";

// This helper decides whether the reply watcher PRUNES a thread id or retries
// it forever. Reading the status off the wrong property silently reverts the
// watcher to its old behaviour — a 404 that looks like `undefined` falls
// through to the transient branch — so both gaxios error shapes are pinned.

test("reads a top-level .status", () => {
  assert.equal(httpStatusOf({ status: 404 }), 404);
});

test("reads a nested .response.status", () => {
  assert.equal(httpStatusOf({ response: { status: 404 } }), 404);
});

test("prefers the top-level status when both are present", () => {
  assert.equal(httpStatusOf({ status: 404, response: { status: 500 } }), 404);
});

test("returns undefined for shapes that carry no status", () => {
  assert.equal(httpStatusOf(new Error("boom")), undefined);
  assert.equal(httpStatusOf(null), undefined);
  assert.equal(httpStatusOf(undefined), undefined);
  assert.equal(httpStatusOf("not an object"), undefined);
});

test("a non-404 status is not treated as 404", () => {
  // Rate limits and 5xx must keep retrying, not get pruned.
  for (const status of [429, 500, 503]) {
    assert.notEqual(httpStatusOf({ status }), 404);
  }
});
