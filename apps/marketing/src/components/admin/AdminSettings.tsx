"use client";

import { useState } from "react";
import { Settings, Key } from "lucide-react";
import { ChangePasswordForm } from "./ChangePasswordForm";

export function AdminSettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  if (showPasswordForm) {
    return <ChangePasswordForm onClose={() => setShowPasswordForm(false)} />;
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => setShowPasswordForm(true)}
          className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50"
        >
          <Key className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Change Password</p>
            <p className="text-xs text-gray-500">Update your admin password</p>
          </div>
        </button>
      </div>
    </div>
  );
}
