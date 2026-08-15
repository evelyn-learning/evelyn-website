'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  RefreshCw,
  Clock,
  CheckCircle2,
  Calendar,
  XCircle,
  ChevronRight,
  Building2,
} from 'lucide-react';

interface ToolRequest {
  _id: string;
  toolName: string;
  description: string;
  useCase?: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'planned' | 'declined';
  site: {
    slug: string;
    businessName: string;
    businessType: string;
  };
}

interface TopRequest {
  name: string;
  count: number;
}

interface ToolRequestsData {
  requests: ToolRequest[];
  stats: {
    total: number;
    pending: number;
    reviewed: number;
    planned: number;
    declined: number;
  };
  topRequests: TopRequest[];
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  reviewed: { label: 'Reviewed', color: 'text-blue-600 bg-blue-50', icon: CheckCircle2 },
  planned: { label: 'Planned', color: 'text-green-600 bg-green-50', icon: Calendar },
  declined: { label: 'Declined', color: 'text-red-600 bg-red-50', icon: XCircle },
};

export function ToolRequestsWidget() {
  const [data, setData] = useState<ToolRequestsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/tool-requests?limit=10');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError('Unable to load tool requests');
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (slug: string, requestId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/tool-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, requestId, status: newStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (error) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-amber-500" />
            Tool Requests
          </h3>
        </div>
        <p className="text-xs text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquarePlus className="w-4 h-4 text-amber-500" />
          Tool Requests
          {data && data.stats.pending > 0 && (
            <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
              {data.stats.pending} new
            </span>
          )}
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
          <div className="h-12 bg-gray-100 rounded animate-pulse" />
          <div className="h-12 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : data ? (
        <div className="space-y-4">
          {/* Stats Row */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-gray-600">{data.stats.pending} pending</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-gray-600">{data.stats.planned} planned</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">{data.stats.total} total</span>
            </div>
          </div>

          {/* Top Requested Tools */}
          {data.topRequests.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Most Requested</h4>
              <div className="flex flex-wrap gap-2">
                {data.topRequests.slice(0, 5).map((req, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg"
                  >
                    {req.name} ({req.count})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Requests */}
          {data.requests.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.requests.slice(0, 5).map((req) => {
                const statusConfig = STATUS_CONFIG[req.status];
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedRequest === req._id;

                return (
                  <div
                    key={req._id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => setExpandedRequest(isExpanded ? null : req._id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-gray-900 truncate">
                            {req.toolName}
                          </span>
                          <span className={`px-1.5 py-0.5 text-xs rounded-full flex items-center gap-1 ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Building2 className="w-3 h-3" />
                          {req.site.businessName}
                          <span>•</span>
                          {new Date(req.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 transition ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">{req.description}</p>
                        {req.useCase && (
                          <p className="text-xs text-gray-500 italic mb-3">
                            Use case: {req.useCase}
                          </p>
                        )}
                        <div className="flex gap-2">
                          {req.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(req.site.slug, req._id, 'planned');
                                }}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                              >
                                Plan
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(req.site.slug, req._id, 'reviewed');
                                }}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                Mark Reviewed
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(req.site.slug, req._id, 'declined');
                                }}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-4">
              No tool requests yet
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
