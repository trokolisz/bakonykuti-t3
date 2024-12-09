import { Card } from "~/components/ui/card"

import "~/styles/markdown.css"
import { db } from "~/server/db"
import { EditPageButton } from "~/components/EditPageButton"


import { SearchDialog } from "~/components/shared/search-dialog"
import { WeatherWidget } from "~/components/shared/weather-widget"
import { EventCalendar } from "~/components/calendar/event-calendar"
import { MapPin } from "lucide-react"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { SignedIn } from "@clerk/nextjs"
import { CardContent } from "~/components/ui/card"
import { CardHeader } from "~/components/ui/card"
import { CardTitle } from "~/components/ui/card"
import { VillageMap } from "~/components/map/village-map"
import type { WeatherData } from "~/types"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { DocumentArchive } from "~/components/documents/document-archive"


type Weather = {
  temp: number
  weatherMain: "Clear" | "Clouds" | "Rain" | "Snow" | "Thunderstorm" | "Drizzle" | "Mist" | "Smoke" | "Haze" | "Dust" | "Fog" | "Sand" | "Ash" | "Squall" | "Tornado"
}


async function fetchWeather() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Bakonykúti&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`,
    {
      next: {
        revalidate: 1800 // Cache for 30 minutes
      }
    }
  )
  const data = await response.json() as WeatherData


  if (!data.main || !data.weather?.[0]) {
    throw new Error("Invalid weather data")
  }

  const temp = data.main.temp
  const weatherMain = data.weather[0].main as Weather["weatherMain"]

  return { temp, weatherMain }
}




export default async function StaticPage() {
  const weather = await fetchWeather()

  const news = await db.query.news.findMany()


  const all_pages = await db.query.pages.findMany()


  return (
    <>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <SearchDialog pages={all_pages} news={news} />
          <AccessibilityMenu />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-primary/5 p-8 rounded-lg border border-primary/10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Dokumentumok</h1>                  
                </div>
                <EditPageButton slugPath="onkormanyzat/dokumentumok" />
              </div>
              <Card className="p-6 prose prose-green dark:prose-invert max-w-none markdown">
                <DocumentArchive/>
              </Card>
            </section>


          </div>

          <div className="space-y-8">
            <WeatherWidget weather={weather} />

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

                MAP PLACEHOLDER! WIP
                {/*
               <VillageMap />
               */}

              </CardContent>
            </Card>


          </div>
        </div>
      </div>
      <CookieConsent />
    </>



  )
}