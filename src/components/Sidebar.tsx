
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, FileText, BarChart3, Settings, 
  Home, LogOut, User, Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeView: 'dashboard' | 'query' | 'documents' | 'results' | 'reports';
  onViewChange: (view: 'dashboard' | 'query' | 'documents' | 'results' | 'reports') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'query', label: 'AI Legal Search', icon: Search },
    { id: 'documents', label: 'Document Manager', icon: FileText },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">LegalAI Pro</h1>
            <p className="text-sm text-slate-600">Legal Research Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange(item.id as any)}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
            {item.id === 'reports' && (
              <Badge className="ml-auto bg-green-100 text-green-800">New</Badge>
            )}
          </Button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">{user?.email}</p>
            <p className="text-xs text-slate-600">Legal Professional</p>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
