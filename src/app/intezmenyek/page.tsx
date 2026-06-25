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
    'intezmenyek/iszkaszentgyorgyi-szocialis-intezmenyi-tarsulas': 'https://utfs.io/f/26L8Sk7UnuEC1G7e7b489QX6bm0v4B8adyiMJAnfwWCDKkVO',
    'intezmenyek/iszkaszentgyorgyi-szocialis-alapszolgaltatasi-intezmeny': 'https://utfs.io/f/26L8Sk7UnuECwgAWYHheWP5jZyfGnp24M8Jrbm0t9vNAFkaB',
    'intezmenyek/iszkaszentgyorgyi-altalanos-iskola': 'https://utfs.io/f/26L8Sk7UnuEC5hGvIGKkVqBcO9XlC0318ZTQN4s6Axy7fgoJ',
    'intezmenyek/iszkaszentgyorgyi-vackor-ovoda-es-konyha': 'https://utfs.io/f/26L8Sk7UnuECBsKCA3LtiGAb1WuzdjMZ6rO9S2U8Ll3D75pI',
    'intezmenyek/kozossegi-haz-es-konyvtar': 'https://utfs.io/f/26L8Sk7UnuECRucf2egOMzl8R0LVyP71WfxAQKYCqZmBGUud',
}



export default async function Home() {
    const pages = await db.query.pages.findMany()
    const sectionPages = pages as SectionPage[]
    const news = await db.query.news.findMany()

    const cards = buildSectionCards({
        pages: sectionPages,
        sectionSlug: 'intezmenyek',
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