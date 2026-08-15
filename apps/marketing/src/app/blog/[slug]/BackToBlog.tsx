"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackToBlog() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center text-sm font-medium text-primary-500 hover:underline"
    >
      <ArrowLeft className="mr-1 h-4 w-4" />
      Back to Blog
    </button>
  );
}
