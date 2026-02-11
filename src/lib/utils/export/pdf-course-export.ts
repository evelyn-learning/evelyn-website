export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz' | 'activity';
  content?: string;
  questions?: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

export interface GeneratedCourse {
  title: string;
  description: string;
  learningObjectives: string[];
  estimatedDuration: string;
  modules: CourseModule[];
  assessmentStrategy: string;
}

/**
 * Replace Unicode characters outside WinAnsi (U+00FF) with ASCII-safe
 * equivalents so jsPDF's built-in Helvetica renders them correctly.
 */
export function sanitize(text: string): string {
  return text
    // Smart quotes & dashes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, '--')
    .replace(/\u2013/g, '-')
    // Bullets & symbols
    .replace(/\u2022/g, '-')
    .replace(/[\u2713\u2714]/g, '(v)')
    .replace(/\u2192/g, '->')
    .replace(/\u2190/g, '<-')
    // Math operators
    .replace(/\u221A/g, 'sqrt')
    .replace(/\u2248/g, '~=')
    .replace(/\u2260/g, '!=')
    .replace(/\u2264/g, '<=')
    .replace(/\u2265/g, '>=')
    .replace(/\u221E/g, 'inf')
    // Greek letters common in STEM
    .replace(/\u0391/g, 'A').replace(/\u03B1/g, 'alpha')
    .replace(/\u0392/g, 'B').replace(/\u03B2/g, 'beta')
    .replace(/\u0393/g, 'Gamma').replace(/\u03B3/g, 'gamma')
    .replace(/\u0394/g, 'Delta').replace(/\u03B4/g, 'delta')
    .replace(/\u03B5/g, 'epsilon')
    .replace(/\u03B6/g, 'zeta')
    .replace(/\u03B7/g, 'eta')
    .replace(/\u0398/g, 'Theta').replace(/\u03B8/g, 'theta')
    .replace(/\u03B9/g, 'iota')
    .replace(/\u03BA/g, 'kappa')
    .replace(/\u039B/g, 'Lambda').replace(/\u03BB/g, 'lambda')
    .replace(/\u03BC/g, 'mu')
    .replace(/\u03BD/g, 'nu')
    .replace(/\u039E/g, 'Xi').replace(/\u03BE/g, 'xi')
    .replace(/\u03A0/g, 'Pi').replace(/\u03C0/g, 'pi')
    .replace(/\u03C1/g, 'rho')
    .replace(/\u03A3/g, 'Sigma').replace(/\u03C3/g, 'sigma')
    .replace(/\u03C4/g, 'tau')
    .replace(/\u03A6/g, 'Phi').replace(/\u03C6/g, 'phi')
    .replace(/\u03A8/g, 'Psi').replace(/\u03C8/g, 'psi')
    .replace(/\u03A9/g, 'Omega').replace(/\u03C9/g, 'omega');
}

export async function exportCourseToPDF(course: GeneratedCourse): Promise<void> {
  const { default: jsPDF } = await import('jspdf');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addPageIfNeeded = (neededSpace: number) => {
    if (y + neededSpace > 270) {
      pdf.addPage();
      y = 20;
    }
  };

  /** Draw a small filled circle as a bullet point. */
  const drawBullet = (x: number, cy: number, r: number, rgb: [number, number, number]) => {
    pdf.setFillColor(...rgb);
    pdf.circle(x + r, cy - r, r, 'F');
  };

  // Header banner
  pdf.setFillColor(8, 145, 178); // cyan-600
  pdf.rect(0, 0, pageWidth, 45, 'F');
  pdf.setFillColor(37, 99, 235); // blue-600 accent strip
  pdf.rect(0, 42, pageWidth, 3, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text(sanitize(course.title), margin, 18);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const descLines = pdf.splitTextToSize(sanitize(course.description), contentWidth);
  descLines.slice(0, 2).forEach((line: string, i: number) => {
    pdf.text(line, margin, 26 + i * 4.5);
  });

  pdf.setFontSize(9);
  pdf.text(
    `Duration: ${sanitize(course.estimatedDuration)}  |  ${course.modules.length} modules`,
    margin,
    40,
  );

  y = 55;

  // Learning Objectives
  pdf.setTextColor(26, 32, 44);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Learning Objectives', margin, y);
  y += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(74, 85, 104);

  course.learningObjectives.forEach((obj) => {
    addPageIfNeeded(8);
    const lines = pdf.splitTextToSize(sanitize(obj), contentWidth - 8);
    drawBullet(margin, y, 1.2, [8, 145, 178]);
    lines.forEach((line: string, i: number) => {
      pdf.text(line, margin + 8, y + i * 4.5);
    });
    y += lines.length * 4.5 + 2;
  });

  y += 4;

  // Divider
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Modules
  const typeBadgeColors: Record<string, [number, number, number]> = {
    video: [59, 130, 246],
    reading: [147, 51, 234],
    quiz: [245, 158, 11],
    activity: [34, 197, 94],
  };

  course.modules.forEach((mod, idx) => {
    addPageIfNeeded(25);

    // Module header
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 32, 44);
    pdf.text(sanitize(`Module ${idx + 1}: ${mod.title}`), margin, y);
    y += 6;

    // Type badge and duration
    const badgeColor = typeBadgeColors[mod.type] || [107, 114, 128];
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    const badgeText = mod.type.toUpperCase();
    const badgeWidth = pdf.getTextWidth(badgeText) + 6;
    pdf.setFillColor(...badgeColor);
    pdf.roundedRect(margin, y - 3.5, badgeWidth, 5, 1, 1, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(badgeText, margin + 3, y);

    pdf.setTextColor(113, 128, 150);
    pdf.setFont('helvetica', 'normal');
    pdf.text(sanitize(mod.duration), margin + badgeWidth + 4, y);
    y += 6;

    // Module content
    if (mod.content) {
      pdf.setFontSize(9.5);
      pdf.setTextColor(74, 85, 104);
      const contentLines = pdf.splitTextToSize(sanitize(mod.content), contentWidth);
      contentLines.forEach((line: string) => {
        addPageIfNeeded(5);
        pdf.text(line, margin, y);
        y += 4.5;
      });
      y += 2;
    }

    // Quiz questions
    if (mod.type === 'quiz' && mod.questions) {
      mod.questions.forEach((q, qIdx) => {
        addPageIfNeeded(15);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(26, 32, 44);
        const qLines = pdf.splitTextToSize(
          sanitize(`${qIdx + 1}. ${q.question}`),
          contentWidth - 4,
        );
        qLines.forEach((line: string) => {
          addPageIfNeeded(5);
          pdf.text(line, margin + 4, y);
          y += 4.5;
        });
        y += 1;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        q.options.forEach((opt, oIdx) => {
          addPageIfNeeded(6);
          const letter = String.fromCharCode(65 + oIdx);
          const isCorrect = oIdx === q.correct;
          const label = sanitize(`${letter}. ${opt}`);
          if (isCorrect) {
            // Green highlight background behind correct answer
            const textW = pdf.getTextWidth(label);
            pdf.setFillColor(240, 253, 244); // green-50
            pdf.roundedRect(margin + 6, y - 3.5, textW + 8, 5, 1, 1, 'F');
            drawBullet(margin + 7, y, 1, [22, 163, 74]);
            pdf.setTextColor(22, 163, 74);
            pdf.text(label, margin + 12, y);
          } else {
            pdf.setTextColor(74, 85, 104);
            pdf.text(label, margin + 12, y);
          }
          y += 4.5;
        });
        y += 3;
      });
    }

    y += 4;
  });

  // Assessment Strategy
  addPageIfNeeded(25);
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(26, 32, 44);
  pdf.text('Assessment Strategy', margin, y);
  y += 8;

  pdf.setFontSize(9.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(74, 85, 104);
  const strategyLines = pdf.splitTextToSize(
    sanitize(course.assessmentStrategy),
    contentWidth,
  );
  strategyLines.forEach((line: string) => {
    addPageIfNeeded(5);
    pdf.text(line, margin, y);
    y += 4.5;
  });

  // Footer on each page
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(180, 180, 180);
    pdf.text('Built by Evelyn Learning  |  evelynlearning.com', margin, 290);
    pdf.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 20,
      290,
    );
  }

  const filename = course.title.replace(/[^a-zA-Z0-9]+/g, '_') + '_Outline.pdf';
  pdf.save(filename);
}
