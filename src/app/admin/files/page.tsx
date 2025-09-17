import { redirect } from 'next/navigation';
import { auth } from '~/auth';
import FileManagementClient from './FileManagementClient';

export default async function FileManagementPage() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      redirect('/api/auth/signin');
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">File Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage all uploaded files, detect orphaned files, and perform cleanup operations
            </p>
          </div>
        </div>

        <FileManagementClient />
      </div>
    );
  } catch (error) {
    console.error('Error in FileManagementPage:', error);
    redirect('/api/auth/signin');
  }
}
