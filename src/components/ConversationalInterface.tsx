
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  confidence?: number;
  sources?: Array<{ title: string; page?: number; relevance: number }>;
  suggestions?: string[];
}

interface ConversationalInterfaceProps {
  onQuerySubmit: (query: string, context?: string[]) => Promise<any>;
}

export const ConversationalInterface: React.FC<ConversationalInterfaceProps> = ({ onQuerySubmit }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
    setInputValue('');
    setIsLoading(true);

    try {
      // Get conversation context from previous messages
      const context = messages
        .filter(msg => msg.type === 'user')
        .map(msg => msg.content)
        .slice(-3); // Last 3 user messages for context

      const response = await onQuerySubmit(inputValue, context);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.answer,
        timestamp: new Date(),
        confidence: response.confidence,
        sources: response.sources,
        suggestions: generateSuggestions(inputValue, response)
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        confidence: 0
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSuggestions = (query: string, response: any): string[] => {
    // Generate contextual follow-up suggestions
    const suggestions = [
      "Can you provide more specific examples?",
      "What are the jurisdictional variations?",
      "Are there any recent developments on this topic?"
    ];
    
    if (response.sources?.length > 0) {
      suggestions.push("Can you analyze the strongest precedent in detail?");
    }
    
    return suggestions.slice(0, 3);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Legal Research Assistant</h2>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearConversation}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Conversation
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium mb-2">Start a Legal Research Conversation</h3>
                <p>Ask questions about legal topics, case law, or upload documents for analysis.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-blue-100' : 'bg-slate-100'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`flex flex-col gap-2 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-lg p-4 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-slate-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    
                    {message.type === 'ai' && (
                      <div className="flex flex-col gap-2 w-full">
                        {message.confidence !== undefined && (
                          <Badge className={`w-fit text-xs ${getConfidenceColor(message.confidence)}`}>
                            Confidence: {Math.round(message.confidence * 100)}%
                          </Badge>
                        )}
                        
                        {message.sources && message.sources.length > 0 && (
                          <Card className="p-3">
                            <h4 className="text-sm font-medium mb-2">Sources:</h4>
                            <div className="space-y-1">
                              {message.sources.map((source, index) => (
                                <div key={index} className="text-xs text-slate-600 flex justify-between">
                                  <span>{source.title}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {Math.round(source.relevance * 100)}% relevant
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </Card>
                        )}
                        
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
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
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-sm text-slate-500 ml-2">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <CardContent className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Ask a legal question or request document analysis..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={!inputValue.trim() || isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
