
import React from 'react';
import { Check, Book, File, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ResultsDisplayProps {
  results: any;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'case': return User;
      case 'statute': return Book;
      default: return File;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Research Results</h1>
        <div className="flex items-center space-x-2">
          <Badge className={getConfidenceColor(results.confidence)}>
            <Check className="w-3 h-3 mr-1" />
            {Math.round(results.confidence * 100)}% Confidence
          </Badge>
        </div>
      </div>

      {/* Main Answer */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Legal Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-slate-700 leading-relaxed text-lg">{results.answer}</p>
          </div>
          
          {/* Confidence Explanation */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium mb-2">Confidence Assessment</p>
            <p className="text-blue-700 text-sm">
              This analysis is based on {results.sources.length} relevant legal sources. 
              The high confidence score indicates strong precedential support and clear legal principles.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Supporting Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.sources.map((source: any, index: number) => {
              const IconComponent = getSourceIcon(source.type);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <IconComponent className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{source.title}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <Badge variant="outline" className="capitalize">
                          {source.type}
                        </Badge>
                        <span className="text-sm text-slate-500">
                          {Math.round(source.relevance * 100)}% relevance
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Source
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Next Steps</h3>
              <p className="text-slate-600">Save this research or explore related topics</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">Save Research</Button>
              <Button variant="outline">Export Report</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Ask Follow-up Question
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
