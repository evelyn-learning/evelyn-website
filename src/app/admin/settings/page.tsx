import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getSiteSettings } from "@/models";
import { ArrowLeft } from "lucide-react";
import { SettingsForm } from "./SettingsForm";

async function getSettings() {
  try {
    await connectDB();
    const settings = await getSiteSettings();
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("[ADMIN_SETTINGS] Failed to load settings:", error);
    return null;
  }
}

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Site Settings
              </h1>
              <p className="text-sm text-gray-500">
                Manage company info, contact details, and knowledge base settings
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {settings ? (
          <SettingsForm initialSettings={settings} />
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              Failed to load settings. Please check database connection.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
