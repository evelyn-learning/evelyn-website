"use client";

import { useState } from "react";
import { Save, Plus, X, Loader2 } from "lucide-react";

interface Settings {
  contactEmail: string;
  contactPhone: string;
  emergencySupport: string;
  responseTime: string;
  businessHours: string;
  offices: string[];
  demoLink: string;
  companyName: string;
  companyTagline: string;
  companyDescription: string;
  differentiators: string[];
  stats: Array<{ label: string; value: string }>;
  securityCertifications: string[];
  securityDescription: string;
  lmsPlatforms: string[];
  integrationCapabilities: string[];
}

interface SettingsFormProps {
  initialSettings: Settings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof Settings, value: unknown) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: keyof Settings, defaultValue: string = "") => {
    const current = settings[field] as string[];
    updateField(field, [...current, defaultValue]);
  };

  const removeArrayItem = (field: keyof Settings, index: number) => {
    const current = settings[field] as string[];
    updateField(
      field,
      current.filter((_, i) => i !== index)
    );
  };

  const updateArrayItem = (
    field: keyof Settings,
    index: number,
    value: string
  ) => {
    const current = settings[field] as string[];
    const updated = [...current];
    updated[index] = value;
    updateField(field, updated);
  };

  const addStat = () => {
    updateField("stats", [...settings.stats, { label: "", value: "" }]);
  };

  const updateStat = (
    index: number,
    key: "label" | "value",
    value: string
  ) => {
    const updated = [...settings.stats];
    updated[index][key] = value;
    updateField("stats", updated);
  };

  const removeStat = (index: number) => {
    updateField(
      "stats",
      settings.stats.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Contact Information */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Contact Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => updateField("contactPhone", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Business Hours
            </label>
            <input
              type="text"
              value={settings.businessHours}
              onChange={(e) => updateField("businessHours", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Response Time Message
            </label>
            <input
              type="text"
              value={settings.responseTime}
              onChange={(e) => updateField("responseTime", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Emergency Support Message
            </label>
            <input
              type="text"
              value={settings.emergencySupport}
              onChange={(e) => updateField("emergencySupport", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Demo Scheduling Link
            </label>
            <input
              type="url"
              value={settings.demoLink}
              onChange={(e) => updateField("demoLink", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Office Locations
            </label>
            {settings.offices.map((office, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={office}
                  onChange={(e) =>
                    updateArrayItem("offices", i, e.target.value)
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={() => removeArrayItem("offices", i)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("offices")}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4" /> Add Office
            </button>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Company Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tagline
            </label>
            <input
              type="text"
              value={settings.companyTagline}
              onChange={(e) => updateField("companyTagline", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              value={settings.companyDescription}
              onChange={(e) =>
                updateField("companyDescription", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Key Differentiators
            </label>
            {settings.differentiators.map((diff, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={diff}
                  onChange={(e) =>
                    updateArrayItem("differentiators", i, e.target.value)
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={() => removeArrayItem("differentiators", i)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("differentiators")}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4" /> Add Differentiator
            </button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company Stats
            </label>
            {settings.stats.map((stat, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  className="w-32 rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={() => removeStat(i)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={addStat}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4" /> Add Stat
            </button>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Security & Compliance
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Security Description
            </label>
            <textarea
              rows={2}
              value={settings.securityDescription}
              onChange={(e) =>
                updateField("securityDescription", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Certifications
            </label>
            {settings.securityCertifications.map((cert, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={cert}
                  onChange={(e) =>
                    updateArrayItem("securityCertifications", i, e.target.value)
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={() => removeArrayItem("securityCertifications", i)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("securityCertifications")}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4" /> Add Certification
            </button>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Integrations
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              LMS Platforms
            </label>
            {settings.lmsPlatforms.map((platform, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={platform}
                  onChange={(e) =>
                    updateArrayItem("lmsPlatforms", i, e.target.value)
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={() => removeArrayItem("lmsPlatforms", i)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("lmsPlatforms")}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4" /> Add Platform
            </button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Integration Capabilities
            </label>
            {settings.integrationCapabilities.map((cap, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={cap}
                  onChange={(e) =>
                    updateArrayItem("integrationCapabilities", i, e.target.value)
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={() => removeArrayItem("integrationCapabilities", i)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("integrationCapabilities")}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4" /> Add Capability
            </button>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
