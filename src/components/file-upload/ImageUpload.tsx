'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';

// Types matching UploadThing interface
export interface UploadedFile {
  url: string;
  filename?: string;
  size?: number;
}

export interface ImageUploadProps {
  className?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: { message: string }) => void;
  onUploadProgress?: (progress: number) => void;
  disabled?: boolean;
  uploadEndpoint: 'gallery' | 'news' | 'events';
  children?: React.ReactNode;
}

interface UploadProgress {
  [key: string]: number;
}

export default function ImageUpload({
  className,
  maxFiles = 1,
  maxFileSize = 4, // 4MB default
  acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  onUploadComplete,
  onUploadError,
  onUploadProgress,
  disabled = false,
  uploadEndpoint,
  children
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFileTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use: ${acceptedFileTypes.join(', ')}`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || disabled) return;

    const fileArray = Array.from(files);
    
    // Check file count
    if (fileArray.length > maxFiles) {
      onUploadError?.({ message: `Maximum ${maxFiles} files allowed` });
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

    setSelectedFiles(validFiles);
    uploadFiles(validFiles);
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    const newProgress: UploadProgress = {};

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
        newProgress[file.name] = 0;
      });

      setUploadProgress(newProgress);

      const response = await fetch(`/api/upload/${uploadEndpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        // Handle single vs multiple file responses
        const uploadedFiles: UploadedFile[] = result.images || [result.image];
        onUploadComplete?.(uploadedFiles);
        
        // Reset state
        setSelectedFiles([]);
        setUploadProgress({});
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const totalProgress = Object.values(uploadProgress).reduce((sum, progress) => sum + progress, 0) / Math.max(Object.keys(uploadProgress).length, 1);

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragOver && "border-primary bg-primary/10",
          disabled && "opacity-50 cursor-not-allowed",
          isUploading && "pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedFileTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}

          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {acceptedFileTypes.includes('image/jpeg') ? 'Images' : 'Files'} up to {maxFileSize}MB
              {maxFiles > 1 && ` (max ${maxFiles} files)`}
            </p>
          </div>

          {children}
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-foreground">Selected Files:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                {!isUploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
