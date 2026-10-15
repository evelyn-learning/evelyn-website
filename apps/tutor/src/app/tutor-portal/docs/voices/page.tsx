import type { Metadata } from 'next';
import { VOICE_CODES, codeForVoiceId } from '@core/voice/voice-codes';
import { DEMO_TEACHERS } from '@core/ai/teacher-persona';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { VoiceCard } from './VoiceCard';

export const metadata: Metadata = {
  title: 'Voices and Companions',
  robots: { index: false },
};

const teacherVoices = VOICE_CODES.filter((v) => v.group === 'teacher');
const characterVoices = VOICE_CODES.filter((v) => v.group === 'character');

const code = (s: string) => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{s}</code>;

export default function VoicesPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Voices and Companions</h1>
      <p className="mb-8 text-lg text-slate-600">
        Choose how your tutor sounds and who it is. A voice and a persona are separate choices: any persona can speak
        with any voice, and both can change from one lesson to the next.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">How to choose</h2>
      <p className="mb-2 text-sm text-slate-600">Put a voice code in the session token:</p>
      <CodeBlock language="json">{`{ "voice": "maple" }`}</CodeBlock>
      <p className="mb-2 text-sm text-slate-600">Use one of our ready-made teachers by its id:</p>
      <CodeBlock language="json">{`{ "teacher": "ms-priya-nair" }`}</CodeBlock>
      <p className="mb-2 text-sm text-slate-600">Or both: the ready-made teacher, speaking with the voice you picked.</p>
      <CodeBlock language="json">{`{ "teacher": "ms-priya-nair", "voice": "willow" }`}</CodeBlock>
      <Callout type="info" title="Which voice is used">
        The token&apos;s {code('voice')} always wins. Without it, the persona&apos;s own voice is used; without either, our
        default teacher voice ({code('maple')}). An unknown code or id never breaks a session: it falls back to the default.
      </Callout>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Teacher voices</h2>
      <p className="mb-4 text-sm text-slate-600">Calm, clear voices for everyday teaching, in a range of English accents.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {teacherVoices.map((v) => <VoiceCard key={v.code} code={v.code} tags={v.tags} description={v.description} />)}
      </div>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Character voices</h2>
      <p className="mb-4 text-sm text-slate-600">
        Livelier voices for a themed companion of your own (see below). Every voice here is an adult or young adult.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {characterVoices.map((v) => <VoiceCard key={v.code} code={v.code} tags={v.tags} description={v.description} />)}
      </div>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Ready-made teachers</h2>
      <p className="mb-4 text-sm text-slate-600">
        Send the id as {code('teacher')}. Each has its own name, teaching style and default voice. The same list, as full
        objects you can edit, is in the {code('teachers.json')} file supplied with your credentials.
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-3 py-2">id</th><th className="px-3 py-2">Name</th><th className="px-3 py-2">Voice</th><th className="px-3 py-2">In their words</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DEMO_TEACHERS.map((t) => (
              <tr key={t.id}>
                <td className="whitespace-nowrap px-3 py-2"><code className="text-xs">{t.id}</code></td>
                <td className="whitespace-nowrap px-3 py-2">{t.name}</td>
                <td className="px-3 py-2"><code className="text-xs">{t.voice ? codeForVoiceId(t.voice.voiceId) : 'maple'}</code></td>
                <td className="px-3 py-2 text-slate-600">{t.intro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Build your own companion</h2>
      <p className="mb-4 text-sm text-slate-600">
        A companion is a persona you write yourself, themed to your lessons: its name, a one-line intro, its personality, the
        catchphrases it uses now and then, and the topics it draws its examples from. Send it as the {code('teacher')}{' '}
        object, with a voice code as its {code('voice')}. Since it travels in each session&apos;s token, each lesson can have
        its own companion.
      </p>
      <CodeBlock language="json" title="Example: a companion for racing-themed lessons">{`{
  "teacher": {
    "id": "coach-blaze",
    "name": "Coach Blaze",
    "intro": "Pit lane is open! I'm Coach Blaze, and I help racers think fast and think smart.",
    "style": {
      "teaching": "Turns every idea into a race decision: pit now or stay out, which line to take.",
      "pace": "brisk",
      "humor": "light",
      "encouragement": "Celebrates good thinking, not just right answers.",
      "catchphrases": ["Green flag, let's go!", "Check your mirrors."],
      "analogyDomains": ["pit stops", "lap times", "race strategy"],
      "formality": "casual"
    },
    "voice": "turbo"
  }
}`}</CodeBlock>
      <p className="mb-2 text-sm text-slate-600">Every field except {code('id')}, {code('name')} and {code('intro')} is optional.</p>
      <Callout type="warning" title="Rules for companions">
        <ul className="ml-4 list-disc space-y-1">
          <li>Original characters only. A companion may not be, be named after, or sound like a real person or a character owned by someone else (a game, film or TV character, or a mascot).</li>
          <li>Real people and characters can still appear in your lessons. The tutor talks about them as the lesson shows them, and never speaks as them, quotes them beyond your lesson&apos;s own lines, or invents facts about them.</li>
          <li>A companion is a personality on top of the tutor, not a replacement for it: the tutor&apos;s teaching and safety rules always apply, whatever the persona says.</li>
          <li>Send us your first companions before they reach students; we will check them in a test session.</li>
        </ul>
      </Callout>
    </div>
  );
}
