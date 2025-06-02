
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from './UserManagement';
import { WorkspaceManagement } from './WorkspaceManagement';
import { ProjectCollaboration } from './ProjectCollaboration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, Building2, FolderOpen, Activity, 
  MessageSquare, Share2, Clock, TrendingUp
} from 'lucide-react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useAuth } from '@/contexts/AuthContext';

export const CollaborationDashboard: React.FC = () => {
  const { currentWorkspace, projects, activityLogs } = useCollaboration();
  const { user } = useAuth();

  const stats = [
    {
      title: "Team Members",
      value: currentWorkspace?.members.length || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Projects",
      value: projects.filter(p => p.status === 'active').length,
      icon: FolderOpen,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Recent Activities",
      value: activityLogs.length,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Shared Documents",
      value: projects.reduce((total, project) => total + project.documents.length, 0),
      icon: Share2,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Collaboration Hub</h1>
            <p className="text-muted-foreground">
              Manage teams, projects, and collaborative research
            </p>
          </div>
          
          {currentWorkspace && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">{currentWorkspace.name}</p>
                <p className="text-sm text-muted-foreground">Current Workspace</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest team activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLogs.slice(0, 6).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.userName}</span>
                            {' '}{activity.action} {activity.resourceType}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {activity.timestamp.toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="outline">{activity.action}</Badge>
                      </div>
                    ))}
                    
                    {activityLogs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No recent activity to display</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Team Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Team Performance
                  </CardTitle>
                  <CardDescription>Collaboration metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Collaborations</span>
                      <Badge className="bg-green-100 text-green-800">
                        {projects.filter(p => p.status === 'active').length} projects
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Documents Shared</span>
                      <Badge variant="outline">
                        {projects.reduce((total, project) => total + project.documents.length, 0)} docs
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Team Searches</span>
                      <Badge variant="outline">
                        {projects.reduce((total, project) => total + project.searches.length, 0)} searches
                      </Badge>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Detailed Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <ProjectCollaboration />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="workspaces">
            <WorkspaceManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
