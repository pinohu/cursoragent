import { inject } from '@vercel/analytics';
import { isProduction } from './env';

class AnalyticsService {
  private static instance: AnalyticsService;
  private isEnabled: boolean;

  private constructor() {
    this.isEnabled = isProduction() && process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
    if (this.isEnabled && typeof window !== 'undefined') {
      inject();
    }
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) {
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        inject();
      }
    } catch (error) {
      // Log error but don't throw to prevent app crashes
      console.error('Analytics error:', error);
    }
  }

  public isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }
}

export const analytics = AnalyticsService.getInstance(); 