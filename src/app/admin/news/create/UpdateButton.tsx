'use client';
import { MarkdownEditor } from "~/components/markdown-editor/editor";
import '~/styles/markdown.css';
import { useState } from 'react';
import { UploadButton } from "~/components/file-upload";

interface UploadedFile {
    url: string;
}

interface GalleryImage {
    url: string;
    title: string;
    isCarousel: boolean;
}

type UpdateButtonProps = {
    updateAction: (title: string, url: string, description: string) => Promise<void>;
};

export default function UpdateButton({ updateAction }: UpdateButtonProps) {


    const handleImageUpload = (res: UploadedFile[]) => {
        const newImages: GalleryImage[] = res.map((file) => ({
            url: file.url,
            title: '',
            isCarousel: false
        }));
        const url_input = document.getElementById('url_input') as HTMLInputElement;
        const uploaded_image = document.getElementById('uploaded_image') as HTMLImageElement;

        if (res == null || res.length === 0) {
            return;
        }
        if (res[0]?.url) {
            url_input.value = res[0].url;
            uploaded_image.src = res[0].url;
        }


    };

    async function handleSubmit(formData: FormData) {
        const title = formData.get('title') as string;
        const url = formData.get('url') as string;
        const description = formData.get('content') as string;
        formData.set('content', '');
        formData.set('title', '');
        formData.set('thumbnail', '');
        const go_url = new URL('/hirek', window.location.origin);


        await updateAction(title, url, description);
        window.location.href = go_url.toString();
    }
    const [content, setContent] = useState('');

    return (
        <form action={handleSubmit} className="flex flex-col gap-6 max-w-6xl mx-auto p-8 bg-secondary rounded-lg shadow-lg">
            <input
                required
                type="text"
                name="title"
                placeholder="Add meg a hír címét"
                className="border placeholder:text-gray-300 bg-secondary text-foreground border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <input
                id="url_input"
                type="url"
                name="url"
                required
                placeholder="Add meg a boritó kép URL-jét"
                className="border placeholder:text-gray-300 bg-secondary text-foreground border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <div className="p-6 bg-card rounded-lg shadow-md border border-border">
                <UploadButton
                    className="bg-primary text-primary-foreground
                                                 font-medium py-3 px-8
                                                 rounded-full hover:opacity-90
                                                 active:scale-95 transition-all
                                                 duration-200 shadow-lg"
                    endpoint="news"
                    onClientUploadComplete={handleImageUpload}
                    onUploadError={(error) => {
                        alert(`Upload Error: ${error.message}`);
                    }}
                />
                {(document.getElementById('url_input') as HTMLInputElement)?.value && (
                    <div className="mt-4">
                        <img 
                            id="uploaded_image"
                            src={(document.getElementById('url_input') as HTMLInputElement)?.value} 
                            alt="Uploaded preview" 
                            className="max-w-full h-auto rounded-lg"
                        />
                    </div>
                )}
            </div>
            <MarkdownEditor

                name="content"
                value={content}
                onChange={setContent}
            />
            <button
                type="submit"
                className="bg-primary text-foreground font-semibold py-3 px-6 rounded-md hover:bg-muted active:bg-muted transition-colors duration-200 shadow-sm"
            >
                Hír feltöltése
            </button>
        </form>
    );
}
