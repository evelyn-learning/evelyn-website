import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
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
    let user = await AdminUser.findOne({ email: session.user.email });

    // If user doesn't exist in DB (using fallback), create them first
    if (!user) {
      // Verify current password against fallback
      const fallbackHash = "$2a$10$QXEk.Jl/pUTJEScgf5vwKev6UXxn9JjWU/ytSzm2wRjphM4zfSivu";
      const isValidFallback = await bcrypt.compare(data.currentPassword, fallbackHash);

      if (!isValidFallback) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Create user in database with new password
      const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
      user = await AdminUser.create({
        email: session.user.email,
        name: session.user.name || "Admin",
        passwordHash: newPasswordHash,
      });

      return NextResponse.json({ success: true, message: "Password changed successfully" });
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
