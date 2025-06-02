
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Settings } from 'lucide-react';
import { AISettings } from './AISettings';
import { AIModel } from '@/services/AIService';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  analysisDepth: 'quick' | 'standard' | 'comprehensive';
  onAnalysisDepthChange: (depth: 'quick' | 'standard' | 'comprehensive') => void;
  availableModels: AIModel[];
}

export const QueryInput: React.FC<QueryInputProps> = ({
  onSubmit,
  isLoading,
  selectedModel,
  onModelChange,
  analysisDepth,
  onAnalysisDepthChange,
  availableModels
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Ask a complex legal question for AI analysis..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={!inputValue.trim() || isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <AISettings
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          analysisDepth={analysisDepth}
          onAnalysisDepthChange={onAnalysisDepthChange}
          availableModels={availableModels}
          showAdvanced={false}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="text-xs"
        >
          <Settings className="w-3 h-3 mr-1" />
          Settings
        </Button>
      </div>
      
      {showAdvancedSettings && (
        <AISettings
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          analysisDepth={analysisDepth}
          onAnalysisDepthChange={onAnalysisDepthChange}
          availableModels={availableModels}
          showAdvanced={true}
        />
      )}
    </form>
  );
};
