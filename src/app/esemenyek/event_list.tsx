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
import { Plus, Calendar } from "lucide-react"
import { type Event, type EventType } from "~/server/db/schema"
import "~/styles/markdown.css"
import { Badge } from "~/components/ui/badge"

type EventListProps = {
  initialEvents: Event[]
  itemsPerPage: number
  totalPages: number
}

const eventTypeLabels: Record<EventType, string> = {
  community: "Közösségi",
  cultural: "Kulturális",
  sports: "Sport",
  education: "Oktatás",
  gun_range: "Lőtér"
}

export default function EventList({ initialEvents: initialEvents, itemsPerPage, totalPages }: EventListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Remove client-side slicing as it causes hydration issues
  const paginatedNews = initialEvents

  return (
    <>
      <div className="container py-8"></div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Események</h1>
        <SignedIn>
          <Link href="/admin/events/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Új esemény
            </Button>
          </Link>
        </SignedIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedNews.map((item) => (
          <Link href={`/esemenyek/${item.id}`} key={item.id}>
            <Card className="hover:bg-primary/5 transition-colors h-full">
              <div className="flex flex-col h-full">
                <div className="relative w-full pt-[56.25%]">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    priority
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" id="event-type">
                      {eventTypeLabels[item.type as EventType]}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(item.date)}
                      </div>
                      <div>
                        By {item.createdBy}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="markdown flex-1">
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
