'use client';
import React, { useState } from 'react';
import { UploadButton } from "~/utils/uploadthing";
import ImageCard from './ImageCard';

interface UploadedFile {
    url: string;
}

interface GalleryImage {
    url: string;
    title: string;
    isCarousel: boolean;
}

export default function UploadForm() {
    const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);

    const handleImageUpload = (res: UploadedFile[]) => {
        const newImages: GalleryImage[] = res.map((file) => ({
            url: file.url,
            title: '',
            isCarousel: false
        }));
        setUploadedImages([...uploadedImages, ...newImages]);
    };

    const handleTitleChange = (index: number, newTitle: string): void => {
        const updatedImages = [...uploadedImages];
        const imageToUpdate = updatedImages[index];
        if (imageToUpdate) {
            imageToUpdate.title = newTitle;
            setUploadedImages(updatedImages);
        }
    };

    const handleCarouselToggle = (index: number) => {
        const updatedImages = [...uploadedImages];
        const imageToUpdate = updatedImages[index];
        if (imageToUpdate) {
            imageToUpdate.isCarousel = !imageToUpdate.isCarousel;
            setUploadedImages(updatedImages);
        }
    };

    const handleDeleteImage = (index: number) => {
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImages);
    };

    return (
        <>
            <div className="mb-8">
                <UploadButton
                    className="ut-button:bg-primary ut-button:text-foreground ut-button:font-semibold ut-button:py-3 ut-button:px-6 ut-button:rounded-md ut-button:hover:bg-muted ut-button:active:bg-muted ut-button:transition-colors ut-button:duration-200 ut-button:shadow-sm"
                    endpoint="bakonykutiGalleryImageUploader"
                    onClientUploadComplete={handleImageUpload}
                    onUploadError={(error) => {
                        alert(`Upload Error: ${error.message}`);
                    }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedImages.map((image, index) => (
                    <ImageCard
                        key={index}
                        image={image}
                        onTitleChange={(title) => handleTitleChange(index, title)}
                        onCarouselToggle={() => handleCarouselToggle(index)}
                        onDelete={() => handleDeleteImage(index)}
                    />
                ))}
            </div>
        </>
    );
}
