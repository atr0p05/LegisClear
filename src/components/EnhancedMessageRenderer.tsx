
import React, { createContext, useContext } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ThumbsUp, ThumbsDown, BookOpen, Scale, ExternalLink, MapPin, AlertTriangle } from 'lucide-react';
import { Message } from '@/types/message';
import { ConfidenceIndicator } from '@/components/ConfidenceIndicator';

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
  onRefineQuery?: () => void;
  onAddContext?: () => void;
}

export const EnhancedMessageRenderer: React.FC<EnhancedMessageRendererProps> = ({
  message,
  onCopy,
  onFeedback,
  onCitationClick,
  onNavigateToSource,
  onRefineQuery,
  onAddContext
}) => {
  const navigationContext = useContext(DocumentNavigationContext);

  const handleSourceNavigation = (documentId: string, location: any) => {
    if (onNavigateToSource) {
      onNavigateToSource(documentId, location);
    } else if (navigationContext) {
      navigationContext.navigateToLocation(documentId, location);
    }
  };

  const renderInteractiveContent = (content: string) => {
    // Enhanced citation detection with more legal patterns
    const citationPatterns = [
      /\b\d+\s+[A-Z][a-z]+\s+\d+\b/g, // 123 F.3d 456
      /\b[A-Z][a-z]+\s+v\.\s+[A-Z][a-z]+\b/g, // Case v. Name
      /\b[A-Z][a-z]+\s+§\s*\d+[\.\d]*\b/g, // Statute § 123.45
      /\b\d+\s+U\.S\.C\.\s*§\s*\d+\b/g, // 15 U.S.C. § 1234
      /\bSection\s+\d+[\.\d]*\b/g, // Section 12.3
    ];

    let processedContent = content;
    const citationMatches: Array<{ text: string; source?: any; index: number }> = [];

    // Find all citations and their corresponding sources
    citationPatterns.forEach(pattern => {
      const matches = Array.from(content.matchAll(pattern));
      matches.forEach(match => {
        if (match.index !== undefined) {
          const citationText = match[0];
          const matchingSource = message.aiResponse?.sources.find(source => 
            source.citationText?.includes(citationText) || 
            source.title.toLowerCase().includes(citationText.toLowerCase()) ||
            source.snippet?.includes(citationText)
          );

          citationMatches.push({
            text: citationText,
            source: matchingSource,
            index: match.index
          });
        }
      });
    });

    // Sort by index to process in order
    citationMatches.sort((a, b) => a.index - b.index);

    // Create interactive elements
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    citationMatches.forEach((citation, idx) => {
      // Add text before citation
      if (citation.index > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {content.slice(lastIndex, citation.index)}
          </span>
        );
      }

      // Add interactive citation
      parts.push(
        <Button
          key={`citation-${idx}`}
          variant="link"
          size="sm"
          className="p-0 h-auto text-blue-600 underline inline-flex items-center gap-1 font-semibold"
          onClick={() => {
            onCitationClick?.(citation.text);
            if (citation.source?.documentId && citation.source?.location) {
              handleSourceNavigation(citation.source.documentId, citation.source.location);
            }
          }}
          title={citation.source ? `Go to ${citation.source.title}` : 'View citation details'}
          data-citation={citation.text}
          data-document-id={citation.source?.documentId}
          data-location={JSON.stringify(citation.source?.location)}
        >
          {citation.text}
          {citation.source?.location && <MapPin className="w-3 h-3 ml-1" />}
          {!citation.source && <AlertTriangle className="w-3 h-3 ml-1 text-amber-500" />}
        </Button>
      );

      lastIndex = citation.index + citation.text.length;
    });

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key="text-final">
          {content.slice(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : [content];
  };

  const renderSourceLocation = (location: any) => {
    if (!location) return null;
    
    const locationParts = [];
    if (location.pageNumber) locationParts.push(`Page ${location.pageNumber}`);
    if (location.sectionTitle) locationParts.push(location.sectionTitle);
    if (location.paragraphId) locationParts.push(`¶${location.paragraphId}`);
    if (location.charOffsetStart && location.charOffsetEnd) {
      locationParts.push(`chars ${location.charOffsetStart}-${location.charOffsetEnd}`);
    }
    
    return locationParts.join(', ');
  };

  const shouldShowLowConfidenceWarning = () => {
    return message.aiResponse?.confidence && message.aiResponse.confidence < 0.6;
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
              <ConfidenceIndicator 
                score={message.aiResponse.confidence}
                factors={message.aiResponse.confidenceFactors}
                showWarning={shouldShowLowConfidenceWarning()}
                onRefineQuery={onRefineQuery}
                onAddContext={onAddContext}
              />
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
        
        {/* Low Confidence Warning */}
        {shouldShowLowConfidenceWarning() && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium">Low Confidence Response</p>
              <p className="text-amber-700 mt-1">
                This information should be verified with additional sources before making legal decisions.
              </p>
              <div className="flex gap-2 mt-2">
                {onRefineQuery && (
                  <Button variant="outline" size="sm" onClick={onRefineQuery}>
                    Refine Query
                  </Button>
                )}
                {onAddContext && (
                  <Button variant="outline" size="sm" onClick={onAddContext}>
                    Add Documents
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap">
            {renderInteractiveContent(message.content)}
          </div>
        </div>

        {/* Enhanced Sources Section */}
        {message.aiResponse?.sources && message.aiResponse.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Sources & Verification ({message.aiResponse.sources.length})
            </h4>
            <div className="space-y-3">
              {message.aiResponse.sources.map((source, index) => (
                <div key={index} className="text-xs bg-slate-50 p-3 rounded-lg border hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-slate-800 flex items-center gap-2">
                        {source.title}
                        <Badge variant="outline" className="text-xs">
                          {source.type}
                        </Badge>
                      </div>
                      {source.citationText && (
                        <div className="text-slate-600 italic mt-1 font-mono text-xs">
                          {source.citationText}
                        </div>
                      )}
                      {source.location && (
                        <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {renderSourceLocation(source.location)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Badge variant={source.relevance > 0.8 ? 'default' : 'outline'} className="text-xs">
                        {Math.round(source.relevance * 100)}% relevant
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
                      <span className="text-slate-500">"</span>
                      <span>{source.snippet}</span>
                      <span className="text-slate-500">"</span>
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
            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-3 rounded">
              <div><strong>Retrieval:</strong> {message.aiResponse.reasoning.retrievalProcess}</div>
              <div><strong>Synthesis:</strong> {message.aiResponse.reasoning.synthesisApproach}</div>
              <div><strong>Confidence:</strong> {message.aiResponse.reasoning.confidenceRationale}</div>
            </div>
          </div>
        )}

        {message.metadata && (
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-2 border-t pt-2">
            <span>Model: {message.metadata.model}</span>
            <span>•</span>
            <span>Time: {message.metadata.processingTime}ms</span>
            <span>•</span>
            <span>Cost: ${message.metadata.cost.toFixed(4)}</span>
            {message.metadata.activeDocuments && (
              <>
                <span>•</span>
                <span>{message.metadata.activeDocuments} active docs</span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
