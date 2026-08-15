/**
 * Build Ketcher iframe bundle
 *
 * Bundles the Ketcher Editor + Standalone + React into a single
 * self-contained HTML file in public/ketcher/
 *
 * Run: node scripts/build-ketcher.mjs
 */

import { build } from 'esbuild';
import { writeFileSync, readFileSync } from 'fs';

// Bundle the Ketcher entry point
const entryCode = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Editor } from 'ketcher-react';
import { StandaloneStructServiceProvider } from 'ketcher-standalone';
import 'ketcher-react/dist/index.css';

window.__initKetcher = function() {
  let ketcherInstance = null;
  let lastSmiles = '';

  window.addEventListener('message', async (event) => {
    const { type, smiles } = event.data || {};
    if (type === 'set-molecule' && ketcherInstance && smiles) {
      try { lastSmiles = smiles; await ketcherInstance.setMolecule(smiles); } catch(e) { console.error(e); }
    }
    if (type === 'get-svg' && ketcherInstance) {
      try {
        const s = await ketcherInstance.getSmiles();
        const blob = await ketcherInstance.generateImage(s, { outputFormat: 'svg', backgroundColor: '#fff' });
        const svg = await blob.text();
        window.parent.postMessage({ type: 'ketcher-svg', svg }, '*');
      } catch(e) { window.parent.postMessage({ type: 'ketcher-error', error: String(e) }, '*'); }
    }
    if (type === 'get-smiles' && ketcherInstance) {
      try {
        const s = await ketcherInstance.getSmiles();
        window.parent.postMessage({ type: 'ketcher-smiles', smiles: s }, '*');
      } catch(e) { window.parent.postMessage({ type: 'ketcher-error', error: String(e) }, '*'); }
    }
  });

  async function checkChanges() {
    if (!ketcherInstance) return;
    try {
      const s = await ketcherInstance.getSmiles();
      if (s && s !== lastSmiles && lastSmiles !== '') {
        lastSmiles = s;
        window.parent.postMessage({ type: 'molecule-changed', smiles: s }, '*');
      }
    } catch {}
  }

  const structServiceProvider = new StandaloneStructServiceProvider();
  document.getElementById('loading').style.display = 'none';
  document.getElementById('root').style.display = 'block';

  const root = createRoot(document.getElementById('root'));
  root.render(
    React.createElement(Editor, {
      staticResourcesUrl: '',
      structServiceProvider,
      errorHandler: (msg) => console.error('[Ketcher]', msg),
      onInit: (ketcher) => {
        ketcherInstance = ketcher;
        window.parent.postMessage({ type: 'ketcher-ready' }, '*');
        setInterval(checkChanges, 2000);
      },
    })
  );
};
`;

// Write temp entry file
writeFileSync('/tmp/ketcher-entry.jsx', entryCode);

try {
  const result = await build({
    entryPoints: ['/tmp/ketcher-entry.jsx'],
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'es2020',
    outfile: '/tmp/ketcher-bundle.js',
    loader: { '.css': 'css', '.jsx': 'jsx' },
    define: {
      'process.env.NODE_ENV': '"production"',
      'process.env': '{}',
      'process.platform': '"browser"',
      'process.version': '""',
    },
    external: [],
    jsx: 'automatic',
    absWorkingDir: process.cwd(),
    nodePaths: [process.cwd() + '/node_modules'],
  });

  // Copy JS and CSS to public/ketcher/
  const { copyFileSync } = await import('fs');
  copyFileSync('/tmp/ketcher-bundle.js', 'public/ketcher/bundle.js');
  copyFileSync('/tmp/ketcher-bundle.css', 'public/ketcher/bundle.css');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Molecule Editor</title>
<link rel="stylesheet" href="/ketcher/bundle.css">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #root { width: 100%; height: 100%; overflow: hidden; }
#loading {
  display: flex; align-items: center; justify-content: center;
  height: 100%; flex-direction: column; gap: 8px; color: #6b7280;
}
.spinner {
  width: 24px; height: 24px; border: 2px solid #3b82f6;
  border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.Ketcher-root { height: 100% !important; }
</style>
</head>
<body>
<div id="loading"><div class="spinner"></div><span style="font-size:13px">Loading chemistry editor...</span></div>
<div id="root" style="display:none"></div>
<script>window.process = { env: { NODE_ENV: 'production' }, platform: 'browser', version: '' }; window.global = window; window.Buffer = window.Buffer || { isBuffer: function() { return false; } };</script>
<script src="/ketcher/bundle.js"></script>
<script>window.__initKetcher();</script>
</body>
</html>`;

  writeFileSync('public/ketcher/index.html', html);
  const { statSync } = await import('fs');
  const jsSize = statSync('public/ketcher/bundle.js').size;
  console.log('✓ Ketcher bundle built successfully');
  console.log(`  JS bundle: ${(jsSize / 1024 / 1024).toFixed(1)} MB`);
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
