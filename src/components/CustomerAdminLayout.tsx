import React from 'react';
import { Users2, BookOpen, Settings, LayoutDashboard, LogOut, Building2, ArrowLeft } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { Customer } from '../types';

interface CustomerAdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  customer: Customer;
}

const CustomerAdminLayout: React.FC<CustomerAdminLayoutProps> = ({ children, currentPage, customer }) => {
  const { canGoBack, goBack, navigateTo } = useNavigation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Home', path: 'home' },
    { icon: <Users2 size={20} />, label: 'Users', path: 'users' },
    { icon: <Users2 size={20} />, label: 'Groups', path: 'groups' },
    { icon: <BookOpen size={20} />, label: 'Courses', path: 'courses' },
    { icon: <Settings size={20} />, label: 'Settings', path: 'settings' },
  ];

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
            <span className="text-white font-bold">
              {customer.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-xl font-bold text-primary truncate">
            {customer.name}
          </span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
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

export default CustomerAdminLayout;