import { ArrowHead, C, Label, Layer, V } from "../_components/figure";
import { Tex } from "../_components/Tex";
import type { FigureProps, Solution } from "../_lib/types";

const r = String.raw;

// One enthalpy scale for all four reactions: reactants sit at 0 kJ.
const Y = (kJ: number) => 30 + (120 - kJ) * 0.875;
const LEFT = 70;
const RIGHT = 500;

const REACTIONS = [
  { name: "I", dH: -241.8, x: 220, at: 2 },
  { name: "II", dH: -110.5, x: 305, at: 2 },
  { name: "III", dH: 90.2, x: 390, at: 3 },
  { name: "IV", dH: 26.5, x: 470, at: 3 },
];

const fmt = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(1)} kJ`;

function Figure({ step, playing }: FigureProps) {
  return (
    <svg viewBox="0 0 520 414" className="block h-auto w-full">
      <defs>
        <ArrowHead id="c193246-rose" color={C.rose} />
        <ArrowHead id="c193246-blue" color={C.blue} />
      </defs>

      {/* Step 1: below the reactants = energy released */}
      <Layer at={0} step={step} playing={playing}>
        <rect x={LEFT} y={Y(0)} width={RIGHT - LEFT} height={Y(-280) - Y(0)} fill={C.roseTint} />
        <Label x={LEFT + 8} y={Y(0) + 22} fill={C.rose} size={13}>energy released</Label>
        <Label x={LEFT + 8} y={Y(0) + 39} fill={C.rose} size={13}>exothermic</Label>
        <Label x={LEFT + 8} y={Y(0) + 56} fill={C.rose} size={13}>Δ<V>H</V> negative</Label>
      </Layer>

      {/* Step 2: above the reactants = energy absorbed */}
      <Layer at={1} step={step} playing={playing}>
        <rect x={LEFT} y={Y(120)} width={RIGHT - LEFT} height={Y(0) - Y(120)} fill={C.blueTint} />
        <Label x={LEFT + 8} y={Y(0) - 44} fill={C.blue} size={13}>energy absorbed</Label>
        <Label x={LEFT + 8} y={Y(0) - 27} fill={C.blue} size={13}>endothermic</Label>
        <Label x={LEFT + 8} y={Y(0) - 10} fill={C.blue} size={13}>Δ<V>H</V> positive</Label>
      </Layer>

      {/* axis and the reactant level */}
      <line x1={LEFT} y1={Y(120)} x2={LEFT} y2={Y(-280)} stroke={C.ink} strokeWidth={1.4} />
      {[100, 0, -100, -200].map((v) => (
        <g key={v}>
          <line x1={LEFT - 5} y1={Y(v)} x2={LEFT} y2={Y(v)} stroke={C.ink} />
          <Label x={LEFT - 9} y={Y(v) + 4} anchor="end" fill={C.muted} size={12} weight={500}>
            {v === 0 ? "0" : `${v < 0 ? "−" : "+"}${Math.abs(v)}`}
          </Label>
        </g>
      ))}
      <text x={18} y={Y(-80)} fill={C.muted} fontSize={12} fontWeight={500} textAnchor="middle" transform={`rotate(-90 18 ${Y(-80)})`}>
        Energy relative to reactants (kJ)
      </text>
      <line x1={LEFT} y1={Y(0)} x2={RIGHT} y2={Y(0)} stroke={C.ink} strokeWidth={1.6} strokeDasharray="6 5" />
      <Label x={347} y={Y(0) - 7} anchor="middle" fill={C.muted} size={12} weight={500}>reactants</Label>

      {/* Steps 3 and 4: where the products of each reaction end up */}
      {REACTIONS.map((rx) => {
        const exo = rx.dH < 0;
        const color = exo ? C.rose : C.blue;
        const y = Y(rx.dH);
        return (
          <Layer key={rx.name} at={rx.at} step={step} playing={playing}>
            <path
              className="cr-draw"
              pathLength={1}
              d={`M${rx.x} ${Y(0)}L${rx.x} ${exo ? y - 5 : y + 5}`}
              fill="none"
              stroke={color}
              strokeWidth={3}
              markerEnd={`url(#c193246-${exo ? "rose" : "blue"})`}
            />
            <line x1={rx.x - 26} y1={y} x2={rx.x + 26} y2={y} stroke={color} strokeWidth={4} strokeLinecap="round" />
            <Label x={rx.x} y={exo ? y + 20 : y - 10} anchor="middle" fill={color} size={13}>{fmt(rx.dH)}</Label>
            <Label x={rx.x} y={406} anchor="middle">{rx.name}</Label>
          </Layer>
        );
      })}

      {/* Step 5: the two that answer the question */}
      <Layer at={4} step={step} playing={playing}>
        {REACTIONS.filter((rx) => rx.dH < 0).map((rx) => (
          <rect key={rx.name} x={rx.x - 33} y={Y(0) + 6} width={66} height={Y(rx.dH) + 30 - Y(0) - 6} rx={8} fill="none" stroke={C.rose} strokeWidth={2} strokeDasharray="5 4" />
        ))}
        <Label x={LEFT + 8} y={300} fill={C.rose} size={14}>I and II</Label>
        <Label x={LEFT + 8} y={319} fill={C.rose} size={14}>release energy</Label>
      </Layer>
    </svg>
  );
}

const eq = "block overflow-x-auto py-0.5";

export const chemistry193246: Solution = {
  itemId: "193246",
  subject: "Chemistry",
  course: "Chemistry 30",
  itemType: "Multiple choice",
  topic: "Enthalpy changes",
  title: "Which reactions are exothermic?",
  question: (
    <>
      <p className="font-semibold">Four Chemical Equations</p>
      <ol className="mb-3 grid list-none gap-1 p-0">
        <li className={eq}>I.&ensp;<Tex t={r`\mathrm{H_{2(g)} + \tfrac12 O_{2(g)} \rightarrow H_2O_{(g)}} \qquad \Delta H = -241.8\ \mathrm{kJ}`} /></li>
        <li className={eq}>II.&ensp;<Tex t={r`\mathrm{C_{(s)} + \tfrac12 O_{2(g)} \rightarrow CO_{(g)}} + 110.5\ \mathrm{kJ}`} /></li>
        <li className={eq}>III.&ensp;<Tex t={r`\mathrm{\tfrac12 N_{2(g)} + \tfrac12 O_{2(g)}} + 90.2\ \mathrm{kJ} \rightarrow \mathrm{NO_{(g)}}`} /></li>
        <li className={eq}>IV.&ensp;<Tex t={r`\mathrm{\tfrac12 H_{2(g)} + \tfrac12 I_{2(s)} \rightarrow HI_{(g)}} \qquad \Delta H = +26.5\ \mathrm{kJ}`} /></li>
      </ol>
      <p>Which of the given equations are exothermic reactions?</p>
    </>
  ),
  options: [
    { label: "A", content: <>I and II</>, correct: true },
    { label: "B", content: <>I and III</> },
    { label: "C", content: <>II and IV</> },
    { label: "D", content: <>III and IV</> },
  ],
  answer: <>A: I and II</>,
  Figure,
  figureAlt:
    "Energy chart with the reactants at zero. The products of reaction I sit 241.8 kJ below and reaction II 110.5 kJ below, so both release energy. The products of reaction III sit 90.2 kJ above and reaction IV 26.5 kJ above, so both absorb energy.",
  summary: "Reactions I and II end up lower in energy than they started, so they are exothermic. The answer is A.",
  steps: [
    {
      title: "Say what exothermic means",
      caption:
        "The answer is A. Here’s why. An exothermic reaction gives energy out to its surroundings. So the products end up with less energy than the reactants, and the enthalpy change, ΔH, is negative.",
      body: (
        <>
          <p>
            An exothermic reaction <strong className="text-[#cf2f68]">releases</strong> energy to its surroundings. The products finish with less energy than the reactants started with.
          </p>
          <p>
            That drop is the enthalpy change, so for an exothermic reaction <Tex t={r`\Delta H < 0`} />.
          </p>
        </>
      ),
    },
    {
      title: "Know the two ways energy is written",
      caption:
        "These equations show energy in two different ways. Some give ΔH with a sign. Others put the energy right inside the equation. Energy on the product side was released. Energy on the reactant side was absorbed.",
      body: (
        <>
          <p>The four equations show the energy change in two different ways.</p>
          <p>
            <strong>With <Tex t={r`\Delta H`} /> notation:</strong> a negative sign means exothermic, a positive sign means endothermic.
          </p>
          <p>
            <strong>As a term in the equation:</strong> energy written with the products was released (exothermic). Energy written with the reactants was <strong className="text-[#1d5bd0]">absorbed</strong> (endothermic).
          </p>
        </>
      ),
    },
    {
      title: "Check equations I and II",
      caption:
        "Equation one has ΔH of −241.8 kJ. Negative, so it’s exothermic. Equation two shows 110.5 kJ on the product side. That energy is released, so it’s exothermic too.",
      body: (
        <>
          <p>
            <strong>I:</strong> <Tex t={r`\Delta H = -241.8\ \mathrm{kJ}`} />. The sign is negative, so it is exothermic.
          </p>
          <p>
            <strong>II:</strong> 110.5 kJ appears on the product side, so the reaction gives that energy out. It is exothermic, the same as writing <Tex t={r`\Delta H = -110.5\ \mathrm{kJ}`} />.
          </p>
        </>
      ),
    },
    {
      title: "Check equations III and IV",
      caption:
        "Equation three has 90.2 kJ on the reactant side, so energy goes in. That’s endothermic. Equation four has ΔH of +26.5 kJ. Positive, so it’s endothermic as well.",
      body: (
        <>
          <p>
            <strong>III:</strong> 90.2 kJ appears on the reactant side, so the reaction must take that energy in. It is endothermic, the same as <Tex t={r`\Delta H = +90.2\ \mathrm{kJ}`} />.
          </p>
          <p>
            <strong>IV:</strong> <Tex t={r`\Delta H = +26.5\ \mathrm{kJ}`} />. The sign is positive, so it is endothermic.
          </p>
        </>
      ),
    },
    {
      title: "Pick the exothermic pair",
      caption:
        "So the two reactions that release energy are one and two. That’s option A. The common slip is reading the energy in equation two as absorbed, just because it has a plus sign in front of it.",
      body: (
        <>
          <p>
            Only I and II release energy, so the answer is <strong>A</strong>.
          </p>
          <p>The usual mistake is in equation II: the plus sign in front of 110.5 kJ does not mean <Tex t={r`\Delta H`} /> is positive. It only says energy is one of the products.</p>
        </>
      ),
    },
  ],
};
