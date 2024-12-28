'use client';

type UpdateButtonProps = {
    updateAction: (title: string, url: string, description: string) => Promise<void>;
};

export default function UpdateButton({ updateAction }: UpdateButtonProps) {
    async function handleSubmit(formData: FormData) {
        const title = formData.get('title') as string;
        const url = formData.get('url') as string;
        const description = formData.get('description') as string;
        await updateAction(title, url, description);
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-6 max-w-2xl mx-auto p-8 bg-secondary rounded-lg shadow-lg">
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
            <textarea
                name="description"
                placeholder="Add meg a hír tartalmát..."
                rows={5}
                className="border placeholder:text-gray-300 bg-secondary text-foreground border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
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
