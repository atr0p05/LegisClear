
import { User } from '@/types/auth';

export const createMockUser = (email: string, name?: string): User => ({
  id: '1',
  email,
  name: name || 'Sarah Mitchell',
  role: 'senior_attorney',
  organization: 'Mitchell & Associates',
  mfaEnabled: true,
  lastLogin: new Date(),
  permissions: ['read_documents', 'write_documents', 'ai_research', 'manage_team']
});

export const createSignupUser = (email: string, name: string): User => ({
  id: Date.now().toString(),
  email,
  name,
  role: 'attorney',
  mfaEnabled: false,
  lastLogin: new Date(),
  permissions: ['read_documents', 'ai_research']
});

export const hasPermission = (user: User | null, permission: string): boolean => {
  return user?.permissions.includes(permission) || false;
};

export const hasRole = (user: User | null, role: string): boolean => {
  return user?.role === role || false;
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem('auth_token');
};
