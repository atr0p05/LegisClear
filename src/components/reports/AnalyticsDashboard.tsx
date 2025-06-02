
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Activity, Eye, Search,
  FileText, Clock, Users, Download
} from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  change?: number;
  color?: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [searchTrendsData, setSearchTrendsData] = useState<ChartData[]>([]);
  const [caseTypeData, setCaseTypeData] = useState<ChartData[]>([]);
  const [jurisdictionData, setJurisdictionData] = useState<ChartData[]>([]);
  const [performanceData, setPerformanceData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Load analytics data
    setSearchTrendsData([
      { name: 'Jan', value: 145, change: 12 },
      { name: 'Feb', value: 168, change: 8 },
      { name: 'Mar', value: 189, change: 15 },
      { name: 'Apr', value: 201, change: 6 },
      { name: 'May', value: 234, change: 16 },
      { name: 'Jun', value: 256, change: 9 }
    ]);

    setCaseTypeData([
      { name: 'Contract Law', value: 35, color: '#3B82F6' },
      { name: 'Corporate Law', value: 28, color: '#10B981' },
      { name: 'Criminal Law', value: 18, color: '#F59E0B' },
      { name: 'Civil Rights', value: 12, color: '#EF4444' },
      { name: 'Other', value: 7, color: '#6B7280' }
    ]);

    setJurisdictionData([
      { name: 'Federal', value: 42 },
      { name: 'California', value: 28 },
      { name: 'New York', value: 15 },
      { name: 'Texas', value: 9 },
      { name: 'Other', value: 6 }
    ]);

    setPerformanceData([
      { name: 'Week 1', value: 2.3 },
      { name: 'Week 2', value: 2.1 },
      { name: 'Week 3', value: 1.9 },
      { name: 'Week 4', value: 1.8 }
    ]);
  }, [selectedPeriod]);

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const kpiCards = [
    {
      title: 'Total Searches',
      value: '12,847',
      change: '+12.3%',
      trend: 'up',
      icon: Search,
      color: 'text-blue-600'
    },
    {
      title: 'Avg Response Time',
      value: '1.8s',
      change: '-0.2s',
      trend: 'down',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: '284',
      change: '+8.7%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Success Rate',
      value: '96.4%',
      change: '+2.1%',
      trend: 'up',
      icon: Activity,
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center mt-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Search Trends</TabsTrigger>
          <TabsTrigger value="categories">Case Categories</TabsTrigger>
          <TabsTrigger value="jurisdictions">Jurisdictions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Search Volume Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={searchTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    fill="rgba(59, 130, 246, 0.1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={caseTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {caseTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Searched Case Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{item.value}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jurisdictions">
          <Card>
            <CardHeader>
              <CardTitle>Search by Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={jurisdictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Average Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
