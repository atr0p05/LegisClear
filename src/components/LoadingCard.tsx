
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCardProps {
  lines?: number;
  showHeader?: boolean;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ 
  lines = 3, 
  showHeader = true,
  className = ''
}) => {
  return (
    <Card className={`animate-fade-in ${className}`} role="status" aria-label="Loading content">
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-3/4 animate-pulse" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton 
            key={index} 
            className={`h-4 animate-pulse ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`} 
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20 animate-pulse" style={{ animationDelay: '400ms' }} />
          <Skeleton className="h-6 w-24 animate-pulse" style={{ animationDelay: '500ms' }} />
          <Skeleton className="h-6 w-16 animate-pulse" style={{ animationDelay: '600ms' }} />
        </div>
      </CardContent>
    </Card>
  );
};
