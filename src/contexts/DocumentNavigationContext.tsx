
import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationTarget {
  documentId: string;
  pageNumber?: number;
  highlightText?: string;
}

interface DocumentNavigationContextType {
  navigateToSource: (target: NavigationTarget) => void;
}

export const DocumentNavigationContext = createContext<DocumentNavigationContextType>({
  navigateToSource: () => {}
});

interface DocumentNavigationProviderProps {
  children: ReactNode;
  onNavigateToLocation: (documentId: string, location: any) => void;
}

export const DocumentNavigationProvider: React.FC<DocumentNavigationProviderProps> = ({
  children,
  onNavigateToLocation
}) => {
  const navigateToSource = (target: NavigationTarget) => {
    onNavigateToLocation(target.documentId, {
      pageNumber: target.pageNumber,
      highlightText: target.highlightText
    });
  };

  return (
    <DocumentNavigationContext.Provider value={{ navigateToSource }}>
      {children}
    </DocumentNavigationContext.Provider>
  );
};

export const useDocumentNavigation = () => {
  const context = useContext(DocumentNavigationContext);
  if (!context) {
    throw new Error('useDocumentNavigation must be used within a DocumentNavigationProvider');
  }
  return context;
};
