"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  MousePointerClick,
  CheckCircle,
  Users,
  Monitor,
  Smartphone,
  Tablet,
  TrendingUp,
  Loader2,
  RefreshCw,
  Globe,
  MapPin,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Wrench,
  Navigation,
  Coins,
  FileText,
  Download,
} from "lucide-react";
import { timeAgo } from "@/lib/utils/timeAgo";

interface DemoStats {
  productId: string;
  productTitle: string;
  views: number;
  tries: number;
  completes: number;
  uniqueUsers: number;
  conversionRate: number;
}

interface DailyData {
  date: string;
  views: number;
  tries: number;
  completes: number;
}

interface DeviceData {
  device: string;
  count: number;
}

interface LocationData {
  country: string;
  countryCode: string;
  count: number;
  uniqueCities: number;
}

interface RecentActivity {
  _id: string;
  productId: string;
  productTitle: string;
  eventType: string;
  deviceType: string;
  timestamp: string;
  location?: {
    country?: string;
    countryCode?: string;
    city?: string;
  };
}

interface AnalyticsData {
  summary: {
    totalViews: number;
    totalTries: number;
    totalCompletes: number;
    uniqueUsers: number;
    overallConversionRate: string | number;
  };
  topDemos: DemoStats[];
  dailyChart: DailyData[];
  deviceStats: DeviceData[];
  locationStats: LocationData[];
  recentActivity: RecentActivity[];
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

// Convert country code to flag emoji
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function DemoAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/demos?days=${days}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 text-sm text-red-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const deviceIcons: Record<string, React.ReactNode> = {
    desktop: <Monitor className="h-4 w-4" />,
    mobile: <Smartphone className="h-4 w-4" />,
    tablet: <Tablet className="h-4 w-4" />,
  };

  const totalDevices = data.deviceStats.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Period:</label>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl bg-white p-5 shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data.summary.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Demo Views</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <MousePointerClick className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data.summary.totalTries.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Demo Tries</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data.summary.totalCompletes.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data.summary.uniqueUsers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Unique Users</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data.summary.overallConversionRate}%
              </p>
              <p className="text-sm text-gray-500">Try Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Demos Table */}
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Top Demos by Views
          </h2>
          {data.topDemos.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No demo interactions recorded yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left font-medium text-gray-500">
                      Product
                    </th>
                    <th className="py-3 text-right font-medium text-gray-500">
                      Views
                    </th>
                    <th className="py-3 text-right font-medium text-gray-500">
                      Tries
                    </th>
                    <th className="py-3 text-right font-medium text-gray-500">
                      Completes
                    </th>
                    <th className="py-3 text-right font-medium text-gray-500">
                      Try Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.topDemos.map((demo) => (
                    <tr key={demo.productId} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {demo.productTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {demo.productId}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 text-right text-gray-700">
                        {demo.views.toLocaleString()}
                      </td>
                      <td className="py-3 text-right text-gray-700">
                        {demo.tries.toLocaleString()}
                      </td>
                      <td className="py-3 text-right text-gray-700">
                        {demo.completes.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            demo.conversionRate >= 20
                              ? "bg-green-100 text-green-700"
                              : demo.conversionRate >= 10
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {demo.conversionRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Device Breakdown & Recent Activity */}
        <div className="space-y-6">
          {/* Device Breakdown */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Device Breakdown
            </h2>
            {data.deviceStats.length === 0 ? (
              <p className="py-4 text-center text-gray-500">No data</p>
            ) : (
              <div className="space-y-3">
                {data.deviceStats.map((device) => (
                  <div key={device.device} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      {deviceIcons[device.device] || <Monitor className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize text-gray-700">
                          {device.device}
                        </span>
                        <span className="text-sm text-gray-500">
                          {device.count.toLocaleString()} (
                          {((device.count / totalDevices) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-primary-500"
                          style={{
                            width: `${(device.count / totalDevices) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Breakdown */}
          {data.locationStats && data.locationStats.length > 0 && (
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary-600" />
                Top Locations
              </h2>
              <div className="space-y-3">
                {data.locationStats.slice(0, 5).map((location) => (
                  <div key={location.countryCode} className="flex items-center gap-3">
                    <span className="text-xl">{getCountryFlag(location.countryCode)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {location.country}
                        </span>
                        <span className="text-sm text-gray-500">
                          {location.count.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {location.uniqueCities} {location.uniqueCities === 1 ? 'city' : 'cities'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            {data.recentActivity.length === 0 ? (
              <p className="py-4 text-center text-gray-500">No recent activity</p>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {data.recentActivity.slice(0, 15).map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        activity.eventType === "view"
                          ? "bg-blue-500"
                          : activity.eventType === "try"
                          ? "bg-purple-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-700">
                        {activity.productTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.eventType} • {activity.deviceType}
                        {activity.location?.city && ` • ${activity.location.city}`}
                        {activity.location?.countryCode && ` ${getCountryFlag(activity.location.countryCode)}`}
                        {" • "}
                        {timeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Chart - Simple Bar Representation */}
      {data.dailyChart.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Daily Activity (Last {days} days)
          </h2>
          <div className="flex gap-1 h-40">
            {data.dailyChart.slice(-30).map((day) => {
              const maxValue = Math.max(
                ...data.dailyChart.map((d) => d.views + d.tries)
              );
              const height = maxValue > 0 ? ((day.views + day.tries) / maxValue) * 100 : 0;
              return (
                <div
                  key={day.date}
                  className="flex-1 min-w-[8px] group relative flex flex-col justify-end"
                  title={`${day.date}: ${day.views} views, ${day.tries} tries`}
                >
                  <div
                    className="w-full bg-primary-500 rounded-t hover:bg-primary-600 transition-colors"
                    style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {day.date}: {day.views} views, {day.tries} tries
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>{data.dailyChart[0]?.date}</span>
            <span>{data.dailyChart[data.dailyChart.length - 1]?.date}</span>
          </div>
        </div>
      )}

      {/* Session Explorer */}
      <SessionExplorer />
    </div>
  );
}

// --- Session Explorer ---

interface SessionProduct {
  productId: string;
  productTitle: string;
  sessionCount: number;
}

interface SessionSummary {
  _id: string;
  sessionId: string;
  productId: string;
  productTitle: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  summary: {
    totalInteractions: number;
    messageCount: number;
    toolsUsed: string[];
    lastActivity: string;
  };
  deviceType: string;
  location?: {
    country?: string;
    countryCode?: string;
    city?: string;
  };
}

interface SessionInteraction {
  type: "message" | "click" | "tool_use" | "navigation" | "homework_upload";
  role?: "student" | "tutor";
  content?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

interface SessionDetail {
  session: SessionSummary & { interactions: SessionInteraction[] };
  events: Array<{
    _id: string;
    eventType: string;
    timestamp: string;
  }>;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "-";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function SessionExplorer() {
  const [products, setProducts] = useState<SessionProduct[]>([]);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchSessions = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ days: "30", page: String(pageNum), limit: "20" });
      if (selectedProduct) params.set("productId", selectedProduct);

      const response = await fetch(`/api/admin/demos/sessions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch sessions");
      const result = await response.json();

      setSessions(result.sessions);
      setTotal(result.total);
      setPage(result.page);
      setTotalPages(result.totalPages);
      setProducts(result.products);
      setLoaded(true);
    } catch {
      // Silently handle
    } finally {
      setLoading(false);
    }
  }, [selectedProduct]);

  const fetchSessionDetail = useCallback(async (id: string) => {
    if (expandedSession === id) {
      setExpandedSession(null);
      setSessionDetail(null);
      return;
    }

    setExpandedSession(id);
    setDetailLoading(true);
    try {
      const response = await fetch(`/api/admin/demos/sessions?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch session detail");
      const result = await response.json();
      setSessionDetail(result);
    } catch {
      setSessionDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, [expandedSession]);

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary-600" />
        Session Explorer
      </h2>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="">All Products</option>
          {products.map((p) => (
            <option key={p.productId} value={p.productId}>
              {p.productTitle} ({p.sessionCount})
            </option>
          ))}
        </select>
        <button
          onClick={() => fetchSessions(1)}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-1.5 text-sm text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {loaded ? "Refresh" : "Load Sessions"}
        </button>
        {loaded && (
          <span className="text-sm text-gray-500">{total} sessions found</span>
        )}
      </div>

      {/* Session table */}
      {loaded && sessions.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left font-medium text-gray-500 w-8"></th>
                  <th className="py-3 text-left font-medium text-gray-500">Time</th>
                  <th className="py-3 text-left font-medium text-gray-500">Product</th>
                  <th className="py-3 text-right font-medium text-gray-500">Duration</th>
                  <th className="py-3 text-right font-medium text-gray-500">Messages</th>
                  <th className="py-3 text-right font-medium text-gray-500">Interactions</th>
                  <th className="py-3 text-left font-medium text-gray-500">Location</th>
                  <th className="py-3 text-left font-medium text-gray-500">Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((s) => (
                  <SessionRow
                    key={s._id}
                    session={s}
                    isExpanded={expandedSession === s._id}
                    detail={expandedSession === s._id ? sessionDetail : null}
                    detailLoading={expandedSession === s._id && detailLoading}
                    onToggle={() => fetchSessionDetail(s._id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => fetchSessions(page - 1)}
                disabled={page <= 1 || loading}
                className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => fetchSessions(page + 1)}
                disabled={page >= totalPages || loading}
                className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {loaded && sessions.length === 0 && (
        <p className="py-8 text-center text-gray-500">No sessions found</p>
      )}
    </div>
  );
}

function SessionRow({
  session,
  isExpanded,
  detail,
  detailLoading,
  onToggle,
}: {
  session: SessionSummary;
  isExpanded: boolean;
  detail: SessionDetail | null;
  detailLoading: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer"
        onClick={onToggle}
      >
        <td className="py-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </td>
        <td className="py-3 text-gray-700 whitespace-nowrap">
          {timeAgo(session.startedAt)}
        </td>
        <td className="py-3">
          <p className="font-medium text-gray-900">{session.productTitle}</p>
        </td>
        <td className="py-3 text-right text-gray-700">
          {formatDuration(session.duration)}
        </td>
        <td className="py-3 text-right text-gray-700">
          {session.summary.messageCount}
        </td>
        <td className="py-3 text-right text-gray-700">
          {session.summary.totalInteractions}
        </td>
        <td className="py-3 text-gray-700">
          {session.location?.city && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {session.location.city}
              {session.location.countryCode && ` ${getCountryFlag(session.location.countryCode)}`}
            </span>
          )}
        </td>
        <td className="py-3 text-gray-700 capitalize">{session.deviceType}</td>
      </tr>

      {/* Expanded detail row */}
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-gray-50 px-6 py-4">
            {detailLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              </div>
            ) : detail?.session?.interactions ? (
              <InteractionTimeline
                interactions={detail.session.interactions}
                productId={session.productId}
                productTitle={session.productTitle}
              />
            ) : (
              <p className="text-center text-gray-500 py-4">No interaction data</p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

// Cost calculation for Claude models (per 1M tokens)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4-20250514': { input: 3, output: 15 },
  'claude-sonnet-4-5-20250514': { input: 3, output: 15 },
  'claude-haiku-3-5-20241022': { input: 0.80, output: 4 },
};

function estimateCost(inputTokens: number, outputTokens: number, model?: string): string {
  const pricing = MODEL_PRICING[model || ''] || { input: 3, output: 15 };
  const cost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
  return cost < 0.01 ? `$${cost.toFixed(4)}` : `$${cost.toFixed(3)}`;
}

function formatMetadataValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  }
  return String(value);
}

// Render whiteboard command visuals inline
function WhiteboardVisual({ metadata }: { metadata: Record<string, unknown> }) {
  const action = metadata.action as string;
  const label = metadata.label as string | undefined;
  const latex = metadata.latex as string | undefined;
  const title = metadata.title as string | undefined;
  const description = metadata.description as string | undefined;

  if (action === 'showEquation' && latex) {
    return (
      <div className="mt-1 mx-auto max-w-[80%] rounded-lg bg-blue-50 border border-blue-200 p-3">
        {label && <p className="text-xs font-medium text-blue-700 mb-1">{label}</p>}
        <p className="text-sm font-mono text-blue-900 whitespace-pre-wrap">{latex}</p>
      </div>
    );
  }

  if (action === 'showGraph' && metadata.data) {
    const data = metadata.data as Record<string, unknown>;
    const dataTitle = data.title as string | undefined;
    return (
      <div className="mt-1 mx-auto max-w-[80%] rounded-lg bg-green-50 border border-green-200 p-3">
        <p className="text-xs font-medium text-green-700 mb-1">
          Graph: {String(metadata.type || 'chart')}{dataTitle ? ` — ${dataTitle}` : ''}
        </p>
        {Array.isArray(data.labels) && (
          <p className="text-xs text-green-600">Labels: {(data.labels as string[]).join(', ')}</p>
        )}
        {Array.isArray(data.datasets) && (
          <div className="text-xs text-green-600 mt-1">
            {(data.datasets as Array<Record<string, unknown>>).map((ds, j) => (
              <p key={j}>{String(ds.label || `Dataset ${j + 1}`)}: [{Array.isArray(ds.data) ? (ds.data as number[]).join(', ') : '...'}]</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (action === 'showTable' && metadata.headers) {
    const headers = metadata.headers as string[];
    const rows = (metadata.rows || []) as string[][];
    return (
      <div className="mt-1 mx-auto max-w-[80%] overflow-x-auto">
        <table className="w-full text-xs border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((h, j) => (
                <th key={j} className="px-2 py-1 text-left font-medium text-gray-700 border-b">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, j) => (
              <tr key={j} className="border-b border-gray-100">
                {row.map((cell, k) => (
                  <td key={k} className="px-2 py-1 text-gray-600">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (action === 'showProblem' && metadata.problem) {
    const problem = metadata.problem as Record<string, unknown>;
    const question = problem.question as string | undefined;
    return (
      <div className="mt-1 mx-auto max-w-[80%] rounded-lg bg-amber-50 border border-amber-200 p-3">
        <p className="text-xs font-medium text-amber-700 mb-1">Problem</p>
        {question && <p className="text-sm text-amber-900">{question}</p>}
        {Array.isArray(problem.options) && (
          <ul className="mt-1 text-xs text-amber-700 list-disc ml-4">
            {(problem.options as string[]).map((opt, j) => <li key={j}>{opt}</li>)}
          </ul>
        )}
      </div>
    );
  }

  if (action === 'showSolution' && metadata.steps) {
    const steps = metadata.steps as Array<Record<string, unknown>>;
    return (
      <div className="mt-1 mx-auto max-w-[80%] rounded-lg bg-emerald-50 border border-emerald-200 p-3">
        <p className="text-xs font-medium text-emerald-700 mb-1">Solution Steps</p>
        <ol className="text-xs text-emerald-800 list-decimal ml-4 space-y-0.5">
          {steps.map((step, j) => (
            <li key={j}>{String(step.text || step.explanation || JSON.stringify(step))}</li>
          ))}
        </ol>
      </div>
    );
  }

  if (action === 'showDiagram') {
    return (
      <div className="mt-1 mx-auto max-w-[80%] rounded-lg bg-indigo-50 border border-indigo-200 p-3">
        <p className="text-xs font-medium text-indigo-700">
          Diagram: {String(metadata.type || 'custom')}
        </p>
        {metadata.params != null && (
          <pre className="mt-1 text-xs text-indigo-600 whitespace-pre-wrap">{JSON.stringify(metadata.params, null, 2)}</pre>
        )}
      </div>
    );
  }

  if (action === 'showSvgDiagram' && metadata.svg) {
    return (
      <div className="mt-1 mx-auto max-w-[80%] rounded-lg bg-violet-50 border border-violet-200 p-3">
        {title && <p className="text-xs font-medium text-violet-700 mb-1">{title}</p>}
        <div className="bg-white rounded p-2" dangerouslySetInnerHTML={{ __html: String(metadata.svg) }} />
        {description && <p className="text-xs text-violet-600 mt-1">{description}</p>}
      </div>
    );
  }

  if (action === 'showWorkedExample' && metadata.example) {
    const example = metadata.example as Record<string, unknown>;
    const exProblem = example.problem as string | undefined;
    return (
      <div className="mt-1 mx-auto max-w-[80%] rounded-lg bg-teal-50 border border-teal-200 p-3">
        <p className="text-xs font-medium text-teal-700 mb-1">Worked Example</p>
        {exProblem && <p className="text-sm text-teal-900">{exProblem}</p>}
        {Array.isArray(example.steps) && (
          <ol className="mt-1 text-xs text-teal-700 list-decimal ml-4 space-y-0.5">
            {(example.steps as Array<Record<string, unknown>>).map((step, j) => (
              <li key={j}>{String(step.text || step.explanation || JSON.stringify(step))}</li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  // Fallback: no visual for clear, newPage, goToPage, annotate, etc.
  return null;
}

// Render generated content details (Content Authoring)
function GeneratedContentDetail({ content }: { content: Record<string, unknown> }) {
  const quiz = content.quiz as Array<Record<string, unknown>> | undefined;
  const flashcards = content.flashcards as Array<Record<string, unknown>> | undefined;
  const topic = content.topic as string | undefined;
  const explanation = content.explanation as string | undefined;

  return (
    <div className="mt-1 mx-auto max-w-[90%] rounded-lg bg-white border border-gray-200 p-3 space-y-2">
      {topic && <p className="text-xs font-semibold text-gray-800">Topic: {topic}</p>}
      {explanation && <p className="text-xs text-gray-600">{explanation}</p>}

      {quiz && quiz.length > 0 && (
        <div>
          <p className="text-xs font-medium text-purple-700 mb-1">Quiz ({quiz.length} questions)</p>
          <div className="space-y-2">
            {quiz.map((q, j) => (
              <div key={j} className="text-xs bg-gray-50 rounded p-2">
                <p className="font-medium text-gray-800">{j + 1}. {String(q.question || q.text || '')}</p>
                {Array.isArray(q.options) && (
                  <ul className="mt-1 ml-3 space-y-0.5">
                    {(q.options as string[]).map((opt, k) => (
                      <li key={k} className={k === (q.correctAnswer as number) ? 'text-green-700 font-medium' : 'text-gray-600'}>
                        {String.fromCharCode(65 + k)}. {opt} {k === (q.correctAnswer as number) ? ' ✓' : ''}
                      </li>
                    ))}
                  </ul>
                )}
                {typeof q.explanation === 'string' && <p className="mt-1 text-gray-500 italic">{q.explanation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {flashcards && flashcards.length > 0 && (
        <div>
          <p className="text-xs font-medium text-blue-700 mb-1">Flashcards ({flashcards.length})</p>
          <div className="grid grid-cols-2 gap-2">
            {flashcards.map((fc, j) => (
              <div key={j} className="text-xs bg-gray-50 rounded p-2">
                <p className="font-medium text-gray-800">{String(fc.front || fc.term || '')}</p>
                <p className="text-gray-600 mt-0.5">{String(fc.back || fc.definition || '')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InteractionTimeline({ interactions, productId, productTitle }: {
  interactions: SessionInteraction[];
  productId: string;
  productTitle: string;
}) {
  const [expandedText, setExpandedText] = useState<number | null>(null);
  const [expandedContent, setExpandedContent] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const isVoiceTutor = productId === 'voice-tutor';

  // Build transcript and whiteboard commands from interactions for PDF export
  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const { exportTutorSessionPDF } = await import('@/lib/utils/export/pdf-tutor-session');

      // Build transcript from message interactions
      const transcript = interactions
        .filter(i => i.type === 'message')
        .map((i, idx) => ({
          id: String(idx),
          timestamp: new Date(i.timestamp),
          role: (i.role || 'system') as 'student' | 'tutor' | 'system',
          text: i.content || '',
          pedagogicalIntent: i.metadata?.pedagogicalIntent as string | undefined,
        }));

      // Build whiteboard commands from tool_use interactions with whiteboard content
      const whiteboardCommands = interactions
        .filter(i => i.type === 'tool_use' && i.content === 'whiteboard' && i.metadata?.action)
        .map(i => i.metadata as { action: string; [key: string]: unknown });

      // Get topic from navigation metadata
      const navInteraction = interactions.find(i => i.type === 'navigation' && i.content === 'session_start');
      const topic = (navInteraction?.metadata?.topic as string) || productTitle;
      const goal = (navInteraction?.metadata?.goal as string) || 'practice';

      await exportTutorSessionPDF(transcript, whiteboardCommands, topic, goal, undefined, { includeDebugData: false });
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  if (interactions.length === 0) {
    return <p className="text-center text-gray-500 py-4">No interactions recorded</p>;
  }

  return (
    <div className="space-y-2">
      {/* PDF Export button for voice tutor sessions */}
      {isVoiceTutor && interactions.some(i => i.type === 'message') && (
        <div className="flex justify-end mb-2">
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {exporting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
            Export Session PDF
          </button>
        </div>
      )}

      <div className="max-h-[600px] overflow-y-auto space-y-2">
        {interactions.map((interaction, i) => {
          if (interaction.type === "message") {
            const isStudent = interaction.role === "student";
            return (
              <div
                key={i}
                className={`flex ${isStudent ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                    isStudent
                      ? "bg-blue-500 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{interaction.content}</p>
                  <p className={`text-xs mt-1 ${isStudent ? "text-blue-100" : "text-gray-400"}`}>
                    {new Date(interaction.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          }

          if (interaction.type === "tool_use") {
            const meta = interaction.metadata || {};
            const inputTokens = meta.inputTokens as number | undefined;
            const outputTokens = meta.outputTokens as number | undefined;
            const model = meta.model as string | undefined;
            const submittedText = meta.submittedText as string | undefined;
            const hasTokens = inputTokens !== undefined && outputTokens !== undefined;

            // Check if this is a whiteboard command with visual data
            const isWhiteboard = interaction.content === 'whiteboard' && !!meta.action;
            // Check if this is generated content with full data
            const isContentGenerated = interaction.content === 'content_generated' && !!meta.generatedContent;

            // Filter out special keys for generic display
            const hiddenKeys = ['inputTokens', 'outputTokens', 'model', 'submittedText', 'generatedContent',
              // Hide whiteboard data keys from the pill (they're shown visually)
              ...(isWhiteboard ? ['latex', 'label', 'highlight', 'data', 'type', 'params', 'from', 'to', 'color',
                'text', 'position', 'style', 'problem', 'steps', 'example', 'headers', 'rows', 'svg', 'title',
                'description', 'url', 'alt'] : [])
            ];
            const displayMeta = Object.entries(meta).filter(
              ([k]) => !hiddenKeys.includes(k)
            );

            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                    <Wrench className="h-3 w-3" />
                    {interaction.content}
                    {displayMeta.length > 0 && (
                      <span className="text-purple-500">
                        ({displayMeta.map(([k, v]) => `${k}: ${formatMetadataValue(k, v)}`).join(', ')})
                      </span>
                    )}
                  </span>
                </div>

                {/* Whiteboard visual rendering */}
                {isWhiteboard && <WhiteboardVisual metadata={meta} />}

                {/* Generated content detail (expandable) */}
                {isContentGenerated && (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setExpandedContent(expandedContent === i ? null : i)}
                      className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800"
                    >
                      <FileText className="h-3 w-3" />
                      {expandedContent === i ? 'Hide generated content' : 'View generated content'}
                      {expandedContent === i ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                    {expandedContent === i && (
                      <GeneratedContentDetail content={meta.generatedContent as Record<string, unknown>} />
                    )}
                  </div>
                )}

                {/* Token usage & cost */}
                {hasTokens && (
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1 text-xs text-amber-800">
                      <Coins className="h-3 w-3" />
                      <span>{inputTokens.toLocaleString()} in / {outputTokens.toLocaleString()} out</span>
                      <span className="font-medium">{estimateCost(inputTokens, outputTokens, model)}</span>
                      {model && <span className="text-amber-500">({model.replace('claude-', '').split('-202')[0]})</span>}
                    </span>
                  </div>
                )}

                {/* Submitted text (expandable) */}
                {submittedText && (
                  <div className="flex justify-center">
                    <div className="max-w-[80%]">
                      <button
                        onClick={() => setExpandedText(expandedText === i ? null : i)}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <FileText className="h-3 w-3" />
                        {expandedText === i ? "Hide submitted text" : "View submitted text"}
                        {expandedText === i ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </button>
                      {expandedText === i && (
                        <div className="mt-1 rounded-lg bg-gray-100 border border-gray-200 p-3 text-xs text-gray-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
                          {submittedText}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          if (interaction.type === "navigation") {
            return (
              <div key={i} className="flex justify-center">
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Navigation className="h-3 w-3" />
                  {interaction.content}
                  {interaction.metadata && (
                    <span>
                      {" "}
                      - {Object.entries(interaction.metadata)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")}
                    </span>
                  )}
                </span>
              </div>
            );
          }

          // homework_upload, click, etc
          return (
            <div key={i} className="flex justify-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                {interaction.type}: {interaction.content || ""}
                {interaction.metadata && (
                  <span className="text-gray-500 ml-1">
                    ({Object.entries(interaction.metadata)
                      .map(([k, v]) => `${k}: ${formatMetadataValue(k, v)}`)
                      .join(', ')})
                  </span>
                )}
                <span className="text-gray-400 ml-1">
                  {new Date(interaction.timestamp).toLocaleTimeString()}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
