
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Filter } from 'lucide-react';

export const QueryInterfaceHeader: React.FC = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
        <Brain className="w-8 h-8 text-blue-600" />
        Advanced Legal Research & AI Analysis
      </h1>
      <p className="text-slate-600">
        Powered by multi-model AI with intelligent query processing and comprehensive legal analysis
      </p>
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          AI-Enhanced
        </Badge>
        <Badge variant="outline">Multi-Model Support</Badge>
        <Badge variant="outline">Intelligent Processing</Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Advanced Search
        </Badge>
      </div>
    </div>
  );
};
