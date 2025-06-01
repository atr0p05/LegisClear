
import React from 'react';
import { Search, File, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onViewChange: (view: 'dashboard' | 'query' | 'documents' | 'results') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const recentQueries = [
    { query: "Contract enforceability under common law", time: "2 hours ago" },
    { query: "Employment termination procedures", time: "1 day ago" },
    { query: "Intellectual property licensing terms", time: "2 days ago" }
  ];

  const stats = [
    { label: "Documents Processed", value: "1,247", icon: File },
    { label: "Queries This Month", value: "89", icon: Search },
    { label: "Research Hours Saved", value: "156", icon: Clock },
    { label: "Active Projects", value: "12", icon: User }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Good morning, Sarah</h1>
          <p className="text-slate-600 mt-1">Here's your legal research overview for today</p>
        </div>
        <Button 
          onClick={() => onViewChange('query')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          Start New Research
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
              onClick={() => onViewChange('query')}
            >
              <Search className="w-5 h-5 mr-3" />
              Ask Legal Question
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
              onClick={() => onViewChange('documents')}
            >
              <File className="w-5 h-5 mr-3" />
              Upload Documents
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Recent Research</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 truncate">{query.query}</p>
                  <p className="text-slate-500 text-sm">{query.time}</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
