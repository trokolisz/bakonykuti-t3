import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '~/auth'

export default async function AdminLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = await auth()

    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'admin') {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                    {children}
                </div>
            </div>
        </div>
    )
}