import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

/**
 * Safe authentication wrapper for API routes
 * Uses JWT tokens instead of auth() to avoid bind errors
 */
export async function safeAuth(request: NextRequest) {
  try {
    // Get the secret from environment or use a fallback
    const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

    if (!secret) {
      console.error('NEXTAUTH_SECRET or AUTH_SECRET not found in environment');
      return null;
    }

    const token = await getToken({
      req: request,
      secret: secret
    });

    if (!token) {
      return null;
    }

    // Convert token to session-like object
    return {
      user: {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
      }
    };
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
export async function requireAuth(request: NextRequest) {
  const session = await safeAuth(request);

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
export async function requireAdmin(request: NextRequest) {
  const session = await safeAuth(request);

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
