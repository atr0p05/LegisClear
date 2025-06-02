
import React, { useState } from 'react';
import { MainContent } from '@/components/MainContent';
import { Sidebar } from '@/components/Sidebar';
import { DocumentManager } from '@/components/DocumentManager';
import { ReportsAndAnalytics } from '@/components/ReportsAndAnalytics';
import { CollaborationDashboard } from '@/components/collaboration/CollaborationDashboard';
import { AIEnhancementDashboard } from '@/components/AIEnhancementDashboard';

export type PageType = 'research' | 'documents' | 'reports' | 'collaboration' | 'ai-enhancement';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('research');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'research':
        return (
          <MainContent>
            <AIEnhancementDashboard />
          </MainContent>
        );
      case 'documents':
        return (
          <MainContent>
            <DocumentManager />
          </MainContent>
        );
      case 'reports':
        return (
          <MainContent>
            <ReportsAndAnalytics />
          </MainContent>
        );
      case 'collaboration':
        return (
          <MainContent>
            <CollaborationDashboard />
          </MainContent>
        );
      case 'ai-enhancement':
        return (
          <MainContent>
            <AIEnhancementDashboard />
          </MainContent>
        );
      default:
        return (
          <MainContent>
            <AIEnhancementDashboard />
          </MainContent>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-hidden">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;
