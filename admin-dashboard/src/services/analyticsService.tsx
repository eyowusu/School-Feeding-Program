// GSFP Analytics Service
// Provides real-time analytics data for the admin dashboard

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import { getFirebaseServices } from './firebase';

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: number;
  topPages: PageAnalytics[];
  deviceBreakdown: DeviceAnalytics[];
  trafficSources: TrafficSourceAnalytics[];
  recentActivity: ActivityItem[];
  realTimeUsers: number;
  monthlyGrowth: number;
}

export interface PageAnalytics {
  page: string;
  views: number;
  percentage: number;
  uniqueVisitors?: number;
  avgTimeOnPage?: string;
}

export interface DeviceAnalytics {
  device: string;
  percentage: number;
  users: number;
  sessions: number;
}

export interface TrafficSourceAnalytics {
  source: string;
  visitors: number;
  percentage: number;
  conversionRate?: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  item: string;
  user: string;
  time: string;
  type: 'content' | 'media' | 'event' | 'partner' | 'user' | 'system';
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private unsubscribeFunctions: (() => void)[] = [];

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Get comprehensive analytics data
   */
  async getAnalyticsData(timeRange: string = '30d'): Promise<AnalyticsData> {
    try {
      const now = new Date();
      const startDate = this.getStartDate(now, timeRange);

      // Get page views data
      const pageViews = await this.getPageViewsData(startDate, now);
      
      // Get device analytics
      const deviceData = await this.getDeviceAnalytics(startDate, now);
      
      // Get traffic sources
      const trafficData = await this.getTrafficSources(startDate, now);
      
      // Get recent activity
      const recentActivity = await this.getRecentActivity();
      
      // Get real-time users
      const realTimeUsers = await this.getRealTimeUsers();
      
      // Calculate metrics
      const totalViews = pageViews.reduce((sum, page) => sum + page.views, 0);
      const uniqueVisitors = await this.getUniqueVisitors(startDate, now);
      const avgSessionDuration = await this.getAvgSessionDuration(startDate, now);
      const bounceRate = await this.getBounceRate(startDate, now);
      const monthlyGrowth = await this.getMonthlyGrowth();

      return {
        totalViews,
        uniqueVisitors,
        avgSessionDuration,
        bounceRate,
        topPages: pageViews,
        deviceBreakdown: deviceData,
        trafficSources: trafficData,
        recentActivity,
        realTimeUsers,
        monthlyGrowth
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw new Error('Failed to fetch analytics data');
    }
  }

  /**
   * Set up real-time analytics listener
   */
  setupRealTimeAnalytics(callback: (data: AnalyticsData) => void): () => void {
    const { db } = getFirebaseServices();
    const analyticsRef = collection(db, 'analytics');
    
    const unsubscribe = onSnapshot(
      query(analyticsRef, orderBy('timestamp', 'desc'), limit(1)),
      async (snapshot) => {
        try {
          const latestData = await this.getAnalyticsData();
          callback(latestData);
        } catch (error) {
          console.error('Error in real-time analytics:', error);
        }
      }
    );

    this.unsubscribeFunctions.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Track page view
   */
  async trackPageView(page: string, userId?: string, sessionId?: string): Promise<void> {
    try {
      const { db } = getFirebaseServices();
      const analyticsRef = collection(db, 'analytics');
      const pageViewData = {
        type: 'page_view',
        page,
        userId: userId || 'anonymous',
        sessionId: sessionId || this.generateSessionId(),
        timestamp: Timestamp.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

      await addDoc(analyticsRef, pageViewData);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  /**
   * Track user action
   */
  async trackUserAction(action: string, details: Record<string, any>, userId?: string): Promise<void> {
    try {
      const { db } = getFirebaseServices();
      const analyticsRef = collection(db, 'analytics');
      const actionData = {
        type: 'user_action',
        action,
        details,
        userId: userId || 'anonymous',
        timestamp: Timestamp.now(),
        sessionId: this.generateSessionId()
      };

      await addDoc(analyticsRef, actionData);
    } catch (error) {
      console.error('Error tracking user action:', error);
    }
  }

  /**
   * Get page views data
   */
  private async getPageViewsData(startDate: Date, endDate: Date): Promise<PageAnalytics[]> {
    const { db } = getFirebaseServices();
    const analyticsRef = collection(db, 'analytics');
    const q = query(
      analyticsRef,
      where('type', '==', 'page_view'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const pageViews: Record<string, number> = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const page = data.page || 'unknown';
      pageViews[page] = (pageViews[page] || 0) + 1;
    });

    const totalViews = Object.values(pageViews).reduce((sum, count) => sum + count, 0);
    
    if (totalViews === 0) {
      console.warn('No page views data found for the selected time range');
      return [];
    }
    
    return Object.entries(pageViews)
      .map(([page, views]) => ({
        page,
        views,
        percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  /**
   * Get device analytics
   */
  private async getDeviceAnalytics(startDate: Date, endDate: Date): Promise<DeviceAnalytics[]> {
    const { db } = getFirebaseServices();
    const analyticsRef = collection(db, 'analytics');
    const q = query(
      analyticsRef,
      where('type', '==', 'page_view'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate))
    );

    const querySnapshot = await getDocs(q);
    const deviceCounts: Record<string, number> = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const userAgent = data.userAgent || '';
      const device = this.detectDevice(userAgent);
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    const totalDevices = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0);
    
    if (totalDevices === 0) {
      console.warn('No device analytics data found for the selected time range');
      return [];
    }
    
    return Object.entries(deviceCounts)
      .map(([device, count]) => ({
        device,
        percentage: totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0,
        users: count,
        sessions: count
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * Get traffic sources
   */
  private async getTrafficSources(startDate: Date, endDate: Date): Promise<TrafficSourceAnalytics[]> {
    const { db } = getFirebaseServices();
    const analyticsRef = collection(db, 'analytics');
    const q = query(
      analyticsRef,
      where('type', '==', 'page_view'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate))
    );

    const querySnapshot = await getDocs(q);
    const sourceCounts: Record<string, number> = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const referrer = data.referrer || '';
      const source = this.detectTrafficSource(referrer);
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    const totalSources = Object.values(sourceCounts).reduce((sum, count) => sum + count, 0);
    
    if (totalSources === 0) {
      console.warn('No traffic source data found for the selected time range');
      return [];
    }
    
    return Object.entries(sourceCounts)
      .map(([source, visitors]) => ({
        source,
        visitors,
        percentage: totalSources > 0 ? Math.round((visitors / totalSources) * 100) : 0,
          conversionRate: 0 // Conversion rate would be calculated from actual conversion data
        }))
        .sort((a, b) => b.visitors - a.visitors);
  }

  /**
   * Get recent activity
   */
  private async getRecentActivity(): Promise<ActivityItem[]> {
    const { db } = getFirebaseServices();
    const contentRef = collection(db, 'content');
    const contentQuery = query(
      contentRef,
      orderBy('updatedAt', 'desc'),
      limit(10)
    );
    
    const contentSnapshot = await getDocs(contentQuery);
    const activities: ActivityItem[] = [];

    contentSnapshot.forEach((doc) => {
      const data = doc.data();
      activities.push({
        id: doc.id,
        action: this.getActionFromStatus(data.status),
        item: data.title || 'Untitled Content',
        user: data.updatedBy || 'Unknown',
        time: this.formatRelativeTime(data.updatedAt?.toDate()),
        type: data.type || 'content',
        metadata: { status: data.status }
      });
    });

    return activities;
  }

  /**
   * Get real-time users
   */
  private async getRealTimeUsers(): Promise<number> {
    const { db } = getFirebaseServices();
    const analyticsRef = collection(db, 'analytics');
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const q = query(
      analyticsRef,
      where('type', '==', 'page_view'),
      where('timestamp', '>=', Timestamp.fromDate(fiveMinutesAgo))
    );
    
    const snapshot = await getDocs(q);
    const uniqueUsers = new Set<string>();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      uniqueUsers.add(data.userId || 'anonymous');
    });
    
    return uniqueUsers.size;
  }

  /**
   * Get unique visitors
   */
  private async getUniqueVisitors(startDate: Date, endDate: Date): Promise<number> {
    const { db } = getFirebaseServices();
    const analyticsRef = collection(db, 'analytics');
    const q = query(
      analyticsRef,
      where('type', '==', 'page_view'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate))
    );

    const querySnapshot = await getDocs(q);
    const uniqueUsers = new Set<string>();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      uniqueUsers.add(data.userId || 'anonymous');
    });

    return uniqueUsers.size;
  }

  /**
   * Get average session duration
   */
  private async getAvgSessionDuration(startDate: Date, endDate: Date): Promise<string> {
    const { db } = getFirebaseServices();
    const analyticsRef = collection(db, 'analytics');
    const q = query(
      analyticsRef,
      where('type', '==', 'session_start'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate))
    );
    
    const snapshot = await getDocs(q);
    const sessionDurations: number[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.duration) {
        sessionDurations.push(data.duration);
      }
    });
    
    if (sessionDurations.length === 0) {
      return '0:00';
    }
    
    const avgDuration = sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length;
    const minutes = Math.floor(avgDuration / 60);
    const seconds = Math.floor(avgDuration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get bounce rate
   */
  private async getBounceRate(startDate: Date, endDate: Date): Promise<number> {
    const { db } = getFirebaseServices();
    const analyticsRef = collection(db, 'analytics');
    
    // Get total sessions
    const sessionsQuery = query(
      analyticsRef,
      where('type', '==', 'session_start'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate))
    );
    const sessionsSnapshot = await getDocs(sessionsQuery);
    const totalSessions = sessionsSnapshot.size;
    
    if (totalSessions === 0) return 0;
    
    // Get bounced sessions (sessions with only 1 page view)
    const bouncedQuery = query(
      analyticsRef,
      where('type', '==', 'session_end'),
      where('pageViews', '==', 1),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate))
    );
    const bouncedSnapshot = await getDocs(bouncedQuery);
    const bouncedSessions = bouncedSnapshot.size;
    
    return (bouncedSessions / totalSessions) * 100;
  }

  /**
   * Get monthly growth
   */
  private async getMonthlyGrowth(): Promise<number> {
    const { db } = getFirebaseServices();
    const analyticsRef = collection(db, 'analytics');
    
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const thisMonthQuery = query(
      analyticsRef,
      where('type', '==', 'page_view'),
      where('timestamp', '>=', Timestamp.fromDate(thisMonthStart))
    );
    const thisMonthSnapshot = await getDocs(thisMonthQuery);
    const thisMonthViews = thisMonthSnapshot.size;
    
    const lastMonthQuery = query(
      analyticsRef,
      where('type', '==', 'page_view'),
      where('timestamp', '>=', Timestamp.fromDate(lastMonthStart)),
      where('timestamp', '<=', Timestamp.fromDate(lastMonthEnd))
    );
    const lastMonthSnapshot = await getDocs(lastMonthQuery);
    const lastMonthViews = lastMonthSnapshot.size;
    
    if (lastMonthViews === 0) return 0;
    
    return ((thisMonthViews - lastMonthViews) / lastMonthViews) * 100;
  }

  /**
   * Helper methods
   */
  private getStartDate(now: Date, timeRange: string): Date {
    const startDate = new Date(now);
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    
    return startDate;
  }

  private detectDevice(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet|ipad/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  }

  private detectTrafficSource(referrer: string): string {
    if (!referrer) return 'Direct';
    if (referrer.includes('google')) return 'Search Engines';
    if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('linkedin')) return 'Social Media';
    if (referrer.includes('mailto:')) return 'Email';
    return 'Referrals';
  }

  private getActionFromStatus(status: string): string {
    switch (status) {
      case 'published': return 'Content published';
      case 'draft': return 'Draft created';
      case 'review': return 'Submitted for review';
      default: return 'Content updated';
    }
  }

  private formatRelativeTime(timestamp?: Date): string {
    if (!timestamp) return 'Unknown time';
    
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9);
  }


  /**
   * Cleanup all listeners
   */
  cleanup(): void {
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    this.unsubscribeFunctions = [];
  }
}

export const analyticsService = AnalyticsService.getInstance();
