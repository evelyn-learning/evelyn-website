'use client';

import React, { useState } from 'react';

interface AccessibilityIssue {
  type: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  element: string;
  description: string;
  wcagCriteria: string;
  fix: string;
}

interface AccessibilityReport {
  overallScore: number;
  passedChecks: number;
  totalChecks: number;
  summary: string;
  issues: AccessibilityIssue[];
  recommendations: string[];
  improvedContent?: string;
}

const SAMPLE_CONTENT = {
  poor: `<div onclick="navigate()">Click here for more info</div>
<img src="chart.png">
<p style="color: #999999; font-size: 10px">Important information about our services</p>
<table>
<tr><td>Name</td><td>Price</td><td>Quantity</td></tr>
<tr><td>Product A</td><td>$10</td><td>5</td></tr>
</table>
<a href="#">Read more</a>`,

  moderate: `<button onclick="submit()">Submit Form</button>
<img src="logo.png" alt="logo">
<h3>Welcome to Our Site</h3>
<p>We offer great services for everyone.</p>
<a href="/about">Learn more about us</a>
<form>
<input type="text" placeholder="Enter name">
<input type="email" placeholder="Enter email">
</form>`,

  good: `<nav aria-label="Main navigation">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
<main>
  <h1>Welcome to Our Educational Platform</h1>
  <img src="students.jpg" alt="Students collaborating in a classroom">
  <p>We provide accessible learning tools for all students.</p>
  <button type="submit" aria-label="Submit registration form">Register Now</button>
</main>`,
};

export default function AccessibilityAIDemo() {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'html' | 'text'>('html');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showImproved, setShowImproved] = useState(false);

  const analyzeContent = async () => {
    if (!content.trim()) {
      setError('Please enter content to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    setShowImproved(false);

    const systemPrompt = `You are an expert web accessibility auditor specializing in WCAG 2.1 AA compliance.
Analyze content for accessibility issues including:
- Missing alt text for images
- Poor color contrast
- Missing form labels
- Improper heading hierarchy
- Non-descriptive link text
- Missing ARIA attributes
- Keyboard navigation issues
- Screen reader compatibility

Provide specific, actionable fixes for each issue.`;

    const userPrompt = `Analyze this ${contentType === 'html' ? 'HTML' : 'text'} content for WCAG 2.1 AA accessibility issues:

"""
${content}
"""

Provide analysis in this JSON format:
{
  "overallScore": number from 0-100 (100 = fully accessible),
  "passedChecks": number of checks passed,
  "totalChecks": total number of checks run,
  "summary": "brief overall assessment",
  "issues": [
    {
      "type": "issue category (e.g., 'Images', 'Color Contrast', 'Forms')",
      "severity": "critical" | "serious" | "moderate" | "minor",
      "element": "the problematic element or text",
      "description": "what the issue is",
      "wcagCriteria": "e.g., WCAG 2.1 1.1.1 Non-text Content",
      "fix": "specific code or text to fix it"
    }
  ],
  "recommendations": ["general improvement suggestions"],
  "improvedContent": "the corrected ${contentType === 'html' ? 'HTML' : 'text'} with all fixes applied"
}`;

    try {
      const response = await fetch('/api/ai/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 3000,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.text) {
        const jsonMatch = data.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as AccessibilityReport;
          setReport(parsed);
        } else {
          setError('Could not parse report. Please try again.');
        }
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (quality: keyof typeof SAMPLE_CONTENT) => {
    setContent(SAMPLE_CONTENT[quality]);
    setContentType('html');
    setReport(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'serious': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'serious': return '⚠️';
      case 'moderate': return '⚡';
      default: return '💡';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-green-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            AI-Powered Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Content Accessibility AI
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scan your content for WCAG 2.1 AA compliance issues and get AI-powered fixes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Content to Analyze</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setContentType('html')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    contentType === 'html'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setContentType('text')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    contentType === 'text'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Text
                </button>
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={contentType === 'html'
                ? '<div>Paste your HTML content here...</div>'
                : 'Paste your text content here...'}
              className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            />

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-500">Load sample:</span>
              <button
                onClick={() => loadSample('poor')}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Poor Accessibility
              </button>
              <button
                onClick={() => loadSample('moderate')}
                className="text-sm text-yellow-600 hover:text-yellow-700 underline"
              >
                Moderate
              </button>
              <button
                onClick={() => loadSample('good')}
                className="text-sm text-green-600 hover:text-green-700 underline"
              >
                Good Accessibility
              </button>
            </div>

            <button
              onClick={analyzeContent}
              disabled={isAnalyzing || !content.trim()}
              className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Scanning...
                </>
              ) : (
                <>
                  <span>♿</span>
                  Scan for Accessibility
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Accessibility Report</h3>

            {!report && !isAnalyzing && (
              <div className="h-full flex items-center justify-center text-gray-400 min-h-[300px]">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">♿</span>
                  <p>Paste content and scan for accessibility issues</p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Analyzing accessibility...</p>
                </div>
              </div>
            )}

            {report && (
              <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
                {/* Score */}
                <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Accessibility Score</p>
                      <p className={`text-4xl font-bold`}>{report.overallScore}/100</p>
                      <p className="text-green-100">{getScoreLabel(report.overallScore)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-5xl">♿</p>
                      <p className="text-sm text-green-100 mt-2">
                        {report.passedChecks}/{report.totalChecks} checks passed
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-green-100 text-sm">{report.summary}</p>
                </div>

                {/* Issues */}
                {report.issues.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Issues Found ({report.issues.length})
                    </h4>
                    <div className="space-y-3">
                      {report.issues.map((issue, idx) => (
                        <details
                          key={idx}
                          className={`border rounded-xl overflow-hidden ${getSeverityColor(issue.severity)}`}
                        >
                          <summary className="p-4 cursor-pointer hover:bg-white/50">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{getSeverityIcon(issue.severity)}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{issue.type}</span>
                                  <span className="text-xs px-2 py-0.5 bg-white/50 rounded-full capitalize">
                                    {issue.severity}
                                  </span>
                                </div>
                                <p className="text-sm opacity-80">{issue.description}</p>
                              </div>
                            </div>
                          </summary>
                          <div className="p-4 pt-0 space-y-3">
                            <div>
                              <p className="text-xs font-medium opacity-70">Element</p>
                              <code className="text-sm bg-white/50 px-2 py-1 rounded block mt-1">
                                {issue.element}
                              </code>
                            </div>
                            <div>
                              <p className="text-xs font-medium opacity-70">WCAG Criteria</p>
                              <p className="text-sm">{issue.wcagCriteria}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium opacity-70">Fix</p>
                              <code className="text-sm bg-white/50 px-2 py-1 rounded block mt-1 whitespace-pre-wrap">
                                {issue.fix}
                              </code>
                            </div>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {report.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">General Recommendations</h4>
                    <ul className="space-y-2">
                      {report.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500">✓</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improved Content */}
                {report.improvedContent && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Accessible Version</h4>
                      <button
                        onClick={() => setShowImproved(!showImproved)}
                        className="text-sm text-green-600 hover:text-green-700"
                      >
                        {showImproved ? 'Hide' : 'Show'} Fixed Code
                      </button>
                    </div>
                    {showImproved && (
                      <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                        <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                          {report.improvedContent}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* WCAG Guidelines */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">WCAG 2.1 Categories Checked</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '👁️', title: 'Perceivable', desc: 'Alt text, captions, contrast' },
              { icon: '⌨️', title: 'Operable', desc: 'Keyboard access, timing' },
              { icon: '📖', title: 'Understandable', desc: 'Readable, predictable' },
              { icon: '🔧', title: 'Robust', desc: 'Compatible with assistive tech' },
            ].map((principle, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-gray-50">
                <span className="text-2xl">{principle.icon}</span>
                <h4 className="font-medium text-gray-800 mt-2">{principle.title}</h4>
                <p className="text-sm text-gray-500">{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
