'use client';
import React, { useState } from 'react';
import { UploadButton } from "~/utils/uploadthing";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Input } from "~/components/ui/input";
import { Trash2 } from "lucide-react";
import Image from "next/image"


interface UploadedFile {
    url: string;
}

interface GalleryImage {
    url: string;
    title: string;
    isCarousel: boolean;
}
const UploadPage = () => {
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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Upload Gallery Images</h1>

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
                    <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="relative">
                                <Image
                                    src={image.url}
                                    width={400}
                                    height={300}
                                    alt={image.title || 'Uploaded image'}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                                <button
                                    onClick={() => handleDeleteImage(index)}
                                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor={`title-${index}`}>Image Title</Label>
                                    <Input
                                        id={`title-${index}`}
                                        value={image.title}
                                        onChange={(e) => handleTitleChange(index, e.target.value)}
                                        placeholder="Enter image title"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor={`carousel-${index}`}>Use in Carousel</Label>
                                    <Switch
                                        id={`carousel-${index}`}
                                        checked={image.isCarousel}
                                        onCheckedChange={() => handleCarouselToggle(index)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default UploadPage;