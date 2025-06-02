
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Clock, DollarSign, Target, Zap 
} from 'lucide-react';
import { AIModel } from '@/services/AIService';
import { Message } from '@/types/message';

interface ConversationStatsProps {
  availableModels: AIModel[];
  messages: Message[];
  totalCost: number;
}

export const ConversationStats: React.FC<ConversationStatsProps> = ({
  availableModels,
  messages,
  totalCost
}) => {
  const aiMessages = messages.filter(m => m.type === 'ai');
  const avgProcessingTime = aiMessages.length > 0 
    ? aiMessages.reduce((sum, m) => sum + (m.metadata?.processingTime || 0), 0) / aiMessages.length 
    : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Conversation Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Messages:</span>
                <Badge variant="outline">{messages.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">AI Responses:</span>
                <Badge variant="outline">{aiMessages.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Avg Processing:
                </span>
                <Badge variant="outline">{avgProcessingTime.toFixed(0)}ms</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Total Cost:
                </span>
                <Badge variant="outline">${totalCost.toFixed(4)}</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Available Models:</h4>
              <div className="space-y-1">
                {availableModels.map(model => (
                  <div key={model.id} className="flex items-center justify-between text-xs">
                    <span>{model.name}</span>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {model.provider}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ${(model.costPerToken * 1000).toFixed(4)}/1k
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
