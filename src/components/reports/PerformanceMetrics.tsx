
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { 
  Clock, Users, Search, Target, TrendingUp, 
  Activity, Zap, Award, DollarSign
} from 'lucide-react';

interface MetricData {
  name: string;
  value: number;
  target?: number;
  change?: number;
}

export const PerformanceMetrics: React.FC = () => {
  const [searchMetrics, setSearchMetrics] = useState<MetricData[]>([]);
  const [userMetrics, setUserMetrics] = useState<MetricData[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<MetricData[]>([]);

  useEffect(() => {
    setSearchMetrics([
      { name: 'Avg Response Time', value: 1.8, target: 2.0, change: -10 },
      { name: 'Success Rate', value: 96.4, target: 95.0, change: 2.1 },
      { name: 'User Satisfaction', value: 4.7, target: 4.5, change: 4.4 },
      { name: 'Query Accuracy', value: 89.2, target: 85.0, change: 3.8 }
    ]);

    setUserMetrics([
      { name: 'Daily Active Users', value: 284, change: 8.7 },
      { name: 'Searches per User', value: 12.4, change: 15.2 },
      { name: 'Session Duration', value: 24.6, change: -2.1 },
      { name: 'Return Rate', value: 73.8, change: 5.4 }
    ]);

    setEfficiencyData([
      { name: 'Week 1', value: 45.2 },
      { name: 'Week 2', value: 47.8 },
      { name: 'Week 3', value: 52.1 },
      { name: 'Week 4', value: 56.3 }
    ]);
  }, []);

  const performanceKPIs = [
    {
      title: 'Research Efficiency',
      value: '156%',
      change: '+12%',
      icon: Zap,
      color: 'text-blue-600',
      description: 'vs traditional methods'
    },
    {
      title: 'Cost Savings',
      value: '$12.4K',
      change: '+18%',
      icon: DollarSign,
      color: 'text-green-600',
      description: 'this month'
    },
    {
      title: 'Time Saved',
      value: '847h',
      change: '+23%',
      icon: Clock,
      color: 'text-purple-600',
      description: 'total hours'
    },
    {
      title: 'Quality Score',
      value: '4.8/5',
      change: '+0.2',
      icon: Award,
      color: 'text-orange-600',
      description: 'user rating'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceKPIs.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">{kpi.change}</span>
                    <span className="text-xs text-slate-500 ml-1">{kpi.description}</span>
                  </div>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{metric.name}</h4>
                  <Badge variant={metric.value >= (metric.target || 0) ? "default" : "secondary"}>
                    {metric.change && metric.change > 0 ? '+' : ''}{metric.change}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {metric.value}{metric.name.includes('Time') ? 's' : metric.name.includes('Rate') ? '%' : ''}</span>
                    {metric.target && (
                      <span className="text-slate-600">Target: {metric.target}</span>
                    )}
                  </div>
                  {metric.target && (
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="w-full" 
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Engagement Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-slate-600">{metric.name}</p>
                <div className="flex items-center justify-center mt-2">
                  {metric.change && metric.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-600 mr-1 transform rotate-180" />
                  )}
                  <span className={`text-sm ${metric.change && metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change && metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Research Efficiency Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Performance Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <h4 className="font-medium">Reduce average response time to under 1.5s</h4>
                <p className="text-sm text-slate-600">Current: 1.8s</p>
              </div>
              <div className="text-right">
                <Progress value={75} className="w-32 mb-1" />
                <span className="text-sm text-slate-600">75% to goal</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <h4 className="font-medium">Achieve 98% search success rate</h4>
                <p className="text-sm text-slate-600">Current: 96.4%</p>
              </div>
              <div className="text-right">
                <Progress value={85} className="w-32 mb-1" />
                <span className="text-sm text-slate-600">85% to goal</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <h4 className="font-medium">Increase user satisfaction to 4.9/5</h4>
                <p className="text-sm text-slate-600">Current: 4.7/5</p>
              </div>
              <div className="text-right">
                <Progress value={92} className="w-32 mb-1" />
                <span className="text-sm text-slate-600">92% to goal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
