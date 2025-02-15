import React, { useState } from 'react';
import { Search, Users2, Mail, Building2, Clock, Shield, MapPin, Plus, X, Eye, EyeOff, Check, AlertCircle, Award } from 'lucide-react';
import { UserAccount } from '../types';
import { getMockCustomers, updateMockCustomers, mockCertificates, mockGroups } from '../mockData';
import { toast } from 'react-hot-toast';
import UserProfile from './UserProfile';
import { useAuth } from '../context/AuthContext';

interface UserListProps {}

const UserList: React.FC<UserListProps> = () => {
  const { user: currentUser } = useAuth();
  const [customers, setCustomers] = useState(getMockCustomers());
  const allUsers = customers.flatMap(customer => 
    (customer.users || []).map(user => ({
      ...user,
      customerName: customer.name
    }))
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<(UserAccount & { customerName: string }) | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserAccount>>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    status: 'active',
    groupId: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass: string) => {
    const requirements = [
      { test: /.{8,}/, message: 'At least 8 characters' },
      { test: /[A-Z]/, message: 'One uppercase letter' },
      { test: /[a-z]/, message: 'One lowercase letter' },
      { test: /[0-9]/, message: 'One number' },
      { test: /[^A-Za-z0-9]/, message: 'One special character' }
    ];

    return requirements.map(req => ({
      met: req.test.test(pass),
      message: req.message
    }));
  };

  const handleCreateUser = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.every(req => req.met)) {
      toast.error('Password does not meet requirements');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUserAccount: UserAccount = {
        ...newUser as UserAccount,
        id: `u${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      const updatedCustomers = customers.map(customer => {
        if (customer.id === currentUser?.customerId) {
          return {
            ...customer,
            users: [...(customer.users || []), newUserAccount],
            totalUsers: (customer.totalUsers || 0) + 1
          };
        }
        return customer;
      });

      setCustomers(updatedCustomers);
      updateMockCustomers(updatedCustomers);
      setShowCreateUser(false);
      resetNewUserForm();
      toast.success('User account created successfully');
    } catch (error) {
      toast.error('Failed to create user account');
    } finally {
      setLoading(false);
    }
  };

  const resetNewUserForm = () => {
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      status: 'active',
      groupId: ''
    });
    setPassword('');
    setConfirmPassword('');
  };

  const availableGroups = mockGroups.filter(group => group.customerId === currentUser?.customerId);

  const filteredUsers = allUsers.filter(user => {
    const searchMatch = 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockGroups.find(g => g.id === user.groupId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || user.status === statusFilter;
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    const groupMatch = groupFilter === 'all' || user.groupId === groupFilter;

    return searchMatch && statusMatch && roleMatch && groupMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return 'bg-purple-100 text-purple-800';
      case 'customer_admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return 'Platform Admin';
      case 'customer_admin':
        return 'Customer Admin';
      default:
        return 'User';
    }
  };

  const handleDeleteUser = (userId: string) => {
    const updatedCustomers = customers.map(customer => ({
      ...customer,
      users: customer.users?.filter(user => user.id !== userId),
      totalUsers: customer.users?.filter(user => user.id !== userId).length || 0
    }));
    setCustomers(updatedCustomers);
    updateMockCustomers(updatedCustomers);
    toast.success('User deleted successfully');
  };

  const handleUpdateUser = (updatedUser: UserAccount & { customerName: string }) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.name === updatedUser.customerName) {
        return {
          ...customer,
          users: customer.users?.map(user =>
            user.id === updatedUser.id ? { ...updatedUser } : user
          )
        };
      }
      return customer;
    });
    setCustomers(updatedCustomers);
    updateMockCustomers(updatedCustomers);
  };

  const uniqueCustomers = Array.from(new Set(allUsers.map(user => user.customerName)));

  const userCertificates = (userId: string) => {
    return mockCertificates.filter(cert => cert.userId === userId);
  };

  return (
    <div className="bg-white rounded-xl shadow-neumorph p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        </div>
        <button
          onClick={() => setShowCreateUser(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-start">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
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
          </select>
          <select
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="platform_admin">Platform Admin</option>
            <option value="customer_admin">Customer Admin</option>
            <option value="user">User</option>
          </select>
          <select
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="all">All Groups</option>
            {mockGroups.filter(group => group.customerId === currentUser?.customerId).map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* User Cards */}
      <div>
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow-neumorph-sm p-6 hover:shadow-neumorph transition-all duration-200"
            onClick={() => setSelectedUser(user)}
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-xl font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Role */}
            <div className="flex gap-2 mb-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
            </div>

            {/* Organization and Last Login */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 size={16} className="text-primary" />
                <span>{user.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-primary" />
                <span>{mockGroups.find(g => g.id === user.groupId)?.name || 'No group assigned'}</span>
              </div>
              {user.lastLogin && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-primary" />
                  <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                </div>
              )}
              {mockCertificates.filter(cert => cert.userId === user.id).length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <Award size={16} className="text-primary" />
                  <span>{mockCertificates.filter(cert => cert.userId === user.id).length} Certificates</span>
                </div>
              )}
            </div>
          </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Users Found</h3>
            <p className="text-gray-500">Click the "Create User" button to add a new user.</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-neumorph p-6 max-w-xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Create User Account</h3>
              <button
                onClick={() => {
                  setShowCreateUser(false);
                  resetNewUserForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group
                </label>
                <select
                  value={newUser.groupId}
                  onChange={(e) => setNewUser({ ...newUser, groupId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  required
                >
                  <option value="">Select a group</option>
                  {availableGroups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserAccount['role'] })}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  disabled={currentUser?.role !== 'platform_admin'}
                >
                  <option value="user">User</option>
                  {currentUser?.role === 'platform_admin' && (
                    <option value="platform_admin">Platform Admin</option>
                  )}
                </select>
                {currentUser?.role !== 'platform_admin' && (
                  <p className="text-sm text-gray-500 mt-1">Only platform administrators can create platform admin accounts</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  required
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h4>
                <div className="space-y-2">
                  {validatePassword(password).map(({ met, message }) => (
                    <div key={message} className="flex items-center gap-2 text-sm">
                      {met ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <AlertCircle size={16} className="text-gray-400" />
                      )}
                      <span className={met ? 'text-green-500' : 'text-gray-500'}>
                        {message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateUser(false);
                    resetNewUserForm();
                  }}
                  className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus size={20} />
                  )}
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedUser && (
        <UserProfile
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={handleDeleteUser}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default UserList;