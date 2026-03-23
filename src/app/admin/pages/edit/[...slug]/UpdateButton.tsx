'use client';
import { useState } from 'react';
import { Label } from '~/components/ui/label';
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Suspense } from 'react';
import { Skeleton } from "~/components/ui/skeleton";
import { useRouter } from 'next/navigation';
import { UploadButton } from "~/components/file-upload";

import "~/styles/markdown.css"
import { MarkdownEditor } from "~/components/markdown-editor/editor";
import { type Page } from "~/server/db/schema";


type UpdateButtonProps = {
  updateAction: (title: string, currentSlug: string, newSlug: string, thumbnail: string, content: string) => Promise<void>;
  page: Page;
  currentSlug: string;
};

function EditorSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
}

export default function UpdateButton({ updateAction, page, currentSlug }: UpdateButtonProps) {
  const router = useRouter();
  const [content, setContent] = useState(page.content ?? '');


  async function handleSubmit(formData: FormData) {
    const content = formData.get('content') as string;
    const title = formData.get('title') as string;
    const newSlug = formData.get('slug') as string;
    const thumbnail = formData.get('thumbnail') as string;
    await updateAction(title, currentSlug, newSlug, thumbnail, content);

    if (newSlug && newSlug !== currentSlug) {
      router.push(`/admin/pages/edit/${newSlug}`);
    }
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

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-lg font-medium">
              URL Path (slug)
            </Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={page.slug}
              className="text-lg"
              placeholder="onkormanyzat/hirdetmenyek"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-lg font-medium">
              Card image URL (thumbnail)
            </Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              defaultValue={page.thumbnail}
              className="text-lg"
              placeholder="/uploads/news/page-image.webp"
            />
            <UploadButton
              endpoint="pages"
              onClientUploadComplete={(files) => {
                const first = files[0];
                if (!first?.url) return;
                const input = document.getElementById('thumbnail') as HTMLInputElement | null;
                if (input) input.value = first.url;
              }}
              onUploadError={(error) => {
                alert(`Upload Error: ${error.message}`);
              }}
            >
              Upload page image
            </UploadButton>
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


