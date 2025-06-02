
import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-xs shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="flex items-center gap-2" role="status" aria-live="polite" aria-label="AI is thinking">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-slate-600 ml-2 animate-pulse">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
};
