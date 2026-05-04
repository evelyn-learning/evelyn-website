'use client';

import React, { useState, useMemo } from 'react';
import { AI_VERDICTS, PLAGIARISM_VERDICTS, getVerdict } from './constants';
import type { BatchSubmission, ReportMetadata } from './types';
import { formatReportDate } from './utils';

interface BatchDashboardProps {
  submissions: BatchSubmission[];
  onSelectSubmission: (submission: BatchSubmission) => void;
  enabled?: boolean;
}

type SortKey = 'fileName' | 'overallScore' | 'aiScore' | 'plagiarismScore' | 'status';
type SortDir = 'asc' | 'desc';
type FilterStatus = 'all' | 'concerns' | 'review' | 'original';

export default function BatchDashboard({ submissions, onSelectSubmission, enabled = true }: BatchDashboardProps) {
  const [sortKey, setSortKey] = useState<SortKey>('overallScore');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [isExportingAll, setIsExportingAll] = useState(false);

  if (!enabled || submissions.length === 0) return null;

  const completed = submissions.filter(s => s.status === 'complete' && s.result);

  const filtered = useMemo(() => {
    let list = [...completed];

    if (filterStatus !== 'all') {
      list = list.filter(s => {
        const score = s.result!.overallScore;
        if (filterStatus === 'concerns') return score < 40;
        if (filterStatus === 'review') return score >= 40 && score < 75;
        return score >= 75;
      });
    }

    list.sort((a, b) => {
      const ar = a.result!;
      const br = b.result!;
      let cmp = 0;

      switch (sortKey) {
        case 'fileName': cmp = a.fileName.localeCompare(b.fileName); break;
        case 'overallScore': cmp = ar.overallScore - br.overallScore; break;
        case 'aiScore': cmp = ar.aiDetection.score - br.aiDetection.score; break;
        case 'plagiarismScore': cmp = ar.plagiarism.score - br.plagiarism.score; break;
        case 'status': cmp = ar.overallScore - br.overallScore; break;
      }

      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [completed, sortKey, sortDir, filterStatus]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
    <span className={`ml-1 text-xs ${active ? 'text-orange-600' : 'text-gray-300'}`}>
      {active ? (dir === 'asc' ? '\u2191' : '\u2193') : '\u2195'}
    </span>
  );

  const stats = {
    total: completed.length,
    concerns: completed.filter(s => s.result!.overallScore < 40).length,
    review: completed.filter(s => s.result!.overallScore >= 40 && s.result!.overallScore < 75).length,
    original: completed.filter(s => s.result!.overallScore >= 75).length,
  };

  const handleExportAll = async () => {
    setIsExportingAll(true);
    try {
      const { default: JSZip } = await import('jszip');
      const { generateIntegrityReportBlob } = await import('@/lib/utils/export/pdf-integrity-report');

      const zip = new JSZip();

      for (const sub of completed) {
        const metadata: ReportMetadata = {
          studentName: sub.fileName.replace(/\.[^.]+$/, ''),
          assignmentName: '',
          teacherNotes: '',
          analysisDate: formatReportDate(),
        };

        const pdfBlob = await generateIntegrityReportBlob(sub.text || '', sub.result!, metadata);
        const safeName = sub.fileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
        zip.file(`${safeName}_Integrity_Report.pdf`, pdfBlob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Class_Integrity_Reports_${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export all error:', err);
    }
    setIsExportingAll(false);
  };

  const getScoreCell = (score: number, max100isGood: boolean) => {
    const value = max100isGood ? score : score;
    const color = max100isGood
      ? (value >= 60 ? 'text-green-600' : value >= 30 ? 'text-yellow-600' : 'text-red-600')
      : (value <= 25 ? 'text-green-600' : value <= 50 ? 'text-yellow-600' : 'text-red-600');
    return <span className={`font-semibold ${color}`}>{score}%</span>;
  };

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        <button onClick={() => setFilterStatus('all')} className={`p-3 rounded-xl text-center transition ${filterStatus === 'all' ? 'bg-gray-200 ring-2 ring-gray-400' : 'bg-gray-50 hover:bg-gray-100'}`}>
          <div className="text-xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </button>
        <button onClick={() => setFilterStatus('original')} className={`p-3 rounded-xl text-center transition ${filterStatus === 'original' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-green-50 hover:bg-green-100'}`}>
          <div className="text-xl font-bold text-green-600">{stats.original}</div>
          <div className="text-xs text-green-600">Original</div>
        </button>
        <button onClick={() => setFilterStatus('review')} className={`p-3 rounded-xl text-center transition ${filterStatus === 'review' ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'bg-yellow-50 hover:bg-yellow-100'}`}>
          <div className="text-xl font-bold text-yellow-600">{stats.review}</div>
          <div className="text-xs text-yellow-600">Needs Review</div>
        </button>
        <button onClick={() => setFilterStatus('concerns')} className={`p-3 rounded-xl text-center transition ${filterStatus === 'concerns' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-red-50 hover:bg-red-100'}`}>
          <div className="text-xl font-bold text-red-600">{stats.concerns}</div>
          <div className="text-xs text-red-600">Concerns</div>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none" onClick={() => handleSort('fileName')}>
                  File <SortIcon active={sortKey === 'fileName'} dir={sortDir} />
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 cursor-pointer select-none" onClick={() => handleSort('overallScore')}>
                  Originality <SortIcon active={sortKey === 'overallScore'} dir={sortDir} />
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 cursor-pointer select-none" onClick={() => handleSort('aiScore')}>
                  AI Score <SortIcon active={sortKey === 'aiScore'} dir={sortDir} />
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 cursor-pointer select-none" onClick={() => handleSort('plagiarismScore')}>
                  Plagiarism <SortIcon active={sortKey === 'plagiarismScore'} dir={sortDir} />
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sub => {
                const r = sub.result!;
                const aiVerdict = getVerdict(r.aiDetection.score, AI_VERDICTS);
                const plagVerdict = getVerdict(r.plagiarism.score, PLAGIARISM_VERDICTS);

                return (
                  <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800 truncate max-w-[200px]" title={sub.fileName}>
                      {sub.fileName}
                    </td>
                    <td className="text-center px-4 py-3">{getScoreCell(r.overallScore, true)}</td>
                    <td className="text-center px-4 py-3">
                      <span title={aiVerdict.label}>{getScoreCell(r.aiDetection.score, false)}</span>
                    </td>
                    <td className="text-center px-4 py-3">
                      <span title={plagVerdict.label}>{getScoreCell(r.plagiarism.score, false)}</span>
                    </td>
                    <td className="text-center px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.overallScore >= 60 ? 'bg-green-100 text-green-700'
                        : r.overallScore >= 30 ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                        {r.overallVerdict}
                      </span>
                    </td>
                    <td className="text-center px-4 py-3">
                      <button
                        onClick={() => onSelectSubmission(sub)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export All */}
      {completed.length > 0 && (
        <button
          onClick={handleExportAll}
          disabled={isExportingAll}
          className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isExportingAll ? 'Generating ZIP...' : `Export All Reports (${completed.length} PDFs)`}
        </button>
      )}
    </div>
  );
}
