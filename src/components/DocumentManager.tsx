
import React, { useState } from 'react';
import { Upload, File, Search, Book, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const DocumentManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    { name: "Employment Agreement Template", type: "contract", size: "245 KB", date: "2024-05-15", category: "Employment Law" },
    { name: "NDA Standard Form", type: "agreement", size: "156 KB", date: "2024-05-14", category: "Contracts" },
    { name: "Intellectual Property Policy", type: "policy", size: "387 KB", date: "2024-05-12", category: "IP Law" },
    { name: "Client Retainer Agreement", type: "contract", size: "298 KB", date: "2024-05-10", category: "Client Relations" }
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

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Document Library</h1>
          <p className="text-slate-600 mt-1">Manage and organize your legal documents</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-12 text-center">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Legal Documents</h3>
          <p className="text-slate-600 mb-6">
            Drag and drop files here, or click to browse. Supports PDF, DOCX, and TXT files.
          </p>
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            Browse Files
          </Button>
        </CardContent>
      </Card>

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
          <CardTitle className="text-xl font-semibold text-slate-900">Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc, index) => {
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
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">Preview</Button>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-slate-900">1,247</div>
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
      </div>
    </div>
  );
};
