import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import * as esm from '../dist/esm/index.js';
import { vectors } from './helpers.mjs';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

test('the CommonJS and ES module builds export the same names and sign the same token', () => {
  const cjs = require('../dist/cjs/index.js');
  assert.deepEqual(Object.keys(cjs).sort(), Object.keys(esm).sort());
  const [vector] = vectors.tokens;
  const options = { partnerId: vectors.partnerId, secret: vectors.secret, issuedAt: vector.issuedAt, expiresInSeconds: vector.expiresInSeconds };
  assert.equal(cjs.createSessionToken(vector.claims, options), esm.createSessionToken(vector.claims, options));
  assert.equal(typeof require('../dist/cjs/embed.js').mountTutor, 'function');
});

test('the public surface is what the README documents', () => {
  assert.deepEqual(Object.keys(esm).sort(), ['DEFAULT_API_HOST', 'DEFAULT_EMBED_HOST', 'EvelynApiError', 'EvelynConfigError', 'EvelynTutor', 'createSessionToken', 'createSessionUrl', 'sessionUrl', 'signRequest', 'verifySessionToken']);
});

test('package.json points at files the build produces, and the version constant matches', () => {
  const { VERSION } = require('../dist/cjs/version.js');
  assert.equal(VERSION, pkg.version);
  const targets = [pkg.main, pkg.module, pkg.types, ...Object.values(pkg.bin), ...Object.values(pkg.exports).flatMap((entry) => (typeof entry === 'string' ? [entry] : Object.values(entry).flatMap((condition) => Object.values(condition))))];
  for (const target of targets) assert.ok(readFileSync(new URL(`../${target}`, import.meta.url)), target);
  assert.equal(pkg.dependencies, undefined, 'zero runtime dependencies');
  assert.equal(JSON.parse(readFileSync(new URL('../dist/esm/package.json', import.meta.url), 'utf8')).type, 'module');
});

test('the bundled guide is the guide, and names nothing the package does not have', () => {
  const guide = readFileSync(new URL('../docs/integration.md', import.meta.url), 'utf8');
  assert.match(guide, /^# Evelyn Voice Tutor: integration guide/);
  for (const needle of ['tutor_languages', '/api/portal/v1/plan-generate', '/api/portal/v1/homework-problem-plan', 'x-evelyn-signature', 'evelyn:session_ended']) assert.ok(guide.includes(needle), needle);
});
