import { redirect } from "next/navigation";
import { currentUser } from "@/lib/keystone/auth";
import { ksHref } from "@/lib/keystone/paths";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await currentUser()) redirect(await ksHref("/"));
  return (
    <main className="ks-login">
      <div className="ks-card">
        <h1>Keystone</h1>
        <p className="ks-sub">Review of AI solutions for SOLARO items · Castle Rock Research and Evelyn Learning</p>
        <LoginForm />
      </div>
    </main>
  );
}
