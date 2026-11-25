import type { Metadata } from 'next';
import { portalFacts } from '../../data/facts';
import { PORTAL_ORIGIN, PORTAL_TEXT_FILES } from '../../portal-pages';
import { portalMetadata } from '../../seo';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { DocsBreadcrumb } from '../components/DocsBreadcrumb';

export const metadata: Metadata = portalMetadata('/docs/languages');

const c = 'rounded bg-slate-100 px-1.5 py-0.5 text-xs';

// 2026-11-24. The table is the engine's own list (offeredLanguages() in src/lib/tutor/voice/lesson-language.ts,
// through data/facts.ts): a language appears here when the engine marks it ready, with no edit to this page.
// What is said of a language's lesson (voice, listening, board, labels) is the engine's rule for a taught
// language; the Hinglish note is its `boardIn: 'en'` row.
export default function LanguagesPage() {
  const facts = portalFacts();
  const languages = facts.taughtLanguages;
  const others = languages.filter((l) => l.code !== 'en');
  const example = others.find((l) => l.code === 'hi') ?? others[0];

  return (
    <div>
      <DocsBreadcrumb path="/docs/languages" />
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Languages</h1>
      <p className="mb-8 text-lg text-slate-600">
        The languages a whole lesson can be taught in, how to choose one, and how a student can change language
        during a lesson.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">Lesson languages</h2>
      <p className="mb-4 text-sm text-slate-600">
        A lesson is taught in English unless the session token names another language. The whole lesson is then in
        that language: the tutor speaks it with a native voice, understands the student speaking it, and writes the
        board, the questions and the screen labels in it.
      </p>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500">Language</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">In its own name</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">Code</th>
              <th className="pb-3 font-medium text-slate-500">Token claim</th>
            </tr>
          </thead>
          <tbody>
            {languages.map((l) => (
              <tr key={l.code} className="border-b border-slate-100">
                <td className="py-2.5 pr-4 font-medium text-slate-700">{l.english}</td>
                <td className="py-2.5 pr-4 text-slate-600" lang={l.code}>{l.ownName}</td>
                <td className="py-2.5 pr-4"><code className={`${c} font-mono`}>{l.code}</code></td>
                <td className="py-2.5 text-slate-500">
                  {l.code === 'en' ? 'Leave tutor_languages out' : <code className="text-xs">{`"tutor_languages": ["${l.code}"]`}</code>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout type="info" title="How this list relates to the language count on our other pages">
        This page lists the languages a lesson can be <strong>taught</strong> in from start to finish: {languages.length} today.
        It is a narrower thing than the {facts.reachLanguageCount}+ languages quoted elsewhere on this site for the
        learners the tutor supports. When you need a lesson to run entirely in one language, use a code from this table.
      </Callout>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Setting the lesson&apos;s language</h2>
      <p className="mb-2 text-sm text-slate-600">
        Put one code, in a list, in the token&apos;s <code className={c}>tutor_languages</code> claim. Write the{' '}
        <code className={c}>topic</code> in the same language.
      </p>
      {example && (
        <CodeBlock language="json" title={`Token claims: a lesson taught in ${example.english}`}>{`{
  "partner_id": "acme-learning",
  "student_id": "stu_abc123",
  "subject": "math",
  "level": "Grade 8",
  "topic": "Solving linear equations",
  "target_kind": "freestyle",
  "tutor_languages": ["${example.code}"]
}`}</CodeBlock>
      )}
      <p className="mb-6 text-sm text-slate-600">
        A code the service does not know is ignored and the lesson runs in English. See{' '}
        <a href="/docs/embed" className="text-blue-600 underline">Embed Configuration</a> for the other claims.
      </p>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Hinglish</h2>
      <p className="mb-6 text-sm text-slate-600">
        Hinglish (<code className={c}>hi-Latn</code>) is the mix of Hindi and English that many students in India
        speak. The tutor speaks and listens in that mix, and the board stays in English, as it would in a classroom
        where the teacher explains in Hindi and writes in English. Choose <code className={c}>hi</code> instead for a
        lesson spoken in Hindi with the board in Hindi.
      </p>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Changing language during a lesson</h2>
      <p className="mb-2 text-sm text-slate-600">
        By default a lesson stays in its language. With the <code className={c}>switch_languages</code> claim, the
        student may ask the tutor for another one (&quot;can you explain in Hindi?&quot;) and the voice, the
        listening, the board and the screen labels change together. The claim is a list of codes from the table, or{' '}
        <code className={c}>&quot;all&quot;</code> for every language in it.
      </p>
      <CodeBlock language="json" title="Token claims: an English lesson the student may change to Hindi or Hinglish">{`{
  "subject": "math",
  "level": "Grade 8",
  "topic": "Fractions",
  "target_kind": "freestyle",
  "switch_languages": ["hi", "hi-Latn"]
}`}</CodeBlock>
      <p className="mb-6 text-sm text-slate-600">
        When a student asks for a language that is not allowed for the session, the tutor says so in a sentence and
        carries on with the lesson.
      </p>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Read the list from the API</h2>
      <p className="mb-2 text-sm text-slate-600">
        Languages are added over time, so read the list rather than writing it into your app. The endpoint is public,
        needs no keys, and may be called from a browser.
      </p>
      <CodeBlock language="bash">{`curl ${PORTAL_ORIGIN}${PORTAL_TEXT_FILES.languages}`}</CodeBlock>
      <CodeBlock language="json" title="Response">{JSON.stringify({ languages: [{ code: 'en', label: 'English', english: 'English', firstTopic: 'Solving linear equations' }, { code: '…' }] }, null, 2)}</CodeBlock>
      <p className="text-sm text-slate-600">
        <code className={c}>label</code> is the language&apos;s name in itself, for a picker;{' '}
        <code className={c}>english</code> is its name in English; <code className={c}>firstTopic</code> is a
        starter topic written in the language. The{' '}
        <a href="/docs/package" className="text-blue-600 underline">developer package</a> reads the same list with{' '}
        <code className={c}>tutor.languages()</code>.
      </p>
    </div>
  );
}
