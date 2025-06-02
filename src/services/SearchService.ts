
import { aiService } from './AIService';

export interface SearchFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  jurisdictions?: string[];
  practiceAreas?: string[];
  documentTypes?: string[];
  confidentiality?: ('public' | 'confidential' | 'restricted')[];
  authors?: string[];
  tags?: string[];
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilter;
  semanticSearch?: boolean;
  maxResults?: number;
  sortBy?: 'relevance' | 'date' | 'title' | 'author';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  snippet: string;
  relevanceScore: number;
  semanticScore?: number;
  documentType: string;
  practiceArea: string;
  jurisdiction: string;
  author: string;
  date: string;
  tags: string[];
  confidentiality: 'public' | 'confidential' | 'restricted';
  url?: string;
  highlights: string[];
  relatedDocuments?: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilter;
  userId: string;
  createdAt: Date;
  lastRun?: Date;
  alertsEnabled: boolean;
  alertFrequency?: 'immediate' | 'daily' | 'weekly';
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'filter' | 'legal_term';
  confidence: number;
  category?: string;
}

class SearchService {
  private mockDocuments: SearchResult[] = [
    {
      id: "1",
      title: "Contract Liability and Unconscionability Analysis",
      content: "A comprehensive analysis of contract liability provisions and unconscionability doctrines...",
      snippet: "...contract liability provisions must be analyzed under the unconscionability doctrine...",
      relevanceScore: 0.95,
      semanticScore: 0.87,
      documentType: "Case Analysis",
      practiceArea: "Contract Law",
      jurisdiction: "Federal",
      author: "Legal Research Team",
      date: "2024-05-15",
      tags: ["contract", "liability", "unconscionability"],
      confidentiality: "confidential",
      highlights: ["contract liability", "unconscionability doctrine"],
      relatedDocuments: ["2", "5"]
    },
    {
      id: "2", 
      title: "Employment Law: Non-Compete Clause Enforceability",
      content: "Analysis of non-compete clause enforceability across different jurisdictions...",
      snippet: "...non-compete clauses vary significantly in enforceability based on jurisdiction...",
      relevanceScore: 0.88,
      semanticScore: 0.82,
      documentType: "Legal Memo",
      practiceArea: "Employment Law",
      jurisdiction: "California",
      author: "Employment Law Division",
      date: "2024-05-12",
      tags: ["employment", "non-compete", "enforceability"],
      confidentiality: "restricted",
      highlights: ["non-compete clause", "enforceability"],
      relatedDocuments: ["1", "3"]
    },
    {
      id: "3",
      title: "Intellectual Property Rights in Software Development",
      content: "Comprehensive guide to IP rights in software development projects...",
      snippet: "...software development IP rights require careful consideration of ownership...",
      relevanceScore: 0.85,
      semanticScore: 0.79,
      documentType: "Policy Document",
      practiceArea: "IP Law",
      jurisdiction: "Federal",
      author: "IP Legal Team",
      date: "2024-05-10",
      tags: ["intellectual property", "software", "development"],
      confidentiality: "public",
      highlights: ["IP rights", "software development"],
      relatedDocuments: ["4"]
    },
    {
      id: "4",
      title: "Data Privacy Compliance: GDPR and CCPA Comparison",
      content: "Comparative analysis of GDPR and CCPA privacy requirements...",
      snippet: "...GDPR and CCPA have similar privacy goals but different implementation requirements...",
      relevanceScore: 0.82,
      semanticScore: 0.76,
      documentType: "Compliance Guide",
      practiceArea: "Privacy Law",
      jurisdiction: "International",
      author: "Privacy Compliance Team",
      date: "2024-05-08",
      tags: ["privacy", "gdpr", "ccpa", "compliance"],
      confidentiality: "confidential",
      highlights: ["GDPR", "CCPA", "privacy requirements"],
      relatedDocuments: ["3"]
    },
    {
      id: "5",
      title: "Securities Regulation in FinTech Companies",
      content: "Analysis of securities regulations affecting financial technology companies...",
      snippet: "...FinTech companies must navigate complex securities regulations...",
      relevanceScore: 0.79,
      semanticScore: 0.73,
      documentType: "Research Report",
      practiceArea: "Securities Law",
      jurisdiction: "Federal",
      author: "Securities Research Division",
      date: "2024-05-05",
      tags: ["securities", "fintech", "regulation"],
      confidentiality: "restricted",
      highlights: ["securities regulations", "FinTech"],
      relatedDocuments: ["1"]
    }
  ];

  private savedSearches: SavedSearch[] = [];
  private searchHistory: string[] = [];

  async performSearch(options: SearchOptions): Promise<{
    results: SearchResult[];
    totalCount: number;
    facets: {
      practiceAreas: { name: string; count: number }[];
      jurisdictions: { name: string; count: number }[];
      documentTypes: { name: string; count: number }[];
      authors: { name: string; count: number }[];
    };
    suggestions: SearchSuggestion[];
  }> {
    console.log('Performing search:', options);

    // Add to search history
    if (!this.searchHistory.includes(options.query)) {
      this.searchHistory.unshift(options.query);
      this.searchHistory = this.searchHistory.slice(0, 10);
    }

    let results = [...this.mockDocuments];

    // Apply text search
    if (options.query.trim()) {
      const queryLower = options.query.toLowerCase();
      results = results.filter(doc => 
        doc.title.toLowerCase().includes(queryLower) ||
        doc.content.toLowerCase().includes(queryLower) ||
        doc.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
        doc.practiceArea.toLowerCase().includes(queryLower)
      );

      // Update relevance scores based on query matching
      results.forEach(doc => {
        let score = 0;
        if (doc.title.toLowerCase().includes(queryLower)) score += 0.5;
        if (doc.content.toLowerCase().includes(queryLower)) score += 0.3;
        if (doc.tags.some(tag => tag.toLowerCase().includes(queryLower))) score += 0.2;
        doc.relevanceScore = Math.min(1, doc.relevanceScore * (1 + score));
      });
    }

    // Apply filters
    if (options.filters) {
      const { filters } = options;
      
      if (filters.practiceAreas?.length) {
        results = results.filter(doc => filters.practiceAreas!.includes(doc.practiceArea));
      }
      
      if (filters.jurisdictions?.length) {
        results = results.filter(doc => filters.jurisdictions!.includes(doc.jurisdiction));
      }
      
      if (filters.documentTypes?.length) {
        results = results.filter(doc => filters.documentTypes!.includes(doc.documentType));
      }
      
      if (filters.confidentiality?.length) {
        results = results.filter(doc => filters.confidentiality!.includes(doc.confidentiality));
      }
      
      if (filters.authors?.length) {
        results = results.filter(doc => filters.authors!.includes(doc.author));
      }
      
      if (filters.tags?.length) {
        results = results.filter(doc => 
          filters.tags!.some(tag => doc.tags.includes(tag))
        );
      }
      
      if (filters.dateRange) {
        results = results.filter(doc => {
          const docDate = new Date(doc.date);
          return docDate >= filters.dateRange!.start && docDate <= filters.dateRange!.end;
        });
      }
    }

    // Sort results
    results.sort((a, b) => {
      switch (options.sortBy) {
        case 'date':
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return options.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        case 'title':
          return options.sortOrder === 'asc' ? 
            a.title.localeCompare(b.title) : 
            b.title.localeCompare(a.title);
        case 'author':
          return options.sortOrder === 'asc' ? 
            a.author.localeCompare(b.author) : 
            b.author.localeCompare(a.author);
        case 'relevance':
        default:
          return b.relevanceScore - a.relevanceScore;
      }
    });

    // Limit results
    if (options.maxResults) {
      results = results.slice(0, options.maxResults);
    }

    // Generate facets
    const allDocs = this.mockDocuments;
    const facets = {
      practiceAreas: this.generateFacetCounts(allDocs, 'practiceArea'),
      jurisdictions: this.generateFacetCounts(allDocs, 'jurisdiction'),
      documentTypes: this.generateFacetCounts(allDocs, 'documentType'),
      authors: this.generateFacetCounts(allDocs, 'author')
    };

    // Generate search suggestions
    const suggestions = await this.generateSearchSuggestions(options.query);

    return {
      results,
      totalCount: results.length,
      facets,
      suggestions
    };
  }

  private generateFacetCounts(docs: SearchResult[], field: keyof SearchResult): { name: string; count: number }[] {
    const counts = new Map<string, number>();
    docs.forEach(doc => {
      const value = doc[field] as string;
      counts.set(value, (counts.get(value) || 0) + 1);
    });
    
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  async generateSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    const suggestions: SearchSuggestion[] = [];
    
    // Query completion suggestions
    const queryCompletions = [
      'contract liability analysis',
      'employment law compliance',
      'intellectual property rights',
      'securities regulation overview',
      'data privacy requirements'
    ].filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase()) && 
      suggestion.toLowerCase() !== query.toLowerCase()
    );

    queryCompletions.forEach(completion => {
      suggestions.push({
        text: completion,
        type: 'query',
        confidence: 0.8,
        category: 'Query Completion'
      });
    });

    // Legal term suggestions
    const legalTerms = [
      'unconscionability doctrine',
      'non-compete enforceability', 
      'fiduciary duty',
      'due process',
      'reasonable doubt'
    ].filter(term => 
      term.toLowerCase().includes(query.toLowerCase())
    );

    legalTerms.forEach(term => {
      suggestions.push({
        text: term,
        type: 'legal_term',
        confidence: 0.9,
        category: 'Legal Terms'
      });
    });

    return suggestions.slice(0, 8);
  }

  async saveSearch(search: Omit<SavedSearch, 'id' | 'createdAt'>): Promise<SavedSearch> {
    const savedSearch: SavedSearch = {
      ...search,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    this.savedSearches.push(savedSearch);
    console.log('Search saved:', savedSearch);
    return savedSearch;
  }

  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    return this.savedSearches.filter(search => search.userId === userId);
  }

  async deleteSavedSearch(searchId: string): Promise<boolean> {
    const index = this.savedSearches.findIndex(search => search.id === searchId);
    if (index !== -1) {
      this.savedSearches.splice(index, 1);
      return true;
    }
    return false;
  }

  getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  async findRelatedDocuments(documentId: string): Promise<SearchResult[]> {
    const document = this.mockDocuments.find(doc => doc.id === documentId);
    if (!document) return [];

    const relatedIds = document.relatedDocuments || [];
    return this.mockDocuments.filter(doc => relatedIds.includes(doc.id));
  }

  async performSemanticSearch(query: string, maxResults: number = 10): Promise<SearchResult[]> {
    // Simulate semantic search with enhanced scoring
    let results = [...this.mockDocuments];
    
    // Enhanced semantic matching simulation
    const queryVector = await this.generateQueryVector(query);
    
    results.forEach(doc => {
      doc.semanticScore = this.calculateSemanticSimilarity(queryVector, doc);
    });

    return results
      .sort((a, b) => (b.semanticScore || 0) - (a.semanticScore || 0))
      .slice(0, maxResults);
  }

  private async generateQueryVector(query: string): Promise<number[]> {
    // Simulate vector generation - in real implementation, use embedding model
    return Array(384).fill(0).map(() => Math.random());
  }

  private calculateSemanticSimilarity(queryVector: number[], document: SearchResult): number {
    // Simulate semantic similarity calculation
    return Math.random() * 0.4 + 0.6; // Random between 0.6-1.0
  }
}

export const searchService = new SearchService();
