import { ArrowHead, C, Label, Layer } from "../_components/figure";
import { Tex } from "../_components/Tex";
import type { FigureProps, Solution } from "../_lib/types";

const r = String.raw;

// Momentum vectors drawn to one scale: 1 px = 20 kg·m/s.
const SCALE = 0.05;
const O = { x: 100, y: 90 };
const E = { x: O.x + 5600 * SCALE, y: O.y }; // tip of car A's momentum (East)
const S = { x: E.x, y: E.y + 5000 * SCALE }; // tip of car B's momentum (South)
const THETA = Math.atan2(5000, 5600);
const ARC = 46;

function Figure({ step, playing }: FigureProps) {
  return (
    <svg viewBox="0 0 520 414" className="block h-auto w-full">
      <defs>
        <ArrowHead id="p234035-blue" color={C.blue} />
        <ArrowHead id="p234035-amber" color={C.amber} />
        <ArrowHead id="p234035-rose" color={C.rose} />
        <ArrowHead id="p234035-muted" color={C.muted} />
      </defs>

      {/* Step 1: the two cars heading for the intersection */}
      <Layer at={0} step={step} playing={playing}>
        <rect x={30} y={72} width={62} height={36} rx={6} fill={C.blueTint} stroke={C.blue} strokeWidth={1.6} />
        <Label x={61} y={95} anchor="middle" fill={C.blue}>A</Label>
        <Label x={30} y={52} fill={C.blue} size={14}>Car A: 400 kg, 14 m/s East</Label>
        <rect x={E.x - 18} y={12} width={36} height={62} rx={6} fill={C.amberTint} stroke={C.amber} strokeWidth={1.6} />
        <Label x={E.x} y={48} anchor="middle" fill={C.amber}>B</Label>
        <Label x={E.x + 28} y={36} fill={C.amber} size={14}>Car B: 500 kg</Label>
        <Label x={E.x + 28} y={54} fill={C.amber} size={14}>10 m/s South</Label>
        {/* compass */}
        <g stroke={C.muted} strokeWidth={1.2}>
          <line x1={62} y1={338} x2={62} y2={392} markerStart="url(#p234035-muted)" />
          <line x1={35} y1={365} x2={89} y2={365} markerEnd="url(#p234035-muted)" />
        </g>
        <Label x={62} y={331} anchor="middle" fill={C.muted} size={12}>N</Label>
        <Label x={95} y={369} fill={C.muted} size={12}>E</Label>
      </Layer>

      {/* Step 2: each car's momentum, tip to tail */}
      <Layer at={1} step={step} playing={playing}>
        <path className="cr-draw" pathLength={1} d={`M${O.x} ${O.y}L${E.x - 4} ${E.y}`} fill="none" stroke={C.blue} strokeWidth={3} markerEnd="url(#p234035-blue)" />
        <Label x={(O.x + E.x) / 2} y={O.y - 10} anchor="middle" fill={C.blue}>5600 kg·m/s East</Label>
        <path className="cr-draw" pathLength={1} d={`M${E.x} ${E.y + 4}L${S.x} ${S.y - 4}`} fill="none" stroke={C.amber} strokeWidth={3} markerEnd="url(#p234035-amber)" />
        <Label x={E.x + 12} y={(E.y + S.y) / 2} fill={C.amber}>5000 kg·m/s</Label>
        <Label x={E.x + 12} y={(E.y + S.y) / 2 + 19} fill={C.amber}>South</Label>
      </Layer>

      {/* Step 3: the total momentum is the diagonal */}
      <Layer at={2} step={step} playing={playing}>
        <path className="cr-draw" pathLength={1} d={`M${O.x} ${O.y}L${S.x - 3} ${S.y - 3}`} fill="none" stroke={C.rose} strokeWidth={3.6} markerEnd="url(#p234035-rose)" />
        <path d={`M${E.x - 14} ${E.y}v14h14`} fill="none" stroke={C.muted} strokeWidth={1.2} />
        <Label x={120} y={270} fill={C.rose}>total: 7507 kg·m/s</Label>
      </Layer>

      {/* Step 4: speed and direction */}
      <Layer at={3} step={step} playing={playing}>
        <path
          d={`M${O.x + ARC} ${O.y}A${ARC} ${ARC} 0 0 1 ${(O.x + ARC * Math.cos(THETA)).toFixed(1)} ${(O.y + ARC * Math.sin(THETA)).toFixed(1)}`}
          fill="none"
          stroke={C.ink}
          strokeWidth={1.6}
        />
        <Label x={O.x + ARC + 5} y={O.y + 26}>42°</Label>
        <Label x={120} y={292} fill={C.rose}>÷ 900 kg = 8.3 m/s</Label>
        <Label x={120} y={314} fill={C.rose}>42° South of East</Label>
      </Layer>
    </svg>
  );
}

export const physics234035: Solution = {
  itemId: "234035",
  subject: "Physics",
  course: "Physics 30",
  itemType: "Multiple choice",
  topic: "Conservation of momentum",
  title: "Two cars collide and stick together",
  question: (
    <>
      <p>
        Two cars approach an intersection. Car A has a mass of 400 kg and is travelling at a velocity of 14 m/s east. Car B has a mass of 500 kg and is travelling at a velocity of 10 m/s south. The two cars collide in the intersection and stick together.
      </p>
      <p>What is the velocity of the two cars after the collision?</p>
    </>
  ),
  options: [
    { label: "A", content: <>8.3 m/s, 42° south of east</>, correct: true },
    { label: "B", content: <>8.3 m/s, 48° south of east</> },
    { label: "C", content: <>11.8 m/s, 42° south of east</> },
    { label: "D", content: <>11.8 m/s, 48° south of east</> },
  ],
  answer: <>A: 8.3 m/s, 42° south of east</>,
  Figure,
  figureAlt:
    "Vector diagram. Car A's momentum of 5600 kg·m/s points east and car B's momentum of 5000 kg·m/s points south. Drawn tip to tail they form a right triangle whose diagonal, 7507 kg·m/s, points 42 degrees south of east.",
  summary: "Total momentum is 7507 kg·m/s at 42° South of East. Shared by 900 kg, that is 8.3 m/s, so the answer is A.",
  steps: [
    {
      title: "Use conservation of momentum",
      caption:
        "The answer is A. Here’s why. The cars stick together, so this is a momentum question. The total momentum just before the collision equals the total momentum just after. And momentum has direction, so we treat it as a vector.",
      body: (
        <>
          <p>In any collision the total momentum just before equals the total momentum just after.</p>
          <p>Momentum is a vector. Car A is moving East and car B is moving South, so their momenta point in different directions and cannot simply be added as numbers.</p>
        </>
      ),
    },
    {
      title: "Find each car’s momentum",
      caption:
        "Momentum is mass times velocity. Car A has 400 times 14, which is 5600 kg·m/s, pointing East. Car B has 500 times 10, which is 5000 kg·m/s, pointing South.",
      body: (
        <>
          <p>
            Car A: <Tex t={r`p_A = (400\ \text{kg})(14\ \text{m/s}) = 5600\ \text{kg·m/s}`} /> East
          </p>
          <p>
            Car B: <Tex t={r`p_B = (500\ \text{kg})(10\ \text{m/s}) = 5000\ \text{kg·m/s}`} /> South
          </p>
        </>
      ),
    },
    {
      title: "Add the two momenta as vectors",
      caption:
        "East and South are at right angles, so the two momenta form a right triangle, and the total is the diagonal. By the Pythagorean theorem, square each side and add them. 5600 squared is 31 360 000. 5000 squared is 25 000 000. Together that’s 56 360 000. Take the square root, and the total momentum is about 7507 kg·m/s.",
      body: (
        <>
          <p>East and South are at right angles, so the two momenta form the legs of a right triangle. The total momentum is the diagonal, the hypotenuse.</p>
          <p>The Pythagorean theorem links the three sides:</p>
          <Tex block t={r`p^2 = p_A^{\,2} + p_B^{\,2}`} />
          <p>Square each momentum and add:</p>
          <Tex block t={r`p^2 = (5600)^2 + (5000)^2 = 31\,360\,000 + 25\,000\,000 = 56\,360\,000`} />
          <p>Take the square root:</p>
          <Tex block t={r`p = \sqrt{56\,360\,000} \approx 7507\ \text{kg·m/s}`} />
        </>
      ),
    },
    {
      title: "Turn momentum back into velocity",
      caption:
        "After the collision the cars move as one object of 900 kg. Divide the total momentum by 900 and you get 8.3 m/s. For the direction, the inverse tangent of 5000 over 5600 gives 42° South of East. That’s option A.",
      body: (
        <>
          <p>After the collision the cars move together as one object with mass 400 + 500 = 900 kg.</p>
          <Tex block t={r`v = \dfrac{7507\ \text{kg·m/s}}{900\ \text{kg}} \approx 8.3\ \text{m/s}`} />
          <p>The direction comes from the same triangle, measured from East toward South:</p>
          <Tex block t={r`\tan\theta = \dfrac{\text{opposite}}{\text{adjacent}} = \dfrac{5000}{5600} \approx 0.893`} />
          <Tex block t={r`\theta = \tan^{-1}(0.893) \approx 41.8^\circ \approx 42^\circ`} />
          <p>
            The velocity is 8.3 m/s at 42° South of East, which is option <strong>A</strong>.
          </p>
        </>
      ),
    },
  ],
};
