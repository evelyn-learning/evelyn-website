import { apiEndpoints, apiCategories } from '../../data/api-endpoints';
import { EndpointCard } from '../components/EndpointCard';
import { Callout } from '../components/Callout';

export default function ApiReferencePage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">API Reference</h1>
      <p className="mb-8 text-lg text-slate-600">
        REST endpoints for managing sessions, students, curriculum modules, usage, and webhooks.
      </p>

      <div className="mb-6 rounded-lg bg-slate-900 px-4 py-3">
        <p className="text-xs text-slate-400">Base URL</p>
        <code className="text-sm text-green-400">https://api.evelynlearning.com/v1</code>
      </div>

      <Callout type="info" title="Authentication">
        All endpoints require the <code>X-API-Key</code> header with your partner API key.
        See <a href="/docs/authentication" className="underline">Authentication</a> for details.
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

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Pagination</h2>
      <p className="mb-4 text-sm text-slate-600">
        List endpoints support pagination via query parameters:
      </p>
      <ul className="space-y-1 text-sm text-slate-600">
        <li><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">page</code> — Page number (default: 1)</li>
        <li><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">limit</code> — Items per page (default: 20, max: 100)</li>
        <li><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">sort</code> — Sort field (e.g., <code className="text-xs">created_at</code>)</li>
        <li><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">order</code> — <code className="text-xs">asc</code> or <code className="text-xs">desc</code> (default: desc)</li>
      </ul>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Error Format</h2>
      <p className="mb-4 text-sm text-slate-600">
        All errors return a consistent JSON structure:
      </p>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
        <code>{`{
  "error": {
    "code": "invalid_token",
    "message": "The session token has expired",
    "status": 401
  }
}`}</code>
      </pre>
    </div>
  );
}
