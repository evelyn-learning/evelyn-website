/* Content-generation model roles resolve through the registry with correct
 * defaults, env override, and legacy alias. Run: npm run test:content-model-roles */
import { resolveModel } from '../src/lib/tutor/ai/model-registry';

let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) console.log(`  ✓ ${name}`);
  else { failures++; console.error(`  ✗ ${name}`); }
}

// Defaults (no env set in the test process for these roles)
delete process.env.TUTOR_MODEL_CONTENT_GEN;
delete process.env.TUTOR_MODEL_CONTENT_VERIFY;
delete process.env.TUTOR_MODEL_NOTES_POINTERS;
delete process.env.POINTER_GEN_MODEL;
check('content-gen defaults to claude-sonnet-5', resolveModel('content-gen').model === 'claude-sonnet-5');
check('content-verify defaults to claude-sonnet-5', resolveModel('content-verify').model === 'claude-sonnet-5');
check('notes-pointers defaults to claude-opus-5', resolveModel('notes-pointers').model === 'claude-opus-5');

// Env override wins
process.env.TUTOR_MODEL_CONTENT_GEN = 'claude-haiku-4-5';
check('TUTOR_MODEL_CONTENT_GEN overrides', resolveModel('content-gen').model === 'claude-haiku-4-5');
delete process.env.TUTOR_MODEL_CONTENT_GEN;

// Legacy alias still works, and the registry var outranks it
process.env.POINTER_GEN_MODEL = 'claude-sonnet-5';
check('POINTER_GEN_MODEL legacy alias honored', resolveModel('notes-pointers').model === 'claude-sonnet-5');
process.env.TUTOR_MODEL_NOTES_POINTERS = 'claude-opus-5';
check('TUTOR_MODEL_NOTES_POINTERS outranks legacy', resolveModel('notes-pointers').model === 'claude-opus-5');

// Base-URL override flips native off (DeepSeek-style routing)
process.env.TUTOR_MODEL_CONTENT_VERIFY_BASE_URL = 'https://api.deepseek.com/anthropic';
check('base URL override → native:false', resolveModel('content-verify').native === false);
delete process.env.TUTOR_MODEL_CONTENT_VERIFY_BASE_URL;

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('content-model-roles: all assertions passed');
