
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Send, Bot, User, RefreshCw, Settings, Brain, 
  ChevronDown, Lightbulb, AlertCircle, CheckCircle,
  Clock, DollarSign, Zap, Target
} from 'lucide-react';
import { queryProcessor, QueryContext, ProcessedQuery } from '@/services/QueryProcessor';
import { aiService, AIResponse, AIModel } from '@/services/AIService';
import { toast } from 'sonner';

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
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [analysisDepth, setAnalysisDepth] = useState<'quick' | 'standard' | 'comprehensive'>('standard');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Get query suggestions first
      const suggestions = await queryProcessor.suggestQueryImprovements(currentQuery);
      
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
      const { processed, response } = await queryProcessor.processQuery(currentQuery, queryContext);
      
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
            query: currentQuery,
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
    setInputValue(suggestion);
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

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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
                          onClick={() => setInputValue(example)}
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-4xl ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-blue-100' : 
                        message.type === 'system' ? 'bg-orange-100' : 'bg-slate-100'
                      }`}>
                        {message.type === 'user' ? <User className="w-4 h-4" /> : 
                         message.type === 'system' ? <Lightbulb className="w-4 h-4" /> :
                         <Brain className="w-4 h-4" />}
                      </div>
                      
                      <div className={`flex flex-col gap-2 ${
                        message.type === 'user' ? 'items-end' : 'items-start'
                      }`}>
                        <div className={`rounded-lg p-4 ${
                          message.type === 'user' ? 'bg-blue-600 text-white' : 
                          message.type === 'system' ? 'bg-orange-50 border border-orange-200' :
                          'bg-white border border-slate-200'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        
                        {message.type === 'ai' && message.aiResponse && (
                          <div className="flex flex-col gap-3 w-full">
                            {/* AI Response Metadata */}
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {message.metadata?.model}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {message.metadata?.processingTime}ms
                              </Badge>
                              <Badge className={getComplexityColor(message.metadata?.complexity || 'low')}>
                                {message.metadata?.complexity} complexity
                              </Badge>
                              <Badge className={getConfidenceColor(message.aiResponse.confidence)}>
                                {Math.round(message.aiResponse.confidence * 100)}% confidence
                              </Badge>
                            </div>

                            {/* Analysis Section */}
                            {message.aiResponse.analysis && (
                              <Collapsible>
                                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
                                  <Target className="w-4 h-4" />
                                  Detailed Analysis
                                  <ChevronDown className="w-4 h-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <Card className="p-3 mt-2">
                                    {message.aiResponse.analysis.keyPoints && (
                                      <div className="mb-3">
                                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3 text-green-600" />
                                          Key Points:
                                        </h5>
                                        <ul className="text-xs text-slate-600 space-y-1">
                                          {message.aiResponse.analysis.keyPoints.map((point, index) => (
                                            <li key={index} className="flex items-start gap-1">
                                              <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                                              {point}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {message.aiResponse.analysis.risks && (
                                      <div className="mb-3">
                                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3 text-red-600" />
                                          Risks:
                                        </h5>
                                        <ul className="text-xs text-slate-600 space-y-1">
                                          {message.aiResponse.analysis.risks.map((risk, index) => (
                                            <li key={index} className="flex items-start gap-1">
                                              <span className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                              {risk}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {message.aiResponse.analysis.recommendations && (
                                      <div>
                                        <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                                          <Lightbulb className="w-3 h-3 text-blue-600" />
                                          Recommendations:
                                        </h5>
                                        <ul className="text-xs text-slate-600 space-y-1">
                                          {message.aiResponse.analysis.recommendations.map((rec, index) => (
                                            <li key={index} className="flex items-start gap-1">
                                              <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                              {rec}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </Card>
                                </CollapsibleContent>
                              </Collapsible>
                            )}

                            {/* Sources */}
                            {message.aiResponse.sources && message.aiResponse.sources.length > 0 && (
                              <Card className="p-3">
                                <h4 className="text-sm font-medium mb-2">Sources:</h4>
                                <div className="space-y-2">
                                  {message.aiResponse.sources.map((source, index) => (
                                    <div key={index} className="text-xs text-slate-600 flex justify-between items-center">
                                      <span className="flex-1">{source.title}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          {source.type}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {Math.round(source.relevance * 100)}%
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </Card>
                            )}
                            
                            {/* Follow-up Suggestions */}
                            {message.processedQuery?.suggestedFollowUps && (
                              <div className="flex flex-wrap gap-2">
                                {message.processedQuery.suggestedFollowUps.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a complex legal question for AI analysis..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!inputValue.trim() || isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Model: {selectedModel === 'auto' ? 'Auto-select' : selectedModel}</span>
                  <span>Depth: {analysisDepth}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="text-xs"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Settings
                  </Button>
                </div>
                
                {showAdvancedSettings && (
                  <Card className="p-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium">AI Model:</label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto-select optimal model</SelectItem>
                            {availableModels.map(model => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name} (${model.costPerToken * 1000}/1K tokens)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium">Analysis Depth:</label>
                        <Select value={analysisDepth} onValueChange={(value: any) => setAnalysisDepth(value)}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quick">Quick Analysis</SelectItem>
                            <SelectItem value="standard">Standard Analysis</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Available AI Models</h4>
                <div className="space-y-2">
                  {availableModels.map(model => (
                    <div key={model.id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium">{model.name}</h5>
                          <p className="text-sm text-slate-600">Provider: {model.provider}</p>
                        </div>
                        <Badge variant="outline">${model.costPerToken * 1000}/1K tokens</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.map(cap => (
                          <Badge key={cap} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Usage Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-blue-600">{messages.filter(m => m.type === 'ai').length}</div>
                    <div className="text-sm text-slate-600">AI Responses</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-green-600">${totalCost.toFixed(4)}</div>
                    <div className="text-sm text-slate-600">Total Cost</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(messages.filter(m => m.aiResponse).reduce((avg, m) => 
                        avg + (m.aiResponse?.confidence || 0), 0) / Math.max(messages.filter(m => m.aiResponse).length, 1) * 100)}%
                    </div>
                    <div className="text-sm text-slate-600">Avg Confidence</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
