
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff } from 'lucide-react';
import { aiService } from '@/services/AIService';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (text: string, model: string, queryType: string) => void;
  isProcessing: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing }) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [queryType, setQueryType] = useState<'research' | 'analysis' | 'contract' | 'citation' | 'summary'>('research');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const availableModels = aiService.getAvailableModels();

  const handleSend = () => {
    const messageText = inputText.trim();
    if (!messageText || isProcessing) return;
    
    onSendMessage(messageText, selectedModel, queryType);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    toast({
      title: 'Voice Input',
      description: 'Voice input feature coming soon!'
    });
    setTimeout(() => setIsListening(false), 3000);
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="text-xs border border-slate-200 rounded px-2 py-1"
            disabled={isProcessing}
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value as any)}
            className="text-xs border border-slate-200 rounded px-2 py-1"
            disabled={isProcessing}
          >
            <option value="research">Research</option>
            <option value="analysis">Analysis</option>
            <option value="contract">Contract</option>
            <option value="citation">Citation</option>
            <option value="summary">Summary</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about legal research, document analysis, or contract review..."
              className="min-h-[80px] resize-none"
              disabled={isProcessing}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSend}
              disabled={!inputText.trim() || isProcessing}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={startVoiceInput}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
