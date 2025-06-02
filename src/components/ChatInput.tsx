
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Mic, MicOff, Settings, ChevronUp, ChevronDown } from 'lucide-react';
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
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const availableModels = aiService.getAvailableModels();

  // Focus management
  useEffect(() => {
    if (!isProcessing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProcessing]);

  const handleSend = () => {
    const messageText = inputText.trim();
    if (!messageText || isProcessing) return;
    
    onSendMessage(messageText, selectedModel, queryType);
    setInputText('');
    setIsExpanded(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setShowSettings(false);
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize and expand
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const newHeight = Math.min(inputRef.current.scrollHeight, 120);
      inputRef.current.style.height = newHeight + 'px';
      
      // Auto-expand settings if text is getting long
      if (e.target.value.length > 100 && !isExpanded) {
        setIsExpanded(true);
      }
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Textarea
              ref={inputRef}
              value={inputText}
              onChange={handleTextChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about legal research, document analysis, or contract review..."
              className="min-h-[60px] max-h-[120px] resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isProcessing}
              aria-label="Message input"
              aria-describedby="input-help"
            />
            
            {/* Model and query type display */}
            <div className={`flex items-center justify-between mt-2 text-xs text-slate-500 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-20' : 'opacity-70 max-h-8'}`}>
              <span id="input-help">
                {availableModels.find(m => m.id === selectedModel)?.name} • {queryType}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  className="h-6 px-2 text-xs transition-all duration-200 hover:scale-105"
                  disabled={isProcessing}
                  aria-label={isExpanded ? 'Collapse settings' : 'Expand settings'}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                </Button>
                <Popover open={showSettings} onOpenChange={setShowSettings}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500"
                      disabled={isProcessing}
                      aria-label="Open model and query type settings"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Settings
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 animate-scale-in" align="end">
                    <div className="space-y-4" role="dialog" aria-label="AI Settings">
                      <div>
                        <h4 className="font-medium mb-2">AI Model</h4>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableModels.map(model => (
                              <SelectItem key={model.id} value={model.id} className="transition-colors duration-200 hover:bg-blue-50">
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Query Type</h4>
                        <Select value={queryType} onValueChange={(value: any) => setQueryType(value)}>
                          <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="research" className="transition-colors duration-200 hover:bg-blue-50">Research</SelectItem>
                            <SelectItem value="analysis" className="transition-colors duration-200 hover:bg-blue-50">Analysis</SelectItem>
                            <SelectItem value="contract" className="transition-colors duration-200 hover:bg-blue-50">Contract</SelectItem>
                            <SelectItem value="citation" className="transition-colors duration-200 hover:bg-blue-50">Citation</SelectItem>
                            <SelectItem value="summary" className="transition-colors duration-200 hover:bg-blue-50">Summary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSend}
              disabled={!inputText.trim() || isProcessing}
              size="sm"
              className="h-10 w-10 transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" role="status" aria-label="Sending" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={startVoiceInput}
              disabled={isProcessing}
              className="h-10 w-10 transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              aria-pressed={isListening}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 animate-pulse text-red-500" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
