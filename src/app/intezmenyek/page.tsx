import { SearchDialog } from "~/components/shared/search-dialog"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"
import { Widgets } from '~/components/layout/widgets'

import { type Card as CardTypes } from "~/types"


const cards: CardTypes[] = [
    { id: 1, image: "https://utfs.io/f/26L8Sk7UnuECujhDAazmDBpZYSAVG1czbfeQOu9yK3WLdFln", title: 'Iszkaszentgyörgyi Szociális Intézményi Társulás', text: 'Card description goes here.', href: '/intezmenyek/iszkaszentgyorgyi-szocialis-intezmenyi-tarsulas' },
    { id: 2, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Iszkaszentgyörgyi Szociális Alapszolgáltatási Intézmény', text: 'Card description goes here.', href: '/intezmenyek/iszkaszentgyorgyi-szocialis-alapszolgaltatasi-intezmeny' },
    { id: 3, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Iszkaszentgyörgyi Általános Iskola', text: 'Card description goes here.', href: '/intezmenyek/iszkaszentgyorgyi-altalanos-iskola' },
    { id: 4, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Iszkaszentgyörgyi Vackor Óvoda és Konyha', text: 'Card description goes here.', href: '/intezmenyek/iszkaszentgyorgyi-vackor-ovoda-es-konyha' },
    { id: 5, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Közösségi Ház és Könyvtár', text: 'Card description goes here.', href: '/intezmenyek/kozossegi-haz-es-konyvtar' },
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