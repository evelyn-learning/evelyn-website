"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight } from "lucide-react";

interface QAEntry {
  _id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: string;
  enabled: boolean;
  createdAt: string;
}

interface QAManagerProps {
  initialQA: QAEntry[];
}

const CATEGORIES = [
  "general",
  "products",
  "services",
  "pricing",
  "support",
  "integrations",
  "security",
];

export function QAManager({ initialQA }: QAManagerProps) {
  const router = useRouter();
  const [qaList, setQAList] = useState(initialQA);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    keywords: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const resetForm = () => {
    setFormData({ question: "", answer: "", keywords: "", category: "general" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (qa: QAEntry) => {
    setFormData({
      question: qa.question,
      answer: qa.answer,
      keywords: qa.keywords.join(", "),
      category: qa.category,
    });
    setEditingId(qa._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        question: formData.question,
        answer: formData.answer,
        keywords: formData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        category: formData.category,
      };

      const url = editingId
        ? `/api/admin/chat/qa/${editingId}`
        : "/api/admin/chat/qa";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        router.refresh();
        // Refetch data
        const qaRes = await fetch("/api/admin/chat/qa");
        if (qaRes.ok) {
          const data = await qaRes.json();
          setQAList(data);
        }
      } else {
        alert("Failed to save Q&A entry");
      }
    } catch {
      alert("Error saving Q&A entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (qa: QAEntry) => {
    try {
      const res = await fetch(`/api/admin/chat/qa/${qa._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !qa.enabled }),
      });

      if (res.ok) {
        setQAList((prev) =>
          prev.map((item) =>
            item._id === qa._id ? { ...item, enabled: !item.enabled } : item
          )
        );
      }
    } catch {
      alert("Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Q&A?")) return;

    try {
      const res = await fetch(`/api/admin/chat/qa/${id}`, { method: "DELETE" });
      if (res.ok) {
        setQAList((prev) => prev.filter((qa) => qa._id !== id));
      }
    } catch {
      alert("Failed to delete");
    }
  };

  const filteredQA =
    filter === "all" ? qaList : qaList.filter((qa) => qa.category === filter);

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            {filteredQA.length} entries
          </span>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Q&A
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Q&A" : "Add New Q&A"}
              </h2>
              <button
                onClick={resetForm}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="What question should this answer?"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="The answer the chatbot should provide"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) =>
                      setFormData({ ...formData, keywords: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Q&A List */}
      <div className="rounded-xl bg-white shadow">
        {filteredQA.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No Q&A entries found. Add your first one to customize chatbot responses.
          </div>
        ) : (
          <div className="divide-y">
            {filteredQA.map((qa) => (
              <div
                key={qa._id}
                className={`p-4 ${!qa.enabled ? "bg-gray-50" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          qa.enabled
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {qa.category}
                      </span>
                      {!qa.enabled && (
                        <span className="text-xs text-gray-400">Disabled</span>
                      )}
                    </div>
                    <h3 className="mt-1 font-medium text-gray-900">
                      {qa.question}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {qa.answer}
                    </p>
                    {qa.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {qa.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(qa)}
                      className={`rounded p-1.5 ${
                        qa.enabled
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                      title={qa.enabled ? "Disable" : "Enable"}
                    >
                      {qa.enabled ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(qa)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(qa._id)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
