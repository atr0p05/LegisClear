
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Share, Eye, BookOpen, Calendar, User, Tag } from 'lucide-react';
import { toast } from 'sonner';

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
}

interface DocumentViewerProps {
  document: DocumentMetadata;
  content?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, content }) => {
  const [activeTab, setActiveTab] = useState('preview');

  const handleDownload = () => {
    toast.success(`Downloading ${document.title}...`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Document: ${document.title} - ${document.id}`);
    toast.success('Document link copied to clipboard');
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              {getTypeIcon(document.type)}
              {document.title}
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="annotations">Annotations</TabsTrigger>
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
              <CardContent className="p-6">
                <div className="text-center text-slate-500 mt-8">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Annotations feature coming soon</p>
                  <p className="text-sm">Add highlights, notes, and bookmarks to your documents</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
