'use client';
/**
 * Torque: a force applied to an arm that turns about a pivot (a wrench on a bolt, a door on its hinge, a
 * see-saw). Drawn exactly: the pivot, the arm with its length r, the force F at the angle given, the angle
 * between them, and the sense of the turn. The size of the torque is NOT written: it is usually what the
 * student is asked to find. (AP Physics 1, embed-1794441323503: a force diagram of a box with one arrow was
 * all the board could offer for "show me what torque is".)
 */
import { InlineMathText } from './InlineMathText';
import type { TorqueFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

export function TorqueRenderer({ figure }: { figure: TorqueFigure }) {
  const { armLabel, forceLabel, angleDegrees, clockwise, pivotLabel, armName, title } = figure;
  const W = 640; const H = 300;
  const px = 130; const py = 150; const armLen = 340;
  const tx = px + armLen; const ty = py;
  // The force's direction: the angle is measured from the arm's own line (pointing away from the pivot).
  // Clockwise turning about a pivot on the left means the force points down the page.
  const theta = (angleDegrees * Math.PI) / 180;
  const sign = clockwise ? 1 : -1;
  const fLen = 96;
  const fx = tx + Math.cos(theta) * fLen; const fy = ty + sign * Math.sin(theta) * fLen;
  const perpendicular = Math.abs(angleDegrees - 90) < 0.5;
  // The angle's arc, between the arm's extension and the force.
  const arcR = 30;
  const ax = tx + arcR; const ay = ty;
  const bx = tx + Math.cos(theta) * arcR; const by = ty + sign * Math.sin(theta) * arcR;
  // The sense of the turn, as an arc around the pivot.
  const tr = 44;
  // On the side away from the arm, clear of the length's dimension line.
  const t0 = clockwise ? 130 : 230; const t1 = clockwise ? 230 : 130;
  const pt = (deg: number) => ({ x: px + tr * Math.cos((deg * Math.PI) / 180), y: py + tr * Math.sin((deg * Math.PI) / 180) });
  const s = pt(t0); const e = pt(t1);
  const labelBelow = !clockwise;
  return (
    <div className="torque-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]" role="img" aria-label={`${armName} turning about ${pivotLabel}: force ${forceLabel} at ${armLabel} from the pivot`}>
        <defs>
          <marker id="torque-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#dc2626" /></marker>
          <marker id="torque-t" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7c3aed" /></marker>
          <marker id="torque-d" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#6b7280" /></marker>
        </defs>
        {/* The arm */}
        <line x1={px} y1={py} x2={tx} y2={ty} stroke="#374151" strokeWidth={9} strokeLinecap="round" />
        <text x={(px + tx) / 2} y={labelBelow ? py - 16 : py - 16} fontSize={13} textAnchor="middle" fill="#374151">{armName}</text>
        {/* The arm's line carried on past the tip, for the angle */}
        {!perpendicular && <line x1={tx} y1={ty} x2={tx + 62} y2={ty} stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="5 4" />}
        {/* The pivot */}
        <circle cx={px} cy={py} r={13} fill="#fff" stroke="#111827" strokeWidth={3} />
        <circle cx={px} cy={py} r={3.5} fill="#111827" />
        <text x={px} y={clockwise ? py + 72 : py - 60} fontSize={13} textAnchor="middle" fill="#111827" fontWeight={600}>{pivotLabel}</text>
        {/* The sense of the turn */}
        <path d={`M ${s.x} ${s.y} A ${tr} ${tr} 0 0 ${clockwise ? 1 : 0} ${e.x} ${e.y}`} fill="none" stroke="#7c3aed" strokeWidth={2.5} markerEnd="url(#torque-t)" />
        {/* The length r, as a dimension line on the far side from the force */}
        <line x1={px} y1={py + (clockwise ? -42 : 42)} x2={tx} y2={py + (clockwise ? -42 : 42)} stroke="#6b7280" strokeWidth={1.5} markerStart="url(#torque-d)" markerEnd="url(#torque-d)" />
        <line x1={px} y1={py + (clockwise ? -50 : 50)} x2={px} y2={py + (clockwise ? -22 : 22)} stroke="#9ca3af" strokeWidth={1} />
        <line x1={tx} y1={py + (clockwise ? -50 : 50)} x2={tx} y2={py + (clockwise ? -14 : 14)} stroke="#9ca3af" strokeWidth={1} />
        <text x={(px + tx) / 2} y={py + (clockwise ? -50 : 62)} fontSize={15} textAnchor="middle" fill="#374151" fontWeight={600}>{`r = ${armLabel}`}</text>
        {/* The force */}
        <line x1={tx} y1={ty} x2={fx} y2={fy} stroke="#dc2626" strokeWidth={3.5} markerEnd="url(#torque-f)" />
        <text x={Math.min(fx + 12, W - 70)} y={fy + (clockwise ? 20 : -10)} fontSize={15} textAnchor="start" fill="#dc2626" fontWeight={700}>{`F = ${forceLabel}`}</text>
        {/* The angle between the arm and the force */}
        {perpendicular ? (
          <path d={`M ${tx + 14} ${ty} L ${tx + 14} ${ty + sign * 14} L ${tx} ${ty + sign * 14}`} fill="none" stroke="#2563eb" strokeWidth={2} />
        ) : (
          <path d={`M ${ax} ${ay} A ${arcR} ${arcR} 0 0 ${clockwise ? 1 : 0} ${bx} ${by}`} fill="none" stroke="#2563eb" strokeWidth={2} />
        )}
        <text x={tx + (perpendicular ? 22 : 40)} y={ty + sign * (perpendicular ? 30 : 22) + 5} fontSize={14} fill="#2563eb" fontWeight={600}>{`θ = ${angleDegrees}°`}</text>
      </svg>
    </div>
  );
}
