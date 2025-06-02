
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare } from 'lucide-react';

interface QuickSearchFormProps {
  onSubmit: (query: string) => void;
  isProcessing: boolean;
}

export const QuickSearchForm: React.FC<QuickSearchFormProps> = ({ onSubmit, isProcessing }) => {
  const [simpleQuery, setSimpleQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (simpleQuery.trim()) {
      onSubmit(simpleQuery);
    }
  };

  const practiceAreas = [
    'Contract Law & Disputes',
    'Employment & Labor Law', 
    'Intellectual Property Rights',
    'Corporate Governance',
    'Tax & Regulatory Compliance',
    'Real Estate Transactions',
    'Criminal Law & Procedure',
    'Family Law & Domestic Relations',
    'Constitutional Law Issues',
    'Securities & Financial Law',
    'Environmental Regulations',
    'Immigration Law'
  ];

  const sampleQueries = [
    'Analyze enforceability of non-compete clauses in California employment contracts',
    'Compare intellectual property protection strategies for software companies',
    'Evaluate GDPR compliance requirements for US companies processing EU data',
    'Research recent developments in cryptocurrency regulation and SEC guidance'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Enhanced Legal Search
        </CardTitle>
        <p className="text-sm text-slate-600">
          Intelligent query expansion and legal concept recognition
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter your legal question or search terms (AI will enhance and expand)..."
              value={simpleQuery}
              onChange={(e) => setSimpleQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!simpleQuery.trim() || isProcessing}>
              <Search className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Search'}
            </Button>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700">Legal Practice Areas:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {practiceAreas.map((area) => (
                <Button
                  key={area}
                  variant="outline"
                  size="sm"
                  onClick={() => setSimpleQuery(`Legal research on ${area.toLowerCase()}`)}
                  className="text-xs justify-start"
                >
                  {area}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700">Sample Complex Queries:</h4>
            <div className="space-y-2">
              {sampleQueries.map((example) => (
                <Button
                  key={example}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSimpleQuery(example)}
                  className="text-xs text-left h-auto p-2 whitespace-normal justify-start"
                >
                  <MessageSquare className="w-3 h-3 mr-2 flex-shrink-0 mt-0.5" />
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
