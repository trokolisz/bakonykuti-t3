"use client"


import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

import { ImageIcon, NewspaperIcon, FileTextIcon, CalendarIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { SignedIn, SignedOut } from "@clerk/nextjs"

export default function AdminDashboard() {





  return (
    <div className="container py-8">
      <SignedOut>
        <div className="text-center">Lépj be </div>
      </SignedOut>
      <SignedIn>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/news/create">
          <Card className="hover:bg-primary/5 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NewspaperIcon className="h-5 w-5 text-primary" />
                News Management
              </CardTitle>
              <CardDescription>Create and edit news articles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage all news content for the village website
              </p>
              <Button variant="outline" className="w-full">
                Create News Article
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/gallery/upload">
          <Card className="hover:bg-primary/5 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Gallery Management
              </CardTitle>
              <CardDescription>Upload and organize images</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage the village photo gallery
              </p>
              <Button variant="outline" className="w-full">
                Upload New Image
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/events">
          <Card className="hover:bg-primary/5 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Event Management
              </CardTitle>
              <CardDescription>Create and manage events</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage village events and calendar
              </p>
              <Button variant="outline" className="w-full">
                Manage Events
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/pages">
          <Card className="hover:bg-primary/5 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="h-5 w-5 text-primary" />
                Page Content
              </CardTitle>
              <CardDescription>Edit page content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Update content for various pages
              </p>
              <Button variant="outline" className="w-full">
                Edit Pages
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
      </SignedIn>
    </div>
  )
}