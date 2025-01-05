import { SearchDialog } from "~/components/shared/search-dialog"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"
import { Widgets } from '~/components/layout/widgets'

import { type Card as CardTypes } from "~/types"


const cards: CardTypes[] = [
    { id: 1, image: "https://utfs.io/f/26L8Sk7UnuECkX3kokmwPCJb48Ar2U9okYnfdSWvR5pDwstV", title: 'Képviselő-testület',  href: '/onkormanyzat/kepviselo-testulet' },
    { id: 2, image: "https://utfs.io/f/26L8Sk7UnuECWhcnJojMe78C4Hl1gVLjSdwtzqbmKROP0uki", title: 'Testületi ülések',  href: '/onkormanyzat/testuleti-ulesek' },
    { id: 3, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Önkormányzati rendeletek',  href: '/onkormanyzat/onkormanyzati-rendeletek' },
    { id: 4, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Dokumentumok',  href: '/onkormanyzat/dokumentumok' },
    { id: 5, image: "https://utfs.io/f/26L8Sk7UnuECbdzcV2WbPq5eHr31oBZJLQdxS6Gvi8k2mFjA", title: 'Iszkaszentgyörgyi Közös Önkormányzati Hivatal',  href: '/onkormanyzat/iszkaszentgyorgyi-kozos-onkormanyzati-hivatal' },
    { id: 6, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Elérhetőségek',  href: '/onkormanyzat/elerhetosegek' },
    { id: 7, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Közérdekű adatok',  href: '/onkormanyzat/kozerdeku-adatok' },
    { id: 8, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Hirdetmények',  href: '/onkormanyzat/hirdetmenyek' },
    { id: 9, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Szabályzatok',  href: '/onkormanyzat/szabalyzatok' },
    { id: 10, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Helyi Esélyegyenlőségi Program',  href: '/onkormanyzat/helyi-eselyegyenlosegi-program' },
    { id: 11, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Településrendezési eszközök és arculati kézikönyv',  href: '/onkormanyzat/telepulesrendezesi-eszkozok-es-arculati-kezikonyv' },
    { id: 12, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Pályázatok',  href: '/onkormanyzat/palyazatok' },
    { id: 13, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Választás',  href: '/onkormanyzat/valasztas' },

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