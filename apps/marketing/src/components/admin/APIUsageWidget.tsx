'use client';

import { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, TrendingUp, Clock, Zap } from 'lucide-react';

interface APIUsageData {
  summary: {
    totalSites: number;
    totalCalls: number;
    totalTokens: number;
    avgResponseTime: number | null;
    successRate: number;
    period: string;
  };
  toolBreakdown: Record<string, number>;
  dailyUsage: Array<{ date: string; count: number }>;
  perSiteUsage: Array<{
    slug: string;
    businessName: string;
    status: string;
    totalCalls: number;
    recentCalls: number;
    avgResponseTime?: number;
  }>;
}

export function APIUsageWidget() {
  const [data, setData] = useState<APIUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/api-usage?days=7');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError('Unable to load API usage');
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            API Usage
          </h3>
        </div>
        <p className="text-xs text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          API Usage (7d)
        </h3>
        <button
          onClick={fetchData}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading && !data ? (
        <div className="space-y-2">
          <div className="h-6 bg-gray-100 rounded animate-pulse" />
          <div className="h-6 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : data ? (
        <div className="space-y-3">
          {/* Total Calls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Total Calls</span>
            <span className="text-lg font-bold text-gray-900">{data.summary.totalCalls}</span>
          </div>

          {/* Tool Breakdown */}
          <div className="space-y-1">
            {Object.entries(data.toolBreakdown).map(([tool, count]) => (
              <div key={tool} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 capitalize">{tool.replace('-', ' ')}</span>
                <span className="text-gray-900 font-medium">{count}</span>
              </div>
            ))}
          </div>

          {/* Success Rate */}
          {data.summary.successRate !== null && (
            <div className="flex items-center justify-between pt-2 border-t text-xs">
              <span className="text-gray-500">Success Rate</span>
              <span className={`font-medium ${data.summary.successRate >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>
                {data.summary.successRate}%
              </span>
            </div>
          )}

          {/* Avg Response Time */}
          {data.summary.avgResponseTime !== null && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Avg Response
              </span>
              <span className="text-gray-700">{data.summary.avgResponseTime}ms</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
