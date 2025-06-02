
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QueryBuilder } from '@/components/QueryBuilder';
import { ConversationalInterface } from '@/components/ConversationalInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, Settings } from 'lucide-react';

interface QueryInterfaceProps {
  onQuerySubmit: (query: string) => void;
}

export const QueryInterface: React.FC<QueryInterfaceProps> = ({ onQuerySubmit }) => {
  const [simpleQuery, setSimpleQuery] = useState('');

  const handleSimpleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (simpleQuery.trim()) {
      onQuerySubmit(simpleQuery);
    }
  };

  const handleAdvancedQuery = (query: string, conditions: any[]) => {
    console.log('Advanced query built:', query, conditions);
    onQuerySubmit(query);
  };

  const handleConversationalQuery = async (query: string, context?: string[]) => {
    // Simulate AI response for the conversational interface
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          answer: "Based on the legal precedents and statutes in your document library, the contract clause in question appears to be enforceable under common law principles. However, there are several considerations regarding unconscionability that should be reviewed.",
          confidence: 0.87,
          sources: [
            { title: "Restatement (Second) of Contracts § 208", relevance: 0.95 },
            { title: "Williams v. Walker-Thomas Furniture Co.", relevance: 0.82 },
            { title: "Contract Law Principles, 5th Ed.", relevance: 0.78 }
          ]
        });
      }, 2000);
    });
  };

  return (
    <div className="p-8 h-full">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Legal Research & Analysis</h1>
          <p className="text-slate-600">Search legal documents, analyze cases, and get AI-powered insights</p>
        </div>

        <Tabs defaultValue="conversational" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conversational" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="simple" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Quick Search
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Advanced Query
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversational" className="flex-1 mt-6">
            <ConversationalInterface onQuerySubmit={handleConversationalQuery} />
          </TabsContent>

          <TabsContent value="simple" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Legal Search</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSimpleSearch} className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter your legal question or search terms..."
                      value={simpleQuery}
                      onChange={(e) => setSimpleQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!simpleQuery.trim()}>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      'Contract disputes',
                      'Employment law',
                      'Intellectual property',
                      'Corporate governance',
                      'Tax regulations',
                      'Real estate law',
                      'Criminal procedure',
                      'Family law'
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setSimpleQuery(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <QueryBuilder onQueryBuilt={handleAdvancedQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
