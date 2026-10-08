import { C, Label, Layer, V } from "../_components/figure";
import { Tex } from "../_components/Tex";
import type { FigureProps, Solution } from "../_lib/types";

const r = String.raw;

// Both sides of the equation drawn as graphs on one pair of axes.
const X = (x: number) => 50 + (x + 4) * 50;
const Y = (y: number) => 30 + (10 - y) * 26;
const left = (x: number) => 3 * Math.sqrt(x + 3);
const right = (x: number) => 2 * x + 1;

function curve() {
  let d = "";
  for (let x = -3; x <= 5 + 1e-9; x += 0.02) d += `${d ? "L" : "M"}${X(x).toFixed(1)} ${Y(left(x)).toFixed(1)}`;
  return d;
}
const CURVE = curve();
const LINE = `M${X(-2.5)} ${Y(right(-2.5))}L${X(4.5)} ${Y(right(4.5))}`;
const minus = (v: number) => (v < 0 ? `−${-v}` : `${v}`);

function Figure({ step, playing }: FigureProps) {
  const xs = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const ys = [-4, -2, 0, 2, 4, 6, 8, 10];
  return (
    <svg viewBox="0 0 520 414" className="block h-auto w-full">
      {xs.map((x) => <line key={`gx${x}`} x1={X(x)} y1={30} x2={X(x)} y2={394} stroke={C.grid} />)}
      {ys.map((y) => <line key={`gy${y}`} x1={50} y1={Y(y)} x2={500} y2={Y(y)} stroke={C.grid} />)}
      <line x1={50} y1={Y(0)} x2={500} y2={Y(0)} stroke={C.ink} strokeWidth={1.4} />
      <line x1={X(0)} y1={30} x2={X(0)} y2={394} stroke={C.ink} strokeWidth={1.4} />
      {xs.filter((x) => x !== 0).map((x) => (
        <Label key={`tx${x}`} x={X(x)} y={Y(0) + 16} anchor="middle" fill={C.muted} size={12} weight={500}>{minus(x)}</Label>
      ))}
      {ys.filter((y) => y !== 0).map((y) => (
        <Label key={`ty${y}`} x={X(0) - 7} y={Y(y) + 4} anchor="end" fill={C.muted} size={12} weight={500}>{minus(y)}</Label>
      ))}
      <Label x={506} y={Y(0) + 4} fill={C.muted} size={13} weight={500}><V>x</V></Label>
      <Label x={X(0)} y={22} anchor="middle" fill={C.muted} size={13} weight={500}><V>y</V></Label>

      {/* Step 1: each side of the equation as its own graph */}
      <Layer at={0} step={step} playing={playing}>
        <path className="cr-draw" pathLength={1} d={CURVE} fill="none" stroke={C.blue} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <path className="cr-draw" pathLength={1} d={LINE} fill="none" stroke={C.amber} strokeWidth={2.6} strokeLinecap="round" />
        <Label x={X(-2.8)} y={Y(6.6)} fill={C.blue}>left side: 3√(<V>x</V> + 3)</Label>
        <Label x={X(4.15) - 12} y={Y(9.3)} anchor="end" fill={C.amber}>right side: 2<V>x</V> + 1</Label>
      </Layer>

      {/* Step 3: the two candidates from the quadratic */}
      <Layer at={2} step={step} playing={playing}>
        <line x1={X(-2)} y1={Y(right(-2))} x2={X(-2)} y2={Y(left(-2))} stroke={C.muted} strokeWidth={1.6} strokeDasharray="6 5" />
        <line x1={X(3.25)} y1={Y(0)} x2={X(3.25)} y2={Y(7.5)} stroke={C.muted} strokeWidth={1.6} strokeDasharray="6 5" />
        <Label x={X(-2) - 8} y={Y(0) + 34} anchor="end" fill={C.ink} size={14}><V>x</V> = −2</Label>
        <Label x={X(3.25)} y={Y(0) + 34} anchor="middle" fill={C.ink} size={14}><V>x</V> = 3.25</Label>
      </Layer>

      {/* Step 4: only one candidate makes the two sides equal */}
      <Layer at={3} step={step} playing={playing}>
        <circle cx={X(3.25)} cy={Y(7.5)} r={7} fill={C.green} />
        <Label x={X(3.25) - 12} y={Y(7.5) - 9} anchor="end" fill={C.green}>both sides = 7.5</Label>
        <circle cx={X(-2)} cy={Y(3)} r={5.5} fill={C.surface} stroke={C.rose} strokeWidth={2.4} />
        <circle cx={X(-2)} cy={Y(-3)} r={5.5} fill={C.surface} stroke={C.rose} strokeWidth={2.4} />
        <Label x={X(-2) - 11} y={Y(3) - 8} anchor="end" fill={C.rose} size={14}>left = 3</Label>
        <Label x={X(-2) - 12} y={Y(-3) + 5} anchor="end" fill={C.rose} size={14}>right = −3</Label>
      </Layer>
    </svg>
  );
}

export const math286312: Solution = {
  itemId: "286312",
  subject: "Mathematics",
  course: "Math 30-1",
  itemType: "Numerical response",
  topic: "Radical equations",
  title: "Solve the radical equation",
  independent: true,
  question: (
    <p>
      The solution to <Tex t={r`3\sqrt{x+3}=2x+1`} />, rounded to the nearest <strong>hundredth</strong>, is ______.
    </p>
  ),
  options: [],
  answer: <Tex t={r`x = 3.25`} />,
  Figure,
  figureAlt:
    "Graphs of y = 3 times the square root of (x + 3) and y = 2x + 1. They cross once, at x = 3.25, where both equal 7.5. At x = -2 the first graph is at 3 and the second at -3, so they do not meet there.",
  summary: "Squaring gives two candidates, 3.25 and −2. Only 3.25 makes both sides equal, so the answer is 3.25.",
  steps: [
    {
      title: "Square both sides",
      caption:
        "The answer is 3.25. Here’s how to get it. The radical is already alone on the left side, so square both sides. That gives 9 times x + 3 on the left, and 2x + 1, all squared, on the right.",
      body: (
        <>
          <p>The square root is already by itself on the left, so squaring both sides removes it.</p>
          <Tex block t={r`\left(3\sqrt{x+3}\right)^2 = (2x+1)^2`} />
          <Tex block t={r`9(x+3) = (2x+1)^2`} />
        </>
      ),
    },
    {
      title: "Expand and collect into a quadratic",
      caption:
        "Now expand. The left side becomes 9x + 27. The right side becomes 4x² + 4x + 1. Move everything to one side, and you get 4x² − 5x − 26 = 0.",
      body: (
        <>
          <Tex block t={r`9x + 27 = 4x^2 + 4x + 1`} />
          <p>Subtract <Tex t={r`9x + 27`} /> from both sides:</p>
          <Tex block t={r`0 = 4x^2 - 5x - 26`} />
        </>
      ),
    },
    {
      title: "Solve the quadratic",
      caption: "This quadratic factors into 4x − 13, times x + 2. So x is 13 over 4, which is 3.25, or x is −2.",
      body: (
        <>
          <Tex block t={r`4x^2 - 5x - 26 = (4x - 13)(x + 2) = 0`} />
          <p>
            So <Tex t={r`x = \tfrac{13}{4} = 3.25`} /> or <Tex t={r`x = -2`} />.
          </p>
          <p>The quadratic formula gives the same two values.</p>
        </>
      ),
    },
    {
      title: "Check both values in the original equation",
      caption:
        "Squaring both sides can create a solution that doesn’t really work, so check both in the original equation. With 3.25, both sides equal 7.5, so it works. With −2, the left side is 3 but the right side is −3, so it fails. The solution is 3.25.",
      body: (
        <>
          <p>Squaring both sides can introduce a value that does not satisfy the original equation, so each one has to be checked.</p>
          <p>
            <Tex t={r`x = 3.25`} />: left side <Tex t={r`3\sqrt{6.25} = 7.5`} />, right side <Tex t={r`2(3.25)+1 = 7.5`} />. Equal, so it is a solution.
          </p>
          <p>
            <Tex t={r`x = -2`} />: left side <Tex t={r`3\sqrt{1} = 3`} />, right side <Tex t={r`2(-2)+1 = -3`} />. Not equal, so it is extraneous.
          </p>
          <p>
            The solution is <Tex t={r`x = 3.25`} />.
          </p>
        </>
      ),
    },
  ],
};
