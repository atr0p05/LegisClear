
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
    <Card className={`animate-pulse ${className}`}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton 
            key={index} 
            className={`h-4 ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`} 
          />
        ))}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  );
};
