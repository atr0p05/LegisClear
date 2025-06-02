
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, RefreshCw, Scale, FileType, Gavel, Building } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: 'case' | 'statute' | 'contract' | 'regulation' | 'treatise' | 'other';
  category?: string;
  uploadDate: Date;
  size: number;
  ocrConfidence?: number;
  isActive: boolean;
}

interface DocumentContextManagerProps {
  onActiveDocumentsChange: (activeDocumentIds: string[]) => void;
  className?: string;
}

export const DocumentContextManager: React.FC<DocumentContextManagerProps> = ({
  onActiveDocumentsChange,
  className = ""
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock documents - in real implementation, this would come from DocumentManager
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: 'doc-1',
        name: 'Johnson v. State Corp (2019).pdf',
        type: 'case',
        category: 'Contract Law',
        uploadDate: new Date('2024-01-15'),
        size: 2.4,
        ocrConfidence: 95,
        isActive: true
      },
      {
        id: 'doc-2',
        name: 'Commercial Code Section 12-304.pdf',
        type: 'statute',
        category: 'Commercial Law',
        uploadDate: new Date('2024-01-14'),
        size: 1.8,
        ocrConfidence: 88,
        isActive: true
      },
      {
        id: 'doc-3',
        name: 'Employment Agreement Template.docx',
        type: 'contract',
        category: 'Employment Law',
        uploadDate: new Date('2024-01-13'),
        size: 0.5,
        isActive: false
      },
      {
        id: 'doc-4',
        name: 'Federal Regulations 45 CFR 164.pdf',
        type: 'regulation',
        category: 'Healthcare Law',
        uploadDate: new Date('2024-01-12'),
        size: 5.2,
        ocrConfidence: 72,
        isActive: false
      },
      {
        id: 'doc-5',
        name: 'Intellectual Property Treatise Ch 7.pdf',
        type: 'treatise',
        category: 'IP Law',
        uploadDate: new Date('2024-01-11'),
        size: 3.1,
        ocrConfidence: 92,
        isActive: true
      }
    ];
    
    setDocuments(mockDocuments);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const activeDocuments = documents.filter(doc => doc.isActive);

  const handleDocumentToggle = (documentId: string, isChecked: boolean) => {
    const updatedDocuments = documents.map(doc =>
      doc.id === documentId ? { ...doc, isActive: isChecked } : doc
    );
    
    setDocuments(updatedDocuments);
    
    const activeIds = updatedDocuments.filter(doc => doc.isActive).map(doc => doc.id);
    onActiveDocumentsChange(activeIds);
    
    toast.success(
      isChecked 
        ? 'Document added to active context' 
        : 'Document removed from active context'
    );
  };

  const handleSelectAll = () => {
    const allSelected = filteredDocuments.every(doc => doc.isActive);
    const updatedDocuments = documents.map(doc => {
      const isInFiltered = filteredDocuments.find(fd => fd.id === doc.id);
      return isInFiltered ? { ...doc, isActive: !allSelected } : doc;
    });
    
    setDocuments(updatedDocuments);
    
    const activeIds = updatedDocuments.filter(doc => doc.isActive).map(doc => doc.id);
    onActiveDocumentsChange(activeIds);
    
    toast.success(allSelected ? 'All documents deselected' : 'All filtered documents selected');
  };

  const handleClearAll = () => {
    const updatedDocuments = documents.map(doc => ({ ...doc, isActive: false }));
    setDocuments(updatedDocuments);
    onActiveDocumentsChange([]);
    toast.success('All documents removed from active context');
  };

  const refreshDocuments = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Document list refreshed');
  };

  const getTypeIcon = (type: Document['type']) => {
    const icons = {
      case: <Gavel className="w-4 h-4" />,
      statute: <Scale className="w-4 h-4" />,
      contract: <FileType className="w-4 h-4" />,
      regulation: <Building className="w-4 h-4" />,
      treatise: <FileText className="w-4 h-4" />,
      other: <FileText className="w-4 h-4" />
    };
    return icons[type] || icons.other;
  };

  const getTypeColor = (type: Document['type']) => {
    const colors = {
      case: 'bg-blue-100 text-blue-800 border-blue-200',
      statute: 'bg-green-100 text-green-800 border-green-200',
      contract: 'bg-purple-100 text-purple-800 border-purple-200',
      regulation: 'bg-orange-100 text-orange-800 border-orange-200',
      treatise: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors.other;
  };

  const getOCRQualityColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 text-gray-600';
    if (confidence >= 90) return 'bg-green-100 text-green-700';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <Card className={`w-80 h-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5" />
          Active RAG Context
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>{activeDocuments.length} of {documents.length} documents active</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshDocuments}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="case">Cases</SelectItem>
              <SelectItem value="statute">Statutes</SelectItem>
              <SelectItem value="contract">Contracts</SelectItem>
              <SelectItem value="regulation">Regulations</SelectItem>
              <SelectItem value="treatise">Treatises</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="flex-1"
          >
            {filteredDocuments.every(doc => doc.isActive) ? 'Deselect All' : 'Select All'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="flex-1"
          >
            Clear All
          </Button>
        </div>

        {/* Active Documents Summary */}
        {activeDocuments.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 text-sm mb-2">
              Currently Active ({activeDocuments.length})
            </h4>
            <div className="space-y-1">
              {activeDocuments.slice(0, 3).map(doc => (
                <div key={doc.id} className="text-xs text-blue-700 truncate flex items-center gap-1">
                  {getTypeIcon(doc.type)}
                  {doc.name}
                </div>
              ))}
              {activeDocuments.length > 3 && (
                <div className="text-xs text-blue-600">
                  +{activeDocuments.length - 3} more documents
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Document List */}
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {filteredDocuments.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No documents found</p>
                <p className="text-sm">Try adjusting your search or filter</p>
              </div>
            ) : (
              filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className={`p-3 border rounded-lg transition-all duration-200 ${
                    document.isActive 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={document.isActive}
                      onCheckedChange={(checked) =>
                        handleDocumentToggle(document.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(document.type)}
                        <span className="font-medium text-sm truncate">
                          {document.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs mb-2 flex-wrap">
                        <Badge className={`text-xs border ${getTypeColor(document.type)}`}>
                          {document.type}
                        </Badge>
                        <span className="text-slate-500">{document.size.toFixed(1)} MB</span>
                        {document.ocrConfidence && (
                          <Badge className={`text-xs ${getOCRQualityColor(document.ocrConfidence)}`}>
                            OCR: {document.ocrConfidence}%
                          </Badge>
                        )}
                      </div>
                      
                      {document.category && (
                        <p className="text-xs text-slate-600 truncate">
                          {document.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
