
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types/message';
import { MessageDisplay } from '@/components/MessageDisplay';
import { ConversationStats } from '@/components/ConversationStats';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { useConversation } from '@/hooks/useConversation';
import { aiService } from '@/services/AIService';

export const ConversationalInterface: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [queryType, setQueryType] = useState('research');
  
  const {
    messages,
    isProcessing,
    totalCost,
    messagesEndRef,
    processMessage,
    clearConversation,
    scrollToBottom,
    addMessage
  } = useConversation();

  const availableModels = aiService.getAvailableModels();

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
    addMessage(welcomeMessage);
  }, [addMessage]);

  const handleSuggestionClick = async (suggestion: string) => {
    await processMessage(suggestion, selectedModel);
  };

  const handleSendMessage = async (text: string, model: string, type: string) => {
    setSelectedModel(model);
    setQueryType(type);
    await processMessage(text, model);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <ChatHeader
        selectedModel={selectedModel}
        queryType={queryType}
        showStats={showStats}
        onToggleStats={() => setShowStats(!showStats)}
        onClearConversation={clearConversation}
      />

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
              <TypingIndicator isVisible={isProcessing} />
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
          />
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
