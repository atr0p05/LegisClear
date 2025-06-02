
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, Plus, Settings, Shield, Users, 
  Calendar, Trash2, Edit, Save, Globe, Lock
} from 'lucide-react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { Workspace, WorkspaceSettings } from '@/types/collaboration';
import { useToast } from '@/hooks/use-toast';

export const WorkspaceManagement: React.FC = () => {
  const { 
    currentWorkspace, 
    workspaces, 
    createWorkspace, 
    updateWorkspace, 
    deleteWorkspace,
    switchWorkspace 
  } = useCollaboration();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings | null>(null);

  React.useEffect(() => {
    if (currentWorkspace) {
      setWorkspaceSettings(currentWorkspace.settings);
    }
  }, [currentWorkspace]);

  const handleCreateWorkspace = async () => {
    try {
      await createWorkspace(newWorkspace);
      toast({
        title: "Workspace created",
        description: `${newWorkspace.name} has been created successfully`,
      });
      setIsCreateDialogOpen(false);
      setNewWorkspace({ name: '', description: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workspace",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = async () => {
    if (!currentWorkspace || !workspaceSettings) return;
    
    try {
      await updateWorkspace(currentWorkspace.id, { settings: workspaceSettings });
      toast({
        title: "Settings updated",
        description: "Workspace settings have been saved",
      });
      setIsSettingsMode(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkspace = async (id: string) => {
    try {
      await deleteWorkspace(id);
      toast({
        title: "Workspace deleted",
        description: "Workspace has been permanently deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workspace",
        variant: "destructive",
      });
    }
  };

  const handleSwitchWorkspace = async (id: string) => {
    try {
      await switchWorkspace(id);
      toast({
        title: "Workspace switched",
        description: "You are now working in the selected workspace",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch workspace",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workspace Management</h2>
          <p className="text-muted-foreground">Manage workspaces and settings</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workspace</DialogTitle>
              <DialogDescription>
                Set up a new collaborative workspace for your team
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Corporate Legal Team"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the workspace purpose"
                  value={newWorkspace.description}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkspace}>
                <Building2 className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Workspace */}
            {currentWorkspace && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Current Workspace
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{currentWorkspace.name}</h3>
                    <p className="text-muted-foreground">{currentWorkspace.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{currentWorkspace.members.length} members</span>
                    </div>
                    <Badge variant={currentWorkspace.settings.isPublic ? "default" : "secondary"}>
                      {currentWorkspace.settings.isPublic ? (
                        <>
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Private
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Created: {currentWorkspace.createdAt.toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Workspaces */}
            <Card>
              <CardHeader>
                <CardTitle>All Workspaces</CardTitle>
                <CardDescription>Switch between your workspaces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workspaces.map((workspace) => (
                    <div key={workspace.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{workspace.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {workspace.members.length} members
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {currentWorkspace?.id === workspace.id ? (
                          <Badge variant="default">Current</Badge>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSwitchWorkspace(workspace.id)}
                          >
                            Switch
                          </Button>
                        )}
                        
                        {workspace.ownerId === currentWorkspace?.ownerId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteWorkspace(workspace.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          {currentWorkspace && workspaceSettings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Workspace Settings
                  </div>
                  <Button
                    variant={isSettingsMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsSettingsMode(!isSettingsMode)}
                  >
                    {isSettingsMode ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Settings
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="public">Public Workspace</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow anyone to discover and request access
                        </p>
                      </div>
                      <Switch
                        id="public"
                        checked={workspaceSettings.isPublic}
                        onCheckedChange={(checked) => 
                          setWorkspaceSettings(prev => prev ? { ...prev, isPublic: checked } : null)
                        }
                        disabled={!isSettingsMode}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="invitations">Allow Invitations</Label>
                        <p className="text-sm text-muted-foreground">
                          Members can invite others to join
                        </p>
                      </div>
                      <Switch
                        id="invitations"
                        checked={workspaceSettings.allowInvitations}
                        onCheckedChange={(checked) => 
                          setWorkspaceSettings(prev => prev ? { ...prev, allowInvitations: checked } : null)
                        }
                        disabled={!isSettingsMode}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="defaultRole">Default Role</Label>
                      <Select 
                        value={workspaceSettings.defaultRole} 
                        onValueChange={(value) => 
                          setWorkspaceSettings(prev => prev ? { ...prev, defaultRole: value as any } : null)
                        }
                        disabled={!isSettingsMode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attorney">Attorney</SelectItem>
                          <SelectItem value="paralegal">Paralegal</SelectItem>
                          <SelectItem value="researcher">Researcher</SelectItem>
                          <SelectItem value="guest">Guest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="retention">Data Retention (days)</Label>
                      <Input
                        id="retention"
                        type="number"
                        value={workspaceSettings.retentionPolicy}
                        onChange={(e) => 
                          setWorkspaceSettings(prev => prev ? { 
                            ...prev, 
                            retentionPolicy: parseInt(e.target.value) 
                          } : null)
                        }
                        disabled={!isSettingsMode}
                      />
                    </div>
                  </div>
                </div>
                
                {isSettingsMode && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSettingsMode(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateSettings}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="security">
          {currentWorkspace && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security and compliance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Security Level</Label>
                    <Select value={workspaceSettings?.securityLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="enhanced">Enhanced</SelectItem>
                        <SelectItem value="maximum">Maximum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Enabled for all members
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    All data is encrypted in transit and at rest. Activity logs are maintained for 90 days.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
