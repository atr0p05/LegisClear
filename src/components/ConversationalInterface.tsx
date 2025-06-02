
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, Brain, DollarSign
} from 'lucide-react';
import { queryProcessor, QueryContext, ProcessedQuery } from '@/services/QueryProcessor';
import { aiService, AIResponse, AIModel } from '@/services/AIService';
import { toast } from 'sonner';
import { MessageDisplay } from './MessageDisplay';
import { QueryInput } from './QueryInput';
import { ConversationStats } from './ConversationStats';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  processedQuery?: ProcessedQuery;
  aiResponse?: AIResponse;
  metadata?: {
    model: string;
    processingTime: number;
    cost: number;
    complexity: string;
  };
}

interface ConversationalInterfaceProps {
  onQuerySubmit?: (query: string, context?: string[]) => Promise<any>;
}

export const ConversationalInterface: React.FC<ConversationalInterfaceProps> = ({ onQuerySubmit }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [analysisDepth, setAnalysisDepth] = useState<'quick' | 'standard' | 'comprehensive'>('standard');
  const [queryContext, setQueryContext] = useState<QueryContext>({
    conversationHistory: [],
    documentContext: [],
    userPreferences: {
      analysisDepth: 'standard'
    }
  });
  const [totalCost, setTotalCost] = useState(0);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setAvailableModels(aiService.getAvailableModels());
  }, []);

  useEffect(() => {
    setQueryContext(prev => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        analysisDepth,
        preferredModel: selectedModel === 'auto' ? undefined : selectedModel
      }
    }));
  }, [analysisDepth, selectedModel]);

  const handleQuerySubmit = async (inputValue: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get query suggestions first
      const suggestions = await queryProcessor.suggestQueryImprovements(inputValue);
      
      if (suggestions.suggestions.length > 0) {
        const suggestionMessage: Message = {
          id: (Date.now() + 0.5).toString(),
          type: 'system',
          content: `Query suggestions: ${suggestions.suggestions.join('; ')}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, suggestionMessage]);
      }

      // Process the query with enhanced AI capabilities
      const { processed, response } = await queryProcessor.processQuery(inputValue, queryContext);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.answer,
        timestamp: new Date(),
        processedQuery: processed,
        aiResponse: response,
        metadata: {
          model: response.metadata.model,
          processingTime: response.metadata.processingTime,
          cost: response.metadata.cost,
          complexity: processed.estimatedComplexity
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      setTotalCost(prev => prev + response.metadata.cost);

      // Update conversation context
      setQueryContext(prev => ({
        ...prev,
        conversationHistory: [
          ...prev.conversationHistory.slice(-4), // Keep last 5 interactions
          {
            query: inputValue,
            response: response.answer,
            timestamp: new Date()
          }
        ]
      }));

    } catch (error) {
      console.error('Query processing error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your query.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to process query');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleQuerySubmit(suggestion);
  };

  const clearConversation = () => {
    setMessages([]);
    setQueryContext({
      conversationHistory: [],
      documentContext: [],
      userPreferences: {
        analysisDepth
      }
    });
    setTotalCost(0);
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Advanced Legal AI Assistant
          </h2>
          <p className="text-slate-600">Intelligent legal research with multi-model AI analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            ${totalCost.toFixed(4)}
          </Badge>
          {messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearConversation}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-4">
          <Card className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-slate-500 py-8">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-medium mb-2">Advanced AI Legal Research</h3>
                    <p className="text-sm">Ask complex legal questions and get intelligent, multi-source analysis with citations and recommendations.</p>
                    <div className="grid grid-cols-2 gap-2 mt-4 max-w-md mx-auto">
                      {[
                        'Analyze contract liability clauses',
                        'Research precedents for employment law',
                        'Compare jurisdictional variations',
                        'Evaluate regulatory compliance'
                      ].map((example) => (
                        <Button
                          key={example}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleQuerySubmit(example)}
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {messages.map((message) => (
                  <MessageDisplay
                    key={message.id}
                    message={message}
                    onSuggestionClick={handleSuggestionClick}
                  />
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Brain className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-sm text-slate-500 ml-2">Processing with advanced AI...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <CardContent className="border-t p-4">
              <QueryInput
                onSubmit={handleQuerySubmit}
                isLoading={isLoading}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                analysisDepth={analysisDepth}
                onAnalysisDepthChange={setAnalysisDepth}
                availableModels={availableModels}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <ConversationStats
            availableModels={availableModels}
            messages={messages}
            totalCost={totalCost}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
