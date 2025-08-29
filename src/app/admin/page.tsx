// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Building2, 
  Activity,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  superUsers: number;
  totalDomains: number;
  recentEntries: number;
  thisMonthEntries: number;
}

interface RecentActivity {
  id: string;
  type: 'user_created' | 'user_updated' | 'password_reset' | 'login';
  user: string;
  description: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    superUsers: 0,
    totalDomains: 0,
    recentEntries: 0,
    thisMonthEntries: 0,
  });
  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'user_created',
      user: 'islam',
      description: 'Created new user: newuser',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'password_reset',
      user: 'aley',
      description: 'Reset password for: youssef',
      timestamp: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      type: 'user_updated',
      user: 'islam',
      description: 'Updated role for: momen',
      timestamp: '2024-01-14T16:45:00Z'
    }
  ]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // For now, we'll use mock data. In production, you'd fetch from actual API
      setStats({
        totalUsers: 8,
        activeUsers: 7,
        superUsers: 2,
        totalDomains: 5,
        recentEntries: 142,
        thisMonthEntries: 89,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      change: '+2 this month'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toString(),
      icon: UserCheck,
      color: 'text-green-600 bg-green-100',
      change: `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active`
    },
    {
      title: 'Super Users',
      value: stats.superUsers.toString(),
      icon: Shield,
      color: 'text-red-600 bg-red-100',
      change: 'Admin access'
    },
    {
      title: 'Domains',
      value: stats.totalDomains.toString(),
      icon: Building2,
      color: 'text-purple-600 bg-purple-100',
      change: 'Service areas'
    }
  ];

  const activityTypeConfig = {
    user_created: { icon: Users, color: 'text-green-600 bg-green-100' },
    user_updated: { icon: UserCheck, color: 'text-blue-600 bg-blue-100' },
    password_reset: { icon: Shield, color: 'text-red-600 bg-red-100' },
    login: { icon: Activity, color: 'text-gray-600 bg-gray-100' },
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome to ClientPlus Admin</h1>
          <p className="text-blue-100">
            Manage users, monitor system activity, and maintain organizational settings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{card.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const config = activityTypeConfig[activity.type];
                const Icon = config.icon;
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">by {activity.user}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all activity →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <a
                href="/admin/users"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Users</p>
                    <p className="text-sm text-gray-500">Create, edit, and deactivate users</p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-blue-600">→</span>
              </a>

              <a
                href="/admin/domains"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Domain Management</p>
                    <p className="text-sm text-gray-500">Configure service domains</p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-blue-600">→</span>
              </a>

              <a
                href="/admin/reports"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">System Reports</p>
                    <p className="text-sm text-gray-500">View usage and activity reports</p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-blue-600">→</span>
              </a>

              <a
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">System Settings</p>
                    <p className="text-sm text-gray-500">Configure system preferences</p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-blue-600">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">This Month</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.thisMonthEntries}</p>
              <p className="text-sm text-gray-500">Time entries</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Recent Activity</h3>
              <p className="text-2xl font-bold text-green-600">{stats.recentEntries}</p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">User Engagement</h3>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
              </p>
              <p className="text-sm text-gray-500">Active users</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}