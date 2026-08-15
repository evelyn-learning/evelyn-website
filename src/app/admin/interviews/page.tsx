import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Interview } from "@/models";
import { Plus, Edit, Trash2, Eye, ArrowLeft, Play } from "lucide-react";
import { DeleteButton } from "./DeleteButton";

async function getInterviews() {
  await connectDB();
  const interviews = await Interview.find().sort({ episode: -1 }).lean();
  return JSON.parse(JSON.stringify(interviews));
}

export default async function AdminInterviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const interviews = await getInterviews();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
            </div>
            <Link
              href="/admin/interviews/new"
              className="inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Interview
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
                    Episode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Published
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {interviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No interviews yet. Create your first interview!
                    </td>
                  </tr>
                ) : (
                  interviews.map((interview: any) => (
                    <tr key={interview._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{interview.episode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate font-medium text-gray-900">
                          {interview.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {interview.guest?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(interview.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/interviews/${interview.slug}`}
                            target="_blank"
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <a
                            href={interview.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                            title="Watch on YouTube"
                          >
                            <Play className="h-4 w-4" />
                          </a>
                          <Link
                            href={`/admin/interviews/${interview._id}/edit`}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <DeleteButton id={interview._id} type="interviews" />
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
