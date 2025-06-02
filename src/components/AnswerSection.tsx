
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ConfidenceIndicator } from '@/components/ConfidenceIndicator';
import { ThumbsUp, ThumbsDown, Copy, Share, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AnswerSectionProps {
  answer: string;
  confidence: number;
  sources: any[];
}

export const AnswerSection: React.FC<AnswerSectionProps> = ({ answer, confidence, sources }) => {
  const [userFeedback, setUserFeedback] = useState<'positive' | 'negative' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFeedback = (type: 'positive' | 'negative') => {
    setUserFeedback(type);
    toast.success('Thank you for your feedback! This helps improve our AI responses.');
  };

  const copyToClipboard = async () => {
    const text = `${answer}\n\nSources:\n${sources.map(s => `- ${s.title}`).join('\n')}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="document-card group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold tracking-tight">AI Legal Analysis</CardTitle>
          <div className="flex items-center gap-3">
            <ConfidenceIndicator 
              score={confidence} 
              showWarning={confidence < 0.7}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-slate max-w-none">
          <div className="legal-document-content text-slate-700 leading-relaxed tracking-tight">
            {answer}
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Enhanced Action Buttons */}
        <div className="flex items-center justify-between bg-slate-50/50 rounded-lg p-4 border border-slate-100">
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
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyToClipboard}
              className="h-8 px-3 transition-all duration-200 hover:scale-105"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 px-3 transition-all duration-200 hover:scale-105"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
