import { Card } from "~/components/ui/card"

import "~/styles/markdown.css"
import { db } from "~/server/db"




import { SearchDialog } from "~/components/shared/search-dialog"
import { CookieConsent } from "~/components/shared/cookie-consent"
import { AccessibilityMenu } from "~/components/shared/accessibility-menu"
import { DocumentArchive } from "~/components/documents/document-archive"

import { Widgets } from '~/components/layout/widgets'




export default async function StaticPage() {
  const pages = await db.query.pages.findMany()
  const news = await db.query.news.findMany()
  const documents = await db.query.documents.findMany()

  return (
    <>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
                            <SearchDialog pages={pages} news={news} />
                            <AccessibilityMenu />
                        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-primary/5 p-8 rounded-lg border border-primary/10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Letölthető Dokumentumok</h1>
                </div>
                
              </div>
              <Card className="p-6 prose prose-green dark:prose-invert max-w-none markdown">
                <DocumentArchive documents={documents} />
              </Card>
            </section>
          </div>
          <Widgets />
        </div>
           
      </div>
      <CookieConsent />
    </>



  )
}