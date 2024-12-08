import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { MapPin, Newspaper, Leaf } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { EventCalendar } from "~/components/calendar/event-calendar"
import { Button } from "~/components/ui/button"
import { VillageMap } from "~/components/map/village-map"
import { SearchDialog } from "~/components/shared/search-dialog"
import { WeatherWidget } from "~/components/shared/weather-widget"
import type { WeatherData } from "~/types"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"
import { SignedIn } from "@clerk/nextjs"
import { db } from "~/server/db"

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

export default async function Home() {
  const pages = await db.query.pages.findMany()
  const news = await db.query.news.findMany()
  const weather = await fetchWeather()



  const latestNews = await db.query.news.findMany({
    orderBy: (news, { desc }) => [desc(news.createdAt)],
    limit: 3
  })

  return (
    <>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <SearchDialog pages={pages} news={news} />
          <AccessibilityMenu />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-primary/5 p-8 rounded-lg border border-primary/10">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Leaf className="h-8 w-8 text-primary" />
                Kedves Látogató
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Nagy örömmel és tisztelettel köszöntöm Önt Fejér megye legkisebb önálló településének honlapján!
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Bakonykúti a Kelet-Bakony hegység lábánál, a Burok-völgy természetvédelmi terület mentén, csodálatos természeti környezetben fekszik. A mai rohanó világunkban egyre több embert ragad meg a gyönyörû természeti környezet, az eredeti településszerkezetét és építési hagyományait megõrzõ, emberléptékû, rendezett településünk. Az Önkormányzat, a Bakonykúti Községért Közalapítvány és a lakosság összefogásával készült köztéri faszobrok még egyedibbé és vonzóvá teszik a kis falu arculatát.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                A múlt században, a mindenkori gazdasági folyamatok tükörképeként változó mértékben, de folyamatosan csökkent a falu lakossága. Örvendetes, hogy napjainkra már megfordult ez a folyamat és a népesség növekedése figyelhetõ meg. Kezdetben csak a hétvégi házak szaporodtak, de ma már egyre többen választják állandó lakhelyül is településünket, melyet az egyre több új építésû lakóház is jelez.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Településünk mellett található a Magyar Honvédség központi lõ- és gyakorlótere, amely Közép-Európa legnagyobb összefüggõ katonai területe. Mindez okoz néhány zajosabb napot is nálunk, ugyanakkor a terület viszonylagos zártsága miatt csökkent az értékes élõhelyek pusztulása, ezért számos védett állat és növény talált itt menedéket.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                A múlt örökségének megõrzése mellett jelentõs változások is történtek községünk életében. Kezdeményezésünkre az Országgyûlés 2007-ben módosította a kistérségek besorolásáról szóló törvényt, amelynek értelmében Bakonykúti a móri kistérségbõl átkerült a székesfehérvári kistérségbe. Ezzel összhangban hozta meg a képviselõ testület azt a döntést, hogy 2008. január 01-tõl az azonos kistérséghez tartozó Iszkaszentgyörggyel alakítottunk közös körjegyzõséget.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                A jövõt illetõen két fontos célt tûztünk magunk elé. Egyrészt megõrizni mindazon értékeket, ami miatt vonzó ez a település. Másrészt az alacsony lélekszám ellenére biztosítani, hogy élhetõ település maradjon Bakonykúti, hogy mindaz a szolgáltatás, amely a XXI. században elvárható, az helyben vagy elérhetõ közelségben, a szomszédos településekkel összefogva a lakosság rendelkezésére álljon.
              </p>
              <p className="text-lg text-muted-foreground mb-0 text-center">
                Marics József
              </p>
              <p className="text-lg text-muted-foreground mb-4 text-center">
                polgármester
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Newspaper className="h-6 w-6 text-primary" />
                Legfrissebb Hírek
              </h2>
              <div className="grid gap-4">
                {latestNews.map((item) => (
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

                MAP PLACEHOLDER
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