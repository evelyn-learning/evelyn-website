import fs from "node:fs";
const rows = JSON.parse(fs.readFileSync("out/geo_probe.json", "utf8"));
const dom = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return null; } };
const sov = {}, byCat = { edu: {}, learn: {} };
let ok = 0, own = 0;
for (const r of rows) {
  if (r.error) { console.log(`ERR ${r.id}: ${r.error}`); continue; }
  ok++; if (r.mentioned.length) own++;
  const ds = [...new Set((r.cited.length ? r.cited : r.searched).map(dom).filter(Boolean))];
  const cat = r.id.startsWith("edu") ? "edu" : "learn";
  for (const d of ds) { sov[d] = (sov[d] || 0) + 1; byCat[cat][d] = (byCat[cat][d] || 0) + 1; }
  console.log(`\n## ${r.id} (${r.secs}s, ${r.cited.length} citations, own=${r.mentioned.join(",") || "-"})\n${r.question}\n  cited: ${ds.join(", ")}`);
  const vendors = r.answer.match(/\*\*([^*]{3,40})\*\*/g)?.map((s) => s.replace(/\*/g, "")).slice(0, 10) ?? [];
  console.log(`  named: ${[...new Set(vendors)].join(" | ")}`);
}
console.log(`\n=== ${ok} answered, own domains mentioned in ${own} ===`);
const top = (o, n = 25) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([d, c]) => `${c} ${d}`).join("\n");
console.log("\n=== share of voice: domains cited across questions ===\n" + top(sov));
console.log("\n=== educator/institution questions ===\n" + top(byCat.edu, 15));
console.log("\n=== learner questions ===\n" + top(byCat.learn, 15));
const u = rows.filter(r=>r.usage).reduce((a, r) => ({ i: a.i + r.usage.input_tokens, o: a.o + r.usage.output_tokens, s: a.s + (r.usage.server_tool_use?.web_search_requests || 0) }), { i: 0, o: 0, s: 0 });
console.log(`\ntokens in=${u.i} out=${u.o} searches=${u.s} est cost $${(u.i*5/1e6 + u.o*25/1e6 + u.s*0.01).toFixed(2)}`);
