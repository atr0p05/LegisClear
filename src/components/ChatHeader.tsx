
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Trash2, Settings, FileText } from 'lucide-react';

interface ChatHeaderProps {
  showStats: boolean;
  onToggleStats: () => void;
  onClearConversation: () => void;
  activeDocumentCount?: number;
  onToggleContextManager?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  showStats,
  onToggleStats,
  onClearConversation,
  activeDocumentCount = 0,
  onToggleContextManager
}) => {
  return (
    <div className="bg-white border-b border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Legal Research Assistant</h1>
          
          {activeDocumentCount > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {activeDocumentCount} active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onToggleContextManager && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleContextManager}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Context
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleStats}
            className={showStats ? 'bg-slate-100' : ''}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClearConversation}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
