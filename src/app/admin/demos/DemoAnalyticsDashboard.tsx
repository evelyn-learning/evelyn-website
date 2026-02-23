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

  const fetchSessionDetail = useCallback(async (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
      setSessionDetail(null);
      return;
    }

    setExpandedSession(sessionId);
    setDetailLoading(true);
    try {
      const response = await fetch(`/api/admin/demos/sessions?sessionId=${sessionId}`);
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
                    isExpanded={expandedSession === s.sessionId}
                    detail={expandedSession === s.sessionId ? sessionDetail : null}
                    detailLoading={expandedSession === s.sessionId && detailLoading}
                    onToggle={() => fetchSessionDetail(s.sessionId)}
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
              <InteractionTimeline interactions={detail.session.interactions} />
            ) : (
              <p className="text-center text-gray-500 py-4">No interaction data</p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function InteractionTimeline({ interactions }: { interactions: SessionInteraction[] }) {
  if (interactions.length === 0) {
    return <p className="text-center text-gray-500 py-4">No interactions recorded</p>;
  }

  return (
    <div className="max-h-96 overflow-y-auto space-y-2">
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
          return (
            <div key={i} className="flex justify-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                <Wrench className="h-3 w-3" />
                {interaction.content}
                {interaction.metadata && (
                  <span className="text-purple-500">
                    ({Object.values(interaction.metadata).join(", ")})
                  </span>
                )}
              </span>
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
              <span className="text-gray-400">
                {new Date(interaction.timestamp).toLocaleTimeString()}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
