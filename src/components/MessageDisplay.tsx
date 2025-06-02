
import React from 'react';
import { Message } from '@/types/message';
import { EnhancedMessageRenderer } from '@/components/EnhancedMessageRenderer';
import { MessageActions } from '@/components/MessageActions';
import { SourceCard } from '@/components/SourceCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, AlertTriangle } from 'lucide-react';

interface MessageDisplayProps {
  message: Message;
  onSuggestionClick?: (suggestion: string) => void;
  onNavigateToSource?: (documentId: string, location: any) => void;
  onRefineQuery?: () => void;
  onAddContext?: () => void;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({
  message,
  onSuggestionClick,
  onNavigateToSource,
  onRefineQuery,
  onAddContext
}) => {
  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    console.log('User feedback:', messageId, feedback);
  };

  const handleSourceNavigate = (sourceId: string) => {
    if (onNavigateToSource) {
      onNavigateToSource(sourceId, { pageNumber: 1 });
    }
  };

  // Mock sources for demo - in real implementation, these would come from message.aiResponse?.sources
  const mockSources = message.aiResponse?.sources || [
    {
      id: 'source-1',
      title: 'Johnson v. State Corp (2019)',
      type: 'case' as const,
      jurisdiction: 'Federal Circuit',
      date: '2019-03-15',
      citation: '123 F.3d 456 (Fed. Cir. 2019)',
      relevanceScore: 0.92,
      excerpt: 'The court held that contractual obligations must be clearly defined...'
    },
    {
      id: 'source-2',
      title: 'Commercial Code § 2-207',
      type: 'statute' as const,
      jurisdiction: 'Federal',
      citation: 'UCC § 2-207',
      relevanceScore: 0.85,
      excerpt: 'Additional terms in acceptance or confirmation...'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Message Content */}
      <div className={`rounded-lg p-4 ${
        message.type === 'user' 
          ? 'bg-blue-50 border border-blue-200 ml-8' 
          : message.type === 'system'
          ? 'bg-amber-50 border border-amber-200'
          : 'bg-white border border-slate-200'
      }`}>
        <EnhancedMessageRenderer content={message.content} />
        
        {/* Metadata */}
        {message.metadata && (
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <Badge variant="outline" className="text-xs">
              {message.metadata.model}
            </Badge>
            {message.metadata.processingTime && (
              <span>{message.metadata.processingTime}ms</span>
            )}
            {message.metadata.activeDocuments && (
              <span>{message.metadata.activeDocuments} docs active</span>
            )}
          </div>
        )}
      </div>

      {/* Sources */}
      {message.type === 'ai' && mockSources.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <span>Sources ({mockSources.length})</span>
            <Badge variant="secondary" className="text-xs">AI Retrieved</Badge>
          </h4>
          <div className="grid gap-2">
            {mockSources.map((source, index) => (
              <SourceCard
                key={source.id}
                source={source}
                onNavigateToSource={handleSourceNavigate}
                compact={mockSources.length > 3}
              />
            ))}
          </div>
        </div>
      )}

      {/* Message Actions */}
      {message.type === 'ai' && (
        <MessageActions
          messageId={message.id}
          content={message.content}
          confidence={message.aiResponse?.confidence}
          sources={mockSources}
          onFeedback={handleFeedback}
        />
      )}

      {/* Dynamic Suggestions */}
      {message.suggestions && message.suggestions.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Suggested Follow-ups
            </span>
            <Badge variant="secondary" className="text-xs">
              AI Generated
            </Badge>
          </div>
          <div className="space-y-2">
            {message.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto py-2 px-3 w-full text-slate-700 hover:text-blue-700 hover:border-blue-300"
                onClick={() => onSuggestionClick?.(suggestion.query)}
              >
                <div className="flex items-start gap-2 w-full">
                  <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0 text-blue-500" />
                  <div className="text-sm">
                    <div className="font-medium">{suggestion.query}</div>
                    {suggestion.reasoning && (
                      <div className="text-xs text-slate-500 mt-1">
                        {suggestion.reasoning}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Query Enhancement Suggestions for Low Confidence */}
      {message.aiResponse?.confidence && message.aiResponse.confidence < 0.6 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-2">Improve this response:</p>
              <div className="space-y-1 text-xs">
                <p>• Try using more specific legal terminology</p>
                <p>• Add relevant documents to your active context</p>
                <p>• Break complex questions into focused parts</p>
              </div>
              <div className="flex gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRefineQuery}
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                >
                  Refine Query
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onAddContext}
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                >
                  Add Documents
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
