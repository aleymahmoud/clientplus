// src/app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Calendar,
  Shield,
  Award,
  Target,
  Activity,
  PlusCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    return null;
  }

  const isAdmin = session.user.role === 'SUPER_USER';
  const isLead = session.user.role === 'LEAD_CONSULTANT';

  // Navigation handlers
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Mock data - replace with real data from your API
  const dashboardStats = {
    todayHours: 6.5,
    weekHours: 38.5,
    monthHours: 165.2,
    activeProjects: 4,
    completedTasks: 23,
    teamMembers: isLead || isAdmin ? 8 : 0,
    utilizationRate: 87,
  };

  const quickActions = [
    {
      title: 'Add Time Entry',
      description: 'Log your work hours',
      href: '/entries',
      icon: Clock,
      color: 'bg-blue-500',
      primary: true,
    },
    {
      title: 'View Reports',
      description: 'Analyze your performance',
      href: '/reports',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Analytics',
      description: 'View detailed insights',
      href: '/analytics',
      icon: Activity,
      color: 'bg-purple-500',
    },
  ];

  // Add admin actions for super users
  if (isAdmin) {
    quickActions.push({
      title: 'Admin Panel',
      description: 'Manage users & system',
      href: '/admin',
      icon: Shield,
      color: 'bg-red-500',
    });
  }

  const statCards = [
    {
      title: 'Today\'s Hours',
      value: dashboardStats.todayHours.toString(),
      unit: 'hrs',
      icon: Clock,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'This Week',
      value: dashboardStats.weekHours.toString(),
      unit: 'hrs',
      icon: Calendar,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'This Month',
      value: dashboardStats.monthHours.toString(),
      unit: 'hrs',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Utilization',
      value: dashboardStats.utilizationRate.toString(),
      unit: '%',
      icon: Target,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  // Add team stats for leads and admins
  if (isLead || isAdmin) {
    statCards.push({
      title: 'Team Members',
      value: dashboardStats.teamMembers.toString(),
      unit: 'people',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-100',
    });
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {session.user.username}! 👋
              </h1>
              <p className="text-blue-100">
                Here's your activity overview for today.
              </p>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center space-x-1">
                  {isAdmin && <Shield className="h-4 w-4 text-red-300" />}
                  <span className="text-blue-100 text-sm capitalize">
                    {session.user.role?.replace('_', ' ').toLowerCase()}
                  </span>
                </div>
                <div className="text-blue-100 text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Award className="h-16 w-16 text-blue-300" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <div className="flex items-baseline space-x-1">
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      <span className="text-sm text-gray-500">{card.unit}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Action - Add Entry */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Ready to log your work?</h2>
              <p className="text-green-100 mb-4">
                Track your time and manage your entries efficiently.
              </p>
              <Button
                onClick={() => handleNavigation('/entries')}
                variant="secondary"
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Time Entry
              </Button>
            </div>
            <div className="hidden md:block">
              <Clock className="h-16 w-16 text-green-300" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => handleNavigation(action.href)}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group text-left w-full"
                >
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Role-specific Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Added 2.5 hours to Client Project</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Completed weekly report</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Updated project analytics</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/reports')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all activity →
              </Button>
            </div>
          </div>

          {/* Admin Access Notice - Only show for admins */}
          {isAdmin && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-red-600" />
                <h2 className="text-lg font-semibold text-red-800">Admin Access</h2>
              </div>
              <p className="text-sm text-red-700 mb-4">
                You have administrator privileges. Access the admin panel to manage users, 
                view system reports, and configure settings.
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleNavigation('/admin')}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Open Admin Panel
                </Button>
                <Button
                  onClick={() => handleNavigation('/admin/users')}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </div>
            </div>
          )}

          {/* Team Overview - Only show for leads and admins */}
          {(isLead || isAdmin) && !isAdmin && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-800">Team Overview</h2>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                As a lead consultant, you can view team analytics and generate reports.
              </p>
              <Button
                onClick={() => handleNavigation('/analytics')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Team Analytics
              </Button>
            </div>
          )}

          {/* Regular User Section - For non-admin users */}
          {!isAdmin && !isLead && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-6 w-6 text-green-600" />
                <h2 className="text-lg font-semibold text-green-800">Your Goals</h2>
              </div>
              <p className="text-sm text-green-700 mb-4">
                Stay on track with your productivity goals and time management.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Weekly Target</span>
                  <span className="text-sm font-medium text-green-800">40h</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(dashboardStats.weekHours / 40) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-green-600">
                  <span>{dashboardStats.weekHours}h completed</span>
                  <span>{Math.round((dashboardStats.weekHours / 40) * 100)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}