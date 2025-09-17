'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '~/components/ui/select';
import { Checkbox } from '~/components/ui/checkbox';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { 
  Files, 
  Search, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  HardDrive,
  Eye,
  Filter,
  Download,
  Calendar,
  User,
  FileType,
  Loader2
} from 'lucide-react';
// Client-safe file size formatter
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface FileRecord {
  id: number;
  originalName: string;
  filename: string;
  filePath: string;
  publicUrl: string;
  mimeType: string;
  fileSize: number;
  uploadType: string;
  uploadedBy?: string;
  associatedEntity?: string;
  associatedEntityId?: number;
  isOrphaned: boolean;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface OrphanedFile {
  type: 'file' | 'record';
  filePath?: string;
  fileId?: number;
  reason: string;
}

export default function FileManagementClient() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [orphans, setOrphans] = useState<OrphanedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('files');

  // Load files and orphans
  const loadData = async () => {
    setLoading(true);
    try {
      // Load files
      const filesResponse = await fetch('/api/admin/files');
      if (filesResponse.ok) {
        const filesData = await filesResponse.json();
        setFiles(filesData.files || []);
      }

      // Load orphans
      const orphansResponse = await fetch('/api/admin/files?action=orphans');
      if (orphansResponse.ok) {
        const orphansData = await orphansResponse.json();
        setOrphans(orphansData.orphans || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter files based on search and type
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.uploadType === filterType;
    return matchesSearch && matchesType;
  });

  // Handle file selection
  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(filteredFiles.map(f => f.id));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  // Delete single file
  const deleteFile = async (fileId: number) => {
    try {
      const response = await fetch(`/api/admin/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData();
        setSelectedFiles(prev => prev.filter(id => id !== fileId));
      } else {
        const error = await response.json();
        alert(`Error deleting file: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file');
    }
  };

  // Bulk delete files
  const bulkDeleteFiles = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const response = await fetch('/api/admin/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk_delete',
          fileIds: selectedFiles,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        await loadData();
        clearSelection();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert('Error performing bulk delete');
    }
  };

  // Cleanup orphaned files
  const cleanupOrphans = async (deleteFiles: boolean = false) => {
    try {
      const response = await fetch('/api/admin/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cleanup',
          deleteFiles,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        await loadData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error in cleanup:', error);
      alert('Error performing cleanup');
    }
  };

  // Statistics
  const stats = {
    total: files.length,
    byType: files.reduce((acc, file) => {
      acc[file.uploadType] = (acc[file.uploadType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalSize: files.reduce((sum, file) => sum + file.fileSize, 0),
    orphaned: files.filter(f => f.isOrphaned).length,
    orphanedFiles: orphans.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {Object.entries(stats.byType).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orphaned Records</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.orphaned}</div>
            <p className="text-xs text-muted-foreground">Database records marked as orphaned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orphaned Files</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.orphanedFiles}</div>
            <p className="text-xs text-muted-foreground">Files/records without counterpart</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="files">Files ({stats.total})</TabsTrigger>
          <TabsTrigger value="orphans">Orphans ({stats.orphanedFiles})</TabsTrigger>
          <TabsTrigger value="cleanup">Cleanup</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedFiles.length} file(s) selected
              </span>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Files</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedFiles.length} selected file(s)? 
                        This will remove both the physical files and database records. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={bulkDeleteFiles}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button onClick={clearSelection} variant="outline" size="sm">
                  Clear Selection
                </Button>
              </div>
            </div>
          )}

          {/* Files List */}
          <div className="space-y-2">
            {filteredFiles.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Button onClick={selectAllFiles} variant="outline" size="sm">
                  Select All ({filteredFiles.length})
                </Button>
              </div>
            )}

            {filteredFiles.map((file) => (
              <Card key={file.id} className={`${file.isOrphaned ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-600' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {file.isOrphaned && (
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                    )}
                    <Checkbox
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={() => toggleFileSelection(file.id)}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium truncate ${file.isOrphaned ? 'text-yellow-800 dark:text-yellow-200' : ''}`}>
                          {file.originalName}
                        </h3>
                        <Badge variant="outline">{file.uploadType}</Badge>
                        {file.isOrphaned && (
                          <Badge variant="destructive" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Orphaned
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileType className="h-3 w-3" />
                          {file.mimeType}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {formatFileSize(file.fileSize)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                        {file.uploadedBy && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {file.uploadedBy}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {file.filePath}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.mimeType.startsWith('image/') && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={file.publicUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete File</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{file.originalName}"? 
                              This will remove both the physical file and database record. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteFile(file.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredFiles.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Files className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No files found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No files have been uploaded yet.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="orphans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orphaned Files Detection</CardTitle>
              <p className="text-sm text-muted-foreground">
                Files that exist on disk without database records, or database records without corresponding files.
              </p>
            </CardHeader>
            <CardContent>
              {orphans.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orphaned files found</h3>
                  <p className="text-muted-foreground">All files are properly tracked in the database.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {orphans.map((orphan, index) => (
                    <div key={index} className={`p-3 border rounded-lg ${
                      orphan.type === 'file'
                        ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-600'
                        : 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-600'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`h-4 w-4 ${
                          orphan.type === 'file' ? 'text-red-500' : 'text-orange-500'
                        }`} />
                        <Badge variant={orphan.type === 'file' ? 'destructive' : 'secondary'} className={
                          orphan.type === 'file'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }>
                          {orphan.type === 'file' ? 'Orphaned File' : 'Orphaned Record'}
                        </Badge>
                        {orphan.filePath && (
                          <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {orphan.filePath}
                          </span>
                        )}
                        {orphan.fileId && (
                          <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            Record ID: {orphan.fileId}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{orphan.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleanup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cleanup Operations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Perform maintenance operations to clean up orphaned files and records.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Scan for Orphaned Files</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Scan the file system and database to identify orphaned files and records.
                  </p>
                  <Button onClick={loadData} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Scan
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Clean Up Orphaned Files</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Remove orphaned files from disk and orphaned records from database. 
                    <strong>This action cannot be undone.</strong>
                  </p>
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clean Up Orphans
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Clean Up Orphaned Files</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {orphans.length} orphaned files and records. 
                            This action cannot be undone. Are you sure you want to continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => cleanupOrphans(true)}>
                            Delete Orphans
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
