import { SearchDialog } from "~/components/shared/search-dialog"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"
import { Widgets } from '~/components/layout/widgets'

import { type Card as CardTypes } from "~/types"


const cards: CardTypes[] = [
    { id: 1, image: "https://utfs.io/f/26L8Sk7UnuEC1G7e7b489QX6bm0v4B8adyiMJAnfwWCDKkVO", title: 'Iszkaszentgyörgyi Szociális Intézményi Társulás',  href: '/intezmenyek/iszkaszentgyorgyi-szocialis-intezmenyi-tarsulas' },
    { id: 2, image: "https://utfs.io/f/26L8Sk7UnuECwgAWYHheWP5jZyfGnp24M8Jrbm0t9vNAFkaB", title: 'Iszkaszentgyörgyi Szociális Alapszolgáltatási Intézmény',  href: '/intezmenyek/iszkaszentgyorgyi-szocialis-alapszolgaltatasi-intezmeny' },
    { id: 3, image: "https://utfs.io/f/26L8Sk7UnuEC5hGvIGKkVqBcO9XlC0318ZTQN4s6Axy7fgoJ", title: 'Iszkaszentgyörgyi Általános Iskola',  href: '/intezmenyek/iszkaszentgyorgyi-altalanos-iskola' },
    { id: 4, image: "https://utfs.io/f/26L8Sk7UnuECBsKCA3LtiGAb1WuzdjMZ6rO9S2U8Ll3D75pI", title: 'Iszkaszentgyörgyi Vackor Óvoda és Konyha',  href: '/intezmenyek/iszkaszentgyorgyi-vackor-ovoda-es-konyha' },
    { id: 5, image: "https://utfs.io/f/26L8Sk7UnuECRucf2egOMzl8R0LVyP71WfxAQKYCqZmBGUud", title: 'Közösségi Ház és Könyvtár',  href: '/intezmenyek/kozossegi-haz-es-konyvtar' },
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

                        

                    </div>

                    <Widgets />
                </div>
            </div>
            <CookieConsent />
        </>
    );
}