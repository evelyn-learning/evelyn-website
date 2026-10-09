import { ArrowHead, C, Label, Layer, V } from "../_components/figure";
import type { FigureProps, Solution } from "../_lib/types";

// Six stages placed evenly round one circle, in the order the cycle runs.
const CX = 260;
const CY = 207;
const R = 150;
const NODE = 24;
const at = (deg: number, radius = R) => ({
  x: CX + radius * Math.cos((deg * Math.PI) / 180),
  y: CY + radius * Math.sin((deg * Math.PI) / 180),
});

type Stage = { key: string; deg: number; ploidy: "n" | "2n"; lines: string[]; layer: number; asked?: boolean };

const STAGES: Stage[] = [
  { key: "medusa", deg: -90, ploidy: "2n", lines: ["Adult medusa"], layer: 1 },
  { key: "gametes", deg: -30, ploidy: "n", lines: ["Gametes", "(egg, sperm)"], layer: 1, asked: true },
  { key: "zygote", deg: 30, ploidy: "2n", lines: ["Zygote"], layer: 2 },
  { key: "planula", deg: 90, ploidy: "2n", lines: ["Planula larva"], layer: 2, asked: true },
  { key: "polyp", deg: 150, ploidy: "2n", lines: ["Polyp"], layer: 3 },
  { key: "budding", deg: 210, ploidy: "2n", lines: ["Budding", "polyp"], layer: 3, asked: true },
];

// Arrow i runs from stage i to stage i+1; the label sits just inside the circle.
const LINKS = [
  { text: ["meiosis"], layer: 1 },
  { text: ["fertilization"], layer: 2 },
  { text: ["mitosis"], layer: 2 },
  { text: ["settles"], layer: 3 },
  { text: ["buds form", "(mitosis)"], layer: 3 },
  { text: ["buds break off"], layer: 3 },
];

const fillFor = (p: "n" | "2n") => (p === "n" ? C.amber : C.blue);

function Figure({ step, playing }: FigureProps) {
  return (
    <svg viewBox="0 0 520 414" className="block h-auto w-full">
      <defs>
        <ArrowHead id="b304631-muted" color={C.muted} />
      </defs>

      {/* Step 1: the two ploidy levels */}
      <Layer at={0} step={step} playing={playing}>
        <circle cx={22} cy={24} r={8} fill={C.blue} />
        <Label x={36} y={29} size={14}>2<V>n</V> = diploid</Label>
        <circle cx={22} cy={47} r={8} fill={C.amber} />
        <Label x={36} y={52} size={14}><V>n</V> = haploid</Label>
      </Layer>

      {LINKS.map((link, i) => {
        const a = STAGES[i];
        const b = STAGES[(i + 1) % STAGES.length];
        const p = at(a.deg);
        const q = at(b.deg);
        const len = Math.hypot(q.x - p.x, q.y - p.y);
        const ux = (q.x - p.x) / len;
        const uy = (q.y - p.y) / len;
        const gap = NODE + 9;
        const mid = at((a.deg + (b.deg < a.deg ? b.deg + 360 : b.deg)) / 2, 86);
        const vertical = Math.abs(ux) < 0.01;
        const anchor = vertical ? (mid.x > CX ? "end" : "start") : "middle";
        const lx = vertical ? (mid.x > CX ? p.x - 14 : p.x + 14) : mid.x;
        return (
          <Layer key={i} at={link.layer} step={step} playing={playing}>
            <path
              className="cr-draw"
              pathLength={1}
              d={`M${(p.x + ux * gap).toFixed(1)} ${(p.y + uy * gap).toFixed(1)}L${(q.x - ux * gap).toFixed(1)} ${(q.y - uy * gap).toFixed(1)}`}
              fill="none"
              stroke={C.muted}
              strokeWidth={2}
              markerEnd="url(#b304631-muted)"
            />
            {link.text.map((t, k) => (
              <Label key={t} x={lx} y={mid.y + 4 + k * 16 - (link.text.length - 1) * 8} anchor={anchor} fill={C.muted} size={13} weight={500}>{t}</Label>
            ))}
          </Layer>
        );
      })}

      {STAGES.map((s) => {
        const p = at(s.deg);
        const side = Math.abs(p.x - CX) < 1 ? "middle" : p.x > CX ? "start" : "end";
        const lx = side === "middle" ? p.x : p.x + (side === "start" ? NODE + 10 : -(NODE + 10));
        const ly = side === "middle" ? (p.y < CY ? p.y - NODE - 12 : p.y + NODE + 22) : p.y + 5 - (s.lines.length - 1) * 9;
        return (
          <Layer key={s.key} at={s.layer} step={step} playing={playing}>
            <circle cx={p.x} cy={p.y} r={NODE} fill={fillFor(s.ploidy)} />
            <Label x={p.x} y={p.y + 5} anchor="middle" fill={C.surface} size={15} weight={700}>{s.ploidy === "2n" ? "2" : ""}<V>n</V></Label>
            {s.lines.map((t, k) => (
              <Label key={t} x={lx} y={ly + k * 18} anchor={side} size={14}>{t}</Label>
            ))}
          </Layer>
        );
      })}

      {/* Step 5: the three stages the question asks about */}
      <Layer at={4} step={step} playing={playing}>
        {STAGES.filter((s) => s.asked).map((s) => {
          const p = at(s.deg);
          return <circle key={s.key} cx={p.x} cy={p.y} r={NODE + 6} fill="none" stroke={C.rose} strokeWidth={3} />;
        })}
      </Layer>
    </svg>
  );
}

function PloidyTable({ cells }: { cells: [string, string, string] }) {
  return (
    <table className="border-collapse text-sm [&_td]:border [&_td]:border-slate-300 [&_td]:px-2 [&_td]:py-0.5 [&_td]:text-center [&_th]:border [&_th]:border-slate-300 [&_th]:px-2 [&_th]:py-0.5 [&_th]:font-semibold">
      <thead>
        <tr>
          <th>Planula</th>
          <th>Budding polyp</th>
          <th>Gamete</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {cells.map((c, i) => <td key={i}>{c}</td>)}
        </tr>
      </tbody>
    </table>
  );
}

export const biology304631: Solution = {
  itemId: "304631",
  subject: "Biology",
  course: "Biology 30",
  itemType: "Multiple choice",
  topic: "Life cycles and ploidy",
  title: "Ploidy through the jellyfish life cycle",
  question: <p>Which of the following tables identifies the ploidy of the planula, the budding polyp, and a gamete in the life cycle of a jellyfish?</p>,
  options: [
    { label: "A", content: <PloidyTable cells={["n", "n", "2n"]} /> },
    { label: "B", content: <PloidyTable cells={["n", "2n", "n"]} /> },
    { label: "C", content: <PloidyTable cells={["2n", "2n", "2n"]} /> },
    { label: "D", content: <PloidyTable cells={["2n", "2n", "n"]} />, correct: true },
  ],
  answer: <>D: planula 2<i>n</i>, budding polyp 2<i>n</i>, gamete <i>n</i></>,
  Figure,
  figureAlt:
    "Jellyfish life cycle drawn as a loop. The adult medusa is diploid and makes haploid gametes by meiosis. Fertilization gives a diploid zygote, which grows by mitosis into a diploid planula larva, then a diploid polyp and budding polyp, which releases young medusae.",
  summary: "Only the gametes are haploid. The planula and the budding polyp are both diploid, so the answer is D.",
  steps: [
    {
      title: "Recall what ploidy means",
      caption:
        "The answer is D. Here’s why. Ploidy is the number of chromosome sets in a cell. Diploid, written 2n, means two sets. Haploid, written n, means one set. In animals, body cells are diploid and only the gametes are haploid.",
      body: (
        <>
          <p>Ploidy is the number of sets of chromosomes in a cell.</p>
          <p>
            <strong className="text-[#1d5bd0]">Diploid (2<i>n</i>)</strong> cells carry two sets, one from each parent. <strong className="text-[#b45309]">Haploid (<i>n</i>)</strong> cells carry one set.
          </p>
          <p>A jellyfish is an animal. In animals the body cells are diploid, and the only haploid cells are the gametes.</p>
        </>
      ),
    },
    {
      title: "Start with the adult and its gametes",
      caption:
        "Start with the adult jellyfish, the medusa. It’s diploid. It makes eggs or sperm by meiosis, which halves the chromosome number. So the gametes are haploid, n.",
      body: (
        <>
          <p>The adult jellyfish, called a medusa, is diploid.</p>
          <p>
            It produces eggs or sperm by <strong>meiosis</strong>, which halves the chromosome number. So a gamete is <strong className="text-[#b45309]"><i>n</i></strong>.
          </p>
        </>
      ),
    },
    {
      title: "Follow fertilization to the planula",
      caption:
        "When an egg and a sperm join, n plus n gives a diploid zygote. The zygote divides by mitosis, which keeps the chromosome number the same. It grows into a swimming larva called a planula, so the planula is 2n.",
      body: (
        <>
          <p>At fertilization an egg and a sperm join: <i>n</i> + <i>n</i> gives a diploid zygote.</p>
          <p>
            The zygote divides by <strong>mitosis</strong>, which copies every chromosome and keeps the number the same. It develops into a free-swimming larva, the planula. So the planula is <strong className="text-[#1d5bd0]">2<i>n</i></strong>.
          </p>
        </>
      ),
    },
    {
      title: "Follow the planula to the budding polyp",
      caption:
        "The planula settles and grows into a polyp, again by mitosis. The polyp then makes buds asexually, which is mitosis once more. Nothing has halved the chromosomes, so the budding polyp is also 2n.",
      body: (
        <>
          <p>The planula settles on a surface and grows into a polyp, again by mitosis.</p>
          <p>
            The polyp then reproduces asexually by forming buds that break off as young medusae. Budding is also mitosis, so nothing has halved the chromosome number. The budding polyp is <strong className="text-[#1d5bd0]">2<i>n</i></strong>.
          </p>
        </>
      ),
    },
    {
      title: "Match the table",
      caption:
        "Putting it together: planula 2n, budding polyp 2n, gamete n. That’s table D.",
      body: (
        <>
          <p>
            Planula 2<i>n</i>, budding polyp 2<i>n</i>, gamete <i>n</i>. That is table <strong>D</strong>.
          </p>
          <p>Only one step in the whole cycle lowers the chromosome number, and that is meiosis in the adult. Every other stage is built by mitosis from a diploid cell.</p>
        </>
      ),
    },
  ],
};
