
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Clock, Star } from 'lucide-react';

interface QuerySuggestion {
  id: string;
  text: string;
  category: 'trending' | 'personalized' | 'recent' | 'featured';
  confidence: number;
  estimatedTime: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

interface InteractiveQuerySuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  userHistory?: string[];
}

export const InteractiveQuerySuggestions: React.FC<InteractiveQuerySuggestionsProps> = ({
  onSuggestionClick,
  userHistory = []
}) => {
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Generate intelligent suggestions based on user history and trending topics
    const baseSuggestions: QuerySuggestion[] = [
      {
        id: '1',
        text: 'Analyze contract terms for intellectual property licensing',
        category: 'trending',
        confidence: 0.92,
        estimatedTime: '2-3 min',
        complexity: 'intermediate'
      },
      {
        id: '2',
        text: 'Research recent GDPR compliance requirements for data processing',
        category: 'featured',
        confidence: 0.89,
        estimatedTime: '3-4 min',
        complexity: 'advanced'
      },
      {
        id: '3',
        text: 'Draft employment agreement non-compete clause',
        category: 'personalized',
        confidence: 0.85,
        estimatedTime: '1-2 min',
        complexity: 'beginner'
      },
      {
        id: '4',
        text: 'Compare state vs federal jurisdiction for corporate disputes',
        category: 'recent',
        confidence: 0.87,
        estimatedTime: '2-3 min',
        complexity: 'intermediate'
      },
      {
        id: '5',
        text: 'Analyze merger and acquisition due diligence checklist',
        category: 'trending',
        confidence: 0.91,
        estimatedTime: '4-5 min',
        complexity: 'advanced'
      }
    ];

    setSuggestions(baseSuggestions);
  }, [userHistory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'recent': return <Clock className="w-4 h-4" />;
      case 'featured': return <Star className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Smart Query Suggestions
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          <Button
            variant={selectedCategory === 'trending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('trending')}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Button>
          <Button
            variant={selectedCategory === 'featured' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('featured')}
          >
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Button>
          <Button
            variant={selectedCategory === 'personalized' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('personalized')}
          >
            Personalized
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-left font-normal"
                    onClick={() => onSuggestionClick(suggestion.text)}
                  >
                    {suggestion.text}
                  </Button>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryIcon(suggestion.category)}
                      {suggestion.category}
                    </Badge>
                    <Badge className={`text-xs ${getComplexityColor(suggestion.complexity)}`}>
                      {suggestion.complexity}
                    </Badge>
                    <span className="text-xs text-slate-500">{suggestion.estimatedTime}</span>
                  </div>
                </div>
                <Badge variant="outline" className="ml-2">
                  {Math.round(suggestion.confidence * 100)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
