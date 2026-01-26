import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "~/lib/api-auth";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// GET - List all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      emailVerified: users.emailVerified,
    }).from(users);

    return NextResponse.json({
      success: true,
      users: allUsers,
      total: allUsers.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new admin user
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin(request);
    if (error) return error;

    const body = await request.json();
    const { name, email, password, role = "admin" } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.insert(users).values({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        name,
        email,
        role,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
