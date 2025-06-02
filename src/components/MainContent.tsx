
import React from 'react';

interface MainContentProps {
  children?: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto bg-white">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
