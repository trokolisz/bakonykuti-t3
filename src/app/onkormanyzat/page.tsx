import { SearchDialog } from "~/components/shared/search-dialog"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"
import { Widgets } from '~/components/layout/widgets'

import { type Card as CardTypes } from "~/types"


const cards: CardTypes[] = [
    { id: 1, image: "https://utfs.io/f/26L8Sk7UnuECkX3kokmwPCJb48Ar2U9okYnfdSWvR5pDwstV", title: 'Képviselő-testület', text: 'Card description goes here.', href: '/onkormanyzat/kepviselo-testulet' },
    { id: 2, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Testületi ülések', text: 'Card description goes here.', href: '/onkormanyzat/testuleti-ulesek' },
    { id: 3, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Önkormányzati rendeletek', text: 'Card description goes here.', href: '/onkormanyzat/onkormanyzati-rendeletek' },
    { id: 4, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Dokumentumok', text: 'Card description goes here.', href: '/onkormanyzat/dokumentumok' },
    { id: 5, image: "https://utfs.io/f/26L8Sk7UnuECWhcnJojMe78C4Hl1gVLjSdwtzqbmKROP0uki", title: 'Iszkaszentgyörgyi Közös Önkormányzati Hivatal', text: 'Card description goes here.', href: '/onkormanyzat/iszkaszentgyorgyi-kozos-onkormanyzati-hivatal' },
    { id: 6, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Elérhetőségek', text: 'Card description goes here.', href: '/onkormanyzat/elerhetosegek' },
    { id: 7, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Közérdekű adatok', text: 'Card description goes here.', href: '/onkormanyzat/kozerdeku-adatok' },
    { id: 8, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Hirdetmények', text: 'Card description goes here.', href: '/onkormanyzat/hirdetmenyek' },
    { id: 9, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Szabályzatok', text: 'Card description goes here.', href: '/onkormanyzat/szabalyzatok' },
    { id: 10, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Helyi Esélyegyenlőségi Program', text: 'Card description goes here.', href: '/onkormanyzat/helyi-eselyegyenlosegi-program' },
    { id: 11, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Településrendezési eszközök és arculati kézikönyv', text: 'Card description goes here.', href: '/onkormanyzat/telepulesrendezesi-eszkozok-es-arculati-kezikonyv' },
    { id: 12, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Pályázatok', text: 'Card description goes here.', href: '/onkormanyzat/palyazatok' },
    { id: 13, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Választás', text: 'Card description goes here.', href: '/onkormanyzat/valasztas' },

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