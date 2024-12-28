import { ReactNode } from 'react'
import { SignedIn, SignedOut } from "@clerk/nextjs"
export default function AdminLayout({
    children,
}: {
    children: ReactNode
}) {

    return (

        <>
            <SignedOut>
                <div className="text-center">Lépj be </div>
            </SignedOut>
            <SignedIn>
                <div className="min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SignedIn>

        </>

    )
}