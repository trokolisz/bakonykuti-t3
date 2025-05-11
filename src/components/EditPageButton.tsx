
'use client'

import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { Edit } from "lucide-react"
import { useRouter } from "next/navigation"

export function EditPageButton({ slugPath }: { slugPath: string }) {
  const router = useRouter()
  const { data: session } = useSession()

  // Only show the button if the user is authenticated and has admin role
  if (!session?.user || session.user.role !== 'admin') {
    return null
  }

  return (
    <Button
      variant="outline"
      onClick={() => router.push(`/admin/pages/edit/${slugPath}`)}
    >
      <Edit className="mr-2 h-4 w-4" />
      Edit Page
    </Button>
  )
}