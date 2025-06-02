
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, Calendar, User, MapPin, ExternalLink, 
  Brain, Network, Clock, Star, Share, Download
} from 'lucide-react';
import { SearchResult } from '@/services/SearchService';
import { searchService } from '@/services/SearchService';
import { toast } from 'sonner';

interface SearchResultsProps {
  results: SearchResult[];
  totalCount: number;
  semanticResults?: SearchResult[];
  isLoading?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  totalCount, 
  semanticResults,
  isLoading 
}) => {
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [relatedDocuments, setRelatedDocuments] = useState<SearchResult[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [starredResults, setStarredResults] = useState<Set<string>>(new Set());

  const handleResultClick = async (result: SearchResult) => {
    setSelectedResult(result);
    
    // Load related documents
    try {
      const related = await searchService.findRelatedDocuments(result.id);
      setRelatedDocuments(related);
    } catch (error) {
      console.error('Error loading related documents:', error);
    }
  };

  const toggleStar = (resultId: string) => {
    setStarredResults(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resultId)) {
        newSet.delete(resultId);
        toast.success('Removed from starred results');
      } else {
        newSet.add(resultId);
        toast.success('Added to starred results');
      }
      return newSet;
    });
  };

  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'confidential': return 'bg-yellow-100 text-yellow-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRelevanceScore = (score: number) => {
    return `${Math.round(score * 100)}%`;
  };

  const ResultCard = ({ result, isSemanticResult = false }: { result: SearchResult; isSemanticResult?: boolean }) => (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleResultClick(result)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 line-clamp-2 hover:text-blue-600">
                {result.title}
              </h3>
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                {result.snippet}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(result.id);
                }}
              >
                <Star className={`w-4 h-4 ${starredResults.has(result.id) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
              </Button>
              <Badge variant="outline" className="text-xs">
                {isSemanticResult ? 
                  `${formatRelevanceScore(result.semanticScore || 0)} semantic` :
                  `${formatRelevanceScore(result.relevanceScore)} match`
                }
              </Badge>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {result.documentType}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {result.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {result.date}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {result.jurisdiction}
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-blue-100 text-blue-800">
              {result.practiceArea}
            </Badge>
            <Badge className={getConfidentialityColor(result.confidentiality)} variant="outline">
              {result.confidentiality}
            </Badge>
            {result.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {result.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{result.tags.length - 3} more
              </Badge>
            )}
          </div>

          {/* Highlights */}
          {result.highlights.length > 0 && (
            <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
              <p className="text-sm">
                <strong>Highlights:</strong> {result.highlights.join(', ')}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Document
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {result.relatedDocuments && result.relatedDocuments.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                <Network className="w-3 h-3 mr-1" />
                {result.relatedDocuments.length} related
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded w-20"></div>
                  <div className="h-6 bg-slate-200 rounded w-24"></div>
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0 && (!semanticResults || semanticResults.length === 0)) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium mb-2">No Results Found</h3>
          <p className="text-slate-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Search Results</h2>
          <p className="text-slate-600">
            Found {totalCount} documents
            {semanticResults && semanticResults.length > 0 && 
              ` • ${semanticResults.length} semantic matches`
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
        </div>
      </div>

      <Tabs defaultValue="standard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="standard" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Standard Results ({results.length})
          </TabsTrigger>
          {semanticResults && semanticResults.length > 0 && (
            <TabsTrigger value="semantic" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Semantic Results ({semanticResults.length})
            </TabsTrigger>
          )}
          {selectedResult && (
            <TabsTrigger value="details" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Document Details
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="standard">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
            {results.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        </TabsContent>

        {semanticResults && semanticResults.length > 0 && (
          <TabsContent value="semantic">
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Semantic Search Results
                </h3>
                <p className="text-sm text-purple-700">
                  These results were found using AI-powered semantic similarity, 
                  showing documents with related concepts even if they don't contain exact keyword matches.
                </p>
              </div>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
                {semanticResults.map((result) => (
                  <ResultCard key={result.id} result={result} isSemanticResult={true} />
                ))}
              </div>
            </div>
          </TabsContent>
        )}

        {selectedResult && (
          <TabsContent value="details">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {selectedResult.title}
                      <div className="flex items-center gap-2">
                        <Badge className={getConfidentialityColor(selectedResult.confidentiality)}>
                          {selectedResult.confidentiality}
                        </Badge>
                        <Badge variant="outline">
                          {formatRelevanceScore(selectedResult.relevanceScore)} match
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose max-w-none">
                      <p>{selectedResult.content}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedResult.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Practice Area:</strong> {selectedResult.practiceArea}
                      </div>
                      <div>
                        <strong>Jurisdiction:</strong> {selectedResult.jurisdiction}
                      </div>
                      <div>
                        <strong>Author:</strong> {selectedResult.author}
                      </div>
                      <div>
                        <strong>Date:</strong> {selectedResult.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {relatedDocuments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Network className="w-5 h-5" />
                        Related Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {relatedDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-3 border rounded hover:bg-slate-50 cursor-pointer"
                              onClick={() => handleResultClick(doc)}
                            >
                              <h4 className="font-medium text-sm line-clamp-2">
                                {doc.title}
                              </h4>
                              <p className="text-xs text-slate-600 mt-1">
                                {doc.practiceArea} • {doc.date}
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Document
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Share className="w-4 h-4 mr-2" />
                      Share Document
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => toggleStar(selectedResult.id)}
                    >
                      <Star className={`w-4 h-4 mr-2 ${starredResults.has(selectedResult.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      {starredResults.has(selectedResult.id) ? 'Remove Star' : 'Add to Starred'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
