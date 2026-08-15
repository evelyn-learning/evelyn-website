/**
 * Shared checker for the SVG label-clip audit/regression harness
 * (docs/svg-renderer-clip-audit-2026-08-07.md).
 *
 * Parses renderToStaticMarkup output and reports every <text>/<tspan> whose
 * estimated horizontal extent (chars × fontSize × 0.55 — same deliberately
 * over-estimating heuristic as fraction-bar-layout.ts) escapes the svg's
 * viewBox. Texts with a transform attribute are skipped (their x is not in
 * viewport space).
 */

export const CHAR_FACTOR = 0.55;

export interface Violation {
  text: string;
  anchor: string;
  x: number;
  est: [number, number];
  view: [number, number];
}

export function findViolations(svgMarkup: string): Violation[] {
  const vbMatch = svgMarkup.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/);
  if (!vbMatch) return [];
  const vbX = Number(vbMatch[1]);
  const vbW = Number(vbMatch[3]);
  const out: Violation[] = [];
  const textRe = /<text([^>]*)>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = textRe.exec(svgMarkup)) !== null) {
    const attrs: Record<string, string> = {};
    const attrRe = /([\w-]+)="([^"]*)"/g;
    let a: RegExpExecArray | null;
    while ((a = attrRe.exec(m[1])) !== null) attrs[a[1]] = a[2];
    if (attrs.transform) continue; // rotated/translated — x not comparable
    const anchor = attrs['text-anchor'] ?? 'start';
    const fs = Number(attrs['font-size'] ?? 12);
    const baseX = Number(attrs.x ?? 0);
    const lines: Array<{ x: number; content: string }> = [];
    const tspanRe = /<tspan([^>]*)>([\s\S]*?)<\/tspan>/g;
    let t: RegExpExecArray | null;
    while ((t = tspanRe.exec(m[2])) !== null) {
      const tx = t[1].match(/\bx="([-\d.]+)"/);
      lines.push({ x: tx ? Number(tx[1]) : baseX, content: t[2] });
    }
    if (lines.length === 0) lines.push({ x: baseX, content: m[2] });
    for (const line of lines) {
      const content = line.content.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9x]+;/g, 'x').trim();
      if (!content) continue;
      if (!Number.isFinite(line.x) || !Number.isFinite(fs)) continue;
      const w = content.length * fs * CHAR_FACTOR;
      const left = anchor === 'middle' ? line.x - w / 2 : anchor === 'end' ? line.x - w : line.x;
      const right = left + w;
      if (left < vbX - 1 || right > vbX + vbW + 1) {
        out.push({ text: content.slice(0, 50), anchor, x: line.x, est: [Math.round(left), Math.round(right)], view: [vbX, vbX + vbW] });
      }
    }
  }
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AuditCase { name: string; expectViolation: boolean; el: React.ReactElement<any> }
// (React types resolved structurally — case files import React themselves.)
import type React from 'react';
