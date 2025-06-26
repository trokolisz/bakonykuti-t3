"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageManagementTable from "~/components/admin/ImageManagementTable";
import type { Image as ImageType } from "~/server/db/schema";

interface ImageManagementClientProps {
  images: ImageType[];
}

export default function ImageManagementClient({ images: initialImages }: ImageManagementClientProps) {
  const [images, setImages] = useState(initialImages);
  const router = useRouter();

  const handleVisibilityToggle = async (id: number, visible: boolean) => {
    try {
      const response = await fetch(`/api/admin/images/${id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visible }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update visibility');
      }

      // Update local state
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, visible } : img
      ));
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Failed to update image visibility');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/images/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete image');
      }

      // Remove from local state
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const handleBulkDelete = async (ids: number[]) => {
    try {
      const deletePromises = ids.map(id => 
        fetch(`/api/admin/images/${id}`, { method: 'DELETE' })
      );

      const responses = await Promise.all(deletePromises);
      const failedDeletes = responses.filter(response => !response.ok);

      if (failedDeletes.length > 0) {
        console.warn(`${failedDeletes.length} images failed to delete`);
      }

      // Remove successfully deleted images from local state
      const successfulDeletes = responses
        .map((response, index) => response.ok ? ids[index] : null)
        .filter(id => id !== null) as number[];

      setImages(prev => prev.filter(img => !successfulDeletes.includes(img.id)));

      if (failedDeletes.length > 0) {
        alert(`${successfulDeletes.length} images deleted successfully. ${failedDeletes.length} failed to delete.`);
      }
    } catch (error) {
      console.error('Error bulk deleting images:', error);
      alert('Failed to delete images');
    }
  };

  const handleBulkVisibilityToggle = async (ids: number[], visible: boolean) => {
    try {
      const updatePromises = ids.map(id => 
        fetch(`/api/admin/images/${id}/visibility`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ visible }),
        })
      );

      const responses = await Promise.all(updatePromises);
      const failedUpdates = responses.filter(response => !response.ok);

      if (failedUpdates.length > 0) {
        console.warn(`${failedUpdates.length} images failed to update`);
      }

      // Update successfully modified images in local state
      const successfulUpdates = responses
        .map((response, index) => response.ok ? ids[index] : null)
        .filter(id => id !== null) as number[];

      setImages(prev => prev.map(img => 
        successfulUpdates.includes(img.id) ? { ...img, visible } : img
      ));

      if (failedUpdates.length > 0) {
        alert(`${successfulUpdates.length} images updated successfully. ${failedUpdates.length} failed to update.`);
      }
    } catch (error) {
      console.error('Error bulk updating visibility:', error);
      alert('Failed to update image visibility');
    }
  };

  return (
    <ImageManagementTable
      images={images}
      onVisibilityToggle={handleVisibilityToggle}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
      onBulkVisibilityToggle={handleBulkVisibilityToggle}
    />
  );
}
