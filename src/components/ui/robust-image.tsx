'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { ImageIcon, AlertTriangle } from 'lucide-react';
import { logImageError, isPlaceholderImage } from '~/lib/image-error-handler';

interface RobustImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  fallbackSrc?: string;
  showErrorDetails?: boolean;
  onError?: (error: string) => void;
  onLoad?: () => void;
}

export default function RobustImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  fallbackSrc,
  showErrorDetails = false,
  onError,
  onLoad
}: RobustImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;

    // Check if this is a placeholder image (1x1 transparent PNG)
    // The server returns this when the actual image is missing
    if (isPlaceholderImage(img)) {
      // This is likely a placeholder - treat as error
      setIsLoading(false);
      setHasError(true);
      const errorMessage = `Image not found: ${src}`;
      logImageError(src, errorMessage, true);
      onError?.(errorMessage);
      return;
    }

    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [src, onLoad, onError]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    
    // If we haven't tried the fallback yet and one is provided
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    // Mark as error and notify parent
    setHasError(true);
    const errorMessage = `Failed to load image: ${src}`;
    logImageError(src, errorMessage);
    onError?.(errorMessage);
  }, [src, fallbackSrc, currentSrc, onError]);

  // Error state - show placeholder
  if (hasError) {
    const containerStyle = fill
      ? { position: 'absolute' as const, inset: 0 }
      : { width, height };

    return (
      <div
        className={`flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
        style={containerStyle}
        title={`Failed to load image: ${src}`}
      >
        <div className="text-center p-4">
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-medium">Image unavailable</p>
          {showErrorDetails && (
            <div className="mt-2 space-y-1">
              <AlertTriangle className="h-4 w-4 text-amber-500 mx-auto" />
              <p className="text-xs text-amber-600">
                {src.startsWith('http') ? 'External image failed to load' : 'Local file not found'}
              </p>
              <p className="text-xs text-gray-400 break-all">
                {src.length > 30 ? `...${src.slice(-30)}` : src}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    const containerStyle = fill 
      ? { position: 'absolute' as const, inset: 0 }
      : { width, height };

    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 animate-pulse ${className}`}
        style={containerStyle}
      >
        <ImageIcon className="h-8 w-8 text-gray-300" />
      </div>
    );
  }

  // Normal image rendering
  const imageProps = {
    src: currentSrc,
    alt,
    className,
    onLoad: handleLoad,
    onError: handleError,
    ...(fill ? { fill: true } : { width, height })
  };

  return <Image {...imageProps} />;
}
