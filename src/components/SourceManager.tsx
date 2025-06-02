
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, BookOpen, ExternalLink, Edit, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Source {
  id: string;
  title: string;
  type: 'case' | 'statute' | 'regulation' | 'treatise' | 'article' | 'other';
  citation: string;
  description?: string;
  url?: string;
  relevance: number;
  dateAdded: string;
  lastUsed?: string;
  tags: string[];
  notes?: string;
  jurisdiction?: string;
  court?: string;
  year?: number;
}

export const SourceManager: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([
    {
      id: '1',
      title: 'Restatement (Second) of Contracts § 208',
      type: 'statute',
      citation: 'Rest. 2d Contracts § 208',
      description: 'Unconscionable Contract or Term',
      relevance: 0.95,
      dateAdded: '2024-05-15',
      lastUsed: '2024-05-20',
      tags: ['contracts', 'unconscionability'],
      jurisdiction: 'Federal',
      year: 1981
    },
    {
      id: '2',
      title: 'Williams v. Walker-Thomas Furniture Co.',
      type: 'case',
      citation: '350 F.2d 445 (D.C. Cir. 1965)',
      description: 'Landmark case on unconscionable contracts',
      relevance: 0.82,
      dateAdded: '2024-05-14',
      tags: ['contracts', 'unconscionability', 'consumer protection'],
      jurisdiction: 'D.C. Circuit',
      court: 'Court of Appeals',
      year: 1965
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [newSource, setNewSource] = useState<Partial<Source>>({
    type: 'case',
    tags: []
  });

  const sourceTypes = [
    { value: 'case', label: 'Case Law' },
    { value: 'statute', label: 'Statute' },
    { value: 'regulation', label: 'Regulation' },
    { value: 'treatise', label: 'Treatise' },
    { value: 'article', label: 'Article' },
    { value: 'other', label: 'Other' }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      case: 'bg-blue-100 text-blue-800',
      statute: 'bg-green-100 text-green-800',
      regulation: 'bg-orange-100 text-orange-800',
      treatise: 'bg-purple-100 text-purple-800',
      article: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const filteredSources = sources.filter(source => {
    const matchesSearch = source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.citation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || source.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddSource = () => {
    if (!newSource.title || !newSource.citation) {
      toast.error('Title and citation are required');
      return;
    }

    const source: Source = {
      id: Math.random().toString(36).substring(7),
      title: newSource.title,
      type: newSource.type as Source['type'],
      citation: newSource.citation,
      description: newSource.description,
      url: newSource.url,
      relevance: 1.0,
      dateAdded: new Date().toISOString().split('T')[0],
      tags: newSource.tags || [],
      notes: newSource.notes,
      jurisdiction: newSource.jurisdiction,
      court: newSource.court,
      year: newSource.year
    };

    setSources(prev => [...prev, source]);
    setNewSource({ type: 'case', tags: [] });
    toast.success('Source added successfully');
  };

  const handleDeleteSource = (id: string) => {
    setSources(prev => prev.filter(source => source.id !== id));
    toast.success('Source deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Source Library
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Source
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Source</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newSource.title || ''}
                        onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter source title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={newSource.type} onValueChange={(value) => setNewSource(prev => ({ ...prev, type: value as Source['type'] }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="citation">Citation *</Label>
                    <Input
                      id="citation"
                      value={newSource.citation || ''}
                      onChange={(e) => setNewSource(prev => ({ ...prev, citation: e.target.value }))}
                      placeholder="Enter citation"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newSource.description || ''}
                      onChange={(e) => setNewSource(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the source"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jurisdiction">Jurisdiction</Label>
                      <Input
                        id="jurisdiction"
                        value={newSource.jurisdiction || ''}
                        onChange={(e) => setNewSource(prev => ({ ...prev, jurisdiction: e.target.value }))}
                        placeholder="e.g., Federal, State, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newSource.year || ''}
                        onChange={(e) => setNewSource(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        placeholder="Publication year"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={newSource.url || ''}
                      onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="Link to source (optional)"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                    <Button onClick={handleAddSource}>Add Source</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {sourceTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sources List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-6 space-y-4">
              {filteredSources.map((source) => (
                <div key={source.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{source.title}</h3>
                        <Badge className={getTypeColor(source.type)}>
                          {source.type}
                        </Badge>
                        <Badge variant="outline">
                          {Math.round(source.relevance * 100)}% relevance
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-2">{source.citation}</p>
                      
                      {source.description && (
                        <p className="text-sm text-slate-700 mb-2">{source.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Added: {source.dateAdded}</span>
                        {source.lastUsed && <span>Last used: {source.lastUsed}</span>}
                        {source.jurisdiction && <span>Jurisdiction: {source.jurisdiction}</span>}
                        {source.year && <span>Year: {source.year}</span>}
                      </div>
                      
                      {source.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {source.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {source.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteSource(source.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
