
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

  const handleViewDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info('Opening document in viewer...');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            className={`inline-flex items-center gap-1.5 px-2 py-1 h-auto text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 hover:scale-105 ${className}`}
          >
            <Scale className="w-3 h-3" />
            <span className="font-medium">{citation}</span>
            {pageNumber && (
              <span className="text-blue-600 font-normal">@ {pageNumber}</span>
            )}
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
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
