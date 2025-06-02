
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, Mic, MicOff, Settings, RefreshCw, Sparkles,
  MessageSquare, Brain, Clock, TrendingUp
} from 'lucide-react';
import { Message } from '@/types/message';
import { MessageDisplay } from '@/components/MessageDisplay';
import { ConversationStats } from '@/components/ConversationStats';
import { aiService, AIRequest } from '@/services/AIService';
import { enhancedAIService } from '@/services/EnhancedAIService';
import { queryProcessor, QueryContext } from '@/services/QueryProcessor';
import { useToast } from '@/hooks/use-toast';

export const ConversationalInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [queryType, setQueryType] = useState<'research' | 'analysis' | 'contract' | 'citation' | 'summary'>('research');
  const [showStats, setShowStats] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const availableModels = aiService.getAvailableModels();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome-1',
      type: 'system',
      content: 'Welcome to the AI-Enhanced Legal Research Platform! I can help you with legal research, document analysis, contract review, and more. What would you like to explore today?',
      timestamp: new Date(),
      metadata: {
        model: 'system',
        processingTime: 0,
        tokensUsed: 0,
        cost: 0
      }
    };
    setMessages([welcomeMessage]);
  }, []);

  const buildQueryContext = (): QueryContext => {
    const conversationHistory = messages
      .filter(m => m.type === 'user' || m.type === 'ai')
      .slice(-5)
      .map(m => ({
        query: m.content,
        response: m.aiResponse?.answer || m.content,
        timestamp: m.timestamp
      }));

    return {
      conversationHistory,
      documentContext: [],
      userPreferences: {
        preferredModel: selectedModel,
        analysisDepth: 'standard'
      }
    };
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setInputText(suggestion);
    await handleSend(suggestion);
  };

  const generateIntelligentSuggestions = async (userQuery: string) => {
    try {
      const suggestions = await enhancedAIService.generateSearchSuggestions(
        userQuery,
        messages.slice(-3).map(m => m.content)
      );

      if (suggestions.length > 0) {
        const suggestionMessage: Message = {
          id: `suggestion-${Date.now()}`,
          type: 'suggestion',
          content: 'Here are some intelligent suggestions to enhance your research:',
          timestamp: new Date(),
          suggestions: suggestions,
          metadata: {
            model: 'enhancement-engine',
            processingTime: 0,
            tokensUsed: 0,
            cost: 0
          }
        };

        setMessages(prev => [...prev, suggestionMessage]);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isProcessing) return;

    setIsProcessing(true);
    setInputText('');

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: messageText,
      timestamp: new Date(),
      metadata: {
        model: 'user',
        processingTime: 0,
        tokensUsed: 0,
        cost: 0
      }
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Process query with enhanced AI
      const context = buildQueryContext();
      const { processed, response } = await queryProcessor.processQuery(messageText, context);

      // Create AI response message
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response.answer,
        timestamp: new Date(),
        aiResponse: {
          answer: response.answer,
          confidence: response.confidence,
          sources: response.sources,
          analysis: response.analysis
        },
        processedQuery: processed,
        metadata: {
          model: response.metadata.model,
          processingTime: response.metadata.processingTime,
          tokensUsed: response.metadata.tokensUsed,
          cost: response.metadata.cost,
          complexity: processed.estimatedComplexity
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      setTotalCost(prev => prev + response.metadata.cost);

      // Generate intelligent suggestions after a brief delay
      setTimeout(() => {
        generateIntelligentSuggestions(messageText);
      }, 1000);

    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your message. Please try again.',
        variant: 'destructive'
      });

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'system',
        content: 'I apologize, but I encountered an error processing your request. Please try rephrasing your question or contact support if the issue persists.',
        timestamp: new Date(),
        metadata: {
          model: 'system',
          processingTime: 0,
          tokensUsed: 0,
          cost: 0
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setTotalCost(0);
    toast({
      title: 'Conversation Cleared',
      description: 'Your conversation history has been cleared.'
    });
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Voice input implementation would go here
    toast({
      title: 'Voice Input',
      description: 'Voice input feature coming soon!'
    });
    setTimeout(() => setIsListening(false), 3000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-slate-900">AI Legal Assistant</h1>
              <p className="text-sm text-slate-600">Enhanced conversational research platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              {selectedModel}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {queryType}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearConversation}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <MessageDisplay
                  key={message.id}
                  message={message}
                  onSuggestionClick={handleSuggestionClick}
                />
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200" />
                      <span className="text-sm text-slate-600 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="bg-white border-t border-slate-200 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="text-xs border border-slate-200 rounded px-2 py-1"
                >
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value as any)}
                  className="text-xs border border-slate-200 rounded px-2 py-1"
                >
                  <option value="research">Research</option>
                  <option value="analysis">Analysis</option>
                  <option value="contract">Contract</option>
                  <option value="citation">Citation</option>
                  <option value="summary">Summary</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about legal research, document analysis, or contract review..."
                    className="min-h-[80px] resize-none"
                    disabled={isProcessing}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleSend()}
                    disabled={!inputText.trim() || isProcessing}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startVoiceInput}
                    disabled={isProcessing}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        {showStats && (
          <div className="w-80 bg-white border-l border-slate-200 p-4 overflow-auto">
            <ConversationStats
              availableModels={availableModels}
              messages={messages}
              totalCost={totalCost}
            />
          </div>
        )}
      </div>
    </div>
  );
};
