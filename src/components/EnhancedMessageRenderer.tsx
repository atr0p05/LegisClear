
import React, { useContext } from 'react';
import { DocumentNavigationContext } from '@/contexts/DocumentNavigationContext';
import { CitationLink } from '@/components/CitationLink';

interface EnhancedMessageRendererProps {
  content: string;
  onCitationClick?: (citationText: string, event: React.MouseEvent) => void;
}

export const EnhancedMessageRenderer: React.FC<EnhancedMessageRendererProps> = ({
  content,
  onCitationClick
}) => {
  const { navigateToSource } = useContext(DocumentNavigationContext);

  const handleCitationNavigate = (documentId: string, location: any) => {
    navigateToSource({
      documentId,
      pageNumber: location.pageNumber || 1,
      highlightText: location.highlightText
    });
  };

  const renderContentWithCitations = (text: string) => {
    // Add null check to prevent the error
    if (!text || typeof text !== 'string') {
      return text || '';
    }

    // Enhanced citation detection with page numbers and document IDs
    const citationRegex = /\[([^\]]+)\](?:\s*at\s*(\d+))?(?:\s*\{([^}]+)\})?/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = citationRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const fullCitation = match[0];
      const caseReference = match[1];
      const pageNumber = match[2] ? parseInt(match[2]) : undefined;
      const documentId = match[3] || `doc-${caseReference.replace(/\s+/g, '-').toLowerCase()}`;

      parts.push(
        <CitationLink
          key={match.index}
          citation={caseReference}
          pageNumber={pageNumber}
          documentId={documentId}
          onNavigate={handleCitationNavigate}
          className="mx-1"
        />
      );

      lastIndex = citationRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="prose prose-slate max-w-none">
      <div className="legal-document-content text-slate-700 leading-relaxed tracking-tight">
        {renderContentWithCitations(content)}
      </div>
    </div>
  );
};
