
import React from 'react';
import { Book, Search, File, Home, User, LogOut, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: 'dashboard' | 'query' | 'documents' | 'results') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'query', label: 'Legal Research', icon: Search },
    { id: 'documents', label: 'Document Library', icon: File },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'senior_attorney': return 'bg-purple-500';
      case 'attorney': return 'bg-blue-500';
      case 'paralegal': return 'bg-green-500';
      case 'legal_researcher': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Book className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">LegalAI Pro</h1>
            <p className="text-slate-400 text-sm">Legal Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as any)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                activeView === item.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-3 h-auto text-left hover:bg-slate-800">
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{user?.name}</p>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getRoleBadgeColor(user?.role || '')}`}>
                      {formatRole(user?.role || '')}
                    </Badge>
                    {user?.mfaEnabled && (
                      <Shield className="w-3 h-3 text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {user?.organization && (
                  <p className="text-xs text-muted-foreground">{user?.organization}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              <span>Security</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
