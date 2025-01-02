import { SearchDialog } from "~/components/shared/search-dialog"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"
import { Widgets } from '~/components/layout/widgets'

import { type Card as CardTypes } from "~/types"


const cards: CardTypes[] = [
    { id: 1, image: "https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka", title: 'Magyar Honvégség', text: 'Card description goes here.', href: '/kozerdeku/magyar-honvedseg-boszormenyi-geza-csapatgyakorloter-parancsnoksag' },
    { id: 2, image: "https://utfs.io/f/26L8Sk7UnuECpiiFxR0tYOVN4SgU2xuoem6swRjIQKAFZBLf", title: 'DRV', text: 'Card description goes here.', href: '/kozerdeku/drv' },
    { id: 3, image: "https://utfs.io/f/26L8Sk7UnuECoz5xrnAu3SMxWU2adZA8VJYKbfw6OtzGmPIQ", title: 'E-ON', text: 'Card description goes here.', href: '/kozerdeku/e-on' },
    { id: 4, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Telekom', text: 'Card description goes here.', href: '/kozerdeku/telekom' },
    { id: 5, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Kémény ellenörzés és tisztítás', text: 'Card description goes here.', href: '/kozerdeku/kemeny-ellenorzes-es-tisztitas' },
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