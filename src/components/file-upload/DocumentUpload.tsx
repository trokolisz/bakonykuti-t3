'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';

// Types matching UploadThing interface
export interface UploadedDocument {
  url: string;
  filename?: string;
  size?: number;
}

export interface DocumentUploadProps {
  className?: string;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  onUploadComplete?: (file: UploadedDocument) => void;
  onUploadError?: (error: { message: string }) => void;
  onUploadProgress?: (progress: number) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  // Additional props for document metadata
  title?: string;
  category?: string;
  date?: string;
}

export default function DocumentUpload({
  className,
  maxFileSize = 4, // 4MB default
  acceptedFileTypes = ['application/pdf'],
  onUploadComplete,
  onUploadError,
  onUploadProgress,
  disabled = false,
  children,
  title,
  category,
  date
}: DocumentUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    if (!files || disabled || files.length === 0) return;

    const file = files[0]; // Only handle single file for documents
    
    const error = validateFile(file);
    if (error) {
      onUploadError?.({ message: error });
      return;
    }

    setSelectedFile(file);
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('files', file);
      
      // Add document metadata if provided
      if (title) formData.append('title', title);
      if (category) formData.append('category', category);
      if (date) formData.append('date', date);

      const response = await fetch('/api/upload/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        const uploadedDocument: UploadedDocument = {
          url: result.document.fileUrl,
          filename: result.document.filename,
          size: file.size
        };
        
        onUploadComplete?.(uploadedDocument);
        
        // Reset state
        setSelectedFile(null);
        setUploadProgress(0);
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

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
              {isUploading ? 'Uploading document...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF files up to {maxFileSize}MB
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
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-1">
              {uploadProgress.toFixed(0)}%
            </p>
          </div>
        )}
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Selected File:</h4>
          <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-foreground font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-destructive" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
