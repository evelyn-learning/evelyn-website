"use client";

import { usePathname } from "next/navigation";
import { ChatWidget } from "./ChatWidget";

export function ChatWidgetWrapper() {
  const pathname = usePathname();

  // Don't show chat widget on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <ChatWidget />;
}
