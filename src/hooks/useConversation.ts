
import { useState, useRef, useCallback } from 'react';
import { Message } from '@/types/message';
import { aiService } from '@/services/AIService';
import { queryProcessor, QueryContext } from '@/services/QueryProcessor';
import { enhancedAIService } from '@/services/EnhancedAIService';
import { analyticsService } from '@/services/AnalyticsService';
import { cacheService } from '@/services/CacheService';
import { useToast } from '@/hooks/use-toast';

export const useConversation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const buildQueryContext = useCallback((): QueryContext => {
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
        preferredModel: 'gpt-4o',
        analysisDepth: 'standard'
      }
    };
  }, [messages]);

  const processMessage = useCallback(async (text: string, selectedModel: string) => {
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    const startTime = Date.now();

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date(),
      metadata: {
        model: 'user',
        processingTime: 0,
        tokensUsed: 0,
        cost: 0
      }
    };

    addMessage(userMessage);

    try {
      const context = buildQueryContext();
      
      // Check cache first
      const cacheKey = cacheService.generateQueryKey(text, selectedModel, context.conversationHistory.map(h => h.query));
      const cachedResponse = cacheService.get(cacheKey);

      let response;
      let processingTime = 0;

      if (cachedResponse) {
        response = cachedResponse;
        processingTime = Date.now() - startTime;
        
        toast({
          title: 'Cache Hit',
          description: 'Response retrieved from cache for faster performance.',
          duration: 2000
        });
      } else {
        // Process query with enhanced AI
        const { processed, response: aiResponse } = await queryProcessor.processQuery(text, context);
        response = aiResponse;
        processingTime = Date.now() - startTime;
        
        // Cache the response
        cacheService.set(cacheKey, aiResponse, 30 * 60 * 1000); // 30 minutes TTL
      }

      // Record analytics
      analyticsService.recordQuery({
        queryId: `query-${Date.now()}`,
        query: text,
        responseTime: processingTime,
        tokensUsed: response.metadata.tokensUsed,
        cost: response.metadata.cost,
        confidence: response.confidence,
        timestamp: new Date(),
        model: selectedModel,
        queryType: 'research', // This could be determined from context
        complexity: 'medium' // This could be calculated
      });

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
          analysis: response.analysis,
          metadata: response.metadata
        },
        metadata: {
          model: response.metadata.model,
          processingTime: processingTime,
          tokensUsed: response.metadata.tokensUsed,
          cost: response.metadata.cost,
          complexity: 'medium'
        }
      };

      addMessage(aiMessage);
      setTotalCost(prev => prev + response.metadata.cost);

      // Generate intelligent suggestions after a brief delay
      setTimeout(async () => {
        try {
          const suggestions = await enhancedAIService.generateSearchSuggestions(
            text,
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

            addMessage(suggestionMessage);
          }
        } catch (error) {
          console.error('Error generating suggestions:', error);
        }
      }, 1000);

    } catch (error) {
      console.error('Error processing message:', error);
      const processingTime = Date.now() - startTime;
      
      // Record failed query in analytics
      analyticsService.recordQuery({
        queryId: `error-query-${Date.now()}`,
        query: text,
        responseTime: processingTime,
        tokensUsed: 0,
        cost: 0,
        confidence: 0,
        timestamp: new Date(),
        model: selectedModel,
        queryType: 'research',
        complexity: 'medium'
      });

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
          processingTime: processingTime,
          tokensUsed: 0,
          cost: 0
        }
      };

      addMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [messages, isProcessing, buildQueryContext, addMessage, toast]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setTotalCost(0);
    toast({
      title: 'Conversation Cleared',
      description: 'Your conversation history has been cleared.'
    });
  }, [toast]);

  return {
    messages,
    isProcessing,
    totalCost,
    messagesEndRef,
    addMessage,
    processMessage,
    clearConversation,
    scrollToBottom
  };
};
