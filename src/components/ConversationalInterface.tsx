
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, Brain, DollarSign, Sparkles, Zap
} from 'lucide-react';
import { queryProcessor, QueryContext, ProcessedQuery } from '@/services/QueryProcessor';
import { aiService, AIResponse, AIModel } from '@/services/AIService';
import { enhancedAIService } from '@/services/EnhancedAIService';
import { toast } from 'sonner';
import { MessageDisplay } from './MessageDisplay';
import { QueryInput } from './QueryInput';
import { ConversationStats } from './ConversationStats';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system' | 'suggestion';
  content: string;
  timestamp: Date;
  processedQuery?: ProcessedQuery;
  aiResponse?: AIResponse;
  suggestions?: Array<{ query: string; reasoning: string; }>;
  metadata?: {
    model: string;
    processingTime: number;
    cost: number;
    complexity: string;
    enhanced?: boolean;
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
  const [useEnhancedAI, setUseEnhancedAI] = useState(true);
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
      let enhancedQuery = inputValue;
      
      // Use enhanced AI if enabled
      if (useEnhancedAI) {
        const enhancement = await enhancedAIService.enhanceQuery(inputValue);
        if (enhancement.improvements.length > 0) {
          enhancedQuery = enhancement.enhancedQuery;
          
          const enhancementMessage: Message = {
            id: (Date.now() + 0.3).toString(),
            type: 'system',
            content: `Query enhanced: ${enhancement.improvements.join(', ')}`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, enhancementMessage]);
        }
      }

      // Get query suggestions first
      const suggestions = await queryProcessor.suggestQueryImprovements(enhancedQuery);
      
      if (suggestions.suggestions.length > 0) {
        const suggestionMessage: Message = {
          id: (Date.now() + 0.5).toString(),
          type: 'suggestion',
          content: 'AI-generated query suggestions:',
          timestamp: new Date(),
          suggestions: suggestions.suggestions.map(s => ({ query: s, reasoning: 'Optimized for better results' }))
        };
        setMessages(prev => [...prev, suggestionMessage]);
      }

      // Generate smart search suggestions if using enhanced AI
      if (useEnhancedAI) {
        const smartSuggestions = await enhancedAIService.generateSearchSuggestions(enhancedQuery);
        if (smartSuggestions.length > 0) {
          const smartSuggestionMessage: Message = {
            id: (Date.now() + 0.7).toString(),
            type: 'suggestion',
            content: 'Smart search suggestions:',
            timestamp: new Date(),
            suggestions: smartSuggestions.map(s => ({ query: s.query, reasoning: s.reasoning }))
          };
          setMessages(prev => [...prev, smartSuggestionMessage]);
        }
      }

      // Process the query with enhanced AI capabilities
      const { processed, response } = await queryProcessor.processQuery(enhancedQuery, queryContext);
      
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
          complexity: processed.estimatedComplexity,
          enhanced: useEnhancedAI
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      setTotalCost(prev => prev + response.metadata.cost);

      // Get research recommendations if using enhanced AI
      if (useEnhancedAI && analysisDepth !== 'quick') {
        try {
          const recommendations = await enhancedAIService.getResearchRecommendations(enhancedQuery);
          if (recommendations.recommendations.length > 0) {
            const recMessage: Message = {
              id: (Date.now() + 1.5).toString(),
              type: 'system',
              content: `Research recommendations: ${recommendations.recommendations.map(r => r.title).join(', ')}. Suggested next steps: ${recommendations.nextSteps.slice(0, 2).join(', ')}.`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, recMessage]);
          }
        } catch (error) {
          console.error('Error getting recommendations:', error);
        }
      }

      // Update conversation context
      setQueryContext(prev => ({
        ...prev,
        conversationHistory: [
          ...prev.conversationHistory.slice(-4), // Keep last 5 interactions
          {
            query: enhancedQuery,
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
            {useEnhancedAI && <Sparkles className="w-5 h-5 text-purple-500" />}
          </h2>
          <p className="text-slate-600">
            {useEnhancedAI ? 'Intelligent legal research with enhanced ML analysis' : 'Standard AI legal research assistance'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={useEnhancedAI ? "default" : "outline"}
            size="sm"
            onClick={() => setUseEnhancedAI(!useEnhancedAI)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Enhanced AI
          </Button>
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
                    <h3 className="text-lg font-medium mb-2">
                      {useEnhancedAI ? 'Enhanced AI Legal Research' : 'AI Legal Research'}
                    </h3>
                    <p className="text-sm">
                      {useEnhancedAI 
                        ? 'Ask complex legal questions and get intelligent, ML-enhanced analysis with predictions and smart recommendations.'
                        : 'Ask legal questions and get AI-powered analysis with citations and recommendations.'
                      }
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-4 max-w-md mx-auto">
                      {[
                        'Predict contract dispute outcome',
                        'Analyze employment law precedents',
                        'Classify legal document types',
                        'Smart search optimization'
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
                        <span className="text-sm text-slate-500 ml-2">
                          {useEnhancedAI ? 'Processing with enhanced AI...' : 'Processing with AI...'}
                        </span>
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
