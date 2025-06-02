
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuditEvent {
  userId: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

class AuditService {
  private events: AuditEvent[] = [];

  logEvent(action: string, resource: string, details?: Record<string, any>, userId?: string) {
    const event: AuditEvent = {
      userId: userId || 'anonymous',
      action,
      resource,
      details,
      timestamp: new Date(),
      ipAddress: 'unknown', // In real app, this would be captured server-side
      userAgent: navigator.userAgent
    };

    this.events.push(event);
    console.log('Audit Event:', event);

    // In a real application, this would be sent to a secure logging service
    this.sendToAuditService(event);
  }

  private async sendToAuditService(event: AuditEvent) {
    try {
      // Simulate API call to audit service
      await new Promise(resolve => setTimeout(resolve, 100));
      localStorage.setItem('audit_events', JSON.stringify([
        ...this.getStoredEvents(),
        event
      ]));
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  getStoredEvents(): AuditEvent[] {
    try {
      const stored = localStorage.getItem('audit_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  getEvents(): AuditEvent[] {
    return [...this.events];
  }
}

export const auditService = new AuditService();

interface AuditLoggerProps {
  action: string;
  resource: string;
  details?: Record<string, any>;
  trigger?: 'mount' | 'click' | 'submit';
  children?: React.ReactNode;
}

export const AuditLogger: React.FC<AuditLoggerProps> = ({
  action,
  resource,
  details,
  trigger = 'mount',
  children
}) => {
  const { user } = useAuth();

  const logEvent = () => {
    auditService.logEvent(action, resource, details, user?.id);
  };

  useEffect(() => {
    if (trigger === 'mount') {
      logEvent();
    }
  }, []);

  const handleClick = () => {
    if (trigger === 'click') {
      logEvent();
    }
  };

  const handleSubmit = () => {
    if (trigger === 'submit') {
      logEvent();
    }
  };

  if (!children) {
    return null;
  }

  return (
    <div onClick={trigger === 'click' ? handleClick : undefined}>
      {React.cloneElement(children as React.ReactElement, {
        onSubmit: trigger === 'submit' ? handleSubmit : undefined
      })}
    </div>
  );
};
