import { keyLine, type Interaction } from "@/lib/keystone/qti-interactions";

type Opt = { label: string; html: string };

function Bank({ items, keyed, ordered, labelled }: { items: Opt[]; keyed?: string[]; ordered?: boolean; labelled?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="ks-bank">
      {items.map((o) => (
        <li key={o.label} className={keyed?.includes(o.label) ? "key" : ""}>
          {labelled && <b>{o.label}</b>}
          <span className="ks-prose" dangerouslySetInnerHTML={{ __html: o.html }} />
        </li>
      ))}
    </Tag>
  );
}

/** Read-only view of one non-choice interaction. Nothing here is interactive. */
export function InteractionView({ i, keys, showKey }: { i: Interaction; keys: Record<string, string[]>; showKey: boolean }) {
  const line = showKey ? keyLine(i, keys) : null;
  const KeyLine = line ? <div className="ks-ix-key">{line}</div> : null;
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
          <span className="ks-ix-label">Match each of the first list with one of the second.</span>
          <div className="ks-match">
            <div>
              <span className="ks-ix-label">Match these</span>
              <Bank items={i.premises} labelled />
            </div>
            <div>
              <span className="ks-ix-label">With these</span>
              <Bank items={i.responses} labelled />
            </div>
          </div>
          {KeyLine}
        </div>
      );
    case "gapMatch":
      return (
        <div className="ks-ix">
          <span className="ks-ix-label">Drag into the {i.gaps.length === 1 ? "blank" : `${i.gaps.length} blanks`}:</span>
          <Bank items={i.choices} />
          {KeyLine}
        </div>
      );
    case "order":
      return (
        <div className="ks-ix">
          <span className="ks-ix-label">Put in order:</span>
          <Bank items={i.choices} ordered />
          {KeyLine}
        </div>
      );
    case "unsupported":
      return <div className="ks-ix"><span className="ks-ix-label">This question uses an interaction we cannot show ({i.element}).</span></div>;
    default:
      return null;
  }
}
