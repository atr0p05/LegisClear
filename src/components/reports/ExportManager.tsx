
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Download, FileText, Mail, Calendar, Clock,
  Settings, Play, Pause, Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface ScheduledExport {
  id: string;
  name: string;
  format: string;
  frequency: string;
  lastRun: string;
  status: 'active' | 'paused';
  recipients: string[];
}

export const ExportManager: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedSections, setSelectedSections] = useState<string[]>(['summary', 'charts']);
  const [isExporting, setIsExporting] = useState(false);
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([
    {
      id: '1',
      name: 'Weekly Performance Report',
      format: 'PDF',
      frequency: 'Weekly',
      lastRun: '2024-01-15',
      status: 'active',
      recipients: ['legal@company.com', 'manager@company.com']
    },
    {
      id: '2',
      name: 'Monthly Compliance Summary',
      format: 'Excel',
      frequency: 'Monthly',
      lastRun: '2024-01-01',
      status: 'active',
      recipients: ['compliance@company.com']
    }
  ]);

  const exportFormats = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'excel', label: 'Excel Spreadsheet', icon: FileText },
    { value: 'word', label: 'Word Document', icon: FileText },
    { value: 'csv', label: 'CSV Data', icon: FileText }
  ];

  const reportSections = [
    { id: 'summary', label: 'Executive Summary' },
    { id: 'charts', label: 'Charts & Visualizations' },
    { id: 'tables', label: 'Data Tables' },
    { id: 'compliance', label: 'Compliance Status' },
    { id: 'metrics', label: 'Performance Metrics' },
    { id: 'recommendations', label: 'Recommendations' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleExport = async () => {
    if (selectedSections.length === 0) {
      toast.error('Please select at least one section to export');
      return;
    }

    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success(`Report exported successfully as ${selectedFormat.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleScheduledExport = (exportId: string) => {
    setScheduledExports(prev => 
      prev.map(exp => 
        exp.id === exportId 
          ? { ...exp, status: exp.status === 'active' ? 'paused' : 'active' }
          : exp
      )
    );
  };

  const deleteScheduledExport = (exportId: string) => {
    setScheduledExports(prev => prev.filter(exp => exp.id !== exportId));
    toast.success('Scheduled export deleted');
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {exportFormats.map(format => (
                <div
                  key={format.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFormat === format.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedFormat(format.value)}
                >
                  <div className="flex items-center gap-2">
                    <format.icon className="w-5 h-5" />
                    <span className="font-medium">{format.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Selection */}
          <div className="space-y-3">
            <Label>Include Sections</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {reportSections.map(section => (
                <div key={section.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={section.id}
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={() => handleSectionToggle(section.id)}
                  />
                  <Label htmlFor={section.id}>{section.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select defaultValue="30d">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Email Recipients (optional)</Label>
              <Input placeholder="email@company.com, email2@company.com" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleExport} disabled={isExporting}>
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Exports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Scheduled Exports</CardTitle>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            New Schedule
          </Button>
        </CardHeader>
        <CardContent>
          {scheduledExports.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No scheduled exports yet</p>
              <p className="text-sm">Create automated reports to save time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledExports.map(exportItem => (
                <div key={exportItem.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{exportItem.name}</h4>
                      <p className="text-sm text-slate-600">
                        {exportItem.format} • {exportItem.frequency} • Last run: {exportItem.lastRun}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={exportItem.status === 'active' ? 'default' : 'secondary'}
                      >
                        {exportItem.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      {exportItem.recipients.length} recipient(s)
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleScheduledExport(exportItem.id)}
                      >
                        {exportItem.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteScheduledExport(exportItem.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Export Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
              <h4 className="font-medium mb-2">Executive Summary</h4>
              <p className="text-sm text-slate-600 mb-3">
                High-level overview with key metrics and insights
              </p>
              <Badge variant="outline">PDF Template</Badge>
            </div>

            <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
              <h4 className="font-medium mb-2">Detailed Analytics</h4>
              <p className="text-sm text-slate-600 mb-3">
                Comprehensive data analysis with charts and tables
              </p>
              <Badge variant="outline">Excel Template</Badge>
            </div>

            <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
              <h4 className="font-medium mb-2">Compliance Report</h4>
              <p className="text-sm text-slate-600 mb-3">
                Regulatory compliance status and recommendations
              </p>
              <Badge variant="outline">Word Template</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
