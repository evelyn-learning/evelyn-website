// npx tsx src/lib/keystone/render.dollar.test.ts
// A dollar amount written inside maths ("$\$316032$") is typeset as a dollar sign and the number. It used to come
// out as the letters of the renderer's own placeholder (KSSLOT0KS316032), which Castle Rock's reviewers saw on
// 47374 and 218588.
import assert from "node:assert/strict";
import { renderMarkdown } from "./render";

const text = (html: string) => html.replace(/<annotation[\s\S]*?<\/annotation>/g, "").replace(/<[^>]+>/g, "");

const a = renderMarkdown("the value was $\\$316032$, so the answer is A.");
assert.ok(!/KSSLOT/.test(a) && !/<mi>K<\/mi><mi>S<\/mi>/.test(a), "no placeholder letters in the maths");
assert.ok(/\$\s*316032/.test(text(a)), "the dollar sign and the amount are shown");

const b = renderMarkdown("$$P = \\$6198.62$$");
assert.ok(!/<mi>K<\/mi><mi>S<\/mi>/.test(b) && /6198\.62/.test(text(b)), "display maths too");

const c = renderMarkdown("It costs \\$5 and \\$6, and $x = 2$.");
assert.ok(/costs \$5 and \$6/.test(text(c)), "an escaped dollar outside maths is still a plain dollar and opens no maths");
console.log("render.dollar: ok");
