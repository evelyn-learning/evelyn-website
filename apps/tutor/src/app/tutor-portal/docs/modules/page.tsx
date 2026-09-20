import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

export default function ModulesPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Your Curriculum</h1>
      <p className="mb-8 text-lg text-slate-600">
        Send your own lesson, assignment or syllabus excerpt and the tutor teaches that, Socratically,
        without handing out answers.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">Two ways to choose what the tutor teaches</h2>
      <ol className="mb-6 list-decimal space-y-2 pl-5 text-sm text-slate-600">
        <li>
          <strong>Our catalog.</strong> Put <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">subject</code>,{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">level</code> and a{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">topic</code> in the token. The tutor picks or
          builds a lesson on that topic from our 1,000+ K-12 plans.
        </li>
        <li>
          <strong>Your material.</strong> Call <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">POST /plan-generate</code>{' '}
          with the text, PDF, Word file or photo of your lesson or assignment. Store the returned{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">planId</code> and put it in the token as{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">curriculum_module</code>. The session is locked to that plan.
        </li>
      </ol>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">POST /plan-generate</h2>
      <CodeBlock language="json" title="Request">{`{
  "text": "Assignment 3 — Ratios and unit rates. 1) A recipe uses 3 cups of flour for 2 cups of sugar …",
  "subject": "math",
  "grade": "Grade 6",
  "topic": "Ratios and unit rates",
  "sessionMinutes": 30,
  "studentId": "stu_abc123",
  "materials": [
    { "kind": "pdf", "name": "assignment-3.pdf", "mimeType": "application/pdf", "data": "<base64>" }
  ]
}`}</CodeBlock>
      <ul className="mb-6 space-y-1 text-sm text-slate-600">
        <li><code className="text-xs">text</code> — 3 to 8,000 characters. Required even when you attach files (a title or summary is enough).</li>
        <li><code className="text-xs">materials</code> — up to 4 files, <code className="text-xs">kind</code> ∈ pdf, docx, image, text; ≤ 8 MB each, base64 without a data: prefix.</li>
        <li><code className="text-xs">studentId</code> — optional; when present the plan adapts to that student&apos;s known gaps.</li>
        <li><code className="text-xs">sessionMinutes</code> — target length, 5 to 120.</li>
      </ul>

      <CodeBlock language="json" title="Response">{`{
  "planId": "plan_8f3a…",
  "title": "Ratios and unit rates — Assignment 3",
  "mode": "full",
  "los": [
    { "id": "ratio.write", "description": "Write a ratio in three forms" },
    { "id": "ratio.unit-rate", "description": "Compute a unit rate from a ratio" }
  ],
  "maxPickableLos": 5,
  "estimatedMinutes": 28,
  "generatorOk": true,
  "cached": false
}`}</CodeBlock>

      <Callout type="info" title="mode: picker">
        If the material contains more objectives than the session can hold, the response comes back
        with <code>mode: &quot;picker&quot;</code>. Choose up to <code>maxPickableLos</code> of the{' '}
        <code>los</code> (or let the student choose) and call <code>POST /plan-expand</code> with{' '}
        <code>{'{ planId, pickedLoIds }'}</code>. The session may start while expansion finishes.
      </Callout>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Then lock the session to it</h2>
      <CodeBlock language="json" title="Token claims">{`{
  "partner_id": "kanzoo",
  "student_id": "stu_abc123",
  "subject": "math",
  "level": "Grade 6",
  "curriculum_module": "plan_8f3a…",
  "target_kind": "lessonNode",
  "session_goal": "homework-help",
  "teacher": { "...": "persona from the catalog" }
}`}</CodeBlock>
      <p className="mb-6 text-sm text-slate-600">
        The tutor works through the plan&apos;s objectives with a hook, a concept, a worked example,
        try-yourself questions and a recap. With{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">session_goal: &quot;homework-help&quot;</code>{' '}
        it guides the student toward each answer with hints and questions instead of giving it.
      </p>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Recommended assignment flow</h2>
      <ol className="mb-6 list-decimal space-y-2 pl-5 text-sm text-slate-600">
        <li>A teacher publishes an assignment in your LMS.</li>
        <li>Your backend calls <code className="text-xs">plan-generate</code> once with the assignment and stores <code className="text-xs">planId</code> on the assignment.</li>
        <li>Every student&apos;s token for that assignment carries <code className="text-xs">curriculum_module: planId</code>.</li>
        <li>After the session, pull <code className="text-xs">/gaps</code>, <code className="text-xs">/mastery</code> and <code className="text-xs">/assigned-practice</code> to show progress and follow-up work.</li>
      </ol>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Related</h2>
      <ul className="space-y-1 text-sm text-slate-600">
        <li><code className="text-xs">POST /review-plan</code> — a remediation plan from a student&apos;s weak objectives.</li>
        <li><code className="text-xs">POST /taxonomy-generate</code> — a draft objective graph from a course outline, for whole-course setups.</li>
        <li><code className="text-xs">POST /practice</code> and <code className="text-xs">POST /grade</code> — practice items with answer keys, and rubric grading of free responses.</li>
      </ul>
    </div>
  );
}
