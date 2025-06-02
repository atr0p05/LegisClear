
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

interface PermissionGuardProps {
  permission?: string;
  role?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  role,
  fallback,
  children
}) => {
  const { hasPermission, hasRole, user } = useAuth();

  const hasAccess = () => {
    if (permission && !hasPermission(permission)) {
      return false;
    }
    if (role && !hasRole(role)) {
      return false;
    }
    return true;
  };

  if (!hasAccess()) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this feature. 
          {permission && ` Required permission: ${permission}`}
          {role && ` Required role: ${role}`}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
