
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

interface Source {
  title: string;
  type: 'case' | 'statute' | 'treatise' | 'regulation';
  relevance: number;
  page?: number;
  section?: string;
  snippet?: string;
  url?: string;
}

interface SourceItemProps {
  source: Source;
  index: number;
  isExpanded: boolean;
  onToggleExpansion: (index: number) => void;
}

export const SourceItem: React.FC<SourceItemProps> = ({ 
  source, 
  index, 
  isExpanded, 
  onToggleExpansion 
}) => {
  const getSourceTypeColor = (type: string) => {
    const colors = {
      case: 'bg-blue-100 text-blue-800',
      statute: 'bg-green-100 text-green-800',
      treatise: 'bg-purple-100 text-purple-800',
      regulation: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="border rounded-lg p-4">
      <CollapsibleTrigger 
        className="w-full"
        onClick={() => onToggleExpansion(index)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            {isExpanded ? 
              <ChevronDown className="w-4 h-4 text-slate-400" /> : 
              <ChevronRight className="w-4 h-4 text-slate-400" />
            }
            <div className="flex-1">
              <h4 className="font-medium text-slate-900">{source.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getSourceTypeColor(source.type)}>
                  {source.type}
                </Badge>
                <Badge variant="outline">
                  {Math.round(source.relevance * 100)}% relevant
                </Badge>
                {source.page && (
                  <span className="text-sm text-slate-500">Page {source.page}</span>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="mt-3 pt-3 border-t">
          {source.snippet && (
            <div className="bg-slate-50 p-3 rounded border-l-4 border-blue-400">
              <p className="text-sm text-slate-700 italic">
                "{source.snippet}"
              </p>
            </div>
          )}
          {source.section && (
            <p className="text-sm text-slate-600 mt-2">
              <span className="font-medium">Section:</span> {source.section}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <Button variant="outline" size="sm">
              View Full Document
            </Button>
            <Button variant="outline" size="sm">
              Cite in Format
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </div>
  );
};
