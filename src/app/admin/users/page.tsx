import { redirect } from "next/navigation";
import { auth } from "~/auth";
import UserManagementClient from "./UserManagementClient";

export default async function UserManagementPage() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      redirect('/api/auth/signin');
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage admin users and change passwords
            </p>
          </div>
        </div>

        <UserManagementClient />
      </div>
    );
  } catch (error) {
    console.error('Error in UserManagementPage:', error);
    redirect('/api/auth/signin');
  }
}
