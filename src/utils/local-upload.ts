// Local file upload utilities to replace UploadThing
// This provides a compatible interface for existing components

import { UploadButton as LocalUploadButton } from '~/components/file-upload';

// Re-export the local upload button with the same interface as UploadThing
export const UploadButton = LocalUploadButton;

// Types that match UploadThing's interface
export interface UploadedFile {
  url: string;
  filename?: string;
  size?: number;
}

// Endpoint type that matches the existing UploadThing endpoints
export type UploadEndpoint = 'gallery' | 'news' | 'events' | 'documents';

// Configuration for different upload types
export const uploadConfigs = {
  bakonykutiGalleryImageUploader: {
    endpoint: 'gallery' as const,
    maxFiles: 5,
    maxFileSize: 4,
    acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },
  bakonykutiNewsImageUploader: {
    endpoint: 'news' as const,
    maxFiles: 1,
    maxFileSize: 4,
    acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },
  bakonykutiDocumentPdfUploader: {
    endpoint: 'documents' as const,
    maxFiles: 1,
    maxFileSize: 4,
    acceptedFileTypes: ['application/pdf']
  }
};

// Helper function to get endpoint from UploadThing endpoint name
export function getEndpointFromUploadThingName(endpointName: string): UploadEndpoint {
  const config = uploadConfigs[endpointName as keyof typeof uploadConfigs];
  return config?.endpoint || 'gallery';
}

// Helper function to create upload button props from UploadThing endpoint
export function createUploadButtonProps(
  endpointName: string,
  onClientUploadComplete?: (files: UploadedFile[]) => void,
  onUploadError?: (error: { message: string }) => void,
  className?: string
) {
  const config = uploadConfigs[endpointName as keyof typeof uploadConfigs];
  
  return {
    endpoint: config?.endpoint || 'gallery' as UploadEndpoint,
    onClientUploadComplete,
    onUploadError,
    className,
    maxFiles: config?.maxFiles,
    maxFileSize: config?.maxFileSize,
    acceptedFileTypes: config?.acceptedFileTypes
  };
}
