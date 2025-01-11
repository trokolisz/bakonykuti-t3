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
import { SignedIn } from "@clerk/nextjs"
import { type News } from "~/server/db/schema";

import "~/styles/markdown.css";
import { deleteNews } from './actions'

interface NewsComponentProps {
  newsItem: News  ;
  deleteNews: (id:number) => Promise<void>;
};


export function NewsComponent({ newsItem }: NewsComponentProps) {
  const router = useRouter()

  useEffect(() => {
    if (!newsItem) {
      router.push("/news")
    }
  }, [newsItem, router])

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
              <h1 className="text-3xl font-bold mb-2">{newsItem.title}</h1>
              <p className="text-sm text-muted-foreground">
                Szerző: {newsItem.creatorName} • {formatDate(newsItem.createdAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <SocialShare 
                title={newsItem.title} 
                url={`https://bakonykuti.hu/news/${newsItem.id}`} 
              />
              <SignedIn>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/news/edit/${newsItem.id}`)}
                >
                  
                  <Edit className="mr-2 h-4 w-4" />
                  Szerkesztés
                </Button>
                <Button variant="destructive" onClick={async () => {
                  await deleteNews(newsItem.id);
                  window.location.href = "/hirek";
                }} className="ml-2">
                  Delete
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[400px] mb-6">
          <Image
            src={newsItem.thumbnail}
            alt={newsItem.title}
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill                     
            className="object-cover rounded-lg"
            
            priority
          />
        </div>

        <Card className="p-6 prose prose-green dark:prose-invert max-w-none markdown bg-[hsla(80,30%,17%,1)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{newsItem.content}</ReactMarkdown>
        </Card>
      </div>
    </div>
  )
}