// Which database a script is about to write to, said before it connects. No `next/*` imports.

/** Host and port of a mongodb URI, without credentials or options. */
export function hostOf(uri: string): string {
  const m = /^mongodb(?:\+srv)?:\/\/(?:[^@/]*@)?([^/?]+)/.exec(uri);
  return m ? m[1] : "(unreadable URI)";
}

/**
 * The target of a script that writes: KEYSTONE_MONGODB_URI must be set explicitly (MONGODB_URI, the app's own
 * setting, is never taken implicitly). Returns the line to print: database name and host, never credentials.
 */
export function explicitTarget(env: Record<string, string | undefined>, dbName: string): { uri: string; line: string } {
  const uri = (env.KEYSTONE_MONGODB_URI ?? "").trim();
  if (!uri) throw new Error("Refusing to run: set KEYSTONE_MONGODB_URI explicitly (MONGODB_URI is not used by this script).");
  return { uri, line: `Database: ${dbName} on ${hostOf(uri)}` };
}
