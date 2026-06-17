import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  Image,
  Calendar,
  TrendingUp,
  Eye,
  MessageSquare,
  DollarSign,
  Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getFirebaseServices } from '../services/firebase';
import { collection, getDocs, query, where, orderBy, getCountFromServer } from 'firebase/firestore';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalSchools: 0,
    totalMeals: 0,
    totalPartners: 0,
    activePrograms: 0,
    monthlyViews: 0,
    pendingContent: 0,
    totalDonations: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getActivityAction = (status: string, type: string): string => {
    if (status === 'published') return 'Content published';
    if (status === 'draft') return 'Draft created';
    if (type === 'event') return 'Event created';
    if (type === 'gallery') return 'Images uploaded';
    return 'Content updated';
  };

  const formatRelativeTime = (date: Date): string => {
    if (!date) return 'Unknown time';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const fetchDashboardStats = async () => {
    try {
      const { db } = getFirebaseServices();
      
      // Count published content
      const pendingQuery = query(collection(db, 'content'), where('status', '==', 'draft'));
      const pendingSnapshot = await getCountFromServer(pendingQuery);
      
      // Count partners (from content collection with type 'partner' or separate partners collection)
      const partnersQuery = query(collection(db, 'content'), where('type', '==', 'partner'));
      const partnersSnapshot = await getCountFromServer(partnersQuery);
      
      // Count events
      const eventsQuery = query(collection(db, 'content'), where('type', '==', 'event'));
      const eventsSnapshot = await getCountFromServer(eventsQuery);

      setStats({
        totalChildren: 0, // Requires schools/students collection
        totalSchools: 0, // Requires schools collection
        totalMeals: 0, // Requires daily meal logs collection
        totalPartners: partnersSnapshot.data().count,
        activePrograms: eventsSnapshot.data().count,
        monthlyViews: 0, // Requires analytics collection
        pendingContent: pendingSnapshot.data().count,
        totalDonations: 0 // Requires donations collection
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set all values to 0 on error
      setStats({
        totalChildren: 0,
        totalSchools: 0,
        totalMeals: 0,
        totalPartners: 0,
        activePrograms: 0,
        monthlyViews: 0,
        pendingContent: 0,
        totalDonations: 0
      });
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { db } = getFirebaseServices();
      const activityQuery = query(
        collection(db, 'content'),
        orderBy('updatedAt', 'desc'),
        where('updatedAt', '!=', null)
      );
      const snapshot = await getDocs(activityQuery);
      
      const activities = snapshot.docs.slice(0, 5).map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          action: getActivityAction(data.status, data.type),
          item: data.title || 'Untitled Content',
          user: data.author || data.updatedBy || 'Unknown',
          time: formatRelativeTime(data.updatedAt?.toDate()),
          type: data.type || 'content'
        };
      });
      
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Children Served',
      value: stats.totalChildren.toLocaleString(),
      icon: Users,
      color: 'bg-ghana-primary-500',
      change: '+12.5%'
    },
    {
      title: 'Active Schools',
      value: stats.totalSchools.toLocaleString(),
      icon: FileText,
      color: 'bg-ghana-secondary-500',
      change: '+5.2%'
    },
    {
      title: 'Meals Served',
      value: stats.totalMeals.toLocaleString(),
      icon: MessageSquare,
      color: 'bg-ghana-secondary-500',
      change: '+18.7%'
    },
    {
      title: 'Monthly Views',
      value: stats.monthlyViews.toLocaleString(),
      icon: Eye,
      color: 'bg-ghana-primary-600',
      change: '+23.1%'
    }
  ];

  const quickActions = [
    {
      title: 'Add News Article',
      description: 'Publish new updates and announcements',
      icon: FileText,
      action: () => navigate('/content')
    },
    {
      title: 'Upload Media',
      description: 'Add photos and videos to gallery',
      icon: Image,
      action: () => navigate('/content')
    },
    {
      title: 'Create Event',
      description: 'Schedule new program events',
      icon: Calendar,
      action: () => navigate('/content')
    },
    {
      title: 'View Analytics',
      description: 'Check website performance metrics',
      icon: TrendingUp,
      action: () => navigate('/analytics')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="gradient-primary rounded-xl p-4 text-white shadow-large relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ghana-primary-900/20 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Administrator'}!</h1>
          <p className="text-ghana-primary-100 text-sm font-medium">Here's what's happening with the Ghana School Feeding Programme today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stats-card group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-ghana-neutral-500 uppercase tracking-wider mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-ghana-neutral-900 mb-2 group-hover:scale-105 transition-transform duration-200">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-all duration-300 shadow-medium group-hover:shadow-large`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-ghana-primary-500 to-ghana-secondary-500 rounded-full"></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-ghana-neutral-900">Quick Actions</h3>
              <p className="text-xs text-ghana-neutral-500 mt-1">Common tasks and shortcuts</p>
            </div>
            <div className="w-10 h-10 bg-ghana-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-ghana-primary-600" />
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="p-4 border-2 border-ghana-neutral-200 rounded-lg hover:border-ghana-primary-300 hover:bg-ghana-primary-50 hover:shadow-medium transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-ghana-primary-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200 shadow-soft">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-right opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs text-ghana-neutral-500">Click to</span>
                        <br />
                        <span className="text-xs font-medium text-ghana-primary-600">{action.title.split(' ')[0]}</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-ghana-neutral-900 mb-1 text-sm">{action.title}</h4>
                    <p className="text-xs text-ghana-neutral-600 leading-relaxed">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-ghana-neutral-900">Recent Activity</h3>
              <p className="text-xs text-ghana-neutral-500 mt-1">Latest updates and changes</p>
            </div>
            <div className="w-10 h-10 bg-ghana-secondary-100 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-ghana-secondary-600" />
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-ghana-neutral-50 transition-colors duration-200 animate-slide-up border border-transparent hover:border-ghana-neutral-200" style={{animationDelay: `${index * 150}ms`}}>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-ghana-primary-500 to-ghana-primary-600 rounded-lg flex items-center justify-center shadow-soft">
                      <span className="text-sm font-bold text-white">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div>
                      <p className="text-xs text-ghana-neutral-900 leading-relaxed font-medium">
                        <span className="font-bold text-ghana-neutral-900">{activity.user}</span>{' '}
                        <span className="text-ghana-neutral-600">{activity.action}</span>{' '}
                        <span className="font-bold text-ghana-primary-600 hover:text-ghana-primary-700 cursor-pointer transition-colors duration-200">{activity.item}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`badge-${activity.type === 'content' ? 'primary' : activity.type === 'media' ? 'secondary' : 'info'}`}>{activity.type}</span>
                        <p className="text-xs text-ghana-neutral-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-ghana-neutral-200">
              <button className="w-full btn-secondary text-center py-2 text-sm font-semibold">
                View All Activity →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-ghana-neutral-900">Pending Tasks</h3>
            <p className="text-xs text-ghana-neutral-500 mt-1">Items requiring your attention</p>
          </div>
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center animate-pulse-slow">
            <MessageSquare className="h-5 w-5 text-red-600" />
          </div>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-warning-50 border-2 border-warning-200 rounded-lg hover:shadow-medium transition-all duration-200 group cursor-pointer">
              <div className="flex items-center space-x-3 flex-1 mb-3 sm:mb-0">
                <div className="bg-warning-100 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <MessageSquare className="h-5 w-5 text-warning-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-ghana-neutral-900 mb-1 text-sm">Review pending comments</p>
                  <p className="text-xs text-ghana-neutral-600">12 comments awaiting moderation</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="badge-warning text-xs">High Priority</span>
                    <span className="text-xs text-ghana-neutral-500">Due: Today</span>
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/content')} className="btn-warning px-4 py-1 text-sm font-semibold w-full sm:w-auto">Review</button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-ghana-primary-50 border-2 border-ghana-primary-200 rounded-lg hover:shadow-medium transition-all duration-200 group cursor-pointer">
              <div className="flex items-center space-x-3 flex-1 mb-3 sm:mb-0">
                <div className="bg-ghana-primary-100 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <FileText className="h-5 w-5 text-ghana-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-ghana-neutral-900 mb-1 text-sm">Update program guidelines</p>
                  <p className="text-xs text-ghana-neutral-600">Annual review due in 2 weeks</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="badge-primary text-xs">Medium Priority</span>
                    <span className="text-xs text-ghana-neutral-500">Due: 2 weeks</span>
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/settings')} className="btn-primary px-4 py-1 text-sm font-semibold w-full sm:w-auto">Update</button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-ghana-secondary-50 border-2 border-ghana-secondary-200 rounded-lg hover:shadow-medium transition-all duration-200 group cursor-pointer">
              <div className="flex items-center space-x-3 flex-1 mb-3 sm:mb-0">
                <div className="bg-ghana-secondary-100 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <DollarSign className="h-5 w-5 text-ghana-secondary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-ghana-neutral-900 mb-1 text-sm">Donation reports</p>
                  <p className="text-xs text-ghana-neutral-600">Monthly summary ready for review</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="badge-success text-xs">Low Priority</span>
                    <span className="text-xs text-ghana-neutral-500">Due: This week</span>
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/analytics')} className="btn-success px-4 py-1 text-sm font-semibold w-full sm:w-auto">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
