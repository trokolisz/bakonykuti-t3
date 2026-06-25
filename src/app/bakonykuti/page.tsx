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
    'bakonykuti/bemutatas': 'https://utfs.io/f/26L8Sk7UnuECfHTSdRu3aru6LDUb0V8oGMOFt5cR72B1Qkqh',
    'bakonykuti/tortenet': 'https://utfs.io/f/26L8Sk7UnuECbBp2vGWbPq5eHr31oBZJLQdxS6Gvi8k2mFjA',
    'bakonykuti/kornyekunk': 'https://utfs.io/f/26L8Sk7UnuECEYY81GxeDfCRWZAPiqY1BUG5V8Mz3t920HXw',
    'bakonykuti/latnivalok': 'https://utfs.io/f/26L8Sk7UnuECWA2n7jMe78C4Hl1gVLjSdwtzqbmKROP0uki5',
}



export default async function Home() {
    const pages = await db.query.pages.findMany()
    const bakonykutiPages = pages as SectionPage[]
    const news = await db.query.news.findMany()

    const cards = buildSectionCards({
        pages: bakonykutiPages,
        sectionSlug: 'bakonykuti',
        fallbackCardImages,
        sortBy: 'title',
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