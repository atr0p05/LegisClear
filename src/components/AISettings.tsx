
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AIModel } from '@/services/AIService';

interface AISettingsProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  analysisDepth: 'quick' | 'standard' | 'comprehensive';
  onAnalysisDepthChange: (depth: 'quick' | 'standard' | 'comprehensive') => void;
  availableModels: AIModel[];
  showAdvanced?: boolean;
}

export const AISettings: React.FC<AISettingsProps> = ({
  selectedModel,
  onModelChange,
  analysisDepth,
  onAnalysisDepthChange,
  availableModels,
  showAdvanced = false
}) => {
  if (!showAdvanced) {
    return (
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>Model: {selectedModel === 'auto' ? 'Auto-select' : selectedModel}</span>
        <span>Depth: {analysisDepth}</span>
      </div>
    );
  }

  return (
    <Card className="p-3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">AI Model:</label>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto-select optimal model</SelectItem>
              {availableModels.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name} (${model.costPerToken * 1000}/1K tokens)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium">Analysis Depth:</label>
          <Select value={analysisDepth} onValueChange={onAnalysisDepthChange}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quick">Quick Analysis</SelectItem>
              <SelectItem value="standard">Standard Analysis</SelectItem>
              <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
