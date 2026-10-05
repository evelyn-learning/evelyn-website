// Stub stylesheet imports so the academy web renderer (lib/rich.ts imports katex's CSS;
// practice/shared.tsx imports a CSS module) loads under Node. Preload with `tsx -r`.
require.extensions['.css'] = (module) => { module.exports = new Proxy({}, { get: (_t, k) => String(k) }); };
