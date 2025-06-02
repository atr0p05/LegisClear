
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink, Calendar, Building, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface SourceCardProps {
  source: {
    id: string;
    title: string;
    type: 'case' | 'statute' | 'regulation' | 'treatise' | 'article';
    jurisdiction?: string;
    date?: string;
    court?: string;
    citation?: string;
    relevanceScore?: number;
    excerpt?: string;
  };
  onNavigateToSource?: (sourceId: string) => void;
  compact?: boolean;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  source,
  onNavigateToSource,
  compact = false
}) => {
  const getTypeIcon = () => {
    switch (source.type) {
      case 'case': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'statute': return <Building className="w-4 h-4 text-green-600" />;
      case 'regulation': return <MapPin className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = () => {
    switch (source.type) {
      case 'case': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'statute': return 'bg-green-100 text-green-800 border-green-200';
      case 'regulation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'treatise': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'article': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRelevanceColor = () => {
    if (!source.relevanceScore) return 'border-gray-200';
    const score = source.relevanceScore;
    if (score >= 0.8) return 'border-green-300 text-green-700';
    if (score >= 0.6) return 'border-yellow-300 text-yellow-700';
    return 'border-red-300 text-red-700';
  };

  const handleNavigate = () => {
    if (onNavigateToSource) {
      onNavigateToSource(source.id);
    } else {
      toast.info(`Opening ${source.title}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigate();
    }
  };

  if (compact) {
    return (
      <div 
        className="flex items-center gap-2 p-2 bg-slate-50 rounded border text-sm transition-all duration-200 hover:bg-slate-100 hover:border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1"
        role="article"
        aria-label={`Source: ${source.title}`}
      >
        <div className="transition-transform duration-200 hover:scale-110">
          {getTypeIcon()}
        </div>
        <span className="font-medium truncate flex-1">{source.title}</span>
        {source.relevanceScore && (
          <Badge variant="outline" className={`text-xs transition-colors duration-200 ${getRelevanceColor()}`}>
            {Math.round(source.relevanceScore * 100)}%
          </Badge>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNavigate}
          onKeyDown={handleKeyDown}
          className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={`Open ${source.title}`}
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 animate-fade-in">
      <CardContent className="p-4" role="article" aria-label={`Source: ${source.title}`}>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1">
              <div className="transition-transform duration-200 hover:scale-110">
                {getTypeIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight line-clamp-2 transition-colors duration-200 hover:text-blue-600">
                  {source.title}
                </h4>
                {source.citation && (
                  <p className="text-xs text-muted-foreground mt-1">{source.citation}</p>
                )}
              </div>
            </div>
            {source.relevanceScore && (
              <Badge 
                variant="outline" 
                className={`text-xs shrink-0 transition-all duration-200 ${getRelevanceColor()}`}
                aria-label={`Relevance: ${Math.round(source.relevanceScore * 100)}% match`}
              >
                {Math.round(source.relevanceScore * 100)}% match
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge className={`text-xs transition-colors duration-200 ${getTypeColor()}`}>
              {source.type}
            </Badge>
            {source.jurisdiction && (
              <span className="flex items-center gap-1 transition-colors duration-200 hover:text-slate-600">
                <MapPin className="w-3 h-3" />
                {source.jurisdiction}
              </span>
            )}
            {source.date && (
              <span className="flex items-center gap-1 transition-colors duration-200 hover:text-slate-600">
                <Calendar className="w-3 h-3" />
                {source.date}
              </span>
            )}
          </div>

          {source.excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-2 italic transition-colors duration-200 hover:text-slate-600">
              "{source.excerpt}..."
            </p>
          )}

          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNavigate}
              onKeyDown={handleKeyDown}
              className="text-xs transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={`View source: ${source.title}`}
            >
              <ExternalLink className="w-3 h-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
              View Source
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
