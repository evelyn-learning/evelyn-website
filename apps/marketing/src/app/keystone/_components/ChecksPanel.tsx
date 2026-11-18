import type { RunView } from "@/lib/keystone/queries";
import { pacificTime } from "@/lib/keystone/pipeline/status";

// Evelyn only (the item page renders it only for that role; itemChecks returns null for any other).
// A server component: nothing here is sent to the browser as data, only as this HTML.

const STEP_NAME: Record<string, string> = {
  intake: "Intake",
  course: "Course",
  cause: "Cause of the send-back",
  solve: "Blind solves",
  write: "Writing",
  calc: "Calculations",
  working: "Working check",
  audit: "Rules audit",
  render: "Render check",
};

export function ChecksPanel({ run, itemKey }: { run: RunView | null; itemKey: string }) {
  return (
    <section className="ks-card ks-checks" style={{ marginTop: 16 }}>
      <h2>Checks</h2>
      {!run ? (
        <div className="ks-empty">No pipeline run on this item yet.</div>
      ) : (
        <>
          <p className="ks-sub ks-checks-sum">
            Run {run.result ? <b>{run.result.replace(/_/g, " ")}</b> : <b>not finished</b>}
            {run.startedAt ? ` · ${pacificTime(new Date(run.startedAt))}` : ""} · {run.corrections} correction{run.corrections === 1 ? "" : "s"}
            {run.flags.length ? ` · flags: ${run.flags.join(", ")}` : ""}
            {run.wouldBe ? ` · would have been: ${run.wouldBe}` : ""}
            <small className="ks-checks-int">
              {" "}
              · run {run.runId} · ${run.cost.toFixed(3)}
            </small>
          </p>
          {run.error && <div className="ks-note">Stopped: {run.error}</div>}
          <ol className="ks-checks-steps">
            {run.steps.map((s) => (
              <li key={s.key} className={s.ok ? "pass" : "fail"}>
                <div className="ks-checks-head">
                  <span className="mark" aria-label={s.ok ? "passed" : "failed"}>
                    {s.ok ? "✓" : "✗"}
                  </span>
                  <b>{STEP_NAME[s.step] ?? s.step}</b>
                  {s.key !== `${s.step}#1` && <span className="ks-checks-int">{s.key}</span>}
                  {s.findings && <span className="ks-checks-n">{s.findings.length ? `${s.findings.length} finding${s.findings.length === 1 ? "" : "s"}` : "nothing found"}</span>}
                  {s.model && <small className="ks-checks-int">{s.model}</small>}
                </div>
                {s.failed && <div className="ks-checks-failed">Could not run: {s.failed}</div>}
                {s.solvers && (
                  <div className="ks-checks-solve">
                    {s.solvers.map((x) => (
                      <span key={x.who}>
                        {x.who}: <b>{x.answer}</b>
                        {x.model && <small className="ks-checks-int"> {x.model}</small>}
                      </span>
                    ))}
                    <span>
                      Key: <b>{itemKey}</b>
                    </span>
                    {s.decision && <span>Decision: {s.decision}</span>}
                  </div>
                )}
                {s.findings && s.findings.length > 0 && (
                  <ul className="ks-checks-find">
                    {s.findings.map((f, n) => (
                      <li key={n}>
                        <code>{f.ruleId || f.code}</code>
                        {f.section && <span className="ks-checks-int"> {f.section}</span>} {f.detail}
                        {f.quote && <q>{f.quote}</q>}
                      </li>
                    ))}
                  </ul>
                )}
                {s.raw !== undefined && (
                  <details className="ks-checks-raw">
                    <summary>Raw output</summary>
                    <pre>{s.raw}</pre>
                  </details>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
