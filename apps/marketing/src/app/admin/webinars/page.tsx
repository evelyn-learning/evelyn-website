import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Webinar } from "@/models";
import { Plus, Edit, Trash2, Eye, ArrowLeft, Video } from "lucide-react";
import { DeleteButton } from "./DeleteButton";

async function getWebinars() {
  await connectDB();
  const webinars = await Webinar.find().sort({ date: -1 }).lean();
  return JSON.parse(JSON.stringify(webinars));
}

export default async function AdminWebinarsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const webinars = await getWebinars();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Webinars</h1>
            </div>
            <Link
              href="/admin/webinars/new"
              className="inline-flex items-center rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Webinar
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Video
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {webinars.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No webinars yet. Create your first webinar!
                    </td>
                  </tr>
                ) : (
                  webinars.map((webinar: any) => (
                    <tr key={webinar._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate font-medium text-gray-900">
                          {webinar.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(webinar.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            webinar.status === "upcoming"
                              ? "bg-blue-100 text-blue-800"
                              : webinar.status === "live"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {webinar.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {webinar.youtubeId ? (
                          <Video className="h-4 w-4 text-green-500" />
                        ) : (
                          <span className="text-gray-400">No video</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/webinars/${webinar.slug}`}
                            target="_blank"
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/webinars/${webinar._id}/edit`}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <DeleteButton id={webinar._id} type="webinars" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
