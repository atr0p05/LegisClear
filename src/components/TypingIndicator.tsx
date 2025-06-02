
import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex justify-start">
      <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-xs shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100" />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200" />
          </div>
          <span className="text-sm text-slate-600 ml-2">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
};
