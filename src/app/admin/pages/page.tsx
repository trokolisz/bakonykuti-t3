import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { db } from "~/server/db"
import { formatDate } from "~/lib/utils"
import { FileText } from "lucide-react"
import Link from "next/link"

export default async function PagesAdminPage() {
  const pages = await db.query.pages.findMany()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Page Management</h1>
      <div className="grid gap-6">
        {pages.map((page) => (
          <Link key={page.id} href={`/admin/pages/edit/${page.slug}`}>
            <Card className="hover:bg-primary/5 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {page.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Last modified: {formatDate(page.lastModified)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}