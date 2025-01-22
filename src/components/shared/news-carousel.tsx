import Image from "next/image"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import type { News } from "~/server/db/schema"

import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'



export function NewsCarousel({ news }: { news: News[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-5xl mx-auto px-4"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {news.map((item, index) => (
          <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/1">
            <Link href={`/hirek/${item.id}`}>
              <Card className="overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="md:flex bg-card rounded-lg overflow-hidden">
                  
                <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill                  
                    className="object-cover"
                  />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h2 className="text-white text-lg font-semibold">{item.title}</h2>
                </div>
                  <div className="flex-1 relative md:p-6 ">
                  <CardHeader className="md:px-0">
                    <CardTitle className="text-2xl font-bold leading-tight">
                    {item.title}
                    </CardTitle>
                    <time className="text-sm text-muted-foreground">
                    {new Date(item.createdAt).toUTCString()}
                    </time>
                  </CardHeader>
                  <CardContent className="md:px-0"></CardContent>
                    <CardContent className="md:px-0">
                      <p className="text-muted-foreground line-clamp-3 markdown text-base">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex -left-12 h-12 w-12 opacity-70 hover:opacity-100 transition-opacity" />
      <CarouselNext className="hidden md:flex -right-12 h-12 w-12 opacity-70 hover:opacity-100 transition-opacity" />
    </Carousel>
  )
}