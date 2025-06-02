
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Message } from '@/types/message';
import { MessageDisplay } from '@/components/MessageDisplay';
import { ConversationStats } from '@/components/ConversationStats';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { ActiveContextManager } from '@/components/ActiveContextManager';
import { useConversation } from '@/hooks/useConversation';
import { aiService } from '@/services/AIService';
import { Settings, X } from 'lucide-react';

export const ConversationalInterface: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [showContextManager, setShowContextManager] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [queryType, setQueryType] = useState('research');
  const [activeDocumentIds, setActiveDocumentIds] = useState<string[]>([]);
  
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
      content: 'Welcome to the AI-Enhanced Legal Research Platform! I can help you with legal research, document analysis, contract review, and more. Use the context manager to select which documents should inform my responses. What would you like to explore today?',
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
    await processMessage(suggestion, selectedModel, activeDocumentIds);
  };

  const handleSendMessage = async (text: string, model: string, type: string) => {
    setSelectedModel(model);
    setQueryType(type);
    await processMessage(text, model, activeDocumentIds);
  };

  const handleActiveDocumentsChange = (documentIds: string[]) => {
    setActiveDocumentIds(documentIds);
    console.log('Active documents updated:', documentIds);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <ChatHeader
        selectedModel={selectedModel}
        queryType={queryType}
        showStats={showStats}
        onToggleStats={() => setShowStats(!showStats)}
        onClearConversation={clearConversation}
        activeDocumentCount={activeDocumentIds.length}
        onToggleContextManager={() => setShowContextManager(!showContextManager)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Context Manager Sidebar */}
        {showContextManager && (
          <div className="w-80 bg-white border-r border-slate-200 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Document Context</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContextManager(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ActiveContextManager
              isOpen={true}
              onActiveDocumentsChange={handleActiveDocumentsChange}
            />
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Context Indicator */}
          {activeDocumentIds.length > 0 && (
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {activeDocumentIds.length} document{activeDocumentIds.length !== 1 ? 's' : ''} active in RAG context
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContextManager(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Manage
                </Button>
              </div>
            </div>
          )}

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
