
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIModel } from '@/services/AIService';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  aiResponse?: {
    confidence: number;
  };
}

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
  const aiResponses = messages.filter(m => m.type === 'ai');
  const avgConfidence = aiResponses.length > 0 
    ? Math.round(aiResponses.reduce((avg, m) => avg + (m.aiResponse?.confidence || 0), 0) / aiResponses.length * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Available AI Models</h4>
          <div className="space-y-2">
            {availableModels.map(model => (
              <div key={model.id} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-medium">{model.name}</h5>
                    <p className="text-sm text-slate-600">Provider: {model.provider}</p>
                  </div>
                  <Badge variant="outline">${model.costPerToken * 1000}/1K tokens</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {model.capabilities.map(cap => (
                    <Badge key={cap} variant="secondary" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Usage Statistics</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded">
              <div className="text-2xl font-bold text-blue-600">{aiResponses.length}</div>
              <div className="text-sm text-slate-600">AI Responses</div>
            </div>
            <div className="text-center p-3 border rounded">
              <div className="text-2xl font-bold text-green-600">${totalCost.toFixed(4)}</div>
              <div className="text-sm text-slate-600">Total Cost</div>
            </div>
            <div className="text-center p-3 border rounded">
              <div className="text-2xl font-bold text-purple-600">{avgConfidence}%</div>
              <div className="text-sm text-slate-600">Avg Confidence</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
