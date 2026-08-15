/**
 * Visual smoke: render the 4 CS catalog kinds (data_structure, graph_diagram,
 * hash_table, recursion_tree) through their real solver + renderer, to a single
 * PNG so we can eyeball the SVG output. Mirrors waves-smoke.ts.
 *
 * Usage: npx tsx scripts/cs-kinds-smoke.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';

import {
  solveDataStructure,
  solveGraphDiagram,
  solveHashTable,
  solveRecursionTree,
} from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/cs-structures';
import {
  CatalogDataStructureRenderer,
  CatalogGraphRenderer,
  CatalogHashTableRenderer,
  CatalogRecursionTreeRenderer,
} from '../apps/marketing/src/app/tutor/components/whiteboard/CatalogCSStructuresRenderers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOLVE: Record<string, (p: Record<string, unknown>) => any> = {
  data_structure: solveDataStructure,
  graph_diagram: solveGraphDiagram,
  hash_table: solveHashTable,
  recursion_tree: solveRecursionTree,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDER: Record<string, React.ComponentType<{ figure: any }>> = {
  data_structure: CatalogDataStructureRenderer,
  graph_diagram: CatalogGraphRenderer,
  hash_table: CatalogHashTableRenderer,
  recursion_tree: CatalogRecursionTreeRenderer,
};

const OUT_DIR =
  '/private/tmp/claude-501/-Users-luke-Dev-evelynlearning/d8c1f850-7170-4749-82b2-c44d6bef1efc/scratchpad';

const fixtures: { title: string; kind: string; params: Record<string, unknown> }[] = [
  { title: 'data_structure — stack (bare)', kind: 'data_structure', params: {} },
  { title: 'data_structure — queue', kind: 'data_structure', params: { structure: 'queue' } },
  { title: 'data_structure — linked_list', kind: 'data_structure', params: { structure: 'linked_list', items: ['12', '99', '7', '5'] } },
  { title: 'graph_diagram (bare, undirected)', kind: 'graph_diagram', params: {} },
  { title: 'graph_diagram — directed + weights + BFS', kind: 'graph_diagram', params: { nodes: ['A', 'B', 'C', 'D', 'E'], edges: [['A', 'B', 4], ['A', 'C', 2], ['B', 'D', 5], ['C', 'D', 1], ['C', 'E', 8], ['D', 'E', 3]], directed: true, traversal: 'bfs' } },
  { title: 'graph_diagram — DFS overlay', kind: 'graph_diagram', params: { traversal: 'dfs' } },
  { title: 'hash_table (bare, collision)', kind: 'hash_table', params: {} },
  { title: 'hash_table — size 5, custom entries', kind: 'hash_table', params: { size: 5, entries: [['red', '1'], ['green', '2'], ['blue', '3'], ['pink', '4']] } },
  { title: 'recursion_tree — fibonacci(5)', kind: 'recursion_tree', params: {} },
  { title: 'recursion_tree — fibonacci(6)', kind: 'recursion_tree', params: { n: 6 } },
  { title: 'recursion_tree — factorial(5)', kind: 'recursion_tree', params: { kind: 'factorial', n: 5 } },
];

const cards = fixtures.map((f) => {
  const figure = SOLVE[f.kind](f.params);
  const svg = renderToStaticMarkup(React.createElement(RENDER[f.kind], { figure }));
  return { title: f.title, svg };
});

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#f8fafc;font-family:sans-serif;padding:20px}
  .grid{display:flex;flex-direction:column;gap:20px;max-width:820px;margin:0 auto}
  .card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px}
  .card h3{margin:0 0 8px;font-size:13px;color:#475569;font-family:monospace}
  svg{width:100%;height:auto}
</style></head><body>
  <div class="grid">
  ${cards.map((c) => `<div class="card"><h3>${c.title}</h3>${c.svg}</div>`).join('')}
  </div>
</body></html>`;

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const htmlPath = path.join(OUT_DIR, 'kinds-cs.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 860, height: 3400 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.waitForTimeout(200);
  const pngPath = path.join(OUT_DIR, 'kinds-cs.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  await browser.close();
  console.log('wrote', pngPath);
})();
