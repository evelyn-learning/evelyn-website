import { requireUser } from "@/lib/keystone/auth";
import { ROLE_LABEL } from "@/lib/keystone/config";
import { TopBar } from "../_components/TopBar";
import { PasswordForm } from "./PasswordForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Change password" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <TopBar user={user} on="account" />
      <main className="ks-main" style={{ maxWidth: 520 }}>
        <h1>Change password</h1>
        <p className="ks-sub">
          {user.name} · {ROLE_LABEL[user.role]} · username <b>{user.username}</b>. Changing it signs you out everywhere else.
        </p>
        <section className="ks-card">
          <PasswordForm />
        </section>
      </main>
    </>
  );
}
