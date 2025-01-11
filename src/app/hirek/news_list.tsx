"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Pagination } from "~/components/ui/pagination"
import { SignedIn } from "@clerk/nextjs"
import { formatDate } from "~/lib/utils"
import { Plus } from "lucide-react"
import { type News } from "~/types"
import "~/styles/markdown.css"

type NewsListProps = {
  initialNews: News[]
  itemsPerPage: number
  totalPages: number
}

export default function NewsList({ initialNews, itemsPerPage, totalPages }: NewsListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Remove client-side slicing as it causes hydration issues
  const paginatedNews = initialNews

  return (
    <>
    <div className="container py-8"></div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Legfrissebb hírek</h1>
        <SignedIn>
          <Link href="/admin/news/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create News
            </Button>
            
          </Link>
          
        </SignedIn>
      </div>

      <div className="grid gap-6 mb-8">
        {paginatedNews.map((item) => (
          <Link href={`/hirek/${item.id}`} key={item.id}>
            <Card className="hover:bg-primary/5 transition-colors">
              <div className="md:flex">
                <div className="relative w-full md:w-48 h-48">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    priority
                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      By {item.creatorName} on {formatDate(item.createdAt)}
                    </div>
                  </CardHeader>
                  <CardContent className="markdown">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                      a: ({node, ...props}) => <span {...props} />
                      }}
                    >
                      {item.content?.split('\n').slice(0, 2).join('\n') ?? ''}
                    </ReactMarkdown>
                  </CardContent>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    

</>
  )
}
