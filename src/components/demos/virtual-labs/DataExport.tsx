'use client';

import React, { useState } from 'react';

interface DataPoint {
  time: number;
  balls: { x: number; y: number; vx: number; vy: number; speed: number; ke: number; pe: number }[];
}

interface DataExportProps {
  labType: 'physics' | 'chemistry';
  dataPoints: DataPoint[];
  labContext: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
}

export default function DataExport({
  labType,
  dataPoints,
  labContext,
  onStartRecording,
  onStopRecording,
  isRecording,
}: DataExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const exportCSV = () => {
    if (dataPoints.length === 0) return;

    const maxBalls = Math.max(...dataPoints.map(d => d.balls.length));
    const headers = ['Time (s)'];
    for (let i = 0; i < maxBalls; i++) {
      headers.push(
        `Ball${i + 1}_X`, `Ball${i + 1}_Y`,
        `Ball${i + 1}_Vx`, `Ball${i + 1}_Vy`,
        `Ball${i + 1}_Speed`, `Ball${i + 1}_KE`, `Ball${i + 1}_PE`
      );
    }

    const rows = dataPoints.map(dp => {
      const row: (string | number)[] = [(dp.time / 60).toFixed(2)];
      for (let i = 0; i < maxBalls; i++) {
        const b = dp.balls[i];
        if (b) {
          row.push(b.x.toFixed(1), b.y.toFixed(1), b.vx.toFixed(2), b.vy.toFixed(2), b.speed.toFixed(2), b.ke.toFixed(2), b.pe.toFixed(2));
        } else {
          row.push('', '', '', '', '', '', '');
        }
      }
      return row.join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `virtual-lab-${labType}-data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReport = async () => {
    if (dataPoints.length === 0) return;
    setIsGenerating(true);
    setReport(null);

    try {
      const summary = {
        labType,
        context: labContext,
        totalDataPoints: dataPoints.length,
        duration: ((dataPoints[dataPoints.length - 1]?.time ?? 0) / 60).toFixed(1),
        maxBalls: Math.max(...dataPoints.map(d => d.balls.length)),
        sampleData: dataPoints.filter((_, i) => i % Math.max(1, Math.floor(dataPoints.length / 10)) === 0)
          .slice(0, 10)
          .map(dp => ({
            time: (dp.time / 60).toFixed(2),
            balls: dp.balls.map(b => ({
              pos: `(${b.x.toFixed(0)}, ${b.y.toFixed(0)})`,
              speed: b.speed.toFixed(1),
              ke: b.ke.toFixed(1),
              pe: b.pe.toFixed(1),
            })),
          })),
      };

      const response = await fetch('/api/products/virtual-labs/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Generate a concise lab report for this experiment. Include: Title, Objective, Procedure summary, Data Analysis (reference the key data trends), and Conclusion. Format with markdown headers.\n\nExperiment data summary:\n${JSON.stringify(summary, null, 2)}`,
          }],
          labContext: `Generating lab report. ${labContext}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');
      const decoder = new TextDecoder();
      let buffer = '';
      let reportText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk') {
              reportText += data.content;
              setReport(reportText);
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setReport('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Data Collection & Export</h3>

      {/* Recording controls */}
      <div className="flex items-center gap-3 mb-4">
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
          >
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
            Record Data
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
          >
            <span className="w-2.5 h-2.5 bg-white rounded-sm" />
            Stop ({dataPoints.length} pts)
          </button>
        )}

        {dataPoints.length > 0 && (
          <span className="text-xs text-gray-500">
            {dataPoints.length} data points collected
          </span>
        )}
      </div>

      {/* Export buttons */}
      {dataPoints.length > 0 && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium"
            >
              📊 Export CSV
            </button>
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium disabled:opacity-50"
            >
              {isGenerating ? '⏳ Generating...' : '📝 AI Lab Report'}
            </button>
          </div>

          {/* Generated report */}
          {report && (
            <div className="mt-3 max-h-64 overflow-y-auto bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Lab Report</h4>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(report);
                  }}
                  className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition"
                >
                  Copy
                </button>
              </div>
              <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{report}</div>
            </div>
          )}
        </div>
      )}

      {dataPoints.length === 0 && !isRecording && (
        <p className="text-xs text-gray-400">
          Press &quot;Record Data&quot; then run the simulation to collect data points for export.
        </p>
      )}
    </div>
  );
}
