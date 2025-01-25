'use client';
import { useState } from 'react';
import { Label } from '~/components/ui/label';
import Image from 'next/image';
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

import "~/styles/markdown.css"
import { MarkdownEditor } from "~/components/markdown-editor/editor";
import { type Event } from "~/server/db/schema";


type UpdateButtonProps = {
  updateAction: (
    id: number,
    title: string,
    thumbnail: string,
    content: string,
    type: string
  ) => Promise<void>;
  event: Event
};



export default function UpdateButton({ updateAction, event }: UpdateButtonProps) {
  const [content, setContent] = useState(event.content ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState(event.thumbnail);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      const content = formData.get('content') as string;
      const title = formData.get('title') as string;
      const thumbnail = formData.get('thumbnail') as string;
      const type = formData.get('type') as string;
      
      await updateAction(event.id, title, thumbnail, content, type);
    } catch (error) {
      console.error('Failed to update event:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-[1200px] mx-auto">
      <CardHeader className="border-b">
        <h1 className="text-3xl font-bold">Rendezvény szerkesztése</h1>
      </CardHeader>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="flex flex-col gap-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-lg font-semibold">
                Rendezvény címe
              </Label>
              <Input
                required
                id="title"
                name="title"
                defaultValue={event.title}
                className="text-lg"
                placeholder="Add meg az Rendezvény címét..."
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="type" className="text-lg font-semibold">Rendezvény típusa</Label>
              <Select name="type" defaultValue={event.type}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Válassz típust" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community">Közösségi</SelectItem>
                  <SelectItem value="cultural">Kulturális</SelectItem>
                  <SelectItem value="sports">Sport</SelectItem>
                  <SelectItem value="education">Oktatási</SelectItem>
                  <SelectItem value="gun_range">Lőtér</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="thumbnail" className="text-lg font-semibold">
              Borítókép URL
            </Label>
            <div className="flex gap-2">
              <Input
                required
                type='url'
                id="thumbnail"
                name="thumbnail"
                defaultValue={event.thumbnail}
                placeholder="Add meg a kép URL címét..."
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Előnézet elrejtése' : 'Előnézet mutatása'}
              </Button>
            </div>
            {showPreview && thumbnailUrl && (
              <div className="mt-3 rounded-lg overflow-hidden border h-[500px] relative">
                <Image
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-contain"
                  onError={() => setShowPreview(false)}
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="content" className="text-lg font-semibold">
              Rendezvény tartalma
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <MarkdownEditor
                name="content"
                value={content}
                onChange={setContent}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Mégse
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? 'Mentés...' : 'Mentés'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


