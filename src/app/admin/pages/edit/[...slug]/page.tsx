import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { pages } from "~/server/db/schema";
import { notFound } from "next/navigation";
import { updateLastModified } from './actions';
import UpdateButton from './UpdateButton';
import { Toaster } from '~/components/ui/toaster';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const page = await db.query.pages.findFirst({
    where: eq(pages.slug, slugPath),
  });

    if (!page) {
      notFound();
    }

  return (
    <div className="container py-8">
      <Toaster />
       <UpdateButton updateAction={updateLastModified} page={page} slug={slugPath}/>
    </div>
  );
}


