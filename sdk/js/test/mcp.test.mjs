import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { test } from 'node:test';
import { verifySessionToken } from '../dist/esm/index.js';
import { CLI, MCP, cleanEnv, vectors } from './helpers.mjs';

const { partnerId, secret } = vectors;

/** Starts the server as an MCP client would and returns `call(method, params)` over its stdio. */
function startServer({ command = [MCP], env = {}, cwd = mkdtempSync(join(tmpdir(), 'evelyn-mcp-')) } = {}) {
  const child = spawn(process.execPath, command, { cwd, env: cleanEnv({ EVELYN_EMBED_HOST: 'http://127.0.0.1:9', ...env }), stdio: ['pipe', 'pipe', 'inherit'] });
  const waiting = new Map();
  const unexpected = [];
  createInterface({ input: child.stdout }).on('line', (line) => {
    const message = JSON.parse(line); // every line on stdout must be a protocol message
    const resolve = waiting.get(message.id);
    if (resolve) resolve(message);
    else unexpected.push(message);
  });
  let nextId = 1;
  return {
    cwd,
    unexpected,
    notify: (method, params) => child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`),
    raw: (text) => child.stdin.write(`${text}\n`),
    call(method, params) {
      const id = nextId++;
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
      return new Promise((resolve) => waiting.set(id, resolve));
    },
    async tool(name, args = {}) {
      const { result } = await this.call('tools/call', { name, arguments: args });
      return { text: result.content[0].text, isError: result.isError === true };
    },
    stop: () => new Promise((resolve) => child.on('exit', resolve).stdin.end()),
  };
}

const EXPECTED_TOOLS = ['evelyn_docs', 'evelyn_get_keys_instructions', 'evelyn_create_session_url', 'evelyn_usage', 'evelyn_read_worksheet', 'evelyn_prepare_problem', 'evelyn_scaffold', 'evelyn_doctor'];

test('initialize → tools/list → tools/call evelyn_create_session_url returns a URL that verifies', async () => {
  const server = startServer({ env: { EVELYN_PARTNER_ID: partnerId, EVELYN_PARTNER_SECRET: secret } });
  try {
    const init = await server.call('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test', version: '0' } });
    assert.equal(init.jsonrpc, '2.0');
    assert.equal(init.result.protocolVersion, '2024-11-05');
    assert.deepEqual(init.result.capabilities, { tools: {}, resources: {} });
    assert.equal(init.result.serverInfo.name, 'evelyn-tutor');
    server.notify('notifications/initialized');

    const { result } = await server.call('tools/list');
    assert.deepEqual(result.tools.map((tool) => tool.name), EXPECTED_TOOLS);
    for (const tool of result.tools) {
      assert.ok(tool.description.length > 80, `${tool.name} has a description written for a reader`);
      assert.equal(tool.inputSchema.type, 'object');
      assert.equal(tool.inputSchema.additionalProperties, false);
      for (const name of tool.inputSchema.required ?? []) assert.ok(name in tool.inputSchema.properties, `${tool.name}: required "${name}" is a declared property`);
      for (const property of Object.values(tool.inputSchema.properties)) assert.ok(property.description, `${tool.name}: every argument is described`);
    }

    const made = await server.tool('evelyn_create_session_url', { student_id: 'stu_1', subject: 'math', level: 'Grade 8', topic: '聯立方程式', target_kind: 'freestyle', tutor_languages: ['zh-TW'], expires_in_seconds: 900 });
    assert.equal(made.isError, false);
    const url = new URL(made.text.split('\n')[0]);
    assert.equal(url.origin + url.pathname, 'http://127.0.0.1:9/embed');
    const claims = verifySessionToken(url.searchParams.get('token'), secret);
    assert.equal(claims.partner_id, partnerId);
    assert.equal(claims.student_id, 'stu_1');
    assert.deepEqual(claims.tutor_languages, ['zh-TW']);
    assert.equal(claims.exp - claims.iat, 900);
    assert.equal(claims.expires_in_seconds, undefined);
    assert.ok(!made.text.includes(secret));

    assert.deepEqual((await server.call('ping')).result, {});
    assert.deepEqual(server.unexpected, [], 'a notification gets no reply');
  } finally {
    await server.stop();
  }
});

test('a tool that needs keys says how to get them, as a tool error', async () => {
  const server = startServer();
  try {
    const failed = await server.tool('evelyn_create_session_url', { student_id: 'stu_1', subject: 'math', level: 'Grade 8' });
    assert.equal(failed.isError, true);
    assert.match(failed.text, /EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET are not set\. Sign up at https:\/\/tutor\.evelynlearning\.com\/sandbox/);

    // Keys added to the project's env file while the server runs are picked up on the next call.
    writeFileSync(join(server.cwd, '.env.local'), `EVELYN_PARTNER_ID=${partnerId}\nEVELYN_PARTNER_SECRET=${secret}\n`);
    const made = await server.tool('evelyn_create_session_url', { student_id: 'stu_1', subject: 'math', level: 'Grade 8' });
    assert.equal(made.isError, false);
    assert.equal(verifySessionToken(new URL(made.text.split('\n')[0]).searchParams.get('token'), secret).partner_id, partnerId);

    const badClaims = await server.tool('evelyn_create_session_url', { student_id: 'stu_1', subject: 'math', level: 'Grade 8', max_duration_minutes: 500 });
    assert.equal(badClaims.isError, true);
    assert.match(badClaims.text, /max_duration_minutes must be a number from 1 to 120/);
  } finally {
    await server.stop();
  }
});

test('tools that need no keys: docs, key instructions, scaffold, doctor', async () => {
  const server = startServer({ command: [CLI, 'mcp'] });
  try {
    const docs = await server.tool('evelyn_docs');
    assert.match(docs.text, /^# Evelyn Voice Tutor: integration guide/);
    assert.match(docs.text, /copy bundled with @evelynlearning\/tutor/);

    const keys = await server.tool('evelyn_get_keys_instructions');
    assert.match(keys.text, /https:\/\/tutor\.evelynlearning\.com\/sandbox/);
    assert.match(keys.text, /EVELYN_PARTNER_SECRET=/);

    const next = await server.tool('evelyn_scaffold', { framework: 'next', src_dir: true });
    assert.match(next.text, /File: src\/app\/api\/evelyn\/session\/route\.ts/);
    assert.match(next.text, /File: src\/app\/evelyn-tutor\/page\.tsx/);
    assert.match(next.text, /\.env\.local/);
    const express = await server.tool('evelyn_scaffold', { framework: 'express', esm: true });
    assert.match(express.text, /export default router;/);
    assert.equal((await server.tool('evelyn_scaffold', { framework: 'rails' })).isError, true);

    const doctor = await server.tool('evelyn_doctor');
    assert.match(doctor.text, /FAIL {2}EVELYN_PARTNER_ID: not set/);
  } finally {
    await server.stop();
  }
});

test('resources, unknown methods, unknown tools and unparsable input', async () => {
  const server = startServer();
  try {
    const newer = await server.call('initialize', { protocolVersion: '2099-01-01', capabilities: {} });
    assert.equal(newer.result.protocolVersion, '2025-06-18', 'an unknown revision is answered with the newest one this server speaks');

    const listed = await server.call('resources/list');
    assert.deepEqual(listed.result.resources.map((r) => r.uri), ['evelyn://docs/integration-guide']);
    const read = await server.call('resources/read', { uri: 'evelyn://docs/integration-guide' });
    assert.equal(read.result.contents[0].mimeType, 'text/markdown');
    assert.match(read.result.contents[0].text, /^# Evelyn Voice Tutor: integration guide/);
    assert.equal((await server.call('resources/read', { uri: 'evelyn://nope' })).error.code, -32002);

    assert.equal((await server.call('prompts/list')).error.code, -32601);
    assert.equal((await server.call('tools/call', { name: 'evelyn_nope' })).error.code, -32602);

    const parseError = new Promise((resolve) => {
      const timer = setInterval(() => {
        if (server.unexpected.length > 0) resolve(server.unexpected[0]) || clearInterval(timer);
      }, 10);
    });
    server.raw('{not json');
    assert.deepEqual(await parseError, { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
  } finally {
    await server.stop();
  }
});
