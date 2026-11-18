import assert from "node:assert/strict";
import { acceptedAnswers, answerForm, canonicalPairs, canonicalResponse, decide, isNumber, parseKey, readKey, sameAnswer, typedAnswer } from "./answers";
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
  assert.deepEqual(decide(A, B, A, B), { outcome: "hold", why: "no_agreement" }); // split solvers; third sides with B but the key is A: majority disagrees with the key
  assert.deepEqual(decide(A, B, null, A), { outcome: "hold", why: "no_agreement" });
  // extra rows
  assert.deepEqual(decide(A, B, null), { outcome: "need_third" });
  assert.deepEqual(decide(A, B, B, A), { outcome: "hold", why: "no_agreement" }); // solvers split A/B, third says A, but the key is B: the majority disagrees with the key
  const C: Answer = { kind: "choice", letters: ["C"] };
  assert.deepEqual(decide(A, B, A, C), { outcome: "hold", why: "no_agreement" }); // all three solvers differ
  assert.deepEqual(decide(A, B, B, B), { outcome: "pass", answer: B, confirm: false, flag: "solvers_split" }); // s2 and s3 agree and match the key
  assert.deepEqual(decide(A, A, A, B), { outcome: "pass", answer: A, confirm: false }); // s1 and s2 agree with the key, so the third answer is not consulted
  assert.deepEqual(decide(A, A, B, A), { outcome: "key_query", answer: A });
  // written response
  const T: Answer = { kind: "text", value: "x" };
  assert.deepEqual(decide(T, T, null), { outcome: "hold", why: "written_response" });
  assert.deepEqual(decide(A, T, A), { outcome: "hold", why: "written_response" });
  assert.deepEqual(decide(A, A, T), { outcome: "hold", why: "written_response" });
  assert.deepEqual(decide(A, B, A, T), { outcome: "hold", why: "written_response" });
}

// alsoAccepted alternatives
{
  const half = num("0.5"), alt = lab("50%"); // not a fraction: only alsoAccepted can make it match
  assert.deepEqual(decide(alt, alt, half, undefined, [alt]), { outcome: "pass", answer: alt, confirm: false });
  assert.deepEqual(decide(alt, alt, half), { outcome: "key_query", answer: alt });
  assert.deepEqual(decide(alt, half, half, alt, [alt]), { outcome: "pass", answer: alt, confirm: false, flag: "solvers_split" });
  assert.deepEqual(decide(alt, num("0.7"), half, num("0.7"), [alt]), { outcome: "hold", why: "no_agreement" });
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
  // thousands separators only as groups of three
  assert.ok(!sameAnswer(num("1,2"), num("12")));
  assert.ok(!sameAnswer(num("1,5"), num("1.5")));
  assert.ok(!sameAnswer(num("1,5"), num("15")));
  assert.ok(!sameAnswer(num("1,23"), num("123")));
  assert.ok(sameAnswer(num("1,234"), num("1234")));
  assert.ok(sameAnswer(num("12,345.60"), num("12345.6")));
  assert.ok(sameAnswer(num("1\u00a0234"), num("1234")));
  assert.ok(sameAnswer(num("1 234 567"), num("1234567")));
  assert.ok(!sameAnswer(num("1,2345"), num("12345")));
  // unparseable is never equal, even to itself
  assert.ok(!sameAnswer(num(""), num("")));
  assert.ok(!sameAnswer(num("abc"), num("ABC")));
  assert.ok(!sameAnswer(num("abc"), num("abc")));
  assert.ok(sameAnswer(num("2.50e3"), num(" 2.50E3 ")));
  // unicode minus; units and % stay different
  assert.ok(sameAnswer(num("\u22120.5"), num("-0.5")));
  assert.ok(sameAnswer(num("\u20135"), num("-5")));
  assert.ok(!sameAnswer(num("0.5%"), num("0.5")));
  assert.ok(!sameAnswer(num("12 m/s"), num("12")));
  assert.ok(sameAnswer(num("1."), num("1")));
  // negative rounding: half away from zero on the magnitude
  assert.ok(sameAnswer(num("-0.5"), num("-1"), 0));
  assert.ok(sameAnswer(num("-0.4"), num("0"), 0));
  assert.ok(!sameAnswer(num("-0.5"), num("0"), 0));
  // labels
  assert.ok(!sameAnswer(lab("P1 S2"), lab("P1\u2192S2")));
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
  // typed response: several values are alternatives; first is the key
  const alt = { itemType: "NR", key: "0.5", keys: { RESPONSE: ["0.5", "1/2", "50%"] }, interactions: [te] };
  assert.deepEqual(parseKey(alt), { kind: "number", value: "0.5" });
  assert.deepEqual(acceptedAnswers(alt), [num("0.5"), lab("1/2"), lab("50%")]);
  assert.deepEqual(acceptedAnswers({ itemType: "NR", key: "7", keys: { RESPONSE: ["7"] }, interactions: [te] }), [num("7")]);
  assert.deepEqual(acceptedAnswers({ itemType: "MC", key: "B", keys: { RESPONSE: ["B"] }, interactions: [choice()] }), [{ kind: "choice", letters: ["B"] }]);
  assert.deepEqual(acceptedAnswers({ itemType: "MC", key: "" }), []);
  assert.deepEqual(acceptedAnswers({ itemType: "WR", key: "x" }), []);
  // legacy single non-choice, non-numeric interaction with only `key`: whole key as one label
  assert.deepEqual(keyOf("TI", "C,A,B", undefined, [order]), { kind: "labels", values: ["C,A,B"] });
  assert.deepEqual(keyOf("DDL", " P1 S2 ", undefined, [match]), { kind: "labels", values: ["P1 S2"] });
  // legacy, key only
  assert.deepEqual(keyOf("MC", "D"), { kind: "choice", letters: ["D"] });
  assert.deepEqual(keyOf("MS", "A,C,D"), { kind: "choice", letters: ["A", "C", "D"] });
  assert.deepEqual(keyOf("NR", "0.998"), { kind: "number", value: "0.998" });
  assert.deepEqual(keyOf("TI", "oocyte"), { kind: "labels", values: ["oocyte"] });
}

// --- one answer form for key and solvers ---
const o = (label: string) => ({ label, html: label });

// typedAnswer and fraction equivalence
{
  assert.deepEqual(typedAnswer(" 12.5 "), num("12.5"));
  assert.deepEqual(typedAnswer("1/2"), lab("1/2"));
  assert.deepEqual(typedAnswer("x = 3"), lab("x = 3"));
  assert.deepEqual(typedAnswer("1,234"), num("1,234"));
  assert.ok(isNumber("0.5") && !isNumber("1/2") && !isNumber("2e3"));
  assert.ok(sameAnswer(num("0.5"), lab("1/2")));
  assert.ok(sameAnswer(lab("1/2"), num("0.5")));
  assert.ok(sameAnswer(lab("2/4"), num("0.5")));
  assert.ok(!sameAnswer(num("0.333"), lab("1/3")), "a repeating decimal is never equal");
  assert.ok(sameAnswer(num("-0.75"), lab("-3/4")));
  assert.ok(sameAnswer(num("3"), lab("6/2")));
  assert.ok(!sameAnswer(num("0.5"), lab("1/0")));
  assert.ok(!sameAnswer(num("0.5"), lab("1/2", "x")));
  assert.ok(!sameAnswer(num("0.5"), lab("one half")));
  assert.ok(sameAnswer(lab("1/2"), lab("1/2")), "a fraction matches itself");
}

// canonicalPairs: orientation, case, separators, order
{
  const gap: Interaction = { kind: "gapMatch", responseId: "G", gaps: ["G1", "G2"], choices: [o("W1"), o("W2")] };
  const want = ["W1→G2", "W2→G1"];
  for (const v of [
    ["W1→G2", "W2→G1"], ["G2→W1", "G1→W2"], ["g1 w2", "w1 g2"], ["W1 -> G2", "G1=>W2"], ["W1:G2", "W2 - G1"], ["W1-G2", "G1-W2"],
  ]) assert.deepEqual(canonicalPairs(v, gap), want, JSON.stringify(v));
  assert.equal(canonicalPairs(["W1→W2"], gap), null, "both members from the same set");
  assert.equal(canonicalPairs(["W9→G1"], gap), null, "unknown identifier");
  assert.equal(canonicalPairs(["W1"], gap), null);
  // hyphen is a separator only when no identifier contains one
  const hy: Interaction = { kind: "match", responseId: "M", premises: [o("P-1")], responses: [o("R-1")] };
  assert.deepEqual(canonicalPairs(["P-1 R-1"], hy), ["P-1→R-1"]);
  assert.equal(canonicalPairs(["P-1-R-1"], hy), null);
  // key side: gap-first and choice-first keys read the same; a correct answer in any direction matches; a wrong pairing does not
  for (const keys of [["G1 W2", "G2 W1"], ["W2 G1", "W1 G2"]]) {
    const item = { itemType: "DD", key: "", keys: { G: keys }, interactions: [gap] };
    const r = readKey(item);
    assert.ok(r.exact);
    assert.deepEqual(r.answer, lab(...want));
    const ans = canonicalResponse(answerForm(item)!.responses[0], ["g2→w1", "G1 - W2"])!;
    assert.ok(sameAnswer(lab(...ans), r.answer!));
    assert.ok(!sameAnswer(lab(...canonicalResponse(answerForm(item)!.responses[0], ["W1→G1", "W2→G2"])!), r.answer!));
  }
  // a key that cannot be read exactly keeps the old raw labels and says so
  const r = readKey({ itemType: "DD", key: "", keys: { G: ["G1 W9"] }, interactions: [gap] });
  assert.deepEqual(r, { answer: lab("G1→W9"), exact: false });
}

// several responses: match + inlineChoice
{
  const m: Interaction = { kind: "match", responseId: "RESPONSE_1", premises: [o("P1"), o("P2")], responses: [o("R1"), o("R2")] };
  const d: Interaction = { kind: "inlineChoice", responseId: "RESPONSE_2", choices: [o("a"), o("b")] };
  const item = { itemType: "DDL", key: "", keys: { RESPONSE_2: ["A"], RESPONSE_1: ["R2 P1", "P2 R1"] }, interactions: [d, m] };
  const k = readKey(item);
  assert.deepEqual(k, { answer: lab("P1→R2", "P2→R1", "a"), exact: true });
  const f = answerForm(item)!;
  assert.deepEqual(f.responses.map((r) => r.responseId), ["RESPONSE_1", "RESPONSE_2"]);
  for (const pairs of [["P2→R1", "P1→R2"], ["R2→P1", "R1→P2"], ["P1 R2", "P2 R1"]]) {
    const got = [...canonicalResponse(f.responses[0], pairs)!, ...canonicalResponse(f.responses[1], ["a"])!];
    assert.ok(sameAnswer(lab(...got), k.answer!), JSON.stringify(pairs));
  }
  // order / inlineChoice: identifiers in the item's spelling
  const ord: Interaction = { kind: "order", responseId: "O", choices: [o("s1"), o("s2"), o("s3")] };
  assert.deepEqual(parseKey({ itemType: "ORD", key: "", keys: { O: ["S3", "s1", "S2"] }, interactions: [ord] }), lab("s3", "s1", "s2"));
  assert.equal(canonicalResponse(answerForm({ itemType: "ORD", interactions: [ord] })!.responses[0], ["s1", "s9"]), null);
  // several typed responses: first value only, decimals canonical
  const t1: Interaction = { kind: "textEntry", responseId: "R1" }, t2: Interaction = { kind: "textEntry", responseId: "R2" };
  assert.deepEqual(parseKey({ itemType: "TI", key: "", keys: { R1: ["3.0", "3"], R2: ["x"] }, interactions: [t2, t1] }), lab("3", "x"));
}

// answerForm
{
  const ch = (maxChoices: number): Interaction => ({ kind: "choice", responseId: "RESPONSE", maxChoices, options: [o("A"), o("B")] });
  assert.equal(answerForm({ itemType: "MC", interactions: [ch(1)] })!.form, "choice-one");
  assert.equal(answerForm({ itemType: "MS", interactions: [ch(1)] })!.form, "choice-many");
  assert.equal(answerForm({ itemType: "MC", interactions: [ch(3)] })!.form, "choice-many");
  assert.equal(answerForm({ itemType: "NR", interactions: [{ kind: "textEntry", responseId: "R" }] })!.form, "number");
  assert.equal(answerForm({ itemType: "TI", interactions: [{ kind: "textEntry", responseId: "R" }] })!.form, "typed");
  assert.equal(answerForm({ itemType: "TI", interactions: [{ kind: "extendedText", responseId: "R" }] })!.form, "text");
  assert.equal(answerForm({ itemType: "WR", interactions: [] })!.form, "text");
  // no interactions
  assert.equal(answerForm({ itemType: "MC", options: [o("A"), o("B")] })!.form, "choice-one");
  assert.equal(answerForm({ itemType: "MS", options: [o("A"), o("B")] })!.form, "choice-many");
  assert.equal(answerForm({ itemType: "NR" })!.form, "number");
  assert.equal(answerForm({ itemType: "SWR" })!.form, "text");
  assert.equal(answerForm({ itemType: "DD" }), null, "cannot tell");
  assert.equal(answerForm({ itemType: "MC" }), null, "MC without options: cannot tell");
  assert.equal(answerForm({ itemType: "MS" }), null);
  assert.equal(answerForm({ itemType: "TI", interactions: [{ kind: "unsupported", element: "hotspotInteraction" }] }), null);
}

// Important 2 cases: forms that cannot be told are not exact; legacy NR "1/2" is labels on both sides
{
  assert.deepEqual(readKey({ itemType: "DD", key: "12.5" }), { answer: lab("12.5"), exact: false });
  assert.deepEqual(readKey({ itemType: "MS", key: "", keys: { RESPONSE: ["A", "C"] } }), { answer: { kind: "choice", letters: ["A", "C"] }, exact: false });
  assert.deepEqual(readKey({ itemType: "MS", key: "", keys: { RESPONSE: ["A", "C"] }, options: [o("A"), o("B"), o("C")] }), { answer: { kind: "choice", letters: ["A", "C"] }, exact: true });
  assert.deepEqual(readKey({ itemType: "NR", key: "1/2" }), { answer: lab("1/2"), exact: true });
  assert.ok(sameAnswer(parseKey({ itemType: "NR", key: "1/2" })!, typedAnswer("1/2")));
  assert.ok(sameAnswer(parseKey({ itemType: "NR", key: "1/2" })!, typedAnswer("0.5")));
  assert.deepEqual(readKey({ itemType: "MC", key: "B", options: [o("A"), o("B")] }), { answer: { kind: "choice", letters: ["B"] }, exact: true });
  assert.equal(readKey({ itemType: "MC", key: "E", options: [o("A"), o("B")] }).exact, false, "key letter not among the options");
  // non-letter choice identifiers
  const cx: Interaction = { kind: "choice", responseId: "RESPONSE", maxChoices: 1, options: [o("ChoiceA"), o("ChoiceB")] };
  assert.deepEqual(readKey({ itemType: "MC", key: "", keys: { RESPONSE: ["choiceB"] }, interactions: [cx] }), { answer: { kind: "choice", letters: ["CHOICEB"] }, exact: true });
  assert.deepEqual(canonicalResponse(answerForm({ itemType: "MC", interactions: [cx] })!.responses[0], ["CHOICEB"]), ["CHOICEB"]);
  assert.equal(canonicalResponse(answerForm({ itemType: "MC", interactions: [cx] })!.responses[0], ["B"]), null);
}

console.log("answers tests passed");
