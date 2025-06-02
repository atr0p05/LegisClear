
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Search, FileText, BarChart3, Users, 
  Brain, Settings, HelpCircle, LogOut
} from 'lucide-react';
import type { PageType } from '@/pages/Index';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'research' as PageType, label: 'Legal Research', icon: Search },
    { id: 'documents' as PageType, label: 'Document Manager', icon: FileText },
    { id: 'reports' as PageType, label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'collaboration' as PageType, label: 'Collaboration', icon: Users },
    { id: 'ai-enhancement' as PageType, label: 'AI Enhancement', icon: Brain, badge: 'NEW' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Legal AI Research</h1>
        <p className="text-sm text-slate-600 mt-1">Advanced Legal Intelligence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onPageChange(item.id)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="w-4 h-4 mr-3" />
            Help & Support
          </Button>
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">
              {user?.email || 'User'}
            </p>
            <p className="text-xs text-slate-600">Premium Plan</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
