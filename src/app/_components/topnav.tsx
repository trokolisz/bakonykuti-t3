import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
export function TopNav(){
    return (
        <nav className="flex items-center justify-between w-full"   >
            <div className="flex items-center">
                <Link href="/">ASD</Link>
            </div>
            <div className="flex items-center">
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div> 
        </nav>
    )
}