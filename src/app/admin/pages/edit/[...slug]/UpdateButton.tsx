'use client';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import "~/styles/markdown.css"

import { type Page } from "~/server/db/schema";


type UpdateButtonProps = {
  updateAction: (title: string, slug: string, content: string) => Promise<void>;
  page: Page;
};



export default function UpdateButton({ updateAction, page }: UpdateButtonProps) {
  const [content, setContent] = useState(page.content ?? '');

  async function handleSubmit(formData: FormData) {
    const content = formData.get('content') as string;
    const title = formData.get('title') as string;
    console.log("handleSubmit with title: ", title);
    await updateAction(title, "slug", content);
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4 bg-background dark:bg-background-secondary-dark p-6 rounded-lg">
      <div className="space-y-2">
          <h1>Title</h1>
          <input
            id="title"
            name="title"
            defaultValue={page.title}
            className="input bg-secondary dark:bg-background-secondary-dark rounded text-xl"
          />
        </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] font-mono bg-card dark:bg-card-secondary-dark rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="p-6 prose prose-green dark:prose-invert max-w-none markdown bg-card min-h-[500px] rounded-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
      <button 
                type="submit" 
                className="bg-primary text-foreground font-semibold py-3 px-6 rounded-md hover:bg-muted active:bg-muted transition-colors duration-200 shadow-sm"
            >
                Oldal Tartalmának Frissitése
            </button>
    </form>
  );
}
