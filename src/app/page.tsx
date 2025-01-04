import { Leaf } from "lucide-react"

import { SearchDialog } from "~/components/shared/search-dialog"

import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"

import { type Card as CardTypes } from "~/types"

import { Widgets } from '~/components/layout/widgets'


const cards: CardTypes[] = [
  { id: 1, image: "https://utfs.io/f/26L8Sk7UnuECIyJSHCF3U6xf5SojbkZpQ2y7DV0lPOWMeCBq", title: 'Köszöntő', text: 'Card description goes here.', href: '/' },
  { id: 2, image: "https://utfs.io/f/26L8Sk7UnuECcDloPqMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O", title: 'Bakonykúti', text: 'Card description goes here.', href: '/bakonykuti' },
  { id: 3, image: "https://utfs.io/f/26L8Sk7UnuECUHsDTHkJpuP41irqDG3So0BQOfy2weHZmdjT", title: 'Hírek', text: 'Card description goes here.', href: '/hirek' },
  { id: 4, image: "https://utfs.io/f/26L8Sk7UnuECo0dXRGAu3SMxWU2adZA8VJYKbfw6OtzGmPIQ", title: 'Önkormányzat', text: 'Card description goes here.', href: '/onkormanyzat' },
  { id: 5, image: "https://utfs.io/f/26L8Sk7UnuECIaccBCbF3U6xf5SojbkZpQ2y7DV0lPOWMeCB", title: 'Intézmények', text: 'Card description goes here.', href: '/intezmenyek' },
  { id: 6, image: "https://utfs.io/f/26L8Sk7UnuECC7hPjSoD3h5BTWPtNcop4XHGVmvlbLQxAy71", title: 'Egészségügy', text: 'Card description goes here.', href: '/egeszsegugy' },
  { id: 7, image: "https://utfs.io/f/26L8Sk7UnuECXtaSj3cZENFc91oCB07LqidpvXmUWH4VeMwx", title: 'Galéria', text: 'Card description goes here.', href: '/galeria' },
  { id: 8, image: "https://utfs.io/f/26L8Sk7UnuECXjCxYrcZENFc91oCB07LqidpvXmUWH4VeMwx", title: 'Közérdekü', text: 'Card description goes here.', href: '/kozerdeku' },
  { id: 9, image: "https://utfs.io/f/26L8Sk7UnuECctyHHfMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O", title: 'Ügyintézés', text: 'Card description goes here.', href: '/ugyintezes' },
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


          </div>

          <Widgets />
        </div>
      </div>
      <CookieConsent />
    </>
  )
}