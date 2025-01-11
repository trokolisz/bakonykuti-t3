'use client';
import React from 'react';
import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Input } from "~/components/ui/input";
import { Trash2 } from "lucide-react";

interface ImageCardProps {
    image: {
        url: string;
        title: string;
        isCarousel: boolean;
    };
    onTitleChange: (title: string) => void;
    onCarouselToggle: () => void;
    onDelete: () => void;
}

export default function ImageCard({ image, onTitleChange, onCarouselToggle, onDelete }: ImageCardProps) {
    return (
        <Card className="overflow-hidden">
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
                        onClick={onDelete}
                        className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Image Title</Label>
                        <Input
                            id="title"
                            value={image.title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="Enter image title"
                            className="mt-1"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="carousel">Use in Carousel</Label>
                        <Switch
                            id="carousel"
                            checked={image.isCarousel}
                            onCheckedChange={onCarouselToggle}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
