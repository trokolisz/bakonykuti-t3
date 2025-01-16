import { Leaf } from "lucide-react"

import { SearchDialog } from "~/components/shared/search-dialog"

import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"

import { type Card as CardTypes } from "~/types"

import { Widgets } from '~/components/layout/widgets'


const cards: CardTypes[] = [
  { id: 1, image: "https://utfs.io/f/26L8Sk7UnuECIyJSHCF3U6xf5SojbkZpQ2y7DV0lPOWMeCBq", title: 'Köszöntő',  href: '/#welcome' },
  { id: 2, image: "https://utfs.io/f/26L8Sk7UnuECcDloPqMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O", title: 'Bakonykúti',  href: '/bakonykuti' },
  { id: 3, image: "https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECyd37IXvN5Ci9zgbl18T6LeS24FroQGx7wRkH", title: 'Hírek',  href: '/hirek' },
  { id: 4, image: "https://utfs.io/f/26L8Sk7UnuECo0dXRGAu3SMxWU2adZA8VJYKbfw6OtzGmPIQ", title: 'Önkormányzat',  href: '/onkormanyzat' },
  { id: 5, image: "https://utfs.io/f/26L8Sk7UnuECIaccBCbF3U6xf5SojbkZpQ2y7DV0lPOWMeCB", title: 'Intézmények',  href: '/intezmenyek' },
  { id: 6, image: "https://utfs.io/f/26L8Sk7UnuECC7hPjSoD3h5BTWPtNcop4XHGVmvlbLQxAy71", title: 'Egészségügy',  href: '/egeszsegugy' },
  { id: 7, image: "https://utfs.io/f/26L8Sk7UnuECXtaSj3cZENFc91oCB07LqidpvXmUWH4VeMwx", title: 'Galéria',  href: '/galeria' },
  { id: 8, image: "https://utfs.io/f/26L8Sk7UnuECXjCxYrcZENFc91oCB07LqidpvXmUWH4VeMwx", title: 'Közérdekü',  href: '/kozerdeku' },
  { id: 9, image: "https://utfs.io/f/26L8Sk7UnuECctyHHfMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O", title: 'Ügyintézés',  href: '/ugyintezes' },
];


export default async function Home() {
  const pages = await db.query.pages.findMany()
  const news = await db.query.news.findMany()


  return (
    <>  
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <SearchDialog pages={pages} news={news} />
          <AccessibilityMenu />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <CardGrid cards={cards} />


            </section>
            
            <div id="welcome" className="scroll-mt-20"/>
            <section className="bg-primary/5 p-8 rounded-lg border border-primary/10">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Leaf className="h-8 w-8 text-primary" />
                Tisztelt Látogató!
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
              Örömmel és tisztelettel köszöntöm Önt Fejér vármegye legkisebb önálló települése, Bakonykúti község
              honlapján!
              </p>
              <p className="text-lg text-muted-foreground mb-4">
              Bakonykúti a Kelet-Bakony hegység lábánál, a Burok-völgyi természetvédelmi terület mentén, csodálatos
természeti környezetben fekszik. A mai rohanó világunkban egyre több embert ragad meg a gyönyörű természeti
környezet, az eredeti településszerkezetét és építési hagyományait megőrző, emberléptékű településünk. Ennek
köszönhetően egyre többen választják állandó lakóhelyül Bakonykútit, így az ezredfordulón még alig 100 fős
lélekszámú településünk napjainkban már 170 főnek az otthona. De egyre több látogató is felkeresi Bakonykútit és
környékét, nemcsak a településünkön áthaladó Országos Kéktúra útvonalán a bakancsos turisták, hanem olyanok
is, akik több napot töltenek el Bakonykútiban, kihasználva a településünkön egyre több falusi szálláshely és
vendégház szolgáltatásait.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
              Önkormányzatunk legfontosabb célkitűzései közé tartozik, hogy megőrizzük mindazon értékeket, amelyek
miatt vonzó ez a kicsiny zsáktelepülés, továbbá biztosítani, hogy az alacsony lélekszám ellenére élhető település
maradjon Bakonykúti, hogy mindazon szolgáltatás, amely a XXI. században elvárható, az helyben vagy elérhető
közelségben, a szomszédos településekkel összefogva a lakosság rendelkezésére álljon.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
              A honlapunkon az érdeklődők további információt találhatnak Bakonykúti múltjáról, jelenéről és
természeti környezetéről, településünk lakói pedig nyomon követhetik az önkormányzat képviselő-testületének
munkáját, megtalálhatják a községünkkel kapcsolatos közérdekű információkat, aktuális híreket.
              </p>
              
              <p className="text-lg text-muted-foreground mb-0 text-center">
                Marics József
              </p>
              <p className="text-lg text-muted-foreground mb-4 text-center">
                polgármester
              </p>
            </section>


          </div>

          <Widgets />
        </div>
      </div>
      <CookieConsent />
    </>
  )
}