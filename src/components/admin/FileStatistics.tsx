"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Images, Eye, EyeOff, HardDrive } from "lucide-react";
import type { Image as ImageType } from "~/server/db/schema";

interface FileStatisticsProps {
  images: ImageType[];
}

export default function FileStatistics({ images }: FileStatisticsProps) {
  const totalImages = images.length;
  const visibleImages = images.filter(img => img.visible).length;
  const hiddenImages = totalImages - visibleImages;
  const galleryImages = images.filter(img => img.gallery).length;
  const carouselImages = images.filter(img => img.carousel).length;
  
  const totalSize = images.reduce((sum, img) => sum + img.image_size, 0);
  const visibleSize = images
    .filter(img => img.visible)
    .reduce((sum, img) => sum + img.image_size, 0);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          <Images className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalImages}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              Gallery: {galleryImages}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Carousel: {carouselImages}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visible Images</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{visibleImages}</div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(visibleImages, totalImages)} of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hidden Images</CardTitle>
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{hiddenImages}</div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(hiddenImages, totalImages)} of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
          <p className="text-xs text-muted-foreground">
            Visible: {formatFileSize(visibleSize)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
