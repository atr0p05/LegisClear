
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FolderOpen, Plus, Users, FileText, Search, 
  Calendar, Clock, Star, MoreHorizontal, Edit,
  Share2, Archive, Trash2, MessageSquare, Shield
} from 'lucide-react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { CollaborationProject } from '@/types/collaboration';
import { useToast } from '@/hooks/use-toast';

export const ProjectCollaboration: React.FC = () => {
  const { projects, createProject, updateProject, deleteProject } = useCollaboration();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CollaborationProject | null>(null);
  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '', 
    tags: [] as string[] 
  });

  const handleCreateProject = async () => {
    try {
      await createProject(newProject);
      toast({
        title: "Project created",
        description: `${newProject.name} has been created successfully`,
      });
      setIsCreateDialogOpen(false);
      setNewProject({ name: '', description: '', tags: [] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (id: string, data: Partial<CollaborationProject>) => {
    try {
      await updateProject(id, data);
      toast({
        title: "Project updated",
        description: "Project has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      toast({
        title: "Project deleted",
        description: "Project has been permanently deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Collaboration</h2>
          <p className="text-muted-foreground">Manage collaborative research projects</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start a new collaborative research project
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Corporate Merger Analysis"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the project scope and objectives"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                <FolderOpen className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently in progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((total, project) => total + project.collaborators.length, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all projects
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your most recently active collaborative projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FolderOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{project.collaborators.length}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{project.documents.length}</span>
                      </div>
                      
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {projects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No projects yet. Create your first collaborative project to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.filter(p => p.status === 'active').map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Project Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  {/* Collaborators */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Team</span>
                      <span className="text-sm text-muted-foreground">
                        {project.collaborators.length} members
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.collaborators.slice(0, 3).map((collaborator, index) => (
                        <Avatar key={index} className="w-6 h-6">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xs">
                            {collaborator.userId.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.collaborators.length > 3 && (
                        <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs">
                          +{project.collaborators.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div>
                    <span className="text-sm font-medium">Recent Activity</span>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        <span>Document updated 2 hours ago</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="w-3 h-3" />
                        <span>New comment added 1 day ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <FolderOpen className="w-3 h-3 mr-1" />
                      Open Project
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Corporate Due Diligence",
                description: "Template for M&A due diligence projects",
                icon: FileText,
                color: "bg-blue-100 text-blue-600"
              },
              {
                name: "Litigation Support",
                description: "Organize case materials and research",
                icon: Search,
                color: "bg-red-100 text-red-600"
              },
              {
                name: "Compliance Review",
                description: "Regulatory compliance assessment",
                icon: Shield,
                color: "bg-green-100 text-green-600"
              }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${template.color}`}>
                      <template.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
