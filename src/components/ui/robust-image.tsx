'use client';

import React, { useState, useCallback, useEffect } from 'react';
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

  // Debug logging
  console.log(`RobustImage: Initializing with src=${src}, isLoading=${isLoading}, hasError=${hasError}`);

  // Reset states when src changes
  useEffect(() => {
    console.log(`RobustImage: src changed to ${src}, resetting states`);
    setIsLoading(true);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  // Add a timeout to prevent infinite loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log(`RobustImage: Timeout reached for ${src}, forcing error state`);
        setIsLoading(false);
        setHasError(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [src, isLoading]);

  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`RobustImage handleLoad called for: ${src}`);
    const img = event.currentTarget;
    console.log(`Image dimensions: ${img.naturalWidth}x${img.naturalHeight}`);

    // Check if this is a placeholder image (1x1 transparent PNG)
    // The server returns this when the actual image is missing
    if (isPlaceholderImage(img)) {
      // This is likely a placeholder - treat as error
      console.log(`RobustImage: Detected placeholder for ${src}`);
      setIsLoading(false);
      setHasError(true);
      const errorMessage = `Image not found: ${src}`;
      logImageError(src, errorMessage, true);
      onError?.(errorMessage);
      return;
    }

    console.log(`RobustImage: Successfully loaded ${src} (${img.naturalWidth}x${img.naturalHeight})`);
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [src, onLoad, onError]);

  const handleError = useCallback(() => {
    console.log(`RobustImage handleError called for: ${src}`);
    setIsLoading(false);

    // If we haven't tried the fallback yet and one is provided
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      console.log(`RobustImage: Trying fallback ${fallbackSrc} for ${src}`);
      setCurrentSrc(fallbackSrc);
      return;
    }

    // Mark as error and notify parent
    console.log(`RobustImage: Setting error state for ${src}`);
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

  // For local uploads, use regular img tag to avoid Next.js Image optimization issues
  if (currentSrc.startsWith('/uploads/')) {
    const imgStyle = fill
      ? { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const }
      : { width, height };

    return (
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        style={imgStyle}
        onLoad={(e) => {
          console.log(`LOCAL IMG onLoad event fired for: ${currentSrc}`);
          handleLoad(e);
        }}
        onError={(_e) => {
          console.log(`LOCAL IMG onError event fired for: ${currentSrc}`);
          handleError();
        }}
      />
    );
  }

  // For external images, also use regular img tag for now to debug
  const imgStyle = fill
    ? { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const }
    : { width, height };

  console.log(`RobustImage: Rendering img with src=${currentSrc}, onLoad=${!!handleLoad}, onError=${!!handleError}`);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={imgStyle}
      onLoad={(e) => {
        console.log(`IMG onLoad event fired for: ${currentSrc}`);
        handleLoad(e);
      }}
      onError={(e) => {
        console.log(`IMG onError event fired for: ${currentSrc}`);
        handleError();
      }}
    />
  );
}
