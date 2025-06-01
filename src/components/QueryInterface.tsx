
import React, { useState } from 'react';
import { Search, Book, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QueryInterfaceProps {
  onQuerySubmit: (query: string) => void;
}

export const QueryInterface: React.FC<QueryInterfaceProps> = ({ onQuerySubmit }) => {
  const [query, setQuery] = useState('');
  const [isAdvanced, setIsAdvanced] = useState(false);

  const suggestedQueries = [
    "What are the requirements for a valid contract?",
    "Analyze employment termination procedures",
    "Review intellectual property licensing terms",
    "Contract unconscionability standards"
  ];

  const handleSubmit = () => {
    if (query.trim()) {
      onQuerySubmit(query);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Legal Research Assistant</h1>
        <p className="text-slate-600">Ask questions in natural language and get comprehensive legal analysis</p>
      </div>

      {/* Main Query Interface */}
      <Card className="border-0 shadow-lg mb-8">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Query Input */}
            <div className="relative">
              <Textarea
                placeholder="Ask your legal question here... (e.g., 'What are the enforceability requirements for non-compete clauses in California?')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-32 text-lg border-2 border-slate-200 focus:border-blue-500 resize-none"
              />
              <div className="absolute bottom-4 right-4">
                <Button 
                  onClick={handleSubmit}
                  disabled={!query.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Research
                </Button>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsAdvanced(!isAdvanced)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isAdvanced ? 'Hide' : 'Show'} Advanced Options
              </button>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <Book className="w-4 h-4 mr-1" />
                  1,247 documents indexed
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Powered by Legal AI
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            {isAdvanced && (
              <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-slate-900">Search Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Jurisdiction
                    </label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2">
                      <option>All Jurisdictions</option>
                      <option>Federal</option>
                      <option>California</option>
                      <option>New York</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Document Type
                    </label>
                    <select className="w-full border border-slate-300 rounded-md px-3 py-2">
                      <option>All Types</option>
                      <option>Cases</option>
                      <option>Statutes</option>
                      <option>Regulations</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Queries */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Suggested Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQueries.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="text-left p-4 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
              >
                <p className="text-slate-700 font-medium">{suggestion}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
