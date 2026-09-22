import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LinkedinImport from "./LinkedinImport";

export const dynamic = "force-dynamic";

export default async function LinkedinImportPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return <LinkedinImport />;
}
