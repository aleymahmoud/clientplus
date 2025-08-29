// src/components/admin/CreateUserModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Shield,
  ShieldCheck,
  Users,
  UserCheck,
  X
} from 'lucide-react';

const createUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  role: z.enum(['SUPER_USER', 'LEAD_CONSULTANT', 'CONSULTANT', 'SUPPORTING']),
  isActive: z.boolean(),
  domainIds: z.array(z.number()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateUserData = z.infer<typeof createUserSchema>;

interface Domain {
  id: number;
  domainName: string;
  userCount: number;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const roleOptions = [
  { value: 'SUPER_USER', label: 'Super User', icon: Shield, color: 'text-red-600', description: 'Full system access' },
  { value: 'LEAD_CONSULTANT', label: 'Lead Consultant', icon: ShieldCheck, color: 'text-blue-600', description: 'Team leadership access' },
  { value: 'CONSULTANT', label: 'Consultant', icon: Users, color: 'text-green-600', description: 'Standard consultant access' },
  { value: 'SUPPORTING', label: 'Supporting Staff', icon: UserCheck, color: 'text-gray-600', description: 'Limited support access' },
] as const;

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'CONSULTANT',
      isActive: true,
      domainIds: [],
    },
  });

  const password = watch('password');
  const selectedRole = watch('role');
  const selectedDomainIds = watch('domainIds') || [];

  // Fetch domains when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDomains();
    }
  }, [isOpen]);

  const fetchDomains = async () => {
    setLoadingDomains(true);
    try {
      const response = await fetch('/api/admin/domains');
      if (response.ok) {
        const domainsData = await response.json();
        setDomains(domainsData.map((d: any) => ({
          id: d.id,
          domainName: d.domainName,
          userCount: d._count?.userDomains || 0,
        })));
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setLoadingDomains(false);
    }
  };

  const onSubmit = async (data: CreateUserData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('User created successfully!', {
          description: `${result.user.username} has been added to the system.`,
        });
        reset();
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        toast.error('Failed to create user', {
          description: error.error || 'An unexpected error occurred',
        });
      }
    } catch (error) {
      toast.error('Network error', {
        description: 'Failed to connect to the server',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return [];
    
    return [
      { met: password.length >= 8, text: 'At least 8 characters' },
      { met: /[a-z]/.test(password), text: 'One lowercase letter' },
      { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
      { met: /\d/.test(password), text: 'One number' },
    ];
  };

  const toggleDomainSelection = (domainId: number) => {
    const currentIds = selectedDomainIds;
    const newIds = currentIds.includes(domainId)
      ? currentIds.filter(id => id !== domainId)
      : [...currentIds, domainId];
    setValue('domainIds', newIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Create New User
          </DialogTitle>
          <DialogDescription>
            Add a new user to the ClientPlus system. They will receive login credentials via email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="Enter username"
                {...register('username')}
                disabled={isLoading}
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register('email')}
                disabled={isLoading}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  {...register('password')}
                  disabled={isLoading}
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
              <div className="grid grid-cols-2 gap-2">
                {getPasswordStrength(password).map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${req.met ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-3">
            <Label>User Role *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedRole === option.value;
                
                return (
                  <label
                    key={option.value}
                    className={`
                      relative flex items-center p-3 border rounded-lg cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register('role')}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3 w-full">
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : option.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Domain Assignment */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Domain Access (Optional)</Label>
              {loadingDomains && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              {domains.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {domains.map((domain) => (
                    <label
                      key={domain.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDomainIds.includes(domain.id)}
                        onChange={() => toggleDomainSelection(domain.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{domain.domainName}</span>
                      <span className="text-xs text-gray-500">({domain.userCount} users)</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {loadingDomains ? 'Loading domains...' : 'No domains available'}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Select the domains this user should have access to. Leave empty for no domain restrictions.
            </p>
          </div>

          {/* User Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="isActive" className="text-sm font-normal">
              Activate user account immediately
            </Label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}