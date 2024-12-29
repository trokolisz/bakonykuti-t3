'use client';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '~/styles/markdown.css';
import { useState } from 'react';

type UpdateButtonProps = {
    updateAction: (title: string, url: string, description: string) => Promise<void>;
};

export default function UpdateButton({ updateAction }: UpdateButtonProps) {
    async function handleSubmit(formData: FormData) {
        const title = formData.get('title') as string;
        const url = formData.get('url') as string;
        const description = formData.get('content') as string;
        setContent('');
        await updateAction(title, url, description);
    }
    const [content, setContent] = useState('');

    return (
        <form action={handleSubmit} className="flex flex-col gap-6 max-w-6xl mx-auto p-8 bg-secondary rounded-lg shadow-lg">
            <input
                type="text"
                name="title"
                placeholder="Add meg a hír címét"
                className="border placeholder:text-gray-300 bg-secondary text-foreground border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <input
                type="url"
                name="url"
                placeholder="Add meg a boritó kép URL-jét"
                className="border placeholder:text-gray-300 bg-secondary text-foreground border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <div className="space-y-2">
                    <Label htmlFor="content">Hír tartalom (Markdown)</Label>
                    <Textarea
                        id="content"
                        name="content"
                        defaultValue={''}
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
                Hír feltöltése
            </button>
        </form>
    );
}
