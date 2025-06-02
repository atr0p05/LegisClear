
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  Scale, 
  FileText, 
  BookOpen, 
  Gavel,
  ScrollText
} from 'lucide-react';

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
  const getSourceTypeConfig = (type: string) => {
    const configs = {
      case: { 
        color: 'bg-blue-50 text-blue-700 border-blue-200', 
        icon: Gavel,
        label: 'Case Law'
      },
      statute: { 
        color: 'bg-green-50 text-green-700 border-green-200', 
        icon: Scale,
        label: 'Statute'
      },
      treatise: { 
        color: 'bg-purple-50 text-purple-700 border-purple-200', 
        icon: BookOpen,
        label: 'Treatise'
      },
      regulation: { 
        color: 'bg-orange-50 text-orange-700 border-orange-200', 
        icon: ScrollText,
        label: 'Regulation'
      }
    };
    return configs[type as keyof typeof configs] || {
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: FileText,
      label: 'Document'
    };
  };

  const config = getSourceTypeConfig(source.type);
  const IconComponent = config.icon;

  return (
    <div className="border border-slate-200 rounded-lg hover:border-slate-300 transition-all duration-200 hover:shadow-sm">
      <CollapsibleTrigger 
        className="w-full p-4 hover:bg-slate-50/50 transition-colors duration-200"
        onClick={() => onToggleExpansion(index)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-left flex-1">
            <div className="flex items-center gap-2">
              {isExpanded ? 
                <ChevronDown className="w-4 h-4 text-slate-500 transition-transform duration-200" /> : 
                <ChevronRight className="w-4 h-4 text-slate-500 transition-transform duration-200" />
              }
              <div className={`p-2 rounded-lg border ${config.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 text-sm leading-tight mb-2 line-clamp-2">
                {source.title}
              </h4>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={`text-xs font-medium border ${config.color}`}>
                  {config.label}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {Math.round(source.relevance * 100)}% relevant
                </Badge>
                {source.page && (
                  <span className="text-xs text-slate-600 font-medium">
                    Page {source.page}
                  </span>
                )}
                {source.section && (
                  <span className="text-xs text-slate-600">
                    § {source.section}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/30">
          <div className="pt-4 space-y-4">
            {source.snippet && (
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-full bg-blue-400 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      "{source.snippet}"
                    </p>
                    {source.section && (
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Referenced in Section {source.section}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="transition-all duration-200 hover:scale-105"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Document
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="transition-all duration-200 hover:scale-105"
              >
                <FileText className="w-4 h-4 mr-2" />
                Cite in Format
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </div>
  );
};
