import { SearchDialog } from "~/components/shared/search-dialog"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"
import { Widgets } from '~/components/layout/widgets'

import { type Card as CardTypes } from "~/types"

// Force dynamic rendering to ensure we get real database data
export const dynamic = 'force-dynamic';

const cards: CardTypes[] = [
    { id: 1, image: "https://utfs.io/f/26L8Sk7UnuECC7hPjSoD3h5BTWPtNcop4XHGVmvlbLQxAy71", title: 'Háziorvosi Ellátás',  href: '/egeszsegugy/haziorvosi-ellatas' },
    { id: 2, image: "https://utfs.io/f/26L8Sk7UnuECX0uXYYcZENFc91oCB07LqidpvXmUWH4VeMwx", title: 'Fogászati rendelés',  href: '/egeszsegugy/fogaszati-rendeles' },
    { id: 3, image: "https://utfs.io/f/26L8Sk7UnuEC3pZ6QfUGVEstpDrH4YmojWGN9uMyOIeCwJlK", title: 'Védőnői ellátás',  href: '/egeszsegugy/vedonoi-ellatas' },
    { id: 4, image: "https://utfs.io/f/26L8Sk7UnuECGD5hBAlRAoqETBFgX2U4fvkxMsYmrHbh51an", title: 'Vérvétel',  href: '/egeszsegugy/vervetel' },
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