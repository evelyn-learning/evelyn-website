import katex from "katex";
import "katex/dist/katex.min.css";

/** Inline maths. Pass TeX with String.raw so backslashes survive. */
export function Tex({ t, block = false }: { t: string; block?: boolean }) {
  const html = katex.renderToString(t, { throwOnError: false, displayMode: block });
  return <span className={block ? "block overflow-x-auto py-1" : undefined} dangerouslySetInnerHTML={{ __html: html }} />;
}
