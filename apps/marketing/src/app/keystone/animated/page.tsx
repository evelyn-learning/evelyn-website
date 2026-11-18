import { redirect } from "next/navigation";
import { requireUser } from "@/lib/keystone/auth";
import { ksHref } from "@/lib/keystone/paths";

export const dynamic = "force-dynamic";

// The separate animated list is gone: animations are reviewed on the item page, from the owner's queue.
export default async function AnimatedList() {
  await requireUser();
  redirect(await ksHref("/queue"));
}
