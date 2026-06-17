import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Activity,
  RefreshCw
} from 'lucide-react';
import { analyticsService, AnalyticsData } from '../services/analyticsService';

// Helper function to get device colors
const getDeviceColor = (device: string): string => {
  switch (device) {
    case 'Desktop': return 'bg-ghana-primary-500';
    case 'Mobile': return 'bg-ghana-secondary-500';
    case 'Tablet': return 'bg-ghana-warning-500';
    default: return 'bg-ghana-neutral-500';
  }
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realTimeUsers, setRealTimeUsers] = useState(0);
  const [isRealTime, setIsRealTime] = useState(false);

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getAnalyticsData(timeRange);
      setAnalyticsData(data);
      setRealTimeUsers(data.realTimeUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Toggle real-time updates
  const toggleRealTime = useCallback(() => {
    setIsRealTime(prev => !prev);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Set up real-time updates
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (isRealTime) {
      unsubscribe = analyticsService.setupRealTimeAnalytics((data) => {
        setAnalyticsData(data);
        setRealTimeUsers(data.realTimeUsers);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isRealTime]);

  // Handle loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <RefreshCw className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading analytics</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={fetchAnalyticsData}
              className="mt-3 bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track website performance and user engagement</p>
          <div className="flex items-center gap-2 mt-2">
            {isRealTime && (
              <div className="flex items-center gap-1 text-green-600">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Live</span>
              </div>
            )}
            <span className="text-sm text-gray-500">
              {realTimeUsers} users online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleRealTime}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isRealTime
                ? 'bg-green-100 border-green-300 text-green-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {isRealTime ? 'Live' : 'Real-time'}
            </div>
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-ghana-primary-100 rounded-lg">
              <Eye className="h-6 w-6 text-ghana-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">+{analyticsData.monthlyGrowth.toFixed(1)}% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-ghana-secondary-100 rounded-lg">
              <Users className="h-6 w-6 text-ghana-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.uniqueVisitors.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">+{Math.max(0, analyticsData.monthlyGrowth - 4).toFixed(1)}% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-ghana-warning-100 rounded-lg">
              <Clock className="h-6 w-6 text-ghana-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Session</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.avgSessionDuration}
              </p>
              <p className="text-sm text-red-600">-2.1% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-ghana-error-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-ghana-error-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.bounceRate}%
              </p>
              <p className="text-sm text-green-600">-5.3% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 w-16">
                    {page.page}
                  </span>
                  <div className="ml-4 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-ghana-primary-600 h-2 rounded-full"
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {page.views.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({page.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            {analyticsData.deviceBreakdown.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  {device.device === 'Desktop' && <Monitor className="h-5 w-5 text-gray-400 mr-3" />}
                  {device.device === 'Mobile' && <Smartphone className="h-5 w-5 text-gray-400 mr-3" />}
                  {device.device === 'Tablet' && <Monitor className="h-5 w-5 text-gray-400 mr-3" />}
                  <span className="text-sm font-medium text-gray-900">
                    {device.device}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className={`h-2 rounded-full ${getDeviceColor(device.device)}`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.trafficSources.map((source, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {source.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {source.visitors.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {source.percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+5.2%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geographic Data Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h4>
          <p className="text-gray-600">
            Geographic analytics and visitor location data would be displayed here.
            Integration with Google Analytics would provide real-time geographic insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
