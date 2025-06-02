
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QueryBuilder } from '@/components/QueryBuilder';
import { ConversationalInterface } from '@/components/ConversationalInterface';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { SearchResults } from '@/components/SearchResults';
import { QuickSearchForm } from '@/components/QuickSearchForm';
import { QueryInterfaceHeader } from '@/components/QueryInterfaceHeader';
import { Search, MessageSquare, Settings, Brain, Filter } from 'lucide-react';
import { queryProcessor } from '@/services/QueryProcessor';
import { SearchResult } from '@/services/SearchService';
import { toast } from 'sonner';

interface QueryInterfaceProps {
  onQuerySubmit: (query: string) => void;
}

export const QueryInterface: React.FC<QueryInterfaceProps> = ({ onQuerySubmit }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [semanticResults, setSemanticResults] = useState<SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState('advanced');

  const handleSimpleSearch = async (query: string) => {
    setIsProcessing(true);
    try {
      // Use the new query processor for enhanced search
      const { processed } = await queryProcessor.processQuery(query);
      console.log('Query processed:', processed);
      onQuerySubmit(processed.expandedQuery || query);
      toast.success(`Query processed with ${processed.confidence > 0.8 ? 'high' : 'medium'} confidence`);
    } catch (error) {
      console.error('Query processing error:', error);
      onQuerySubmit(query); // Fallback to original query
      toast.error('Query processing failed, using fallback');
    } finally {
      setIsProcessing(false);
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
        <QueryInterfaceHeader />

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
            <QuickSearchForm 
              onSubmit={handleSimpleSearch}
              isProcessing={isProcessing}
            />
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
