
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  settings: WorkspaceSettings;
  members: WorkspaceMember[];
  projects: CollaborationProject[];
}

export interface WorkspaceMember {
  userId: string;
  email: string;
  name: string;
  role: WorkspaceRole;
  permissions: Permission[];
  joinedAt: Date;
  lastActive: Date;
  status: 'active' | 'pending' | 'suspended';
}

export interface WorkspaceSettings {
  isPublic: boolean;
  allowInvitations: boolean;
  defaultRole: WorkspaceRole;
  retentionPolicy: number; // days
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  integrations: string[];
}

export interface CollaborationProject {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  ownerId: string;
  collaborators: ProjectCollaborator[];
  documents: SharedDocument[];
  searches: SharedSearch[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'archived';
  tags: string[];
}

export interface ProjectCollaborator {
  userId: string;
  role: ProjectRole;
  permissions: Permission[];
  addedAt: Date;
  addedBy: string;
}

export interface SharedDocument {
  id: string;
  title: string;
  content: string;
  type: 'case' | 'statute' | 'regulation' | 'note' | 'brief';
  projectId: string;
  ownerId: string;
  collaborators: DocumentCollaborator[];
  versions: DocumentVersion[];
  comments: DocumentComment[];
  createdAt: Date;
  updatedAt: Date;
  isLocked: boolean;
  lockedBy?: string;
}

export interface DocumentCollaborator {
  userId: string;
  permissions: DocumentPermission[];
  lastAccessed: Date;
}

export interface DocumentVersion {
  id: string;
  version: number;
  content: string;
  authorId: string;
  changes: string;
  createdAt: Date;
  isActive: boolean;
}

export interface DocumentComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  isResolved: boolean;
  replies: DocumentComment[];
  position?: { start: number; end: number };
}

export interface SharedSearch {
  id: string;
  query: string;
  filters: Record<string, any>;
  results: any[];
  projectId: string;
  authorId: string;
  collaborators: string[];
  createdAt: Date;
  description?: string;
  tags: string[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  resourceType: 'workspace' | 'project' | 'document' | 'search' | 'user';
  resourceId: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export type WorkspaceRole = 'owner' | 'admin' | 'senior_attorney' | 'attorney' | 'paralegal' | 'researcher' | 'guest';
export type ProjectRole = 'lead' | 'contributor' | 'reviewer' | 'viewer';
export type Permission = 
  | 'read_documents' 
  | 'write_documents' 
  | 'delete_documents'
  | 'manage_projects'
  | 'invite_users'
  | 'manage_workspace'
  | 'export_data'
  | 'manage_permissions'
  | 'view_analytics'
  | 'ai_research';

export type DocumentPermission = 'read' | 'write' | 'comment' | 'review' | 'approve';

export type ActivityAction = 
  | 'created'
  | 'updated' 
  | 'deleted'
  | 'shared'
  | 'commented'
  | 'invited'
  | 'joined'
  | 'left'
  | 'locked'
  | 'unlocked'
  | 'exported'
  | 'searched';
