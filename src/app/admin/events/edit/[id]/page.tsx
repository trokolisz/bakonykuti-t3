import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { events} from "~/server/db/schema";
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
  
  const my_event = await db.query.events.findFirst({
      where: eq(events.id, num_id),
    });

    if (!my_event) {
      notFound();
    }

  return (
    <div className="container py-8">
      <Toaster />
       <UpdateButton updateAction={updateLastModified} event={my_event}/>
    </div>
  );
}


