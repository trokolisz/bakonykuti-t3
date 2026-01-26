import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "~/lib/api-auth";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// POST - Reset user password (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { newPassword } = body;

    // Validate required fields
    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id));

    return NextResponse.json({
      success: true,
      message: `Password reset successfully for ${user.email}`,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
