import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'

import { Card } from "~/components/ui/card"

import { formatDate } from "~/lib/utils"
import "~/styles/markdown.css"
import { db } from "~/server/db"
import { EditPageButton } from "~/components/EditPageButton"

import { Widgets } from '~/components/layout/widgets'
import { eq } from "drizzle-orm"
import { pages } from "~/server/db/schema"
import { notFound } from "next/navigation"
import { SearchDialog } from "~/components/shared/search-dialog"

import type { WeatherData } from "~/types"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"
import { CookieConsent } from "~/components/shared/cookie-consent"
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



interface Props {
  params: Promise<{ slug: string[] }>
}

export default async function StaticPage({ params }: Props) {
  const weather = await fetchWeather()
  const { slug } = await params
  const slugPath = slug.join("/")
  const news = await db.query.news.findMany()
  const page = await db.query.pages.findFirst({
    where: eq(pages.slug, slugPath),
  })

  const all_pages = await db.query.pages.findMany()
  if (!page) {
    notFound();
  }


  const content = page.content.split('\\n').join('\n')
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
                  <h1 className="text-3xl font-bold mb-2">{page.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {formatDate(page.lastModified)}
                  </p>
                </div>
                <EditPageButton slugPath={slugPath} />
              </div>
              <Card className="p-6 prose prose-green dark:prose-invert max-w-none markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </Card>
            </section>


          </div>

          <Widgets />
        </div>
      </div>
      <CookieConsent />
    </>



  )
}