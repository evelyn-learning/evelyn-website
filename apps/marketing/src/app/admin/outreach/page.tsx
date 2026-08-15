import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Lead } from "@/models";
import OutreachConsole from "./OutreachConsole";

export const dynamic = "force-dynamic";

export default async function AdminOutreachPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  await connectDB();
  const leads = JSON.parse(
    JSON.stringify(await Lead.find({}).sort({ nextActionAt: 1, updatedAt: -1 }).lean())
  );

  return <OutreachConsole initialLeads={leads} />;
}
