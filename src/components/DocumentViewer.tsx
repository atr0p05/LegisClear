
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Share, Eye, BookOpen, Calendar, User, Tag, MessageSquare, Highlighter, Bookmark, GitBranch, Link } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentVersioning } from './DocumentVersioning';
import { DocumentRelationships } from './DocumentRelationships';

interface DocumentMetadata {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'txt';
  category: string;
  size: string;
  uploadDate: string;
  lastModified: string;
  author?: string;
  tags: string[];
  pages?: number;
  wordCount?: number;
  language: string;
  confidentiality: 'public' | 'confidential' | 'restricted';
  version?: string;
}

interface Annotation {
  id: string;
  type: 'highlight' | 'note' | 'bookmark';
  content: string;
  position: string;
  color: string;
  createdBy: string;
  createdAt: string;
}

interface DocumentViewerProps {
  document: DocumentMetadata;
  content?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, content }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      type: 'highlight',
      content: 'Important clause regarding liability',
      position: 'Page 1, Paragraph 3',
      color: 'yellow',
      createdBy: 'Sarah Johnson',
      createdAt: '2024-06-01'
    },
    {
      id: '2',
      type: 'note',
      content: 'Need to review this section with client',
      position: 'Page 2, Section 4.1',
      color: 'blue',
      createdBy: 'Mike Chen',
      createdAt: '2024-05-30'
    }
  ]);

  const [newAnnotation, setNewAnnotation] = useState({
    type: 'note' as Annotation['type'],
    content: '',
    position: '',
    color: 'yellow'
  });
  const [showAddAnnotation, setShowAddAnnotation] = useState(false);

  const handleDownload = () => {
    toast.success(`Downloading ${document.title}...`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Document: ${document.title} - ${document.id}`);
    toast.success('Document link copied to clipboard');
  };

  const handleAddAnnotation = () => {
    if (!newAnnotation.content.trim()) {
      toast.error('Please provide annotation content');
      return;
    }

    const annotation: Annotation = {
      id: Date.now().toString(),
      ...newAnnotation,
      createdBy: 'Current User',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAnnotations(prev => [...prev, annotation]);
    setNewAnnotation({ type: 'note', content: '', position: '', color: 'yellow' });
    setShowAddAnnotation(false);
    toast.success('Annotation added successfully');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'docx':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'txt':
        return <FileText className="w-5 h-5 text-gray-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case 'public':
        return 'bg-green-100 text-green-800';
      case 'confidential':
        return 'bg-yellow-100 text-yellow-800';
      case 'restricted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAnnotationIcon = (type: Annotation['type']) => {
    switch (type) {
      case 'highlight':
        return <Highlighter className="w-4 h-4" />;
      case 'note':
        return <MessageSquare className="w-4 h-4" />;
      case 'bookmark':
        return <Bookmark className="w-4 h-4" />;
    }
  };

  const getAnnotationColor = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-100 border-yellow-300';
      case 'blue':
        return 'bg-blue-100 border-blue-300';
      case 'green':
        return 'bg-green-100 border-green-300';
      case 'red':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              {getTypeIcon(document.type)}
              {document.title}
              {document.version && (
                <Badge variant="outline">v{document.version}</Badge>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={getConfidentialityColor(document.confidentiality)}>
                {document.confidentiality}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="annotations">Annotations</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    {content ? (
                      <div className="prose prose-slate max-w-none">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {content}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-slate-500">
                        <div className="text-center">
                          <FileText className="w-12 h-12 mx-auto mb-4" />
                          <p>Document preview not available</p>
                          <p className="text-sm">Click download to view the full document</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata" className="flex-1">
            <Card className="h-full">
              <CardContent className="p-6">
                <ScrollArea className="h-full">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Type</p>
                          <p className="text-slate-900">{document.type.toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Category</p>
                          <p className="text-slate-900">{document.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Size</p>
                          <p className="text-slate-900">{document.size}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Language</p>
                          <p className="text-slate-900">{document.language}</p>
                        </div>
                        {document.pages && (
                          <div>
                            <p className="text-sm font-medium text-slate-600">Pages</p>
                            <p className="text-slate-900">{document.pages}</p>
                          </div>
                        )}
                        {document.wordCount && (
                          <div>
                            <p className="text-sm font-medium text-slate-600">Word Count</p>
                            <p className="text-slate-900">{document.wordCount.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Dates */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Timeline
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Upload Date</p>
                          <p className="text-slate-900">{document.uploadDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Last Modified</p>
                          <p className="text-slate-900">{document.lastModified}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Author */}
                    {document.author && (
                      <>
                        <div>
                          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Author
                          </h3>
                          <p className="text-slate-900">{document.author}</p>
                        </div>
                        <Separator />
                      </>
                    )}

                    {/* Tags */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="annotations" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Annotations
                    <Badge variant="secondary">{annotations.length}</Badge>
                  </CardTitle>
                  <Dialog open={showAddAnnotation} onOpenChange={setShowAddAnnotation}>
                    <DialogTrigger asChild>
                      <Button size="sm">Add Annotation</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Annotation</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Type</label>
                          <select 
                            className="w-full p-2 border rounded"
                            value={newAnnotation.type}
                            onChange={(e) => setNewAnnotation(prev => ({ 
                              ...prev, 
                              type: e.target.value as Annotation['type'] 
                            }))}
                          >
                            <option value="note">Note</option>
                            <option value="highlight">Highlight</option>
                            <option value="bookmark">Bookmark</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Position</label>
                          <Input
                            placeholder="e.g., Page 1, Section 2.1"
                            value={newAnnotation.position}
                            onChange={(e) => setNewAnnotation(prev => ({ 
                              ...prev, 
                              position: e.target.value 
                            }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Content</label>
                          <Textarea
                            placeholder="Enter your annotation..."
                            value={newAnnotation.content}
                            onChange={(e) => setNewAnnotation(prev => ({ 
                              ...prev, 
                              content: e.target.value 
                            }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Color</label>
                          <select 
                            className="w-full p-2 border rounded"
                            value={newAnnotation.color}
                            onChange={(e) => setNewAnnotation(prev => ({ 
                              ...prev, 
                              color: e.target.value 
                            }))}
                          >
                            <option value="yellow">Yellow</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="red">Red</option>
                          </select>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddAnnotation(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddAnnotation}>
                            Add Annotation
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {annotations.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No annotations yet</p>
                        <p className="text-sm">Add highlights, notes, and bookmarks</p>
                      </div>
                    ) : (
                      annotations.map((annotation) => (
                        <div 
                          key={annotation.id} 
                          className={`p-3 border rounded-lg ${getAnnotationColor(annotation.color)}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getAnnotationIcon(annotation.type)}
                              <span className="font-medium capitalize">{annotation.type}</span>
                              <Badge variant="outline" className="text-xs">
                                {annotation.position}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-500">
                              {annotation.createdAt}
                            </div>
                          </div>
                          <p className="text-sm mb-2">{annotation.content}</p>
                          <div className="text-xs text-slate-600">
                            By {annotation.createdBy}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="versions" className="flex-1">
            <DocumentVersioning 
              documentId={document.id}
              documentTitle={document.title}
              currentVersion={document.version || "1.0"}
            />
          </TabsContent>

          <TabsContent value="relationships" className="flex-1">
            <DocumentRelationships 
              documentId={document.id}
              documentTitle={document.title}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
