export interface Customer {
  id: string;
  name: string;
  industry: string;
  phone?: string;
  website?: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  totalUsers: number;
  activeCourses: number;
  completionRate: number;
  subscriptionType: 'basic' | 'premium' | 'enterprise';
  lastActive: string;
  users?: UserAccount[];
  branding?: {
    logo?: string;
    colors: {
      primary: string;
      secondary?: string;
      tertiary?: string;
    };
  };
  usageStats?: {
    activeUsers: number;
    totalHoursSpent: number;
    averageSessionLength: number;
    topCourses: Array<{
      name: string;
      completionRate: number;
    }>;
    weeklyActivity: number[];
  };
}

export interface CustomerStats {
  monthlyStats: {
    users: number[];
    courseProgress: number[];
    completion: number[];
  };
  recentActivity: Array<{
    user: string;
    action: string;
    time: string;
  }>;
  topPerformers: Array<{
    name: string;
    score: number;
  }>;
}

export interface UserAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  language?: string;
  notificationPreferences?: {
    email: boolean;
    inApp: boolean;
    digest: 'none' | 'daily' | 'weekly';
  };
  privacySettings?: {
    profileVisibility: 'public' | 'organization' | 'private';
    showEmail: boolean;
    showLocation: boolean;
  };
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  role: 'platform_admin' | 'customer_admin' | 'user';
  status: 'active' | 'inactive';
  groupId?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Group {
  id: string;
  name: string;
  type: 'location' | 'class' | 'team';
  description: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  customerId: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  modules: Module[];
  customerId: string;
  sharedWith?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  order: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number;
  order: number;
  completed?: boolean;
  completedAt?: string;
  ratings?: {
    userId: string;
    rating: number;
    comment?: string;
    createdAt: string;
  }[];
  averageRating?: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  userName: string;
  customerName: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber: string;
  grade?: string;
  signatures?: {
    name: string;
    title: string;
    signature: string;
  }[];
}