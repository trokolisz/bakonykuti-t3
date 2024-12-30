'use client';
import { useState } from 'react';
import { Label } from '~/components/ui/label';

import "~/styles/markdown.css"
import { MarkdownEditor } from "~/components/markdown-editor/editor";
import { type Page } from "~/server/db/schema";


type UpdateButtonProps = {
  updateAction: (title: string, slug: string, content: string) => Promise<void>;
  page: Page;
  slug: string;
};



export default function UpdateButton({ updateAction, page, slug }: UpdateButtonProps) {
  const [content, setContent] = useState(page.content ?? '');


  async function handleSubmit(formData: FormData) {
    const content = formData.get('content') as string;
    const title = formData.get('title') as string;
    console.log("handleSubmit with title: ", title);
    await updateAction(title, slug, content);
  }

  return (
    <form action={handleSubmit}  className="flex flex-col gap-4 bg-background dark:bg-background-secondary-dark p-6 rounded-lg">
      <div className="space-y-2">
        <h1>Title</h1>
        <input
          id="title"
          name="title"
          defaultValue={page.title}
          className="input bg-secondary dark:bg-background-secondary-dark rounded text-xl"
        />
      </div>
      <div className="space-y-4">
          <Label htmlFor="content">Content (Markdown)</Label>
          <MarkdownEditor
            name="content"
            value={content}
            onChange={setContent}
          />
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


