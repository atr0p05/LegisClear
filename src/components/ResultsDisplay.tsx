
import React from 'react';
import { QueryDisplay } from '@/components/QueryDisplay';
import { AnswerSection } from '@/components/AnswerSection';
import { SourcesList } from '@/components/SourcesList';

interface Source {
  title: string;
  type: 'case' | 'statute' | 'treatise' | 'regulation';
  relevance: number;
  page?: number;
  section?: string;
  snippet?: string;
  url?: string;
}

interface ResultsDisplayProps {
  results: {
    answer: string;
    confidence: number;
    sources: Source[];
    query?: string;
  } | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center text-slate-500">
          <p className="text-lg">No results to display</p>
          <p className="text-sm mt-2">Submit a query to see AI-powered legal analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Query Display */}
        {results.query && <QueryDisplay query={results.query} />}

        {/* Main Answer */}
        <AnswerSection 
          answer={results.answer}
          confidence={results.confidence}
          sources={results.sources}
        />

        {/* Sources */}
        <SourcesList sources={results.sources} />
      </div>
    </div>
  );
};
