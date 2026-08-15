'use client';

import React, { useState } from 'react';

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  citations: number;
  relevance: number;
  abstract: string;
}

interface Citation {
  id: string;
  text: string;
  style: 'APA' | 'MLA' | 'Chicago' | 'Harvard';
}

const SAMPLE_PAPERS: Paper[] = [
  {
    id: '1',
    title: 'Deep Learning for Natural Language Processing: A Comprehensive Review',
    authors: 'Zhang, Y., Chen, L., & Wang, M.',
    journal: 'Journal of Machine Learning Research',
    year: 2024,
    citations: 487,
    relevance: 95,
    abstract: 'This paper provides a comprehensive review of deep learning techniques applied to natural language processing tasks, covering transformer architectures, pre-trained language models, and their applications in text classification, machine translation, and question answering systems.',
  },
  {
    id: '2',
    title: 'Transformer Models in Educational Technology: Applications and Impact',
    authors: 'Smith, J., Brown, A., & Davis, K.',
    journal: 'Educational Technology Research',
    year: 2023,
    citations: 156,
    relevance: 88,
    abstract: 'An analysis of how transformer-based models are being applied in educational technology, including automated essay scoring, personalized learning systems, and intelligent tutoring systems. We examine both the benefits and challenges of deploying these models in educational contexts.',
  },
  {
    id: '3',
    title: 'Attention Mechanisms in Neural Networks: From Theory to Practice',
    authors: 'Liu, H., Thompson, R., & Garcia, M.',
    journal: 'Neural Computing and Applications',
    year: 2024,
    citations: 312,
    relevance: 82,
    abstract: 'This work presents a detailed examination of attention mechanisms in neural networks, tracing their evolution from early sequence-to-sequence models to modern multi-head self-attention. We provide theoretical foundations and practical implementation guidelines.',
  },
];

const SAMPLE_SUMMARY = `## Key Findings from Literature Review

### Overview
The selected papers collectively address the intersection of **deep learning** and **natural language processing** with applications in educational technology.

### Main Themes

1. **Transformer Architecture Dominance**
   - Self-attention mechanisms have become the foundation for state-of-the-art NLP models
   - Pre-trained models (BERT, GPT, T5) show remarkable transfer learning capabilities

2. **Educational Applications**
   - Automated essay scoring achieving near-human accuracy
   - Personalized learning systems adapting to student needs
   - Intelligent tutoring showing 15-30% improvement in learning outcomes

3. **Challenges Identified**
   - Computational requirements for training and inference
   - Bias in training data affecting model fairness
   - Explainability remains an open problem

### Research Gaps
- Limited studies on long-term educational impact
- Need for more diverse training datasets
- Lack of standardized evaluation metrics for educational AI`;

export default function ResearchAssistantDemo() {
  const [activeTab, setActiveTab] = useState<'search' | 'summarize' | 'cite' | 'methodology'>('search');
  const [searchQuery, setSearchQuery] = useState('deep learning natural language processing education');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Paper[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [citationStyle, setCitationStyle] = useState<'APA' | 'MLA' | 'Chicago' | 'Harvard'>('APA');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults(SAMPLE_PAPERS);
      setIsSearching(false);
    }, 1500);
  };

  const handleSummarize = () => {
    setIsSummarizing(true);
    setTimeout(() => {
      setSummary(SAMPLE_SUMMARY);
      setIsSummarizing(false);
    }, 2000);
  };

  const togglePaperSelection = (id: string) => {
    setSelectedPapers(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const formatCitation = (paper: Paper, style: string): string => {
    switch (style) {
      case 'APA':
        return `${paper.authors} (${paper.year}). ${paper.title}. *${paper.journal}*.`;
      case 'MLA':
        return `${paper.authors}. "${paper.title}." *${paper.journal}*, ${paper.year}.`;
      case 'Chicago':
        return `${paper.authors}. "${paper.title}." ${paper.journal} (${paper.year}).`;
      case 'Harvard':
        return `${paper.authors}, ${paper.year}. ${paper.title}. *${paper.journal}*.`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-emerald-50 p-6 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Research & Higher Ed Solution
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Research Assistant AI</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Literature search, paper summarization, citation management, and methodology
            suggestions for graduate students and researchers.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'search', label: 'Literature Search', icon: '🔍' },
            { id: 'summarize', label: 'Summarization', icon: '📝' },
            { id: 'cite', label: 'Citation Manager', icon: '📚' },
            { id: 'methodology', label: 'Methodology Helper', icon: '🔬' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Query</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter keywords, topics, or research questions..."
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Filters:</span>
                <select className="p-2 border border-gray-200 rounded-lg text-sm">
                  <option>All Years</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>Last 5 years</option>
                </select>
                <select className="p-2 border border-gray-200 rounded-lg text-sm">
                  <option>All Sources</option>
                  <option>Peer Reviewed</option>
                  <option>Open Access</option>
                </select>
                <select className="p-2 border border-gray-200 rounded-lg text-sm">
                  <option>Sort by Relevance</option>
                  <option>Sort by Citations</option>
                  <option>Sort by Date</option>
                </select>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{searchResults.length} results found</span>
                    <span className="text-sm text-emerald-600">{selectedPapers.length} selected</span>
                  </div>

                  {searchResults.map((paper) => (
                    <div
                      key={paper.id}
                      className={`p-4 rounded-xl border transition ${
                        selectedPapers.includes(paper.id)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPapers.includes(paper.id)}
                          onChange={() => togglePaperSelection(paper.id)}
                          className="mt-1 rounded text-emerald-600"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 hover:text-emerald-600 cursor-pointer">
                            {paper.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{paper.authors}</p>
                          <p className="text-sm text-gray-500">{paper.journal} • {paper.year}</p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{paper.abstract}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-500">📊 {paper.citations} citations</span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                              {paper.relevance}% relevant
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'summarize' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-3">Selected Papers ({selectedPapers.length})</h3>
                {selectedPapers.length === 0 ? (
                  <p className="text-sm text-gray-500">Select papers from the Literature Search tab to summarize.</p>
                ) : (
                  <div className="space-y-2">
                    {SAMPLE_PAPERS.filter(p => selectedPapers.includes(p.id)).map((paper) => (
                      <div key={paper.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{paper.title}</span>
                        <button
                          onClick={() => togglePaperSelection(paper.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSummarize}
                disabled={selectedPapers.length === 0 || isSummarizing}
                className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {isSummarizing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing and summarizing...
                  </span>
                ) : (
                  'Generate Literature Summary'
                )}
              </button>

              {summary && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">AI-Generated Summary</h4>
                    <div className="flex gap-2">
                      <button className="text-sm text-emerald-600 hover:text-emerald-700">📋 Copy</button>
                      <button className="text-sm text-emerald-600 hover:text-emerald-700">📥 Export</button>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-gray-700">{summary}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cite' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Citation Manager</h3>
                <div className="flex gap-2">
                  <select
                    value={citationStyle}
                    onChange={(e) => setCitationStyle(e.target.value as typeof citationStyle)}
                    className="p-2 border border-gray-200 rounded-lg"
                  >
                    <option value="APA">APA 7th</option>
                    <option value="MLA">MLA 9th</option>
                    <option value="Chicago">Chicago</option>
                    <option value="Harvard">Harvard</option>
                  </select>
                </div>
              </div>

              {SAMPLE_PAPERS.length > 0 ? (
                <div className="space-y-4">
                  {SAMPLE_PAPERS.map((paper) => (
                    <div key={paper.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 font-mono">
                            {formatCitation(paper, citationStyle)}
                          </p>
                        </div>
                        <button className="text-emerald-600 hover:text-emerald-700 text-sm">
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Add papers from the Literature Search to generate citations.
                </p>
              )}

              <div className="bg-emerald-50 rounded-xl p-4">
                <h4 className="font-medium text-emerald-900 mb-2">Export Options</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm hover:bg-emerald-100">
                    Export to BibTeX
                  </button>
                  <button className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm hover:bg-emerald-100">
                    Export to EndNote
                  </button>
                  <button className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm hover:bg-emerald-100">
                    Export to Zotero
                  </button>
                  <button className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-sm hover:bg-emerald-100">
                    Download .docx
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'methodology' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Methodology Suggestions</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Research Type</label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl">
                    <option>Quantitative</option>
                    <option>Qualitative</option>
                    <option>Mixed Methods</option>
                    <option>Meta-Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl">
                    <option>Computer Science</option>
                    <option>Education</option>
                    <option>Psychology</option>
                    <option>Business</option>
                  </select>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <h4 className="font-medium text-emerald-900 mb-4">AI Methodology Recommendations</h4>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">📊</span>
                      <h5 className="font-medium text-gray-900">Recommended Data Collection</h5>
                    </div>
                    <p className="text-sm text-gray-600">
                      For your research on AI in education, consider a <strong>survey-based approach</strong> with
                      minimum n=200 participants, supplemented by <strong>semi-structured interviews</strong> (n=15-20)
                      for deeper qualitative insights.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">📈</span>
                      <h5 className="font-medium text-gray-900">Suggested Analysis Methods</h5>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Regression analysis for quantitative correlations</li>
                      <li>• Thematic analysis for interview data</li>
                      <li>• ANOVA for group comparisons</li>
                      <li>• Effect size calculations (Cohen&apos;s d)</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">⚠️</span>
                      <h5 className="font-medium text-gray-900">Potential Limitations to Address</h5>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Selection bias in participant recruitment</li>
                      <li>• Self-report data reliability</li>
                      <li>• Generalizability across educational contexts</li>
                      <li>• Technology access disparities</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition">
                  Generate Full Methodology Section
                </button>
                <button className="px-6 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition">
                  Get IRB Checklist
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            { icon: '🔍', title: 'Smart Search', desc: 'Multi-database queries' },
            { icon: '📝', title: 'Summarization', desc: 'AI paper analysis' },
            { icon: '📚', title: 'Citations', desc: 'All major formats' },
            { icon: '🔬', title: 'Methodology', desc: 'Research guidance' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 text-center shadow">
              <span className="text-2xl">{feature.icon}</span>
              <h4 className="font-medium text-gray-900 mt-2">{feature.title}</h4>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
