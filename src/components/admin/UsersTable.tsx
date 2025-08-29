// src/components/admin/UsersTable.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Edit, 
  Trash2, 
  Search, 
  Plus, 
  Shield,
  ShieldCheck,
  Users,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'SUPER_USER' | 'LEAD_CONSULTANT' | 'CONSULTANT' | 'SUPPORTING';
  isActive: boolean;
  createdAt: string;
  entryCount: number;
  domains: string[];
}

interface UsersTableProps {
  users: User[];
  onRefresh: () => void;
  onEditUser: (user: User) => void;
  onCreateUser: () => void;
}

const roleConfig = {
  SUPER_USER: { 
    label: 'Super User', 
    icon: Shield, 
    color: 'text-red-600 bg-red-100',
    priority: 1
  },
  LEAD_CONSULTANT: { 
    label: 'Lead Consultant', 
    icon: ShieldCheck, 
    color: 'text-blue-600 bg-blue-100',
    priority: 2
  },
  CONSULTANT: { 
    label: 'Consultant', 
    icon: Users, 
    color: 'text-green-600 bg-green-100',
    priority: 3
  },
  SUPPORTING: { 
    label: 'Supporting', 
    icon: UserCheck, 
    color: 'text-gray-600 bg-gray-100',
    priority: 4
  },
};

export function UsersTable({ users, onRefresh, onEditUser, onCreateUser }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.domains.some(domain => domain.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort by role priority, then by username
  const sortedUsers = filteredUsers.sort((a, b) => {
    const roleComparison = roleConfig[a.role].priority - roleConfig[b.role].priority;
    if (roleComparison !== 0) return roleComparison;
    return a.username.localeCompare(b.username);
  });

  const handleToggleStatus = async (user: User) => {
    setLoadingUserId(user.id);
    
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !user.isActive,
        }),
      });

      if (response.ok) {
        toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
        onRefresh();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update user status');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to deactivate ${user.username}?`)) {
      return;
    }

    setLoadingUserId(user.id);
    
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('User deactivated successfully');
        onRefresh();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to deactivate user');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <Button onClick={onCreateUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="SUPER_USER">Super User</option>
            <option value="LEAD_CONSULTANT">Lead Consultant</option>
            <option value="CONSULTANT">Consultant</option>
            <option value="SUPPORTING">Supporting</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {sortedUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domains
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user) => {
                const roleInfo = roleConfig[user.role];
                const RoleIcon = roleInfo.icon;
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-medium text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {roleInfo.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {user.domains.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.domains.slice(0, 2).map((domain, index) => (
                              <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {domain}
                              </span>
                            ))}
                            {user.domains.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{user.domains.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No domains assigned</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.entryCount} entries
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'text-green-800 bg-green-100' 
                            : 'text-red-800 bg-red-100'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={loadingUserId === user.id}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditUser(user)}
                          disabled={loadingUserId === user.id}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          disabled={loadingUserId === user.id || !user.isActive}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterRole || filterStatus 
                ? 'Try adjusting your filters or search term.' 
                : 'Get started by creating a new user.'}
            </p>
            {!searchTerm && !filterRole && !filterStatus && (
              <div className="mt-6">
                <Button onClick={onCreateUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}