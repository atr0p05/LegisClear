
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, HelpCircle, RefreshCw, Search } from 'lucide-react';

interface ConfidenceFactors {
  sourceQuality: number;
  sourceConsistency: number;
  queryRelevance: number;
  factors: string[];
}

interface ConfidenceIndicatorProps {
  score: number; // 0 to 1
  factors?: ConfidenceFactors;
  explanation?: string;
  showWarning?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onRefineQuery?: () => void;
  onAddContext?: () => void;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ 
  score, 
  factors,
  explanation,
  showWarning = false,
  size = 'md',
  onRefineQuery,
  onAddContext
}) => {
  const percentage = Math.round(score * 100);
  
  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return { 
      level: 'High', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle,
      description: 'Multiple strong, corroborating sources found. High reliability.'
    };
    if (score >= 0.6) return { 
      level: 'Medium', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: Info,
      description: 'Some supporting sources found, but details may vary. Verify for critical decisions.'
    };
    return { 
      level: 'Low', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: AlertTriangle,
      description: 'Limited or conflicting sources found. Strongly recommend additional verification.'
    };
  };

  const { level, color, icon: Icon, description } = getConfidenceLevel(score);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getDetailedExplanation = () => {
    if (explanation) return explanation;
    
    let baseExplanation = description;
    
    if (factors) {
      baseExplanation += '\n\nDetailed breakdown:';
      baseExplanation += `\n• Source Quality: ${Math.round(factors.sourceQuality * 100)}%`;
      baseExplanation += `\n• Source Consistency: ${Math.round(factors.sourceConsistency * 100)}%`;
      baseExplanation += `\n• Query Relevance: ${Math.round(factors.queryRelevance * 100)}%`;
      
      if (factors.factors.length > 0) {
        baseExplanation += '\n\nKey factors influencing confidence:';
        factors.factors.forEach(factor => {
          baseExplanation += `\n• ${factor}`;
        });
      }
    }
    
    return baseExplanation;
  };

  const getActionableInsights = () => {
    const insights = [];
    
    if (score < 0.6) {
      insights.push("Consider refining your query to be more specific");
      insights.push("Try adding more context documents to your active set");
    } else if (score < 0.8) {
      insights.push("Good confidence level - consider cross-referencing with additional sources");
    } else {
      insights.push("High confidence - sources strongly support this information");
    }
    
    if (factors) {
      if (factors.sourceQuality < 0.7) {
        insights.push("Source quality could be improved - try searching more authoritative databases");
      }
      if (factors.queryRelevance < 0.7) {
        insights.push("Query may be too broad - try using more specific legal terminology");
      }
    }
    
    return insights;
  };

  const content = (
    <Badge 
      variant="outline" 
      className={`${color} ${sizeClasses[size]} flex items-center gap-2 border cursor-help`}
    >
      <Icon className={iconSizes[size]} />
      <span>{level} Confidence</span>
      <span className="font-mono">({percentage}%)</span>
      <HelpCircle className={`${iconSizes[size]} opacity-60`} />
    </Badge>
  );

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent className="max-w-sm p-4">
            <div className="space-y-3">
              <div>
                <p className="font-medium">Confidence Score: {percentage}%</p>
                <p className="text-sm mt-1" style={{ whiteSpace: 'pre-line' }}>
                  {getDetailedExplanation()}
                </p>
              </div>
              
              {factors && (
                <div className="border-t pt-2">
                  <p className="text-sm font-medium mb-2">Score Breakdown:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Source Quality:</span>
                      <span>{Math.round(factors.sourceQuality * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Source Consistency:</span>
                      <span>{Math.round(factors.sourceConsistency * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Query Relevance:</span>
                      <span>{Math.round(factors.queryRelevance * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-2">
                <p className="text-sm font-medium mb-2">Recommendations:</p>
                <ul className="text-xs space-y-1">
                  {getActionableInsights().map((insight, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {showWarning && score < 0.6 && (
                <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800">
                    <strong>Caution:</strong> This information should be verified with additional authoritative sources before making legal decisions.
                  </p>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Actionable Buttons for Low Confidence */}
      {score < 0.7 && (
        <div className="flex items-center gap-1">
          {onRefineQuery && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onRefineQuery}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refine Query
            </Button>
          )}
          {onAddContext && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onAddContext}
            >
              <Search className="w-3 h-3 mr-1" />
              Add Context
            </Button>
          )}
        </div>
      )}
      
      {showWarning && score < 0.6 && (
        <AlertTriangle className="w-4 h-4 text-amber-500" />
      )}
    </div>
  );
};
