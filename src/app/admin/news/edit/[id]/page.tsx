import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { news } from "~/server/db/schema"
import { notFound } from "next/navigation";
import { updateLastModified } from './actions';
import UpdateButton from './UpdateButton';
import { Toaster } from '~/components/ui/toaster';


interface Props {
  params: Promise<{ id: string[] }>
}

export default async function StaticPage({ params }: Props) {
   const {id} = await params
    const newsItem = await db.query.news.findFirst({
      where: eq(news.id, Number(id))
    })
    if (!id[0]) {
      notFound();
    }
    const idNum = parseInt(id[0]);
    if (!newsItem) {
      notFound();
    }

  return (
    <div className="container py-8">
      <Toaster />
       <UpdateButton updateAction={updateLastModified} news={newsItem} id={idNum}/>
    </div>
  );
}


