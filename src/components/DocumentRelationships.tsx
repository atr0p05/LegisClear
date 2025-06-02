
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, FileText, Plus, X, Search, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentRelation {
  id: string;
  documentId: string;
  documentTitle: string;
  relationshipType: 'references' | 'amends' | 'supersedes' | 'supplements' | 'related' | 'contradicts';
  description?: string;
  strength: 'weak' | 'moderate' | 'strong';
  createdAt: string;
}

interface DocumentRelationshipsProps {
  documentId: string;
  documentTitle: string;
}

export const DocumentRelationships: React.FC<DocumentRelationshipsProps> = ({
  documentId,
  documentTitle
}) => {
  const [relationships, setRelationships] = useState<DocumentRelation[]>([
    {
      id: '1',
      documentId: 'doc-2',
      documentTitle: 'Master Service Agreement Template',
      relationshipType: 'references',
      description: 'References standard terms and conditions',
      strength: 'strong',
      createdAt: '2024-05-15'
    },
    {
      id: '2',
      documentId: 'doc-3',
      documentTitle: 'Employee Handbook 2024',
      relationshipType: 'supplements',
      description: 'Provides additional employment policies',
      strength: 'moderate',
      createdAt: '2024-05-10'
    },
    {
      id: '3',
      documentId: 'doc-4',
      documentTitle: 'Old Employment Agreement v1.0',
      relationshipType: 'supersedes',
      description: 'This document replaces the old version',
      strength: 'strong',
      createdAt: '2024-05-01'
    }
  ]);

  const [showAddRelation, setShowAddRelation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [selectedRelationType, setSelectedRelationType] = useState('');
  const [relationDescription, setRelationDescription] = useState('');

  // Mock documents for selection
  const availableDocuments = [
    { id: 'doc-5', title: 'Privacy Policy 2024' },
    { id: 'doc-6', title: 'Terms of Service' },
    { id: 'doc-7', title: 'Client Agreement Template' },
    { id: 'doc-8', title: 'Intellectual Property Assignment' },
    { id: 'doc-9', title: 'Confidentiality Agreement' }
  ];

  const relationshipTypes = [
    { value: 'references', label: 'References', description: 'This document references another' },
    { value: 'amends', label: 'Amends', description: 'This document modifies another' },
    { value: 'supersedes', label: 'Supersedes', description: 'This document replaces another' },
    { value: 'supplements', label: 'Supplements', description: 'This document adds to another' },
    { value: 'related', label: 'Related', description: 'General relationship' },
    { value: 'contradicts', label: 'Contradicts', description: 'This document conflicts with another' }
  ];

  const handleAddRelationship = () => {
    if (!selectedDocument || !selectedRelationType) {
      toast.error('Please select a document and relationship type');
      return;
    }

    const document = availableDocuments.find(d => d.id === selectedDocument);
    if (!document) return;

    const newRelation: DocumentRelation = {
      id: Date.now().toString(),
      documentId: selectedDocument,
      documentTitle: document.title,
      relationshipType: selectedRelationType as DocumentRelation['relationshipType'],
      description: relationDescription,
      strength: 'moderate',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRelationships(prev => [...prev, newRelation]);
    setSelectedDocument('');
    setSelectedRelationType('');
    setRelationDescription('');
    setShowAddRelation(false);
    toast.success('Relationship added successfully');
  };

  const handleRemoveRelationship = (relationId: string) => {
    setRelationships(prev => prev.filter(r => r.id !== relationId));
    toast.success('Relationship removed');
  };

  const getRelationshipColor = (type: DocumentRelation['relationshipType']) => {
    switch (type) {
      case 'references':
        return 'bg-blue-100 text-blue-800';
      case 'amends':
        return 'bg-orange-100 text-orange-800';
      case 'supersedes':
        return 'bg-red-100 text-red-800';
      case 'supplements':
        return 'bg-green-100 text-green-800';
      case 'related':
        return 'bg-purple-100 text-purple-800';
      case 'contradicts':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStrengthColor = (strength: DocumentRelation['strength']) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'weak':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = availableDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Document Relationships
          </CardTitle>
          <Dialog open={showAddRelation} onOpenChange={setShowAddRelation}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Relationship
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Document Relationship</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Search Documents</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search for documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Select Document</label>
                  <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a document" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDocuments.map(doc => (
                        <SelectItem key={doc.id} value={doc.id}>
                          {doc.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Relationship Type</label>
                  <Select value={selectedRelationType} onValueChange={setSelectedRelationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship type" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-slate-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Input
                    placeholder="Describe the relationship..."
                    value={relationDescription}
                    onChange={(e) => setRelationDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddRelation(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRelationship}>
                    Add Relationship
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {relationships.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No relationships found</p>
                <p className="text-sm">Add connections to related documents</p>
              </div>
            ) : (
              relationships.map((relation) => (
                <div key={relation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-slate-900">{documentTitle}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{relation.documentTitle}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getRelationshipColor(relation.relationshipType)}>
                        {relation.relationshipType}
                      </Badge>
                      <Badge variant="outline" className={getStrengthColor(relation.strength)}>
                        {relation.strength}
                      </Badge>
                    </div>
                    
                    {relation.description && (
                      <p className="text-sm text-slate-600">{relation.description}</p>
                    )}
                    
                    <p className="text-xs text-slate-500">Added on {relation.createdAt}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveRelationship(relation.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
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
