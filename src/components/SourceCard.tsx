
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

  const handleNavigate = () => {
    if (onNavigateToSource) {
      onNavigateToSource(source.id);
    } else {
      toast.info(`Opening ${source.title}`);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border text-sm">
        {getTypeIcon()}
        <span className="font-medium truncate flex-1">{source.title}</span>
        {source.relevanceScore && (
          <Badge variant="outline" className="text-xs">
            {Math.round(source.relevanceScore * 100)}%
          </Badge>
        )}
        <Button variant="ghost" size="sm" onClick={handleNavigate} className="h-6 w-6 p-0">
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1">
              {getTypeIcon()}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight line-clamp-2">
                  {source.title}
                </h4>
                {source.citation && (
                  <p className="text-xs text-muted-foreground mt-1">{source.citation}</p>
                )}
              </div>
            </div>
            {source.relevanceScore && (
              <Badge variant="outline" className="text-xs shrink-0">
                {Math.round(source.relevanceScore * 100)}% match
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge className={`text-xs ${getTypeColor()}`}>
              {source.type}
            </Badge>
            {source.jurisdiction && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {source.jurisdiction}
              </span>
            )}
            {source.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {source.date}
              </span>
            )}
          </div>

          {source.excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-2 italic">
              "{source.excerpt}..."
            </p>
          )}

          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={handleNavigate} className="text-xs">
              <ExternalLink className="w-3 h-3 mr-1" />
              View Source
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
