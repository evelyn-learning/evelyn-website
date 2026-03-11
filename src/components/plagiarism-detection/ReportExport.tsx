'use client';

import React, { useState } from 'react';
import type { EnhancedAnalysisResult, ReportMetadata } from './types';
import { formatReportDate } from './utils';

export interface ComparisonExportData {
  originalText: string;
  revisedText: string;
  changes: {
    summary: string;
    flaggedSectionsRemoved: number;
    flaggedSectionsRewritten: number;
    rewriteAppearsAIGenerated: boolean;
    addedText: string[];
    removedText: string[];
  };
  revisedResult: EnhancedAnalysisResult;
}

interface ReportExportProps {
  result: EnhancedAnalysisResult;
  submittedText: string;
  enabled?: boolean;
  comparisonData?: ComparisonExportData;
}

export default function ReportExport({ result, submittedText, enabled = true, comparisonData }: ReportExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [teacherNotes, setTeacherNotes] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  if (!enabled) return null;

  const metadata: ReportMetadata = {
    studentName,
    assignmentName,
    teacherNotes,
    analysisDate: formatReportDate(),
  };

  const handlePDFExport = async () => {
    setIsExporting(true);
    try {
      const { exportIntegrityReportPDF } = await import('@/lib/utils/export/pdf-integrity-report');
      await exportIntegrityReportPDF(
        submittedText,
        result,
        metadata,
        comparisonData ? {
          revisedResult: comparisonData.revisedResult,
          changes: comparisonData.changes,
        } : undefined
      );
    } catch (err) {
      console.error('PDF export error:', err);
    }
    setIsExporting(false);
  };

  const buildReportHTML = (opts?: { isComparison?: boolean; comparisonData?: { originalText: string; revisedText: string; changes: { summary: string; flaggedSectionsRemoved: number; flaggedSectionsRewritten: number; rewriteAppearsAIGenerated: boolean; addedText: string[]; removedText: string[] }; revisedResult: typeof result } }) => {
    const wordCount = submittedText.trim().split(/\s+/).filter((w: string) => w).length;

    const annotationTypeLabel: Record<string, string> = {
      'ai-generated': 'AI-GENERATED',
      suspicious: 'NEEDS REVIEW',
      plagiarism: 'PLAGIARISM',
    };
    const annotationTypeColor: Record<string, string> = {
      'ai-generated': '#fecaca',
      suspicious: '#fef08a',
      plagiarism: '#fed7aa',
    };

    const flaggedHTML = result.annotations.map(ann => `
      <div style="margin-bottom: 12px; padding: 10px; border-left: 3px solid ${annotationTypeColor[ann.type] || '#e5e7eb'}; background: ${annotationTypeColor[ann.type] || '#f9fafb'}20;">
        <span style="font-size: 10px; font-weight: bold; color: #666; text-transform: uppercase;">${annotationTypeLabel[ann.type] || 'FLAGGED'}</span>
        <p style="margin: 4px 0; font-style: italic; color: #374151;">"${ann.matchedText}"</p>
        <p style="margin: 2px 0; font-size: 12px; color: #6b7280;">${ann.reason}</p>
      </div>
    `).join('');

    const concernsHTML = result.concerns.map(c => `
      <div style="margin-bottom: 8px; padding: 8px; border-radius: 4px; background: ${c.severity === 'high' ? '#fef2f2' : c.severity === 'medium' ? '#fefce8' : '#eff6ff'};">
        <strong style="font-size: 11px; text-transform: uppercase;">${c.severity}</strong> &mdash; ${c.type}
        <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">${c.description}</p>
      </div>
    `).join('');

    const recsHTML = result.recommendations.map(r => `<li style="margin-bottom: 4px;">${r}</li>`).join('');

    let comparisonHTML = '';
    if (opts?.isComparison && opts.comparisonData) {
      const cd = opts.comparisonData;
      const rv = cd.revisedResult;
      const revisedWordCount = cd.revisedText.trim().split(/\s+/).filter((w: string) => w).length;

      const revisedFlaggedHTML = rv.annotations.map(ann => `
        <div style="margin-bottom: 12px; padding: 10px; border-left: 3px solid ${annotationTypeColor[ann.type] || '#e5e7eb'}; background: ${annotationTypeColor[ann.type] || '#f9fafb'}20;">
          <span style="font-size: 10px; font-weight: bold; color: #666; text-transform: uppercase;">${annotationTypeLabel[ann.type] || 'FLAGGED'}</span>
          <p style="margin: 4px 0; font-style: italic; color: #374151;">"${ann.matchedText}"</p>
          <p style="margin: 2px 0; font-size: 12px; color: #6b7280;">${ann.reason}</p>
        </div>
      `).join('');

      comparisonHTML = `
        <h2>Resubmission Comparison</h2>
        <div style="padding: 12px; border-radius: 8px; background: ${cd.changes.rewriteAppearsAIGenerated ? '#fef2f2' : '#f0fdf4'}; border: 1px solid ${cd.changes.rewriteAppearsAIGenerated ? '#fecaca' : '#bbf7d0'}; margin-bottom: 16px;">
          <strong>Change Summary</strong>
          <p style="font-size: 13px; color: #374151; margin: 6px 0;">${cd.changes.summary}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; text-align: center; margin-top: 8px;">
            <div style="background: white; padding: 8px; border-radius: 6px;"><div style="font-size: 18px; font-weight: bold;">${cd.changes.flaggedSectionsRemoved}</div><div style="font-size: 10px; color: #64748b;">Sections Removed</div></div>
            <div style="background: white; padding: 8px; border-radius: 6px;"><div style="font-size: 18px; font-weight: bold;">${cd.changes.flaggedSectionsRewritten}</div><div style="font-size: 10px; color: #64748b;">Sections Rewritten</div></div>
            <div style="background: white; padding: 8px; border-radius: 6px;"><div style="font-size: 18px; font-weight: bold; color: #16a34a;">${cd.changes.addedText.length}</div><div style="font-size: 10px; color: #64748b;">New Passages</div></div>
            <div style="background: white; padding: 8px; border-radius: 6px;"><div style="font-size: 18px; font-weight: bold; color: ${cd.changes.rewriteAppearsAIGenerated ? '#dc2626' : '#16a34a'};">${cd.changes.rewriteAppearsAIGenerated ? 'Yes' : 'No'}</div><div style="font-size: 10px; color: #64748b;">Rewrite AI-Generated</div></div>
          </div>
        </div>

        <h2>Revised Submission Analysis</h2>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Word Count: ${revisedWordCount}</div>
        <div class="scores">
          <div class="score-card" style="background: ${rv.overallScore >= 60 ? '#f0fdf4' : rv.overallScore >= 30 ? '#fefce8' : '#fef2f2'};">
            <div class="value" style="color: ${rv.overallScore >= 60 ? '#16a34a' : rv.overallScore >= 30 ? '#ca8a04' : '#dc2626'};">${rv.overallScore}%</div>
            <div class="label">Overall Originality</div>
            <div class="verdict">${rv.overallVerdict}</div>
          </div>
          <div class="score-card" style="background: #faf5ff;">
            <div class="value" style="color: #7c3aed;">${rv.aiDetection.score}%</div>
            <div class="label">AI Detection</div>
            <div class="verdict">${rv.aiDetection.verdict}</div>
          </div>
          <div class="score-card" style="background: #fff7ed;">
            <div class="value" style="color: #ea580c;">${rv.plagiarism.score}%</div>
            <div class="label">Plagiarism</div>
            <div class="verdict">${rv.plagiarism.verdict}</div>
          </div>
        </div>
        ${rv.annotations.length > 0 ? `<h3 style="font-size: 14px; margin-top: 16px;">Revised Submission &mdash; Flagged Passages</h3>${revisedFlaggedHTML}` : '<p style="color: #16a34a; font-size: 13px;">No flagged passages in revised submission.</p>'}

        ${cd.changes.removedText.length > 0 ? `<h3 style="font-size: 14px; margin-top: 16px;">Removed Passages</h3>${cd.changes.removedText.map(t => `<div style="padding: 8px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; margin-bottom: 6px; font-size: 13px; color: #991b1b; text-decoration: line-through; font-style: italic;">"${t}"</div>`).join('')}` : ''}
        ${cd.changes.addedText.length > 0 ? `<h3 style="font-size: 14px; margin-top: 16px;">Added Passages</h3>${cd.changes.addedText.map(t => `<div style="padding: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; margin-bottom: 6px; font-size: 13px; color: #166534;">"${t}"</div>`).join('')}` : ''}
      `;
    }

    return `<!DOCTYPE html>
<html>
<head>
  <title>Academic Integrity Report${studentName ? ` - ${studentName}` : ''}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #1a1a2e; line-height: 1.5; }
    .header { background: linear-gradient(135deg, #ea580c, #dc2626); color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; }
    .header h1 { margin: 0 0 4px; font-size: 22px; }
    .header p { margin: 0; opacity: 0.9; font-size: 13px; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .meta-item { background: #f8fafc; padding: 10px; border-radius: 6px; }
    .meta-item label { font-size: 11px; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px; }
    .meta-item span { font-weight: 600; }
    .scores { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .score-card { text-align: center; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; }
    .score-card .value { font-size: 28px; font-weight: bold; }
    .score-card .label { font-size: 11px; color: #64748b; }
    .score-card .verdict { font-size: 12px; margin-top: 4px; }
    h2 { font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin-top: 28px; }
    h3 { font-size: 14px; color: #374151; }
    .teacher-notes { background: #fefce8; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin-top: 24px; white-space: pre-wrap; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
    .print-btn { display: inline-block; margin-bottom: 24px; padding: 10px 20px; background: #ea580c; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .print-btn:hover { background: #c2410c; }
    @media print { .print-btn { display: none; } body { padding: 0; } .header, .score-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print This Report</button>

  <div class="header">
    <h1>Academic Integrity Report${opts?.isComparison ? ' &mdash; Resubmission Comparison' : ''}</h1>
    <p>Generated by Evelyn Learning &mdash; ${metadata.analysisDate}</p>
  </div>

  <div class="meta">
    ${studentName ? `<div class="meta-item"><label>Student</label><span>${studentName}</span></div>` : ''}
    ${assignmentName ? `<div class="meta-item"><label>Assignment</label><span>${assignmentName}</span></div>` : ''}
    <div class="meta-item"><label>Date</label><span>${metadata.analysisDate}</span></div>
    <div class="meta-item"><label>Word Count</label><span>${wordCount}</span></div>
  </div>

  <h2>${opts?.isComparison ? 'Original Submission Analysis' : 'Analysis Results'}</h2>
  <div class="scores">
    <div class="score-card" style="background: ${result.overallScore >= 60 ? '#f0fdf4' : result.overallScore >= 30 ? '#fefce8' : '#fef2f2'};">
      <div class="value" style="color: ${result.overallScore >= 60 ? '#16a34a' : result.overallScore >= 30 ? '#ca8a04' : '#dc2626'};">${result.overallScore}%</div>
      <div class="label">Overall Originality</div>
      <div class="verdict">${result.overallVerdict}</div>
    </div>
    <div class="score-card" style="background: #faf5ff;">
      <div class="value" style="color: #7c3aed;">${result.aiDetection.score}%</div>
      <div class="label">AI Detection</div>
      <div class="verdict">${result.aiDetection.verdict}</div>
    </div>
    <div class="score-card" style="background: #fff7ed;">
      <div class="value" style="color: #ea580c;">${result.plagiarism.score}%</div>
      <div class="label">Plagiarism</div>
      <div class="verdict">${result.plagiarism.verdict}</div>
    </div>
  </div>

  ${result.aiDetection.modelAttribution ? `<p style="font-size: 13px; color: #7c3aed; font-style: italic;">${result.aiDetection.modelAttribution}</p>` : ''}

  ${result.plagiarism.sourceMatches.length > 0 ? `<h2>Plagiarism Source Matches</h2>
  ${result.plagiarism.copyscapePercent ? `<p style="font-size: 12px; color: #1d4ed8; margin-bottom: 12px;">Web search found ${result.plagiarism.copyscapePercent}% of submitted text matching online sources.</p>` : ''}
  ${result.plagiarism.sourceMatches.map(match => `
    <div style="margin-bottom: 10px; padding: 10px; border-left: 3px solid ${match.verified ? '#3b82f6' : '#f97316'}; background: ${match.verified ? '#eff6ff' : '#fff7ed'};">
      <div style="display: flex; align-items: center; gap: 8px;">
        <strong style="font-size: 13px; color: #1f2937;">${match.title}</strong>
        ${match.verified ? '<span style="font-size: 10px; background: #dbeafe; color: #1d4ed8; padding: 1px 6px; border-radius: 4px;">Web Match</span>' : ''}
        <span style="font-size: 12px; color: ${match.verified ? '#1d4ed8' : '#ea580c'}; margin-left: auto;">${match.matchPercent}%</span>
      </div>
      ${match.url ? `<a href="${match.url}" style="font-size: 11px; color: #3b82f6; text-decoration: none;">${match.url}</a>` : ''}
      ${match.verified && match.snippetText ? `<p style="font-size: 11px; color: #6b7280; font-style: italic; margin-top: 6px; border-left: 2px solid #93c5fd; padding-left: 8px;">"${match.snippetText}"</p>` : ''}
      ${match.verified && match.wordsMatched ? `<p style="font-size: 10px; color: #9ca3af; margin-top: 2px;">${match.wordsMatched} words matched</p>` : ''}
    </div>
  `).join('')}` : ''}

  ${result.annotations.length > 0 ? `<h2>Flagged Passages</h2>${flaggedHTML}` : ''}
  ${result.concerns.length > 0 ? `<h2>Concerns</h2>${concernsHTML}` : ''}
  ${result.recommendations.length > 0 ? `<h2>Recommendations</h2><ul style="font-size: 13px; color: #4b5563;">${recsHTML}</ul>` : ''}

  ${comparisonHTML}

  ${teacherNotes ? `<h2>Teacher Notes</h2><div class="teacher-notes">${teacherNotes}</div>` : ''}

  <div class="footer">Generated by Evelyn Learning &mdash; FERPA compliant analysis tool</div>
</body>
</html>`;
  };

  const [isSavingReport, setIsSavingReport] = useState(false);

  const handlePrintView = async (opts?: Parameters<typeof buildReportHTML>[0]) => {
    const html = buildReportHTML(opts);
    setIsSavingReport(true);

    try {
      // Save to DB for a shareable permalink
      const res = await fetch('/api/showcase/plagiarism-detection/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, studentName, assignmentName }),
      });
      const data = await res.json();

      if (data.id) {
        window.open(`/api/showcase/plagiarism-detection/report/${data.id}`, '_blank');
      } else {
        // Fallback to blob URL if save fails
        const blob = new Blob([html], { type: 'text/html' });
        window.open(URL.createObjectURL(blob), '_blank');
      }
    } catch {
      // Fallback to blob URL
      const blob = new Blob([html], { type: 'text/html' });
      window.open(URL.createObjectURL(blob), '_blank');
    }

    setIsSavingReport(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Generate Report
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">Generate Report</h4>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg">
          &times;
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Student Name</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student name"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Assignment Name</label>
          <input
            type="text"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            placeholder="Enter assignment name"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Teacher Notes</label>
        <textarea
          value={teacherNotes}
          onChange={(e) => setTeacherNotes(e.target.value)}
          placeholder="Add notes for the report (optional)..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none h-20 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePDFExport}
          disabled={isExporting}
          className="flex-1 py-2.5 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isExporting ? 'Generating...' : 'Download PDF'}
        </button>
        <button
          onClick={() => handlePrintView(comparisonData ? { isComparison: true, comparisonData } : undefined)}
          disabled={isSavingReport}
          className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSavingReport ? 'Generating Link...' : 'Shareable Report'}
        </button>
      </div>
    </div>
  );
}
