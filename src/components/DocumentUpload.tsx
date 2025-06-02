
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, AlertCircle, CheckCircle, X, FolderPlus, FileTemplate } from 'lucide-react';
import { toast } from 'sonner';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  category?: string;
  tags: string[];
  error?: string;
  version?: number;
  template?: string;
  classification?: string;
}

interface DocumentUploadProps {
  onUploadComplete?: (files: UploadFile[]) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [bulkCategory, setBulkCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const categories = [
    'Contracts',
    'Legal Briefs',
    'Case Law',
    'Regulations',
    'Corporate Documents',
    'Employment Law',
    'Intellectual Property',
    'Litigation',
    'Real Estate',
    'Tax Law',
    'Other'
  ];

  const documentTemplates = [
    { id: 'contract', name: 'Standard Contract', description: 'Basic contract template' },
    { id: 'nda', name: 'Non-Disclosure Agreement', description: 'NDA template with standard clauses' },
    { id: 'employment', name: 'Employment Agreement', description: 'Standard employment contract' },
    { id: 'retainer', name: 'Client Retainer Agreement', description: 'Legal services retainer' },
    { id: 'partnership', name: 'Partnership Agreement', description: 'Business partnership document' },
    { id: 'lease', name: 'Commercial Lease', description: 'Commercial property lease agreement' }
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, []);

  const handleFileSelection = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      return validTypes.includes(file.type) && file.size <= 50 * 1024 * 1024; // 50MB limit
    });

    const newUploadFiles: UploadFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: 'uploading',
      tags: [],
      version: 1,
      category: bulkCategory || undefined,
      classification: classifyDocument(file.name)
    }));

    setUploadFiles(prev => [...prev, ...newUploadFiles]);
    
    // Simulate upload and processing
    newUploadFiles.forEach(uploadFile => {
      simulateUpload(uploadFile.id);
    });

    if (files.length > validFiles.length) {
      toast.error(`${files.length - validFiles.length} files were rejected. Only PDF, DOC, DOCX, and TXT files under 50MB are allowed.`);
    }

    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} files added to upload queue`);
    }
  };

  const classifyDocument = (filename: string): string => {
    const name = filename.toLowerCase();
    if (name.includes('contract') || name.includes('agreement')) return 'Contract';
    if (name.includes('nda') || name.includes('confidential')) return 'NDA';
    if (name.includes('employment') || name.includes('job')) return 'Employment';
    if (name.includes('lease') || name.includes('rental')) return 'Real Estate';
    if (name.includes('patent') || name.includes('trademark')) return 'IP';
    return 'General';
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          if (file.progress < 100) {
            return { ...file, progress: file.progress + 15 };
          } else if (file.status === 'uploading') {
            return { ...file, status: 'processing' };
          } else if (file.status === 'processing') {
            if (Math.random() > 0.8) {
              clearInterval(interval);
              return { ...file, status: 'completed' };
            }
            return file;
          }
        }
        return file;
      }));
    }, 300);
  };

  const updateFileCategory = (fileId: string, category: string) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, category } : file
    ));
  };

  const addTag = (fileId: string, tag: string) => {
    if (!tag.trim()) return;
    
    setUploadFiles(prev => prev.map(file => 
      file.id === fileId ? { 
        ...file, 
        tags: [...file.tags, tag.trim()] 
      } : file
    ));
  };

  const removeTag = (fileId: string, tagToRemove: string) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === fileId ? { 
        ...file, 
        tags: file.tags.filter(tag => tag !== tagToRemove) 
      } : file
    ));
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const applyBulkSettings = () => {
    if (!bulkCategory) return;
    
    setUploadFiles(prev => prev.map(file => ({
      ...file,
      category: bulkCategory
    })));
    
    toast.success(`Applied "${bulkCategory}" category to all files`);
  };

  const createFromTemplate = (templateId: string) => {
    const template = documentTemplates.find(t => t.id === templateId);
    if (!template) return;

    toast.success(`Creating document from ${template.name} template...`);
    // Here you would typically create a new document from the template
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: UploadFile['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'processing':
        return 'text-yellow-700';
      default:
        return 'text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Enhanced Upload Zone */}
          <Card 
            className={`border-2 border-dashed transition-all duration-200 ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50 scale-105' 
                : 'border-slate-300 hover:border-blue-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="p-12 text-center">
              <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                isDragOver ? 'text-blue-500' : 'text-slate-400'
              }`} />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Upload Legal Documents
              </h3>
              <p className="text-slate-600 mb-6">
                Drag and drop files here, or click to browse. Supports PDF, DOCX, and TXT files up to 50MB.
                <br />
                <span className="text-sm text-slate-500">
                  AI-powered classification and metadata extraction included
                </span>
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('folder-input')?.click()}
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Upload Folder
                </Button>
              </div>
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => e.target.files && handleFileSelection(Array.from(e.target.files))}
              />
              <input
                id="folder-input"
                type="file"
                {...({ webkitdirectory: true } as any)}
                className="hidden"
                onChange={(e) => e.target.files && handleFileSelection(Array.from(e.target.files))}
              />
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {uploadFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Upload Progress
                  <Badge variant="secondary">{uploadFiles.length}</Badge>
                  <Badge variant="outline">
                    {uploadFiles.filter(f => f.status === 'completed').length} completed
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadFiles.map((uploadFile) => (
                  <div key={uploadFile.id} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(uploadFile.status)}
                        <div>
                          <p className="font-medium text-slate-900">{uploadFile.file.name}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>{(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span>•</span>
                            <span className={getStatusColor(uploadFile.status)}>
                              {uploadFile.status}
                            </span>
                            {uploadFile.classification && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {uploadFile.classification}
                                </Badge>
                              </>
                            )}
                            {uploadFile.version && (
                              <>
                                <span>•</span>
                                <span>v{uploadFile.version}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="w-full" />
                    )}

                    {uploadFile.status === 'completed' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`category-${uploadFile.id}`}>Category</Label>
                            <Select 
                              value={uploadFile.category || ''} 
                              onValueChange={(value) => updateFileCategory(uploadFile.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor={`tags-${uploadFile.id}`}>Tags</Label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addTag(uploadFile.id, newTag);
                                    setNewTag('');
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => {
                                  addTag(uploadFile.id, newTag);
                                  setNewTag('');
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>

                        {uploadFile.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {uploadFile.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 w-4 h-4"
                                  onClick={() => removeTag(uploadFile.id, tag)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTemplate className="w-5 h-5" />
                Document Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTemplates.map(template => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{template.name}</h3>
                      <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => createFromTemplate(template.id)}
                      >
                        Create Document
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bulk-category">Default Category</Label>
                  <Select value={bulkCategory} onValueChange={setBulkCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={applyBulkSettings} disabled={!bulkCategory || uploadFiles.length === 0}>
                    Apply to All Files
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Quick Actions</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm">Auto-classify All</Button>
                  <Button variant="outline" size="sm">Extract Metadata</Button>
                  <Button variant="outline" size="sm">Generate Summaries</Button>
                  <Button variant="outline" size="sm">Create Relationships</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
