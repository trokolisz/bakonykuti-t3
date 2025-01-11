'use client';
import { useState } from 'react';
import { Label } from '~/components/ui/label';
import Image from 'next/image';
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardContent } from "~/components/ui/card";

import "~/styles/markdown.css"
import { MarkdownEditor } from "~/components/markdown-editor/editor";
import { type News } from "~/server/db/schema";


type UpdateButtonProps = {
  updateAction: (id: number,
    title: string,
    thumbnail: string,
    content: string,) => Promise<void>;
  news: News;
};



export default function UpdateButton({ updateAction, news }: UpdateButtonProps) {
  const [content, setContent] = useState(news.content ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState(news.thumbnail);

  async function handleSubmit(formData: FormData) {
    const content = formData.get('content') as string;
    const title = formData.get('title') as string;
    const thumbnail = formData.get('thumbnail') as string;

    formData.set('content', '');
    formData.set('title', '');
    formData.set('thumbnail', '');
    setContent('');
    setThumbnailUrl('');
   
    console.log("handleSubmit with title: ", title);
    await updateAction(news.id, title, thumbnail , content);
    
    // Reset form values
    
  }

  return (
    <Card className="max-w-[1500px] mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-bold">Edit News Article</h1>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-medium">
                Article Title
              </Label>
              <Input
              required
                id="title"
                name="title"
                defaultValue={news.title}
                className="text-lg"
                placeholder="Enter article title..."
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="thumbnail" className="text-lg font-medium">
                Thumbnail URL
                </Label>
                <Input
                required
                type='url'
                id="thumbnail"
                name="thumbnail"
                defaultValue={news.thumbnail}
                placeholder="Enter image URL..."
                onChange={(e) => setThumbnailUrl(e.target.value)}
                />
                {thumbnailUrl && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <Image
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  width={450}
                  height={300}
                  className="w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="content" className="text-lg font-medium">
              Article Content
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <MarkdownEditor
                name="content"
                value={content}
                onChange={setContent}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-8 rounded-md transition-colors duration-200 shadow-sm"
            >
              Update Article
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


