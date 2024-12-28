'use client';
import { useState } from 'react';

type UpdateButtonProps = {
  updateAction: (slug: string, content: string) => Promise<void>;
};

export default function UpdateButton({ updateAction }: UpdateButtonProps) {
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

  return (
    <form action={async () => await updateAction(slug, content)} className="flex flex-col gap-4 max-w-2xl">
      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Enter slug (e.g., bakonykuti/latnivalok)"
        className="border p-2 rounded text-black"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter content..."
        rows={10}
        className="border p-2 rounded text-black"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Update Content
      </button>
    </form>
  );
}
