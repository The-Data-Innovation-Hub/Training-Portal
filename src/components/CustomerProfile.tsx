import React, { useState } from 'react';
import { Mail, Phone, Globe, Users, BookOpen, Palette, Shield, BarChart3, Save, Trash2, AlertTriangle, X, UserPlus, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { Customer, UserAccount } from '../types';
import { toast } from 'react-hot-toast';

interface CustomerProfileProps {
  customer: Customer;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (customer: Customer) => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, onClose, onDelete, onSave }) => {
  const [formData, setFormData] = useState<Customer>(customer);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(customer.branding?.logo || null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserAccount>>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'customer_admin'
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

      setFormData(prev => ({
        ...prev,
        users: [...(prev.users || []), newUserAccount],
        totalUsers: (prev.totalUsers || 0) + 1
      }));

      setShowCreateUser(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        role: 'customer_admin'
      });
      setPassword('');
      setConfirmPassword('');
      setHasChanges(true);
      toast.success('User account created successfully');
    } catch (error) {
      toast.error('Failed to create user account');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (colorType: 'primary' | 'secondary' | 'tertiary', value: string) => {
    setFormData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        colors: {
          ...prev.branding?.colors,
          [colorType]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setLogoFile(file);
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    try {
      const updatedCustomer = {
        ...formData,
        branding: {
          ...formData.branding,
          logo: formData.branding?.logo
        }
      };
      
      onSave(updatedCustomer);
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save changes');
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(customer.id);
    onClose();
    toast.success('Customer deleted successfully');
  };

  const sections = [
    {
      title: 'Basic Information',
      icon: <Globe className="w-5 h-5 text-primary" />,
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Company Name</label>
            <input
              type="text"
              value={customer.name}
              readOnly
              className="mt-1 w-full p-2 bg-white rounded-lg shadow-neumorph-inset"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <input
              type="email"
              value={customer.email}
              readOnly
              className="mt-1 w-full p-2 bg-white rounded-lg shadow-neumorph-inset"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Subscription</label>
            <input
              type="text"
              value={customer.subscriptionType}
              readOnly
              className="mt-1 w-full p-2 bg-white rounded-lg shadow-neumorph-inset capitalize"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Status</label>
            <input
              type="text"
              value={customer.status}
              readOnly
              className="mt-1 w-full p-2 bg-white rounded-lg shadow-neumorph-inset capitalize"
            />
          </div>
        </div>
      )
    },
    {
      title: 'User Management',
      icon: <Users className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h4 className="font-medium">Total Users</h4>
              <p className="text-2xl font-bold text-primary">{customer.totalUsers}</p>
            </div>
            <button
              onClick={() => setShowCreateUser(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <UserPlus size={20} />
              Create User
            </button>
          </div>

          {showCreateUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-neumorph p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Create User Account</h3>
                  <button
                    onClick={() => setShowCreateUser(false)}
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
                      onClick={() => setShowCreateUser(false)}
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
                        <UserPlus size={20} />
                      )}
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-neumorph-sm p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">License Usage</span>
              <span className="text-sm font-medium">{customer.totalUsers}/200</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2"
                style={{ width: `${(customer.totalUsers / 200) * 100}%` }}
              />
            </div>
          </div>

          {formData.users && formData.users.length > 0 && (
            <div className="bg-white rounded-lg shadow-neumorph-sm p-4">
              <h4 className="font-medium mb-4">User Accounts</h4>
              <div className="space-y-3">
                {formData.users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {user.role === 'customer_admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Course Access',
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Active Courses</h4>
              <p className="text-2xl font-bold text-primary">{customer.activeCourses}</p>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm">
              Manage Courses
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-neumorph-sm p-4">
            <h4 className="font-medium mb-4">Course Completion</h4>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-primary rounded-full h-2"
                  style={{ width: `${customer.completionRate}%` }}
                />
              </div>
              <span className="text-sm text-gray-500">{customer.completionRate}%</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Branding',
      icon: <Palette className="w-5 h-5 text-primary" />,
      content: (<div className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Company Logo</label>
          <div className="flex items-center gap-4">
            {logoPreview ? (
              <div className="relative w-24 h-24">
                <img
                  src={logoPreview}
                  alt="Company logo"
                  className="w-full h-full object-contain rounded-lg shadow-neumorph-sm"
                />
                <button
                  onClick={() => {
                    setLogoPreview(null);
                    setLogoFile(null);
                    setHasChanges(true);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-50 rounded-lg shadow-neumorph-sm flex items-center justify-center">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {formData.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </label>
              <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
            </div>
          </div>
        </div>

        {/* Color Pickers */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Primary Color</label>
            <div className="space-y-2">
              <input
                type="color"
                value={formData.branding?.colors.primary || '#0089ad'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-full h-10 rounded shadow-neumorph-inset"
              />
              <input
                type="text"
                value={formData.branding?.colors.primary || '#0089ad'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-full p-2 bg-white rounded-lg shadow-neumorph-inset text-sm"
                pattern="^#[0-9A-Fa-f]{6}$"
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Secondary Color</label>
            <div className="space-y-2">
              <input
                type="color"
                value={formData.branding?.colors.secondary || '#ffffff'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-full h-10 rounded shadow-neumorph-inset"
              />
              <input
                type="text"
                value={formData.branding?.colors.secondary || '#ffffff'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-full p-2 bg-white rounded-lg shadow-neumorph-inset text-sm"
                pattern="^#[0-9A-Fa-f]{6}$"
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Tertiary Color</label>
            <div className="space-y-2">
              <input
                type="color"
                value={formData.branding?.colors.tertiary || '#ffffff'}
                onChange={(e) => handleColorChange('tertiary', e.target.value)}
                className="w-full h-10 rounded shadow-neumorph-inset"
              />
              <input
                type="text"
                value={formData.branding?.colors.tertiary || '#ffffff'}
                onChange={(e) => handleColorChange('tertiary', e.target.value)}
                className="w-full p-2 bg-white rounded-lg shadow-neumorph-inset text-sm"
                pattern="^#[0-9A-Fa-f]{6}$"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* Color Preview */}
        <div className="bg-white rounded-lg shadow-neumorph-sm p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Color Preview</h4>
          <div className="flex gap-4">
            <div
              className="w-full h-20 rounded-lg"
              style={{ backgroundColor: formData.branding?.colors.primary || '#0089ad' }}
            />
            {formData.branding?.colors.secondary && (
              <div
                className="w-full h-20 rounded-lg"
                style={{ backgroundColor: formData.branding.colors.secondary }}
              />
            )}
            {formData.branding?.colors.tertiary && (
              <div
                className="w-full h-20 rounded-lg"
                style={{ backgroundColor: formData.branding.colors.tertiary }}
              />
            )}
          </div>
        </div>
      )
      </div>)
    },
    {
      title: 'Security & Permissions',
      icon: <Shield className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-neumorph-sm p-4">
            <h4 className="font-medium mb-4">Access Controls</h4>
            <div className="space-y-2">
              {['SSO Integration', 'Two-Factor Authentication', 'IP Restrictions'].map((feature) => (
                <div key={feature} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{feature}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Analytics',
      icon: <BarChart3 className="w-5 h-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Active Users', value: '89%', subtext: 'Last 30 days' },
              { label: 'Course Completion', value: customer.completionRate + '%', subtext: 'Average' },
              { label: 'Engagement Score', value: '8.5', subtext: 'Out of 10' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow-neumorph-sm p-4">
                <h4 className="text-sm text-gray-500">{stat.label}</h4>
                <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-neumorph max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <img src={logoPreview} alt="Company logo" className="w-12 h-12 object-contain rounded-lg" />
              ) : (
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                  {formData.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-800">Customer Profile</h2>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <Trash2 size={20} />
                Delete Customer
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 p-2"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="bg-white rounded-xl shadow-neumorph p-6">
                <div className="flex items-center gap-2 mb-4">
                  {section.icon}
                  <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                </div>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-neumorph p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="text-xl font-bold">Delete Customer</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={20} />
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile