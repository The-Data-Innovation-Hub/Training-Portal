import { Customer, Course, Group } from './types';

interface PlatformStats {
  monthlyStats: {
    users: number[];
    courses: number[];
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

export const platformStats: PlatformStats = {
  monthlyStats: {
    users: [820, 932, 901, 934, 1290, 1330, 1320, 1250],
    courses: [320, 332, 301, 334, 390, 330, 320, 350],
    completion: [65, 70, 68, 72, 75, 78, 80, 82]
  },
  recentActivity: [
    { user: 'John Doe', action: 'Completed ACLS Course', time: '2 hours ago' },
    { user: 'Sarah Johnson', action: 'Started Infection Prevention', time: '4 hours ago' },
    { user: 'Michael Chen', action: 'Achieved Certification', time: '6 hours ago' }
  ],
  topPerformers: [
    { name: 'City General Hospital', score: 98 },
    { name: 'Regional Medical Center', score: 95 },
    { name: 'Community Health Network', score: 92 }
  ]
};

let mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Belfast Trust',
    industry: 'NHS Trust',
    email: 'training@belfasttrust.hscni.net',
    status: 'active',
    totalUsers: 450,
    activeCourses: 15,
    completionRate: 78,
    subscriptionType: 'enterprise',
    lastActive: '2024-03-10T14:30:00Z',
    users: [
      {
        id: 'u1',
        firstName: 'Sarah',
        lastName: 'O\'Connor',
        email: 's.oconnor@belfasttrust.hscni.net',
        role: 'customer_admin',
        status: 'active',
        groupId: 'g1',
        createdAt: '2024-01-15T10:00:00Z',
        lastLogin: '2024-03-10T14:30:00Z'
      },
      {
        id: 'u2',
        firstName: 'James',
        lastName: 'Murphy',
        email: 'j.murphy@belfasttrust.hscni.net',
        role: 'user',
        status: 'active',
        groupId: 'g1',
        createdAt: '2024-01-16T09:00:00Z',
        lastLogin: '2024-03-11T11:20:00Z'
      },
      {
        id: 'u3',
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'e.wilson@belfasttrust.hscni.net',
        role: 'user',
        status: 'active',
        groupId: 'g1',
        createdAt: '2024-01-17T11:30:00Z',
        lastLogin: '2024-03-12T09:45:00Z'
      },
      {
        id: 'u4',
        firstName: 'David',
        lastName: 'Campbell',
        email: 'd.campbell@belfasttrust.hscni.net',
        role: 'customer_admin',
        status: 'active',
        groupId: 'g2',
        createdAt: '2024-01-18T14:00:00Z',
        lastLogin: '2024-03-10T16:15:00Z'
      },
      {
        id: 'u5',
        firstName: 'Laura',
        lastName: 'Kelly',
        email: 'l.kelly@belfasttrust.hscni.net',
        role: 'user',
        status: 'active',
        groupId: 'g2',
        createdAt: '2024-01-19T10:30:00Z',
        lastLogin: '2024-03-11T13:40:00Z'
      },
      {
        id: 'u6',
        firstName: 'Michael',
        lastName: 'Walsh',
        email: 'm.walsh@belfasttrust.hscni.net',
        role: 'user',
        status: 'active',
        groupId: 'g2',
        createdAt: '2024-01-20T09:15:00Z',
        lastLogin: '2024-03-12T10:25:00Z'
      },
      {
        id: 'u7',
        firstName: 'Claire',
        lastName: 'Donnelly',
        email: 'c.donnelly@belfasttrust.hscni.net',
        role: 'customer_admin',
        status: 'active',
        groupId: 'g3',
        createdAt: '2024-01-21T13:45:00Z',
        lastLogin: '2024-03-10T15:30:00Z'
      },
      {
        id: 'u8',
        firstName: 'Paul',
        lastName: 'McGuinness',
        email: 'p.mcguinness@belfasttrust.hscni.net',
        role: 'user',
        status: 'active',
        groupId: 'g3',
        createdAt: '2024-01-22T11:20:00Z',
        lastLogin: '2024-03-11T14:15:00Z'
      },
      {
        id: 'u9',
        firstName: 'Siobhan',
        lastName: 'O\'Neill',
        email: 's.oneill@belfasttrust.hscni.net',
        role: 'user',
        status: 'active',
        groupId: 'g3',
        createdAt: '2024-01-23T10:00:00Z',
        lastLogin: '2024-03-12T11:50:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Regional Medical Center',
    industry: 'Primary Care Organisation',
    email: 'education@regionalmed.com',
    status: 'active',
    totalUsers: 0,
    activeCourses: 8,
    completionRate: 92,
    subscriptionType: 'premium',
    lastActive: '2024-03-11T09:15:00Z',
    users: []
  },
  {
    id: '3',
    name: 'Community Health Network',
    industry: 'Care Home',
    email: 'training@communityhealth.org',
    status: 'pending',
    totalUsers: 0,
    activeCourses: 6,
    completionRate: 65,
    subscriptionType: 'basic',
    lastActive: '2024-03-09T16:45:00Z',
    users: []
  }
];

export const getCustomerStats = (customerId: string): CustomerStats => ({
  monthlyStats: {
    users: [120, 132, 141, 134, 150, 160, 155, 165],
    courseProgress: [45, 52, 48, 54, 59, 63, 62, 66],
    completion: [65, 68, 70, 72, 75, 78, 77, 80]
  },
  recentActivity: [
    { user: 'John Doe', action: 'Completed ACLS Course', time: '2 hours ago' },
    { user: 'Sarah Johnson', action: 'Started Infection Prevention', time: '4 hours ago' },
    { user: 'Michael Chen', action: 'Achieved Certification', time: '6 hours ago' }
  ],
  topPerformers: [
    { name: 'John Doe', score: 98 },
    { name: 'Sarah Johnson', score: 95 },
    { name: 'Michael Chen', score: 92 }
  ]
});
// Add functions to manage mock data
export const getMockCustomers = () => mockCustomers;

export const updateMockCustomers = (customers: Customer[]) => {
  mockCustomers = customers;
};

export const updateMockCustomer = (updatedCustomer: Customer) => {
  mockCustomers = mockCustomers.map(customer => 
    customer.id === updatedCustomer.id ? updatedCustomer : customer
  );
  return mockCustomers;
};

export const mockGroups: Group[] = [
  {
    id: 'g1',
    name: 'Royal Victoria Hospital',
    type: 'location',
    description: 'Royal Victoria Hospital staff and practitioners',
    members: ['u1', 'u2', 'u3'],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
    customerId: '1'
  },
  {
    id: 'g2',
    name: 'City Hospital',
    type: 'location',
    description: 'City Hospital staff and practitioners',
    members: ['u4', 'u5', 'u6'],
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
    customerId: '1'
  },
  {
    id: 'g3',
    name: 'Mater Hospital',
    type: 'location',
    description: 'Mater Hospital staff and practitioners',
    members: ['u7', 'u8', 'u9'],
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
    customerId: '1'
  }
];
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced Cardiac Life Support (ACLS)',
    description: 'Comprehensive training in advanced cardiovascular life support for healthcare professionals.',
    status: 'published',
    customerId: '1',
    sharedWith: ['1'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
    modules: [
      {
        id: 'm1',
        title: 'Cardiac Arrest Recognition and Management',
        description: 'Learn to identify and respond to cardiac emergencies effectively',
        order: 1,
        topics: [
          {
            id: 't1',
            title: 'Recognition of Cardiac Arrest',
            description: 'Learn to quickly identify signs of cardiac arrest and initiate immediate response',
            duration: 30,
            videoUrl: 'https://example.com/video1.mp4',
            order: 1,
            completed: true,
            completedAt: '2024-03-10T14:30:00Z',
            ratings: [
              {
                userId: 'u1',
                rating: 5,
                comment: 'Excellent explanation of the signs and symptoms',
                createdAt: '2024-03-10T15:00:00Z'
              },
              {
                userId: 'u2',
                rating: 4,
                comment: 'Very clear and practical',
                createdAt: '2024-03-11T10:00:00Z'
              }
            ]
          },
          {
            id: 't2',
            title: 'Initial Assessment and Response',
            description: 'Master the systematic approach to initial patient assessment and emergency response',
            duration: 25,
            videoUrl: 'https://example.com/video2.mp4',
            order: 2,
            completed: true,
            completedAt: '2024-03-11T10:15:00Z',
            ratings: [
              {
                userId: 'u3',
                rating: 5,
                comment: 'The step-by-step approach was very helpful',
                createdAt: '2024-03-11T11:00:00Z'
              }
            ]
          },
          {
            id: 't3',
            title: 'High-Quality CPR Techniques',
            description: 'Advanced techniques for performing effective chest compressions and ventilation',
            duration: 35,
            videoUrl: 'https://example.com/video3.mp4',
            order: 3
          },
          {
            id: 't4',
            title: 'Team Dynamics in Resuscitation',
            description: 'Effective team coordination and communication during cardiac emergencies',
            duration: 40,
            videoUrl: 'https://example.com/video4.mp4',
            order: 4
          }
        ]
      },
      {
        id: 'm2',
        title: 'Advanced Cardiac Rhythms and Interventions',
        description: 'Comprehensive study of cardiac rhythms and appropriate therapeutic interventions',
        order: 2,
        topics: [
          {
            id: 't5',
            title: 'ECG Rhythm Recognition',
            description: 'Advanced interpretation of cardiac rhythms and arrhythmias',
            duration: 45,
            videoUrl: 'https://example.com/video5.mp4',
            order: 1
          },
          {
            id: 't6',
            title: 'Pharmacological Interventions',
            description: 'Understanding and implementing appropriate medication protocols in cardiac emergencies',
            duration: 50,
            videoUrl: 'https://example.com/video6.mp4',
            order: 2
          },
          {
            id: 't7',
            title: 'Defibrillation and Cardioversion',
            description: 'Proper use of defibrillators and timing of cardioversion in different scenarios',
            duration: 40,
            videoUrl: 'https://example.com/video7.mp4',
            order: 3
          }
        ]
      },
      {
        id: 'm3',
        title: 'Special Resuscitation Situations',
        description: 'Managing cardiac emergencies in specific patient populations and circumstances',
        order: 3,
        topics: [
          {
            id: 't8',
            title: 'Pregnancy and Cardiac Arrest',
            description: 'Special considerations and modifications for managing cardiac arrest in pregnant patients',
            duration: 35,
            videoUrl: 'https://example.com/video8.mp4',
            order: 1
          },
          {
            id: 't9',
            title: 'Pediatric Advanced Life Support',
            description: 'Specialized techniques and considerations for pediatric resuscitation',
            duration: 45,
            videoUrl: 'https://example.com/video9.mp4',
            order: 2
          },
          {
            id: 't10',
            title: 'Environmental Emergencies',
            description: 'Managing cardiac arrest in drowning, electrocution, and other environmental conditions',
            duration: 40,
            videoUrl: 'https://example.com/video10.mp4',
            order: 3
          }
        ]
      },
      {
        id: 'm4',
        title: 'Post-Resuscitation Care',
        description: 'Comprehensive management of patients following return of spontaneous circulation',
        order: 4,
        topics: [
          {
            id: 't11',
            title: 'Immediate Post-Cardiac Arrest Care',
            description: 'Stabilization and monitoring procedures immediately following resuscitation',
            duration: 35,
            videoUrl: 'https://example.com/video11.mp4',
            order: 1
          },
          {
            id: 't12',
            title: 'Advanced Monitoring Techniques',
            description: 'Implementation of advanced hemodynamic and neurological monitoring',
            duration: 40,
            videoUrl: 'https://example.com/video12.mp4',
            order: 2
          },
          {
            id: 't13',
            title: 'Long-term Care Planning',
            description: 'Developing comprehensive care plans for post-cardiac arrest patients',
            duration: 35,
            videoUrl: 'https://example.com/video13.mp4',
            order: 3
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Infection Prevention and Control',
    description: 'Essential training in modern infection control practices for healthcare settings.',
    status: 'draft',
    customerId: '1',
    sharedWith: ['1'],
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    modules: [
      {
        id: 'm3',
        title: 'Standard Precautions',
        description: 'Comprehensive overview of standard infection prevention measures',
        order: 1,
        topics: [
          {
            id: 't4',
            title: 'Hand Hygiene Protocols',
            description: 'Evidence-based hand hygiene practices and compliance monitoring',
            duration: 18,
            videoUrl: 'https://example.com/video4.mp4',
            order: 1
          }
        ]
      }
    ]
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: 'cert1',
    userId: 'user1',
    courseId: '1',
    courseName: 'Advanced Cardiac Life Support (ACLS)',
    userName: 'Regular User',
    customerName: 'Belfast Trust',
    issueDate: '2024-03-12T00:00:00Z',
    expiryDate: '2025-03-12T00:00:00Z',
    certificateNumber: 'ACLS-2024-001',
    grade: 'Distinction',
    signatures: [
      {
        name: 'Dr. James Wilson',
        title: 'Course Director',
        signature: 'https://example.com/signatures/jwilson.png'
      },
      {
        name: 'Dr. Emma Thompson',
        title: 'Medical Director',
        signature: 'https://example.com/signatures/ethompson.png'
      }
    ]
  },
  {
    id: 'cert2',
    userId: 'user1',
    courseId: '2',
    courseName: 'Infection Prevention and Control',
    userName: 'Regular User',
    customerName: 'Belfast Trust',
    issueDate: '2024-03-10T00:00:00Z',
    expiryDate: '2025-03-10T00:00:00Z',
    certificateNumber: 'IPC-2024-002',
    grade: 'Merit',
    signatures: [
      {
        name: 'Dr. James Wilson',
        title: 'Course Director',
        signature: 'https://example.com/signatures/jwilson.png'
      },
      {
        name: 'Dr. Emma Thompson',
        title: 'Medical Director',
        signature: 'https://example.com/signatures/ethompson.png'
      }
    ]
  },
  {
    id: 'cert3',
    userId: 'u1',
    courseId: '1',
    courseName: 'Advanced Cardiac Life Support (ACLS)',
    userName: 'Sarah O\'Connor',
    customerName: 'Belfast Trust',
    issueDate: '2024-03-12T00:00:00Z',
    expiryDate: '2025-03-12T00:00:00Z',
    certificateNumber: 'ACLS-2024-001',
    grade: 'Distinction',
    signatures: [
      {
        name: 'Dr. James Wilson',
        title: 'Course Director',
        signature: 'https://example.com/signatures/jwilson.png'
      },
      {
        name: 'Dr. Emma Thompson',
        title: 'Medical Director',
        signature: 'https://example.com/signatures/ethompson.png'
      }
    ]
  }
];