
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface QueryDisplayProps {
  query: string;
}

export const QueryDisplay: React.FC<QueryDisplayProps> = ({ query }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="font-medium">Query:</span>
          <span className="italic">"{query}"</span>
        </div>
      </CardContent>
    </Card>
  );
};
