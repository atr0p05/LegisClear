
import { aiService, AIRequest, AIResponse } from './AIService';

export interface QueryContext {
  conversationHistory: Array<{
    query: string;
    response: string;
    timestamp: Date;
  }>;
  documentContext: string[];
  userPreferences: {
    preferredModel?: string;
    defaultTemperature?: number;
    analysisDepth: 'quick' | 'standard' | 'comprehensive';
  };
}

export interface ProcessedQuery {
  originalQuery: string;
  expandedQuery: string;
  queryType: string;
  confidence: number;
  suggestedFollowUps: string[];
  estimatedComplexity: 'low' | 'medium' | 'high';
}

class QueryProcessor {
  async processQuery(
    query: string, 
    context: QueryContext = this.getDefaultContext()
  ): Promise<{ processed: ProcessedQuery; response: AIResponse }> {
    
    // Step 1: Classify and expand the query
    const classification = await aiService.classifyQuery(query);
    const expandedQuery = await this.expandQuery(query, context);
    
    const processed: ProcessedQuery = {
      originalQuery: query,
      expandedQuery,
      queryType: classification.type,
      confidence: classification.confidence,
      suggestedFollowUps: this.generateFollowUps(query, classification.type),
      estimatedComplexity: this.estimateComplexity(query, context)
    };

    // Step 2: Build AI request with intelligent context
    const aiRequest: AIRequest = {
      query: expandedQuery,
      context: this.buildIntelligentContext(context),
      queryType: classification.type as any,
      temperature: this.getOptimalTemperature(classification.type, context.userPreferences),
      model: context.userPreferences.preferredModel || classification.suggestedModel
    };

    // Step 3: Process with AI service
    const response = await aiService.processQuery(aiRequest);

    return { processed, response };
  }

  private async expandQuery(query: string, context: QueryContext): Promise<string> {
    // Extract legal concepts and add relevant context
    const legalConcepts = this.extractLegalConcepts(query);
    const contextualTerms = this.getContextualTerms(query, context);
    
    let expandedQuery = query;
    
    // Add jurisdiction context if not specified
    if (!this.hasJurisdictionContext(query)) {
      expandedQuery += " (focusing on federal and common law principles)";
    }

    // Add temporal context for recent developments
    if (this.needsTemporalContext(query)) {
      expandedQuery += " including recent legal developments and current standards";
    }

    // Add related legal concepts
    if (legalConcepts.length > 0) {
      expandedQuery += ` considering related concepts: ${legalConcepts.join(', ')}`;
    }

    return expandedQuery;
  }

  private extractLegalConcepts(query: string): string[] {
    const legalTermMappings = {
      'contract': ['consideration', 'capacity', 'mutual assent', 'statute of frauds'],
      'tort': ['negligence', 'duty of care', 'causation', 'damages'],
      'constitutional': ['due process', 'equal protection', 'commerce clause'],
      'criminal': ['mens rea', 'actus reus', 'burden of proof'],
      'corporate': ['fiduciary duty', 'business judgment rule', 'piercing corporate veil'],
      'property': ['title', 'easements', 'adverse possession', 'zoning']
    };

    const concepts: string[] = [];
    const queryLower = query.toLowerCase();

    for (const [area, relatedConcepts] of Object.entries(legalTermMappings)) {
      if (queryLower.includes(area)) {
        concepts.push(...relatedConcepts.slice(0, 2)); // Limit to prevent overwhelming
      }
    }

    return [...new Set(concepts)]; // Remove duplicates
  }

  private getContextualTerms(query: string, context: QueryContext): string[] {
    // Analyze conversation history for relevant terms
    const recentQueries = context.conversationHistory
      .slice(-3)
      .map(item => item.query.toLowerCase());

    const commonTerms: string[] = [];
    
    // Simple term extraction - in real implementation, this would use NLP
    recentQueries.forEach(pastQuery => {
      const words = pastQuery.split(' ').filter(word => word.length > 4);
      commonTerms.push(...words);
    });

    return [...new Set(commonTerms)].slice(0, 3);
  }

  private hasJurisdictionContext(query: string): boolean {
    const jurisdictionTerms = [
      'federal', 'state', 'jurisdiction', 'circuit', 'district',
      'supreme court', 'appellate', 'california', 'new york', 'texas'
    ];
    
    return jurisdictionTerms.some(term => 
      query.toLowerCase().includes(term)
    );
  }

  private needsTemporalContext(query: string): boolean {
    const temporalIndicators = [
      'recent', 'current', 'new', 'latest', 'updated', 'modern',
      'today', 'now', 'contemporary'
    ];
    
    return temporalIndicators.some(indicator => 
      query.toLowerCase().includes(indicator)
    );
  }

  private generateFollowUps(query: string, queryType: string): string[] {
    const followUpTemplates = {
      contract: [
        "What are the enforcement mechanisms for this type of provision?",
        "How have courts interpreted similar clauses recently?",
        "What are the potential defenses to this contractual obligation?"
      ],
      research: [
        "What is the trend in recent court decisions on this issue?",
        "Are there any pending legislative changes that might affect this?",
        "How do different jurisdictions handle this legal question?"
      ],
      analysis: [
        "What are the strongest counterarguments to this position?",
        "What additional evidence would strengthen this analysis?",
        "How might this analysis change in different factual scenarios?"
      ],
      citation: [
        "Are there more recent cases that have cited this precedent?",
        "What is the current validity of this legal authority?",
        "How have lower courts applied this ruling?"
      ],
      summary: [
        "What are the practical implications of these key points?",
        "How does this summary compare to similar cases or documents?",
        "What follow-up actions are recommended based on this summary?"
      ]
    };

    return followUpTemplates[queryType as keyof typeof followUpTemplates] || followUpTemplates.research;
  }

  private estimateComplexity(query: string, context: QueryContext): 'low' | 'medium' | 'high' {
    let complexityScore = 0;

    // Length-based complexity
    if (query.length > 200) complexityScore += 2;
    else if (query.length > 100) complexityScore += 1;

    // Multiple legal concepts
    const legalConcepts = this.extractLegalConcepts(query);
    complexityScore += Math.min(legalConcepts.length, 3);

    // Context richness
    if (context.conversationHistory.length > 5) complexityScore += 1;
    if (context.documentContext.length > 2) complexityScore += 1;

    // Complexity indicators in query
    const complexityKeywords = [
      'analyze', 'compare', 'evaluate', 'synthesize', 'comprehensive',
      'multi-jurisdictional', 'conflicting', 'ambiguous'
    ];
    
    complexityScore += complexityKeywords.filter(keyword => 
      query.toLowerCase().includes(keyword)
    ).length;

    if (complexityScore >= 6) return 'high';
    if (complexityScore >= 3) return 'medium';
    return 'low';
  }

  private buildIntelligentContext(context: QueryContext): string[] {
    const intelligentContext: string[] = [];

    // Add relevant conversation history
    if (context.conversationHistory.length > 0) {
      const recentContext = context.conversationHistory
        .slice(-2)
        .map(item => `Previous query: ${item.query}`);
      intelligentContext.push(...recentContext);
    }

    // Add document context if available
    if (context.documentContext.length > 0) {
      intelligentContext.push(`Document context: ${context.documentContext.join('; ')}`);
    }

    return intelligentContext;
  }

  private getOptimalTemperature(queryType: string, preferences: QueryContext['userPreferences']): number {
    if (preferences.defaultTemperature !== undefined) {
      return preferences.defaultTemperature;
    }

    const temperatureMap = {
      citation: 0.1,  // High precision needed
      contract: 0.2,  // Precise analysis required
      analysis: 0.3,  // Balanced approach
      research: 0.4,  // Some creativity helpful
      summary: 0.2    // Accurate summarization
    };

    return temperatureMap[queryType as keyof typeof temperatureMap] || 0.3;
  }

  private getDefaultContext(): QueryContext {
    return {
      conversationHistory: [],
      documentContext: [],
      userPreferences: {
        analysisDepth: 'standard'
      }
    };
  }

  async suggestQueryImprovements(query: string): Promise<{
    suggestions: string[];
    improvedQuery: string;
    reasoning: string;
  }> {
    const suggestions: string[] = [];
    let improvedQuery = query;
    const reasoning: string[] = [];

    // Check for vague terms
    const vagueTerms = ['thing', 'stuff', 'issue', 'problem', 'matter'];
    const hasVagueTerms = vagueTerms.some(term => query.toLowerCase().includes(term));
    
    if (hasVagueTerms) {
      suggestions.push("Consider replacing vague terms with specific legal concepts");
      reasoning.push("Specific terminology improves AI understanding and response quality");
    }

    // Check for missing context
    if (query.length < 50) {
      suggestions.push("Provide more context about the specific legal situation");
      reasoning.push("Additional context helps generate more targeted and useful responses");
    }

    // Check for jurisdiction specification
    if (!this.hasJurisdictionContext(query)) {
      suggestions.push("Specify the relevant jurisdiction (federal, state, international)");
      improvedQuery += " (please specify applicable jurisdiction)";
      reasoning.push("Jurisdiction affects applicable law and precedents");
    }

    return {
      suggestions,
      improvedQuery,
      reasoning: reasoning.join('; ')
    };
  }
}

export const queryProcessor = new QueryProcessor();
