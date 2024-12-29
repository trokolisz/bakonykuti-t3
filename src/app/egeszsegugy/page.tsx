import { SearchDialog } from "~/components/shared/search-dialog"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"
import { Widgets } from '~/components/layout/widgets'

import { type Card as CardTypes } from "~/types"


const cards: CardTypes[] = [
    { id: 1, image: "https://utfs.io/f/26L8Sk7UnuECujhDAazmDBpZYSAVG1czbfeQOu9yK3WLdFln", title: 'Háziorvosi Ellátás', text: 'Card description goes here.', href: '/egeszsegugy/haziorvosi-ellatas' },
    { id: 2, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Fogászati rendelés', text: 'Card description goes here.', href: '/egeszsegugy/fogaszati-rendeles' },
    { id: 3, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Védőnői ellátás', text: 'Card description goes here.', href: '/egeszsegugy/vedonoi-ellatas' },
    { id: 4, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Vérvétel', text: 'Card description goes here.', href: '/egeszsegugy/vervetel' },
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