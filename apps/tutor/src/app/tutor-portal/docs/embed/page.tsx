import { configParams } from '../../data/config-params';
import { ParamTable } from '../components/ParamTable';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

export default function EmbedPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Embed Configuration</h1>
      <p className="mb-8 text-lg text-slate-600">
        Full reference for all parameters available when embedding the Voice Tutor.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">Embed URL</h2>
      <CodeBlock>{`https://tutor.evelynlearning.com/embed?token={SESSION_TOKEN}`}</CodeBlock>
      <p className="mb-6 text-sm text-slate-600">
        Sandbox: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">https://tutor-sandbox.evelynlearning.com/embed?token=...</code>
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">Basic Embed</h2>
      <CodeBlock language="html">{`<iframe
  src="https://tutor.evelynlearning.com/embed?token=YOUR_JWT_TOKEN"
  width="100%"
  height="700"
  allow="microphone; camera"
  frameborder="0"
></iframe>`}</CodeBlock>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">JWT Token Parameters</h2>
      <p className="mb-4 text-sm text-slate-600">
        These parameters are included in the JWT payload signed with your API Secret:
      </p>
      <ParamTable params={configParams} showRequired showExample />

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Engine Selection</h2>
      <p className="mb-4 text-sm text-slate-600">
        The <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">engine</code> parameter
        selects the voice engine tier:
      </p>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500">Value</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">Name</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">Latency</th>
              <th className="pb-3 font-medium text-slate-500">Price/Min</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">standard</code></td>
              <td className="py-2.5 pr-4 text-slate-700">Standard</td>
              <td className="py-2.5 pr-4 text-slate-500">~1.5s</td>
              <td className="py-2.5 text-slate-700">$0.06</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">premium</code></td>
              <td className="py-2.5 pr-4 text-slate-700">Premium</td>
              <td className="py-2.5 pr-4 text-slate-500">&lt;400ms</td>
              <td className="py-2.5 text-slate-700">$0.25</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info">
        Sandbox environments are limited to the Standard engine. Premium is available in production.
      </Callout>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Branding Object</h2>
      <p className="mb-4 text-sm text-slate-600">
        The optional <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">branding</code> object
        customizes the tutor&apos;s appearance:
      </p>
      <ParamTable
        showRequired={false}
        params={[
          { name: 'primary_color', type: 'string', description: 'Hex color for buttons and accents', example: '"#1E40AF"' },
          { name: 'logo_url', type: 'string', description: 'URL to your logo (displayed in tutor header)', example: '"https://example.com/logo.png"' },
          { name: 'product_name', type: 'string', description: 'Replaces "Evelyn Voice Tutor" in the UI', example: '"BAC Tutor"' },
        ]}
      />

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Features Object</h2>
      <p className="mb-4 text-sm text-slate-600">
        Toggle individual features on or off:
      </p>
      <ParamTable
        showRequired={false}
        params={[
          { name: 'homework_upload', type: 'boolean', description: 'Enable photo upload for homework problems (default: true)' },
          { name: 'text_mode', type: 'boolean', description: 'Allow students to switch to text input (default: true)' },
          { name: 'voice_mode', type: 'boolean', description: 'Allow voice input (default: true)' },
        ]}
      />

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Example: Full Token</h2>
      <CodeBlock language="json" title="JWT payload">{`{
  "partner_id": "algerian-bac",
  "student_id": "stu_abc123",
  "student_name": "Ahmed",
  "subject": "math",
  "topic": "algebra-2",
  "level": "11-12",
  "session_goal": "test-prep",
  "engine": "standard",
  "locale": "ar-DZ",
  "branding": {
    "primary_color": "#1E40AF",
    "logo_url": "https://partner.com/logo.png",
    "product_name": "BAC Tutor"
  },
  "curriculum_module": "algerian-bac-math-2026",
  "max_duration_minutes": 30,
  "features": {
    "homework_upload": true,
    "text_mode": true
  },
  "metadata": {
    "class_id": "math-11b",
    "teacher_id": "tch_456"
  },
  "exp": 1735689600
}`}</CodeBlock>
    </div>
  );
}
