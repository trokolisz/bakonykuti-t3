'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AlertTriangle, RefreshCw, ExternalLink, Eye, EyeOff } from 'lucide-react';
// Removed Alert import - using custom styling instead
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface DebugImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  showDebugInfo?: boolean;
  onError?: (error: string) => void;
  onLoad?: () => void;
}

interface ImageDebugInfo {
  loaded: boolean;
  error: string | null;
  actualSrc: string;
  isExternal: boolean;
  attempts: number;
  lastAttempt: Date | null;
  httpStatus: number | null;
}

export default function DebugImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  showDebugInfo = false,
  onError,
  onLoad
}: DebugImageProps) {
  const [debugInfo, setDebugInfo] = useState<ImageDebugInfo>({
    loaded: false,
    error: null,
    actualSrc: src,
    isExternal: src.startsWith('http'),
    attempts: 0,
    lastAttempt: null,
    httpStatus: null
  });

  const [showDebug, setShowDebug] = useState(showDebugInfo);

  // Test image accessibility
  const testImageAccess = async (imageSrc: string): Promise<{ accessible: boolean; status?: number; error?: string }> => {
    try {
      const response = await fetch(imageSrc, { method: 'HEAD' });
      return {
        accessible: response.ok,
        status: response.status,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };
    } catch (error) {
      return {
        accessible: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  // Handle image load success
  const handleLoad = () => {
    setDebugInfo(prev => ({
      ...prev,
      loaded: true,
      error: null
    }));
    onLoad?.();
  };

  // Handle image load error
  const handleError = async () => {
    const newAttempts = debugInfo.attempts + 1;
    const now = new Date();

    // Test the image URL to get more detailed error info
    const testResult = await testImageAccess(src);

    const errorMessage = testResult.error || 'Image failed to load';
    
    setDebugInfo(prev => ({
      ...prev,
      loaded: false,
      error: errorMessage,
      attempts: newAttempts,
      lastAttempt: now,
      httpStatus: testResult.status || null
    }));

    onError?.(errorMessage);
  };

  // Retry loading the image
  const retryLoad = () => {
    setDebugInfo(prev => ({
      ...prev,
      error: null,
      actualSrc: `${src}?retry=${Date.now()}` // Add cache-busting parameter
    }));
  };

  // Get suggestions based on the error
  const getSuggestions = (): string[] => {
    const suggestions: string[] = [];

    if (debugInfo.httpStatus === 404) {
      suggestions.push('Image file not found - check if upload completed successfully');
      suggestions.push('Verify the file path is correct');
      suggestions.push('Check if file exists in the public directory');
    } else if (debugInfo.httpStatus === 403) {
      suggestions.push('Access forbidden - check file permissions');
      suggestions.push('Ensure web server can read the file');
    } else if (debugInfo.httpStatus && debugInfo.httpStatus >= 500) {
      suggestions.push('Server error - check server logs');
      suggestions.push('Verify web server configuration');
    } else if (debugInfo.error?.includes('Network error')) {
      suggestions.push('Check internet connection');
      suggestions.push('Verify the server is running');
      suggestions.push('Check firewall settings');
    }

    if (debugInfo.isExternal) {
      suggestions.push('External image - verify the external service is accessible');
    } else {
      suggestions.push('Local image - ensure Next.js static file serving is working');
      suggestions.push('Check if the file is in the public directory');
    }

    return suggestions;
  };

  // Format the image source for display
  const getDisplaySrc = () => {
    if (debugInfo.isExternal) {
      return src;
    }
    return `${window.location.origin}${src}`;
  };

  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      actualSrc: src,
      isExternal: src.startsWith('http')
    }));
  }, [src]);

  return (
    <div className="space-y-2">
      {/* Image Container */}
      <div className="relative">
        {debugInfo.error ? (
          // Error State
          <div 
            className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 ${className}`}
            style={{ width, height }}
          >
            <div className="text-center p-4">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Image failed to load</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={retryLoad}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        ) : (
          // Normal Image
          <Image
            src={debugInfo.actualSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onLoad={handleLoad}
            onError={handleError}
            unoptimized={debugInfo.isExternal} // Don't optimize external images
          />
        )}

        {/* Debug Toggle Button */}
        {(debugInfo.error || showDebugInfo) && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        )}
      </div>

      {/* Debug Information */}
      {showDebug && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                <Badge variant={debugInfo.loaded ? "default" : "destructive"}>
                  {debugInfo.loaded ? "Loaded" : "Failed"}
                </Badge>
                <Badge variant={debugInfo.isExternal ? "secondary" : "outline"}>
                  {debugInfo.isExternal ? "External" : "Local"}
                </Badge>
                {debugInfo.httpStatus && (
                  <Badge variant={debugInfo.httpStatus < 400 ? "default" : "destructive"}>
                    HTTP {debugInfo.httpStatus}
                  </Badge>
                )}
                {debugInfo.attempts > 0 && (
                  <Badge variant="outline">
                    Attempts: {debugInfo.attempts}
                  </Badge>
                )}
              </div>

              <div>
                <p className="font-medium">Source URL:</p>
                <div className="flex items-center space-x-1">
                  <code className="text-xs bg-gray-100 px-1 rounded break-all">
                    {getDisplaySrc()}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={() => window.open(getDisplaySrc(), '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {debugInfo.error && (
                <div>
                  <p className="font-medium text-red-600">Error:</p>
                  <p className="text-red-600">{debugInfo.error}</p>
                </div>
              )}

              {debugInfo.lastAttempt && (
                <div>
                  <p className="font-medium">Last Attempt:</p>
                  <p>{debugInfo.lastAttempt.toLocaleString()}</p>
                </div>
              )}

              {debugInfo.error && (
                <div>
                  <p className="font-medium">Suggestions:</p>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    {getSuggestions().map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={retryLoad}
                  className="text-xs h-6"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.open(`/admin/debug/images?test=${encodeURIComponent(src)}`, '_blank')}
                  className="text-xs h-6"
                >
                  Debug
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
