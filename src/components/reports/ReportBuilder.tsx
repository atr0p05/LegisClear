
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Trash2, Move, Eye, Save, Play,
  FileText, BarChart3, PieChart, Table
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'chart' | 'table';
  source: string;
  required: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: ReportField[];
}

export const ReportBuilder: React.FC = () => {
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [reportFields, setReportFields] = useState<ReportField[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);

  const templates: ReportTemplate[] = [
    {
      id: 'case-analysis',
      name: 'Case Law Analysis',
      description: 'Comprehensive analysis of case law trends and precedents',
      category: 'Legal Analysis',
      fields: [
        { id: '1', name: 'Case Citations', type: 'table', source: 'cases', required: true },
        { id: '2', name: 'Trend Analysis', type: 'chart', source: 'analytics', required: true },
        { id: '3', name: 'Summary', type: 'text', source: 'summary', required: false }
      ]
    },
    {
      id: 'compliance-audit',
      name: 'Compliance Audit',
      description: 'Track compliance status across multiple jurisdictions',
      category: 'Compliance',
      fields: [
        { id: '1', name: 'Compliance Status', type: 'chart', source: 'compliance', required: true },
        { id: '2', name: 'Risk Assessment', type: 'table', source: 'risks', required: true },
        { id: '3', name: 'Action Items', type: 'table', source: 'actions', required: false }
      ]
    }
  ];

  const fieldTypes = [
    { value: 'text', label: 'Text Field', icon: FileText },
    { value: 'number', label: 'Number', icon: FileText },
    { value: 'date', label: 'Date', icon: FileText },
    { value: 'chart', label: 'Chart', icon: BarChart3 },
    { value: 'table', label: 'Table', icon: Table }
  ];

  const dataSources = [
    { value: 'cases', label: 'Case Database' },
    { value: 'statutes', label: 'Statutes & Regulations' },
    { value: 'analytics', label: 'Search Analytics' },
    { value: 'compliance', label: 'Compliance Data' },
    { value: 'performance', label: 'Performance Metrics' }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setReportName(template.name);
      setReportDescription(template.description);
      setReportFields([...template.fields]);
    }
  };

  const addField = () => {
    const newField: ReportField = {
      id: Date.now().toString(),
      name: 'New Field',
      type: 'text',
      source: 'cases',
      required: false
    };
    setReportFields([...reportFields, newField]);
  };

  const removeField = (fieldId: string) => {
    setReportFields(reportFields.filter(f => f.id !== fieldId));
  };

  const updateField = (fieldId: string, updates: Partial<ReportField>) => {
    setReportFields(reportFields.map(f => 
      f.id === fieldId ? { ...f, ...updates } : f
    ));
  };

  const handleSave = async () => {
    if (!reportName.trim()) {
      toast.error('Please enter a report name');
      return;
    }

    setIsBuilding(true);
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Report template saved successfully');
    } catch (error) {
      toast.error('Failed to save report template');
    } finally {
      setIsBuilding(false);
    }
  };

  const handleGenerate = async () => {
    if (!reportName.trim() || reportFields.length === 0) {
      toast.error('Please configure your report before generating');
      return;
    }

    setIsBuilding(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template">Use Template</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-slate-600">{template.category}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="report-description">Description</Label>
            <Textarea
              id="report-description"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Describe what this report will analyze"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Report Fields</CardTitle>
          <Button onClick={addField} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </CardHeader>
        <CardContent>
          {reportFields.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No fields configured yet</p>
              <p className="text-sm">Add fields to define your report structure</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reportFields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Move className="w-4 h-4 text-slate-400 cursor-move" />
                      <span className="font-medium">Field {index + 1}</span>
                      {field.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Field Name</Label>
                      <Input
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        placeholder="Field name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Field Type</Label>
                      <Select 
                        value={field.type} 
                        onValueChange={(value) => updateField(field.id, { type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="w-4 h-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Data Source</Label>
                      <Select 
                        value={field.source} 
                        onValueChange={(value) => updateField(field.id, { source: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dataSources.map(source => (
                            <SelectItem key={source.value} value={source.value}>
                              {source.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`required-${field.id}`}
                      checked={field.required}
                      onCheckedChange={(checked) => 
                        updateField(field.id, { required: checked as boolean })
                      }
                    />
                    <Label htmlFor={`required-${field.id}`}>Required field</Label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={isBuilding}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
          <Button onClick={handleGenerate} disabled={isBuilding}>
            <Play className="w-4 h-4 mr-2" />
            {isBuilding ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>
    </div>
  );
};
