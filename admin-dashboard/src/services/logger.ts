// ============================================================================
// GSFP Admin Dashboard - Production Logging Service
// ============================================================================

import { collection, addDoc } from 'firebase/firestore';
import { getFirebaseServices } from './firebase';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  userId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
  userAgent?: string;
  url?: string;
}

class LoggerService {
  private static instance: LoggerService;
  private isEnabled: boolean = false;
  private logQueue: LogEntry[] = [];
  private isProcessing: boolean = false;
  private maxQueueSize: number = 100;
  private flushInterval: number = 5000; // 5 seconds

  private constructor() {
    this.initialize();
  }

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  private initialize() {
    // Check if logging is enabled via environment
    const config = process.env.REACT_APP_ENABLE_LOGGING === 'true';
    this.isEnabled = config || process.env.NODE_ENV === 'production';

    if (this.isEnabled) {
      // Start periodic flush
      setInterval(() => this.flushQueue(), this.flushInterval);
      
      // Flush on page unload
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => this.flushQueue());
      }
    }
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>
  ): LogEntry {
    return {
      timestamp: new Date(),
      level,
      message,
      userId: this.getCurrentUserId(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      metadata
    };
  }

  private getCurrentUserId(): string | undefined {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || user.uid;
      }
    } catch (error) {
      // Ignore errors
    }
    return undefined;
  }

  private async flushQueue() {
    if (this.isProcessing || this.logQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    let logsToFlush: LogEntry[] = [];

    try {
      const { db } = getFirebaseServices();
      if (!db) {
        console.warn('Firestore not available for logging');
        this.logQueue = [];
        return;
      }

      logsToFlush = [...this.logQueue];
      this.logQueue = [];

      const logsCollection = collection(db, 'logs');
      
      // Batch write logs
      const promises = logsToFlush.map(logEntry => {
        const logData = {
          ...logEntry,
          timestamp: logEntry.timestamp.toISOString()
        };
        return addDoc(logsCollection, logData);
      });

      await Promise.all(promises);
      
      // Clean up old logs (keep only last 30 days)
      this.cleanupOldLogs();
    } catch (error) {
      console.error('Failed to flush logs:', error);
      // Re-queue failed logs
      this.logQueue = [...logsToFlush, ...this.logQueue].slice(0, this.maxQueueSize);
    } finally {
      this.isProcessing = false;
    }
  }

  private async cleanupOldLogs() {
    try {
      const { db } = getFirebaseServices();
      if (!db) return;

      // This would typically be handled by a Cloud Function or cron job
      // For now, we'll just log that cleanup is needed
      console.log('Log cleanup: Consider implementing automated cleanup of logs older than 30 days');
    } catch (error) {
      console.error('Failed to cleanup old logs:', error);
    }
  }

  private queueLog(entry: LogEntry) {
    if (!this.isEnabled) {
      // Still log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${entry.level.toUpperCase()}]`, entry.message, entry.metadata);
      }
      return;
    }

    this.logQueue.push(entry);

    if (this.logQueue.length >= this.maxQueueSize) {
      this.flushQueue();
    }
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.queueLog(this.createLogEntry(LogLevel.DEBUG, message, metadata));
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.queueLog(this.createLogEntry(LogLevel.INFO, message, metadata));
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.queueLog(this.createLogEntry(LogLevel.WARN, message, metadata));
  }

  error(message: string, metadata?: Record<string, any>): void {
    this.queueLog(this.createLogEntry(LogLevel.ERROR, message, metadata));
  }

  critical(message: string, metadata?: Record<string, any>): void {
    this.queueLog(this.createLogEntry(LogLevel.CRITICAL, message, metadata));
    
    // For critical errors, also send alert notification if configured
    this.sendCriticalAlert(message, metadata);
  }

  private async sendCriticalAlert(message: string, metadata?: Record<string, any>): Promise<void> {
    // This could integrate with a notification service
    // For now, we'll just log it
    console.error('CRITICAL ALERT:', message, metadata);
  }

  // Component-specific logging
  logComponentAction(component: string, action: string, metadata?: Record<string, any>): void {
    this.info(`${component} - ${action}`, {
      component,
      action,
      ...metadata
    });
  }

  // API call logging
  logApiCall(endpoint: string, method: string, status: number, duration: number): void {
    this.info(`API Call: ${method} ${endpoint}`, {
      endpoint,
      method,
      status,
      duration
    });
  }

  // User action logging
  logUserAction(action: string, metadata?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      action,
      ...metadata
    });
  }

  // Error logging with stack trace
  logError(error: Error, context?: string): void {
    this.error(error.message, {
      stack: error.stack,
      context,
      name: error.name
    });
  }

  // Performance logging
  logPerformance(metric: string, value: number, metadata?: Record<string, any>): void {
    this.info(`Performance: ${metric}`, {
      metric,
      value,
      ...metadata
    });
  }

  // Force flush all pending logs
  async flush(): Promise<void> {
    await this.flushQueue();
  }

  // Get log queue status
  getQueueStatus(): { queueSize: number; isProcessing: boolean; isEnabled: boolean } {
    return {
      queueSize: this.logQueue.length,
      isProcessing: this.isProcessing,
      isEnabled: this.isEnabled
    };
  }
}

// Export singleton instance
export const logger = LoggerService.getInstance();
