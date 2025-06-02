
import { ProcessedQuery } from '@/services/QueryProcessor';
import { AIResponse } from '@/services/AIService';

export interface Message {
  id: string;
  type: 'user' | 'ai' | 'system' | 'suggestion';
  content: string;
  timestamp: Date;
  processedQuery?: ProcessedQuery;
  aiResponse?: AIResponse;
  suggestions?: Array<{ query: string; reasoning: string; }>;
  metadata?: {
    model: string;
    processingTime: number;
    tokensUsed: number;
    cost: number;
    complexity?: string;
    enhanced?: boolean;
    activeDocuments?: number;
  };
}
