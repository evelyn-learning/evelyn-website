import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DemoAnalyticsDashboard } from "./DemoAnalyticsDashboard";

export const metadata = {
  title: "Demo Analytics | Admin",
};

export default async function DemoAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Demo Analytics</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track product demo views and engagement
              </p>
            </div>
            <a
              href="/admin"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DemoAnalyticsDashboard />
      </main>
    </div>
  );
}
