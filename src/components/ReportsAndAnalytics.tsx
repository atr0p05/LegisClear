
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, FileText, Download, Calendar, TrendingUp,
  Users, Clock, DollarSign, Target, AlertTriangle
} from 'lucide-react';
import { ReportBuilder } from '@/components/reports/ReportBuilder';
import { AnalyticsDashboard } from '@/components/reports/AnalyticsDashboard';
import { ComplianceDashboard } from '@/components/reports/ComplianceDashboard';
import { PerformanceMetrics } from '@/components/reports/PerformanceMetrics';
import { ExportManager } from '@/components/reports/ExportManager';
import { toast } from 'sonner';

interface ReportSummary {
  id: string;
  name: string;
  type: 'case-analysis' | 'compliance' | 'performance' | 'custom';
  lastRun: string;
  status: 'completed' | 'running' | 'failed';
  size: string;
}

export const ReportsAndAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [recentReports, setRecentReports] = useState<ReportSummary[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    // Load recent reports
    setRecentReports([
      {
        id: '1',
        name: 'Q4 Case Law Analysis',
        type: 'case-analysis',
        lastRun: '2024-01-15',
        status: 'completed',
        size: '2.4 MB'
      },
      {
        id: '2', 
        name: 'Compliance Status Report',
        type: 'compliance',
        lastRun: '2024-01-14',
        status: 'completed',
        size: '1.8 MB'
      },
      {
        id: '3',
        name: 'Research Performance Metrics',
        type: 'performance',
        lastRun: '2024-01-13',
        status: 'completed',
        size: '956 KB'
      }
    ]);
  }, []);

  const handleQuickReport = async (reportType: string) => {
    setIsGeneratingReport(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${reportType} report generated successfully`);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'case-analysis': return <BarChart3 className="w-4 h-4" />;
      case 'compliance': return <Target className="w-4 h-4" />;
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
            <p className="text-slate-600 mt-1">Generate insights and track performance across your legal research</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="builder">Report Builder</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="exports">Exports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Total Reports</p>
                      <p className="text-2xl font-bold">127</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Avg Generation Time</p>
                      <p className="text-2xl font-bold">2.3s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Active Users</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Cost Savings</p>
                      <p className="text-2xl font-bold">$12.4K</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => handleQuickReport('Case Analysis')}
                    disabled={isGeneratingReport}
                  >
                    <BarChart3 className="w-6 h-6 mb-2" />
                    Case Analysis Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => handleQuickReport('Compliance')}
                    disabled={isGeneratingReport}
                  >
                    <Target className="w-6 h-6 mb-2" />
                    Compliance Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => handleQuickReport('Performance')}
                    disabled={isGeneratingReport}
                  >
                    <TrendingUp className="w-6 h-6 mb-2" />
                    Performance Metrics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map(report => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(report.type)}
                        <div>
                          <h4 className="font-medium">{report.name}</h4>
                          <p className="text-sm text-slate-600">Generated on {report.lastRun}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(report.status)} variant="outline">
                          {report.status}
                        </Badge>
                        <span className="text-sm text-slate-600">{report.size}</span>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="builder">
            <ReportBuilder />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceDashboard />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMetrics />
          </TabsContent>

          <TabsContent value="exports">
            <ExportManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
