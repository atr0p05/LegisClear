
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'senior_attorney' | 'attorney' | 'paralegal' | 'legal_researcher' | 'read_only';
  organization?: string;
  mfaEnabled: boolean;
  lastLogin: Date;
  permissions: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<{ success: boolean; requiresMfa?: boolean; error?: string }>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  enableMfa: () => Promise<{ success: boolean; qrCode?: string; error?: string }>;
  verifyMfa: (code: string) => Promise<{ success: boolean; error?: string }>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export interface LoginResult {
  success: boolean;
  requiresMfa?: boolean;
  error?: string;
}

export interface SignupResult {
  success: boolean;
  error?: string;
}

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

export interface MfaResult {
  success: boolean;
  qrCode?: string;
  error?: string;
}
