// GSFP Shared Configuration Manager
// This utility provides unified configuration management across admin-dashboard and frontend

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface AppConfig {
  firebase: FirebaseConfig;
  environment: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  isAdmin: boolean;
  features: {
    realTimeSync: boolean;
    pushNotifications: boolean;
    contentWorkflow: boolean;
    analyticsDashboard: boolean;
  };
  limits: {
    maxUploadSize: number;
    cacheDuration: number;
  };
  security: {
    allowedOrigins: string[];
    adminEmailDomain: string;
  };
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig | null = null;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Initialize configuration from environment variables
   */
  initialize(): AppConfig {
    if (this.config) {
      return this.config;
    }

    const environment = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
    const isDevelopment = environment === 'development';
    const isProduction = environment === 'production';
    const isAdmin = window.location.hostname.includes('admin') || window.location.pathname.startsWith('/admin');

    // Validate required Firebase configuration
    const requiredFirebaseVars = [
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_FIREBASE_PROJECT_ID',
      'REACT_APP_FIREBASE_STORAGE_BUCKET',
      'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
      'REACT_APP_FIREBASE_APP_ID'
    ];

    const missingVars = requiredFirebaseVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0 && !isDevelopment) {
      throw new Error(`Missing required Firebase configuration: ${missingVars.join(', ')}`);
    }

    this.config = {
      firebase: {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.REACT_APP_FIREBASE_APP_ID || ''
      },
      environment,
      isDevelopment,
      isProduction,
      isAdmin,
      features: {
        realTimeSync: this.parseBoolean(process.env.REACT_APP_ENABLE_REAL_TIME_SYNC, true),
        pushNotifications: this.parseBoolean(process.env.REACT_APP_ENABLE_PUSH_NOTIFICATIONS, true),
        contentWorkflow: this.parseBoolean(process.env.REACT_APP_ENABLE_CONTENT_WORKFLOW, true),
        analyticsDashboard: this.parseBoolean(process.env.REACT_APP_ENABLE_ANALYTICS_DASHBOARD, true)
      },
      limits: {
        maxUploadSize: parseInt(process.env.REACT_APP_MAX_UPLOAD_SIZE || '10485760', 10), // 10MB default
        cacheDuration: parseInt(process.env.REACT_APP_CONTENT_CACHE_DURATION || '300000', 10) // 5 minutes default
      },
      security: {
        allowedOrigins: (process.env.REACT_APP_ALLOWED_ORIGINS || '').split(',').map(origin => origin.trim()),
        adminEmailDomain: process.env.REACT_APP_ADMIN_EMAIL_DOMAIN || 'gsfp.gov.gh'
      }
    };

    return this.config;
  }

  /**
   * Get current configuration
   */
  getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Configuration not initialized. Call initialize() first.');
    }
    return this.config;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    const config = this.getConfig();
    return config.features[feature];
  }

  /**
   * Get Firebase configuration
   */
  getFirebaseConfig(): FirebaseConfig {
    return this.getConfig().firebase;
  }

  /**
   * Check if running in admin context
   */
  isAdminContext(): boolean {
    return this.getConfig().isAdmin;
  }

  /**
   * Validate configuration integrity
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = this.getConfig();

    // Check Firebase configuration
    if (!config.firebase.apiKey) errors.push('Firebase API key is missing');
    if (!config.firebase.projectId) errors.push('Firebase project ID is missing');
    if (!config.firebase.appId) errors.push('Firebase app ID is missing');

    // Check feature flags
    if (config.isProduction && !config.features.realTimeSync) {
      errors.push('Real-time sync should be enabled in production');
    }

    // Check limits
    if (config.limits.maxUploadSize > 100 * 1024 * 1024) { // 100MB
      errors.push('Max upload size exceeds recommended limit');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get environment-specific settings
   */
  getEnvironmentSettings() {
    const config = this.getConfig();
    return {
      enableDebugLogging: config.isDevelopment && this.parseBoolean(process.env.REACT_APP_DEBUG_MODE, false),
      enableMockData: config.isDevelopment && this.parseBoolean(process.env.REACT_APP_ENABLE_MOCK_DATA, true), // Default to true in dev
      enableErrorReporting: config.isProduction
    };
  }

  private parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();

// Export types
export type { AppConfig, FirebaseConfig };

// Export convenience functions
export const getConfig = () => configManager.getConfig();
export const getFirebaseConfig = () => configManager.getFirebaseConfig();
export const isFeatureEnabled = (feature: keyof AppConfig['features']) => configManager.isFeatureEnabled(feature);
export const isAdminContext = () => configManager.isAdminContext();
