import { SearchDialog } from "~/components/shared/search-dialog"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"

import { db } from "~/server/db"
import CardGrid from "~/components/cardGrid"
import { Widgets } from '~/components/layout/widgets'
import { buildSectionCards, type SectionPage } from "~/lib/section-cards"

// Force dynamic rendering to ensure we get real database data
export const dynamic = 'force-dynamic';

const fallbackCardImages: Record<string, string> = {
    'egeszsegugy/haziorvosi-ellatas': 'https://utfs.io/f/26L8Sk7UnuECC7hPjSoD3h5BTWPtNcop4XHGVmvlbLQxAy71',
    'egeszsegugy/fogaszati-rendeles': 'https://utfs.io/f/26L8Sk7UnuECX0uXYYcZENFc91oCB07LqidpvXmUWH4VeMwx',
    'egeszsegugy/vedonoi-ellatas': 'https://utfs.io/f/26L8Sk7UnuEC3pZ6QfUGVEstpDrH4YmojWGN9uMyOIeCwJlK',
    'egeszsegugy/vervetel': 'https://utfs.io/f/26L8Sk7UnuECGD5hBAlRAoqETBFgX2U4fvkxMsYmrHbh51an',
}



export default async function Home() {
    const pages = await db.query.pages.findMany() as SectionPage[]
    const news = await db.query.news.findMany()

    const cards = buildSectionCards({
        pages,
        sectionSlug: 'egeszsegugy',
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