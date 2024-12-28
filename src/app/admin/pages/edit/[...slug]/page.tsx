import { Card } from "~/components/ui/card";
import "~/styles/markdown.css";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { pages } from "~/server/db/schema";

import { CardContent } from "~/components/ui/card";
import { CardHeader } from "~/components/ui/card";
import { CardTitle } from "~/components/ui/card";
import { notFound } from "next/navigation";
import { updateLastModified } from './actions';
import UpdateButton from './UpdateButton';
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Input } from "~/components/ui/input";
import "~/styles/markdown.css";

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
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>{page.title}</CardTitle>
          <Input type="text" value={page.title} className="text-xl" />
        </CardHeader>
        <CardContent>
         
        </CardContent>
      </Card>
    </div>
  );
}


