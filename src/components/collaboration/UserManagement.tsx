
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, UserPlus, Mail, Shield, Settings, 
  MoreHorizontal, Edit, Trash2, Clock, Activity
} from 'lucide-react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { WorkspaceMember, WorkspaceRole } from '@/types/collaboration';
import { useToast } from '@/hooks/use-toast';

export const UserManagement: React.FC = () => {
  const { currentWorkspace, inviteMember, updateMemberRole, removeMember, activityLogs } = useCollaboration();
  const { toast } = useToast();
  
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'attorney' });
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null);

  const handleInviteMember = async () => {
    try {
      await inviteMember(inviteData.email, inviteData.role);
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteData.email}`,
      });
      setIsInviteDialogOpen(false);
      setInviteData({ email: '', role: 'attorney' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      await updateMemberRole(memberId, newRole);
      toast({
        title: "Role updated",
        description: "Member role has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(memberId);
      toast({
        title: "Member removed",
        description: "Member has been removed from the workspace",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: WorkspaceRole) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      senior_attorney: 'bg-blue-100 text-blue-800',
      attorney: 'bg-green-100 text-green-800',
      paralegal: 'bg-yellow-100 text-yellow-800',
      researcher: 'bg-orange-100 text-orange-800',
      guest: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || colors.guest;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  if (!currentWorkspace) {
    return (
      <Alert>
        <AlertDescription>
          No workspace selected. Please select a workspace to manage users.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage workspace members and permissions</p>
        </div>
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join this workspace
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@lawfirm.com"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={inviteData.role} 
                  onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attorney">Attorney</SelectItem>
                    <SelectItem value="senior_attorney">Senior Attorney</SelectItem>
                    <SelectItem value="paralegal">Paralegal</SelectItem>
                    <SelectItem value="researcher">Legal Researcher</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteMember}>
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Workspace Members ({currentWorkspace.members.length})
              </CardTitle>
              <CardDescription>
                Manage members and their roles in this workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentWorkspace.members.map((member) => (
                    <TableRow key={member.userId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {member.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(member.status)}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {member.lastActive.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {member.role !== 'owner' && (
                            <>
                              <Select onValueChange={(value) => handleUpdateRole(member.userId, value)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Change role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="attorney">Attorney</SelectItem>
                                  <SelectItem value="senior_attorney">Senior Attorney</SelectItem>
                                  <SelectItem value="paralegal">Paralegal</SelectItem>
                                  <SelectItem value="researcher">Researcher</SelectItem>
                                  <SelectItem value="guest">Guest</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveMember(member.userId)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Track user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{log.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {log.action} {log.resourceType} • {log.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <Badge variant="outline">{log.action}</Badge>
                  </div>
                ))}
                
                {activityLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Role Permissions
              </CardTitle>
              <CardDescription>
                Configure what each role can do in this workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['owner', 'admin', 'senior_attorney', 'attorney', 'paralegal', 'researcher', 'guest'].map((role) => (
                  <div key={role} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getRoleBadgeColor(role as WorkspaceRole)}>
                        {role.replace('_', ' ')}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Read Documents
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        AI Research
                      </div>
                      {role !== 'guest' && (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Write Documents
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Export Data
                          </div>
                        </>
                      )}
                      {['owner', 'admin'].includes(role) && (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Manage Workspace
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Invite Users
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
