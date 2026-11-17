import type { Interaction } from "@/lib/keystone/qti-interactions";

type Opt = { label: string; html: string };

function Bank({ items, keyed, ordered }: { items: Opt[]; keyed?: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="ks-bank">
      {items.map((o) => (
        <li key={o.label} className={keyed?.includes(o.label) ? "key" : ""}>
          <span className="ks-prose" dangerouslySetInnerHTML={{ __html: o.html }} />
        </li>
      ))}
    </Tag>
  );
}

/** Read-only view of one non-choice interaction. Nothing here is interactive. */
export function InteractionView({ i, keys }: { i: Interaction; keys: Record<string, string[]> }) {
  switch (i.kind) {
    case "textEntry":
      return <div className="ks-ix"><span className="ks-ix-label">Answer is typed into the blank.</span></div>;
    case "extendedText":
      return <div className="ks-ix"><span className="ks-ix-label">Written response: the student writes an answer in a text box.</span></div>;
    case "inlineChoice":
      return (
        <div className="ks-ix">
          <span className="ks-ix-label">Drop-down choices for the blank:</span>
          <Bank items={i.choices} keyed={keys[i.responseId]} />
        </div>
      );
    case "match":
      return (
        <div className="ks-ix">
          <span className="ks-ix-label">Match each item on the left with one on the right.</span>
          <table className="ks-match">
            <thead>
              <tr>
                <th>Match these</th>
                <th>With these</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(i.premises.length, i.responses.length) }, (_, r) => (
                <tr key={r}>
                  <td dangerouslySetInnerHTML={{ __html: i.premises[r]?.html ?? "" }} />
                  <td dangerouslySetInnerHTML={{ __html: i.responses[r]?.html ?? "" }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "gapMatch":
      return (
        <div className="ks-ix">
          <span className="ks-ix-label">Drag into the {i.gaps.length === 1 ? "blank" : `${i.gaps.length} blanks`}:</span>
          <Bank items={i.choices} />
        </div>
      );
    case "order":
      return (
        <div className="ks-ix">
          <span className="ks-ix-label">Put in order:</span>
          <Bank items={i.choices} ordered />
        </div>
      );
    case "unsupported":
      return <div className="ks-ix"><span className="ks-ix-label">This question uses an interaction we cannot show ({i.element}).</span></div>;
    default:
      return null;
  }
}
