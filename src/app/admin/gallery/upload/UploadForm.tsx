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
            <div className="mb-8 flex flex-col items-center space-y-4">
                <h2 className="text-2xl font-semibold text-primary mb-2">Upload Images</h2>
                <div className="p-6 bg-card rounded-lg shadow-md border border-border">
                    <UploadButton
                        className="ut-button:bg-primary ut-button:text-foreground 
                                 ut-button:font-medium ut-button:py-3 ut-button:px-8 
                                 ut-button:rounded-full ut-button:hover:opacity-90 
                                 ut-button:active:scale-95 ut-button:transition-all 
                                 ut-button:duration-200 ut-button:shadow-lg
                                 ut-allowed-content:text-muted-foreground
                                 ut-upload-container:flex ut-upload-container:flex-col
                                 ut-upload-container:items-center ut-upload-container:gap-4"
                        endpoint="bakonykutiGalleryImageUploader"
                        onClientUploadComplete={handleImageUpload}
                        onUploadError={(error) => {
                            alert(`Upload Error: ${error.message}`);
                        }}
                    />
                </div>
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
