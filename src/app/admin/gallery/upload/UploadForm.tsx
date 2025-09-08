'use client';
import React, { useState } from 'react';
import { UploadButton } from "~/components/file-upload";
import ImageCard from './ImageCard';

interface UploadedFile {
    url: string;
}

interface GalleryImage {
    id?: number;
    url: string;
    title: string;
    isCarousel: boolean;
    hasChanges?: boolean;
}

export default function UploadForm() {
    const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);
    const [saving, setSaving] = useState(false);

    const handleImageUpload = async (res: UploadedFile[]) => {
        // The UploadButton component handles the actual upload to /api/upload/gallery
        // We just need to add the uploaded images to our local state for editing
        const newImages: GalleryImage[] = res.map((file) => ({
            url: file.url,
            title: '',
            isCarousel: false,
            hasChanges: false // Initially no changes since they're just uploaded with defaults
        }));
        setUploadedImages([...uploadedImages, ...newImages]);
    };

    const handleTitleChange = (index: number, newTitle: string): void => {
        const updatedImages = [...uploadedImages];
        const imageToUpdate = updatedImages[index];
        if (imageToUpdate) {
            imageToUpdate.title = newTitle;
            imageToUpdate.hasChanges = true;
            setUploadedImages(updatedImages);
        }
    };

    const handleCarouselToggle = (index: number) => {
        const updatedImages = [...uploadedImages];
        const imageToUpdate = updatedImages[index];
        if (imageToUpdate) {
            imageToUpdate.isCarousel = !imageToUpdate.isCarousel;
            imageToUpdate.hasChanges = true;
            setUploadedImages(updatedImages);
        }
    };

    const handleDeleteImage = (index: number) => {
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImages);
    };

    const saveImageSettings = async (index: number) => {
        const image = uploadedImages[index];
        if (!image || !image.hasChanges) return;

        setSaving(true);
        try {
            // If image has an ID, update it; otherwise, we need to find it by URL
            let imageId = image.id;

            if (!imageId) {
                // Find the image in the database by URL
                const response = await fetch('/api/admin/images');
                if (response.ok) {
                    const data = await response.json();
                    const dbImage = data.images?.find((img: any) => img.url === image.url);
                    imageId = dbImage?.id;
                }
            }

            if (imageId) {
                // Update the image settings
                const updateResponse = await fetch(`/api/admin/images/${imageId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: image.title,
                        isCarousel: image.isCarousel,
                    }),
                });

                if (updateResponse.ok) {
                    // Mark as saved
                    const updatedImages = [...uploadedImages];
                    updatedImages[index] = { ...image, hasChanges: false, id: imageId };
                    setUploadedImages(updatedImages);
                    alert('Settings saved successfully!');
                } else {
                    throw new Error('Failed to save settings');
                }
            } else {
                throw new Error('Could not find image in database');
            }
        } catch (error) {
            console.error('Error saving image settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const saveAllChanges = async () => {
        const imagesToSave = uploadedImages
            .map((img, index) => ({ img, index }))
            .filter(({ img }) => img.hasChanges);

        if (imagesToSave.length === 0) {
            alert('No changes to save.');
            return;
        }

        setSaving(true);
        try {
            for (const { index } of imagesToSave) {
                await saveImageSettings(index);
            }
            alert(`Successfully saved ${imagesToSave.length} image(s)!`);
        } catch (error) {
            console.error('Error saving all changes:', error);
            alert('Some changes failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="mb-8 flex flex-col items-center space-y-4">
                <h2 className="text-2xl font-semibold text-primary mb-2">Upload Images</h2>
                <div className="p-6 bg-card rounded-lg shadow-md border border-border">
                    <UploadButton
                        className="bg-primary text-primary-foreground
                                 font-medium py-3 px-8
                                 rounded-full hover:opacity-90
                                 active:scale-95 transition-all
                                 duration-200 shadow-lg"
                        endpoint="gallery"
                        onClientUploadComplete={handleImageUpload}
                        onUploadError={(error) => {
                            alert(`Upload Error: ${error.message}`);
                        }}
                    />
                </div>
            </div>

            {uploadedImages.length > 0 && (
                <div className="mb-6 flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div>
                        <p className="text-sm text-blue-800">
                            {uploadedImages.filter(img => img.hasChanges).length} image(s) have unsaved changes
                        </p>
                    </div>
                    <button
                        onClick={saveAllChanges}
                        disabled={saving || uploadedImages.every(img => !img.hasChanges)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedImages.map((image, index) => (
                    <ImageCard
                        key={index}
                        image={image}
                        onTitleChange={(title) => handleTitleChange(index, title)}
                        onCarouselToggle={() => handleCarouselToggle(index)}
                        onDelete={() => handleDeleteImage(index)}
                        onSave={() => saveImageSettings(index)}
                        hasChanges={image.hasChanges}
                        saving={saving}
                    />
                ))}
            </div>
        </>
    );
}
