'use client';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
type UpdateButtonProps = {
  updateAction: (slug: string, content: string) => Promise<void>;
  initialContent: string;
  slug: string;
};
import "~/styles/markdown.css"
export default function UpdateButton({ updateAction, initialContent, slug }: UpdateButtonProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <form action={async () => await updateAction(slug, content)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="prose prose-green dark:prose-invert min-h-[500px] max-w-none rounded-md border p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button type="submit">Update Content</Button>
      </div>
    </form>
  );
}
