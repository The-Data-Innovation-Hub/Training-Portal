export type UserRole = 'platform_admin' | 'customer_admin' | 'user';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  customerId?: string;
  lastLogin?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete' | 'share';
  resource: 'course' | 'user' | 'customer' | 'setting';
  targetId?: string;
  condition?: 'own_organization' | 'own_profile' | 'member';
}