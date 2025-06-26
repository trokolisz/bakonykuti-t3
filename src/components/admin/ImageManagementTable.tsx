"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDate } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";
import type { Image as ImageType } from "~/server/db/schema";

interface ImageManagementTableProps {
  images: ImageType[];
  onVisibilityToggle: (id: number, visible: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onBulkDelete: (ids: number[]) => Promise<void>;
  onBulkVisibilityToggle: (ids: number[], visible: boolean) => Promise<void>;
}

export default function ImageManagementTable({
  images,
  onVisibilityToggle,
  onDelete,
  onBulkDelete,
  onBulkVisibilityToggle,
}: ImageManagementTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? images.map(img => img.id) : []);
  };

  const handleSelectImage = (id: number, checked: boolean) => {
    setSelectedIds(prev => 
      checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
    );
  };

  const handleVisibilityToggle = async (id: number, visible: boolean) => {
    setLoadingIds(prev => [...prev, id]);
    try {
      await onVisibilityToggle(id, visible);
    } finally {
      setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }
    
    setLoadingIds(prev => [...prev, id]);
    try {
      await onDelete(id);
    } finally {
      setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} images? This action cannot be undone.`)) {
      return;
    }

    setBulkLoading(true);
    try {
      await onBulkDelete(selectedIds);
      setSelectedIds([]);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkVisibilityToggle = async (visible: boolean) => {
    if (selectedIds.length === 0) return;

    setBulkLoading(true);
    try {
      await onBulkVisibilityToggle(selectedIds, visible);
      setSelectedIds([]);
    } finally {
      setBulkLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.length} image{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkVisibilityToggle(true)}
              disabled={bulkLoading}
            >
              {bulkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              Show All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkVisibilityToggle(false)}
              disabled={bulkLoading}
            >
              {bulkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
              Hide All
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={bulkLoading}
            >
              {bulkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete All
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedIds.length === images.length && images.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Size</th>
              <th className="p-4 text-left">Upload Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr key={image.id} className="border-t hover:bg-muted/50">
                <td className="p-4">
                  <Checkbox
                    checked={selectedIds.includes(image.id)}
                    onCheckedChange={(checked) => handleSelectImage(image.id, checked as boolean)}
                  />
                </td>
                <td className="p-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={image.url}
                      alt={image.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div className="max-w-xs truncate">{image.title || 'Untitled'}</div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatFileSize(image.image_size)}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(image.createdAt)}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Badge variant={image.visible ? "default" : "secondary"}>
                      {image.visible ? "Visible" : "Hidden"}
                    </Badge>
                    {image.gallery && (
                      <Badge variant="outline">Gallery</Badge>
                    )}
                    {image.carousel && (
                      <Badge variant="outline">Carousel</Badge>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVisibilityToggle(image.id, !image.visible)}
                      disabled={loadingIds.includes(image.id)}
                    >
                      {loadingIds.includes(image.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : image.visible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image.id)}
                      disabled={loadingIds.includes(image.id)}
                    >
                      {loadingIds.includes(image.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No images found.
        </div>
      )}
    </div>
  );
}
