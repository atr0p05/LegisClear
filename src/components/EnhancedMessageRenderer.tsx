
import React, { useContext } from 'react';
import { DocumentNavigationContext } from '@/contexts/DocumentNavigationContext';
import { Scale } from 'lucide-react';

interface EnhancedMessageRendererProps {
  content: string;
  onCitationClick?: (citationText: string, event: React.MouseEvent) => void;
}

export const EnhancedMessageRenderer: React.FC<EnhancedMessageRendererProps> = ({
  content,
  onCitationClick
}) => {
  const { navigateToSource } = useContext(DocumentNavigationContext);

  const handleCitationClick = (citationText: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Extract document reference from citation
    const docMatch = citationText.match(/\[(.*?)\]/);
    if (docMatch) {
      const docReference = docMatch[1];
      navigateToSource({
        documentId: `doc-${docReference}`,
        pageNumber: 1,
        highlightText: citationText
      });
      
      if (onCitationClick) {
        onCitationClick(citationText, event);
      }
    }
  };

  const renderContentWithCitations = (text: string) => {
    // Add null check to prevent the error
    if (!text || typeof text !== 'string') {
      return text || '';
    }

    // Enhanced citation detection with better visual styling
    const citationRegex = /\[([^\]]+)\](?:\s*at\s*(\d+))?/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = citationRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const fullCitation = match[0];
      const caseReference = match[1];
      const pageNumber = match[2];

      parts.push(
        <button
          key={match.index}
          onClick={(e) => handleCitationClick(fullCitation, e)}
          className="citation-link inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-all duration-200 hover:scale-105 border border-blue-200"
        >
          <Scale className="w-3 h-3" />
          {caseReference}
          {pageNumber && <span className="text-blue-600">at {pageNumber}</span>}
        </button>
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
