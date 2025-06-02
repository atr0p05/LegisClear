
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ThumbsUp, ThumbsDown, BookOpen, Scale } from 'lucide-react';
import { Message } from '@/types/message';

interface EnhancedMessageRendererProps {
  message: Message;
  onCopy?: (text: string) => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
  onCitationClick?: (citation: string) => void;
}

export const EnhancedMessageRenderer: React.FC<EnhancedMessageRendererProps> = ({
  message,
  onCopy,
  onFeedback,
  onCitationClick
}) => {
  const renderContent = (content: string) => {
    // Enhanced content rendering with legal citation detection
    const citationRegex = /\b\d+\s+[A-Z][a-z]+\s+\d+\b|\b[A-Z][a-z]+\s+v\.\s+[A-Z][a-z]+\b/g;
    const parts = content.split(citationRegex);
    const citations = content.match(citationRegex) || [];
    
    return parts.reduce((acc, part, index) => {
      acc.push(part);
      if (citations[index]) {
        acc.push(
          <Button
            key={index}
            variant="link"
            size="sm"
            className="p-0 h-auto text-blue-600 underline"
            onClick={() => onCitationClick?.(citations[index])}
          >
            {citations[index]}
          </Button>
        );
      }
      return acc;
    }, [] as React.ReactNode[]);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={message.type === 'user' ? 'default' : 'secondary'}>
              {message.type === 'user' ? 'You' : 'AI Assistant'}
            </Badge>
            {message.aiResponse?.confidence && (
              <Badge variant="outline">
                {Math.round(message.aiResponse.confidence * 100)}% confidence
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy?.(message.content)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            {message.type === 'ai' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback?.(message.id, 'positive')}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback?.(message.id, 'negative')}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          {renderContent(message.content)}
        </div>

        {message.aiResponse?.sources && message.aiResponse.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Sources
            </h4>
            <div className="space-y-2">
              {message.aiResponse.sources.map((source, index) => (
                <div key={index} className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                  <div className="font-medium">{source.title}</div>
                  <div className="text-slate-500">{source.url}</div>
                  <Badge variant="outline" className="mt-1">
                    Relevance: {Math.round(source.relevance * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {message.metadata && (
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span>Model: {message.metadata.model}</span>
            <span>•</span>
            <span>Time: {message.metadata.processingTime}ms</span>
            <span>•</span>
            <span>Cost: ${message.metadata.cost.toFixed(4)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
