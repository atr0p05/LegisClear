
import React, { useState } from 'react';
import { Upload, File, Search, Book, User, FolderOpen, Settings, Filter, SortAsc, Grid, List, Archive, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentUpload } from '@/components/DocumentUpload';
import { DocumentViewer } from '@/components/DocumentViewer';
import { SourceManager } from '@/components/SourceManager';

export const DocumentManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showArchived, setShowArchived] = useState(false);

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
      confidentiality: "confidential" as const,
      version: "3.0",
      status: "active",
      starred: true,
      classification: "Contract"
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
      confidentiality: "restricted" as const,
      version: "2.1",
      status: "active",
      starred: false,
      classification: "NDA"
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
      confidentiality: "public" as const,
      version: "1.0",
      status: "active",
      starred: true,
      classification: "Policy"
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
      confidentiality: "confidential" as const,
      version: "1.5",
      status: "archived",
      starred: false,
      classification: "Agreement"
    }
  ];

  const categories = [
    'All Categories',
    'Employment Law',
    'Contracts', 
    'IP Law',
    'Client Relations',
    'Litigation',
    'Real Estate',
    'Tax Law'
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

  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'confidential': return 'bg-yellow-100 text-yellow-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' || 
                             doc.category === selectedCategory;
      
      const matchesArchived = showArchived ? doc.status === 'archived' : doc.status === 'active';
      
      return matchesSearch && matchesCategory && matchesArchived;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'size': return parseInt(a.size) - parseInt(b.size);
        case 'category': return a.category.localeCompare(b.category);
        case 'date':
        default: return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const toggleStar = (docId: string) => {
    // In a real app, this would update the document's starred status
    console.log(`Toggling star for document ${docId}`);
  };

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
          {/* Enhanced Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search documents, categories, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="size">Sort by Size</SelectItem>
                    <SelectItem value="category">Sort by Category</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant={showArchived ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => setShowArchived(!showArchived)}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {showArchived ? 'Show Active' : 'Show Archived'}
                </Button>
                
                <div className="text-sm text-slate-500">
                  {filteredDocuments.length} of {documents.length} documents
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Document List */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                {showArchived ? 'Archived Documents' : 'Active Documents'}
                <Badge variant="secondary">{filteredDocuments.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                {filteredDocuments.map((doc, index) => {
                  const IconComponent = getTypeIcon(doc.type);
                  
                  if (viewMode === 'grid') {
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <IconComponent className="w-6 h-6 text-slate-600" />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStar(doc.id)}
                              className="p-1"
                            >
                              <Star className={`w-4 h-4 ${doc.starred ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
                            </Button>
                          </div>
                          
                          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{doc.name}</h3>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                              <Badge className={getTypeColor(doc.type)} variant="secondary">
                                {doc.category}
                              </Badge>
                              <Badge className={getConfidentialityColor(doc.confidentiality)} variant="outline">
                                {doc.confidentiality}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-slate-500">
                              <div>{doc.size} • v{doc.version}</div>
                              <div>{doc.date}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <DocumentViewer document={doc} />
                            <Button variant="ghost" size="sm">Download</Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }

                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <IconComponent className="w-6 h-6 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                            {doc.starred && (
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                            <span>{doc.size}</span>
                            <span>v{doc.version}</span>
                            <span>{doc.date}</span>
                            <Badge className={getTypeColor(doc.type)} variant="secondary">
                              {doc.category}
                            </Badge>
                            <Badge className={getConfidentialityColor(doc.confidentiality)} variant="outline">
                              {doc.confidentiality}
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

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-slate-900">{documents.filter(d => d.status === 'active').length}</div>
                <div className="text-slate-600">Active Documents</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-slate-900">{documents.filter(d => d.status === 'archived').length}</div>
                <div className="text-slate-600">Archived</div>
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
                <div className="text-2xl font-bold text-slate-900">{new Set(documents.map(d => d.category)).size}</div>
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
