import { SearchDialog } from "~/components/shared/search-dialog"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"
import { Widgets } from '~/components/layout/widgets'
import { buildSectionCards, type SectionPage } from "~/lib/section-cards"


const fallbackCardImages: Record<string, string> = {
    'kozerdeku/magyar-honvedseg-boszormenyi-geza-csapatgyakorloter-parancsnoksag': 'https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka',
    'kozerdeku/viz-es-szennyviz': 'https://utfs.io/f/26L8Sk7UnuECpiiFxR0tYOVN4SgU2xuoem6swRjIQKAFZBLf',
    'kozerdeku/kozvilagitas-aram': 'https://utfs.io/f/26L8Sk7UnuECoz5xrnAu3SMxWU2adZA8VJYKbfw6OtzGmPIQ',
    'kozerdeku/telekom': 'https://utfs.io/f/26L8Sk7UnuECLM7LgGKbp6Sh14YX5LERKwtFsGya3UVgiH8Q',
    'kozerdeku/kemeny-ellenorzes-es-tisztitas': 'https://utfs.io/f/26L8Sk7UnuECIabjJ3zF3U6xf5SojbkZpQ2y7DV0lPOWMeCB',
    'kozerdeku/korzeti-megbizott': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECPhBcN1fJNKIGrYFwbxade7LC2c1QkEVH3MnB',
}



export default async function Home() {
    const pages = await db.query.pages.findMany() as SectionPage[]
    const news = await db.query.news.findMany()

    const cards = buildSectionCards({
        pages,
        sectionSlug: 'kozerdeku',
        fallbackCardImages,
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