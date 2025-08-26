'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Calendar,
  Plus,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import AppLayout from '@/components/app-layout';
import PageWrapper from '@/components/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, calculateUtilization, getUtilizationColor } from '@/lib/utils';

interface DashboardStats {
  todayHours: number;
  monthHours: number;
  utilization: number;
  activeClients: number;
}

interface TodayEntry {
  id: number;
  client: string;
  domain: string;
  subdomain: string;
  scope: string;
  hours: number;
  notes: string;
  createdAt: Date;
}

interface RecentActivity {
  id: number;
  type: 'entry_added' | 'entry_updated' | 'entry_deleted';
  description: string;
  timestamp: Date;
  user: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    todayHours: 0,
    monthHours: 0,
    utilization: 0,
    activeClients: 0
  });
  const [todayEntries, setTodayEntries] = useState<TodayEntry[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls - replace with actual API calls later
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock data - replace with actual API calls
        const mockStats: DashboardStats = {
          todayHours: 6.5,
          monthHours: 142,
          utilization: 89,
          activeClients: 8
        };

        const mockTodayEntries: TodayEntry[] = [
          {
            id: 1,
            client: 'ElAbd',
            domain: 'Consulting',
            subdomain: 'ElAbd',
            scope: 'Strategic Planning',
            hours: 3.5,
            notes: 'Strategy review meeting with management team',
            createdAt: new Date()
          },
          {
            id: 2,
            client: 'FF In-Meeting',
            domain: 'Consulting',
            subdomain: 'Forefront',
            scope: 'Team Meeting',
            hours: 1.0,
            notes: 'Weekly team standup and project updates',
            createdAt: new Date()
          },
          {
            id: 3,
            client: 'Wander',
            domain: 'Consulting',
            subdomain: 'Wander',
            scope: 'Process Enhancement',
            hours: 2.0,
            notes: 'Process mapping and optimization workshop',
            createdAt: new Date()
          }
        ];

        const mockRecentActivity: RecentActivity[] = [
          {
            id: 1,
            type: 'entry_added',
            description: 'Added 3.5h entry for ElAbd - Strategic Planning',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
            user: session?.user.username || 'You'
          },
          {
            id: 2,
            type: 'entry_updated',
            description: 'Updated Wander entry from 1.5h to 2.0h',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            user: session?.user.username || 'You'
          },
          {
            id: 3,
            type: 'entry_added',
            description: 'Added team meeting entry - 1.0h',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
            user: session?.user.username || 'You'
          }
        ];

        setStats(mockStats);
        setTodayEntries(mockTodayEntries);
        setRecentActivity(mockRecentActivity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return formatDate(date);
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'entry_added':
        return <Plus size={14} className="text-green-600" />;
      case 'entry_updated':
        return <Edit3 size={14} className="text-blue-600" />;
      case 'entry_deleted':
        return <Trash2 size={14} className="text-red-600" />;
      default:
        return <Clock size={14} className="text-gray-600" />;
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout>
      <PageWrapper
        title="Dashboard"
        description={`Welcome back, ${session.user.username}! Here's your activity overview.`}
      >
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayHours}</div>
              <p className="text-xs text-muted-foreground">
                +2.5 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthHours}h</div>
              <p className="text-xs text-muted-foreground">
                18 working days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilization</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.utilization}%</div>
              <p className="text-xs text-muted-foreground">
                Above target (70%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeClients}</div>
              <p className="text-xs text-muted-foreground">
                3 new this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Entries */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Entries</CardTitle>
                  <CardDescription>
                    {formatDate(new Date())} • {todayEntries.length} entries
                  </CardDescription>
                </div>
                <Link href="/data-entry">
                  <Button size="sm">
                    <Plus size={16} className="mr-2" />
                    Add Entry
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : todayEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No entries for today yet.</p>
                  <Link href="/data-entry">
                    <Button variant="outline" className="mt-2">
                      Add your first entry
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{entry.client}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {entry.domain}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {entry.subdomain} • {entry.scope}
                        </p>
                        {entry.notes && (
                          <p className="text-xs text-gray-500 truncate">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-blue-600">
                          {entry.hours}h
                        </span>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye size={14} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit3 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex space-x-3 animate-pulse">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <Link href="/reports">
                      <Button variant="outline" size="sm" className="w-full">
                        View All Activity
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/data-entry">
                  <Button variant="outline" className="w-full h-16 flex flex-col space-y-2">
                    <Plus size={20} />
                    <span className="text-sm">Add Entry</span>
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full h-16 flex flex-col space-y-2">
                    <TrendingUp size={20} />
                    <span className="text-sm">View Analytics</span>
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button variant="outline" className="w-full h-16 flex flex-col space-y-2">
                    <Eye size={20} />
                    <span className="text-sm">Generate Report</span>
                  </Button>
                </Link>
                <Link href="/calendar">
                  <Button variant="outline" className="w-full h-16 flex flex-col space-y-2">
                    <Calendar size={20} />
                    <span className="text-sm">View Calendar</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    </AppLayout>
  );
}