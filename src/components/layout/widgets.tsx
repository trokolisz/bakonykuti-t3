import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import EventCalendar from "~/components/calendar/event-calendar"
import { Button } from "~/components/ui/button"
import { VillageMap } from "~/components/map/village-map"
import { WeatherWidget } from "~/components/shared/weather-widget"
import type { WeatherData } from "~/types"
import { NewsCarousel } from "~/components/shared/news-carousel"
import MapEmbed from "~/components/MapEmbed"
import { fetchWeather } from "~/server/fetchWeather"
import { db } from "~/server/db"
import { MapPin, Newspaper, Leaf } from "lucide-react"
import { auth } from "~/auth"
import Link from "next/link"
import Image from "next/image"

export async function Widgets() {
    const weather = await fetchWeather()
    const latestNews = await db.query.news.findMany({
        orderBy: (news, { desc }) => [desc(news.createdAt)],
        limit: 5
    })
    const events = await db.query.events.findMany()
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
                {(async () => {
                    const session = await auth();
                    return session?.user?.role === 'admin' ? (
                        <Link href="/admin/events">
                            <Button variant="outline" size="sm">Kezelés</Button>
                        </Link>
                    ) : null;
                })()}
            </CardHeader>
            <CardContent>
                <EventCalendar events={events}/>
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
                <MapEmbed />
            </CardContent>
        </Card>




    </div>
    )

}