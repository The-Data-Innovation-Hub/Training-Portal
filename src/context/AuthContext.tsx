import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthState, AuthUser, Permission, UserRole } from '../types/auth';
import { toast } from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  platform_admin: [
    { action: 'create', resource: 'course' },
    { action: 'read', resource: 'course' },
    { action: 'update', resource: 'course' },
    { action: 'delete', resource: 'course' },
    { action: 'share', resource: 'course' },
    { action: 'create', resource: 'user' },
    { action: 'read', resource: 'user' },
    { action: 'update', resource: 'user' },
    { action: 'delete', resource: 'user' },
    { action: 'create', resource: 'customer' },
    { action: 'read', resource: 'customer' },
    { action: 'update', resource: 'customer' },
    { action: 'delete', resource: 'customer' },
    { action: 'read', resource: 'setting' },
    { action: 'update', resource: 'setting' }
  ],
  customer_admin: [
    { action: 'read', resource: 'course' },
    { action: 'create', resource: 'user' },
    { action: 'read', resource: 'user' },
    { action: 'update', resource: 'user', condition: 'own_organization' },
    { action: 'delete', resource: 'user', condition: 'own_organization' },
    { action: 'read', resource: 'customer' },
    { action: 'update', resource: 'customer', condition: 'own_organization' },
    { action: 'create', resource: 'group' },
    { action: 'read', resource: 'group', condition: 'own_organization' },
    { action: 'update', resource: 'group', condition: 'own_organization' },
    { action: 'delete', resource: 'group', condition: 'own_organization' }
  ],
  user: [
    { action: 'read', resource: 'course' },
    { action: 'read', resource: 'user', condition: 'own_profile' },
    { action: 'update', resource: 'user', condition: 'own_profile' },
    { action: 'read', resource: 'group', condition: 'member' }
  ]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data based on email
      let user: AuthUser;
      if (email.includes('admin')) {
        user = {
          id: 'admin1',
          firstName: 'Admin',
          lastName: 'User',
          email,
          role: 'platform_admin',
          lastLogin: new Date().toISOString()
        };
      } else if (email.includes('customer')) {
        user = {
          id: 'customer1',
          firstName: 'Customer',
          lastName: 'Admin',
          email,
          role: 'customer_admin',
          customerId: '1',
          lastLogin: new Date().toISOString()
        };
      } else {
        user = {
          id: 'user1',
          firstName: 'Regular',
          lastName: 'User',
          email,
          role: 'user',
          customerId: '1',
          lastLogin: new Date().toISOString()
        };
      }

      setState({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      toast.success('Logged in successfully');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Login failed');
    }
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    toast.success('Logged out successfully');
  }, []);

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!state.user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[state.user.role].filter(p => {
      // Check if permission matches action and resource
      const basicMatch = p.action === permission.action && p.resource === permission.resource;
      
      // If no condition is specified, just check basic match
      if (!p.condition) return basicMatch;
      
      // Check condition-specific logic
      switch (p.condition) {
        case 'own_organization':
          return basicMatch && permission.targetId === state.user.customerId;
        case 'own_profile':
          return basicMatch && permission.targetId === state.user.id;
        case 'member':
          // This would check if the user is a member of the group
          // You would need to implement the actual group membership check
          return basicMatch;
        default:
          return false;
      }
    });
    
    return userPermissions.length > 0;
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};