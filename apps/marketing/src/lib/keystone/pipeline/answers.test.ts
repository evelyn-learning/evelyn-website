import assert from "node:assert/strict";
import { acceptedAnswers, answerForm, multiAnswer, prefixed, canonicalPairs, canonicalResponse, decide, isNumber, parseKey, readKey, readNumber, sameAnswer, shiftDecimal, typedAnswer } from "./answers";
import type { Answer } from "./answers";
import type { Interaction } from "../qti-interactions";

const A: Answer = { kind: "choice", letters: ["A"] }, B: Answer = { kind: "choice", letters: ["B"] };
const num = (value: string): Answer => ({ kind: "number", value });
const lab = (...values: string[]): Answer => ({ kind: "labels", values });
/** Labels whose every position is a typed entry (as the canonicalisation marks textEntry positions). */
const typ = (...values: string[]): Answer => ({ kind: "labels", values, typedAt: values.map((_, i) => i) });

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
  const half = num("0.5"), alt = typ("50%"); // not a fraction: only alsoAccepted can make it match
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
  assert.deepEqual(keyOf("TI", "mitochondria", { RESPONSE: ["mitochondria"] }, [te]), typ("mitochondria"));
  // match: pairs kept as P→S and sorted
  const match: Interaction = { kind: "match", responseId: "RESPONSE", premises: [], responses: [] };
  assert.deepEqual(keyOf("DDL", "", { RESPONSE: ["P2 S1", "P1 S2"] }, [match]), { kind: "labels", values: ["P1→S2", "P2→S1"] });
  const gap: Interaction = { kind: "gapMatch", responseId: "RESPONSE", gaps: [], choices: [] };
  assert.deepEqual(keyOf("DDL", "", { RESPONSE: ["G2 W1", "G1 W2"] }, [gap]), { kind: "labels", values: ["G1→W2", "G2→W1"] });
  // order: sequence kept
  const order: Interaction = { kind: "order", responseId: "RESPONSE", choices: [] };
  assert.deepEqual(keyOf("TI", "", { RESPONSE: ["C", "A", "B"] }, [order]), { kind: "labels", values: ["C", "A", "B"] });
  // several responses: sorted by responseId, key order within, each value prefixed "<responseId>="
  const r = (id: string): Interaction => ({ kind: "textEntry", responseId: id });
  assert.deepEqual(keyOf("TI", "", { R2: ["y"], R1: ["x"] }, [r("R1"), r("R2")]), typ("R1=x", "R2=y"));
  assert.deepEqual(keyOf("TI", "", { R2: ["5"], R1: ["3"] }, [r("R1"), r("R2")]), typ("R1=3", "R2=5"));
  // typed response: several values are alternatives; first is the key
  const alt = { itemType: "NR", key: "0.5", keys: { RESPONSE: ["0.5", "1/2", "50%"] }, interactions: [te] };
  assert.deepEqual(parseKey(alt), { kind: "number", value: "0.5" });
  assert.deepEqual(acceptedAnswers(alt), [num("0.5"), typ("1/2"), typ("50%")]);
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
  assert.deepEqual(typedAnswer("1/2"), typ("1/2"));
  assert.deepEqual(typedAnswer("x = 3"), typ("x = 3"));
  assert.deepEqual(typedAnswer("1,234"), num("1,234"));
  assert.ok(isNumber("0.5") && !isNumber("1/2") && !isNumber("2e3"));
  assert.ok(sameAnswer(num("0.5"), typ("1/2")));
  assert.ok(sameAnswer(typ("1/2"), num("0.5")));
  assert.ok(sameAnswer(typ("2/4"), num("0.5")));
  assert.ok(!sameAnswer(num("0.333"), typ("1/3")), "a repeating decimal is never equal");
  assert.ok(sameAnswer(num("-0.75"), typ("-3/4")));
  assert.ok(sameAnswer(num("3"), typ("6/2")));
  assert.ok(!sameAnswer(num("0.5"), typ("1/0")));
  assert.ok(!sameAnswer(num("0.5"), lab("1/2", "x")));
  assert.ok(!sameAnswer(num("0.5"), typ("one half")));
  assert.ok(sameAnswer(typ("1/2"), typ("1/2")), "a fraction matches itself");
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
  assert.deepEqual(r, { answer: lab("G1→W9"), exact: false, detail: "key not readable: G1 W9" });
}

// several responses: match + inlineChoice
{
  const m: Interaction = { kind: "match", responseId: "RESPONSE_1", premises: [o("P1"), o("P2")], responses: [o("R1"), o("R2")] };
  const d: Interaction = { kind: "inlineChoice", responseId: "RESPONSE_2", choices: [o("a"), o("b")] };
  const item = { itemType: "DDL", key: "", keys: { RESPONSE_2: ["A"], RESPONSE_1: ["R2 P1", "P2 R1"] }, interactions: [d, m] };
  const k = readKey(item);
  assert.deepEqual(k, { answer: lab("RESPONSE_1=P1→R2", "RESPONSE_1=P2→R1", "RESPONSE_2=a"), exact: true });
  const f = answerForm(item)!;
  assert.deepEqual(f.responses.map((r) => r.responseId), ["RESPONSE_1", "RESPONSE_2"]);
  for (const pairs of [["P2→R1", "P1→R2"], ["R2→P1", "R1→P2"], ["P1 R2", "P2 R1"]]) {
    const got = [...prefixed("RESPONSE_1", canonicalResponse(f.responses[0], pairs)!), ...prefixed("RESPONSE_2", canonicalResponse(f.responses[1], ["a"])!)];
    assert.ok(sameAnswer(lab(...got), k.answer!), JSON.stringify(pairs));
  }
  // order / inlineChoice: identifiers in the item's spelling
  const ord: Interaction = { kind: "order", responseId: "O", choices: [o("s1"), o("s2"), o("s3")] };
  assert.deepEqual(parseKey({ itemType: "ORD", key: "", keys: { O: ["S3", "s1", "S2"] }, interactions: [ord] }), lab("s3", "s1", "s2"));
  assert.equal(canonicalResponse(answerForm({ itemType: "ORD", interactions: [ord] })!.responses[0], ["s1", "s9"]), null);
  // several typed responses: first value only, decimals canonical
  const t1: Interaction = { kind: "textEntry", responseId: "R1" }, t2: Interaction = { kind: "textEntry", responseId: "R2" };
  assert.deepEqual(parseKey({ itemType: "TI", key: "", keys: { R1: ["3.0", "3"], R2: ["x"] }, interactions: [t2, t1] }), typ("R1=3", "R2=x"));
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
  assert.deepEqual(readKey({ itemType: "DD", key: "12.5" }), { answer: lab("12.5"), exact: false, detail: "form unknown: itemType DD has no readable interactions" });
  assert.deepEqual(readKey({ itemType: "MS", key: "", keys: { RESPONSE: ["A", "C"] } }), { answer: { kind: "choice", letters: ["A", "C"] }, exact: false, detail: "form unknown: itemType MS has no readable interactions" });
  assert.deepEqual(readKey({ itemType: "MS", key: "", keys: { RESPONSE: ["A", "C"] }, options: [o("A"), o("B"), o("C")] }), { answer: { kind: "choice", letters: ["A", "C"] }, exact: true });
  assert.deepEqual(readKey({ itemType: "NR", key: "1/2" }), { answer: typ("1/2"), exact: true });
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

// --- review round 2 ---
// typed positions compare like single values; pairs and identifiers keep the exact rule
{
  const t1: Interaction = { kind: "textEntry", responseId: "R1" }, t2: Interaction = { kind: "textEntry", responseId: "R2" };
  const k = parseKey({ itemType: "TI", key: "", keys: { R1: ["1/2"], R2: ["3"] }, interactions: [t1, t2] })!;
  assert.deepEqual(k, typ("R1=1/2", "R2=3"));
  assert.ok(sameAnswer(typ("R1=0.5", "R2=3"), k));
  assert.ok(sameAnswer(typ("R1=0.50", "R2=3.0"), k));
  assert.ok(!sameAnswer(typ("R1=0.5", "R2=4"), k));
  assert.ok(!sameAnswer(typ("R2=0.5", "R1=3"), k), "prefixes must match");
  assert.ok(!sameAnswer(lab("P1→0.5"), lab("P1→1/2")), "a pair never goes through the number rule");
  assert.ok(!sameAnswer(lab("R1=P1→0.5"), lab("R1=P1→1/2")));
  // typed non-numeric normalisation
  assert.ok(sameAnswer(typ("x = 3"), typ("x=3")));
  assert.ok(sameAnswer(typ("x=3"), typ("X = 3")));
  assert.ok(sameAnswer(typ("50 %"), typ("50%")));
  assert.ok(sameAnswer(typ("R1=x = 3"), typ("R1=x=3")));
  assert.ok(sameAnswer(typ("( a + b ) / 2"), typ("(a+b)/2")));
  assert.ok(!sameAnswer(typ("x=3"), typ("x=4")));
  assert.ok(!sameAnswer(typ("a b"), typ("ab")), "only operator spacing is dropped");
  assert.ok(!sameAnswer(typ("R1=a b"), typ("R1=ab")));
  assert.ok(sameAnswer(typ("1/2"), typ("1 / 2")));
}

// maxChoices: count limit (0 = unlimited)
{
  const two: Interaction = { kind: "choice", responseId: "R", maxChoices: 2, options: [o("A"), o("B"), o("C")] };
  const f2 = answerForm({ itemType: "MS", interactions: [two] })!.responses[0];
  assert.deepEqual(canonicalResponse(f2, ["A", "C"]), ["A", "C"]);
  assert.equal(canonicalResponse(f2, ["A", "B", "C"]), null);
  const zero: Interaction = { ...two, maxChoices: 0 };
  assert.equal(answerForm({ itemType: "MC", interactions: [zero] })!.form, "choice-many", "maxChoices 0 = unlimited");
  assert.deepEqual(canonicalResponse(answerForm({ itemType: "MC", interactions: [zero] })!.responses[0], ["A", "B", "C"]), ["A", "B", "C"]);
  const msOne: Interaction = { ...two, maxChoices: 1 };
  assert.deepEqual(canonicalResponse(answerForm({ itemType: "MS", interactions: [msOne] })!.responses[0], ["A", "B"]), ["A", "B"]);
}

// details and single-choice keys with several letters
{
  const one: Interaction = { kind: "choice", responseId: "RESPONSE", maxChoices: 1, options: [o("A"), o("B"), o("C")] };
  assert.deepEqual(readKey({ itemType: "MC", key: "A,C", interactions: [one] }), { answer: { kind: "choice", letters: ["A", "C"] }, exact: false, detail: "key has 2 letters for a single-choice item" });
  assert.deepEqual(readKey({ itemType: "DD", key: "12.5" }).detail, "form unknown: itemType DD has no readable interactions");
  assert.equal(readKey({ itemType: "MC", key: "E", options: [o("A")] }).detail, "key not readable: E");
  const gap: Interaction = { kind: "gapMatch", responseId: "G", gaps: ["G1"], choices: [o("W1")] };
  assert.equal(readKey({ itemType: "DD", key: "", keys: { G: ["G1 W9"] }, interactions: [gap] }).detail, "key not readable: G1 W9");
}

// whole-keys fallback: one keyed response and one interaction may use it (legacy rows); several keyed responses may not
{
  const one: Interaction = { kind: "choice", responseId: "RESPONSE", maxChoices: 1, options: [o("A"), o("B")] };
  assert.deepEqual(readKey({ itemType: "MC", key: "", keys: { OTHER: ["B"] }, interactions: [one] }), { answer: { kind: "choice", letters: ["B"] }, exact: true });
  const r = readKey({ itemType: "MC", key: "", keys: { X1: ["A"], X2: ["B"] }, interactions: [one] });
  assert.equal(r.exact, false, "never one of several keyed responses");
  const te: Interaction = { kind: "textEntry", responseId: "RESPONSE" };
  assert.deepEqual(readKey({ itemType: "NR", key: "", keys: { OTHER: ["7"] }, interactions: [te] }), { answer: num("7"), exact: true });
  assert.equal(readKey({ itemType: "NR", key: "", keys: { X1: ["7"], X2: ["8"] }, interactions: [te] }).exact, false);
}

// --- review round 3: the typed rule only at typed positions ---
{
  // identifier-valued positions compare exactly
  const ord: Interaction = { kind: "order", responseId: "O", choices: [o("1"), o("01"), o("2")] };
  const ordItem = { itemType: "ORD", key: "", keys: { O: ["1", "01", "2"] }, interactions: [ord] };
  const ordKey = parseKey(ordItem)!;
  const ordForm = answerForm(ordItem)!.responses[0];
  assert.ok(!sameAnswer(lab(...canonicalResponse(ordForm, ["01", "1", "2"])!), ordKey), "wrong order with numeric-looking identifiers");
  assert.ok(sameAnswer(lab(...canonicalResponse(ordForm, ["1", "01", "2"])!), ordKey));
  const dd: Interaction = { kind: "inlineChoice", responseId: "D", choices: [o("1"), o("1.0"), o("01")] };
  const ddItem = { itemType: "DDL", key: "", keys: { D: ["1"] }, interactions: [dd] };
  const ddForm = answerForm(ddItem)!.responses[0];
  assert.ok(!sameAnswer(lab(...canonicalResponse(ddForm, ["1.0"])!), parseKey(ddItem)!));
  assert.ok(!sameAnswer(lab(...canonicalResponse(ddForm, ["01"])!), parseKey(ddItem)!));
  // multi-response choice key R1=1
  const c1: Interaction = { kind: "choice", responseId: "R1", maxChoices: 1, options: [o("1"), o("01"), o("1.0")] };
  const t2: Interaction = { kind: "textEntry", responseId: "R2" };
  const mItem = { itemType: "TI", key: "", keys: { R1: ["1"], R2: ["1/2"] }, interactions: [c1, t2] };
  const mKey = parseKey(mItem)!;
  assert.deepEqual(mKey, { kind: "labels", values: ["R1=1", "R2=1/2"], typedAt: [1] });
  const fs = answerForm(mItem)!.responses;
  const reply = (r1: string, r2: string) => multiAnswer([{ response: fs[0], values: canonicalResponse(fs[0], [r1])! }, { response: fs[1], values: canonicalResponse(fs[1], [r2])! }]);
  assert.ok(!sameAnswer(reply("01", "1/2"), mKey));
  assert.ok(!sameAnswer(reply("1.0", "1/2"), mKey));
  assert.ok(sameAnswer(reply("1", "0.5"), mKey), "the typed position still uses the fraction rule");
  // typed positions still work
  const t1: Interaction = { kind: "textEntry", responseId: "R1" }, tt2: Interaction = { kind: "textEntry", responseId: "R2" };
  const tItem = { itemType: "TI", key: "", keys: { R1: ["1/2"], R2: ["3"] }, interactions: [t1, tt2] };
  const tfs = answerForm(tItem)!.responses;
  assert.ok(sameAnswer(multiAnswer([{ response: tfs[0], values: ["0.5"] }, { response: tfs[1], values: ["3"] }]), parseKey(tItem)!));
  assert.ok(sameAnswer(typedAnswer("x = 3"), typedAnswer("x=3")));
  // a typed position on one side only → exact
  assert.ok(!sameAnswer(lab("R1=0.5", "R2=3"), typ("R1=1/2", "R2=3")));
  assert.ok(!sameAnswer(lab("x = 3"), typ("x=3")));
  assert.ok(sameAnswer(lab("R1=3"), typ("r1=3")), "exact rule still case-insensitive");
  // a number comes only from a typed entry: against a single label it compares as typed, marked or not
  assert.ok(sameAnswer(num("0.5"), lab("1/2")));
  assert.ok(sameAnswer(num("0.5"), typ("1/2")));
  assert.ok(!sameAnswer(num("1"), lab("01x")));
}

// typed text fallback, signs, Unicode minus
{
  assert.ok(sameAnswer(num("-3"), typ("- 3")), "a leading sign joins its number");
  assert.ok(sameAnswer(typ("- 3"), num("-3")));
  assert.ok(!sameAnswer(num("-3"), typ("- 4")));
  assert.ok(!sameAnswer(num("3"), num("4")));
  assert.ok(sameAnswer(typ("x − 3"), typ("x-3")));
  assert.ok(sameAnswer(typ("x−3"), typ("x - 3")));
  assert.ok(sameAnswer(typ("– 3 m"), typ("-3 m")));
  assert.ok(!sameAnswer(typ("x − 3"), typ("x+3")));
}

// readNumber: the ONE number reader (write.ts and calc.ts use it); exact decimals, never floating point
{
  const v = (t: string, forms?: Parameters<typeof readNumber>[1]) => readNumber(t, forms)?.value ?? null;
  const pl = (t: string, forms?: Parameters<typeof readNumber>[1]) => readNumber(t, forms)?.plain ?? null;
  assert.equal(v("0.50"), "0.5", "trailing zeros");
  assert.equal(v("0.50"), v("0.5"), "0.50 = 0.5");
  assert.equal(v("1,2"), null, "1,2 is not 12");
  assert.equal(v("- 3"), "-3", "a spaced leading sign");
  assert.equal(v("- 3"), v("-3.0"), "- 3 = -3.0");
  for (const m of ["\u2212", "\u2013", "\u2014", "\u2010", "\u2011", "\ufe63", "\uff0d"]) assert.equal(v(`${m}0.5`), "-0.5", `minus variant ${JSON.stringify(m)}`);
  assert.equal(v("+4"), "4", "plus sign");
  assert.equal(v("2,500"), "2500", "thousands comma");
  assert.equal(v("2{,}500"), "2500", "LaTeX thousands group");
  assert.equal(v("2\u2009500"), "2500", "thin space group");
  assert.equal(v("2 500"), "2500", "space group");
  assert.equal(v("1,234.50"), "1234.5", "grouped with decimals");
  assert.equal(v(".5"), "0.5", "leading point");
  assert.equal(pl(".5"), ".5", "plain keeps the written digits");
  assert.equal(pl("4.0"), "4.0", "plain keeps trailing zeros");
  assert.equal(v("-0.0"), "0", "negative zero is zero");
  // forms are opt-in: a plain decimal by default
  for (const t of ["2.5e3", "1/2", "50%", "2.50 \u00d7 10^{3}", "12 m", "abc", "", "1.2.3", "--3"]) assert.equal(v(t), null, `not a plain decimal: ${t}`);
  assert.equal(v("2.5e3", { exponent: true }), "2500", "e-notation");
  assert.equal(pl("2.50E+3", { exponent: true }), "2500", "E+ notation");
  assert.equal(v("2.50 \u00d7 10^{3}", { exponent: true }), "2500", "times ten to the power, braces");
  assert.equal(v("2.50 \\times 10^{3}", { exponent: true }), "2500", "LaTeX times");
  assert.equal(v("5 \u00d7 10^{-1}", { exponent: true }), "0.5", "negative power");
  assert.equal(pl("2.50 x 10^-3", { exponent: true }), "0.00250", "x as times; plain keeps digits");
  assert.equal(v("2.5 \u00d7 10^\u22123", { exponent: true }), "0.0025", "Unicode minus in the power");
  assert.equal(v("2.5\u00b710^-2", { exponent: true }), "0.025", "middle dot");
  assert.equal(v("-3.01 \u00d7 10^23", { exponent: true }), "-301000000000000000000000", "signed mantissa");
  assert.equal(v("1e1001", { exponent: true }), null, "an exponent beyond 1000 is not read");
  assert.equal(v("1/2", { fraction: true }), "0.5", "fraction");
  assert.equal(v("-1/2", { fraction: true }), "-0.5", "signed fraction");
  assert.equal(v("3 / 4", { fraction: true }), "0.75", "spaced fraction");
  assert.equal(v("1/3", { fraction: true }), null, "a repeating fraction is never equal to a decimal");
  assert.equal(v("1/0", { fraction: true }), null, "zero denominator");
  assert.equal(v("50%", { percent: true }), "0.5", "percent");
  assert.equal(v("0.5 %", { percent: true }), "0.005", "spaced percent");
  assert.equal(v("50\\%", { percent: true }), "0.5", "LaTeX percent");
  assert.equal(shiftDecimal("2.50", 3), "2500");
  assert.equal(shiftDecimal("-0.5", -2), "-0.005");
  assert.equal(shiftDecimal("-0", 2), "0");
  // the comparison side
  assert.ok(sameAnswer(num("-3.0"), typ("- 3")), "- 3 equals -3.0 (spaced sign re-read as a number)");
  assert.ok(sameAnswer(typedAnswer("- 3"), num("-3.0")), "typedAnswer reads - 3 as a number");
  assert.deepEqual(typedAnswer("- 3"), num("-3"), "the spaced sign is closed up in the value");
  assert.ok(sameAnswer(num("0.50"), num("0.5")));
  assert.ok(!sameAnswer(num("1,2"), num("12")));
  assert.ok(sameAnswer(num("2{,}500"), num("2500")), "LaTeX group in a typed value");
  assert.ok(sameAnswer(num("\u20100.5"), num("-0.5")), "hyphen as minus");
}

// detail when keys sit only under other responseIds
{
  const one: Interaction = { kind: "choice", responseId: "RESPONSE", maxChoices: 1, options: [o("A"), o("B")] };
  assert.equal(readKey({ itemType: "MC", key: "", keys: { OTHER: ["A"], X: ["B"] }, interactions: [one] }).detail, "key not readable: keys are under OTHER, X; the item's responses are RESPONSE");
  const r1: Interaction = { kind: "textEntry", responseId: "R1" }, r2: Interaction = { kind: "textEntry", responseId: "R2" };
  const d = readKey({ itemType: "TI", key: "", keys: { R1: ["3"], OTHER: ["4"] }, interactions: [r1, r2] }).detail!;
  assert.equal(d, "key not readable: keys are under OTHER; the item's responses are R1, R2");
  assert.ok(!d.includes("(empty)"));
}

console.log("answers tests passed");
