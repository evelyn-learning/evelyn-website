"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle, Archive, Trash2, X } from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
}

export function ContactActions({ contact }: { contact: Contact }) {
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const updateStatus = async (status: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/contacts/${contact._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      alert("Failed to update");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteContact = async () => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const res = await fetch(`/api/admin/contacts/${contact._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => {
            setShowModal(true);
            if (contact.status === "new") {
              updateStatus("read");
            }
          }}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="View"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateStatus("responded")}
          disabled={isUpdating}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-green-600"
          title="Mark as Responded"
        >
          <CheckCircle className="h-4 w-4" />
        </button>
        <button
          onClick={() => updateStatus("archived")}
          disabled={isUpdating}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-yellow-600"
          title="Archive"
        >
          <Archive className="h-4 w-4" />
        </button>
        <button
          onClick={deleteContact}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-left">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium uppercase text-gray-500">Name</label>
                  <p className="text-gray-900">{contact.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase text-gray-500">Email</label>
                  <p>
                    <a href={`mailto:${contact.email}`} className="text-primary-500 hover:underline break-all">
                      {contact.email}
                    </a>
                  </p>
                </div>
                {contact.phone && (
                  <div>
                    <label className="block text-xs font-medium uppercase text-gray-500">Phone</label>
                    <p>
                      <a href={`tel:${contact.phone}`} className="text-primary-500 hover:underline">
                        {contact.phone}
                      </a>
                    </p>
                  </div>
                )}
                {contact.company && (
                  <div>
                    <label className="block text-xs font-medium uppercase text-gray-500">Company</label>
                    <p className="text-gray-900">{contact.company}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium uppercase text-gray-500">Date</label>
                  <p className="text-gray-900">
                    {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {contact.subject && (
                <div>
                  <label className="block text-xs font-medium uppercase text-gray-500">Subject</label>
                  <p className="text-gray-900">{contact.subject}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase text-gray-500">Message</label>
                <div className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-left text-gray-900">
                  {contact.message}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t pt-4">
              <a
                href={`mailto:${contact.email}?subject=Re: ${contact.subject || "Your inquiry"}`}
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
              >
                Reply via Email
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
