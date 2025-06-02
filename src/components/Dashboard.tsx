
import React from 'react';
import { Search, File, Clock, User, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardProps {
  onViewChange: (view: 'dashboard' | 'query' | 'documents' | 'results') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const recentQueries = [
    { 
      query: "Contract enforceability under common law", 
      time: "2 hours ago",
      confidence: 92,
      type: "Contract Law"
    },
    { 
      query: "Employment termination procedures", 
      time: "1 day ago",
      confidence: 85,
      type: "Employment Law"
    },
    { 
      query: "Intellectual property licensing terms", 
      time: "2 days ago",
      confidence: 78,
      type: "IP Law"
    }
  ];

  const stats = [
    { 
      label: "Documents Processed", 
      value: "1,247", 
      icon: File, 
      trend: "+12%",
      description: "This month"
    },
    { 
      label: "Queries Completed", 
      value: "89", 
      icon: Search, 
      trend: "+8%",
      description: "This week"
    },
    { 
      label: "Research Hours Saved", 
      value: "156", 
      icon: Clock, 
      trend: "+23%",
      description: "Estimated"
    },
    { 
      label: "Active Projects", 
      value: "12", 
      icon: User, 
      trend: "+2",
      description: "Current"
    }
  ];

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge className="bg-confidence-high text-white">High</Badge>;
    if (confidence >= 75) return <Badge className="bg-confidence-medium text-white">Medium</Badge>;
    return <Badge className="bg-confidence-low text-white">Low</Badge>;
  };

  return (
    <div className="section-spacing px-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Good morning, Sarah</h1>
          <p className="text-lg text-muted-foreground">Here's your legal research overview for today</p>
        </div>
        <Button 
          onClick={() => onViewChange('query')}
          className="action-button bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 h-auto"
          size="lg"
        >
          <Search className="w-5 h-5 mr-2" />
          Start New Research
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="document-card group">
            <CardContent className="card-spacing">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="legal-caption">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/15 transition-smooth">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions and Recent Research */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 hover:bg-accent transition-smooth"
              onClick={() => onViewChange('query')}
            >
              <Search className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">Ask Legal Question</div>
                <div className="text-xs text-muted-foreground">AI-powered research assistant</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 hover:bg-accent transition-smooth"
              onClick={() => onViewChange('documents')}
            >
              <File className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">Upload Documents</div>
                <div className="text-xs text-muted-foreground">Add files to your library</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        <Card className="document-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Research</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentQueries.map((query, index) => (
              <div key={index} className="flex items-start justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="font-medium text-foreground line-clamp-2">{query.query}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{query.type}</Badge>
                    {getConfidenceBadge(query.confidence)}
                  </div>
                  <p className="legal-caption">{query.time}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-3 action-button">
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="document-card border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">System Update Available</p>
              <p className="text-sm text-amber-700">New AI models and enhanced search capabilities are ready for deployment.</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto border-amber-300 text-amber-700 hover:bg-amber-100">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
