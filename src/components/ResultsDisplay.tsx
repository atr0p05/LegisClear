
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ConfidenceIndicator } from '@/components/ConfidenceIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ExternalLink, ChevronDown, ChevronRight, ThumbsUp, ThumbsDown, Copy, Share } from 'lucide-react';
import { toast } from 'sonner';

interface Source {
  title: string;
  type: 'case' | 'statute' | 'treatise' | 'regulation';
  relevance: number;
  page?: number;
  section?: string;
  snippet?: string;
  url?: string;
}

interface ResultsDisplayProps {
  results: {
    answer: string;
    confidence: number;
    sources: Source[];
    query?: string;
  } | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());
  const [userFeedback, setUserFeedback] = useState<'positive' | 'negative' | null>(null);

  if (!results) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center text-slate-500">
          <p className="text-lg">No results to display</p>
          <p className="text-sm mt-2">Submit a query to see AI-powered legal analysis</p>
        </div>
      </div>
    );
  }

  const toggleSourceExpansion = (index: number) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSources(newExpanded);
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setUserFeedback(type);
    toast.success(`Thank you for your feedback! This helps improve our AI responses.`);
  };

  const copyToClipboard = async () => {
    const text = `${results.answer}\n\nSources:\n${results.sources.map(s => `- ${s.title}`).join('\n')}`;
    await navigator.clipboard.writeText(text);
    toast.success('Response copied to clipboard');
  };

  const getSourceTypeColor = (type: string) => {
    const colors = {
      case: 'bg-blue-100 text-blue-800',
      statute: 'bg-green-100 text-green-800',
      treatise: 'bg-purple-100 text-purple-800',
      regulation: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8 h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Query Display */}
        {results.query && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">Query:</span>
                <span className="italic">"{results.query}"</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Answer */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">AI Analysis</CardTitle>
              <div className="flex items-center gap-2">
                <ConfidenceIndicator 
                  score={results.confidence} 
                  showWarning={results.confidence < 0.7}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">{results.answer}</p>
            </div>
            
            <Separator />
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Was this helpful?</span>
                <Button
                  variant={userFeedback === 'positive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFeedback('positive')}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button
                  variant={userFeedback === 'negative' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFeedback('negative')}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Supporting Sources
              <Badge variant="secondary">{results.sources.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              <div className="space-y-4">
                {results.sources.map((source, index) => (
                  <Collapsible key={index}>
                    <div className="border rounded-lg p-4">
                      <CollapsibleTrigger 
                        className="w-full"
                        onClick={() => toggleSourceExpansion(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-left">
                            {expandedSources.has(index) ? 
                              <ChevronDown className="w-4 h-4 text-slate-400" /> : 
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            }
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{source.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getSourceTypeColor(source.type)}>
                                  {source.type}
                                </Badge>
                                <Badge variant="outline">
                                  {Math.round(source.relevance * 100)}% relevant
                                </Badge>
                                {source.page && (
                                  <span className="text-sm text-slate-500">Page {source.page}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="mt-3 pt-3 border-t">
                          {source.snippet && (
                            <div className="bg-slate-50 p-3 rounded border-l-4 border-blue-400">
                              <p className="text-sm text-slate-700 italic">
                                "{source.snippet}"
                              </p>
                            </div>
                          )}
                          {source.section && (
                            <p className="text-sm text-slate-600 mt-2">
                              <span className="font-medium">Section:</span> {source.section}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              View Full Document
                            </Button>
                            <Button variant="outline" size="sm">
                              Cite in Format
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
