import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB, isDBConfigured } from "@core/db";
import { BlogPost, Webinar, Interview, Speaker, ContactSubmission, TutorSession, Lead } from "@/models";
import {
  FileText,
  Video,
  Mic,
  Users,
  MessageSquare,
  MessageCircle,
  Settings,
  Plus,
  ArrowRight,
  Sparkles,
  BarChart3,
  Globe,
  Building2,
  GraduationCap,
  Send,
} from "lucide-react";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { HealthStatus } from "@/components/admin/HealthStatus";

async function getStats() {
  if (!isDBConfigured()) {
    return {
      posts: 0,
      webinars: 0,
      interviews: 0,
      speakers: 0,
      contacts: 0,
      tutorSessions: 0,
      outreachStaged: 0,
    };
  }
  try {
    await connectDB();
    const [posts, webinars, interviews, speakers, contacts, tutorSessions, outreachStaged] =
      await Promise.all([
        BlogPost.countDocuments(),
        Webinar.countDocuments(),
        Interview.countDocuments(),
        Speaker.countDocuments(),
        ContactSubmission.countDocuments({ status: "new" }),
        TutorSession.countDocuments(),
        Lead.countDocuments({ status: "staged" }),
      ]);
    return { posts, webinars, interviews, speakers, contacts, tutorSessions, outreachStaged };
  } catch {
    return {
      posts: 0,
      webinars: 0,
      interviews: 0,
      speakers: 0,
      contacts: 0,
      tutorSessions: 0,
      outreachStaged: 0,
    };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const stats = await getStats();

  const cards = [
    {
      title: "Blog Posts",
      count: stats.posts,
      icon: FileText,
      href: "/admin/blog",
      color: "bg-blue-500",
    },
    {
      title: "Webinars",
      count: stats.webinars,
      icon: Video,
      href: "/admin/webinars",
      color: "bg-purple-500",
    },
    {
      title: "Interviews",
      count: stats.interviews,
      icon: Mic,
      href: "/admin/interviews",
      color: "bg-green-500",
    },
    {
      title: "Speakers",
      count: stats.speakers,
      icon: Users,
      href: "/admin/speakers",
      color: "bg-orange-500",
    },
    {
      title: "New Contacts",
      count: stats.contacts,
      icon: MessageSquare,
      href: "/admin/contacts",
      color: "bg-red-500",
    },
    {
      title: "Tutor Sessions",
      count: stats.tutorSessions,
      icon: GraduationCap,
      href: "/admin/tutor-sessions",
      color: "bg-teal-500",
    },
    {
      title: "B2B Outreach",
      count: stats.outreachStaged,
      icon: Send,
      href: "/admin/outreach",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name}
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-red-600 hover:underline"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/blog/generator"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-500 to-primary-500 px-4 py-2 text-sm font-medium text-white hover:from-purple-600 hover:to-primary-600"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Blog Generator
            </Link>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Blog Post
            </Link>
            <Link
              href="/admin/webinars/new"
              className="inline-flex items-center rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Webinar
            </Link>
            <Link
              href="/admin/contacts"
              className="inline-flex items-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              View Messages
            </Link>
            <Link
              href="/admin/chat"
              className="inline-flex items-center rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat Widget
            </Link>
            <Link
              href="/admin/settings"
              className="inline-flex items-center rounded-lg bg-slate-500 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
            >
              <Settings className="mr-2 h-4 w-4" />
              Site Settings
            </Link>
            <Link
              href="/admin/demos"
              className="inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Demo Analytics
            </Link>
            <Link
              href="/admin/showcase"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-medium text-white hover:from-emerald-600 hover:to-teal-600"
            >
              <Globe className="mr-2 h-4 w-4" />
              Showcase Manager
            </Link>
            <Link
              href="/admin/ai-tools"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-2 text-sm font-medium text-white hover:from-violet-600 hover:to-purple-600"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Tools
            </Link>
            <Link
              href="/admin/prospecting"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white hover:from-amber-600 hover:to-orange-600"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Prospect Pipeline
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-xl bg-white p-6 shadow transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color} text-white`}
                >
                  <card.icon className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{card.count}</p>
                <p className="text-sm text-gray-600">{card.title}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 grid gap-8 lg:grid-cols-4">
          {/* Recent Blog Posts */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Blog Posts
              </h2>
              <Link
                href="/admin/blog"
                className="text-sm text-primary-500 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Recent posts will appear here once you add content.
              </p>
            </div>
          </div>

          {/* Recent Contact Submissions */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Messages
              </h2>
              <Link
                href="/admin/contacts"
                className="text-sm text-primary-500 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                New contact submissions will appear here.
              </p>
            </div>
          </div>

          {/* Settings */}
          <AdminSettings />

          {/* System Health */}
          <HealthStatus />
        </div>
      </main>
    </div>
  );
}
