import React, { useState } from 'react';
import { ArrowLeft, Save, Building2, Mail, Phone, Globe, Shield, Users, Palette } from 'lucide-react';
import { Customer } from '../types';

interface CustomerEditorProps {
  customer?: Customer;
  onSave: (data: Partial<Customer>) => void;
  onCancel: () => void;
}

const defaultFormData: Partial<Customer> = {
  name: '',
  email: '',
  phone: '',
  website: '',
  status: 'pending',
  subscriptionType: 'basic',
  totalUsers: 0,
  activeCourses: 0,
  completionRate: 0,
  branding: {
    logo: '',
    colors: {
      primary: '#0089ad',
      secondary: '',
      tertiary: ''
    }
  }
};

const CustomerEditor: React.FC<CustomerEditorProps> = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Customer>>(
    customer ? { ...defaultFormData, ...customer } : defaultFormData
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        colors: {
          ...prev.branding?.colors,
          primary: value
        }
      }
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-neumorph p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {customer ? 'Edit Customer' : 'Create New Customer'}
          </h2>
        </div>
        <button
          onClick={() => onSave(formData)}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow-neumorph-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Save size={20} />
          Save Customer
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Organization Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-800">Organization Details</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  placeholder="Enter organization name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                  placeholder="Enter website URL"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-800">Account Settings</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Type
                </label>
                <select
                  name="subscriptionType"
                  value={formData.subscriptionType}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-neumorph-inset"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-neumorph-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-800">Branding</h3>
            </div>
            
            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-lg shadow-neumorph-sm flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                      {formData.name ? formData.name.slice(0, 2).toUpperCase() : 'TH'}
                    </div>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      Upload Logo
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
                  </div>
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Brand Color
                </label>
                <div className="space-y-2">
                  <input
                    type="color"
                    value={formData.branding?.colors.primary || '#0089ad'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full h-10 rounded shadow-neumorph-inset"
                  />
                  <input
                    type="text"
                    value={formData.branding?.colors.primary || '#0089ad'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg shadow-neumorph-inset text-sm"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerEditor;