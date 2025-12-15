'use client';

import React, { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';

// Types matching UploadThing interface
export interface UploadedFile {
  url: string;
  filename?: string;
  size?: number;
}

export interface UploadButtonProps {
  className?: string;
  endpoint: 'gallery' | 'news' | 'events' | 'documents';
  onClientUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: { message: string }) => void;
  onUploadProgress?: (progress: number) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  // Configuration based on endpoint
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  // Document-specific props
  documentMetadata?: {
    title?: string;
    category?: string;
    date?: string;
  };
}

// Default configurations for each endpoint
const endpointConfigs = {
  gallery: {
    maxFiles: 5,
    maxFileSize: 4,
    acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    apiPath: '/api/upload/gallery'
  },
  news: {
    maxFiles: 1,
    maxFileSize: 4,
    acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    apiPath: '/api/upload/news'
  },
  events: {
    maxFiles: 1,
    maxFileSize: 4,
    acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    apiPath: '/api/upload/events'
  },
  documents: {
    maxFiles: 1,
    maxFileSize: 4,
    acceptedFileTypes: ['application/pdf'],
    apiPath: '/api/upload/documents'
  }
};

export default function UploadButton({
  className,
  endpoint,
  onClientUploadComplete,
  onUploadError,
  onUploadProgress: _onUploadProgress,
  disabled = false,
  children,
  maxFiles,
  maxFileSize,
  acceptedFileTypes,
  documentMetadata
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get configuration for the endpoint
  const config = endpointConfigs[endpoint];
  const finalMaxFiles = maxFiles ?? config.maxFiles;
  const finalMaxFileSize = maxFileSize ?? config.maxFileSize;
  const finalAcceptedTypes = acceptedFileTypes ?? config.acceptedFileTypes;

  const validateFile = (file: File): string | null => {
    if (!finalAcceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use: ${finalAcceptedTypes.join(', ')}`;
    }
    
    if (file.size > finalMaxFileSize * 1024 * 1024) {
      return `File size must be less than ${finalMaxFileSize}MB`;
    }
    
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || disabled) return;

    const fileArray = Array.from(files);
    
    // Check file count
    if (fileArray.length > finalMaxFiles) {
      onUploadError?.({ message: `Maximum ${finalMaxFiles} files allowed` });
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        onUploadError?.({ message: error });
        return;
      }
      validFiles.push(file);
    }

    uploadFiles(validFiles);
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    console.log(`🔄 Starting upload of ${files.length} files to ${endpoint}`);
    files.forEach((file, index) => {
      console.log(`  File ${index + 1}: ${file.name} (${file.size} bytes)`);
    });

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      // Add document metadata if provided and endpoint is documents
      if (endpoint === 'documents' && documentMetadata) {
        if (documentMetadata.title) formData.append('title', documentMetadata.title);
        if (documentMetadata.category) formData.append('category', documentMetadata.category);
        if (documentMetadata.date) formData.append('date', documentMetadata.date);
      }

      console.log(`📤 Sending request to: ${config.apiPath}`);
      const response = await fetch(config.apiPath, {
        method: 'POST',
        body: formData,
      });

      console.log(`📥 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Upload failed:', errorData);
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);
      
      if (result.success) {
        let uploadedFiles: UploadedFile[] = [];
        
        // Handle different response formats based on endpoint
        if (endpoint === 'gallery') {
          uploadedFiles = result.images || [];
        } else if (endpoint === 'documents') {
          uploadedFiles = [{
            url: result.document.fileUrl,
            filename: result.document.filename,
            size: files[0]?.size
          }];
        } else {
          // news, events
          uploadedFiles = [result.image];
        }
        
        onClientUploadComplete?.(uploadedFiles);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.({ 
        message: error instanceof Error ? error.message : 'Upload failed' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple={finalMaxFiles > 1}
        accept={finalAcceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      <button
        onClick={handleClick}
        disabled={disabled || isUploading}
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium",
          "rounded-full border border-transparent transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          
          // Default UploadThing-like styling
          "bg-primary text-primary-foreground hover:opacity-90 active:scale-95",
          "shadow-lg hover:shadow-xl",
          
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:active:scale-100",
          
          // Custom className override
          className
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {children || `Upload ${endpoint === 'documents' ? 'Document' : 'Image'}${finalMaxFiles > 1 ? 's' : ''}`}
          </>
        )}
      </button>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {endpoint === 'documents' ? 'PDF files' : 'Images'} up to {finalMaxFileSize}MB
          {finalMaxFiles > 1 && ` (max ${finalMaxFiles} files)`}
        </p>
      </div>
    </div>
  );
}
