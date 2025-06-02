
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Share, ThumbsUp, ThumbsDown, Check, Bookmark, Flag } from 'lucide-react';
import { toast } from 'sonner';

interface MessageActionsProps {
  messageId: string;
  content: string;
  confidence?: number;
  sources?: any[];
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
  className?: string;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  messageId,
  content,
  confidence,
  sources = [],
  onFeedback,
  className = ""
}) => {
  const [userFeedback, setUserFeedback] = useState<'positive' | 'negative' | null>(null);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `${content}\n\nSources:\n${sources.map(s => `- ${s.title}`).join('\n')}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Response copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setUserFeedback(type);
    onFeedback?.(messageId, type);
    toast.success(`Thank you for your ${type} feedback!`);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleShare = () => {
    toast.info('Share functionality coming soon!');
  };

  const handleFlag = () => {
    toast.info('Message flagged for review');
  };

  return (
    <div className={`flex items-center justify-between bg-slate-50/50 rounded-lg p-3 border border-slate-100 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Was this helpful?</span>
        <div className="flex items-center gap-1">
          <Button
            variant={userFeedback === 'positive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeedback('positive')}
            className="h-8 px-3 transition-all duration-200 hover:scale-105"
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button
            variant={userFeedback === 'negative' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeedback('negative')}
            className="h-8 px-3 transition-all duration-200 hover:scale-105"
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>
        
        {confidence && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="outline" className="text-xs">
              {Math.round(confidence * 100)}% confidence
            </Badge>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleBookmark}
          className={`h-8 px-3 transition-all duration-200 hover:scale-105 ${bookmarked ? 'text-yellow-600 hover:text-yellow-700' : ''}`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className="h-8 px-3 transition-all duration-200 hover:scale-105"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleShare}
          className="h-8 px-3 transition-all duration-200 hover:scale-105"
        >
          <Share className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleFlag}
          className="h-8 px-3 transition-all duration-200 hover:scale-105 text-slate-400 hover:text-red-500"
        >
          <Flag className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
