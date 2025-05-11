'use client'
import remarkGfm from 'remark-gfm'
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { formatDate } from "~/lib/utils"
import { ArrowLeft, Edit } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { SocialShare } from "~/components/shared/social-share"
import { useSession } from "next-auth/react"
import { type Event } from "~/server/db/schema";

import "~/styles/markdown.css";
import { deleteEvent } from './actions'

interface EventComponentProps {
  eventItem: Event  ;
  deleteEvent: (id:number) => Promise<void>;
};


export function EventComponent({ eventItem: eventItem }: EventComponentProps) {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!eventItem) {
      router.push("/rendezvenyek")
    }
  }, [eventItem, router])

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/hirek")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Vissza a hírekhez
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{eventItem.title}</h1>
              <p className="text-sm text-muted-foreground">
                Szerző: {eventItem.createdBy} • {formatDate(eventItem.createdAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <SocialShare
                title={eventItem.title}
                url={`https://bakonykuti.hu/rendezvenyek/${eventItem.id}`}
              />
              {session?.user?.role === 'admin' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/admin/events/edit/${eventItem.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Szerkesztés
                  </Button>
                  <Button variant="destructive" onClick={async () => {
                    await deleteEvent(eventItem.id);
                    window.location.href = "/rendezvenyek";
                  }} className="ml-2">
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="relative w-full h-[400px] mb-6">
          <Image
            src={eventItem.thumbnail}
            alt={eventItem.title}
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>

        <Card className="p-6 prose prose-green dark:prose-invert max-w-none markdown bg-[hsla(80,30%,17%,1)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{eventItem.content}</ReactMarkdown>
        </Card>
      </div>
    </div>
  )
}