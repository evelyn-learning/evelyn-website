import type { Metadata } from 'next';
import { configParams } from '../../data/config-params';
import { portalMetadata } from '../../seo';
import { DocsBreadcrumb } from '../components/DocsBreadcrumb';

export const metadata: Metadata = portalMetadata('/docs/embed');
import { ParamTable } from '../components/ParamTable';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

export default function EmbedPage() {
  return (
    <div>
      <DocsBreadcrumb path="/docs/embed" />
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
        with a voice code (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">&quot;voice&quot;: &quot;maple&quot;</code>).
        The ready-made teachers are listed, every voice can be heard, and a themed companion is explained on{' '}
        <a href="/docs/voices" className="text-blue-700 underline">Voices and Companions</a>.
      </p>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Language</h2>
      <p className="mb-4 text-sm text-slate-600">
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">tutor_languages</code> sets the language the whole
        lesson is taught in, and <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">switch_languages</code> lets
        the student change it by asking the tutor. The codes are on the{' '}
        <a href="/docs/languages" className="text-blue-700 underline">Languages</a> page.
      </p>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Session length</h2>
      <p className="mb-4 text-sm text-slate-600">
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">max_duration_minutes</code> is your cap for the
        session. Your account has a session limit of its own, and the lower of the two applies: 15 minutes in the free
        sandbox, 60 minutes after a first purchase. The{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">evelyn:clock</code> event reports the cap in force
        as <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">max_seconds</code>.
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
          { name: 'product_name', type: 'string', description: 'Replaces "Evelyn Voice Tutor" in the UI', example: '"Acme Tutor"' },
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
  "partner_id": "acme-learning",
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
