'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Sparkles,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  Eye,
  Clock,
  ArrowRight,
  LogOut,
  Wrench,
  Library,
} from 'lucide-react';
import { SiteContext } from '../../ShowcaseLayoutClient';

interface StaffSession {
  site: {
    slug: string;
    businessName: string;
    enabledTools: string[];
  };
  timestamp: number;
  authenticated: boolean;
}

export default function StaffDashboardPage() {
  const site = useContext(SiteContext);
  const router = useRouter();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!site) return;

    // Check for staff session
    const stored = sessionStorage.getItem(`showcase_staff_${site.slug}`);
    if (stored) {
      const parsed = JSON.parse(stored) as StaffSession;
      // Check if session is valid (less than 24 hours old)
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 && parsed.authenticated) {
        setSession(parsed);
        setIsLoading(false);
        return;
      }
    }
    // Redirect to login if no valid session
    router.push(`/showcase/${site.slug}/staff`);
  }, [site, router]);

  if (!site || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!session) return null;

  const baseUrl = `/showcase/${site.slug}`;

  const handleLogout = () => {
    sessionStorage.removeItem(`showcase_staff_${site.slug}`);
    router.push(`${baseUrl}/staff`);
  };

  // Mock analytics data
  const analytics = {
    pageViews: 1247,
    uniqueVisitors: 423,
    toolUsage: 89,
    contactSubmissions: 12,
  };

  const recentActivity = [
    { type: 'contact', message: 'New inquiry from Sarah M.', time: '2 hours ago' },
    { type: 'tool', message: 'Test Generator used', time: '5 hours ago' },
    { type: 'view', message: 'Programs page viewed 15 times', time: '1 day ago' },
  ];

  const quickLinks = [
    {
      icon: Sparkles,
      title: 'AI Tools',
      description: 'Generate tests, grade essays, help with homework',
      href: `${baseUrl}/staff/tools`,
      color: site.branding.primaryColor,
    },
    {
      icon: Library,
      title: 'Tool Library',
      description: 'Browse and enable AI tools for your practice',
      href: `${baseUrl}/staff/library`,
      color: '#F59E0B',
    },
    {
      icon: MessageSquare,
      title: 'Chat Conversations',
      description: 'View visitor chat history',
      href: `${baseUrl}/staff/conversations`,
      color: '#10B981',
    },
    {
      icon: FileText,
      title: 'Custom Q&A',
      description: 'Train your AI chat assistant',
      href: `${baseUrl}/staff/chat-qa`,
      color: '#8B5CF6',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Staff Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${site.branding.primaryColor}15` }}
              >
                <LayoutDashboard className="w-5 h-5" style={{ color: site.branding.primaryColor }} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-sm text-gray-500">{site.businessName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={baseUrl}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View Public Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-6 mb-8 text-white"
          style={{
            background: `linear-gradient(135deg, ${site.branding.primaryColor} 0%, ${site.branding.secondaryColor} 100%)`,
          }}
        >
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-white/90">
            Here&apos;s what&apos;s happening with your site today.
          </p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Eye, label: 'Page Views', value: analytics.pageViews, change: '+12%' },
            { icon: Users, label: 'Unique Visitors', value: analytics.uniqueVisitors, change: '+8%' },
            { icon: Wrench, label: 'Tool Usage', value: analytics.toolUsage, change: '+24%' },
            { icon: MessageSquare, label: 'New Messages', value: analytics.contactSubmissions, change: '+3' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </span>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {quickLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${link.color}15` }}
                  >
                    <link.icon className="w-6 h-6" style={{ color: link.color }} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{link.title}</h4>
                  <p className="text-sm text-gray-500 mb-3">{link.description}</p>
                  <span
                    className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                    style={{ color: link.color }}
                  >
                    Open
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${site.branding.primaryColor}15` }}
                    >
                      {activity.type === 'contact' && (
                        <MessageSquare className="w-4 h-4" style={{ color: site.branding.primaryColor }} />
                      )}
                      {activity.type === 'tool' && (
                        <Sparkles className="w-4 h-4" style={{ color: site.branding.primaryColor }} />
                      )}
                      {activity.type === 'view' && (
                        <TrendingUp className="w-4 h-4" style={{ color: site.branding.primaryColor }} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enabled Tools */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your AI Tools</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-wrap gap-3">
              {(session.site.enabledTools || ['test-generator', 'homework-helper', 'essay-scorer']).map((tool) => (
                <Link
                  key={tool}
                  href={`${baseUrl}/staff/tools?tool=${tool}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  <Sparkles className="w-4 h-4" style={{ color: site.branding.primaryColor }} />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {tool.replace(/-/g, ' ')}
                  </span>
                </Link>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Click any tool to start using it, or go to the{' '}
              <Link href={`${baseUrl}/staff/tools`} className="text-blue-600 hover:underline">
                Tools page
              </Link>{' '}
              for the full experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
