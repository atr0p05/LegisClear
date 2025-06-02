export interface QueryMetrics {
  queryId: string;
  query: string;
  responseTime: number;
  tokensUsed: number;
  cost: number;
  confidence: number;
  userSatisfaction?: number;
  timestamp: Date;
  model: string;
  queryType: string;
  complexity: 'low' | 'medium' | 'high';
}

export interface PerformanceMetrics {
  avgResponseTime: number;
  totalQueries: number;
  totalCost: number;
  avgConfidence: number;
  successRate: number;
  topModels: Array<{ model: string; usage: number; avgPerformance: number }>;
  queryTypeDistribution: Record<string, number>;
  timeSeriesData: Array<{ timestamp: Date; responseTime: number; cost: number }>;
}

export interface OptimizationSuggestion {
  type: 'model' | 'query' | 'cost' | 'performance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImprovement: string;
  implementationComplexity: 'easy' | 'moderate' | 'complex';
}

class AnalyticsService {
  private metrics: QueryMetrics[] = [];
  private maxHistorySize = 1000;

  recordQuery(metrics: QueryMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only recent metrics to prevent memory bloat
    if (this.metrics.length > this.maxHistorySize) {
      this.metrics = this.metrics.slice(-this.maxHistorySize);
    }
    
    this.saveToLocalStorage();
  }

  getPerformanceMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return this.getEmptyMetrics();
    }

    const avgResponseTime = this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / this.metrics.length;
    const totalCost = this.metrics.reduce((sum, m) => sum + m.cost, 0);
    const avgConfidence = this.metrics.reduce((sum, m) => sum + m.confidence, 0) / this.metrics.length;
    const successRate = this.metrics.filter(m => m.confidence > 0.7).length / this.metrics.length;

    // Model performance analysis
    const modelStats = new Map<string, { count: number; totalPerformance: number; totalTime: number }>();
    this.metrics.forEach(m => {
      const current = modelStats.get(m.model) || { count: 0, totalPerformance: 0, totalTime: 0 };
      modelStats.set(m.model, {
        count: current.count + 1,
        totalPerformance: current.totalPerformance + m.confidence,
        totalTime: current.totalTime + m.responseTime
      });
    });

    const topModels = Array.from(modelStats.entries()).map(([model, stats]) => ({
      model,
      usage: stats.count,
      avgPerformance: stats.totalPerformance / stats.count
    })).sort((a, b) => b.avgPerformance - a.avgPerformance);

    // Query type distribution
    const queryTypeDistribution: Record<string, number> = {};
    this.metrics.forEach(m => {
      queryTypeDistribution[m.queryType] = (queryTypeDistribution[m.queryType] || 0) + 1;
    });

    // Time series data (last 20 queries)
    const timeSeriesData = this.metrics.slice(-20).map(m => ({
      timestamp: m.timestamp,
      responseTime: m.responseTime,
      cost: m.cost
    }));

    return {
      avgResponseTime,
      totalQueries: this.metrics.length,
      totalCost,
      avgConfidence,
      successRate,
      topModels,
      queryTypeDistribution,
      timeSeriesData
    };
  }

  getOptimizationSuggestions(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const metrics = this.getPerformanceMetrics();

    // High response time suggestion
    if (metrics.avgResponseTime > 3000) {
      suggestions.push({
        type: 'performance',
        priority: 'high',
        title: 'High Response Times Detected',
        description: `Average response time is ${(metrics.avgResponseTime / 1000).toFixed(1)}s. Consider using faster models for simple queries.`,
        expectedImprovement: '40-60% faster responses',
        implementationComplexity: 'easy'
      });
    }

    // High cost suggestion
    if (metrics.totalCost > 5.0) {
      suggestions.push({
        type: 'cost',
        priority: 'medium',
        title: 'High API Costs',
        description: `Total cost is $${metrics.totalCost.toFixed(2)}. Consider using cost-effective models for routine queries.`,
        expectedImprovement: '30-50% cost reduction',
        implementationComplexity: 'moderate'
      });
    }

    // Low confidence suggestion
    if (metrics.avgConfidence < 0.7) {
      suggestions.push({
        type: 'query',
        priority: 'high',
        title: 'Low AI Confidence',
        description: `Average confidence is ${(metrics.avgConfidence * 100).toFixed(0)}%. Query enhancement could improve results.`,
        expectedImprovement: '15-25% better accuracy',
        implementationComplexity: 'easy'
      });
    }

    // Model optimization
    if (metrics.topModels.length > 1) {
      const bestModel = metrics.topModels[0];
      if (bestModel.avgPerformance > 0.8) {
        suggestions.push({
          type: 'model',
          priority: 'medium',
          title: 'Optimize Model Selection',
          description: `${bestModel.model} shows superior performance. Consider using it as default for similar queries.`,
          expectedImprovement: '10-20% better results',
          implementationComplexity: 'easy'
        });
      }
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  exportData(): string {
    return JSON.stringify({
      metrics: this.metrics,
      exportDate: new Date(),
      summary: this.getPerformanceMetrics()
    }, null, 2);
  }

  clearData(): void {
    this.metrics = [];
    this.saveToLocalStorage();
  }

  private getEmptyMetrics(): PerformanceMetrics {
    return {
      avgResponseTime: 0,
      totalQueries: 0,
      totalCost: 0,
      avgConfidence: 0,
      successRate: 0,
      topModels: [],
      queryTypeDistribution: {},
      timeSeriesData: []
    };
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('ai-analytics-metrics', JSON.stringify(this.metrics.slice(-100))); // Save last 100
    } catch (error) {
      console.warn('Failed to save analytics to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('ai-analytics-metrics');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.metrics = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load analytics from localStorage:', error);
    }
  }

  constructor() {
    this.loadFromLocalStorage();
  }
}

export const analyticsService = new AnalyticsService();
