
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, TrendingUp, TrendingDown, Zap, DollarSign, 
  Target, Clock, Database, Download, Trash2 
} from 'lucide-react';
import { analyticsService, PerformanceMetrics, OptimizationSuggestion } from '@/services/AnalyticsService';
import { cacheService, CacheMetrics } from '@/services/CacheService';

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [cacheMetrics, setCacheMetrics] = useState<CacheMetrics | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = () => {
    try {
      const performanceMetrics = analyticsService.getPerformanceMetrics();
      const cacheStats = cacheService.getMetrics();
      const optimizations = analyticsService.getOptimizationSuggestions();
      
      setMetrics(performanceMetrics);
      setCacheMetrics(cacheStats);
      setSuggestions(optimizations);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load metrics:', error);
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const data = analyticsService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      analyticsService.clearData();
      cacheService.clear();
      loadMetrics();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!metrics || !cacheMetrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">No performance data available yet. Start using the AI to see metrics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Queries</p>
                <p className="text-2xl font-bold">{metrics.totalQueries}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Response Time</p>
                <p className="text-2xl font-bold">{(metrics.avgResponseTime / 1000).toFixed(1)}s</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Success Rate</p>
                <p className="text-2xl font-bold">{(metrics.successRate * 100).toFixed(0)}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Cost</p>
                <p className="text-2xl font-bold">${metrics.totalCost.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cache Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Cache Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Hit Rate</p>
              <div className="flex items-center gap-2">
                <Progress value={cacheMetrics.hitRate * 100} className="flex-1" />
                <span className="text-sm font-medium">{(cacheMetrics.hitRate * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600">Cache Entries</p>
              <p className="text-lg font-semibold">{cacheMetrics.totalEntries}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Memory Usage</p>
              <p className="text-lg font-semibold">{(cacheMetrics.memoryUsage / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Performance */}
      {metrics.topModels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topModels.slice(0, 3).map((model, index) => (
                <div key={model.model} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-medium">{model.model}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">{model.usage} queries</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{(model.avgPerformance * 100).toFixed(0)}%</span>
                      {model.avgPerformance > 0.8 ? 
                        <TrendingUp className="w-4 h-4 text-green-600" /> : 
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{suggestion.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Expected: {suggestion.expectedImprovement}</span>
                    <span>Complexity: {suggestion.implementationComplexity}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
        <Button variant="outline" onClick={handleClearData} className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Clear Data
        </Button>
      </div>
    </div>
  );
};
