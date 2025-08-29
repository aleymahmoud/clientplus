// src/components/layout/MainNavigation.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  PlusCircle, 
  BarChart3, 
  FileText, 
  Settings,
  Shield,
  Menu,
  X,
  Building2
} from 'lucide-react';
import { UserProfileDropdown } from '@/components/ui/UserProfileDropdown';

interface NavigationItem {
  href: string;
  label: string;
  icon: any;
  roles?: string[];
}

const navigationItems: NavigationItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/data-entry', label: 'Add Entry', icon: PlusCircle },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings, roles: ['SUPER_USER', 'LEAD_CONSULTANT'] },
];

const adminNavigationItems: NavigationItem[] = [
  { href: '/admin', label: 'Admin Panel', icon: Shield, roles: ['SUPER_USER'] },
  { href: '/admin/users', label: 'User Management', icon: Shield, roles: ['SUPER_USER'] },
  { href: '/admin/domains', label: 'Domain Management', icon: Building2, roles: ['SUPER_USER'] },
];

interface MainNavigationProps {
  children: React.ReactNode;
}

export function MainNavigation({ children }: MainNavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (!session?.user) {
    return null;
  }

  const userRole = session.user.role;
  const isAdmin = userRole === 'SUPER_USER';

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  // Filter admin navigation items based on user role
  const filteredAdminItems = adminNavigationItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const handleNavClick = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-600">ClientPlus</h1>
              <p className="text-xs text-gray-500">Consultant Tracking</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pt-4 pb-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Admin Section - Only show for SUPER_USER */}
          {isAdmin && filteredAdminItems.length > 0 && (
            <>
              <div className="pt-6">
                <div className="flex items-center px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Administration
                    </span>
                  </div>
                </div>
                <div className="space-y-1 mt-2">
                  {filteredAdminItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className={`
                          w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                          ${isActive 
                            ? 'bg-red-100 text-red-900 border-r-2 border-red-500' 
                            : 'text-gray-700 hover:bg-red-50 hover:text-red-900'
                          }
                        `}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </nav>

        {/* User info at bottom */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-medium text-sm">
                {session.user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user.username}
              </p>
              <div className="flex items-center space-x-1">
                {isAdmin && <Shield className="w-3 h-3 text-red-500" />}
                <p className="text-xs text-gray-500 capitalize">
                  {session.user.role?.replace('_', ' ').toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="hidden lg:block">
                <h1 className="text-xl font-semibold text-gray-900">
                  {pathname === '/dashboard' && 'Dashboard'}
                  {pathname === '/data-entry' && 'Add Entry'}
                  {pathname === '/analytics' && 'Analytics'}
                  {pathname === '/reports' && 'Reports'}
                  {pathname === '/settings' && 'Settings'}
                  {pathname === '/profile' && 'Profile'}
                  {pathname.startsWith('/admin') && (
                    <span className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-600" />
                      Admin Panel
                    </span>
                  )}
                </h1>
              </div>
            </div>

            {/* User Profile Dropdown */}
            <UserProfileDropdown />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}