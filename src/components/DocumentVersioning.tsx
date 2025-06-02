
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Clock, User, FileText, GitBranch, Download, Eye, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentVersion {
  id: string;
  version: string;
  createdAt: string;
  createdBy: string;
  comment: string;
  changes: string[];
  size: string;
  status: 'current' | 'archived' | 'draft';
}

interface DocumentVersioningProps {
  documentId: string;
  documentTitle: string;
  currentVersion: string;
}

export const DocumentVersioning: React.FC<DocumentVersioningProps> = ({
  documentId,
  documentTitle,
  currentVersion
}) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([
    {
      id: '1',
      version: '3.0',
      createdAt: '2024-06-02',
      createdBy: 'Sarah Johnson',
      comment: 'Updated clause 5.2 regarding intellectual property rights',
      changes: ['Modified section 5.2', 'Added new definitions', 'Updated signature block'],
      size: '298 KB',
      status: 'current'
    },
    {
      id: '2',
      version: '2.1',
      createdAt: '2024-05-28',
      createdBy: 'Mike Chen',
      comment: 'Minor corrections to formatting and typos',
      changes: ['Fixed formatting in section 3', 'Corrected typos', 'Updated footer'],
      size: '295 KB',
      status: 'archived'
    },
    {
      id: '3',
      version: '2.0',
      createdAt: '2024-05-20',
      createdBy: 'Sarah Johnson',
      comment: 'Major revision with new compensation structure',
      changes: ['Rewrote section 4 - Compensation', 'Added new benefit clauses', 'Updated termination conditions'],
      size: '289 KB',
      status: 'archived'
    },
    {
      id: '4',
      version: '1.0',
      createdAt: '2024-05-10',
      createdBy: 'Legal Department',
      comment: 'Initial version of the employment agreement',
      changes: ['Initial document creation'],
      size: '275 KB',
      status: 'archived'
    }
  ]);

  const [newVersionComment, setNewVersionComment] = useState('');
  const [showCreateVersion, setShowCreateVersion] = useState(false);

  const handleCreateNewVersion = () => {
    if (!newVersionComment.trim()) {
      toast.error('Please provide a comment for the new version');
      return;
    }

    const newVersion: DocumentVersion = {
      id: Date.now().toString(),
      version: getNextVersion(currentVersion),
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Current User',
      comment: newVersionComment,
      changes: ['New version created'],
      size: '300 KB',
      status: 'current'
    };

    setVersions(prev => [newVersion, ...prev.map(v => ({ ...v, status: 'archived' as const }))]);
    setNewVersionComment('');
    setShowCreateVersion(false);
    toast.success('New version created successfully');
  };

  const getNextVersion = (current: string): string => {
    const parts = current.split('.');
    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1] || '0');
    return `${major}.${minor + 1}`;
  };

  const handleDownloadVersion = (version: DocumentVersion) => {
    toast.success(`Downloading ${documentTitle} v${version.version}...`);
  };

  const handleRestoreVersion = (version: DocumentVersion) => {
    toast.success(`Restored document to version ${version.version}`);
  };

  const getStatusColor = (status: DocumentVersion['status']) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Document Versions
          </CardTitle>
          <Dialog open={showCreateVersion} onOpenChange={setShowCreateVersion}>
            <DialogTrigger asChild>
              <Button size="sm">
                Create New Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Version</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="version-comment">Version Comment</Label>
                  <Textarea
                    id="version-comment"
                    placeholder="Describe the changes made in this version..."
                    value={newVersionComment}
                    onChange={(e) => setNewVersionComment(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateVersion(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNewVersion}>
                    Create Version
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {versions.map((version, index) => (
              <div key={version.id}>
                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">Version {version.version}</h3>
                      <Badge className={getStatusColor(version.status)}>
                        {version.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {version.createdAt}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {version.createdBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {version.size}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-1">
                        <MessageCircle className="w-4 h-4 mt-0.5" />
                        <span>{version.comment}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Changes:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {version.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadVersion(version)}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    {version.status !== 'current' && (
                      <Button variant="outline" size="sm" onClick={() => handleRestoreVersion(version)}>
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
                {index < versions.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
