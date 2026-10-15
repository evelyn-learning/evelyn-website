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
        The sandbox uses the same host and engine as production.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">Basic Embed</h2>
      <CodeBlock language="html">{`<iframe
  src="https://tutor.evelynlearning.com/embed?token=YOUR_SIGNED_TOKEN"
  allow="microphone; camera; autoplay; clipboard-write"
  allowfullscreen
  style="width:100%; height:100vh; border:0"
></iframe>`}</CodeBlock>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Token claims</h2>
      <p className="mb-4 text-sm text-slate-600">
        The JWT payload, signed HS256 with your partner secret, is the session configuration:
      </p>
      <ParamTable params={configParams} showRequired showExample />

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Teacher persona and voice</h2>
      <p className="mb-4 text-sm text-slate-600">
        Send a ready-made teacher by its id (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">&quot;teacher&quot;: &quot;ms-priya-nair&quot;</code>),
        or a persona object of your own as <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">teacher</code>, and choose the voice
        with a voice code (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">&quot;voice&quot;: &quot;maple&quot;</code>). The persona catalog
        (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">teachers.json</code>) holds the ready-made teachers as editable objects.
        Listen to every voice, and see how to build a themed companion, on{' '}
        <a href="/docs/voices" className="text-blue-700 underline">Voices and Companions</a>.
      </p>

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
  "partner_id": "your_partner_id",
  "student_id": "stu_abc123",
  "student_name": "Ayaan",
  "subject": "math",
  "level": "Grade 6",
  "topic": "Ratios and unit rates",
  "curriculum_module": "plan_8f3a…",
  "target_kind": "lessonNode",
  "session_goal": "homework-help",
  "max_duration_minutes": 30,
  "session_id": "sess-9012",
  "teacher": "ms-priya-nair",
  "voice": "lotus",
  "branding": { "primary_color": "#1E40AF", "product_name": "Acme Tutor" },
  "features": { "homework_upload": false },
  "metadata": { "class_id": "math-6b" },
  "iat": 1789450837,
  "exp": 1789458037
}`}</CodeBlock>
    </div>
  );
}
