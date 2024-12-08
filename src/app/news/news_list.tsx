"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Pagination } from "~/components/ui/pagination"
import { SignedIn } from "@clerk/nextjs"
import { formatDate } from "~/lib/utils"
import { Plus } from "lucide-react"

type NewsListProps = {
  initialNews: any[]
  itemsPerPage: number
  totalPages: number
}

export default function NewsList({ initialNews, itemsPerPage, totalPages }: NewsListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Get paginated news items
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedNews = initialNews.slice(startIndex, endIndex)

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Latest News</h1>
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
          <Link href={`/news/${item.id}`} key={item.id}>
            <Card className="hover:bg-primary/5 transition-colors">
              <div className="md:flex">
                <div className="relative w-full md:w-48 h-48">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
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
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{item.content}</p>
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
    </div>
  )
}
