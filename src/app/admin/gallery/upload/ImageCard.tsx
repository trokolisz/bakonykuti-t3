'use client';
import React from 'react';
import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Input } from "~/components/ui/input";
import { Trash2, Save, Check } from "lucide-react";

interface ImageCardProps {
    image: {
        url: string;
        title: string;
        isCarousel: boolean;
    };
    onTitleChange: (title: string) => void;
    onCarouselToggle: () => void;
    onDelete: () => void;
    onSave: () => void;
    hasChanges?: boolean;
    saving?: boolean;
}

export default function ImageCard({
    image,
    onTitleChange,
    onCarouselToggle,
    onDelete,
    onSave,
    hasChanges = false,
    saving = false
}: ImageCardProps) {
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

                    {/* Save button and status */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        {hasChanges ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-orange-600">Unsaved changes</span>
                                <button
                                    onClick={onSave}
                                    disabled={saving}
                                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    <Save size={14} />
                                    <span>{saving ? 'Saving...' : 'Save'}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-1 text-green-600">
                                <Check size={14} />
                                <span className="text-sm">Saved</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
