/**
 * Static SVG thumbnail of a homework 3D solid (showDiagram solid_3d), drawn
 * from the figure's own shape and dims with the same oblique projection,
 * colours and dimension labels as CatalogSolid3DRenderer (spec 2026-10-21
 * §4.6 option (b): the live renderer is not rendered or refactored here, GAC
 * freeze). Unlike the catalog solver, nothing is defaulted: the shape must be
 * one of the solver's own keys and every dim it draws must be given, or there
 * is no thumbnail. With showNet the unfolded net is drawn beside the solid.
 * Never throws.
 */

import { SOLID_DIMS, type SolidShapeKey } from './figure-validate-diagram';
import { FONT, clip, esc, fmt, isNum } from './svg-util';
import type { DiagramFigure } from './types';

const EDGE = '#1e3a8a', FILL = '#3b82f6', HID = '#93c5fd', DIM = '#b91c1c';
const KZX = 0.5, KZY = 0.34;

type P = [number, number];

/** The drawn content's box, so the thumbnail is cropped to the solid (and net) rather than the board's canvas. */
class Box {
  x0 = Infinity; y0 = Infinity; x1 = -Infinity; y1 = -Infinity;
  add(x: number, y: number, rx = 0, ry = rx): void {
    this.x0 = Math.min(this.x0, x - rx); this.y0 = Math.min(this.y0, y - ry);
    this.x1 = Math.max(this.x1, x + rx); this.y1 = Math.max(this.y1, y + ry);
  }
}
let box = new Box();
const pts = (p: P[]) => p.map((q) => `${fmt(q[0])},${fmt(q[1])}`).join(' ');
const line = (a: P, b: P, stroke: string, w: number, dash = '') =>
  `<line x1="${fmt(a[0])}" y1="${fmt(a[1])}" x2="${fmt(b[0])}" y2="${fmt(b[1])}" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}></line>`;
const hidden = (a: P, b: P) => line(a, b, HID, 1.3, '4 3');
const poly = (p: P[], op: number) => `<polygon points="${pts(p)}" fill="${FILL}" fill-opacity="${op}" stroke="${EDGE}" stroke-width="2"></polygon>`;
const f = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));
const label = (p: P, text: string, dx = 0, dy = 0, anchor = 'middle') => {
  const w = 7.5 * text.length, x = p[0] + dx, y = p[1] + dy;
  box.add(anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2, y - 12);
  box.add(anchor === 'end' ? x : anchor === 'start' ? x + w : x + w / 2, y + 3);
  return `<text x="${fmt(p[0] + dx)}" y="${fmt(p[1] + dy)}" font-size="12.5" fill="${DIM}" font-weight="700" text-anchor="${anchor}">${esc(text)}</text>`;
};

function drawSolid(shape: SolidShapeKey, d: Record<string, number>, cx: number, cy: number, S: number): string {
  const proj = (x: number, y: number, z: number): P => {
    const p: P = [cx + S * (x + z * KZX), cy - S * (y + z * KZY)];
    box.add(p[0], p[1]);
    return p;
  };
  if (shape === 'rectangular_prism' || shape === 'cube') {
    const L = shape === 'cube' ? d.side : d.length, H = shape === 'cube' ? d.side : d.height, W = shape === 'cube' ? d.side : d.width;
    const c = (x: number, y: number, z: number) => proj(-L / 2 + x, -H / 2 + y, -W / 2 + z);
    const fbl = c(0, 0, 0), fbr = c(L, 0, 0), ftr = c(L, H, 0), ftl = c(0, H, 0);
    const bbl = c(0, 0, W), bbr = c(L, 0, W), btr = c(L, H, W), btl = c(0, H, W);
    return hidden(bbl, bbr) + hidden(bbl, btl) + hidden(bbl, fbl)
      + poly([ftl, ftr, btr, btl], 0.16) + poly([fbr, ftr, btr, bbr], 0.1) + poly([fbl, fbr, ftr, ftl], 0.22)
      + label([(fbl[0] + fbr[0]) / 2, fbl[1]], f(L), 0, 16)
      + label([fbl[0], (fbl[1] + ftl[1]) / 2], f(H), -12, 4)
      + label([(ftr[0] + btr[0]) / 2, (ftr[1] + btr[1]) / 2], f(W), 10, -4);
  }
  if (shape === 'cylinder' || shape === 'cone') {
    const R = d.radius, Ht = d.height, rx = S * R, ry = rx * 0.34;
    const [bx, by] = proj(0, -Ht / 2, 0);
    const topY = by - S * Ht;
    box.add(bx, by, rx, ry); box.add(bx, topY, rx, ry);
    const front = (fill: string) => `<path d="M ${fmt(bx - rx)} ${fmt(by)} A ${fmt(rx)} ${fmt(ry)} 0 0 0 ${fmt(bx + rx)} ${fmt(by)}" ${fill} stroke="${EDGE}" stroke-width="2"></path>`;
    const back = `<path d="M ${fmt(bx - rx)} ${fmt(by)} A ${fmt(rx)} ${fmt(ry)} 0 0 1 ${fmt(bx + rx)} ${fmt(by)}" fill="none" stroke="${HID}" stroke-width="1.3" stroke-dasharray="4 3"></path>`;
    if (shape === 'cylinder') {
      return line([bx - rx, by], [bx - rx, topY], EDGE, 2) + line([bx + rx, by], [bx + rx, topY], EDGE, 2)
        + front('fill="none"') + back
        + `<ellipse cx="${fmt(bx)}" cy="${fmt(topY)}" rx="${fmt(rx)}" ry="${fmt(ry)}" fill="${FILL}" fill-opacity="0.18" stroke="${EDGE}" stroke-width="2"></ellipse>`
        + line([bx, topY], [bx + rx, topY], DIM, 1.4)
        + label([bx + rx / 2, topY], `r=${f(R)}`, 0, -5) + label([bx + rx + 2, (by + topY) / 2], `h=${f(Ht)}`, 10, 4);
    }
    const apex: P = [bx, topY];
    return back + front(`fill="${FILL}" fill-opacity="0.16"`)
      + line([bx - rx, by], apex, EDGE, 2) + line([bx + rx, by], apex, EDGE, 2)
      + line([bx, by], apex, DIM, 1.3, '3 3') + line([bx, by], [bx + rx, by], DIM, 1.4)
      + label([bx + rx / 2, by], `r=${f(R)}`, 0, 16) + label([bx, (by + apex[1]) / 2], `h=${f(Ht)}`, -12, 4, 'end');
  }
  if (shape === 'sphere') {
    const R = d.radius, r = S * R;
    box.add(cx, cy, r);
    return `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}" fill="${FILL}" fill-opacity="0.14" stroke="${EDGE}" stroke-width="2"></circle>`
      + `<ellipse cx="${fmt(cx)}" cy="${fmt(cy)}" rx="${fmt(r)}" ry="${fmt(r * 0.3)}" fill="none" stroke="${HID}" stroke-width="1.3" stroke-dasharray="4 3"></ellipse>`
      + line([cx, cy], [cx + r, cy], DIM, 1.5) + label([cx + r / 2, cy], `r=${f(R)}`, 0, -5);
  }
  if (shape === 'square_pyramid') {
    const B = d.base, Ht = d.height, h = B / 2;
    const bfl = proj(-h, -Ht / 2, -h), bfr = proj(h, -Ht / 2, -h), bbr = proj(h, -Ht / 2, h), bbl = proj(-h, -Ht / 2, h);
    const apex = proj(0, Ht / 2, 0);
    return hidden(bbl, bbr) + hidden(apex, bbl) + poly([bfl, bfr, bbr, bbl], 0.1) + poly([bfl, bfr, apex], 0.22)
      + line(apex, bbr, EDGE, 2)
      + label([(bfl[0] + bfr[0]) / 2, bfl[1]], f(B), 0, 16) + label([apex[0], (apex[1] + bfl[1]) / 2], `h=${f(Ht)}`, -14, 0);
  }
  const { base: tb, triHeight: th, length: tl } = d;
  const a0 = proj(-tb / 2, -th / 2, -tl / 2), b0 = proj(tb / 2, -th / 2, -tl / 2), c0 = proj(0, th / 2, -tl / 2);
  const a1 = proj(-tb / 2, -th / 2, tl / 2), b1 = proj(tb / 2, -th / 2, tl / 2), c1 = proj(0, th / 2, tl / 2);
  return hidden(a1, b1) + hidden(b1, c1) + hidden(a1, c1)
    + poly([b0, c0, c1, b1], 0.12) + poly([a0, c0, c1, a1], 0.16) + poly([a0, b0, c0], 0.22)
    + label([(a0[0] + b0[0]) / 2, a0[1]], f(tb), 0, 15) + label([c0[0], (c0[1] + a0[1]) / 2], `h=${f(th)}`, -12, 0)
    + label([(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2], f(tl), 10, 0);
}

type Face =
  | { kind: 'rect'; x: number; y: number; w: number; h: number }
  | { kind: 'tri'; pts: P[] }
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'sector'; cx: number; cy: number; r: number; a0: number; a1: number };

/** The renderer's net layouts (same faces, same coordinates). */
function netFaces(shape: SolidShapeKey, d: Record<string, number>): Face[] | null {
  if (shape === 'rectangular_prism' || shape === 'cube') {
    const L = shape === 'cube' ? d.side : d.length, H = shape === 'cube' ? d.side : d.height, Wd = shape === 'cube' ? d.side : d.width;
    return [
      { kind: 'rect', x: Wd, y: 0, w: L, h: H }, { kind: 'rect', x: 0, y: 0, w: Wd, h: H },
      { kind: 'rect', x: Wd + L, y: 0, w: Wd, h: H }, { kind: 'rect', x: Wd + L + Wd, y: 0, w: L, h: H },
      { kind: 'rect', x: Wd, y: -Wd, w: L, h: Wd }, { kind: 'rect', x: Wd, y: H, w: L, h: Wd },
    ];
  }
  if (shape === 'cylinder') {
    const r = d.radius, H = d.height, circ = 2 * Math.PI * r;
    return [{ kind: 'rect', x: 0, y: 0, w: circ, h: H }, { kind: 'circle', cx: circ / 2, cy: -r - 2, r }, { kind: 'circle', cx: circ / 2, cy: H + r + 2, r }];
  }
  if (shape === 'cone') {
    const r = d.radius, slant = Math.hypot(r, d.height), theta = (2 * Math.PI * r) / slant;
    return [{ kind: 'sector', cx: 0, cy: 0, r: slant, a0: -theta / 2, a1: theta / 2 }, { kind: 'circle', cx: slant + r + 6, cy: 0, r }];
  }
  if (shape === 'square_pyramid') {
    const B = d.base, slant = Math.hypot(d.height, B / 2);
    return [
      { kind: 'rect', x: 0, y: 0, w: B, h: B },
      { kind: 'tri', pts: [[0, 0], [B, 0], [B / 2, -slant]] }, { kind: 'tri', pts: [[0, B], [B, B], [B / 2, B + slant]] },
      { kind: 'tri', pts: [[0, 0], [0, B], [-slant, B / 2]] }, { kind: 'tri', pts: [[B, 0], [B, B], [B + slant, B / 2]] },
    ];
  }
  if (shape === 'triangular_prism') {
    const b = d.base, th = d.triHeight, L = d.length, side = Math.hypot(b / 2, th);
    return [
      { kind: 'rect', x: 0, y: 0, w: side, h: L }, { kind: 'rect', x: side, y: 0, w: b, h: L }, { kind: 'rect', x: side + b, y: 0, w: side, h: L },
      { kind: 'tri', pts: [[side, 0], [side + b, 0], [side + b / 2, -th]] }, { kind: 'tri', pts: [[side, L], [side + b, L], [side + b / 2, L + th]] },
    ];
  }
  return null;
}

function drawNet(faces: Face[], cx: number, cy: number, maxW: number, maxH: number): string {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const ext = (x: number, y: number) => { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); };
  for (const fc of faces) {
    if (fc.kind === 'rect') { ext(fc.x, fc.y); ext(fc.x + fc.w, fc.y + fc.h); }
    else if (fc.kind === 'tri') fc.pts.forEach((p) => ext(p[0], p[1]));
    else { ext(fc.cx - fc.r, fc.cy - fc.r); ext(fc.cx + fc.r, fc.cy + fc.r); }
  }
  const S = Math.min(maxW / (maxX - minX || 1), maxH / (maxY - minY || 1));
  const ox = cx - (S * (minX + maxX)) / 2, oy = cy - (S * (minY + maxY)) / 2;
  const tx = (x: number) => ox + S * x, ty = (y: number) => oy + S * y;
  box.add(tx(minX), ty(minY)); box.add(tx(maxX), ty(maxY));
  const st = 'fill="#bfdbfe" fill-opacity="0.5" stroke="#1e3a8a" stroke-width="1.4"';
  return faces.map((fc) => {
    if (fc.kind === 'rect') return `<rect x="${fmt(tx(fc.x))}" y="${fmt(ty(fc.y))}" width="${fmt(S * fc.w)}" height="${fmt(S * fc.h)}" ${st}></rect>`;
    if (fc.kind === 'tri') return `<polygon points="${pts(fc.pts.map((p) => [tx(p[0]), ty(p[1])]))}" ${st}></polygon>`;
    if (fc.kind === 'circle') return `<circle cx="${fmt(tx(fc.cx))}" cy="${fmt(ty(fc.cy))}" r="${fmt(S * fc.r)}" ${st}></circle>`;
    const x0 = fc.cx + fc.r * Math.cos(fc.a0), y0 = fc.cy + fc.r * Math.sin(fc.a0);
    const x1 = fc.cx + fc.r * Math.cos(fc.a1), y1 = fc.cy + fc.r * Math.sin(fc.a1);
    return `<path d="M ${fmt(tx(fc.cx))} ${fmt(ty(fc.cy))} L ${fmt(tx(x0))} ${fmt(ty(y0))} A ${fmt(S * fc.r)} ${fmt(S * fc.r)} 0 ${fc.a1 - fc.a0 > Math.PI ? 1 : 0} 1 ${fmt(tx(x1))} ${fmt(ty(y1))} Z" ${st}></path>`;
  }).join('');
}

export function solidToSvg(fig: DiagramFigure): string | null {
  try {
    if (fig?.type !== 'solid_3d') return null;
    const params = (fig.params ?? {}) as Record<string, unknown>;
    const shape = params.shape;
    if (typeof shape !== 'string' || !Object.prototype.hasOwnProperty.call(SOLID_DIMS, shape)) return null;
    const keys = SOLID_DIMS[shape as SolidShapeKey];
    const given = (params.dims ?? {}) as Record<string, unknown>;
    const dims: Record<string, number> = {};
    for (const k of keys) {
      const v = given[k];
      if (!isNum(v) || v <= 0) return null;
      dims[k] = v;
    }
    const s = shape as SolidShapeKey;
    const faces = params.showNet === true && s !== 'sphere' ? netFaces(s, dims) : null;
    const W = faces ? 780 : 480, H = 380;   // the renderer's canvas; the svg is cropped to what is drawn on it
    const maxDim = Math.max(...Object.values(dims), 1);
    const S = Math.min(faces ? 24 : 34, (faces ? 150 : 200) / maxDim);
    const name = s.replace(/_/g, ' ');
    box = new Box();
    const out: string[] = [];
    const caption = (x: number, y: number, t: string) => {
      box.add(x - 4 * t.length, y - 11); box.add(x + 4 * t.length, y + 3);
      return `<text x="${fmt(x)}" y="${fmt(y)}" font-size="12.5" text-anchor="middle" fill="#6b7280">${esc(t)}</text>`;
    };
    if (faces) {
      out.push(drawSolid(s, dims, 175, H / 2 + 20, S));
      out.push(caption(175, H - 18, name));
      out.push(`<line x1="330" y1="${H / 2}" x2="380" y2="${H / 2}" stroke="#6b7280" stroke-width="1.5"></line><path d="M 386 ${H / 2} L 377 ${H / 2 - 5} L 377 ${H / 2 + 5} Z" fill="#6b7280"></path>`);
      out.push(drawNet(faces, 565, H / 2, 350, 280));
      out.push(caption(565, H - 18, 'net'));
    } else {
      out.push(drawSolid(s, dims, W / 2 - 20, H / 2 + 30, S));
      out.push(caption(W / 2, H - 12, name));
    }
    let title = '';
    if (typeof params.title === 'string' && params.title.trim()) {
      const t = clip(params.title, 50);
      title = `<text x="${fmt((box.x0 + box.x1) / 2)}" y="${fmt(box.y0 - 10)}" text-anchor="middle" font-size="16" font-weight="600" fill="#1f2937">${esc(t)}</text>`;
      box.add((box.x0 + box.x1) / 2 - 4.5 * t.length, box.y0 - 26);
      box.add((box.x0 + box.x1) / 2 + 4.5 * t.length, box.y0);
    }
    const M = 12;
    const vx = box.x0 - M, vy = box.y0 - M, vw = box.x1 - box.x0 + 2 * M, vh = box.y1 - box.y0 + 2 * M;
    if (![vx, vy, vw, vh].every(Number.isFinite) || vw <= 0 || vh <= 0) return null;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(vx)} ${fmt(vy)} ${fmt(vw)} ${fmt(vh)}" font-family="${FONT}">${title}${out.join('')}</svg>`;
  } catch {
    return null;
  }
}
