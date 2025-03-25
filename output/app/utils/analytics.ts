import { Analytics } from '@vercel/analytics/react';
import { getEnvVar } from './env';

interface ErrorEvent {
  error: Error;
  componentStack?: string;
  eventId?: string;
  tags?: Record<string, string>;
}

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private errorQueue: ErrorEvent[] = [];
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: number = 5000; // 5 seconds

  private constructor() {
    if (typeof window !== 'undefined') {
      setInterval(() => this.flushQueues(), this.flushInterval);
    }
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  public trackError(error: Error, componentStack?: string, tags?: Record<string, string>) {
    const eventId = this.generateEventId();
    const errorEvent: ErrorEvent = {
      error,
      componentStack,
      eventId,
      tags: {
        environment: getEnvVar('NODE_ENV'),
        ...tags
      }
    };

    this.errorQueue.push(errorEvent);
    console.error('[Analytics] Error tracked:', errorEvent);
    return eventId;
  }

  public trackEvent(name: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      properties: {
        environment: getEnvVar('NODE_ENV'),
        ...properties
      },
      timestamp: Date.now()
    };

    this.eventQueue.push(event);
    console.log('[Analytics] Event tracked:', event);
  }

  private async flushQueues() {
    if (this.errorQueue.length === 0 && this.eventQueue.length === 0) return;

    try {
      const apiUrl = getEnvVar('NEXT_PUBLIC_API_URL');
      
      if (this.errorQueue.length > 0) {
        await fetch(`${apiUrl}/api/analytics/errors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ errors: this.errorQueue })
        });
        this.errorQueue = [];
      }

      if (this.eventQueue.length > 0) {
        await fetch(`${apiUrl}/api/analytics/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: this.eventQueue })
        });
        this.eventQueue = [];
      }
    } catch (error) {
      console.error('[Analytics] Failed to flush queues:', error);
    }
  }

  private generateEventId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

export const analytics = AnalyticsManager.getInstance();

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Analytics />
      {children}
    </>
  );
} 