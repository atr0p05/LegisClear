
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ConfidenceIndicatorProps {
  score: number; // 0 to 1
  explanation?: string;
  showWarning?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ 
  score, 
  explanation,
  showWarning = false,
  size = 'md'
}) => {
  const percentage = Math.round(score * 100);
  
  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return { level: 'High', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
    if (score >= 0.6) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Info };
    return { level: 'Low', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle };
  };

  const { level, color, icon: Icon } = getConfidenceLevel(score);
  
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

  const getExplanation = () => {
    if (explanation) return explanation;
    
    if (score >= 0.8) {
      return "High confidence: The AI found strong, relevant sources supporting this information. Review sources for verification.";
    } else if (score >= 0.6) {
      return "Medium confidence: The AI found relevant sources but recommends additional verification. Consider consulting additional resources.";
    } else {
      return "Low confidence: Limited or conflicting sources found. Strong recommendation to verify with authoritative sources before acting on this information.";
    }
  };

  const content = (
    <Badge 
      variant="outline" 
      className={`${color} ${sizeClasses[size]} flex items-center gap-2 border`}
    >
      <Icon className={iconSizes[size]} />
      <span>{level} Confidence</span>
      <span className="font-mono">({percentage}%)</span>
    </Badge>
  );

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2">
            <p className="font-medium">Confidence Score: {percentage}%</p>
            <p className="text-sm">{getExplanation()}</p>
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
      
      {showWarning && score < 0.6 && (
        <AlertTriangle className="w-4 h-4 text-amber-500" />
      )}
    </div>
  );
};
