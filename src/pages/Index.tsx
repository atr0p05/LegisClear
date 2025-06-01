
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { QueryInterface } from '@/components/QueryInterface';
import { DocumentManager } from '@/components/DocumentManager';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'query' | 'documents' | 'results'>('dashboard');
  const [queryResults, setQueryResults] = useState(null);

  const handleQuerySubmit = (query: string) => {
    // Simulate AI response for demo
    setQueryResults({
      answer: "Based on the legal precedents and statutes in your document library, the contract clause in question appears to be enforceable under common law principles. However, there are several considerations regarding unconscionability that should be reviewed.",
      confidence: 0.87,
      sources: [
        { title: "Restatement (Second) of Contracts § 208", type: "statute", relevance: 0.95 },
        { title: "Williams v. Walker-Thomas Furniture Co.", type: "case", relevance: 0.82 },
        { title: "Contract Law Principles, 5th Ed.", type: "treatise", relevance: 0.78 }
      ]
    });
    setActiveView('results');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <MainContent>
        {activeView === 'dashboard' && <Dashboard onViewChange={setActiveView} />}
        {activeView === 'query' && <QueryInterface onQuerySubmit={handleQuerySubmit} />}
        {activeView === 'documents' && <DocumentManager />}
        {activeView === 'results' && <ResultsDisplay results={queryResults} />}
      </MainContent>
    </div>
  );
};

export default Index;
