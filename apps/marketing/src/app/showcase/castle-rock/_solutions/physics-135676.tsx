import { ArrowHead, C, Label, Layer, V } from "../_components/figure";
import { Tex } from "../_components/Tex";
import type { FigureProps, Solution } from "../_lib/types";

const r = String.raw;

// Schematic, not to scale: the real pattern is a few millimetres tall on a screen a metre away.
const SLITS_X = 150;
const SCREEN_X = 420;
const MID = 205;
const GAP = 50; // spacing between neighbouring bright fringes in the drawing
const FRINGES = [-2, -1, 0, 1, 2];

function Figure({ step, playing }: FigureProps) {
  return (
    <svg viewBox="0 0 520 414" className="block h-auto w-full">
      <defs>
        <ArrowHead id="p135676-muted" color={C.muted} />
        <ArrowHead id="p135676-rose" color={C.rose} />
      </defs>

      {/* Step 1: the set-up and what is known */}
      <Layer at={0} step={step} playing={playing}>
        <g stroke={C.ink} strokeWidth={4} strokeLinecap="round">
          <line x1={SLITS_X} y1={40} x2={SLITS_X} y2={MID - 14} />
          <line x1={SLITS_X} y1={MID - 6} x2={SLITS_X} y2={MID + 6} />
          <line x1={SLITS_X} y1={MID + 14} x2={SLITS_X} y2={370} />
          <line x1={SCREEN_X} y1={40} x2={SCREEN_X} y2={370} />
        </g>
        <Label x={SLITS_X} y={30} anchor="middle" fill={C.muted} size={13} weight={500}>two slits</Label>
        <Label x={SCREEN_X} y={30} anchor="middle" fill={C.muted} size={13} weight={500}>screen</Label>
        <path d={`M${SLITS_X - 10} ${MID - 10}h-8v20h8`} fill="none" stroke={C.muted} strokeWidth={1.4} />
        <Label x={SLITS_X - 24} y={MID + 5} anchor="end" size={14}><V>d</V> = 4.24 × 10⁻⁴ m</Label>
        <line x1={SLITS_X + 4} y1={390} x2={SCREEN_X - 4} y2={390} stroke={C.muted} strokeWidth={1.4} markerStart="url(#p135676-muted)" markerEnd="url(#p135676-muted)" />
        <Label x={(SLITS_X + SCREEN_X) / 2} y={408} anchor="middle" size={14}><V>l</V> = 1.00 m</Label>
      </Layer>

      {/* Step 2: bright fringes, counted from the centre */}
      <Layer at={1} step={step} playing={playing}>
        <line x1={SLITS_X} y1={MID} x2={SCREEN_X} y2={MID} stroke={C.muted} strokeWidth={1.2} strokeDasharray="5 5" />
        {FRINGES.map((n) => (
          <g key={n}>
            <rect x={SCREEN_X + 5} y={MID - n * GAP - 9} width={20} height={18} rx={4} fill={n === 2 ? C.amber : C.amberTint} stroke={C.amber} strokeWidth={1.4} />
            {n >= 0 && <Label x={SCREEN_X + 32} y={MID - n * GAP + 5} fill={C.amber} size={14}><V>n</V> = {n}</Label>}
          </g>
        ))}
        <g fill="none" stroke={C.blue} strokeWidth={1.6}>
          <path className="cr-draw" pathLength={1} d={`M${SLITS_X} ${MID - 10}L${SCREEN_X} ${MID - 2 * GAP}`} />
          <path className="cr-draw" pathLength={1} d={`M${SLITS_X} ${MID + 10}L${SCREEN_X} ${MID - 2 * GAP}`} />
        </g>
      </Layer>

      {/* Step 3: the measured distance on the screen */}
      <Layer at={2} step={step} playing={playing}>
        <line x1={SCREEN_X - 14} y1={MID - 3} x2={SCREEN_X - 14} y2={MID - 2 * GAP + 3} stroke={C.rose} strokeWidth={2} markerStart="url(#p135676-rose)" markerEnd="url(#p135676-rose)" />
        <Label x={SCREEN_X - 24} y={MID - 18} anchor="end" fill={C.rose} size={14}><V>x</V> = 2.35 mm</Label>
      </Layer>

      {/* Step 4: the result */}
      <Layer at={3} step={step} playing={playing}>
        <Label x={SLITS_X + 16} y={78} fill={C.green}><V>λ</V> = 4.98 × 10⁻⁷ m</Label>
      </Layer>
    </svg>
  );
}

export const physics135676: Solution = {
  itemId: "135676",
  subject: "Physics",
  course: "Physics 30",
  itemType: "Numerical response",
  topic: "Double-slit interference",
  title: "Wavelength from a double-slit pattern",
  independent: true,
  question: (
    <p>
      A screen with two small slits, separated <Tex t={r`4.24\times10^{-4}\ \text{m}`} /> apart, is located 1.00 m from a solid screen. If the distance between the central fringe and the second fringe that appear on the solid screen is 2.35 mm, the wavelength of light creating this interference pattern must be <Tex t={r`a.bc\times10^{-d}\ \text{m}`} />. The values of <Tex t="a" />, <Tex t="b" />, <Tex t="c" />, and <Tex t="d" /> are ____, ____, ____, and ____.
    </p>
  ),
  options: [],
  answer: <>4, 9, 8, 7 &ensp;(<Tex t={r`\lambda = 4.98\times10^{-7}\ \text{m}`} />)</>,
  Figure,
  figureAlt:
    "Schematic of a double-slit experiment. Two slits 4.24 times 10 to the minus 4 metres apart face a screen 1.00 metre away. Bright fringes on the screen are numbered from the centre, n = 0, 1, 2, and the second fringe is 2.35 millimetres from the centre.",
  summary: "The wavelength is 4.98 × 10⁻⁷ m, so a, b, c and d are 4, 9, 8 and 7.",
  steps: [
    {
      title: "List what the question gives",
      caption:
        "The answers are 4, 9, 8 and 7, because the wavelength is 4.98 × 10⁻⁷ m. Here’s how. Start by listing what we know. The slit separation, d, is 4.24 × 10⁻⁴ m. The distance to the screen, l, is 1.00 m. And the second fringe is 2.35 mm from the centre, so n is 2.",
      body: (
        <>
          <p>Slit separation: <Tex t={r`d = 4.24\times10^{-4}\ \text{m}`} /></p>
          <p>Distance from the slits to the screen: <Tex t={r`l = 1.00\ \text{m}`} /></p>
          <p>Distance from the central fringe to the second fringe: <Tex t={r`x = 2.35\ \text{mm}`} /></p>
          <p>Fringe number: it is the second fringe out from the centre, so <Tex t={r`n = 2`} />.</p>
        </>
      ),
    },
    {
      title: "Choose the equation and match the units",
      caption:
        "For a double-slit pattern, the wavelength equals x times d, divided by n times l. Before we substitute, convert x into metres. 2.35 mm is 2.35 × 10⁻³ m.",
      body: (
        <>
          <p>For a double-slit pattern where the fringes are close to the centre:</p>
          <Tex block t={r`\lambda = \dfrac{x\,d}{n\,l}`} />
          <p>Every length must be in metres, so convert the fringe distance:</p>
          <Tex block t={r`x = 2.35\ \text{mm} = 2.35\times10^{-3}\ \text{m}`} />
        </>
      ),
    },
    {
      title: "Substitute and calculate",
      caption:
        "Now substitute. On top, 2.35 × 10⁻³ times 4.24 × 10⁻⁴ gives 9.964 × 10⁻⁷. On the bottom, 2 times 1.00 is 2.00. Divide, and the wavelength is 4.98 × 10⁻⁷ m. That’s about 500 nanometres, which is visible light, so the answer is sensible.",
      body: (
        <>
          <Tex block t={r`\lambda = \dfrac{(2.35\times10^{-3}\ \text{m})(4.24\times10^{-4}\ \text{m})}{(2)(1.00\ \text{m})}`} />
          <p>Numerator: <Tex t={r`2.35 \times 4.24 = 9.964`} />, and <Tex t={r`10^{-3}\times10^{-4} = 10^{-7}`} />, giving <Tex t={r`9.964\times10^{-7}\ \text{m}^2`} />.</p>
          <p>Denominator: <Tex t={r`2 \times 1.00\ \text{m} = 2.00\ \text{m}`} />.</p>
          <Tex block t={r`\lambda = \dfrac{9.964\times10^{-7}\ \text{m}^2}{2.00\ \text{m}} = 4.982\times10^{-7}\ \text{m} \approx 4.98\times10^{-7}\ \text{m}`} />
          <p>That is about 498 nm, in the visible range, so the size of the answer makes sense.</p>
        </>
      ),
    },
    {
      title: "Record the four digits",
      caption:
        "The question wants the form a.bc × 10 to the negative d. Our value is 4.98 × 10⁻⁷. So a is 4, b is 9, c is 8, and d is 7.",
      body: (
        <>
          <p>
            Match <Tex t={r`4.98\times10^{-7}\ \text{m}`} /> to the form <Tex t={r`a.bc\times10^{-d}\ \text{m}`} />:
          </p>
          <p>
            <Tex t={r`a = 4,\quad b = 9,\quad c = 8,\quad d = 7`} />
          </p>
          <p>The recorded answer is 4987.</p>
        </>
      ),
    },
  ],
};
