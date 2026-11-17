"use client";

import { useState } from "react";

/**
 * A review note in the history. Long notes (and notes with pasted markup)
 * start closed at a few lines with "Show more"; pasted markup is shown as the
 * table or text it stands for, never as tags.
 */
export function NoteBody({ text, html, long }: { text: string; html: string | null; long: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ks-notebody">
      <div className={`ks-quote${long && !open ? " clamp" : ""}`}>
        {text && <div className="t">{text}</div>}
        {html && <div className="ks-prose ks-pasted" dangerouslySetInnerHTML={{ __html: html }} />}
      </div>
      {long && (
        <button type="button" className="ks-linkbtn" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
