import assert from "node:assert/strict";
import { decide, parseKey, sameAnswer } from "./answers";
import type { Answer } from "./answers";
import type { Interaction } from "../qti-interactions";

const A: Answer = { kind: "choice", letters: ["A"] }, B: Answer = { kind: "choice", letters: ["B"] };
const num = (value: string): Answer => ({ kind: "number", value });
const lab = (...values: string[]): Answer => ({ kind: "labels", values });

// outcome table (spec §5 [3])
{
  assert.deepEqual(decide(A, A, A), { outcome: "pass", answer: A, confirm: false });
  assert.deepEqual(decide(A, A, B), { outcome: "key_query", answer: A });
  assert.deepEqual(decide(A, A, null), { outcome: "need_third" });
  assert.deepEqual(decide(A, A, null, A), { outcome: "pass", answer: A, confirm: true });
  assert.deepEqual(decide(A, A, null, B), { outcome: "hold", why: "no_agreement" });
  assert.deepEqual(decide(A, B, A), { outcome: "need_third" });
  assert.deepEqual(decide(A, B, A, A), { outcome: "pass", answer: A, confirm: false, flag: "solvers_split" });
  assert.deepEqual(decide(A, B, A, B), { outcome: "hold", why: "no_agreement" }); // two agree but not with the key
  assert.deepEqual(decide(A, B, null, A), { outcome: "hold", why: "no_agreement" });
  // extra rows
  assert.deepEqual(decide(A, B, null), { outcome: "need_third" });
  assert.deepEqual(decide(A, B, B, A), { outcome: "hold", why: "no_agreement" }); // 3 different-ish: s1=A,s3=A agree, key B
  const C: Answer = { kind: "choice", letters: ["C"] };
  assert.deepEqual(decide(A, B, A, C), { outcome: "hold", why: "no_agreement" }); // all differ
  assert.deepEqual(decide(A, B, B, B), { outcome: "pass", answer: B, confirm: false, flag: "solvers_split" }); // s2+s3 agree with key
  assert.deepEqual(decide(A, A, A, B), { outcome: "pass", answer: A, confirm: false }); // s3 ignored when s1=s2=key
  assert.deepEqual(decide(A, A, B, A), { outcome: "key_query", answer: A });
  // written response
  const T: Answer = { kind: "text", value: "x" };
  assert.deepEqual(decide(T, T, null), { outcome: "hold", why: "written_response" });
  assert.deepEqual(decide(A, T, A), { outcome: "hold", why: "written_response" });
  assert.deepEqual(decide(A, A, T), { outcome: "hold", why: "written_response" });
  assert.deepEqual(decide(A, B, A, T), { outcome: "hold", why: "written_response" });
}

// sameAnswer
{
  assert.ok(sameAnswer({ kind: "choice", letters: ["C", "A"] }, { kind: "choice", letters: ["a", "c"] }));
  assert.ok(!sameAnswer({ kind: "choice", letters: ["A"] }, { kind: "choice", letters: ["A", "B"] }));
  assert.ok(sameAnswer(num("0.998"), num(".9980")));
  assert.ok(!sameAnswer(num("0.998"), num("0.997")));
  assert.ok(sameAnswer(num("7358"), num("7358")));
  assert.ok(sameAnswer(num("7358"), num("7358.0")));
  assert.ok(sameAnswer(num("1,234.50"), num("1234.5")));
  assert.ok(sameAnswer(num("1 234.5"), num("1234.5")));
  assert.ok(sameAnswer(num("-0.50"), num("-.5")));
  assert.ok(sameAnswer(num("+3"), num("3")));
  assert.ok(sameAnswer(num("-0"), num("0")));
  assert.ok(!sameAnswer(num("-3"), num("3")));
  assert.ok(!sameAnswer(num("7358"), num("73580")));
  assert.ok(!sameAnswer(num("0.30000000000000004"), num("0.3")));
  assert.ok(sameAnswer(num("12345678901234567890.12345678901234567890"), num("12345678901234567890.1234567890123456789")));
  assert.ok(!sameAnswer(num("12345678901234567890.1"), num("12345678901234567890.2")));
  // exponents are not parsed: never silently equal
  assert.ok(!sameAnswer(num("2.50e3"), num("2500")));
  assert.ok(sameAnswer(num("2.50e3"), num("2.50e3")));
  // precision, half-up
  assert.ok(sameAnswer(num("0.9984"), num("0.998"), 3));
  assert.ok(sameAnswer(num("0.9985"), num("0.999"), 3));
  assert.ok(!sameAnswer(num("0.9984"), num("0.999"), 3));
  assert.ok(sameAnswer(num("9.995"), num("10"), 2));
  assert.ok(sameAnswer(num("2.5"), num("3"), 0));
  assert.ok(sameAnswer(num("7358.4"), num("7358"), 0));
  // labels
  assert.ok(!sameAnswer(lab("Oocyte", "Sperm"), lab("Sperm", "Oocyte")));
  assert.ok(sameAnswer(lab("Oocyte", "Sperm"), lab(" oocyte ", "SPERM")));
  assert.ok(sameAnswer(lab("cell  wall"), lab("Cell wall")));
  assert.ok(!sameAnswer(lab("a"), lab("a", "b")));
  // kinds differ; text never equal
  assert.ok(!sameAnswer(A, num("1")));
  assert.ok(!sameAnswer(lab("A"), A));
  const T: Answer = { kind: "text", value: "same" };
  assert.ok(!sameAnswer(T, T));
}

// parseKey
{
  const keyOf = (itemType: string, key: string, keys?: Record<string, string[]>, interactions?: Interaction[]) => parseKey({ itemType, key, keys, interactions });
  const choice = (maxChoices = 1): Interaction => ({ kind: "choice", responseId: "RESPONSE", maxChoices, options: [] });
  // no key
  assert.equal(keyOf("MC", ""), null);
  assert.equal(keyOf("MC", "", {}, [choice()]), null);
  // written response
  assert.equal(keyOf("WR", "some model answer"), null);
  assert.equal(keyOf("SWR", "x"), null);
  assert.equal(keyOf("TI", "x", { RESPONSE: ["x"] }, [{ kind: "extendedText", responseId: "RESPONSE" }]), null);
  // keys-based choice
  assert.deepEqual(keyOf("MS", "A,C", { RESPONSE: ["c", "A"] }, [choice(2)]), { kind: "choice", letters: ["A", "C"] });
  assert.deepEqual(keyOf("MC", "B", { RESPONSE: ["B", "b"] }, [choice()]), { kind: "choice", letters: ["B"] });
  // choice with interaction but only legacy key
  assert.deepEqual(keyOf("MS", "A,C,D", undefined, [choice(3)]), { kind: "choice", letters: ["A", "C", "D"] });
  // numeric / typed
  const te: Interaction = { kind: "textEntry", responseId: "RESPONSE" };
  assert.deepEqual(keyOf("NR", "0.998", { RESPONSE: ["0.998"] }, [te]), { kind: "number", value: "0.998" });
  assert.deepEqual(keyOf("NR", " 7358 ", undefined, [te]), { kind: "number", value: "7358" });
  assert.deepEqual(keyOf("TI", "mitochondria", { RESPONSE: ["mitochondria"] }, [te]), { kind: "labels", values: ["mitochondria"] });
  // match: pairs kept as P→S and sorted
  const match: Interaction = { kind: "match", responseId: "RESPONSE", premises: [], responses: [] };
  assert.deepEqual(keyOf("DDL", "", { RESPONSE: ["P2 S1", "P1 S2"] }, [match]), { kind: "labels", values: ["P1→S2", "P2→S1"] });
  const gap: Interaction = { kind: "gapMatch", responseId: "RESPONSE", gaps: [], choices: [] };
  assert.deepEqual(keyOf("DDL", "", { RESPONSE: ["G2 W1", "G1 W2"] }, [gap]), { kind: "labels", values: ["G1→W2", "G2→W1"] });
  // order: sequence kept
  const order: Interaction = { kind: "order", responseId: "RESPONSE", choices: [] };
  assert.deepEqual(keyOf("TI", "", { RESPONSE: ["C", "A", "B"] }, [order]), { kind: "labels", values: ["C", "A", "B"] });
  // several responses: sorted by responseId, key order within
  const r = (id: string): Interaction => ({ kind: "textEntry", responseId: id });
  assert.deepEqual(keyOf("TI", "", { R2: ["y"], R1: ["x"] }, [r("R1"), r("R2")]), { kind: "labels", values: ["x", "y"] });
  assert.deepEqual(keyOf("TI", "", { R2: ["5"], R1: ["3"] }, [r("R1"), r("R2")]), { kind: "labels", values: ["3", "5"] });
  // legacy, key only
  assert.deepEqual(keyOf("MC", "D"), { kind: "choice", letters: ["D"] });
  assert.deepEqual(keyOf("MS", "A,C,D"), { kind: "choice", letters: ["A", "C", "D"] });
  assert.deepEqual(keyOf("NR", "0.998"), { kind: "number", value: "0.998" });
  assert.deepEqual(keyOf("TI", "oocyte"), { kind: "labels", values: ["oocyte"] });
}

console.log("answers tests passed");
