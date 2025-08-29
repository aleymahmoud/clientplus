// src/components/ui/UserProfileDropdown.tsx
'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  Users as UsersIcon
} from 'lucide-react';

export function UserProfileDropdown() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setIsOpen(false);
  };

  const handleAdminClick = () => {
    router.push('/admin');
    setIsOpen(false);
  };

  const isAdmin = session.user.role === 'SUPER_USER';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {session.user.username?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">{session.user.username}</p>
          <p className="text-xs text-gray-500 capitalize">
            {session.user.role?.replace('_', ' ').toLowerCase()}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-20">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {session.user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session.user.username}</p>
                  <p className="text-sm text-gray-500">{session.user.email}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {isAdmin && <Shield className="w-3 h-3 text-red-500" />}
                    <span className="text-xs text-gray-500 capitalize">
                      {session.user.role?.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>

              {/* Admin Access - Only show for SUPER_USER */}
              {isAdmin && (
                <>
                  <div className="border-t border-gray-100 my-2" />
                  <button
                    onClick={handleAdminClick}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </button>
                </>
              )}

              <div className="border-t border-gray-100 my-2" />
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}