
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ConfidenceIndicator } from '@/components/ConfidenceIndicator';
import { ThumbsUp, ThumbsDown, Copy, Share } from 'lucide-react';
import { toast } from 'sonner';

interface AnswerSectionProps {
  answer: string;
  confidence: number;
  sources: any[];
}

export const AnswerSection: React.FC<AnswerSectionProps> = ({ answer, confidence, sources }) => {
  const [userFeedback, setUserFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleFeedback = (type: 'positive' | 'negative') => {
    setUserFeedback(type);
    toast.success(`Thank you for your feedback! This helps improve our AI responses.`);
  };

  const copyToClipboard = async () => {
    const text = `${answer}\n\nSources:\n${sources.map(s => `- ${s.title}`).join('\n')}`;
    await navigator.clipboard.writeText(text);
    toast.success('Response copied to clipboard');
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">AI Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <ConfidenceIndicator 
              score={confidence} 
              showWarning={confidence < 0.7}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">{answer}</p>
        </div>
        
        <Separator />
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Was this helpful?</span>
            <Button
              variant={userFeedback === 'positive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFeedback('positive')}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant={userFeedback === 'negative' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFeedback('negative')}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
