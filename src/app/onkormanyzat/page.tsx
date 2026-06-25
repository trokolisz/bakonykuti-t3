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
    'onkormanyzat/kepviselo-testulet': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECcmPKs4MGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O',
    'onkormanyzat/testuleti-ulesek': 'https://utfs.io/f/26L8Sk7UnuECWhcnJojMe78C4Hl1gVLjSdwtzqbmKROP0uki',
    'onkormanyzat/onkormanyzati-rendeletek': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECj80orgEdVTPH1f4QNIYeZOKG0nqzEAJr6FLg',
    'onkormanyzat/dokumentumok': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECi5DhEKCUKNa8DGOI0cYgHqmAjwClyd9ML7sr',
    'onkormanyzat/iszkaszentgyorgyi-kozos-onkormanyzati-hivatal': 'https://utfs.io/f/26L8Sk7UnuECbdzcV2WbPq5eHr31oBZJLQdxS6Gvi8k2mFjA',
    'onkormanyzat/elerhetosegek': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuEChMcz2tSX2NFjoegCyrV3qp4LH1DuZtd5nIKs',
    'onkormanyzat/kozerdeku-adatok': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECVcTW0CqT1HuRmKsf6XNoZydnDGAWgaLqVOvr',
    'onkormanyzat/hirdetmenyek': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECC0HFvsoD3h5BTWPtNcop4XHGVmvlbLQxAy71',
    'onkormanyzat/szabalyzatok': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECWUIzFMjMe78C4Hl1gVLjSdwtzqbmKROP0uki',
    'onkormanyzat/helyi-eselyegyenlosegi-program': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECLCkgBe7Kbp6Sh14YX5LERKwtFsGya3UVgiH8',
    'onkormanyzat/telepulesrendezesi-eszkozok-es-arculati-kezikonyv': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECopTlV3Au3SMxWU2adZA8VJYKbfw6OtzGmPIQ',
    'onkormanyzat/palyazatok': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECbkvvpgWbPq5eHr31oBZJLQdxS6Gvi8k2mFjA',
    'onkormanyzat/valasztas': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuEC7fDonaYfT4oHPt2OMnIkBr9dgYUcXqmjSeFC',
    'onkormanyzat/ugyfelfogadas': 'https://utfs.io/f/26L8Sk7UnuECujhDAazmDBpZYSAVG1czbfeQOu9yK3WLdFln',
    'onkormanyzat/bejelentes-koteles-tevekenysegek': 'https://utfs.io/f/26L8Sk7UnuEC0I8Vk8EYgMm2V6QTdDeskPUBxKEy4LHFr9pO',
    'onkormanyzat/akadalymentesitesi-nyilatkozat': 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECW1nPh4jMe78C4Hl1gVLjSdwtzqbmKROP0uki',
}



export default async function Home() {
    const pages = await db.query.pages.findMany() as SectionPage[]
    const news = await db.query.news.findMany()

    const cards = buildSectionCards({
        pages,
        sectionSlug: 'onkormanyzat',
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