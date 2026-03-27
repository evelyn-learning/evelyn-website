import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { supportedCurricula } from '../../data/curriculum';

export default function ModulesPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Curriculum Modules</h1>
      <p className="mb-8 text-lg text-slate-600">
        Upload your national curriculum so the tutor grounds all instruction in your standards.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-semibold text-slate-900">How It Works</h2>
      <p className="mb-4 text-sm text-slate-600">
        Curriculum modules are structured content packages that tell the tutor what to teach and how.
        When a student starts a session with a <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">curriculum_module</code> parameter,
        the tutor loads that module and uses its concepts, problems, misconceptions, and worked
        examples to guide instruction — grounded in your official syllabus.
      </p>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Upload Methods</h2>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500">Method</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">Endpoint</th>
              <th className="pb-3 font-medium text-slate-500">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-medium text-slate-700">JSON upload</td>
              <td className="py-2.5 pr-4"><code className="text-xs">POST /modules</code></td>
              <td className="py-2.5 text-slate-600">Structured JSON following the module schema</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-medium text-slate-700">PDF ingestion</td>
              <td className="py-2.5 pr-4"><code className="text-xs">POST /modules/ingest</code></td>
              <td className="py-2.5 text-slate-600">Upload curriculum PDFs — our system extracts and structures content automatically</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-medium text-slate-700">Bulk upload</td>
              <td className="py-2.5 pr-4"><code className="text-xs">POST /modules/bulk</code></td>
              <td className="py-2.5 text-slate-600">ZIP archive containing multiple module JSON files</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info">
        JSON modules are available within 15 minutes. PDF ingestion may take up to 2 hours depending
        on document size.
      </Callout>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Module Schema</h2>
      <CodeBlock language="json" title="Example: Algerian BAC Mathematics">{`{
  "id": "algerian-bac-math-2026",
  "subject": "math",
  "level": "11-12",
  "version": "1.0",
  "locale": "ar-DZ",

  "concepts": [
    {
      "id": "complex-numbers",
      "title": "Complex Numbers",
      "title_localized": "الأعداد المركبة",
      "explanation": "A complex number z = a + bi where a is the real part and b is the imaginary part...",
      "misconceptions": [
        {
          "description": "Students confuse i^2 = -1 with i = -1",
          "detection_pattern": "i equals negative one",
          "correction_strategy": "Clarify that i is the square root of -1, so i^2 = -1, but i itself is not -1."
        }
      ]
    }
  ],

  "problems": [
    {
      "id": "complex-add-1",
      "concept_id": "complex-numbers",
      "statement": "Calculate (3 + 2i) + (1 - 4i)",
      "hints": ["Add real parts together, then imaginary parts together"],
      "solution": "4 - 2i",
      "difficulty": "easy"
    }
  ],

  "worked_examples": [
    {
      "id": "complex-multiply-example",
      "concept_id": "complex-numbers",
      "title": "Multiplying complex numbers",
      "steps": [
        { "description": "Apply distributive property (FOIL)", "expression": "(2+3i)(1-i) = 2(1) + 2(-i) + 3i(1) + 3i(-i)" },
        { "description": "Simplify each term", "expression": "= 2 - 2i + 3i - 3i^2" },
        { "description": "Replace i^2 with -1", "expression": "= 2 + i - 3(-1) = 5 + i" }
      ]
    }
  ],

  "system_prompt_additions": "You are tutoring for the Algerian BAC exam. Use formal Arabic mathematical terminology on the whiteboard. When the student speaks in Darja, respond verbally in Darja but write all notation in standard form."
}`}</CodeBlock>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Schema Fields</h2>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="pb-3 pr-4 font-medium text-slate-500">Field</th>
              <th className="pb-3 pr-4 font-medium text-slate-500">Type</th>
              <th className="pb-3 font-medium text-slate-500">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4"><code className="text-xs">id</code></td><td className="py-2.5 pr-4 text-slate-500">string</td><td className="py-2.5 text-slate-600">Unique module identifier</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4"><code className="text-xs">subject</code></td><td className="py-2.5 pr-4 text-slate-500">string</td><td className="py-2.5 text-slate-600">Subject code (math, science, etc.)</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4"><code className="text-xs">level</code></td><td className="py-2.5 pr-4 text-slate-500">string</td><td className="py-2.5 text-slate-600">Grade level</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4"><code className="text-xs">version</code></td><td className="py-2.5 pr-4 text-slate-500">string</td><td className="py-2.5 text-slate-600">Module version for tracking updates</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4"><code className="text-xs">locale</code></td><td className="py-2.5 pr-4 text-slate-500">string</td><td className="py-2.5 text-slate-600">BCP 47 locale code</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4"><code className="text-xs">concepts</code></td><td className="py-2.5 pr-4 text-slate-500">array</td><td className="py-2.5 text-slate-600">Concepts with explanations and misconceptions</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4"><code className="text-xs">problems</code></td><td className="py-2.5 pr-4 text-slate-500">array</td><td className="py-2.5 text-slate-600">Practice problems with hints and solutions</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4"><code className="text-xs">worked_examples</code></td><td className="py-2.5 pr-4 text-slate-500">array</td><td className="py-2.5 text-slate-600">Step-by-step worked solutions</td></tr>
            <tr className="border-b border-slate-100"><td className="py-2.5 pr-4"><code className="text-xs">system_prompt_additions</code></td><td className="py-2.5 pr-4 text-slate-500">string</td><td className="py-2.5 text-slate-600">Extra instructions for the AI tutor (language preferences, exam-specific behavior)</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-slate-900">Supported Curricula</h2>
      <p className="mb-4 text-sm text-slate-600">
        The module system supports any national or regional curriculum. Examples of curricula currently
        in use or validated:
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {supportedCurricula.map((c) => (
          <div key={c.region} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <span className="font-medium text-slate-800">{c.region}</span>
            <span className="text-slate-400"> — </span>
            <span className="text-slate-500">{c.curricula}</span>
          </div>
        ))}
      </div>

      <Callout type="tip" title="Sandbox limits">
        Sandbox environments allow up to 5 module uploads. Production has no limit.
      </Callout>
    </div>
  );
}
