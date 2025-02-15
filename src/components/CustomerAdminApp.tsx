import React from 'react';
import { Toaster } from 'react-hot-toast';
import CustomerAdminLayout from './CustomerAdminLayout';
import CustomerAdminDashboard from './CustomerAdminDashboard';
import { getMockCustomers, mockCourses } from '../mockData';
import CustomerProfile from './CustomerProfile';
import UserList from './UserList';
import CourseList from './CourseList';
import GroupList from './GroupList';
import CompanySettingsScreen from './CompanySettingsScreen';
import { useNavigation, NavigationProvider } from '../context/NavigationContext';

interface CustomerAdminAppProps {
  customerId: string;
}

const AppContent: React.FC<{ customerId: string }> = ({ customerId }) => {
  const { currentPage, navigateTo } = useNavigation();
  const customer = getMockCustomers().find(c => c.id === customerId)!;

  const getContent = () => {
    switch (currentPage) {
      case 'home':
        return <CustomerAdminDashboard customer={customer} />;
      case 'users':
        return <UserList />;
      case 'groups':
        return <GroupList customerId={customerId} />;
      case 'courses':
        return <CourseList courses={mockCourses.filter(c => c.customerId === customerId)} />;
      case 'settings':
        return <CompanySettingsScreen />;
      default:
        return <CustomerAdminDashboard customer={customer} />;
    }
  };

  return (
    <>
      <CustomerAdminLayout currentPage={currentPage} customer={customer}>
        {getContent()}
      </CustomerAdminLayout>
      <Toaster position="top-right" />
    </>
  );
};

const CustomerAdminApp: React.FC<CustomerAdminAppProps> = ({ customerId }) => {
  return (
    <NavigationProvider>
      <AppContent customerId={customerId} />
    </NavigationProvider>
  );
};

export default CustomerAdminApp;