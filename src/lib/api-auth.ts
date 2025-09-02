import { auth } from "~/auth";
import { NextResponse } from "next/server";

/**
 * Safe authentication wrapper for API routes
 * Handles auth() bind errors gracefully
 */
export async function safeAuth() {
  try {
    return await auth();
  } catch (error) {
    console.error('Auth error in API route:', error);
    // Return null session if auth fails
    return null;
  }
}

/**
 * Check if user is authenticated for API routes
 * Returns NextResponse with error if not authenticated
 */
export async function requireAuth() {
  const session = await safeAuth();
  
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      )
    };
  }
  
  return { session, error: null };
}

/**
 * Check if user is admin for API routes
 * Returns NextResponse with error if not admin
 */
export async function requireAdmin() {
  const session = await safeAuth();
  
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      )
    };
  }
  
  if (session.user.role !== 'admin') {
    return {
      session: null,
      error: NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    };
  }
  
  return { session, error: null };
}
