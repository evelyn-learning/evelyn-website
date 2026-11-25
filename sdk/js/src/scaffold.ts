import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** The kinds of project `init` and the MCP server can write a working example for. */
export type Framework = 'next' | 'express' | 'node';

/** Every framework name, for validation and help text. */
export const FRAMEWORKS: readonly Framework[] = ['next', 'express', 'node'];

/** What the example files depend on in the target project. */
export interface ProjectLayout {
  framework: Framework;
  /** Next.js: the app directory is `src/app`, not `app`. */
  srcDir: boolean;
  /** Next.js: write `.ts`/`.tsx` files. */
  typescript: boolean;
  /** Express: the project's `.js` files are ES modules (`"type": "module"`). */
  esm: boolean;
}

/** One example file, relative to the project root. */
export interface ScaffoldFile {
  path: string;
  content: string;
}

/** The example for one project: its files, where the keys go, and what to do next. */
export interface Scaffold {
  layout: ProjectLayout;
  /** The env file the keys belong in. Next.js reads `.env.local` by itself. */
  envFile: '.env.local' | '.env';
  files: ScaffoldFile[];
  /** What the developer does after the files are written, in order. */
  nextSteps: string[];
}

/** The claims every example signs. Kept in one place so the three examples teach the same lesson. */
const CLAIMS = (indent: string): string =>
  [
    '// Replace with the signed-in student from your own auth. One URL per student per session.',
    "student_id: 'demo-student',",
    "subject: 'math',",
    "level: 'Grade 8',",
    "topic: 'Solving linear equations',",
    "target_kind: 'freestyle',",
    '// A lesson taught wholly in another language: tutor_languages: [\'zh-TW\'] (or \'zh-CN\', \'ja\').',
    'max_duration_minutes: 15,',
  ]
    .map((line) => indent + line)
    .join('\n');

const NEXT_ROUTE = `import { EvelynTutor } from '@evelynlearning/tutor';

// Server only. Reads EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET from .env.local.
// The secret never leaves this file: the page receives the session URL and nothing else.
export async function POST() {
  const tutor = new EvelynTutor();
  const url = tutor.sessionUrl({
${CLAIMS('    ')}
  });
  return Response.json({ url });
}
`;

const NEXT_PAGE = `'use client';

import { useState } from 'react';

export default function EvelynTutorPage() {
  const [url, setUrl] = useState('');

  async function start() {
    const response = await fetch('/api/evelyn/session', { method: 'POST' });
    const data = await response.json();
    setUrl(data.url);
  }

  if (!url) return <button onClick={start}>Start lesson</button>;
  return (
    <iframe
      src={url}
      title="Tutor"
      allow="microphone; camera; autoplay; clipboard-write"
      allowFullScreen
      style={{ width: '100%', height: '100vh', border: 0 }}
    />
  );
}
`;

const HTML_PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Tutor</title>
    <style>
      html, body { height: 100%; margin: 0; }
      iframe { width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <button id="start">Start lesson</button>
    <script>
      document.getElementById('start').addEventListener('click', async () => {
        const response = await fetch('/api/evelyn/session', { method: 'POST' });
        const { url } = await response.json();
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.title = 'Tutor';
        iframe.allow = 'microphone; camera; autoplay; clipboard-write';
        iframe.allowFullscreen = true;
        document.body.replaceChildren(iframe);
      });

      // The session page reports back with postMessage.
      window.addEventListener('message', (event) => {
        if (event.origin !== 'https://tutor.evelynlearning.com') return;
        if (event.data && event.data.type === 'evelyn:session_ended') console.log('Session ended', event.data.data);
      });
    </script>
  </body>
</html>
`;

const EXPRESS_BODY = `const router = express.Router();

// The secret stays on the server: the page receives the session URL and nothing else.
router.post('/api/evelyn/session', (req, res) => {
  const tutor = new EvelynTutor(); // reads EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET
  const url = tutor.sessionUrl({
${CLAIMS('    ')}
  });
  res.json({ url });
});

router.get('/evelyn-tutor', (req, res) => {
  res.sendFile(page);
});
`;

const EXPRESS_CJS = `const path = require('node:path');
const express = require('express');
const { EvelynTutor } = require('@evelynlearning/tutor');

const page = path.join(__dirname, 'evelyn-tutor.html');
${EXPRESS_BODY}
module.exports = router;
`;

const EXPRESS_ESM = `import { fileURLToPath } from 'node:url';
import express from 'express';
import { EvelynTutor } from '@evelynlearning/tutor';

const page = fileURLToPath(new URL('./evelyn-tutor.html', import.meta.url));
${EXPRESS_BODY}
export default router;
`;

const NODE_SERVER = `import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { EvelynTutor } from '@evelynlearning/tutor';

// Run with: node --env-file=.env evelyn-tutor-server.mjs
const tutor = new EvelynTutor(); // reads EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET
const page = new URL('./evelyn-tutor.html', import.meta.url);
const port = Number(process.env.PORT) || 3000;

createServer(async (req, res) => {
  // The secret stays on the server: the page receives the session URL and nothing else.
  if (req.method === 'POST' && req.url === '/api/evelyn/session') {
    const url = tutor.sessionUrl({
${CLAIMS('      ')}
    });
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ url }));
    return;
  }
  if (req.method === 'GET' && (req.url === '/' || req.url === '/evelyn-tutor')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(await readFile(page));
    return;
  }
  res.writeHead(404).end('Not found');
}).listen(port, () => {
  console.log(\`Open http://localhost:\${port}/evelyn-tutor\`);
});
`;

/** Reads a project's package.json and directories to choose the example that fits it. */
export function detectProject(dir: string): ProjectLayout {
  let pkg: { type?: unknown; dependencies?: Record<string, unknown>; devDependencies?: Record<string, unknown> } = {};
  try {
    pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  } catch {
    // No package.json, or one that does not parse: a plain Node project.
  }
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const framework: Framework = 'next' in deps ? 'next' : 'express' in deps ? 'express' : 'node';
  return {
    framework,
    srcDir: existsSync(join(dir, 'src', 'app')) || existsSync(join(dir, 'src', 'pages')),
    typescript: existsSync(join(dir, 'tsconfig.json')),
    esm: pkg.type === 'module',
  };
}

/** The example files for a project layout: a server route that returns a session URL, and a page that shows it. */
export function buildScaffold(layout: ProjectLayout): Scaffold {
  if (layout.framework === 'next') {
    const app = layout.srcDir ? 'src/app' : 'app';
    return {
      layout,
      envFile: '.env.local',
      files: [
        { path: `${app}/api/evelyn/session/route.${layout.typescript ? 'ts' : 'js'}`, content: NEXT_ROUTE },
        { path: `${app}/evelyn-tutor/page.${layout.typescript ? 'tsx' : 'jsx'}`, content: NEXT_PAGE },
      ],
      nextSteps: ['Start your dev server (npm run dev).', 'Open http://localhost:3000/evelyn-tutor and press Start lesson.'],
    };
  }
  if (layout.framework === 'express') {
    return {
      layout,
      envFile: '.env',
      files: [
        { path: 'evelyn-tutor.js', content: layout.esm ? EXPRESS_ESM : EXPRESS_CJS },
        { path: 'evelyn-tutor.html', content: HTML_PAGE },
      ],
      nextSteps: [
        layout.esm
          ? "Mount the router in your app: import evelynTutor from './evelyn-tutor.js'; app.use(evelynTutor);"
          : "Mount the router in your app: app.use(require('./evelyn-tutor'));",
        'Start the server with the keys loaded, for example: node --env-file=.env <your server file>.',
        'Open /evelyn-tutor on your server and press Start lesson.',
      ],
    };
  }
  return {
    layout,
    envFile: '.env',
    files: [
      { path: 'evelyn-tutor-server.mjs', content: NODE_SERVER },
      { path: 'evelyn-tutor.html', content: HTML_PAGE },
    ],
    nextSteps: ['Run: node --env-file=.env evelyn-tutor-server.mjs', 'Open http://localhost:3000/evelyn-tutor and press Start lesson.'],
  };
}
