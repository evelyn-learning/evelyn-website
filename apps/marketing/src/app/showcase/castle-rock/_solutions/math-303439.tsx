import { C, Label, Layer, V } from "../_components/figure";
import { Tex } from "../_components/Tex";
import type { FigureProps, Solution } from "../_lib/types";

const r = String.raw;

// Every mark on the graph is placed with these two scale functions.
const X = (x: number) => 40 + (x + 4) * 57.5;
const Y = (y: number) => 20 + (12 - y) * 20;
const f = (x: number) => (5 * x + 2) / (2 * x - 1);

function branch(a: number, b: number) {
  let d = "";
  let pen = false;
  for (let x = a; x <= b + 1e-9; x += 0.01) {
    const y = f(x);
    if (y > 12.5 || y < -7.5) continue;
    d += `${pen ? "L" : "M"}${X(x).toFixed(1)} ${Y(y).toFixed(1)}`;
    pen = true;
  }
  return d;
}

const LEFT = branch(-4, 0.49);
const RIGHT = branch(0.51, 4);
const NEGATIVE = branch(-0.4, 0.49);
const minus = (v: number) => (v < 0 ? `−${-v}` : `${v}`);

function Figure({ step, playing }: FigureProps) {
  const xs = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const ys = [-6, -4, -2, 0, 2, 4, 6, 8, 10, 12];
  return (
    <svg viewBox="0 0 520 414" className="block h-auto w-full">
      <defs>
        <clipPath id="m303439-area">
          <rect x="40" y="20" width="460" height="380" />
        </clipPath>
      </defs>
      {xs.map((x) => <line key={`gx${x}`} x1={X(x)} y1={20} x2={X(x)} y2={400} stroke={C.grid} />)}
      {ys.map((y) => <line key={`gy${y}`} x1={40} y1={Y(y)} x2={500} y2={Y(y)} stroke={C.grid} />)}

      <Layer at={0} step={step} playing={playing}>
        <rect x={40} y={Y(0)} width={460} height={Y(-7) - Y(0)} fill={C.roseTint} />
        <Label x={50} y={390} fill={C.rose}>below the <V>x</V>-axis: <V>f</V>(<V>x</V>) &lt; 0</Label>
      </Layer>

      <line x1={40} y1={Y(0)} x2={500} y2={Y(0)} stroke={C.ink} strokeWidth={1.4} />
      <line x1={X(0)} y1={20} x2={X(0)} y2={400} stroke={C.ink} strokeWidth={1.4} />
      {xs.filter((x) => x !== 0).map((x) => (
        <Label key={`tx${x}`} x={X(x)} y={Y(0) + 16} anchor="middle" fill={C.muted} size={12} weight={500}>{minus(x)}</Label>
      ))}
      {[-6, -4, -2, 2, 4, 6, 8, 10, 12].map((y) => (
        <Label key={`ty${y}`} x={X(0) - 7} y={Y(y) + 4} anchor="end" fill={C.muted} size={12} weight={500}>{minus(y)}</Label>
      ))}
      <Label x={504} y={Y(0) + 4} fill={C.muted} size={13} weight={500}><V>x</V></Label>
      <Label x={X(0)} y={13} anchor="middle" fill={C.muted} size={13} weight={500}><V>y</V></Label>

      <Layer at={1} step={step} playing={playing}>
        <line x1={X(0.5)} y1={20} x2={X(0.5)} y2={400} stroke={C.muted} strokeWidth={1.6} strokeDasharray="6 5" />
        <Label x={X(0.5) + 8} y={393} fill={C.muted}><V>x</V> = 1/2</Label>
        <line x1={X(-0.4) - 2} y1={Y(0) + 6} x2={X(-0.4) - 8} y2={Y(0) + 26} stroke={C.muted} />
        <circle cx={X(-0.4)} cy={Y(0)} r={5} fill={C.ink} />
        <Label x={X(-0.4) - 12} y={Y(0) + 40} anchor="end"><V>x</V> = {"−"}2/5</Label>
      </Layer>

      <Layer at={2} step={step} playing={playing}>
        <g clipPath="url(#m303439-area)" fill="none" stroke={C.blue} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
          <path className="cr-draw" pathLength={1} d={LEFT} />
          <path className="cr-draw" pathLength={1} d={RIGHT} />
        </g>
        <circle cx={X(-1)} cy={Y(1)} r={4.5} fill={C.blue} />
        <Label x={X(-1) - 6} y={Y(1) - 26} anchor="end" fill={C.blue}><V>f</V>({"−"}1) = 1</Label>
        <circle cx={X(0)} cy={Y(-2)} r={4.5} fill={C.blue} />
        <Label x={X(0) - 8} y={Y(-2) + 25} anchor="end" fill={C.blue}><V>f</V>(0) = {"−"}2</Label>
        <circle cx={X(1)} cy={Y(7)} r={4.5} fill={C.blue} />
        <Label x={X(1) + 9} y={Y(7) + 4} fill={C.blue}><V>f</V>(1) = 7</Label>
      </Layer>

      <Layer at={3} step={step} playing={playing}>
        <g clipPath="url(#m303439-area)">
          <path className="cr-draw" pathLength={1} d={NEGATIVE} fill="none" stroke={C.rose} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <line x1={X(-0.4)} y1={Y(0)} x2={X(0.5)} y2={Y(0)} stroke={C.rose} strokeWidth={4.5} strokeLinecap="round" />
        <circle cx={X(-0.4)} cy={Y(0)} r={5.5} fill={C.surface} stroke={C.rose} strokeWidth={2.4} />
        <circle cx={X(0.5)} cy={Y(0)} r={5.5} fill={C.surface} stroke={C.rose} strokeWidth={2.4} />
        <Label x={X(0.5) + 14} y={Y(-4) + 5} fill={C.rose}>negative for</Label>
        <Label x={X(0.5) + 14} y={Y(-4) + 25} fill={C.rose}>{"−"}2/5 &lt; <V>x</V> &lt; 1/2</Label>
      </Layer>
    </svg>
  );
}

export const math303439: Solution = {
  itemId: "303439",
  subject: "Mathematics",
  course: "Math 30-1",
  itemType: "Multiple choice",
  topic: "Rational functions",
  title: "Where is the graph negative?",
  question: (
    <p>
      The graph of <Tex t={r`f(x)=\dfrac{5x+2}{2x-1}`} /> is negative in which interval?
    </p>
  ),
  options: [
    { label: "A", content: <Tex t={r`x>\tfrac12`} /> },
    { label: "B", content: <Tex t={r`-\tfrac12<x<\tfrac25`} /> },
    { label: "C", content: <Tex t={r`x<-\tfrac25`} /> },
    { label: "D", content: <Tex t={r`-\tfrac25<x<\tfrac12`} />, correct: true },
  ],
  answer: <>D: <Tex t={r`-\tfrac25<x<\tfrac12`} /></>,
  Figure,
  figureAlt:
    "Graph of f(x) = (5x+2)/(2x-1). It crosses the x-axis at x = -2/5, has a vertical asymptote at x = 1/2, and lies below the x-axis between those two values.",
  summary: "The graph is below the x-axis between x = −2/5 and x = 1/2, so the answer is D.",
  steps: [
    {
      title: "Turn “negative” into something you can see",
      caption:
        "The answer is D. Here’s why. The question asks where the graph is negative. Negative just means below the x-axis, so we want the x-values where f(x) < 0.",
      body: (
        <p>
          A graph is negative wherever it sits <strong className="text-[#cf2f68]">below the x-axis</strong>. So the question is really asking: for which values of <Tex t="x" /> is <Tex t={r`f(x)<0`} />?
        </p>
      ),
    },
    {
      title: "Find the two places the sign can change",
      caption:
        "A fraction can only change sign where its top or its bottom is zero. The top is zero at x = −2/5, where the graph crosses the axis. The bottom is zero at x = 1/2, which gives a vertical asymptote.",
      body: (
        <>
          <p>A fraction can only switch between positive and negative where its top or its bottom equals zero.</p>
          <p>
            Top: <Tex t={r`5x+2=0`} /> gives <Tex t={r`x=-\tfrac25`} />. The graph crosses the x-axis here.
          </p>
          <p>
            Bottom: <Tex t={r`2x-1=0`} /> gives <Tex t={r`x=\tfrac12`} />. The function is undefined here, so the graph has a vertical asymptote.
          </p>
        </>
      ),
    },
    {
      title: "Test one value in each region",
      caption:
        "Those two values split the number line into three regions, so let’s test a number in each. At x = −1, f is +1. At 0, it’s −2. And at 1, it’s +7. Only the middle region is negative.",
      body: (
        <>
          <p>Those two values split the number line into three regions. Pick any easy number in each one and check the signs.</p>
          <div className="my-2 overflow-x-auto">
            <table className="border-collapse text-[15px] [&_td]:whitespace-nowrap [&_td]:border-b [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-1.5 [&_td]:text-center [&_th]:border-b [&_th]:border-slate-200 [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-[13px] [&_th]:font-semibold [&_th]:text-slate-500">
              <thead>
                <tr>
                  <th className="!pl-0 text-left">Region</th>
                  <th>Test</th>
                  <th><Tex t={r`5x+2`} /></th>
                  <th><Tex t={r`2x-1`} /></th>
                  <th><Tex t={r`f(x)`} /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="!pl-0 !text-left"><Tex t={r`x<-\tfrac25`} /></td>
                  <td><Tex t={r`x=-1`} /></td>
                  <td><Tex t={r`-3`} /></td>
                  <td><Tex t={r`-3`} /></td>
                  <td className="font-semibold text-[#177a50]"><Tex t={r`+1`} /></td>
                </tr>
                <tr className="bg-[rgba(207,47,104,0.09)]">
                  <td className="!pl-0 !text-left"><Tex t={r`-\tfrac25<x<\tfrac12`} /></td>
                  <td><Tex t={r`x=0`} /></td>
                  <td><Tex t={r`+2`} /></td>
                  <td><Tex t={r`-1`} /></td>
                  <td className="font-semibold text-[#cf2f68]"><Tex t={r`-2`} /></td>
                </tr>
                <tr>
                  <td className="!pl-0 !text-left"><Tex t={r`x>\tfrac12`} /></td>
                  <td><Tex t={r`x=1`} /></td>
                  <td><Tex t={r`+7`} /></td>
                  <td><Tex t={r`+1`} /></td>
                  <td className="font-semibold text-[#177a50]"><Tex t={r`+7`} /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>A negative divided by a negative is positive, so only the middle region comes out below zero.</p>
        </>
      ),
    },
    {
      title: "Read off the interval",
      caption: "So the graph is negative between −2/5 and 1/2, with neither end included. That’s option D.",
      body: (
        <>
          <p>
            The graph is negative for <span className="text-[#cf2f68]"><Tex t={r`-\tfrac25<x<\tfrac12`} /></span>, which is option <strong>D</strong>.
          </p>
          <p>
            Neither end is included. At <Tex t={r`x=-\tfrac25`} /> the function equals zero, which is not negative, and at <Tex t={r`x=\tfrac12`} /> it does not exist.
          </p>
        </>
      ),
    },
  ],
};
