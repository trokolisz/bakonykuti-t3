'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

interface ImageHealthData {
  status: 'healthy' | 'warning' | 'error';
  message: string;
  stats: {
    total: number;
    valid: number;
    missing: number;
    healthPercentage: number;
  };
}

export default function ImageHealthStatus() {
  const [health, setHealth] = useState<ImageHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/images/validate?action=health');
      const data = await response.json();
      
      if (data.success) {
        setHealth(data.health);
      } else {
        setError(data.error || 'Failed to fetch image health');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Checking Image Health...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Image Health Check Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button onClick={fetchHealth} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!health) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getStatusIcon(health.status)}
            Image System Health
          </span>
          <Button onClick={fetchHealth} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-3 rounded-lg border ${getStatusColor(health.status)}`}>
          <p className="text-sm font-medium">{health.message}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{health.stats.total}</div>
            <div className="text-xs text-gray-500">Total Images</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{health.stats.valid}</div>
            <div className="text-xs text-gray-500">Valid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{health.stats.missing}</div>
            <div className="text-xs text-gray-500">Missing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {health.stats.healthPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Health Score</div>
          </div>
        </div>

        {health.stats.missing > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Recommendation:</strong> Some images are missing from the file system. 
              Consider running the cleanup utility to remove orphaned database records.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
