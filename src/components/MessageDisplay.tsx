
import React from 'react';
import { Message } from '@/types/message';
import { EnhancedMessageRenderer } from '@/components/EnhancedMessageRenderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

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
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    toast.success(`Thank you for your ${feedback} feedback!`);
    console.log('User feedback:', messageId, feedback);
  };

  const handleCitationClick = (citation: string) => {
    toast.info(`Citation clicked: ${citation}`);
    console.log('Citation clicked:', citation);
  };

  return (
    <div className="space-y-4">
      <EnhancedMessageRenderer
        message={message}
        onCopy={handleCopy}
        onFeedback={handleFeedback}
        onCitationClick={handleCitationClick}
        onNavigateToSource={onNavigateToSource}
        onRefineQuery={onRefineQuery}
        onAddContext={onAddContext}
      />

      {/* Dynamic Suggestions */}
      {message.suggestions && message.suggestions.length > 0 && (
        <div className="ml-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
        <div className="ml-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
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
      )}
    </div>
  );
};
