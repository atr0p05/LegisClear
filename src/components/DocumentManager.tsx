
import React, { useState } from 'react';
import { Upload, File, Search, Book, User, FolderOpen, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUpload } from '@/components/DocumentUpload';
import { DocumentViewer } from '@/components/DocumentViewer';
import { SourceManager } from '@/components/SourceManager';

export const DocumentManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    { 
      id: "1",
      name: "Employment Agreement Template", 
      title: "Employment Agreement Template",
      type: "docx" as const,
      size: "245 KB", 
      date: "2024-05-15", 
      category: "Employment Law",
      uploadDate: "2024-05-15",
      lastModified: "2024-05-15",
      author: "Legal Department",
      tags: ["employment", "template", "agreement"],
      pages: 12,
      wordCount: 2450,
      language: "English",
      confidentiality: "confidential" as const
    },
    { 
      id: "2",
      name: "NDA Standard Form", 
      title: "Non-Disclosure Agreement - Standard Form",
      type: "pdf" as const,
      size: "156 KB", 
      date: "2024-05-14", 
      category: "Contracts",
      uploadDate: "2024-05-14",
      lastModified: "2024-05-14", 
      author: "Contract Team",
      tags: ["nda", "confidentiality", "standard"],
      pages: 8,
      wordCount: 1890,
      language: "English",
      confidentiality: "restricted" as const
    },
    { 
      id: "3",
      name: "Intellectual Property Policy", 
      title: "Company Intellectual Property Policy",
      type: "pdf" as const,
      size: "387 KB", 
      date: "2024-05-12", 
      category: "IP Law",
      uploadDate: "2024-05-12",
      lastModified: "2024-05-12",
      author: "IP Legal Team", 
      tags: ["ip", "policy", "intellectual property"],
      pages: 24,
      wordCount: 5670,
      language: "English",
      confidentiality: "public" as const
    },
    { 
      id: "4",
      name: "Client Retainer Agreement", 
      title: "Client Retainer Agreement Template",
      type: "docx" as const,
      size: "298 KB", 
      date: "2024-05-10", 
      category: "Client Relations",
      uploadDate: "2024-05-10",
      lastModified: "2024-05-10",
      author: "Client Services",
      tags: ["retainer", "client", "billing"],
      pages: 16,
      wordCount: 3240,
      language: "English", 
      confidentiality: "confidential" as const
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return Book;
      case 'agreement': return User;
      default: return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'agreement': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Document Library</h1>
          <p className="text-slate-600 mt-1">Manage and organize your legal documents</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">Filter</Button>
                <Button variant="outline">Sort</Button>
              </div>
            </CardContent>
          </Card>

          {/* Document List */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                Your Documents
                <Badge variant="secondary">{filteredDocuments.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.map((doc, index) => {
                  const IconComponent = getTypeIcon(doc.type);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <IconComponent className="w-6 h-6 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                            <span>{doc.size}</span>
                            <span>{doc.date}</span>
                            <Badge className={getTypeColor(doc.type)} variant="secondary">
                              {doc.category}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {doc.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DocumentViewer document={doc} />
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-slate-900">{documents.length}</div>
                <div className="text-slate-600">Total Documents</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-slate-900">156 MB</div>
                <div className="text-slate-600">Storage Used</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-slate-900">89%</div>
                <div className="text-slate-600">Processing Complete</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-slate-900">12</div>
                <div className="text-slate-600">Categories</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <DocumentUpload />
        </TabsContent>

        <TabsContent value="sources">
          <SourceManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
