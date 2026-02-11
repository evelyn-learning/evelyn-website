'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  ExternalLink,
  Copy,
  Eye,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  RefreshCw,
  Trash2,
  Edit,
  Send,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Phone,
  Mail,
  Target,
  HelpCircle,
  Zap,
  Globe,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  MousePointerClick,
  Users,
  Loader2,
} from 'lucide-react';
import { APIUsageWidget } from '@/components/admin/APIUsageWidget';
import { ToolRequestsWidget } from '@/components/admin/ToolRequestsWidget';
import { timeAgo } from '@/lib/utils/timeAgo';

interface ShowcaseProduct {
  productId: string;
  name: string;
  url: string;
  views: number;
  tries: number;
  completes: number;
  uniqueUsers: number;
  deviceStats: { device: string; count: number }[];
  locationStats: { country: string; countryCode: string; count: number; uniqueCities: number }[];
  recentActivity: {
    _id: string;
    productId: string;
    productTitle: string;
    eventType: string;
    deviceType: string;
    timestamp: string;
    location?: { country?: string; countryCode?: string; city?: string };
  }[];
}

interface ShowcaseAnalytics {
  products: ShowcaseProduct[];
  period: { days: number; startDate: string; endDate: string };
}

function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '\u{1F30D}';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface ShowcaseActivity {
  action: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface ShowcaseSite {
  _id: string;
  slug: string;
  businessName: string;
  businessType: string;
  originalWebsiteUrl: string;
  accessCode: string;
  status: 'active' | 'expired' | 'purchased' | 'draft' | 'declined' | 'demo' | 'needs_review';
  expiryDate: string;
  declinedAt?: string;
  reviewNotes?: string;
  reviewCreatedAt?: string;
  analytics: {
    totalViews: number;
    uniqueVisitors: number;
    toolUsage: Record<string, number>;
  };
  activityLog?: ShowcaseActivity[];
  outreachMethod?: string;
  outreachSentAt?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  expired: { label: 'Expired', color: 'bg-red-100 text-red-700', icon: XCircle },
  purchased: { label: 'Purchased', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: Clock },
  declined: { label: 'Declined', color: 'bg-orange-100 text-orange-700', icon: XCircle },
  demo: { label: 'Demo', color: 'bg-purple-100 text-purple-700', icon: Eye },
  needs_review: { label: 'Needs Review', color: 'bg-yellow-100 text-yellow-700', icon: HelpCircle },
};

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  'test-prep': 'Test Prep',
  'college-consulting': 'College Consulting',
  'tutoring': 'Tutoring',
  'homeschool': 'Homeschool',
  'special-ed': 'Special Ed',
};

export default function AdminShowcasePage() {
  const [sites, setSites] = useState<ShowcaseSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showcaseAnalytics, setShowcaseAnalytics] = useState<ShowcaseAnalytics | null>(null);
  const [showcaseLoading, setShowcaseLoading] = useState(true);
  const [showcaseDays, setShowcaseDays] = useState(30);

  const fetchShowcaseAnalytics = async () => {
    setShowcaseLoading(true);
    try {
      const res = await fetch(`/api/admin/showcase/analytics?days=${showcaseDays}`);
      if (!res.ok) throw new Error('Failed to fetch showcase analytics');
      const data = await res.json();
      setShowcaseAnalytics(data);
    } catch (err) {
      console.error('Failed to load showcase analytics:', err);
    }
    setShowcaseLoading(false);
  };

  useEffect(() => {
    fetchShowcaseAnalytics();
  }, [showcaseDays]);

  const fetchSites = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('businessType', typeFilter);

      const res = await fetch(`/api/showcase?${params}`);
      if (!res.ok) throw new Error('Failed to fetch sites');
      const data = await res.json();
      setSites(data.sites);
    } catch (err) {
      setError('Failed to load showcase sites');
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSites();
  }, [statusFilter, typeFilter]);

  const copyAccessCode = async (site: ShowcaseSite) => {
    // First fetch the full site data to get the access code
    try {
      const res = await fetch(`/api/showcase/${site.slug}`);
      if (!res.ok) throw new Error('Failed to fetch site');
      const data = await res.json();

      const url = `${window.location.origin}/showcase/${site.slug}`;
      const text = `Access your demo site:\n\nURL: ${url}\nAccess Code: ${data.site.accessCode}`;

      await navigator.clipboard.writeText(text);
      setCopiedCode(site.slug);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this showcase site?')) return;

    try {
      const res = await fetch(`/api/showcase/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchSites();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredSites = sites.filter(site =>
    site.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to count activity actions
  const countActivity = (site: ShowcaseSite, action: string) =>
    site.activityLog?.filter(a => a.action === action).length || 0;

  const stats = {
    total: sites.length,
    active: sites.filter(s => s.status === 'active' || s.status === 'demo').length,
    needsReview: sites.filter(s => s.status === 'needs_review').length,
    expired: sites.filter(s => s.status === 'expired').length,
    purchased: sites.filter(s => s.status === 'purchased').length,
    declined: sites.filter(s => s.status === 'declined').length,
    drafts: sites.filter(s => s.status === 'draft').length,
    totalViews: sites.reduce((sum, s) => sum + (s.analytics?.totalViews || 0), 0),
    keepDemoClicks: sites.reduce((sum, s) => sum + countActivity(s, 'keep_demo'), 0),
    declineClicks: sites.reduce((sum, s) => sum + countActivity(s, 'declined'), 0),
    contactClicks: sites.reduce((sum, s) => sum + countActivity(s, 'clicked_contact') + countActivity(s, 'clicked_schedule'), 0),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link href="/admin" className="hover:text-gray-700">Admin</Link>
                <span>/</span>
                <span className="text-gray-900">Showcase Sites</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">
                Prospect Showcase Manager
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/prospecting"
                className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
              >
                <Target className="w-5 h-5" />
                Prospecting
              </Link>
              <Link
                href="/admin/showcase/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
              >
                <Plus className="w-5 h-5" />
                New Showcase Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards with API Usage */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3 mb-8">
          {/* API Usage Widget - spans 2 columns */}
          <div className="col-span-2">
            <APIUsageWidget />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Total Sites</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-gray-600">{stats.drafts}</div>
            <div className="text-xs text-gray-500">Drafts</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{stats.needsReview}</div>
            <div className="text-xs text-gray-500">Needs Review</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.purchased}</div>
            <div className="text-xs text-gray-500">Purchased</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{stats.declined}</div>
            <div className="text-xs text-gray-500">Declined</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.totalViews}</div>
            <div className="text-xs text-gray-500">Total Views</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{stats.contactClicks}</div>
            <div className="text-xs text-gray-500">Contact Clicks</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-teal-600">{stats.keepDemoClicks}</div>
            <div className="text-xs text-gray-500">Keep Demo</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <div className="text-xs text-gray-500">Expired</div>
          </div>
        </div>

        {/* Tool Requests Widget */}
        <div className="mb-6">
          <ToolRequestsWidget />
        </div>

        {/* Client Showcases Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              Client Showcases
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={showcaseDays}
                onChange={(e) => setShowcaseDays(parseInt(e.target.value))}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
              <button
                onClick={fetchShowcaseAnalytics}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <RefreshCw className={`w-4 h-4 ${showcaseLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {showcaseLoading ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <Loader2 className="w-6 h-6 text-gray-400 mx-auto animate-spin" />
            </div>
          ) : showcaseAnalytics?.products.map((product) => {
            const totalDevices = product.deviceStats.reduce((sum, d) => sum + d.count, 0);
            const deviceIcons: Record<string, React.ReactNode> = {
              desktop: <Monitor className="h-4 w-4" />,
              mobile: <Smartphone className="h-4 w-4" />,
              tablet: <Tablet className="h-4 w-4" />,
            };

            return (
              <div key={product.productId} className="bg-white rounded-xl shadow-sm p-6 mb-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                    <Link href={product.url} className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                      {product.url} <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-medium">Views</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{product.views.toLocaleString()}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <MousePointerClick className="w-4 h-4" />
                      <span className="text-xs font-medium">Interactions</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{product.tries.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-medium">Completed</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{product.completes.toLocaleString()}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-orange-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium">Unique Users</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{product.uniqueUsers.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Location Breakdown */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-3">
                      <Globe className="w-4 h-4 text-emerald-500" />
                      Top Locations
                    </h4>
                    {product.locationStats.length === 0 ? (
                      <p className="text-sm text-gray-400">No location data yet</p>
                    ) : (
                      <div className="space-y-2">
                        {product.locationStats.slice(0, 5).map((loc) => (
                          <div key={loc.countryCode} className="flex items-center gap-2 text-sm">
                            <span className="text-base">{getCountryFlag(loc.countryCode)}</span>
                            <span className="text-gray-700 flex-1">{loc.country}</span>
                            <span className="text-gray-500">{loc.count}</span>
                            <span className="text-xs text-gray-400">
                              ({loc.uniqueCities} {loc.uniqueCities === 1 ? 'city' : 'cities'})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Device Breakdown */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-3">
                      <Monitor className="w-4 h-4 text-emerald-500" />
                      Devices
                    </h4>
                    {product.deviceStats.length === 0 ? (
                      <p className="text-sm text-gray-400">No device data yet</p>
                    ) : (
                      <div className="space-y-2">
                        {product.deviceStats.map((d) => (
                          <div key={d.device} className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded bg-gray-100 text-gray-600">
                              {deviceIcons[d.device] || <Monitor className="h-3.5 w-3.5" />}
                            </div>
                            <span className="text-sm capitalize text-gray-700 flex-1">{d.device}</span>
                            <span className="text-sm text-gray-500">
                              {d.count} ({totalDevices > 0 ? ((d.count / totalDevices) * 100).toFixed(0) : 0}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-3">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      Recent Activity
                    </h4>
                    {product.recentActivity.length === 0 ? (
                      <p className="text-sm text-gray-400">No activity yet</p>
                    ) : (
                      <div className="max-h-48 overflow-y-auto space-y-1.5">
                        {product.recentActivity.slice(0, 15).map((a) => (
                          <div key={a._id} className="flex items-center gap-2 rounded bg-gray-50 px-2.5 py-1.5">
                            <div
                              className={`h-1.5 w-1.5 rounded-full ${
                                a.eventType === 'view'
                                  ? 'bg-blue-500'
                                  : a.eventType === 'try'
                                  ? 'bg-purple-500'
                                  : 'bg-green-500'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-600">
                                {a.eventType} &bull; {a.deviceType}
                                {a.location?.city && ` \u2022 ${a.location.city}`}
                                {a.location?.countryCode && ` ${getCountryFlag(a.location.countryCode)}`}
                              </p>
                              <p className="text-xs text-gray-400">{timeAgo(a.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="demo">Demo</option>
                <option value="needs_review">Needs Review</option>
                <option value="declined">Declined</option>
                <option value="expired">Expired</option>
                <option value="purchased">Purchased</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="test-prep">Test Prep</option>
              <option value="college-consulting">College Consulting</option>
              <option value="tutoring">Tutoring</option>
              <option value="homeschool">Homeschool</option>
              <option value="special-ed">Special Ed</option>
            </select>

            {/* Refresh */}
            <button
              onClick={fetchSites}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Sites Table */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-500">Loading showcase sites...</p>
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No showcase sites yet</h3>
            <p className="text-gray-500 mb-4">Create your first prospect demo site to get started.</p>
            <Link
              href="/admin/showcase/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
            >
              <Plus className="w-5 h-5" />
              Create First Site
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Analytics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outreach
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSites.map((site) => {
                  const statusConfig = STATUS_CONFIG[site.status];
                  const StatusIcon = statusConfig.icon;
                  const daysUntilExpiry = Math.ceil(
                    (new Date(site.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr key={site._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{site.businessName}</div>
                        <div className="text-sm text-gray-500">/showcase/{site.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {BUSINESS_TYPE_LABELS[site.businessType] || site.businessType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        {site.status === 'active' && (
                          <div className={`text-xs mt-1 ${daysUntilExpiry <= 3 ? 'text-red-500' : 'text-gray-500'}`}>
                            {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expires today'}
                          </div>
                        )}
                        {site.status === 'needs_review' && site.reviewNotes && (
                          <div className="text-xs mt-1 text-yellow-700 max-w-[200px] truncate" title={site.reviewNotes}>
                            ⚠️ {site.reviewNotes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span>{site.analytics?.totalViews || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                            <span>{Object.values(site.analytics?.toolUsage || {}).reduce((a: number, b: number) => a + b, 0)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-xs">
                          {/* Contact clicks */}
                          <div className="flex items-center gap-1" title="Contact/Schedule clicks">
                            <Phone className="w-3 h-3 text-emerald-500" />
                            <span className="text-gray-600">
                              {countActivity(site, 'clicked_contact') + countActivity(site, 'clicked_schedule')}
                            </span>
                          </div>
                          {/* Keep demo clicks */}
                          <div className="flex items-center gap-1" title="Keep Demo clicks">
                            <ThumbsUp className="w-3 h-3 text-teal-500" />
                            <span className="text-gray-600">
                              {countActivity(site, 'keep_demo')}
                            </span>
                          </div>
                          {/* Declined */}
                          {site.status === 'declined' && (
                            <div className="flex items-center gap-1" title="Declined">
                              <ThumbsDown className="w-3 h-3 text-orange-500" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {site.outreachSentAt ? (
                          <div className="text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                              <Send className="w-3 h-3" />
                              Sent
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(site.outreachSentAt).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not sent</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyAccessCode(site)}
                            className={`p-2 rounded-lg transition ${
                              copiedCode === site.slug
                                ? 'bg-green-100 text-green-600'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Copy access details"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/showcase/${site.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="View site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/showcase/${site.slug}`}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="Edit site"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(site.slug)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete site"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
