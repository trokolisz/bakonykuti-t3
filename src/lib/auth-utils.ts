'use server';

import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "~/auth";

export async function createUser(name: string, email: string, password: string, role: string = "user") {
  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  await db.insert(users).values({
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role,
  });
}

export async function authenticate(
  prevState: { error: string } | undefined,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Attempting to authenticate:", email);

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("Authentication result:", result);

    if (result?.error) {
      console.error("Authentication error:", result.error);
      return { error: "Invalid email or password" };
    }

    redirect("/");
  } catch (error) {
    console.error("Authentication exception:", error);
    if ((error as Error).message.includes("CredentialsSignin")) {
      return { error: "Invalid credentials" };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}
