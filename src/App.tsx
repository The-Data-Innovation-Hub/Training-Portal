import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/AdminLayout';
import CustomerAdminApp from './components/CustomerAdminApp';
import LoginScreen from './components/LoginScreen';
import { getMockCustomers, mockCourses, mockCertificates } from './mockData';
import DashboardScreen from './components/DashboardScreen';
import CustomerList from './components/CustomerList';
import CourseList from './components/CourseList';
import UserList from './components/UserList';
import CertificateViewer from './components/CertificateViewer';
import SettingsScreen from './components/SettingsScreen';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
  const { currentPage, navigateTo } = useNavigation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (user?.role === 'customer_admin' && user.customerId) {
    return <CustomerAdminApp customerId={user.customerId} />;
  }

  const getContent = () => {
    switch (currentPage) {
      case 'home':
        return <DashboardScreen />;
      case 'customers':
        return <CustomerList customers={getMockCustomers()} />;
      case 'courses':
        return <CourseList courses={user?.role === 'platform_admin' ? mockCourses : mockCourses.filter(c => c.customerId === user?.customerId || c.sharedWith?.includes(user?.customerId || ''))} />;
      case 'certificates':
        return <CertificateViewer certificates={mockCertificates.filter(cert => cert.userId === user?.id)} onBack={() => navigateTo('home')} />;
      case 'users':
        return <UserList />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <>
      <AdminLayout currentPage={currentPage}>
        {getContent()}
      </AdminLayout>
      <Toaster position="top-right" />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;