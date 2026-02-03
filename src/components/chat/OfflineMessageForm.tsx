"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const offlineSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(1, "Message is required"),
});

type OfflineFormData = z.infer<typeof offlineSchema>;

interface OfflineMessageFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function OfflineMessageForm({
  onBack,
  onSuccess,
}: OfflineMessageFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OfflineFormData>({
    resolver: zodResolver(offlineSchema),
  });

  const onSubmit = async (data: OfflineFormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          subject: "Chat Widget Message",
          source: "chat_widget",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      setStatus("success");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-semibold text-gray-800">
          Message Sent!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to chat
      </button>

      <h3 className="mb-2 text-sm font-medium text-gray-800">
        Leave us a message
      </h3>
      <p className="mb-4 text-xs text-gray-500">
        We&apos;ll respond within 24 hours.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {status === "error" && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
            <p className="text-xs text-red-600">{errorMessage}</p>
          </div>
        )}

        <div>
          <input
            {...register("name")}
            type="text"
            placeholder="Your name"
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
              errors.name ? "border-red-300" : "border-gray-200"
            )}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Your email"
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
              errors.email ? "border-red-300" : "border-gray-200"
            )}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <textarea
            {...register("message")}
            rows={3}
            placeholder="How can we help?"
            className={cn(
              "w-full resize-none rounded-lg border px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
              errors.message ? "border-red-300" : "border-gray-200"
            )}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
