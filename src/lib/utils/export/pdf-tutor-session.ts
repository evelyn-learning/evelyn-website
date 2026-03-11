import { sanitize as baseSanitize } from './pdf-course-export';
import type jsPDF from 'jspdf';

interface TranscriptMessage {
  id: string;
  timestamp: Date;
  role: 'student' | 'tutor' | 'system';
  text: string;
  whiteboardCommands?: WhiteboardCommandData[];
  pedagogicalIntent?: string;
}

interface WhiteboardCommandData {
  action: string;
  [key: string]: unknown;
}

function sanitizeForPDF(text: string): string {
  let s = baseSanitize(text);
  s = s.replace(/\u2026/g, '...');
  s = s.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, ' ');
  s = s.replace(/\uFEFF/g, '');
  s = s.replace(/\*\*(.*?)\*\*/g, '$1');
  s = s.replace(/\*(.*?)\*/g, '$1');
  s = s.replace(/`(.*?)`/g, '$1');
  s = s.replace(/[^\x00-\xFF]/g, '?');
  return s;
}

// ── LaTeX → readable text (WinAnsi safe) ──

function latexToReadable(latex: string): string {
  let s = latex;
  // Greek letters
  s = s.replace(/\\rho/g, 'rho');
  s = s.replace(/\\alpha/g, 'alpha');
  s = s.replace(/\\beta/g, 'beta');
  s = s.replace(/\\gamma/g, 'gamma');
  s = s.replace(/\\theta/g, 'theta');
  s = s.replace(/\\Delta/g, 'Delta ');
  s = s.replace(/\\mu/g, 'mu');
  s = s.replace(/\\pi/g, 'pi');
  s = s.replace(/\\sigma/g, 'sigma');
  s = s.replace(/\\omega/g, 'omega');
  // Common operators
  s = s.replace(/\\cdot/g, ' * ');
  s = s.replace(/\\times/g, ' x ');
  s = s.replace(/\\div/g, ' / ');
  s = s.replace(/\\pm/g, '+/-');
  s = s.replace(/\\leq/g, '<=');
  s = s.replace(/\\geq/g, '>=');
  s = s.replace(/\\neq/g, '!=');
  s = s.replace(/\\approx/g, '~=');
  s = s.replace(/\\rightarrow/g, '->');
  // Fractions: \frac{a}{b} → (a)/(b)
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
  // Subscripts/superscripts: keep inline
  s = s.replace(/\^{([^}]+)}/g, '^$1');
  s = s.replace(/_{([^}]+)}/g, '_$1');
  // Remove \text{...} wrapper
  s = s.replace(/\\text\{([^}]+)\}/g, '$1');
  // Remove remaining backslash commands
  s = s.replace(/\\[a-zA-Z]+/g, '');
  // Clean up extra braces and spaces
  s = s.replace(/[{}]/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// ── jsPDF visual drawing helpers ──

function drawArrow(
  pdf: jsPDF, x1: number, y1: number, x2: number, y2: number,
  color: [number, number, number], weight: number = 0.5
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.5) return;

  const ux = dx / len;
  const uy = dy / len;
  const headLen = Math.min(2.5, len * 0.3);

  pdf.setDrawColor(...color);
  pdf.setLineWidth(weight);
  pdf.line(x1, y1, x2, y2);

  // Arrowhead
  pdf.setFillColor(...color);
  const px = x2 - ux * headLen;
  const py = y2 - uy * headLen;
  const perpX = -uy * headLen * 0.4;
  const perpY = ux * headLen * 0.4;
  pdf.triangle(x2, y2, px + perpX, py + perpY, px - perpX, py - perpY, 'F');
}

function drawEquationVisual(
  pdf: jsPDF, latex: string, label: string | undefined,
  x: number, yStart: number, width: number
): number {
  let y = yStart;
  const boxH = 14;
  const boxPad = 3;

  // Light blue background box
  pdf.setFillColor(239, 246, 255);
  pdf.setDrawColor(191, 219, 254);
  pdf.roundedRect(x, y, width, boxH, 2, 2, 'FD');

  // Label above if present
  if (label) {
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text(sanitizeForPDF(label), x + boxPad, y + 4);
  }

  // Equation text (larger, bold, centered-ish)
  const readable = latexToReadable(latex);
  pdf.setFont('courier', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(30, 64, 175);
  const eqY = label ? y + 10.5 : y + 8.5;
  pdf.text(sanitizeForPDF(readable), x + boxPad + 2, eqY);

  return y + boxH + 2;
}

function drawVectorsDiagram(
  pdf: jsPDF, params: Record<string, unknown>,
  x: number, yStart: number, width: number
): number {
  const vectors = (params.vectors || []) as { magnitude: number; direction: number; label: string; color?: string }[];
  if (vectors.length === 0) return yStart;

  const height = 45;
  const title = (params.title as string) || 'Vector Diagram';

  // Background
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(x, yStart, width, height, 2, 2, 'FD');

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(55, 65, 81);
  pdf.text(sanitizeForPDF(title), x + 4, yStart + 5);

  // Draw area
  const cx = x + width / 2;
  const cy = yStart + height / 2 + 3;
  const maxMag = Math.max(...vectors.map(v => v.magnitude), 1);
  const scale = 14 / maxMag;

  // Axes
  pdf.setDrawColor(200, 210, 220);
  pdf.setLineWidth(0.2);
  pdf.line(cx - 18, cy, cx + 18, cy);
  pdf.line(cx, cy - 15, cx, cy + 15);

  // Origin dot
  pdf.setFillColor(100, 116, 139);
  pdf.circle(cx, cy, 0.5, 'F');

  const colors: [number, number, number][] = [
    [220, 38, 38], [37, 99, 235], [22, 163, 74], [147, 51, 234], [234, 88, 12], [8, 145, 178]
  ];

  vectors.forEach((v, i) => {
    const rad = (v.direction * Math.PI) / 180;
    const dx = Math.cos(rad) * v.magnitude * scale;
    const dy = -Math.sin(rad) * v.magnitude * scale; // PDF y is inverted
    const color = colors[i % colors.length];
    drawArrow(pdf, cx, cy, cx + dx, cy + dy, color, 0.6);

    // Label at tip
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...color);
    const labelX = cx + dx + (dx > 0 ? 1.5 : -1.5);
    const labelY = cy + dy + (dy > 0 ? 2 : -1);
    pdf.text(sanitizeForPDF(v.label), labelX, labelY);
  });

  // Legend below
  let legendY = yStart + height - 4;
  pdf.setFontSize(6);
  let legendX = x + 4;
  vectors.forEach((v, i) => {
    const color = colors[i % colors.length];
    pdf.setFillColor(...color);
    pdf.rect(legendX, legendY - 1.2, 3, 1.5, 'F');
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'normal');
    const txt = sanitizeForPDF(`${v.label}: ${v.magnitude}${v.direction !== 0 ? ` @ ${v.direction}deg` : ''}`);
    pdf.text(txt, legendX + 4, legendY);
    legendX += pdf.getTextWidth(txt) + 8;
  });

  return yStart + height + 2;
}

function drawFreeBodyDiagram(
  pdf: jsPDF, params: Record<string, unknown>,
  x: number, yStart: number, width: number
): number {
  const forces = (params.forces || []) as { magnitude: number; direction: number; label: string; color?: string }[];
  if (forces.length === 0) return yStart;

  const height = 45;

  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(x, yStart, width, height, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(55, 65, 81);
  pdf.text('Free Body Diagram', x + 4, yStart + 5);

  const cx = x + width / 2;
  const cy = yStart + height / 2 + 3;
  const maxMag = Math.max(...forces.map(f => f.magnitude), 1);
  const scale = 12 / maxMag;

  // Object box
  const boxSize = 6;
  pdf.setFillColor(226, 232, 240);
  pdf.setDrawColor(148, 163, 184);
  pdf.rect(cx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize, 'FD');

  const objLabel = (params.objectLabel as string) || '';
  if (objLabel) {
    pdf.setFontSize(6);
    pdf.setTextColor(100, 116, 139);
    pdf.text(sanitizeForPDF(objLabel), cx - boxSize / 2, cy + boxSize / 2 + 3);
  }

  const defaultColors: Record<string, [number, number, number]> = {
    'W': [220, 38, 38], 'Fg': [220, 38, 38], 'mg': [220, 38, 38],
    'N': [37, 99, 235], 'Fn': [37, 99, 235],
    'Fb': [22, 163, 74], 'B': [22, 163, 74],
    'f': [234, 88, 12], 'Ff': [234, 88, 12],
  };

  forces.forEach(f => {
    const rad = (f.direction * Math.PI) / 180;
    const len = f.magnitude * scale;
    const dx = Math.cos(rad) * len;
    const dy = -Math.sin(rad) * len; // PDF y inverted
    const color = defaultColors[f.label] || [100, 116, 139];

    const startX = cx + Math.cos(rad) * (boxSize / 2 + 0.5);
    const startY = cy - Math.sin(rad) * (boxSize / 2 + 0.5);
    drawArrow(pdf, startX, startY, startX + dx, startY + dy, color, 0.6);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...color);
    const lx = startX + dx + (dx > 0 ? 1 : dx < 0 ? -4 : -1);
    const ly = startY + dy + (dy > 0 ? 3 : dy < 0 ? -1 : 0);
    pdf.text(sanitizeForPDF(`${f.label} (${f.magnitude}N)`), lx, ly);
  });

  return yStart + height + 2;
}

function drawPipeFlowDiagram(
  pdf: jsPDF, params: Record<string, unknown>,
  x: number, yStart: number, width: number
): number {
  const height = 42;
  const title = (params.title as string) || 'Flow Through a Pipe';
  const a1 = (params.wideArea as number) || (params.area1 as number) || 4;
  const a2 = (params.narrowArea as number) || (params.area2 as number) || 2;
  const v1 = (params.wideVelocity as number) || (params.velocity1 as number) || 2;
  const v2 = (params.narrowVelocity as number) || (params.velocity2 as number) || (a1 / a2) * v1;

  // Background
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(x, yStart, width, height, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(55, 65, 81);
  pdf.text(sanitizeForPDF(title), x + 4, yStart + 5);

  const cx = x + width / 2;
  const cy = yStart + height / 2 + 2;
  const wideHalf = Math.sqrt(a1) * 3.5;
  const narrowHalf = Math.sqrt(a2) * 3.5;
  const pipeLen = width * 0.35;

  // Wide section (left)
  const wLeft = cx - pipeLen;
  const wRight = cx - pipeLen * 0.15;
  pdf.setDrawColor(71, 85, 105);
  pdf.setLineWidth(0.6);
  pdf.line(wLeft, cy - wideHalf, wRight, cy - wideHalf); // top
  pdf.line(wLeft, cy + wideHalf, wRight, cy + wideHalf); // bottom
  pdf.line(wLeft, cy - wideHalf, wLeft, cy + wideHalf);  // left cap

  // Narrow section (right)
  const nLeft = cx + pipeLen * 0.15;
  const nRight = cx + pipeLen;
  pdf.line(nLeft, cy - narrowHalf, nRight, cy - narrowHalf); // top
  pdf.line(nLeft, cy + narrowHalf, nRight, cy + narrowHalf); // bottom
  pdf.line(nRight, cy - narrowHalf, nRight, cy + narrowHalf); // right cap

  // Taper
  pdf.line(wRight, cy - wideHalf, nLeft, cy - narrowHalf);
  pdf.line(wRight, cy + wideHalf, nLeft, cy + narrowHalf);

  // Light fill
  pdf.setFillColor(219, 234, 254);
  // Wide section fill
  pdf.rect(wLeft + 0.3, cy - wideHalf + 0.3, wRight - wLeft - 0.6, wideHalf * 2 - 0.6, 'F');
  // Narrow section fill
  pdf.rect(nLeft + 0.3, cy - narrowHalf + 0.3, nRight - nLeft - 0.6, narrowHalf * 2 - 0.6, 'F');

  // Flow arrows — wide section (short, blue)
  const arrowScale = Math.min(8, pipeLen * 0.3) / Math.max(v1, v2, 1);
  const wMid = (wLeft + wRight) / 2;
  drawArrow(pdf, wMid - 2, cy, wMid - 2 + v1 * arrowScale, cy, [37, 99, 235], 0.5);
  drawArrow(pdf, wMid - 2, cy - wideHalf * 0.35, wMid - 2 + v1 * arrowScale, cy - wideHalf * 0.35, [147, 197, 253], 0.3);
  drawArrow(pdf, wMid - 2, cy + wideHalf * 0.35, wMid - 2 + v1 * arrowScale, cy + wideHalf * 0.35, [147, 197, 253], 0.3);

  // Flow arrows — narrow section (long, red)
  const nMid = (nLeft + nRight) / 2;
  drawArrow(pdf, nMid - 2, cy, nMid - 2 + v2 * arrowScale, cy, [220, 38, 38], 0.5);
  drawArrow(pdf, nMid - 2, cy - narrowHalf * 0.3, nMid - 2 + v2 * arrowScale, cy - narrowHalf * 0.3, [252, 165, 165], 0.3);
  drawArrow(pdf, nMid - 2, cy + narrowHalf * 0.3, nMid - 2 + v2 * arrowScale, cy + narrowHalf * 0.3, [252, 165, 165], 0.3);

  // Labels
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(37, 99, 235);
  pdf.text(sanitizeForPDF(`A1=${a1}  v1=${v1} m/s`), wMid - 8, cy - wideHalf - 2);
  pdf.setTextColor(220, 38, 38);
  pdf.text(sanitizeForPDF(`A2=${a2}  v2=${Math.round(v2 * 10) / 10} m/s`), nMid - 8, cy - narrowHalf - 2);

  return yStart + height + 2;
}

async function drawSvgDiagram(
  pdf: jsPDF, svg: string, title: string | undefined,
  x: number, yStart: number, width: number
): Promise<number> {
  let y = yStart;

  // Title
  if (title) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(55, 65, 81);
    pdf.text(sanitizeForPDF(title), x + 4, y + 5);
    y += 7;
  }

  // Rasterize SVG to canvas, then to image for PDF
  try {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('SVG load failed'));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    const scale = 2; // 2x for crisp rendering
    canvas.width = 400 * scale;
    canvas.height = 300 * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 300);
    ctx.drawImage(img, 0, 0, 400, 300);
    URL.revokeObjectURL(url);

    const imgData = canvas.toDataURL('image/png');
    const imgHeight = (width * 300) / 400; // maintain aspect ratio
    pdf.addImage(imgData, 'PNG', x, y, width, imgHeight);
    y += imgHeight + 2;
  } catch {
    // Fallback: just note that SVG couldn't be rendered
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text('[SVG diagram - could not render to PDF]', x + 4, y + 5);
    y += 8;
  }

  return y;
}

// Draw a visual representation of a whiteboard command. Returns new y position.
async function drawWhiteboardVisual(
  pdf: jsPDF, cmd: WhiteboardCommandData,
  x: number, y: number, width: number
): Promise<number> {
  if (cmd.action === 'showEquation' && cmd.latex) {
    return drawEquationVisual(pdf, String(cmd.latex), cmd.label as string | undefined, x, y, width);
  }

  if (cmd.action === 'showSvgDiagram' && cmd.svg) {
    return drawSvgDiagram(pdf, String(cmd.svg), cmd.title as string | undefined, x, y, width);
  }

  if (cmd.action === 'showDiagram') {
    const params = (cmd.params || {}) as Record<string, unknown>;
    const type = cmd.type as string;

    if (type === 'pipe-flow' || type === 'fluid-flow' || type === 'continuity') {
      return drawPipeFlowDiagram(pdf, params, x, y, width);
    }
    if (type === 'free-body') {
      return drawFreeBodyDiagram(pdf, params, x, y, width);
    }
    if (type === 'vectors' || type === 'velocity' || type === 'vector-addition') {
      return drawVectorsDiagram(pdf, params, x, y, width);
    }
  }

  return y; // No visual drawn
}

function describeWhiteboardCommand(cmd: WhiteboardCommandData): string {
  switch (cmd.action) {
    case 'showEquation':
      return `Equation${cmd.label ? `: ${cmd.label}` : ''}`;
    case 'showGraph':
      return `Graph: ${cmd.type || 'chart'}${(cmd.data as { title?: string })?.title ? ` - ${(cmd.data as { title?: string }).title}` : ''}`;
    case 'showDiagram': {
      const params = (cmd.params || {}) as Record<string, unknown>;
      return `Diagram: ${cmd.type || 'diagram'}${params.title ? ` - ${params.title}` : ''}`;
    }
    case 'drawVector':
      return `Vector: ${cmd.label || 'unlabeled'}`;
    case 'annotate':
      return `Note: ${cmd.text || ''}`;
    case 'showProblem': {
      const prob = (cmd.problem || {}) as Record<string, unknown>;
      return `Problem: ${prob.title || prob.statement || 'untitled'}`;
    }
    case 'showSolution':
      return `Solution: ${Array.isArray(cmd.steps) ? `${cmd.steps.length} steps` : 'steps'}`;
    case 'showTable':
      return `Table: ${Array.isArray(cmd.headers) ? cmd.headers.join(', ') : 'data'}`;
    case 'showSvgDiagram':
      return `Diagram: ${cmd.title || 'custom diagram'}`;
    case 'showWorkedExample':
      return `Worked Example`;
    default:
      return `Command: ${cmd.action}`;
  }
}

export async function exportTutorSessionPDF(
  transcript: TranscriptMessage[],
  whiteboardCommands: WhiteboardCommandData[],
  topicName: string,
  sessionGoal: string,
  studentName?: string,
  options?: { includeDebugData?: boolean }
): Promise<void> {
  const includeDebug = options?.includeDebugData ?? true;
  const { default: jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const textAreaWidth = contentWidth - 8;
  let y = 0;
  const LINE_HEIGHT = 4.5;

  const addPageIfNeeded = (space: number) => {
    if (y + space > 272) { pdf.addPage(); y = 20; }
  };

  const drawWrappedText = (
    text: string, x: number, maxWidth: number,
    opts: { size?: number; style?: string; color?: [number, number, number]; lineHeight?: number } = {}
  ) => {
    const { size = 9, style = 'normal', color = [74, 85, 104], lineHeight = LINE_HEIGHT } = opts;
    pdf.setFont('helvetica', style);
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    const safe = sanitizeForPDF(text);
    const lines: string[] = pdf.splitTextToSize(safe, maxWidth);
    for (const line of lines) {
      addPageIfNeeded(lineHeight + 1);
      pdf.text(line, x, y);
      y += lineHeight;
    }
  };

  // ── Header ──
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, pageWidth, 38, 'F');
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 35, pageWidth, 3, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AI Tutor Session', margin, 16);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Generated by Evelyn Learning', margin, 24);
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.text(sanitizeForPDF(dateStr), margin, 30);
  y = 48;

  // ── Session Info ──
  drawWrappedText(`Topic: ${topicName}`, margin, contentWidth, { size: 11, style: 'bold', color: [26, 32, 44], lineHeight: 6 });
  const goalLabel = sessionGoal === 'homework-help' ? 'Homework Help' : sessionGoal === 'concept-review' ? 'Concept Review' : sessionGoal === 'test-prep' ? 'Test Prep' : 'Practice';
  drawWrappedText(`Goal: ${goalLabel}${studentName ? ` | Student: ${studentName}` : ''}`, margin, contentWidth, { size: 10, color: [100, 116, 139], lineHeight: 6 });
  const studentMessages = transcript.filter(m => m.role === 'student').length;
  const tutorMessages = transcript.filter(m => m.role === 'tutor').length;
  drawWrappedText(`Messages: ${studentMessages} student, ${tutorMessages} tutor | Whiteboard items: ${whiteboardCommands.length}`, margin, contentWidth, { size: 10, color: [100, 116, 139], lineHeight: 6 });
  y += 4;

  // ── Whiteboard Content (visual) ──
  if (whiteboardCommands.length > 0) {
    addPageIfNeeded(14);
    drawWrappedText('Whiteboard Content', margin, contentWidth, { size: 12, style: 'bold', color: [26, 32, 44], lineHeight: 8 });

    for (let i = 0; i < whiteboardCommands.length; i++) {
      const cmd = whiteboardCommands[i];

      // Check if this command has a visual renderer
      const visualHeight = (cmd.action === 'showEquation') ? 18 :
        (cmd.action === 'showSvgDiagram') ? 100 :
        (cmd.action === 'showDiagram' && ['pipe-flow', 'fluid-flow', 'continuity', 'free-body', 'vectors', 'velocity', 'vector-addition'].includes(cmd.type as string)) ? 50 : 0;

      addPageIfNeeded(visualHeight + 14);

      // Command number badge + description
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      const badgeText = `#${i + 1}`;
      const badgeW = pdf.getTextWidth(badgeText) + 6;
      pdf.setFillColor(59, 130, 246);
      pdf.roundedRect(margin, y - 3, badgeW, 4.5, 1, 1, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.text(badgeText, margin + 3, y);

      // Description text next to badge
      const desc = describeWhiteboardCommand(cmd);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(59, 130, 246);
      pdf.text(sanitizeForPDF(desc), margin + badgeW + 3, y);
      y += 5;

      // Visual rendering
      const newY = await drawWhiteboardVisual(pdf, cmd, margin + 4, y, contentWidth - 8);
      if (newY > y) {
        y = newY;
      } else {
        // No visual renderer — fall back to text description
        if (cmd.action === 'showDiagram') {
          const params = (cmd.params || {}) as Record<string, unknown>;
          if (params.description) {
            drawWrappedText(String(params.description), margin + 8, textAreaWidth - 4, { size: 8, style: 'italic', color: [100, 116, 139] });
          }
          if (params.forces && Array.isArray(params.forces)) {
            const forceDescs = (params.forces as { magnitude?: number; direction?: number; label?: string }[])
              .map(f => `${f.label || '?'}: ${f.magnitude || '?'}N @ ${f.direction || '?'}deg`)
              .join(', ');
            drawWrappedText(`Forces: ${forceDescs}`, margin + 8, textAreaWidth - 4, { size: 8, style: 'italic', color: [100, 116, 139] });
          }
          if (params.vectors && Array.isArray(params.vectors)) {
            const vecDescs = (params.vectors as { magnitude?: number; direction?: number; label?: string }[])
              .map(v => `${v.label || '?'}: ${v.magnitude || '?'} @ ${v.direction || '?'}deg`)
              .join(', ');
            drawWrappedText(`Vectors: ${vecDescs}`, margin + 8, textAreaWidth - 4, { size: 8, style: 'italic', color: [100, 116, 139] });
          }
        }
        if (cmd.action === 'showProblem' && cmd.problem) {
          const prob = cmd.problem as Record<string, unknown>;
          if (prob.statement) {
            drawWrappedText(String(prob.statement), margin + 8, textAreaWidth - 4, { size: 8, color: [55, 65, 81] });
          }
        }
      }

      // Debug JSON
      if (includeDebug) {
        const rawJson = JSON.stringify(cmd, null, 0);
        const truncated = rawJson.length <= 400 ? rawJson : rawJson.substring(0, 400) + '...';
        drawWrappedText(`[debug] ${truncated}`, margin + 8, textAreaWidth - 4, { size: 5.5, color: [180, 180, 190] });
      }

      y += 3;
    }
    y += 4;
  }

  // ── Transcript ──
  addPageIfNeeded(10);
  drawWrappedText('Conversation Transcript', margin, contentWidth, { size: 12, style: 'bold', color: [26, 32, 44], lineHeight: 8 });

  for (const msg of transcript) {
    if (msg.role === 'system') continue;
    addPageIfNeeded(14);

    const isStudent = msg.role === 'student';
    const label = isStudent ? 'STUDENT' : 'TUTOR';
    const labelColor: [number, number, number] = isStudent ? [59, 130, 246] : [147, 51, 234];

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    const badgeW = pdf.getTextWidth(label) + 6;
    pdf.setFillColor(...labelColor);
    pdf.roundedRect(margin, y - 3, badgeW, 4.5, 1, 1, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(label, margin + 3, y);

    const ts = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
    const timeStr = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text(timeStr, margin + badgeW + 4, y);
    y += 5;

    drawWrappedText(msg.text, margin + 4, textAreaWidth, { size: 9, color: [55, 65, 81] });

    if (msg.pedagogicalIntent) {
      drawWrappedText(`[${msg.pedagogicalIntent}]`, margin + 4, textAreaWidth, { size: 7, style: 'italic', color: [156, 163, 175] });
    }

    // Inline whiteboard visuals for commands attached to this message
    if (msg.whiteboardCommands && msg.whiteboardCommands.length > 0) {
      for (const cmd of msg.whiteboardCommands) {
        addPageIfNeeded(20);
        const newY = await drawWhiteboardVisual(pdf, cmd, margin + 4, y, textAreaWidth);
        if (newY > y) {
          y = newY;
        } else {
          const cmdDesc = describeWhiteboardCommand(cmd);
          drawWrappedText(`[Whiteboard] ${cmdDesc}`, margin + 4, textAreaWidth, { size: 8, style: 'italic', color: [59, 130, 246] });
        }
      }
    }

    y += 3;
  }

  // ── Footer ──
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, 282, pageWidth - margin, 282);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text('Generated by Evelyn Learning -- AI Voice Tutor', margin, 287);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 22, 287);
  }

  const safeTopicName = topicName.replace(/[^a-zA-Z0-9]+/g, '_');
  const filename = `Tutor_Session_${safeTopicName}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}
