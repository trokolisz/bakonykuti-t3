import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { news} from "~/server/db/schema";
import { notFound } from "next/navigation";
import { updateLastModified } from './actions';
import UpdateButton from './UpdateButton';
import { Toaster } from '~/components/ui/toaster';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StaticPage({ params }: Props) {
  const id = await params;
  const num_id = parseInt(id.id);
  
  const my_new = await db.query.news.findFirst({
      where: eq(news.id, num_id),
    });

    if (!my_new) {
      notFound();
    }

  return (
    <div className="container py-8">
      <Toaster />
       <UpdateButton updateAction={updateLastModified} news={my_new}/>
    </div>
  );
}


