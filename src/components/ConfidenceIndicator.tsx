import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, HelpCircle, RefreshCw, Search, FileText } from 'lucide-react';

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
      description: 'Multiple authoritative sources found with consistent information. This response has high reliability for legal research purposes.',
      actionability: 'You can proceed with confidence, but always verify critical details.'
    };
    if (score >= 0.6) return { 
      level: 'Medium', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: Info,
      description: 'Some supporting sources found, but information may vary between sources or have gaps.',
      actionability: 'Review the sources carefully and consider additional research for important decisions.'
    };
    return { 
      level: 'Low', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: AlertTriangle,
      description: 'Limited, conflicting, or low-quality sources found. The AI had difficulty finding reliable information.',
      actionability: 'Strongly recommend additional verification and consultation with authoritative legal sources.'
    };
  };

  const { level, color, icon: Icon, description, actionability } = getConfidenceLevel(score);
  
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
    
    let baseExplanation = `${description}\n\nActionable Guidance: ${actionability}`;
    
    if (factors) {
      baseExplanation += '\n\nDetailed Confidence Breakdown:';
      baseExplanation += `\n• Source Quality: ${Math.round(factors.sourceQuality * 100)}% - How authoritative and reliable the sources are`;
      baseExplanation += `\n• Source Consistency: ${Math.round(factors.sourceConsistency * 100)}% - How well the sources agree with each other`;
      baseExplanation += `\n• Query Relevance: ${Math.round(factors.queryRelevance * 100)}% - How well the sources match your specific question`;
      
      if (factors.factors.length > 0) {
        baseExplanation += '\n\nSpecific factors affecting confidence:';
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
      insights.push("Try rephrasing your query with more specific legal terminology");
      insights.push("Add more relevant documents to your active context");
      insights.push("Consider breaking complex questions into smaller, focused queries");
    } else if (score < 0.8) {
      insights.push("Good confidence level - review sources for any nuances");
      insights.push("Consider cross-referencing with additional authoritative sources");
    } else {
      insights.push("High confidence - sources strongly support this information");
      insights.push("Still recommended to verify citations for critical legal work");
    }
    
    if (factors) {
      if (factors.sourceQuality < 0.7) {
        insights.push("Source quality could be improved - try searching more authoritative legal databases");
      }
      if (factors.queryRelevance < 0.7) {
        insights.push("Query may be too broad - use more specific legal terms or concepts");
      }
      if (factors.sourceConsistency < 0.7) {
        insights.push("Sources show some inconsistency - pay attention to different perspectives or jurisdictions");
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
      <span>{level}</span>
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
          <TooltipContent className="max-w-md p-4" side="bottom">
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
                      <span className={factors.sourceQuality > 0.7 ? 'text-green-600' : factors.sourceQuality > 0.5 ? 'text-yellow-600' : 'text-red-600'}>
                        {Math.round(factors.sourceQuality * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Source Consistency:</span>
                      <span className={factors.sourceConsistency > 0.7 ? 'text-green-600' : factors.sourceConsistency > 0.5 ? 'text-yellow-600' : 'text-red-600'}>
                        {Math.round(factors.sourceConsistency * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Query Relevance:</span>
                      <span className={factors.queryRelevance > 0.7 ? 'text-green-600' : factors.queryRelevance > 0.5 ? 'text-yellow-600' : 'text-red-600'}>
                        {Math.round(factors.queryRelevance * 100)}%
                      </span>
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
                    <strong>Legal Caution:</strong> This information should be verified with additional authoritative sources before making legal decisions. Consider consulting with a legal professional.
                  </p>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Actionable Buttons for Low/Medium Confidence */}
      {score < 0.8 && (
        <div className="flex items-center gap-1">
          {onRefineQuery && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onRefineQuery}
              title="Rephrase your query for better results"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refine
            </Button>
          )}
          {onAddContext && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onAddContext}
              title="Add more documents to improve context"
            >
              <FileText className="w-3 h-3 mr-1" />
              Add Docs
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
