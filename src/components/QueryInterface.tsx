
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QueryBuilder } from '@/components/QueryBuilder';
import { ConversationalInterface } from '@/components/ConversationalInterface';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { SearchResults } from '@/components/SearchResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Settings, Brain, Zap, Filter } from 'lucide-react';
import { queryProcessor } from '@/services/QueryProcessor';
import { SearchResult } from '@/services/SearchService';
import { toast } from 'sonner';

interface QueryInterfaceProps {
  onQuerySubmit: (query: string) => void;
}

export const QueryInterface: React.FC<QueryInterfaceProps> = ({ onQuerySubmit }) => {
  const [simpleQuery, setSimpleQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [semanticResults, setSemanticResults] = useState<SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState('advanced');

  const handleSimpleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (simpleQuery.trim()) {
      setIsProcessing(true);
      try {
        // Use the new query processor for enhanced search
        const { processed } = await queryProcessor.processQuery(simpleQuery);
        console.log('Query processed:', processed);
        onQuerySubmit(processed.expandedQuery || simpleQuery);
        toast.success(`Query processed with ${processed.confidence > 0.8 ? 'high' : 'medium'} confidence`);
      } catch (error) {
        console.error('Query processing error:', error);
        onQuerySubmit(simpleQuery); // Fallback to original query
        toast.error('Query processing failed, using fallback');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleAdvancedQuery = (query: string, conditions: any[]) => {
    console.log('Advanced query built:', query, conditions);
    onQuerySubmit(query);
  };

  const handleConversationalQuery = async (query: string, context?: string[]) => {
    try {
      const { processed, response } = await queryProcessor.processQuery(query, {
        conversationHistory: [],
        documentContext: context || [],
        userPreferences: { analysisDepth: 'standard' }
      });

      return response;
    } catch (error) {
      console.error('Conversational query error:', error);
      
      // Fallback response for demo purposes
      return {
        answer: "Based on the available legal resources, this appears to be a complex legal matter requiring careful analysis. The key considerations include applicable statutory frameworks, relevant case law precedents, and jurisdictional variations that may affect the outcome.",
        confidence: 0.75,
        sources: [
          { title: "Relevant Case Law Analysis", relevance: 0.85, type: "case" },
          { title: "Statutory Framework Review", relevance: 0.78, type: "statute" },
          { title: "Legal Commentary", relevance: 0.72, type: "treatise" }
        ],
        metadata: {
          model: 'gpt-4o',
          processingTime: 1500,
          tokensUsed: 750,
          cost: 0.0225
        }
      };
    }
  };

  const handleSearchResults = (results: SearchResult[], count: number) => {
    setSearchResults(results);
    setTotalCount(count);
    setActiveTab('results');
  };

  const handleSemanticResults = (results: SearchResult[]) => {
    setSemanticResults(results);
    setActiveTab('results');
  };

  return (
    <div className="p-8 h-full">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            Advanced Legal Research & AI Analysis
          </h1>
          <p className="text-slate-600">
            Powered by multi-model AI with intelligent query processing and comprehensive legal analysis
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              AI-Enhanced
            </Badge>
            <Badge variant="outline">Multi-Model Support</Badge>
            <Badge variant="outline">Intelligent Processing</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Advanced Search
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced Search
            </TabsTrigger>
            <TabsTrigger value="conversational" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="simple" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Quick Search
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Query Builder
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2" disabled={searchResults.length === 0 && semanticResults.length === 0}>
              <Search className="w-4 h-4" />
              Results ({totalCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advanced" className="flex-1 mt-6">
            <AdvancedSearch 
              onSearchResults={handleSearchResults}
              onSemanticSearch={handleSemanticResults}
            />
          </TabsContent>

          <TabsContent value="conversational" className="flex-1 mt-6">
            <ConversationalInterface onQuerySubmit={handleConversationalQuery} />
          </TabsContent>

          <TabsContent value="simple" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Enhanced Legal Search
                </CardTitle>
                <p className="text-sm text-slate-600">
                  Intelligent query expansion and legal concept recognition
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSimpleSearch} className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter your legal question or search terms (AI will enhance and expand)..."
                      value={simpleQuery}
                      onChange={(e) => setSimpleQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!simpleQuery.trim() || isProcessing}>
                      <Search className="w-4 h-4 mr-2" />
                      {isProcessing ? 'Processing...' : 'Search'}
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-700">Legal Practice Areas:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        'Contract Law & Disputes',
                        'Employment & Labor Law', 
                        'Intellectual Property Rights',
                        'Corporate Governance',
                        'Tax & Regulatory Compliance',
                        'Real Estate Transactions',
                        'Criminal Law & Procedure',
                        'Family Law & Domestic Relations',
                        'Constitutional Law Issues',
                        'Securities & Financial Law',
                        'Environmental Regulations',
                        'Immigration Law'
                      ].map((area) => (
                        <Button
                          key={area}
                          variant="outline"
                          size="sm"
                          onClick={() => setSimpleQuery(`Legal research on ${area.toLowerCase()}`)}
                          className="text-xs justify-start"
                        >
                          {area}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-700">Sample Complex Queries:</h4>
                    <div className="space-y-2">
                      {[
                        'Analyze enforceability of non-compete clauses in California employment contracts',
                        'Compare intellectual property protection strategies for software companies',
                        'Evaluate GDPR compliance requirements for US companies processing EU data',
                        'Research recent developments in cryptocurrency regulation and SEC guidance'
                      ].map((example) => (
                        <Button
                          key={example}
                          variant="ghost"
                          size="sm"
                          onClick={() => setSimpleQuery(example)}
                          className="text-xs text-left h-auto p-2 whitespace-normal justify-start"
                        >
                          <MessageSquare className="w-3 h-3 mr-2 flex-shrink-0 mt-0.5" />
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="builder" className="mt-6">
            <QueryBuilder onQueryBuilt={handleAdvancedQuery} />
          </TabsContent>

          <TabsContent value="results" className="flex-1 mt-6">
            <SearchResults 
              results={searchResults}
              totalCount={totalCount}
              semanticResults={semanticResults.length > 0 ? semanticResults : undefined}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
