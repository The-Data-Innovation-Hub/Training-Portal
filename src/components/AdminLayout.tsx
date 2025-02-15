import React from 'react';
import { Building2, Users2, BookOpen, Settings, LayoutDashboard, LogOut, ArrowLeft, Award } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Home', path: 'home', roles: ['platform_admin', 'customer_admin', 'user'] },
  { icon: <Building2 size={20} />, label: 'Customers', path: 'customers', roles: ['platform_admin'] },
  { icon: <BookOpen size={20} />, label: 'Courses', path: 'courses', roles: ['platform_admin', 'customer_admin', 'user'] },
  { icon: <Award size={20} />, label: 'Certificates', path: 'certificates', roles: ['user'] },
  { icon: <Users2 size={20} />, label: 'Users', path: 'users', roles: ['platform_admin', 'customer_admin'] },
  { icon: <Settings size={20} />, label: 'Settings', path: 'settings', roles: ['platform_admin', 'customer_admin'] },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage }) => {
  const { canGoBack, goBack, navigateTo } = useNavigation();
  const { logout } = useAuth();

  const { user } = useAuth();
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-8">
          {canGoBack && (
            <button
              onClick={goBack}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">TH</span>
          </div>
          <span className="text-xl font-bold text-primary">TrainingHub</span>
        </div>
        
        <nav className="space-y-2">
          {filteredMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigateTo(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
                ${currentPage === item.path 
                  ? 'bg-primary text-white shadow-neumorph-sm' 
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;