import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { ChatQA, ChatConversation } from "@/models";
import { ArrowLeft, MessageCircle, HelpCircle } from "lucide-react";
import { QAManager } from "./QAManager";
import { ConversationsList } from "./ConversationsList";

async function getChatData() {
  try {
    await connectDB();

    const [qaEntries, conversations] = await Promise.all([
      ChatQA.find().sort({ createdAt: -1 }).lean(),
      ChatConversation.find({ "messages.0": { $exists: true } })
        .sort({ updatedAt: -1 })
        .limit(50)
        .lean(),
    ]);

    // Simplify conversations for display
    const simplifiedConversations = conversations.map((conv) => ({
      _id: String(conv._id),
      sessionId: conv.sessionId,
      status: conv.status,
      messageCount: conv.messages.length,
      lastMessage:
        conv.messages.length > 0
          ? conv.messages[conv.messages.length - 1].content.slice(0, 100)
          : "",
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
    }));

    return {
      qaEntries: JSON.parse(JSON.stringify(qaEntries)),
      conversations: simplifiedConversations,
    };
  } catch (error) {
    console.error("[ADMIN_CHAT] Failed to load data:", error);
    return { qaEntries: [], conversations: [] };
  }
}

export default async function AdminChatPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { qaEntries, conversations } = await getChatData();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Chat Widget Management
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <HelpCircle className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {qaEntries.length}
                </p>
                <p className="text-sm text-gray-500">Custom Q&A Entries</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.length}
                </p>
                <p className="text-sm text-gray-500">Chat Conversations</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <div className="flex h-6 w-6 items-center justify-center text-lg font-bold text-blue-600">
                  {qaEntries.filter((q: { enabled: boolean }) => q.enabled).length}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {qaEntries.filter((q: { enabled: boolean }) => q.enabled).length}
                </p>
                <p className="text-sm text-gray-500">Active Q&A Entries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Q&A and Conversations */}
        <div className="space-y-8">
          {/* Q&A Section */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Custom Q&A Pairs
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Add custom question-answer pairs to enhance the chatbot&apos;s knowledge.
              These will be included in the AI&apos;s context when responding to visitors.
            </p>
            <QAManager initialQA={qaEntries} />
          </section>

          {/* Conversations Section */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Recent Conversations
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Review recent chat conversations to understand what visitors are asking about.
            </p>
            <ConversationsList initialConversations={conversations} />
          </section>
        </div>
      </main>
    </div>
  );
}
