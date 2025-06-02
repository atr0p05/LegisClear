
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Message } from '@/types/message';
import { MessageDisplay } from '@/components/MessageDisplay';
import { ConversationStats } from '@/components/ConversationStats';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { DocumentContextManager } from '@/components/DocumentContextManager';
import { DocumentViewer } from '@/components/DocumentViewer';
import { DocumentNavigationProvider } from '@/contexts/DocumentNavigationContext';
import { useConversation } from '@/hooks/useConversation';
import { aiService } from '@/services/AIService';
import { X, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const ConversationalInterface: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [showContextManager, setShowContextManager] = useState(false);
  const [activeDocumentIds, setActiveDocumentIds] = useState<string[]>([]);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [navigationTarget, setNavigationTarget] = useState<any>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  
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
    try {
      await processMessage(suggestion, 'gpt-4o', activeDocumentIds);
      setLastError(null);
    } catch (error) {
      setLastError('Failed to process suggestion. Please try again.');
    }
  };

  const handleSendMessage = async (text: string, model: string, type: string) => {
    try {
      await processMessage(text, model, activeDocumentIds);
      setLastError(null);
    } catch (error) {
      setLastError('Failed to send message. Please check your connection and try again.');
    }
  };

  const handleActiveDocumentsChange = (documentIds: string[]) => {
    setActiveDocumentIds(documentIds);
    console.log('Active documents updated:', documentIds);
  };

  const handleNavigateToSource = (documentId: string, location: any) => {
    console.log('Navigating to source:', documentId, location);
    
    // Mock document - in real implementation, fetch from document service
    const mockDocument = {
      id: documentId,
      title: `Legal Document ${documentId.slice(-4)}`,
      type: 'pdf' as const,
      category: 'Case Law',
      size: '2.4 MB',
      uploadDate: '2024-05-15',
      lastModified: '2024-05-20',
      tags: ['contract', 'liability'],
      pages: 15,
      wordCount: 5420,
      language: 'English',
      confidentiality: 'confidential' as const,
      version: '1.2'
    };

    setSelectedDocument(mockDocument);
    setNavigationTarget(location);
    setDocumentViewerOpen(true);
    
    toast.success(`Opening document at ${location.pageNumber ? `page ${location.pageNumber}` : 'specified location'}`);
  };

  const handleRefineQuery = () => {
    toast.info('Try rephrasing your query with more specific legal terminology');
  };

  const handleAddContext = () => {
    setShowContextManager(true);
    toast.info('Add more relevant documents to improve AI responses');
  };

  const handleDismissError = () => {
    setLastError(null);
  };

  return (
    <DocumentNavigationProvider onNavigateToLocation={handleNavigateToSource}>
      <div className="h-full flex flex-col bg-slate-50">
        <ChatHeader
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
              <DocumentContextManager
                onActiveDocumentsChange={handleActiveDocumentsChange}
              />
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Context Indicator */}
            {activeDocumentIds.length > 0 && (
              <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {activeDocumentIds.length} document{activeDocumentIds.length !== 1 ? 's' : ''} active in RAG context
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowContextManager(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {lastError && (
              <div className="p-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    {lastError}
                    <Button variant="ghost" size="sm" onClick={handleDismissError}>
                      <X className="w-4 h-4" />
                    </Button>
                  </AlertDescription>
                </Alert>
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
                    onNavigateToSource={handleNavigateToSource}
                    onRefineQuery={handleRefineQuery}
                    onAddContext={handleAddContext}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Statistics</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStats(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <ConversationStats
                availableModels={availableModels}
                messages={messages}
                totalCost={totalCost}
              />
            </div>
          )}
        </div>

        {/* Document Viewer Modal */}
        {documentViewerOpen && selectedDocument && (
          <DocumentViewer
            document={selectedDocument}
            content={`This is mock document content for ${selectedDocument.title}.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nThis paragraph contains important legal information that was cited in the AI response. The specific text that was referenced should be highlighted when navigating to this location.\n\nAdditional content continues here with more legal analysis and precedents...`}
            navigationTarget={navigationTarget}
            onNavigationComplete={() => {
              setNavigationTarget(null);
              console.log('Navigation completed');
            }}
          />
        )}
      </div>
    </DocumentNavigationProvider>
  );
};
