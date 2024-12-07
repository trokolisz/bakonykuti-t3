import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';



export default function TopNav(){
    return (
      <nav className="flex items-center justify-between w-full p-4 bg-green-500 border-b-4 border-gray-500 ">
        <div className="flex items-center">
          <Link href="/" className="mr-4">Home</Link>
          <Link href="/about" className="mr-4">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
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