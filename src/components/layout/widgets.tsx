import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { EventCalendar } from "~/components/calendar/event-calendar"
import { Button } from "~/components/ui/button"
import { VillageMap } from "~/components/map/village-map"
import { WeatherWidget } from "~/components/shared/weather-widget"
import type { WeatherData } from "~/types"
import { NewsCarousel } from "~/components/shared/news-carousel"
import GoogleMapEmbed from "~/components/GoogleMapEmbed"
import { fetchWeather } from "~/server/fetchWeather"
import { db } from "~/server/db"
import { MapPin, Newspaper, Leaf } from "lucide-react"
import { SignedIn } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"

export async function Widgets() {
    const weather = await fetchWeather()
    const latestNews = await db.query.news.findMany({
        orderBy: (news, { desc }) => [desc(news.createdAt)],
        limit: 3
    })
    return (<div className="space-y-8">
        <WeatherWidget weather={weather} />

        <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-primary" />
                    Legfrissebb hírek
                </CardTitle>
            </CardHeader>
            <CardContent>
                <NewsCarousel news={latestNews} />
            </CardContent>
        </Card>

        <Card className="bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">Események</CardTitle>
                <SignedIn>
                    <Link href="/admin/events">
                        <Button variant="outline" size="sm">Kezelés</Button>
                    </Link>
                </SignedIn>
            </CardHeader>
            <CardContent>
                <EventCalendar />
            </CardContent>
        </Card>

        <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Elhelyezkedés
                </CardTitle>
            </CardHeader>
            <CardContent>
                <GoogleMapEmbed />
                {/* <VillageMap /> */}
            </CardContent>
        </Card>




    </div>
    )

}