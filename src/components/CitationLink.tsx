
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Scale, ExternalLink, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface CitationLinkProps {
  citation: string;
  documentId?: string;
  pageNumber?: number;
  onNavigate?: (documentId: string, location: any) => void;
  className?: string;
}

export const CitationLink: React.FC<CitationLinkProps> = ({
  citation,
  documentId,
  pageNumber,
  onNavigate,
  className = ""
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (documentId && onNavigate) {
      onNavigate(documentId, { pageNumber, highlightText: citation });
      toast.success(`Opening ${citation}${pageNumber ? ` at page ${pageNumber}` : ''}`);
    } else {
      toast.info(`Citation: ${citation} - Document viewer integration pending`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as any);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={`inline-flex items-center gap-1.5 px-2 py-1 h-auto text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 hover:scale-105 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${className}`}
            role="button"
            tabIndex={0}
            aria-label={`Open citation ${citation}${pageNumber ? ` at page ${pageNumber}` : ''}`}
          >
            <Scale className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" />
            <span className="font-medium">{citation}</span>
            {pageNumber && (
              <span className="text-blue-600 font-normal">@ {pageNumber}</span>
            )}
            <ExternalLink className="w-3 h-3 opacity-60 transition-opacity duration-200 hover:opacity-100" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs animate-fade-in">
          <div className="space-y-1">
            <p className="font-medium">Legal Citation</p>
            <p className="text-sm">{citation}</p>
            {pageNumber && <p className="text-xs text-muted-foreground">Page {pageNumber}</p>}
            <p className="text-xs text-muted-foreground">Click to view in document viewer</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
