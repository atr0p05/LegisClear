
import React, { createContext, useContext } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ThumbsUp, ThumbsDown, BookOpen, Scale, ExternalLink, MapPin } from 'lucide-react';
import { Message } from '@/types/message';

// Context for document navigation
interface DocumentNavigationContextType {
  navigateToLocation: (documentId: string, location: any) => void;
}

const DocumentNavigationContext = createContext<DocumentNavigationContextType | null>(null);

export const DocumentNavigationProvider: React.FC<{
  children: React.ReactNode;
  onNavigateToLocation: (documentId: string, location: any) => void;
}> = ({ children, onNavigateToLocation }) => {
  return (
    <DocumentNavigationContext.Provider value={{ navigateToLocation: onNavigateToLocation }}>
      {children}
    </DocumentNavigationContext.Provider>
  );
};

interface EnhancedMessageRendererProps {
  message: Message;
  onCopy?: (text: string) => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
  onCitationClick?: (citation: string) => void;
  onNavigateToSource?: (documentId: string, location: any) => void;
}

export const EnhancedMessageRenderer: React.FC<EnhancedMessageRendererProps> = ({
  message,
  onCopy,
  onFeedback,
  onCitationClick,
  onNavigateToSource
}) => {
  const navigationContext = useContext(DocumentNavigationContext);

  const handleSourceNavigation = (documentId: string, location: any) => {
    if (onNavigateToSource) {
      onNavigateToSource(documentId, location);
    } else if (navigationContext) {
      navigationContext.navigateToLocation(documentId, location);
    }
  };

  const renderContent = (content: string) => {
    // Enhanced content rendering with interactive citations
    const citationRegex = /\b\d+\s+[A-Z][a-z]+\s+\d+\b|\b[A-Z][a-z]+\s+v\.\s+[A-Z][a-z]+\b/g;
    const parts = content.split(citationRegex);
    const citations = content.match(citationRegex) || [];
    
    return parts.reduce((acc, part, index) => {
      acc.push(part);
      if (citations[index]) {
        // Find matching source for this citation
        const matchingSource = message.aiResponse?.sources.find(source => 
          source.citationText?.includes(citations[index]) || 
          source.title.includes(citations[index])
        );

        acc.push(
          <Button
            key={index}
            variant="link"
            size="sm"
            className="p-0 h-auto text-blue-600 underline inline-flex items-center gap-1"
            onClick={() => {
              onCitationClick?.(citations[index]);
              if (matchingSource?.documentId && matchingSource?.location) {
                handleSourceNavigation(matchingSource.documentId, matchingSource.location);
              }
            }}
            title={matchingSource ? `Go to ${matchingSource.title}` : 'View citation'}
          >
            {citations[index]}
            {matchingSource?.location && <MapPin className="w-3 h-3 ml-1" />}
          </Button>
        );
      }
      return acc;
    }, [] as React.ReactNode[]);
  };

  const renderSourceLocation = (location: any) => {
    if (!location) return null;
    
    const locationParts = [];
    if (location.pageNumber) locationParts.push(`Page ${location.pageNumber}`);
    if (location.sectionTitle) locationParts.push(location.sectionTitle);
    if (location.paragraphId) locationParts.push(`¶${location.paragraphId}`);
    
    return locationParts.join(', ');
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

        {/* Enhanced Sources Section */}
        {message.aiResponse?.sources && message.aiResponse.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Sources & Verification
            </h4>
            <div className="space-y-3">
              {message.aiResponse.sources.map((source, index) => (
                <div key={index} className="text-xs bg-slate-50 p-3 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{source.title}</div>
                      {source.citationText && (
                        <div className="text-slate-600 italic mt-1">{source.citationText}</div>
                      )}
                      {source.location && (
                        <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {renderSourceLocation(source.location)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Badge variant="outline">
                        Relevance: {Math.round(source.relevance * 100)}%
                      </Badge>
                      {source.documentId && source.location && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleSourceNavigation(source.documentId!, source.location)}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                  {source.snippet && (
                    <div className="text-slate-600 bg-white p-2 rounded border-l-2 border-blue-200 mt-2">
                      "{source.snippet}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Reasoning Section */}
        {message.aiResponse?.reasoning && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <Scale className="w-4 h-4" />
              AI Reasoning Process
            </h4>
            <div className="text-xs text-slate-600 space-y-2">
              <div><strong>Retrieval:</strong> {message.aiResponse.reasoning.retrievalProcess}</div>
              <div><strong>Synthesis:</strong> {message.aiResponse.reasoning.synthesisApproach}</div>
              <div><strong>Confidence:</strong> {message.aiResponse.reasoning.confidenceRationale}</div>
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
