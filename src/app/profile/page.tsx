// src/app/profile/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  Shield,
  Calendar,
  Mail
} from 'lucide-react';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (!session?.user) {
    return null;
  }

  const isAdmin = session.user.role === 'SUPER_USER';

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordForm),
      });

      if (response.ok) {
        toast.success('Password updated successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update password');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {session.user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {session.user.username}
                </h1>
                {isAdmin && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    <Shield className="h-3 w-3" />
                    <span>Admin</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="capitalize">
                    {session.user.role?.replace('_', ' ').toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{session.user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Member since 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input 
                value={session.user.username} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input 
                value={session.user.role?.replace('_', ' ')} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            {session.user.email && (
              <div className="space-y-2 md:col-span-2">
                <Label>Email</Label>
                <Input 
                  value={session.user.email} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Lock className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  placeholder="Enter your current password"
                  required
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  placeholder="Enter your new password (min 8 characters)"
                  required
                  minLength={8}
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  placeholder="Confirm your new password"
                  required
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <p className="font-medium mb-1">Password Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>At least 8 characters long</li>
                <li>Should be different from your current password</li>
                <li>Use a strong, unique password</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              disabled={isChangingPassword}
              className="w-full"
            >
              {isChangingPassword ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </div>

        {/* Admin Access Info */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-red-600" />
              <h2 className="text-lg font-semibold text-red-800">Administrator Access</h2>
            </div>
            <p className="text-sm text-red-700 mb-4">
              You have full administrator privileges. Use the admin panel to manage users, 
              configure system settings, and monitor application usage.
            </p>
            <div className="flex space-x-3">
              <a
                href="/admin"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                <Shield className="h-4 w-4 mr-2" />
                Open Admin Panel
              </a>
              <a
                href="/admin/users"
                className="inline-flex items-center px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-md border border-red-600 hover:bg-red-50 transition-colors"
              >
                Manage Users
              </a>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}