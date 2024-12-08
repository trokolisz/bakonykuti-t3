
'use client'

import { SignedIn } from "@clerk/nextjs"
import { Button } from "./ui/button"
import { Edit } from "lucide-react"
import { useRouter } from "next/navigation"

export function EditPageButton({ slugPath }: { slugPath: string }) {
  const router = useRouter()

  return (
    <SignedIn>
      <Button
        variant="outline"
        onClick={() => router.push(`/admin/pages/edit/${slugPath}`)}
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit Page
      </Button>
    </SignedIn>
  )
}