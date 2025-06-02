
export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'local';
  capabilities: string[];
  costPerToken: number;
  maxTokens: number;
}

export interface AIRequest {
  query: string;
  context?: string[];
  documentIds?: string[];
  queryType: 'research' | 'analysis' | 'contract' | 'citation' | 'summary';
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIResponse {
  answer: string;
  confidence: number;
  sources: Array<{
    title: string;
    type: 'case' | 'statute' | 'treatise' | 'regulation' | 'contract';
    relevance: number;
    page?: number;
    snippet?: string;
    url?: string;
  }>;
  suggestions?: string[];
  analysis?: {
    keyPoints: string[];
    risks?: string[];
    recommendations?: string[];
    citations?: string[];
  };
  metadata: {
    model: string;
    processingTime: number;
    tokensUsed: number;
    cost: number;
  };
}

class AIService {
  private models: AIModel[] = [
    {
      id: 'gpt-4o',
      name: 'GPT-4 Optimized',
      provider: 'openai',
      capabilities: ['research', 'analysis', 'contract', 'citation', 'summary'],
      costPerToken: 0.00003,
      maxTokens: 128000
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4 Mini',
      provider: 'openai',
      capabilities: ['research', 'summary', 'citation'],
      costPerToken: 0.000015,
      maxTokens: 128000
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'anthropic',
      capabilities: ['analysis', 'contract', 'research'],
      costPerToken: 0.000015,
      maxTokens: 200000
    }
  ];

  private getOptimalModel(queryType: string, documentLength: number = 0): AIModel {
    const suitableModels = this.models.filter(model => 
      model.capabilities.includes(queryType) && model.maxTokens >= documentLength
    );
    
    // For complex analysis, prefer more capable models
    if (queryType === 'contract' || queryType === 'analysis') {
      return suitableModels.find(m => m.id === 'gpt-4o') || suitableModels[0];
    }
    
    // For simple queries, prefer cost-effective models
    return suitableModels.find(m => m.id === 'gpt-4o-mini') || suitableModels[0];
  }

  async processQuery(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const model = request.model ? 
      this.models.find(m => m.id === request.model) : 
      this.getOptimalModel(request.queryType, request.context?.join('').length || 0);

    if (!model) {
      throw new Error('No suitable AI model available');
    }

    try {
      const prompt = this.buildPrompt(request);
      const response = await this.callAIProvider(model, prompt, request);
      const processingTime = Date.now() - startTime;

      return {
        ...response,
        metadata: {
          model: model.id,
          processingTime,
          tokensUsed: response.metadata?.tokensUsed || 0,
          cost: (response.metadata?.tokensUsed || 0) * model.costPerToken
        }
      };
    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error('Failed to process AI request');
    }
  }

  private buildPrompt(request: AIRequest): string {
    const basePrompts = {
      research: "You are an expert legal researcher. Analyze the following query and provide comprehensive legal research with relevant precedents, statutes, and analysis.",
      analysis: "You are a senior legal analyst. Provide detailed analysis of the legal matter, identifying key issues, risks, and recommendations.",
      contract: "You are a contract analysis expert. Review the following content and identify key clauses, potential risks, and compliance issues.",
      citation: "You are a legal citation specialist. Provide proper legal citations and verify the accuracy of legal references.",
      summary: "You are a legal summary expert. Provide concise but comprehensive summaries of legal documents and cases."
    };

    let prompt = basePrompts[request.queryType as keyof typeof basePrompts] || basePrompts.research;
    prompt += `\n\nQuery: ${request.query}`;

    if (request.context && request.context.length > 0) {
      prompt += `\n\nContext from previous conversation:\n${request.context.join('\n')}`;
    }

    return prompt;
  }

  private async callAIProvider(model: AIModel, prompt: string, request: AIRequest): Promise<Partial<AIResponse>> {
    // Simulate AI API call - in real implementation, this would call actual AI APIs
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const mockResponses = {
      research: {
        answer: "Based on extensive legal research, the primary precedent for this matter is established in Johnson v. State Corp (2019), which held that contractual obligations must be clearly defined and mutually agreed upon. The relevant statutory framework includes Section 12-304 of the Commercial Code, which requires written consent for material modifications. Key considerations include: 1) The doctrine of mutual assent, 2) Statutory compliance requirements, and 3) Potential equitable remedies available.",
        confidence: 0.89,
        sources: [
          { title: "Johnson v. State Corp (2019)", type: "case" as const, relevance: 0.95, snippet: "Contractual obligations must be clearly defined..." },
          { title: "Commercial Code § 12-304", type: "statute" as const, relevance: 0.87, snippet: "Written consent required for modifications..." },
          { title: "Restatement of Contracts § 17", type: "treatise" as const, relevance: 0.82 }
        ],
        suggestions: [
          "What are the exceptions to the written consent requirement?",
          "How has this precedent been applied in recent cases?",
          "What equitable remedies might be available here?"
        ]
      },
      analysis: {
        answer: "Legal analysis reveals several critical issues requiring immediate attention. The contract contains potentially unenforceable provisions under current commercial law standards. Primary concerns include unconscionable terms in Section 4.2, inadequate consideration clauses, and potential conflicts with state regulatory requirements.",
        confidence: 0.84,
        sources: [
          { title: "Commercial Code Analysis", type: "treatise" as const, relevance: 0.91 },
          { title: "State Regulatory Framework", type: "regulation" as const, relevance: 0.78 }
        ],
        analysis: {
          keyPoints: [
            "Unconscionable terms identified in Section 4.2",
            "Consideration clauses may be inadequate",
            "Potential regulatory compliance issues"
          ],
          risks: [
            "Contract may be partially unenforceable",
            "Regulatory penalties possible",
            "Litigation exposure increased"
          ],
          recommendations: [
            "Revise Section 4.2 terms immediately",
            "Strengthen consideration language",
            "Conduct regulatory compliance review"
          ]
        }
      },
      contract: {
        answer: "Contract review completed. This agreement contains standard commercial terms with several areas requiring attention. The liability limitation clauses are properly structured, but the termination provisions need clarification. Payment terms are reasonable and enforceable under current commercial standards.",
        confidence: 0.91,
        sources: [
          { title: "Contract Law Principles", type: "treatise" as const, relevance: 0.88 },
          { title: "Commercial Standards Guide", type: "regulation" as const, relevance: 0.75 }
        ],
        analysis: {
          keyPoints: [
            "Liability limitations properly structured",
            "Termination provisions require clarification",
            "Payment terms are enforceable"
          ],
          risks: [
            "Ambiguous termination language",
            "Potential disputes over payment timing"
          ],
          recommendations: [
            "Clarify termination notice requirements",
            "Add specific payment deadlines",
            "Include dispute resolution mechanisms"
          ]
        }
      }
    };

    const responseType = request.queryType as keyof typeof mockResponses;
    const baseResponse = mockResponses[responseType] || mockResponses.research;

    return {
      ...baseResponse,
      metadata: {
        tokensUsed: Math.floor(Math.random() * 1000) + 500
      }
    };
  }

  getAvailableModels(): AIModel[] {
    return [...this.models];
  }

  async classifyQuery(query: string): Promise<{
    type: string;
    confidence: number;
    suggestedModel: string;
  }> {
    // Simple keyword-based classification - in real implementation, this would use ML
    const keywords = {
      contract: ['contract', 'agreement', 'clause', 'terms', 'provision', 'liability'],
      analysis: ['analyze', 'review', 'assessment', 'risk', 'compliance', 'legal issues'],
      research: ['precedent', 'case law', 'statute', 'regulation', 'legal research'],
      citation: ['cite', 'citation', 'bluebook', 'reference', 'source'],
      summary: ['summary', 'summarize', 'overview', 'brief', 'key points']
    };

    const queryLower = query.toLowerCase();
    let bestMatch = { type: 'research', confidence: 0.3 };

    for (const [type, typeKeywords] of Object.entries(keywords)) {
      const matches = typeKeywords.filter(keyword => queryLower.includes(keyword)).length;
      const confidence = matches / typeKeywords.length;
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { type, confidence: confidence * 0.9 + 0.1 };
      }
    }

    const suggestedModel = this.getOptimalModel(bestMatch.type).id;

    return {
      type: bestMatch.type,
      confidence: bestMatch.confidence,
      suggestedModel
    };
  }
}

export const aiService = new AIService();
