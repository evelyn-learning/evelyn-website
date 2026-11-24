'use client';

/**
 * Minutes per day for the last 30 days, as plain divs (no chart library).
 *
 * One series, so one colour and no legend: the title names it. The day and its value show in the line above
 * the bars on hover and on focus; that line has a fixed height, so nothing moves. The bars are one tab stop
 * (left / right arrows move between days), and the same numbers are in a table below for anyone who prefers
 * to read them. Days are UTC days, as the API counts them.
 */
import { useRef, useState } from 'react';
import type { DashDay } from '../dash-api';

const dayLabel = (day: string, long = false) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, { timeZone: 'UTC', month: 'short', day: 'numeric', ...(long ? { weekday: 'short' } : {}) });

const minutesText = (n: number) => `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })} min`;
const sessionsText = (n: number) => `${n} ${n === 1 ? 'session' : 'sessions'}`;

/** A round number at or above the largest day, so the axis label reads cleanly. */
function niceMax(v: number): number {
  if (v <= 5) return 5;
  const pow = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * pow >= v) return m * pow;
  return 10 * pow;
}

export function UsageChart({ days }: { days: DashDay[] }) {
  const [shown, setShown] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(Math.max(0, days.length - 1));
  const bars = useRef<(HTMLButtonElement | null)[]>([]);

  const total = Math.round(days.reduce((n, d) => n + d.minutes, 0) * 10) / 10;
  const max = niceMax(Math.max(0, ...days.map((d) => d.minutes)));
  const d = shown === null ? null : days[shown];
  const ticks = days.length ? [0, Math.floor((days.length - 1) / 2), days.length - 1] : [];

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const next = e.key === 'ArrowLeft' ? i - 1 : e.key === 'ArrowRight' ? i + 1 : e.key === 'Home' ? 0 : e.key === 'End' ? days.length - 1 : -1;
    if (next < 0 || next >= days.length) return;
    e.preventDefault();
    setFocusIndex(next);
    bars.current[next]?.focus();
  }

  return (
    <figure>
      <figcaption className="mb-3 flex min-h-[2.75rem] flex-wrap items-baseline justify-between gap-x-4 sm:min-h-0">
        <h2 className="text-base font-semibold text-slate-900">Minutes per day, last 30 days</h2>
        <p className="h-5 text-sm text-slate-600" aria-live="polite">
          {d ? (
            <><span className="font-medium text-slate-900">{dayLabel(d.day, true)}</span>{' · '}{minutesText(d.minutes)}{' · '}{sessionsText(d.sessions)}</>
          ) : (
            <>{minutesText(total)} in total</>
          )}
        </p>
      </figcaption>

      <div className="flex gap-2">
        <div aria-hidden className="flex h-40 w-8 shrink-0 flex-col justify-between text-right text-[11px] leading-none text-slate-400">
          <span>{max}</span>
          <span>0</span>
        </div>
        <div className="min-w-0 flex-1">
          <div
            role="group" aria-label="Minutes used on each of the last 30 days. Use the left and right arrow keys to move between days."
            className="flex h-40 items-stretch border-b border-slate-200 bg-[linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[length:100%_50%]"
            onMouseLeave={() => setShown(null)}
          >
            {days.map((day, i) => (
              <button
                key={day.day} type="button"
                ref={(el) => { bars.current[i] = el; }}
                tabIndex={i === focusIndex ? 0 : -1}
                aria-label={`${dayLabel(day.day, true)}: ${minutesText(day.minutes)}, ${sessionsText(day.sessions)}`}
                onMouseEnter={() => setShown(i)}
                onFocus={() => { setShown(i); setFocusIndex(i); }}
                onBlur={() => setShown(null)}
                onKeyDown={(e) => onKeyDown(e, i)}
                // The whole column is the target, not only the bar: a short bar is still easy to point at.
                className={`group flex min-w-0 flex-1 cursor-default items-end px-px focus:outline-none ${shown === i ? 'bg-slate-100' : ''}`}
              >
                <span
                  className={`block w-full rounded-t-[3px] group-focus-visible:ring-2 group-focus-visible:ring-blue-600 group-focus-visible:ring-offset-1 ${
                    day.minutes > 0 ? (shown === i ? 'bg-blue-700' : 'bg-blue-600') : 'bg-slate-300'
                  }`}
                  style={{ height: day.minutes > 0 ? `max(3px, ${(day.minutes / max) * 100}%)` : '1px' }}
                />
              </button>
            ))}
          </div>
          <div aria-hidden className="relative mt-1.5 h-4 text-[11px] leading-none text-slate-400">
            {ticks.map((t, k) => (
              <span key={t} className="absolute whitespace-nowrap" style={k === 0 ? { left: 0 } : k === 2 ? { right: 0 } : { left: '50%', transform: 'translateX(-50%)' }}>
                {dayLabel(days[t].day)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-slate-500 hover:text-slate-700">Show as a table</summary>
        <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-slate-500">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Day (UTC)</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Minutes</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Sessions</th>
              </tr>
            </thead>
            <tbody>
              {[...days].reverse().map((day) => (
                <tr key={day.day} className="border-t border-slate-100">
                  <th scope="row" className="px-3 py-1.5 font-normal text-slate-700">{dayLabel(day.day, true)}</th>
                  <td className="px-3 py-1.5 text-right tabular-nums text-slate-700">{day.minutes.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-slate-700">{day.sessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
