import { FacebookIcon, Instagram, Mail, LogIn } from "lucide-react"
import Link from "next/link"

import { Button } from "~/components/ui/button"
import { SignedIn, SignedOut } from "@clerk/nextjs"

export default function Footer() {
  

  return (
    <footer className="w-full border-t">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p>Village Hall</p>
            <p>Main Street</p>
            <p>Village Name</p>
            <p>Postal Code</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/news" className="hover:underline">News</Link></li>
              <li><Link href="/events" className="hover:underline">Events</Link></li>
              <li><Link href="/gallery" className="hover:underline">Gallery</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services/local-services" className="hover:underline">Local Services</Link></li>
              <li><Link href="/services/transportation" className="hover:underline">Transportation</Link></li>
              <li><Link href="/services/healthcare" className="hover:underline">Healthcare</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <Link href="#" className="hover:text-primary">
                <FacebookIcon className="h-6 w-6" />
              </Link>
              <Link href="#" className="hover:text-primary">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="hover:text-primary">
                <Mail className="h-6 w-6" />
              </Link>
            </div>
            <SignedIn>
              <Link href="/admin/dashboard">
                <Button variant="outline" className="w-full">
                  Admin Dashboard
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/admin/login">
                <Button variant="outline" className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
            </SignedOut>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Village Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}