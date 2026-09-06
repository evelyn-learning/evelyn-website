// scripts/test-practice-assign-routes.ts
import { strict as assert } from 'node:assert';
import { parseDraftBody, parseFinalizeBody } from '../src/lib/tutor/practice-assign/route-bodies';
assert.deepEqual(parseDraftBody({ studentId: 's', sessionId: 'x', loIds: ['a', 3, 'b'], trigger: 'recurrence:a', locator: 'Unit 2 · Practice' }),
  { ok: true, value: { studentId: 's', sessionId: 'x', loIds: ['a', 'b'], trigger: 'recurrence:a', locator: 'Unit 2 · Practice', lessonPlanId: undefined, courseId: undefined, subject: undefined } });
assert.equal(parseDraftBody({ studentId: 's', sessionId: 'x', loIds: [] }).ok, false);
assert.deepEqual(parseFinalizeBody({ studentId: 's', sessionId: 'x', source: 'close_tool', reason: ' r ', nextTimeIntent: 'n' }),
  { ok: true, value: { studentId: 's', sessionId: 'x', source: 'close_tool', reason: 'r', nextTimeIntent: 'n', locator: undefined } });
assert.equal(parseFinalizeBody({ studentId: 's', sessionId: 'x', source: 'bogus' }).ok, false);
console.log('practice-assign-routes: all assertions passed');
