
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  category?: string;
  tags: string[];
  error?: string;
}

interface DocumentUploadProps {
  onUploadComplete?: (files: UploadFile[]) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Contracts',
    'Legal Briefs',
    'Case Law',
    'Regulations',
    'Corporate Documents',
    'Employment Law',
    'Intellectual Property',
    'Other'
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
      tags: []
    }));

    setUploadFiles(prev => [...prev, ...newUploadFiles]);
    
    // Simulate upload process
    newUploadFiles.forEach(uploadFile => {
      simulateUpload(uploadFile.id);
    });

    if (files.length > validFiles.length) {
      toast.error(`${files.length - validFiles.length} files were rejected. Only PDF, DOC, DOCX, and TXT files under 50MB are allowed.`);
    }
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          if (file.progress < 100) {
            return { ...file, progress: file.progress + 10 };
          } else if (file.status === 'uploading') {
            return { ...file, status: 'processing' };
          } else if (file.status === 'processing') {
            // Simulate random processing completion
            if (Math.random() > 0.7) {
              clearInterval(interval);
              return { ...file, status: 'completed' };
            }
            return file;
          }
        }
        return file;
      }));
    }, 500);
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
      {/* Upload Zone */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-12 text-center">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Upload Legal Documents
          </h3>
          <p className="text-slate-600 mb-6">
            Drag and drop files here, or click to browse. Supports PDF, DOCX, and TXT files up to 50MB.
          </p>
          <Button 
            variant="outline" 
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            Browse Files
          </Button>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
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
                      <p className="text-sm text-slate-500">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB • 
                        <span className={`ml-1 ${getStatusColor(uploadFile.status)}`}>
                          {uploadFile.status}
                        </span>
                      </p>
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
                        <Select onValueChange={(value) => updateFileCategory(uploadFile.id, value)}>
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
    </div>
  );
};
