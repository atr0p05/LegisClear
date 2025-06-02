
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Brain, RefreshCw, BarChart3, TrendingUp 
} from 'lucide-react';

interface ChatHeaderProps {
  selectedModel: string;
  queryType: string;
  showStats: boolean;
  onToggleStats: () => void;
  onClearConversation: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedModel,
  queryType,
  showStats,
  onToggleStats,
  onClearConversation
}) => {
  return (
    <div className="bg-white border-b border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold text-slate-900">AI Legal Assistant</h1>
            <p className="text-sm text-slate-600">Enhanced conversational research platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            {selectedModel}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {queryType}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleStats}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearConversation}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
