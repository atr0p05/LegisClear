
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { QueryInterface } from '@/components/QueryInterface';
import { DocumentManager } from '@/components/DocumentManager';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Dashboard } from '@/components/Dashboard';
import { ReportsAndAnalytics } from '@/components/ReportsAndAnalytics';

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'query' | 'documents' | 'results' | 'reports'>('query');
  const [queryResults, setQueryResults] = useState(null);

  const handleQuerySubmit = (query: string) => {
    // Enhanced AI response simulation with more detailed analysis
    setQueryResults({
      query: query,
      answer: "Based on comprehensive analysis of your legal document library and current jurisprudence, the contract clause in question demonstrates several key characteristics that affect its enforceability. The unconscionability doctrine, as established in Williams v. Walker-Thomas Furniture Co., provides a framework for evaluating procedural and substantive fairness. Key considerations include: (1) the disparity in bargaining power between parties, (2) the commercial reasonableness of terms, and (3) the presence of meaningful choice in contract formation. Recent circuit court decisions have emphasized the importance of clear, unambiguous language and proportionate remedies. The analysis suggests a moderate risk of unenforceability challenges, particularly in jurisdictions with strong consumer protection statutes.",
      confidence: 0.89,
      sources: [
        { 
          title: "Restatement (Second) of Contracts § 208 - Unconscionable Contract or Term", 
          type: "statute", 
          relevance: 0.96,
          snippet: "If a contract or term thereof is unconscionable at the time the contract is made..."
        },
        { 
          title: "Williams v. Walker-Thomas Furniture Co., 350 F.2d 445 (D.C. Cir. 1965)", 
          type: "case", 
          relevance: 0.87,
          snippet: "Unconscionability has generally been recognized to include an absence of meaningful choice..."
        },
        { 
          title: "Contract Law Principles, 5th Ed. - Chapter 12: Unconscionability", 
          type: "treatise", 
          relevance: 0.82,
          snippet: "Modern courts apply a two-pronged test examining both procedural and substantive unconscionability..."
        },
        {
          title: "Recent Developments in Contract Unconscionability Doctrine",
          type: "case",
          relevance: 0.78,
          snippet: "The trend in recent decisions shows increased scrutiny of adhesion contracts..."
        }
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
        {activeView === 'reports' && <ReportsAndAnalytics />}
      </MainContent>
    </div>
  );
};

export default Index;
