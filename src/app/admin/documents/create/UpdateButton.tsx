'use client';
import { UploadButton } from "~/utils/uploadthing";
import '~/styles/markdown.css';
import { useState } from 'react';

interface UploadedFile {
    url: string;
    fileSize: string;
}

type UpdateButtonProps = {
    updateAction: (title: string, category: string, date: string, fileUrl: string, fileSize: string) => Promise<void>;
};

export default function UpdateButton({ updateAction }: UpdateButtonProps) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

    const handleFileUpload = (res: { url: string; size: number }[]) => {
        if (!res || res.length === 0) {
            setUploadError('Fájl feltöltése sikertelen.');
            return;
        }
        const fileData = res[0];
        const fileUrlInput = document.getElementById('file_url_input') as HTMLInputElement;
        const fileSizeInput = document.getElementById('file_size_input') as HTMLInputElement;
        if (fileData) {
            if (fileData.url) {
                fileUrlInput.value = fileData.url;
                fileSizeInput.value = `${fileData.size}`;
                setSelectedFile(fileData.url);
                setUploadError(null);
            }
        }
    };

    async function handleSubmit(formData: FormData) {
        try {
            const title = formData.get('title') as string;
            const category = formData.get('category') as string;
            const date = formData.get('date') as string;
            const fileUrl = formData.get('fileUrl') as string;
            const fileSize = formData.get('fileSize') as string;

            if (!title || !category || !date || !fileUrl || !fileSize) {
                setSubmissionStatus('Kérjük, töltsön ki minden mezőt.');
                return;
            }

            setSubmissionStatus('Feltöltés folyamatban...');
            await updateAction(title, category, date, fileUrl, fileSize);
            setSubmissionStatus('Sikeresen feltöltve!');
            window.location.href = '/onkormanyzat/dokumentumok';

        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmissionStatus('Hiba történt a feltöltés során.');
        }
    }

    return (
        <form action={handleSubmit} className="grid gap-6 mb-6 md:grid-cols-2">

            <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dokumentum címe</label>
                <input
                    required
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Dokumentum címe"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategória</label>
                <select
                    required
                    name="category"
                    id="category"
                    defaultValue=""
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="" disabled>Válassz kategóriát</option>
                    <option value="Rendeletek">Rendeletek</option>
                    <option value="Határozatok">Határozatok</option>
                    <option value="Jegyzokonyvek">Jegyzőkönyvek</option>
                    <option value="Nyomtatvanyok">Nyomtatványok</option>
                    <option value="Palyazatok">Pályázatok</option>
                    <option value="Egyeb">Egyéb</option>
                </select>
            </div>



            <div>
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dátum</label>
                <input
                    required
                    type="datetime-local"
                    name="date"
                    id="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>

            <div className="md:col-span-2">
                <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fájl feltöltése</label>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 bg-secondary rounded-lg">
                            <UploadButton
                                className="ut-button:bg-blue-500 ut-button:text-white 
                                           ut-button:font-medium ut-button:py-2 ut-button:px-4 
                                           ut-button:rounded-md ut-button:hover:bg-blue-700"
                                endpoint="bakonykutiDocumentPdfUploader"
                                onClientUploadComplete={handleFileUpload}
                                onUploadError={(error) => {
                                    setUploadError(`Feltöltési hiba: ${error.message}`);
                                }}
                            />
                            {uploadError && <p className="text-red-500 text-xs italic">{uploadError}</p>}
                            {selectedFile && <p className="text-green-500 text-xs italic">Fájl feltöltve: {selectedFile}</p>}
                        </div>
                <input id="file_url_input" type="hidden" name="fileUrl" />
                <input id="file_size_input" type="hidden" name="fileSize" />
            </div>

            <div className="md:col-span-2">
                <button
                    type="submit"
                    className="text-white bg-secondary hover:primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Dokumentum feltöltése
                </button>
            </div>

            {submissionStatus && <p className="text-sm text-gray-500">{submissionStatus}</p>}
        </form>
    );
}
