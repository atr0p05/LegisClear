
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, 
  FileText, Calendar, Bell, Target
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  requirement: string;
  jurisdiction: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  dueDate: string;
  progress: number;
  priority: 'high' | 'medium' | 'low';
}

export const ComplianceDashboard: React.FC = () => {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [overallScore, setOverallScore] = useState(87);

  useEffect(() => {
    setComplianceItems([
      {
        id: '1',
        requirement: 'GDPR Data Protection Compliance',
        jurisdiction: 'European Union',
        status: 'compliant',
        dueDate: '2024-05-25',
        progress: 100,
        priority: 'high'
      },
      {
        id: '2',
        requirement: 'CCPA Privacy Policy Updates',
        jurisdiction: 'California',
        status: 'warning',
        dueDate: '2024-03-15',
        progress: 75,
        priority: 'medium'
      },
      {
        id: '3',
        requirement: 'SOX Financial Reporting',
        jurisdiction: 'Federal',
        status: 'non-compliant',
        dueDate: '2024-02-28',
        progress: 45,
        priority: 'high'
      }
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'non-compliant': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Compliance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Overall Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold">{overallScore}%</p>
              <p className="text-slate-600">Compliance Rating</p>
            </div>
            <div className="text-right">
              <Badge className={overallScore >= 90 ? 'bg-green-100 text-green-800' : 
                              overallScore >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}>
                {overallScore >= 90 ? 'Excellent' : 
                 overallScore >= 70 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
          </div>
          <Progress value={overallScore} className="w-full" />
        </CardContent>
      </Card>

      {/* Compliance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Compliant</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Warnings</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Non-Compliant</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Active Compliance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                SOX Financial Reporting deadline approaching in 15 days. Current progress: 45%
              </AlertDescription>
            </Alert>
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                CCPA Privacy Policy review scheduled for next week.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Items */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceItems.map(item => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <h4 className="font-medium">{item.requirement}</h4>
                      <p className="text-sm text-slate-600">{item.jurisdiction}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(item.priority)} variant="outline">
                      {item.priority} priority
                    </Badge>
                    <Badge className={getStatusColor(item.status)} variant="outline">
                      {item.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="w-full" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Target className="w-4 h-4 mr-2" />
                      Update Progress
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
