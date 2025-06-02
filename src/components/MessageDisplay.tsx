import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  User, Brain, Lightbulb, ChevronDown, Target, CheckCircle, 
  AlertCircle, Clock, DollarSign, Zap 
} from 'lucide-react';
import { Message } from '@/types/message';

interface MessageDisplayProps {
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
}

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return 'bg-green-100 text-green-800';
  if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, onSuggestionClick }) => {
  return (
    <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-4xl ${
        message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          message.type === 'user' ? 'bg-blue-100' : 
          message.type === 'system' ? 'bg-orange-100' : 
          message.type === 'suggestion' ? 'bg-purple-100' : 'bg-slate-100'
        }`}>
          {message.type === 'user' ? <User className="w-4 h-4" /> : 
           message.type === 'system' ? <Lightbulb className="w-4 h-4" /> :
           message.type === 'suggestion' ? <Target className="w-4 h-4" /> :
           <Brain className="w-4 h-4" />}
        </div>
        
        <div className={`flex flex-col gap-2 ${
          message.type === 'user' ? 'items-end' : 'items-start'
        }`}>
          <div className={`rounded-lg p-4 ${
            message.type === 'user' ? 'bg-blue-600 text-white' : 
            message.type === 'system' ? 'bg-orange-50 border border-orange-200' :
            message.type === 'suggestion' ? 'bg-purple-50 border border-purple-200' :
            'bg-white border border-slate-200'
          }`}>
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>

          {/* Suggestions Display */}
          {message.type === 'suggestion' && message.suggestions && (
            <div className="flex flex-wrap gap-2 w-full">
              {message.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onSuggestionClick(suggestion.query)}
                  title={suggestion.reasoning}
                >
                  {suggestion.query}
                </Button>
              ))}
            </div>
          )}
          
          {message.type === 'ai' && message.aiResponse && (
            <div className="flex flex-col gap-3 w-full">
              {/* AI Response Metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {message.metadata?.model}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {message.metadata?.processingTime}ms
                </Badge>
                <Badge className={getComplexityColor(message.metadata?.complexity || 'low')}>
                  {message.metadata?.complexity} complexity
                </Badge>
                <Badge className={getConfidenceColor(message.aiResponse.confidence)}>
                  {Math.round(message.aiResponse.confidence * 100)}% confidence
                </Badge>
              </div>

              {/* Analysis Section */}
              {message.aiResponse.analysis && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
                    <Target className="w-4 h-4" />
                    Detailed Analysis
                    <ChevronDown className="w-4 h-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Card className="p-3 mt-2">
                      {message.aiResponse.analysis.keyPoints && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            Key Points:
                          </h5>
                          <ul className="text-xs text-slate-600 space-y-1">
                            {message.aiResponse.analysis.keyPoints.map((point, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {message.aiResponse.analysis.risks && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-red-600" />
                            Risks:
                          </h5>
                          <ul className="text-xs text-slate-600 space-y-1">
                            {message.aiResponse.analysis.risks.map((risk, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {message.aiResponse.analysis.recommendations && (
                        <div>
                          <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3 text-blue-600" />
                            Recommendations:
                          </h5>
                          <ul className="text-xs text-slate-600 space-y-1">
                            {message.aiResponse.analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Sources */}
              {message.aiResponse.sources && message.aiResponse.sources.length > 0 && (
                <Card className="p-3">
                  <h4 className="text-sm font-medium mb-2">Sources:</h4>
                  <div className="space-y-2">
                    {message.aiResponse.sources.map((source, index) => (
                      <div key={index} className="text-xs text-slate-600 flex justify-between items-center">
                        <span className="flex-1">{source.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {source.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(source.relevance * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              
              {/* Follow-up Suggestions */}
              {message.processedQuery?.suggestedFollowUps && (
                <div className="flex flex-wrap gap-2">
                  {message.processedQuery.suggestedFollowUps.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => onSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
