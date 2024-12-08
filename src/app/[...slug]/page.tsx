
import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { SignedIn } from "@clerk/nextjs"
import { formatDate } from "~/lib/utils"
import "~/styles/markdown.css"
import { db } from "~/server/db"

import { Edit } from "lucide-react"
import { eq } from "drizzle-orm"
import { pages } from "~/server/db/schema"
import { notFound } from "next/navigation"

interface Props { 
  params: Promise<{ slug: string[] }>
}

export default async function StaticPage({ params }: Props) {

  const { slug } = await params
  const slugPath = slug.join("/")
  const page = await db.query.pages.findFirst({
    where: eq(pages.slug, slugPath),
  })

  if (!page) {
    notFound();
  }


    const content = page.content.split('\\n').join('\n')
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{page.title}</h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {formatDate(page.lastModified)}
            </p>
          </div>
          <SignedIn>
            <div>logged in</div>
            {/* <Button
              variant="outline"
              onClick={() => router.push(`/admin/pages/edit/${slugPath}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Page
            </Button> */}
          </SignedIn>
        </div>

        <Card className="p-6 prose prose-green dark:prose-invert max-w-none markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </Card>
      </div>
    </div>
  )
}