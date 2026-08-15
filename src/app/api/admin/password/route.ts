import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { AdminUser } from "@/models";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = passwordSchema.parse(body);

    await connectDB();

    // Find user in database
    const user = await AdminUser.findOne({ email: session.user.email });

    // This branch used to carry a SECOND copy of the hardcoded "admin123"
    // hash: with no row for the session's email it accepted that password as
    // "current" and bootstrapped an AdminUser from it. That was the intended
    // way to create the first admin, and it meant the published credential
    // stayed live as an account-creation path. Sign-in no longer has a
    // fallback either (see src/lib/auth.ts), so a session can only exist for
    // an email that already HAS a row — a missing one now means the account
    // was deleted mid-session. Seed the first admin with
    // `npx tsx scripts/seed-admin-user.ts` instead.
    if (!user) {
      return NextResponse.json(
        { message: "No admin account exists for this session" },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash and save new password
    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
    user.passwordHash = newPasswordHash;
    await user.save();

    return NextResponse.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to change password" },
      { status: 500 }
    );
  }
}
