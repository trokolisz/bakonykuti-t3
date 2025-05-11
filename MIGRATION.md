# Migration from Clerk to NextAuth.js

This document outlines the steps to migrate from Clerk authentication to NextAuth.js using your own database for user management.

## Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database

## Setup Environment Variables

1. Update your `.env` file to include the following variables:

```
# NextAuth.js
AUTH_SECRET="your-auth-secret" # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

## Run Database Migrations

1. Run the database migration script to create the necessary tables:

```bash
bun scripts/migrate-db.ts
```

## Create an Admin User

1. Create an admin user with the following command:

```bash
bun scripts/create-admin-user.ts admin@example.com your-password "Admin Name"
```

## Remove Clerk Dependencies

After confirming that NextAuth.js is working correctly, you can remove the Clerk dependencies:

```bash
bun remove @clerk/nextjs
```

## Authentication Flow

### Sign In

Users can sign in at `/auth/signin` with their email and password.

### Protected Routes

Admin routes are protected and only accessible to users with the `admin` role. These routes are under the `/admin` path.

### Server-Side Authentication

To check authentication on the server side, use:

```typescript
import { auth } from '~/auth';

// In a server component or server action
const session = await auth();
if (session?.user) {
  // User is authenticated
  console.log(session.user.id, session.user.role);
}
```

### Client-Side Authentication

To check authentication on the client side, use:

```typescript
'use client';

import { useSession } from 'next-auth/react';

// In a client component
const { data: session } = useSession();
if (session?.user) {
  // User is authenticated
  console.log(session.user.id, session.user.role);
}
```

## Troubleshooting

- If you encounter issues with authentication, check that your environment variables are set correctly.
- Ensure that the database tables were created successfully.
- Check that the admin user was created successfully.

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
