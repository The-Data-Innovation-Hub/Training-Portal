import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Building2, Users2, BookOpen, Target, Filter, X, Edit, Trash2 } from 'lucide-react';
import { Customer } from '../types';
import CustomerProfile from './CustomerProfile';
import CustomerEditor from './CustomerEditor';
import { toast } from 'react-hot-toast';
import { updateMockCustomers, updateMockCustomer } from '../mockData';

interface CustomerListProps {
  customers: Customer[];
}

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const [customerList, setCustomerList] = useState<Customer[]>(customers);

  const filteredCustomers = customerList.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCustomer = () => {
    setEditingCustomer(undefined);
    setShowEditor(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditor(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const updatedList = customerList.filter(c => c.id !== customerId);
      setCustomerList(updatedList);
      updateMockCustomers(updatedList);
      toast.success('Customer deleted successfully');
    }
  };

  const handleSaveCustomer = (customerData: Partial<Customer>) => {
    const newCustomer: Customer = {
      id: customerData.id || `c${Date.now()}`,
      name: customerData.name || '',
      email: customerData.email || '',
      status: customerData.status || 'pending',
      totalUsers: customerData.totalUsers || 0,
      activeCourses: customerData.activeCourses || 0,
      completionRate: customerData.completionRate || 0,
      subscriptionType: customerData.subscriptionType || 'basic',
      lastActive: new Date().toISOString()
    };

    if (editingCustomer) {
      setCustomerList(prev => 
        prev.map(customer => customer.id === editingCustomer.id ? { ...newCustomer, id: customer.id } : customer)
      );
      updateMockCustomer({ ...newCustomer, id: editingCustomer.id });
      toast.success('Customer updated successfully');
    } else {
      const updatedList = [...customerList, newCustomer];
      setCustomerList(updatedList);
      updateMockCustomers(updatedList);
      toast.success('Customer created successfully');
    }

    setShowEditor(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showEditor) {
    return (
      <CustomerEditor
        customer={editingCustomer}
        onSave={handleSaveCustomer}
        onCancel={() => setShowEditor(false)}
      />
    );
  }

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-neumorph p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
        <button
          onClick={handleCreateCustomer}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-start">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
          <select
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={subscriptionFilter}
            onChange={(e) => setSubscriptionFilter(e.target.value)}
          >
            <option value="all">All Subscriptions</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="grid grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-xl shadow-neumorph-sm p-6 hover:shadow-neumorph transition-all duration-200 cursor-pointer relative group"
            onClick={() => setSelectedCustomer(customer)}
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {customer.branding?.logo ? (
                  <img 
                    src={customer.branding.logo} 
                    alt={`${customer.name} logo`}
                    className="w-12 h-12 object-contain rounded-lg shadow-neumorph-sm"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary text-xl font-bold">
                      {customer.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
              </div>
              <div className="relative z-10">
                <button
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    const menu = e.currentTarget.nextElementSibling;
                    menu?.classList.toggle('hidden');
                  }}
                >
                  <MoreVertical size={20} className="text-gray-400" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-neumorph-sm py-2 hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomer(customer);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Users2 size={16} />
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCustomer(customer);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Edit Customer
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustomer(customer.id);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Customer
                  </button>
                </div>
              </div>
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Status and Subscription */}
            <div className="flex gap-2 mb-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                {customer.status}
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSubscriptionColor(customer.subscriptionType)}`}>
                {customer.subscriptionType}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-600">Users</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{customer.totalUsers}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-600">Courses</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{customer.activeCourses}</p>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Completion Rate</span>
                <span className="text-sm font-medium text-primary">{customer.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${customer.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
        {selectedCustomer && (
          <CustomerProfile
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onDelete={handleDeleteCustomer}
            onSave={(updatedCustomer) => {
              const updatedList = customerList.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
              setCustomerList(updatedList);
              updateMockCustomers(updatedList);
              setSelectedCustomer(updatedCustomer); // Update the selected customer with new data
              toast.success('Customer updated successfully');
            }}
          />
        )}
    </div>
  );
};

export default CustomerList;