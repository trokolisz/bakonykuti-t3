'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Bug, Settings } from "lucide-react";

interface DebugReport {
  totalImages: number;
  accessibleImages: number;
  inaccessibleImages: number;
  issues: Array<{
    url: string;
    exists: boolean;
    accessible: boolean;
    error?: string;
    suggestions: string[];
  }>;
  systemInfo: {
    uploadDir: string;
    publicDir: string;
    baseUrl: string;
    serverRunning: boolean;
  };
  databaseInfo?: {
    totalImagesInDb: number;
    imagesWithLocalPath: number;
    imagesWithoutLocalPath: number;
    externalImages: number;
    localImages: number;
  };
  sampleImages?: Array<{
    id: number;
    url: string;
    localPath?: string;
    title: string;
    visible: boolean;
    gallery: boolean;
  }>;
}

export default function ImageDebugPage() {
  const [report, setReport] = useState<DebugReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [autoFixResult, setAutoFixResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('report');

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/images?action=report');
      const data = await response.json();
      
      if (data.success) {
        setReport(data.report);
      } else {
        alert('Failed to generate report: ' + data.error);
      }
    } catch (error) {
      alert('Error generating report: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const testSingleImage = async () => {
    if (!testUrl.trim()) {
      alert('Please enter an image URL to test');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/debug/images?action=test&url=${encodeURIComponent(testUrl)}`);
      const data = await response.json();
      
      if (data.success) {
        setTestResult(data.test);
      } else {
        alert('Failed to test image: ' + data.error);
      }
    } catch (error) {
      alert('Error testing image: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const performAutoFix = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/images?action=fix');
      const data = await response.json();
      
      if (data.success) {
        setAutoFixResult(data.autoFix);
        // Refresh the report after auto-fix
        setTimeout(generateReport, 1000);
      } else {
        alert('Failed to perform auto-fix: ' + data.error);
      }
    } catch (error) {
      alert('Error performing auto-fix: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Bug className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Image Access Debugger</h1>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            This tool helps diagnose and fix image access issues. Use it when images are uploaded but not visible to clients.
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'report'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            System Report
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'test'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Test Single Image
          </button>
          <button
            onClick={() => setActiveTab('fix')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'fix'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Auto-Fix Issues
          </button>
        </div>

        {activeTab === 'report' && (
          <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Generate System Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generateReport} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  'Generate Image Access Report'
                )}
              </Button>
            </CardContent>
          </Card>

          {report && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold text-green-600">{report.accessibleImages}</p>
                        <p className="text-sm text-muted-foreground">Accessible Images</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-2xl font-bold text-red-600">{report.inaccessibleImages}</p>
                        <p className="text-sm text-muted-foreground">Inaccessible Images</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Bug className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{report.totalImages}</p>
                        <p className="text-sm text-muted-foreground">Total Images</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Database Info */}
              {report.databaseInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle>Database Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Total in DB:</p>
                        <p>{report.databaseInfo.totalImagesInDb}</p>
                      </div>
                      <div>
                        <p className="font-medium">With Local Path:</p>
                        <p>{report.databaseInfo.imagesWithLocalPath}</p>
                      </div>
                      <div>
                        <p className="font-medium">External Images:</p>
                        <p>{report.databaseInfo.externalImages}</p>
                      </div>
                      <div>
                        <p className="font-medium">Local Images:</p>
                        <p>{report.databaseInfo.localImages}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Issues */}
              {report.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Issues Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {report.issues.map((issue, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start space-x-2">
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium break-all">{issue.url}</p>
                              {issue.error && (
                                <p className="text-sm text-red-600 mt-1">{issue.error}</p>
                              )}
                              {issue.suggestions.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium">Suggestions:</p>
                                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                                    {issue.suggestions.map((suggestion, i) => (
                                      <li key={i}>{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sample Images */}
              {report.sampleImages && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Images from Database</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {report.sampleImages.map((img) => (
                        <div key={img.id} className="flex items-center space-x-2 text-sm">
                          <Badge variant={img.visible ? "default" : "secondary"}>
                            {img.visible ? "Visible" : "Hidden"}
                          </Badge>
                          <Badge variant={img.gallery ? "default" : "outline"}>
                            {img.gallery ? "Gallery" : "Other"}
                          </Badge>
                          <span className="font-medium">{img.title}</span>
                          <span className="text-muted-foreground break-all">{img.url}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
        )}

        {activeTab === 'test' && (
          <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Single Image Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testUrl">Image URL to Test</Label>
                <Input
                  id="testUrl"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="Enter image URL (e.g., /uploads/gallery/image.jpg or https://...)"
                />
              </div>
              <Button onClick={testSingleImage} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Image Access'
                )}
              </Button>
            </CardContent>
          </Card>

          {testResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {testResult.accessible ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span>Test Result</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>URL:</strong> {testUrl}</p>
                  <p><strong>Accessible:</strong> {testResult.accessible ? 'Yes' : 'No'}</p>
                  {testResult.status && <p><strong>Status:</strong> {testResult.status}</p>}
                  {testResult.error && <p className="text-red-600"><strong>Error:</strong> {testResult.error}</p>}
                  {testResult.suggestions.length > 0 && (
                    <div>
                      <p><strong>Suggestions:</strong></p>
                      <ul className="list-disc list-inside text-sm">
                        {testResult.suggestions.map((suggestion: string, i: number) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        )}

        {activeTab === 'fix' && (
          <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Fix Common Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This will automatically create missing directories and fix common configuration issues.
              </p>
              <Button onClick={performAutoFix} disabled={loading} variant="outline">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Fixing Issues...
                  </>
                ) : (
                  'Run Auto-Fix'
                )}
              </Button>
            </CardContent>
          </Card>

          {autoFixResult && (
            <Card>
              <CardHeader>
                <CardTitle>Auto-Fix Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {autoFixResult.fixed.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-600">Fixed Issues:</h4>
                      <ul className="list-disc list-inside text-sm">
                        {autoFixResult.fixed.map((fix: string, i: number) => (
                          <li key={i} className="text-green-600">{fix}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {autoFixResult.failed.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600">Failed to Fix:</h4>
                      <ul className="list-disc list-inside text-sm">
                        {autoFixResult.failed.map((fail: string, i: number) => (
                          <li key={i} className="text-red-600">{fail}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {autoFixResult.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium">Additional Suggestions:</h4>
                      <ul className="list-disc list-inside text-sm">
                        {autoFixResult.suggestions.map((suggestion: string, i: number) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
