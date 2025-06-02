
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { 
  Search, FileText, BarChart3, Users, 
  Brain, Settings, HelpCircle, LogOut, Scale
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
    { id: 'research' as PageType, label: 'Legal Research', icon: Search, description: 'AI-powered legal research and analysis' },
    { id: 'documents' as PageType, label: 'Document Manager', icon: FileText, description: 'Upload and manage legal documents' },
    { id: 'reports' as PageType, label: 'Reports & Analytics', icon: BarChart3, description: 'Generate insights and reports' },
    { id: 'collaboration' as PageType, label: 'Collaboration', icon: Users, description: 'Team workspace and sharing' },
    { id: 'ai-enhancement' as PageType, label: 'AI Enhancement', icon: Brain, badge: 'NEW', description: 'Advanced AI settings and models' },
  ];

  return (
    <TooltipProvider>
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-smooth">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">LegisClear</h1>
              <p className="text-xs text-sidebar-foreground/70 leading-tight">AI Legal Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start h-11 px-3 transition-smooth ${
                      currentPage === item.id 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                    onClick={() => onPageChange(item.id)}
                  >
                    <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs bg-primary/10 text-primary border-primary/20">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="hidden lg:block">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator className="my-6 bg-sidebar-border" />

          <div className="space-y-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-11 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth"
                >
                  <Settings className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="flex-1 text-left">Settings</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Application settings and preferences</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-11 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth"
                >
                  <HelpCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="flex-1 text-left">Help & Support</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Documentation and support resources</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-sidebar-accent/50">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.email || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground/70">Premium Plan</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};
