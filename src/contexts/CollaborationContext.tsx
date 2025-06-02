
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workspace, WorkspaceMember, CollaborationProject, ActivityLog } from '@/types/collaboration';
import { useAuth } from '@/contexts/AuthContext';

interface CollaborationContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  projects: CollaborationProject[];
  activityLogs: ActivityLog[];
  isLoading: boolean;
  // Workspace management
  createWorkspace: (data: Partial<Workspace>) => Promise<Workspace>;
  updateWorkspace: (id: string, data: Partial<Workspace>) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
  switchWorkspace: (id: string) => Promise<void>;
  // Member management
  inviteMember: (email: string, role: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: string) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  // Project management
  createProject: (data: Partial<CollaborationProject>) => Promise<CollaborationProject>;
  updateProject: (id: string, data: Partial<CollaborationProject>) => Promise<CollaborationProject>;
  deleteProject: (id: string) => Promise<void>;
  // Activity tracking
  logActivity: (action: string, resourceType: string, resourceId: string, details?: any) => void;
  getActivityLogs: (filters?: any) => Promise<ActivityLog[]>;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

export const CollaborationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<CollaborationProject[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      initializeUserWorkspaces();
    }
  }, [user]);

  const initializeUserWorkspaces = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockWorkspace: Workspace = {
        id: '1',
        name: 'Mitchell & Associates',
        description: 'Main legal workspace',
        ownerId: user?.id || '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          isPublic: false,
          allowInvitations: true,
          defaultRole: 'attorney',
          retentionPolicy: 365,
          securityLevel: 'enhanced',
          integrations: []
        },
        members: [
          {
            userId: user?.id || '1',
            email: user?.email || 'sarah.mitchell@lawfirm.com',
            name: user?.name || 'Sarah Mitchell',
            role: 'owner',
            permissions: ['read_documents', 'write_documents', 'manage_workspace', 'invite_users'],
            joinedAt: new Date(),
            lastActive: new Date(),
            status: 'active'
          }
        ],
        projects: []
      };

      setWorkspaces([mockWorkspace]);
      setCurrentWorkspace(mockWorkspace);
    } catch (error) {
      console.error('Failed to initialize workspaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkspace = async (data: Partial<Workspace>): Promise<Workspace> => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name: data.name || 'New Workspace',
      description: data.description,
      ownerId: user?.id || '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        isPublic: false,
        allowInvitations: true,
        defaultRole: 'attorney',
        retentionPolicy: 365,
        securityLevel: 'standard',
        integrations: []
      },
      members: [
        {
          userId: user?.id || '1',
          email: user?.email || 'user@example.com',
          name: user?.name || 'User',
          role: 'owner',
          permissions: ['read_documents', 'write_documents', 'manage_workspace'],
          joinedAt: new Date(),
          lastActive: new Date(),
          status: 'active'
        }
      ],
      projects: []
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    logActivity('created', 'workspace', newWorkspace.id);
    return newWorkspace;
  };

  const updateWorkspace = async (id: string, data: Partial<Workspace>): Promise<Workspace> => {
    const updated = workspaces.find(w => w.id === id);
    if (!updated) throw new Error('Workspace not found');

    const updatedWorkspace = { ...updated, ...data, updatedAt: new Date() };
    setWorkspaces(prev => prev.map(w => w.id === id ? updatedWorkspace : w));
    
    if (currentWorkspace?.id === id) {
      setCurrentWorkspace(updatedWorkspace);
    }

    logActivity('updated', 'workspace', id);
    return updatedWorkspace;
  };

  const deleteWorkspace = async (id: string): Promise<void> => {
    setWorkspaces(prev => prev.filter(w => w.id !== id));
    if (currentWorkspace?.id === id) {
      setCurrentWorkspace(workspaces[0] || null);
    }
    logActivity('deleted', 'workspace', id);
  };

  const switchWorkspace = async (id: string): Promise<void> => {
    const workspace = workspaces.find(w => w.id === id);
    if (workspace) {
      setCurrentWorkspace(workspace);
      // Load projects for this workspace
      setProjects(workspace.projects);
    }
  };

  const inviteMember = async (email: string, role: string): Promise<void> => {
    // Mock implementation
    console.log('Inviting member:', email, 'with role:', role);
    logActivity('invited', 'user', email);
  };

  const updateMemberRole = async (memberId: string, role: string): Promise<void> => {
    console.log('Updating member role:', memberId, 'to:', role);
    logActivity('updated', 'user', memberId);
  };

  const removeMember = async (memberId: string): Promise<void> => {
    console.log('Removing member:', memberId);
    logActivity('removed', 'user', memberId);
  };

  const createProject = async (data: Partial<CollaborationProject>): Promise<CollaborationProject> => {
    const newProject: CollaborationProject = {
      id: Date.now().toString(),
      name: data.name || 'New Project',
      description: data.description,
      workspaceId: currentWorkspace?.id || '1',
      ownerId: user?.id || '1',
      collaborators: [],
      documents: [],
      searches: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      tags: data.tags || []
    };

    setProjects(prev => [...prev, newProject]);
    logActivity('created', 'project', newProject.id);
    return newProject;
  };

  const updateProject = async (id: string, data: Partial<CollaborationProject>): Promise<CollaborationProject> => {
    const updated = projects.find(p => p.id === id);
    if (!updated) throw new Error('Project not found');

    const updatedProject = { ...updated, ...data, updatedAt: new Date() };
    setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
    logActivity('updated', 'project', id);
    return updatedProject;
  };

  const deleteProject = async (id: string): Promise<void> => {
    setProjects(prev => prev.filter(p => p.id !== id));
    logActivity('deleted', 'project', id);
  };

  const logActivity = (action: string, resourceType: string, resourceId: string, details?: any) => {
    const activity: ActivityLog = {
      id: Date.now().toString(),
      userId: user?.id || 'unknown',
      userName: user?.name || 'Unknown User',
      action: action as any,
      resourceType: resourceType as any,
      resourceId,
      details: details || {},
      timestamp: new Date()
    };

    setActivityLogs(prev => [activity, ...prev].slice(0, 100)); // Keep last 100 activities
  };

  const getActivityLogs = async (filters?: any): Promise<ActivityLog[]> => {
    return activityLogs.filter(log => {
      if (filters?.resourceType && log.resourceType !== filters.resourceType) return false;
      if (filters?.userId && log.userId !== filters.userId) return false;
      return true;
    });
  };

  const value = {
    currentWorkspace,
    workspaces,
    projects,
    activityLogs,
    isLoading,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    switchWorkspace,
    inviteMember,
    updateMemberRole,
    removeMember,
    createProject,
    updateProject,
    deleteProject,
    logActivity,
    getActivityLogs
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};
