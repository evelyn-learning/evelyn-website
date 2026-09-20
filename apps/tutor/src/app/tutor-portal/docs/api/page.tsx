import { apiEndpoints, apiCategories } from '../../data/api-endpoints';
import { EndpointCard } from '../components/EndpointCard';
import { Callout } from '../components/Callout';

export default function ApiReferencePage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">API Reference</h1>
      <p className="mb-8 text-lg text-slate-600">
        The partner API: pull session facts and learning state, push student context, and turn your
        own material into lessons. Every route is partner-scoped — you only ever see your own
        students and sessions.
      </p>

      <div className="mb-6 rounded-lg bg-slate-900 px-4 py-3">
        <p className="text-xs text-slate-400">Base URL</p>
        <code className="text-sm text-green-400">https://www.evelynlearning.com/api/portal/v1</code>
      </div>

      <Callout type="info" title="Authentication">
        Every request is HMAC-signed with your partner secret (<code>x-evelyn-partner</code>,{' '}
        <code>x-evelyn-timestamp</code>, <code>x-evelyn-signature</code>). Send JSON bodies with{' '}
        <code>content-type: application/json</code>. See{' '}
        <a href="/docs/authentication" className="underline">Authentication</a>.
      </Callout>

      {apiCategories.map((category) => {
        const endpoints = apiEndpoints.filter((e) => e.category === category);
        return (
          <div key={category} className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">{category}</h2>
            <div className="space-y-3">
              {endpoints.map((ep) => (
                <EndpointCard
                  key={`${ep.method}-${ep.path}`}
                  method={ep.method}
                  path={ep.path}
                  description={ep.description}
                />
              ))}
            </div>
          </div>
        );
      })}

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Typical flow after a session</h2>
      <ol className="mb-6 list-decimal space-y-2 pl-5 text-sm text-slate-600">
        <li>Your page receives <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">evelyn:session_ended</code> and tells your backend.</li>
        <li>Backend calls <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /sessions/summary?ids=…</code> for active minutes, turns and board items.</li>
        <li>Backend calls <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /gaps</code> and <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">GET /mastery</code> (or <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">/learner-state</code>) for the student and stores the result for parent and teacher dashboards.</li>
        <li>Optionally <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">POST /assigned-practice</code> to show the homework the tutor set.</li>
      </ol>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Billing figure</h2>
      <p className="mb-6 text-sm text-slate-600">
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">durationSec</code> in{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">/sessions/summary</code> is active tutoring
        time: the gaps between consecutive turns, each capped at ten minutes. Idle time in an open tab is
        not counted. This is the number your invoice is based on.
      </p>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Error format</h2>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
        <code>{`{ "error": "unauthorized", "reason": "bad_signature" }
{ "error": "bad_request",  "reason": "studentId required" }
{ "error": "bad_request",  "issues": [ { "path": ["text"], "message": "…" } ] }`}</code>
      </pre>
      <p className="mt-3 text-sm text-slate-500">
        Status codes and reasons are listed under{' '}
        <a href="/docs/authentication" className="text-blue-600 underline">Authentication</a>.
      </p>
    </div>
  );
}
