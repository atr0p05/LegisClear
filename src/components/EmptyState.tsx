
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-slate-600 leading-relaxed mb-6">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="transition-all duration-200 hover:scale-105"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
