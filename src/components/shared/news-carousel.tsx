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

export function NewsCarousel({ news }: { news: News[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {news.map((item) => (
          <CarouselItem key={item.id} className="md:basis-1/1">
            <Link href={`/hirek/${item.id}`}>
              <Card className="hover:bg-primary/5 transition-colors">
                <div className="md:flex">
                  <div className="relative w-full md:w-48 h-48">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      loading="eager"
                      className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                  </div>
                  <div className="flex-1">
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">{item.content}</p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}