
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Eye, Edit, MessageCircle, Clock } from 'lucide-react';

interface ActiveUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'viewing' | 'editing' | 'idle';
  lastActivity: Date;
  currentSection?: string;
}

interface CollaborationIndicatorsProps {
  projectId: string;
  currentUserId: string;
}

export const CollaborationIndicators: React.FC<CollaborationIndicatorsProps> = ({
  projectId,
  currentUserId
}) => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    // Simulate real-time collaboration data
    const mockUsers: ActiveUser[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: '/placeholder.svg',
        status: 'editing',
        lastActivity: new Date(Date.now() - 30000), // 30 seconds ago
        currentSection: 'Contract Analysis'
      },
      {
        id: '2',
        name: 'Mike Chen',
        status: 'viewing',
        lastActivity: new Date(Date.now() - 120000), // 2 minutes ago
        currentSection: 'Case Research'
      },
      {
        id: '3',
        name: 'Emily Davis',
        status: 'idle',
        lastActivity: new Date(Date.now() - 300000), // 5 minutes ago
      }
    ];

    setActiveUsers(mockUsers.filter(user => user.id !== currentUserId));

    const activities = [
      'Sarah added comments to Contract Analysis',
      'Mike updated the research notes',
      'Emily shared new precedent cases',
      'System auto-saved project changes'
    ];

    setRecentActivity(activities);
  }, [projectId, currentUserId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'editing': return <Edit className="w-3 h-3" />;
      case 'viewing': return <Eye className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'editing': return 'bg-green-500';
      case 'viewing': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return `${Math.floor(diffMinutes / 60)}h ago`;
  };

  return (
    <div className="space-y-4">
      {/* Active Users */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4" />
            <span className="font-medium text-sm">Active Collaborators</span>
            <Badge variant="outline">{activeUsers.length}</Badge>
          </div>
          
          <div className="space-y-2">
            {activeUsers.map((user) => (
              <TooltipProvider key={user.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50">
                      <div className="relative">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{user.name}</div>
                        {user.currentSection && (
                          <div className="text-xs text-slate-500 truncate">
                            {user.currentSection}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(user.status)}
                        <span className="text-xs text-slate-500">
                          {formatLastActivity(user.lastActivity)}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-slate-400">
                        {user.status === 'editing' && 'Currently editing'}
                        {user.status === 'viewing' && 'Currently viewing'}
                        {user.status === 'idle' && 'Idle'}
                      </div>
                      {user.currentSection && (
                        <div className="text-slate-400">in {user.currentSection}</div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium text-sm">Recent Activity</span>
          </div>
          
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="text-xs text-slate-600 p-2 bg-slate-50 rounded">
                {activity}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
