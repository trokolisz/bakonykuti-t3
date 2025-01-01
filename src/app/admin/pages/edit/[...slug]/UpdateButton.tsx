'use client';
import { useState } from 'react';
import { Label } from '~/components/ui/label';
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Suspense } from 'react';
import { Skeleton } from "~/components/ui/skeleton";

import "~/styles/markdown.css"
import { MarkdownEditor } from "~/components/markdown-editor/editor";
import { type Page } from "~/server/db/schema";


type UpdateButtonProps = {
  updateAction: (title: string, slug: string, content: string) => Promise<void>;
  page: Page;
  slug: string;
};

function EditorSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
}

export default function UpdateButton({ updateAction, page, slug }: UpdateButtonProps) {
  const [content, setContent] = useState(page.content ?? '');


  async function handleSubmit(formData: FormData) {
    const content = formData.get('content') as string;
    const title = formData.get('title') as string;
    console.log("handleSubmit with title: ", title);
    await updateAction(title, slug, content);
  }

  return (
    <Card className="max-w-[1500px] mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-bold">Edit Page</h1>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg font-medium">
              Page Title
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={page.title}
              className="text-lg"
              placeholder="Enter page title..."
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="content" className="text-lg font-medium">
              Content
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <Suspense fallback={<EditorSkeleton />}>
                <MarkdownEditor
                  name="content"
                  value={content}
                  onChange={setContent}
                />
              </Suspense>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-8 rounded-md transition-colors duration-200 shadow-sm"
            >
              Update Page
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


